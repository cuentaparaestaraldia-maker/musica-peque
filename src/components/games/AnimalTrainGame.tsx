import React, { useState, useEffect } from 'react';
import { ANIMAL_NOTES, type AnimalInfo } from '../../config/animalConfig';
import { synth } from '../../audio/synth';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw } from 'lucide-react';

interface AnimalTrainGameProps {
  activeNotes: Set<number>;
  onExit: () => void;
}

export const AnimalTrainGame: React.FC<AnimalTrainGameProps> = ({
  activeNotes,
  onExit,
}) => {
  const [boarded, setBoarded] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  // Secuencia de animales según la dirección
  const sequence: AnimalInfo[] = direction === 'up' ? [...ANIMAL_NOTES] : [...ANIMAL_NOTES].reverse();

  // Encontrar el siguiente animal que debe subir
  const nextStepIndex = boarded.findIndex(b => !b);
  const currentTarget = nextStepIndex !== -1 ? sequence[nextStepIndex] : null;

  useEffect(() => {
    if (activeNotes.size === 0 || isCompleted || !currentTarget) return;

    activeNotes.forEach(midi => {
      const noteClass = ((midi % 12) + 12) % 12;

      if (noteClass === currentTarget.noteClass) {
        // ¡Sube al vagón!
        synth.playAnimalSound(currentTarget.soundType);

        const newBoarded = [...boarded];
        newBoarded[nextStepIndex] = true;
        setBoarded(newBoarded);

        confetti({
          particleCount: 15,
          spread: 45,
          origin: { x: (nextStepIndex + 2) / 9, y: 0.6 },
          colors: [currentTarget.color, '#FACC15'],
        });

        // Si se han subido los 7
        if (nextStepIndex === 6) {
          setTimeout(() => {
            setIsCompleted(true);
            synth.playTrainWhistle();
            confetti({
              particleCount: 80,
              spread: 100,
              origin: { y: 0.5 },
            });
          }, 600);
        }
      }
    });
  }, [activeNotes, currentTarget, nextStepIndex, boarded, isCompleted]);

  const handleRestart = () => {
    setBoarded([false, false, false, false, false, false, false]);
    setIsCompleted(false);
  };

  const handleToggleDirection = () => {
    setDirection(d => (d === 'up' ? 'down' : 'up'));
    handleRestart();
  };

  return (
    <div className="mini-game-container train-game">
      {/* Barra superior */}
      <div className="mini-game-header">
        <button type="button" className="exit-game-btn" onClick={onExit}>
          ⬅ Volver al Escenario
        </button>
        <div className="train-direction-controls">
          <button
            type="button"
            className={`direction-pill ${direction === 'up' ? 'active' : ''}`}
            onClick={handleToggleDirection}
          >
            Escala Hacia Arriba 🚀 (Do ➔ Si)
          </button>
          <button
            type="button"
            className={`direction-pill ${direction === 'down' ? 'active' : ''}`}
            onClick={handleToggleDirection}
          >
            Escala Hacia Abajo 🛝 (Si ➔ Do)
          </button>
        </div>
      </div>

      <div className="train-scene-title">
        <h2>🚂 El Tren de las Escalas</h2>
        <p>Toca cada nota en orden para subir a todos los animalitos al tren</p>
      </div>

      {/* Escena del Tren y los Vagones */}
      <div className={`train-track-stage ${isCompleted ? 'train-moving' : ''}`}>
        {/* Locomotora */}
        <div className="train-locomotive">
          <div className="loco-smoke">💨</div>
          <span className="loco-emoji">🚂</span>
          <span className="loco-name">PIANO EXPRESS</span>
        </div>

        {/* 7 Vagones de Animales */}
        <div className="train-cars-row">
          {sequence.map((animal, idx) => {
            const hasBoarded = boarded[idx];
            const isWaiting = idx === nextStepIndex;

            return (
              <div
                key={animal.name}
                className={`train-wagon ${hasBoarded ? 'boarded' : ''} ${isWaiting ? 'waiting-target' : ''}`}
                style={{
                  '--wagon-color': animal.color,
                } as React.CSSProperties}
              >
                <div className="wagon-roof" />
                <div className="wagon-compartment">
                  {hasBoarded ? (
                    <span className="wagon-animal-emoji animate-bounce">{animal.emoji}</span>
                  ) : (
                    <span className="wagon-placeholder-emoji">❓</span>
                  )}
                </div>
                <div className="wagon-label" style={{ backgroundColor: animal.color }}>
                  <span className="wagon-animal-title">{animal.name}</span>
                  <span className="wagon-note-sub">{animal.letter} • {animal.solfege}</span>
                </div>
                <div className="wagon-wheels">
                  <div className="wheel" />
                  <div className="wheel" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicador del siguiente animalito */}
      <div className="train-instruction-box">
        {currentTarget && !isCompleted ? (
          <div className="next-passenger-card" style={{ borderColor: currentTarget.color }}>
            <span className="passenger-emoji">{currentTarget.emoji}</span>
            <div className="passenger-info">
              <h3>¡Sube a {currentTarget.name}!</h3>
              <p>Toca la tecla <strong>{currentTarget.solfege} ({currentTarget.letter})</strong> con la pegatina {currentTarget.color} en tu Casio</p>
            </div>
          </div>
        ) : isCompleted ? (
          <div className="train-completed-banner">
            <Sparkles size={32} className="text-yellow-400" />
            <div>
              <h3>¡¡TODO EL MUNDO AL TREN!! 🚂🎉</h3>
              <p>¡Has tocado la escala musical completa perfecta!</p>
            </div>
            <button type="button" className="action-btn kid-btn" onClick={handleRestart}>
              <RotateCcw size={20} />
              <span>Jugar de nuevo</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
