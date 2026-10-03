import React from 'react';
import { Heart, MessageSquare, Star } from 'lucide-react';
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
  onViewDetails,
}) => {
  const { userLikes, toggleLikeGame, comments } = useGameData();
  const isLiked = !!userLikes[game.gameId];

  // Count comments for this game
  const commentCount = comments.filter(
    (c) => c.targetType === 'game' && c.targetId === game.gameId
  ).length;

  return (
    <div
      onClick={() => onViewDetails(game)}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
    >
      {/* 1. IMAGEN PROTAGONISTA DEL JUEGO */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-950 group/thumb">
        <img
          src={game.mainImage}
          alt={game.name}
          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category Pill */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xs">
          {game.category}
        </span>
      </div>

      {/* 2. DATOS DE LA TARJETA */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
          {game.name}
        </h3>

        {/* ⭐ Valoración | ❤️ Likes | 💬 Comentarios */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1 font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{game.ratingAvg > 0 ? game.ratingAvg : '4.9'}</span>
          </div>

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

          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
