# Architecture

BetterEdit ships as one self-contained Codex skill and separates five concerns so reusable instructions never need private media.

1. **Skill:** `skill/betteredit/SKILL.md` routes video creation, planning, review, material intake, rendering, and QA. It links only to references and assets bundled in the same installed directory.
2. **Choreography:** canonical template records describe narrative job, timing, focal travel, spatial composition, transitions, audio cues, and asset slots.
3. **Style:** style-pack manifests define typography, color, surface, lighting, motion, sound, and hard constraints.
4. **Binding:** asset-binding manifests connect user-selected media and text to declared slots. They remain local until the user deliberately shares them.
5. **Render:** Codex translates the contracts into a concrete project using local production tools already available to the host.

The installable skill bundles the static browser, compact preview manifest, library data, selectors, schemas, references, posters, and MP4 demonstrations. It lazily loads posters and creates one video player only after a user requests playback.

The checked-in MP4s are generic choreography demonstrations. They are not user-bound edits and are not treated as source assets for final work.

## Trust boundaries

- The canonical library and schemas are trusted release inputs.
- Contributor pull requests are untrusted until review and validation.
- Asset bindings are user-controlled and may point to sensitive files.
- Renderers, browsers, package managers, and coding agents are separate systems with their own permissions.

BetterEdit does not install executables or expand a renderer's permissions. A user should grant only the project directories and network access required for the current edit.
