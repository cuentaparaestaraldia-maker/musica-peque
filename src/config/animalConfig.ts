export interface AnimalInfo {
  noteClass: number;      // 0 = C, 2 = D, 4 = E, 5 = F, 7 = G, 9 = A, 11 = B
  midiDefault: number;    // MIDI central (60, 62, 64, 65, 67, 69, 71)
  name: string;           // 'DOG', 'RABBIT', etc.
  solfege: string;        // 'DO', 'RE', 'MI', etc.
  letter: string;         // 'C', 'D', 'E', etc.
  emoji: string;          // Icono representativo
  color: string;          // Color exacto de la plantilla
  bgLight: string;        // Fondo suave
  phrase: string;         // Frase para el peque
  hint: string;           // Pista visual o mnemotécnica
  soundType: 'bark' | 'boing' | 'chimp' | 'croak' | 'sparkle' | 'roar' | 'growl';
}

export const ANIMAL_NOTES: AnimalInfo[] = [
  {
    noteClass: 0,
    midiDefault: 60, // C4
    name: 'DOG',
    solfege: 'DO',
    letter: 'C',
    emoji: '🐶',
    color: '#EF4444',
    bgLight: '#FEE2E2',
    phrase: '¡El perrito dice GUAU!',
    hint: 'A la izquierda de la Casita 🏠',
    soundType: 'bark',
  },
  {
    noteClass: 2,
    midiDefault: 62, // D4
    name: 'RABBIT',
    solfege: 'RE',
    letter: 'D',
    emoji: '🐰',
    color: '#F97316',
    bgLight: '#FFEDD5',
    phrase: '¡El conejo salta BOING!',
    hint: 'En medio de la Casita 🏠',
    soundType: 'boing',
  },
  {
    noteClass: 4,
    midiDefault: 64, // E4
    name: 'MONKEY',
    solfege: 'MI',
    letter: 'E',
    emoji: '🐵',
    color: '#EAB308',
    bgLight: '#FEF9C3',
    phrase: '¡El mono come plátanos UH UH!',
    hint: 'A la derecha de la Casita 🏠',
    soundType: 'chimp',
  },
  {
    noteClass: 5,
    midiDefault: 65, // F4
    name: 'FROG',
    solfege: 'FA',
    letter: 'F',
    emoji: '🐸',
    color: '#10B981',
    bgLight: '#D1FAE5',
    phrase: '¡La rana en el agua CROAC!',
    hint: 'A la izquierda del Tenedor 🔱',
    soundType: 'croak',
  },
  {
    noteClass: 7,
    midiDefault: 67, // G4
    name: 'GIRAFFE',
    solfege: 'SOL',
    letter: 'G',
    emoji: '🦒',
    color: '#0EA5E9',
    bgLight: '#E0F2FE',
    phrase: '¡La jirafa con cuello alto!',
    hint: 'En el primer diente del Tenedor 🔱',
    soundType: 'sparkle',
  },
  {
    noteClass: 9,
    midiDefault: 69, // A4
    name: 'LION',
    solfege: 'LA',
    letter: 'A',
    emoji: '🦁',
    color: '#6366F1',
    bgLight: '#EEF2FF',
    phrase: '¡El león ruge ROAAAR!',
    hint: 'En el segundo diente del Tenedor 🔱',
    soundType: 'roar',
  },
  {
    noteClass: 11,
    midiDefault: 71, // B4
    name: 'BEAR',
    solfege: 'SI',
    letter: 'B',
    emoji: '🐻',
    color: '#A855F7',
    bgLight: '#F3E8FF',
    phrase: '¡El oso busca miel GRRR!',
    hint: 'A la derecha del Tenedor 🔱',
    soundType: 'growl',
  },
];

export interface BlackKeyGroup {
  type: 'house' | 'fork';
  name: string;
  emoji: string;
  count: number;
}

export function getAnimalForMidi(midi: number): AnimalInfo | null {
  const noteClass = ((midi % 12) + 12) % 12;
  return ANIMAL_NOTES.find(a => a.noteClass === noteClass) || null;
}

export function getBlackKeyInfo(midi: number): { type: 'house' | 'fork'; name: string; emoji: string; label: string } | null {
  const noteClass = ((midi % 12) + 12) % 12;
  if (noteClass === 1) return { type: 'house', name: 'HOUSE', emoji: '🏠', label: 'C# / Db' };
  if (noteClass === 3) return { type: 'house', name: 'HOUSE', emoji: '🏠', label: 'D# / Eb' };
  if (noteClass === 6) return { type: 'fork', name: 'FORK', emoji: '🔱', label: 'F# / Gb' };
  if (noteClass === 8) return { type: 'fork', name: 'FORK', emoji: '🔱', label: 'G# / Ab' };
  if (noteClass === 10) return { type: 'fork', name: 'FORK', emoji: '🔱', label: 'A# / Bb' };
  return null;
}
