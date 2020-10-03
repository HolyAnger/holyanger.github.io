const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: [BootScene, PreloadScene, StartScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    }
};

const game = new Phaser.Game(config);
