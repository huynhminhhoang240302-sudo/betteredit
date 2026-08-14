# Privacy

BetterEdit is local-first. The published package should contain only generic choreography specifications, procedural previews, documentation, and validation code.

## Data BetterEdit does not need

- account passwords or session cookies;
- API keys or access tokens;
- browser profiles;
- home-directory access;
- private source videos;
- personal voice recordings;
- unpublished scripts or client assets;
- telemetry from the template browser.

## User media

Keep user-selected media outside the repository. Bind assets by explicit path in a local, ignored manifest. Do not copy media into a public fork merely to make a demonstration reproducible.

## Network behavior

The offline browser makes no network requests. The core validators use only local files and child processes explicitly documented by the command. Optional package installation, GitHub Actions, and external renderers have their own network behavior and privacy policies.

## Public-package rule

If a file contains a username, home path, email address, client name, private URL, internal prompt, source-video transcript, credential, or unlicensed media, it does not belong in the public repository.

