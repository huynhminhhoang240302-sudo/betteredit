# Master Video Editing and Short-Edit Template System

Status: permanent production reference for future GPT-5.6-sol video sessions  
Library model: 240 curated short-edit specifications in 32 narrative families  
Preview layer: 240 playable v2 procedural MP4 demonstrations with guide audio; 204 non-frontal  
Style status: awaiting user-selected style packs and user-selected media  

## 1. Purpose and definition

This system turns the earlier Colosseum analysis, the editing-tutorial framework, and the Quick Mix sample into a reusable production language. It is designed for explainers, documentaries, educational videos, essays, short-form sequences, product stories, and cinematic montages.

The template library has two deliberately separate layers. First, each entry is an editable specification containing:

- a narrative job;
- a duration window and internal beat timing;
- replaceable material slots;
- a focal path and reveal order;
- camera, object, typography, transition, and audio behavior;
- entry and exit continuity states;
- aspect-ratio and accessibility constraints;
- quality checks and permanent design exclusions.

Second, every specification has a real, playable, low-resolution MP4 choreography demonstration. These 240 generic procedural previews use temporary shapes, labels, textures, and synthetic guide audio to show timing, reveal order, focal travel, transition behavior, and the declared audio relationships. They are audition copies, not finished user-bound edits.

The user will later choose styles, images, videos, screenshots, 3D assets, wording, music, and sound. A future session binds those choices to the declared slots and replaces the demonstration material only in the selected templates. Missing required media remains marked `WAITING FOR USER MATERIAL`; it must not be silently replaced with arbitrary stock or AI-generated material.

The system's north star is:

> What should the viewer notice, understand, anticipate, or feel next, and what is the clearest, most satisfying way to cause that change?

Retention is earned through clarity, anticipation, emotion, and payoff. Cut count and effect count are not quality measures.

## 2. Source priority

When instructions conflict, apply them in this order:

1. The permanent style locks in this guide, unless the user explicitly names and revokes a specific lock.
2. The user's latest explicit project direction. A new reference image, broad style request, or request to “match” something does not silently revoke a lock.
3. The selected template specification and approved style pack.
4. The general story, pacing, continuity, 2.5D/3D, sound, and production principles in the earlier guides.
5. Visual references as inspiration only.

The Colosseum and editing-tutorial analyses describe source videos. Their sans-serif typography and any conflicting surface motif are not reusable instructions. Quick Mix contributes timing and choreography, not a design to copy.

## 3. Permanent style locks

These are acceptance criteria for every frame, template, title, caption, chart, annotation, transition, 2.5D scene, 3D overlay, placeholder, and generated visual.

### 3.1 Serif-only typography

Every newly designed visible text element must resolve to a true serif face:

- titles and subtitles;
- captions and lower thirds;
- labels, annotations, units, dates, and credits;
- numerals, statistics, charts, and tables;
- UI-like inserts and template placeholders.

Load and verify the actual font files before rendering. Use a serif-only fallback stack, for example:

```css
font-family: "Source Serif 4", "Noto Serif", Georgia, serif;
```

Never fall back to `sans-serif`, `system-ui`, `monospace`, Arial, Helvetica, Inter, Roboto, or another non-serif class. Rasterizing newly generated sans-serif text does not satisfy the rule.

Recommended starting families include Source Serif 4, Newsreader, Literata, Fraunces, IBM Plex Serif, Noto Serif, Lora, Merriweather, and Georgia. Prefer one family with several weights; use no more than two families in one video. Use a serif with tabular figures when aligned numerals matter.

At a 1920 × 1080 master, designed information text should normally be at least 30 px. Burned-in captions are usually 44–64 px depending on line length. Validate on a phone-size preview, not only at full resolution.

User footage may contain real signage, a product interface, or documentary text in another face. Treat that as source evidence, flag it, and crop, mask, replace, or obtain the user's explicit acceptance when it is prominent. Do not imitate it in new overlays.

### 3.2 Four prohibited motifs

| Lock | Never use | Detection shorthand | Use instead |
|---|---|---|---|
| BAN-01 | Decorative notes or metadata at the top/bottom; split edge microcopy; screen-wide note rails; tiny tracked copy attached to a long hairline | Review the top and bottom 12% of every frame; flag tiny text, paired edge fragments, or persistent rails | Empty edge space, a readable content-bearing serif title, an object-attached annotation, or a dedicated source card |
| BAN-02 | Decorative repeated diagonal stripe, hatch, crosshatch, or crossed-line fields resembling the rejected example, including striped masks/transitions | The “six similar lines” and intersecting-family tests are triage signals, not permission to use five; manually judge any repeated decorative field | Solid or tonal fields, natural paper/film/stone texture, sparse dots, one semantic path, shadow, depth, or occlusion |
| BAN-03 | `STATION / 01` and analogous pseudo-technical noun/slash/zero-padded counters such as `SECTION / 02`, `NODE / 04`, or `PHASE / 07` | OCR/DOM review for generic technical noun + separator + number, especially tiny corner labels | A direct chapter phrase, plain-language ordinal, real measurement, date, sample size, or genuine identifier |
| BAN-04 | A small uppercase/tracked accent kicker with a detached short underline | Flag a small tracked label paired with a nearby short rule, regardless of color | A larger sentence-case serif heading, a meaningful accent word, a content-connected leader, or a crop/focus reveal |

