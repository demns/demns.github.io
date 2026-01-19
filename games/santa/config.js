export const GAME_CONFIG = {
  // Movement speeds
  GROUND_SCROLL_SPEED: 7.8, // Decreased by 40% from 13
  BACKGROUND_SCROLL_SPEED: 2.4,

  // Physics
  GRAVITY_Y: 300,
  PLAYER_GRAVITY_Y: 300,
  DEER_GRAVITY_Y: -250,
  PLAYER_BOUNCE: 0.2,
  DEER_BOUNCE: 0.9,

  // Player controls
  PLAYER_JUMP_VELOCITY: -100,
  HOUSE_LANDING_BOOST: -530,

  // Fuel/Deers
  INITIAL_FUEL: 10000,
  FUEL_CONSUMPTION_RATE: 100,
  HOUSE_FUEL_BONUS: 10000,
  DEER_FUEL_BONUS: 30000,

  // Spawning
  HOUSE_SPAWN_MIN_INTERVAL: 70,
  HOUSE_SPAWN_BASE_INTERVAL: 110,
  DEER_SPAWN_MIN_INTERVAL: 150,
  DEER_SPAWN_BASE_INTERVAL: 250,
  REFERENCE_WIDTH: 1200,
  REFERENCE_HEIGHT: 800,
  MIN_DISTANCE_FOR_HOUSES: 10,
  MIN_DISTANCE_FOR_DEER: 50,

  // Positioning
  PLAYER_X_PERCENT: 0.1,
  PLAYER_Y_PERCENT: 0.2,
  DEER_Y_PERCENT: 0.7,
  GROUND_Y_OFFSET: 32,
  GROUND_HEIGHT: 64,

  // Collision thresholds
  HOUSE_COLLISION_THRESHOLD: 50,
  DEATH_Y_OFFSET: 93,
  OFFSCREEN_X: -100,
  OFFSCREEN_THRESHOLD: -70,
  SPAWN_OFFSET_X: 100,

  // Deer scale
  DEER_SCALE: 1.5
};

export const HOUSE_CONFIG = [
  { key: 'house1', width: 173, height: 232, offsetY: 180 },
  { key: 'house2', width: 211, height: 220, offsetY: 174 },
  { key: 'house3', width: 209, height: 182, offsetY: 155 },
  { key: 'house4', width: 213, height: 168, offsetY: 148 }
];

export const TEXT_STYLES = {
  title: { fontSize: '64px', fill: '#fff' },
  subtitle: { fontSize: '24px', fill: '#fff' },
  instruction: { fontSize: '32px', fill: '#35a930' },
  score: { fontSize: '32px', fill: '#35a930' },
  gameOver: { fontSize: '64px', fill: '#ff0000', fontStyle: 'bold' },
  gameOverStats: { fontSize: '32px', fill: '#fff' }
};

export const SPRITE_CONFIG = {
  santa: { frameWidth: 102, frameHeight: 50 },
  deer: { frameWidth: 32, frameHeight: 32 }
};

export const ANIMATION_CONFIG = {
  deer: { key: 'run', start: 0, end: 4, frameRate: 10, repeat: -1 },
  santa: { key: 'go', start: 0, end: 4, frameRate: 10, repeat: -1 }
};
