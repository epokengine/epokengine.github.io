# Audio playback: effects, MIDI music and disc streams

Epok has three useful ways to play sound. They use the same `AudioComponent` in a
scene, but they are prepared differently and make different demands on the
hardware.

| Choose this | Use it for | What is stored and played |
| --- | --- | --- |
| **Resident AudioClip** | Hits, footsteps, UI sounds and short loops | A sampled clip is converted to SPU ADPCM and kept in SPU RAM. |
| **MusicSequence** | MIDI music that should use a small instrument bank | The MIDI score is compiled into native SPU commands plus only the instrument samples it needs. |
| **Stream AudioClip** | A long rendered soundtrack, ambience or dialogue | A WAV/FLAC/OGG/MP3 recording is encoded as XA data on the disc and read while it plays. |

All three are assigned to an `AudioComponent`. Do not choose the format by the
file extension alone: a MIDI is a score, while a WAV is already recorded sound.

## AudioClip: WAV, MP3, OGG and FLAC

WAV, MP3, OGG/Vorbis and FLAC are all imported as an **AudioClip**. They are
different containers for recorded sound, not different gameplay APIs: after
import, assignment and playback use the same AudioComponent, Blueprint nodes,
C++ calls and Lua helpers.

| Source | Suitable use | Import notes |
| --- | --- | --- |
| **WAV** | Best master for effects and material that will be encoded again | RIFF PCM 8/16/24/32-bit or 32-bit float, mono or stereo, from 8 to 192 kHz. Compressed WAV and WAVE_FORMAT_EXTENSIBLE are not accepted. |
| **FLAC** | Lossless master with smaller project files | Decoded on the development computer before target conversion. |
| **OGG/Vorbis** | Compact working source when its existing loss is acceptable | Decoded on the development computer before target conversion. |
| **MP3** | Existing recordings and reference material | Decoded on the development computer before target conversion. Prefer WAV or FLAC when another lossy encode is planned. |

The importer stores the original source snapshot in the `.epokasset`, so a source
file is not needed to rebuild its derived target data later. It also retains the
settings for trim, channel conversion, normalization, whole-clip looping, role,
load mode and target quality.

The Content Browser can audition a raw WAV, MP3, OGG/Vorbis or FLAC before import.
After import, the same browser and the Inspector show the source waveform and the
saved conversion settings for the AudioClip.

### Import an AudioClip in the editor

1. Copy the source under `assets/`. The file scanner offers **Import** when it
   detects an audio file; you can also open **Import** from the Content Browser.
2. Confirm the destination and choose a **Role**: SFX, Music, Ambience or
   Dialogue. This is the purpose of the sound, not its storage location.
3. Choose **Load Mode**: Auto, Resident or Stream. Auto resolves SFX to Resident
   and Music, Ambience and Dialogue to Stream. Select an explicit mode when that
   default is not the right trade-off.
4. Set trim start/end, normalization, whole-clip looping, channel choice and
   quality, then import. Invalid source data does not produce a partial asset.
5. Select the AudioClip to inspect its waveform, duration, source state and
   conversion settings.

### Two target routes for the same source file

**Resident** is for immediate sampled playback. Stereo is mixed to mono, the clip
is resampled to 11,025, 22,050 or 44,100 Hz, then encoded as SPU ADPCM. It is the
normal choice for effects and short loops. The sound occupies shared SPU sample
memory and uses a voice only while it plays.

**Stream** is for recorded music, ambience and long dialogue. The selected source
is converted into XA data in the disc image. It can use mono or stereo at 18,900
or 37,800 Hz. This does not consume the resident sample bank, but one stream owns
the disc audio path while it is playing; starting, switching and looping require
a seek and can leave a gap.

The source file does not choose the route. For example, a WAV can be a resident
footstep or a streamed title track; an MP3 can be either too, although a lossless
source is better if target encoding quality matters.

### Preview before building

**Source Preview** plays the imported AudioClip after its saved trim, channel and
normalization settings. For a resident clip, **Target Preview (PSX)** encodes and
decodes the cooked SPU ADPCM, including block padding, so it is the preview to use
for a loop seam or compression decision. XA stream decoding is not available in
Target Preview; use Source Preview and then a disc target run for that path.

## The quick editor recipe

### Play a resident AudioClip

1. Import a WAV, FLAC, OGG or MP3 as an **AudioClip**.
2. In its Inspector choose **Role: SFX** and **Load Mode: Resident**.
3. Add an **AudioComponent** to the actor that should own the sound. In the
   component Inspector, assign the AudioClip, enable it, set volume and priority,
   and enable **Play on start** only if it should begin with the scene.
