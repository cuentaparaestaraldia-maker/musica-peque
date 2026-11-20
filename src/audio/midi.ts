import type { MidiDeviceInfo } from '../types/music';

type NoteCallback = (midi: number, velocity: number) => void;
type NoteOffCallback = (midi: number) => void;
type DevicesCallback = (devices: MidiDeviceInfo[]) => void;

class MidiManager {
  private midiAccess: MIDIAccess | null = null;
  private onNoteOnListeners: Set<NoteCallback> = new Set();
  private onNoteOffListeners: Set<NoteOffCallback> = new Set();
  private onDevicesListeners: Set<DevicesCallback> = new Set();
  private isSupported: boolean = false;
  private lastError: string | null = null;

  constructor() {
    this.isSupported = typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator;
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public getLastError(): string | null {
    return this.lastError;
  }

  public async init(): Promise<{ success: boolean; error?: string }> {
    if (!this.isSupported || !navigator.requestMIDIAccess) {
      this.lastError = 'Web MIDI API no soportada en este navegador.';
      return { success: false, error: this.lastError };
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      this.lastError = null;
      this.midiAccess.onstatechange = () => {
        this.notifyDeviceChange();
        this.bindInputs();
      };
      this.bindInputs();
      this.notifyDeviceChange();
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.lastError = errorMsg;
      console.warn('Aviso al solicitar Web MIDI (normal si falta interacción del usuario):', err);
      return { success: false, error: errorMsg };
    }
  }

  private bindInputs() {
    if (!this.midiAccess) return;

    for (const input of this.midiAccess.inputs.values()) {
      input.onmidimessage = (event: MIDIMessageEvent) => {
        this.handleMidiMessage(event);
      };
    }
  }

  private handleMidiMessage(event: MIDIMessageEvent) {
    if (!event.data || event.data.length < 2) return;
    const statusByte = event.data[0];
    const noteNumber = event.data[1];
    const velocity = event.data[2] ?? 0;
    const command = statusByte >> 4;
    // 9 = Note On, 8 = Note Off
    if (command === 9) {
      if (velocity > 0) {
        this.onNoteOnListeners.forEach(cb => cb(noteNumber, velocity / 127));
      } else {
        this.onNoteOffListeners.forEach(cb => cb(noteNumber));
      }
    } else if (command === 8) {
      this.onNoteOffListeners.forEach(cb => cb(noteNumber));
    }
  }

  public getDevices(): MidiDeviceInfo[] {
    if (!this.midiAccess) return [];
    const list: MidiDeviceInfo[] = [];
    for (const input of this.midiAccess.inputs.values()) {
      list.push({
        id: input.id,
        name: input.name || 'Dispositivo MIDI USB',
        manufacturer: input.manufacturer || 'Desconocido',
        state: (input.state as 'connected' | 'disconnected') || 'connected',
      });
    }
    return list;
  }

  private notifyDeviceChange() {
    const devices = this.getDevices();
    this.onDevicesListeners.forEach(cb => cb(devices));
  }

  public onNoteOn(callback: NoteCallback): () => void {
    this.onNoteOnListeners.add(callback);
    return () => this.onNoteOnListeners.delete(callback);
  }

  public onNoteOff(callback: NoteOffCallback): () => void {
    this.onNoteOffListeners.add(callback);
    return () => this.onNoteOffListeners.delete(callback);
  }

  public onDevicesChange(callback: DevicesCallback): () => void {
    this.onDevicesListeners.add(callback);
    callback(this.getDevices());
    return () => this.onDevicesListeners.delete(callback);
  }
}

export const midiManager = new MidiManager();
