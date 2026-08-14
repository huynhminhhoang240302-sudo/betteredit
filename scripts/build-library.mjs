import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = root;
const libraryDir = path.join(out, "library");
const schemaDir = path.join(out, "schema");
const toolsDir = path.join(out, "tools");
for (const dir of [out, libraryDir, schemaDir, toolsDir]) fs.mkdirSync(dir, { recursive: true });

const BAND_ORDER = ["micro", "sting", "beat", "explain", "hold", "hero"];
const BANDS = {
  micro:   { min_s: 0.35, default_s: 0.58, max_s: 0.80, purpose: "flash, match, or single mark" },
  sting:   { min_s: 0.80, default_s: 1.15, max_s: 1.50, purpose: "reset, keyword, proof cut, or step card" },
  beat:    { min_s: 1.50, default_s: 2.00, max_s: 2.50, purpose: "compact evidence, title move, or comparison" },
  explain: { min_s: 2.50, default_s: 3.25, max_s: 4.00, purpose: "guided focus or multi-stage reveal" },
  hold:    { min_s: 4.00, default_s: 5.20, max_s: 6.50, purpose: "orientation, developed evidence, or mechanism" },
  hero:    { min_s: 6.50, default_s: 8.10, max_s: 10.0, purpose: "causal mechanism, reassembly, or major payoff" },
};

const GROUPS = {
  HK: { name: "Hook / entry", question: "Why should I keep watching?" },
  ST: { name: "Structure / title", question: "Where am I in the story?" },
  EV: { name: "Evidence / B-roll", question: "What proves or grounds this claim?" },
  FO: { name: "Focus / typography", question: "What exactly should I notice?" },
  SP: { name: "Spatial / 2.5D", question: "How can flat media become a coherent space?" },
  EX: { name: "Explanation / mechanism", question: "How does the system work or change?" },
  AR: { name: "Argument / comparison", question: "What is the meaningful difference or turn?" },
  BR: { name: "Continuity / bridge", question: "How does attention travel into the next beat?" },
  PY: { name: "Payoff / close", question: "What resolves, recombines, or remains?" },
};

const JOB_KEYS = {
  HK01:"prove_value_before_explanation", HK02:"human_witness_to_world", HK03:"break_expectation_and_hold_question", HK04:"open_concrete_loops",
  ST01:"state_chapter_proposition", ST02:"portrait_portal_stage", ST03:"punctuate_structural_turn",
  EV01:"join_two_shots_by_meaning", EV02:"detail_to_context", EV03:"locate_viewer", EV04:"escalate_evidence",
  FO01:"emphasize_keyword", FO02:"number_stat_proof", FO03:"guide_source_focus",
  SP01:"layered_parallax_space", SP02:"photo_depth_reveal", SP03:"cross_media_portal",
  EX01:"whole_part_whole", EX02:"cutaway_exploded_hierarchy", EX03:"show_input_transmission_output", EX04:"trace_route_to_consequence", EX05:"same_shot_state_transform",
  AR01:"compare_matched_conditions", AR02:"thesis_antithesis_synthesis", AR03:"problem_solution_turn",
  BR01:"shape_object_match", BR02:"eye_trace_position_match", BR03:"direction_occlusion_bridge", BR04:"audio_j_l_bridge",
  PY01:"reassemble_callback", PY02:"recap_learned_order", PY03:"final_synthesis_close",
};

// Spatial composition is a canonical choreography axis, not a decorative style.
// Bounded content planes may be oblique; repeated diagonal/crosshatch fields remain banned.
const SPATIAL_MODE_SEQUENCES = {
  HK01:"frontal yaw_left oblique_split tilt_plane corridor yaw_right frontal", HK02:"yaw_right yaw_left tilt_plane oblique_split corridor yaw_right orbital", HK03:"oblique_split oblique_split corridor depth_stack yaw_right yaw_left depth_stack", HK04:"corridor depth_stack depth_stack oblique_split depth_stack yaw_left orbital",
  ST01:"frontal yaw_left frontal depth_stack tilt_plane oblique_split frontal depth_stack", ST02:"frontal yaw_left tilt_plane depth_stack oblique_split corridor tilt_plane yaw_right", ST03:"frontal frontal frontal depth_stack oblique_split yaw_right tilt_plane yaw_right",
  EV01:"corridor oblique_split yaw_right orbital tilt_plane frontal oblique_split depth_stack", EV02:"corridor yaw_left yaw_right corridor depth_stack tilt_plane yaw_right orbital", EV03:"tilt_plane tilt_plane corridor corridor orbital oblique_split tilt_plane yaw_left", EV04:"corridor depth_stack oblique_split yaw_left corridor oblique_split depth_stack depth_stack",
  FO01:"frontal depth_stack yaw_left frontal frontal tilt_plane oblique_split frontal", FO02:"frontal depth_stack frontal oblique_split tilt_plane depth_stack frontal oblique_split", FO03:"tilt_plane frontal corridor yaw_right oblique_split orbital tilt_plane oblique_split",
  SP01:"depth_stack yaw_left depth_stack tilt_plane orbital depth_stack oblique_split corridor", SP02:"depth_stack yaw_right orbital corridor corridor tilt_plane yaw_left corridor", SP03:"yaw_left depth_stack corridor yaw_right orbital yaw_left corridor corridor",
  EX01:"frontal corridor depth_stack tilt_plane yaw_left frontal corridor depth_stack yaw_right orbital", EX02:"yaw_left tilt_plane depth_stack orbital tilt_plane oblique_split corridor depth_stack orbital yaw_right", EX03:"corridor yaw_right corridor yaw_left oblique_split orbital frontal depth_stack corridor oblique_split", EX04:"corridor oblique_split corridor yaw_left frontal depth_stack tilt_plane corridor oblique_split depth_stack", EX05:"depth_stack tilt_plane corridor oblique_split yaw_left oblique_split yaw_right depth_stack yaw_right orbital",
  AR01:"oblique_split oblique_split frontal frontal frontal oblique_split oblique_split yaw_right", AR02:"oblique_split yaw_left frontal oblique_split oblique_split depth_stack frontal oblique_split", AR03:"frontal oblique_split corridor frontal tilt_plane depth_stack corridor depth_stack",
  BR01:"orbital yaw_right tilt_plane orbital corridor frontal", BR02:"frontal yaw_right tilt_plane yaw_left corridor frontal", BR03:"yaw_right yaw_left corridor tilt_plane depth_stack corridor", BR04:"frontal yaw_left oblique_split corridor orbital frontal",
  PY01:"depth_stack frontal corridor orbital", PY02:"oblique_split depth_stack corridor", PY03:"frontal corridor orbital",
};
for (const key of Object.keys(SPATIAL_MODE_SEQUENCES)) SPATIAL_MODE_SEQUENCES[key] = SPATIAL_MODE_SEQUENCES[key].split(" ");

const SPATIAL_BASE = {
  frontal:        { yaw: 0,   pitch: 0,   roll: 0,    depth: 1, perspective: .08 },
  yaw_left:       { yaw: -16, pitch: 1,   roll: -1.5, depth: 3, perspective: .58 },
  yaw_right:      { yaw: 16,  pitch: 1,   roll: 1.5,  depth: 3, perspective: .58 },
  tilt_plane:     { yaw: 8,   pitch: -10, roll: 4,    depth: 2, perspective: .50 },
  depth_stack:    { yaw: 7,   pitch: -3,  roll: 0,    depth: 4, perspective: .64 },
  corridor:       { yaw: 11,  pitch: -4,  roll: 0,    depth: 5, perspective: .78 },
  oblique_split:  { yaw: 13,  pitch: -2,  roll: 5,    depth: 3, perspective: .60 },
  orbital:        { yaw: 18,  pitch: -5,  roll: 0,    depth: 5, perspective: .85 },
};

