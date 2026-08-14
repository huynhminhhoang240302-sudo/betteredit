import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { once } from "node:events";
import { WIDTH, HEIGHT, posterProgress, renderSvgFrame } from "./preview-visuals.mjs";

const require = createRequire(import.meta.url);
const root = process.cwd();
const packageRoot = root;
const previewsRoot = path.join(packageRoot, "previews");
const ffmpeg = process.env.FFMPEG_PATH || (() => {
  try { return require("ffmpeg-static"); } catch { return "ffmpeg"; }
})();
const libraryPath = path.join(packageRoot, "library", "templates.json");
const FPS = 30;

function loadSharp() {
  const candidates = [
    "sharp",
    process.env.BETTEREDIT_NODE_MODULES ? path.join(process.env.BETTEREDIT_NODE_MODULES, "sharp") : null,
  ].filter(Boolean);
  for (const candidate of candidates) {
    try { return require(candidate); } catch {}
  }
  throw new Error("Sharp is unavailable. Run `npm install` or set BETTEREDIT_NODE_MODULES.");
}
const sharp = loadSharp();

const argv = process.argv.slice(2);
const valueAfter = flag => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : null;
};
const force = argv.includes("--force");
const concurrency = Math.max(1, Math.min(8, Number(valueAfter("--concurrency") || 3)));
const idArg = valueAfter("--ids");
const groupArg = valueAfter("--groups");
const limit = Number(valueAfter("--limit") || 0);
const ids = idArg ? new Set(idArg.split(",").map(v => v.trim()).filter(Boolean)) : null;
const groups = groupArg ? new Set(groupArg.split(",").map(v => v.trim().toUpperCase()).filter(Boolean)) : null;

if (path.isAbsolute(ffmpeg) && !fs.existsSync(ffmpeg)) throw new Error(`FFmpeg not found: ${ffmpeg}`);
if (!fs.existsSync(libraryPath)) throw new Error(`Template library not found: ${libraryPath}`);

const library = JSON.parse(fs.readFileSync(libraryPath, "utf8"));
let templates = library.templates.filter(t => (!ids || ids.has(t.id)) && (!groups || groups.has(t.group_code)));
if (limit > 0) templates = templates.slice(0, limit);
if (!templates.length) throw new Error("No templates matched the requested render selection.");

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hashFile = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const seedFor = text => [...text].reduce((n, c) => (n * 131 + c.charCodeAt(0)) >>> 0, 2166136261);

