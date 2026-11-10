import { loadPlayer } from '/play/player.js';

const demo = document.querySelector('[data-playable]');
const launch = demo.querySelector('[data-playable-launch]');
const stop = demo.querySelector('[data-playable-stop]');
const screen = demo.querySelector('[data-playable-screen]');
const status = demo.querySelector('[data-playable-status]');

launch.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const game = document.createElement('div');
  game.id = 'game';
  screen.replaceChildren(game);
  stop.hidden = false;
  stop.focus();
  status.textContent = 'Loading the PlayStation emulator…';
  loadPlayer(game, message => { status.textContent = message; });
});

stop.addEventListener('click', () => {
  // Reload the page to release the emulator's WASM instance and input listeners.
  history.replaceState(null, '', '#playable-preview');
  location.reload();
});
