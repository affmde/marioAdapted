const gameStats={
    lives:3,
    score:0,
    level:1
}

let arrows;
let controlA;
let squareLeft;
let squareRight;
let squareUp;
let squareDown;

class GameScene extends Phaser.Scene{
    constructor(){
        super({key: 'GameScene'})
    }

    preload(){
        this.load.atlas('golem', 'assets/golem.png', 'assets/golem_atlas.json');
        this.load.animation('golem_anim', 'assets/golem_anim.json');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('door', 'assets/door.png');
        this.load.image('heart', 'assets/red-heart.png')
        this.load.image('ring', 'assets/ring.png');
        this.load.image('ArrowsController', 'assets/controls.png')
        this.load.image('ControlA', 'assets/ControlA.png');
        this.load.image('squareFake', 'assets/squareFakeControl.png')
    }

    create(){
        
        this.physics.world.setBounds(0,0,2500, 600)
        this.cursors= this.input.keyboard.createCursorKeys();
        this.platformStart = this.physics.add.image(0, 400, 'platform').setOrigin(0);
        this.platformStart.body.allowGravity = false;
        this.platformStart.setImmovable(true);
        this.platformFinish = this.physics.add.image(2500,400, 'platform').setOrigin(1,0);
        this.platformFinish.body.allowGravity = false;
        this.platformFinish.setImmovable(true);
        this.door=this.physics.add.image(2500, 400, 'door').setOrigin(1);
        this.door.setImmovable(true);
        this.door.body.allowGravity = false;
        this.player= this.physics.add.sprite(20,300,'golem');
        this.player.setCollideWorldBounds(true);
        this.rings= this.physics.add.staticGroup();
        this.smallPlatforms= this.physics.add.staticGroup()
        this.platforms= this.physics.add.staticGroup()
        arrows = this.add.image(120, 500, 'ArrowsController').setAlpha(0.7).setScrollFactor(0).setInteractive().setScale(1.5);
        controlA = this.add.image(650,500, 'ControlA').setAlpha(0.5).setScale(0.8).setScrollFactor(0).setInteractive();
        squareLeft = this.add.image(50, 500, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        squareRight = this.add.image(190, 500, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        squareUp = this.add.image(120, 430, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        squareDown = this.add.image(120, 570, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        //Create Live Hearts
        for(let i = 0; i < gameStats.lives; i++){
            const heart = this.add.image(20 + i*30, 20, 'heart');
            heart.setScrollFactor(0)
        }
        //create platforms
        level1Platforms.forEach(platform=>{
            this.platforms.create(platform.x, platform.y, 'platform');
            //create Rings
            const rand = Math.random()
            const randNrRings= Math.random()*5;
            if(rand<0.5){
                for(let i= 0; i<randNrRings; i++){
                    let ring= this.rings.create(platform.x-100+i*40, platform.y-150-Math.random()*100, 'ring')
                    ring.setScale(0.5)
                }
            }
        })
        
        
        //cameras
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBounds(0,0, 2500, 600);
        //this.cameras.main.fade(100, 255, 255, 255, false, null, this);
        this.cameras.main.fadeIn(1000);
        //Colliders
        this.physics.add.collider(this.platformStart, this.player);
        this.physics.add.collider(this.platformFinish, this.player);
        this.physics.add.collider(this.door, this.platforms);
        this.physics.add.collider(this.smallPlatforms, this.player);
        this.physics.add.collider(this.platforms, this.player)

        //Overlap
        this.physics.add.overlap(this.player, this.door, ()=>{
            gameStats.level++;
            gameStats.score +=100;
            this.scene.stop();
            this.scene.start('Level2')
            this.cameras.main.fade(1000);
        })
        this.ringsOverlap= this.physics.add.overlap(this.player, this.rings, (player, ring)=>{
            gameStats.score +=10
            ring.destroy();
        })

        //Texts
        this.scoreText= this.add.text(20,40, `Score: ${gameStats.score}`, {fontSize: 20});
        this.scoreText.setScrollFactor(0)
    }

    update(){
        this.physics.world.collide(this.player, this.platforms);
        this.player.anims.play('golem_idle', true)
        /*if(this.cursors.left.isDown){
            this.player.setVelocityX(-160)
        }else if(this.cursors.right.isDown){
            this.player.setVelocityX(160)
        }else{
            this.player.setVelocityX(0);
        }
        
        if(this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-380)
        }else if(this.cursors.down.isDown){
            this.player.setVelocityY(200)
        }*/

        if(this.player.y===568){
            this.checkGameOver()
        }
        //Mobile Controls
        squareLeft.on('pointerdown', ()=>{
            this.player.setVelocityX(-160)
            squareLeft.setAlpha(0.03)
        })
        squareLeft.on('pointerup', ()=>{
            this.player.setVelocityX(0);
            squareLeft.setAlpha(0.01)
        })
        squareRight.on('pointerdown', ()=>{
            this.player.setVelocityX(160)
            squareRight.setAlpha(0.03)
        })
        squareRight.on('pointerup', ()=>{
            this.player.setVelocityX(0)
            squareRight.setAlpha(0.01)
        })
        controlA.on('pointerdown', ()=>{
            if(this.player.body.touching.down)
            this.player.setVelocityY(-380)
            controlA.setScale(0.6)
        })
        controlA.on('pointerup', ()=>{
            controlA.setScale(0.8)
        })
        
        //Update texts
        this.scoreText.setText(`Your score: ${gameStats.score}`)

    }//end of Update method

    checkGameOver(){
        if(gameStats.lives===1){
            this.scene.stop();
            this.scene.start('GameOver')
        }else{
            gameStats.lives--;
            this.scene.start()
        }
    }

}

const level1Platforms= [
    {
        x: 500,
        y: 300
    },
    {
        x:850,
        y: 300+ Math.random()*200
    },
    {
        x:1300,
        y: 300+ Math.random()*200
    },
    {
        x:1900,
        y: 300+ Math.random()*200
    },
]

const rings= [

]

