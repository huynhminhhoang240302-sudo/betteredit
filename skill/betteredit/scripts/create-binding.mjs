import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..", "assets", "template-library");
const lib = JSON.parse(fs.readFileSync(path.join(packageRoot, "library", "templates.json"), "utf8"));
const args = process.argv.slice(2);
const templateId = args.find(a=>!a.startsWith("--"));
if (!templateId) throw new Error("Usage: node create-binding.mjs TEMPLATE_ID [--out path.json] [--style style-pack-id]");
const outAt = args.indexOf("--out");
const styleAt = args.indexOf("--style");
const output = outAt >= 0 ? path.resolve(args[outAt+1]) : path.resolve(`binding-${templateId}.json`);
const style = styleAt >= 0 ? args[styleAt+1] : null;
const t = lib.templates.find(x=>x.id===templateId);
if (!t) throw new Error(`Unknown template ID: ${templateId}`);
const binding = {
  schema_version: "1.0",
  binding_id: `${templateId.toLowerCase()}-selection-01`,
  template_id: t.id,
  style_pack_id: style,
  target_duration_s: t.timing.default_s,
  aspect_profile: "landscape_16_9",
  narrative_purpose: t.narrative.job,
  assets: t.slots.map(s=>({
    slot_id:s.id,
    required:s.required,
    accepted_kinds:s.kinds,
    status:s.required ? "WAITING_FOR_USER_MATERIAL" : "optional_unbound",
    path:null,
    focal_anchor:null,
    crop_or_timing_note:null,
    source_text_review:"pending",
    rights_note:null,
  })),
  text:Object.fromEntries(t.text_slots.map(s=>[s.id,null])),
  data_or_source_text:null,
  continuity:{
    entry:{...t.continuity.entry, binding_note:"Replace canonical keys and style-bound values with the selected material's measured/observed state."},
    exit:{...t.continuity.exit, binding_note:"Replace canonical keys and style-bound values with the selected material's measured/observed state."},
  },
  audio:{voice_path:null,music_path:null,sfx_paths:[],cue_note:null,canonical_profile:t.audio.profile,canonical_events:t.audio.events},
  approval:{style_selected_by_user:Boolean(style),materials_selected_by_user:false,first_frame_packet_approved:false},
};
fs.writeFileSync(output, JSON.stringify(binding,null,2)+"\n");
console.log(output);
