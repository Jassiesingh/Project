class Pause extends Phaser.Scene {
    constructor() {
        super('pause')
    }

    preload() {
        //preloading all the stuff
        // this.load.image('background', 'assets/unnamed.png')   
    }

    create() {
        //background for the Main Menu
        //Main Menu text
        this.add.text(110, 50, "Pause Menu")

        //resumebutton 
        this.resumeButton = this.add.text(100, 100, 'Resume game', { fill: '#fff' })
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.enterButtonHoverState2())
            .on('pointerdown', () => this.enterButtonActiveState2())
            .on('pointerup', () => {
                this.enterButtonHoverState2();
            });
    }
    enterButtonHoverState2() {
        this.resumeButton.setStyle({ fill: '#000' });
    }

    enterButtonRestState2() {
        this.resumeButton.setStyle({ fill: '#fff' });
    }

    enterButtonActiveState2() {
        
        this.scene.switch("GameScene")
        this.scene.switch("UIScene")
    }
}