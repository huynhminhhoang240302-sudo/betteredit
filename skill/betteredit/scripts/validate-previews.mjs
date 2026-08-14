import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { schemaErrors } from "./schema-subset.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..", "assets", "template-library");
const args = process.argv.slice(2);

function usage(exitCode = 0) {
  console.log(
    "Usage: node tools/validate-previews.mjs [previews/preview-manifest.json] [--sample N]\n" +
    "Without --sample, every one of the 240 MP4s and posters is hashed, probed, decoded, and checked for real frame-to-frame motion."
  );
  process.exit(exitCode);
}

if (args.includes("--help") || args.includes("-h")) usage(0);

const sampleAt = args.indexOf("--sample");
let sampleCount = null;
if (sampleAt >= 0) {
  sampleCount = Number(args[sampleAt + 1]);
  if (!Number.isInteger(sampleCount) || sampleCount < 1) {
    console.error("--sample must be a positive integer.");
    usage(1);
  }
}

const positional = args.filter((arg, index) => {
  if (arg === "--sample" || index === sampleAt + 1) return false;
  return !arg.startsWith("--");
});
if (positional.length > 1) usage(1);

const manifestPath = path.resolve(
  positional[0] ?? path.join(packageRoot, "previews", "preview-manifest.json")
);
const schemaPath = path.join(packageRoot, "schema", "preview-manifest.schema.json");
const templatesPath = path.join(packageRoot, "library", "templates.json");
const errors = [];
const warnings = [];
const fail = message => errors.push(message);

function readJson(file, label) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`${label}: ${error.message}`);
    return null;
  }
}

