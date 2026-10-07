import React, { useState } from 'react';
import { X, ArrowLeft, ExternalLink } from 'lucide-react';
import { ToolItem } from '../types';

interface ToolModalPlayerProps {
  tool: ToolItem;
  onClose: () => void;
}

export const ToolModalPlayer: React.FC<ToolModalPlayerProps> = ({ tool, onClose }) => {
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-0 m-0 overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-3 left-3 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold border border-white/20 shadow-lg"
        title="Volver"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver
      </button>

      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20"
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
