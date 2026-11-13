import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Song, AppSettings, MidiDeviceInfo } from './types/music';
import { INITIAL_SONGS } from './config/songs';
import { DEFAULT_SETTINGS, DEFAULT_NOTE_COLORS } from './config/musicConfig';
import { midiManager } from './audio/midi';
import { synth } from './audio/synth';
import './App.css';

import { Navbar } from './components/Navbar';
import { PianoHeroCanvas } from './components/PianoHeroCanvas';
import { VirtualPiano } from './components/VirtualPiano';
import { StaffView } from './components/StaffView';
import { SongSelector } from './components/SongSelector';
import { SettingsModal } from './components/SettingsModal';
import { Celebration } from './components/Celebration';

const SETTINGS_STORAGE_KEY = 'musica_peque_settings_v1';
const CUSTOM_SONGS_STORAGE_KEY = 'musica_peque_custom_songs_v1';

// Mapeo amigable de teclado QWERTY a notas para pruebas rápidas
const QWERTY_NOTE_MAP: Record<string, number> = {
  // Octava 4 (C4 a B4)
  a: 60, // Do / C
  w: 61, // Do# / C#
  s: 62, // Re / D
  e: 63, // Re# / D#
  d: 64, // Mi / E
  f: 65, // Fa / F
  t: 66, // Fa# / F#
  g: 67, // Sol / G
  y: 68, // Sol# / G#
  h: 69, // La / A
  u: 70, // La# / A#
  j: 71, // Si / B
  k: 72, // Do5 / C5
};

