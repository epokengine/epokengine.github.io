export function playableSection(version) {
  return `<section id="playable-preview" class="section wrap playable" data-playable aria-labelledby="playable-title">
    <div class="playable-copy">
      <p class="eyebrow">PLAYABLE PSX DEMO / ${version}</p>
      <h2 id="playable-title">Dungeon Template</h2>
      <p>Enter Reactor Station, find the access key and take down the guardian. This is the PlayStation build of the third-person action template shipped with Epok.</p>
      <p><a class="text-link" href="/docs/dungeon-complete/">Explore the template <span aria-hidden="true">→</span></a></p>
      <details class="playable-controls">
        <summary>Keyboard and controller</summary>
        <dl>
          <dt>Move</dt><dd>Arrow keys / D-pad or left stick</dd>
          <dt>Camera</dt><dd><kbd>I</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> / right stick</dd>
          <dt>Jump or interact</dt><dd><kbd>X</kbd> / Cross</dd>
          <dt>Shoot</dt><dd><kbd>S</kbd> / Square</dd>
          <dt>Aim or lock on</dt><dd><kbd>Q</kbd> <kbd>E</kbd> / L1, R1</dd>
          <dt>Inventory / close</dt><dd><kbd>A</kbd> <kbd>Z</kbd> / Triangle, Circle</dd>
          <dt>Retry</dt><dd><kbd>Enter</kbd> / Start</dd>
        </dl>
        <p>Click the game screen to focus it. Use Control Settings to remap inputs.</p>
      </details>
      <p class="small muted">The PocketStation companion requires the Epok editor or a PocketStation. <a href="/play/credits/">Demo credits</a></p>
    </div>
    <div class="playable-console">
      <div class="window-bar"><span>REACTOR STATION</span><button type="button" data-playable-stop hidden>Close game</button></div>
      <div class="playable-screen" data-playable-screen>
        <a class="playable-launch" data-playable-launch href="/play/player/">
          <img src="/media/docs/images/dungeon-complete.png" alt="" width="640" height="480" loading="lazy">
          <span class="button primary"><span aria-hidden="true">▶</span> Play Dungeon Template</span>
        </a>
      </div>
      <p class="small muted playable-status" role="status" data-playable-status></p>
    </div>
  </section>`;
}
