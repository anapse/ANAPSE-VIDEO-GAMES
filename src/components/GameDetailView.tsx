import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Heart,
  Star,
  MessageSquare,
  Share2,
  Mail,
  Send,
  Trophy,
  Bookmark,
  ChevronLeft,
  HelpCircle,
} from 'lucide-react';
import { Game } from '../types';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { BestPlayerWidget } from './BestPlayerWidget';

interface GameDetailViewProps {
  game: Game;
  onBack: () => void;
  onPlay: (game: Game) => void;
  onShare: (game: Game) => void;
  onDonate: (game: Game) => void;
}

export const GameDetailView: React.FC<GameDetailViewProps> = ({
  game,
  onBack,
  onPlay,
  onShare,
  onDonate,
}) => {
  const {
    comments,
    addComment,
    userLikes,
    toggleLikeGame,
    userRatings,
    rateGame,
    userFollows,
    toggleFollowGame,
    recordGameView,
  } = useGameData();

  const [newComment, setNewComment] = useState('');
  const [starHover, setStarHover] = useState<number | null>(null);

  const recordedViewRef = useRef<string | null>(null);

  useEffect(() => {
    if (recordedViewRef.current === game.gameId) return;
    recordedViewRef.current = game.gameId;
    void recordGameView(game.gameId);
  }, [game.gameId, recordGameView]);


  const isLiked = !!userLikes[game.gameId];
  const isFollowed = !!userFollows[game.gameId];
  const userRating = userRatings[game.gameId] || 0;

  const gameComments = comments.filter((c) => c.targetType === 'game' && c.targetId === game.gameId);
  const rootComments = gameComments.filter((c) => !c.parentId);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment('game', game.gameId, newComment.trim(), null);
    setNewComment('');
  };

  const handleRatingClick = (rating: number) => {
    rateGame(game.gameId, rating);
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } });
  };

  const getPortalShareUrl = () => `${window.location.origin}${window.location.pathname}#game-${game.gameId}`;

  const getWhatsAppShareUrl = () => {
    const text = encodeURIComponent(
      `¡Juega ${game.name} gratis en ANAPSE VIDEO GAMES! 🦊🥚\n\n${getPortalShareUrl()}`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  const getEmailShareUrl = () => {
    const subject = encodeURIComponent(`🎮 Juega ${game.name} gratis`);
    const body = encodeURIComponent(
      `Te invito a jugar ${game.name} gratis en ANAPSE VIDEO GAMES:\n\n${getPortalShareUrl()}`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Botón Volver */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold transition-all shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>
      </div>

      {/* Ficha Principal del Juego */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        
        {/* Banner Portada */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={game.bannerImage || game.mainImage}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent opacity-80" />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-xs border border-slate-200/80 dark:border-slate-700">
              {game.category}
            </span>
          </div>
        </div>

        {/* Detalles del juego y botón JUGAR */}
        <div className="p-5 sm:p-8 space-y-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={game.mainImage}
                alt={game.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
              />
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Orbitron']">
                  {game.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {game.tagline || game.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-500 font-bold pt-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{game.ratingAvg > 0 ? game.ratingAvg : '4.9'} / 5</span>
                  <span className="text-slate-400 font-normal">({game.ratingsCount} valoraciones)</span>
                </div>
              </div>
            </div>

            {/* BOTÓN PROTAGONISTA ▶ JUGAR */}
            <button
              onClick={() => onPlay(game)}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-base font-['Orbitron'] tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-2.5 shrink-0"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>▶ JUGAR</span>
            </button>
          </div>

          {/* Barra de Interacciones Secundarias */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => toggleLikeGame(game.gameId)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isLiked
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>Me gusta ({game.likesCount})</span>
            </button>

            <button
              onClick={() => toggleFollowGame(game.gameId)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isFollowed
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFollowed ? 'fill-current' : ''}`} />
              <span>{isFollowed ? 'Siguiendo' : 'Seguir'}</span>
            </button>

            <button
              onClick={() => onDonate(game)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>❤️ Apoyar ANAPSE</span>
            </button>

            <button
              onClick={() => onShare(game)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir</span>
            </button>

            <a
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              <span>WhatsApp</span>
            </a>

            <a
              href={getEmailShareUrl()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              <Mail className="w-4 h-4" />
              <span>Correo</span>
            </a>
          </div>

          {/* Widget de Puntuar */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Puntúa este juego:</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Tu opinión nos ayuda a mejorar.</p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setStarHover(star)}
                  onMouseLeave={() => setStarHover(null)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      (starHover !== null ? star <= starHover : star <= userRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ¿Cómo se juega? y Descripción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ¿Cómo se juega? */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>¿Cómo se juega?</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {game.howToPlay ||
              '1. Pulsa ▶ JUGAR para iniciar el juego en tu navegador.\n2. Sigue las instrucciones del nivel.\n3. Intenta lograr el mejor récord posible.'}
          </p>
        </div>

        {/* Ranking si existe */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Récords y Ranking</span>
          </h2>
          <BestPlayerWidget game={game} />
        </div>
      </div>

      {/* Comentarios */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-500" />
          <span>Comentarios ({gameComments.length})</span>
        </h2>

        <form onSubmit={handlePostComment} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario sobre este juego..."
            rows={2}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar</span>
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {rootComments.length > 0 ? (
            rootComments.map((comment) => (
              <div key={comment.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{comment.userName}</span>
                  <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">No hay comentarios aún.</p>
          )}
        </div>
      </div>

    </div>
  );
};
