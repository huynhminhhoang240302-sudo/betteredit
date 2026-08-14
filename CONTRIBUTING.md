# Contributing

Thanks for helping make BetterEdit useful beyond one person's workflow.

## Before opening a change

1. Search existing issues and templates.
2. Explain the viewer problem the contribution solves.
3. Keep user media, credentials, machine paths, and copyrighted reference footage out of the repository.
4. For a new choreography, show how it differs perceptibly from existing variants.

## Development

```bash
npm install
npm run validate
```

The checked-in library validators require only Node.js. Regenerating preview videos also requires the locked development dependencies or a trusted `FFMPEG_PATH`.

## Template contribution requirements

- stable template ID and family;
- narrative job and signature;
- duration band and effort tier;
- asset-slot contract;
- entry, development, exit, and continuity data;
- spatial composition metadata;
- typed audio events with valid relationships;
- one real procedural MP4 preview and poster;
- serif-only designed typography in the default style;
- no locked-out decorative motifs;
- successful library, preview, and public-package validation.

## Pull requests

Keep each pull request focused. Include the reason, visual evidence, commands run, and any compatibility impact. Do not include generated dependency directories or private assets.

Maintainers may ask for a different family, a simpler choreography, stronger differentiation, or a smaller binary diff.

## AI-assisted contributions

AI assistance is allowed, but the human contributor remains responsible for licensing, accuracy, security, and testing. State meaningful AI assistance in the pull request when it produced code or media that would otherwise be difficult to audit.

