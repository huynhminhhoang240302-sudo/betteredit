# Package QA report

Date: 2026-08-13  
Scope: master guide, future-session handoff, 240-template registry, 240 rendered generic previews and posters, browser playback, schemas/examples, command-line tools, Quick Mix reference bundle, and rejected-reference preservation.

## Result

**PASS for a specification, v2 rendered-demonstration, and handoff library.** All 240 template IDs have real, playable, low-resolution procedural MP4 demonstrations with synthetic guide audio. These files prove and expose choreography and spatial staging; they are not content-bound final edits. The user's style packs, image/video materials, 3D assets, wording, music, and final sound remain unbound, so render-level font/OCR/line-pattern/audio QA is still mandatory after replacement.

## Registry validation

- 240 templates and 32 families.
- Duration bands: 13 micro, 38 sting, 65 beat, 72 explain, 42 hold, 10 hero.
- Effort tiers: 96 functional, 120 enhanced, 24 hero.
- Spatial modes: frontal 36, yaw-left 23, yaw-right 22, tilt-plane 26, depth-stack 37, corridor 40, oblique-split 37, orbital 19—exactly 204/240 non-frontal.
- Unique IDs, names, and choreography signatures.
- Contiguous variant numbers within every family.
- Exactly one declared primary attention cue per template.
- Semantic camera/object verbs and readable final-state holds required.
- Entry/exit continuity states present.
- Typed audio maps preserve J-cut, L-cut, setup/payoff, music-dip, ambience-bridge, intentional-stop, and mechanism-causality ordering.
- Required material slots are user-selected and fail safely as `WAITING_FOR_USER_MATERIAL`.
- Serif-only policy and all four motif locks are present on every entry.
- Structural oblique content planes are explicitly allowed and remain distinct from the banned decorative repeated diagonal stripe/hatch/crosshatch/crossed-line field.
- No pseudo-wayfinding slash-counter construction or forbidden designed-motif language found in template names/signatures.
- JSON, JSONL, CSV, browser data, and curated-source records agree field-for-field on the values they share.
- All 240 template records and both example manifests pass the bundled schema subset validator.
- Every sibling pair differs in at least two recorded viewer-perceptible dimensions.

Machine report: `validation-report.json` and `VALIDATION.md`.

## Rendered preview validation

- 240 v2 generic procedural choreography demonstrations, one for every canonical template ID; 204 retain non-frontal staging through yawed/tilted planes, depth, corridors, oblique splits, orbits, parallax, and/or occlusion.
- Videos: `previews/videos/<group>/<template-id>.mp4`; posters: `previews/posters/<group>/<template-id>.webp`.
- Playback indexes: `previews/preview-manifest.json` for tools and `previews/preview-manifest.js` for the local browser.
- Preview format: 960×540, 30 fps, H.264/yuv420p, with AAC 48 kHz stereo guide audio.
- The full validator checks the 240-record schema, exact ID and spatial-mode coverage, unique paths, file presence, sizes, SHA-256 hashes, posters, timing bounds, dimensions, frame rate, codecs, audio streams, successful decoding, and real frame-to-frame motion.

Run from the package directory:

```powershell
node tools\validate-previews.mjs
```

`--sample N` is a smoke test only. Mechanical validation does not replace watching the demonstrations or reviewing a later user-bound render.

## Browser QA

- Desktop viewport 1440×1000: 240 cards rendered; no horizontal overflow.
- Mobile viewport 390×844: 240 cards rendered; no horizontal overflow.
- Computed body stack: `Georgia, "Times New Roman", serif` on both viewports.
- Search filter responded (`causal` returned 55 matches in the tested build); canonical narrative-job keys also returned the expected HK02, ST02, and EX03 families.
- The Spatial composition filter exposes all eight modes and can isolate the 36 frontal previews from the 204 non-frontal previews.
- Selection state updated correctly.
- Copy-selected-IDs action completed.
- Every card can expose its poster and local MP4 through the manifest; the dialog supports playback, previous/next comparison, selection, and review of the selected playable set. Playback begins muted and can be unmuted for guide audio.
- Manual screenshot review found no decorative edge-note rail, repeated diagonal stripe/hatch/crosshatch/crossed-line field, pseudo-wayfinding counter, or kicker/rule lockup. Bounded trapezoidal content planes and semantic connectors were retained as allowed structural staging.

Preview: `template-browser-preview.png`.

## Tool smoke tests

- `find-templates.mjs` returned valid filtered HK02 candidates with required slots and specific signatures.
- Continuity ranking returned differentiated 0–100 compatibility scores rather than a saturated match list.
- `create-binding.mjs` produced a replaceable-slot binding for `HK02-03`.
- The generated binding passed canonical slot, duration, missing-material, and approval-state validation.
- Negative manifest fixtures were correctly rejected, including structurally incomplete style/binding objects, an `Inter`/`Arial` pack falsely labeled serif, and a required `provided` asset with null path/rights.
- All six tool modules/scripts passed Node syntax checks, including the rendered-preview validator.
- All schema and example JSON files parsed successfully.
- Audio coverage now contains typed cue maps for all 240 templates; relational tests verify J starts before picture, L tails after picture, setup before payoff, dip before pickup, ambience before destination, stop before/at its visual event, and trigger before transmission before result.

## Reference verification

The preserved Quick Mix MP4 was decoded as:

- 7.817 seconds;
- 1920×1080;
- H.264 video at 60 fps;
- AAC stereo audio at 48 kHz;
- 2,478,104 bytes.

The rebuilt contact sheet uses serif-authored header and timestamp text. Non-serif lettering inside source frames remains documentary evidence from the supplied MP4 and is not reused as the template typography system.

## Required QA after user binding

Before any template-bound video may be called complete, verify the actual rendered output:

- each real serif font role loads in a captured font specimen, in the first rendered frame where that role appears, and in representative later frames;
- screen-facing serif text remains attached to its subject, or short diegetic text stays within 18° yaw, 10° pitch, 5° roll, at least 80% apparent dimensions, safe areas, and phone-size readability;
- OCR/DOM and visual review catch embedded/source text and all four prohibited motifs;
- the selected spatial mode remains visible at its representative hold and is not flattened into direct frontal staging;
- first/middle/last and transition-extrema frames pass;
- safe areas, phone-size readability, captions, contrast, flicker, and licenses pass;
- voice, sound causality, loudness, and true peak pass;
- final encoded duration, canvas, fps, codecs, playback, and output path pass.
