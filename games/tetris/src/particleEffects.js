import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

/**
 * Creates particle explosion effect when lines are cleared
 * @param {Array<number>} clearedLines - Y positions of cleared lines
 * @param {THREE.Scene} scene - The scene
 * @param {Object} config - Game config
 */
export function createLineCleaningParticles(clearedLines, scene, config) {
	const particles = [];
	const particleCount = 10; // particles per cleared line (reduced from 20 for performance)

	clearedLines.forEach(lineY => {
		for (let i = 0; i < particleCount; i++) {
			// Random position along the cleared line
			const x = config.MIN_X + Math.random() * config.BOARD_WIDTH;
			const z = -0.5 + Math.random();

			// Create small cube particle
			const geometry = new BoxGeometry(0.2, 0.2, 0.2);
			const material = new MeshBasicMaterial({
				color: Math.random() > 0.5 ? 0xFFFFFF : 0x44DDFF,
				transparent: true,
				opacity: 1
			});
			const particle = new Mesh(geometry, material);

			particle.position.set(x, lineY, z);

			// Random velocity
			particle.userData.velocity = {
				x: (Math.random() - 0.5) * 0.3,
				y: Math.random() * 0.5 + 0.3,
				z: (Math.random() - 0.5) * 0.3
			};
			particle.userData.lifetime = 60; // frames
			particle.userData.age = 0;

			scene.add(particle);
			particles.push(particle);
		}
	});

	return particles;
}

/**
 * Update particle positions and remove dead particles
 * @param {Array} particles - Array of particle meshes
 * @param {THREE.Scene} scene - The scene
 */
export function updateParticles(particles, scene) {
	for (let i = particles.length - 1; i >= 0; i--) {
		const particle = particles[i];
		particle.userData.age++;

		// Update position
		particle.position.x += particle.userData.velocity.x;
		particle.position.y += particle.userData.velocity.y;
		particle.position.z += particle.userData.velocity.z;

		// Apply gravity
		particle.userData.velocity.y -= 0.02;

		// Fade out
		const lifeRatio = particle.userData.age / particle.userData.lifetime;
		particle.material.opacity = 1 - lifeRatio;
		particle.scale.setScalar(1 - lifeRatio * 0.5);

		// Remove dead particles
		if (particle.userData.age >= particle.userData.lifetime) {
			scene.remove(particle);
			particle.geometry.dispose();
			particle.material.dispose();
			particles.splice(i, 1);
		}
	}
}

/**
 * Create flash effect when piece lands
 * @param {THREE.Group} piece - The landed piece
 * @returns {Object} Flash animation data
 */
export function createLandingFlash(piece) {
	const originalIntensities = [];

	piece.children.forEach(block => {
		originalIntensities.push(block.material.emissiveIntensity);
		block.material.emissiveIntensity = 0.8; // Bright flash
	});

	return {
		piece,
		originalIntensities,
		duration: 10, // frames
		age: 0
	};
}

/**
 * Update landing flash animation
 * @param {Array} flashes - Array of flash animation objects
 */
export function updateLandingFlashes(flashes) {
	for (let i = flashes.length - 1; i >= 0; i--) {
		const flash = flashes[i];
		flash.age++;

		const progress = flash.age / flash.duration;

		flash.piece.children.forEach((block, idx) => {
			// Lerp back to original intensity
			const original = flash.originalIntensities[idx];
			block.material.emissiveIntensity = 0.8 - (0.8 - original) * progress;
		});

		if (flash.age >= flash.duration) {
			flashes.splice(i, 1);
		}
	}
}
