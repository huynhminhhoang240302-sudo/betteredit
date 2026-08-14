# Content bindings

Store one binding record per user-selected template and beat. A binding maps the user's exact image/video/audio/3D files and text to declared template slots.

Start from `../examples/asset-binding.blank.json`, or run:

```powershell
node ..\tools\create-binding.mjs HK02-03 --out HK02-03-selection-01.json
node ..\tools\validate-manifest.mjs HK02-03-selection-01.json --type binding
```

Do not copy or invent missing media silently. Required empty slots remain `WAITING_FOR_USER_MATERIAL` until the user supplies a file or explicitly authorizes a fallback.
