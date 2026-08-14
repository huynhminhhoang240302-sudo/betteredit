import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { schemaErrors } from "./schema-subset.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const libraryPath = path.join(root, "library", "templates.json");
const jsonlPath = path.join(root, "library", "templates.jsonl");
const csvPath = path.join(root, "library", "template-index.csv");
const curatedPath = path.join(root, "library", "curated-variant-signatures.json");
const browserPath = path.join(root, "template-browser.html");
const templateSchemaPath = path.join(root, "schema", "template.schema.json");
const styleSchemaPath = path.join(root, "schema", "style-pack.schema.json");
const bindingSchemaPath = path.join(root, "schema", "asset-binding.schema.json");
const styleExamplePath = path.join(root, "examples", "style-pack.awaiting-user-selection.json");
const bindingExamplePath = path.join(root, "examples", "asset-binding.blank.json");
const lib = JSON.parse(fs.readFileSync(libraryPath, "utf8"));
const templates = lib.templates;
const errors = [];
const warnings = [];
const pass = (condition, message) => { if (!condition) errors.push(message); };


pass(lib.schema_version === "1.0", "Library schema_version must be 1.0");
pass(Array.isArray(templates), "templates must be an array");
pass(templates.length === 240, `Expected 240 templates, found ${templates.length}`);
pass(lib.families.length === 32, `Expected 32 families, found ${lib.families.length}`);

const expectedBands = { micro:13, sting:38, beat:65, explain:72, hold:42, hero:10 };
const expectedEffort = { functional:96, enhanced:120, hero:24 };
const expectedSpatialModes = {
  frontal: 36,
  yaw_left: 23,
  yaw_right: 22,
  tilt_plane: 26,
  depth_stack: 37,
  corridor: 40,
  oblique_split: 37,
  orbital: 19,
};
const expectedSemanticRole = {
  ST: "preserve_legibility",
  FO: "preserve_legibility",
  AR: "compare_conditions",
  EX: "trace_causality",
  BR: "transition_space",
  SP: "transition_space",
  HK: "reveal_relation",
  EV: "reveal_relation",
  PY: "reveal_relation",
};
const frontalReadFamilies = new Set(["ST01","ST03","FO01","FO02","FO03","BR04","PY02","PY03"]);
const spatialHoldFamilies = new Set(["SP01","SP02","SP03","EX01","EX02","EX03","EX04","EX05","PY01"]);
const planeTextFamilies = new Set(["ST01","ST02","ST03","FO01"]);
const diegeticModes = new Set(["yaw_left","yaw_right","tilt_plane","oblique_split"]);
const mirrorSafeModes = new Set(["frontal","depth_stack","orbital"]);
const expectedDepthLayers = {
  frontal: 1,
  yaw_left: 3,
  yaw_right: 3,
  tilt_plane: 2,
  depth_stack: 4,
  corridor: 5,
  oblique_split: 3,
  orbital: 5,
};
for (const [key, expected] of Object.entries(expectedBands)) pass(templates.filter(t=>t.timing.band===key).length === expected, `Duration band ${key} must contain ${expected}`);
for (const [key, expected] of Object.entries(expectedEffort)) pass(templates.filter(t=>t.quality.effort_tier===key).length === expected, `Effort tier ${key} must contain ${expected}`);
for (const [key, expected] of Object.entries(expectedSpatialModes)) pass(templates.filter(t=>t.spatial_composition?.mode===key).length === expected, `Spatial mode ${key} must contain ${expected}`);
pass(templates.filter(t=>t.spatial_composition?.mode!=="frontal").length === 204, "Exactly 204 templates must use a non-frontal spatial composition");
pass(lib.global_policy?.structural_oblique_content_planes_allowed === true, "Global policy must explicitly allow bounded structural oblique content planes");
pass(lib.global_policy?.structural_oblique_planes_are_not_decorative_diagonal_fields === true, "Global policy must distinguish structural oblique planes from banned decorative diagonal fields");

const ids = new Set();
const names = new Set();
const signatures = new Set();
const pseudoWayfinding = /\b(?:station|section|scene|node|file|module|phase|step|chapter|unit)\s*[\/_:–—-]\s*0?\d{1,3}\b/i;
const designedMotifTokens = /(?:crosshatch|hazard hatch|diagonal stripe field|decorative edge note|detached short underline)/i;

