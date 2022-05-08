class GameOver extends Phaser.Scene{
    constructor(){
        super({key: 'GameOver'})
    }

    preload(){

    }

    create(){
        this.textOver = this.add.text(250, 150, 'Game Over!!', {fontSize:32});
        this.textPoints = this.add.text(250, 200, `Your Score: `, {fontSize: 32});
        this.textScore = this.add.text(250, 250, gameStats.score, {fontSize: 40});
        this.playAgainText = this.add.text(250, 300, 'Play again', {fontSize: 32});
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