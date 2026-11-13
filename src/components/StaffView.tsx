import React from 'react';
import type { Song, AppSettings } from '../types/music';
import { getNoteDetails } from '../config/musicConfig';

interface StaffViewProps {
  song: Song;
  settings: AppSettings;
  currentBeat: number;
}

export const StaffView: React.FC<StaffViewProps> = ({
  song,
  settings,
  currentBeat,
}) => {
  const { noteColors, showNoteNames } = settings;

  // Mostramos una ventana de notas alrededor del beat actual (desde currentBeat - 1 hasta currentBeat + 6)
  const windowNotes = song.notes.filter(
    n => n.time >= currentBeat - 0.5 && n.time <= currentBeat + 6
  );

  // Mapeo de altura MIDI a posición Y en el pentagrama (Clave de Sol)
  // En clave de sol: E4 (MIDI 64) está en la primera línea (abajo). F5 (MIDI 77) está en la 5ª línea (arriba).
  // C4 (Do central, MIDI 60) está una línea adicional por debajo.
  // Distancia entre líneas = 12px.
  // Cada paso diatónico (C, D, E, F, G, A, B) sube 6px (medio espacio).

  const diatonicOffsets: Record<number, number> = {
    0: 0,  // C
    1: 0,  // C#
    2: 1,  // D
    3: 1,  // D#
    4: 2,  // E
    5: 3,  // F
    6: 3,  // F#
    7: 4,  // G
    8: 4,  // G#
    9: 5,  // A
    10: 5, // A#
    11: 6, // B
  };

  const getDiatonicStep = (midi: number) => {
    const noteClass = ((midi % 12) + 12) % 12;
    const octave = Math.floor(midi / 12) - 1;
    return octave * 7 + (diatonicOffsets[noteClass] ?? 0);
  };

  // Referencia: B4 (tercera línea central) tiene paso 4*7 + 6 = 34.
  // Coloquemos la línea central (B4) a Y = 50px.
  // Cada paso diatónico son 6px: más agudo va hacia arriba (-), más grave hacia abajo (+).
  const lineSpacing = 12;
  const staffCenterY = 50;
  const b4Step = getDiatonicStep(71); // B4

  const getYForMidi = (midi: number) => {
    const step = getDiatonicStep(midi);
    const delta = step - b4Step;
    return staffCenterY - delta * (lineSpacing / 2);
  };

  return (
    <div className="staff-view-container">
      <div className="staff-header">
        <span className="staff-title">🎼 Pentagrama (Clave de Sol)</span>
        <span className="staff-hint">Mira cómo suben y bajan las notas</span>
      </div>

      <div className="staff-canvas-box">
        <svg className="staff-svg" viewBox="0 0 700 110" preserveAspectRatio="none">
          {/* 5 líneas del pentagrama (E4, G4, B4, D5, F5) */}
          {[0, 1, 2, 3, 4].map(idx => {
            const lineY = staffCenterY - 2 * lineSpacing + idx * lineSpacing;
            return (
              <line
                key={idx}
                x1="40"
                y1={lineY}
                x2="680"
                y2={lineY}
                stroke="#64748B"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
            );
          })}

          {/* Símbolo de Clave de Sol estilizado */}
          <text
            x="45"
            y="72"
            fill="#38BDF8"
            fontSize="54"
            fontFamily="serif"
            fontWeight="bold"
            opacity="0.85"
          >
            𝄞
          </text>

          {/* Compás actual marcador visual */}
          <line
            x1="120"
            y1="15"
            x2="120"
            y2="95"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />

          {/* Notas en el pentagrama */}
          {windowNotes.map(note => {
            const beatDiff = note.time - currentBeat;
            // Coordenada X proporcional a la diferencia en tiempo:
            // La nota actual se sitúa en X = 120
            const x = 120 + beatDiff * 90;
            if (x < 75 || x > 670) return null;

            const y = getYForMidi(note.midi);
            const details = getNoteDetails(note.midi);
            const color = noteColors[details.noteClass] || '#38BDF8';
            const isNow = Math.abs(beatDiff) < 0.25;

            // Línea adicional para Do central (C4, Y = staffCenterY + 2.5 * 12 = 80)
            const needsLedgerLine = details.letter === 'C' && details.octave === 4;

            return (
              <g key={note.id} className="staff-note-group">
                {/* Línea adicional para Do Central */}
                {needsLedgerLine && (
                  <line
                    x1={x - 14}
                    y1={y}
                    x2={x + 14}
                    y2={y}
                    stroke="#94A3B8"
                    strokeWidth="2"
                  />
                )}

                {/* Halo de nota activa */}
                {isNow && (
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    fill={color}
                    opacity="0.3"
                  />
                )}

                {/* Cabeza de la nota ovalada e inclinada */}
                <ellipse
                  cx={x}
                  cy={y}
                  rx="9"
                  ry="7"
                  transform={`rotate(-20 ${x} ${y})`}
                  fill={color}
                  stroke={isNow ? '#FFFFFF' : 'rgba(0,0,0,0.3)'}
                  strokeWidth="2"
                />

                {/* Plica de la nota */}
                <line
                  x1={x + 7}
                  y1={y - 2}
                  x2={x + 7}
                  y2={y - 28}
                  stroke="#E2E8F0"
                  strokeWidth="2"
                />

                {/* Etiqueta Solfeo y Letra debajo */}
                {showNoteNames && (
                  <text
                    x={x}
                    y={y + 19}
                    textAnchor="middle"
                    fill="#F1F5F9"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {details.solfege}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
