let movablePlatform;
let mashrooms4;
class Level4 extends Phaser.Scene{
    constructor(){
        super({key: 'Level4'})
    }

    preload(){
        this.load.atlas('golem', 'assets/golem.png', 'assets/golem_atlas.json');
        this.load.animation('golem_anim', 'assets/golem_anim.json');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('door', 'assets/door.png');
        this.load.image('smallPlatform', 'assets/platform-small.png');
        this.load.image('heart', 'assets/red-heart.png');
        this.load.image('ring', 'assets/ring.png');
        this.load.atlas('mashroom', 'assets/mashroom.png', 'assets/mashroom_atlas.json')
        this.load.animation('mashroom_anim', 'assets/mashroom_anim.json');
    }

    create(){
        this.background= this.add.rectangle(0,0, 3500,600, 0x000000);
        this.background.setOrigin(0)
        this.physics.world.setBounds(0,0,3500, 600)
        this.cursors= this.input.keyboard.createCursorKeys();
        this.platformStart = this.physics.add.image(0, 400, 'platform').setOrigin(0);
        this.platformStart.body.allowGravity = false;
        this.platformStart.setImmovable(true);
        this.platformFinish = this.physics.add.image(3500,400, 'platform').setOrigin(1,0);
        this.platformFinish.body.allowGravity = false;
        this.platformFinish.setImmovable(true);
        this.door=this.physics.add.image(3500, 400, 'door').setOrigin(1);
        this.door.setImmovable(true);
        this.door.body.allowGravity = false;
        this.player= this.physics.add.sprite(20,300,'golem');
        this.player.setCollideWorldBounds(true);
        this.platforms= this.physics.add.staticGroup();
        this.rings= this.physics.add.staticGroup();
        this.smallPlatforms= this.physics.add.staticGroup();
        mashrooms4= this.physics.add.group();
        
        //Create Live Hearts
        for(let i = 0; i < gameStats.lives; i++){
            const heart = this.add.image(20 + i*30, 20, 'heart')
            heart.setScrollFactor(0);
        }
        //create platforms
        level4Platforms.forEach(platform=>{
            this.platforms.create(platform.x, platform.y, 'platform');
            this.createRings(platform, 8)
            this.createEnemies(platform, platform.x+100, 2000)
        })

        smallPlatforms4.forEach(platform=>{
            let height = platform.y > 50 ? platform.y : 50
            this.smallPlatforms.create(platform.x, height, 'smallPlatform');
            this.createRings(platform, 3)
            this.createEnemies(platform, platform.x+10, 500)
        })

        //create Movable Platforms
        movableSmallPlatforms.forEach(platform=>{
            movablePlatform= this.physics.add.image(platform.x, platform.y, 'smallPlatform');
            movablePlatform.body.setVelocityX(100);
            movablePlatform.body.allowGravity = false;
            movablePlatform.setImmovable(true);
        })


        //cameras
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBounds(0,0, 3500, 600);
        //this.cameras.main.fade(100, 255, 255, 255, false, null, this);
        this.cameras.main.fadeIn(1000);
        //Colliders
        this.physics.add.collider(this.platformStart, this.player);
        this.physics.add.collider(this.platformFinish, this.player);
        this.physics.add.collider(this.door, this.platforms)
        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.smallPlatforms, this.player);
        this.physics.add.collider(this.player, movablePlatform);
        this.physics.add.collider(mashrooms4, this.platforms)
        this.physics.add.collider(this.player, mashrooms4, (pl, mash)=>{
            console.log(mash.hits)
            if(mash.body.touching.up){
                if(mash.hits<1){
                    mash.body.stop();
                    mash.allowGravity = false;
                    mash.hits++
                    this.player.setVelocityY(-100)
                }else{
                    gameStats.score+=20;
                    mash.destroy();
                }
            }else{
                console.log('hit to die')
                this.checkGameOver()
            }
            
        })
        //Overlap
        this.physics.add.overlap(this.player, this.door, ()=>{
            gameStats.score++;
            gameStats.score+=100;
            this.scene.stop();
            this.scene.start('EndGame')
            this.cameras.main.fade(1000);
        })
        this.ringsOverlap= this.physics.add.overlap(this.player, this.rings, (player, ring)=>{
            gameStats.score +=10
            ring.destroy();
        })

        //Texts
        console.log(gameStats.score)
        this.scoreText= this.add.text(20,40, `Score: ${gameStats.score}`, {fontSize: 20});
        this.scoreText.setScrollFactor(0)
    }

    update(){
        this.physics.world.collide(this.player, this.platforms);
        this.player.anims.play('golem_idle', true)
        if(this.cursors.left.isDown){
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
        }

        if(this.player.y===568){
            this.checkGameOver()
        }

        if(movablePlatform.x< 2200){
            movablePlatform.body.setVelocityX(100)
        }else if(movablePlatform.x>2700){
            movablePlatform.body.setVelocityX(-100)
        }

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

    //Create Rings
    createRings(platform, amount){
        const rand = Math.random()
        const randNrRings= Math.random()*amount;
        if(rand<0.5){
            for(let i= 0; i<randNrRings; i++){
                let ring= this.rings.create(platform.x-100+i*40, platform.y-150-Math.random()*100, 'ring')
                ring.setScale(0.5)
            }
        }
    }

    createEnemies(platform, finalPosition, duration){
        const rand= Math.random()
        if(rand <0.5){
            let mashroomHit = 0;
            let mashroom= this.physics.add.sprite(platform.x, platform.y, 'mashroom');
            mashrooms4.add(mashroom)
            mashroom.setOrigin(0,2);
            mashroom.hits=0;
            this.tweens.add({
                targets:mashroom,
                x: finalPosition,
                ease: 'Linear',
                duration:duration ,
                repeat: -1,
                yoyo: true,
            })
            this.physics.add.collider(mashroom, this.smallPlatforms)
        }
    }
}

const level4Platforms= [
    {
        x: 500,
        y: 300+Math.random(200)
    },
    
    {
        x:1900,
        y: 300+ Math.random()*200
    },
    {
        x:3000,
        y: (Math.random()*300)+(Math.random()*200)

    }
]

const smallPlatforms4 = [
    {
        x: 850,
        y: 300
    },
    {
        x:1100,
        y: 150
    },
    {
        x: 1400,
        y:520
    },
    {
        x: 1620,
        y: 300
    }
]

const movableSmallPlatforms = [
    {
        id: 0,
        x: 2100,
        y: 250
    }
]
