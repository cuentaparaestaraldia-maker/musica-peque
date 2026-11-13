import type { Song } from '../types/music';
import { buildSongFromSimpleScore } from '../utils/midiParser';

export const INITIAL_SONGS: Song[] = [
  buildSongFromSimpleScore(
    'estrellita',
    'Estrellita ¿Dónde Estás?',
    '⭐',
    75,
    'C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2 G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2 G4:1 G4:1 F4:1 F4:1 E4:1 E4:1 D4:2 C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2',
    'C3:2 E3:2 F3:2 C3:2 F3:2 C3:2 G3:2 C3:2 C3:2 F3:2 C3:2 G3:2 C3:2 F3:2 C3:2 G3:2 C3:2 E3:2 F3:2 C3:2 F3:2 C3:2 G3:2 C3:2',
    'La canción favorita para empezar, notas claras y fáciles'
  ),

  buildSongFromSimpleScore(
    'los-pollitos',
    'Los Pollitos Dicen',
    '🐥',
    80,
    'C4:1 D4:1 E4:1 F4:1 G4:1 G4:1 G4:2 A4:1 A4:1 A4:1 A4:1 G4:2 G4:2 F4:1 F4:1 F4:1 F4:1 E4:2 E4:2 D4:1 D4:1 D4:1 D4:1 C4:2 C4:2',
    'C3:2 G3:2 C3:2 C3:2 F3:2 F3:2 C3:2 C3:2 G3:2 G3:2 C3:2 C3:2 G3:2 G3:2 C3:2 C3:2',
    'Pio, pio, pio... una escala divertida paso a paso'
  ),

  buildSongFromSimpleScore(
    'cumpleanos',
    'Cumpleaños Feliz',
    '🎂',
    75,
    'C4:0.75 C4:0.25 D4:1 C4:1 F4:1 E4:2 C4:0.75 C4:0.25 D4:1 C4:1 G4:1 F4:2 C4:0.75 C4:0.25 C5:1 A4:1 F4:1 E4:1 D4:2 Bb4:0.75 Bb4:0.25 A4:1 F4:1 G4:1 F4:2',
    'C3:2 C3:2 F3:2 F3:2 C3:2 C3:2 G3:2 F3:2 F3:2 F3:2 Bb3:2 Bb3:2 C3:2 C3:2 F3:2 F3:2',
    '¡Para tocar en todas las fiestas de la familia!'
  ),

  buildSongFromSimpleScore(
    'vaca-lola',
    'La Vaca Lola',
    '🐮',
    85,
    'G4:1 G4:1 E4:1 G4:1 G4:1 E4:2 G4:1 G4:1 A4:1 G4:1 F4:1 E4:1 D4:2 F4:1 F4:1 D4:1 F4:1 F4:1 D4:2 F4:1 F4:1 G4:1 F4:1 E4:1 D4:1 C4:2',
    'C3:2 C3:2 C3:2 C3:2 G3:2 G3:2 G3:2 G3:2 G3:2 G3:2 G3:2 G3:2 C3:2 C3:2 C3:2 C3:2',
    'Tiene cabeza y tiene cola, ¡y hace muuu!'
  ),

  buildSongFromSimpleScore(
    'oda-alegria',
    'Himno a la Alegría',
    '☀️',
    78,
    'E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 E4:1.5 D4:0.5 D4:2 E4:1 E4:1 F4:1 G4:1 G4:1 F4:1 E4:1 D4:1 C4:1 C4:1 D4:1 E4:1 D4:1.5 C4:0.5 C4:2',
    'C3:2 G3:2 C3:2 G3:2 C3:2 C3:2 G3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 G3:2 C3:2 C3:2',
    'Beethoven adaptado para pequeños pianistas'
  ),

  buildSongFromSimpleScore(
    'frere-jacques',
    'Campanita (Frère Jacques)',
    '🔔',
    85,
    'C4:1 D4:1 E4:1 C4:1 C4:1 D4:1 E4:1 C4:1 E4:1 F4:1 G4:2 E4:1 F4:1 G4:2 G4:0.5 A4:0.5 G4:0.5 F4:0.5 E4:1 C4:1 G4:0.5 A4:0.5 G4:0.5 F4:0.5 E4:1 C4:1 C4:1 G3:1 C4:2 C4:1 G3:1 C4:2',
    'C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2',
    'Din don dan, las campanas suenan alegres'
  ),

  buildSongFromSimpleScore(
    'elefante',
    'Un Elefante se Balanceaba',
    '🐘',
    80,
    'C4:1 E4:1 G4:1 G4:1 A4:1 G4:1 E4:2 F4:1 F4:1 F4:1 A4:1 G4:1 E4:1 C4:2 D4:1 D4:1 D4:1 F4:1 E4:1 C4:1 C4:2',
    'C3:2 C3:2 F3:2 C3:2 F3:2 C3:2 G3:2 C3:2 G3:2 C3:2',
    'Sobre la tela de una araña'
  ),

  buildSongFromSimpleScore(
    'cucu-rana',
    'Cucú Cantaba la Rana',
    '🐸',
    82,
    'G4:1 E4:1 G4:1 E4:1 G4:1 G4:1 E4:2 G4:1 E4:1 G4:1 E4:1 G4:1 G4:1 E4:2 A4:1 A4:1 G4:1 G4:1 F4:1 F4:1 E4:2 D4:1 D4:1 C4:2',
    'C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 F3:2 C3:2 G3:2 C3:2',
    'Cucú cantaba la rana debajo del agua'
  ),
];