The structure of each motif is banned even if its wording, color, opacity, angle, animation, or implementation changes. Orange itself is allowed when it marks meaningful information or action. One true trajectory, trend line, cut plane, or beam is allowed; a repeated stripe field is not. A semantic underline directly beneath the exact word or datum being explained may be used sparingly; it must not become the rejected kicker-and-rule lockup.

BAN-02 targets decorative fields, not every crossing line in reality. A factual chart grid, architectural brace, map network, mechanism geometry, or data path may remain when it is necessary to understand the evidence, is not stylized into the rejected hatch look, and passes manual review. Detector counts are only review triggers.

Structural oblique staging is also explicitly allowed and encouraged. A bounded yawed, pitched, or trapezoidal plane that carries media, evidence, a diagram, or readable text is a content surface—not a diagonal pattern. Depth stacks, corridors, orbital arrangements, perspective convergence, parallax, cropping, and motivated foreground occlusion are valid ways to create viewpoint and hierarchy. Keep planes broad and content-bearing; do not fill them or the background with repeated diagonal stripes, hatches, crosshatches, or crossed-line textures. One semantic connector may join related planes when it explains a real relationship.

Designed text is screen-facing by default even when its related object sits in depth. Diegetic text may be projected onto the broad focal plane only when the readable hold stays within **18° absolute yaw, 10° absolute pitch, and 5° absolute roll**, retains at least 80% of its unprojected apparent width and height, clears safe areas, and passes phone-size review. Keep diegetic copy short. If any limit fails, return the text to a screen-facing serif overlay that is visibly anchored to the object. Never skew a long paragraph or use perspective distortion merely as decoration.

The four original examples are preserved under `source-analysis/` together with the detailed detector and repair protocol. Future sessions should inspect those images during preflight instead of relying on a vague memory of the bans.

Accessibility captions are not decorative bottom notes. Prefer sidecar captions. When burned in, use a readable centered lower-safe serif block within normal safe margins, never a tiny edge rail.

### 3.3 Permanent negative prompt

Include this in every visual-generation, template-building, and editing task:

> HARD STYLE LOCK: All newly designed visible text must use a true serif typeface, including captions, numerals, labels, charts, credits, and placeholders. Never use decorative micro-notes at the top or bottom edges; screen-wide header/footer rails; tiny split metadata; decorative repeated diagonal stripe, hatch, crosshatch, or crossed-line fields resembling the rejected example; animated striped wipes; `STATION / 01` or any analogous pseudo-technical noun/slash/zero-padded counter; or a small uppercase accent kicker with a detached short underline. Do not recreate these motifs through CSS, SVG, shaders, 3D geometry, baked textures, footage overlays, or transitions. Genuine chart, map, architectural, and mechanism lines may remain only when explanatory and not stylized into the rejected field. Use readable serif headings, object-attached annotations, negative space, solid/tonal fields, natural texture, and semantic highlights instead.

## 4. Core editing grammar

### 4.1 One beat, one job

Every beat declares:

- the viewer question it answers;
- one visual job;
- one primary focal point;
- one dominant attention cue;
- a starting state, visible change, and ending state;
- an entry eye position and exit eye position;
- its audio state and transition logic.

Valid visual jobs include hook, contradiction, orientation, proof, process, scale, comparison, evidence, mechanism, timeline, map, emotion, uncertainty, limitation, transition, payoff, synthesis, and CTA.

One or two perceptual channels may dominate a beat: cut, camera, object, typography, light/color, or foreground audio. If all channels peak together, the beat is likely exhausting rather than clear.

### 4.2 Change when meaning changes

Change the screen when the viewer's question, subject, scale, location, system state, evidence, or emotional meaning changes. Do not cut because a timer elapsed.

A long shot remains active when it develops internally through:

- a camera target or scale shift;
- a component reveal or state change;
- a focus region, label, or measurement;
- an occlusion or parallax pass;
- a lighting or color emphasis shift;
- a causal action synchronized to sound.

As a diagnostic, dense passages often benefit from a meaningful visual idea roughly every 2–5 seconds. This is not a quota. The idea may arrive without a cut.

### 4.3 Camera and object motion must explain

Give every camera move an information verb:

`locate`, `approach`, `enter`, `reveal`, `isolate`, `compare`, `trace`, `operate`, or `reintegrate`.

Give object motion a causal verb:

`appear`, `separate`, `assemble`, `open`, `close`, `rotate`, `travel`, `transfer`, `transform`, or `restore`.

