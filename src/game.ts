export default class AdventureGame extends Phaser.Scene {

    private player: Phaser.Physics.Arcade.Sprite | null = null;
    private playerSpeed = 3;
    private enemy;
    private treasure;
    private paused: boolean = false;
    private gameover: boolean = false;
    private cursors;

    private score: { value: number, text?: Phaser.GameObjects.Text } = {
        value: 0
    };

    constructor() {
        super("Game");
    }

    // load assets
    preload() {
        // load images
        this.load.image('background', 'https://jsbin-user-assets.s3.amazonaws.com/fariazz/original-background.png');
        // this.load.image('player', 'https://jsbin-user-assets.s3.amazonaws.com/fariazz/player.png');
        this.load.image('enemy', 'https://jsbin-user-assets.s3.amazonaws.com/fariazz/dragon.png');
        this.load.image('treasure', 'https://jsbin-user-assets.s3.amazonaws.com/fariazz/treasure.png');
        //  37x45 is the size of each frame
        //  There are 18 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
        //  blank frames at the end, so we tell the loader how many to load
        this.load.spritesheet('player', '../assets/spritesheets/metalslug_mummy37x45.png', { frameWidth: 37, frameHeight: 45, endFrame: 17 });
    };

    resetPlayer() {
        this.player?.destroy()
        const newPlayer = this.physics.add.sprite(70, 180, 'player');
        this.player = newPlayer;
        this.animateSprite(this.player)
    }

    resetEnemy() {
        this.enemy?.destroy()
        this.enemy = this.physics.add.sprite(250, 180, 'enemy');
    }

    resetTreasure() {
        this.treasure?.destroy()
        this.treasure = this.physics.add.sprite(550, 190, 'treasure');
        this.treasure.setScale(0.5);
    }

    resetScore() {
        this.score.value = 0
        this.score.text?.setText('0')
    }

    resetColliders() {
        this.physics.add.collider(this.player as Phaser.Physics.Arcade.Sprite, this.enemy, (player, enemy) => {
            player.destroy();
            this.gameover = true;
        });

        this.physics.add.collider(this.player as Phaser.Physics.Arcade.Sprite, this.treasure, (player, treasure) => {
            treasure.destroy();
            this.score.value += 1000;
            this.score.text?.setText(String(this.score.value));
            console.log(this.score.text?.text)
        });
    }

    resetGame() {
        this.resetPlayer();
        this.resetTreasure();
        this.resetEnemy();
        this.resetColliders();
    }

    // called once after the preload ends
    create() {
        // create bg sprite
        const bg = this.add.sprite(0, 0, 'background');
        this.add.text(0, 0, 'Score: ', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        this.score.text = this.add.text(50, 0, "0", { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        console.log(this.score.text.text)
        // change the origin to the top-left corner
        bg.setOrigin(0, 0);
        this.resetGame()
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on('keydown', (e) => {
            if (e.key === "Escape") {
                this.paused = !this.paused;
            }
            console.log(e.key)
            if (e.key === "Enter") {
                this.resetGame()
            }
        });

        this.animateSprite();
    };


    animateSprite(spriteToAnimate?: Phaser.GameObjects.Sprite) {
        const sprite = spriteToAnimate ?? this.add.sprite(40, 100, 'player');

        console.log("sprite anims: ", sprite.anims)

        sprite.anims.create({
            key: 'walk',
            repeat: -1,
            frames: 'player',
            duration: 2000
        });
        console.log(sprite.anims.exists('walk'));

        sprite.anims.play('walk');
    }
    // this is called up to 60 times per second
    update() {
        if (this.paused) {
            return;
        }
        if (this.gameover) {
            const restart = confirm("Game over! Do you want to restart?");
            if (restart) {
                this.gameover = false;
                this.resetGame()
            }
        }
        this.moveEnemy(this.enemy, 5);
        this.movePlayer();
    };

    moveEnemy(enemy, speed) {
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

    movePlayer() {
        if (this.player?.x && this.player?.y) {
            if (this.cursors.left.isDown) {
                this.player.x -= this.playerSpeed;
            }
            if (this.cursors.right.isDown) {
                this.player.x += this.playerSpeed;
            }
            if (this.cursors.up.isDown) {
                this.player.y -= this.playerSpeed;
            }
            if (this.cursors.down.isDown) {
                this.player.y += this.playerSpeed;
            }
        }
    }

}
// set the configuration of the game
const config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: 640,
    height: 480,
    scene: AdventureGame,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
};

const game = new Phaser.Game(config);

console.log(game)

