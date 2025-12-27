import { CELEBRATIONS } from './config.js';
import { updateFooterText } from './utils.js';

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

export function updateEasterEggCounter(state, footerEl, eggName) {
  state.foundEggs.add(eggName);
  const count = state.foundEggs.size;
  const total = 5;
  updateFooterText(footerEl, count, total);
}
