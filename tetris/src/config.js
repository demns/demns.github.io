export const width = window.innerWidth;
export const height = window.innerHeight;

// Tetris game configuration
export const GAME_CONFIG = {
	// Play area dimensions (in units)
	BOARD_WIDTH: 10,
	BOARD_HEIGHT: 20,

	// Boundaries for piece movement (integer coordinates for block centers)
	// 10-block wide board: X ranges from -5 to 4
	// Floor plane is at Y=-0.5, blocks at Y=0 sit on floor with bottoms at -0.5
	MIN_X: -5,
	MAX_X: 4,
	MIN_Y: -0.5,  // Allow block bottoms to reach -0.5 (centers at Y=0)
	MAX_Y: 19,

	// Starting position for new pieces
	SPAWN_X: 0,
	SPAWN_Y: 10,

	// Game timing
	INITIAL_DROP_SPEED: 1000,
};
