import React, { useState, useEffect, useRef } from 'react';
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
  const { recordGamePlay, recordGameView, userLikes, toggleLikeGame } = useGameData();
  const [iframeError, setIframeError] = useState(false);

  // Quick Start Screen state
  const [gameStarted, setGameStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'start' | 'how' | 'ranking'>('start');
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const historyEntryAddedRef = useRef(false);
  const handlingExitRef = useRef(false);

  const isLiked = !!userLikes[game.gameId];

  useEffect(() => {
    void recordGamePlay(game.gameId);
    void recordGameView(game.gameId);
  }, [game.gameId]);

  const requestExit = () => {
    if (!gameStarted) {
      onClose();
      return;
    }
    setShowExitPrompt(true);
  };

  const cancelExit = () => {
    setShowExitPrompt(false);

    // The browser already consumed our synthetic history entry when Back was pressed.
    // Restore it so another Back press is intercepted by the confirmation again.
    if (!historyEntryAddedRef.current && typeof window !== 'undefined') {
      const stateName = `gameplay-${game.gameId}`;
      window.history.pushState({ activeGameplay: stateName }, '', window.location.href);
      historyEntryAddedRef.current = true;
    }
  };

  const confirmExit = () => {
    handlingExitRef.current = true;
    setShowExitPrompt(false);
    onClose();
  };

  // Mobile history handling: one synthetic entry per active game. Never call history.back() during
  // ordinary React cleanup; that can navigate the entire portal away from the game on mobile.
  useEffect(() => {
    if (!gameStarted) return;

    const isMobileView = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;
    if (!isMobileView || historyEntryAddedRef.current) return;

    const stateName = `gameplay-${game.gameId}`;
    window.history.pushState({ activeGameplay: stateName }, '', window.location.href);
    historyEntryAddedRef.current = true;

    const handlePopState = () => {
      // Browser Back is intercepted and converted into an in-game confirmation.
      // The game remains mounted so the current score/state is not lost.
      historyEntryAddedRef.current = false;
      if (!handlingExitRef.current) {
        setShowExitPrompt(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Intentionally do NOT call history.back() here. A React unmount is not
      // necessarily a user Back action; doing so can jump out of the portal.
      historyEntryAddedRef.current = false;
    };
  }, [gameStarted, game.gameId]);

  // ACTIVE GAMEPLAY MODE: Invisible frame, 9:16 ratio optimized for mobile/desktop, zero borders/padding/margins
  if (gameStarted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-0 m-0 overflow-hidden overscroll-none touch-none" style={{ contain: 'strict' }}>
        {/* Exit confirmation banner */}
        {showExitPrompt && (
          <div className="absolute inset-x-3 top-4 z-[60] flex justify-center pointer-events-none">
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="exit-game-title"
              className="pointer-events-auto w-full max-w-sm rounded-2xl bg-slate-900/95 border border-amber-400/40 shadow-2xl  p-4 text-white animate-in slide-in-from-top-3 duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-lg">
                  ⚠️
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id="exit-game-title" className="font-bold text-sm">¿Quieres salir del juego?</h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    Tu partida actual podría perderse si sales.
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={cancelExit}
                  className="py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors active:scale-95"
                >
                  CONTINUAR JUGANDO
                </button>
                <button
                  type="button"
                  onClick={confirmExit}
                  className="py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors active:scale-95"
                >
                  SALIR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating discrete back button - Hidden on mobile, flex on desktop */}
        <button
          onClick={requestExit}
          className="hidden sm:flex absolute top-3 left-3 z-30 items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white  text-xs font-bold border border-white/20 shadow-lg active:scale-95 transition-all"
          title="Volver a juegos"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Volver</span>
        </button>

        {/* Floating action buttons (share & like) on top right - Hidden on mobile, flex on desktop */}
        <div className="hidden sm:flex absolute top-3 right-3 z-30 items-center gap-2">
          <button
            onClick={() => toggleLikeGame(game.gameId)}
            className={`p-2 rounded-full  border text-xs flex items-center gap-1 transition-all ${
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
            className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white  border border-white/20"
            title="Compartir"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Game iframe / container (Invisible frame, 9:16 ratio, zero margins/padding) */}
        <div className="w-full h-[100svh] max-w-[calc(100svh*9/16)] aspect-[9/16] flex items-center justify-center border-0 p-0 m-0 bg-transparent overflow-hidden relative">
          {game.webUrl && game.embedAllowed && !iframeError ? (
            <iframe
              src={game.webUrl}
              title={game.name}
              className="w-full h-full border-0 p-0 m-0 bg-transparent overflow-hidden touch-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad; microphone; camera"
              allowFullScreen
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="p-6 text-center max-w-sm mx-auto space-y-4 rounded-3xl bg-slate-900/90 text-white border border-slate-800 shadow-xl ">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80  animate-in fade-in">
      <div className="relative w-full max-w-md mx-auto p-6 rounded-3xl bg-white/95 dark:bg-slate-900/95  border border-slate-200/80 dark:border-slate-800 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
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