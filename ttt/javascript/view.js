document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeSwitcher = document.querySelector('.theme-switcher'); // This now correctly finds the button

  const themes = ['morning', 'afternoon', 'evening', 'midnight'];
  const themeIcons = ['☀️', '🌇', '🌆', '🌙']; // Sun, Sunset, Cityscape, Moon
  let currentThemeIndex = 0;

  function applyTheme(themeName) {
    body.classList.remove(...themes);
    body.classList.add(themeName);
    currentThemeIndex = themes.indexOf(themeName);
    if (themeSwitcher) themeSwitcher.textContent = themeIcons[currentThemeIndex];
  }

  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const nextTheme = themes[currentThemeIndex];
      applyTheme(nextTheme);

      // Add a class for animation and remove it after the animation completes
      themeSwitcher.classList.add('rotating');
      setTimeout(() => themeSwitcher.classList.remove('rotating'), 300);
    });
  }

  // Set initial theme based on time of day
  const initialTheme = getCurrentPeriod();
  applyTheme(initialTheme);
});

function getCurrentPeriod() {
  const time = new Date();
  const hour = time.getHours();

  if (hour >= 17) {
    return 'evening';
  } else if (hour >= 12) {
    return 'afternoon';
  } else if (hour >= 7) {
    return 'morning';
  } else {
    return 'midnight';
  }
}
