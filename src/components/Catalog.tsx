import React, { useState, useMemo } from 'react';
import { GameCard } from './GameCard';
import { Game, GameStatus } from '../types';
import { useGameData } from '../context/GameDataContext';
import {
  Gamepad2,
  Filter,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Trophy,
  Search,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface CatalogProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onPlayGame: (game: Game) => void;
  onViewDetails: (game: Game) => void;
  onShareGame: (game: Game) => void;
  onDonateGame: (game: Game) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  searchQuery,
  setSearchQuery,
  onPlayGame,
  onViewDetails,
  onShareGame,
  onDonateGame,
}) => {
  const { games, categories } = useGameData();

  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'likes' | 'recent' | 'name'>('popular');

  const statusOptions: { label: string; value: string; count?: number }[] = [
    { label: 'TODOS', value: 'TODOS', count: games.length },
    { label: 'PUBLICADO', value: 'PUBLICADO', count: games.filter((g) => g.status === 'PUBLICADO').length },
    { label: 'BETA', value: 'BETA', count: games.filter((g) => g.status === 'BETA').length },
    { label: 'EN PROMOCIÓN', value: 'EN PROMOCIÓN', count: games.filter((g) => g.status === 'EN PROMOCIÓN').length },
    { label: 'EN CREACIÓN', value: 'EN CREACIÓN', count: games.filter((g) => g.status === 'EN CREACIÓN').length },
    { label: 'EN REPARACIÓN', value: 'EN REPARACIÓN', count: games.filter((g) => g.status === 'EN REPARACIÓN').length },
    { label: 'PRÓXIMAMENTE', value: 'PRÓXIMAMENTE', count: games.filter((g) => g.status === 'PRÓXIMAMENTE').length },
    { label: 'SIN CATEGORÍA', value: 'SIN CATEGORÍA', count: games.filter((g) => g.status === 'SIN CATEGORÍA').length },
  ];

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Status filter
        if (selectedStatus !== 'TODOS' && game.status !== selectedStatus) {
          return false;
        }
        // Category filter
        if (selectedCategory !== 'TODAS' && game.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = game.name.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchCat = game.category.toLowerCase().includes(q);
          const matchTags = game.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchCat && !matchTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.playsCount - a.playsCount;
        if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg;
        if (sortBy === 'likes') return b.likesCount - a.likesCount;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [games, selectedStatus, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Sort Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Orbitron']">
              CATÁLOGO DE JUEGOS
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Explora {games.length} videojuegos desarrollados y publicados por ANAPSE
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-400">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="popular">Más Jugados</option>
            <option value="rating">Mejor Calificados</option>
            <option value="likes">Más Likes</option>
            <option value="recent">Más Recientes</option>
            <option value="name">Alfabético (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Status Filter Bar (Scrollable on Mobile) */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Filtrar por Estado:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {statusOptions.map((opt) => {
            const isSelected = selectedStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-extrabold tracking-wide transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{opt.label}</span>
                {opt.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-orange-400" />
          <span>Categorías:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedCategory('TODAS')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === 'TODAS'
                ? 'bg-orange-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas ({games.length})
          </button>
          {categories.map((cat) => {
            const count = games.filter((g) => g.category.toLowerCase() === cat.name.toLowerCase()).length;
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'TODAS' : cat.name)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.name} {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Search/Filter info indicator */}
      {(selectedStatus !== 'TODOS' || selectedCategory !== 'TODAS' || searchQuery) && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <span>Filtros activos:</span>
            {selectedStatus !== 'TODOS' && <span className="font-bold bg-cyan-900/60 px-2 py-0.5 rounded">{selectedStatus}</span>}
            {selectedCategory !== 'TODAS' && <span className="font-bold bg-cyan-900/60 px-2 py-0.5 rounded">{selectedCategory}</span>}
            {searchQuery && <span className="font-bold bg-cyan-900/60 px-2 py-0.5 rounded">"{searchQuery}"</span>}
            <span>({filteredGames.length} resultados)</span>
          </div>
          <button
            onClick={() => {
              setSelectedStatus('TODOS');
              setSelectedCategory('TODAS');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-cyan-400 hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Grid of Game Cards */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredGames.map((game) => (
            <GameCard
              key={game.gameId}
              game={game}
              onPlay={onPlayGame}
              onViewDetails={onViewDetails}
              onShare={onShareGame}
              onDonate={onDonateGame}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-dashed border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-['Orbitron']">No se encontraron juegos</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No hay videojuegos que coincidan con los filtros o la búsqueda seleccionada.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedStatus('TODOS');
              setSelectedCategory('TODAS');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Ver todos los juegos
          </button>
        </div>
      )}
    </div>
  );
};
