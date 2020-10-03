class Enemy extends MovableObject {
  static generate(scene, fires) {
    const data = Enemy.generateAttributes();
    return new Enemy({
      scene,
      fires,
      x: data.x,
      y: data.y,
      texture: 'enemy',
      frame: data.frame,
      velocity: -300,
      bullet: {
        delay: 1000,
        texture: 'bullet',
        velocity: -500,
      },
      origin: {
        x: 0,
        y: 0.5
      },
    });
  }

  init(data) {
    super.init(data);
    this.setOrigin(data.origin.x, data.origin.y);
    this.fires = data.fires || new Fires(this.scene);

    this.timer = this.scene.time.addEvent({
      delay: data.bullet.delay,
      callback: this.fire,
      callbackScope: this,
      loop: true
    });

    this.bullet = data.bullet;
  }

  fire() {
    this.fires.createFire(this);
  }

  static generateAttributes() {
    const x = config.width;
    const y = Phaser.Math.Between(100, config.height - 100);
    const frame = `enemy${Phaser.Math.Between(1, 4)}`;

    return {x, y, frame};
  }

  reset() {
    const data = Enemy.generateAttributes();
    super.reset(data.x, data.y);
    this.setFrame(data.frame);
  }

  isDead() {
    return this.x < -this.width;
  }
}
