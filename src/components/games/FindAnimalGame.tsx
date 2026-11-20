import React, { useState, useEffect, useRef } from 'react';
import { ANIMAL_NOTES, type AnimalInfo } from '../../config/animalConfig';
import { synth } from '../../audio/synth';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Volume2 } from 'lucide-react';

type FindMode = 'random' | 'asc' | 'desc' | 'fifths';

// Orden por quintas musicales (Do -> Sol -> Re -> La -> Mi -> Si -> Fa)
const FIFTHS_ORDER = [0, 4, 1, 5, 2, 6, 3];

interface FindAnimalGameProps {
  activeNotes: Set<number>;
  onNoteTriggered?: (midi: number) => void;
  onExit: () => void;
}

export const FindAnimalGame: React.FC<FindAnimalGameProps> = ({
  activeNotes,
  onExit,
}) => {
  const [mode, setMode] = useState<FindMode>('random');
  const [currentIndex, setCurrentIndex] = useState<number>(() => Math.floor(Math.random() * ANIMAL_NOTES.length));
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'wrong'>('idle');
  const [lastTouchedAnimal, setLastTouchedAnimal] = useState<AnimalInfo | null>(null);

  const prevActiveNotesRef = useRef<Set<number>>(new Set());
  const timerRef = useRef<number | null>(null);

  const targetAnimal = ANIMAL_NOTES[currentIndex];

  const getNextIndex = (currIdx: number, currentMode: FindMode): number => {
    const total = ANIMAL_NOTES.length;
    if (currentMode === 'asc') {
      return (currIdx + 1) % total;
    }
    if (currentMode === 'desc') {
      return (currIdx - 1 + total) % total;
    }
    if (currentMode === 'fifths') {
      const pos = FIFTHS_ORDER.indexOf(currIdx);
      const nextPos = (pos + 1) % FIFTHS_ORDER.length;
      return FIFTHS_ORDER[nextPos];
    }
    // Aleatorio sin repetir inmediatamente el mismo animal
    let nextIdx = Math.floor(Math.random() * total);
    while (nextIdx === currIdx) {
      nextIdx = Math.floor(Math.random() * total);
    }
    return nextIdx;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Escuchar solo teclas recién pulsadas en la Casio Privia
  useEffect(() => {
    const prevNotes = prevActiveNotesRef.current;
    const newlyPressed: number[] = [];
    activeNotes.forEach(midi => {
      if (!prevNotes.has(midi)) {
        newlyPressed.push(midi);
      }
    });
    prevActiveNotesRef.current = new Set(activeNotes);

    if (newlyPressed.length === 0 || feedback === 'success') return;

    const midi = newlyPressed[0];
    const noteClass = ((midi % 12) + 12) % 12;
    const touched = ANIMAL_NOTES.find(a => a.noteClass === noteClass);

    if (noteClass === targetAnimal.noteClass) {
      // ¡¡ACIERTO!!
      setFeedback('success');
      synth.playAnimalSound(targetAnimal.soundType);
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: [targetAnimal.color, '#FACC15', '#FFFFFF'],
      });

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setScore(s => s + 1);
        setFeedback('idle');
        setLastTouchedAnimal(null);
        setCurrentIndex(idx => getNextIndex(idx, mode));
      }, 1150);
    } else if (touched) {
      // Nota incorrecta pero amigable
      setFeedback('wrong');
      setLastTouchedAnimal(touched);
      synth.playAnimalSound(touched.soundType);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setFeedback('idle'), 1300);
    }
  }, [activeNotes, targetAnimal, feedback, mode]);

  const handleModeChange = (newMode: FindMode) => {
    setMode(newMode);
    setFeedback('idle');
    setLastTouchedAnimal(null);
    if (newMode === 'asc') setCurrentIndex(0);
    else if (newMode === 'desc') setCurrentIndex(ANIMAL_NOTES.length - 1);
    else if (newMode === 'fifths') setCurrentIndex(0);
    else setCurrentIndex(idx => getNextIndex(idx, 'random'));
  };

  const playTargetSound = () => {
    synth.noteOn(targetAnimal.midiDefault, 0.8);
    synth.playAnimalSound(targetAnimal.soundType);
    setTimeout(() => synth.noteOff(targetAnimal.midiDefault), 500);
  };

  return (
    <div className="mini-game-container find-animal-game">
      {/* Barra superior del minijuego */}
      <div className="mini-game-header">
        <button type="button" className="exit-game-btn" onClick={onExit}>
          ⬅ Volver al Escenario
        </button>

        {/* Selector de orden / variedad */}
        <div className="train-direction-controls">
          <button
            type="button"
            className={`direction-pill ${mode === 'random' ? 'active' : ''}`}
            onClick={() => handleModeChange('random')}
          >
            🎲 Aleatorio
          </button>
          <button
            type="button"
            className={`direction-pill ${mode === 'asc' ? 'active' : ''}`}
            onClick={() => handleModeChange('asc')}
          >
            🚀 Subiendo
          </button>
          <button
            type="button"
            className={`direction-pill ${mode === 'desc' ? 'active' : ''}`}
            onClick={() => handleModeChange('desc')}
          >
            🛝 Bajando
          </button>
          <button
            type="button"
            className={`direction-pill ${mode === 'fifths' ? 'active' : ''}`}
            onClick={() => handleModeChange('fifths')}
          >
            🦘 Saltos (5ªs)
          </button>
        </div>

        <div className="game-badge-score">
          <Trophy size={20} className="text-yellow-400" />
          <span>¡{score} Encontrados!</span>
        </div>
      </div>

      {/* Tarjeta gigante del animalito a buscar */}
      <div
        className={`animal-target-card ${feedback === 'success' ? 'success-pulse' : ''}`}
        style={{ borderColor: targetAnimal.color }}
      >
        <div className="animal-card-top" style={{ backgroundColor: targetAnimal.bgLight }}>
          <span className="animal-big-emoji">{targetAnimal.emoji}</span>
        </div>

        <div className="animal-card-body">
          <div className="animal-title-wrap">
            <h2 className="animal-big-name" style={{ color: targetAnimal.color }}>
              {targetAnimal.name}
            </h2>
            <div className="animal-notes-pill" style={{ backgroundColor: targetAnimal.color }}>
              <span>{targetAnimal.letter} • {targetAnimal.solfege}</span>
            </div>
          </div>

          <p className="animal-phrase">{targetAnimal.phrase}</p>

          <div className="animal-hint-box">
            <span className="hint-label">Pista del piano:</span>
            <span className="hint-text">{targetAnimal.hint}</span>
          </div>

          <button
            type="button"
            className="listen-animal-btn"
            onClick={playTargetSound}
            style={{ backgroundColor: targetAnimal.color }}
          >
            <Volume2 size={24} />
            <span>Escuchar a {targetAnimal.name}</span>
          </button>
        </div>
      </div>

      {/* Feedback interactivo en pantalla */}
      <div className="game-feedback-area">
        {feedback === 'success' && (
          <div className="feedback-badge success">
            <Sparkles size={26} />
            <span>¡SÍII! ¡Has encontrado a {targetAnimal.name}! 🎉</span>
          </div>
        )}
        {feedback === 'wrong' && lastTouchedAnimal && (
          <div className="feedback-badge wrong">
            <span>¡Casi! Has tocado a {lastTouchedAnimal.name} {lastTouchedAnimal.emoji}. ¡Busca a {targetAnimal.name}!</span>
          </div>
        )}
        {feedback === 'idle' && (
          <div className="feedback-badge instruction">
            <span>Toca la tecla de {targetAnimal.name} ({targetAnimal.letter} • {targetAnimal.solfege}) en tu Casio Privia</span>
          </div>
        )}
      </div>

      {/* Mini carrusel con todos los animalitos desbloqueados */}
      <div className="animals-collection-bar">
        {ANIMAL_NOTES.map((a, idx) => {
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={a.name}
              className={`collection-avatar ${isCurrent ? 'active' : ''}`}
              style={{
                borderColor: isCurrent ? a.color : 'transparent',
                backgroundColor: a.bgLight,
              }}
              onClick={() => {
                setFeedback('idle');
                setCurrentIndex(idx);
              }}
            >
              <span className="avatar-emoji">{a.emoji}</span>
              <span className="avatar-sub">{a.letter}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
