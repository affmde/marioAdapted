config={
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    backgroundColor: "b9baff",
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 300 }
      }
    },
    scene: [StartScene, GameScene, Level2, Level3, Level4, GameOver, EndGame]
}

const game = new Phaser.Game(config);