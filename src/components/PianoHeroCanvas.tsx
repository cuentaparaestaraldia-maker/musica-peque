import React, { useRef, useEffect } from 'react';
import type { Song, AppSettings, NoteEvent } from '../types/music';
import { getNoteDetails } from '../config/musicConfig';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

interface PianoHeroCanvasProps {
  song: Song;
  settings: AppSettings;
  currentBeat: number;
  isPlaying: boolean;
  activeNotes: Set<number>;
  onNoteHit?: (note: NoteEvent) => void;
  onSongFinished?: () => void;
}

export const PianoHeroCanvas: React.FC<PianoHeroCanvasProps> = ({
  song,
  settings,
  currentBeat,
  activeNotes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const { keyRangeStart, keyRangeEnd, noteColors, showNoteNames, hands } = settings;

  // Filtrar notas según la mano seleccionada (derecha, izquierda, ambas)
  const visibleNotes = song.notes.filter(n => {
    if (hands === 'right') return n.hand === 'right';
    if (hands === 'left') return n.hand === 'left';
    return true;
  });

  // Calcular métricas de teclas
  const keysInRange: ReturnType<typeof getNoteDetails>[] = [];
  for (let m = keyRangeStart; m <= keyRangeEnd; m++) {
    keysInRange.push(getNoteDetails(m));
  }
  const whiteKeys = keysInRange.filter(k => !k.isBlack);
  const totalWhite = whiteKeys.length;

  // Disparar partículas cuando se toca una nota
  useEffect(() => {
    if (activeNotes.size > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const whiteWidth = width / totalWhite;

      activeNotes.forEach(midi => {
        // Encontrar posición X
        const details = getNoteDetails(midi);
        const noteColor = noteColors[details.noteClass] || '#FFD700';
        
        let x = 0;
        if (!details.isBlack) {
          const wIndex = whiteKeys.findIndex(k => k.midi === midi);
          if (wIndex !== -1) x = (wIndex + 0.5) * whiteWidth;
        } else {
          const indexInAll = keysInRange.findIndex(k => k.midi === midi);
          const whiteBefore = keysInRange.slice(0, indexInAll).filter(k => !k.isBlack).length;
          x = whiteBefore * whiteWidth;
        }

        // Crear 12 partículas chispeantes
        for (let i = 0; i < 12; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4 + 2;
          particlesRef.current.push({
            x,
            y: height - 15,
            vx: Math.cos(angle) * speed,
            vy: -Math.abs(Math.sin(angle) * speed) - 1,
            color: noteColor,
            size: Math.random() * 6 + 4,
            alpha: 1,
            life: 1,
          });
        }
      });
    }
  }, [activeNotes, totalWhite, keysInRange, whiteKeys, noteColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Limpiar canvas con degradado de fondo nocturno moderno y limpio
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#0F172A');    // Slate 900
      bgGradient.addColorStop(1, '#1E293B');    // Slate 800
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const whiteWidth = width / totalWhite;
      const hitLineY = height - 12; // Línea de contacto justo encima del teclado

      // Guías de carriles verticales
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= totalWhite; i++) {
        const lineX = i * whiteWidth;
        ctx.beginPath();
        ctx.moveTo(lineX, 0);
        ctx.lineTo(lineX, height);
        ctx.stroke();
      }

      // Parámetros de la cascada
      const beatsVisible = 4.0; // Cuántos compases/beats se ven en pantalla a la vez
      const pixelsPerBeat = (height - 30) / beatsVisible;

      // Dibujar notas que caen
      visibleNotes.forEach(note => {
        // La distancia desde la línea de impacto depende de la diferencia de beat
        const beatDelta = note.time - currentBeat;
        const noteDurationPx = Math.max(24, note.duration * pixelsPerBeat);
        // La cabeza inferior de la nota llega a hitLineY cuando beatDelta === 0
        const bottomY = hitLineY - beatDelta * pixelsPerBeat;
        const topY = bottomY - noteDurationPx;

        // Descartar si está fuera de pantalla
        if (bottomY < -50 || topY > height + 50) return;

        // Calcular posición X
        const details = getNoteDetails(note.midi);
        let noteX = 0;
        let noteW = whiteWidth * 0.88;

        if (!details.isBlack) {
          const wIndex = whiteKeys.findIndex(k => k.midi === note.midi);
          if (wIndex === -1) return; // Fuera del rango visible
          noteX = wIndex * whiteWidth + (whiteWidth - noteW) / 2;
        } else {
          const indexInAll = keysInRange.findIndex(k => k.midi === note.midi);
          if (indexInAll === -1) return;
          const whiteBefore = keysInRange.slice(0, indexInAll).filter(k => !k.isBlack).length;
          noteW = whiteWidth * 0.65;
          noteX = whiteBefore * whiteWidth - noteW / 2;
        }

        const color = noteColors[details.noteClass] || '#38BDF8';
        const isCurrentTarget = note.isCurrent || (Math.abs(beatDelta) < 0.2 && !note.played);

        // Dibujar el bloque de nota redondeado estilo pastilla
        ctx.save();
        ctx.fillStyle = color;

        // Si está en la zona de impacto, agregar resplandor brillante
        if (isCurrentTarget) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 18;
        } else {
          ctx.shadowBlur = 0;
        }

        const radius = Math.min(10, noteW / 2);
        ctx.beginPath();
        ctx.roundRect(noteX, topY, noteW, noteDurationPx, radius);
        ctx.fill();

        // Brillo interior superior de cristal
        const highlightGrad = ctx.createLinearGradient(noteX, topY, noteX, topY + noteDurationPx);
        highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        highlightGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.1)');
        highlightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = highlightGrad;
        ctx.fill();

        // Borde fino blanco
        ctx.lineWidth = isCurrentTarget ? 2.5 : 1.2;
        ctx.strokeStyle = isCurrentTarget ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();

        // Etiqueta de la nota (Solfeo y Letra) en la parte inferior del bloque
        if (showNoteNames && noteDurationPx >= 20) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = 'bold 12px "Fredoka", "Nunito", sans-serif';
          
          const textY = bottomY - 14;
          if (textY > topY + 6) {
            ctx.fillText(details.solfege, noteX + noteW / 2, textY - 6);
            ctx.font = '10px "Fredoka", "Nunito", sans-serif';
            ctx.fillText(details.letter, noteX + noteW / 2, textY + 6);
          }
        }

        ctx.restore();
      });

      // Línea de impacto luminosa en la base
      ctx.save();
      const hitGrad = ctx.createLinearGradient(0, hitLineY - 4, 0, hitLineY + 6);
      hitGrad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      hitGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
      hitGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
      ctx.fillStyle = hitGrad;
      ctx.fillRect(0, hitLineY - 2, width, 4);
      ctx.restore();

      // Renderizar partículas y estrellas
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravedad suave
        p.alpha -= 0.02;
        p.life -= 0.02;

        if (p.alpha <= 0 || p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    currentBeat,
    visibleNotes,
    whiteKeys,
    totalWhite,
    keysInRange,
    noteColors,
    showNoteNames,
  ]);

  // Redimensionar canvas automáticamente al contenedor
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="piano-hero-canvas-wrapper">
      <canvas ref={canvasRef} className="piano-hero-canvas" />
    </div>
  );
};
