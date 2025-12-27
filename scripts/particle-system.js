import { CONFIG } from './config.js';

/**
 * Represents an animated particle that moves across the canvas background.
 * Particles bounce off canvas edges and connect to nearby particles with lines.
 */
export class Particle {
  /**
   * @param {HTMLCanvasElement} canvas - The canvas element this particle exists within
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  /**
   * Resets the particle to a random position with random velocity and opacity.
   */
  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * 0.3 + 0.1;
  }

  /**
   * Updates particle position and bounces off canvas edges.
   */
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
  }

  /**
   * Draws the particle as a filled circle on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    ctx.fillStyle = `rgba(255, 107, 53, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function initParticles(canvas) {
  return Array.from({ length: CONFIG.PARTICLE_COUNT }, () => new Particle(canvas));
}

export function animateParticles(canvas, ctx, particles) {
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.PARTICLE_CONNECTION_DIST) {
          ctx.strokeStyle = `rgba(255, 107, 53, ${0.1 * (1 - dist / CONFIG.PARTICLE_CONNECTION_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

export function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
