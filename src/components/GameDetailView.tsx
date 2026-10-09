import React, { useState } from 'react';
import {
  Play,
  Heart,
  Star,
  MessageSquare,
  Share2,
  Send,
  Trophy,
  Bookmark,
  ChevronLeft,
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
  } = useGameData();

  const [newComment, setNewComment] = useState('');
  const [starHover, setStarHover] = useState<number | null>(null);
  const [showRatingPicker, setShowRatingPicker] = useState(false);



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
      <div className="rounded-2xl overflow-hidden bg-white/35 dark:bg-stone-950/25 backdrop-blur-sm border border-white/45 dark:border-amber-100/15 shadow-[0_10px_28px_rgba(25,20,12,0.14)]">
        
        {/* Banner Portada */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-transparent">
          <img
            src={game.bannerImage || game.mainImage}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/35 via-transparent to-transparent opacity-60" />

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
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-white/20 border border-white/50 dark:border-amber-100/20 shadow-md shrink-0 p-1"
              />
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Orbitron']">
                  {game.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {game.tagline || game.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold pt-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="text-amber-700 dark:text-amber-300">{game.ratingsCount > 0 ? game.ratingAvg.toFixed(1) + '/5' : 'Sin valorar'}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">· {game.ratingsCount} votos</span>
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

          {/* Acciones compactas en iconos */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-amber-900/10 dark:border-white/10">
            <button type="button" onClick={() => toggleLikeGame(game.gameId)} aria-label="Me gusta" title="Me gusta" className={"inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold border shadow-sm transition-all hover:-translate-y-0.5 " + (isLiked ? "bg-rose-500 text-white border-rose-400" : "bg-white/45 dark:bg-stone-900/30 text-slate-700 dark:text-slate-200 border-white/60 dark:border-white/10")}>
              <Heart className={"w-4 h-4 " + (isLiked ? "fill-current" : "")} /><span>{game.likesCount}</span>
            </button>
            <button type="button" onClick={() => toggleFollowGame(game.gameId)} aria-label={isFollowed ? "Dejar de seguir" : "Seguir juego"} title={isFollowed ? "Dejar de seguir" : "Seguir juego"} className={"rounded-xl p-2.5 border shadow-sm transition-all hover:-translate-y-0.5 " + (isFollowed ? "bg-amber-400 text-stone-950 border-amber-300" : "bg-white/45 dark:bg-stone-900/30 text-slate-700 dark:text-slate-200 border-white/60 dark:border-white/10")}>
              <Bookmark className={"w-4 h-4 " + (isFollowed ? "fill-current" : "")} />
            </button>
            <button type="button" onClick={() => onDonate(game)} aria-label="Apoyar ANAPSE" title="Apoyar ANAPSE" className="rounded-xl p-2.5 bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 shadow-sm transition-all hover:-translate-y-0.5"><Heart className="w-4 h-4 fill-current" /></button>
            <button type="button" onClick={() => onShare(game)} aria-label="Compartir juego" title="Compartir juego" className="rounded-xl p-2.5 bg-white/45 dark:bg-stone-900/30 text-slate-700 dark:text-slate-200 border border-white/60 dark:border-white/10 shadow-sm transition-all hover:-translate-y-0.5"><Share2 className="w-4 h-4" /></button>
            <a href={getWhatsAppShareUrl()} target="_blank" rel="noopener noreferrer" aria-label="Compartir por WhatsApp" title="WhatsApp" className="rounded-xl p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 shadow-sm transition-all hover:-translate-y-0.5"><MessageSquare className="w-4 h-4" /></a>
          </div>
          {/* Valoración simplificada */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/30 dark:bg-stone-950/20 border border-white/45 dark:border-amber-100/15 px-4 py-3 shadow-[0_5px_16px_rgba(40,30,15,0.08)]">
            <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-100"><Star className="w-4 h-4 text-amber-500 fill-amber-400" /><span>{userRating ? "Tu valoración: " + userRating + "/5" : "¿Qué te pareció este juego?"}</span></div>
            <button type="button" onClick={() => setShowRatingPicker((open) => !open)} aria-expanded={showRatingPicker} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2 text-xs font-extrabold shadow-md transition-all hover:-translate-y-0.5"><Star className="w-4 h-4" />{userRating ? "Cambiar valoración" : "Valorar"}</button>
            {showRatingPicker && <div className="w-full flex items-center justify-between gap-3 border-t border-amber-900/10 dark:border-white/10 pt-3" role="group" aria-label="Elige una valoración del 1 al 5"><span className="text-xs text-slate-600 dark:text-slate-300">Tu puntuación</span><div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" aria-label={star + " estrellas"} onClick={() => { handleRatingClick(star); setShowRatingPicker(false); }} onMouseEnter={() => setStarHover(star)} onMouseLeave={() => setStarHover(null)} className="rounded-lg p-1.5 hover:bg-amber-100/70 dark:hover:bg-amber-900/30 hover:scale-110 transition-transform"><Star className={"w-5 h-5 " + ((starHover !== null ? star <= starHover : star <= userRating) ? "fill-amber-400 text-amber-500" : "text-slate-400 dark:text-slate-500")} /></button>)}</div></div>}
          </div>
        </div>
      </div>

      {/* Récords y ranking */}
      <div className="rounded-2xl p-5 sm:p-6 bg-white/30 dark:bg-stone-950/20 backdrop-blur-sm border border-white/45 dark:border-amber-100/15 shadow-[0_8px_24px_rgba(25,20,12,0.12)] space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /><span>Récords y ranking</span></h2>
        <BestPlayerWidget game={game} />
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
