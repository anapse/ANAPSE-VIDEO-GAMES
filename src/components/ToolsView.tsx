import React from 'react';
import { Wrench } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';

interface ToolsViewProps {
  onOpenTool: (tool: import('../types').ToolItem) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ onOpenTool }) => {
  const { tools } = useGameData();
  const visibleTools = tools.filter((tool) => tool.visible);

  return (
    <div className="w-full mx-auto py-4 space-y-5 animate-in fade-in">
      <div className="text-left space-y-1.5">
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
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {visibleTools.map((tool) => (
            <article key={tool.id} role="button" tabIndex={0} onClick={() => onOpenTool(tool)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenTool(tool); } }} aria-label={`Abrir ${tool.name}`} className="group cursor-pointer overflow-hidden rounded-2xl bg-white/30 dark:bg-stone-950/15 backdrop-blur-md border border-white/55 dark:border-amber-100/20 shadow-[0_7px_20px_rgba(25,20,12,0.16),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_15px_30px_rgba(25,20,12,0.24),inset_0_1px_0_rgba(255,255,255,0.55)] hover:-translate-y-2 hover:scale-[1.015] transition-all duration-300 flex flex-col focus-visible:outline-2 focus-visible:outline-amber-500">
              {tool.imageUrl ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-transparent flex items-center justify-center"><img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" /></div>
              ) : (
                <div className="w-full aspect-[4/3] bg-transparent flex items-center justify-center">
                  <span className="text-6xl">🛠️</span>
                </div>
              )}
              <div className="px-3 py-2.5 space-y-2 bg-white/30 dark:bg-stone-950/15 border-t border-white/40 dark:border-white/10 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white drop-shadow-[0_1px_2px_rgba(255,255,255,0.35)] font-['Plus_Jakarta_Sans'] line-clamp-1">{tool.name}</h2>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-800 dark:text-slate-100 min-h-[42px]">{tool.description}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
