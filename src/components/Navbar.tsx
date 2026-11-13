import React, { useState, useEffect } from 'react';
import type { Song, MidiDeviceInfo, AppSettings } from '../types/music';
import { Play, Pause, RotateCcw, Settings, Maximize, Minimize, Music2 } from 'lucide-react';

interface NavbarProps {
  currentSong: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestartSong: () => void;
  onOpenSongSelector: () => void;
  onOpenSettings: () => void;
  settings: AppSettings;
  onToggleStaff: () => void;
  midiDevices: MidiDeviceInfo[];
  onRetryMidi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSong,
  isPlaying,
  onTogglePlay,
  onRestartSong,
  onOpenSongSelector,
  onOpenSettings,
  settings,
  onToggleStaff,
  midiDevices,
  onRetryMidi,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const hasMidi = midiDevices.length > 0;
  const midiDeviceName = hasMidi ? midiDevices[0].name : null;

  return (
    <header className="app-navbar">
      {/* Botón de selección de canción infantil */}
      <button
        type="button"
        className="song-picker-btn"
        onClick={onOpenSongSelector}
        title="Elegir otra canción"
      >
        <span className="current-song-emoji">{currentSong.emoji}</span>
        <div className="current-song-titles">
          <span className="current-song-name">{currentSong.title}</span>
          <span className="change-song-hint">Cambiar canción ▼</span>
        </div>
      </button>

      {/* Controles de reproducción principales */}
      <div className="nav-controls">
        <button
          type="button"
          className="nav-btn restart-btn"
          onClick={onRestartSong}
          title="Empezar desde el principio"
        >
          <RotateCcw size={22} />
        </button>

        <button
          type="button"
          className={`nav-btn play-pause-btn ${isPlaying ? 'playing' : 'paused'}`}
          onClick={onTogglePlay}
          title={isPlaying ? 'Pausa' : 'Tocar'}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
        </button>
      </div>

      {/* Indicador de estado MIDI y accesos rápidos */}
      <div className="nav-actions">
        {/* Estado MIDI (Casio Privia) */}
        <button
          type="button"
          className={`midi-status-badge ${hasMidi ? 'connected' : 'disconnected'}`}
          onClick={onRetryMidi}
          title={hasMidi ? `Conectado: ${midiDeviceName}` : 'Haz clic para reconectar MIDI USB'}
        >
          <div className="status-dot" />
          <span className="status-text">
            {hasMidi ? (midiDeviceName?.toLowerCase().includes('casio') ? 'Casio Privia' : midiDeviceName) : 'Conectar Piano MIDI'}
          </span>
        </button>

        {/* Interruptor rápido de Pentagrama */}
        <button
          type="button"
          className={`nav-btn staff-toggle-btn ${settings.showStaff ? 'active' : ''}`}
          onClick={onToggleStaff}
          title="Mostrar / Ocultar Pentagrama"
        >
          <Music2 size={20} />
          <span className="btn-label">Pentagrama</span>
        </button>

        {/* Pantalla completa */}
        <button
          type="button"
          className="nav-btn icon-only-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        {/* Ajustes para padres */}
        <button
          type="button"
          className="nav-btn icon-only-btn settings-btn"
          onClick={onOpenSettings}
          title="Ajustes (velocidad, dificultad, pegatinas)"
        >
          <Settings size={22} />
        </button>
      </div>
    </header>
  );
};
