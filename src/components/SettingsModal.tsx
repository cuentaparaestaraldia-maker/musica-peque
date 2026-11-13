import React, { useState } from 'react';
import type { AppSettings, NoteColorConfig } from '../types/music';
import { DEFAULT_NOTE_COLORS } from '../config/musicConfig';
import { Settings, Sliders, Volume2, Sparkles, X, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

const NATURAL_NOTES = [
  { noteClass: 0, solfege: 'Do', letter: 'C' },
  { noteClass: 2, solfege: 'Re', letter: 'D' },
  { noteClass: 4, solfege: 'Mi', letter: 'E' },
  { noteClass: 5, solfege: 'Fa', letter: 'F' },
  { noteClass: 7, solfege: 'Sol', letter: 'G' },
  { noteClass: 9, solfege: 'La', letter: 'A' },
  { noteClass: 11, solfege: 'Si', letter: 'B' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'game' | 'stickers' | 'sound'>('game');

  if (!isOpen) return null;

  const handleColorChange = (noteClass: number, newColor: string) => {
    const updatedColors: NoteColorConfig = {
      ...settings.noteColors,
      [noteClass]: newColor,
    };
    onUpdateSettings({ noteColors: updatedColors });
  };

  const handleResetColors = () => {
    onUpdateSettings({ noteColors: { ...DEFAULT_NOTE_COLORS } });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Settings className="modal-icon text-amber-400" size={28} />
            <div>
              <h2>Ajustes y Configuración</h2>
              <p>Personaliza el juego para tu peque y tu piano Casio Privia</p>
            </div>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Pestañas de configuración */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => setActiveTab('game')}
          >
            <Sliders size={18} />
            Juego y Dificultad
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'stickers' ? 'active' : ''}`}
            onClick={() => setActiveTab('stickers')}
          >
            <Sparkles size={18} />
            Colores de tus Pegatinas
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'sound' ? 'active' : ''}`}
            onClick={() => setActiveTab('sound')}
          >
            <Volume2 size={18} />
            Sonido y Pantalla
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'game' && (
            <div className="settings-section">
              {/* Modo de juego */}
              <div className="setting-group">
                <label className="setting-label">Modo de Aprendizaje:</label>
                <div className="choice-buttons">
                  <button
                    type="button"
                    className={`choice-btn ${settings.mode === 'wait' ? 'active' : ''}`}
                    onClick={() => onUpdateSettings({ mode: 'wait' })}
                  >
                    <span className="choice-title">⭐ Modo Espera (Recomendado)</span>
                    <span className="choice-desc">La canción se pausa hasta que el niño pulse la tecla correcta</span>
                  </button>
                  <button
                    type="button"
                    className={`choice-btn ${settings.mode === 'flow' ? 'active' : ''}`}
                    onClick={() => onUpdateSettings({ mode: 'flow' })}
                  >
                    <span className="choice-title">🚀 Modo Ritmo Continuo</span>
                    <span className="choice-desc">La música avanza continuamente como en Guitar Hero</span>
                  </button>
                </div>
              </div>

              {/* Velocidad */}
              <div className="setting-group">
                <label className="setting-label">
                  Velocidad: <strong>{settings.speed}x</strong>
                </label>
                <div className="speed-pills">
                  {[0.25, 0.5, 0.75, 1.0, 1.25].map(spd => (
                    <button
                      key={spd}
                      type="button"
                      className={`speed-pill ${settings.speed === spd ? 'active' : ''}`}
                      onClick={() => onUpdateSettings({ speed: spd })}
                    >
                      {spd}x {spd === 0.75 ? '(Ideal 4 años)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manos / Dificultad */}
              <div className="setting-group">
                <label className="setting-label">Dificultad / Manos:</label>
                <div className="choice-pills">
                  <button
                    type="button"
                    className={`choice-pill ${settings.hands === 'right' ? 'active' : ''}`}
                    onClick={() => onUpdateSettings({ hands: 'right' })}
                  >
                    Solo Mano Derecha (Melodía)
                  </button>
                  <button
                    type="button"
                    className={`choice-pill ${settings.hands === 'both' ? 'active' : ''}`}
                    onClick={() => onUpdateSettings({ hands: 'both' })}
                  >
                    Ambas Manos (Melodía + Acompañamiento)
                  </button>
                  <button
                    type="button"
                    className={`choice-pill ${settings.hands === 'left' ? 'active' : ''}`}
                    onClick={() => onUpdateSettings({ hands: 'left' })}
                  >
                    Solo Mano Izquierda (Bajos)
                  </button>
                </div>
              </div>

              {/* Rango de teclas */}
              <div className="setting-group">
                <label className="setting-label">Tamaño de teclas en pantalla:</label>
                <div className="choice-pills">
                  <button
                    type="button"
                    className={`choice-pill ${settings.keyRangeEnd - settings.keyRangeStart <= 24 ? 'active' : ''}`}
                    onClick={() => onUpdateSettings({ keyRangeStart: 48, keyRangeEnd: 72 })}
                  >
                    2 Octavas (Teclas Grandes C3-C5)
                  </button>
                  <button
                    type="button"
                    className={`choice-pill ${settings.keyRangeEnd - settings.keyRangeStart > 24 ? 'active' : ''}`}
                    onClick={() => onUpdateSettings({ keyRangeStart: 48, keyRangeEnd: 84 })}
                  >
                    3 Octavas (C3-C6)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stickers' && (
            <div className="settings-section">
              <div className="stickers-help-box">
                <p>
                  Adapta los colores en pantalla para que coincidan <strong>exactamente</strong> con las pegatinas que tienes puestas en las teclas de tu Casio Privia:
                </p>
              </div>

              <div className="stickers-grid">
                {NATURAL_NOTES.map(note => {
                  const currentColor = settings.noteColors[note.noteClass] || '#64748B';
                  return (
                    <div key={note.noteClass} className="sticker-item">
                      <div
                        className="sticker-preview-chip"
                        style={{ backgroundColor: currentColor }}
                      >
                        <span className="font-bold">{note.solfege}</span>
                        <span className="text-xs">{note.letter}</span>
                      </div>
                      <div className="sticker-control">
                        <span className="sticker-name">{note.solfege} ({note.letter})</span>
                        <input
                          type="color"
                          value={currentColor}
                          onChange={e => handleColorChange(note.noteClass, e.target.value)}
                          className="color-input-picker"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="reset-colors-btn"
                onClick={handleResetColors}
              >
                <RotateCcw size={16} />
                Restablecer a colores estándar arcoíris
              </button>
            </div>
          )}

          {activeTab === 'sound' && (
            <div className="settings-section">
              {/* Pentagrama */}
              <div className="toggle-row">
                <div>
                  <span className="toggle-title">Mostrar Pentagrama Musical</span>
                  <span className="toggle-sub">Muestra la partitura tradicional con las notas coloreadas</span>
                </div>
                <button
                  type="button"
                  className={`toggle-switch ${settings.showStaff ? 'checked' : ''}`}
                  onClick={() => onUpdateSettings({ showStaff: !settings.showStaff })}
                >
                  <div className="toggle-knob" />
                </button>
              </div>

              {/* Sonido interno */}
              <div className="toggle-row">
                <div>
                  <span className="toggle-title">Sonido del Portátil</span>
                  <span className="toggle-sub">
                    {settings.muteInternalAudio
                      ? 'Silenciado (para oír el sonido del Casio Privia)'
                      : 'Activado (el portátil suena al tocar las teclas)'}
                  </span>
                </div>
                <button
                  type="button"
                  className={`toggle-switch ${!settings.muteInternalAudio ? 'checked' : ''}`}
                  onClick={() => onUpdateSettings({ muteInternalAudio: !settings.muteInternalAudio })}
                >
                  <div className="toggle-knob" />
                </button>
              </div>

              {/* Mostrar nombres de notas */}
              <div className="toggle-row">
                <div>
                  <span className="toggle-title">Mostrar Etiquetas de Notas (Do / C)</span>
                  <span className="toggle-sub">Escribe los nombres sobre las teclas y bloques que caen</span>
                </div>
                <button
                  type="button"
                  className={`toggle-switch ${settings.showNoteNames ? 'checked' : ''}`}
                  onClick={() => onUpdateSettings({ showNoteNames: !settings.showNoteNames })}
                >
                  <div className="toggle-knob" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
