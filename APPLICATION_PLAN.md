# Codex for Open Source execution plan

## Objective

Turn BetterEdit from a private, single-user system into an actively maintained public project with verifiable external value, then submit an accurate application to OpenAI's Codex for Open Source program.

## Current status — 2026-08-14

- Public repository: `https://github.com/huynhminhhoang240302-sudo/betteredit`
- Public beta: `v0.1.1` after a tested high-severity development-dependency fix
- Clean remote-clone audit, CI, encoded-preview validation, secret scanning, and CodeQL: passing
- Protected `main`, read-only Actions permissions, Dependabot, push protection, and private vulnerability reporting: enabled
- `v0.2.0` milestone and clean-install evidence request: open
- Verified external users, clean installations, human external pull requests, and resolved user issues: zero so far; one tested Dependabot security update has been merged
- Application readiness: **not ready** until real external use and visible maintenance cycles exist

Publishing the repository is necessary but not sufficient. The application is strongest after the project has real users, releases, maintenance activity, and evidence that the maintainer handles issues, pull requests, security, and roadmap work.

## Product definition

The public product is the single installable skill at `skill/betteredit/`. A user should install that directory and receive the complete BetterEdit experience: instructions, guide, safety policy, 240-template registry, 240 playable previews, schemas, selector, binding workflow, and validators. The user must not need to clone the maintainer package, paste a bootstrap prompt, or install another BetterEdit skill.

The repository root exists for public review, development, releases, contribution, and program evidence. It is not a second product users must configure.

**One-install acceptance test:** from a clean Codex profile, install only `skill/betteredit`, restart Codex, and ask it to plan and render a 30-second video. The task must discover the bundled library, use real template IDs, respect all permanent creative locks, keep media outside the skill, and deliver a playable file when the host has a normal local video encoder. Use the repeatable protocol in `docs/INSTALLATION_TEST.md`.

## Non-negotiable principle

Do not manufacture eligibility. Do not buy stars, exchange stars, inflate downloads, create fake accounts, or submit fabricated testimonials. A smaller project with credible ecosystem value and visible maintenance is better than suspicious vanity metrics.

## Phase 0 — Identity and account preparation (days 1–2)

1. Choose the public maintainer identity and make the GitHub profile public.
2. Add a clear profile bio, public contact route, and pinned BetterEdit repository.
3. Confirm the email used for the application is the email associated with the ChatGPT account.
4. Find and record the OpenAI Organization ID from the account settings.
5. Use the verified public maintainer identity `huynhminhhoang240302-sudo` consistently across the repository and application.
6. Decide whether the project will live under a personal account or a dedicated GitHub organization. Start under the account that makes primary-maintainer responsibility clearest.

**Exit gate:** the public identity is consistent, reachable, and ready to be associated with the project.

## Phase 1 — Private staging and security gate (days 2–4)

1. Create a new **private** empty GitHub repository named `betteredit`.
2. Commit only the sanitized package, not the original working directory.
3. Run `npm run audit:public` and `npm run validate` from a fresh clone.
4. Inspect the complete Git history for secrets and private files before changing visibility.
5. Enable Dependabot alerts, secret scanning/push protection where available, and CodeQL default setup.
6. Enable private vulnerability reporting.
7. Protect `main`: require a pull request, require passing checks, block force pushes, and block deletion.
8. Restrict GitHub Actions permissions to read-only by default. Grant write permissions only to a narrowly scoped release workflow if one is added later.
9. Do not connect a self-hosted runner or mount the personal workstation into GitHub Actions.
10. Install `skill/betteredit` into a clean temporary Codex profile and run the one-install acceptance test.
11. Confirm the installed skill contains no absolute path back to the maintainer workstation and makes no network request during normal selection or preview playback.
12. Confirm no executable binary is bundled in the skill; document the host encoder boundary instead of silently installing one.

**Exit gate:** a fresh clone validates; a clean skill-only install works; the security tab has no unresolved alerts; repository history contains no personal paths, secrets, or private media.

## Phase 2 — Public beta launch (days 5–7)

1. Change repository visibility to public only after the security gate.
2. Create release `v0.1.0` with a concise changelog and the browser screenshot.
3. Add repository description, website field if one exists, and topics:
   `ai-video-editing`, `video-editing`, `motion-graphics`, `coding-agents`, `codex`, `video-templates`, `local-first`, `json-schema`, `video-production`.
4. Enable Issues and Discussions.
5. Pin an introductory Discussion covering the project goal, current limits, and the first three contribution areas.
6. Publish one short demonstration showing skill installation → natural-language request → template selection → asset binding → finished edit. Use only cleared or procedural media.
7. Add one copyable installation sentence to the release notes and verify it from a clean account.

**Exit gate:** a stranger can understand, validate, browse, and try the project without contacting the maintainer.

## Phase 3 — Earn external usage (weeks 2–4)

