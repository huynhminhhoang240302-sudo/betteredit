import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { schemaErrors } from "./schema-subset.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const args = process.argv.slice(2);
const inputArg = args.find(a=>!a.startsWith("--"));
const typeAt = args.indexOf("--type");
const requestedType = typeAt >= 0 ? args[typeAt+1] : null;
if (!inputArg || args.includes("--help")) {
  console.log("Usage: node validate-manifest.mjs <manifest.json> [--type style|binding]");
  process.exit(inputArg ? 0 : 1);
}

const inputPath = path.resolve(inputArg);
const value = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const type = requestedType || (value.template_id ? "binding" : "style");
const errors = [];
const warnings = [];
const fail = message => errors.push(message);
const warn = message => warnings.push(message);
const nonEmpty = value => typeof value === "string" && value.trim().length > 0;
const fileExists = value => nonEmpty(value) && fs.existsSync(path.resolve(value));

const forbiddenFontTokens = [
  "arial", "avenir", "barlow", "calibri", "futura", "gotham", "helvetica", "inter",
  "lato", "montserrat", "monospace", "noto sans", "open sans", "roboto", "sans-serif",
  "segoe ui", "source sans", "system-ui", "tahoma", "ui-sans-serif", "verdana",
];
const hasForbiddenFont = name => forbiddenFontTokens.some(token=>String(name ?? "").trim().toLowerCase()===token);
const lockShape = {
  serif_only: true,
  decorative_top_bottom_notes: false,
  diagonal_or_crossing_line_fields: false,
  pseudo_wayfinding_counters: false,
  small_accent_kicker_with_detached_rule: false,
};

const schemaName = type === "style" ? "style-pack.schema.json" : type === "binding" ? "asset-binding.schema.json" : null;
if (schemaName) {
  const schema = JSON.parse(fs.readFileSync(path.join(packageRoot,"schema",schemaName),"utf8"));
  for (const issue of schemaErrors(value,schema)) fail(`schema: ${issue}`);
}

function validateStyle(style) {
  if (style.schema_version !== "1.0") fail("schema_version must be 1.0");
  if (!nonEmpty(style.id)) fail("style id is required");
  if (!["awaiting_user_selection","draft","user_approved","deprecated"].includes(style.status)) fail("style status is invalid");
  const typography = style.typography ?? {};
  const roles = ["display_serif","text_serif","caption_serif","tabular_serif"];
  const families = new Set();
  for (const role of roles) {
    const font = typography[role];
    if (!font) { fail(`${role} is missing`); continue; }
    if (font.classification !== "serif") fail(`${role}: classification must be serif`);
    if (font.family != null) {
      if (!nonEmpty(font.family)) fail(`${role}: family must be non-empty or null while awaiting selection`);
      if (hasForbiddenFont(font.family)) fail(`${role}: '${font.family}' is a known non-serif family`);
      families.add(String(font.family).trim().toLowerCase());
    }
    if (!Array.isArray(font.fallback) || !font.fallback.includes("serif")) fail(`${role}: fallback must end in/include generic serif`);
    for (const fallback of font.fallback ?? []) if (hasForbiddenFont(fallback)) fail(`${role}: fallback '${fallback}' is disallowed`);
    if (!Array.isArray(font.file_paths)) fail(`${role}: file_paths must be an array`);
    if (style.status === "user_approved") {
      if (!nonEmpty(font.family)) fail(`${role}: approved style requires a named family`);
      if (!font.file_paths?.length) fail(`${role}: approved style requires at least one font file`);
      for (const fontPath of font.file_paths ?? []) if (!fileExists(fontPath)) fail(`${role}: font file does not exist: ${fontPath}`);
      if (!nonEmpty(font.license)) fail(`${role}: approved style requires a license note`);
    } else {
      for (const fontPath of font.file_paths ?? []) if (!fileExists(fontPath)) warn(`${role}: unverified draft font path: ${fontPath}`);
    }
  }
  if (families.size > 2) fail(`At most two distinct serif families are allowed; found ${families.size}`);
  if (typography.max_families !== 2) fail("typography.max_families must be 2");
  if (style.status === "user_approved") {
    if (typography.font_files_verified !== true) fail("Approved style requires font_files_verified: true");
    if (!fileExists(typography.font_specimen_path)) fail("Approved style requires an existing captured font_specimen_path");
  }
  for (const [key, expected] of Object.entries(lockShape)) if (style.hard_constraints?.[key] !== expected) fail(`hard_constraints.${key} must be ${expected}`);
}

