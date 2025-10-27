document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeSwitcher = document.querySelector('.theme-switcher'); // This now correctly finds the button
  const humanImageDiv = document.getElementById('humanImage');
  const computerImageDiv = document.getElementById('computerImage');

  const themes = ['morning', 'afternoon', 'evening', 'midnight'];
  let currentThemeIndex = 0;
  humanImageDiv.addEventListener('click', () => {
    TTTApplication.setup(false);
  });

  computerImageDiv.addEventListener('click', () => {
    TTTApplication.setup(true);
  });

  function applyTheme(themeName) {
    body.classList.remove(...themes);
    body.classList.add(themeName);
    currentThemeIndex = themes.indexOf(themeName);
  }

  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const nextTheme = themes[currentThemeIndex];
      applyTheme(nextTheme);
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
  } else if (hour >= 0) {
    return 'midnight';
  }
}
