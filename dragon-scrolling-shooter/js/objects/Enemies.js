class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(scene, enemiesCount = 10) {
    super(scene.physics.world, scene);
    this.scene = scene;

    this.generateWave(enemiesCount);
  }

  generateWave(count) {
    this.countMax = count;
    this.countCreated = 0;
    this.countKilled = 0;
    this.fires = new Fires(this.scene);
  }

  runWave() {
    this.timer = this.scene.time.addEvent({
      delay: 2000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true
    });
  }

  onTimerTick() {
    if (this.countCreated < this.countMax) {
      this.createEnemy();
      return;
    }

    this.timer.remove();
  }

  onEnemyKilled() {
    this.countKilled += 1;
    if (this.countKilled === this.countMax) {
      this.scene.events.emit('enemies-killed');
    }
  }

  createEnemy() {
    let enemy = this.getFirstDead();
    if (!enemy) {
      enemy = Enemy.generate(this.scene, this.fires);
      enemy.on('killed', this.onEnemyKilled, this);
      this.add(enemy);
    } else {
      enemy.reset();
    }

    this.countCreated += 1;

    enemy.move();
  }
}
