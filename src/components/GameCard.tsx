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

  const commentCount = comments.filter(
    (c) => c.targetType === 'game' && c.targetId === game.gameId
  ).length;

  return (
    <div
      onClick={() => onViewDetails(game)}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      {/* Portada protagonista: más grande y sin una franja inferior de controles */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-950 group/thumb">
        <img
          src={game.mainImage}
          alt={game.name}
          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <span className="absolute top-2 left-2 max-w-[65%] truncate px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-950/75 text-white border border-white/20 backdrop-blur-sm">
          {game.category}
        </span>

        {/* Acciones flotantes sobre la portada; no consumen altura de la tarjeta */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeGame(game.gameId);
            }}
            className={`flex items-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-bold text-white bg-slate-950/75 hover:bg-slate-950/90 backdrop-blur-sm border border-white/20 transition-colors ${isLiked ? 'text-rose-300' : ''}`}
            title="Me gusta"
            aria-label={`Me gusta ${game.name}`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-400' : ''}`} />
            <span>{game.likesCount}</span>
          </button>

          <div
            className="flex items-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-bold text-white bg-slate-950/75 backdrop-blur-sm border border-white/20"
            title={`${commentCount} comentarios`}
            aria-label={`${commentCount} comentarios`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{commentCount}</span>
          </div>
        </div>
      </div>

      {/* Pie compacto: solo nombre y valoración */}
      <div className="px-3 py-2.5 flex flex-col gap-1.5">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
          {game.name}
        </h3>

        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span className={game.ratingsCount > 0 ? 'font-bold text-amber-500' : ''}>
            {game.ratingsCount > 0 ? game.ratingAvg.toFixed(1) : 'Sin calificación'}
          </span>
        </div>
      </div>
    </div>
  );
};
