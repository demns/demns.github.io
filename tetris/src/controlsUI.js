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
			<span class="key">Space</span>
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

	// Left button
	const leftBtn = document.createElement('button');
	leftBtn.className = 'mobile-btn mobile-btn-left';
	leftBtn.textContent = '←';
	leftBtn.style.gridColumn = '1';
	leftBtn.style.gridRow = '1';

	// Right button
	const rightBtn = document.createElement('button');
	rightBtn.className = 'mobile-btn mobile-btn-right';
	rightBtn.textContent = '→';
	rightBtn.style.gridColumn = '1';
	rightBtn.style.gridRow = '2';

	// Down button
	const downBtn = document.createElement('button');
	downBtn.className = 'mobile-btn mobile-btn-down';
	downBtn.textContent = '↓';

	// Rotate button
	const rotateBtn = document.createElement('button');
	rotateBtn.className = 'mobile-btn mobile-btn-rotate';
	rotateBtn.textContent = '↻';

	grid.appendChild(leftBtn);
	grid.appendChild(rightBtn);
	grid.appendChild(downBtn);
	grid.appendChild(rotateBtn);
	container.appendChild(grid);
	document.body.appendChild(container);

	return {
		container,
		buttons: {
			left: leftBtn,
			right: rightBtn,
			down: downBtn,
			rotate: rotateBtn
		}
	};
}