Target 5–10 genuine early users across at least three use cases: educational explainers, documentary/essay editing, product or technical videos, and agent-tool builders.

Actions:

- invite specific testers who already create or automate video;
- ask them to open issues for friction rather than sending only private feedback;
- run one public onboarding session or recorded walkthrough;
- label good first issues and documentation tasks;
- ship at least one patch release that responds to external feedback;
- collect permissioned, specific usage evidence: project link, template IDs used, output type, and what BetterEdit improved;
- document integration attempts with Codex and at least one other coding agent without claiming official endorsement;
- ask testers whether installation required anything beyond the BetterEdit skill, and turn every unexpected setup step into an issue.

Preferred evidence:

- independent repositories or videos that credit BetterEdit;
- issue threads resolved by the maintainer;
- external pull requests reviewed and merged;
- release downloads and repeat users;
- integrations or dependents using the schemas;
- successful clean-profile skill installations and public examples made from those installations.

**Exit gate:** at least three people other than the maintainer have used the repository, and at least one maintenance cycle is visible publicly.

## Phase 4 — Demonstrate maintenance responsibility (weeks 4–8)

OpenAI explicitly evaluates maintenance signals. Build an honest public record:

- triage issues weekly;
- use milestones for `0.2.0` and `0.3.0`;
- review pull requests with concrete technical feedback;
- publish release notes and migration information;
- close stale or duplicate issues with explanations;
- respond to security reports privately and publish advisories when appropriate;
- record monthly metrics in `docs/MAINTENANCE_EVIDENCE.md`;
- maintain a roadmap rather than accepting every feature request.

Suggested service levels:

- acknowledge ordinary issues within seven days;
- acknowledge security reports within seven days;
- publish a release or maintenance note at least monthly during beta;
- never merge a contribution without validation and licensing review.

**Exit gate:** the repository shows ongoing responsibility, not a one-day code dump.

## Phase 5 — Application readiness review (week 6 onward)

Apply when the evidence is meaningful, not when an arbitrary star number is reached. A reasonable early threshold is:

- public repository with at least two tagged releases;
- four or more weeks of visible maintenance;
- external users with permissioned examples;
- resolved issues or reviewed pull requests;
- no unresolved high-severity security findings;
- an honest explanation of the project's ecosystem role;
- at least three independently verified one-skill installations with public or permissioned output evidence.

Smaller adoption can still qualify if BetterEdit fills a clear gap: a renderer-independent, machine-readable choreography layer for agentic video production.

The official application is reviewed on a rolling basis and does not guarantee selection. Recheck the form immediately before applying because fields and benefits can change.

## Phase 6 — Submit the official application

Prepare these exact fields:

1. First and last name.
2. Email associated with the ChatGPT account.
3. Public GitHub username.
4. Public BetterEdit repository URL.
5. Role: `Primary maintainer` unless responsibility has genuinely become shared.
6. Why the repository qualifies — maximum 500 characters.
7. Interest selections: API credits and, if relevant after the security review, Codex Security.
8. OpenAI Organization ID.
9. API-credit use case — maximum 500 characters.
10. Anything else — maximum 500 characters.

Use the current evidence log to fill the drafts in `docs/APPLICATION_DRAFT.md`. Never insert projected metrics as if they already happened.

Official form: `https://openai.com/form/codex-for-oss/`

## Phase 7 — After submission

- continue normal maintenance; do not freeze the repository while waiting;
- record the submission date and the exact claims made;
- answer follow-up questions with links to public evidence;
- avoid repeated submissions unless the project changes materially;
- if not selected, continue building real value and reapply only after stronger evidence exists.

## How API credits would be used

The strongest project-aligned use is maintainer automation, not generation for private client work:

- classify and summarize incoming issues;
- compare template contributions for duplication and missing metadata;
- draft schema migration notes;
- assist pull-request review while keeping the maintainer accountable;
- generate accessibility and continuity test cases;
- maintain integration examples;
- investigate failed validation runs.

Do not use program credits for unrelated commercial production or personal media generation.

## Risks to the application

| Risk | Mitigation |
| --- | --- |
| Project appears built only to obtain benefits | Delay application until external usage and maintenance are visible |
| Repository is documentation-heavy but not used | Prioritize integrations, examples, and independent outputs |
| Metrics are small | Explain the specific ecosystem gap and provide qualitative evidence |
| Project name implies OpenAI affiliation | Keep BetterEdit as the brand and include a non-affiliation notice |
| Private media leaks into Git history | Publish only from the sanitized package and scan history before visibility changes |
| One-time launch with no maintenance | Establish weekly triage and monthly release/maintenance notes |
| Unsafe contributor code reaches users | Require review, checks, protected branches, and signed releases where practical |

## Definition of success

Success is not merely acceptance into the program. It is a public repository that strangers can safely use, a maintainer record that is easy to verify, and a project whose value continues even without program benefits.
