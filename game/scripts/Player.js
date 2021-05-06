class Player extends Entity {
    constructor(scene, x, y, textureKey, health) {
        super(scene, x, y, textureKey, 'Player')

        const animFrameRate = 8
        //main line that will extend the below code to the player in GameScene.js  
        const anims = scene.anims
        this.health = health
        this.facing = 'down'


        // this.container = this.add.container(playerInfo.x, playerInfo.y);

        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        anims.create({
            key: 'Player-left',
            frames: anims.generateFrameNumbers(this.textureKey, {
                frames: [1, 7, 1, 13]
            }),
            frameRate: 10,
            repeat: -1
        });

        // animation with key 'right'
        anims.create({
            key: 'Player-right',
            frames: anims.generateFrameNumbers(this.textureKey, {
                frames: [1, 7, 1, 13]
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'Player-up',
            frames: anims.generateFrameNumbers(this.textureKey, {
                frames: [2, 8, 2, 14]
            }),
            frameRate: 10,
            repeat: -1
        });
        anims.create({
            key: 'Player-down',
            frames: anims.generateFrameNumbers(this.textureKey, {
                frames: [0, 6, 0, 12]
            }),
            frameRate: 10,
            repeat: -1
        });
        // One single idle animation because character dosen't have any animations standing idle. If had any make multiple idleframes and uncomment the next line
        this.idleFrame = {
            down: 49,
            left: 61,
            right: 73,
            up: 85
        }
        // this.setFrame(this.idleFrame.down)

        ////inputs
        const { LEFT, RIGHT, UP, DOWN, W, A, S, D } = Phaser.Input.Keyboard.KeyCodes
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            w: W,
            a: A,
            s: S,
            d: D
        })

    }//end of constructor that creates the player and inputs for moving it

    update() {
        const { keys } = this //output: this.keys
        const speed = 100
        const previousVelocity = this.body.velocity.clone()

        this.body.setVelocity(0)
        //movement
        if (keys.left.isDown || keys.a.isDown) {
            this.body.setVelocityX(-speed)
        } else if (keys.right.isDown || keys.d.isDown) {
            this.body.setVelocityX(speed)
        }

        if (keys.up.isDown || keys.w.isDown) {
            this.body.setVelocityY(-speed)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.body.setVelocityY(speed)
        }

        this.body.velocity.normalize().scale(speed)

        //animations
        if (keys.up.isDown || keys.w.isDown) {
            this.anims.play('Player-up', true)
        } else if (keys.down.isDown || keys.s.isDown) {
            this.anims.play('Player-down', true)
        } else
            if (keys.left.isDown || keys.a.isDown) {
                this.anims.play('Player-left', true)
                this.flipX = true;
            } else if (keys.right.isDown || keys.d.isDown) {
                this.anims.play('Player-right', true)
                this.flipX = false
            } else {
                this.anims.stop()
            }

        if (this.anims.currentAnim) {
            this.facing = this.anims.currentAnim.key.split('-')[1]
            // console.log(this.facing)
        }


        //set idle animations
        // if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        //     //show idle anims
        //     if (previousVelocity.x < 0) {
        //         this.setFrame(this.idleFrame.left)
        //     } else if (previousVelocity.x > 0) {
        //         this.setFrame(this.idleFrame.right)
        //     } else if (previousVelocity.y < 0) {
        //         this.setFrame(this.idleFrame.up)
        //     } else if (previousVelocity.y > 0) {
        //         this.setFrame(this.idleFrame.down)
        //     }
        // }

    }
}