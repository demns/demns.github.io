var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var house1, house2, house3, house4;
var background;
var cursors;
var platforms;
var visibleGround;
var invisibleGround;
var currentHouse;
var fuel = 10000;
var distance = 0;
var maxDistance = 0;
var groundPerTimeMovement = 4;
var fuelText, distanceText, maxDistance;
var deer;
var currentDeer;

function preload() {
    this.load.image('sky', 'assets/starry-night.jpg');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('house1', 'assets/house1.png');
    this.load.image('house2', 'assets/house2.png');
    this.load.image('house3', 'assets/house3.png');
    this.load.image('house4', 'assets/house4.png');

    this.load.image('star', 'assets/star.png');
    // this.load.image('santa', 'assets/santa.png');
    this.load.spritesheet('santa', 'assets/santa3.png', { frameWidth: 102, frameHeight: 50 });
    this.load.spritesheet('deer', 'assets/deer2.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    background = this.add.tileSprite(0, 0, 1600, 1200, 'sky');
    cursors = this.input.keyboard.createCursorKeys();

    platforms = this.physics.add.staticGroup();
    invisibleGround = platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    visibleGround = this.add.tileSprite(400, 568, 800, 64, 'ground');

    house1 = this.add.tileSprite(-300, 420, 173, 232, 'house1');
    house2 = this.add.tileSprite(-300, 426, 211, 220, 'house2');
    house3 = this.add.tileSprite(-300, 445, 209, 182, 'house3');
    house4 = this.add.tileSprite(-300, 452, 213, 168, 'house4');

    player = this.physics.add.sprite(100, 100, 'santa');

    player.setBounce(0.2);
    player.body.setGravityY(300);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    fuelText = this.add.text(16, 16, 'Deers (⬆️ to use): ' + fuel, { fontSize: '32px', fill: '#35a930' });
    distanceText = this.add.text(400, 16, 'Distance: 0', { fontSize: '32px', fill: '#35a930' });
    maxDistanceText = this.add.text(400, 550, 'Maximum: 0', { fontSize: '32px', fill: '#35a930' });

    deer = this.physics.add.sprite(-300, 450, 'deer').setScale(1.5);
    deer.body.setGravityY(-250);
    deer.setBounce(0.9);
    this.physics.add.collider(deer, platforms);
    this.physics.add.overlap(player, deer, collectDeer, null, this);

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('deer', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'go',
        frames: this.anims.generateFrameNumbers('santa', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });
}

function update() {
    background.tilePositionX += 2;
    visibleGround.tilePositionX += groundPerTimeMovement;
    distance++;
    distanceText.setText('Distance: ' + distance);
    fuelText.setText('Deers (⬆️ to use): ' + fuel);
    if (currentHouse) {
        if (Math.abs(currentHouse.y - player.y) < 50 && Math.abs(currentHouse.x - player.x) < 50) {
            currentHouse.x = -100;
            currentHouse = null;
            fuel += 10000;
            player.setVelocityY(-530);
        } else {
            currentHouse.x -= groundPerTimeMovement;
        }
        if (currentHouse && currentHouse.x < -70) {
            currentHouse.x = -100;
            currentHouse = null;
        }
    }

    if (currentDeer) {
        currentDeer.x -= (groundPerTimeMovement - 1);

        if (currentDeer && currentDeer.x < -70) {
            currentDeer.x = -100;
            currentDeer = null;
        }
    }

    if (distance % 150 === 0 && !currentHouse) {
        currentHouse = getRandomHouse();
        currentHouse.x = 900;
    }

    if (distance % 250 === 0 && !currentDeer) {
        currentDeer = deer;
        deer.enableBody(true, true);
        currentDeer.x = 900;
        currentDeer.y = 400;
    }

    if (cursors.up.isDown && fuel > 0) {
        player.setVelocityY(-100);
        fuel -= 100;
    }

    if (player.body.touching.down && player.y > 507) {
        gameOver();
    }

    deer.anims.play('run', true);
    player.anims.play('go', true);
}

function gameOver() {
    alert('game over');
    fuel = 10000;
    if (distance > maxDistance) {
        maxDistance = distance;
        maxDistanceText.setText('Maximum: ' + maxDistance);
    }
    distance = 0;
    player.y = 100;
}

function getRandomHouse() {
    var a = Math.random();
    if (a > 0.25) return house1;
    if (a > 0.50) return house2;
    if (a > 0.75) return house3;
    return house4;
}

function collectDeer(player, deer) {
    currentDeer.x = -100;
    currentDeer = null;
    fuel += 30000;
    fuelText.setText('Deers: ' + fuel);
}