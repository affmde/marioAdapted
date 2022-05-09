
class Level6 extends Phaser.Scene{
    constructor(){
        super({key: 'Level6'})
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
        this.load.image('ArrowsController', 'assets/controls.png')
        this.load.image('ControlA', 'assets/ControlA.png');
        this.load.image('squareFake', 'assets/squareFakeControl.png');
        this.load.image('barrel', 'assets/barrel.png');
        this.load.image('monster', 'assets/monster.png');
        this.load.image('bullet', 'assets/bullet.png');
    }

    create(){
        this.background= this.add.rectangle(0,0, 3500,h, 0xb9baff);
        this.background.setOrigin(0)
        this.physics.world.setBounds(0,0,3500, h)
        this.cursors= this.input.keyboard.createCursorKeys();
        this.platformStart = this.physics.add.image(0, h*0.67, 'platform').setOrigin(0);
        this.platformStart.body.allowGravity = false;
        this.platformStart.setImmovable(true);
        this.platformFinish = this.physics.add.image(3500,h*0.67, 'platform').setOrigin(1,0);
        this.platformFinish.body.allowGravity = false;
        this.platformFinish.setImmovable(true);
        this.door=this.physics.add.image(3500, h*0.67, 'door').setOrigin(1);
        this.door.setImmovable(true);
        this.door.body.allowGravity = false;
        this.player= this.physics.add.sprite(20,h*0.2,'golem');
        this.player.setCollideWorldBounds(true);
        this.player.setSize(35, 35);
        this.player.setOffset(15, 28);
        this.platforms= this.physics.add.staticGroup();
        this.monster= this.physics.add.sprite(3400,50,'monster')
        this.rings= this.physics.add.staticGroup();
        this.barrels= this.physics.add.staticGroup();
        this.smallPlatforms= this.physics.add.staticGroup();
        mashrooms4= this.physics.add.group();
        arrows = this.add.image(120, h*0.8, 'ArrowsController').setAlpha(0.7).setScrollFactor(0).setInteractive().setScale(1.5);
        controlA = this.add.image(w*0.81,h*0.8, 'ControlA').setAlpha(0.5).setScale(0.8).setScrollFactor(0).setInteractive();
        squareLeft = this.add.image(50, h*0.8, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        squareRight = this.add.image(190, h*0.8, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        squareUp = this.add.image(120, h*0.8-70, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        squareDown = this.add.image(120, h*0.8+70, 'squareFake').setScale(1).setInteractive().setScrollFactor(0).setAlpha(0.01);
        
        //Create Live Hearts
        for(let i = 0; i < gameStats.lives; i++){
            const heart = this.add.image(20 + i*30, 20, 'heart')
            heart.setScrollFactor(0);
        }
        //create platforms
        level6Platforms.forEach(platform=>{
            this.platforms.create(platform.x, platform.y, 'platform');
            this.createRings(platform, 8)
            this.createEnemies(platform, platform.x+100, 2000)
        })

        smallPlatforms6.forEach(platform=>{
            let height = platform.y > 50 ? platform.y : 50
            this.smallPlatforms.create(platform.x, height, 'smallPlatform');
            this.createRings(platform, 3)
            this.createEnemies(platform, platform.x+10, 500)
        })

        //create Movable Platforms
        movableSmallPlatforms6.forEach(platform=>{
            movablePlatform= this.physics.add.image(platform.x, platform.y, 'smallPlatform');
            movablePlatform.body.setVelocityX(100);
            movablePlatform.body.allowGravity = false;
            movablePlatform.setImmovable(true);
        })

        //create Barrels
        barrel6.forEach(barrel=>{
            let barr= this.barrels.create(barrel.x, barrel.y, 'barrel');

        })


        //cameras
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setBounds(0,0, 3500, h);
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
        this.physics.add.collider(this.platformFinish, this.monster, (platform, monster)=>{
            monster.setVelocityY(-380)
        })
        this.physics.add.collider(this.monster, this.player, (monster, player)=>{
            this.checkGameOver()
        })
        this.physics.add.collider(this.player, mashrooms4, (pl, mash)=>{
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
                this.checkGameOver()
            }
        })
        this.physics.add.collider(this.player, this.barrels, (player, barrel)=>{
            let rotate=false
            setInterval(()=>{
                if(rotate){
                    barrel.setScale(0.9)
                }else{
                    barrel.setScale(1)
                }
                rotate=!rotate
                console.log(rotate)
            },16)
            setTimeout(()=>{
                barrel.destroy()
            },1500)
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

        //throw bullets
        this.createBullets()

        //Texts
        this.scoreText= this.add.text(20,40, `Score: ${gameStats.score}`, {fontSize: 20});
        this.scoreText.setScrollFactor(0)
        
    }

    update(){
        this.physics.world.collide(this.player, this.platforms);
        this.checkAnimation()
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

        if(movablePlatform.x< 851){
            movablePlatform.body.setVelocityX(100)
        }else if(movablePlatform.x>1200){
            movablePlatform.body.setVelocityX(-100)
        }

        //Mobile Controls
        squareLeft.on('pointerdown', ()=>{
            this.player.setVelocityX(-160)
            squareLeft.setAlpha(0.03)
            this.player.flipX=true;
            animation='walk'
        })
        squareLeft.on('pointerup', ()=>{
            this.player.setVelocityX(0);
            squareLeft.setAlpha(0.01)
            animation='idle'
        })
        squareLeft.on('pointerout', ()=>{
            this.player.setVelocityX(0);
            squareLeft.setAlpha(0.01)
            animation='idle'
        })
        squareRight.on('pointerdown', ()=>{
            this.player.setVelocityX(160)
            squareRight.setAlpha(0.03)
            animation='walk'
            this.player.flipX=false
        })
        squareRight.on('pointerout', ()=>{
            this.player.setVelocityX(0)
            squareRight.setAlpha(0.01)
            animation='idle'
        })
        squareRight.on('pointerup', ()=>{
            this.player.setVelocityX(0)
            squareRight.setAlpha(0.01)
            animation='idle'
        })
        squareDown.on('pointerdown', ()=>{
            this.player.setVelocityY(h*0.63)
            squareDown.setAlpha(0.03)
        })
        squareDown.on('pointerout', ()=>{
            squareDown.setAlpha(0.01)

        })
        squareDown.on('pointerup', ()=>{
            squareDown.setAlpha(0.01)
        })
        controlA.on('pointerdown', ()=>{
            if(this.player.body.touching.down){
                this.player.setVelocityY(-h*0.63)
            }
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

    checkAnimation(){
        if(animation==='idle'){
            this.player.anims.play('golem_idle', true)
        }else if(animation==='walk'){
            this.player.anims.play('golem_walk', true)
        }
    }

    //Create Rings
    createRings(platform, amount){
        const rand = Math.random()
        const randNrRings= Math.random()*amount;
        if(rand<0.5){
            for(let i= 0; i<randNrRings; i++){
                let ring= this.rings.create(platform.x-100+i*40, platform.y-(h*0.16)-Math.random()*(h*0.16), 'ring')
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

    createBullets(){
        setInterval(()=>{
            let bullet= this.physics.add.image(this.monster.x, this.monster.body.top+(Math.random()*100), 'bullet')
            bullet.setVelocityX(-200)
            bullet.body.allowGravity=false
            this.physics.add.collider(bullet, this.player, (bul, player)=>{
                this.checkGameOver()
            })
        },5000)
    }
}

const level6Platforms= [
    {
        x: 500,
        y: h*0.4
    },
]

const smallPlatforms6 = [
    {
        x: 800,
        y: h*0.3
    },
    {
        x: 2050,
        y: h*0.6
    },
    {
        x: 2600,
        y: h*0.28
    },
    {
        x: 2900,
        y: h*0.9
    }
]

const movableSmallPlatforms6 = [
    {
        id: 0,
        x: 850,
        y: h*0.3
    }
]

const barrel6= [
    {
        id: 0,
        x: 1250,
        y: h*0.3
    },
    {
        id: 1,
        x: 1450,
        y: h*0.3
    },
    {
        id: 2,
        x:1650,
        y: h*0.3
    },
    {
        id: 3,
        x: 1850,
        y:h*0.3
    },
    {
        id:4,
        x: 2300,
        y:h*0.5
    },
    {
        id: 5,
        x:3200,
        y: h*0.75
    }
]

