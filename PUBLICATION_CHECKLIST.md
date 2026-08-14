# Public publication checklist

Do not make the GitHub repository public until every required item is checked.

## Identity

- [x] Replace GitHub-username placeholders with `huynhminhhoang240302-sudo`.
- [x] Confirm the GitHub profile is public.
- [x] Add public maintainer contact routes through Issues, Discussions, and private vulnerability reporting.
- [x] Confirm the repository description and topics.

## Privacy and licensing

- [x] `npm run audit:public` passes.
- [x] No private home paths, personal emails, tokens, private URLs, or client names appear.
- [x] No production `videos/`, `source-analysis/`, `work/`, logs, models, or `node_modules/` exist.
- [x] Every public binary is procedural, original, or license-cleared.
- [x] The skill contains no executable, model weight, cache, or package-manager dependency directory.
- [x] The skill contains no absolute path back to the maintainer workstation.
- [x] The complete one-commit Git history and a fresh remote clone have been scanned.
- [x] `LICENSE`, `PRIVACY.md`, and `docs/ASSET_POLICY.md` are accurate.

## Functionality

- [x] `npm run validate` passes from a clean clone.
- [x] `template-browser.html` works from `file://`.
- [x] A representative preview plays with audio.
- [x] Search, filters, selection persistence, and missing-preview handling work.
- [x] Regeneration commands are documented and optional.
- [x] `node skill/betteredit/scripts/doctor.mjs` passes all non-encoder checks.
- [x] `node skill/betteredit/scripts/validate-library.mjs` passes.
- [ ] A clean Codex profile installs only `skill/betteredit` and can discover the bundled browser, registry, previews, schemas, and selectors.
- [ ] A clean-profile 30-second sample uses real template IDs, observes the creative locks, and produces a playable file when a trusted host encoder is available.

## GitHub security

- [x] Protect `main` and block force pushes.
- [x] Require passing `contracts`, `previews`, and `analyze` checks before merge.
- [x] Enable secret scanning and push protection.
- [x] Enable Dependabot alerts and updates.
- [x] Enable CodeQL analysis through the checked-in workflow.
- [x] Enable private vulnerability reporting.
- [x] Set Actions token permissions to read-only by default.
- [x] No self-hosted runner is connected to the personal workstation.

## Launch

- [x] Tag `v0.1.0` from a clean, validated commit.
- [x] Publish release notes and the standalone skill archive.
- [x] Enable Issues and Discussions.
- [x] Create the first public roadmap milestone.
- [ ] Invite real testers without asking for reciprocal stars.
