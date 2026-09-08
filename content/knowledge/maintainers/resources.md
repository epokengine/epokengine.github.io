# Editor resources

Fonts and icons in `resources/editor/` are editor installation resources. They are embedded at compile time and are separate from game-project `assets/`.

## Codicons

`codicon.ttf` contains only the private-use codepoints referenced by the Rust editor. It is a subset of Microsoft's Codicons 0.0.46-24 font. Preserve its CC BY 4.0 notice and the modification notice in THIRD_PARTY_NOTICES.md.

When adding an icon, regenerate from the original full font, not from the existing subset. From the repository root, use the maintenance script below. It requires fonttools 4.60.1, which is not needed to build or run Epok:

```powershell
python -m venv .tools/font-maintenance
.tools/font-maintenance/Scripts/python -m pip install fonttools==4.60.1
.tools/font-maintenance/Scripts/python tools/subset_editor_icons.py <original-codicon.ttf>
```

Use the original TTF from the `@vscode/codicons` 0.0.46-24 package. The script checks its SHA-256 (`3819e4ae4b87350e7c37a5d8f24e71ada2f1f2ee58f7ce5ebc1f88e3c8c38c80`) and verifies that every referenced codepoint exists. Keep source downloads in `.tools/`. Rebuild the editor and inspect the toolbar, panel titles and Project icons after updates.

Upstream: https://github.com/microsoft/vscode-codicons
Package: https://www.npmjs.com/package/@vscode/codicons/v/0.0.46-24

## HUD font

The editor's `psx-font.bin` is a decoded copy of the pinned PsyQo system font. `python tools/extract_hud_font.py --check` verifies it without changes. Omit `--check` to regenerate it after an intentional SDK/font update. Preserve the Zingot Games attribution.

## Font Awesome

`fa-solid-900.ttf` provides the View tool's hand icon and retains the upstream SIL Open Font License notice. The distribution's icon and code licenses apply to other formats; do not substitute them for the font license.
