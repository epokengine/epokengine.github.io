# World sprites, animation and particles

Add **Sprite** to an Empty object. Select an imported Texture, world size, normalized pivot and pixel atlas rectangle. `[0,0,0,0]` uses the entire texture. Fixed orientation inherits the complete object transform; Upright follows camera yaw while preserving world up; Spherical follows camera yaw and pitch. Sprite transforms include the object's parents and scale. Flip affects UVs only.

Cutout pixels use the PSX zero palette entry. Average, Add, Subtract and Add quarter enable the hardware semitransparency mode; imported alpha determines which texels participate. Sprites and geometry share the 512-entry ordering table. A positive depth bias moves a sprite farther away in quarter-unit steps. Near/far and screen-plane clipping interpolate UVs. A clipped sprite uses one depth bucket to avoid a diagonal seam. The PSX ordering table cannot perfectly sort intersecting polygons, so split occluders and use modest bias where needed.

Lit sprites use the existing ambient and selected directional/point lights through GTE, with the plane's facing normal. Unlit bypasses lighting. Blob Shadow remains an optional separate contact-shadow component.

**Sprite Animator** stores reusable named clips, pixel rectangles, durations and numeric frame events. The inspector edits clips and can slice a horizontal atlas row. Duration must be at least 1/60 second. The runtime advances by simulation time, holds the final frame of a non-looping clip, and exposes completion once:

```cpp
auto& animator = entity().sprite_animator;
animator.play(1);
uint16_t event;
while (animator.poll_event(event)) { /* game-defined event IDs */ }
if (animator.take_completion()) { /* final frame remains visible */ }
```

Events are emitted on entering a frame, including the initial frame when playing. Sixteen events are queued; `dropped_events` records overflow. Pause/resume preserves the current frame. Sprite animation and particle simulation share the runtime's fixed simulation clock and pause state.

**Particle Emitter** supports continuous rate or one burst on start, additional `burst(count)` requests, finite lifetime, velocity spread, gravity, start/end size and color, atlas flipbooks, and local/world simulation space. Local particles follow their emitter's hierarchy. World particles retain their emitted position and direction when the emitter moves. New particles are discarded when a pool is full; existing particles finish naturally. Deleting/reusing their owner invalidates them by generation.

```cpp
auto& emitter = entity().particle_emitter;
emitter.burst(24); // on the next simulation tick
emitter.stop();    // stops new automatic emission
emitter.play();    // restarts automatic emission
```

Limits are 64 authored emitters, 128 particles per emitter, 256 globally, and 2048 sprite triangles per frame. Particle slots are independent of entity slots. `particle_stats` reports alive, spawned, dropped and peak counts; `sprite_stats` reports submitted, culled, clipped and dropped rendering work. Lifetimes and flipbook cells are validated before export. The editor previews an eight-second repeating timeline with a cached fixed-step pool and at most eight catch-up ticks per frame.

The [included example](../examples/rpg-2-5d-demo/README.md) exercises textured geometry, sprite sorting, animation, bursts, collision, input, resource reuse and HUD text. Host runtime tests use the actual PsyQo Q12 type: `python tests/runtime/verify_sprites_particles.py`.
