import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, ExternalLink } from 'lucide-react';
import { ToolItem } from '../types';

interface ToolModalPlayerProps {
  tool: ToolItem;
  onClose: () => void;
}

export const ToolModalPlayer: React.FC<ToolModalPlayerProps> = ({ tool, onClose }) => {
  const [iframeError, setIframeError] = useState(false);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const historyEntryAddedRef = useRef(false);
  const handlingExitRef = useRef(false);

  const requestExit = () => {
    setShowExitPrompt(true);
  };

  const cancelExit = () => {
    setShowExitPrompt(false);

    if (!historyEntryAddedRef.current && typeof window !== 'undefined') {
      const stateName = `tool-${tool.id}`;
      window.history.pushState({ activeTool: stateName }, '', window.location.href);
      historyEntryAddedRef.current = true;
    }
  };

  const confirmExit = () => {
    handlingExitRef.current = true;
    setShowExitPrompt(false);
    onClose();
  };

  // Mobile history handling: same flow as GameModalPlayer.
  // Android/iOS Back is intercepted and converted into the exit confirmation.
  useEffect(() => {
    const isMobileView =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 639px)').matches;

    if (!isMobileView || historyEntryAddedRef.current) return;

    const stateName = `tool-${tool.id}`;
    window.history.pushState({ activeTool: stateName }, '', window.location.href);
    historyEntryAddedRef.current = true;

    const handlePopState = () => {
      historyEntryAddedRef.current = false;

      if (!handlingExitRef.current) {
        setShowExitPrompt(true);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Never call history.back() during React cleanup.
      historyEntryAddedRef.current = false;
    };
  }, [tool.id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black p-0 m-0 overflow-hidden overscroll-none touch-none"
      style={{ contain: 'strict' }}
    >
      {showExitPrompt && (
        <div className="absolute inset-x-3 top-4 z-[60] flex justify-center pointer-events-none">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="exit-tool-title"
            className="pointer-events-auto w-full max-w-sm rounded-2xl bg-slate-900/95 border border-amber-400/40 shadow-2xl p-4 text-white animate-in slide-in-from-top-3 duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-lg">
                ⚠️
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="exit-tool-title" className="font-bold text-sm">
                  ¿Quieres salir de la herramienta?
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  La herramienta actual podría perderse si sales.
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={cancelExit}
                className="py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors active:scale-95"
              >
                CONTINUAR
              </button>
              <button
                type="button"
                onClick={confirmExit}
                className="py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors active:scale-95"
              >
                SALIR
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={requestExit}
        className="absolute top-3 left-3 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold border border-white/20 shadow-lg active:scale-95 transition-all"
        title="Volver a herramientas"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>← Volver</span>
      </button>

      <button
        onClick={requestExit}
        className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 active:scale-95 transition-all"
        title="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="w-full h-full max-w-7xl mx-auto bg-white dark:bg-slate-950 overflow-hidden relative">
        {!iframeError ? (
          <iframe
            src={tool.url}
            title={tool.name}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad; microphone; camera"
            allowFullScreen
            onError={() => setIframeError(true)}
          />
        ) : (
          <div className="h-full flex items-center justify-center p-6 text-center">
            <div className="max-w-sm space-y-4">
              <div className="text-5xl">🛠️</div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{tool.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">{tool.description}</p>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir en nueva pestaña
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