export const App: React.FC = () => {
  // Estado de canciones
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_SONGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...INITIAL_SONGS, ...parsed];
      }
    } catch {}
    return INITIAL_SONGS;
  });

  const [currentSong, setCurrentSong] = useState<Song>(INITIAL_SONGS[0]);

  // Estado de configuración persistente
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          noteColors: { ...DEFAULT_NOTE_COLORS, ...(parsed.noteColors || {}) },
        };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Guardar configuración en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {}
    synth.setMuted(settings.muteInternalAudio);
  }, [settings]);

  // Estado de reproducción y juego
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [targetNotes, setTargetNotes] = useState<Set<number>>(new Set());
  const [isFinished, setIsFinished] = useState(false);

  // Estado de modales
  const [isSongSelectorOpen, setIsSongSelectorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Estado de dispositivos MIDI
  const [midiDevices, setMidiDevices] = useState<MidiDeviceInfo[]>([]);

  // Referencias para el loop de animación
  const currentBeatRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const currentSongRef = useRef<Song>(currentSong);
  const settingsRef = useRef<AppSettings>(settings);
  const playedNotesSetRef = useRef<Set<string>>(new Set());
  const lastTimeRef = useRef<number | null>(null);

  // Sincronizar referencias
  currentBeatRef.current = currentBeat;
  isPlayingRef.current = isPlaying;
  currentSongRef.current = currentSong;
  settingsRef.current = settings;

  // Actualizar configuración
  const handleUpdateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newPartial }));
  };

  // Agregar canción personalizada
  const handleAddSong = (newSong: Song) => {
    setSongs(prev => {
      const updated = [newSong, ...prev.filter(s => s.id !== newSong.id)];
      try {
        const customOnly = updated.filter(s => !INITIAL_SONGS.some(init => init.id === s.id));
        localStorage.setItem(CUSTOM_SONGS_STORAGE_KEY, JSON.stringify(customOnly));
      } catch {}
      return updated;
    });
  };

  // Inicializar Web MIDI
  useEffect(() => {
    midiManager.init();
    const unsubDevices = midiManager.onDevicesChange(devices => {
      setMidiDevices(devices);
    });

    const unsubNoteOn = midiManager.onNoteOn((midi, velocity) => {
      handleUserNoteTrigger(midi, velocity);
    });

    const unsubNoteOff = midiManager.onNoteOff(midi => {
      handleUserNoteRelease(midi);
    });

    return () => {
      unsubDevices();
      unsubNoteOn();
      unsubNoteOff();
    };
  }, []);

  // Manejar teclado físico del ordenador (QWERTY)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      const midi = QWERTY_NOTE_MAP[key];
      if (midi !== undefined) {
        handleUserNoteTrigger(midi, 0.8);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const midi = QWERTY_NOTE_MAP[key];
      if (midi !== undefined) {
        handleUserNoteRelease(midi);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Cuando el usuario toca una nota (desde MIDI, QWERTY o VirtualPiano)
  const handleUserNoteTrigger = useCallback((midi: number, velocity: number = 0.8) => {
    setActiveNotes(prev => new Set(prev).add(midi));
    synth.noteOn(midi, velocity);

    const song = currentSongRef.current;
    const beat = currentBeatRef.current;
    const mode = settingsRef.current.mode;
    const hands = settingsRef.current.hands;

    // Buscar si esta nota coincide con alguna nota pendiente en la ventana de impacto
    const visibleNotes = song.notes.filter(n => {
      if (hands === 'right') return n.hand === 'right';
      if (hands === 'left') return n.hand === 'left';
      return true;
    });

    // Ventana de tolerancia: en wait mode puede ser +/- 0.4 beat; en flow mode +/- 0.5 beat
    const tolerance = mode === 'wait' ? 0.35 : 0.5;
    const hitNote = visibleNotes.find(n => {
      if (n.midi !== midi) return false;
      if (playedNotesSetRef.current.has(n.id)) return false;
      return Math.abs(n.time - beat) <= tolerance;
    });

    if (hitNote) {
      playedNotesSetRef.current.add(hitNote.id);
      hitNote.played = true;

      // Si estábamos en pausa de wait mode en esta nota, se desbloquea
      setTargetNotes(prev => {
        const next = new Set(prev);
        next.delete(midi);
        return next;
      });
    }
  }, []);

  const handleUserNoteRelease = useCallback((midi: number) => {
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
    synth.noteOff(midi);
  }, []);

  // Bucle de animación y tiempo de la canción
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (!isPlayingRef.current) {
        lastTimeRef.current = null;
        animId = requestAnimationFrame(tick);
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
        animId = requestAnimationFrame(tick);
        return;
      }

      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const song = currentSongRef.current;
      const { mode, speed, hands } = settingsRef.current;

      const visibleNotes = song.notes.filter(n => {
        if (hands === 'right') return n.hand === 'right';
        if (hands === 'left') return n.hand === 'left';
        return true;
      });

      let nextBeat = currentBeatRef.current;

      // Comprobar si hay una nota en wait mode esperando
      if (mode === 'wait') {
        // Encontrar la nota pendiente más antigua
        const pendingNote = visibleNotes.find(
          n => !playedNotesSetRef.current.has(n.id) && n.time <= nextBeat + 0.05
        );

        if (pendingNote) {
          // Congelar el beat exactamente en pendingNote.time hasta que se toque
          nextBeat = pendingNote.time;
          setTargetNotes(new Set([pendingNote.midi]));
        } else {
          // Avanzar normalmente
          const beatsPerSec = (song.tempo / 60) * speed;
          nextBeat += deltaSec * beatsPerSec;
          setTargetNotes(new Set());
        }
      } else {
        // Modo flow continuo
        const beatsPerSec = (song.tempo / 60) * speed;
        nextBeat += deltaSec * beatsPerSec;

        // Notas activas próximas para resaltar
        const currentActive = visibleNotes.filter(
          n => Math.abs(n.time - nextBeat) < 0.25 && !playedNotesSetRef.current.has(n.id)
        );
        setTargetNotes(new Set(currentActive.map(n => n.midi)));
      }

      currentBeatRef.current = nextBeat;
      setCurrentBeat(nextBeat);

      // Comprobar si se completó la canción
      const lastNote = visibleNotes[visibleNotes.length - 1];
      if (lastNote && nextBeat > lastNote.time + lastNote.duration + 1.5) {
        setIsPlaying(false);
        setIsFinished(true);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Control de transporte
  const handleTogglePlay = () => {
    setIsPlaying(p => !p);
  };

  const handleRestartSong = () => {
    currentBeatRef.current = 0;
    setCurrentBeat(0);
    playedNotesSetRef.current.clear();
    currentSong.notes.forEach(n => {
      n.played = false;
    });
    setTargetNotes(new Set());
    setIsFinished(false);
    setIsPlaying(true);
  };

  const handleSelectSong = (song: Song) => {
    setCurrentSong(song);
    currentBeatRef.current = 0;
    setCurrentBeat(0);
    playedNotesSetRef.current.clear();
    song.notes.forEach(n => {
      n.played = false;
    });
    setTargetNotes(new Set());
    setIsFinished(false);
    setIsPlaying(true);
  };

  const handleNextSong = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    handleSelectSong(songs[nextIndex]);
  };

  return (
    <div className="musica-peque-app">
      {/* Barra de navegación superior */}
      <Navbar
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onRestartSong={handleRestartSong}
        onOpenSongSelector={() => setIsSongSelectorOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        settings={settings}
        onToggleStaff={() => handleUpdateSettings({ showStaff: !settings.showStaff })}
        midiDevices={midiDevices}
        onRetryMidi={() => midiManager.init()}
      />

      {/* Área principal de juego */}
      <main className="game-stage">
        {/* Pentagrama opcional */}
        {settings.showStaff && (
          <div className="staff-panel-wrapper">
            <StaffView
              song={currentSong}
              settings={settings}
              currentBeat={currentBeat}
            />
          </div>
        )}

        {/* Cascada de notas estilo Guitar Hero */}
        <div className="waterfall-stage-wrapper">
          <PianoHeroCanvas
            song={currentSong}
            settings={settings}
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            activeNotes={activeNotes}
          />
        </div>

        {/* Teclado de piano visual con pegatinas y nombres de notas */}
        <div className="piano-stage-wrapper">
          <VirtualPiano
            settings={settings}
            activeNotes={activeNotes}
            targetNotes={targetNotes}
            onNotePress={(midi) => handleUserNoteTrigger(midi, 0.8)}
            onNoteRelease={(midi) => handleUserNoteRelease(midi)}
          />
        </div>
      </main>

      {/* Pantalla de celebración infantil con confeti */}
      {isFinished && (
        <Celebration
          songTitle={currentSong.title}
          onReplay={handleRestartSong}
          onNextSong={handleNextSong}
        />
      )}

      {/* Selector de Canciones */}
      <SongSelector
        isOpen={isSongSelectorOpen}
        onClose={() => setIsSongSelectorOpen(false)}
        songs={songs}
        currentSongId={currentSong.id}
        onSelectSong={handleSelectSong}
        onAddSong={handleAddSong}
      />

      {/* Modal de Ajustes para Padres */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
};
export default App;
