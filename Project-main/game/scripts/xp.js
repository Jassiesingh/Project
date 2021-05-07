class xp extends Phaser.Scene {
    constructor(enemies) {
        super({ key: 'xp', active: true})
        this.enemies = enemies
    }
    create() {
        console.log('xp')
        this.xpScore = 0
        // this.xpScore = this.add.text(200, 160, 'XP: 20', { font: '8px', fill: '#ffffff' })

        // this.xpScore.setvisibility = false

    }
    // updatexp(enemies){
    //     if(enemies.isDead){
    //         this.xp = this.add.text(200, 4, 'XP: 20', { font: '8px', fill: '#ffffff' })
    //     }
    // }
}