for (const t of templates) {
  pass(/^(HK|ST|EV|FO|SP|EX|AR|BR|PY)\d{2}-\d{2}$/.test(t.id), `${t.id}: invalid ID`);
  pass(!ids.has(t.id), `${t.id}: duplicate ID`); ids.add(t.id);
  pass(!names.has(t.name), `${t.id}: duplicate name '${t.name}'`); names.add(t.name);
  pass(!signatures.has(t.narrative.signature), `${t.id}: duplicate signature`); signatures.add(t.narrative.signature);
  pass(t.typography.policy === "serif_only" && t.typography.fallback_class === "serif", `${t.id}: typography policy is not serif-only`);
  pass(t.typography.decorative_edge_text === false, `${t.id}: decorative edge text must be false`);
  pass(t.hard_locks.serif_only === true, `${t.id}: serif hard lock missing`);
  for (const key of ["decorative_top_bottom_notes","diagonal_or_crossing_line_fields","pseudo_wayfinding_counters","small_accent_kicker_with_detached_rule","unapproved_asset_substitution"]) pass(t.hard_locks[key] === false, `${t.id}: hard lock ${key} must be false`);
  pass(t.hard_locks.structural_oblique_content_planes_allowed === true, `${t.id}: structural oblique content planes must be explicitly allowed`);
  const spatial = t.spatial_composition;
  pass(Boolean(spatial), `${t.id}: spatial_composition is missing`);
  if (spatial) {
    pass(spatial.initial_mode === spatial.mode, `${t.id}: initial_mode must preserve the assigned spatial mode`);
    const expectedSettle = frontalReadFamilies.has(t.family_id)
      ? "frontal_for_read"
      : spatialHoldFamilies.has(t.family_id) ? "spatial_hold" : "soft_oblique_hold";
    pass(spatial.settle_mode === expectedSettle, `${t.id}: settle_mode must be ${expectedSettle} for ${t.family_id}`);
    pass(spatial.semantic_role === expectedSemanticRole[t.group_code], `${t.id}: semantic_role does not match group ${t.group_code}`);
    const expectedProjection = planeTextFamilies.has(t.family_id) && diegeticModes.has(spatial.mode)
      ? "diegetic_plane" : "screen_facing";
    pass(spatial.text_projection === expectedProjection, `${t.id}: text_projection must be ${expectedProjection}`);
    pass(spatial.mirror_safe === mirrorSafeModes.has(spatial.mode), `${t.id}: mirror_safe disagrees with the assigned spatial mode`);
    pass(spatial.depth_layers === expectedDepthLayers[spatial.mode], `${t.id}: depth_layers disagrees with spatial mode ${spatial.mode}`);
    const expectedBias = Number(((t.continuity.exit.focal_anchor[0] - .5) * 2).toFixed(2));
    pass(Math.abs(spatial.screen_bias - expectedBias) < .001, `${t.id}: screen_bias must derive from the continuity exit anchor`);
    pass(t.narrative.selection_tags.includes(spatial.mode), `${t.id}: selection_tags must expose the spatial mode`);
    if (spatial.mode === "frontal") {
      pass(spatial.yaw_deg === 0 && spatial.pitch_deg === 0 && spatial.roll_deg === 0, `${t.id}: frontal mode must have zero rotation`);
      pass(spatial.perspective_strength === .08, `${t.id}: frontal mode must use the minimal perspective baseline`);
    } else {
      pass(spatial.depth_layers >= 2, `${t.id}: non-frontal mode must contain multiple depth layers`);
      pass(spatial.perspective_strength >= .5, `${t.id}: non-frontal mode must carry visible perspective strength`);
    }
    if (spatial.mode === "yaw_left") pass(spatial.yaw_deg < 0, `${t.id}: yaw_left must use negative yaw`);
    if (spatial.mode === "yaw_right") pass(spatial.yaw_deg > 0, `${t.id}: yaw_right must use positive yaw`);
    if (spatial.mode === "tilt_plane") pass(spatial.pitch_deg < 0 && spatial.roll_deg !== 0, `${t.id}: tilt_plane must use pitch and roll`);
  }
  pass(t.quality.primary_cue_count === 1, `${t.id}: must have exactly one primary cue`);
  pass(t.choreography.dominant_change_channels_max <= 2, `${t.id}: too many dominant change channels`);
  pass(t.choreography.camera_verb !== "decorative" && t.choreography.object_verb !== "decorative", `${t.id}: motion lacks semantic verb`);
  pass(t.choreography.final_state_hold_required === true, `${t.id}: final-state hold not required`);
  pass(t.timing.min_s <= t.timing.default_s && t.timing.default_s <= t.timing.max_s, `${t.id}: invalid timing bounds`);
  let previous = -1;
  for (const beat of t.timing.internal_beats) { pass(beat.at >= previous && beat.at >= 0 && beat.at <= 1, `${t.id}: invalid beat order`); previous = beat.at; }
  pass(Array.isArray(t.continuity.entry.focal_anchor) && t.continuity.entry.focal_anchor.length === 2, `${t.id}: entry anchor missing`);
  pass(Array.isArray(t.continuity.exit.focal_anchor) && t.continuity.exit.focal_anchor.length === 2, `${t.id}: exit anchor missing`);
  pass(t.audio.foreground_events_max <= 2, `${t.id}: too many foreground audio events`);
  pass(Array.isArray(t.audio.events), `${t.id}: typed audio events missing`);
  if (Array.isArray(t.audio.events)) {
    let audioAt = -1;
    for (const cue of t.audio.events) { pass(cue.at>=audioAt, `${t.id}: audio cues out of order`); audioAt=cue.at; }
    pass(JSON.stringify([...new Set(t.audio.events.map(e=>e.at))])===JSON.stringify(t.audio.event_positions_normalized), `${t.id}: audio position summary disagrees with typed cues`);
    const at = type => t.audio.events.find(e=>e.type===type)?.at;
    const visualAt = ["picture_cut_reference","visual_reveal_reference","picture_change_reference","visual_event_reference"].map(at).find(x=>x!=null);
    if (t.audio.profile==="j_cut_voice_or_ambience") pass(at("incoming_audio_start") < visualAt, `${t.id}: J-cut audio must start before picture/reveal`);
    if (t.audio.profile==="l_cut_voice_or_ambience") pass(at("outgoing_audio_tail_end") > at("picture_cut_reference"), `${t.id}: L-cut tail must end after picture cut`);
    if (t.audio.profile==="setup_riser_and_payoff") pass(at("setup_riser_start") < at("payoff_hit"), `${t.id}: setup must precede payoff`);
    if (t.audio.profile==="music_dip_and_pickup") pass(at("music_dip_start") < at("music_pickup"), `${t.id}: music dip must precede pickup`);
    if (t.audio.profile==="environment_bridge") pass(at("destination_ambience_start") < at("picture_change_reference"), `${t.id}: ambience bridge must start before picture change`);
    if (t.audio.profile==="intentional_music_stop") pass(at("music_stop") <= at("visual_event_reference"), `${t.id}: music stop must precede or meet visual event`);
    if (t.audio.profile==="mechanism_causal_chain") pass(at("trigger_sound") <= at("transmission_sound") && at("transmission_sound") <= at("result_sound"), `${t.id}: mechanism audio must preserve causal order`);
    const primaryCount=t.audio.events.filter(e=>e.prominence==="primary").length;
    pass(primaryCount<=t.audio.foreground_events_max, `${t.id}: typed primary cues exceed foreground maximum`);
  }
  pass(Array.isArray(t.slots), `${t.id}: slots missing`);
  for (const slot of t.slots) {
    pass(slot.user_selected === true, `${t.id}/${slot.id}: slot must be user-selected`);
    pass(slot.text_in_source_review === "required", `${t.id}/${slot.id}: source text review missing`);
    pass(slot.provenance_and_rights === "required", `${t.id}/${slot.id}: rights/provenance missing`);
    if (slot.required) pass(slot.missing_required_behavior === "WAITING_FOR_USER_MATERIAL", `${t.id}/${slot.id}: required missing behavior is unsafe`);
  }
  const designedText = [t.name, t.narrative.signature, ...t.text_slots.map(s=>s.id)].join(" ");
  pass(!pseudoWayfinding.test(designedText), `${t.id}: pseudo-wayfinding construction detected`);
  pass(!designedMotifTokens.test(designedText), `${t.id}: forbidden designed-motif language detected`);
}

