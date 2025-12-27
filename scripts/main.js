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

const ctx = els.canvas.getContext('2d');

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
