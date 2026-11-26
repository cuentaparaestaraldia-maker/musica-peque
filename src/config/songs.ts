import type { Song } from '../types/music';
import { buildSongFromSimpleScore } from '../utils/midiParser';

export const INITIAL_SONGS: Song[] = [
  buildSongFromSimpleScore(
    'cucu-cucu',
    'Cucú, cucú (El Pajarito)',
    '🐦',
    84,
    'D5:1 B4:1 R:1 D5:1 B4:1 R:1 A4:1 G4:1 A4:1 B4:2 R:1 A4:1 A4:1 B4:1 C5:2 A4:1 B4:1 B4:1 C5:1 D5:2 B4:1 D5:2 B4:1 D5:2 B4:1 A4:1 B4:1 A4:1 G4:2 R:1',
    'G3:3 G3:3 D3:3 G3:3 D3:3 D3:3 G3:3 G3:3 G3:3 G3:3 D3:3 G3:3',
    'Vals en Sol Mayor (3/4) • Acordes de 1 dedo: Sol (G) y Re (D7)'
  ),

  buildSongFromSimpleScore(
    'la-vela',
    'La Vela (Velita Pequeña)',
    '🕯️',
    76,
    'C5:1 C5:2 A4:1 C5:1 C5:2 A4:2 C5:1 C5:1 A4:1 C5:1 C5:2 A4:1 A4:0.5 A4:0.5 B4:1 B4:1 B4:1 G4:0.5 A4:0.5 B4:1 B4:1 B4:1 G4:0.5 A4:0.5 B4:1 A4:0.5 A4:0.5 B4:0.5 Bb4:0.5 B4:1 A4:1 C5:2 A4:2',
    'R:1 F3:4 F3:4 F3:4 F3:4 F3:4 F3:4 F3:2 Bb3:2 F3:4',
    'Melodía de Hamburgo con Si y Sib (🔱) • Acordes de 1 dedo: Fa (F) y Sib (Bb)'
  ),

  buildSongFromSimpleScore(
    'london-bridge',
    'London Bridge (Un Puente en Londres)',
    '🌉',
    82,
    'G4:1.5 A4:0.5 G4:1 F4:1 E4:1 F4:1 G4:2 D4:1 E4:1 F4:2 E4:1 F4:1 G4:2 G4:1.5 A4:0.5 G4:1 F4:1 E4:1 F4:1 G4:2 D4:2 G4:2 E4:1 C4:3',
    'C3:4 C3:4 G3:4 C3:4 C3:4 C3:4 D3:2 G3:2 C3:4',
    'Clásico en Do Mayor • Acordes de 1 dedo: Do (C), Sol (G7) y Re (Dm)'
  ),

  buildSongFromSimpleScore(
    'sur-le-pont',
    "Sur le pont d'Avignon",
    '💃',
    80,
    'G4:0.5 G4:0.5 G4:1 A4:0.5 A4:0.5 A4:1 B4:0.5 C5:0.5 D5:0.5 G4:0.5 F#4:0.5 G4:0.5 A4:0.5 D4:0.5 G4:0.5 G4:0.5 G4:1 A4:0.5 A4:0.5 A4:1 B4:0.5 C5:0.5 D5:0.5 G4:0.5 A4:0.5 F#4:0.5 G4:1 G4:0.5 F#4:0.5 G4:0.5 G4:0.5 G4:0.5 A4:1 G4:0.5 F#4:0.5 G4:0.5 F#4:0.5 G4:0.5 G4:0.5 A4:1 G4:1',
    'G3:2 D3:2 G3:2 D3:2 G3:2 D3:2 G3:2 D3:1 G3:1 G3:2 D3:1 G3:1 G3:2 D3:1 G3:1',
    'Danza francesa en Sol Mayor con Fa# (🔱) • Acordes de 1 dedo: Sol (G) y Re (D)'
  ),

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
    'Pío, pío, pío... una escala divertida paso a paso'
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

  buildSongFromSimpleScore(
    'debajo-boton',
    'Debajo de un Botón',
    '🔘',
    86,
    'C4:1 E4:1 G4:1 G4:1 A4:1 G4:1 E4:2 F4:1 F4:1 D4:1 D4:1 E4:1 C4:1 G4:2 C4:1 E4:1 G4:1 G4:1 A4:1 G4:1 E4:2 F4:1 D4:1 E4:1 C4:1 D4:1 B3:1 C4:2',
    'C3:2 C3:2 F3:2 C3:2 G3:2 G3:2 C3:2 G3:2 C3:2 C3:2 F3:2 C3:2 G3:2 G3:2 C3:2',
    'Que encontró Martín, ¡tin, tin, tin!'
  ),

  buildSongFromSimpleScore(
    'susanita-raton',
    'Susanita Tiene un Ratón',
    '🐭',
    90,
    'G4:1 E4:1 E4:1 E4:1 F4:1 D4:1 D4:2 G4:1 F4:1 E4:1 D4:1 E4:1 C4:1 C4:2 G4:1 E4:1 E4:1 E4:1 F4:1 D4:1 D4:2 G4:1 F4:1 E4:1 D4:1 C4:2',
    'C3:2 C3:2 G3:2 G3:2 G3:2 G3:2 C3:2 C3:2 C3:2 C3:2 G3:2 G3:2 G3:2 C3:2',
    'Un ratón chiquitín que come chocolate y turrón'
  ),

  buildSongFromSimpleScore(
    'patio-mi-casa',
    'El Patio de Mi Casa',
    '🏡',
    84,
    'C4:1 E4:1 G4:1 G4:1 G4:1 A4:1 G4:2 F4:1 D4:1 F4:1 F4:1 E4:1 C4:1 E4:2 C4:1 E4:1 G4:1 G4:1 G4:1 A4:1 G4:2 F4:1 E4:1 D4:1 D4:1 C4:2',
    'C3:2 C3:2 C3:2 C3:2 G3:2 G3:2 C3:2 C3:2 C3:2 C3:2 C3:2 C3:2 G3:2 C3:2',
    'Cuando llueve se moja como los demás'
  ),

  buildSongFromSimpleScore(
    'vaca-lechera',
    'Tengo una Vaca Lechera',
    '🥛',
    88,
    'C4:1 E4:1 G4:1 G4:1 E4:1 G4:1 A4:2 G4:1 F4:1 E4:1 D4:1 C4:1 D4:1 E4:2 C4:1 E4:1 G4:1 G4:1 E4:1 G4:1 A4:2 G4:1 F4:1 E4:1 D4:1 C4:2',
    'C3:2 C3:2 C3:2 F3:2 C3:2 G3:2 C3:2 C3:2 C3:2 C3:2 C3:2 F3:2 G3:2 C3:2',
    '¡Tolón, tolón! No es una vaca cualquiera'
  ),

  buildSongFromSimpleScore(
    'pin-pon',
    'Pin Pon es un Muñeco',
    '🧼',
    84,
    'C4:1 E4:1 G4:1 G4:1 A4:1 G4:1 E4:2 F4:1 F4:1 F4:1 E4:1 D4:1 D4:1 C4:2 C4:1 E4:1 G4:1 G4:1 A4:1 G4:1 E4:2 F4:1 D4:1 E4:1 C4:1 D4:1 B3:1 C4:2',
    'C3:2 C3:2 F3:2 C3:2 F3:2 G3:2 C3:2 C3:2 C3:2 C3:2 F3:2 C3:2 G3:2 C3:2',
    'Muy guapo y de cartón, se lava la carita'
  ),

  buildSongFromSimpleScore(
    'a-mi-burro',
    'A Mi Burro le Duele la Cabeza',
    '🐴',
    82,
    'C4:1 D4:1 E4:1 C4:1 E4:1 F4:1 G4:2 A4:1 G4:1 F4:1 E4:1 D4:1 F4:1 E4:2 C4:1 D4:1 E4:1 C4:1 E4:1 F4:1 G4:2 A4:1 G4:1 F4:1 D4:1 C4:2',
    'C3:2 C3:2 C3:2 G3:2 F3:2 G3:2 C3:2 C3:2 C3:2 C3:2 G3:2 G3:2 C3:2',
    'El médico le ha puesto una gorrita negra'
  ),

  buildSongFromSimpleScore(
    'barquito-chiquitito',
    'El Barquito Chiquitito',
    '⛵',
    80,
    'C4:1 D4:1 E4:1 E4:1 F4:1 E4:1 D4:2 D4:1 E4:1 F4:1 F4:1 G4:1 F4:1 E4:2 C4:1 E4:1 G4:1 G4:1 A4:1 G4:1 F4:2 E4:1 D4:1 E4:1 C4:1 D4:1 B3:1 C4:2',
    'C3:2 C3:2 G3:2 G3:2 G3:2 G3:2 C3:2 C3:2 C3:2 F3:2 C3:2 G3:2 C3:2',
    'Había una vez un barco chiquitito que no podía navegar'
  ),

  buildSongFromSimpleScore(
    'jingle-bells',
    'Navidad (Jingle Bells)',
    '🎄',
    92,
    'E4:1 E4:1 E4:2 E4:1 E4:1 E4:2 E4:1 G4:1 C4:1.5 D4:0.5 E4:4 F4:1 F4:1 F4:1.5 F4:0.5 F4:1 E4:1 E4:1 E4:0.5 E4:0.5 E4:1 D4:1 D4:1 E4:1 D4:2 G4:2 E4:1 E4:1 E4:2 E4:1 E4:1 E4:2 E4:1 G4:1 C4:1.5 D4:0.5 E4:4 F4:1 F4:1 F4:1.5 F4:0.5 F4:1 E4:1 E4:1 E4:0.5 E4:0.5 G4:1 G4:1 F4:1 D4:1 C4:4',
    'C3:2 C3:2 C3:2 C3:2 C3:2 G3:2 C3:2 C3:2 F3:2 F3:2 C3:2 C3:2 G3:2 G3:2 G3:2 G3:2 C3:2 C3:2 C3:2 C3:2 C3:2 G3:2 C3:2 C3:2 F3:2 F3:2 C3:2 C3:2 G3:2 G3:2 C3:4',
    '¡Super fácil! Casi toda la melodía con 3-5 teclas'
  ),
];
