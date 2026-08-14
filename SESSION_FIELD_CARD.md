# Master video session field card

Use beside the script, storyboard, or timeline. The full rules live in `MASTER_GUIDE.md`.

## Non-negotiable

- All newly designed visible text is serif, including captions, labels, numbers, charts, credits, and placeholders. Verify the real font files load.
- No decorative top/bottom notes, split edge metadata, or note rails.
- No decorative repeated diagonal stripe, hatch, crosshatch, or crossed-line field resembling the rejected example in frames or transitions. Factual grids, networks, architecture, and mechanism geometry may remain only when explanatory and not stylized into that look.
- Structural oblique staging is encouraged: bounded yawed/trapezoidal content planes, depth stacks, corridors, orbits, parallax, and motivated occlusion are allowed. Do not confuse a content-bearing plane edge with the banned decorative diagonal field.
- No pseudo-wayfinding noun/slash/zero-padded counter.
- No small tracked accent kicker with a detached short rule.
- Do not fill a missing required slot with arbitrary stock or generated media. Mark `WAITING_FOR_USER_MATERIAL`.

## Per beat

```text
Viewer question:
Narrative job:
Template ID:
Primary focal point:
One dominant attention cue:
Start → meaningful change → final state:
Camera/object verb:
Entry eye position → exit eye position:
Required user materials:
Audio state/event:
Readable payoff hold:
```

## Choose a visual mode

- A-roll for trust or emotion.
- B-roll for concrete behavior or place.
- Source/screenshot for verifiable proof.
- 2.5D for dimensional stills, cards, interfaces, and collage.
- True 3D for viewpoint change, cutaway, spatial reconstruction, or connected mechanism.
- Diagram for relationships, sequence, comparison, or data.
- Designed serif text for a short claim, question, number, or chapter phrase.
- Visual rest for absorption, anticipation, or structural punctuation.

## Choose a spatial composition

Use the template's declared mode: `frontal`, `yaw_left`, `yaw_right`, `tilt_plane`, `depth_stack`, `corridor`, `oblique_split`, or `orbital`. The library balance is frontal 36 / yaw-left 23 / yaw-right 22 / tilt 26 / stack 37 / corridor 40 / oblique split 37 / orbital 19, so 204 of 240 templates are non-frontal.

For a non-frontal mode, show persistent depth through a quadrilateral silhouette, unequal edge scale, plane-specific parallax, or meaningful overlap. Keep serif text screen-facing by default. Diegetic text may follow the focal plane only at ≤18° yaw, ≤10° pitch, ≤5° roll, ≥80% apparent width and height, with safe-area and phone-size readability.

## Motion test

Camera: locate, approach, enter, reveal, isolate, compare, trace, operate, or reintegrate.

Object: appear, separate, assemble, open, close, rotate, travel, transfer, transform, or restore.

If the motion has no information or causal verb, remove it or make it subordinate.

## Attention order

1. Composition.
2. Motion.
3. Local light/contrast.
4. Controlled color.
5. Crop/dim/blur.
6. Serif label or measurement.
7. One semantic mark.
8. Sound punctuation.

## Template selection

Rank by narrative fit, available user assets, continuity, production cost, then style compatibility. Return 3–5 candidates per important beat—not all 240. Every template ID has a real v2 generic procedural MP4 demonstration with guide audio; use the browser's **Spatial composition** filter and audition the shortlist in `template-browser.html` before selection.

Preview files: `previews/videos/<group>/<template-id>.mp4`  
Posters: `previews/posters/<group>/<template-id>.webp`  
Manifest: `previews/preview-manifest.json`

```powershell
node tools\validate-previews.mjs --sample 12
node tools\find-templates.mjs --job context --asset video --max-duration 3 --limit 5
node tools\find-templates.mjs --job human_witness_to_world --limit 5
node tools\find-templates.mjs --family EX03 --band hold --effort enhanced
node tools\create-binding.mjs HK02-03 --out binding-HK02-03.json
node tools\validate-manifest.mjs binding-HK02-03.json --type binding
```

## Approval order

1. Beat map, auditioned generic demonstrations, and template IDs.
2. Serif font-load proof and style pack.
3. User-material binding with missing slots visible.
4. Four representative stills: typography, media, mechanism/data, transition extreme.
5. Low-resolution user-bound sequence preview after the generic stand-ins are replaced.
6. Final render and encoded-file QA.

## Delivery gate

- Story promise and payoff pass.
- One focal point and one primary cue per beat.
- Eye trace, orientation, movement, luma, and audio continuity pass—or reset is narratively justified.
- Serif font inspection passes in rendered frames.
- All four banned motifs absent at first/middle/last and transition extrema.
- Declared spatial mode remains legible at a representative hold; structural plane edges are permitted, decorative diagonal fields are absent, and projected text passes the angle/readability limits.
- Safe areas, phone readability, captions, contrast, flicker, and licensing pass.
- Voice is clear; audio actions have causes; loudness and true peak meet delivery spec.
- Final encoded file plays, has correct duration/resolution/fps/codecs, and matches the approved sequence.

Only after rendered-output review may the session state that the permanent style lock passed.

The supplied 240 preview MP4s prove choreography and guide-audio relationships only. They do not approve final style, fonts, user assets, rights, crop, mix, or delivery quality.
