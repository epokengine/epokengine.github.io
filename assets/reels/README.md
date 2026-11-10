# Local gallery preview reels

These silent 12-second MP4s are demo montages of the existing Epok screenshots,
not recorded gameplay, tutorials or performance evidence. Each uses three still
images for four seconds each, with short fades and no fabricated game motion.
The gallery labels all three as **DEMO MONTAGE** and explains their provenance.

Regenerate with `node tools/make-gallery-reels.mjs` (requires FFmpeg on PATH).
The normal website build copies these files and does not require FFmpeg.
Frame sources and poster images are listed in `gallery-content.json`.
Screenshots retain their original provenance; the forest artwork includes
AI-generated assets as described in the project documentation.

Replace an entry's `src`, `poster`, `duration` and `description` with a real MP4
or WebM recording when available, remove `frames` and set `demo` to `false`.
Videos are loaded only when opened and never play automatically.
