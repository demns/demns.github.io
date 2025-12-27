export const CONFIG = {
  PARTICLE_COUNT: 50,
  PARTICLE_CONNECTION_DIST: 100,
  NAME_CLICK_COUNT: 3,
  ROLE_CLICK_COUNT: 5,
  FOOTER_SHAKE_COUNT: 5,
  SHAKE_TIMEOUT: 2000,
  SHAKE_THRESHOLD: 30,
  SHAKE_COOLDOWN: 200,
  KONAMI_CODE: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
};

export const CELEBRATIONS = {
  name: { items: ['🎉', '✨', '⭐', '💫', '🌟'], count: 60, size: '1.5rem', delay: 15 },
  controller: { items: ['🎮', '🕹️', '👾', '🎯', '🏆'], count: 50, size: '2rem', delay: 25 },
  konami: { items: ['💥', '⚡', '🔥', '💯', '🚀'], count: 70, size: '2.5rem', delay: 20 },
  berlin: { items: ['🏙️', '🎭', '🎨', '🎪', '🌃', '🎡', '🏛️', '🗼'], count: 30, size: '2rem', delay: 30 },
  role: { items: ['👨‍💼', '💼', '👔', '📊', '🎯', '💪', '🚀', '⭐'], count: 40, size: '2rem', delay: 35 }
};
