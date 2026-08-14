# Changelog

All notable changes are documented here. BetterEdit follows Semantic Versioning after `1.0.0`.

## 0.1.2 — 2026-08-14

- Replaced regex-based title stop-word removal with tokenization and exact stop-word filtering.
- Preserved XML escaping for every generated title before SVG insertion.
- Resolves three CodeQL incomplete multi-character sanitization alerts without dismissing them as false positives.

## 0.1.1 — 2026-08-14

- Updated development dependency `sharp` from 0.34.3 to 0.35.3 to resolve the published high-severity libvips advisory affecting versions below 0.35.0.
- Verified the update in an isolated clone by installing dependencies, regenerating eight previews, and passing encoded-preview validation.
- Added verified launch, maintenance, and application-readiness evidence without claiming external adoption.

## 0.1.0 — 2026-08-14

- Added the self-contained `skill/betteredit` distribution: one installation includes the workflow, safety policy, guide, registry, browser, schemas, scripts, posters, and 240 MP4 demonstrations.
- Added installed-skill diagnostics, template selection, project scaffolding, binding creation, and read-only validation utilities.
- Added clean-install acceptance criteria and an explicit local-renderer trust boundary.
- Added 240 curated templates across 32 narrative families.
- Added 240 playable procedural MP4 previews and posters.
- Added eight spatial composition modes, including 204 non-frontal templates.
- Added typed audio-cue relationships and continuity metadata.
- Added template, style, asset-binding, and preview schemas.
- Added the offline template browser and CLI validation tools.
- Added privacy, security, governance, contribution, and release documentation.
