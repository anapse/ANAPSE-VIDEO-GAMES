import React, { useState, useEffect } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  Play,
  HelpCircle,
  Trophy,
  Heart,
  Share2,
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

  // Quick Start Screen state (Section 14)
  const [gameStarted, setGameStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'start' | 'how' | 'ranking'>('start');

  const isLiked = !!userLikes[game.gameId];

  useEffect(() => {
    recordGamePlay(game.gameId);
  }, [game.gameId]);

  const handleGameOverScore = (finalScore: number) => {
    setSubmittedScore(finalScore);
    submitScore(game.gameId, finalScore);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  const isFoxThief = game.gameId === 'fox-thief';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div
        className={`relative w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-full max-w-none' : 'max-w-4xl max-h-[92vh]'
        }`}
      >
        {/* Header Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-mono text-[10px] font-bold">
              {game.category}
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white font-['Orbitron'] truncate">
              {game.name}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleLikeGame(game.gameId)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                isLiked
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline text-[11px] font-bold">{game.likesCount}</span>
            </button>

            <button
              onClick={() => onShare(game)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              title="Compartir"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hidden sm:block"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative min-h-[420px]">
          
          {/* Section 14: Quick Intro Screen before Gameplay */}
          {!gameStarted ? (
            <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-5 animate-in zoom-in-95 duration-200">
              
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

              {/* Tabs para [ ▶ COMENZAR ] | [ ❓ Cómo jugar ] | [ 🏆 Ranking ] */}
              <div className="flex items-center justify-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <button
                  onClick={() => setActiveTab('start')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'start' ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Inicio
                </button>
                <button
                  onClick={() => setActiveTab('how')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'how' ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  ❓ Cómo jugar
                </button>
                <button
                  onClick={() => setActiveTab('ranking')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'ranking' ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
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
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm font-['Orbitron'] tracking-wide shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>▶ COMENZAR A JUGAR</span>
              </button>
            </div>
          ) : isFoxThief ? (
            <div className="w-full space-y-3">
              <FoxThiefMiniGame onGameOver={handleGameOverScore} />
              
              {submittedScore !== null && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                  🎉 ¡Puntuación de <b>{submittedScore.toLocaleString()} pts</b> guardada!
                </div>
              )}
            </div>
          ) : game.webUrl && game.embedAllowed && !iframeError ? (
            <div className="w-full h-full min-h-[440px] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <iframe
                src={game.webUrl}
                title={game.name}
                className="w-full h-full min-h-[440px] border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setIframeError(true)}
              />
            </div>
          ) : (
            <div className="p-8 text-center max-w-md mx-auto space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <img
                src={game.mainImage}
                alt={game.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto border border-slate-200 dark:border-slate-700"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Orbitron']">{game.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">{game.tagline || game.description}</p>
              </div>

              {game.webUrl ? (
                <a
                  href={game.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>ABRIR EN NUEVA PESTAÑA</span>
                </a>
              ) : (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-bold">🚀 Juego en fase {game.status}</p>
                  <p className="text-[11px] text-slate-500 mt-1">El equipo de ANAPSE está preparando este juego.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
