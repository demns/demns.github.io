let maxDistance = localStorage.getItem('santaMaxDistance') || 0;
const groundPerTimeMovement = 7.8; // Decreased by 40% from 13

class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        this.load.image('sky', 'assets/starry-night.jpg');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('house1', 'assets/house1.png');
        this.load.image('house2', 'assets/house2.png');
        this.load.image('house3', 'assets/house3.png');
        this.load.image('house4', 'assets/house4.png');
        this.load.spritesheet('santa', 'assets/santa3.png', { frameWidth: 102, frameHeight: 50 });
        this.load.spritesheet('deer', 'assets/deer2.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        const { width, height } = this.cameras.main;
        this.add.tileSprite(width / 2, height / 2, width, height, 'sky');
        this.add.text(width / 2, height * 0.25, 'DEER SANTA', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

        const instructions = [
            'Press [SPACE] or TAP the screen to use your deers and fly.',
            'Land on a house chimney to get more deers.',
            'Catch a stray deer for a big deer bonus!',
            'Avoid hitting the ground.'
        ];

        instructions.forEach((line, index) => {
            this.add.text(width / 2, height * 0.45 + (index * 40), line, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        });

        this.add.text(width / 2, height * 0.8, 'Press SPACE to Start', { fontSize: '32px', fill: '#35a930' }).setOrigin(0.5);

        const startGame = () => {
            this.scene.start('GameScene');
        };

        this.input.keyboard.once('keydown-SPACE', startGame);
        this.input.once('pointerdown', startGame);

        // Create animations here so they are only created once
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('deer', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'go', frames: this.anims.generateFrameNumbers('santa', { start: 0, end: 4 }), frameRate: 10, repeat: -1
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
        this.fuel = 10000;
        this.distance = 0;
        this.currentHouse = null;
        this.currentDeer = null;
        // Adjust spawn rates based on screen width for a consistent feel.
        this.houseSpawnInterval = Math.max(70, 110 * (this.cameras.main.width / 1200));
        this.deerSpawnInterval = Math.max(150, 250 * (800 / this.cameras.main.width));

        const { width, height } = this.cameras.main;

        // --- World & Background ---
        this.background = this.add.tileSprite(width / 2, height / 2, width, height, 'sky');
        this.visibleGround = this.add.tileSprite(width / 2, height - 32, width, 64, 'ground');
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(width / 2, height - 32, 'ground').setDisplaySize(width, 64).refreshBody().setVisible(false);

        // --- Houses ---
        this.houses = [
            this.add.tileSprite(-300, height - 180, 173, 232, 'house1'),
            this.add.tileSprite(-300, height - 174, 211, 220, 'house2'),
            this.add.tileSprite(-300, height - 155, 209, 182, 'house3'),
            this.add.tileSprite(-300, height - 148, 213, 168, 'house4')
        ];

        // --- Player ---
        this.player = this.physics.add.sprite(width * 0.1, height * 0.2, 'santa');
        this.player.setBounce(0.2);
        this.player.body.setGravityY(300);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        // --- Deer Collectible ---
        this.deer = this.physics.add.sprite(-300, 450, 'deer').setScale(1.5);
        this.deer.body.setGravityY(-250);
        this.deer.setBounce(0.9);
        this.physics.add.collider(this.deer, this.platforms);
        this.physics.add.overlap(this.player, this.deer, this.collectDeer, null, this);

        // --- UI Text ---
        this.fuelText = this.add.text(16, 16, 'Deers: ' + this.fuel, { fontSize: '32px', fill: '#35a930' });
        this.distanceText = this.add.text(width / 2, 16, 'Distance: 0', { fontSize: '32px', fill: '#35a930' }).setOrigin(0.5, 0);
        this.maxDistanceText = this.add.text(width / 2, height - 50, 'Maximum: ' + maxDistance, { fontSize: '32px', fill: '#35a930' }).setOrigin(0.5, 0);

        // --- Input ---
        // Create a reference for the space bar
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.gameOver) return;

        const { width, height } = this.cameras.main;

        // --- Scrolling ---
        this.background.tilePositionX += 2.4;
        this.visibleGround.tilePositionX += groundPerTimeMovement;

        // --- Score & Fuel ---
        this.distance++;
        this.distanceText.setText('Distance: ' + this.distance);
        this.fuelText.setText('Deers: ' + this.fuel);

        // --- House Logic ---
        if (this.currentHouse) {
            if (Math.abs(this.currentHouse.y - this.player.y) < 50 && Math.abs(this.currentHouse.x - this.player.x) < 50) {
                this.currentHouse.x = -100;
                this.currentHouse = null;
                this.fuel += 10000;
                this.player.setVelocityY(-530);
            } else {
                this.currentHouse.x -= groundPerTimeMovement;
            }
            if (this.currentHouse && this.currentHouse.x < -70) {
                this.currentHouse.x = -100;
                this.currentHouse = null;
            }
        }

        // --- Deer Logic ---
        if (this.currentDeer) {
            this.currentDeer.x -= (groundPerTimeMovement - 1);
            if (this.currentDeer && this.currentDeer.x < -70) {
                this.currentDeer.x = -100;
                this.currentDeer = null;
            }
        }

        // --- Spawning Logic ---
        if (this.distance > 10 && this.distance % Math.floor(this.houseSpawnInterval) === 0 && !this.currentHouse) {
            this.currentHouse = this.getRandomHouse();
            this.currentHouse.x = width + 100;
        }
        if (this.distance > 50 && this.distance % Math.floor(this.deerSpawnInterval) === 0 && !this.currentDeer) {
            this.currentDeer = this.deer;
            this.deer.enableBody(true, width + 100, height * 0.7, true, true);
        }

        // --- Player Controls ---
        if ((this.spaceKey.isDown || this.input.activePointer.isDown) && this.fuel > 0) {
            this.player.setVelocityY(-100);
            this.fuel -= 100;
        }

        // --- Game Over Condition ---
        if (this.player.body.touching.down && this.player.y > height - 93) {
            this.endGame();
        }

        // --- Animations ---
        this.deer.anims.play('run', true);
        this.player.anims.play('go', true);
    }

    collectDeer(player, deer) {
        this.currentDeer.disableBody(true, true);
        this.currentDeer = null;
        this.fuel += 30000;
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

        if (this.distance > maxDistance) {
            maxDistance = this.distance;
            localStorage.setItem('santaMaxDistance', maxDistance);
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
        this.add.text(width / 2, height * 0.25, 'Game Over', { fontSize: '64px', fill: '#ff0000', fontStyle: 'bold' }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.45, 'Distance: ' + this.finalDistance, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(width / 2, height * 0.55, 'Max Distance: ' + maxDistance, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.8, 'Press SPACE to Restart', { fontSize: '32px', fill: '#35a930' }).setOrigin(0.5);

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
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [IntroScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);