const FRONTAL_READ_FAMILIES = new Set(["ST01","ST03","FO01","FO02","FO03","BR04","PY02","PY03"]);
const SPATIAL_HOLD_FAMILIES = new Set(["SP01","SP02","SP03","EX01","EX02","EX03","EX04","EX05","PY01"]);

function spatialComposition(familyId, groupCode, variantNo, exitAnchor) {
  const sequence = SPATIAL_MODE_SEQUENCES[familyId];
  if (!sequence || !sequence[variantNo - 1]) throw new Error(`${familyId}-${variantNo}: spatial mode is not assigned`);
  const mode = sequence[variantNo - 1];
  const base = SPATIAL_BASE[mode];
  const factor = .88 + .06 * ((variantNo - 1) % 3);
  const sign = variantNo % 2 ? -1 : 1;
  const yaw = mode === "tilt_plane" || mode === "depth_stack" || mode === "corridor" || mode === "oblique_split" || mode === "orbital"
    ? Math.abs(base.yaw) * sign
    : base.yaw;
  const roll = mode === "tilt_plane" || mode === "oblique_split" ? Math.abs(base.roll) * sign : base.roll;
  const settleMode = FRONTAL_READ_FAMILIES.has(familyId)
    ? "frontal_for_read"
    : SPATIAL_HOLD_FAMILIES.has(familyId) ? "spatial_hold" : "soft_oblique_hold";
  const semanticRole = groupCode === "ST" || groupCode === "FO" ? "preserve_legibility"
    : groupCode === "AR" ? "compare_conditions"
      : groupCode === "EX" ? "trace_causality"
        : groupCode === "BR" || groupCode === "SP" ? "transition_space"
          : "reveal_relation";
  const planeTextFamily = ["ST01","ST02","ST03","FO01"].includes(familyId);
  const textProjection = planeTextFamily && ["yaw_left","yaw_right","tilt_plane","oblique_split"].includes(mode)
    ? "diegetic_plane" : "screen_facing";
  return {
    mode,
    initial_mode: mode,
    settle_mode: settleMode,
    yaw_deg: Number((yaw * factor).toFixed(2)),
    pitch_deg: Number((base.pitch * factor).toFixed(2)),
    roll_deg: Number((roll * factor).toFixed(2)),
    depth_layers: base.depth,
    perspective_strength: base.perspective,
    screen_bias: Number(((exitAnchor[0] - .5) * 2).toFixed(2)),
    semantic_role: semanticRole,
    text_projection: textProjection,
    mirror_safe: mode === "frontal" || mode === "depth_stack" || mode === "orbital",
  };
}

const FAMILIES = [
  ["HK01", "blackout-to-proof", "Blackout-to-proof launch", "prove value before explanation", [1,3,3,0,0,0], ["proof_fragment?", "hero_media"], ["hook_phrase:6?"], "reveal", "appear", "quick_mix_2026"],
  ["HK02", "human-witness-to-world", "Human witness to world reveal", "expand a human-scale observation into its world", [0,1,3,2,1,0], ["observer", "world"], ["context_line:8?"], "reveal", "appear", "quick_mix_2026"],
  ["HK03", "contradiction-question", "Contradiction or question reveal", "break an expectation and hold the question", [0,1,3,3,0,0], ["baseline", "anomaly"], ["question:10"], "reveal", "transform", "master_guides"],
  ["HK04", "promise-stack", "Promise-stack evidence burst", "open several concrete loops without explaining them yet", [0,2,3,2,0,0], ["evidence_set"], ["hook_phrase:7?"], "reveal", "appear", "colosseum_opening"],
  ["ST01", "centered-serif-title", "Centered serif title build", "state one chapter proposition with controlled accrual", [0,1,3,3,1,0], ["title_background?"], ["title:10", "subtitle:14?"], "none", "appear", "quick_mix_2026"],
  ["ST02", "portrait-portal", "Portrait portal stage", "make a vertical artifact intentional inside another canvas", [0,0,2,4,2,0], ["portrait_media"], ["title:8?", "subtitle:12?"], "enter", "appear", "quick_mix_2026"],
  ["ST03", "chapter-step-card", "Chapter or step impact card", "punctuate a real structural turn with one readable statement", [1,3,3,1,0,0], ["chapter_background?"], ["chapter_title:6", "plain_ordinal:3?"], "none", "appear", "quick_mix_2026"],
  ["EV01", "cinematic-hard-cut-pair", "Cinematic hard-cut pair", "join two shots by claim, action, contrast, or consequence", [3,3,2,0,0,0], ["media_a", "media_b"], ["evidence_line:8?"], "none", "appear", "quick_mix_2026"],
  ["EV02", "detail-to-wide", "Detail to wide reveal", "convert a clue into spatial or conceptual context", [0,2,4,2,0,0], ["detail", "wide"], ["context_line:8?"], "reveal", "appear", "quick_mix_2026"],
  ["EV03", "aerial-location", "Aerial or location orientation", "locate the viewer before explaining a place or system", [0,0,2,3,3,0], ["location_media", "map_overlay?"], ["place_name:5?", "scale_value:4?"], "locate", "travel", "colosseum_world"],
  ["EV04", "three-shot-escalation", "Three-shot evidence escalation", "increase specificity or consequence across three proofs", [0,2,3,3,0,0], ["evidence_triplet"], ["claim_line:10?"], "reveal", "appear", "master_guides"],
  ["FO01", "single-keyword", "Single-keyword emphasis", "make one short concept unmistakable without caption spam", [2,3,3,0,0,0], ["supporting_media?"], ["keyword:3"], "none", "appear", "editing_tutorial"],
  ["FO02", "number-stat-proof", "Number or stat proof", "give a number context, meaning, and a readable hold", [0,1,3,3,1,0], ["stat_evidence?"], ["value:3", "unit:3?", "meaning:10"], "none", "transform", "editing_tutorial"],
  ["FO03", "guided-source-focus", "Guided source or screenshot focus", "move attention through real evidence one region at a time", [0,0,2,4,2,0], ["source_document"], ["focus_label:5?", "source_citation:12?"], "isolate", "appear", "editing_tutorial"],
  ["SP01", "layered-card-parallax", "Layered-card parallax", "turn selected flat assets into a navigable depth field", [0,1,2,3,2,0], ["layer_set", "foreground?"], ["title:8?"], "enter", "assemble", "editing_tutorial"],
  ["SP02", "photo-depth-push", "Photo depth push", "reveal a relation or hidden context within one still", [0,0,2,4,2,0], ["hero_image", "subject_matte?", "depth_map?"], ["label:5?"], "approach", "appear", "editing_tutorial"],
  ["SP03", "collage-portal", "Collage or portal transition", "cross from selected media into the next story world", [0,2,3,2,1,0], ["source_set", "destination"], ["bridge_phrase:6?"], "enter", "assemble", "master_guides"],
  ["EX01", "whole-part-whole", "Whole to part to whole isolate", "preserve orientation while explaining one component", [0,0,1,4,4,1], ["master_system", "selected_component"], ["component_label:5?", "function_line:10?"], "isolate", "separate", "colosseum_world"],
  ["EX02", "cutaway-exploded", "Cutaway or exploded reveal", "expose hierarchy and restore the intact object", [0,0,1,4,4,1], ["intact_object", "part_set"], ["part_label:5?"], "reveal", "separate", "colosseum_world"],
  ["EX03", "causal-chain", "Input to transmission to output causal sequence", "show how an upstream action produces a downstream result", [0,0,0,3,5,2], ["trigger", "component_chain", "result"], ["input_label:4?", "output_label:4?"], "operate", "transfer", "colosseum_world"],
  ["EX04", "flow-path-trace", "Flow or path trace", "follow a route, process, network, or constraint to its consequence", [0,0,1,4,4,1], ["path_world", "origin", "destination"], ["path_label:5?", "value:4?"], "trace", "travel", "colosseum_world"],
  ["EX05", "same-shot-state", "Same-shot state transform", "compare meaningful states without losing the object", [0,1,2,4,2,1], ["state_system", "state_assets?"], ["state_a:4?", "state_b:4?"], "operate", "transform", "colosseum_world"],
  ["AR01", "split-comparison", "Split-screen comparison", "compare one criterion at a time under matched conditions", [0,0,2,4,2,0], ["side_a", "side_b"], ["criterion:6", "label_a:4?", "label_b:4?"], "compare", "appear", "editing_tutorial"],
  ["AR02", "thesis-antithesis", "Thesis to antithesis pivot", "earn a reversal and leave a synthesis", [0,1,3,3,1,0], ["claim_a_media?", "claim_b_media?"], ["claim_a:9", "claim_b:9", "synthesis:10?"], "reveal", "transform", "editing_tutorial"],
  ["AR03", "problem-solution", "Problem to solution turn", "make the solution legible as a state or mechanism change", [0,1,2,4,1,0], ["problem_state", "solution_state", "mechanism?"], ["problem_line:8?", "solution_line:8?"], "reveal", "transform", "editing_tutorial"],
  ["BR01", "shape-object-match", "Shape or object match cut", "bridge scenes through one concrete visual analogue", [2,3,1,0,0,0], ["outgoing", "incoming"], [], "none", "appear", "editing_tutorial"],
  ["BR02", "eye-trace-match", "Eye-trace or position match", "place the next priority where the viewer is already looking", [1,3,2,0,0,0], ["outgoing", "incoming"], [], "none", "appear", "editing_tutorial"],
  ["BR03", "direction-occlusion", "Direction or occlusion bridge", "carry motion through a cut or hide it in a motivated occluder", [2,2,2,0,0,0], ["outgoing", "incoming", "occluder?"], [], "enter", "travel", "master_guides"],
  ["BR04", "audio-jl-bridge", "Audio-led J or L bridge", "let sound prepare or complete a restrained picture change", [1,2,2,1,0,0], ["outgoing", "incoming", "bridge_audio"], [], "none", "appear", "editing_tutorial"],
  ["PY01", "reassembly-callback", "Reassembly or callback payoff", "return isolated parts to a newly understood whole", [0,0,0,1,1,2], ["callback_assets", "resolved_whole"], ["payoff_line:10?"], "reintegrate", "restore", "colosseum_world"],
  ["PY02", "recap-cascade", "Recap cascade", "compress learned visuals in their established order", [0,0,0,1,2,0], ["recap_set"], ["synthesis:10?"], "reintegrate", "assemble", "master_guides"],
  ["PY03", "final-synthesis", "Final synthesis or diegetic close", "resolve picture, argument, sound, and optional ask", [0,0,0,0,1,2], ["hero_environment", "cta_object?"], ["closing_line:12?", "cta:6?"], "reintegrate", "restore", "master_guides"],
].map(([id, slug, name, job, bandCounts, slots, texts, cameraVerb, objectVerb, source]) => ({
  id, group: id.slice(0, 2), slug, name, job, bandCounts, slots, texts, cameraVerb, objectVerb, source,
}));

