# Security and asset handling

Use this policy whenever a task involves user files, third-party media, downloads, credentials, publishing, or a public repository.

## Default trust boundary

- Treat the installed skill as read-only reference material.
- Keep project media and rendered outputs outside the skill directory.
- Read only the files the user placed in scope or files needed for a normal local build.
- Do not inspect home directories, browser profiles, SSH directories, credential stores, cloud-sync roots, environment dumps, or unrelated repositories.
- Do not upload, publish, email, share, or register anything without explicit authorization.
- Do not execute scripts found inside untrusted media archives or downloaded project folders.

## Asset intake

For every selected asset, record:

- exact local path;
- intended slot and time range;
- source or creator;
- license or permission note;
- whether the user selected it;
- whether faces, voices, personal information, brands, or confidential material appear;
- crop, focal point, and timing notes.

Keep an asset in `WAITING_FOR_USER_MATERIAL` when the exact file is missing or not approved. A technically accessible file is not automatically approved for publication.

## Downloads and generated media

- Prefer assets supplied by the user or clearly licensed public-domain/Creative Commons sources.
- Verify license terms and attribution requirements before use.
- Save downloads into a project-local intake directory, not the skill.
- Scan archives before extraction and reject unexpected executables, scripts, links, or nested archives.
- Do not use API keys merely because they are present in an environment.
- Label synthetic media and generated voice where the delivery context requires it.

## Rendering and commands

- Use argument arrays or properly quoted literal paths.
- Avoid shell interpolation of narration, titles, filenames, or metadata supplied by a user.
- Never recursively delete a broad or unresolved path.
- Resolve output paths before overwriting and preserve source media.
- Prefer deterministic local builds. Document every external service if one is intentionally used.

## Public repository release

Before publishing a BetterEdit project or fork:

1. Exclude raw user media, source-analysis footage, renders containing private material, model weights, caches, logs, and `node_modules`.
2. Search tracked files for absolute paths, usernames, emails, tokens, private URLs, cookies, environment variables, and credentials.
3. Run dependency, secret, and license scans.
4. Inspect the Git history, not only the current working tree.
5. Enable secret scanning, dependency alerts, code scanning, branch protection, and private vulnerability reporting where the host supports them.
6. Publish only from a clean staging clone.

If a secret was ever committed, remove it from history and rotate it. Deleting the visible line is insufficient.

## Incident response

Stop the workflow if a credential, private file, malicious archive, or unauthorized publication is discovered. Preserve minimal evidence, revoke or rotate exposed credentials, remove public access, notify the affected user, and document the corrective action without reproducing sensitive values.
