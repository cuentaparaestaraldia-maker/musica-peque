import React, { useRef, useState } from 'react';
import type { Song } from '../types/music';
import { parseMidiFile, buildSongFromSimpleScore } from '../utils/midiParser';
import { Music, Upload, Plus, X, Check } from 'lucide-react';

interface SongSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  currentSongId: string;
  onSelectSong: (song: Song) => void;
  onAddSong: (song: Song) => void;
}

export const SongSelector: React.FC<SongSelectorProps> = ({
  isOpen,
  onClose,
  songs,
  currentSongId,
  onSelectSong,
  onAddSong,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tab, setTab] = useState<'catalog' | 'custom'>('catalog');
  const [customTitle, setCustomTitle] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🎵');
  const [customRightNotes, setCustomRightNotes] = useState('C4:1 D4:1 E4:1 C4:1');
  const [customBpm, setCustomBpm] = useState(80);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const newSong = await parseMidiFile(file);
      onAddSong(newSong);
      onSelectSong(newSong);
      onClose();
    } catch (err) {
      console.error('Error al procesar el archivo MIDI:', err);
      alert('No se pudo leer el archivo MIDI. Comprueba que sea un archivo .mid válido.');
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newSong = buildSongFromSimpleScore(
      `custom-${Date.now()}`,
      customTitle.trim(),
      customEmoji || '🎹',
      customBpm,
      customRightNotes.trim(),
      '',
      'Canción creada a mano'
    );

    onAddSong(newSong);
    onSelectSong(newSong);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card song-selector-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Music className="modal-icon text-indigo-400" size={28} />
            <div>
              <h2>Cancionero Infantil</h2>
              <p>Elige una canción o añade tus propios archivos MIDI</p>
            </div>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Pestañas */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`tab-btn ${tab === 'catalog' ? 'active' : ''}`}
            onClick={() => setTab('catalog')}
          >
            Canciones ({songs.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${tab === 'custom' ? 'active' : ''}`}
            onClick={() => setTab('custom')}
          >
            Añadir Canción
          </button>
        </div>

        <div className="modal-body">
          {tab === 'catalog' ? (
            <div className="songs-grid">
              {songs.map(song => {
                const isSelected = song.id === currentSongId;
                return (
                  <button
                    key={song.id}
                    type="button"
                    className={`song-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onSelectSong(song);
                      onClose();
                    }}
                  >
                    <div className="song-emoji">{song.emoji}</div>
                    <div className="song-info">
                      <div className="song-title-row">
                        <span className="song-title">{song.title}</span>
                        {isSelected && <Check size={18} className="selected-check" />}
                      </div>
                      {song.description && (
                        <p className="song-desc">{song.description}</p>
                      )}
                      <div className="song-meta">
                        <span className="meta-badge">{song.notes.length} notas</span>
                        <span className="meta-badge">{song.tempo} BPM</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="add-song-view">
              {/* Opción 1: Archivo .mid */}
              <div className="upload-box">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mid,.midi"
                  className="hidden"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <div className="upload-content">
                  <Upload size={36} className="upload-icon" />
                  <h3>Cargar archivo MIDI (.mid)</h3>
                  <p>Arrastra o selecciona un archivo de piano descargado de internet</p>
                  <button
                    type="button"
                    className="action-btn upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Examinar archivo MIDI
                  </button>
                </div>
              </div>

              {/* Opción 2: Escribir melodía en texto fácil */}
              <form className="simple-score-form" onSubmit={handleCreateCustom}>
                <h3>O escribe notas sencillas (C4, D4, E4...)</h3>
                <div className="form-row">
                  <div className="form-field flex-1">
                    <label>Título:</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={e => setCustomTitle(e.target.value)}
                      placeholder="Mi melodía"
                      required
                    />
                  </div>
                  <div className="form-field w-20">
                    <label>Emoji:</label>
                    <input
                      type="text"
                      value={customEmoji}
                      onChange={e => setCustomEmoji(e.target.value)}
                      maxLength={2}
                    />
                  </div>
                  <div className="form-field w-24">
                    <label>Velocidad:</label>
                    <input
                      type="number"
                      value={customBpm}
                      onChange={e => setCustomBpm(parseInt(e.target.value, 10))}
                      min={40}
                      max={180}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Notas (Nota:Duración separadas por espacio):</label>
                  <input
                    type="text"
                    value={customRightNotes}
                    onChange={e => setCustomRightNotes(e.target.value)}
                    placeholder="Ejemplo: C4:1 D4:1 E4:1 C4:1"
                    required
                  />
                  <small className="form-help">
                    Ej: C4:1 (Do 1 tiempo), D4:2 (Re 2 tiempos), R:1 (Silencio 1 tiempo)
                  </small>
                </div>

                <button type="submit" className="action-btn save-btn">
                  <Plus size={18} />
                  Guardar y Tocar Canción
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