If the motion has no information or causal verb, remove it or make it subordinate atmosphere.

### 4.4 Attention hierarchy

Use the lightest effective cue:

1. Composition and camera placement.
2. Motion.
3. Light or local contrast.
4. Controlled color accent.
5. Crop, dim, or blur surroundings.
6. Serif label or measurement.
7. One arrow, circle, semantic underline, or glow.
8. Sound punctuation.

Do not begin with arrows and glows. Do not encode meaning by color alone.

### 4.5 Hold the answer

Every reveal, transformed state, statistic, and finished mechanism needs a readable hold. A viewer must be able to recognize the result before the next beat removes it. The stronger or more complex the payoff, the longer the assimilation window.

## 5. Quick Mix: transferable short-edit grammar

The 7.817-second, 1920 × 1080, 60 fps Quick Mix sample uses this sequence:

`micro-proof flash → deliberate black reset → human-scale cinematic shot → wide contextual shot → stable atmospheric title build → luminance fade → decisive chapter card`

Its useful lesson is contrast in event density, not its source typography, branded text, exact gradient, footage, or software UI.

### 5.1 Reusable components

- **Proof flash:** a 3–8-frame artifact, process detail, or evidence image. Use only when it proves provenance or capability.
- **Anticipation void:** 0.25–0.75 seconds of black or true visual quiet after a dense, instantly legible event. Let an audio tail bridge the gap.
- **Human-to-world pair:** an intimate profile/detail followed by a wide environment, map, population, or system. Preserve palette, motion direction, or feature position across the hard cut.
- **Portrait portal:** a deliberate 9:16 artifact or clip staged inside a landscape canvas. It should feel like an intentional object or portal, not accidental pillarboxing.
- **Atmospheric title stage:** a dark reading zone with localized glow or tonal atmosphere outside it; one dominant serif statement.
- **Progressive clause build:** hold the main statement, then add one supporting serif phrase after the first idea is understood.
- **Luminance-led act exit:** resolve the current idea, fade toward darkness, and reduce audio energy before the next structural beat.
- **Chapter punch:** a large serif numeral, meaningful word, or short topic phrase with restrained halo and a decisive onset.

### 5.2 Timing ranges, not a metronome

| Function | Working range at 60 fps |
|---|---:|
| Micro-flash | 3–8 frames / 0.05–0.13 s |
| Anticipation gap | 15–45 frames / 0.25–0.75 s |
| Cinematic insert | 45–110 frames / 0.75–1.83 s |
| Phrase reveal | 18–48 frames / 0.30–0.80 s |
| Complete-state hold | 24–48 frames / 0.40–0.80 s |
| Act fade | 42–90 frames / 0.70–1.50 s |
| Chapter entrance | 5–12 frames, then a readable hold |

Use direct cuts for semantic expansion and causally linked shots. Use fades to dark for resolved act boundaries. Do not use black gaps, glow cards, or micro-flashes in every sequence.

The sample's measured −20.8 LUFS-I and −7 dBTP are reference behavior, not a delivery target.

## 6. Story and beat design

### 6.1 Five-line brief

Before editing, lock:

1. Audience and prior knowledge.
2. Promise.
3. Intended experience and energy.
4. What must be shown rather than narrated.
5. Primary payoff.

### 6.2 Flexible explainer spine

- Hook: familiar anchor → contradiction or hidden question → proof of access → promise.
- Orientation: only the place, time, actors, and constraints needed for the payoff.
- Visible system: scale, parts, construction, or surface behavior.
- Human stakes: users, hierarchy, risk, consequence, or practical value.
- Hidden system: whole → part → operation → whole.
- Final mechanism or callback: the largest, clearest, or most emotional answer.
- Synthesis and CTA: meaning first, promotion second.

Move the first meaningful mechanism answer earlier when that is what the audience clicked for. Context is useful only before it becomes necessary.

### 6.3 Beat card

```text
Beat ID:
Narration / exact text:
Viewer question answered:
Narrative and visual job:
Primary focal point:
Visual mode:
Starting state → action/state change → ending state:
Camera verb / object verb:
Primary attention cue:
Entry eye position / exit eye position:
Audio state and event:
Transition in / out:
Required asset slots:
Template candidates:
Effort tier:
```

## 7. Pacing engines

Choose the dominant pacing engine per sequence.

### Continuous spatial/3D mode

- Rough analytical range: 4–6 strong visual resets per minute.
- Typical median scene span: 6–10 seconds.
- Energy comes from camera travel, parallax, object operation, visibility states, cutaways, labels, and light changes inside a persistent world.
- A 30–100-second environment sequence is viable only when it contains repeated internal semantic reveals.

### Graphic/tutorial/montage mode

- Rough analytical range: 8–10 inclusive visual resets per minute through the body.
- Typical median scene span: 4–6 seconds.
- Hooks may temporarily rise higher when dense proof is readable.
- Energy comes from screen changes, typography, evidence inserts, focus treatments, and compact transitions.

