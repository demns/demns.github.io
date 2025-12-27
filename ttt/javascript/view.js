import { GAME_CONFIG, THEMES } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeSwitcher = document.querySelector('.theme-switcher');
  let currentThemeIndex = 0;

  function applyTheme(themeName) {
    body.classList.remove(...THEMES.NAMES);
    body.classList.add(themeName);
    currentThemeIndex = THEMES.NAMES.indexOf(themeName);
    if (themeSwitcher) themeSwitcher.textContent = THEMES.ICONS[currentThemeIndex];
  }

  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      currentThemeIndex = (currentThemeIndex + 1) % THEMES.NAMES.length;
      const nextTheme = THEMES.NAMES[currentThemeIndex];
      applyTheme(nextTheme);

      themeSwitcher.classList.add('rotating');
      setTimeout(() => themeSwitcher.classList.remove('rotating'), GAME_CONFIG.THEME_TRANSITION_DURATION);
    });
  }

  // Set initial theme based on time of day
  const initialTheme = getCurrentPeriod();
  applyTheme(initialTheme);
});

function getCurrentPeriod() {
  const time = new Date();
  const hour = time.getHours();

  if (hour >= THEMES.TIME_THRESHOLDS.EVENING) {
    return 'evening';
  } else if (hour >= THEMES.TIME_THRESHOLDS.AFTERNOON) {
    return 'afternoon';
  } else if (hour >= THEMES.TIME_THRESHOLDS.MORNING) {
    return 'morning';
  } else {
    return 'midnight';
  }
}
