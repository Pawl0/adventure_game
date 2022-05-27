// create a new scene
const gameScene = new Phaser.Scene('Game');

// load assets
gameScene.preload = function () {
    // load images
    this.load.image('background', 'https://jsbin-user-assets.s3.amazonaws.com/fariazz/original-background.png');
    this.load.image('player', 'https://jsbin-user-assets.s3.amazonaws.com/fariazz/player.png');
    this.load.image('enemy', 'https://jsbin-user-assets.s3.amazonaws.com/fariazz/dragon.png');
    this.load.image('treasure', 'https://jsbin-user-assets.s3.amazonaws.com/fariazz/treasure.png');
};

let player = {
    speed: 3,
    ref: null
};

let cursors;

let score = 0;

// called once after the preload ends
gameScene.create = function () {
    // create bg sprite
    const bg = this.add.sprite(0, 0, 'background');
    this.add.text(0, 0, 'Score: ', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    this.score = this.add.text(50, 0, score, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    this.treasure = this.physics.add.sprite(550, 190, 'treasure');
    this.treasure.setScale(0.5);

    // change the origin to the top-left corner
    bg.setOrigin(0, 0);

    // create the player
    this.player = this.physics.add.sprite(70, 180, 'player');

    // we are reducing the width by 50%, and we are doubling the height
    this.player.setScale(0.5);

    player.ref = this.player;
    // create an enemy
    this.enemy1 = this.physics.add.sprite(250, 180, 'enemy');
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown', (e) => {
        if (e.key === "Escape") {
            this.paused = !this.paused;
        }
    });

    this.physics.add.collider(this.player, this.enemy1, (player, enemy) => {
        player.destroy();
        // this.gameover = true;
    });

    this.physics.add.collider(this.player, this.treasure, (player, treasure) => {
        treasure.destroy();
        score += 1000;
        this.score.text = score;
    });
};

// this is called up to 60 times per second
gameScene.update = function () {
    if (this.paused) {
        return;
    }
    if (this.gameover) {
        alert("Game over");
        return
    }
    moveEnemy(this.enemy1, 5);
    movePlayer();
};

const moveEnemy = (enemy, speed) => {
    if (enemy.movedRight) {
        if (enemy.x > 250) {
            enemy.x -= speed;
        } else {
            enemy.movedLeft = true;
            enemy.movedRight = false;
        }
    } else {
        if (enemy.x < 500) {
            enemy.x += speed;
        } else {
            enemy.movedLeft = false;
            enemy.movedRight = true;
        }
    }
}

const movePlayer = () => {
    if (cursors.left.isDown) {
        player.ref.x -= player.speed;
    } else if (cursors.right.isDown) {
        player.ref.x += player.speed;
    } else if (cursors.up.isDown) {
        player.ref.y -= player.speed;
    } else if (cursors.down.isDown) {
        player.ref.y += player.speed;
    }
}


// set the configuration of the game
const config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: 640,
    height: 360,
    scene: gameScene,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
};

// create a new game, pass the configuration
const game = new Phaser.Game(config);

console.log(game)
console.log(game.physics)