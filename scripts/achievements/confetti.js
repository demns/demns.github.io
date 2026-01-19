const COLORS = ['#ff6b35', '#ff8c61', '#ffa87a', '#ffffff', '#e5e5e5', '#ffcc00'];
const PHYSICS = {
	GRAVITY: 0.2,
	LIFE_DECAY: 0.01,
	UPWARD_BOOST: -3
};

export class ConfettiSystem {
	constructor() {
		this.canvas = null;
		this.ctx = null;
		this.particles = [];
		this.animationFrame = null;
	}

	initCanvas() {
		if (this.canvas) return;

		this.canvas = document.createElement('canvas');
		this.canvas.id = 'confettiCanvas';
		this.canvas.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 9998;
		`;
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext('2d');
		this.resize();

		window.addEventListener('resize', () => this.resize());
	}

	resize() {
		if (!this.canvas) return;
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	burst(x, y, count = 60) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		this.initCanvas();

		for (let i = 0; i < count; i++) {
			const angle = (Math.PI * 2 * i) / count;
			const velocity = 3 + Math.random() * 4;

			this.particles.push({
				x,
				y,
				vx: Math.cos(angle) * velocity,
				vy: Math.sin(angle) * velocity + PHYSICS.UPWARD_BOOST,
				color: COLORS[Math.floor(Math.random() * COLORS.length)],
				size: 4 + Math.random() * 4,
				life: 1.0,
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: (Math.random() - 0.5) * 0.2
			});
		}

		if (!this.animationFrame) this.animate();
	}

	animate() {
		if (!this.ctx || !this.canvas) return;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];

			p.vy += PHYSICS.GRAVITY;
			p.x += p.vx;
			p.y += p.vy;
			p.rotation += p.rotationSpeed;
			p.life -= PHYSICS.LIFE_DECAY;

			if (p.life <= 0 || p.y > this.canvas.height) {
				this.particles.splice(i, 1);
				continue;
			}

			this.ctx.save();
			this.ctx.translate(p.x, p.y);
			this.ctx.rotate(p.rotation);
			this.ctx.globalAlpha = p.life;
			this.ctx.fillStyle = p.color;
			this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
			this.ctx.restore();
		}

		if (this.particles.length > 0) {
			this.animationFrame = requestAnimationFrame(() => this.animate());
		} else {
			this.animationFrame = null;
		}
	}

	clear() {
		this.particles = [];
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame);
			this.animationFrame = null;
		}
		if (this.ctx && this.canvas) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}
}