const templateSchema = JSON.parse(fs.readFileSync(templateSchemaPath,"utf8"));
for (const t of templates) for (const issue of schemaErrors(t,templateSchema)) errors.push(`${t.id} schema: ${issue}`);
const styleSchema = JSON.parse(fs.readFileSync(styleSchemaPath,"utf8"));
const bindingSchema = JSON.parse(fs.readFileSync(bindingSchemaPath,"utf8"));
for (const issue of schemaErrors(JSON.parse(fs.readFileSync(styleExamplePath,"utf8")),styleSchema)) errors.push(`Style example schema: ${issue}`);
for (const issue of schemaErrors(JSON.parse(fs.readFileSync(bindingExamplePath,"utf8")),bindingSchema)) errors.push(`Binding example schema: ${issue}`);

for (const family of lib.families) {
  const members = templates.filter(t=>t.family_id===family.id);
  pass(members.length === family.template_count, `${family.id}: expected ${family.template_count}, found ${members.length}`);
  const nums = members.map(t=>Number(t.id.slice(-2))).sort((a,b)=>a-b);
  pass(nums.every((n,i)=>n===i+1), `${family.id}: variant numbers are not contiguous`);
  for (let i=0;i<members.length;i++) for (let j=i+1;j<members.length;j++) {
    const a=members[i], b=members[j];
    const differences = [
      a.narrative.signature!==b.narrative.signature,
      a.timing.band!==b.timing.band,
      a.choreography.edit_form!==b.choreography.edit_form,
      a.choreography.primary_attention!==b.choreography.primary_attention,
      a.audio.profile!==b.audio.profile,
      a.spatial_composition.mode!==b.spatial_composition.mode,
      JSON.stringify([a.continuity.entry.focal_anchor,a.continuity.exit.focal_anchor])!==JSON.stringify([b.continuity.entry.focal_anchor,b.continuity.exit.focal_anchor]),
    ].filter(Boolean).length;
    pass(differences>=2, `${a.id}/${b.id}: siblings differ in fewer than two viewer-perceptible dimensions`);
  }
}

