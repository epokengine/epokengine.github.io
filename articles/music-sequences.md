# MIDI, SoundFont and music on a real PSX

Epok can turn a MIDI composition and an instrument bank into sequenced music played by PlayStation SPU voices. You can also keep using sampled sound effects and disc-based XA music. These are different ways to deliver audio, with different costs.

## A score is not a recording

A MIDI file says which notes to play, when, and with which program/controller settings. It does not contain the piano, drum kit or string samples. A **SoundBank** supplies those instruments. The **MusicSequence** keeps the score and its interpretation settings.

Think of MIDI as the sheet music, the SoundBank as the orchestra, and the SPU as a very small stage. The musicians are talented; there are only 24 chairs.

| Approach | Good fit | Main trade-off |
| --- | --- | --- |
| Resident sampled SFX | Short impacts, menu clicks and loops | Samples occupy SPU RAM |
| MIDI + SoundBank | Music assembled from reusable instruments | Notes share SPU voices with SFX; banks and events also use main RAM |
| XA on CD | A rendered soundtrack, including recorded performances | Needs disc sectors and seeks; loops are not gapless |

Importing an MP3 does not recover its instruments or turn it into MIDI. Keep the original MIDI if you want to use the sequenced workflow.

## Get a first song playing

1. Put a `.mid` or `.midi` source under your project's `assets/` directory and import it as a MusicSequence.
2. In the sequence settings, choose **Install reference instrument library** to install the bundled FluidR3Mono GM 2.315 SoundFont as one SoundBank, or import a compatible **SF2/SF3** library yourself.
3. Assign the bank to the sequence. You can also set **Project Settings > Description > Audio > Project Default SoundBank** for sequences with no explicit selection.
4. Use **Musical v2** interpretation for new MIDI imports. Inspect programs, note/velocity coverage, layers and diagnostics before converting.
5. Open **PSX music conversion**, choose a preset, then **Analyze conversion**. Save settings/reimport once the target recipe fits.
6. Compare **Source Preview** and **PSX Target Preview** in Inspector or the Content Browser, then assign the MusicSequence to an Audio Source, enable autoplay if desired, and test Play.

The bundled reference library keeps its MIT notice. A library you supply has its own license; keeping a source snapshot does not replace checking redistribution rights. The saved SoundBank retains the complete original library; only required regions/layers are selected for a song's conversion. Source library size is not the size of the resulting PSX bank.

## Build your own small bank

Use **Content > Add > SoundBank...** to map programs and note/velocity ranges to imported AudioClips. Set root key, fine tuning, gain, pan, ADSR and sample loops. The initial portable bank model selects one non-overlapping zone per note; SoundFont libraries have a separate layered conversion path.

**Retro Starter SoundBank** creates an original triangle sample mapped to program 0. It is useful for a minimal test and carries MIT provenance. It is not a complete General MIDI orchestra and does not invent percussion for missing mappings.

Program and drum-key numbers use MIDI's 0–127 numbering. Library MIDI percussion bank 0 maps to SoundFont bank 128; other mappings need an explicit saved override. A missing instrument is an error to resolve, not a request for the engine to silently pick a different sound.

## Understand the conversion controls

| Control | What it changes | What to listen or look for |
| --- | --- | --- |
| Compact / Balanced / High / Custom | Starting recipe and quality choices | Compare measured cost, not the preset's name |
| Sample rate | Sample density and memory use | Lower rates can save memory but dull high frequencies |
| ADPCM effort | Offline sample encoding work | Compare target sound; this is conversion work, not extra music voices |
| Loop alignment / crossfade | How sustain loops fit encoded blocks | Clicks, changed boundaries and sustained-note seams |
| Release cap | Maximum adapted note-release tail | Abrupt endings versus voice/memory pressure |
| Filter / effects policy | Which supported adaptations are used | Some source behavior is approximated or rejected |
| Headroom | Margin against clipping | Leave room for layered notes and simultaneous SFX |
| Voice and memory budgets | Constraints applied to the recipe | The whole game must fit, not just the solo song |

