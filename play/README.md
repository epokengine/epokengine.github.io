# Dungeon Complete browser demo

`reactor-station.zip` contains the `epok.bin` and `epok.cue` from the C++
Dungeon Complete template in Epok Engine v0.10.0
(`6d018533c57d94ea12e17817df3fbad5e6a5d639`).

- Disc SHA-256 `92f5935f24d768954f0aea9f6eb51b6b6d5d075668b10da9b32baad8f0370e5e`
- ZIP SHA-256 `1ece40ce32c332043c108611b21c4b6466d9958d236c6f8484c23924678653b7`
- Nugget SDK `4a01183295182b8e7702c908e1efaaa8f4538ffd`

To replace it, create a Dungeon Complete project with the matching official
editor, choose C++ and set Play data to CD on demand. Build for PSX and
package the resulting BIN and CUE together at the root of the ZIP.
Keep the game and runtime notices alongside the disc. Test the resulting
archive through the homepage player and record its new checksums here.

The player loads EmulatorJS 4.2.3 and PCSX-ReARMed from the EmulatorJS CDN
and boots the disc with the core's built-in HLE BIOS. The core remap enables
the analog controller on port 1 for the camera. The runtime, template and
authoring credits are available from the demo's credits link.