const SLOT_PRESETS = {
  "proof_fragment?": ["proof_fragment", "process or provenance flash", ["video", "image", "screenshot"], false, "1"],
  hero_media: ["hero_media", "decisive proof or subject", ["video", "image", "three_d_scene"], true, "1"],
  observer: ["observer", "human or object-scale witness", ["video", "image"], true, "1"],
  world: ["world", "environment or system context", ["video", "image", "three_d_scene"], true, "1"],
  baseline: ["baseline", "expected state", ["video", "image", "vector_scene", "three_d_scene"], true, "1"],
  anomaly: ["anomaly", "contradicting state or evidence", ["video", "image", "vector_scene", "three_d_scene"], true, "1"],
  evidence_set: ["evidence_set", "promise-stack proof items", ["video", "image", "screenshot", "three_d_scene"], true, "3..5"],
  "title_background?": ["title_background", "optional atmosphere or selected media", ["video", "image", "texture"], false, "0..1"],
  portrait_media: ["portrait_media", "intentional vertical artifact", ["video", "image", "screenshot"], true, "1"],
  "chapter_background?": ["chapter_background", "optional quiet backing field", ["video", "image", "texture"], false, "0..1"],
  media_a: ["media_a", "setup, claim, or cause", ["video", "image"], true, "1"],
  media_b: ["media_b", "proof, contrast, or result", ["video", "image"], true, "1"],
  detail: ["detail", "clue or close detail", ["video", "image"], true, "1"],
  wide: ["wide", "contextual wide", ["video", "image", "three_d_scene"], true, "1"],
  location_media: ["location_media", "map, aerial, or establishing world", ["video", "image", "map", "three_d_scene"], true, "1"],
  "map_overlay?": ["map_overlay", "optional factual path or boundary", ["vector", "map"], false, "0..1"],
  evidence_triplet: ["evidence_triplet", "ordered evidence sequence", ["video", "image", "screenshot"], true, "3"],
  "supporting_media?": ["supporting_media", "optional visual anchor", ["video", "image"], false, "0..1"],
  "stat_evidence?": ["stat_evidence", "source or visual proof for the number", ["screenshot", "image", "data"], false, "0..1"],
  source_document: ["source_document", "document, page, screenshot, or interface", ["screenshot", "image", "video"], true, "1"],
  layer_set: ["layer_set", "depth-separated selected assets", ["image", "video", "vector"], true, "2..5"],
  "foreground?": ["foreground", "optional foreground occluder", ["image", "video", "vector", "matte"], false, "0..1"],
  hero_image: ["hero_image", "high-resolution still", ["image"], true, "1"],
  "subject_matte?": ["subject_matte", "optional subject isolation", ["matte"], false, "0..1"],
  "depth_map?": ["depth_map", "optional depth guidance", ["depth_map"], false, "0..1"],
  source_set: ["source_set", "collage or portal sources", ["video", "image", "screenshot"], true, "2..4"],
  destination: ["destination", "next story world", ["video", "image", "three_d_scene"], true, "1"],
  master_system: ["master_system", "persistent whole", ["video", "image", "vector_scene", "three_d_scene"], true, "1"],
  selected_component: ["selected_component", "part under explanation", ["image", "vector", "three_d_object"], true, "1"],
  intact_object: ["intact_object", "assembled object or environment", ["video", "image", "vector_scene", "three_d_scene"], true, "1"],
  part_set: ["part_set", "separable hierarchy", ["image", "vector", "three_d_object"], true, "2..8"],
  trigger: ["trigger", "upstream input or action", ["video", "image", "vector", "three_d_object"], true, "1"],
  component_chain: ["component_chain", "causal transmission components", ["vector", "three_d_object", "masked_image"], true, "2..5"],
  result: ["result", "visible downstream consequence", ["video", "image", "vector", "three_d_object"], true, "1"],
  path_world: ["path_world", "map, route, process, or network", ["map", "image", "vector_scene", "three_d_scene"], true, "1"],
  origin: ["origin", "path origin", ["point", "vector", "three_d_object"], true, "1"],
  destination: ["destination", "path destination", ["point", "vector", "video", "image", "three_d_object"], true, "1"],
  state_system: ["state_system", "persistent subject across states", ["video", "image", "vector_scene", "three_d_scene"], true, "1"],
  "state_assets?": ["state_assets", "optional textures, mattes, or mechanisms", ["image", "vector", "three_d_object", "matte"], false, "0..4"],
  side_a: ["side_a", "comparison state A", ["video", "image", "data", "three_d_scene"], true, "1"],
  side_b: ["side_b", "comparison state B", ["video", "image", "data", "three_d_scene"], true, "1"],
  "claim_a_media?": ["claim_a_media", "optional thesis evidence", ["video", "image", "screenshot"], false, "0..1"],
  "claim_b_media?": ["claim_b_media", "optional antithesis evidence", ["video", "image", "screenshot"], false, "0..1"],
  problem_state: ["problem_state", "problem evidence or state", ["video", "image", "vector_scene", "three_d_scene"], true, "1"],
  solution_state: ["solution_state", "solution evidence or state", ["video", "image", "vector_scene", "three_d_scene"], true, "1"],
  "mechanism?": ["mechanism", "optional bridge explaining the change", ["video", "image", "vector", "three_d_object"], false, "0..1"],
  outgoing: ["outgoing", "outgoing scene handle", ["video", "image", "render"], true, "1"],
  incoming: ["incoming", "incoming scene handle", ["video", "image", "render"], true, "1"],
  "occluder?": ["occluder", "motivated foreground cover", ["video", "image", "matte", "three_d_object"], false, "0..1"],
  bridge_audio: ["bridge_audio", "incoming or trailing semantic sound", ["voice", "ambience", "music", "sfx"], true, "1"],
  callback_assets: ["callback_assets", "previously learned parts or states", ["video", "image", "render", "three_d_scene"], true, "2..6"],
  resolved_whole: ["resolved_whole", "recomposed system", ["video", "image", "three_d_scene"], true, "1"],
  recap_set: ["recap_set", "ordered established visuals", ["video", "image", "render"], true, "3..5"],
  hero_environment: ["hero_environment", "final world or object", ["video", "image", "three_d_scene"], true, "1"],
  "cta_object?": ["cta_object", "optional diegetic ask or destination", ["image", "vector", "three_d_object"], false, "0..1"],
};

