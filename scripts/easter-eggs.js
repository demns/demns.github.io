import { CONFIG } from './config.js';
import { createCelebration, updateEasterEggCounter } from './celebrations.js';
import { addAccessibleClickHandler, updateFooterText } from './utils.js';

export function initEasterEggs(els, state) {
  function handleNameClick() {
    state.nameClicks++;
    if (state.nameClicks === CONFIG.NAME_CLICK_COUNT) {
      createCelebration('name');
      updateEasterEggCounter(state, els.footer, 'name');
      state.nameClicks = 0;
    }
  }

  function handleRoleClick() {
    state.roleClicks++;
    if (state.roleClicks === CONFIG.ROLE_CLICK_COUNT) {
      createCelebration('role');
      updateEasterEggCounter(state, els.footer, 'role');
      els.role.style.color = 'var(--accent)';
      setTimeout(() => els.role.style.color = '', CONFIG.ROLE_COLOR_DURATION);
      state.roleClicks = 0;
    }
  }

  function handleControllerClick() {
    createCelebration('controller');
    updateEasterEggCounter(state, els.footer, 'controller');
    els.controller.style.transform = 'scale(1.5) rotate(360deg)';
    setTimeout(() => els.controller.style.transform = '', CONFIG.CONTROLLER_TRANSFORM_DURATION);
  }

  function handleFooterShake() {
    state.shakes++;
    els.footer.classList.add('shake');
    setTimeout(() => els.footer.classList.remove('shake'), CONFIG.FOOTER_SHAKE_DURATION);

    clearTimeout(state.shakeTimer);
    state.shakeTimer = setTimeout(() => state.shakes = 0, CONFIG.SHAKE_TIMEOUT);

    if (state.shakes >= CONFIG.FOOTER_SHAKE_COUNT) {
      createCelebration('berlin');
      updateEasterEggCounter(state, els.footer, 'berlin');
      const currentCount = state.foundEggs.size;
      els.footer.textContent = '🎉 Berlin loves you back! 🧡';
      setTimeout(() => {
        updateFooterText(els.footer, currentCount, CONFIG.TOTAL_EASTER_EGGS);
      }, CONFIG.BERLIN_MESSAGE_DURATION);
      state.shakes = 0;
    }
  }

  function handleKonami(e) {
    if (e.key.toLowerCase() === CONFIG.KONAMI_CODE[state.konamiIdx].toLowerCase()) {
      state.konamiIdx++;
      if (state.konamiIdx === CONFIG.KONAMI_CODE.length) {
        els.modal.classList.add('show');
        createCelebration('konami');
        updateEasterEggCounter(state, els.footer, 'konami');
        state.konamiIdx = 0;
      }
    } else {
      state.konamiIdx = 0;
    }
  }

  function closeModal() {
    els.modal.classList.remove('show');
  }

  addAccessibleClickHandler(els.name, handleNameClick);
  addAccessibleClickHandler(els.role, handleRoleClick);
  addAccessibleClickHandler(els.controller, handleControllerClick);
  addAccessibleClickHandler(els.footer, handleFooterShake);

  els.closeModal.addEventListener('click', closeModal);
  document.addEventListener('keydown', handleKonami);

  if (window.DeviceMotionEvent) {
    try {
      window.addEventListener('devicemotion', (e) => {
        try {
          const acc = e.accelerationIncludingGravity;
          if (!acc) return;

          const now = Date.now();
          if (now - state.lastShake < CONFIG.SHAKE_COOLDOWN) return;

          const delta = Math.abs(acc.x - state.motion.x) + Math.abs(acc.y - state.motion.y) + Math.abs(acc.z - state.motion.z);

          if (delta > CONFIG.SHAKE_THRESHOLD) {
            state.lastShake = now;
            handleFooterShake();
          }

          state.motion = { x: acc.x, y: acc.y, z: acc.z };
        } catch (error) {
          console.warn('Device motion processing error:', error);
        }
      });
    } catch (error) {
      console.warn('Device motion not supported or permission denied:', error);
    }
  }
}
