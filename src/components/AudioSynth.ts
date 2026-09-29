// Web Audio API Sound Synthesizer for High-Tech HUD Feedback

class HudAudioSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.initCtx();
      this.playBeep(880, 'sine', 0.08, 0.1);
    }
    return this.enabled;
  }

  public playBeep(freq = 1200, type: OscillatorType = 'sine', duration = 0.05, vol = 0.08) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context error ignore
    }
  }

  public playTargetLock() {
    if (!this.enabled) return;
    this.playBeep(1800, 'triangle', 0.04, 0.1);
    setTimeout(() => this.playBeep(2400, 'sine', 0.08, 0.15), 50);
  }

  public playAlert() {
    if (!this.enabled) return;
    this.playBeep(440, 'sawtooth', 0.1, 0.12);
    setTimeout(() => this.playBeep(880, 'sawtooth', 0.15, 0.12), 100);
  }
}

export const hudAudio = new HudAudioSynthesizer();
