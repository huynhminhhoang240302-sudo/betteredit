# Style packs

This folder is intentionally empty until the user selects a look. A style pack binds serif font files, palette, surfaces, lighting, geometry, motion character, and sound palette to canonical templates.

Start from `../examples/style-pack.awaiting-user-selection.json` and validate against `../schema/style-pack.schema.json`.

```powershell
node ..\tools\validate-manifest.mjs my-style-pack.json --type style
```

An approved style must use non-denied serif family/fallback names, reference real font files and licenses, set `font_files_verified: true`, and point to an existing captured font specimen. Visual inspection is still required because metadata cannot prove glyph design by itself.

Style packs may change the appearance of a template but may never weaken the permanent locks. Palette, font choice within the serif class, aspect ratio, mirroring, easing, grain, borders, and glow do not create new template IDs.
