
window.addEventListener('load', () => {
let config = {
    type: Phaser.AUTO,
    width: 400,
    height: 320,
    backgroundColor: 0xA52A2A,//change color to something actually good
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                y: 0
            }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "thegame"
    },
    pixelArt: true,
    scene: [loadScene, MainMenu, GameScene, level2, level3, Pause, UIScene, xp]
}
const game = new Phaser.Game(config)
}) //end load listener




class TitleScene extends Phaser.Scene {
    constructor() {
        super('titleScene')
    }

    preload() {

    } //end preload

    create() {

    } //end create

    update() {

    } //end update
} //end title scene

class WinScene extends Phaser.Scene {
    constructor() {
        super('winScene')
    }

    preload() {

    } //end preload

    create() {

    } //end create

    update() {

    } //end update
} //end title scene

class LoseScene extends Phaser.Scene {
    constructor() {
        super('loseScene')
    }

    preload() {

    } //end preload

    create() {

    } //end create

    update() {

    } //end update
} //end title scene