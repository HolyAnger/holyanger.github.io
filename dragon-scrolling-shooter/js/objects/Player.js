class Player extends Enemy {
  constructor(scene) {
    super({
      scene,
      x: 150,
      y: config.height / 2,
      texture: 'dragon',
      frame: 'dragon1',
      velocity: 500,
      bullet: {
        delay: 500,
        texture: 'fire',
        velocity: 750,
      },
      origin: {
        x: 1,
        y: 0.5
      },
    });

    const frames = this.scene.anims.generateFrameNames('dragon', {
      prefix: 'dragon',
      start: 1,
      end: 6,
    });

    this.scene.anims.create({
      key: 'fly',
      frames,
      frameRate: 10,
      repeat: -1,
    });

    this.play('fly');
  }

  init(data) {
    super.init(data);
    this.depth = 1;
    this.body.setCollideWorldBounds();
  }

  move() {
    this.body.setVelocity(0);

    if (!this.active) {
      return;
    }

    if (this.scene.cursors.left.isDown) {
      this.body.setVelocityX(-this.velocity);
    } else if (this.scene.cursors.right.isDown) {
      this.body.setVelocityX(this.velocity);
    }

    if (this.scene.cursors.up.isDown) {
      this.body.setVelocityY(-this.velocity);
    } else if (this.scene.cursors.down.isDown) {
      this.body.setVelocityY(this.velocity);
    }
  }

  setAlive(status) {
    if (status) {
      return;
    }

    this.timer.paused = true;
    this.emit('killed');
  }

  kill(callback = () => {}) {
    this.body.setCollideWorldBounds(false);
    this.body.enable = false;
    this.setActive(false);

    this.scene.tweens.add({
      targets: this,
      angle: 90,
      y: config.height + this.width,
      duration: 1000,
      onComplete: callback,
    })
  }
}
