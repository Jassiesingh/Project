class loadScene extends Phaser.Scene {
    constructor() {
        super('bootScene')
    }

    preload(){
        this.load.image('background' , 'assets/unnamed.png')
        this.load.image('button' , 'assets/startbutton.png')
        
    }

    create(){
        this.add.image(110,110,'background')
        this.add.text(110,50, "Loading game....")
        this.scene.start("playGame")
    }

    update(){

    }
}
