import fs from "node:fs";
import path from "node:path";

const targetArg = process.argv.slice(2).find(arg => !arg.startsWith("--"));
if (!targetArg || process.argv.includes("--help")) {
  console.log("Usage: node scripts/scaffold-project.mjs <project-directory>");
  process.exit(targetArg ? 0 : 1);
}

const target = path.resolve(targetArg);
if (fs.existsSync(target) && fs.readdirSync(target).length) {
  throw new Error(`Refusing to scaffold into non-empty directory: ${target}`);
}

for (const directory of ["bindings", "media", "renders", "stills", "sources"]) {
  fs.mkdirSync(path.join(target, directory), { recursive: true });
}

const brief = `# BetterEdit project brief

- Audience:
- Purpose:
- Duration:
- Aspect ratio:
- Platform:
- Narration status:
- User-selected media:
- Factual sources:
- Delivery format: MP4
- Rights/privacy notes:
`;

const plan = {
  schema_version: "1.0",
  title: null,
  duration_s: null,
  aspect_ratio: "16:9",
  audience: null,
  thesis: null,
  beats: [],
  audio_target: { integrated_lufs: -14, true_peak_dbtp_max: -1 },
  approvals: { script: false, style: false, materials: false, final_render: false },
};

fs.writeFileSync(path.join(target, "BRIEF.md"), brief);
fs.writeFileSync(path.join(target, "edit-plan.json"), `${JSON.stringify(plan, null, 2)}\n`);
fs.writeFileSync(path.join(target, ".gitignore"), "media/\nrenders/\nstills/\n*.wav\n*.mp4\n*.mov\n*.mkv\n*.webm\n");
console.log(target);
