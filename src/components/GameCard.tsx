import React from 'react';
import { Heart, MessageSquare, Play } from 'lucide-react';
import { Game } from '../types';
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
}) => {
  const { userLikes, toggleLikeGame, comments } = useGameData();
  const isLiked = !!userLikes[game.gameId];

  // Count comments for this game
  const commentCount = comments.filter(
    (c) => c.targetType === 'game' && c.targetId === game.gameId
  ).length;

  return (
    <div className="group rounded-2xl overflow-hidden bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
      
      {/* 1. THUMBNAIL / MINIATURA DEL JUEGO (Al hacer clic abre la ventana/modal) */}
      <div
        onClick={() => onPlay(game)}
        className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer group/thumb"
      >
        <img
          src={game.mainImage}
          alt={game.name}
          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Hover Play Overlay Icon */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-lg transform group-hover/thumb:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Category Pill */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xs">
          {game.category}
        </span>
      </div>

      {/* 2. TÍTULO Y MÉTRICAS (Igual al catálogo de descubrimiento de Roblox) */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <h3
          onClick={() => onPlay(game)}
          className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors line-clamp-1"
        >
          {game.name}
        </h3>

        {/* Únicamente Ícono de Corazón con contador e Ícono de Comentario con contador */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100/80 dark:border-slate-800/80">
          
          {/* Corazón (Like) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeGame(game.gameId);
            }}
            className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
              isLiked ? 'text-rose-500 font-bold' : ''
            }`}
            title="Me gusta"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-[11px] font-semibold">{game.likesCount}</span>
          </button>

          {/* Comentario (Count) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(game);
            }}
            className="flex items-center gap-1 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            title="Ver detalles y comentarios"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">{commentCount}</span>
          </button>

        </div>
      </div>

    </div>
  );
};
