
let mashrooms;
class Level2 extends Phaser.Scene{
    constructor(){
        super({key: 'Level2'})
    }

    preload(){
        this.load.atlas('golem', 'assets/golem.png', 'assets/golem_atlas.json');
        this.load.animation('golem_anim', 'assets/golem_anim.json');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('door', 'assets/door.png');
        this.load.atlas('mashroom', 'assets/mashroom.png', 'assets/mashroom_atlas.json')
        this.load.animation('mashroom_anim', 'assets/mashroom_anim.json');
        this.load.image('heart', 'assets/red-heart.png')
        this.load.image('ring', 'assets/ring.png');
        this.load.image('box', 'assets/box.png');
        this.load.image('ArrowsController', 'assets/controls.png')
        this.load.image('ControlA', 'assets/ControlA.png');
        this.load.image('squareFake', 'assets/squareFakeControl.png')
    }

    create(){
        this.background= this.add.rectangle(0,0, 2500,h, 0xa9a9a9);
        this.background.setOrigin(0)
        this.physics.world.setBounds(0,0,2500, h)
        this.cursors= this.input.keyboard.createCursorKeys();
        this.platformStart = this.physics.add.image(0, h*0.67, 'platform').setOrigin(0);
        this.platformStart.body.allowGravity = false;
        this.platformStart.setImmovable(true);
        this.platformFinish = this.physics.add.image(2500,h*0.67, 'platform').setOrigin(1,0);
        this.platformFinish.body.allowGravity = false;
        this.platformFinish.setImmovable(true);
        this.door=this.physics.add.image(2500, h*0.67, 'door').setOrigin(1);
        this.door.setImmovable(true);
        this.door.body.allowGravity = false;
        this.player= this.physics.add.sprite(20,h*0.2,'golem');
        this.player.setCollideWorldBounds(true);
        this.platforms= this.physics.add.staticGroup();
        this.rings= this.physics.add.staticGroup();
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
        mashrooms = this.physics.add.group();
        arrows = this.add.image(120, h*0.8, 'ArrowsController').setAlpha(0.7).setScrollFactor(0).setInteractive().setScale(1.5);
        controlA = this.add.image(w*0.81,h*0.8, 'ControlA').setAlpha(0.5).setScale(0.8).setScrollFactor(0).setInteractive();
        squareLeft = this.add.image(50, h*0.8, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        squareRight = this.add.image(190, h*0.8, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        squareUp = this.add.image(120, h*0.8-70, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        squareDown = this.add.image(120, h*0.8+70, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        
        //create platforms
        level2Platforms.forEach(platform=>{
            this.platforms.create(platform.x, platform.y, 'platform')
            const rand = Math.random()
            const randNrRings= Math.random()*5;
            if(rand<0.5){
                for(let i= 0; i<randNrRings; i++){
                    let ring= this.rings.create(platform.x-100+i*40, platform.y-(h*0.16)-Math.random()*(h*0.16), 'ring')
                    ring.setScale(0.5)
                }
            }
            this.createBox(platform)
        })

        //create enemy
        enemies.forEach(enemy=>{
            let mashroomHit = 0;
            let mashroom= mashrooms.create(enemy.x-100, enemy.y-h*0.16, 'mashroom');
            mashroom.setOrigin(0,2);
            mashroom.name=enemy.id;
            mashroom.hits=0;
            mashrooms.add(mashroom)
            this.tweens.add({
                targets:mashroom,
                x: enemy.x+100,
                ease: 'Linear',
                duration:2500 ,
                repeat: -1,
                yoyo: true,
            })
        })

        //cameras
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBounds(0,0, 2500, h);
        //this.cameras.main.fade(100, 255, 255, 255, false, null, this);
        this.cameras.main.fadeIn(1000);
        //Colliders
        this.physics.add.collider(this.platformStart, this.player);
        this.physics.add.collider(this.platformFinish, this.player);
        this.physics.add.collider(this.door, this.platforms)
        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.player, mashrooms, (pl, mash)=>{
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
            gameStats.level++
            gameStats.score+=100
            this.scene.stop();
            this.scene.start('Level3')
            this.cameras.main.fade(1000);
            console.log(gameStats.level)
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
        this.physics.world.collide(this.platforms, mashrooms);
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

        if(this.player.y>h-50){
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
        squareLeft.on('pointerout', ()=>{
            this.player.setVelocityX(0);
            squareLeft.setAlpha(0.01)
        })
        squareRight.on('pointerdown', ()=>{
            this.player.setVelocityX(160)
            squareRight.setAlpha(0.03)
        })
        squareRight.on('pointerout', ()=>{
            this.player.setVelocityX(0)
            squareRight.setAlpha(0.01)
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
        controlA.on('pointerout', ()=>{
            controlA.setScale(0.8)
        })

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

    createBox(platform){
        const rand= Math.random();
        if(rand < 0.5){
            const numOfBoxes = Math.floor(Math.random()*5);
            for(let i= 0; i<numOfBoxes; i++){
                let box= this.boxes.create(platform.x+ i*60, platform.y-h*0.20, 'box');
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

const level2Platforms= [
    {
        x: 500,
        y: h/2
    },
    {
        x:850,
        y: h/2-100
    },
    {
        x:1300,
        y: h/2+h*0.1
    },
    {
        x:1800,
        y: h/2
    },
]

const enemies = [
    {
        id: 0,
        x: level2Platforms[1].x,
        y: level2Platforms[1].y
    },
    {
        id: 1,
        x: level2Platforms[3].x,
        y: level2Platforms[3].y
    }
]
