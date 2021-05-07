class PlasmaBar{
    constructor(scene, x, y, plasma){
        this.scene = scene
        this.currentPlasma = plasma
        this.x = x
        this.y = y
        
        this.graphics = this.scene.add.graphics()
        // this.graphics2 = this.scene.add.graphics()
        this.newGraphics = this.scene.add.graphics()
        const plasmabarBackground = new Phaser.Geom.Rectangle(x+32, y, 104, 12)
        // const healthbarBackground2 = new Phaser.Geom.Rectangle(x+34, y+2, 100, 8)
        const plasmabarFill = new Phaser.Geom.Rectangle(x+34, y+2, this.currentPlasma, 8)
        //might wanna delete all of the graphics2. Dosen't make sense
        this.graphics.fillStyle(0xffffff, 0.5)
        // this.graphics2.fillStyle(0xff0099, 1)
        this.graphics.fillRectShape(plasmabarBackground)
        // this.graphics2.fillRectShape(healthbarBackground2)
        this.newGraphics.fillStyle(0x3587e2, 1)
        this.newGraphics.fillRectShape(plasmabarFill)

        this.scene.add.text(x, y+2, 'Plasma', {fontSize: '8px', fill: '#fff'})
           
    }//end of constructor

    updatePlasma(plasma){
        this.newGraphics.clear()
        this.currentPlasma = plasma
        this.newGraphics.fillStyle(0xff0025, 1  )
        const plasmabarFill = new Phaser.Geom.Rectangle(this.x+34, this.y+2, this.currentHealth, 8)
        this.newGraphics.fillRectShape(plasmabarFill)
        // console.log(this.currentPlasma)
        console.log(this.plasmabar)
    }
}