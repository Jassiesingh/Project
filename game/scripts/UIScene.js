class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true })
    }
    create() {
        console.log('ui scene')
        this.coinScore = 0
        //coin text
        this.coinText = this.add.text(300, 4, 'Coins: ' + this.coinScore, { font: '8px', fill: '#ffffff' })
        //HealthBar
        this.healthbar = new Healthbar(this, 8, 2, 100)

        //pause button
        this.pauseButton = this.add.text(350, 1, 'Pause', { fill: '#fff' })
            .setInteractive({ useHandCursor: true }).on('pointerover', () => this.enterButtonHoverState1())
            .on('pointerout', () => this.enterButtonRestState1()).on('pointerdown', () => this.enterButtonActiveState1())
            .on('pointerup', () => {
                this.enterButtonHoverState1();
            });

    }
    enterButtonHoverState1() {
        this.pauseButton.setStyle({ fill: '#000' });
    }

    enterButtonRestState1() {
        this.pauseButton.setStyle({ fill: '#fff' });
    }

    enterButtonActiveState1() {
        this.scene.start("pause")
        let gs = this.scene.get("GameScene")
        gs.scene.pause()

    }

    updateCoins() {
        this.coinScore += 1
        this.coinText.setText('Coins: ' + this.coinScore)
    }

    reset() {
        this.coinScore = 0
        this.coinText.setText('Coins: ' + this.coinScore)
        this.healthbar.updateHealth(100)
    }

}