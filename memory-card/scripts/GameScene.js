class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');

    this.currentLevel = 0;
    this.levelsConfig = [
      { timeout: 15, cards: 2 },
      { timeout: 20, cards: 3 },
      { timeout: 25, cards: 4 },
      { timeout: 30, cards: 5 },
      { timeout: 25, cards: 5 },
      { timeout: 20, cards: 5 },
      { timeout: 15, cards: 5 },
    ];

    this.cardsIdsImageConfig = [1, 2, 3, 4, 5];
  }

  preload() {
    this.load.image('bg', 'sprites/background.png');
    this.load.image('card', 'sprites/card.png');

    this.cardsIdsImageConfig.forEach(id => {
      this.load.image(`card${id}`, `sprites/card${id}.png`);
    });

    this.load.audio('theme', 'sounds/theme.mp3');
    this.load.audio('card', 'sounds/card.mp3');
    this.load.audio('complete', 'sounds/complete.mp3');
    this.load.audio('success', 'sounds/success.mp3');
    this.load.audio('timeout', 'sounds/timeout.mp3');
  }

  createSounds() {
    this.sounds = {
      card: this.sound.add('card'),
      complete: this.sound.add('complete'),
      success: this.sound.add('success'),
      theme: this.sound.add('theme'),
      timeout: this.sound.add('timeout'),
    };

    this.sounds.theme.play({volume: 0.1, loop: true});
  }

  create() {
    this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
    this.createSounds();
    this.createText();
    this.createTimer();
    this.start();
  }

  restart() {
    let count = 0;
    const onCardMoveComplete = () => {
      ++count;
      if (count >= this.cards.length) {
        this.start();
      }
    };

    this.cards.forEach(card => {
      card.move({
        x: this.sys.game.config.width + card.width,
        y: this.sys.game.config.height + card.height,
        delay: card.position.delay,
        callback: onCardMoveComplete
      });
    });
  }

  start() {
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.timeout = this.levelsConfig[this.currentLevel].timeout;
    this.timer.paused = false;
    this.levelText.setText(`Level: ${this.currentLevel + 1}`);

    this.createCards();
    this.initCards();
    this.showCards();
  }

  initCards() {
    const positions = this.getCardsPositions();

    this.cards.forEach(card => {
      card.init(positions.pop());
    })
  }

  showCards() {
    this.cards.forEach(card => {
      card.depth = card.position.delay;
      card.move({
        x: card.position.x,
        y: card.position.y,
        delay: card.position.delay
      });
    });
  }

  createTimer() {
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      callbackScope: this,
      loop: true
    });
  }

  onTimerTick() {
    this.timeoutText.setText(`Time: ${this.timeout}`);
    if (this.timeout <= 0) {
      this.timer.paused = true;
      this.sounds.timeout.play();
      this.restart();
    } else {
      this.timeout--;
    }
  }

  createText() {
    this.timeoutText = this.add.text(10, 330, ``, {
      font: '36px Course',
      fill: '#fff'
    });

    this.levelText = this.add.text(this.sys.game.config.width / 2, 10, `Level ${this.currentLevel + 1}`, {
      font: '40px Course',
      fill: '#000'
    })
  }

  onCardClick(pointer, card) {
    if (card.opened) {
      return;
    }

    this.sounds.card.play();

    if (this.openedCard) {
      if (this.openedCard.id === card.id) {
        this.sounds.success.play();
        this.openedCard = null;
        ++this.openedCardsCount;
      } else {
        this.openedCard.close();
        this.openedCard = card;
      }
    } else {
      this.openedCard = card;
    }

    card.open();

    if (this.openedCardsCount === this.cards.length / 2) {
      this.sounds.complete.play();
      this.currentLevel += 1;

      if (this.currentLevel === this.levelsConfig.length) {
        this.endGame()
        return;
      }

      this.restart();
    }
  }

  endGame() {
    this.timer.paused = true;
  }

  createCards() {
    this.cards = [];
    const cardCount = this.levelsConfig[this.currentLevel].cards;

    [...this.cardsIdsImageConfig].slice(0, cardCount).forEach(id => {
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, id));
      }
    });

    this.input.on('gameobjectdown', this.onCardClick, this);
  }

  getCardsPositions() {
    const positions = [];
    const {width, height} = this.sys.game.config;
    const cardTexture = this.textures.get('card').getSourceImage();

    let cols = this.levelsConfig[this.currentLevel].cards;
    let rows = 2;

    const cardWidth = cardTexture.width + 4;
    const cardHeight = cardTexture.height + 4;

    const offsetX = (width - cardWidth * cols) / 2 + cardWidth / 2;
    const offsetY = (height - cardHeight * rows) / 2 + cardHeight / 2;

    let id = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
          delay: ++id * 75,
        });
      }
    }

    return Phaser.Utils.Array.Shuffle(positions);
  }
}
