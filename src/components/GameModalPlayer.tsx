import React, { useState } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCcw,
  Trophy,
  Heart,
  Share2,
  Volume2,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Game } from '../types';
import { useGameData } from '../context/GameDataContext';
import { FoxThiefMiniGame } from './games/FoxThiefMiniGame';
import confetti from 'canvas-confetti';

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
  onDonate,
}) => {
  const { recordGamePlay, submitScore, userLikes, toggleLikeGame } = useGameData();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);

  const isLiked = !!userLikes[game.gameId];

  // Record play on mount
  React.useEffect(() => {
    recordGamePlay(game.gameId);
  }, [game.gameId]);

  const handleGameOverScore = (finalScore: number) => {
    setSubmittedScore(finalScore);
    submitScore(game.gameId, finalScore);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  const isFoxThief = game.gameId === 'fox-thief';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
      <div
        className={`relative w-full rounded-3xl bg-slate-950 border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-full max-w-none' : 'max-w-4xl max-h-[92vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold">
              {game.category}
            </span>
            <h2 className="text-sm sm:text-base font-black text-white font-['Orbitron'] truncate">
              {game.name}
            </h2>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">v{game.version}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => toggleLikeGame(game.gameId)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline text-[11px] font-bold">{game.likesCount}</span>
            </button>

            <button
              onClick={() => onShare(game)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Compartir"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {game.webUrl && (
              <a
                href={game.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 text-xs"
                title="Abrir en pestaña nueva"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline font-bold text-[11px]">Abrir Web</span>
              </a>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hidden sm:block"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40"
              title="Cerrar visor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Player Body */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-slate-950 flex flex-col items-center justify-center">
          
          {/* If Game has built-in Mini Game Canvas */}
          {isFoxThief ? (
            <div className="w-full space-y-3">
              <FoxThiefMiniGame onGameOver={handleGameOverScore} />
              
              {submittedScore !== null && (
                <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center text-xs text-emerald-300 font-bold animate-in fade-in">
                  🎉 ¡Puntuación de <b>{submittedScore.toLocaleString()} pts</b> guardada en el ranking global de FOX THIEF!
                </div>
              )}
            </div>
          ) : game.webUrl && game.embedAllowed && !iframeError ? (
            /* External Iframe Runner */
            <div className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative">
              <iframe
                src={game.webUrl}
                title={game.name}
                className="w-full h-full min-h-[420px] border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setIframeError(true)}
              />
            </div>
          ) : (
            /* Fallback Card for games requiring external launch or in development */
            <div className="p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 rounded-3xl bg-slate-900/60 border border-slate-800">
              <img
                src={game.mainImage}
                alt={game.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover mx-auto border-2 border-cyan-500/40 shadow-xl"
              />
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white font-['Orbitron']">{game.name}</h3>
                <p className="text-xs text-slate-300">{game.tagline || game.description}</p>
                <p className="text-[11px] font-bold text-cyan-400 mt-2">
                  Estado: <span className="uppercase">{game.status}</span>
                </p>
              </div>

              {game.webUrl ? (
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-slate-400">
                    Este juego está optimizado para ejecutarse en su propia ventana o aplicación externa.
                  </p>
                  <a
                    href={game.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs font-['Orbitron'] shadow-lg shadow-cyan-500/20 hover:from-cyan-400"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>ABRIR JUEGO EN NUEVA PESTAÑA</span>
                  </a>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 space-y-1">
                  <p className="font-bold">🚀 Juego en fase {game.status}</p>
                  <p className="text-[11px] text-amber-400/80">
                    El equipo de ANAPSE está trabajando en esta versión. ¡Puedes apoyar el desarrollo con una donación o proponer ideas en la comunidad!
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onDonate(game);
                    }}
                    className="mt-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs"
                  >
                    ❤️ Apoyar este proyecto
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
