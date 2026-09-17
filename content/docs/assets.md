# Assets, import and audio

An imported asset is a portable package with a stable UUID, a copy of its source
information and the settings used to prepare it for the target. Moving an asset
inside `assets/` does not break a scene reference; replacing its source does not
silently change its saved conversion recipe.

Audio has one common scene interface and three delivery paths: a resident sampled
clip, a native MIDI MusicSequence, or a disc stream. Choose the path by the job,
not by the source extension.

| Asset and load mode | Best use | Main cost |
| --- | --- | --- |
| `AudioClip` + **Resident** | Short effects, UI and short loops | SPU sample memory and shared voices |
| `MusicSequence` | MIDI score plus a SoundBank | Bank sample memory, sequence data and shared voices |
| `AudioClip` + **Stream** | Long recorded music, ambience and dialogue | Disc sectors and CD seeking |

Read [Audio playback](/docs/music-sequences/) for a full editor walkthrough and
examples in Blueprints, C++ and Lua.

## Import safely

1. Put source files under the project `assets/` folder.
2. Use **Import** in the Content Browser, or select the source file when the
   import dialog opens. A scanned WAV, MP3, FLAC or OGG/Vorbis source is detected
   as an AudioClip; a `.mid` or `.midi` source is detected as a MusicSequence.
3. For an AudioClip, choose role, load mode, trim, normalization, looping,
   channels and quality. For a MusicSequence, choose its SoundBank and music
   conversion settings.
4. Confirm the detected asset kind and settings, then import. Select the new asset
   once to inspect its source, conversion report and preview.

The importer determines the type from the data, not only the filename. A MIDI is
recognized before music settings are shown, so the music-specific route appears
without asking the author to first select a generic audio type. If an external
file changes, the Content Browser marks the imported package stale; review and
reimport it instead of assuming the running game changed automatically.

Imports publish atomically. If validation, decoding or target conversion fails,
the previous valid asset remains available. The dialog identifies the source path
and the exact problem so a failed import is not mistaken for a usable asset.

## Sampled AudioClip

WAV, FLAC, OGG/Vorbis and MP3 can become an AudioClip. These are all recorded
sound formats; they share one imported asset type and one playback API. Use WAV or
FLAC when the source will be encoded again, because converting an already lossy
recording adds another lossy stage.

| Source | Accepted input | Practical advice |
| --- | --- | --- |
| **WAV** | RIFF PCM 8/16/24/32-bit or IEEE float32; mono/stereo; 8–192 kHz | Best choice for a master. Compressed WAV and WAVE_FORMAT_EXTENSIBLE are not accepted. |
| **FLAC** | Lossless audio decoded on the development computer | Good compact master source. |
| **OGG/Vorbis** | Vorbis audio decoded on the development computer | Useful when its existing compression is acceptable. |
| **MP3** | MP3 audio decoded on the development computer | Useful for existing material; prefer a lossless master for a final target encode. |

The `.epokasset` retains the original source snapshot and its import choices.
Reimport can therefore rebuild target data even when the working source has moved
or been deleted.

The AudioClip Inspector separates two choices:

| Setting | Meaning |
| --- | --- |
| **Role** | The creative job: SFX, Music, Ambience or Dialogue. |
| **Load Mode** | Where it is delivered from: Auto, Resident or Stream. Auto resolves SFX to Resident and the other roles to Stream. |

For a resident clip, conversion mixes to mono when needed, applies the saved trim,
normalization and loop choices, resamples it to 11,025, 22,050 or 44,100 Hz, and
encodes SPU ADPCM. The Preview shows the decoded source or the saved target result
so trim and loop mistakes are visible before a build.

**Source Preview** plays the import after saved trim, channel conversion and
normalization. For a resident clip, **Target Preview (PSX)** encodes and decodes
the resulting SPU ADPCM, including block padding. XA stream decoding is not
available in Target Preview: use Source Preview and a disc target run to judge a
streamed clip.