Do not stack the maximum cut rate on top of maximum internal motion. Modulate: orientation/rest, explanation, and payoff/punctuation. Calm sections make hero moments feel larger.

Frame rate is a delivery and motion-quality choice, not a retention strategy. Use 60 fps when rapid UI, typography, cursor action, or especially smooth movement benefits. Thirty fps can carry a highly dynamic cinematic explainer at lower render cost.

## 8. Visual modality selector

Choose the least expensive modality that explains the idea accurately.

| Mode | Best use |
|---|---|
| A-roll | Trust, personality, confidence, emotion, and important direct statements |
| B-roll | Concrete evidence, behavior, place, texture, or real action |
| Screenshot/source | Verifiable proof; guide focus instead of displaying the whole source without help |
| 2.5D | Dimensional photos, cards, screenshots, interfaces, collage, and metaphors |
| True 3D | Viewpoint change, real depth, interior/cutaway, spatial reconstruction, connected mechanism, or simulation |
| Diagram/motion graphic | Abstract relationship, sequence, comparison, data, or rule that footage explains slowly |
| Designed text | Short claim, question, keyword, number, contrast, or chapter phrase |
| Deliberate visual rest | Absorption, anticipation, chapter punctuation, or emotional reflection |

Designed emphasis text and accessibility subtitles are separate systems. Keep emphasis sparse; keep subtitles complete.

## 9. 2.5D production system

Use 2.5D when the viewer does not need a truly changing viewpoint or physical connection between parts.

1. Separate foreground, subject, middle ground, background, labels, and atmosphere.
2. Place layers on a consistent stage or perspective grid.
3. Establish one vanishing direction and a restrained virtual-camera angle.
4. Make near layers travel farther than distant layers.
5. Use blur, shadow, occlusion, vignette, and local contrast selectively; keep the focal layer sharp.
6. Animate toward a meaningful region instead of allowing constant drift.
7. Introduce annotations only after orientation, and remove them when finished.
8. Preserve focal position or motion direction into the next beat.
9. Bind sound to the implied mass, speed, and material.

A depth map or subject matte is optional unless the planned focal path requires separation. Do not create poor pseudo-depth just to label a shot “3D.”

### 9.1 Spatial-composition axis

Direct frontal staging is only one option. Assign one of these explicit composition modes to each template and preserve it when replacing the procedural stand-ins:

| Spatial mode | Structural behavior | Library count |
|---|---|---:|
| `frontal` | Orthographic or nearly orthographic reading stage | 36 |
| `yaw_left` | Content plane turns left, with a readable focal face and depth separation | 23 |
| `yaw_right` | Mirrored right-turning content plane | 22 |
| `tilt_plane` | Bounded pitched/rolled plane used as a content surface | 26 |
| `depth_stack` | Two or more content planes separated in Z with near/far parallax | 37 |
| `corridor` | Camera travels through or beside a sequence of depth-separated planes | 40 |
| `oblique_split` | Two differently oriented content planes compare or transfer meaning | 37 |
| `orbital` | One or more content planes move on a restrained arc around a focal subject | 19 |
|  | **Non-frontal: 204 / Total: 240** | **240** |

Use a persistent quadrilateral silhouette, unequal near/far edge scale, plane-specific parallax, or foreground overlap so the spatial mode reads as actual staging rather than a brief entrance skew. A slanted composition should still settle into a legible proof state. For `frontal_for_read`, settle fully frontal only during the final reading hold; for `soft_oblique_hold`, retain a mild angle; for `spatial_hold`, preserve the depth relationship through the payoff. Avoid globally transforming a complete UI or paragraph. Build bounded content planes, then place screen-facing annotations separately when needed.

## 10. True-3D and mechanism system

### 10.1 Whole → part → operation → whole

For each mechanism:

1. Establish the complete system.
2. Preserve orientation while isolating the relevant part.
3. Show the input force or trigger.
4. Trace transmission through connected components.
5. Show the critical action.
6. Show the output or consequence.
7. Reintegrate the part into the full system.

Reveal one stage at a time. Let the viewer predict the next state, then satisfy the prediction.

### 10.2 Asset architecture

Build a medium-detail hero object, then make it explanation-ready before animation:

- separate meaningful layers and components;
- create intact, hidden, isolated, cutaway, exploded, active, inactive, and restored states as needed;
- rig only mechanisms the script explains;
- instance repeated architecture, crowds, seats, vegetation, cables, masts, lifts, and props;
- add neutral, selected, active, flow, warning, and comparison material states;
- preserve stable object IDs and label anchors;
- render object masks/IDs, depth, ambient occlusion, and motion vectors where useful;
- keep most labels editable in compositing.

Model to the explanatory camera. Prioritize silhouette, correct proportions, part separation, controls, and readable materials before invisible surface detail.

### 10.3 Useful causal patterns

