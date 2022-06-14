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

const resetGame = (gameInstance) => {
    score = 0
    gameInstance.score.text = score;
    if (gameInstance.player)
        gameInstance.player.destroy()
    if (gameInstance.enemy1)
        gameInstance.enemy1.destroy()
    if (gameInstance.treasure)
        gameInstance.treasure.destroy()
    gameInstance.player = gameInstance.physics.add.sprite(70, 180, 'player');
    gameInstance.player.setScale(0.5);
    gameInstance.treasure = gameInstance.physics.add.sprite(550, 190, 'treasure');
    gameInstance.treasure.setScale(0.5);
    gameInstance.enemy1 = gameInstance.physics.add.sprite(250, 180, 'enemy');
    player.ref = gameInstance.player;
    gameInstance.physics.add.collider(gameInstance.player, gameInstance.enemy1, (player, enemy) => {
        player.destroy();
        gameInstance.gameover = true;
    });

    gameInstance.physics.add.collider(gameInstance.player, gameInstance.treasure, (player, treasure) => {
        treasure.destroy();
        score += 1000;
        gameInstance.score.text = score;
    });
}

// called once after the preload ends
gameScene.create = function () {
    // create bg sprite
    const bg = this.add.sprite(0, 0, 'background');
    this.add.text(0, 0, 'Score: ', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    this.score = this.add.text(50, 0, score, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

    // change the origin to the top-left corner
    bg.setOrigin(0, 0);
    resetGame(this)
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown', (e) => {
        if (e.key === "Escape") {
            this.paused = !this.paused;
        }
        console.log(e.key)
        if (e.key === "Enter") {
            resetGame(this)
        }
    });
};

// this is called up to 60 times per second
gameScene.update = function () {
    if (this.paused) {
        return;
    }
    if (this.gameover) {
        const restart = confirm("Game over! Do you want to restart?");
        if (restart) {
            this.gameover = false;
            resetGame(this)
        }
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
    }
    if (cursors.right.isDown) {
        player.ref.x += player.speed;
    }
    if (cursors.up.isDown) {
        player.ref.y -= player.speed;
    }
    if (cursors.down.isDown) {
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