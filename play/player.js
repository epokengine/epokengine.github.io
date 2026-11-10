const dataUrl = 'https://cdn.emulatorjs.org/4.2.3/data/';

export function loadPlayer(game, status) {
  Object.assign(window, {
    EJS_player: '#game',
    EJS_core: 'pcsx_rearmed',
    EJS_gameName: 'Dungeon Complete',
    EJS_gameID: 1000,
    EJS_gameUrl: '/play/reactor-station.zip',
    EJS_pathtodata: dataUrl,
    EJS_externalFiles: {
      '/home/web_user/.config/retroarch/config/remaps/PCSX-ReARMed/PCSX-ReARMed.rmp': '/play/dual-analog.rmp',
    },
    EJS_startButtonName: 'Start game',
    EJS_alignStartButton: 'center',
    EJS_backgroundImage: '/media/docs/images/dungeon-complete.png',
    EJS_backgroundBlur: true,
    EJS_backgroundColor: '#0b0d0e',
    EJS_color: '#a5efbc',
    EJS_volume: 0.35,
    EJS_Buttons: { cheat: false, cacheManager: false, exitEmulation: false },
    EJS_ready: () => {
      game.querySelector('.player-loading')?.remove();
      const start = game.querySelector('.ejs_start_button');
      start.setAttribute('role', 'button');
      start.tabIndex = 0;
      start.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        start.click();
      });
      start.addEventListener('click', () => status('Starting the PlayStation emulator…'), { once: true });
      start.focus();
      status('Press Start game to boot the disc.');
    },
    EJS_onGameStart: () => status('Game ready. Click the game screen to focus the controls.'),
  });

  const loader = document.createElement('script');
  loader.src = dataUrl + 'loader.js';
  loader.addEventListener('error', () => {
    const message = 'Could not load the emulator. Check your connection and try again.';
    const loading = game.querySelector('.player-loading');
    if (loading) loading.textContent = message;
    status(message);
  });
  document.head.append(loader);
}