- Build-on in logical order.
- Trace a path or force.
- Peel away an outer layer.
- Explode, inspect, and restore.
- Transform a state in the same frame.
- Add a human/object scale reference before stating a dimension.
- Return from component to whole for a comprehension reset.

## 11. Continuity and transitions

Every template declares an entry and exit state:

```yaml
focal_anchor: [x, y]
subject_scale: detail | close | medium | wide | aerial
motion_vector: [x, y]
orientation_key: optional
dominant_luma: low | mid | high
audio_tail: optional
object_persistence_key: optional
```

At each cut, ask:

- Where is the viewer looking now, and where must they look next?
- Do position, movement direction, scale, orientation, luma, and color connect?
- Does the next object enter from a plausible direction?
- Can the change happen inside the persistent scene?
- If continuity breaks, is the jolt narratively earned?

Preferred transition order:

1. Clean hard, clause, action, shape-match, or position-match cut.
2. Transformation within the same shot.
3. Motivated occlusion or direction bridge.
4. J-cut or L-cut using voice, ambience, or mechanism sound.
5. Full-screen stylized transition only for a real chapter, time, representation, or emotional boundary.

Use `intentional_reset` only for a chapter boundary, major contradiction, reveal, time jump, or representation change. Decorative transition packs are not a continuity system.

## 12. Audio system

Build sound as narrative structure:

1. Voice edit and cleanup.
2. Music by section and emotional function.
3. Environmental bed.
4. Mechanism or interface effects.
5. Selected transition marks.
6. Rare risers, impacts, drones, and sub anchors.
7. Intentional dips, stops, and fades.
8. Ducking, loudness, and true-peak pass.

Short templates normally use zero or one dominant foreground SFX. A second is allowed for an earned setup/payoff pair. Mechanism chains may contain several quiet component sounds, but only one event should dominate.

Every canonical template carries typed, normalized audio cues rather than a generic impact timestamp. Use the declared roles as relationships:

- `incoming_audio_start` precedes `picture_cut_reference` or `visual_reveal_reference` for a J-cut;
- `outgoing_audio_tail_end` follows `picture_cut_reference` for an L-cut;
- `setup_riser_start` precedes `payoff_hit`;
- `music_dip_start` precedes the picture change and `music_pickup` follows the turn;
- mechanism cues preserve `trigger_sound` → `transmission_sound` → `result_sound`;
- a picture-reference cue is a synchronization marker, not an audible effect.

When duration changes within a template's bounds, preserve these normalized relationships and recheck them against the actual voice and visible action.

Useful Quick Mix-derived behavior:

- let an impact decay across black;
- enter selected footage on a meaningful transient;
- use a 250–800 ms motion body only for a visible focus/scale/title move;
- reduce energy for 0.5–1.2 seconds before a chapter punch;
- let the bed and picture fade together at an act close.

For a narrated web master, target approximately −14 to −16 LUFS-I, 3–6 LU LRA, and −1.0 to −1.5 dBTP unless the delivery platform specifies otherwise. Verify the final delivery encode. Voice remains dominant. A riser must predict a real payoff; a whoosh must have a visible cause.

## 13. The 240-template / 32-family library

### 13.1 Four separable layers

1. **Family:** stable narrative/edit grammar, such as whole-part-whole or human-to-world.
2. **Curated variant:** duration, slot topology, reveal order, focal path, motion sequence, audio map, and continuity contract.
3. **Style pack:** user-approved serif type, palette, surfaces, lighting, grain, borders, easing character, and sound palette.
4. **Content binding:** the user's exact images, videos, screenshots, text, maps, 3D assets, music, and SFX.

Changing color, serif family, aspect ratio, mirrored layout, easing, grain, or the media inside an equivalent slot does not create a new template ID.

### 13.2 Groups and exact family allocation

| Group | Families | Variants | Narrative coverage |
|---|---:|---:|---|
| `HK` Hook / entry | 4 | 28 | Blackout-to-proof, human-to-world, contradiction/question, promise evidence burst |
| `ST` Structure / title | 3 | 24 | Centered serif title build, portrait portal, meaningful chapter/step card |
| `EV` Evidence / B-roll | 4 | 32 | Hard-cut pair, detail-to-wide, aerial/location, three-shot escalation |
| `FO` Focus / typography | 3 | 24 | Keyword emphasis, statistic proof, guided screenshot/source focus |
| `SP` Spatial / 2.5D | 3 | 24 | Layered-card parallax, photo depth push, collage/portal transition |
| `EX` Explanation / mechanism | 5 | 50 | Whole-part-whole, cutaway/exploded, causal chain, path trace, same-shot transform |
| `AR` Argument / comparison | 3 | 24 | Split comparison, thesis-antithesis pivot, problem-solution turn |
| `BR` Continuity / bridge | 4 | 24 | Shape match, eye-trace match, direction/occlusion, J/L audio bridge |
| `PY` Payoff / close | 3 | 10 | Reassembly/callback, recap cascade, final synthesis/diegetic close |
|  | **32** | **240** |  |

