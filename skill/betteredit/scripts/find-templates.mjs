import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..", "assets", "template-library");
const lib = JSON.parse(fs.readFileSync(path.join(packageRoot, "library", "templates.json"), "utf8"));
const args = process.argv.slice(2);
const opts = {};
for (let i=0;i<args.length;i++) {
  const token=args[i];
  if (!token.startsWith("--")) continue;
  const key=token.slice(2);
  opts[key] = args[i+1] && !args[i+1].startsWith("--") ? args[++i] : true;
}
if (opts.help) {
  console.log(`Usage: node find-templates.mjs [filters]\n\n--family HK02\n--group evidence\n--job context\n--band beat\n--effort enhanced\n--spatial corridor\n--asset video\n--max-duration 4\n--text causal\n--after EX01-03\n--limit 12\n--json\n`);
  process.exit(0);
}
const q = String(opts.text || "").toLowerCase();
let rows = lib.templates.filter(t => {
  if (opts.family && !t.family_id.toLowerCase().startsWith(String(opts.family).toLowerCase())) return false;
  if (opts.group && !`${t.group_code} ${t.group}`.toLowerCase().includes(String(opts.group).toLowerCase())) return false;
  if (opts.job) {
    const needle = String(opts.job).toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");
    const haystack = [t.narrative.job_key, t.narrative.job, ...t.narrative.selection_tags].join(" ").toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");
    if (!haystack.includes(needle)) return false;
  }
  if (opts.band && t.timing.band !== opts.band) return false;
  if (opts.effort && t.quality.effort_tier !== opts.effort) return false;
  if (opts.spatial && t.spatial_composition?.mode !== opts.spatial) return false;
  if (opts.asset && !t.slots.some(s=>s.kinds.includes(String(opts.asset)))) return false;
  if (opts["max-duration"] && t.timing.default_s > Number(opts["max-duration"])) return false;
  if (q && !JSON.stringify({id:t.id,name:t.name,job:t.narrative.job,signature:t.narrative.signature,tags:t.narrative.selection_tags}).toLowerCase().includes(q)) return false;
  return true;
});

function distance(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1]);}
if (opts.after) {
  const prior = lib.templates.find(t=>t.id===opts.after);
  if (!prior) throw new Error(`Unknown --after template: ${opts.after}`);
  for (const t of rows) {
    const exit=prior.continuity.exit, entry=t.continuity.entry;
    let score = 25 * (1 - Math.min(1, distance(exit.focal_anchor,entry.focal_anchor)/0.70));
    const scaleOrder=["detail","close","medium","wide","aerial"];
    const scaleDelta=Math.abs(scaleOrder.indexOf(exit.subject_scale_band)-scaleOrder.indexOf(entry.subject_scale_band));
    score += scaleDelta===0 ? 15 : scaleDelta===1 ? 10 : 3;
    const pv=prior.continuity.exit.motion_vector, tv=t.continuity.entry.motion_vector;
    const plen=Math.hypot(pv[0],pv[1]), tlen=Math.hypot(tv[0],tv[1]);
    if (plen===0 && tlen===0) score += 12;
    else if (plen>0 && tlen>0) score += 15 * Math.max(0,(1+(pv[0]*tv[0]+pv[1]*tv[1])/(plen*tlen))/2);
    else score += 7;
    if (exit.orientation_key && exit.orientation_key===entry.orientation_key) score += 8; else score += 3;
    if (exit.object_persistence_key && exit.object_persistence_key===entry.object_persistence_key) score += 7; else if (prior.continuity.profile===t.continuity.profile) score += 4;
    if (exit.luma_band!=="style_bound" && entry.luma_band!=="style_bound") score += exit.luma_band===entry.luma_band ? 10 : 2; else score += 5;
    if (exit.audio_tail_role===entry.audio_tail_role) score += 15;
    else if ([exit.audio_tail_role,entry.audio_tail_role].every(x=>["voice","ambience","voice_or_ambience"].includes(x))) score += 12;
    else score += 5;
    const groupOrder=["HK","ST","EV","FO","SP","EX","AR","BR","PY"];
    const forward=groupOrder.indexOf(t.group_code)>=groupOrder.indexOf(prior.group_code);
    if (t.group_code==="PY" || prior.continuity.preferred_next_tags.some(tag=>t.narrative.selection_tags.includes(tag)) || forward) score += 5;
    t.__chain_score=Math.max(0,Math.min(100,Math.round(score)));
  }
  rows.sort((a,b)=>b.__chain_score-a.__chain_score || a.id.localeCompare(b.id));
} else rows.sort((a,b)=>a.id.localeCompare(b.id));
rows = rows.slice(0, Number(opts.limit || 20));

if (opts.json) console.log(JSON.stringify(rows, null, 2));
else console.table(rows.map(t=>({
  ID:t.id,
  Name:t.name,
  Band:t.timing.band,
  Seconds:t.timing.default_s,
  Effort:t.quality.effort_tier,
  Chain: t.__chain_score ?? "",
  Required:t.slots.filter(s=>s.required).map(s=>s.id).join(" + "),
  Signature:t.narrative.signature,
})));
