config={
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    backgroundColor: "b9baff",
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: { y: 300 }
      }
    },
    scene: [StartScene, GameScene, Level2, Level3, Level4, Level5, Level6, GameOver, EndGame]
}

const game = new Phaser.Game(config);