### 13.3 Duration distribution

| Band | Range | Count | Main use |
|---|---:|---:|---|
| Micro | 0.35–0.80 s | 13 | Match cuts, flashes, bridge actions, single marks |
| Sting | 0.80–1.50 s | 38 | Resets, keywords, chapter cards, proof cuts |
| Beat | 1.50–2.50 s | 65 | Short evidence, title moves, compact comparisons |
| Explain | 2.50–4.00 s | 72 | Guided focus, multi-stage reveals, argument turns |
| Hold | 4.00–6.50 s | 42 | Spatial orientation, mechanisms, developed evidence |
| Hero | 6.50–10.00 s | 10 | Major mechanisms, reassembly, final payoff |
|  |  | **240** |  |

Effort balance: 96 functional, 120 enhanced, and 24 hero specifications. At least 60% work with ordinary footage or stills without custom 3D. The registry declares reframing logic for 16:9, 9:16, and 1:1; content-bound previews must prove each selected asset actually reframes safely. Low-complexity choices exist across the library, but spatial, mechanism, comparison, and payoff families may begin at enhanced effort because their narrative job is inherently more involved.

### 13.4 Rendered choreography demonstrations

All 240 template IDs have a v2 generic procedural MP4 under `assets/template-library/previews/videos/<group>/<template-id>.mp4`, with matching WebP posters under `assets/template-library/previews/posters/<group>/`. They are 960×540, 30 fps, H.264/yuv420p files with AAC 48 kHz stereo guide audio. `assets/template-library/previews/preview-manifest.json` records the path, duration, dimensions, hashes, poster, audio state, spatial mode, settle mode, and provenance for every file; its JavaScript wrapper supplies the same index to `assets/template-library/template-browser.html` for serverless local playback. The v2 set follows the exact §9.1 balance, so 204 of the 240 demonstrations use a non-frontal composition.

Use these files to judge choreography, pacing, reveal order, eye trace, transition class, and audio-event placement. Do not judge final brand treatment, documentary truth, image quality, 3D fidelity, typography personality, music, or final sound design from them. Their generic visuals are replaceable demonstrations, not approved source assets.

Open `assets/template-library/template-browser.html`, click a poster, and audition the animation. Playback starts muted; unmute the local player to hear the guide audio. Use the **Spatial composition** filter to compare frontal, yawed, tilted, stacked, corridor, oblique-split, and orbital options; then select IDs and use **Review selected previews** before binding material.

Validate the complete rendered preview set from the package directory with:

```powershell
node scripts\validate-previews.mjs
```

Use `node scripts\validate-previews.mjs --sample 12` only as a fast smoke test. The full command verifies the 240-record manifest, paths, hashes, posters, timing bounds, dimensions, frame rate, codecs, audio streams, and decodability. It does not replace creative playback review or the content-bound delivery gate.

### 13.5 Anti-duplication rule

A sibling variant must differ from its nearest sibling in at least two viewer-perceptible dimensions, with at least one difference in narrative job, slot topology, reveal order, focal path, or transition class.

This signature determines real novelty:

```text
narrative job
+ slot topology
+ reveal order
+ focal path
+ transition class
+ motion sequence
+ audio event map
+ entry/exit continuity contract
```

Palette swaps, font swaps, left/right mirroring, speed within bounds, aspect ratio, grain, glow, border, vignette, and optional SFX do not count as novelty.

## 14. Template and material contracts

### 14.1 Canonical template record

Do not reconstruct a template manifest from an abbreviated prose example. Copy the exact record from `assets/template-library/library/templates.json`, which is the canonical source, and validate it against `assets/template-library/schema/template.schema.json`. Every record includes identity and group fields; narrative signature and selection tags; bounded timing with at least three normalized internal beats; canvas and safe-area rules; serif typography roles; media/text slots; full choreography; entry/exit continuity; audio; editable controls; reviews; every permanent lock; and binding status.

For example, `EX03-07` is specifically “Threshold accumulation triggers a state.” Its canonical required slots are `trigger`, `component_chain`, and `result`; its optional text slots are `input_label` and `output_label`. Other EX03 variants have different choreography but the same family slot contract. Never borrow slot names from another family merely because the content feels related.

### 14.2 Every media slot declares

- stable slot ID and narrative role;
- accepted source types and quantity;
- required/optional state and fallback;
- minimum resolution and usable duration;
- transition handles and accepted frame rates;
- alpha, matte, depth-map, or object-ID requirements;
- focal anchor and expected motion vector;
- crop/reframe/loop/color policy;
- whether source text is essential;
- license and provenance.

### 14.3 Required user-material manifest

