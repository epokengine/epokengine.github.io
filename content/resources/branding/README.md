# UniQo identity

The default UniQo mark is an interlocking UQ monogram in satin silver with graphite
edges. The open U represents Uni; its connection to the Q suggests unity. The Q's
enclosed counter and diagonal tail keep the second letter recognizable.
Use this artwork for the application and project branding.

- `uniqo-master.png`: original transparent artwork.
- `uniqo.png`: 256 px RGBA icon embedded in the window, taskbar, Hub and editor toolbar.
- `uniqo.ico`: Windows executable icon with 16, 20, 24, 32, 40, 48, 64, 128 and 256 px frames.

Regenerate the packaged PNG and ICO from the master on Windows:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/build-app-icon.ps1
```

`build.rs` embeds the ICO in Windows builds using
[winresource](https://docs.rs/winresource/0.1.31/winresource/).
The existing Windows SDK supplies the resource compiler. Other targets skip this step.
Runtime artwork is embedded with `include_bytes!`; it does not require external files.

## Artwork provenance

Created with the built-in image generation tool to make the letters U and Q recognizable
while retaining the user's requested modern monochrome identity. Packaging only
resizes and encodes the artwork.

Final design prompt:

> Design a highly readable interlocking UQ monogram. A clear uppercase U on the left
> and Q on the right join through a shared structural stroke, communicating unity.
> Keep the U open at the top and give the Q an enclosed counter and unmistakable
> diagonal tail. Use bold typographic geometry, satin silver and restrained graphite
> edges, no colors or extra objects, and a genuinely transparent background.

The exact generation prompt is saved in `generation-prompts.txt`.
