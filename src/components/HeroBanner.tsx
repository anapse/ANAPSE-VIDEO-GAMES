import React from 'react';
import { Play, Sparkles, Trophy, Users, Heart, ArrowRight, Flame, ShieldAlert, Star } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import { Game } from '../types';

interface HeroBannerProps {
  onPlayGame: (game: Game) => void;
  onExploreCatalog: () => void;
  onOpenProposals: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onPlayGame, onExploreCatalog, onOpenProposals }) => {
  const { games, globalAnalytics, announcements } = useGameData();

  const featuredGame = games.find((g) => g.gameId === 'fox-thief') || games[0];
  const activeAnnouncements = announcements.filter((a) => a.active);

  return (
    <div className="relative overflow-hidden pt-4 pb-8 sm:py-10">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[650px] h-64 sm:h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* News Flash Bar if announcements */}
        {activeAnnouncements.length > 0 && (
          <div className="mb-4 sm:mb-6 p-2 sm:p-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-indigo-950/80 border border-cyan-500/30 flex items-center justify-between gap-2 text-xs backdrop-blur-md shadow-lg shadow-cyan-950/20">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="shrink-0 px-2 py-0.5 rounded-lg bg-cyan-500 text-slate-950 font-black text-[10px] font-['Orbitron']">
                AVISO
              </span>
              <p className="text-slate-200 font-medium truncate text-xs sm:text-sm">
                {activeAnnouncements[0].title} — <span className="text-slate-400 text-xs hidden sm:inline">{activeAnnouncements[0].content}</span>
              </p>
            </div>
            {activeAnnouncements[0].actionLabel && (
              <a
                href={activeAnnouncements[0].actionUrl || '#'}
                className="shrink-0 text-cyan-400 hover:text-cyan-300 font-bold text-xs flex items-center gap-1 hover:underline"
              >
                <span>{activeAnnouncements[0].actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Main Hero Card */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 shadow-2xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide">
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>PORTAL OFICIAL DE VIDEOJUEGOS ANAPSE</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Orbitron'] tracking-tight leading-none">
                  JUEGA. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-orange-400">PROPÓN.</span> VOTA.
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl font-medium leading-relaxed">
                  Descubre el ecosistema central de videojuegos de ANAPSE. Juega al instante en tu navegador o celular, propón nuevas ideas de juegos, califica y compite por los récords mundiales.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {featuredGame && (
                  <button
                    onClick={() => onPlayGame(featuredGame)}
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm font-['Orbitron'] tracking-wider shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
                  >
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>JUGAR {featuredGame.name}</span>
                  </button>
                )}

                <button
                  onClick={onOpenProposals}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm font-['Orbitron'] shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>PROPONER JUEGO</span>
                </button>

                <button
                  onClick={onExploreCatalog}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
                >
                  <span>Ver Catálogo</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>

              {/* Key Platform Counters */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
                <div className="p-2 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Play className="w-3 h-3 text-cyan-400" /> Partidas
                  </p>
                  <p className="text-base sm:text-xl font-black text-cyan-300 font-['Orbitron']">
                    {globalAnalytics.totalPlays.toLocaleString()}
                  </p>
                </div>

                <div className="p-2 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400" /> Juegos
                  </p>
                  <p className="text-base sm:text-xl font-black text-amber-300 font-['Orbitron']">
                    {games.length}
                  </p>
                </div>

                <div className="p-2 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-400" /> Comunidad
                  </p>
                  <p className="text-base sm:text-xl font-black text-indigo-300 font-['Orbitron']">
                    +{globalAnalytics.totalUsers.toLocaleString()}
                  </p>
                </div>

                <div className="hidden sm:block p-2 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" /> Likes
                  </p>
                  <p className="text-base sm:text-xl font-black text-rose-300 font-['Orbitron']">
                    {globalAnalytics.totalLikes.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Game Showcase & Mini Live Card */}
            {featuredGame && (
              <div className="lg:col-span-5 relative group">
                <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-900 shadow-2xl shadow-cyan-500/15 transition-all duration-300 group-hover:border-cyan-400">
                  
                  {/* Hero Thumbnail */}
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={featuredGame.bannerImage || featuredGame.mainImage}
                      alt={featuredGame.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 font-black text-xs font-['Orbitron'] shadow-md">
                      <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                      <span>{featuredGame.status}</span>
                    </div>

                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{featuredGame.ratingAvg}</span>
                    </div>
                  </div>

                  {/* Info Overlay */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
                          {featuredGame.category}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white font-['Orbitron']">
                          {featuredGame.name}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">v{featuredGame.version}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {featuredGame.tagline || featuredGame.description}
                    </p>

                    {/* Mini Leaderboard preview */}
                    {featuredGame.rankingConfig?.enabled && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold">🥇 TOP 1:</span>
                          <span className="text-slate-200 font-semibold truncate max-w-[120px]">
                            {featuredGame.sampleLeaderboard?.[0]?.playerName || 'ShadowFox_99'}
                          </span>
                        </div>
                        <span className="font-mono font-black text-cyan-300">
                          {featuredGame.sampleLeaderboard?.[0]?.score?.toLocaleString() || '28,450'} {featuredGame.rankingConfig.unit || 'pts'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onPlayGame(featuredGame)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-['Orbitron'] flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20 active:scale-98"
                      >
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>JUGAR AHORA</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
