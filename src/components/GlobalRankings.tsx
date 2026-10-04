import React, { useState } from 'react';
import { Trophy, Medal, Star, Flame, Filter, Play } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import { Game } from '../types';

interface GlobalRankingsProps {
  onPlayGame: (game: Game) => void;
  onViewGame: (game: Game) => void;
}

export const GlobalRankings: React.FC<GlobalRankingsProps> = ({ onPlayGame, onViewGame }) => {
  const { games, scores } = useGameData();
  const [selectedGameId, setSelectedGameId] = useState<string>('all');
  const [period, setPeriod] = useState<'global' | 'weekly' | 'monthly'>('global');

  const gamesWithRanking = games.filter((g) => g.rankingConfig?.enabled);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Orbitron']">
              TABLAS DE CLASIFICACIÓN & RÉCORDS
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Los mejores jugadores y récords mundiales en los videojuegos de ANAPSE.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setPeriod('global')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              period === 'global' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              period === 'monthly' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              period === 'weekly' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semanal
          </button>
        </div>
      </div>

      {/* Game Filter Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedGameId('all')}
          className={`px-4 py-2 rounded-xl text-xs font-black font-['Orbitron'] shrink-0 transition-all ${
            selectedGameId === 'all'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850'
          }`}
        >
          TODOS LOS JUEGOS
        </button>

        {gamesWithRanking.map((game) => (
          <button
            key={game.gameId}
            onClick={() => setSelectedGameId(game.gameId)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
              selectedGameId === game.gameId
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850'
            }`}
          >
            <span>{game.name}</span>
          </button>
        ))}
      </div>

      {/* Rankings Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(selectedGameId === 'all' ? gamesWithRanking : gamesWithRanking.filter((g) => g.gameId === selectedGameId)).map(
          (game) => (
            <div
              key={game.gameId}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <img src={game.mainImage} alt={game.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-base font-black text-white font-['Orbitron']">{game.name}</h3>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      TOP {game.rankingConfig?.limit || 50} • {game.rankingConfig?.unit || 'pts'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => onPlayGame(game)}
                    className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all shadow-sm"
                    title="Jugar ahora"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                  </button>
                  <button
                    onClick={() => onViewGame(game)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                    title="Ver ficha"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Leaderboard Entries */}
              <div className="space-y-2">
                {(() => {
                  const gameScores = scores
                    .filter((s) => s.gameId === game.gameId)
                    .sort((a, b) => {
                      const order = game.rankingConfig?.order || 'desc';
                      return order === 'asc' ? a.score - b.score : b.score - a.score;
                    })
                    .slice(0, game.rankingConfig?.limit || 50);

                  if (gameScores.length === 0) {
                    return <p className="text-xs text-slate-500 text-center py-6">Este juego todavía no tiene puntuaciones.</p>;
                  }

                  return gameScores.map((item, idx) => {
                    const isTop1 = idx === 0;
                    const isTop2 = idx === 1;
                    const isTop3 = idx === 2;

                    return (
                      <div
                        key={item.id || idx}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                          isTop1
                            ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                            : isTop2
                            ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                            : isTop3
                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="w-6 text-center font-black text-sm">
                            {isTop1 ? '🥇' : isTop2 ? '🥈' : isTop3 ? '🥉' : `#${idx + 1}`}
                          </span>
                          <span className="font-bold truncate">{item.playerName}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-black text-sm">{item.score.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 ml-1">{game.rankingConfig?.unit || 'pts'}</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
