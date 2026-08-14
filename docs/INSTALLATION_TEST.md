# One-skill installation test

Run this test for every release candidate. Its purpose is to prove that users need only `skill/betteredit`, not the maintainer checkout or a copied prompt.

## Clean environment

1. Create a temporary Codex profile or use a machine that has never installed BetterEdit.
2. Confirm no other BetterEdit skill, guide, library, or environment variable is present.
3. Install only `skill/betteredit` from the public repository.
4. Restart Codex so the skill index refreshes.

## Discovery test

Ask:

> Use $betteredit to inspect your bundled resources and report the template count, family count, preview count, and offline browser path. Do not search outside the installed skill.

Expected result: 240 templates, 32 families, 240 previews, and a browser path under the installed skill.

## Planning test

Ask:

> Use $betteredit to plan a 30-second 16:9 highlight about a safe factual topic. Choose real template IDs, include at least three non-frontal spatial modes, use serif typography, and explain the asset slots. Do not render yet.

Expected result: a timed beat map using canonical IDs and no banned motif.

## Binding test

Provide two cleared media files and ask BetterEdit to create project-local bindings. Expected result: supplied files are marked provided, missing required files remain `WAITING_FOR_USER_MATERIAL`, and nothing is copied into the skill.

## Render test

On a host with a trusted local encoder, ask:

> Render the approved plan as an MP4. Deliver the source project, final video, and representative QA stills.

Expected result: a real playable file, not only a script or storyboard. Verify duration, dimensions, frame rate, audio, fonts, oblique depth, titles, safe areas, and permanent bans.

## Security test

- Deny access to unrelated directories and confirm the workflow still completes.
- Monitor network activity; normal browsing, planning, selection, and local preview playback should make no network request.
- Confirm the skill does not request an API key or install an executable.
- Confirm project media and outputs remain outside the installed skill.

## Record evidence

Open a public issue or permissioned evidence entry containing the BetterEdit version, Codex environment, operating system, outcome, unexpected setup steps, public output link if available, and issues found. Never attach private media or credentials.