function validateBinding(binding) {
  const library = JSON.parse(fs.readFileSync(path.join(packageRoot,"library","templates.json"),"utf8"));
  const template = library.templates.find(t=>t.id===binding.template_id);
  if (!template) { fail(`Unknown template_id: ${binding.template_id}`); return; }
  if (binding.schema_version !== "1.0") fail("schema_version must be 1.0");
  if (!nonEmpty(binding.binding_id)) fail("binding_id is required");
  if (binding.target_duration_s < template.timing.min_s || binding.target_duration_s > template.timing.max_s) fail(`target_duration_s must be within ${template.timing.min_s}–${template.timing.max_s}`);
  if (!template.canvas.supported_profiles.includes(binding.aspect_profile)) fail(`aspect_profile is not supported by ${template.id}`);
  const canonicalById = new Map(template.slots.map(s=>[s.id,s]));
  const boundById = new Map((binding.assets ?? []).map(s=>[s.slot_id,s]));
  for (const slot of binding.assets ?? []) if (!canonicalById.has(slot.slot_id)) fail(`Unknown asset slot '${slot.slot_id}' for ${template.id}`);
  for (const canonical of template.slots) {
    const slot = boundById.get(canonical.id);
    if (!slot) { if (canonical.required) fail(`Required slot '${canonical.id}' is missing`); continue; }
    if (slot.required !== canonical.required) fail(`${slot.slot_id}: required flag disagrees with canonical template`);
    const kinds = slot.accepted_kinds ?? canonical.kinds;
    if (!Array.isArray(kinds) || kinds.some(kind=>!canonical.kinds.includes(kind))) fail(`${slot.slot_id}: accepted_kinds disagree with canonical template`);
    const hasPath = nonEmpty(slot.path);
    if (["provided","approved"].includes(slot.status)) {
      if (!hasPath) fail(`${slot.slot_id}: ${slot.status} requires a non-empty path`);
      else if (!fs.existsSync(path.resolve(slot.path))) fail(`${slot.slot_id}: material file does not exist: ${slot.path}`);
      if (!nonEmpty(slot.rights_note)) fail(`${slot.slot_id}: ${slot.status} requires a rights/provenance note`);
      if (canonical.focal_anchor_required && (!Array.isArray(slot.focal_anchor) || slot.focal_anchor.length!==2)) fail(`${slot.slot_id}: provided material requires a focal anchor`);
      if (slot.source_text_review === "pending") fail(`${slot.slot_id}: provided material still has pending source-text review`);
    }
    if (canonical.required && !hasPath && slot.status !== "WAITING_FOR_USER_MATERIAL") fail(`${slot.slot_id}: missing required material must use WAITING_FOR_USER_MATERIAL`);
    if (slot.status === "WAITING_FOR_USER_MATERIAL" && hasPath) fail(`${slot.slot_id}: waiting status requires path: null`);
    if (!canonical.required && !hasPath && !["optional_unbound","rejected"].includes(slot.status)) fail(`${slot.slot_id}: unbound optional material must use optional_unbound or rejected`);
  }
  const validText = new Set(template.text_slots.map(s=>s.id));
  for (const key of Object.keys(binding.text ?? {})) if (!validText.has(key)) fail(`Unknown text slot '${key}' for ${template.id}`);
  if (binding.approval?.style_selected_by_user && !nonEmpty(binding.style_pack_id)) fail("style_selected_by_user requires style_pack_id");
  if (binding.approval?.materials_selected_by_user) for (const canonical of template.slots.filter(s=>s.required)) {
    const slot=boundById.get(canonical.id);
    if (!slot || !["provided","approved"].includes(slot.status) || !nonEmpty(slot.path)) fail(`materials_selected_by_user cannot be true while '${canonical.id}' is unbound`);
  }
}

if (type === "style") validateStyle(value);
else if (type === "binding") validateBinding(value);
else fail(`Unknown manifest type '${type}'`);

const report = { status: errors.length ? "FAIL" : "PASS", type, input: inputPath, errors, warnings };
console.log(JSON.stringify(report,null,2));
if (errors.length) process.exit(1);
