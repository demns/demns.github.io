/**
 * Creates and displays the keyboard controls UI
 */
export function createControlsUI() {
	const panel = document.createElement('div');
	panel.className = 'controls-panel';
	panel.innerHTML = `
		<h3>Controls</h3>
		<div class="control-row">
			<span class="key">←</span>
			<span class="action">Move Left</span>
		</div>
		<div class="control-row">
			<span class="key">→</span>
			<span class="action">Move Right</span>
		</div>
		<div class="control-row">
			<span class="key">↓</span>
			<span class="action">Move Down</span>
		</div>
		<div class="control-row">
			<span class="key">↑</span>
			<span class="action">Rotate</span>
		</div>
		<div class="control-row">
			<span class="key text-key">Space</span>
			<span class="action">Hard Drop</span>
		</div>
	`;
	document.body.appendChild(panel);
	return panel;
}

/**
 * Creates mobile touch controls
 */
export function createMobileControls(currentElement, collidableMeshList, scene) {
	const container = document.createElement('div');
	container.className = 'mobile-controls';

	const grid = document.createElement('div');
	grid.className = 'mobile-controls-grid';

	// Left button (row 2, col 1)
	const leftBtn = document.createElement('button');
	leftBtn.className = 'mobile-btn mobile-btn-left';
	leftBtn.textContent = '←';

	// Down button (row 2, col 2)
	const downBtn = document.createElement('button');
	downBtn.className = 'mobile-btn mobile-btn-down';
	downBtn.textContent = '↓';

	// Right button (row 2, col 3)
	const rightBtn = document.createElement('button');
	rightBtn.className = 'mobile-btn mobile-btn-right';
	rightBtn.textContent = '→';

	// Rotate button (row 1, col 1-2)
	const rotateBtn = document.createElement('button');
	rotateBtn.className = 'mobile-btn mobile-btn-rotate';
	rotateBtn.textContent = '↻ Rotate';

	// Hard drop button (row 1, col 3)
	const dropBtn = document.createElement('button');
	dropBtn.className = 'mobile-btn mobile-btn-drop';
	dropBtn.textContent = '⬇ Drop';

	grid.appendChild(rotateBtn);
	grid.appendChild(dropBtn);
	grid.appendChild(leftBtn);
	grid.appendChild(downBtn);
	grid.appendChild(rightBtn);
	container.appendChild(grid);
	document.body.appendChild(container);

	return {
		container,
		buttons: {
			left: leftBtn,
			right: rightBtn,
			down: downBtn,
			rotate: rotateBtn,
			drop: dropBtn
		}
	};
}
