import { GAME_CONFIG } from './config';

/**
 * Checks for complete lines and clears them from the game.
 * Returns the number of lines cleared.
 * @param {Array<Three.Mesh>} collidableMeshList - Array of all placed piece meshes
 * @param {Three.Scene} scene - The Three.js scene
 * @returns {number} Number of lines cleared
 */
export function checkAndClearLines(collidableMeshList, scene) {
	const grid = buildGrid(collidableMeshList);
	const completedLines = findCompletedLines(grid);

	if (completedLines.length === 0) {
		return 0;
	}

	// Remove blocks from completed lines
	removeBlocks(completedLines, collidableMeshList, scene, grid);

	// Move blocks down
	moveBlocksDown(completedLines, collidableMeshList, grid);

	return completedLines.length;
}

/**
 * Builds a 2D grid representation of the play area.
 * Each cell contains a reference to the mesh occupying it, or null if empty.
 */
function buildGrid(collidableMeshList) {
	const grid = {};

	// Flatten all meshes to individual blocks
	collidableMeshList.forEach(group => {
		group.children.forEach(block => {
			const worldPos = block.getWorldPosition(block.position.clone());
			const x = Math.round(worldPos.x);
			const y = Math.round(worldPos.y);
			const key = `${x},${y}`;
			grid[key] = block;
		});
	});

	return grid;
}

/**
 * Finds Y coordinates of all completed lines.
 */
function findCompletedLines(grid) {
	const completedLines = [];

	for (let y = GAME_CONFIG.MIN_Y; y <= GAME_CONFIG.MAX_Y; y++) {
		let blocksInLine = 0;

		for (let x = Math.ceil(GAME_CONFIG.MIN_X); x <= Math.floor(GAME_CONFIG.MAX_X); x++) {
			const key = `${x},${y}`;
			if (grid[key]) {
				blocksInLine++;
			}
		}

		if (blocksInLine === GAME_CONFIG.BOARD_WIDTH) {
			completedLines.push(y);
		}
	}

	return completedLines;
}

/**
 * Removes blocks from completed lines.
 */
function removeBlocks(completedLines, collidableMeshList, scene, grid) {
	completedLines.forEach(y => {
		for (let x = Math.ceil(GAME_CONFIG.MIN_X); x <= Math.floor(GAME_CONFIG.MAX_X); x++) {
			const key = `${x},${y}`;
			const block = grid[key];

			if (block && block.parent) {
				// Remove block from its parent group
				block.parent.remove(block);

				// If parent group is now empty, remove it from scene and collidableMeshList
				if (block.parent.children.length === 0) {
					scene.remove(block.parent);
					const index = collidableMeshList.indexOf(block.parent);
					if (index > -1) {
						collidableMeshList.splice(index, 1);
					}
				}
			}
		}
	});
}

/**
 * Moves all blocks above cleared lines down.
 */
function moveBlocksDown(completedLines, collidableMeshList, grid) {
	// Sort lines from bottom to top
	completedLines.sort((a, b) => a - b);

	// For each cleared line, move everything above it down
	completedLines.forEach(clearedY => {
		// Move all blocks above this line down by 1
		Object.keys(grid).forEach(key => {
			const [x, y] = key.split(',').map(Number);

			if (y > clearedY && grid[key]) {
				grid[key].position.y -= 1;
			}
		});
	});
}
