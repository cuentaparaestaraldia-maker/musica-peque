export type HandType = 'right' | 'left';

export interface NoteEvent {
  id: string;
  midi: number;          // MIDI pitch (60 = C4 Middle C)
  time: number;          // Start time in beats (1 beat = quarter note)
  duration: number;      // Duration in beats
  hand: HandType;        // 'right' (melody) or 'left' (bass/harmony)
  played?: boolean;      // Successfully triggered
  isCurrent?: boolean;   // Active at target line in wait mode
}

export interface Song {
  id: string;
  title: string;
  emoji: string;
  tempo: number;         // Beats per minute (e.g. 80)
  timeSignature: [number, number]; // [4, 4]
  notes: NoteEvent[];
  difficulty: 'easy' | 'medium' | 'fun';
  description?: string;
}

export type PlayMode = 'wait' | 'flow'; // 'wait' pauses until the child presses the note; 'flow' plays continuously
export type HandsFilter = 'right' | 'both' | 'left';

export interface NoteColorConfig {
  [noteClass: number]: string; // 0: C, 1: C#, 2: D, 3: D#, 4: E, 5: F, 6: F#, 7: G, 8: G#, 9: A, 10: A#, 11: B
}

export interface AppSettings {
  mode: PlayMode;
  speed: number;             // Multiplier, e.g. 0.5, 0.75, 1.0
  hands: HandsFilter;
  showStaff: boolean;        // Show sheet music / pentagram
  muteInternalAudio: boolean;// Silence laptop synth if Casio Privia is already making sound
  showNoteNames: boolean;    // Show "Do / C", etc.
  noteColors: NoteColorConfig;
  keyRangeStart: number;     // e.g. 48 (C3)
  keyRangeEnd: number;       // e.g. 72 (C5) or 84 (C6)
}

export interface MidiDeviceInfo {
  id: string;
  name: string;
  manufacturer?: string;
  state: 'connected' | 'disconnected';
}
