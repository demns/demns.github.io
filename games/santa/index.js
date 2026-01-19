import { GAME_CONFIG, HOUSE_CONFIG, TEXT_STYLES, SPRITE_CONFIG, ANIMATION_CONFIG } from './config.js';

let maxDistance = 0;
try {
  maxDistance = parseInt(localStorage.getItem('santaMaxDistance'), 10) || 0;
} catch (error) {
  console.warn('Could not access localStorage:', error);
}

class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        this.load.image('sky', '/games/santa/assets/starry-night.jpg');
        this.load.image('ground', '/games/santa/assets/platform.png');
        this.load.image('house1', '/games/santa/assets/house1.png');
        this.load.image('house2', '/games/santa/assets/house2.png');
        this.load.image('house3', '/games/santa/assets/house3.png');
        this.load.image('house4', '/games/santa/assets/house4.png');
        this.load.spritesheet('santa', '/games/santa/assets/santa3.png', SPRITE_CONFIG.santa);
        this.load.spritesheet('deer', '/games/santa/assets/deer2.png', SPRITE_CONFIG.deer);
    }

    create() {
        const { width, height } = this.cameras.main;
        this.add.tileSprite(width / 2, height / 2, width, height, 'sky');
        this.add.text(width / 2, height * 0.25, 'DEER SANTA', TEXT_STYLES.title).setOrigin(0.5);

        const instructions = [
            'Press [SPACE] or TAP the screen to use your deers and fly.',
            'Land on a house chimney to get more deers.',
            'Catch a stray deer for a big deer bonus!',
            'Avoid hitting the ground.'
        ];

        instructions.forEach((line, index) => {
            this.add.text(width / 2, height * 0.45 + (index * 40), line, TEXT_STYLES.subtitle).setOrigin(0.5);
        });

        this.add.text(width / 2, height * 0.8, 'Press SPACE to Start', TEXT_STYLES.instruction).setOrigin(0.5);

        const startGame = () => {
            this.scene.start('GameScene');
        };

        this.input.keyboard.once('keydown-SPACE', startGame);
        this.input.once('pointerdown', startGame);

        // Create animations here so they are only created once
        this.anims.create({
            key: ANIMATION_CONFIG.deer.key,
            frames: this.anims.generateFrameNumbers('deer', {
                start: ANIMATION_CONFIG.deer.start,
                end: ANIMATION_CONFIG.deer.end
            }),
            frameRate: ANIMATION_CONFIG.deer.frameRate,
            repeat: ANIMATION_CONFIG.deer.repeat
        });
        this.anims.create({
            key: ANIMATION_CONFIG.santa.key,
            frames: this.anims.generateFrameNumbers('santa', {
                start: ANIMATION_CONFIG.santa.start,
                end: ANIMATION_CONFIG.santa.end
            }),
            frameRate: ANIMATION_CONFIG.santa.frameRate,
            repeat: ANIMATION_CONFIG.santa.repeat
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // --- Game Variables ---
        this.gameOver = false;
        this.fuel = GAME_CONFIG.INITIAL_FUEL;
        this.distance = 0;
        this.currentHouse = null;
        this.currentDeer = null;
        // Adjust spawn rates based on screen width for a consistent feel.
        this.houseSpawnInterval = Math.max(
            GAME_CONFIG.HOUSE_SPAWN_MIN_INTERVAL,
            GAME_CONFIG.HOUSE_SPAWN_BASE_INTERVAL * (this.cameras.main.width / GAME_CONFIG.REFERENCE_WIDTH)
        );
        this.deerSpawnInterval = Math.max(
            GAME_CONFIG.DEER_SPAWN_MIN_INTERVAL,
            GAME_CONFIG.DEER_SPAWN_BASE_INTERVAL * (GAME_CONFIG.REFERENCE_HEIGHT / this.cameras.main.width)
        );

        const { width, height } = this.cameras.main;

        // --- World & Background ---
        this.background = this.add.tileSprite(width / 2, height / 2, width, height, 'sky');
        this.visibleGround = this.add.tileSprite(
            width / 2,
            height - GAME_CONFIG.GROUND_Y_OFFSET,
            width,
            GAME_CONFIG.GROUND_HEIGHT,
            'ground'
        );
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(width / 2, height - GAME_CONFIG.GROUND_Y_OFFSET, 'ground')
            .setDisplaySize(width, GAME_CONFIG.GROUND_HEIGHT)
            .refreshBody()
            .setVisible(false);

        // --- Houses ---
        this.houses = HOUSE_CONFIG.map(houseConfig =>
            this.add.tileSprite(
                GAME_CONFIG.OFFSCREEN_X,
                height - houseConfig.offsetY,
                houseConfig.width,
                houseConfig.height,
                houseConfig.key
            )
        );

        // --- Player ---
        this.player = this.physics.add.sprite(
            width * GAME_CONFIG.PLAYER_X_PERCENT,
            height * GAME_CONFIG.PLAYER_Y_PERCENT,
            'santa'
        );
        this.player.setBounce(GAME_CONFIG.PLAYER_BOUNCE);
        this.player.body.setGravityY(GAME_CONFIG.PLAYER_GRAVITY_Y);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        // --- Deer Collectible ---
        this.deer = this.physics.add.sprite(GAME_CONFIG.OFFSCREEN_X, 450, 'deer')
            .setScale(GAME_CONFIG.DEER_SCALE);
        this.deer.body.setGravityY(GAME_CONFIG.DEER_GRAVITY_Y);
        this.deer.setBounce(GAME_CONFIG.DEER_BOUNCE);
        this.physics.add.collider(this.deer, this.platforms);
        this.physics.add.overlap(this.player, this.deer, this.collectDeer, null, this);

        // --- UI Text ---
        this.fuelText = this.add.text(16, 16, 'Deers: ' + this.fuel, TEXT_STYLES.score);
        this.distanceText = this.add.text(
            width / 2,
            16,
            'Distance: 0',
            TEXT_STYLES.score
        ).setOrigin(0.5, 0);
        this.maxDistanceText = this.add.text(
            width / 2,
            height - 50,
            'Maximum: ' + maxDistance,
            TEXT_STYLES.score
        ).setOrigin(0.5, 0);

        // --- Input ---
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.gameOver) return;

        this.updateScrolling();
        this.updateScore();
        this.updateHouseLogic();
        this.updateDeerLogic();
        this.updateSpawning();
        this.handlePlayerInput();
        this.checkGameOver();
        this.updateAnimations();
    }

    updateScrolling() {
        this.background.tilePositionX += GAME_CONFIG.BACKGROUND_SCROLL_SPEED;
        this.visibleGround.tilePositionX += GAME_CONFIG.GROUND_SCROLL_SPEED;
    }

    updateScore() {
        this.distance++;
        this.distanceText.setText('Distance: ' + this.distance);
        this.fuelText.setText('Deers: ' + this.fuel);
    }

    updateHouseLogic() {
        if (!this.currentHouse) return;

        const distX = Math.abs(this.currentHouse.x - this.player.x);
        const distY = Math.abs(this.currentHouse.y - this.player.y);

        if (distX < GAME_CONFIG.HOUSE_COLLISION_THRESHOLD && distY < GAME_CONFIG.HOUSE_COLLISION_THRESHOLD) {
            this.currentHouse.x = GAME_CONFIG.OFFSCREEN_X;
            this.currentHouse = null;
            this.fuel += GAME_CONFIG.HOUSE_FUEL_BONUS;
            this.player.setVelocityY(GAME_CONFIG.HOUSE_LANDING_BOOST);
        } else {
            this.currentHouse.x -= GAME_CONFIG.GROUND_SCROLL_SPEED;
        }

        if (this.currentHouse && this.currentHouse.x < GAME_CONFIG.OFFSCREEN_THRESHOLD) {
            this.currentHouse.x = GAME_CONFIG.OFFSCREEN_X;
            this.currentHouse = null;
        }
    }

    updateDeerLogic() {
        if (!this.currentDeer) return;

        this.currentDeer.x -= (GAME_CONFIG.GROUND_SCROLL_SPEED - 1);

        if (this.currentDeer && this.currentDeer.x < GAME_CONFIG.OFFSCREEN_THRESHOLD) {
            this.currentDeer.x = GAME_CONFIG.OFFSCREEN_X;
            this.currentDeer = null;
        }
    }

    updateSpawning() {
        const { width, height } = this.cameras.main;

        // House spawning
        if (this.distance > GAME_CONFIG.MIN_DISTANCE_FOR_HOUSES &&
            this.distance % Math.floor(this.houseSpawnInterval) === 0 &&
            !this.currentHouse) {
            this.currentHouse = this.getRandomHouse();
            this.currentHouse.x = width + GAME_CONFIG.SPAWN_OFFSET_X;
        }

        // Deer spawning
        if (this.distance > GAME_CONFIG.MIN_DISTANCE_FOR_DEER &&
            this.distance % Math.floor(this.deerSpawnInterval) === 0 &&
            !this.currentDeer) {
            this.currentDeer = this.deer;
            this.deer.enableBody(
                true,
                width + GAME_CONFIG.SPAWN_OFFSET_X,
                height * GAME_CONFIG.DEER_Y_PERCENT,
                true,
                true
            );
        }
    }

    handlePlayerInput() {
        if ((this.spaceKey.isDown || this.input.activePointer.isDown) && this.fuel > 0) {
            this.player.setVelocityY(GAME_CONFIG.PLAYER_JUMP_VELOCITY);
            this.fuel -= GAME_CONFIG.FUEL_CONSUMPTION_RATE;
        }
    }

    checkGameOver() {
        const { height } = this.cameras.main;
        if (this.player.body.touching.down && this.player.y > height - GAME_CONFIG.DEATH_Y_OFFSET) {
            this.endGame();
        }
    }

    updateAnimations() {
        this.deer.anims.play(ANIMATION_CONFIG.deer.key, true);
        this.player.anims.play(ANIMATION_CONFIG.santa.key, true);
    }

    collectDeer(player, deer) {
        this.currentDeer.disableBody(true, true);
        this.currentDeer = null;
        this.fuel += GAME_CONFIG.DEER_FUEL_BONUS;
        this.fuelText.setText('Deers: ' + this.fuel);
    }

    getRandomHouse() {
        return Phaser.Math.RND.pick(this.houses);
    }

    endGame() {
        this.gameOver = true;
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.stop();

        try {
            // Update high score if beaten
            if (this.distance > maxDistance) {
                maxDistance = this.distance;
                localStorage.setItem('santaMaxDistance', maxDistance.toString());
            }

            // Achievement: reach 1000+ distance (regardless of high score)
            if (this.distance >= 1000) {
                localStorage.setItem('santa_complete', 'true');
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        type: 'santa-complete',
                        data: { distance: this.distance }
                    }, window.location.origin);
                }
            }
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }

        this.scene.start('GameOverScene', { distance: this.distance });
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalDistance = data.distance;
    }

    create() {
        const { width, height } = this.cameras.main;
        this.add.tileSprite(width / 2, height / 2, width, height, 'sky');
        this.add.text(width / 2, height * 0.25, 'Game Over', TEXT_STYLES.gameOver).setOrigin(0.5);

        this.add.text(
            width / 2,
            height * 0.45,
            'Distance: ' + this.finalDistance,
            TEXT_STYLES.gameOverStats
        ).setOrigin(0.5);
        this.add.text(
            width / 2,
            height * 0.55,
            'Max Distance: ' + maxDistance,
            TEXT_STYLES.gameOverStats
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            height * 0.8,
            'Press SPACE to Restart',
            TEXT_STYLES.instruction
        ).setOrigin(0.5);

        const restartGame = () => {
            this.scene.start('GameScene');
        };

        this.input.keyboard.once('keydown-SPACE', restartGame);
        this.input.once('pointerdown', restartGame);
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GAME_CONFIG.GRAVITY_Y },
            debug: false
        }
    },
    scene: [IntroScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
