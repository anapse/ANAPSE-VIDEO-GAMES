import React from 'react';
import { ExternalLink, Wrench } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';

export const ToolsView: React.FC = () => {
  const { tools } = useGameData();
  const visibleTools = tools.filter((tool) => tool.visible);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-extrabold font-['Orbitron']">
          <Wrench className="w-4 h-4" />
          HERRAMIENTAS ANAPSE
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Orbitron']">Herramientas</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">Utilidades y proyectos interactivos creados por ANAPSE.</p>
      </div>

      {visibleTools.length === 0 ? (
        <div className="max-w-xl mx-auto rounded-3xl p-10 text-center bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="text-5xl mb-4">🛠️</div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">No hay herramientas publicadas</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Las nuevas herramientas aparecerán aquí cuando sean publicadas desde el panel de administración.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleTools.map((tool) => (
            <article key={tool.id} className="relative overflow-hidden rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
              {tool.imageUrl ? (
                <img src={tool.imageUrl} alt="" className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-gradient-to-br from-amber-500/20 via-cyan-500/10 to-emerald-500/20 flex items-center justify-center">
                  <span className="text-6xl">🛠️</span>
                </div>
              )}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">{tool.name}</h2>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 min-h-[60px]">{tool.description}</p>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 transition-all active:scale-95">
                  Abrir herramienta <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
