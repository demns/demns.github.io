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

	console.log('[LINE CLEAR] Grid built, checking for complete lines...');
	console.log('[LINE CLEAR] Grid keys:', Object.keys(grid).length);

	const completedLines = findCompletedLines(grid);

	if (completedLines.length === 0) {
		console.log('[LINE CLEAR] No completed lines found');
		return 0;
	}

	console.log(`[LINE CLEAR] Found ${completedLines.length} completed line(s):`, completedLines);

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

	console.log(`[LINE CLEAR] Building grid from ${collidableMeshList.length} groups`);

	// Flatten all meshes to individual blocks
	collidableMeshList.forEach((group, groupIdx) => {
		console.log(`[LINE CLEAR] Group ${groupIdx}: has ${group.children ? group.children.length : 0} children`);
		if (group.children) {
			group.children.forEach((block, blockIdx) => {
				const worldPos = block.getWorldPosition(block.position.clone());
				// All pieces now use integer coordinates, so simple rounding works
				const x = Math.round(worldPos.x);
				const y = Math.round(worldPos.y);
				const key = `${x},${y}`;
				console.log(`[LINE CLEAR]   Block ${blockIdx}: pos(${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}) -> grid[${key}]`);
				grid[key] = block;
			});
		}
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

		if (blocksInLine > 0) {
			console.log(`[LINE CLEAR] Y=${y}: ${blocksInLine}/${GAME_CONFIG.BOARD_WIDTH} blocks`);
		}

		if (blocksInLine === GAME_CONFIG.BOARD_WIDTH) {
			console.log(`[LINE CLEAR] ✓ Line Y=${y} is complete!`);
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
	if (completedLines.length === 0) return;

	// Sort lines from bottom to top
	completedLines.sort((a, b) => a - b);

	// For each Y level, calculate how many cleared lines are below it
	// Then move all blocks at that Y level down by that amount
	const blocksToMove = new Map(); // Map of block -> distance to move down

	Object.keys(grid).forEach(key => {
		const [x, y] = key.split(',').map(Number);
		const block = grid[key];

		if (!block) return;

		// Count how many completed lines are below this block
		const linesBelow = completedLines.filter(clearedY => clearedY < y).length;

		if (linesBelow > 0) {
			blocksToMove.set(block, linesBelow);
		}
	});

	// Now move all blocks down by their calculated distance
	blocksToMove.forEach((distance, block) => {
		block.position.y -= distance;
	});
}
