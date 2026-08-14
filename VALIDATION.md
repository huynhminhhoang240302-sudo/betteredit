# Library validation

**PASS**

- Templates: 240
- Families: 32
- Duration bands: micro 13, sting 38, beat 65, explain 72, hold 42, hero 10
- Effort tiers: functional 96, enhanced 120, hero 24
- Spatial modes: frontal 36, yaw_left 23, yaw_right 22, tilt_plane 26, depth_stack 37, corridor 40, oblique_split 37, orbital 19
- Errors: 0
- Warnings: 0

## Rendered preview layer

The package also includes 240 playable generic procedural choreography demonstrations with synthetic guide audio. Videos live under `previews/videos/<group>/`, posters under `previews/posters/<group>/`, and the canonical playback metadata is `previews/preview-manifest.json`. Run `node tools\validate-previews.mjs` to validate every MP4, poster, manifest record, hash, stream, timing bound, spatial metadata relation, successful decode, and real frame-to-frame motion.

Static specification validation is separate from the 240 real generic procedural preview MP4s. Validate that rendered preview layer with `node tools\validate-previews.mjs`. Neither gate replaces visual review of later content-bound renders, source-media OCR, font loading, audio review, or final encoded playback.