function findBundledBinary(kind) {
  const envName = kind === "ffmpeg" ? "FFMPEG_PATH" : "FFPROBE_PATH";
  const suffix = kind === "ffmpeg"
    ? ["node_modules", "ffmpeg-static", "ffmpeg.exe"]
    : ["node_modules", "ffprobe-static", "bin", "win32", "x64", "ffprobe.exe"];
  const candidates = [];
  if (process.env[envName]) candidates.push(path.resolve(process.env[envName]));
  let cursor = packageRoot;
  while (true) {
    candidates.push(path.join(cursor, "work", "video-tools", ...suffix));
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  return candidates.find(candidate => fs.existsSync(candidate)) ?? kind;
}

function normalizedPathKey(value) {
  return String(value).replaceAll("\\", "/").replace(/^\.\//, "").toLowerCase();
}

function resolveMediaPath(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  if (path.isAbsolute(value)) return path.normalize(value);
  const fromPackage = path.resolve(packageRoot, value);
  const fromManifest = path.resolve(path.dirname(manifestPath), value);
  if (fs.existsSync(fromPackage)) return fromPackage;
  if (fs.existsSync(fromManifest)) return fromManifest;
  return fromPackage;
}

function parseRate(value) {
  if (typeof value !== "string") return NaN;
  const [numerator, denominator = "1"] = value.split("/").map(Number);
  return denominator ? numerator / denominator : NaN;
}

function run(binary, commandArgs, timeoutMs = 30_000) {
  return new Promise(resolve => {
    const child = spawn(binary, commandArgs, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const stdout = [];
    const stderr = [];
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);
    child.stdout.on("data", chunk => stdout.push(chunk));
    child.stderr.on("data", chunk => stderr.push(chunk));
    child.on("error", error => {
      clearTimeout(timer);
      resolve({ code: null, stdout: "", stderr: error.message, timedOut });
    });
    child.on("close", code => {
      clearTimeout(timer);
      resolve({
        code,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
        timedOut,
      });
    });
  });
}

function sha256(file) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(file);
    stream.on("error", reject);
    stream.on("data", chunk => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

async function inspectRecord(record, template, ffprobe, ffmpeg) {
  const prefix = record?.id ?? "<missing-id>";
  const videoPath = resolveMediaPath(record?.video);
  const posterPath = resolveMediaPath(record?.poster);
  if (!videoPath || !fs.existsSync(videoPath)) {
    fail(`${prefix}: video does not exist: ${record?.video}`);
    return;
  }
  if (!posterPath || !fs.existsSync(posterPath)) {
    fail(`${prefix}: poster does not exist: ${record?.poster}`);
  }

  const videoStat = await fsp.stat(videoPath);
  if (!videoStat.isFile()) fail(`${prefix}: video path is not a file`);
  else {
    if (videoStat.size !== record.size_bytes) {
      fail(`${prefix}: size_bytes ${record.size_bytes} does not match file size ${videoStat.size}`);
    }
    const actualHash = await sha256(videoPath);
    if (actualHash !== String(record.sha256).toLowerCase()) {
      fail(`${prefix}: video sha256 mismatch`);
    }
  }

  if (posterPath && fs.existsSync(posterPath)) {
    const posterStat = await fsp.stat(posterPath);
    if (!posterStat.isFile()) fail(`${prefix}: poster path is not a file`);
    else {
      if (posterStat.size !== record.poster_size_bytes) {
        fail(`${prefix}: poster_size_bytes ${record.poster_size_bytes} does not match file size ${posterStat.size}`);
      }
      const actualPosterHash = await sha256(posterPath);
      if (actualPosterHash !== String(record.poster_sha256).toLowerCase()) {
        fail(`${prefix}: poster sha256 mismatch`);
      }
    }
  }

  const probe = await run(ffprobe, [
    "-v", "error",
    "-show_entries",
    "format=duration:stream=index,codec_type,codec_name,width,height,pix_fmt,r_frame_rate,avg_frame_rate,sample_rate,channels",
    "-of", "json",
    videoPath,
  ]);
  if (probe.code !== 0) {
    fail(`${prefix}: ffprobe failed${probe.timedOut ? " (timeout)" : ""}: ${probe.stderr.trim()}`);
    return;
  }

  let metadata;
  try {
    metadata = JSON.parse(probe.stdout);
  } catch (error) {
    fail(`${prefix}: invalid ffprobe JSON: ${error.message}`);
    return;
  }
  const videoStreams = (metadata.streams ?? []).filter(stream => stream.codec_type === "video");
  const audioStreams = (metadata.streams ?? []).filter(stream => stream.codec_type === "audio");
  if (videoStreams.length !== 1) {
    fail(`${prefix}: expected exactly one video stream, found ${videoStreams.length}`);
  }
  const video = videoStreams[0];
  if (video) {
    if (video.codec_name !== "h264") fail(`${prefix}: video codec must be H.264, found ${video.codec_name}`);
    if (video.pix_fmt !== "yuv420p") fail(`${prefix}: pixel format must be yuv420p, found ${video.pix_fmt}`);
    if (video.width !== record.width || video.height !== record.height) {
      fail(`${prefix}: probed dimensions ${video.width}x${video.height} do not match record ${record.width}x${record.height}`);
    }
    const probedFps = parseRate(video.avg_frame_rate) || parseRate(video.r_frame_rate);
    if (!Number.isFinite(probedFps) || Math.abs(probedFps - record.fps) > 0.001) {
      fail(`${prefix}: probed fps ${probedFps} does not match ${record.fps}`);
    }
  }

  if (record.has_audio) {
    if (audioStreams.length !== 1) {
      fail(`${prefix}: has_audio=true requires exactly one audio stream, found ${audioStreams.length}`);
    }
    const audio = audioStreams[0];
    if (audio) {
      if (audio.codec_name !== "aac") fail(`${prefix}: audio codec must be AAC, found ${audio.codec_name}`);
      if (Number(audio.sample_rate) !== 48_000) fail(`${prefix}: audio sample rate must be 48000 Hz, found ${audio.sample_rate}`);
      if (audio.channels !== 2) fail(`${prefix}: audio must be stereo, found ${audio.channels} channels`);
    }
  } else if (audioStreams.length !== 0) {
    fail(`${prefix}: has_audio=false but ${audioStreams.length} audio stream(s) exist`);
  }

  const duration = Number(metadata.format?.duration);
  const frameTolerance = 1 / record.fps;
  if (!Number.isFinite(duration) || duration <= 0) {
    fail(`${prefix}: ffprobe returned invalid duration ${metadata.format?.duration}`);
  } else {
    if (Math.abs(duration - record.duration_s) > frameTolerance + 0.001) {
      fail(`${prefix}: manifest duration ${record.duration_s}s differs from probed ${duration}s by more than one frame`);
    }
    if (duration < template.timing.min_s - frameTolerance - 0.001 ||
        duration > template.timing.max_s + frameTolerance + 0.001) {
      fail(
        `${prefix}: duration ${duration}s is outside template bounds ` +
        `${template.timing.min_s}-${template.timing.max_s}s (one-frame tolerance)`
      );
    }
    if (record.poster_time_s > duration + frameTolerance) {
      fail(`${prefix}: poster_time_s ${record.poster_time_s} is beyond video duration ${duration}`);
    }
  }

  const decode = await run(ffmpeg, [
    "-nostdin", "-v", "error", "-xerror",
    "-i", videoPath,
    "-map", "0:v:0",
    "-frames:v", "1",
    "-an", "-f", "null", "-",
  ]);
  if (decode.code !== 0) {
    fail(`${prefix}: one-frame decode failed${decode.timedOut ? " (timeout)" : ""}: ${decode.stderr.trim()}`);
  }

  const motion = await run(ffmpeg, [
    "-nostdin", "-v", "error", "-xerror",
    "-i", videoPath,
    "-map", "0:v:0",
    "-vf", "fps=6,scale=96:54:flags=area,format=gray",
    "-an", "-f", "framemd5", "-",
  ]);
  if (motion.code !== 0) {
    fail(`${prefix}: motion decode failed${motion.timedOut ? " (timeout)" : ""}: ${motion.stderr.trim()}`);
  } else {
    const frameHashes = motion.stdout
      .split(/\r?\n/)
      .filter(line => line && !line.startsWith("#") && line.includes(","))
      .map(line => line.slice(line.lastIndexOf(",") + 1).trim())
      .filter(Boolean);
    const uniqueFrames = new Set(frameHashes).size;
    const minimumUnique = duration >= 1 ? 3 : 2;
    if (frameHashes.length < minimumUnique || uniqueFrames < minimumUnique) {
      fail(
        `${prefix}: preview is effectively static at the 6 fps motion audit ` +
        `(${uniqueFrames} unique frame${uniqueFrames === 1 ? "" : "s"} across ${frameHashes.length} samples)`
      );
    }
  }
}

const manifest = readJson(manifestPath, "preview manifest");
const schema = readJson(schemaPath, "preview schema");
const library = readJson(templatesPath, "template library");

if (manifest && schema) {
  for (const issue of schemaErrors(manifest, schema)) fail(`schema: ${issue}`);
  if (Number.isNaN(Date.parse(manifest.generated_at))) fail("generated_at must be an ISO-compatible timestamp");
}

const templates = library?.templates ?? [];
const previews = manifest?.previews ?? [];
const expectedProvenance = "procedural_svg_choreography_v2_spatial";
if (templates.length !== 240) fail(`canonical template library must contain 240 records; found ${templates.length}`);
if (previews.length !== templates.length) {
  fail(`manifest must contain exactly ${templates.length} preview records; found ${previews.length}`);
}

const templateById = new Map(templates.map(template => [template.id, template]));
const previewById = new Map();
const seenPaths = new Map();
for (const [index, preview] of previews.entries()) {
  const prefix = preview?.id ?? `previews[${index}]`;
  if (previewById.has(preview?.id)) fail(`${prefix}: duplicate preview id`);
  else previewById.set(preview?.id, preview);
  const template = templateById.get(preview?.id);
  if (!template) {
    fail(`${prefix}: id does not exist in templates.json`);
  } else {
    if (preview.family_id !== template.family_id) {
      fail(`${prefix}: family_id ${preview.family_id} does not match ${template.family_id}`);
    }
    if (preview.group_code !== template.group_code) {
      fail(`${prefix}: group_code ${preview.group_code} does not match ${template.group_code}`);
    }
    if (preview.spatial_mode !== template.spatial_composition?.mode) {
      fail(
        `${prefix}: spatial_mode ${preview.spatial_mode} does not match template ` +
        `${template.spatial_composition?.mode}`
      );
    }
    if (preview.settle_mode !== template.spatial_composition?.settle_mode) {
      fail(
        `${prefix}: settle_mode ${preview.settle_mode} does not match template ` +
        `${template.spatial_composition?.settle_mode}`
      );
    }
    if (preview.text_projection !== template.spatial_composition?.text_projection) {
      fail(
        `${prefix}: text_projection ${preview.text_projection} does not match template ` +
        `${template.spatial_composition?.text_projection}`
      );
    }
  }
  if (preview.provenance !== expectedProvenance) {
    fail(`${prefix}: provenance must be ${expectedProvenance}`);
  }
  if (preview.width !== manifest?.width || preview.height !== manifest?.height || preview.fps !== manifest?.fps) {
    fail(`${prefix}: record dimensions/fps must match manifest defaults`);
  }
  for (const field of ["video", "poster"]) {
    const key = normalizedPathKey(preview?.[field]);
    if (!key) continue;
    if (seenPaths.has(key)) {
      fail(`${prefix}: ${field} path duplicates ${seenPaths.get(key)}`);
    } else {
      seenPaths.set(key, `${prefix}.${field}`);
    }
  }
}
for (const template of templates) {
  if (!previewById.has(template.id)) fail(`${template.id}: canonical template has no preview record`);
}

const ffprobe = findBundledBinary("ffprobe");
const ffmpeg = findBundledBinary("ffmpeg");
if (!ffprobe) fail("ffprobe was not found; set FFPROBE_PATH or add ffprobe to PATH");
if (!ffmpeg) fail("ffmpeg was not found; set FFMPEG_PATH or add ffmpeg to PATH");

const selected = sampleCount === null ? previews : previews.slice(0, Math.min(sampleCount, previews.length));
if (sampleCount !== null && sampleCount > previews.length) {
  warnings.push(`--sample ${sampleCount} exceeds manifest size; validating all ${previews.length} records`);
}

if (ffprobe && ffmpeg) {
  let cursor = 0;
  const concurrency = Math.min(6, selected.length || 1);
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < selected.length) {
      const index = cursor++;
      const record = selected[index];
      const template = templateById.get(record?.id);
      if (!record || !template) continue;
      try {
        await inspectRecord(record, template, ffprobe, ffmpeg);
      } catch (error) {
        fail(`${record.id}: unexpected validation failure: ${error.message}`);
      }
    }
  }));
}

const report = {
  status: errors.length ? "FAIL" : "PASS",
  manifest: manifestPath,
  canonical_templates: templates.length,
  manifest_records: previews.length,
  media_records_checked: selected.length,
  sample_mode: sampleCount !== null,
  ffprobe,
  ffmpeg,
  errors,
  warnings,
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
