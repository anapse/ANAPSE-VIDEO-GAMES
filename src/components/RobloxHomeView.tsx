import React from 'react';
import {
  Play,
  Flame,
  Sparkles,
  Hammer,
  Lightbulb,
  MessageSquare,
  Heart,
  ChevronRight,
  Gamepad2,
  Trophy,
} from 'lucide-react';
import { Game } from '../types';
import { useGameData } from '../context/GameDataContext';
import { GameCard } from './GameCard';
import { ASSETS } from '../lib/assets';

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
  const { games, proposals, comments } = useGameData();

  const featuredGames = games.filter((g) => g.featured || g.status === 'PUBLICADO').slice(0, 4);
  const newGames = games.filter((g) => g.isNew || g.status === 'BETA' || g.status === 'PUBLICADO').slice(0, 4);
  const mostPlayedGames = [...games].sort((a, b) => b.playsCount - a.playsCount).slice(0, 4);
  const creatingGames = games.filter((g) => g.status === 'EN CREACIÓN' || g.status === 'EN REPARACIÓN').slice(0, 4);
  const recentComments = comments.slice(0, 3);

  const scrollToGames = () => {
    const el = document.getElementById('featured-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* 1. HERO BANNER PRINCIPAL (Compacto, alegre, sin oscurecerlo en exceso) */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-600 via-indigo-600 to-amber-500 shadow-sm text-white p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[180px] sm:min-h-[220px]">
        {/* Official Banner Image */}
        <img
          src={ASSETS.banner}
          alt="ANAPSE Banner"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none mix-blend-overlay"
        />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold font-['Orbitron']">
            <Gamepad2 className="w-3.5 h-3.5" />
            ANAPSE VIDEO GAMES
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Orbitron'] tracking-tight drop-shadow-sm">
            Juegos gratis para jugar y descubrir
          </h1>

          <p className="text-xs sm:text-sm text-slate-100 font-medium max-w-md mx-auto">
            Explora nuestro catálogo independiente, comparte con amigos y diviértete al instante.
          </p>

          <div className="pt-2">
            <button
              onClick={scrollToGames}
              className="px-6 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-900" />
              <span>VER JUEGOS</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. 🔥 JUEGOS DESTACADOS */}
      <section id="featured-section" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span>Juegos Destacados</span>
          </h2>
          <button
            onClick={() => onNavigateTab('games')}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {featuredGames.map((game) => (
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
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Juegos Nuevos</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
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

      {/* 4. 🔥 MÁS JUGADOS */}
      {mostPlayedGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Más Jugados</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {mostPlayedGames.map((game) => (
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
      {creatingGames.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
              <Hammer className="w-5 h-5 text-indigo-500" />
              <span>Estamos Creando</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {creatingGames.map((game) => (
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

      {/* 6. 💡 TÚ PUEDES ELEGIR EL PRÓXIMO */}
      <section className="space-y-4">
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>Tú puedes elegir el próximo juego</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Propón tu idea de juego o vota por las propuestas de la comunidad.
              </p>
            </div>

            <button
              onClick={onOpenNewProposal}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs active:scale-95 transition-all shrink-0"
            >
              + PROPONER UN JUEGO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proposals.slice(0, 3).map((p) => (
              <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1">{p.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">👍 {p.votesCount} votos</span>
                  <button
                    onClick={() => onNavigateTab('proposals')}
                    className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
                  >
                    Votar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 💬 COMUNIDAD */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>Comunidad</span>
          </h2>
          <button
            onClick={() => onNavigateTab('community')}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Ver muro completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentComments.map((c) => (
            <div key={c.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src={c.userPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.userId}`}
                  alt={c.userName}
                  className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{c.userName}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">"{c.content}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. ❤️ APOYA ANAPSE VIDEO GAMES */}
      <section>
        <div className="rounded-2xl p-6 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-cyan-500/10 dark:from-slate-900 dark:to-slate-900 border border-rose-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center justify-center md:justify-start gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Apoya ANAPSE VIDEO GAMES</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
              Somos un estudio independiente. Tus aportes nos permiten seguir creando videojuegos gratuitos para todos.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('support')}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all shrink-0"
          >
            ❤️ APOYAR AHORA
          </button>
        </div>
      </section>
    </div>
  );
};
