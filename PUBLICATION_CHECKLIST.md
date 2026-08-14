# Public publication checklist

Do not make the GitHub repository public until every required item is checked.

## Identity

- [x] Replace GitHub-username placeholders with `huynhminhhoang240302-sudo`.
- [ ] Confirm the GitHub profile is public.
- [ ] Add a public maintainer contact route.
- [ ] Confirm the repository description and topics.

## Privacy and licensing

- [ ] `npm run audit:public` passes.
- [ ] No home paths, usernames, emails, tokens, private URLs, or client names appear.
- [ ] No production `videos/`, `source-analysis/`, `work/`, logs, models, or `node_modules/` exist.
- [ ] Every public binary is procedural, original, or license-cleared.
- [ ] The skill contains no executable, model weight, cache, or package-manager dependency directory.
- [ ] The skill contains no absolute path back to the maintainer workstation.
- [ ] Git history—not only the latest tree—has been scanned.
- [ ] `LICENSE`, `PRIVACY.md`, and `docs/ASSET_POLICY.md` are accurate.

## Functionality

- [ ] `npm run validate` passes from a clean clone.
- [ ] `template-browser.html` works from `file://`.
- [ ] A representative preview plays with audio.
- [ ] Search, filters, selection persistence, and missing-preview handling work.
- [ ] Regeneration commands are documented and optional.
- [ ] `node skill/betteredit/scripts/doctor.mjs` passes all non-encoder checks.
- [ ] `node skill/betteredit/scripts/validate-library.mjs` passes.
- [ ] A clean Codex profile installs only `skill/betteredit` and can discover the bundled browser, registry, previews, schemas, and selectors.
- [ ] A clean-profile 30-second sample uses real template IDs, observes the creative locks, and produces a playable file when a trusted host encoder is available.

## GitHub security

- [ ] Protect `main` and block force pushes.
- [ ] Require passing checks before merge.
- [ ] Enable secret scanning and push protection where available.
- [ ] Enable Dependabot alerts and updates.
- [ ] Enable CodeQL default setup.
- [ ] Enable private vulnerability reporting.
- [ ] Set Actions token permissions to read-only by default.
- [ ] No self-hosted runner is connected to the personal workstation.

## Launch

- [ ] Tag `v0.1.0` from a clean, validated commit.
- [ ] Publish release notes.
- [ ] Enable Issues and Discussions.
- [ ] Create the first public roadmap milestone.
- [ ] Invite real testers without asking for reciprocal stars.
