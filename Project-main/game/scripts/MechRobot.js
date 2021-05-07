class MechRobot extends Entity {
    constructor(scene, x, y, textureKey, health, damage2){
        super(scene, x, y, textureKey, 'MechRobot')

        const animFrameRate = 8
        const anims = scene.anims
        this.health = health
        this.facing = 'down'
        this.damage2 = damage2

        anims.create({
            key: 'enemy-left',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'skeleton-walk-left/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'enemy-right',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'skeleton-walk-right/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'enemy-up',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'skeleton-walk-up/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        anims.create({
            key: 'enemy-down',
            frames: anims.generateFrameNames(this.textureKey, {
                prefix: 'skeleton-walk-down/',
                suffix: '',
                start: 1,
                end: 3,
                zeroPad: 2
            }),
            frameRate: animFrameRate,
            repeat: -1
        })
        this.idleFrame = {
            down: 12,
            left: 4,
            right: 0,
            up: 8
        }
        // this.setFrame(this.idleFrame.down)

        /////////////////
        //inputs
        // this.cursors = this.input.keyboard.createCursorKeys()
        const {W,A,S,D} = Phaser.Input.Keyboard.KeyCodes
        this.keys = scene.input.keyboard.addKeys({
            w: W,
            a: A,
            s: S,
            d: D
        })
         
    }//end constructor


    update(){
        const {keys} = this //output: this.keys
        const speed = 100
        const previousVelocity = this.body.velocity.clone()

        this.body.setVelocity(0)
        //movement
        if (keys.a.isDown) {
            this.body.setVelocityX(-speed)
        } else if (keys.d.isDown) {
            this.body.setVelocityX(speed)
        }

        if (keys.w.isDown) {
            this.body.setVelocityY(-speed)
        } else if (keys.s.isDown) {
            this.body.setVelocityY(speed)
        }

        this.body.velocity.normalize().scale(speed)

        //animations
        if (keys.w.isDown) {
            this.anims.play('enemy-up', true)
        } else if (keys.s.isDown) {
            this.anims.play('enemy-down', true)
        } else
        if (keys.a.isDown) {
            this.anims.play('enemy-left', true)
        } else if (keys.d.isDown) {
            this.anims.play('enemy-right', true)
        } else {
            this.anims.stop()
        }
 
        if (this.anims.currentAnim){
            this.facing = this.anims.currentAnim.key.split('-')[1]
            // console.log(this.facing);
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