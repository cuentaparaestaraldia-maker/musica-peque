import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ANIMAL_NOTES, type AnimalInfo } from '../../config/animalConfig';
import { synth } from '../../audio/synth';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Volume2 } from 'lucide-react';

type SimonPhase = 'listening' | 'yourTurn' | 'success' | 'tryAgain';

interface SimonAnimalsGameProps {
  activeNotes: Set<number>;
  onExit: () => void;
}

export const SimonAnimalsGame: React.FC<SimonAnimalsGameProps> = ({
  activeNotes,
  onExit,
}) => {
  const [sequence, setSequence] = useState<AnimalInfo[]>([]);
  const [userStep, setUserStep] = useState<number>(0);
  const [phase, setPhase] = useState<SimonPhase>('listening');
  const [activeHighlight, setActiveHighlight] = useState<AnimalInfo | null>(null);
  const [round, setRound] = useState(1);

  const timersRef = useRef<number[]>([]);
  const playingMidiRef = useRef<number | null>(null);
  const prevActiveNotesRef = useRef<Set<number>>(new Set());

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(id => clearTimeout(id));
    timersRef.current = [];
    if (playingMidiRef.current !== null) {
      synth.noteOff(playingMidiRef.current);
      playingMidiRef.current = null;
    }
  }, []);

  const scheduleTimer = useCallback((fn: () => void, delayMs: number) => {
    const id = window.setTimeout(fn, delayMs);
    timersRef.current.push(id);
    return id;
  }, []);

  const getRandomAnimal = useCallback((forRound: number): AnimalInfo => {
    // Progresión gradual para 4 años:
    // Rondas 1-2: Do, Re, Mi (3 notas)
    // Rondas 3-4: Do, Re, Mi, Fa, Sol (5 notas)
    // Rondas 5+: Todas las 7 notas
    const poolSize = forRound <= 2 ? 3 : forRound <= 4 ? 5 : ANIMAL_NOTES.length;
    const pool = ANIMAL_NOTES.slice(0, poolSize);
    const randIdx = Math.floor(Math.random() * pool.length);
    return pool[randIdx];
  }, []);

  const playSequence = useCallback((seq: AnimalInfo[]) => {
    clearAllTimers();
    setPhase('listening');
    setUserStep(0);
    setActiveHighlight(null);

    const stepIntervalMs = 1050; // Ritmo tranquilo y claro ("pa... pa... pa...")
    const noteHoldMs = 650;      // Duración limpia de cada nota
    const startDelayMs = 450;

    seq.forEach((animal, index) => {
      const noteStart = startDelayMs + index * stepIntervalMs;

      scheduleTimer(() => {
        setActiveHighlight(animal);
        playingMidiRef.current = animal.midiDefault;
        synth.noteOn(animal.midiDefault, 0.85);

        scheduleTimer(() => {
          synth.noteOff(animal.midiDefault);
          if (playingMidiRef.current === animal.midiDefault) {
            playingMidiRef.current = null;
          }
          setActiveHighlight(null);
        }, noteHoldMs);
      }, noteStart);
    });

    const totalDuration = startDelayMs + seq.length * stepIntervalMs;
    scheduleTimer(() => {
      setActiveHighlight(null);
      setPhase('yourTurn');
    }, totalDuration);
  }, [clearAllTimers, scheduleTimer]);

  const startNewGame = useCallback(() => {
    clearAllTimers();
    const firstNote = [getRandomAnimal(1)];
    setSequence(firstNote);
    setRound(1);
    setUserStep(0);
    playSequence(firstNote);
  }, [clearAllTimers, getRandomAnimal, playSequence]);

  // Iniciar al montar y limpiar al salir
  useEffect(() => {
    startNewGame();
    return () => {
      clearAllTimers();
    };
  }, [startNewGame, clearAllTimers]);

  // Escuchar SOLO teclas recién pulsadas durante el turno del niño
  useEffect(() => {
    const prevNotes = prevActiveNotesRef.current;
    const newlyPressed: number[] = [];
    activeNotes.forEach(midi => {
      if (!prevNotes.has(midi)) {
        newlyPressed.push(midi);
      }
    });
    prevActiveNotesRef.current = new Set(activeNotes);

    if (newlyPressed.length === 0 || phase !== 'yourTurn' || sequence.length === 0) {
      return;
    }

    const midi = newlyPressed[0];
    const noteClass = ((midi % 12) + 12) % 12;
    const expectedAnimal = sequence[userStep];
    const touchedAnimal = ANIMAL_NOTES.find(a => a.noteClass === noteClass) || null;

    if (touchedAnimal) {
      setActiveHighlight(touchedAnimal);
      scheduleTimer(() => {
        setActiveHighlight(curr => (curr?.name === touchedAnimal.name ? null : curr));
      }, 350);
    }

    if (expectedAnimal && noteClass === expectedAnimal.noteClass) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);

      if (nextStep === sequence.length) {
        // ¡Completó toda la secuencia de la ronda!
        setPhase('success');
        confetti({
          particleCount: 30,
          spread: 65,
          origin: { y: 0.6 },
        });

        scheduleTimer(() => {
          synth.playSuccessChime();
        }, 250);

        scheduleTimer(() => {
          const nextRound = round + 1;
          setRound(nextRound);
          const nextSeq = [...sequence, getRandomAnimal(nextRound)];
          setSequence(nextSeq);
          playSequence(nextSeq);
        }, 1600);
      }
    } else {
      // Nota distinta: repetir la misma secuencia despacio sin frustración
      setPhase('tryAgain');
      scheduleTimer(() => {
        playSequence(sequence);
      }, 1300);
    }
  }, [activeNotes, phase, sequence, userStep, round, getRandomAnimal, playSequence, scheduleTimer]);

  return (
    <div className="mini-game-container simon-game">
      {/* Header */}
      <div className="mini-game-header">
        <button type="button" className="exit-game-btn" onClick={onExit}>
          ⬅ Volver al Escenario
        </button>
        <div className="game-badge-score">
          <Trophy size={20} className="text-yellow-400" />
          <span>Ronda {round} ({sequence.length} {sequence.length === 1 ? 'Nota' : 'Notas'})</span>
        </div>
      </div>

      <div className="simon-scene-title">
        <h2>🎯 El Eco de los Animalitos</h2>
        <p>Escucha las notas despacio y repítelas en tu Casio</p>
      </div>

      {/* Indicador de turno */}
      <div className="simon-status-banner">
        {phase === 'listening' && (
          <div className="turn-badge listening">
            <Volume2 size={24} className="animate-pulse" />
            <span>👂 ¡Escucha con atención!</span>
          </div>
        )}
        {phase === 'yourTurn' && (
          <div className="turn-badge your-turn animate-bounce">
            <Sparkles size={24} />
            <span>👉 ¡Tu turno! Toca {sequence.length - userStep === 1 ? '1 nota' : `${sequence.length - userStep} notas`}</span>
          </div>
        )}
        {phase === 'success' && (
          <div className="turn-badge success">
            <span>🎉 ¡¡BRAVO!! ¡Muy bien hecho!</span>
          </div>
        )}
        {phase === 'tryAgain' && (
          <div className="turn-badge try-again">
            <span>🎶 ¡Casi! Vamos a escucharla otra vez</span>
          </div>
        )}
      </div>

      {/* Progreso visual de pasos en la ronda */}
      <div className="simon-steps-bar">
        {sequence.map((animal, idx) => {
          const isDone = phase === 'success' || idx < userStep;
          const isCurrent = phase === 'yourTurn' && idx === userStep;
          return (
            <div
              key={`${idx}-${animal.name}`}
              className={`simon-step-dot ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
              style={{
                borderColor: isDone ? animal.color : isCurrent ? '#FACC15' : '#475569',
                backgroundColor: isDone ? animal.color : 'rgba(15, 23, 42, 0.7)',
              }}
            >
              {isDone ? animal.emoji : idx + 1}
            </div>
          );
        })}
      </div>

      {/* Panel de tarjetas de animales */}
      <div className="simon-animals-grid">
        {ANIMAL_NOTES.map(animal => {
          const isHighlighted = activeHighlight?.name === animal.name;

          return (
            <div
              key={animal.name}
              className={`simon-card ${isHighlighted ? 'highlighted' : ''}`}
              style={{
                borderColor: animal.color,
                '--animal-color': animal.color,
              } as React.CSSProperties}
            >
              <div className="simon-card-emoji">{animal.emoji}</div>
              <div className="simon-card-name" style={{ color: animal.color }}>{animal.name}</div>
              <div className="simon-card-note">{animal.letter} • {animal.solfege}</div>
              <div className="simon-card-dot" style={{ backgroundColor: animal.color }} />
            </div>
          );
        })}
      </div>

      {/* Botones de acción */}
      <div className="simon-actions-bar">
        <button
          type="button"
          className="repeat-seq-btn"
          onClick={() => playSequence(sequence)}
          disabled={phase === 'listening' || phase === 'success'}
        >
          <Volume2 size={18} />
          <span>Volver a escuchar</span>
        </button>
        <button
          type="button"
          className="repeat-seq-btn"
          onClick={startNewGame}
        >
          <RotateCcw size={18} />
          <span>Empezar de cero</span>
        </button>
      </div>
    </div>
  );
};
