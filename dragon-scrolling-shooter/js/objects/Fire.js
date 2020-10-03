class Fire extends MovableObject {
  static generate(scene, source) {
    const { x, y, bullet } = source;

    return new Fire({
      scene,
      x,
      y,
      texture: bullet.texture,
      velocity: bullet.velocity,
    });
  }

  isDead() {
    return this.active && (this.x < -this.width || this.x > config.width);
  }
}
