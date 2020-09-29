class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, id) {
    super(scene, 0, 0, 'card');
    this.scene = scene;
    this.id = id;
    this.scene.add.existing(this);
    this.setInteractive();
    this.opened = false;
  }

  init(position) {
    this.position = position;
    this.close();
    this.setPosition(-this.width, -this.height);
  }

  move({x, y, delay, callback}) {
    this.scene.tweens.add({
      targets: this,
      x,
      y,
      delay,
      ease: 'Linear',
      duration: 250,
      onComplete: () => {
        if (!callback) {
          return;
        }

        callback();
      }
    });
  }

  flip() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: 'Linear',
      duration: 150,
      onComplete: () => {
        this.show();
      }
    });
  }

  show() {
    this.setTexture(this.opened ? `card${this.id}` : 'card');
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      ease: 'Linear',
      duration: 150,
    });
  }

  open() {
    this.opened = true;
    this.flip();
  }

  close() {
    if (!this.opened) {
      return;
    }

    this.opened = false;
    this.flip();
  }
}