function slotFromKey(key) {
  const preset = SLOT_PRESETS[key];
  if (!preset) throw new Error(`Missing slot preset: ${key}`);
  const [id, role, kinds, required, quantity] = preset;
  return {
    id, role, kinds, required, quantity,
    user_selected: true,
    focal_anchor_required: !["texture", "audio", "bridge_audio", "part_set", "component_chain"].includes(id),
    crop_policy: kinds.includes("screenshot") ? "smart_crop" : "anchor_preserving",
    handles_s: kinds.includes("video") ? { in: 0.25, out: 0.25 } : null,
    text_in_source_review: "required",
    provenance_and_rights: "required",
    missing_required_behavior: required ? "WAITING_FOR_USER_MATERIAL" : "omit_cleanly",
  };
}

function textFromKey(key) {
  const [id, tail = "8"] = key.split(":");
  const required = !tail.endsWith("?");
  const maxWords = Number(tail.replace("?", ""));
  return { id, required, max_words: maxWords, typography_role: id.includes("title") || id.includes("question") ? "display_serif" : "text_serif" };
}

function bandSequence(counts) {
  const result = [];
  counts.forEach((count, i) => { for (let n = 0; n < count; n++) result.push(BAND_ORDER[i]); });
  return result;
}

function timelineFor(band, family) {
  if (band === "micro") return [{ at: 0.00, event: "establish" }, { at: 0.34, event: family.objectVerb }, { at: 0.76, event: "settle" }];
  if (band === "sting") return [{ at: 0.00, event: "establish" }, { at: 0.22, event: family.cameraVerb }, { at: 0.68, event: "payoff" }, { at: 0.86, event: "read_hold" }];
  if (band === "beat") return [{ at: 0.00, event: "establish" }, { at: 0.18, event: family.cameraVerb }, { at: 0.52, event: family.objectVerb }, { at: 0.80, event: "payoff" }, { at: 0.90, event: "read_hold" }];
  if (band === "explain") return [{ at: 0.00, event: "orient" }, { at: 0.16, event: "first_change" }, { at: 0.43, event: family.cameraVerb }, { at: 0.68, event: family.objectVerb }, { at: 0.84, event: "payoff" }, { at: 0.92, event: "read_hold" }];
  return [{ at: 0.00, event: "orient" }, { at: 0.12, event: "first_change" }, { at: 0.31, event: family.cameraVerb }, { at: 0.52, event: "develop" }, { at: 0.72, event: family.objectVerb }, { at: 0.86, event: "payoff" }, { at: 0.93, event: "read_hold" }];
}

function motionProfile(editForm) {
  if (["clean_hard_cut", "clause_cut", "action_cut", "shape_match", "position_match"].includes(editForm)) return "snap_settle";
  if (["same_shot_transform", "motivated_occlusion", "portrait_portal"].includes(editForm)) return "continuous_guided";
  if (["j_cut", "l_cut"].includes(editForm)) return "hold_then_move";
  return "measured";
}

function audioContinuityRole(profile) {
  if (["j_cut_voice_or_ambience","l_cut_voice_or_ambience"].includes(profile)) return "voice_or_ambience";
  if (profile === "environment_bridge") return "ambience";
  if (["continuous_bed","music_dip_and_pickup","intentional_music_stop"].includes(profile)) return "music_or_tone";
  if (profile === "mechanism_causal_chain") return "mechanism";
  if (profile === "voice_only") return "voice";
  return "punctuation_or_none";
}

const round3 = n => Number(Math.max(0, Math.min(1, n)).toFixed(3));
function audioMap(profile, editForm, beats, variantNo) {
  const semantic = beats.filter(b => !["establish", "orient", "read_hold", "settle", "none"].includes(b.event));
  const payoff = beats.find(b=>b.event==="payoff")?.at ?? semantic.at(-1)?.at ?? 0.82;
  const first = semantic[0]?.at ?? 0.22;
  const second = semantic[1]?.at ?? payoff;
  const visual = ["same_shot_transform", "portrait_portal", "motivated_occlusion"].includes(editForm) ? second : first;
  const variation = ((variantNo % 4) - 1.5) * 0.012;
  const event = (at, type, layer, prominence, semantic_role) => ({ at: round3(at), type, layer, prominence, semantic_role });
  let events;
  switch (profile) {
    case "voice_only":
      events = [event(0, "voice_continuity_start", "voice", "supporting", "carry narration without punctuation"), event(1, "voice_continuity_end", "voice", "supporting", "preserve intelligibility through exit")];
      break;
    case "continuous_bed":
      events = [event(0, "bed_start", "music_or_tone", "supporting", "maintain scene continuity"), event(1, "bed_tail_end", "music_or_tone", "supporting", "hand off to the next edit")];
      break;
    case "single_semantic_hit":
      events = [event(payoff + variation, "semantic_hit", "sfx", "primary", "punctuate the visible payoff")];
      break;
    case "environment_bridge":
      events = [
        event(visual - 0.16 - Math.abs(variation), "destination_ambience_start", "ambience", "supporting", "preview the destination"),
        event(visual, "picture_change_reference", "picture_reference", "none", "reveal the ambience source"),
        event(Math.min(0.98, visual + 0.22), "ambience_settle", "ambience", "supporting", "establish the new environment"),
      ];
      break;
    case "j_cut_voice_or_ambience":
      events = [
        event(visual - 0.14 - Math.abs(variation), "incoming_audio_start", "voice_or_ambience", "supporting", "identify or foreshadow the destination"),
        event(visual, editForm === "same_shot_transform" ? "visual_reveal_reference" : "picture_cut_reference", "picture_reference", "none", "show the source after sound begins"),
        event(Math.min(0.98, payoff + 0.06), "incoming_audio_hold", "voice_or_ambience", "supporting", "carry continuity through the reveal"),
      ];
      break;
    case "l_cut_voice_or_ambience":
      events = [
        event(0, "outgoing_audio_start", "voice_or_ambience", "supporting", "establish the outgoing source"),
        event(visual, "picture_cut_reference", "picture_reference", "none", "change picture before the outgoing sound completes"),
        event(Math.min(0.98, visual + 0.18 + Math.abs(variation)), "outgoing_audio_tail_end", "voice_or_ambience", "supporting", "complete or decay over the incoming picture"),
      ];
      break;
    case "setup_riser_and_payoff":
      events = [
        event(Math.max(0.04, payoff - 0.34 - Math.abs(variation)), "setup_riser_start", "music_or_sfx", "supporting", "promise a real upcoming state change"),
        event(payoff + variation, "payoff_hit", "sfx", "primary", "land the visible reveal or transformation"),
      ];
      break;
    case "music_dip_and_pickup":
      events = [
        event(Math.max(0.03, visual - 0.11 - Math.abs(variation)), "music_dip_start", "music", "supporting", "clear space for the structural turn"),
        event(visual, "picture_change_reference", "picture_reference", "none", "mark the visual turn inside the dip"),
        event(Math.min(0.97, payoff + 0.03 + variation), "music_pickup", "music", "supporting", "restore energy after the new idea lands"),
      ];
      break;
    case "intentional_music_stop":
      events = [
        event(Math.max(0.03, visual - 0.08 - Math.abs(variation)), "music_stop", "music", "primary", "create an earned hush or unresolved gap"),
        event(visual, "visual_event_reference", "picture_reference", "none", "let the picture land inside the stop"),
        event(Math.min(0.98, payoff + 0.04), "hush_hold_end", "silence", "supporting", "protect the meaning before the next edit"),
      ];
      break;
    case "mechanism_causal_chain": {
      const triggerAt = round3(Math.max(0.04, first - (beats.length <= 3 ? 0.12 : 0)));
      const explicitTransmission = beats.find(b=>["develop", "transfer", "travel", "operate", "transform", "separate", "assemble"].includes(b.event) && b.at>triggerAt && b.at<payoff)?.at;
      const transmissionAt = round3(explicitTransmission ?? (triggerAt + Math.max(0.06, (payoff - triggerAt) * 0.52)));
      const resultAt = round3(Math.max(transmissionAt + 0.04, payoff + variation));
      events = [
        event(triggerAt, "trigger_sound", "mechanism", "low", "make the upstream action tangible"),
        event(transmissionAt, "transmission_sound", "mechanism", "low", "follow causal transfer without dominating voice"),
        event(resultAt, "result_sound", "mechanism_or_sfx", "primary", "confirm the downstream consequence"),
      ];
      break;
    }
    default:
      throw new Error(`Unknown audio profile: ${profile}`);
  }
  events.sort((a,b)=>a.at-b.at || a.type.localeCompare(b.type));
  return { events, event_positions_normalized: [...new Set(events.map(e=>e.at))] };
}

