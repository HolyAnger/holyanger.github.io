class LoadingBar {
  constructor(scene) {
    this.scene = scene;
    this.style = {
      boxColor: 0xD3DD3D3,
      barColor: 0xFFF8DC,
      x: config.width / 2 - 450,
      y: config.height / 2 + 250,
      width: 900,
      height: 25,
    };

    this.progressBox = this.scene.add.graphics();
    this.progressBar = this.scene.add.graphics();

    this.showProgressBox();
    this.setEvents();
  }

  setEvents() {
    this.scene.load.on('progress', this.showProgressBar, this);
    this.scene.load.on('fileprogress', this.onFileProgress, this);
    this.scene.load.on('complete', this.onComplete, this);
  }

  onFileProgress(file) {

  }

  onComplete() {
    this.progressBox.destroy();
    this.progressBar.destroy();
  }

  showProgressBar(value) {
    const { barColor, x, y, width, height } = this.style;
    this.progressBar.clear().fillStyle(barColor).fillRect(x, y, width * value, height);
  }

  showProgressBox() {
    const { boxColor, x, y, width, height } = this.style;
    this.progressBox.fillStyle(boxColor).fillRect(x, y, width, height);
  }
}