```text
Template ID:
Narrative purpose:
Target duration:
Selected style reference(s):
Primary image/video path:
Secondary image/video path(s):
Crop and focal subject:
Exact text:
Data/source text:
Serif family and weight:
Accent color:
Required entrance/state change/exit:
Voice/SFX/music cue:
Transition in/out:
Replaceable slots:
Rights/source note:
```

The selected material controls crop, focal point, movement, and feasible duration. Adapt the template to the material within its declared bounds; do not hide a face, mechanism, or essential source text under a mask or caption.

## 15. Template selection and binding workflow

Future sessions should not browse 240 entries randomly.

1. Read the permanent style locks and the script.
2. Parse the script into beat cards and name each narrative job.
3. Query by group/family, asset type, duration band, effort tier, aspect ratio, and entry continuity state.
4. Rank narrative fit first, then available assets, continuity, production cost, and style compatibility.
5. Present 3–5 strong candidates for each important beat and audition their playable generic MP4 demonstrations in `assets/template-library/template-browser.html`; use contact-sheet frames only as a supplemental overview.
6. Record the user's chosen template IDs, style reference, exact media, text, and serif families.
7. Create a content-binding manifest. Leave unavailable required assets as `WAITING FOR USER MATERIAL`.
8. Run a banned-motif preflight on representative style frames before building a full family.
9. Replace the generic demonstration slots with approved user material, then render a low-resolution user-bound sequence proof, including transition handles and time labels.
10. Obtain selection/approval, then add final treatment, narration, music, and SFX.
11. Run full static, dynamic, mobile, audio, and encoded-media QA.
12. Promote an adaptation into the canonical library only if it passes the anti-duplication rule.

For a new style family, first produce four approval stills:

- one typography-heavy template;
- one media-heavy template;
- one data or mechanism template;
- one transition frame.

Do not propagate a look across dozens of templates until those four pass.

## 16. Production workflow for GPT-5.6-sol sessions

### Phase A: brief and evidence

- Confirm audience, promise, experience, visual truth, payoff, duration, platform, aspect ratio, and delivery format.
- Inventory every provided file read-only and record provenance.
- Inspect source frame size, frame rate, duration, codecs, audio, embedded text, crop constraints, and usable handles.
- Identify what is fact, what is inference, and what requires user selection.

### Phase B: structure and template shortlist

- Build the story spine and beat cards.
- Choose the dominant pacing engine for each sequence.
- Assign functional, enhanced, and hero effort deliberately.
- Query the registry and explain each shortlisted template's narrative purpose.

### Phase C: style and material binding

- State and load the serif families.
- Define the style pack separately from the choreography.
- Map every user material to a declared slot.
- Record missing slots without guessing replacements.
- Produce the four-frame style approval packet and banned-motif preflight.

### Phase D: clarity cut and wireframes

- Remove repetition and tangents.
- Lock chapter order and rough voice timing.
- Build placeholders and low-resolution wireframes.
- Confirm one focal point, causal order, continuity states, and result holds.

### Phase E: animation and edit

- Build internal motion before adding decorative transitions.
- Preserve eye trace and object orientation.
- Use semantic camera/object verbs.
- Keep every user material, text field, mask, palette state, and timing control replaceable.

### Phase F: sound and finish

- Build voice, music, ambience, causal effects, structural marks, and intentional quiet in that order.
- Verify captions and serif rendering.
- Review story, comprehension, continuity, rhythm, audio, and finish as separate passes.
- Encode, then verify the encoded file rather than trusting the timeline.

## 17. Quality gates

### 17.1 Static template validation

- Schema is valid and all required slots are named.
- Every designed text role resolves to an approved serif font.
- No decorative text occupies the top or bottom edge bands.
- No decorative repeated diagonal/crossing field resembling the rejected example appears as a pattern token, shader, SVG, baked panel, or transition; factual explanatory geometry follows the exception in §3.2.
- A bounded structural oblique plane is not rejected merely because its outer edge is diagonal; it must carry content, preserve the declared spatial mode, and remain visually distinct from a repeated stripe/hatch/crosshatch/crossed-line field.
- OCR/DOM finds no pseudo-wayfinding slash counter.
- No small accent kicker is paired with a detached short rule.
- Exactly one primary attention cue is declared.
- Motion has an information or causal verb.
- Entry and exit continuity states exist.
- Text limits and duration bounds are respected.
- Source material with prominent conflicting text is flagged.
- Captions are sidecar or centered lower-safe serif.
- The final state has a readable hold.

Suggested BAN-03 candidate-review expression:

```regex
(?i)\b(?:station|section|scene|node|file|module|phase|step|chapter|unit)\s*[/_:–—-]\s*0?\d{1,3}\b
```

This broad expression creates a manual-review list; it is not an automatic rejection rule. Automatically reject the exact pseudo-technical construction when it is decorative, slash/separator-led, and especially zero-padded. Plain content-bearing ordinals such as “Chapter 2” or “First: establish the whole” are allowed.

### 17.2 Generic preview-library validation

