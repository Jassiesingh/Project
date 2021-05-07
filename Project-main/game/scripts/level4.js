class level4 extends Phaser.Scene {
    constructor() {
        super('level4')
    }

    preload() {
        this.cursors
        this.cameras.main.height = 290
        this.cameras.main.width = 370
        this.cameras.main.setPosition(16, 16)
        // map tiles
        this.load.image('tiles', 'assets/Tilemap/spritesheet-extruded.png');

        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/Tilemap/map1.json');

        //bullet
        this.load.image('bullet', 'assets/bullet.png')

        //loading the particle for death effect
        this.load.image('particle', 'assets/particle.png')

        // our character
        this.load.spritesheet('player', 'assets/RPG_assets.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        //MechRobot
        // this.load.spritesheet('mechrobot', 'assets/MechRobot.png',{
        //     frameWidth: 25,
        //     frameHeight: 25
        // })

        this.load.spritesheet('pickup', 'assets/sprites/New Piskel.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        //Enemy??
        this.load.atlas('Atlas1', 'assets/sprites/skeleton.png', 'assets/sprites/skeleton.json')

        this.player
        this.mechrobot
        this.keys
        this.enemy
        this.boss
        this.enemies
        this.damage1
        this.healthbar
        this.projectiles
        this.keys
        this.lastFiredTime = 0
        this.emitter
        this.coins
        this.gems
        this.xpScore
        // this.coinScore = 0

    } //end preload

    create() {
        // this.cursors = this.input.keyboard.createCursorKeys()
        // create the map
        const map = this.make.tilemap({
            key: 'map'
        });

        // first parameter is the name of the tilemap in tiled
        const tiles = map.addTilesetImage('spritesheet', 'tiles', 16, 16, 1, 2);

        // creating the layers
        const worldLayer = map.createStaticLayer('Grass', tiles, 0, 0)
        const obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0)
        const pickup = map.createStaticLayer('pickup', tiles, 0, 0)
        const monsterLayer = map.createStaticLayer('monster layer', tiles, 0, 0)
        const complete = map.createStaticLayer('complete', tiles, 0, 0)

        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);

        //pickups
        this.anims.create({
            key: 'coinAnimations',
            frames: this.anims.generateFrameNumbers('pickup', {
                start: 0,
                end: 2
            }),
            frameRate: 12,
            repeat: -1
        })
        this.anims.create({
            key: 'gemAnimations',
            frames: this.anims.generateFrameNumbers('pickup', {
                start: 3,
                end: 5
            }),
            frameRate: 12,
            repeat: -1
        })
        //adding coins and gems in the group
        this.coins = this.physics.add.group()
        this.gems = this.physics.add.group()

        pickup.forEachTile(tiles => {
            if (tiles.index !== -1) {
                // console.log(tiles);
                let pickup
                const x = tiles.getCenterX()
                const y = tiles.getCenterY()
                if (tiles.properties.kind == 'goldcoin') {
                    pickup = this.coins.create(x, y, 'coin')
                    pickup.anims.play('coinAnimations', true)
                } else if (tiles.properties.kind == 'healthgem') {
                    pickup = this.gems.create(x, y, 'gem')
                    pickup.anims.play('gemAnimations', true)
                }
                pickup.body.width = 16
                pickup.body.height = 16
            }
        })

        // our player sprite
        this.player = new Player(this, 50, 100, 'player', 100, 1);
        console.log(this.player.health)
        console.log(this.player.damage1)

        //MechRobot
        this.mechrobot = new MechRobot(this, 100, 100, 'Atlas1', 100, 30).setTint(0xf0f0f0);
        console.log(this.mechrobot.health)
        console.log(this.mechrobot.damage2)

        //collisions for MechRobot
        this.mechrobot.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.mechrobot, obstacles)
        this.physics.add.collider(this.mechrobot, pickup)
        this.physics.add.collider(this.mechrobot, monsterLayer)
        this.physics.add.collider(this.mechrobot, this.enemy)
        this.physics.add.collider(this.mechrobot, this.EnemyFollow)
        this.physics.add.collider(this.mechrobot, this.enemy2)


        //Boss
        this.boss = new Boss(this, 200, 200, 'Atlas1', 'still', 80, 100).setTint(0xff0fff);
        console.log(this.boss.health)

        //collisions for boss
        this.boss.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.boss, obstacles)


        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.body.setCollideWorldBounds(true);

        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);

        // this.physics.add.collider(this.player, worldLayer)

        //limit camera to map only
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        //enemy?
        this.enemy = new Enemy(this, 250, 200, 'Atlas1', 50, 'wandering50', 30).setTint(0xfff000)

        // this.physics.add.collider(this.enemy, worldLayer)
        this.enemy.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.enemy, obstacles)
        this.physics.add.collider(this.enemy, complete)

        //enemy that follows??
        this.enemy2 = new EnemyFollow(this, 250, 200, 'Atlas1', 50, 'follow', 60).setTint(0x00ff00)

        // this.physics.add.collider(this.enemy2, worldLayer)
        this.enemy2.body.setCollideWorldBounds(true)
        this.physics.add.collider(this.enemy2, obstacles)

        //group of enemies???
        this.enemies = this.add.group()
        this.enemies.add(this.enemy)
        this.enemies.add(this.enemy2)
        // console.log(complete)
        // console.log(obstacles)

        // for (let i = 0; i < 10; i++) {
        //     const e = new Enemy(this, 220 + 20 * i, 250, 'Atlas1', 10, 'wandering10')
        //     e.body.setCollideWorldBounds(true)
        //     e.setTint(0x9999ff)
        //     this.enemies.add(e)
        // }

        // monsterLayer.forEachTile(tiles => {
        //     if (tiles.properties.kind !== undefined) {
        //         // console.log(tiles.properties.kind);
        //         const x = tiles.getCenterX()
        //         const y = tiles.getCenterY()
        //         const e = new Enemy(this, x, y, 'Atlas1', 10, tiles.properties.kind, tiles.properties.speed)
        //         this.enemies.add(e)
        //         e.body.setCollideWorldBounds(true)
        //         // e.setTint(0x00ff00) 
        //     }
        //     // console.log(this.enemies);
        // })

        this.physics.add.collider(this.enemies, worldLayer)
        this.physics.add.collider(this.enemies, obstacles)
        // this.physics.add.collider(this.enemies, complete)

        //HealthBar code was moved to UIScene

        //bullets for the wicked
        this.keys = this.input.keyboard.addKeys({
            space: 'SPACE',
            m: 'M'
        })

        this.projectiles = new Projectiles(this)

        //this. callback for the collision custom functions 
        this.physics.add.collider(this.projectiles, obstacles, this.handleProjectileWorldCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.boss, this.handleProjectilePlayerBossCollisions, null, this)
        this.physics.add.overlap(this.projectiles, this.boss, this.handleProjectileMechrobotBossCollisions, null, this)
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.overlap(this.mechrobot, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.collider(this.player, this.coins, this.handlePlayerCoinCollision, null, this)
        this.physics.add.overlap(this.player, this.mechrobot, this.handlePlayerRobotCollision, null, this)
        this.physics.add.collider(this.player, this.gems, this.handlePlayerGemCollision, null, this)
        this.physics.add.collider(this.player, this.complete, this.handlePlayerOverlapCollisons, null, this)

        //particles for cool death effects
        this.emitter = this.add.particles('particle').createEmitter({
            x: 200,
            y: 200,
            quantity: 15,
            speed: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 300,
            active: false
        })

        //dummy text
        this.add.text(300, 100, 'Level4', { font: '8px', fill: '#ffffff' })

        //code for displaying coins collected was shifted to UIScene 

    } //end create

    /////////////////////////////////////////////////////////
    //custom functions for collisions

    //colliding with coins
    handlePlayerCoinCollision(p, c) {
        c.destroy()
        // let cs = this.coinScore
        // console.log({ cs });
        let ui = this.scene.get('UIScene')
        ui.updateCoins()
    }


    //test code for level completion
    handlePlayerOverlapCollisons(player, complete) {
        if (player.collider(complete)) {
            this.scene.start('playGame')
        }
    }

    //colliding with gems

    handlePlayerGemCollision(p, g) {
        g.destroy()
        if (p.health < 95) {
            p.health += 10
        }
        let ui = this.scene.get('UIScene')
        ui.healthbar.updateHealth(p.health)
        console.log(p.health)
    }

    //projectile with world collisions
    handleProjectileWorldCollision(p) {
        // p.recycle()
        this.projectiles.killAndHide(p)
    }



    //For Player and Boss
    // handleProjectilePlayerBossCollisions(boss, projectile) {
    //     if (projectile.active) {
    //         boss.setTint(0xff0000)
    //         this.time.addEvent({
    //             delay: 500,
    //             callback: () => {
    //                 boss.clearTint()
    //             },
    //             callbackScope: this,
    //             loop: false
    //         })
    //         this.time.addEvent({
    //             delay: 1,
    //             callback: () => {
    //                 boss.health -= this.player.damage1
    //                 projectile.recycle()
    //             },
    //             callbackScope: this,
    //             loop: false
    //         })
    //         if (boss.health <= 0) {
    //             boss.explode()
    //         }
    //         this.emitter.active = true
    //         this.emitter.setPosition(boss.x, boss.y)
    //         this.emitter.explode()
    //     }
    //     console.log(this.boss.health)
    // }

    
    handleProjectileMechrobotBossCollisions(boss, projectile) {
        if (projectile.active) {
            boss.setTint(0xff0000)
            this.time.addEvent({
                delay: 500,
                callback: () => {
                    boss.clearTint()
                },
                callbackScope: this,
                loop: false
            })
            this.time.addEvent({
                delay: 1,
                callback: () => {
                    boss.health -= this.mechrobot.damage2
                    projectile.recycle()
                },
                callbackScope: this,
                loop: false
            })
            if (boss.health <= 0) {
                boss.explode()
            }
            this.emitter.active = true
            this.emitter.setPosition(boss.x, boss.y)
            this.emitter.explode()
        }
        console.log(this.boss.health)
    }



    //Projectiles colliding with enemy
    handleProjectileEnemyCollision(enemy, projectile) {
        if (projectile.active) {
            enemy.setTint(0xff0000)
            this.time.addEvent({
                delay: 500,
                callback: () => {
                    enemy.clearTint()
                },
                callbackScope: this,
                loop: false
            })
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    enemy.explode()
                    projectile.recycle()
                },
                callbackScope: this,
                loop: false
            })
            this.emitter.active = true
            this.emitter.setPosition(enemy.x, enemy.y)
            this.emitter.explode()
        }
    }


    handlePlayerRobotCollision(p, mechrobot) {
        p.explode();
        this.cameras.main.startFollow(mechrobot);
    }

    // Player colliding with enemy
    handlePlayerEnemyCollision(p, e) {
        // console.log('player hit');
        p.health -= e.damage
        let ui = this.scene.get('UIScene')
        // ui.healthbar.updateHealth(p.health)
        if (p.health <= 0) {
            this.cameras.main.shake(100, 0.05)
            this.cameras.main.fade(250, 0, 0, 0)
            this.cameras.main.once('camerafadeoutcomplete', () => {
                ui.reset()
                this.scene.start("GameScene")
            })

        }
        // console.log(p.health)
        this.cameras.main.shake(40, 0.02)
        p.setTint(0xff0000)
        this.time.addEvent({
            delay: 500,
            callback: () => {
                p.clearTint()
            },
            callbackScope: this,
            loop: false
        })
        e.explode()
    }

    update(time, delta) {
        if (this.keys.space.isDown) {
            if (time > this.lastFiredTime) {
                this.lastFiredTime = time + 90
                this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)
            }
            // console.log('fire');
        }

        if (this.keys.m.isDown) {
            if (time > this.lastFiredTime) {
                this.lastFiredTime = time + 90
                this.projectiles.fireProjectile(this.mechrobot.x, this.mechrobot.y, this.mechrobot.facing)
            }
            // console.log('fire');
        }

        this.mechrobot.update()

        this.player.update()

        if (!this.enemy.isDead) {
            this.enemy.update()
        }

        if (!this.enemy2.isDead) {
            this.enemy2.update(this.player.body.position, time)
        }

        if (!this.boss.isDead) {
            this.boss.update()
        }

        this.enemies.children.iterate((child) => {
            if (!child.isDead) {
                child.update()
            }
        })

        // if (this.enemy.isDead && this.enemy2.isDead) {
        //     this.scene.stop('level4').launch('playGame');
        // }

    } //end update

} //end gameScene