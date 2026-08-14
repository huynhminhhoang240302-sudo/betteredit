import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const libraryRoot = path.join(root, "assets", "template-library");
const templatesPath = path.join(libraryRoot, "library", "templates.json");
const manifestPath = path.join(libraryRoot, "previews", "preview-manifest.json");
const browserPath = path.join(libraryRoot, "template-browser.html");
const checks = [];

function check(label, condition, detail, optional = false) {
  checks.push({ label, status: condition ? "PASS" : optional ? "OPTIONAL" : "FAIL", detail });
}

check("Node.js", Number(process.versions.node.split(".")[0]) >= 20, process.version);
check("Template registry", fs.existsSync(templatesPath), templatesPath);
check("Preview manifest", fs.existsSync(manifestPath), manifestPath);
check("Offline browser", fs.existsSync(browserPath), browserPath);

if (fs.existsSync(templatesPath)) {
  const library = JSON.parse(fs.readFileSync(templatesPath, "utf8"));
  check("Template count", library.templates?.length === 240, String(library.templates?.length ?? 0));
  check("Family count", library.families?.length === 32, String(library.families?.length ?? 0));
}

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  check("Preview count", manifest.previews?.length === 240, String(manifest.previews?.length ?? 0));
}

for (const command of ["ffmpeg", "ffprobe"]) {
  const envPath = process.env[command === "ffmpeg" ? "FFMPEG_PATH" : "FFPROBE_PATH"];
  const result = envPath
    ? { status: fs.existsSync(path.resolve(envPath)) ? 0 : 1, detail: envPath }
    : { ...spawnSync(command, ["-version"], { windowsHide: true, encoding: "utf8" }), detail: "PATH" };
  check(command, result.status === 0, result.detail, true);
}

console.table(checks);
console.log(`\nTemplate browser: ${browserPath}`);
console.log("FFmpeg is needed for rendering and deep preview validation, not for browsing or template selection.");
if (checks.some(item => item.status === "FAIL")) process.exit(1);
