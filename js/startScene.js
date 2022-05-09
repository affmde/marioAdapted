const h= window.innerHeight;
const w= window.innerWidth;
class StartScene extends Phaser.Scene{
    constructor(){
        super({key: 'StartScene'})
    }

    preload(){
        
    }

    create(){
        this.textOver = this.add.text(w/2, h/2, 'The Golem', {fontSize:40}).setOrigin(0.5);
        this.playAgainText = this.add.text(w/2, h/2+(h*0.1), 'Play', {fontSize: 32}).setOrigin(0.5);
        this.playAgainText.setInteractive();
        this.playAgainText.on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.start('Level4')
        })
    }

    update(){

    }
}

