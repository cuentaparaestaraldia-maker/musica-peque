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
      this.ctx.resume().catch(() => {});
    }
  }

  public async resume(): Promise<void> {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('AudioContext resume warning:', e);
      }
    }
  }

  public isSuspended(): boolean {
    return !this.ctx || this.ctx.state === 'suspended';
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

  // Sonidos divertidos sintetizados para cada animalito
  public playAnimalSound(type: 'bark' | 'boing' | 'chimp' | 'croak' | 'sparkle' | 'roar' | 'growl') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (type === 'bark') {
      // Ladrido perrito Dog (Do)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'boing') {
      // Salto conejo Rabbit (Re)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'chimp') {
      // Risita mono Monkey (Mi)
      [0, 0.1].forEach(delay => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now + delay);
        osc.frequency.exponentialRampToValueAtTime(900, now + delay + 0.08);
        gain.gain.setValueAtTime(0.25, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.09);
      });
    } else if (type === 'croak') {
      // Croar rana Frog (Fa)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(350, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'sparkle') {
      // Campana jirafa Giraffe (Sol)
      [784, 988, 1175].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.25, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } else if (type === 'roar') {
      // Rugido amigable León Lion (La)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(240, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'growl') {
      // Oso Bear (Si)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  }

  // Silbato de tren para el juego de escalas ("¡Pi-Piiii!")
  public playTrainWhistle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [0, 0.22].forEach(delay => {
      if (!this.ctx) return;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.frequency.setValueAtTime(587, now + delay); // D5
      osc2.frequency.setValueAtTime(740, now + delay); // F#5
      gain.gain.setValueAtTime(0.2, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.18);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(now + delay);
      osc2.start(now + delay);
      osc1.stop(now + delay + 0.18);
      osc2.stop(now + delay + 0.18);
    });
  }
}

export const synth = new PianoSynth();