const variantsPath = path.join(root, "library", "curated-variant-signatures.json");
if (!fs.existsSync(variantsPath)) throw new Error(`Curated variants are not ready: ${variantsPath}`);
const curated = JSON.parse(fs.readFileSync(variantsPath, "utf8"));
const curatedEntries = Array.isArray(curated) ? curated : curated.templates;
if (!Array.isArray(curatedEntries)) throw new Error("curated_variant_signatures.json must be an array or contain templates[]");

const anchors = [[0.50,0.50],[0.38,0.50],[0.62,0.50],[0.50,0.42],[0.42,0.56],[0.58,0.56]];
const scaleBands = ["medium", "close", "wide", "medium", "detail", "aerial"];
const templates = [];
for (const family of FAMILIES) {
  const familyVariants = curatedEntries.filter(v => v.family_id === family.id).sort((a,b) => a.variant_no - b.variant_no);
  const bands = bandSequence(family.bandCounts);
  if (familyVariants.length !== bands.length) throw new Error(`${family.id}: expected ${bands.length} curated variants, received ${familyVariants.length}`);
  familyVariants.forEach((v, i) => {
    const band = bands[i];
    const timing = BANDS[band];
    const entryAnchor = anchors[i % anchors.length];
    const exitAnchor = anchors[(i + (family.cameraVerb === "none" ? 0 : 1)) % anchors.length];
    const signature = String(v.signature || "").trim();
    if (!signature) throw new Error(`${family.id}-${i+1}: missing signature`);
    const id = `${family.id}-${String(i + 1).padStart(2, "0")}`;
    const internalBeats = timelineFor(band, family);
    const audio = audioMap(v.audio_profile, v.edit_form, internalBeats, i + 1);
    const spatial = spatialComposition(family.id, family.group, i + 1, exitAnchor);
    templates.push({
      schema_version: "1.0",
      id,
      family_id: family.id,
      group_code: family.group,
      group: GROUPS[family.group].name,
      name: v.name,
      status: "wireframe_spec",
      source_lineage: [family.source, "master_video_guides"],
      narrative: {
        job_key: JOB_KEYS[family.id],
        job: family.job,
        question_answered: GROUPS[family.group].question,
        signature,
        selection_tags: [family.slug, JOB_KEYS[family.id], family.group.toLowerCase(), band, String(v.edit_form || "clean_hard_cut"), spatial.mode],
      },
      timing: { band, ...timing, internal_beats: internalBeats },
      canvas: {
        design_space: [1920,1080],
        supported_profiles: ["landscape_16_9", "portrait_9_16", "square_1_1"],
        safe_area_fraction: { x: 0.08, y: 0.08 },
        reframe_strategy: "focal_anchor_preserving",
      },
      typography: {
        policy: "serif_only",
        display_role: "style_pack.display_serif",
        text_role: "style_pack.text_serif",
        caption_role: "style_pack.caption_serif",
        numeral_role: "style_pack.tabular_serif",
        fallback_class: "serif",
        max_families_per_video: 2,
        decorative_edge_text: false,
      },
      slots: family.slots.map(slotFromKey),
      text_slots: family.texts.map(textFromKey),
      choreography: {
        signature,
        edit_form: v.edit_form,
        camera_verb: family.cameraVerb,
        object_verb: family.objectVerb,
        motion_profile: motionProfile(v.edit_form),
        primary_attention: v.primary_attention,
        dominant_change_channels_max: 2,
        final_state_hold_required: true,
      },
      continuity: {
        profile: v.continuity_profile || (family.group === "BR" ? "focal_anchor_match" : "object_persistence"),
        entry: {
          focal_anchor: entryAnchor,
          subject_scale_band: scaleBands[i % scaleBands.length],
          motion_vector: [0,0],
          orientation_key: `canonical:${family.id}`,
          luma_band: "style_bound",
          accent_hue_role: "style_bound",
          audio_tail_role: audioContinuityRole(v.audio_profile),
          object_persistence_key: `canonical:${family.id}`,
        },
        exit: {
          focal_anchor: exitAnchor,
          subject_scale_band: scaleBands[(i+1) % scaleBands.length],
          motion_vector: family.cameraVerb === "none" ? [0,0] : [Number((exitAnchor[0]-entryAnchor[0]).toFixed(2)), Number((exitAnchor[1]-entryAnchor[1]).toFixed(2))],
          orientation_key: `canonical:${family.id}`,
          luma_band: "style_bound",
          accent_hue_role: "style_bound",
          audio_tail_role: audioContinuityRole(v.audio_profile),
          object_persistence_key: `canonical:${family.id}`,
        },
        preferred_next_tags: family.group === "PY" ? ["end"] : ["continue_claim", "evidence", "payoff"],
      },
      spatial_composition: spatial,
      audio: {
        profile: v.audio_profile,
        foreground_events_max: v.audio_profile === "setup_riser_and_payoff" ? 2 : 1,
        voice_priority: true,
        events: audio.events,
        event_positions_normalized: audio.event_positions_normalized,
      },
      editable_controls: ["duration_within_bounds", "user_media", "crop_and_focal_anchor", "serif_style_pack", "palette", "text", "easing_character", "audio_binding"],
      quality: {
        effort_tier: null,
        primary_cue_count: 1,
        required_reviews: ["story_fit", "font_load", "banned_motif_preflight", "phone_legibility", "entry_exit_continuity", "encoded_output"],
      },
      hard_locks: {
        serif_only: true,
        decorative_top_bottom_notes: false,
        diagonal_or_crossing_line_fields: false,
        pseudo_wayfinding_counters: false,
        small_accent_kicker_with_detached_rule: false,
        unapproved_asset_substitution: false,
        structural_oblique_content_planes_allowed: true,
      },
      material_binding_status: "WAITING_FOR_USER_SELECTION",
      provenance: { variant_curated: true, style_copied_from_reference: false },
    });
  });
}