Hover an option or its **?** for delayed help; click/focus **?** for immediate help. **Analyze conversion** runs asynchronously and can be cancelled. **Optimize to budget** searches a bounded set of rate choices and proposes a recipe. **Adopt proposed recipe** changes the draft; saving is still a separate action. The optimizer does not make artistic decisions for you or remove required instruments behind your back.

At this snapshot, Source/Target comparison uses **saved** settings. Draft audition before saving is still pending. Save/reimport retains the asset UUID and original source snapshot.

## Two previews, two different questions

**Source Preview** asks what the supported interpretation sounds like with the original samples. **PSX Target Preview** asks what the actual cooked EPSQ events and EPSB samples sound like through the shared host sequence path.

Target Preview uses linear host interpolation, not the SPU's Gaussian interpolation, and omits wet Room reverb. It cannot reproduce real IRQ/key-on latency or competition with the rest of your game's SFX. Source Preview can preserve SoundFont filters; target filter baking is an explicit reported approximation. Unsupported animated filtering is not silently accepted.

Use preview to compare timbre and conversion changes. Use a target run to test the complete game's mix, timing and performance. Failed auditions write the asset path and diagnostic to Console once per Play attempt.

## Budget for the band and the game

The PSX has **24 physical SPU voices** and **512 KiB SPU RAM**. The sequence profile offers **1–24 configured music voices**, default 16, shared with SFX through priority/age allocation. Up to **four sequence instances** can run concurrently; that does not mean four independent sets of 24 hardware voices.

The initial dry profile reserves 4 KiB for capture buffers, leaving 520,192 bytes for combined bank/SFX samples. Effects and conversion settings may reserve additional space: follow the report for your actual recipe. Banks are preloaded, and sample copies/metadata/events also cost main RAM. Resident music is not free just because the event list looks tiny.

Sequence data is bounded to **256 KiB per song**. Auto event loading resolves to Resident; Stream is currently a target error for sequences and banks. Sample pitch changes do not change musical tempo. Whole-song looping and an instrument's sustain-sample loop are separate settings.

Inspect `audio/sequence-report.json`, Inspector's cook report and the [Memory Analyzer](/docs/play/#memory-analyzer). Changed inputs invalidate old reports. Never use a successful Title-only build as proof that Title plus every gameplay scene fits in memory.

## MIDI compatibility and old assets

SMF formats 0/1 with PPQN timing support notes, program changes, tempo, volume, pan, expression, sustain and documented loop markers. Musical v2 adds bank selection, RPN bend range/fine/coarse tuning, supported reset/all-notes controls and sostenuto handling. Notes and controller events are processed deterministically.

SMPTE timing, SysEx, aftertouch, unknown RPN/NRPN and unsupported meaningful controllers/meta events produce diagnostics. Musical v2 does not provide a blanket “ignore everything” switch. Older packages with no interpretation field remain **Legacy v1**; upgrading is explicit and preserves UUID/source.

Sony SEQ/SEP and VAB source inspection/import are separate capabilities. **VAB instrument playback and fidelity conversion are not implemented**; source recognition is not playback support. Epok does not add N64, PS2 or GameCube audio backends through this update.

## What has actually been validated?

The committed delivery notes include isolated emulator whole-song tests and a short physical-console smoke test after fixes to batched note starts, acknowledged sample DMA and 250 Hz library modulation updates. In that approximately 32-second hardware interval, the Title scene showed stable video and complete instruments at a reported 60 FPS.

That is a narrowly scoped measurement, **not a full-game or full-song hardware guarantee**. Worst-case interrupt latency, an independent drift assertion, broader simultaneous-SFX/transition stress and full-game RAM fitting remain open. Read the [delivery evidence and pending work](architecture/psx-midi-delivery.md) for the exact conditions. For detailed formats, commands and asset rules, keep [Assets and audio](/docs/assets/) nearby.