The 240 supplied v2 procedural MP4s are real encoded media and must remain traceable to the canonical IDs. Run `node scripts\validate-previews.mjs` after any preview, poster, manifest, template-timing, or spatial-composition change. A pass requires exactly one preview and poster per canonical ID; matching hashes and metadata; the exact mode counts frontal 36, yaw-left 23, yaw-right 22, tilt-plane 26, depth-stack 37, corridor 40, oblique-split 37, and orbital 19; 960×540 H.264/yuv420p at 30 fps; AAC 48 kHz stereo guide audio; duration within template bounds; successful decoding; and real frame-to-frame motion.

This gate proves that the audition library is present and mechanically playable. It does not approve generic stand-ins as project media and does not certify a later style pack, font load, source crop, accessibility treatment, or final mix.

### 17.3 Dynamic user-bound preview validation

- Inspect first, middle, last, and animation extrema, not only a poster frame.
- No banned motif appears temporarily during a wipe, mask, intermediate frame, or particle state.
- No subject goes off-canvas after 16:9, 9:16, or 1:1 reframe.
- The declared spatial mode remains visible at its representative hold; text is screen-facing or stays within the diegetic projection limits in §3.2.
- No transition hides the real idea change.
- No unmotivated camera drift or competing focal cues.
- Causal templates preserve correct input → transmission → output order.
- SFX has a visible or emotional cause.
- Flash, flicker, aliasing, banding, and compression are acceptable.

### 17.4 Final review passes

1. **Story:** promise, questions, stakes, payoff, chapter order, CTA honesty.
2. **Comprehension:** focal point, causal order, labels, result holds.
3. **Continuity:** eye trace, object permanence, movement, luma, and audio bridges.
4. **Rhythm:** dead zones, overload, contrast between calm and payoff.
5. **Audio:** voice, mood, causality, restraint, loudness, true peak.
6. **Finish:** serif type, safe areas, spelling, units, accessibility, color contrast, licenses, codec verification.

The final delivery report states:

- selected template IDs and narrative purpose;
- inserted material paths and unresolved slots;
- chosen serif font files/families;
- duration, resolution, frame rate, and codecs;
- loudness/true-peak result;
- QA result and any explicit user-approved exception in source footage;
- output paths.

Use this acceptance statement only after inspecting the final render:

> Permanent style lock passed: all designed text resolves to serif; no top/bottom decorative notes or metadata rails; no diagonal hatch/crossing fields; no pseudo-wayfinding slash counters; and no small accent kicker with detached underline. Representative frames and transition extrema were checked in the final render.

## 18. Mandatory handoff for every future session

```text
MASTER VIDEO SYSTEM — NON-NEGOTIABLE HANDOFF

Read the master guide and template index before designing or editing. The latest user rules override any surface style in reference videos, earlier outputs, presets, or generated assets.

PERMANENT STYLE LOCKS
1. Every newly designed visible font is serif, including titles, captions, labels, numbers, units, charts, credits, UI-like inserts, and placeholders. Load and verify the real font files; no sans-serif, monospace, or system-ui fallback.
2. Never use decorative top/bottom notes, tiny edge metadata, split header/footer microcopy, or screen-wide note rails.
3. Never use decorative repeated diagonal stripe, hatch/crosshatch, or crossed-line fields resembling the rejected example, including striped/crosshatched transitions. Factual chart grids, map networks, architecture, and mechanism geometry are permitted only when explanatory and not stylized into that look.
4. Never use `STATION / 01` or analogous pseudo-technical noun/slash/zero-padded counters.
5. Never use a small uppercase accent kicker with a detached short underline.
6. These motifs remain banned if color, opacity, angle, wording, animation, or implementation changes.

RETAIN
- One beat has one visual job, one focal point, and one dominant attention cue.
- Change visuals when information changes; use internal motion and semantic camera moves instead of timer-driven cutting.
- Preserve eye trace, object orientation, and whole → part → operation → whole.
- Use transitions only for structural changes and sound only on meaningful actions.
- Keep text sparse, evidence-led, mobile-readable, accessible, and subordinate to visual explanation.

SESSION START
A. State the chosen serif family/families and prove the files load.
B. State selected template IDs and the narrative purpose of each.
C. Map every user image/video/style reference to a material slot. Do not fabricate a missing user-selected asset without permission.
D. Run a banned-motif preflight before scaling production.
E. Preserve editability of media, text, masks, color states, and timing.

DELIVERY GATE
Run font inspection, OCR/DOM banned-text search, edge-band review, diagonal-line review, kicker/rule review, safe-area and phone-size checks, full playback, audio/loudness checks, and encoded-file verification. Revise any failed lock before presenting delivery.
```

## Final principle

The master system is not a promise to make every second louder or busier. It is a method for making every visual and sonic decision legible, motivated, editable, and reusable. The 240 entries encode different ways to guide attention and explain meaning; their final beauty emerges only after the user chooses the style and materials that belong in them.
