import type { NoteColorConfig, AppSettings } from '../types/music';

// Nombres de notas en notación inglesa y solfeo tradicional
export const NOTE_NAMES = [
  { letter: 'C', solfege: 'Do', isBlack: false },
  { letter: 'C#', solfege: 'Do#', isBlack: true },
  { letter: 'D', solfege: 'Re', isBlack: false },
  { letter: 'D#', solfege: 'Re#', isBlack: true },
  { letter: 'E', solfege: 'Mi', isBlack: false },
  { letter: 'F', solfege: 'Fa', isBlack: false },
  { letter: 'F#', solfege: 'Fa#', isBlack: true },
  { letter: 'G', solfege: 'Sol', isBlack: false },
  { letter: 'G#', solfege: 'Sol#', isBlack: true },
  { letter: 'A', solfege: 'La', isBlack: false },
  { letter: 'A#', solfege: 'La#', isBlack: true },
  { letter: 'B', solfege: 'Si', isBlack: false },
];

// Paleta arcoíris estándar de pegatinas infantiles (Chroma-Notes / Boomwhackers)
export const DEFAULT_NOTE_COLORS: NoteColorConfig = {
  0: '#EF4444',  // C / Do: Rojo vivo
  1: '#DC2626',  // C#
  2: '#F97316',  // D / Re: Naranja
  3: '#EA580C',  // D#
  4: '#FACC15',  // E / Mi: Amarillo
  5: '#22C55E',  // F / Fa: Verde
  6: '#16A34A',  // F#
  7: '#06B6D4',  // G / Sol: Cian / Azul celeste
  8: '#0284C7',  // G#
  9: '#6366F1',  // A / La: Azul / Índigo
  10: '#4F46E5', // A#
  11: '#EC4899', // B / Si: Magenta / Rosa
};

export const DEFAULT_SETTINGS: AppSettings = {
  mode: 'wait',             // Por defecto modo 'espera' (ideal para niño de 4 años)
  speed: 0.75,              // Velocidad amigable
  hands: 'right',           // Empezar con mano derecha
  showStaff: false,         // Pentagrama apagado por defecto para no saturar al niño, activable con un botón
  muteInternalAudio: false, // Reproducir audio con sintetizador por defecto
  showNoteNames: true,
  noteColors: { ...DEFAULT_NOTE_COLORS },
  keyRangeStart: 48,        // C3 (Do3)
  keyRangeEnd: 72,          // C5 (Do5) - 2 octavas centradas para teclas grandes
};

export function getNoteDetails(midi: number) {
  const noteClass = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const info = NOTE_NAMES[noteClass];
  return {
    midi,
    noteClass,
    octave,
    letter: info.letter,
    solfege: info.solfege,
    isBlack: info.isBlack,
    name: `${info.letter}${octave}`,
    displayTag: `${info.solfege}\n${info.letter}`,
  };
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
