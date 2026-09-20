/**
 * =========================================================================
 * ROMANTIC AUDIO ENGINE (Supports Custom MP3 Track: Wegz & Ash - Amira)
 * =========================================================================
 */

class RomanticAudioManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.ambientInterval = null;
    this.masterGain = null;
    this.audioElement = null;

    // Lofi chord fallback (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
    this.chords = [
      [174.61, 220.00, 261.63, 329.63],
      [164.81, 196.00, 246.94, 293.66],
      [146.83, 174.61, 220.00, 261.63],
      [130.81, 164.81, 196.00, 246.94]
    ];
    this.chordIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  start() {
    this.init();
    this.isPlaying = true;

    const sources = window.STORY_CONFIG?.audio?.sources || [
      'assets/amira.mp3',
      'amira.mp3',
      'assets/music.mp3',
      'music.mp3',
      'Wegz X @ashmusicofficial  - Amira (Official Audio) _ ويجز و آش - أميره.mp3'
    ];

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.volume = 0.65;

      let srcIdx = 0;
      const tryPlaySource = () => {
        if (srcIdx < sources.length) {
          const nextSrc = sources[srcIdx++];
          this.audioElement.src = nextSrc;
          this.audioElement.play().catch(() => {
            tryPlaySource();
          });
        } else {
          // Fallback to warm procedural ambient chords
          this.startProceduralAmbient();
        }
      };
      tryPlaySource();
    } else {
      this.audioElement.play().catch(() => this.startProceduralAmbient());
    }
  }

  startProceduralAmbient() {
    if (this.ambientInterval) return;
    this.playNextChord();
    this.ambientInterval = setInterval(() => {
      this.playNextChord();
    }, 4500);
  }

  stop() {
    this.isPlaying = false;
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  playNextChord() {
    if (!this.isPlaying || !this.ctx) return;
    const chord = this.chords[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.045 / (idx + 1), now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 4.5);
    });
  }

  playCorrectSound() {
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const time = this.ctx.currentTime + (i * 0.08);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + 0.65);
    });
  }

  playWrongSound() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playBloomSound() {
    this.init();
    if (!this.ctx) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const time = this.ctx.currentTime + (i * 0.15);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.08, time + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(time);
      osc.stop(time + 1.3);
    });
  }

  playSealSound() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

window.romanticAudio = new RomanticAudioManager();
