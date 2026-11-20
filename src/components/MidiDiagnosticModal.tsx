import React, { useState, useEffect } from 'react';
import type { MidiDeviceInfo } from '../types/music';
import { midiManager } from '../audio/midi';
import { Cpu, X, CheckCircle2, AlertTriangle, RefreshCw, Terminal, HelpCircle } from 'lucide-react';

interface MidiDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: MidiDeviceInfo[];
  onRetry: () => void;
  lastMidiEvent: string | null;
}

export const MidiDiagnosticModal: React.FC<MidiDiagnosticModalProps> = ({
  isOpen,
  onClose,
  devices,
  onRetry,
  lastMidiEvent,
}) => {
  const [eventHistory, setEventHistory] = useState<string[]>([]);
  const isSupported = midiManager.checkSupport();
  const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isFirefox = typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent);
  const lastError = midiManager.getLastError();

  useEffect(() => {
    if (lastMidiEvent) {
      setEventHistory(prev => [lastMidiEvent, ...prev.slice(0, 9)]);
    }
  }, [lastMidiEvent]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card midi-diag-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Cpu className="modal-icon text-cyan-400" size={28} />
            <div>
              <h2>Diagnóstico de Conexión MIDI</h2>
              <p>Comprueba si tu Mac y el navegador detectan tu Casio Privia</p>
            </div>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* 1. Comprobación del navegador */}
          <div className="diag-step-card">
            <div className="diag-step-header">
              {isSafari ? (
                <AlertTriangle className="text-amber-400" size={22} />
              ) : isFirefox ? (
                <AlertTriangle className="text-amber-400" size={22} />
              ) : isSupported ? (
                <CheckCircle2 className="text-emerald-400" size={22} />
              ) : (
                <AlertTriangle className="text-rose-400" size={22} />
              )}
              <div className="diag-step-info">
                <h3>1. Compatibilidad del Navegador</h3>
                {isSafari ? (
                  <p className="text-amber-300 font-semibold">
                    ⚠️ Estás usando Safari en tu Mac. Safari NO tiene soporte completo para Web MIDI. Por favor, abre este enlace en <strong>Google Chrome</strong> o <strong>Microsoft Edge</strong>.
                  </p>
                ) : isFirefox ? (
                  <div>
                    <p className="text-amber-300 font-semibold mb-2">
                      🦊 Estás usando Mozilla Firefox.
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed mb-3">
                      Firefox protege la privacidad y <strong>no permite</strong> conectar pianos MIDI en segundo plano. Requiere que hagas un clic explícito para mostrar su aviso de instalación de permiso (<em>"Site Permission Add-on"</em>).
                    </p>
                    <button
                      type="button"
                      className="action-btn scan-btn bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded"
                      onClick={onRetry}
                    >
                      👉 Pulsa aquí para activar el permiso en Firefox
                    </button>
                    {lastError && (
                      <p className="text-rose-300 text-xs mt-2">
                        Estado Firefox: {lastError}
                      </p>
                    )}
                  </div>
                ) : isSupported ? (
                  <p className="text-slate-300">
                    Tu navegador (Chrome / Edge) soporta Web MIDI API de forma nativa.
                  </p>
                ) : (
                  <p className="text-rose-300">
                    Este navegador no permite acceso MIDI. Te recomendamos usar Google Chrome.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Dispositivos USB detectados */}
          <div className="diag-step-card">
            <div className="diag-step-header">
              {devices.length > 0 ? (
                <CheckCircle2 className="text-emerald-400" size={22} />
              ) : (
                <AlertTriangle className="text-amber-400" size={22} />
              )}
              <div className="diag-step-info">
                <h3>2. Dispositivos MIDI detectados ({devices.length})</h3>
                {devices.length > 0 ? (
                  <ul className="device-list">
                    {devices.map(d => (
                      <li key={d.id} className="device-item">
                        <span className="device-name font-bold text-emerald-300">{d.name}</span>
                        <span className="device-meta text-xs text-slate-400">
                          Fabricante: {d.manufacturer || 'Casio / USB'} | Estado: {d.state}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-amber-300">
                    No se detecta ningún piano MIDI conectado por USB en este momento.
                  </p>
                )}
              </div>
              <button type="button" className="action-btn scan-btn" onClick={onRetry}>
                <RefreshCw size={16} />
                Reescanear
              </button>
            </div>
          </div>

          {/* 3. Monitor de eventos en tiempo real */}
          <div className="diag-step-card">
            <div className="diag-step-header">
              <Terminal className="text-cyan-400" size={22} />
              <div className="diag-step-info">
                <h3>3. Monitor de Señales en Vivo</h3>
                <p className="text-xs text-slate-400">
                  Toca una tecla en tu Casio Privia. Si la señal llega al Mac, verás el evento aparecer aquí abajo:
                </p>
              </div>
            </div>
            <div className="midi-console">
              {eventHistory.length === 0 ? (
                <div className="console-empty">
                  Esperando a que toques alguna tecla en el piano...
                </div>
              ) : (
                eventHistory.map((ev, idx) => (
                  <div key={idx} className="console-line">
                    <span className="console-indicator">▶</span> {ev}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4. Guía rápida de troubleshooting en Mac */}
          <div className="mac-troubleshoot-guide">
            <div className="guide-title">
              <HelpCircle size={18} className="text-sky-400" />
              <h4>Pasos para comprobar tu Mac y cable:</h4>
            </div>
            <ol className="guide-list">
              <li>
                <strong>Comprueba la app nativa de Mac:</strong> Pulsa <code>Cmd + Espacio</code>, abre <strong>Configuración de Audio MIDI</strong>, ve a <em>Ventana &gt; Mostrar estudio MIDI</em> (Cmd+2). Si el piano no sale ahí, el cable o el adaptador USB no están pasando datos.
              </li>
              <li>
                <strong>Adaptador USB-C / Hub:</strong> Los Macs modernos usan puertos USB-C. Asegúrate de que el adaptador USB-A a USB-C que usas transmita datos (algunos son sólo cables de carga). Prueba a conectarlo en otro puerto del Mac.
              </li>
              <li>
                <strong>Permisos en Chrome:</strong> Haz clic en el icono del candado / ajustes a la izquierda de la URL en la barra de Chrome y comprueba que <em>Dispositivos MIDI</em> esté en <strong>Permitir</strong>.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
