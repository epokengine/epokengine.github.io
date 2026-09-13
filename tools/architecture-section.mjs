// Semantic HTML keeps labels selectable and readable at every breakpoint.
// Solid connectors describe the current build pipeline. The dashed horizon is
// a user-requested teaser, not a declaration of another implemented backend.
export function architectureSection() {
  return `<section id="architecture" class="section wrap architecture-section" aria-labelledby="architecture-title">
  <div class="section-heading"><div><p class="eyebrow">UNDER THE HOOD / BEYOND THE FRAME</p><h2 id="architecture-title">Built in layers.<br><span class="muted">Made to go further.</span></h2></div><p>A visual workspace on your computer.<br>A native game on original hardware.</p></div>
  <figure class="architecture-diagram" aria-describedby="architecture-caption">
    <div class="architecture-bar"><span class="mono">EPOK / SYSTEM MAP</span><div class="architecture-legend"><span><i aria-hidden="true"></i> Available today</span><span><i class="dashed" aria-hidden="true"></i> A future direction</span></div></div>
    <ol class="architecture-flow" aria-label="From authored project to native PSX game">
      <li class="architecture-stage arch-author">
        <div class="arch-stage-label"><span class="mono">01</span> AUTHOR / DESKTOP</div>
        <a class="arch-node-title" href="/docs/editor/"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 7h18M8 21h8M12 17v4M8 7v10"/></svg><h3>Epok Editor</h3><span aria-hidden="true">↗</span></a>
        <p class="arch-stack">Rust · wgpu · dockable workspace</p>
        <div class="arch-components"><a href="/docs/actors/">Scenes, Actors &amp; Components <span aria-hidden="true">↗</span></a><a href="/docs/assets/">Source-preserving assets <span aria-hidden="true">↗</span></a><a href="/docs/blueprints/">Blueprints &amp; native C++ <span aria-hidden="true">↗</span></a></div>
        <p class="arch-stage-note">Your project owns the source.<br>The editor owns the workspace.</p>
        <div class="arch-connector" aria-hidden="true"><span>validate</span><svg viewBox="0 0 48 16"><path d="M0 8h43m-5-5 5 5-5 5"/></svg></div>
      </li>
      <li class="architecture-stage arch-compile">
        <div class="arch-stage-label"><span class="mono">02</span> PREPARE / HOST TOOLS</div>
        <a class="arch-node-title" href="/docs/architecture/#build-and-execution"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/></svg><h3>Reflect. Cook. Build.</h3><span aria-hidden="true">↗</span></a>
        <p class="arch-stack">Typed contracts · target conversion</p>
        <div class="arch-components"><a href="/docs/scripting/">Reflection &amp; generated C++ <span aria-hidden="true">↗</span></a><a href="/docs/assets/">Cooked geometry, textures &amp; audio <span aria-hidden="true">↗</span></a><a href="/docs/play/#memory-analyzer">Provenance &amp; memory validation <span aria-hidden="true">↗</span></a></div>
        <p class="arch-stage-note">Build-time work stays on the host.<br>Only prepared code and data ship.</p>
        <div class="arch-connector" aria-hidden="true"><span>compile</span><svg viewBox="0 0 48 16"><path d="M0 8h43m-5-5 5 5-5 5"/></svg></div>
      </li>
      <li class="architecture-stage arch-target">
        <div class="arch-stage-label"><span class="mono">03</span> EXECUTE / ORIGINAL HARDWARE</div>
        <a class="arch-node-title" href="/docs/runtime/"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M8 1v4M12 1v4M16 1v4M8 19v4M12 19v4M16 19v4M1 8h4M1 12h4M1 16h4M19 8h4M19 12h4M19 16h4"/></svg><h3>Epok Runtime</h3><span aria-hidden="true">↗</span></a>
        <p class="arch-stack">C++20 · fixed point · bounded pools</p>
        <div class="arch-runtime-grid"><span>Scenes &amp; lifetime</span><span>Input &amp; collision</span><span>Rendering &amp; HUD</span><span>Audio &amp; effects</span></div>
        <div class="arch-platform"><span class="arch-target-led" aria-hidden="true"></span><strong>Original PlayStation</strong><span>PsyQo / native MIPS</span></div>
        <p class="arch-stage-note">PS-X EXE / disc · emulator or console<br><a href="/docs/play/">See target requirements ↗</a></p>
      </li>
    </ol>
    <div class="arch-horizon"><div class="arch-horizon-copy"><span class="mono">THE SOURCE STAYS. THE HORIZON MOVES.</span><p>Some familiar hardware is still just a silhouette.</p></div><div class="arch-future" aria-label="Future direction, not an available console target"><span class="arch-signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><div><span class="mono">NEXT SIGNAL / UNDISCLOSED</span><strong>Another era is calling.</strong><span>More retro horizons. Stay tuned.</span></div></div></div>
    <figcaption id="architecture-caption">The editor validates project data, generates native code and cooks target assets. The PSX runtime uses PsyQo to reach the hardware. <strong>PSX is the supported game target today;</strong> the next signal is a glimpse ahead, not an available export option.</figcaption>
  </figure>
  <div class="architecture-links"><a class="text-link" href="/docs/architecture/">Explore the architecture <span aria-hidden="true">↗</span></a><a class="text-link" href="/docs/api/">Browse the native API <span aria-hidden="true">↗</span></a></div>
  </section>`;
}
