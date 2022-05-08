class StartScene extends Phaser.Scene{
    constructor(){
        super({key: 'StartScene'})
    }

    preload(){

    }

    create(){
        this.textOver = this.add.text(250, 250, 'The Golem', {fontSize:40});
        this.playAgainText = this.add.text(300, 350, 'Play', {fontSize: 32});
        this.playAgainText.setInteractive();
        this.playAgainText.on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.start('Level4')
        })
        console.log(this.game)
    }

    update(){

    }
}
