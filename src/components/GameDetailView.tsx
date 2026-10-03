import React, { useState } from 'react';
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
  ExternalLink,
  ChevronLeft,
  Smartphone,
  Monitor,
  Apple,
  Eye,
  GitBranch,
  Flame,
  Check,
  ShieldCheck,
  Calendar,
  HelpCircle,
} from 'lucide-react';
import { Game, Comment } from '../types';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

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
    toggleLikeComment,
    deleteComment,
    userLikes,
    toggleLikeGame,
    userRatings,
    rateGame,
    userFollows,
    toggleFollowGame,
    donations,
  } = useGameData();

  const { profile, currentUser, isAdmin, isModerator } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [starHover, setStarHover] = useState<number | null>(null);

  const isLiked = !!userLikes[game.gameId];
  const isFollowed = !!userFollows[game.gameId];
  const userRating = userRatings[game.gameId] || 0;

  const gameComments = comments.filter((c) => c.targetType === 'game' && c.targetId === game.gameId);
  const rootComments = gameComments.filter((c) => !c.parentId);
  const gameDonations = donations.filter((d) => d.gameId === game.gameId && d.isPublic);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment('game', game.gameId, newComment.trim(), null);
    setNewComment('');
  };

  const handlePostReply = (parentId: string) => {
    if (!replyContent.trim()) return;
    addComment('game', game.gameId, replyContent.trim(), parentId);
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleRatingClick = (rating: number) => {
    rateGame(game.gameId, rating);
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } });
  };

  const getWhatsAppShareUrl = () => {
    const text = encodeURIComponent(
      `¡Mira este juego en ANAPSE VIDEO GAMES! 🎮 ${game.name}\n${game.tagline || game.description}\n¡Juégalo gratis aquí! 👉 ${window.location.href}`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  const getEmailShareUrl = () => {
    const subject = encodeURIComponent(`Te recomiendo jugar: ${game.name} en ANAPSE VIDEO GAMES`);
    const body = encodeURIComponent(
      `Hola!\n\nTe recomiendo probar "${game.name}" gratis en la plataforma ANAPSE VIDEO GAMES.\n\nDescripción: ${game.description}\n\nEnlace: ${window.location.href}\n\n¡Que lo disfrutes!`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver a Inicio</span>
        </button>

        <span className="font-mono text-xs text-slate-400">/juegos/{game.gameId}</span>
      </div>

      {/* Hero Header Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        
        {/* Banner Image */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-950">
          <img
            src={game.bannerImage || game.mainImage}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500 text-slate-950 uppercase font-['Orbitron'] shadow-md">
              {game.status}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-slate-700">
              {game.category}
            </span>
            {game.inPromotion && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 animate-pulse">
                🔥 EN PROMOCIÓN
              </span>
            )}
          </div>
        </div>

        {/* Hero Details Overlay */}
        <div className="p-6 sm:p-8 space-y-6 relative -mt-20 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={game.mainImage}
                alt={game.name}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-cyan-400 shadow-2xl bg-slate-950 shrink-0"
              />
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-black text-white font-['Orbitron'] tracking-tight">
                  {game.name}
                </h1>
                <p className="text-xs sm:text-sm text-cyan-300 font-medium">
                  {game.tagline || 'Videojuego original desarrollado por ANAPSE'}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>Versión: <b className="text-slate-200 font-mono">v{game.version}</b></span>
                  <span>•</span>
                  <span>Plataformas: <b className="text-slate-200">{game.platforms.join(', ')}</b></span>
                </div>
              </div>
            </div>

            {/* Principal Big Play Button (Section 8) */}
            <button
              onClick={() => onPlay(game)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base sm:text-lg font-['Orbitron'] tracking-wider shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 active:scale-95 transition-all shrink-0"
            >
              <Play className="w-6 h-6 fill-slate-950" />
              <span>▶ JUGAR GRATIS</span>
            </button>
          </div>

          {/* Metric Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Partidas</p>
              <p className="text-base sm:text-lg font-black text-cyan-300 font-mono">
                {game.playsCount.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Visitas</p>
              <p className="text-base sm:text-lg font-black text-slate-200 font-mono">
                {(game.viewsCount || game.playsCount * 2 + 350).toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Likes</p>
              <p className="text-base sm:text-lg font-black text-rose-400 font-mono">
                {game.likesCount.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Valoración</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-base sm:text-lg font-black text-amber-300">{game.ratingAvg}</span>
                <span className="text-[10px] text-slate-400">({game.ratingsCount})</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase font-bold text-slate-400">Récord Máximo</p>
              <p className="text-base sm:text-lg font-black text-amber-400 font-mono">
                {game.sampleLeaderboard?.[0]?.score
                  ? `${game.sampleLeaderboard[0].score.toLocaleString()} ${game.rankingConfig?.unit || 'pts'}`
                  : 'Sin récords'}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => toggleLikeGame(game.gameId)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isLiked
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Te gusta' : '❤️ Like'} ({game.likesCount})</span>
            </button>

            <button
              onClick={() => toggleFollowGame(game.gameId)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isFollowed
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-amber-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFollowed ? 'fill-current' : ''}`} />
              <span>{isFollowed ? 'Siguiendo' : '⭐ Seguir'}</span>
            </button>

            <button
              onClick={() => onDonate(game)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 text-white font-bold text-xs shadow-md shadow-rose-500/20 active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>❤️ Apoyar</span>
            </button>

            <button
              onClick={() => onShare(game)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold"
            >
              <Share2 className="w-4 h-4" />
              <span>📤 Compartir</span>
            </button>

            <a
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              <span>🟢 WhatsApp</span>
            </a>

            <a
              href={getEmailShareUrl()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold"
            >
              <Mail className="w-4 h-4" />
              <span>📧 Correo</span>
            </a>
          </div>

          {/* Rating Widget */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span>⭐ Puntúa este juego:</span>
              </p>
              <p className="text-[11px] text-slate-400">Tu valoración ayuda a otros jugadores a descubrir los mejores juegos.</p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setStarHover(star)}
                  onMouseLeave={() => setStarHover(null)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      (starHover !== null ? star <= starHover : star <= userRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
              {userRating > 0 && (
                <span className="text-xs font-bold text-amber-300 ml-2">({userRating}/5 estrellas)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Description & How to Play + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Description, How to play, Comments */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* How to Play Box (Mandatory Section 8) */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
            <h2 className="text-base font-black text-white font-['Orbitron'] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>CÓMO JUGAR</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {game.howToPlay ||
                '1. Haz clic en ▶ JUGAR GRATIS para iniciar la partida en tu navegador.\n2. Sigue las instrucciones y controles en pantalla.\n3. Supera niveles para subir en el ranking mundial.'}
            </p>
          </div>

          {/* Description */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h2 className="text-base font-black text-white font-['Orbitron']">
              📖 DESCRIPCIÓN DEL JUEGO
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {game.description}
            </p>
          </div>

          {/* Comments Section */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-black text-white font-['Orbitron'] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>COMENTARIOS ({gameComments.length})</span>
              </h2>
            </div>

            <form onSubmit={handlePostComment} className="space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario o consejo sobre este juego..."
                rows={3}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar</span>
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {rootComments.length > 0 ? (
                rootComments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.userPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.userId}`}
                          alt={comment.userName}
                          className="w-7 h-7 rounded-lg bg-slate-800"
                        />
                        <span className="text-xs font-bold text-white">{comment.userName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-300">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-500 py-4">No hay comentarios aún.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-amber-300 font-['Orbitron'] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>RANKING GLOBAL</span>
              </h2>
              {game.rankingConfig?.enabled && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  TOP {game.rankingConfig.limit}
                </span>
              )}
            </div>

            {game.rankingConfig?.enabled ? (
              <div className="space-y-2">
                {game.sampleLeaderboard && game.sampleLeaderboard.length > 0 ? (
                  game.sampleLeaderboard.map((player, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</span>
                        <span className="text-slate-200 font-medium">{player.playerName}</span>
                      </div>
                      <span className="font-mono text-amber-300 font-bold">
                        {player.score.toLocaleString()} {game.rankingConfig?.unit || 'pts'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">Sin puntuaciones registradas aún.</p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                🏆 Sin ranking configurado
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
