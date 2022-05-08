class Level3 extends Phaser.Scene{
    constructor(){
        super({key: 'Level3'})
    }

    preload(){
        this.load.atlas('golem', 'assets/golem.png', 'assets/golem_atlas.json');
        this.load.animation('golem_anim', 'assets/golem_anim.json');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('door', 'assets/door.png');
        this.load.image('smallPlatform', 'assets/platform-small.png');
        this.load.image('heart', 'assets/red-heart.png');
        this.load.image('ring', 'assets/ring.png');
        this.load.image('box', 'assets/box.png');
    }

    create(){
        this.background= this.add.rectangle(0,0, 2500,600, 0x000000);
        this.background.setOrigin(0)
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
        this.platforms= this.physics.add.staticGroup();
        this.rings= this.physics.add.staticGroup();
        this.smallPlatforms= this.physics.add.staticGroup();
        this.boxRings= this.physics.add.group(({
            key: 'ring',
            frameQuantity: 12,
            maxSize: 1000,
            active: false,
            visible: false,
            enable: false,
            bounceX: 0.5,
            bounceY: 0.5,
            dragX: 30,
            dragY: 0
        }));
        this.boxHearts= this.physics.add.group(({
            key: 'heart',
            frameQuantity: 12,
            maxSize: 1000,
            active: false,
            visible: false,
            enable: false,
            bounceX: 0.5,
            bounceY: 0.5,
            dragX: 30,
            dragY: 0
        }));
        this.boxes= this.physics.add.staticGroup();


        //create platforms
        levelPlatforms.forEach(platform=>{
            this.platforms.create(platform.x, platform.y, 'platform');
            this.createRings(platform, 8)
            this.createBox(platform)
        })

        smallPlatforms.forEach(platform=>{
            this.smallPlatforms.create(platform.x, platform.y, 'smallPlatform');
            this.createRings(platform, 3)
        })


        //cameras
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBounds(0,0, 2500, 600);
        //this.cameras.main.fade(100, 255, 255, 255, false, null, this);
        this.cameras.main.fadeIn(1000);
        //Colliders
        this.physics.add.collider(this.platformStart, this.player);
        this.physics.add.collider(this.platformFinish, this.player);
        this.physics.add.collider(this.door, this.platforms)
        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.smallPlatforms, this.player);
        this.physics.add.collider(this.player, this.boxes, (player, box)=>{
            if(box.body.touching.down && player.body.touching.up){
                const rand= Math.random();
                if(box.name==="Destroyable"){
                    if(rand>0.7){
                        this.createBoxHeart(player, box)
                    }
                    else if(rand<0.5){
                        this.createBoxRings(player, box)
                    }else{
                        return
                    }
                }else{
                    return
                }
            }
        })
        this.physics.add.collider(this.platforms, this.boxRings);
        this.physics.add.collider(this.boxes, this.boxRings)
        //Overlap
        this.physics.add.overlap(this.player, this.door, ()=>{
            gameStats.score++;
            gameStats.score+=100;
            this.scene.stop();
            this.scene.start('Level4')
            this.cameras.main.fade(1000);
        })
        this.ringsOverlap= this.physics.add.overlap(this.player, this.rings, (player, ring)=>{
            gameStats.score +=10
            ring.destroy();
        })
        this.boxRingsOverlap= this.physics.add.overlap(this.player, this.boxRings, (player, ring)=>{
            gameStats.score +=10
            ring.destroy();
        })
        this.boxHeartsOverlap= this.physics.add.overlap(this.player, this.boxHearts, (player, heart)=>{
            gameStats.lives++
            heart.destroy();
        })

        //Texts
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

        //Update texts
        this.scoreText.setText(`Your score: ${gameStats.score}`)

        //Update player lives
        this.playerLives();

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

    createBox(platform){
        const rand= Math.random();
        if(rand < 0.5){
            const numOfBoxes = Math.floor(Math.random()*5);
            for(let i= 0; i<numOfBoxes; i++){
                let box= this.boxes.create(platform.x+ i*60, platform.y-200, 'box');
                let randDestroy= Math.random()
                if(randDestroy < 0.5){
                    box.name="Destroyable"
                }else{
                    box.name="Undestroyable"
                }
            }

        }
    }

    createBoxRings(player, box){
        let ring= this.boxRings.get();
        if(!ring)return
        ring.enableBody(true, box.body.center.x, box.body.top, true, true).setScale(0.5)
        .setVelocity(player.body.velocity.x, -180);
        const destroyBox= Math.random();
        if(destroyBox<0.5){
            box.destroy()
        }
    }

    createBoxHeart(player, box){
        let heart= this.boxHearts.get();
        if(!heart)return;
        heart.enableBody(true, box.body.center.x, box.body.top, true, true).setVelocity(player.body.velocity.x, -180);
        box.destroy();
    }

    playerLives(){
        for(let i = 0; i < gameStats.lives; i++){
            const heart = this.add.image(20 + i*30, 20, 'heart')
            heart.setScrollFactor(0)
        }
    }
}

const levelPlatforms= [
    {
        x: 500,
        y: 300+Math.random(200)
    },
    
    {
        x:1900,
        y: 300+ Math.random()*200
    },
]

const smallPlatforms = [
    {
        x: 850,
        y: 300
    },
    {
        x:1100,
        y: 200
    },
    {
        x: 1400,
        y:500
    },
    {
        x: 1620,
        y: 300
    }
]