function writeAscii(buffer, offset, value) { buffer.write(value, offset, "ascii"); }
function wavBuffer(spec, duration) {
  const sampleRate = 48000;
  const channels = 2;
  const sampleCount = Math.ceil(duration * sampleRate);
  const dataBytes = sampleCount * channels * 2;
  const out = Buffer.allocUnsafe(44 + dataBytes);
  writeAscii(out, 0, "RIFF"); out.writeUInt32LE(36 + dataBytes, 4);
  writeAscii(out, 8, "WAVE"); writeAscii(out, 12, "fmt "); out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20); out.writeUInt16LE(channels, 22); out.writeUInt32LE(sampleRate, 24);
  out.writeUInt32LE(sampleRate * channels * 2, 28); out.writeUInt16LE(channels * 2, 32); out.writeUInt16LE(16, 34);
  writeAscii(out, 36, "data"); out.writeUInt32LE(dataBytes, 40);

  const seed = seedFor(spec.id);
  const groupIndex = ["HK","ST","EV","FO","SP","EX","AR","BR","PY"].indexOf(spec.group_code);
  const baseFrequency = 58 + Math.max(0, groupIndex) * 7;
  const events = (spec.audio?.events || []).map((event, index) => ({
    ...event,
    index,
    time: clamp(Number(event.at || 0), 0, 1) * duration,
  }));
  const stopEvent = events.find(e => e.type === "music_stop");
  const hushEnd = events.find(e => e.type === "hush_hold_end");
  const pictureEvent = events.find(e => /picture|visual/.test(e.type));

  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleRate;
    const fade = Math.min(1, t / 0.06, (duration - t) / 0.08);
    let bed = 0.010 * Math.sin(2 * Math.PI * baseFrequency * t)
      + 0.006 * Math.sin(2 * Math.PI * (baseFrequency * 1.503) * t + 0.4);
    if (spec.audio?.profile === "voice_only") bed *= 0.18;
    if (spec.audio?.profile === "intentional_music_stop" && stopEvent && t >= stopEvent.time && (!hushEnd || t <= hushEnd.time)) bed = 0;
    if (spec.audio?.profile === "j_cut_voice_or_ambience" && pictureEvent && t < pictureEvent.time) bed *= 2.2;
    if (spec.audio?.profile === "l_cut_voice_or_ambience" && pictureEvent && t > pictureEvent.time) bed *= 1.8;
    let transient = 0;
    for (const event of events) {
      const dt = t - event.time;
      if (dt < 0 || dt > 0.36) continue;
      const semantic = /hit|trigger|result|transmission|pickup|stop|payoff|sound/.test(event.type);
      if (semantic) {
        const frequency = 180 + event.index * 83 + (seed % 71);
        transient += 0.12 * Math.exp(-dt * 19) * Math.sin(2 * Math.PI * (frequency + 120 * dt) * dt);
        const noise = (Math.sin((i + seed + event.index * 97) * 12.9898) * 43758.5453) % 1;
        transient += 0.022 * Math.exp(-dt * 34) * noise;
      }
      if (/riser|incoming_audio|destination_ambience/.test(event.type)) {
        transient += 0.025 * Math.min(1, dt * 8) * Math.sin(2 * Math.PI * (110 + 280 * dt) * dt);
      }
    }
    if (spec.family_id === "BR04") {
      const cut = (pictureEvent?.time ?? duration * 0.52);
      const before = t < cut ? 1 : 0;
      const after = 1 - before;
      bed += 0.018 * before * Math.sin(2 * Math.PI * 128 * t) + 0.018 * after * Math.sin(2 * Math.PI * 196 * t);
    }
    const mono = clamp((bed + transient) * Math.max(0, fade), -0.82, 0.82);
    const pan = spec.family_id === "BR04" ? Math.sin((t / Math.max(duration, 0.001)) * Math.PI - Math.PI / 2) * 0.22 : 0;
    const left = clamp(mono * (1 - pan), -1, 1);
    const right = clamp(mono * (1 + pan), -1, 1);
    out.writeInt16LE(Math.round(left * 32767), 44 + i * 4);
    out.writeInt16LE(Math.round(right * 32767), 46 + i * 4);
  }
  return out;
}

async function svgToRaw(svg) {
  const { data, info } = await sharp(Buffer.from(svg))
    .resize(WIDTH, HEIGHT, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.width !== WIDTH || info.height !== HEIGHT || info.channels !== 4) {
    throw new Error(`Unexpected raster shape ${info.width}x${info.height}x${info.channels}`);
  }
  return data;
}

