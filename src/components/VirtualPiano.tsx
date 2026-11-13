import React from 'react';
import type { AppSettings } from '../types/music';
import { getNoteDetails } from '../config/musicConfig';

interface VirtualPianoProps {
  settings: AppSettings;
  activeNotes: Set<number>;       // Notas activas que están siendo tocadas por el usuario
  targetNotes?: Set<number>;      // Notas que el niño debe tocar ahora mismo (modo espera)
  onNotePress?: (midi: number) => void;
  onNoteRelease?: (midi: number) => void;
}

export const VirtualPiano: React.FC<VirtualPianoProps> = ({
  settings,
  activeNotes,
  targetNotes = new Set(),
  onNotePress,
  onNoteRelease,
}) => {
  const { keyRangeStart, keyRangeEnd, noteColors, showNoteNames } = settings;

  // Generar lista de teclas en el rango
  const keys: ReturnType<typeof getNoteDetails>[] = [];
  for (let midi = keyRangeStart; midi <= keyRangeEnd; midi++) {
    keys.push(getNoteDetails(midi));
  }

  const whiteKeys = keys.filter(k => !k.isBlack);

  return (
    <div className="virtual-piano-container">
      <div className="piano-chassis">
        {/* Teclas blancas */}
        <div className="white-keys-layer">
          {whiteKeys.map(k => {
            const isActive = activeNotes.has(k.midi);
            const isTarget = targetNotes.has(k.midi);
            const color = noteColors[k.noteClass] || '#CBD5E1';

            return (
              <button
                key={k.midi}
                type="button"
                className={`piano-key white-key ${isActive ? 'active' : ''} ${isTarget ? 'target-pulsing' : ''}`}
                onMouseDown={() => onNotePress?.(k.midi)}
                onMouseUp={() => onNoteRelease?.(k.midi)}
                onMouseLeave={() => isActive && onNoteRelease?.(k.midi)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  onNotePress?.(k.midi);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  onNoteRelease?.(k.midi);
                }}
                style={{
                  '--key-accent-color': color,
                } as React.CSSProperties}
              >
                {/* Resplandor al tocar */}
                {isActive && <div className="key-active-glow" style={{ backgroundColor: color }} />}

                {/* Pegatina en la tecla */}
                <div
                  className="sticker-badge"
                  style={{
                    backgroundColor: color,
                    boxShadow: isTarget ? `0 0 16px ${color}` : undefined,
                  }}
                >
                  {showNoteNames && (
                    <div className="sticker-labels">
                      <span className="sticker-solfege">{k.solfege}</span>
                      <span className="sticker-letter">{k.letter}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Teclas negras superpuestas */}
        <div className="black-keys-layer">
          {keys.map((k, index) => {
            if (!k.isBlack) return null;

            // Calcular posición relativa respecto a las teclas blancas
            // Contamos cuántas teclas blancas hay antes de esta
            const whiteKeysBefore = keys.slice(0, index).filter(item => !item.isBlack).length;
            const totalWhite = whiteKeys.length;
            const leftPercent = ((whiteKeysBefore - 0.35) / totalWhite) * 100;
            const widthPercent = (0.7 / totalWhite) * 100;

            const isActive = activeNotes.has(k.midi);
            const isTarget = targetNotes.has(k.midi);
            const color = noteColors[k.noteClass] || '#64748B';

            return (
              <button
                key={k.midi}
                type="button"
                className={`piano-key black-key ${isActive ? 'active' : ''} ${isTarget ? 'target-pulsing' : ''}`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  '--key-accent-color': color,
                } as React.CSSProperties}
                onMouseDown={() => onNotePress?.(k.midi)}
                onMouseUp={() => onNoteRelease?.(k.midi)}
                onMouseLeave={() => isActive && onNoteRelease?.(k.midi)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  onNotePress?.(k.midi);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  onNoteRelease?.(k.midi);
                }}
              >
                {/* Píldora de pegatina en tecla negra */}
                <div
                  className="black-sticker-badge"
                  style={{
                    backgroundColor: color,
                    boxShadow: isTarget ? `0 0 14px ${color}` : undefined,
                  }}
                >
                  {showNoteNames && (
                    <span className="black-sticker-label">{k.letter}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
