// Declaraciones globales para Web MIDI API si no están presentes en lib.dom.d.ts
interface MIDIMessageEvent extends Event {
  readonly data: Uint8Array;
}

interface MIDIPort extends EventTarget {
  readonly id: string;
  readonly manufacturer?: string;
  readonly name?: string;
  readonly type: 'input' | 'output';
  readonly version?: string;
  readonly state: 'disconnected' | 'connected';
  readonly connection: 'open' | 'closed' | 'pending';
  onstatechange: ((event: Event) => void) | null;
  open(): Promise<MIDIPort>;
  close(): Promise<MIDIPort>;
}

interface MIDIInput extends MIDIPort {
  onmidimessage: ((event: MIDIMessageEvent) => void) | null;
}

interface MIDIAccess extends EventTarget {
  readonly inputs: Map<string, MIDIInput>;
  readonly outputs: Map<string, MIDIPort>;
  onstatechange: ((event: Event) => void) | null;
  readonly sysexEnabled: boolean;
}

interface Navigator {
  requestMIDIAccess?(options?: { sysex?: boolean; software?: boolean }): Promise<MIDIAccess>;
}