4. Press Play. Use the clip preview first to check trim, loop and gain; use a
   target run to check the final mix.

For a short UI click, this is normally all that is needed.

### Play MIDI music with instruments

1. Import the `.mid` or `.midi` file under `assets/`. The importer recognizes a
   MIDI before it presents conversion settings and creates a **MusicSequence**.
2. Assign a **SoundBank** in the MusicSequence Inspector. Import an SF2/SF3 bank,
   make a small portable bank, or select the project default bank.
3. Inspect the sequence report. It names programs, percussion, note and velocity
   coverage, simultaneous notes, loops and any source operation that needs work.
4. Choose **Musical v2** for new work, then open **PSX music conversion**.
5. Keep **Music driver: Native SPU** selected unless the report explicitly tells
   you that the source needs the software-reference path. Choose a recipe, run
   **Analyze conversion**, and save/reimport after the result fits.
6. Add an **AudioComponent** to a scene actor, assign the MusicSequence, enable
   it and either enable **Play on start** or call Play from a script or Blueprint.

The importer retains the original MIDI. A sequencer-specific `0x7F` meta event is
kept as authoring metadata and does not stop preview or conversion. Meaningful
unsupported musical operations are different: Musical v2 reports them with track
and tick information and asks for a corrected export instead of silently changing
the song.

### Play a long recorded AudioClip from disc

A streamed track must be a recording. Import or render it as WAV/FLAC/OGG/MP3,
then choose **Role: Music** and **Load Mode: Stream**. The target build encodes it
as XA data and includes it in the disc image.

To turn a MIDI arrangement into a disc stream, first render the arrangement and
its SoundBank to a WAV, then import that WAV as a new streamed AudioClip. Changing
the load mode of a MusicSequence does not turn its notes into a recording.

Set the AudioComponent's Clip to that streamed AudioClip just as you would for a
resident effect. `play()`, `stop()`, Blueprint **Play Audio**, and
`epok.play_audio` select the correct delivery path from the assigned asset; no
second component or special emitter is needed.

## What a MIDI sequence contains

MIDI says *which* note plays and *when*. It does not contain the piano, drum kit
or synth samples. A SoundBank supplies those samples and mappings. A
MusicSequence connects the score to that bank.

Think of it this way:

- MIDI is sheet music.
- A SoundBank is the instrument case.
- Native SPU conversion is the prepared performance plan for the target.

The conversion selects only the regions and layers that the song actually uses;
the size of the original SoundFont is not automatically the size of the cooked
bank. A missing program, drum key, note range or velocity range is a real problem
shown by the report. Assign the intended instrument rather than accepting a
different sound by accident.

### Making a small bank yourself

Use **Content > Add > SoundBank**. Map an imported AudioClip to a MIDI program
and a note/velocity range, then set its root key, fine tuning, gain, pan, envelope
and optional sample loop. This is a good route for a deliberately small soundtrack
or a one-instrument test.

For a complete library, import a compatible SF2/SF3 SoundBank. Program and drum
keys use MIDI values from 0 through 127. Standard percussion uses the SoundFont
percussion bank; the Inspector identifies the mapping that the sequence requires.

## Conversion controls without mystery

The conversion dialog edits a draft. It does not change the saved asset until you
choose **Save settings / Reimport**.

| Control | It changes | Practical question |
| --- | --- | --- |
| **Compact, Balanced, High, Custom** | Starting recipe values | Does this recipe fit and still sound appropriate? |
| **Sample rate** | Sample detail and SPU memory | Are high frequencies worth the extra memory? |
| **ADPCM effort** | Offline encoding search | Does the cooked sample improve enough to justify the longer conversion? |
| **Loop alignment / crossfade** | Instrument sustain loops | Do held notes remain smooth after encoding? |
| **Release cap** | Long note tails | Does the tail sound natural without taking too many voices? |
| **Headroom** | Margin before clipping | Is there room for chords and effects together? |
| **Music voice limit** | Maximum physical voices music may use | How many voices must remain available for effects? |

**Analyze conversion** measures the current draft: sequence bytes, main RAM,
SPU sample memory, instruments, adaptations and voice demand. **Optimize to
budget** searches bounded sample-rate choices and proposes a candidate. It never
removes required instruments or saves a change on its own.

Native SPU conversion compiles timing, controller changes, pan, gain, pitch bend,
tuning, tempo and supported pedal behaviour before the game runs. It also converts
envelopes to hardware-friendly values. The player does not parse MIDI or evaluate
a SoundFont while the game is running. That is the important performance boundary.

