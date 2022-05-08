class EndGame extends Phaser.Scene{
    constructor(){
        super({key: 'EndGame'})
    }

    preload(){

    }

    create(){
        this.textOver = this.add.text(250, 200, 'Congratulations!', {fontSize:32});
        this.textPoints = this.add.text(250, 250, `Your Score: `, {fontSize: 32});
        this.textScore = this.add.text(300, 300, gameStats.score, {fontSize: 40});
        this.playAgainText = this.add.text(250, 350, 'Play again', {fontSize: 32});
        this.playAgainText.setInteractive();
        this.playAgainText.on('pointerdown', ()=>{
            this.scene.stop();
            this.scene.start('GameScene')
            gameStats.lives= 3;
            gameStats.score=0;
            gameStats.level=1
        })
    }

    update(){

    }
}