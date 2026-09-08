# Epok Engine captures

These PNGs come directly from the production Epok editor at engine revision
`e8a05d8ccc4f2e7dc354b784469b8b6021bbec05`. No image-content edits, compositing,
or AI generation were applied to the captures.

- `epok-editor.png`: 1600 × 1000 application render surface, shipped courtyard example.
- `epok-scene-view.png`: 960 × 600 Scene View render texture from that project.
- `epok-blueprints.png`: 1581 × 917 Blueprint canvas, compiled interaction fixture.

Run `tools/capture-editor.py /path/to/Epok` with the engine's Python requirements
installed and its debug editor built to reproduce them. It creates isolated
projects and preferences; no existing game is edited.

The separate gameplay image supplied with the documentation is retained without
modification. Its demo is under development and will be included later.
