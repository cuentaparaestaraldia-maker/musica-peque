import React, { useState, useEffect } from 'react';
import { ANIMAL_NOTES, type AnimalInfo } from '../../config/animalConfig';
import { synth } from '../../audio/synth';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Volume2 } from 'lucide-react';

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
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<AnimalInfo | null>(null);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState<'listening' | 'yourTurn' | 'success' | 'tryAgain'>('listening');

  // Iniciar la primera ronda
  useEffect(() => {
    startNewGame();
  }, []);

  const getRandomAnimal = (): AnimalInfo => {
    // Para empezar usamos 4 animales cercanos (Do, Re, Mi, Fa) y luego los 7
    const pool = round <= 2 ? ANIMAL_NOTES.slice(0, 4) : ANIMAL_NOTES;
    const randIdx = Math.floor(Math.random() * pool.length);
    return pool[randIdx];
  };

  const startNewGame = () => {
    const firstTwo = [getRandomAnimal(), getRandomAnimal()];
    setSequence(firstTwo);
    setUserStep(0);
    setRound(1);
    playSequence(firstTwo);
  };

  const playSequence = (seq: AnimalInfo[]) => {
    setIsPlayingSequence(true);
    setFeedback('listening');
    setUserStep(0);

    seq.forEach((animal, index) => {
      setTimeout(() => {
        setActiveHighlight(animal);
        synth.noteOn(animal.midiDefault, 0.7);
        synth.playAnimalSound(animal.soundType);

        setTimeout(() => {
          synth.noteOff(animal.midiDefault);
          setActiveHighlight(null);
        }, 400);

        // Al terminar el último
        if (index === seq.length - 1) {
          setTimeout(() => {
            setIsPlayingSequence(false);
            setFeedback('yourTurn');
          }, 600);
        }
      }, (index + 1) * 750);
    });
  };

  // Escuchar respuestas del niño en el piano Casio
  useEffect(() => {
    if (activeNotes.size === 0 || isPlayingSequence || sequence.length === 0) return;

    activeNotes.forEach(midi => {
      const noteClass = ((midi % 12) + 12) % 12;
      const expectedAnimal = sequence[userStep];

      if (expectedAnimal && noteClass === expectedAnimal.noteClass) {
        // Acierto de este paso
        synth.playAnimalSound(expectedAnimal.soundType);
        setActiveHighlight(expectedAnimal);
        setTimeout(() => setActiveHighlight(null), 300);

        const nextStep = userStep + 1;
        setUserStep(nextStep);

        if (nextStep === sequence.length) {
          // ¡Completó la ronda!
          setFeedback('success');
          confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.6 },
          });

          setTimeout(() => {
            const nextRound = round + 1;
            setRound(nextRound);
            const nextSeq = [...sequence, getRandomAnimal()];
            setSequence(nextSeq);
            playSequence(nextSeq);
          }, 1200);
        }
      } else {
        // Falló una nota: repetir la secuencia amablemente
        setFeedback('tryAgain');
        setTimeout(() => {
          playSequence(sequence);
        }, 1200);
      }
    });
  }, [activeNotes, isPlayingSequence, sequence, userStep, round]);

  return (
    <div className="mini-game-container simon-game">
      {/* Header */}
      <div className="mini-game-header">
        <button type="button" className="exit-game-btn" onClick={onExit}>
          ⬅ Volver al Escenario
        </button>
        <div className="game-badge-score">
          <Trophy size={20} className="text-yellow-400" />
          <span>Ronda {round} ({sequence.length} Notas)</span>
        </div>
      </div>

      <div className="simon-scene-title">
        <h2>🎯 El Eco de los Animalitos</h2>
        <p>Escucha cómo cantan los animalitos y repite la misma canción con tu Casio</p>
      </div>

      {/* Indicador de turno */}
      <div className="simon-status-banner">
        {feedback === 'listening' && (
          <div className="turn-badge listening">
            <Volume2 size={24} className="animate-pulse" />
            <span>👂 ¡Escucha con atención a los animalitos!</span>
          </div>
        )}
        {feedback === 'yourTurn' && (
          <div className="turn-badge your-turn animate-bounce">
            <Sparkles size={24} />
            <span>👉 ¡Ahora te toca a ti! Toca en tu piano</span>
          </div>
        )}
        {feedback === 'success' && (
          <div className="turn-badge success">
            <span>🎉 ¡¡BRAVO!! ¡Memoria fantástica!</span>
          </div>
        )}
        {feedback === 'tryAgain' && (
          <div className="turn-badge try-again">
            <span>🎶 ¡Casi! Vamos a escucharla otra vez</span>
          </div>
        )}
      </div>

      {/* Panel de botones de animales interactivos */}
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

      {/* Botón para repetir la secuencia si el niño lo necesita */}
      <div className="simon-actions-bar">
        <button
          type="button"
          className="repeat-seq-btn"
          onClick={() => playSequence(sequence)}
          disabled={isPlayingSequence}
        >
          <RotateCcw size={20} />
          <span>Volver a escuchar</span>
        </button>
      </div>
    </div>
  );
};
