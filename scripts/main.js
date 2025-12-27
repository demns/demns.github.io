import { initParticles, animateParticles, resizeCanvas } from './particle-system.js';
import { initEasterEggs } from './easter-eggs.js';

const els = {
  canvas: document.getElementById('particleCanvas'),
  name: document.getElementById('nameTitle'),
  role: document.getElementById('roleText'),
  footer: document.getElementById('footerText'),
  controller: document.getElementById('controllerBtn'),
  modal: document.getElementById('secretModal'),
  closeModal: document.getElementById('closeModalBtn')
};

// Validate all required elements exist
const requiredElements = ['canvas', 'name', 'role', 'footer', 'controller', 'modal', 'closeModal'];
for (const key of requiredElements) {
  if (!els[key]) {
    console.error(`Required element missing: ${key}`);
    throw new Error(`Portfolio initialization failed: ${key} element not found`);
  }
}

const ctx = els.canvas.getContext('2d');
if (!ctx) {
  throw new Error('Canvas context not supported');
}

const state = {
  nameClicks: 0,
  roleClicks: 0,
  shakes: 0,
  konamiIdx: 0,
  shakeTimer: null,
  motion: { x: 0, y: 0, z: 0 },
  lastShake: 0,
  foundEggs: new Set()
};

resizeCanvas(els.canvas);
window.addEventListener('resize', () => resizeCanvas(els.canvas));

const particles = initParticles(els.canvas);
animateParticles(els.canvas, ctx, particles);

initEasterEggs(els, state);
