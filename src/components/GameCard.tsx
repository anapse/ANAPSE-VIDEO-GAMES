import React from 'react';
import {
  Play,
  Star,
  Heart,
  Trophy,
  ExternalLink,
  Share2,
  Bookmark,
  Eye,
  Sparkles,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { Game, GameStatus } from '../types';
import { useGameData } from '../context/GameDataContext';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  onViewDetails: (game: Game) => void;
  onShare: (game: Game) => void;
  onDonate: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onPlay,
  onViewDetails,
  onShare,
  onDonate,
}) => {
  const { userLikes, toggleLikeGame } = useGameData();
  const isLiked = !!userLikes[game.gameId];

  // Status badge styling
  const getStatusBadge = (status: GameStatus) => {
    switch (status) {
      case 'PUBLICADO':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'BETA':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'EN PROMOCIÓN':
        return 'bg-gradient-to-r from-orange-500/30 to-amber-500/30 text-amber-300 border-amber-500/40 animate-pulse';
      case 'EN CREACIÓN':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'EN REPARACIÓN':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'PRÓXIMAMENTE':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'PROPUESTO':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      case 'SIN CATEGORÍA':
      default:
        return 'bg-slate-700/30 text-slate-400 border-slate-600/40';
    }
  };

  const hasRanking = game.rankingConfig?.enabled;
  const topRecord = game.sampleLeaderboard?.[0];

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-slate-900/85 border border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image Section */}
      <div className="relative aspect-video sm:aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={game.mainImage}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Status Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border backdrop-blur-md ${getStatusBadge(
              game.status
            )}`}
          >
            {game.status}
          </span>
          {game.inPromotion && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950">
              PROMO
            </span>
          )}
        </div>

        {/* Like Button on Image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLikeGame(game.gameId);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
            isLiked
              ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
              : 'bg-slate-950/70 text-slate-300 border-slate-700 hover:text-rose-400 hover:border-rose-400/40'
          }`}
          title="Dar Like"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Category tag on image bottom */}
        <div className="absolute bottom-2.5 left-3">
          <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-slate-700/60 text-[10px] font-bold text-cyan-400">
            {game.category}
          </span>
        </div>

        {/* Platforms */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800 text-[10px]">
          {game.platforms.includes('Android') && <Smartphone className="w-3 h-3" />}
          {game.platforms.includes('Web') && <Monitor className="w-3 h-3" />}
          <span className="font-medium text-[9px]">{game.platforms.length} platf.</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onViewDetails(game)}
              className="text-base sm:text-lg font-black text-white font-['Orbitron'] hover:text-cyan-400 cursor-pointer transition-colors line-clamp-1"
            >
              {game.name}
            </h3>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">v{game.version}</span>
          </div>

          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {game.tagline || game.description}
          </p>
        </div>

        {/* Stats Row: ⭐ Valoración | ❤️ Likes | 🎮 Partidas */}
        <div className="grid grid-cols-3 gap-1 py-2 px-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-black text-slate-200">{game.ratingAvg > 0 ? game.ratingAvg : '-'}</span>
          </div>

          <div className="flex items-center gap-1 justify-center">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold text-slate-200">
              {game.likesCount > 999 ? `${(game.likesCount / 1000).toFixed(1)}K` : game.likesCount}
            </span>
          </div>

          <div className="flex items-center gap-1 justify-end">
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">
              {game.playsCount > 999 ? `${(game.playsCount / 1000).toFixed(1)}K` : game.playsCount}
            </span>
          </div>
        </div>

        {/* Ranking & Record Row (Mandatory as per Section 12) */}
        <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] flex items-center justify-between">
          {hasRanking ? (
            <>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-bold text-amber-300">TOP {game.rankingConfig?.limit || 50}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-amber-400 font-extrabold">🥇</span>
                <span className="font-mono font-bold text-slate-200 truncate max-w-[90px]">
                  {topRecord ? `${topRecord.score.toLocaleString()} ${game.rankingConfig?.unit || 'pts'}` : 'Sin récords'}
                </span>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-center gap-1.5 text-slate-400 font-bold py-0.5">
              <Trophy className="w-3.5 h-3.5 text-slate-500" />
              <span>SIN RANKING</span>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center gap-2 pt-1">
          {/* Primary Play Button */}
          <button
            onClick={() => onPlay(game)}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs font-['Orbitron'] tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>JUGAR</span>
          </button>

          {/* Details Button */}
          <button
            onClick={() => onViewDetails(game)}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all"
            title="Ver Ficha Completa"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare(game)}
            className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-cyan-400 border border-slate-700 transition-all"
            title="Compartir Juego"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Donate / Support Button */}
          <button
            onClick={() => onDonate(game)}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30 text-rose-300 border border-rose-500/30 transition-all"
            title="Apoyar este juego"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
