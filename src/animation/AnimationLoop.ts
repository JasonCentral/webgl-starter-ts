class AnimationLoop {
  private timer: Timer;

  constructor() {
    this.timer = new Timer();
  }

  requestAnimationFrame(callback: FrameRequestCallback) {
    return requestAnimationFrame((time) => {
      this.timer.updateTime();
      callback(time);
    });
  }

  get deltaTime() {
    return this.timer.deltaTime;
  }
}

class Timer {
  private lastTime: number;
  private currentTime: number;

  constructor() {
    this.lastTime = this.currentTime = performance.now();
  }

  get deltaTime() {
    return (this.currentTime - this.lastTime) / 1000;
  }

  updateTime() {
    this.lastTime = this.currentTime;
    this.currentTime = performance.now();
  }
}

export default AnimationLoop;
