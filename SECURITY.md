# Security policy

## Supported versions

Security fixes are provided for the latest released minor version. Before `1.0.0`, users should update to the newest tagged release before reporting a suspected issue.

## Reporting a vulnerability

Do not open a public issue for a vulnerability, exposed credential, private path, or unsafe execution path.

After the repository is published, enable **GitHub private vulnerability reporting** under repository settings. Use that private channel for reports. If it has not yet been enabled, contact the primary maintainer privately through the contact method listed on their public GitHub profile without including exploit details in the first message.

Please include:

- affected version or commit;
- operating system and Node.js version;
- minimal reproduction without personal files or live credentials;
- expected versus observed behavior;
- likely impact;
- suggested mitigation, if known.

The maintainer should acknowledge a report within seven days, provide a status update within fourteen days, and coordinate disclosure after a fix or mitigation is available.

## Security boundaries

BetterEdit's checked-in browser is static and local. It does not upload media, read browser profiles, or require API keys. The validation tools read only paths explicitly supplied or paths within the repository.

The distributed product is `skill/betteredit/`. Normal use keeps that installed directory read-only and writes source media, bindings, edit projects, and renders to a separate user-selected project directory. The skill does not bundle executables, install software, or request credentials.

The optional preview renderer executes local Node.js dependencies and FFmpeg. Treat dependency installation and rendering as code execution:

- install only from the published lockfile;
- inspect dependency changes before merging them;
- use a disposable workspace for untrusted templates or media;
- never pass secrets through template text or filenames;
- never run repository automation with a personal home directory mounted writable;
- do not expose self-hosted runners to pull requests from forks.

Installing the BetterEdit skill does not install FFmpeg or another renderer. If the host lacks a video encoder, Codex must report that dependency explicitly rather than downloading or executing an unreviewed binary.

## Out of scope

- vulnerabilities in a third-party editor, renderer, FFmpeg build, browser, coding agent, model provider, or operating system;
- unsafe behavior caused by a user's custom script after it bypasses BetterEdit validation;
- social engineering that does not involve BetterEdit code or documentation.
