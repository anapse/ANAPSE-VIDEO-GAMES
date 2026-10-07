import React from 'react';
import { ExternalLink, Wrench } from 'lucide-react';

export const ToolsView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-extrabold font-['Orbitron']">
          <Wrench className="w-4 h-4" />
          HERRAMIENTAS ANAPSE
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Orbitron']">
          Herramientas
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Utilidades y proyectos interactivos creados por ANAPSE.
        </p>
      </div>

      <div className="max-w-md mx-auto rounded-3xl p-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-4xl">
            🐨
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Mascoticas IA</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tu mascota virtual inteligente</p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Adopta una mascota, conversa con ella, cuídala y aprende jugando.
        </p>

        <a
          href="https://anapse.github.io/MascoticasIA/"
          target="_blank"
          rel="noreferrer"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 transition-all active:scale-95"
        >
          Abrir Mascoticas IA
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