const jsonlLines = fs.readFileSync(jsonlPath, "utf8").trim().split(/\r?\n/);
pass(jsonlLines.length === 240, `JSONL must have 240 lines, found ${jsonlLines.length}`);
for (const [i, line] of jsonlLines.entries()) { try { JSON.parse(line); } catch { errors.push(`JSONL line ${i+1} is invalid JSON`); } }
for (const [i,line] of jsonlLines.entries()) try { pass(JSON.stringify(JSON.parse(line))===JSON.stringify(templates[i]), `JSONL line ${i+1} disagrees with templates.json`); } catch {}
const csvLines = fs.readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
pass(csvLines.length === 241, `CSV must have header + 240 records, found ${csvLines.length}`);
pass(csvLines[0].includes('"spatial_mode"') && csvLines[0].includes('"spatial_settle"'), "CSV index must expose spatial mode and settle mode");
for (let i=1;i<csvLines.length;i++) pass(csvLines[i].startsWith(`"${templates[i-1].id}"`), `CSV row ${i+1} ID/order disagrees with templates.json`);
const browser = fs.readFileSync(browserPath, "utf8");
pass(/font-family:[^;}]*serif/i.test(browser), "Template browser lacks explicit serif stack");
pass(!/(?:sans-serif|monospace|system-ui)/i.test(browser), "Template browser contains a disallowed font fallback");
pass(/id="spatial"/.test(browser), "Template browser lacks a spatial-composition filter");
const embeddedMatch = browser.match(/const data=(\[.*?\]);const \$/s);
pass(Boolean(embeddedMatch), "Template browser embedded data not found");
if (embeddedMatch) {
  const embedded = JSON.parse(embeddedMatch[1]);
  pass(embedded.length===240, "Template browser must embed 240 records");
  for (let i=0;i<Math.min(embedded.length,templates.length);i++) {
    pass(embedded[i].id===templates[i].id, `Browser record ${i+1} ID disagrees with registry`);
    pass(embedded[i].name===templates[i].name, `${templates[i].id}: browser name disagrees with registry`);
    pass(embedded[i].effort===templates[i].quality.effort_tier, `${templates[i].id}: browser effort disagrees with registry`);
    pass(embedded[i].jobKey===templates[i].narrative.job_key, `${templates[i].id}: browser job key disagrees with registry`);
    pass(embedded[i].spatial===templates[i].spatial_composition.mode, `${templates[i].id}: browser spatial mode disagrees with registry`);
    pass(embedded[i].settle===templates[i].spatial_composition.settle_mode, `${templates[i].id}: browser settle mode disagrees with registry`);
  }
}

