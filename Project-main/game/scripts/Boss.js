class Boss extends Entity {
    constructor(scene, x, y, textureKey, type, speed, health) {
        super(scene, x, y, textureKey, 'Enemy', type)

        const anims = scene.anims
        const animFrameRate = 4
        this.textureKey = textureKey
        this.type = type
        this.speed = speed
        this.health = health

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
        // this.speed = 100

        let dir = Math.floor(Math.random() * 4)
        switch (dir) {
            case 0:
                this.body.setVelocity(0, -this.speed)//up
                this.anims.play('enemy-up')
                break
            case 1:
                this.body.setVelocity(-this.speed, 0)//left
                this.anims.play('enemy-left')
                break
            case 2:
                this.body.setVelocity(0, this.speed)//down
                this.anims.play('enemy-down')
                break
            case 3:
                this.body.setVelocity(this.speed, 0)//right
                this.anims.play('enemy-right')
                break
            default:
                break;
        }
        // console.log(this.body.blocked)
    }//end constructor

    update() {
    //     const { speed } = this //this.speed
    //     const enemyBlocked = this.body.blocked

    //     if (enemyBlocked.down || enemyBlocked.up || enemyBlocked.left || enemyBlocked.right) {
    //         // console.log(enemyBlocked)
    //         let possibleDirections = []
    //         for (const direction in enemyBlocked) {
    //             possibleDirections.push(direction)

    //         }

    //         const newDirections = possibleDirections[Math.floor(Math.random() * 4) + 1]
    //         // console.log(newDirections)
    //         switch (newDirections) {
    //             case 'up':
    //                 this.body.setVelocity(0, -this.speed)//up
    //                 this.anims.play('enemy-up')
    //                 break
    //             case 'left':
    //                 this.body.setVelocity(-this.speed, 0)//left
    //                 this.anims.play('enemy-left')
    //                 break
    //             case 'down':
    //                 this.body.setVelocity(0, this.speed)//down
    //                 this.anims.play('enemy-down')
    //                 break
    //             case 'right':
    //                 this.body.setVelocity(this.speed, 0)//right
    //                 this.anims.play('enemy-right')
    //                 break
    //             case 'none':
    //                 this.body.setVelocity(0, 0)//for none
    //                 this.anims.stop()
    //                 break
    //             default:
    //                 break;
    //         }
    //     }
    }
}