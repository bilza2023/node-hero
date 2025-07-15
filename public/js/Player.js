// public/js/Player.js
export default class Player {
  constructor(soundUrl) {
    // use the global Howl from the UMD build
    this.sound = new Howl({
      src: [soundUrl],
      html5: true
    });
    this._tickCbs    = [];
    this._intervalId = null;

    this.sound.on('play',  () => this._startTickLoop());
    this.sound.on('pause', () => this._clearTickLoop());
    this.sound.on('stop',  () => this._clearTickLoop());
    this.sound.on('end',   () => this._clearTickLoop());
  }

  play()  { this.sound.play();  }
  pause() { this.sound.pause(); }

  onTick(cb, interval = 200) {
    this._tickCbs.push(cb);
    if (this.sound.playing() && !this._intervalId) {
      this._startTickLoop(interval);
    }
  }

  _startTickLoop(interval = 200) {
    this._clearTickLoop();
    this._intervalId = setInterval(() => {
      const t = this.sound.seek();

      // 🔥 New global broadcast for slide modules
      document.dispatchEvent(new CustomEvent('playerTick', {
        detail: { currentTime: t }
      }));

      this._tickCbs.forEach(fn => fn(t));
    }, interval);
  }

  _clearTickLoop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  destroy() {
    this._clearTickLoop();
    this.sound.unload();
  }
}
