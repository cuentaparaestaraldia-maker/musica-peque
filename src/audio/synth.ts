import { midiToFrequency } from '../config/musicConfig';

interface ActiveVoice {
  oscillators: OscillatorNode[];
  gainNode: GainNode;
  filterNode: BiquadFilterNode;
}

class PianoSynth {
  private ctx: AudioContext | null = null;
  private activeVoices: Map<number, ActiveVoice> = new Map();
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public noteOn(midi: number, velocity: number = 0.8) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Si ya sonaba esa nota, apágala antes de rearmar
    this.noteOff(midi);

    const now = this.ctx.currentTime;
    const freq = midiToFrequency(midi);

    // Oscilador 1: Onda triangular cálida (cuerpo)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // Oscilador 2: Onda senoidal (fundamental pura)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq, now);

    // Oscilador 3: Armónico sutil
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 2, now);

    // Filtro suave paso bajo que simula el macillo del piano
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4 + 800, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(200, freq * 1.5), now + 1.2);

    // Envolvente de ganancia (ADSR de piano)
    const gain = this.ctx.createGain();
    const peakGain = Math.min(0.6, velocity * 0.5);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(peakGain * 0.5, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

    // Conexiones
    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    this.activeVoices.set(midi, {
      oscillators: [osc1, osc2, osc3],
      gainNode: gain,
      filterNode: filter,
    });
  }

  public noteOff(midi: number) {
    const voice = this.activeVoices.get(midi);
    if (!voice || !this.ctx) return;

    const now = this.ctx.currentTime;
    voice.gainNode.gain.cancelScheduledValues(now);
    voice.gainNode.gain.setValueAtTime(voice.gainNode.gain.value, now);
    voice.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    setTimeout(() => {
      voice.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      voice.gainNode.disconnect();
    }, 200);

    this.activeVoices.delete(midi);
  }

  // Sonido de recompensa infantil brillante
  public playSuccessChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [60, 64, 67, 72]; // C4, E4, G4, C5 (Acorde mayor brillante)
    notes.forEach((m, idx) => {
      setTimeout(() => {
        this.noteOn(m, 0.6);
        setTimeout(() => this.noteOff(m), 400);
      }, idx * 70);
    });
  }
}

export const synth = new PianoSynth();
