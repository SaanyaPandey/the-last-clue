/**
 * THE LAST CLUE — Procedural Audio Engine
 * Pure Web Audio API procedural synthesis for detective atmosphere.
 * Zero external audio files required — 100% reliable and instantaneous.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientGain = null;
    this.fireNode = null;
    this.rainNode = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);
      this.isInitialized = true;
      this.startAmbience();
    } catch {
      // AudioContext could be blocked by browser policy until user interaction
    }
  }

  ensureContext() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(muted ? 0 : 0.18, this.ctx.currentTime, 0.05);
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Continuous background ambient drone: soft crackling hearth and rain
   */
  startAmbience() {
    if (!this.ctx || !this.ambientGain) return;

    // 1. Rain noise generator (filtered white noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const rainBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const rainData = rainBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      rainData[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(this.ambientGain);
    rainSource.start();

    // 2. Fireplace crackle (sporadic filtered clicks)
    const fireBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const fireData = fireBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      if (Math.random() < 0.003) {
        fireData[i] = (Math.random() * 2 - 1) * 0.9;
      } else {
        fireData[i] = (Math.random() * 2 - 1) * 0.03;
      }
    }

    const fireSource = this.ctx.createBufferSource();
    fireSource.buffer = fireBuffer;
    fireSource.loop = true;

    const fireFilter = this.ctx.createBiquadFilter();
    fireFilter.type = 'bandpass';
    fireFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    fireFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const fireGain = this.ctx.createGain();
    fireGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    fireSource.connect(fireFilter);
    fireFilter.connect(fireGain);
    fireGain.connect(this.ambientGain);
    fireSource.start();
  }

  /**
   * Sound effect: Detective footstep on wooden floor
   */
  playFootstep() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    const pitch = 80 + Math.random() * 25;
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  /**
   * Sound effect: Entering close-up object inspection
   */
  playInspect() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.23);
  }

  /**
   * Sound effect: Clue discovery chord (forensic breakthrough)
   */
  playClueFound() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();

    const notes = [293.66, 369.99, 440.0, 587.33]; // D, F#, A, D
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

      const startTime = this.ctx.currentTime + idx * 0.06;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.14, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.25);
    });
  }

  /**
   * Sound effect: Heavy wooden door opening/transitioning
   */
  playDoor() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(75, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.46);
  }
}

export const soundEngine = new SoundEngine();
