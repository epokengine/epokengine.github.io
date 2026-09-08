# Assets, import and audio

Authored **EditableMesh** assets use the same UUID package and move/conflict rules, with editable geometry as their embedded source. They open in [Blockout](blockout.md) and do not enter audio import/reimport. An entity references the asset UUID and optional material-slot overrides; saved-scene dependency checks include these references.

Imported assets are portable `.uniqoasset` files under the game's `assets/` directory. Each contains a UUID, importer settings, a source checksum and a complete snapshot of the original file. Scenes reference the UUID. No neighboring `.meta` file or editor database is required to recover an imported asset.

The audio importer supports WAV, MP3, FLAC and Ogg Vorbis. The working source is optional after import: the saved snapshot can regenerate PSX data or be converted with different settings.

## Import workflow

1. Copy supported audio files anywhere under the project's `assets/` directory using the OS file explorer.
2. The **Files detected** notification offers **Import...** or **Omit**. Import opens the inbox; select a file to open its import settings.
3. Choose a `.uniqoasset` destination, **SFX** or **BGM / XA**, sample rate, trimming, normalization and whole-clip looping. BGM also offers mono/stereo. Conversion runs in the background; a validated package is published on success.
4. Select the AudioClip in Project to see its waveform, derived size, source state and actions. Add **Audio Source** to an entity, select the clip in Inspector and use Play.

Project shows valid imported assets and native scenes/scripts. Raw sources stay in **Imports** until imported; unsupported extensions are hidden. Invalid imports display their error without producing an asset. Omitted files and failed imports remain accessible across sessions. A changed source version can produce a new notification.

Background reconciliation runs approximately every 750 ms, with a stability interval before offering source changes. File size and modification-time caching avoids rehashing unchanged files. Opening a project starts a fresh scan; **Refresh** discards that cache. This version uses polling rather than a platform filesystem watcher. A timestamp-preserving external edit during an open session may need Refresh. Symlinks and directory junctions under `assets/` are skipped.

## External moves and recovery

The same rules apply when the editor was closed during the changes:

| Change | Result on the next scan |
| --- | --- |
| Move/rename a `.uniqoasset` or its folder within `assets/` | Its UUID is unchanged; scene references resolve at the new path. |
| Move an unchanged source and remove its old path | A unique matching hash reconnects it. The new source path is saved so later source edits are detected. |
| Move and modify a source before scanning | Identity cannot be inferred reliably. Use **Reimport / Locate source...** to enter its new project-relative path. The imported snapshot remains usable. |
| Delete a source or move it outside `assets/` | Playback and conversion from the snapshot still work. To reconnect an external file, first place it under `assets/`. |
| Copy a `.uniqoasset` using the OS explorer | Both copies have the same UUID. **Conflicts / Problems** requires an explicit resolution; neither copy is selected arbitrarily. |
| Delete/move a `.uniqoasset` outside `assets/` | Scene references keep the missing UUID and build reports it. Restore the package anywhere under `assets/` to recover them. |
| Move the whole project | Open its new folder in the Hub. Asset paths and source hints remain relative. |
| Delete `.uniqo/` while the project is closed | Build and import caches regenerate from the packages. |

Hash matching is a recovery hint, not identity. Several matching sources require manual selection. For duplicate packages, choose **Give this copy a new UUID** on copies intended to be independent. Existing references retain the old UUID: leave exactly one original package or reassign those references.

Editor **Move / Rename** preserves the UUID; **Duplicate** creates a new one. Destinations must be unused `.uniqoasset` paths. **Used by...** lists saved scene dependencies in Console. **Delete...** refuses assets referenced by the open scene or saved scenes, and retains deleted packages in `UserSettings/AssetTrash/`. Restore the last deletion through the window; older trash entries can be moved back under `assets/` with the OS explorer.

## Storage and consistency

```text
assets/Audio/Hit.wav                 # Optional working source
assets/Audio/Hit.uniqoasset          # Authoritative identity, settings and original bytes
assets/scenes/Main.uniqo.json        # AudioSource.clip stores a UUID
.uniqo/imported/<content-key>/       # Disposable SPU-ADPCM or XA, checksum and waveform report
UserSettings/import-state.json      # Local omitted/error decisions
UserSettings/AssetTrash/             # Local recoverable deleted packages
```

