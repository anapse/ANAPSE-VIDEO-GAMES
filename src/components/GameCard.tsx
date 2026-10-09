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
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white/15 dark:bg-stone-950/25 backdrop-blur-xl border border-white/45 dark:border-amber-100/20 shadow-[0_8px_24px_rgba(25,20,12,0.22),inset_0_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_18px_36px_rgba(25,20,12,0.34),inset_0_1px_0_rgba(255,255,255,0.45)] hover:-translate-y-2 hover:scale-[1.015] transition-all duration-300 flex flex-col"
    >
      {/* Portada protagonista: más grande y sin una franja inferior de controles */}
      <div className="relative aspect-[4/3] overflow-hidden bg-transparent group/thumb">
        <img
          src={game.mainImage}
          alt={game.name}
          className="w-full h-full object-contain p-1.5 group-hover/thumb:scale-[1.02] transition-transform duration-300"
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
      <div className="px-3 py-2.5 flex flex-col gap-1.5 bg-white/20 dark:bg-stone-950/25 backdrop-blur-lg border-t border-white/30 dark:border-white/10">
        <h3 className="text-xs sm:text-sm font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] font-['Plus_Jakarta_Sans'] group-hover:text-amber-300 transition-colors line-clamp-1">
          {game.name}
        </h3>

        <div className="flex items-center gap-1 text-[11px] text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span className={game.ratingsCount > 0 ? 'font-bold text-amber-500' : ''}>
            {game.ratingsCount > 0 ? game.ratingAvg.toFixed(1) : 'Sin calificación'}
          </span>
        </div>
      </div>
    </div>
  );
};
