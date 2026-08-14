# Threat model

## What publishing the repository changes

Making source code public does not itself give strangers access to the maintainer's computer. Risk appears when private information is committed, untrusted code is executed, automation receives secrets, or a vulnerable dependency is installed.

## Protected assets

- maintainer identity beyond deliberately public profile information;
- local files, source videos, downloads, and client media;
- API keys, tokens, cookies, and signing keys;
- GitHub and OpenAI accounts;
- release integrity;
- contributors and users who run the tools.

## Threats and controls

| Threat | Primary controls |
| --- | --- |
| Secret or private path committed | Separate sanitized package, `.gitignore`, public audit tool, GitHub secret scanning |
| Copyrighted source footage published | Public asset policy, no source-analysis directory, procedural previews only |
| Malicious pull request executes during CI | Read-only token, no secrets on fork PRs, no self-hosted runner, review before privileged workflow |
| Dependency compromise | Exact versions, lockfile, Dependabot, minimal dependencies, review install scripts |
| Path traversal in tools | Resolve paths, keep writes inside explicit output roots, validate IDs and filenames |
| Command injection through metadata | Use argument arrays rather than shell interpolation; treat template text as data |
| Browser loads remote tracking content | Static local assets; no fetch or analytics in the offline browser |
| Public vulnerability report exposes users | Private vulnerability reporting and coordinated disclosure |
| Fake adoption harms credibility | Verifiable metrics only; no paid or reciprocal stars |

## Maintainer workstation rule

Do not run unreviewed pull-request code on the personal production machine. Use GitHub-hosted runners or a disposable local VM/container. Never attach a self-hosted runner that has access to personal files, browser sessions, media libraries, or cloud credentials.

## Release rule

Build releases from a clean tagged checkout. Validate the tag, record hashes for distributable files, and avoid uploading a working-directory archive.

## Residual risk

No open-source repository can guarantee that its dependencies, renderer, agent, or operating system are vulnerability-free. BetterEdit reduces its own privileges and data needs so a compromise has less to reach.

