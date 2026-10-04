import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Play,
  Heart,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import { Game } from '../types';
import { useGameData } from '../context/GameDataContext';

interface GameModalPlayerProps {
  game: Game;
  onClose: () => void;
  onShare: (game: Game) => void;
  onDonate: (game: Game) => void;
}

export const GameModalPlayer: React.FC<GameModalPlayerProps> = ({
  game,
  onClose,
  onShare,
}) => {
  const { recordGamePlay, userLikes, toggleLikeGame } = useGameData();
  const [iframeError, setIframeError] = useState(false);

  // Quick Start Screen state
  const [gameStarted, setGameStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'start' | 'how' | 'ranking'>('start');

  const isLiked = !!userLikes[game.gameId];

  useEffect(() => {
    recordGamePlay(game.gameId);
  }, [game.gameId]);

  // Synchronize history state when gameplay starts so native back button closes gameplay
  useEffect(() => {
    if (!gameStarted) return;

    // Detect if we are in mobile view (screen width < 640px)
    const isMobileView = typeof window !== 'undefined' && window.innerWidth < 640;
    if (!isMobileView) return;

    const stateName = `gameplay-${game.gameId}`;
    window.history.pushState({ activeGameplay: stateName }, '');

    const handlePopState = (event: PopStateEvent) => {
      // ONLY close if the popped state is indeed null or does not have our activeGameplay state!
      if (!event.state || event.state.activeGameplay !== stateName) {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // If the component unmounts and we are still in our pushed history state, pop it
      if (window.history.state?.activeGameplay === stateName) {
        window.history.back();
      }
    };
  }, [gameStarted, game.gameId, onClose]);

  // ACTIVE GAMEPLAY MODE: Invisible frame, 9:16 ratio optimized for mobile/desktop, zero borders/padding/margins
  if (gameStarted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-0 m-0 overflow-hidden">
        {/* Floating discrete back button overlay - Hidden on mobile, flex on desktop */}
        <button
          onClick={onClose}
          className="hidden sm:flex absolute top-3 left-3 z-30 items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white backdrop-blur-md text-xs font-bold border border-white/20 shadow-lg active:scale-95 transition-all"
          title="Volver a juegos"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Volver</span>
        </button>

        {/* Floating action buttons (share & like) on top right - Hidden on mobile, flex on desktop */}
        <div className="hidden sm:flex absolute top-3 right-3 z-30 items-center gap-2">
          <button
            onClick={() => toggleLikeGame(game.gameId)}
            className={`p-2 rounded-full backdrop-blur-md border text-xs flex items-center gap-1 transition-all ${
              isLiked
                ? 'bg-rose-500/80 text-white border-rose-400'
                : 'bg-slate-900/60 text-white border-white/20'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-[11px] font-bold">{game.likesCount}</span>
          </button>

          <button
            onClick={() => onShare(game)}
            className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/20"
            title="Compartir"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Game iframe / container (Invisible frame, 9:16 aspect ratio, zero margins/padding) */}
        <div className="w-full h-[100dvh] max-w-[calc(100dvh*9/16)] aspect-[9/16] flex items-center justify-center border-0 p-0 m-0 bg-transparent overflow-hidden relative">
          {game.webUrl && game.embedAllowed && !iframeError ? (
            <iframe
              src={game.webUrl}
              title={game.name}
              className="w-full h-full border-0 p-0 m-0 bg-transparent overflow-hidden"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad; microphone; camera"
              allowFullScreen
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="p-6 text-center max-w-sm mx-auto space-y-4 rounded-3xl bg-slate-900/90 text-white border border-slate-800 shadow-xl backdrop-blur-md">
              <img
                src={game.mainImage}
                alt={game.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto border border-slate-700"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-['Orbitron']">{game.name}</h3>
                <p className="text-xs text-slate-300">{game.tagline || game.description}</p>
              </div>

              {game.webUrl ? (
                <a
                  href={game.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>ABRIR EN NUEVA PESTAÑA</span>
                </a>
              ) : (
                <div className="p-3 rounded-xl bg-slate-800 text-xs text-slate-300">
                  <p className="font-bold">🚀 Juego en fase {game.status}</p>
                  <p className="text-[11px] text-slate-400 mt-1">El equipo de ANAPSE está preparando este juego.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // PRE-GAME INFO MODAL MODE
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md mx-auto p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo / Portada */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
          <img src={game.mainImage} alt={game.name} className="w-full h-full object-cover" />
        </div>

        {/* Nombre y frase */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Orbitron']">
            {game.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {game.tagline || game.description}
          </p>
        </div>

        {/* Tabs para [ Inicio ] | [ ❓ Cómo jugar ] | [ 🏆 Ranking ] */}
        <div className="flex items-center justify-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('start')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'start' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => setActiveTab('how')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'how' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ❓ Cómo jugar
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ranking' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🏆 Ranking
          </button>
        </div>

        {/* Dynamic tab contents */}
        {activeTab === 'how' && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 text-left space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">Instrucciones:</p>
            <p className="whitespace-pre-line">{game.howToPlay || 'Sigue las instrucciones en pantalla durante la partida.'}</p>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 text-left space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">Top Jugadores:</p>
            {game.sampleLeaderboard && game.sampleLeaderboard.length > 0 ? (
              game.sampleLeaderboard.slice(0, 3).map((p, idx) => (
                <div key={idx} className="flex justify-between font-mono text-[11px]">
                  <span>#{idx + 1} {p.playerName}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{p.score} pts</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400">Sin récords aun.</p>
            )}
          </div>
        )}

        {/* Botón Principal COMENZAR */}
        <button
          onClick={() => setGameStarted(true)}
          className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm font-['Orbitron'] tracking-wide shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>▶ JUGAR AHORA</span>
        </button>
      </div>
    </div>
  );
};