const curatedRaw = JSON.parse(fs.readFileSync(curatedPath, "utf8"));
const curated = Array.isArray(curatedRaw) ? curatedRaw : curatedRaw.templates;
pass(Array.isArray(curated) && curated.length === 240, "Curated signature source must contain 240 records");
if (Array.isArray(curated)) for (const v of curated) {
  const id = `${v.family_id}-${String(v.variant_no).padStart(2,"0")}`;
  const t = templates.find(x=>x.id===id);
  pass(Boolean(t), `${id}: curated source has no registry template`);
  if (!t) continue;
  pass(v.name===t.name, `${id}: curated name disagrees with registry`);
  pass(v.signature===t.narrative.signature, `${id}: curated signature disagrees with registry`);
  pass(v.edit_form===t.choreography.edit_form, `${id}: curated edit form disagrees with registry`);
  pass(v.primary_attention===t.choreography.primary_attention, `${id}: curated attention cue disagrees with registry`);
  pass(v.audio_profile===t.audio.profile, `${id}: curated audio profile disagrees with registry`);
  pass(v.effort_tier===t.quality.effort_tier, `${id}: curated effort tier disagrees with registry`);
}

const counts = {
  templates: templates.length,
  families: lib.families.length,
  duration_bands: Object.fromEntries(Object.keys(expectedBands).map(k=>[k,templates.filter(t=>t.timing.band===k).length])),
  effort_tiers: Object.fromEntries(Object.keys(expectedEffort).map(k=>[k,templates.filter(t=>t.quality.effort_tier===k).length])),
  spatial_modes: Object.fromEntries(Object.keys(expectedSpatialModes).map(k=>[k,templates.filter(t=>t.spatial_composition?.mode===k).length])),
};
const report = {
  generated_at: new Date().toISOString(),
  status: errors.length ? "FAIL" : "PASS",
  checks: 39,
  counts,
  errors,
  warnings,
  note: "Static specification validation is separate from the 240 real generic procedural preview MP4s. Validate that rendered preview layer with `node tools\\validate-previews.mjs`. Neither gate replaces visual review of later content-bound renders, source-media OCR, font loading, audio review, or final encoded playback."
};
fs.writeFileSync(path.join(root, "validation-report.json"), JSON.stringify(report, null, 2) + "\n");
fs.writeFileSync(path.join(root, "VALIDATION.md"), `# Library validation\n\n**${report.status}**\n\n- Templates: ${counts.templates}\n- Families: ${counts.families}\n- Duration bands: ${Object.entries(counts.duration_bands).map(([k,v])=>`${k} ${v}`).join(", ")}\n- Effort tiers: ${Object.entries(counts.effort_tiers).map(([k,v])=>`${k} ${v}`).join(", ")}\n- Spatial modes: ${Object.entries(counts.spatial_modes).map(([k,v])=>`${k} ${v}`).join(", ")}\n- Errors: ${errors.length}\n- Warnings: ${warnings.length}\n\n## Rendered preview layer\n\nThe package also includes 240 playable generic procedural choreography demonstrations with synthetic guide audio. Videos live under \`previews/videos/<group>/\`, posters under \`previews/posters/<group>/\`, and the canonical playback metadata is \`previews/preview-manifest.json\`. Run \`node tools\\validate-previews.mjs\` to validate every MP4, poster, manifest record, hash, stream, timing bound, spatial metadata relation, successful decode, and real frame-to-frame motion.\n\n${report.note}\n${errors.length ? `\n## Errors\n\n${errors.map(e=>`- ${e}`).join("\n")}\n` : ""}`);
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
