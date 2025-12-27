import { CELEBRATIONS } from './config.js';
import { updateFooterText } from './utils.js';

/**
 * Creates and animates a celebration effect by spawning falling emoji elements.
 * Elements are randomly positioned horizontally and fall vertically off screen.
 * @param {string} type - The celebration type key from CELEBRATIONS config (e.g., 'name', 'role', 'berlin')
 */
export function createCelebration(type) {
  const { items, count, size, delay } = CELEBRATIONS[type];

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'falling-item';
      el.textContent = items[Math.floor(Math.random() * items.length)];
      el.style.fontSize = size;
      el.style.left = Math.random() * window.innerWidth + 'px';
      el.style.top = '-50px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }, i * delay);
  }
}

/**
 * Updates the easter egg counter in the footer and marks an easter egg as found.
 * @param {Object} state - Application state object containing foundEggs Set
 * @param {HTMLElement} footerEl - The footer element to update
 * @param {string} eggName - The unique identifier for the found easter egg
 */
export function updateEasterEggCounter(state, footerEl, eggName) {
  state.foundEggs.add(eggName);
  const count = state.foundEggs.size;
  const total = 5;
  updateFooterText(footerEl, count, total);
}