// Effort is hand-curated with each viewer-perceptible variant. It is not derived
// from color, aspect ratio, font, or a coarse duration/group score.
for (const t of templates) {
  const variantNo = Number(t.id.slice(-2));
  const curatedVariant = curatedEntries.find(v => v.family_id === t.family_id && v.variant_no === variantNo);
  t.quality.effort_tier = curatedVariant.effort_tier;
}

const families = FAMILIES.map(f => ({
  id: f.id,
  group_code: f.group,
  group: GROUPS[f.group].name,
  slug: f.slug,
  name: f.name,
  narrative_job: f.job,
  narrative_job_key: JOB_KEYS[f.id],
  template_count: f.bandCounts.reduce((a,b)=>a+b,0),
  duration_distribution: Object.fromEntries(BAND_ORDER.map((b,i)=>[b,f.bandCounts[i]])),
  canonical_slots: f.slots.map(slotFromKey),
  canonical_text_slots: f.texts.map(textFromKey),
  semantic_motion: { camera_verb: f.cameraVerb, object_verb: f.objectVerb },
  source_lineage: f.source,
}));

const library = {
  schema_version: "1.0",
  title: "Master Short-Edit Template Library",
  generated_at: new Date().toISOString(),
  state: "wireframe specifications awaiting user-selected styles and materials",
  template_count: templates.length,
  family_count: families.length,
  global_policy: {
    typography: "serif_only",
    decorative_top_bottom_notes: false,
    diagonal_or_crossing_line_fields: false,
    pseudo_wayfinding_counters: false,
    small_accent_kicker_with_detached_rule: false,
    structural_oblique_content_planes_allowed: true,
    structural_oblique_planes_are_not_decorative_diagonal_fields: true,
    one_primary_attention_cue: true,
    user_assets_required_when_slot_is_required: true,
  },
  duration_bands: BANDS,
  groups: GROUPS,
  families,
  templates,
};

fs.writeFileSync(path.join(libraryDir, "templates.json"), JSON.stringify(library, null, 2) + "\n");
fs.writeFileSync(path.join(libraryDir, "templates.jsonl"), templates.map(t => JSON.stringify(t)).join("\n") + "\n");
fs.writeFileSync(path.join(libraryDir, "families.json"), JSON.stringify({ schema_version: "1.0", groups: GROUPS, duration_bands: BANDS, families }, null, 2) + "\n");

const csvEscape = value => `"${String(value ?? "").replaceAll('"','""')}"`;
const csvColumns = ["id","family_id","group","name","narrative_job","signature","band","min_s","default_s","max_s","effort_tier","edit_form","spatial_mode","spatial_settle","primary_attention","audio_profile","required_asset_slots","all_asset_slots","text_slots","source_lineage","binding_status"];
const csvRows = templates.map(t => [
  t.id,t.family_id,t.group,t.name,t.narrative.job,t.narrative.signature,t.timing.band,t.timing.min_s,t.timing.default_s,t.timing.max_s,t.quality.effort_tier,t.choreography.edit_form,t.spatial_composition.mode,t.spatial_composition.settle_mode,t.choreography.primary_attention,t.audio.profile,
  t.slots.filter(s=>s.required).map(s=>s.id).join(" | "), t.slots.map(s=>s.id).join(" | "), t.text_slots.map(s=>s.id).join(" | "), t.source_lineage.join(" | "), t.material_binding_status,
]);
fs.writeFileSync(path.join(libraryDir, "template-index.csv"), [csvColumns, ...csvRows].map(r=>r.map(csvEscape).join(",")).join("\n") + "\n");

const selectionColumns = ["selected","template_id","template_name","narrative_purpose","target_duration_s","selected_style_reference_paths","primary_media_path","secondary_media_paths","crop_or_focal_subject","exact_text","data_or_source_text","display_serif","text_serif","accent_color","voice_sfx_music_cue","transition_in_out","rights_or_source_note","user_notes"];
const selectionRows = templates.map(t => ["",t.id,t.name,t.narrative.job,t.timing.default_s,"","","","","","","","","","","","",""]);
fs.writeFileSync(path.join(libraryDir, "selection-and-materials-sheet.csv"), [selectionColumns, ...selectionRows].map(r=>r.map(csvEscape).join(",")).join("\n") + "\n");

let md = `# Short-edit template catalog\n\n**240 canonical choreography specifications across 32 families, each with a real playable generic procedural MP4 demonstration and guide audio.** Audition them in \`../template-browser.html\`; direct files live under \`../previews/videos/<group>/\`, with posters and metadata in \`../previews/preview-manifest.json\`. These low-resolution demonstrations show choreography, timing, focal travel, spatial staging, transitions, and audio-event placement. The library deliberately mixes frontal clarity with yawed panels, tilted planes, depth stacks, corridors, oblique splits, and orbital arrangements. Structural slanted content planes are allowed; decorative diagonal/crosshatch fields remain banned. These are not final user-bound edits: each still waits for the user's chosen style and materials.\n\n`;
for (const [groupCode, group] of Object.entries(GROUPS)) {
  md += `## ${groupCode} — ${group.name}\n\n${group.question}\n\n`;
  for (const family of families.filter(f=>f.group_code===groupCode)) {
    md += `### ${family.id} — ${family.name} (${family.template_count})\n\n${family.narrative_job}. Required/optional slots: ${family.canonical_slots.map(s=>`${s.id}${s.required ? "" : "?"}`).join(", ") || "none"}.\n\n`;
    md += `| ID | Variant | Band | Default | Effort | Spatial mode | Signature |\n|---|---|---:|---:|---|---|---|\n`;
    for (const t of templates.filter(t=>t.family_id===family.id)) md += `| ${t.id} | ${t.name} | ${t.timing.band} | ${t.timing.default_s.toFixed(2)}s | ${t.quality.effort_tier} | ${t.spatial_composition.mode} | ${t.narrative.signature.replaceAll("|","/")} |\n`;
    md += "\n";
  }
}
fs.writeFileSync(path.join(libraryDir, "template-catalog.md"), md);