Some source behaviour cannot be represented exactly. SoundFont delay is omitted,
hold is folded into decay, and animated filter behaviour can require the software
reference path or a source change. The report says which case applies; it is not
a setting that should be guessed from listening alone.

## Source Preview and Target Preview

Use the two previews for different questions:

- **Source Preview** plays the supported MIDI interpretation with the original
  SoundBank samples. It answers: “does the score and instrument mapping make
  sense?”
- **Target Preview (PSX)** uses the compiled native sequence commands, the cooked
  ADPCM samples and the hardware-envelope model. It answers: “what did this
  conversion actually produce?”

The target preview intentionally models the cooked result, but it is still a host
preview. Its interpolation is not the target hardware's exact interpolation and
it cannot recreate key-on timing, live effect contention or wet room reverb from a
full game. Test a target build before deciding that the complete mix is finished.

## Put the music in a scene

An AudioComponent is the scene-facing object for all three audio paths. It is not
a spatial emitter: position does not currently alter volume or left/right balance.

In the Hierarchy:

1. Select an existing actor, or create an empty actor for music.
2. Use **Add Component > AudioComponent**. Adding an Actor3D only creates an
   actor; it does not need lighting or a mesh just to own music.
3. In the component Inspector assign the AudioClip or MusicSequence to **Clip**.
4. Set **Enabled**, **Volume**, **Priority** and, for automatic scene playback,
   **Play on start**.
5. Use **Play** and **Stop** in a Blueprint or script when the music should react
   to gameplay instead.

For a scene title track, a dedicated actor named `Music` with one AudioComponent
is easier to inspect than hiding the track on an unrelated actor.

### Blueprint

In a Blueprint graph, use **Begin Play → Play Audio** with the music actor or its
AudioComponent as the target. Use **Stop Audio** before replacing a track, and
**Set Audio Clip** when the graph selects the track at runtime. The same nodes
work for a resident effect, a MusicSequence and a streamed AudioClip; the assigned
asset decides which playback service is used.

### C++

Usually the asset assignment belongs in the Inspector and C++ only decides *when*
to start or stop it. This Behaviour starts the audio already assigned to its actor
and stops it when the title is left.

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

`play()`, `stop()` and `is_playing()` have the same meaning for resident effects,
MusicSequence and a streamed track. `volume` is clamped from 0 to 1. `pitch` is
useful for a sampled clip but changes neither the tempo of a MusicSequence nor the
fixed pitch of an XA stream.

### Lua

Lua uses the same audio operations as a Blueprint. Give the class a typed asset
property, select the MusicSequence in the Inspector, then pass that property to
the audio helpers. The class below plays its selected score at begin play and
offers a callable stop method.

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

Replace `"MusicSequence"` with `"AudioClip"` for a sampled or streamed asset.
`set_audio_clip` changes the selected asset; `play_audio` starts it. Keeping those
two operations separate lets one music actor switch tracks without duplicating the
playback logic.

## Hardware budgets that matter

The target has 24 physical SPU voices and 512 KiB of SPU RAM. Native sequence
music, resident effects and release tails share those voices. A song defaults to
a music ceiling of 16 voices, configurable from 1 to 24; up to four sequences may
be active, but they still share the one pool of 24 voices.

When more voices are requested than are available, the allocator uses priority and
age. It can steal an older lower-priority voice, or deny a lower-priority request.
The conversion report's logical peak is not the same as the physical requirement:
layered instruments and release tails can keep a voice alive after the next note.

With the ordinary dry reserve, 520,192 bytes remain for the combined SFX and music
samples. Sequence command data is separately bounded to 256 KiB per song and bank
metadata plus sample copies also consume main RAM. Read the conversion report and
the Memory Analyzer for the whole game, not only the song in isolation.

XA streaming uses disc bandwidth rather than resident sample memory and leaves SPU
voices available for effects. It has a different trade-off: only one stream plays
at a time, starting or looping requires a seek, and a seamless loop is not
guaranteed. A game that reads geometry from the disc must also schedule those reads
with the active stream.

## Choose deliberately

- Pick **Resident AudioClip** when a sound must react immediately and be played
  often.
- Pick **MusicSequence + Native SPU** when reusable instruments, compact score
  data and predictable runtime music cost matter.
- Pick **Stream AudioClip** when the important thing is the rendered performance
  or a long recording, and disc playback is an acceptable trade-off.

If a conversion fails, read the named limit in the report first: missing bank
coverage, unsupported music operation, SPU sample memory, command-data size or
voice budget. Each points to a different fix, so reducing sample rate is not a
universal answer.