Track `.uniqoasset` files in version control. They are binary and contain the source; retaining the working source too duplicates those bytes. Derived caches, trash and import decisions are local.

The package starts with `UNIQOAS1`, two little-endian 32-bit lengths, JSON metadata and source bytes. Package/importer versions and the SHA-256 source checksum are validated. Derived cache keys include source content, settings, importer version and target format. Corrupt conversions regenerate.

Workers prepare candidates and caches; only the owning editor session publishes packages. Before publishing, it checks that the source and replaced package still match the revisions it read. Failed conversion and stale candidates retain the old asset. Temporary files reside beside their destinations; publication never overwrites an existing destination for a new asset. Windows uses a same-directory [MoveFileExW](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw) rename without replacement. Closing drops the candidate receiver before releasing the project lock. External applications do not honor that lock; allow concurrent writes to finish before retrying an operation.

## Effects (SFX)

- Inputs include MP3, FLAC and Ogg Vorbis, decoded on the PC with Symphonia. Maximum source size is 32 MiB; decoded audio is limited to 52,920,000 floating-point samples (about 202 MiB).
- SFX RIFF WAV: mono/stereo PCM 8/16/24/32-bit or IEEE float32, input rates 8–192 kHz, maximum source size 32 MiB. Compressed WAV and WAVE_FORMAT_EXTENSIBLE are not supported yet.
- Stereo mixes down to mono. Offline resampling produces 11,025, 22,050 or 44,100 Hz, with optional normalization and PSX SPU-ADPCM encoding.
- Referenced clips reside in SPU RAM. Each UUID uploads once. Builds reject banks above 508 KiB; 4 KiB is reserved for capture buffers and reverb is disabled.
- Up to 24 concurrent voices, play/stop, whole-clip loops, volume 0–1, pitch 0.25–4 and priority 0–255. Higher priorities can replace lower ones; equal priorities replace the oldest voice. Lower-priority requests are dropped when all voices are occupied.
- ADPCM stores 28 samples per 16-byte block. Partial final blocks are padded; author loop boundaries accordingly. Loop entry resets prediction history for repeatable decoding.