Resident effects share 24 physical SPU voices. Their volume is in the range 0–1,
their pitch is in the range 0.25–4, and their priority is in the range 0–255. A
higher-priority request can replace a lower-priority voice; equal priority uses
age. A request that cannot obtain a suitable voice is reported rather than
pretending it played.

There is currently no position-based attenuation, listener or automatic spatial
panning. An AudioComponent can live on a 3D, 2D or UI actor, but its transform does
not change the sound.

## MIDI, MusicSequence and SoundBank

A MIDI file is instructions for notes, tempo, programs and controllers. It has no
instrument waveforms. Importing a `.mid` or `.midi` creates a **MusicSequence**;
assign a **SoundBank** to provide its instruments.

For a new song:

1. Import the MIDI and open its Inspector.
2. Select a SoundBank: import a compatible SF2/SF3, create a small portable bank,
   or use the project default SoundBank.
3. Select **Musical v2** and read the program, percussion, note-range, velocity,
   polyphony and loop report.
4. Open **PSX music conversion**, choose a recipe, and run **Analyze conversion**.
5. Save settings/reimport only after the measured result fits the game budget.

Musical v2 accepts the documented score operations, including tempo, program and
bank selection, volume, pan, expression, supported pedals, pitch-bend range and
fine/coarse tuning. Unknown meaningful operations are errors with track and tick
locations. A sequencer-specific `0x7F` meta event is preserved as opaque authoring
metadata; it does not describe playable music and does not block preview or
conversion. The original MIDI bytes and UUID remain attached to the asset.

### SoundBank coverage

The SoundBank Inspector reports the exact program, key and velocity regions needed
by the sequence. Missing coverage is an import/conversion issue, not a cue to pick
a random fallback instrument.

Use **Content > Add > SoundBank** to map AudioClips to programs and note/velocity
ranges. Each region has root key, tuning, gain, pan, envelope and optional sample
loop settings. An SF2/SF3 library remains one source-preserving SoundBank; only
the regions required by a song are cooked.

## Native music conversion

**Music driver: Native SPU** is the normal target choice. The converter resolves
the score and SoundBank on the host, then writes a version-3 EPSQ command stream
and cooked ADPCM bank. The target player reads these bounded commands; it does not
parse MIDI or run a SoundFont synthesizer while the game is playing.

The controls have clear, independent jobs:

| Control | Changes |
| --- | --- |
| **Compact / Balanced / High / Custom** | A starting conversion recipe |
| **Sample rate** | Detail of instrument samples and their SPU-memory cost |
| **ADPCM effort** | Offline sample-encoding search, not runtime music work |
| **Loop alignment / crossfade** | The seam of a sustained instrument sample |
| **Release cap** | Long envelope tails and their pressure on voices |
| **Headroom** | Margin before chords and effects clip together |
| **Music voice limit** | How many physical voices one song may request |

**Analyze conversion** reports the draft's exact sequence data, main RAM, SPU
sample bytes, instrument coverage, adaptations and voice demand. **Optimize to
budget** proposes a bounded sample-rate choice; **Adopt proposed recipe** changes
only the draft. Saving is always explicit.

Native conversion prepares note timing, pitch bend, tuning, pan, gain, tempo and
supported pedal behaviour in advance. Hardware envelopes are quantized during the
conversion. SoundFont delay is omitted, hold is folded into decay, and dynamic
filter behaviour may require a source change or the **Software Reference** driver.
The report names each adaptation or rejection.

### Preview the right thing

**Source Preview** asks whether the MIDI interpretation and original instruments
are correct. **Target Preview (PSX)** plays the actual EPSQ v3 commands, cooked
ADPCM samples and hardware-envelope model. Compare both after saving a candidate.

Target Preview is deliberately close to the cooked result, but it is not a full
game run: host interpolation differs from the target, and it cannot recreate
hardware key-on timing, live effect contention or wet reverb. Build and play the
scene to make the final mix decision.

## Add audio to an actor

Use an **AudioComponent** for every kind of audio. It is the object exposed in the
Hierarchy, Inspector, Blueprints and scripting APIs.

