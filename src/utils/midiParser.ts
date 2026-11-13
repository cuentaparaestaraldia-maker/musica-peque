import { Midi } from '@tonejs/midi';
import type { Song, NoteEvent } from '../types/music';

// Convierte un archivo .mid estándar en una Song de nuestra app
export async function parseMidiFile(file: File): Promise<Song> {
  const arrayBuffer = await file.arrayBuffer();
  const midi = new Midi(arrayBuffer);

  const tempo = midi.header.tempos.length > 0 ? Math.round(midi.header.tempos[0].bpm) : 90;
  const timeSignature: [number, number] = midi.header.timeSignatures.length > 0
    ? [midi.header.timeSignatures[0].timeSignature[0], midi.header.timeSignatures[0].timeSignature[1]]
    : [4, 4];

  const notes: NoteEvent[] = [];
  let noteIndex = 0;

  // Analizar pistas
  midi.tracks.forEach((track, trackIdx) => {
    track.notes.forEach(n => {
      // Si hay 2 pistas principales, la segunda suele ser la mano izquierda; si no, clasificamos por pitch (< 60 = izquierda)
      const hand = (midi.tracks.length > 1 && trackIdx === 1) || n.midi < 60 ? 'left' : 'right';
      
      // Convertir tiempo en segundos a beats: beat = seconds * (BPM / 60)
      const startBeat = n.time * (tempo / 60);
      const durationBeats = n.duration * (tempo / 60);

      notes.push({
        id: `note-${noteIndex++}`,
        midi: n.midi,
        time: parseFloat(startBeat.toFixed(2)),
        duration: Math.max(0.5, parseFloat(durationBeats.toFixed(2))),
        hand,
      });
    });
  });

  // Ordenar notas por tiempo de inicio
  notes.sort((a, b) => a.time - b.time || a.midi - b.midi);

  const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

  return {
    id: `custom-${Date.now()}`,
    title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
    emoji: '🎵',
    tempo,
    timeSignature,
    notes,
    difficulty: notes.length > 60 ? 'medium' : 'easy',
    description: 'Canción importada desde archivo MIDI',
  };
}

// Generador de notas a partir de notación rápida en texto
// Ejemplo: "C4:1 D4:1 E4:1 C4:1"
const NOTE_OFFSET_MAP: Record<string, number> = {
  C: 0, 'C#': 1, Db: 1,
  D: 2, 'D#': 3, Eb: 3,
  E: 4,
  F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8,
  A: 9, 'A#': 10, Bb: 10,
  B: 11
};

export function parseNoteString(noteStr: string, defaultOctave = 4): number {
  const match = noteStr.match(/^([A-Ga-g][#b]?)([0-8])?$/);
  if (!match) return 60;
  const name = match[1].toUpperCase();
  const octave = match[2] !== undefined ? parseInt(match[2], 10) : defaultOctave;
  const offset = NOTE_OFFSET_MAP[name] ?? 0;
  return (octave + 1) * 12 + offset;
}

export function buildSongFromSimpleScore(
  id: string,
  title: string,
  emoji: string,
  tempo: number,
  rightHandScore: string,
  leftHandScore: string = '',
  description?: string
): Song {
  const notes: NoteEvent[] = [];
  let noteIndex = 0;

  function processScore(score: string, hand: 'right' | 'left') {
    let currentTime = 0;
    // Tokens separados por espacios. Formato: Nota:Duracion o [Nota1,Nota2]:Duracion o R:Duracion (Silencio/Rest)
    const tokens = score.trim().split(/\s+/);
    for (const token of tokens) {
      if (!token || token === '|') continue;
      const [pitchPart, durPart] = token.split(':');
      const duration = durPart ? parseFloat(durPart) : 1;

      if (pitchPart.toUpperCase() === 'R' || pitchPart.toUpperCase() === '-') {
        // Silencio
        currentTime += duration;
        continue;
      }

      // Si es un acorde [C4,E4,G4]
      if (pitchPart.startsWith('[') && pitchPart.endsWith(']')) {
        const chordNotes = pitchPart.slice(1, -1).split(',');
        chordNotes.forEach(cn => {
          notes.push({
            id: `note-${noteIndex++}`,
            midi: parseNoteString(cn),
            time: currentTime,
            duration,
            hand,
          });
        });
      } else {
        notes.push({
          id: `note-${noteIndex++}`,
          midi: parseNoteString(pitchPart),
          time: currentTime,
          duration,
          hand,
        });
      }
      currentTime += duration;
    }
  }

  processScore(rightHandScore, 'right');
  if (leftHandScore) {
    processScore(leftHandScore, 'left');
  }

  notes.sort((a, b) => a.time - b.time || a.midi - b.midi);

  return {
    id,
    title,
    emoji,
    tempo,
    timeSignature: [4, 4],
    notes,
    difficulty: leftHandScore ? 'medium' : 'easy',
    description,
  };
}
