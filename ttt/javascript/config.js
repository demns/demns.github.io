/**
 * Configuration constants for Tic Tac Toe game
 */

export const GAME_CONFIG = {
  BOARD_SIZE: 9,
  THEME_TRANSITION_DURATION: 300, // milliseconds
};

export const THEMES = {
  NAMES: ['morning', 'afternoon', 'evening', 'midnight'],
  ICONS: ['☀️', '🌇', '🌆', '🌙'],
  TIME_THRESHOLDS: {
    EVENING: 17,
    AFTERNOON: 12,
    MORNING: 7,
  },
};
