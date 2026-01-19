import { Vector3 } from 'three';
import { GAME_CONFIG } from './config';

/**
 * Checks for complete lines and clears them from the game.
 *
 * APPROACH: Flatten all blocks to scene level with absolute positions,
 * then work with simple Y coordinates without parent/child complexity.
 */
export function checkAndClearLines(collidableMeshList, scene) {
	// Step 1: Flatten all blocks - detach from parent groups and set world position directly
	flattenAllBlocks(collidableMeshList, scene);

	// Step 2: Build grid from flattened blocks
	const grid = buildGrid(collidableMeshList);

	// Step 3: Find completed lines
	const completedLines = findCompletedLines(grid);

	if (completedLines.length === 0) {
		return { count: 0, lines: [] };
	}

	// Step 4: Remove blocks in completed lines
	removeCompletedLineBlocks(completedLines, collidableMeshList, scene);

	// Step 5: Drop blocks above cleared lines
	dropBlocksAbove(completedLines, collidableMeshList);

	return { count: completedLines.length, lines: completedLines };
}

/**
 * Flatten all blocks: detach each block from its parent Group and add directly to scene.
 * After this, each block in collidableMeshList is a single Mesh with position = world position.
 */
function flattenAllBlocks(collidableMeshList, scene) {
	const tempVec = new Vector3();
	const blocksToAdd = [];
	const groupsToRemove = [];

	// Process each group
	for (let i = collidableMeshList.length - 1; i >= 0; i--) {
		const group = collidableMeshList[i];

		// Skip if this is already a flattened block (no children, or is a Mesh not Group)
		if (!group.children || group.children.length === 0) {
			continue;
		}

		// This is a Group with children - flatten it
		group.updateMatrixWorld(true);

		// Collect all blocks with their world positions
		const childrenCopy = [...group.children]; // Copy because we'll modify
		childrenCopy.forEach(block => {
			block.getWorldPosition(tempVec);

			// Detach from parent
			group.remove(block);

			// Set block's position to world position
			block.position.set(
				Math.round(tempVec.x),
				Math.round(tempVec.y),
				Math.round(tempVec.z)
			);

			// Reset rotation (blocks are 1x1x1 cubes, rotation doesn't matter visually)
			block.rotation.set(0, 0, 0);

			blocksToAdd.push(block);
		});

		// Mark empty group for removal
		groupsToRemove.push({ group, index: i });
	}

	// Remove empty groups from scene and list
	groupsToRemove.forEach(({ group, index }) => {
		scene.remove(group);
		collidableMeshList.splice(index, 1);
	});

	// Add flattened blocks to scene and list
	blocksToAdd.forEach(block => {
		scene.add(block);
		collidableMeshList.push(block);
	});
}

/**
 * Build grid from flattened blocks (each block is now directly in scene with world position)
 */
function buildGrid(collidableMeshList) {
	const grid = {};

	collidableMeshList.forEach(block => {
		const x = Math.round(block.position.x);
		const y = Math.round(block.position.y);
		const key = `${x},${y}`;
		grid[key] = block;
	});

	return grid;
}

/**
 * Find completed lines
 */
function findCompletedLines(grid) {
	const completedLines = [];

	for (let y = 0; y <= GAME_CONFIG.MAX_Y; y++) {
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
 * Remove blocks in completed lines
 */
function removeCompletedLineBlocks(completedLines, collidableMeshList, scene) {
	const clearedYSet = new Set(completedLines);

	for (let i = collidableMeshList.length - 1; i >= 0; i--) {
		const block = collidableMeshList[i];
		const y = Math.round(block.position.y);

		if (clearedYSet.has(y)) {
			scene.remove(block);
			collidableMeshList.splice(i, 1);
		}
	}
}

/**
 * Drop blocks above cleared lines
 */
function dropBlocksAbove(completedLines, collidableMeshList) {
	completedLines.sort((a, b) => a - b); // Sort bottom to top

	collidableMeshList.forEach(block => {
		const blockY = Math.round(block.position.y);

		// Count how many cleared lines are below this block
		const linesBelow = completedLines.filter(clearedY => clearedY < blockY).length;

		if (linesBelow > 0) {
			block.position.y -= linesBelow;
		}
	});
}
