---
name: betteredit
description: Plan, create, edit, render, or review intentional videos with BetterEdit's bundled 240-template motion library. Use when a user asks for a video, highlight, trailer, explainer, documentary edit, motion-graphics sequence, storyboard-to-MP4 workflow, reusable edit template, template selection, media binding, edit critique, or says to use BetterEdit. Especially useful for agent-assisted edits that need serif typography, spatial 2.5D composition, continuity, audio cues, playable references, and local-first handling of user media.
---

# BetterEdit

Build an intentional video edit from the user's topic, script, narration, footage, images, audio, or data. Treat the bundled guide, 240-template registry, schemas, selectors, and playable previews as the source of truth. Do not require another BetterEdit skill or a separate guide checkout.

## Choose the task path

- For a requested finished video, follow **Produce a video** and deliver a real playable file. A script or storyboard alone is not completion.
- For planning only, produce the beat map, template chain, asset list, and execution plan without rendering.
- For an edit review, inspect the actual media and compare it with the rules below. Do not modify files unless asked.
- For library or style-system changes, read [master-guide.md](references/master-guide.md) before editing the bundled contracts.

Read [session-field-card.md](references/session-field-card.md) for every production task. Read [security-and-assets.md](references/security-and-assets.md) whenever user files, downloaded assets, credentials, publishing, or repository release are involved. Read [template-selection.md](references/template-selection.md) before choosing or chaining templates.

## Produce a video

### 1. Inspect the brief and materials

Establish the audience, purpose, duration, aspect ratio, platform, narration state, supplied media, factual sources, and delivery format. Inspect referenced files before designing around them. If a noncritical detail is missing, choose a sensible default and state it. Do not invent ownership, consent, facts, or unavailable footage.

If the user supplied assets, keep them local and record their paths, roles, rights notes, and approval state. Never upload, publish, email, or expose them without explicit permission.

### 2. Build the viewer-experience spine

Write one sentence each for:

1. Hook: the unresolved question, contradiction, threat, or visual promise.
2. Orientation: the minimum context needed to understand the subject.
3. Escalation: two or three increasingly revealing evidence or mechanism beats.
4. Turn: the correction, drawback, or hidden cause.
5. Payoff: a recomposed answer, implication, or earned conclusion.

Prefer a persistent world or object that changes state over unrelated cards. Use whole to subsystem to mechanism to operation to recomposed whole when explaining a system.

### 3. Create a timed beat map

For each beat record start/end time, narration, narrative job, focal object, desired viewer question, template ID, spatial mode, asset slots, on-screen text, motion, audio cue, continuity entry/exit, and effort tier.

Budget visual refreshes by meaning, not by a fixed cut rate. Develop strong shots internally with camera motion, object state, occlusion, focus, build animation, or representation switching. Reserve hero effort for the hook, central mechanism, and payoff.

### 4. Select real templates

Use the bundled selector; never invent IDs:

```powershell
node scripts/find-templates.mjs --job context --limit 12
node scripts/find-templates.mjs --spatial corridor --effort enhanced
node scripts/find-templates.mjs --after EX01-03 --limit 12
```

Preview candidates in `assets/template-library/template-browser.html`. The MP4s demonstrate choreography, not final styling. Select by narrative job first, continuity second, spatial composition third, asset fit fourth, and effort last.

### 5. Bind only approved material

Create a binding for each chosen template:

```powershell
node scripts/create-binding.mjs EX03-07 --out project/bindings/EX03-07.json
```

Keep required slots in `WAITING_FOR_USER_MATERIAL` until the user has selected the exact files. Do not silently substitute stock, scrape media, or claim a placeholder is approved. Validate completed bindings:

```powershell
node scripts/validate-manifest.mjs project/bindings/EX03-07.json --type binding
```

### 6. Apply the visual rules

- Use serif type for every designed text role. Accessibility subtitles may use the approved serif caption role.
- Never add decorative notes at the top or bottom edges.
- Never use repeated diagonal stripes, hatching, crosshatching, or crossed-line fields resembling the rejected references.
- Never use slash-style pseudo-wayfinding counters or a tiny accent kicker with a detached rule.
- Do use meaningful slanted planes, yaw, corridors, depth stacks, oblique splits, orbital moves, architecture, charts, routes, and mechanisms when they explain the subject.
- Keep one primary focal point per frame. Dim, blur, occlude, or simplify competing information.
- Use screen-facing titles unless text belongs meaningfully on a plane. Keep diegetic text readable and within the projection limits in the field card.
- Use emphasis text as designed phrases, usually one to three words. Keep full accessibility subtitles separate.
- Avoid copying reference footage, branding, title treatments, or unique UI literally. Transfer the editing grammar.

### 7. Design continuity and motion

Match focal position, subject scale, movement direction, orientation, object persistence, luma, and audio tail across adjacent beats. Let motion reveal meaning: camera paths establish space; visibility and build animation explain construction; exploded or sectional views expose mechanisms; color states encode system roles; constrained rigs show operation.

Use restrained frontal settling where reading needs it, while allowing the meaningful plane or world to remain spatial. Do not globally skew an entire composition merely to appear dynamic.

### 8. Design audio

Plan voice, room tone or music bed, transition cues, and local object sounds together. Use movement-to-whoosh, setup-to-riser, payoff-to-hit, and uncertainty-to-drone only when semantically earned. Let brief silence punctuate chapter changes. Aim around -14 LUFS integrated and at or below -1 dBTP for a web deliverable unless the platform requires another target.

### 9. Implement locally

Use the best renderer already available in the workspace. The skill must not require another BetterEdit skill. Prefer deterministic, inspectable source files and a reproducible render command. If no editing framework exists, create a local composition using available Node/browser/FFmpeg tooling rather than returning only prose.

Keep source media outside the installed skill. Write outputs into the user's project directory. Do not modify the bundled template library during an ordinary video job.

### 10. Render and verify

Render the requested MP4, then:

- probe duration, dimensions, frame rate, codecs, audio rate, and peak behavior;
- inspect opening, midpoint, payoff, transitions, and first frame where each font role appears;
- create a contact sheet or representative stills for visual review;
- confirm titles are complete, safe, readable, and serif;
- confirm the banned motifs are absent;
- confirm oblique shots have actual depth, occlusion, or parallax rather than a flat whole-frame skew;
- confirm every user asset used was selected and approved;
- confirm the final file plays from its absolute path.

If rendering is genuinely blocked, report the exact missing dependency or permission and preserve all source files and commands needed to resume. Do not label a text plan as a finished video.

## Review or extend the library

Treat `assets/template-library/library/templates.json` as canonical. Run:

```powershell
node scripts/validate-library.mjs
node scripts/validate-previews.mjs --sample 24
```

New templates must have a distinct narrative signature, visible choreography, continuity metadata, spatial metadata, typed audio cues, a playable MP4, a poster, and no banned motif. Preserve the exact ID contracts and validate schema changes before regenerating derived formats.

## Bundled resources

- `assets/template-library/template-browser.html`: offline searchable browser with one reusable video player.
- `assets/template-library/library/`: canonical registry, catalog, JSONL, CSV, and curated signatures.
- `assets/template-library/previews/`: 240 playable demonstrations, posters, contact sheets, and manifest.
- `assets/template-library/schema/`: template, style, binding, and preview schemas.
- `scripts/`: dependency-free selectors, binding creation, and validators; preview probing additionally uses FFmpeg/FFprobe from PATH or the relevant environment variables.
- `references/`: production rules, security policy, and selection workflow.

When presenting results, lead with the finished deliverable and link the real local files by absolute path.
