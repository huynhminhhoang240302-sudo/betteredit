# BetterEdit

**Open-source AI video editing skill for Codex, with 240 playable motion templates.**

BetterEdit turns a topic, script, narration, footage, images, and audio into an intentional edit plan and a locally rendered video. Its installable Codex skill bundles the full editing guide, a machine-readable choreography library, an offline template browser, 240 real MP4 demonstrations, schemas, selectors, and safety rules.

Install **one skill**. No separate BetterEdit prompt pack, guide checkout, plugin, account, API key, or cloud service is required.

BetterEdit is an independent community project. It is not affiliated with, endorsed by, or sponsored by OpenAI.

## Install in Codex

Ask Codex:

> Install the BetterEdit skill from `https://github.com/huynhminhhoang240302-sudo/betteredit/tree/main/skill/betteredit`

Restart Codex after installation. Then start a task with:

> Use $betteredit to create a 30-second highlight about how solar storms affect Earth. Render an MP4, use serif typography, and use meaningful oblique 2.5D compositions.

That is the complete BetterEdit installation. The skill uses the normal local capabilities available to Codex. A host needs a video encoder such as FFmpeg only when it must create new MP4 files; browsing, planning, template selection, bindings, schemas, and all 240 included previews work without installing another BetterEdit component.

### Manual installation

Copy `skill/betteredit` into `$CODEX_HOME/skills/betteredit`, then restart Codex. Do not copy the repository's private working history or your source media into the skill folder.

## What is inside the skill

- 240 curated short-edit templates across 32 narrative families.
- 240 playable 960x540, 30 fps procedural MP4 demonstrations with guide audio.
- Eight spatial modes: frontal, yaw-left, yaw-right, tilt plane, depth stack, corridor, oblique split, and orbital.
- 204 non-frontal demonstrations and 36 deliberate frontal resets.
- A self-contained offline browser for search, filtering, auditioning, and selection.
- Machine-readable JSON, JSONL, CSV, and JSON Schema contracts.
- Local asset bindings that keep user media separate from reusable choreography.
- Template search, project scaffolding, binding creation, validation, and diagnostics.
- A production workflow covering story, continuity, 2.5D/3D staging, sound, rendering, and QA.

## Permanent creative locks

BetterEdit enforces these project-level rules:

- Designed typography is serif-only.
- No decorative top or bottom edge notes.
- No repeated diagonal stripe, hatch, crosshatch, or crossed-line field resembling the rejected reference.
- No slash-style pseudo-wayfinding counters.
- No tiny accent kicker paired with a detached underline.

Meaningful slanted content planes are encouraged. Yaw, perspective, corridors, depth stacks, oblique comparisons, architecture, charts, routes, and mechanisms are valid when they explain the subject. The ban applies to decorative repeated line fields, not useful spatial composition.

## Local maintainer quick start

Requirements for repository development: Node.js 20 or newer. FFmpeg and FFprobe are needed only for preview regeneration and deep media validation.

```bash
git clone https://github.com/huynhminhhoang240302-sudo/betteredit.git
cd betteredit
node tools/validate-library.mjs
node tools/audit-public-package.mjs
```

Validate the installable skill directly:

```bash
node skill/betteredit/scripts/doctor.mjs
node skill/betteredit/scripts/validate-library.mjs
node skill/betteredit/scripts/find-templates.mjs --spatial corridor --effort enhanced
```

The root `template-browser.html` is a maintainer mirror. Installed users use `skill/betteredit/assets/template-library/template-browser.html`.

## Architecture

BetterEdit separates reusable choreography from private material:

1. **Skill instructions** decide how the agent briefs, plans, selects, binds, renders, and checks an edit.
2. **Choreography** describes narrative job, timing, focal travel, spatial composition, audio events, continuity, and asset slots.
3. **Style** defines serif roles, color, surface, lighting, motion, sound, and hard constraints.
4. **Binding** connects exact user-approved media to declared slots and stays project-local.
5. **Render** translates the plan into source files and a real MP4 using the host's local production tools.

The skill never needs the original private analysis files. Checked-in videos are generic choreography demonstrations, not source footage for final edits.

## Repository map

| Path | Purpose |
| --- | --- |
| `skill/betteredit/` | The complete, installable BetterEdit product |
| `skill/betteredit/SKILL.md` | Agent workflow and trigger contract |
| `skill/betteredit/assets/template-library/` | Bundled registry, previews, schemas, styles, and browser |
| `skill/betteredit/references/` | Full guide, field card, selection, and security references |
| `skill/betteredit/scripts/` | Self-contained local utilities |
| `MASTER_GUIDE.md` | Maintainer-facing mirror of the full system |
| `library/`, `previews/`, `schema/` | Maintainer source mirrors used to build releases |
| `APPLICATION_PLAN.md` | Evidence-driven Codex for Open Source execution plan |
| `docs/` | Architecture, threat model, release, maintenance, and application materials |

## Security and privacy

BetterEdit does not require a cloud account or API key. Its template browser is static and does not make network requests. It does not need access to a home directory, browser profile, credential store, or unrelated repository. User media belongs in a separate project folder and is never bundled into the installed skill.

Before publishing a fork or release:

```bash
node tools/audit-public-package.mjs
node tools/validate-library.mjs
```

Read [SECURITY.md](SECURITY.md), [PRIVACY.md](PRIVACY.md), [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md), and [PUBLICATION_CHECKLIST.md](PUBLICATION_CHECKLIST.md).

## Project status

`0.1.0` is a public-beta candidate. The repository should not be submitted to Codex for Open Source merely because it exists. The next milestone is documented external use, responsive issue triage, reviewed contributions, and at least two real releases. See [APPLICATION_PLAN.md](APPLICATION_PLAN.md).

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md), [ROADMAP.md](ROADMAP.md), and [GOVERNANCE.md](GOVERNANCE.md). New templates must be distinct, deterministic, schema-valid, free of the banned motifs, and accompanied by a playable preview.

## License

MIT. See [LICENSE](LICENSE).
