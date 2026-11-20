import React, { useState, useEffect } from 'react';
import type { Song, MidiDeviceInfo, AppSettings } from '../types/music';
import { Play, Pause, RotateCcw, Settings, Maximize, Minimize, Music2 } from 'lucide-react';

export type ActiveGameTab = 'songs' | 'find-animal' | 'train' | 'simon';

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
  onOpenMidiDiag: () => void;
  activeGameTab: ActiveGameTab;
  onChangeGameTab: (tab: ActiveGameTab) => void;
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
  onOpenMidiDiag,
  activeGameTab,
  onChangeGameTab,
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
      {/* Selector de Minijuegos Infantiles con Animalitos */}
      <div className="game-tabs-selector">
        <button
          type="button"
          className={`game-nav-tab ${activeGameTab === 'songs' ? 'active' : ''}`}
          onClick={() => onChangeGameTab('songs')}
        >
          <span className="tab-icon">🎵</span>
          <span className="tab-text">Canciones</span>
        </button>
        <button
          type="button"
          className={`game-nav-tab ${activeGameTab === 'find-animal' ? 'active' : ''}`}
          onClick={() => onChangeGameTab('find-animal')}
        >
          <span className="tab-icon">🐶</span>
          <span className="tab-text">Buscar Animal</span>
        </button>
        <button
          type="button"
          className={`game-nav-tab ${activeGameTab === 'train' ? 'active' : ''}`}
          onClick={() => onChangeGameTab('train')}
        >
          <span className="tab-icon">🚂</span>
          <span className="tab-text">El Tren</span>
        </button>
        <button
          type="button"
          className={`game-nav-tab ${activeGameTab === 'simon' ? 'active' : ''}`}
          onClick={() => onChangeGameTab('simon')}
        >
          <span className="tab-icon">🎯</span>
          <span className="tab-text">El Eco</span>
        </button>
      </div>

      {/* Si estamos en modo canciones, mostrar botón de canción y controles */}
      {activeGameTab === 'songs' ? (
        <>
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
        </>
      ) : (
        <div className="game-mode-banner-info">
          <span className="info-sparkle">✨</span>
          <span className="info-title">
            {activeGameTab === 'find-animal' && 'Modo: ¿Dónde vive el Animalito?'}
            {activeGameTab === 'train' && 'Modo: El Tren de las Escalas (Do-Re-Mi...)'}
            {activeGameTab === 'simon' && 'Modo: El Eco de los Animales (Memoria)'}
          </span>
        </div>
      )}

      {/* Indicador de estado MIDI y accesos rápidos */}
      <div className="nav-actions">
        {/* Estado MIDI (Casio Privia) */}
        <button
          type="button"
          className={`midi-status-badge ${hasMidi ? 'connected' : 'disconnected'}`}
          onClick={onOpenMidiDiag}
          title={hasMidi ? `Conectado: ${midiDeviceName} (clic para ver diagnóstico)` : 'Haz clic para abrir diagnóstico y ayuda de conexión'}
        >
          <div className="status-dot" />
          <span className="status-text">
            {hasMidi ? (midiDeviceName?.toLowerCase().includes('casio') ? 'Casio Privia' : midiDeviceName) : 'Diagnóstico MIDI'}
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
