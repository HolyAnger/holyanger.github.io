class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.score = 0;
    this.wave = 0;
    this.enemyWavesCount = [5, 10, 15, 20, 25];
  }

  createScore() {
    this.scoreText = this.add.text(50, 50, `Score: ${this.score}`, {
      font: '40px CurseCasual'
    }).setOrigin(0);
  }

  createWaveText() {
    this.waveText = this.add.text(config.width / 2, (config.height / 2) - config.height / 4, `Wave ${this.wave + 1}`, {
      font: '100px CurseCasual',
      color: '#00736e'
    }).setOrigin(0.5).setScale(0);
  }

  create() {
    this.bg = this.add.tileSprite(0, 0, config.width, config.height, 'bg').setOrigin(0);
    if (!this.sounds) {
      this.createSounds();
    }

    this.player = new Player(this);
    this.enemies = new Enemies(this, this.enemyWavesCount[this.wave]);
    this.createCompleteEvents();
    this.addOverlap();
    this.createScore();
    this.createWaveText();
    this.showWave();
  }

  showWave() {
    this.tweens.add({
      targets: this.waveText,
      scale: 1,
      ease: 'Linear',
      duration: 500,
      completeDelay: 1000,
      onComplete: () => {
        this.hideWave();
      }
    });
  }

  hideWave() {
    this.tweens.add({
      targets: this.waveText,
      scale: 0,
      ease: 'Linear',
      duration: 500,
      onComplete: () => {
        this.enemies.runWave();
      }
    });
  }

  startNewWave() {
    this.enemies.generateWave(this.enemyWavesCount[this.wave]);
    this.waveText.setText(`Wave ${this.wave + 1}`);
    this.showWave();
  }

  createSounds() {
    this.sounds = {
      boom: this.sound.add('boom', {volume: 0.1}),
      theme: this.sound.add('theme', {loop: true, volume: 0.5}),
      die: this.sound.add('die')
    }

    this.sounds.theme.play();
  }

  createCompleteEvents() {
    this.player.once('killed', this.onPlayerKilled, this);
    this.events.on('enemies-killed', this.onEnemiesKilled, this);
  }

  onPlayerKilled() {
    this.sounds.die.play();
    this.player.kill(() => this.onComplete());
  }

  onEnemiesKilled() {
    this.wave++;
    if (this.wave === this.enemyWavesCount.length - 1) {
      this.onComplete();
      return;
    }

    this.startNewWave();
  }

  onComplete() {
    this.events.off('enemies-killed', this.onEnemiesKilled, this);
    this.scene.start('Start', {
      score: this.score,
      completed: this.player.active,
    });
  }

  addOverlap(){
    this.physics.add.overlap(this.player.fires, this.enemies, this.onOverlap, undefined, this);
    this.physics.add.overlap(this.enemies.fires, this.player, this.onOverlap, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.onOverlap, undefined, this);
  }

  onOverlap(source, target) {
    const enemy = [source, target].find(item => item.texture.key === 'enemy');
    if (enemy) {
      this.score++;
      this.scoreText.setText(`Score: ${this.score}`);
      Boom.generate(this, enemy.x, enemy.y);
      this.sounds.boom.play();
    }

    source.setAlive(false);
    target.setAlive(false);
  }

  update() {
    this.bg.tilePositionX += 0.5;
    this.player.move();
  }
}
