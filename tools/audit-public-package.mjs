import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const errors = [];
const warnings = [];
const scanned = [];
const skippedDirectories = new Set([".git", "node_modules", ".next", "dist", "coverage"]);
const ignoredBinaryExtensions = new Set([".mp4", ".webp", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".wav", ".mp3", ".woff", ".woff2", ".ttf", ".otf"]);
const forbiddenBinaryExtensions = new Set([".exe", ".dll", ".dylib", ".so", ".node", ".onnx", ".bin", ".pt", ".pth", ".ckpt", ".safetensors"]);
const forbiddenRootEntries = ["source-analysis", "videos", "work", ".env", ".env.local"];

for (const name of forbiddenRootEntries) {
  if (fs.existsSync(path.join(root, name))) errors.push(`Forbidden public root entry exists: ${name}`);
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) {
      warnings.push(`Review symbolic link before publication: ${path.relative(root, path.join(directory, entry.name))}`);
      continue;
    }
    if (entry.isDirectory()) {
      if (!skippedDirectories.has(entry.name)) walk(path.join(directory, entry.name));
      continue;
    }
    const file = path.join(directory, entry.name);
    const relative = path.relative(root, file).replaceAll("\\", "/");
    const stat = fs.statSync(file);
    if (stat.size > 50 * 1024 * 1024) errors.push(`${relative}: exceeds the 50 MiB public-file gate`);
    const extension = path.extname(entry.name).toLowerCase();
    if (forbiddenBinaryExtensions.has(extension)) errors.push(`${relative}: executable/model binary is not allowed in the public package`);
    if (ignoredBinaryExtensions.has(extension)) continue;
    scanned.push(relative);
    let value;
    try { value = fs.readFileSync(file, "utf8"); }
    catch { errors.push(`${relative}: could not be read for the text audit`); continue; }

    const tests = [
      [/\b[A-Za-z]:[\\/](?:Users|Documents and Settings)[\\/][^\s"'`]+/gi, "private Windows user path"],
      [/\/(?:Users|home)\/[^\s/"'`]+\//g, "private Unix home path"],
      [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g, "private key"],
      [/\bghp_[A-Za-z0-9]{20,}\b/g, "GitHub token"],
      [/\bgithub_pat_[A-Za-z0-9_]{20,}\b/g, "GitHub fine-grained token"],
      [/\bsk-[A-Za-z0-9_-]{20,}\b/g, "API-key-like token"],
      [/(?:OPENAI_API_KEY|GITHUB_TOKEN|AWS_SECRET_ACCESS_KEY)\s*[=:]\s*["']?(?!\[|\{|<|your-|example|redacted)[^\s"']{8,}/gi, "assigned secret"],
    ];
    for (const [pattern, label] of tests) {
      const matches = value.match(pattern);
      if (matches?.length) errors.push(`${relative}: ${label} pattern found (${matches.length})`);
    }

    const emails = value.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) ?? [];
    for (const email of new Set(emails)) {
      if (!/@(?:example\.(?:com|org|net)|users\.noreply\.github\.com)$/i.test(email)) {
        errors.push(`${relative}: review/remove public email address ${email}`);
      }
    }
  }
}

walk(root);

const placeholders = [];
for (const relative of scanned) {
  if (relative === "tools/audit-public-package.mjs") continue;
  const value = fs.readFileSync(path.join(root, relative), "utf8");
  if (value.includes("YOUR_GITHUB_USERNAME")) placeholders.push(relative);
}
if (placeholders.length) warnings.push(`Replace YOUR_GITHUB_USERNAME before publication: ${placeholders.join(", ")}`);
if (!fs.existsSync(path.join(root, ".git"))) warnings.push("No .git directory is present; run a separate history/secret scan after repository initialization.");

const report = {
  status: errors.length ? "FAIL" : "PASS",
  root,
  text_files_scanned: scanned.length,
  errors,
  warnings,
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
