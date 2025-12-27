export function addAccessibleClickHandler(element, handler) {
  element.addEventListener('click', handler);
  element.addEventListener('touchend', (e) => {
    e.preventDefault();
    handler();
  });
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  });
}

export function updateFooterText(footerEl, foundCount, total) {
  if (foundCount === total) {
    footerEl.textContent = `Made with 🧡 in Berlin · 🎉 All easter eggs found!`;
  } else {
    footerEl.textContent = `Made with 🧡 in Berlin · 🎮 ${foundCount}/${total} easter eggs found`;
  }
}
