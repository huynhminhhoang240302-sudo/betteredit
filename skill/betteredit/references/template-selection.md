# Template selection and chaining

The canonical registry is `assets/template-library/library/templates.json`. Use its real IDs and metadata. The browser and previews are selection aids; the registry is authoritative.

## Selection order

1. **Narrative job:** choose what the beat must make the viewer understand or feel.
2. **Continuity:** match the preceding exit and next entry state.
3. **Spatial composition:** choose a meaningful point of view, not decoration.
4. **Asset contract:** verify the required slots match available approved material.
5. **Duration band:** fit the narration and comprehension time.
6. **Effort tier:** spend hero effort only where it changes the viewer experience.

## Useful searches

Run from the installed skill directory or use an absolute script path:

```powershell
node scripts/find-templates.mjs --job context --limit 12
node scripts/find-templates.mjs --group EX --band explain --limit 12
node scripts/find-templates.mjs --asset video --max-duration 4 --limit 12
node scripts/find-templates.mjs --spatial oblique_split --effort enhanced
node scripts/find-templates.mjs --text mechanism --limit 12
node scripts/find-templates.mjs --after EX01-03 --limit 12
```

Use `--json` when another script will consume the result.

## Spatial modes

- `frontal`: deliberate reading, comparison, or reset.
- `yaw_left` / `yaw_right`: orient a bounded subject plane in space.
- `tilt_plane`: reveal hierarchy or a surface relationship.
- `depth_stack`: separate layers, evidence, or stages.
- `corridor`: travel through a system, timeline, or nested scale.
- `oblique_split`: compare or connect two meaningful planes.
- `orbital`: reveal a subject from multiple sides or recompose a system.

Oblique composition must create semantic depth through projected bounded planes, parallax, occlusion, z-order, scale, or camera movement. A whole-frame skew is not a substitute.

## Chain scoring

`--after ID` scores focal-anchor distance, subject scale, motion direction, orientation, object persistence, luma, audio tail, and narrative progression. Treat the score as a shortlist, then inspect the actual preview and the user's material.

Maintain an eye-trace ledger for every boundary:

| Field | Record |
| --- | --- |
| outgoing focal point | normalized x/y |
| incoming focal point | normalized x/y |
| subject scale | detail / close / medium / wide / aerial |
| motion vector | x/y direction |
| persistent object | stable semantic key |
| orientation | front / left / right / top / spatial |
| luma | dark / mid / bright |
| audio tail | voice / ambience / music / hit / silence |

## Avoid template soup

- Use one visual world across a sequence when possible.
- Change representation because the explanation changes, not because time passed.
- Reuse a persistent object or spatial anchor across at least two beats.
- Do not stack unrelated variants merely to maximize variety.
- Let a hero shot develop internally before cutting away.
- Use a frontal reset deliberately after spatial complexity.

## Material binding

After selecting a template, create its binding rather than altering the template record. Preserve the canonical continuity and audio profile as a reference, then add observed notes for the selected material. Validate the binding before rendering.
