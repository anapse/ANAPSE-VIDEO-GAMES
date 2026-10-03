import React from 'react';
import {
  Play,
  Gamepad2,
  Flame,
  Sparkles,
  Wrench,
  Clock,
  Hammer,
  Lightbulb,
  Vote,
  MessageSquare,
  Heart,
  ArrowRight,
  Star,
  Trophy,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { Game } from '../types';
import { useGameData } from '../context/GameDataContext';
import { GameCard } from './GameCard';
import confetti from 'canvas-confetti';

interface RobloxHomeViewProps {
  onPlayGame: (game: Game) => void;
  onViewGameDetails: (game: Game) => void;
  onShareGame: (game: Game) => void;
  onDonateGame: (game: Game) => void;
  onNavigateTab: (tab: string) => void;
  onOpenNewProposal: () => void;
}

export const RobloxHomeView: React.FC<RobloxHomeViewProps> = ({
  onPlayGame,
  onViewGameDetails,
  onShareGame,
  onDonateGame,
  onNavigateTab,
  onOpenNewProposal,
}) => {
  const { games, proposals, polls, votePoll, userPollVotes, donations, announcements } = useGameData();

  const featuredGame = games.find((g) => g.gameId === 'fox-thief') || games[0];
  const newGames = games.filter((g) => g.isNew || g.status === 'BETA' || g.status === 'PUBLICADO').slice(0, 4);
  const promoGames = games.filter((g) => g.inPromotion);
  const inCreationGames = games.filter((g) => g.status === 'EN CREACIÓN');
  const inRepairGames = games.filter((g) => g.status === 'EN REPARACIÓN');
  const upcomingGames = games.filter((g) => g.status === 'PRÓXIMAMENTE');

  const mainPoll = polls[0];
  const userVoteIdx = mainPoll ? userPollVotes[mainPoll.id] : undefined;

  const handleVoteQuickPoll = (pollId: string, idx: number) => {
    votePoll(pollId, idx);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* 1. JUEGO DESTACADO HERO BANNER */}
      {featuredGame && (
        <div className="relative overflow-hidden pt-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-cyan-500/30 shadow-2xl group">
              
              {/* Hero Panoramic Image */}
              <div className="relative h-72 sm:h-96 lg:h-[460px] w-full overflow-hidden bg-slate-950">
                <img
                  src={featuredGame.bannerImage || featuredGame.mainImage}
                  alt={featuredGame.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

                {/* Badges on Top */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-['Orbitron'] shadow-md">
                    🎮 JUEGO DESTACADO
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-slate-700">
                    {featuredGame.category}
                  </span>
                </div>
              </div>

              {/* Hero Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 space-y-3 z-10">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Orbitron'] tracking-tight drop-shadow-md">
                  {featuredGame.name}
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-slate-200 max-w-2xl font-medium line-clamp-2 leading-relaxed drop-shadow">
                  {featuredGame.tagline || featuredGame.description}
                </p>

                {/* Big Roblox-style Play Button */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onPlayGame(featuredGame)}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base sm:text-lg font-['Orbitron'] tracking-wider flex items-center gap-3 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all"
                  >
                    <Play className="w-6 h-6 fill-slate-950" />
                    <span>▶ JUGAR GRATIS</span>
                  </button>

                  <button
                    onClick={() => onViewGameDetails(featuredGame)}
                    className="px-6 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-white font-bold text-sm backdrop-blur-md transition-all"
                  >
                    Ver detalles e instrucciones
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 🎮 DESCUBRE NUESTROS JUEGOS (Grid Principal) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Orbitron'] flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-cyan-400" />
              <span>DESCUBRE NUESTROS JUEGOS</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Juegos gratis listos para jugar en tu navegador o celular
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('games')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.slice(0, 6).map((game) => (
            <GameCard
              key={game.gameId}
              game={game}
              onPlay={onPlayGame}
              onViewDetails={onViewGameDetails}
              onShare={onShareGame}
              onDonate={onDonateGame}
            />
          ))}
        </div>
      </section>

      {/* 3. 🆕 JUEGOS NUEVOS */}
      {newGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Orbitron'] flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <span>🆕 JUEGOS NUEVOS</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Lanzamientos recientes y versiones recién actualizadas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newGames.map((game) => (
              <GameCard
                key={game.gameId}
                game={game}
                onPlay={onPlayGame}
                onViewDetails={onViewGameDetails}
                onShare={onShareGame}
                onDonate={onDonateGame}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. 🔥 JUEGOS EN PROMOCIÓN */}
      {promoGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Orbitron'] flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                <span>🔥 JUEGOS EN PROMOCIÓN</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Juegos con recompensas especiales y torneos comunitarios activos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promoGames.map((game) => (
              <GameCard
                key={game.gameId}
                game={game}
                onPlay={onPlayGame}
                onViewDetails={onViewGameDetails}
                onShare={onShareGame}
                onDonate={onDonateGame}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. 🚧 ESTAMOS CREANDO */}
      {inCreationGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Orbitron'] flex items-center gap-2">
                <Hammer className="w-6 h-6 text-indigo-400" />
                <span>🚧 ESTAMOS CREANDO</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Proyectos actualmente en fase de producción y diseño
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inCreationGames.map((game) => (
              <GameCard
                key={game.gameId}
                game={game}
                onPlay={onPlayGame}
                onViewDetails={onViewGameDetails}
                onShare={onShareGame}
                onDonate={onDonateGame}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. 🔧 ESTAMOS REPARANDO */}
      {inRepairGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Orbitron'] flex items-center gap-2">
                <Wrench className="w-6 h-6 text-amber-400" />
                <span>🔧 ESTAMOS REPARANDO</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Juegos en mantenimiento técnico o ajustes de balance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inRepairGames.map((game) => (
              <GameCard
                key={game.gameId}
                game={game}
                onPlay={onPlayGame}
                onViewDetails={onViewGameDetails}
                onShare={onShareGame}
                onDonate={onDonateGame}
              />
            ))}
          </div>
        </section>
      )}

      {/* 7. 👀 PRÓXIMAMENTE */}
      {upcomingGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Orbitron'] flex items-center gap-2">
                <Clock className="w-6 h-6 text-purple-400" />
                <span>👀 PRÓXIMAMENTE</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Nuevas experiencias que llegarán muy pronto a ANAPSE
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingGames.map((game) => (
              <GameCard
                key={game.gameId}
                game={game}
                onPlay={onPlayGame}
                onViewDetails={onViewGameDetails}
                onShare={onShareGame}
                onDonate={onDonateGame}
              />
            ))}
          </div>
        </section>
      )}

      {/* 8. 💡 TÚ ELIGES EL PRÓXIMO JUEGO (Propuestas Destacadas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/40 border border-amber-500/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-white font-['Orbitron'] flex items-center gap-2">
                <Lightbulb className="w-7 h-7 text-amber-400" />
                <span>💡 TÚ ELIGES EL PRÓXIMO JUEGO</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                La comunidad propone y vota. Las ideas ganadoras se convierten en juegos reales de ANAPSE.
              </p>
            </div>

            <button
              onClick={onOpenNewProposal}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs font-['Orbitron'] shadow-md shadow-orange-500/20 self-start md:self-auto shrink-0"
            >
              + PROPONER UN JUEGO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proposals.slice(0, 3).map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-sm line-clamp-1">{p.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                  <span className="text-amber-400 font-bold">👍 {p.votesCount} votos</span>
                  <button
                    onClick={() => onNavigateTab('proposals')}
                    className="text-cyan-400 font-bold text-[11px]"
                  >
                    Votar en Comunidad →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. 🗳️ ¿QUÉ JUEGO HACEMOS DESPUÉS? (Encuesta visual) */}
      {mainPoll && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vote className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg sm:text-xl font-black text-white font-['Orbitron']">
                  🗳️ {mainPoll.question}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">{mainPoll.totalVotes} votos</span>
            </div>

            <div className="space-y-3">
              {mainPoll.options.map((opt, idx) => {
                const pct = mainPoll.totalVotes > 0 ? Math.round((opt.votes / mainPoll.totalVotes) * 100) : 0;
                const isSelected = userVoteIdx === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleVoteQuickPoll(mainPoll.id, idx)}
                    className={`relative w-full p-4 rounded-2xl border text-left overflow-hidden transition-all duration-200 group ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 transition-all duration-500 rounded-2xl ${
                        isSelected ? 'bg-cyan-500/20' : 'bg-slate-800/40'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative z-10 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-200">
                      <span>{opt.text}</span>
                      <span className="font-mono text-cyan-300">{pct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 10. ❤️ APOYA ANAPSE VIDEO GAMES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-950/40 via-slate-900 to-pink-950/40 border border-rose-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white font-['Orbitron'] flex items-center justify-center md:justify-start gap-2">
              <Heart className="w-6 h-6 text-rose-400 fill-rose-400" />
              <span>APOYA ANAPSE VIDEO GAMES</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Somos un estudio independiente de videojuegos. Tus donaciones nos permiten seguir creando juegos gratuitos y sin publicidad invasiva para toda la comunidad.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('support')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-black text-sm font-['Orbitron'] shadow-xl shadow-rose-500/20 active:scale-95 transition-all shrink-0"
          >
            ❤️ APOYAR AHORA
          </button>
        </div>
      </section>
    </div>
  );
};
