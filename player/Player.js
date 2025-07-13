import { Howl } from 'howler';

export default class Player {
  constructor(soundUrl) {
    this.sound = new Howl({
      src: [soundUrl],
      html5: true
    });
    this._tickCbs = [];
    this._intervalId = null;

    this.sound.on('play', () => this._startTickLoop());
    this.sound.on('pause', () => this._clearTickLoop());
    this.sound.on('stop', () => this._clearTickLoop());
    this.sound.on('end', () => this._clearTickLoop());
  }

  play() {
    this.sound.play();
  }

  pause() {
    this.sound.pause();
  }

  onTick(cb, interval = 200) {
    this._tickCbs.push(cb);
    if (this.sound.playing() && !this._intervalId) {
      this._startTickLoop(interval);
    }
  }

  _startTickLoop(interval = 200) {
    this._clearTickLoop();
    this._intervalId = setInterval(() => {
      const currentTime = this.sound.seek();
      this._tickCbs.forEach(fn => fn(currentTime));
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
