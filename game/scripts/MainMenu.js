class MainMenu extends Phaser.Scene {
    constructor() {
        super('playGame')
    }

    preload() {
        this.load.image('background', 'assets/unnamed.png')
        this.load.image('button', 'assets/startbutton.png')

    }

    create() {
        //background for the Main Menu
        this.add.image(110, 110, 'background')
        //Main Menu text
        this.add.text(110, 50, "Main Menu")
        this.scene.stop("UIScene")

        //some dummy 
        this.clickButton = this.add.text(100, 100, 'Start Game!', { fill: '#fff' })
            .setInteractive({ useHandCursor: true }).on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState()).on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', () => {
                this.enterButtonHoverState();

            });
    }

    //update function go brrr

    enterButtonHoverState() {
        this.clickButton.setStyle({ fill: '#000' });
    }

    enterButtonRestState() {
        this.clickButton.setStyle({ fill: '#fff' });
    }

    enterButtonActiveState() {
        this.scene.start('GameScene')
        this.scene.start('UIScene')

        // this.clickButton.setStyle({ fill: '#0ff' });
    }

}