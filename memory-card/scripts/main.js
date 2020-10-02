window.addEventListener('load', () => {
  window.setTimeout(() => {
    const DEFAULT_HEIGHT = 720
    const DEFAULT_WIDTH = (window.innerWidth / window.innerHeight) * DEFAULT_HEIGHT

    const config = {
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        scene: new GameScene(),
      },
    }
    new Phaser.Game(config)
  }, 1000)
});
