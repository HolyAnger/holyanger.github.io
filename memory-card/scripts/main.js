    const config = {
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 700,
        scene: new GameScene(),
      },
    }
    new Phaser.Game(config)
