export const width = window.innerWidth;
export const height = window.innerHeight;

// Tetris game configuration
export const GAME_CONFIG = {
	// Play area dimensions (in units)
	BOARD_WIDTH: 10,
	BOARD_HEIGHT: 20,

	// Boundaries for piece movement
	MIN_X: -4.5,
	MAX_X: 4.5,
	MIN_Y: 0,
	MAX_Y: 19,

	// Starting position for new pieces
	SPAWN_X: 0,
	SPAWN_Y: 10,

	// Game timing
	INITIAL_DROP_SPEED: 1000,
};