There is no spatial attenuation, Audio Listener, mixer bus, effect chain or host-side audition yet. Play provides the audio preview. Playback is verified in PCSX-Redux; physical-console validation is pending. The runtime follows the [PSX SPU register, ADPCM and memory documentation](https://psx-spx.consoledev.net/soundprocessingunitspu/).

In a C++ Behaviour with an assigned Audio Source:

```cpp
if (auto* sound = entity().get<uniqo::AudioSource>()) {
    sound->volume = 0.5;
    sound->pitch = 1.0;
    sound->play();
    // sound->stop();
    // bool active = sound->is_playing();
}
```

The generated bank uses compact indices after resolving scene UUIDs. The console resolves generated music filenames through ISO9660; it does no asset indexing, hashing or source audio conversion. Exports include the generated bank and native runtime.

## Background music (BGM / XA)

Choose **BGM / XA** to decode the source to PCM, apply trimming/normalization and convert it to 4-bit XA-ADPCM at 37,800 or 18,900 Hz, mono or stereo. This is rendered audio: importing MP3 does not recover instruments, MIDI or a sequenced soundtrack. Lossy MP3-to-XA conversion adds another compression stage; WAV/FLAC are preferable masters when available.

The same source can produce independent SFX and BGM assets with different destinations/settings. The original source snapshot and UUID stay in the package, including after reimport, moves or cache deletion. Version-1 WAV packages remain readable with their original SFX defaults.

Referenced BGMs automatically produce `.uniqo/build/uniqo.bin` and `uniqo.cue`, alongside the executable. **Play** boots that disc in PCSX-Redux. Keep BIN and CUE together; distribute the disc image for music-enabled games. A standalone PS-X EXE cannot supply its XA sectors. Exports carry `music/`, `disc.xml` and `SYSTEM.CNF`; see the runtime build instructions.

The runtime finds the generated file through PsyQo's ISO9660 parser, starts filtered XA playback at double speed, and routes CD audio into the SPU. It keeps music outside the sample bank and leaves all 24 sample voices available for effects. Initialization, seeking, stopping and switching are asynchronous. A small final data marker ends each track.

- One BGM stream at a time. Only one BGM Audio Source may have **Play on start** enabled. Other tracks can be started from C++.
- `play()`, `stop()`, `is_playing()` and volume work with both profiles. Music pitch is fixed at 1.0; builds reject authored pitch changes. Runtime pitch changes have no effect on XA.
- Higher/equal-priority BGM requests replace the current request; lower-priority requests are dropped. The SFX and music priority pools are separate. Calling `play()` on the active BGM restarts it.
- Loop repeats the imported, trimmed clip. Switching/restarting/looping requires a CD seek and can leave a gap. MP3 encoder padding and XA sector rounding can also add silence. Seamless loops, intro/loop regions, crossfades and SPU-streamed music are future work.
- Maximum trimmed BGM duration is ten minutes, additionally constrained by source/decoded-memory limits. The generated disc is conservatively capped at 74-minute CD capacity.
- This implementation inserts filtered padding sectors to maintain real-time XA spacing. Disc consumption is approximately 21 MB per minute regardless of mono/stereo/rate; lower settings reduce encoded audio payload, but do not reduce this initial disc layout's size. Sharing those unused sectors with other tracks/data is future work.
- The music service owns the CD controller. Arbitrary parallel CD file loading is not supported while playing; the current scene, scripts and effects are already resident.

`uniqo::music_stats` exposes state, starts, ends, loops, errors and the current clip index. States: 0 unused, 1 initializing, 2 idle, 3 seeking, 4 playing, 5 stopping, 6 error. Error codes: 1 reset, 2 ISO initialization, 3 file lookup, 4 playback command, 5 invalid end marker or marker DMA timeout. A bad end marker increments errors and stops the track. These counters support game diagnostics; they are not timing guarantees.

Setup installs pinned [psxavenc 0.3.1](https://github.com/WonderfulToolchain/psxavenc/tree/v0.3.1) and [mkpsxiso 2.30](https://github.com/Lameguy64/mkpsxiso/tree/v2.30), checked by archive hashes. They run only on the development PC. SFX conversion needs neither utility. XA sector layout and playback follow the [CD format](https://psx-spx.consoledev.net/cdromformat/) and [CD controller documentation](https://psx-spx.consoledev.net/cdromdrive/). Physical-console testing remains pending.

## Command line

Commands use the same project validation and exclusive lock as the editor. Source/destination paths are project-relative:

```powershell
uniqo-editor.exe --project "D:/Games/My Game" --import-audio assets/Audio/Hit.wav
uniqo-editor.exe --project "D:/Games/My Game" --import-audio assets/Audio/Ambience.wav --asset assets/Audio/Wind.uniqoasset --rate 11025 --loop --normalize
uniqo-editor.exe --project "D:/Games/My Game" --reimport-asset assets/Audio/Hit.uniqoasset
uniqo-editor.exe --project "D:/Games/My Game" --reimport-asset assets/Audio/Hit.uniqoasset --import-audio assets/Audio/NewHit.wav
uniqo-editor.exe --project "D:/Games/My Game" --reimport-asset assets/Audio/Hit.uniqoasset --snapshot --rate 22050
uniqo-editor.exe --project "D:/Games/My Game" --import-audio assets/Audio/Theme.mp3 --audio-usage bgm --rate 37800 --channels 2 --loop
uniqo-editor.exe --project "D:/Games/My Game" --import-audio assets/Audio/Theme.mp3 --asset assets/Audio/Stinger.uniqoasset --audio-usage sfx --trim-start 2 --trim-end 3
uniqo-editor.exe --project "D:/Games/My Game" --scan-assets
```

`--scan-assets` emits read-only JSON with package IDs, paths, sources, usability and scan problems. Reimport preserves the UUID/settings unless overridden; the UI also supports disabling normalization/looping. The interactive reconciliation service persists recovered source paths; a headless reimport can also save the recovered path.

This system currently covers imported AudioClips. Native scenes retain their path-based startup selection and C++ bindings remain name-based: arbitrary external script renames are not repaired. Mesh/texture import can extend the package kind/importer contract later.


FBX characters use separate Skeleton, SkeletalMesh, AnimationClip and Material assets. See [skeletal characters](skeletal.md) for import, preview, model reimport rules and PSX playback. The audio workflow below remains supported.
