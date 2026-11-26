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

// Paleta exacta de las pegatinas del usuario (DOG, RABBIT, MONKEY, FROG, GIRAFFE, LION, BEAR)
export const DEFAULT_NOTE_COLORS: NoteColorConfig = {
  0: '#EF4444',  // C / Do: DOG (Rojo)
  1: '#B91C1C',  // C# (Casa 🏠)
  2: '#F97316',  // D / Re: RABBIT (Naranja)
  3: '#C2410C',  // D# (Casa 🏠)
  4: '#EAB308',  // E / Mi: MONKEY (Amarillo)
  5: '#10B981',  // F / Fa: FROG (Verde)
  6: '#059669',  // F# (Tenedor 🔱)
  7: '#0EA5E9',  // G / Sol: GIRAFFE (Celeste)
  8: '#0284C7',  // G# (Tenedor 🔱)
  9: '#6366F1',  // A / La: LION (Añil / Azul)
  10: '#4338CA', // A# (Tenedor 🔱)
  11: '#A855F7', // B / Si: BEAR (Morado)
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
  keyRangeEnd: 74,          // D5 (Re5) - Incluye hasta Re5 para canciones como Cucú, cucú y Sur le pont d'Avignon
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
