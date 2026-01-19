/**
 * Achievement UI components - tracker, toasts, panel
 */

import { ConfettiSystem } from './confetti.js';

export class AchievementUI {
	constructor(achievementSystem) {
		this.system = achievementSystem;
		this.confetti = new ConfettiSystem();
		this.toasts = [];
		this.panelOpen = false;
		this.updateInterval = null;

		this.createTracker();
		this.createPanel();
		this.updateTracker();

		this.system.on('unlock', (data) => this.onUnlock(data));
		this.system.on('levelup', (data) => this.onLevelUp(data));

		this.startPeriodicUpdate();
	}

	startPeriodicUpdate() {
		this.updateInterval = setInterval(() => {
			if (this.panelOpen) {
				this.updatePanelHeader();
			}
		}, 1000);
	}

	/**
	 * Create achievement tracker widget
	 */
	createTracker() {
		this.tracker = document.createElement('div');
		this.tracker.id = 'achievement-tracker';
		this.tracker.setAttribute('role', 'button');
		this.tracker.setAttribute('tabindex', '0');
		this.tracker.setAttribute('aria-label', 'Open achievement panel');

		const unlockedCount = this.system.getUnlockedCount();
		const totalCount = Object.keys(this.system.data.achievements).length;

		this.tracker.innerHTML = `
			<span class="tracker-icon">🏆</span>
			<span class="tracker-text">${unlockedCount}/${totalCount}</span>
			<span class="tracker-expand">▼</span>
		`;

		this.tracker.addEventListener('click', () => this.togglePanel());
		this.tracker.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.togglePanel();
			}
		});

		document.body.appendChild(this.tracker);
	}

	/**
	 * Update tracker count
	 */
	updateTracker() {
		const unlockedCount = this.system.getUnlockedCount();
		const totalCount = Object.keys(this.system.data.achievements).length;
		const textSpan = this.tracker.querySelector('.tracker-text');
		if (textSpan) {
			textSpan.textContent = `${unlockedCount}/${totalCount}`;
		}
	}

	/**
	 * Create achievement panel (hidden by default)
	 */
	createPanel() {
		// Backdrop
		this.backdrop = document.createElement('div');
		this.backdrop.id = 'achievement-backdrop';
		this.backdrop.addEventListener('click', () => this.closePanel());
		document.body.appendChild(this.backdrop);

		// Panel
		this.panel = document.createElement('div');
		this.panel.id = 'achievement-panel';
		this.panel.setAttribute('role', 'dialog');
		this.panel.setAttribute('aria-modal', 'true');
		this.panel.setAttribute('aria-labelledby', 'achievement-panel-title');

		const stats = this.system.getStats();
		const unlockedCount = this.system.getUnlockedCount();
		const totalCount = Object.keys(this.system.data.achievements).length;
		const percentage = Math.round((unlockedCount / totalCount) * 100);

		const timeMinutes = Math.floor(stats.timeOnSite / 60);
		const timeSeconds = stats.timeOnSite % 60;

		this.panel.innerHTML = `
			<div class="panel-header">
				<div class="panel-title-row">
					<h3 id="achievement-panel-title" class="panel-title">🏆 Achievement Progress</h3>
					<button class="panel-close" aria-label="Close panel">✕</button>
				</div>
				<div class="panel-progress-bar">
					<div class="panel-progress-fill" style="width: ${percentage}%"></div>
				</div>
				<div class="panel-subtitle">${percentage}% Complete</div>
			</div>
			<div class="panel-achievements" id="achievement-list"></div>
			<div class="panel-footer">
				<div class="panel-stats">
					Total XP: ${stats.xpTotal} | Time on site: ${timeMinutes}m ${timeSeconds}s
				</div>
				<button class="panel-reset" id="reset-achievements" aria-label="Reset all achievement progress">
					🔄 Restart Achievements
				</button>
			</div>
		`;

		this.panel.querySelector('.panel-close').addEventListener('click', () => this.closePanel());
		this.panel.querySelector('#reset-achievements').addEventListener('click', () => this.confirmReset());

		document.body.appendChild(this.panel);

		// Populate achievements
		this.updatePanelAchievements();

		// ESC key to close
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && this.panelOpen) {
				this.closePanel();
			}
		});
	}

	updatePanelHeader() {
		const stats = this.system.getStats();
		const unlockedCount = this.system.getUnlockedCount();
		const totalCount = Object.keys(this.system.data.achievements).length;
		const percentage = Math.round((unlockedCount / totalCount) * 100);

		const progressFill = this.panel.querySelector('.panel-progress-fill');
		const subtitle = this.panel.querySelector('.panel-subtitle');
		const statsDiv = this.panel.querySelector('.panel-stats');

		if (progressFill) progressFill.style.width = `${percentage}%`;
		if (subtitle) subtitle.textContent = `${percentage}% Complete`;

		if (statsDiv) {
			const timeMinutes = Math.floor(stats.timeOnSite / 60);
			const timeSeconds = stats.timeOnSite % 60;
			statsDiv.textContent = `Total XP: ${stats.xpTotal} | Time on site: ${timeMinutes}m ${timeSeconds}s`;
		}
	}

	updatePanelAchievements() {
		const list = document.getElementById('achievement-list');
		if (!list) return;

		const achievements = this.system.getAllAchievements();

		list.innerHTML = achievements.map(ach => {
			const percentage = Math.round((ach.progress / ach.maxProgress) * 100);
			const isUnlocked = ach.unlocked;

			return `
				<div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
					<div class="achievement-icon">${isUnlocked ? ach.icon : '🔒'}</div>
					<div class="achievement-content">
						<div class="achievement-header">
							<span class="achievement-title">${ach.title}</span>
							<span class="achievement-xp">${ach.xp} XP</span>
						</div>
						<div class="achievement-description">${ach.description}</div>
						<div class="achievement-progress-bar">
							<div class="achievement-progress-fill" style="width: ${percentage}%"></div>
						</div>
						<div class="achievement-progress-text">${percentage}%${!isUnlocked && ach.maxProgress > 1 ? ` (${ach.progress}/${ach.maxProgress})` : ''}</div>
					</div>
				</div>
			`;
		}).join('');
	}

	/**
	 * Toggle panel open/closed
	 */
	togglePanel() {
		if (this.panelOpen) {
			this.closePanel();
		} else {
			this.openPanel();
		}
	}

	openPanel() {
		this.updatePanelHeader();
		this.updatePanelAchievements();
		this.backdrop.classList.add('show');
		this.panel.classList.add('show');
		this.panelOpen = true;

		// Focus close button for accessibility
		setTimeout(() => {
			const closeBtn = this.panel.querySelector('.panel-close');
			if (closeBtn) closeBtn.focus();
		}, 100);
	}

	/**
	 * Close achievement panel
	 */
	closePanel() {
		this.backdrop.classList.remove('show');
		this.panel.classList.remove('show');
		this.panelOpen = false;
	}

	/**
	 * Handle achievement unlock
	 */
	onUnlock(data) {
		const { achievement, totalXP, unlockedCount, totalCount } = data;

		// Show toast
		this.showToast({
			title: 'Achievement Unlocked!',
			achievementTitle: achievement.title,
			description: achievement.description,
			icon: achievement.icon,
			xp: achievement.xp,
			progress: `${unlockedCount}/${totalCount}`,
			percentage: Math.round((unlockedCount / totalCount) * 100)
		});

		// Update tracker
		this.updateTracker();

		// Update panel if open
		if (this.panelOpen) {
			this.updatePanelHeader();
			this.updatePanelAchievements();
		}

		// Special handling for completionist achievement
		if (achievement.id === 'completionist') {
			this.showCompletionistReward();
		}
	}

	/**
	 * Handle level up
	 */
	onLevelUp(data) {
		// Could show a special toast, but keeping it simple for now
		console.log('Level up!', data);
	}

	/**
	 * Show achievement toast notification
	 */
	showToast(data) {
		const toast = document.createElement('div');
		toast.className = 'achievement-toast';
		toast.setAttribute('role', 'alert');
		toast.setAttribute('aria-live', 'polite');

		toast.innerHTML = `
			<div class="toast-icon">${data.icon}</div>
			<div class="toast-content">
				<div class="toast-title">${data.title}</div>
				<div class="toast-achievement">${data.achievementTitle}</div>
				<div class="toast-description">${data.description}</div>
				<div class="toast-footer">
					<span class="toast-xp">+${data.xp} XP</span>
					<span class="toast-progress">Progress: ${data.progress} (${data.percentage}%)</span>
				</div>
			</div>
		`;

		document.body.appendChild(toast);
		this.toasts.push(toast);

		// Get toast position for confetti
		setTimeout(() => {
			const rect = toast.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top + rect.height / 2;
			this.confetti.burst(x, y);
		}, 100);

		// Animate in
		setTimeout(() => {
			toast.classList.add('show');
		}, 10);

		// Remove after delay
		setTimeout(() => {
			toast.classList.remove('show');
			setTimeout(() => {
				toast.remove();
				const index = this.toasts.indexOf(toast);
				if (index > -1) this.toasts.splice(index, 1);
			}, 300);
		}, 4000);

		// Stack toasts
		this.stackToasts();
	}

	/**
	 * Stack toasts vertically
	 */
	stackToasts() {
		let offset = 80; // Start below tracker
		this.toasts.forEach((toast, index) => {
			toast.style.top = `${offset}px`;
			offset += toast.offsetHeight + 10;
		});
	}

	/**
	 * Confirm reset with user
	 */
	confirmReset() {
		const confirmed = confirm('Are you sure you want to reset all achievement progress? This cannot be undone.');
		if (confirmed) {
			this.resetAchievements();
		}
	}

	/**
	 * Reset all achievements
	 */
	resetAchievements() {
		// Clear localStorage
		localStorage.removeItem('portfolio_achievements');
		localStorage.removeItem('easterEggProgress');
		localStorage.removeItem('games_visited');
		localStorage.removeItem('tetris_highscore');
		localStorage.removeItem('tetris_4line_cleared');
		localStorage.removeItem('ttt_wins');
		localStorage.removeItem('santa_complete');

		// Show confirmation toast
		const toast = document.createElement('div');
		toast.className = 'achievement-toast';
		toast.innerHTML = `
			<div class="toast-icon">🔄</div>
			<div class="toast-content">
				<div class="toast-title">Progress Reset</div>
				<div class="toast-description">All achievements have been cleared. Refresh the page to start fresh!</div>
			</div>
		`;
		document.body.appendChild(toast);
		setTimeout(() => toast.classList.add('show'), 10);

		// Close panel
		this.closePanel();

		// Reload page after delay
		setTimeout(() => {
			window.location.reload();
		}, 2000);
	}

	/**
	 * Show special completionist reward
	 */
	showCompletionistReward() {
		// Obfuscated email
		const parts = ['dzmitry', '@', 'samsonau', '.', 'net'];
		const email = parts.join('');

		const modal = document.createElement('div');
		modal.className = 'completionist-modal';
		modal.setAttribute('role', 'dialog');
		modal.setAttribute('aria-modal', 'true');

		modal.innerHTML = `
			<div class="completionist-content">
				<h3 class="completionist-title">🎉 Incredible Work! 🎉</h3>
				<p class="completionist-text">
					You've discovered everything on my portfolio! This level of curiosity and thoroughness is exactly what I value in people I work with.
				</p>
				<p class="completionist-text">
					As a special thank you, here's a direct line to me:
				</p>
				<div class="completionist-email">
					<a href="mailto:${email}" class="completionist-email-link">${email}</a>
				</div>
				<p class="completionist-text completionist-subtext">
					Feel free to reach out - I'd love to hear from you!
				</p>
				<button class="completionist-close">Close</button>
			</div>
		`;

		document.body.appendChild(modal);

		// Burst confetti from center
		setTimeout(() => {
			this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 100);
		}, 200);

		// Show modal
		setTimeout(() => {
			modal.classList.add('show');
		}, 10);

		// Close handler
		const closeBtn = modal.querySelector('.completionist-close');
		closeBtn.addEventListener('click', () => {
			modal.classList.remove('show');
			setTimeout(() => modal.remove(), 300);
		});

		closeBtn.focus();
	}
}
