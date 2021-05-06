class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
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

        this.load.spritesheet('pickup', 'assets/sprites/New Piskel.png', {
            frameWidth: 16,
            frameHeight: 16
        });

        //Enemy??
        this.load.atlas('Atlas1', 'assets/sprites/skeleton.png', 'assets/sprites/skeleton.json')

        this.player
        this.keys
        this.enemy
        this.enemies
        this.healthbar
        this.plasmabar
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
        this.player = new Player(this, 50, 100, 'player', 10);
        console.log(this.player.health)

        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.body.setCollideWorldBounds(true);

        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);

        //test code for level complete

        // this.physics.add.collider(this.player, worldLayer)

        //limit camera to map only
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        //enemy?
        this.enemy = new Enemy(this, 250, 200, 'Atlas1', 50, 'wandering50', 30)

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

        monsterLayer.forEachTile(tiles => {
            if (tiles.properties.kind !== undefined) {
                // console.log(tiles.properties.kind);
                const x = tiles.getCenterX()
                const y = tiles.getCenterY()
                const e = new Enemy(this, x, y, 'Atlas1', 10, tiles.properties.kind, tiles.properties.speed)
                this.enemies.add(e)
                e.body.setCollideWorldBounds(true)
                // e.setTint(0x00ff00) 
            }
            // console.log(this.enemies);
        })

        this.physics.add.collider(this.enemies, worldLayer)
        this.physics.add.collider(this.enemies, obstacles)
        // this.physics.add.collider(this.enemies, complete)

        //HealthBar code was moved to UIScene

        //bullets for the wicked
        this.keys = this.input.keyboard.addKeys({
            space: 'SPACE'
        })

        this.projectiles = new Projectiles(this)
        this.plasmabar = new PlasmaBar(this)
        console.log(this.plasmabar)


        //this. callback for the collision custom functions 
        this.physics.add.collider(this.projectiles, obstacles, this.handleProjectileWorldCollision, null, this)
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this)
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
        this.physics.add.collider(this.player, this.coins, this.handlePlayerCoinCollision, null, this)
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
        this.add.text(300, 100, 'Level1', { font: '8px', fill: '#ffffff' })

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
        this.sxScore += 15
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


    //Projectiles colliding with enemy
    handleProjectileEnemyCollision(enemy, projectile) {
        if (projectile.active) {
            enemy.setTint(0xff0000)
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    enemy.explode()
                    projectile.recycle()
                },
                callbackScope: this,
                loop: false
            })
            this.xpScore = 15
            this.emitter.active = true
            this.emitter.setPosition(enemy.x, enemy.y)
            this.emitter.explode()
        }
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
                this.scene.start('GameScene')
            })

        }
        console.log(p.health)
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


    update(time, delta, projectile) {
        if (this.keys.space.isDown) {
            if (time > this.lastFiredTime) {
                this.lastFiredTime = time + 100
                this.projectiles.fireProjectile(this.player.x, this.player.y, this.player.facing)
                let ui = this.scene.get('UIScene')
                ui.plasmabar -= 1;
            }
            // console.log('fire');
        }

        if (projectile.active) {
            this.plasmabar -= 1
            let ui = this.scene.get('UIScene')
            ui.plasmabar.updatePlasma(p.plasma)
        }

        this.player.update()

        if (!this.enemy.isDead) {
            this.enemy.update()
        }

        if (!this.enemy2.isDead) {
            this.enemy2.update(this.player.body.position, time)
        }

        this.enemies.children.iterate((child) => {
            if (!child.isDead) {
                child.update()
            }
        })

        if (this.enemy.isDead && this.enemy2.isDead) {
            this.scene.stop('GameScene').launch('level2');
        }

    } //end update

} //end gameScene