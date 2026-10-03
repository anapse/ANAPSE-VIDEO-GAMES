import React from 'react';
import { Play, Flame, ArrowRight, Gamepad2, Star } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import { Game } from '../types';

interface HeroBannerProps {
  onPlayGame: (game: Game) => void;
  onExploreCatalog: () => void;
  onOpenProposals: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onPlayGame, onExploreCatalog, onOpenProposals }) => {
  const { games, announcements } = useGameData();

  const featuredGame = games.find((g) => g.gameId === 'fox-thief') || games[0];
  const activeAnnouncements = announcements.filter((a) => a.active);

  return (
    <div className="relative overflow-hidden pt-4 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
        
        {/* News Flash Bar if announcements */}
        {activeAnnouncements.length > 0 && (
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="shrink-0 px-2 py-0.5 rounded-md bg-cyan-600 text-white font-bold text-[10px] font-['Orbitron']">
                AVISO
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium truncate text-xs">
                {activeAnnouncements[0].title} — <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">{activeAnnouncements[0].content}</span>
              </p>
            </div>
            {activeAnnouncements[0].actionLabel && (
              <a
                href={activeAnnouncements[0].actionUrl || '#'}
                className="shrink-0 text-cyan-700 dark:text-cyan-400 font-bold text-xs flex items-center gap-1 hover:underline"
              >
                <span>{activeAnnouncements[0].actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Main Hero Card */}
        {featuredGame && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>JUEGO DESTACADO DEL MES</span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Orbitron']">
                    {featuredGame.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {featuredGame.tagline || featuredGame.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{featuredGame.ratingAvg || 4.9}</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-500 dark:text-slate-400">{featuredGame.category}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onPlayGame(featuredGame)}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>▶ JUGAR GRATIS</span>
                  </button>

                  <button
                    onClick={onExploreCatalog}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Ver Catálogo</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Featured Game Thumbnail */}
              <div className="lg:col-span-5 relative group cursor-pointer" onClick={() => onPlayGame(featuredGame)}>
                <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs relative">
                  <img
                    src={featuredGame.mainImage}
                    alt={featuredGame.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
