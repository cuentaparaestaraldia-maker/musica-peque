import React from 'react';
import type { AppSettings } from '../types/music';
import { getNoteDetails } from '../config/musicConfig';
import { getAnimalForMidi, getBlackKeyInfo } from '../config/animalConfig';

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
  const { keyRangeStart, keyRangeEnd, noteColors } = settings;

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
            const animal = getAnimalForMidi(k.midi);

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

                {/* Pegatina idéntica a la plantilla física */}
                <div
                  className="sticker-card-badge"
                  style={{
                    borderColor: color,
                    boxShadow: isTarget ? `0 0 16px ${color}` : undefined,
                  }}
                >
                  {animal && (
                    <div className="sticker-content">
                      <span className="sticker-emoji">{animal.emoji}</span>
                      <span className="sticker-animal-name" style={{ color }}>{animal.name}</span>
                      <span className="sticker-sublabel">{animal.letter} • {animal.solfege}</span>
                      <div className="sticker-color-dot" style={{ backgroundColor: color }} />
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

            // Contamos cuántas teclas blancas hay antes de esta
            const whiteKeysBefore = keys.slice(0, index).filter(item => !item.isBlack).length;
            const totalWhite = whiteKeys.length;
            const leftPercent = ((whiteKeysBefore - 0.35) / totalWhite) * 100;
            const widthPercent = (0.7 / totalWhite) * 100;

            const isActive = activeNotes.has(k.midi);
            const isTarget = targetNotes.has(k.midi);
            const blackInfo = getBlackKeyInfo(k.midi);
            const isHouse = blackInfo?.type === 'house';

            return (
              <button
                key={k.midi}
                type="button"
                className={`piano-key black-key ${isActive ? 'active' : ''} ${isTarget ? 'target-pulsing' : ''}`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  '--key-accent-color': isHouse ? '#FACC15' : '#38BDF8',
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
                {/* Pegatina de Casita (Grupo 2) o Tenedor (Grupo 3) */}
                {blackInfo && (
                  <div
                    className={`black-sticker-badge ${isHouse ? 'border-yellow' : 'border-cyan'}`}
                    style={{
                      boxShadow: isTarget ? `0 0 14px ${isHouse ? '#FACC15' : '#38BDF8'}` : undefined,
                    }}
                  >
                    <span className="black-emoji">{blackInfo.emoji}</span>
                    <span className="black-name">{blackInfo.name}</span>
                    <span className="black-notes">{blackInfo.label}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
