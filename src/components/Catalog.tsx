import React, { useState, useMemo } from 'react';
import { GameCard } from './GameCard';
import { Game } from '../types';
import { useGameData } from '../context/GameDataContext';
import {
  Gamepad2,
  Filter,
  SlidersHorizontal,
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
      
      {/* Header & Sort Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-['Orbitron']">
              Catálogo de Juegos
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Explora {games.length} juegos gratis en ANAPSE VIDEO GAMES
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="popular">Más Jugados</option>
            <option value="rating">Mejor Calificados</option>
            <option value="likes">Más Likes</option>
            <option value="recent">Más Recientes</option>
            <option value="name">Alfabético (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Status Filter Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-amber-500" />
          <span>Filtrar Estado:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {statusOptions.map((opt) => {
            const isSelected = selectedStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <span>{opt.label}</span>
                {opt.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
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

      {/* Active Search / Filter Banner */}
      {(selectedStatus !== 'TODOS' || selectedCategory !== 'TODAS' || searchQuery) && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-900 dark:text-amber-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Filtros activos:</span>
            {selectedStatus !== 'TODOS' && <span className="font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-amber-200 dark:border-slate-700">{selectedStatus}</span>}
            {selectedCategory !== 'TODAS' && <span className="font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-amber-200 dark:border-slate-700">{selectedCategory}</span>}
            {searchQuery && <span className="font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-amber-200 dark:border-slate-700">"{searchQuery}"</span>}
            <span>({filteredGames.length} resultados)</span>
          </div>
          <button
            onClick={() => {
              setSelectedStatus('TODOS');
              setSelectedCategory('TODAS');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
          >
            Limpiar
          </button>
        </div>
      )}

      {/* Grid of Game Cards (4 columns on PC) */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pt-2">
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
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Orbitron']">No se encontraron juegos</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Prueba cambiando la búsqueda o los filtros de categorías.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedStatus('TODOS');
              setSelectedCategory('TODAS');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs"
          >
            Ver todos los juegos
          </button>
        </div>
      )}
    </div>
  );
};
