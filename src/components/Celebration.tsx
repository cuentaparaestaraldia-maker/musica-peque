import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, ArrowRight } from 'lucide-react';
import { synth } from '../audio/synth';

interface CelebrationProps {
  songTitle: string;
  onReplay: () => void;
  onNextSong: () => void;
}

export const Celebration: React.FC<CelebrationProps> = ({
  songTitle,
  onReplay,
  onNextSong,
}) => {
  useEffect(() => {
    // Sonido de victoria brillante
    synth.playSuccessChime();

    // Ráfaga de confeti de colores
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#EF4444', '#F97316', '#FACC15', '#22C55E', '#06B6D4', '#6366F1', '#EC4899'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#EF4444', '#F97316', '#FACC15', '#22C55E', '#06B6D4', '#6366F1', '#EC4899'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="celebration-overlay">
      <div className="celebration-box animate-pop">
        <div className="stars-row">
          <Star size={56} className="star-icon star-1" fill="#FACC15" color="#EAB308" />
          <Star size={72} className="star-icon star-2" fill="#FACC15" color="#EAB308" />
          <Star size={56} className="star-icon star-3" fill="#FACC15" color="#EAB308" />
        </div>

        <h1 className="celebration-title">¡¡BRAVO!! 🎉</h1>
        <p className="celebration-subtitle">¡Has tocado genial {songTitle}!</p>

        <div className="celebration-actions">
          <button type="button" className="kid-btn replay-btn" onClick={onReplay}>
            <RotateCcw size={28} />
            <span>Otra Vez</span>
          </button>
          <button type="button" className="kid-btn next-btn" onClick={onNextSong}>
            <span>Siguiente</span>
            <ArrowRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};