1. Select an existing actor or create an empty actor for music.
2. Choose **Add Component > AudioComponent**.
3. Assign an AudioClip or MusicSequence in **Clip**.
4. Set **Enabled**, **Volume**, **Priority** and, if the sound begins with the
   scene, **Play on start**.
5. Use **Play Audio**, **Stop Audio** and **Set Audio Clip** nodes in a Blueprint
   when gameplay controls it.

Adding an Actor3D does not require a mesh or light to own an AudioComponent. A
separate actor named `Music` is usually the clearest place for background music.

### C++

Assign the asset in the Inspector, then use the actor's AudioSource to decide when
it runs:

```cpp
#include "epok.hpp"

class MusicStarter : public epok::Behaviour {
public:
    void start(epok::Transform&) override {
        auto& music = entity().audio;
        music.volume = 0.70;
        music.priority = 200;
        music.play();
    }

    void stop_music() {
        entity().audio.stop();
    }
};
```

`play()`, `stop()` and `is_playing()` work for a resident AudioClip, a
MusicSequence and a streamed AudioClip. AudioClip pitch affects only sampled
playback; it does not change MusicSequence tempo or XA-stream pitch.

### Lua

Lua uses the same operations through the typed audio helpers. Select the asset in
the class instance Inspector after adding this script:

```lua
---@class MusicStarter : epok.Actor3D
local MusicStarter = epok.Actor3D:extend()

MusicStarter.track = epok.AssetRef("MusicSequence")

function MusicStarter:begin_play()
    epok.set_audio_clip(self.ref, self.track)
    epok.play_audio(self.ref)
end

function MusicStarter:stop_music()
    epok.stop_audio(self.ref)
end

return MusicStarter
```

Use `epok.AssetRef("AudioClip")` for a sampled effect or a stream. The asset
selection and the Play call are separate, so one actor can select a different
track before starting it.

## Voice and memory budget

The target has 24 physical SPU voices and 512 KiB of SPU RAM. Resident effects,
native sequences and envelope release tails use the same voice pool. A sequence
defaults to a ceiling of 16 voices, configurable from 1 through 24; up to four
sequences may exist at once, but they never create additional physical voices.

The allocator considers priority and age. It may steal an older lower-priority
voice or deny a request when no acceptable voice is free. A song's logical
polyphony is therefore not its complete physical requirement: layers and release
tails can keep voices active after a later note begins.

With the ordinary dry reserve, 520,192 SPU bytes remain for the combined SFX and
music sample bank. Sequence commands are separately limited to 256 KiB per song;
bank metadata and sample copies additionally use main RAM. Check the conversion
report and Memory Analyzer with the scenes and effects that actually run together.

## Streamed BGM and XA

A **Stream** AudioClip is recorded audio, not a MusicSequence. WAV, FLAC,
OGG/Vorbis and MP3 all use this route after host decoding. The build applies the
saved trim and normalization, encodes mono or stereo XA at 18,900 or 37,800 Hz,
writes it to the disc image, and the runtime reads one stream at a time through
the CD controller. It keeps the 24 SPU sample voices available for effects, but
uses disc bandwidth and has seek-based starts, switches and loops.

- A MIDI needs to be rendered to a WAV before it can become a stream; an AudioClip
  source never becomes MIDI or a SoundBank by changing its load mode.
- Only one XA stream plays at a time.
- Starting, switching or looping can leave a gap; seamless looping is not
  guaranteed.
- Geometry reads from the disc share the same controller and can interrupt stream
  timing, so plan those scenes together.
- A standalone executable has no disc sectors to stream; use the disc build when
  a streamed clip is selected.

## Solve the report that you have

Do not apply the same fix to every error. Missing SoundBank coverage calls for an
instrument mapping. An unsupported MIDI operation calls for a source export or the
software-reference path. SPU memory calls for a smaller recipe or fewer resident
samples. A voice limit calls for mix, priority or arrangement choices. The report
identifies which budget or source rule stopped the conversion.