async function renderOne(spec) {
  const frameCount = Math.max(2, Math.round(spec.timing.default_s * FPS));
  const duration = frameCount / FPS;
  const groupDir = spec.group_code;
  const videoDir = path.join(previewsRoot, "videos", groupDir);
  const posterDir = path.join(previewsRoot, "posters", groupDir);
  fs.mkdirSync(videoDir, { recursive: true });
  fs.mkdirSync(posterDir, { recursive: true });
  const videoPath = path.join(videoDir, `${spec.id}.mp4`);
  const posterPath = path.join(posterDir, `${spec.id}.webp`);

  if (force || !fs.existsSync(videoPath) || fs.statSync(videoPath).size < 1024) {
    const args = [
      "-hide_banner", "-loglevel", "error", "-y",
      "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${WIDTH}x${HEIGHT}`, "-r", String(FPS), "-i", "pipe:0",
      "-f", "wav", "-i", "pipe:3",
      "-map", "0:v:0", "-map", "1:a:0", "-frames:v", String(frameCount), "-shortest",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-profile:v", "high", "-level", "3.1",
      "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
      "-c:a", "aac", "-b:a", "96k", "-ar", "48000", "-ac", "2",
      "-movflags", "+faststart", "-metadata", `comment=Generic procedural choreography preview for ${spec.id}`,
      videoPath,
    ];
    const child = spawn(ffmpeg, args, { stdio: ["pipe", "ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", chunk => { stderr += chunk; });
    child.stdio[3].end(wavBuffer(spec, duration));
    try {
      for (let frame = 0; frame < frameCount; frame++) {
        const progress = frameCount === 1 ? 1 : frame / (frameCount - 1);
        const raw = await svgToRaw(renderSvgFrame(spec, progress));
        if (!child.stdin.write(raw)) await once(child.stdin, "drain");
      }
      child.stdin.end();
    } catch (error) {
      child.stdin.destroy();
      child.kill();
      throw error;
    }
    const [code] = await once(child, "close");
    if (code !== 0) throw new Error(`${spec.id}: FFmpeg exited ${code}: ${stderr.trim()}`);
  }

  const posterP = clamp(posterProgress(spec), 0.1, 0.96);
  if (force || !fs.existsSync(posterPath) || fs.statSync(posterPath).size < 512) {
    await sharp(Buffer.from(renderSvgFrame(spec, posterP)))
      .resize(WIDTH, HEIGHT, { fit: "fill" })
      .webp({ quality: 84, effort: 4 })
      .toFile(posterPath);
  }

  return {
    id: spec.id,
    family_id: spec.family_id,
    group_code: spec.group_code,
    status: "ready",
    video: path.relative(packageRoot, videoPath).replaceAll("\\", "/"),
    poster: path.relative(packageRoot, posterPath).replaceAll("\\", "/"),
    duration_s: Number(duration.toFixed(6)),
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    has_audio: true,
    size_bytes: fs.statSync(videoPath).size,
    sha256: hashFile(videoPath),
    poster_size_bytes: fs.statSync(posterPath).size,
    poster_sha256: hashFile(posterPath),
    poster_time_s: Number((posterP * duration).toFixed(6)),
    spatial_mode: spec.spatial_composition.mode,
    settle_mode: spec.spatial_composition.settle_mode,
    text_projection: spec.spatial_composition.text_projection,
    provenance: "procedural_svg_choreography_v2_spatial",
  };
}

async function pool(items, workerCount, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function lane() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      const started = Date.now();
      results[index] = await worker(items[index]);
      const elapsed = ((Date.now() - started) / 1000).toFixed(1);
      process.stdout.write(`[${index + 1}/${items.length}] ${items[index].id} ${elapsed}s\n`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(workerCount, items.length) }, lane));
  return results;
}

fs.mkdirSync(previewsRoot, { recursive: true });
const startedAt = new Date().toISOString();
const records = await pool(templates, concurrency, renderOne);

if (templates.length === library.templates.length) {
  records.sort((a, b) => a.id.localeCompare(b.id));
  const manifest = {
    schema_version: "1.0",
    generated_at: new Date().toISOString(),
    preview_kind: "generic_procedural_choreography_demonstration",
    width: WIDTH,
    height: HEIGHT,
    fps: FPS,
    has_audio: true,
    previews: records,
  };
  fs.writeFileSync(path.join(previewsRoot, "preview-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  const jsMeta = { ...manifest };
  delete jsMeta.previews;
  fs.writeFileSync(
    path.join(previewsRoot, "preview-manifest.js"),
    `window.__templatePreviewMeta=${JSON.stringify(jsMeta)};window.__templatePreviews=${JSON.stringify(records)};\n`,
  );
}

console.log(JSON.stringify({
  status: "PASS",
  started_at: startedAt,
  completed_at: new Date().toISOString(),
  rendered: records.length,
  total_bytes: records.reduce((n, r) => n + r.size_bytes, 0),
  manifest_written: templates.length === library.templates.length,
  output: previewsRoot,
}, null, 2));
