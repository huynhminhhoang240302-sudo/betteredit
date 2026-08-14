# Rendered choreography demonstrations

This directory contains 240 real, playable, low-resolution v2 MP4 demonstrations: one for every canonical template ID. They use generic procedural visuals and synthetic guide audio to expose timing, reveal order, focal travel, spatial composition, transition class, and semantic audio placement before project materials are selected.

They are not final user-bound edits. Do not treat the placeholder subjects, labels, palette, textures, or guide audio as an approved style or as source material for a client project.

## Spatial preview balance

The v2 layer intentionally avoids an all-frontal library. Its exact modes are: `frontal` 36, `yaw_left` 23, `yaw_right` 22, `tilt_plane` 26, `depth_stack` 37, `corridor` 40, `oblique_split` 37, and `orbital` 19. That makes **204/240 previews non-frontal**.

Yawed and trapezoidal content planes, depth stacks, corridors, restrained orbits, parallax, cropping, and motivated occlusion are structural staging and are encouraged. They remain distinct from the permanent ban on decorative repeated diagonal stripe, hatch, crosshatch, or crossed-line fields. All newly designed text remains serif and screen-facing by default; short diegetic copy may follow a focal plane only within 18° yaw, 10° pitch, 5° roll, at least 80% apparent dimensions, safe-area clearance, and phone readability.

## Files

- `videos/<group>/<template-id>.mp4` — H.264/yuv420p video at 960×540 and 30 fps, with AAC 48 kHz stereo guide audio.
- `posters/<group>/<template-id>.webp` — browser poster for the same template ID.
- `preview-manifest.json` — canonical 240-record metadata, relative paths, duration, dimensions, audio state, spatial/settle modes, file sizes, SHA-256 hashes, poster time, and v2 provenance.
- `preview-manifest.js` — local playback index consumed by `../template-browser.html` without requiring a web server.

## Play and compare

Open `../template-browser.html`, use the **Spatial composition** filter to compare frontal, yawed, tilted, stacked, corridor, oblique-split, and orbital options, click a poster, and play the demonstration in the dialog. Playback begins muted; unmute the video control to hear the guide audio. Select template IDs, then use **Review selected previews** to compare the selected playable set.

Direct MP4 paths are stable: for example, template `EX03-07` lives at `videos/EX/EX03-07.mp4`.

## Validate

From the package directory, run:

```powershell
node tools\validate-previews.mjs
```

The complete pass validates exactly 240 IDs, the exact eight-mode spatial distribution, schema structure, unique paths, media and poster presence, sizes, hashes, timing bounds, H.264/yuv420p video, 960×540 dimensions, 30 fps, AAC 48 kHz stereo audio, successful decoding, and real frame-to-frame motion. Use `node tools\validate-previews.mjs --sample 12` only for a quick smoke test.

The contact sheets in `contact-sheets/` provide one-frame visual indexes; they do not replace playing the clips. `8-spatial-modes.webp` samples four templates from each spatial mode, `32-family-overview.webp` samples every family, and `all-240-previews.webp` indexes the complete set. Regenerate the deterministic generic layer from the workspace root with:

```powershell
node work\render_preview_library.mjs --force --concurrency 4
node work\make_preview_contact_sheets.mjs
node outputs\master-video-system\tools\validate-previews.mjs
```

## Replace the generic material

1. Audition and select template IDs in the browser.
2. Record the user's style references and exact media in `../library/selection-and-materials-sheet.csv`.
3. Create one binding per selected ID and map approved files to its declared slots.
4. Keep unavailable required slots explicit as `WAITING_FOR_USER_MATERIAL`; never silently substitute stock or generated media.
5. Apply the approved serif-only style pack and replace the procedural stand-ins.
6. Render a new low-resolution user-bound sequence for approval, then run full final-render QA.

For each new style family, retain four representative approval frames here or in the project delivery folder: typography-heavy, media-heavy, data/mechanism, and transition-extrema. Final renders belong in the project's normal delivery folder with selected template IDs, style-pack ID, binding records, and QA report.
