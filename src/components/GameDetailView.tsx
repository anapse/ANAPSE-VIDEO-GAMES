import React, { useState } from 'react';
import {
  Play,
  Heart,
  Star,
  MessageSquare,
  Share2,
  Send,
  Bookmark,
  ChevronLeft,
} from 'lucide-react';
import { Game } from '../types';
import { useGameData } from '../context/GameDataContext';
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
  const [showCommentsModal, setShowCommentsModal] = useState(false);



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
      <div className="rounded-2xl overflow-hidden bg-[#f5efe3]/55 dark:bg-[#302b23]/55 backdrop-blur-md border border-white/35 dark:border-amber-100/10 shadow-[0_10px_28px_rgba(35,25,10,0.14)]">
        
        {/* Banner Portada */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-transparent">
          <img
            src={game.bannerImage || game.mainImage}
            alt={game.name}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/35 via-transparent to-transparent opacity-60" />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-stone-900/65 text-white shadow-xs border border-white/25 backdrop-blur-sm">
              {game.category}
            </span>
          </div>
        </div>

        {/* Detalles del juego y botón JUGAR */}
        <div className="p-5 sm:p-8 space-y-5 relative z-10 bg-white/20 dark:bg-[#302b23]/25 backdrop-blur-md border-t border-white/25 dark:border-amber-100/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={game.mainImage}
                alt={game.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-white/20 border border-white/50 dark:border-amber-100/20 shadow-md shrink-0 p-1"
              />
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Orbitron'] drop-shadow">
                  {game.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                  {game.tagline || game.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button type="button" onClick={() => setShowRatingPicker((open) => !open)} aria-label="Valorar juego" aria-expanded={showRatingPicker} title="Valorar juego" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 -ml-2 text-sm font-bold text-amber-700 dark:text-amber-300 hover:bg-white/20 transition-colors">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-300" />
                    <span>{userRating || 0}/5</span>
                  </button>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300/80">{game.ratingsCount} valoraciones</span>
                  {showRatingPicker && <div className="flex items-center gap-0.5 rounded-xl bg-[#f5efe3]/95 dark:bg-[#302b23]/95 border border-amber-400/40 px-1.5 py-1 shadow-xl">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" aria-label={star + ' estrellas'} onClick={() => { handleRatingClick(star); setShowRatingPicker(false); }} onMouseEnter={() => setStarHover(star)} onMouseLeave={() => setStarHover(null)} className="p-1 hover:scale-110 transition-transform"><Star className={"w-4 h-4 " + ((starHover !== null ? star <= starHover : star <= userRating) ? "fill-amber-400 text-amber-300" : "text-slate-500")} /></button>)}</div>}
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

          {/* Acciones y récord compacto en la misma franja */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
            <button type="button" onClick={() => toggleLikeGame(game.gameId)} aria-label="Me gusta" title="Me gusta" className={"inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold border shadow-sm transition-all hover:-translate-y-0.5 " + (isLiked ? "bg-rose-500 text-white border-rose-400" : "bg-white/35 dark:bg-stone-900/25 text-slate-800 dark:text-slate-100 border-white/45 dark:border-amber-100/15 hover:bg-rose-100/70 dark:hover:bg-rose-950/60")}><Heart className={"w-4 h-4 " + (isLiked ? "fill-current" : "")} /><span>{game.likesCount}</span></button>
            <button type="button" onClick={() => toggleFollowGame(game.gameId)} aria-label={isFollowed ? "Dejar de seguir" : "Seguir juego"} title={isFollowed ? "Dejar de seguir" : "Seguir juego"} className={"rounded-xl p-2.5 border shadow-sm transition-all hover:-translate-y-0.5 " + (isFollowed ? "bg-amber-400 text-slate-950 border-amber-300" : "bg-white/35 dark:bg-stone-900/25 text-slate-800 dark:text-slate-100 border-white/45 dark:border-amber-100/15 hover:bg-amber-100/70 dark:hover:bg-amber-950/60")}><Bookmark className={"w-4 h-4 " + (isFollowed ? "fill-current" : "")} /></button>
            <button type="button" onClick={() => onDonate(game)} aria-label="Apoyar ANAPSE" title="Apoyar ANAPSE" className="rounded-xl p-2.5 bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 shadow-sm transition-all hover:-translate-y-0.5"><Heart className="w-4 h-4 fill-current" /></button>
            <button type="button" onClick={() => onShare(game)} aria-label="Compartir juego" title="Compartir juego" className="rounded-xl p-2.5 bg-slate-950/45 text-slate-100 border border-white/10 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-100/60 dark:hover:bg-stone-800/40"><Share2 className="w-4 h-4" /></button>
            <button type="button" onClick={() => setShowCommentsModal(true)} aria-label="Ver y escribir comentarios" title="Comentarios" className="inline-flex items-center gap-1.5 rounded-xl p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 shadow-sm transition-all hover:-translate-y-0.5"><MessageSquare className="w-4 h-4" /><span className="text-xs font-bold">{gameComments.length}</span></button>
            <div className="ml-auto min-w-0 max-w-full">
              <BestPlayerWidget game={game} />
            </div>
          </div>
        </div>
      </div>


      {showCommentsModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={"Comentarios de " + game.name} onMouseDown={(e) => { if (e.target === e.currentTarget) setShowCommentsModal(false); }}>
          <div className="w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-[#f5efe3]/95 dark:bg-[#302b23]/95 border border-white/35 dark:border-amber-100/15 shadow-2xl">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-amber-900/10 dark:border-white/10 bg-white/35 dark:bg-stone-950/25">
              <div className="flex items-center gap-2.5"><div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400"><MessageSquare className="w-5 h-5" /></div><div><h2 className="text-base font-bold text-white">Comentarios</h2><p className="text-xs text-slate-400">{gameComments.length} comentarios · {game.name}</p></div></div>
              <button type="button" onClick={() => setShowCommentsModal(false)} aria-label="Cerrar comentarios" className="rounded-xl p-2 text-slate-300 hover:text-white hover:bg-white/10 text-xl">×</button>
            </div>
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              <form onSubmit={handlePostComment} className="space-y-2">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe tu comentario..." rows={3} className="w-full p-3 rounded-xl bg-white/70 dark:bg-stone-950/40 border border-amber-900/15 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-y" />
                <div className="flex justify-end"><button type="submit" disabled={!newComment.trim()} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2"><Send className="w-4 h-4" />Publicar comentario</button></div>
              </form>
              <div className="space-y-2">
                {rootComments.length ? rootComments.map((comment) => <div key={comment.id} className="p-3.5 rounded-xl bg-white/45 dark:bg-stone-900/35 border border-white/35 dark:border-white/5 space-y-1.5"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-amber-800 dark:text-amber-300">{comment.userName}</span><span className="text-[10px] text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span></div><p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words">{comment.content}</p></div>) : <div className="py-8 text-center"><MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" /><p className="text-sm text-slate-300">Todavía no hay comentarios.</p><p className="text-xs text-slate-500 mt-1">¡Sé el primero en comentar!</p></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