const compact = templates.map(t => ({
  id:t.id, family:t.family_id, group:t.group, name:t.name, jobKey:t.narrative.job_key, job:t.narrative.job, signature:t.narrative.signature,
  band:t.timing.band, duration:t.timing.default_s, effort:t.quality.effort_tier, edit:t.choreography.edit_form,
  attention:t.choreography.primary_attention, audio:t.audio.profile, spatial:t.spatial_composition.mode, settle:t.spatial_composition.settle_mode, slots:t.slots.map(s=>`${s.id}${s.required?"":"?"}`),
}));
const htmlData = JSON.stringify(compact).replaceAll("</script", "<\\/script");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Master short-edit library</title><style>
*{box-sizing:border-box}body{margin:0;background:#11110f;color:#f2ede3;font-family:Georgia,"Times New Roman",serif}button,input,select{font-family:Georgia,"Times New Roman",serif}main{max-width:1440px;margin:auto;padding:48px 5vw 80px}h1{font-size:clamp(38px,6vw,86px);line-height:.96;margin:0 0 20px;font-weight:600}p{font-size:19px;line-height:1.5;max-width:900px;color:#cfc6b7}.controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:12px;margin:36px 0 12px}.controls #q{grid-column:span 2}.controls input,.controls select,.controls button,.toggle{width:100%;border:1px solid #5c554a;background:#191816;color:#f2ede3;padding:13px 14px;font-size:16px;border-radius:8px}.toggle{display:flex;align-items:center;gap:8px;cursor:pointer}.toggle input{width:auto;padding:0;accent-color:#d9a15f}.stats{margin:0 0 18px;color:#bdb29f;font-size:16px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}.card{border:1px solid #403c35;background:#181714;padding:16px;border-radius:12px;min-height:470px;display:flex;flex-direction:column}.selected{outline:2px solid #d9a15f}.preview-trigger{display:block;width:100%;padding:0;border:1px solid #4a453d;border-radius:8px;overflow:hidden;background:#0d0d0c;color:#f2ede3;cursor:pointer;text-align:left}.preview-media{position:relative;display:block;aspect-ratio:16/9;background:radial-gradient(circle at 50% 42%,#322e27,#12110f 68%);overflow:hidden}.preview-media img{display:block;width:100%;height:100%;object-fit:cover}.preview-fallback{position:absolute;inset:0;display:grid;place-items:center;padding:18px;text-align:center;color:#bdb29f;font-size:17px}.preview-media img+.preview-fallback{display:none}.preview-media.poster-error img{display:none}.preview-media.poster-error .preview-fallback{display:grid}.play-mark{position:absolute;left:50%;top:50%;width:54px;height:54px;display:grid;place-items:center;transform:translate(-50%,-50%);border-radius:50%;background:rgba(17,17,15,.78);border:1px solid #e7dfd1;font-size:24px;line-height:1}.preview-status{position:absolute;left:10px;bottom:10px;padding:5px 8px;border-radius:999px;background:rgba(17,17,15,.86);border:1px solid #5c554a;font-size:13px}.preview-trigger.unavailable{cursor:not-allowed}.preview-trigger.unavailable .play-mark{display:none}.id{margin-top:15px;font-size:15px;color:#d9a15f}.card h2{font-size:25px;line-height:1.08;margin:10px 0}.meta{color:#aaa08f;font-size:15px}.spatial-badge{display:inline-block;margin-top:8px;padding:5px 8px;border:1px solid #5c554a;border-radius:999px;color:#d9a15f;font-size:14px}.sig{font-size:17px;line-height:1.42;color:#e7dfd1;flex:1}.slots{color:#b7ab98;font-size:14px}.pick{margin-top:15px;display:flex;gap:8px;align-items:center}.pick input{accent-color:#d9a15f}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.actions button,.dialog-actions button,.dialog-close{border:1px solid #5c554a;background:#191816;color:#f2ede3;padding:12px 14px;font-size:16px;border-radius:8px;cursor:pointer}.actions button:disabled,.dialog-actions button:disabled{opacity:.45;cursor:not-allowed}.preview-dialog{width:min(980px,calc(100vw - 30px));border:1px solid #5c554a;border-radius:14px;background:#151412;color:#f2ede3;padding:18px}.preview-dialog::backdrop{background:rgba(0,0,0,.78)}.dialog-head{display:flex;align-items:start;justify-content:space-between;gap:20px}.dialog-head h2{font-size:clamp(25px,4vw,40px);margin:5px 0 14px}.dialog-close{white-space:nowrap}.player-shell{position:relative;aspect-ratio:16/9;background:#090908;border:1px solid #403c35;border-radius:9px;overflow:hidden;display:grid;place-items:center}.player-shell video{display:block;width:100%;height:100%;background:#090908}.player-shell.failed video,.player-shell.missing video{display:none}.player-message{display:none;max-width:520px;padding:25px;text-align:center;color:#cfc6b7;font-size:18px;line-height:1.45}.player-shell.failed .player-message,.player-shell.missing .player-message{display:block}.dialog-meta{margin:12px 0;color:#bdb29f;font-size:16px}.dialog-actions{display:flex;flex-wrap:wrap;gap:9px}@media(max-width:980px){.controls #q{grid-column:span 1}}@media(max-width:620px){main{padding:28px 16px 60px}.controls{grid-template-columns:1fr}.controls #q{grid-column:auto}.grid{grid-template-columns:1fr}.card{min-height:0}.dialog-head{display:block}.dialog-close{margin-bottom:8px}}
</style></head><body><main><h1>240 short-edit templates</h1><p>Choose choreography by narrative job and spatial staging, then audition its rendered demonstration. The library includes frontal clarity, yawed editorial planes, layered perspective, oblique splits, corridors, and orbital arrangements. Every authored text role is serif. Decorative diagonal/crosshatch fields and the other rejected motifs remain locked out.</p><section class="controls"><input id="q" aria-label="Search" placeholder="Search job, signature, name, or ID"><select id="group"><option value="">All groups</option></select><select id="band"><option value="">All durations</option></select><select id="effort"><option value="">All effort tiers</option></select><select id="spatial"><option value="">All spatial compositions</option></select><select id="previewStatus" aria-label="Preview status"><option value="">All preview states</option><option value="playable">Playable previews</option><option value="missing">Unavailable previews</option></select><label class="toggle"><input id="selectedOnly" type="checkbox">Selected only</label></section><div class="stats" id="stats"></div><section class="grid" id="grid"></section><div class="actions"><button id="copy">Copy selected template IDs</button><button id="reviewSelected" disabled>Review selected previews</button></div></main><dialog class="preview-dialog" id="previewDialog" aria-labelledby="dialogTitle"><div class="dialog-head"><h2 id="dialogTitle">Template preview</h2><form method="dialog"><button class="dialog-close" value="close" aria-label="Close preview">Close</button></form></div><div class="player-shell" id="playerShell"><video id="previewVideo" controls muted playsinline preload="metadata"></video><div class="player-message" id="playerMessage">Preview unavailable.</div></div><div class="dialog-meta" id="dialogMeta"></div><div class="dialog-actions"><button id="previousPreview" type="button">Previous</button><button id="nextPreview" type="button">Next</button><button id="selectCurrent" type="button">Select template</button></div></dialog><script src="previews/preview-manifest.js"></script><script>
const data=${htmlData};const $=s=>document.querySelector(s);const group=$('#group'),band=$('#band'),effort=$('#effort'),spatial=$('#spatial'),previewStatus=$('#previewStatus'),selectedOnly=$('#selectedOnly'),grid=$('#grid'),stats=$('#stats'),dialog=$('#previewDialog'),video=$('#previewVideo'),playerShell=$('#playerShell'),playerMessage=$('#playerMessage'),dialogTitle=$('#dialogTitle'),dialogMeta=$('#dialogMeta'),selectCurrent=$('#selectCurrent'),storageKey='master-video-system:selected-template-ids:v1',picked=new Set(),manifestRows=Array.isArray(window.__templatePreviews)?window.__templatePreviews:[],previewMap=new Map(manifestRows.filter(x=>x&&x.id).map(x=>[String(x.id),x]));let visibleRows=data,currentPreviewId=null,reviewSelectedMode=false,posterObserver=null;
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(saved))for(const id of saved)if(data.some(x=>x.id===id))picked.add(id)}catch{}
for(const v of [...new Set(data.map(x=>x.group))])group.insertAdjacentHTML('beforeend','<option>'+esc(v)+'</option>');for(const v of ['micro','sting','beat','explain','hold','hero'])band.insertAdjacentHTML('beforeend','<option>'+v+'</option>');for(const v of ['functional','enhanced','hero'])effort.insertAdjacentHTML('beforeend','<option>'+v+'</option>');for(const v of ['frontal','yaw_left','yaw_right','tilt_plane','depth_stack','corridor','oblique_split','orbital'])spatial.insertAdjacentHTML('beforeend','<option value="'+v+'">'+v.replaceAll('_',' ')+'</option>');
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify([...picked]))}catch{}}
function previewFor(id){const raw=previewMap.get(id);if(!raw)return{id,status:'missing',playable:false,video:null,poster:null};const declared=String(raw.status||'ready').toLowerCase(),playable=['ready','playable','complete','rendered'].includes(declared),folder=id.slice(0,2);return{id,status:playable?'playable':'missing',playable,video:raw.video||raw.video_path||('previews/videos/'+folder+'/'+id+'.mp4'),poster:raw.poster||raw.poster_path||('previews/posters/'+folder+'/'+id+'.webp'),duration:raw.duration_s,hasAudio:Boolean(raw.has_audio)}}
function loadPoster(img){if(!img||!img.dataset.src)return;img.addEventListener('error',()=>img.closest('.preview-media')?.classList.add('poster-error'),{once:true});img.src=img.dataset.src;delete img.dataset.src}
function observePosters(){posterObserver?.disconnect();const images=[...grid.querySelectorAll('img[data-src]')];if(!('IntersectionObserver'in window)){images.forEach(loadPoster);return}posterObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){loadPoster(entry.target);posterObserver.unobserve(entry.target)}},{rootMargin:'420px 0px'});images.forEach(img=>posterObserver.observe(img))}
function reviewQueue(){const selected=data.filter(x=>picked.has(x.id)&&previewFor(x.id).playable);return reviewSelectedMode?selected:visibleRows.filter(x=>previewFor(x.id).playable)}
function updateDialogSelection(){if(!currentPreviewId)return;selectCurrent.textContent=picked.has(currentPreviewId)?'Remove selection':'Select template'}
function draw(){const query=$('#q').value.toLowerCase();visibleRows=data.filter(x=>(!query||JSON.stringify(x).toLowerCase().includes(query))&&(!group.value||x.group===group.value)&&(!band.value||x.band===band.value)&&(!effort.value||x.effort===effort.value)&&(!spatial.value||x.spatial===spatial.value)&&(!previewStatus.value||previewFor(x.id).status===previewStatus.value)&&(!selectedOnly.checked||picked.has(x.id)));const playableCount=data.filter(x=>previewFor(x.id).playable).length;stats.textContent='Showing '+visibleRows.length+' of '+data.length+'; '+picked.size+' selected; '+playableCount+' playable previews.';grid.innerHTML=visibleRows.map(x=>{const p=previewFor(x.id),poster=p.playable?'<img alt="Preview poster for '+esc(x.name)+'" loading="lazy" decoding="async" data-src="'+esc(p.poster)+'">':'';return '<article class="card '+(picked.has(x.id)?'selected':'')+'"><button type="button" class="preview-trigger '+(p.playable?'':'unavailable')+'" data-preview-id="'+esc(x.id)+'" aria-label="'+(p.playable?'Play preview for ':'Preview unavailable for ')+esc(x.name)+'"><span class="preview-media">'+poster+'<span class="preview-fallback">'+(p.playable?'Loading preview poster':'Preview file unavailable')+'</span>'+(p.playable?'<span class="play-mark" aria-hidden="true">▶</span>':'')+'<span class="preview-status">'+(p.playable?'Playable':'Unavailable')+'</span></span></button><div class="id">'+esc(x.id)+' · '+esc(x.family)+'</div><h2>'+esc(x.name)+'</h2><div class="meta">'+esc(x.band)+' · '+x.duration.toFixed(2)+'s · '+esc(x.effort)+'</div><div class="spatial-badge">Spatial: '+esc(x.spatial.replaceAll('_',' '))+' · '+esc(x.settle.replaceAll('_',' '))+'</div><p class="sig">'+esc(x.signature)+'</p><div class="slots">Slots: '+esc(x.slots.join(', '))+'</div><label class="pick"><input type="checkbox" data-select-id="'+esc(x.id)+'" '+(picked.has(x.id)?'checked':'')+'> Select</label></article>'}).join('');for(const box of grid.querySelectorAll('input[data-select-id]'))box.onchange=()=>{box.checked?picked.add(box.dataset.selectId):picked.delete(box.dataset.selectId);persist();draw();updateDialogSelection()};for(const trigger of grid.querySelectorAll('[data-preview-id]'))trigger.onclick=()=>openPreview(trigger.dataset.previewId,false);observePosters();$('#reviewSelected').disabled=!data.some(x=>picked.has(x.id)&&previewFor(x.id).playable)}
function resetPlayer(){video.pause();video.removeAttribute('src');video.removeAttribute('poster');video.load();playerShell.classList.remove('failed','missing');playerMessage.textContent='Preview unavailable.'}
function showDialog(){if(typeof dialog.showModal==='function'&&!dialog.open)dialog.showModal();else dialog.setAttribute('open','')}
function openPreview(id,fromSelected){const item=data.find(x=>x.id===id);if(!item)return;const p=previewFor(id);currentPreviewId=id;reviewSelectedMode=Boolean(fromSelected);resetPlayer();dialogTitle.textContent=id+' · '+item.name;dialogMeta.textContent=item.duration.toFixed(2)+'s · '+item.band+' · '+item.effort+' · '+item.spatial.replaceAll('_',' ')+(p.hasAudio?' · audio available':'');updateDialogSelection();if(!p.playable){playerShell.classList.add('missing');playerMessage.textContent='The preview file or manifest record is unavailable. Run the preview validator; the template specification remains selectable.';showDialog();return}video.poster=p.poster;video.src=p.video;video.load();showDialog();const attempt=video.play();if(attempt&&typeof attempt.catch==='function')attempt.catch(()=>{})}
function stepPreview(delta){const queue=reviewQueue();if(!queue.length)return;let index=queue.findIndex(x=>x.id===currentPreviewId);if(index<0)index=0;else index=(index+delta+queue.length)%queue.length;openPreview(queue[index].id,reviewSelectedMode)}
async function copyText(value){if(navigator.clipboard?.writeText)try{await navigator.clipboard.writeText(value);return true}catch{}const area=document.createElement('textarea');area.value=value;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();let ok=false;try{ok=document.execCommand('copy')}catch{}area.remove();return ok}
for(const el of [$('#q'),group,band,effort,spatial,previewStatus,selectedOnly])el.addEventListener(el.tagName==='INPUT'?'input':'change',draw);$('#copy').onclick=async()=>{const button=$('#copy');if(!picked.size){button.textContent='Nothing selected';setTimeout(()=>button.textContent='Copy selected template IDs',1200);return}const ok=await copyText([...picked].join(', '));button.textContent=ok?'Copied':'Copy unavailable';setTimeout(()=>button.textContent='Copy selected template IDs',1200)};$('#reviewSelected').onclick=()=>{const queue=data.filter(x=>picked.has(x.id)&&previewFor(x.id).playable);if(queue.length)openPreview(queue[0].id,true)};$('#previousPreview').onclick=()=>stepPreview(-1);$('#nextPreview').onclick=()=>stepPreview(1);selectCurrent.onclick=()=>{if(!currentPreviewId)return;picked.has(currentPreviewId)?picked.delete(currentPreviewId):picked.add(currentPreviewId);persist();draw();updateDialogSelection()};video.addEventListener('error',()=>{playerShell.classList.add('failed');playerMessage.textContent='The preview file could not be loaded. Check the manifest path or render status.'});video.addEventListener('ended',()=>{if(reviewSelectedMode&&reviewQueue().length>1)stepPreview(1)});dialog.addEventListener('close',()=>{resetPlayer();currentPreviewId=null;reviewSelectedMode=false});draw();
</script></body></html>`;
fs.writeFileSync(path.join(out, "template-browser.html"), html);

console.log(JSON.stringify({ output: out, templates: templates.length, families: families.length, bands: Object.fromEntries(BAND_ORDER.map(b=>[b,templates.filter(t=>t.timing.band===b).length])), effort: Object.fromEntries(["functional","enhanced","hero"].map(e=>[e,templates.filter(t=>t.quality.effort_tier===e).length])) }, null, 2));
