import React from 'react';
import {
  Home,
  Gamepad2,
  Sparkles,
  Flame,
  Hammer,
  Lightbulb,
  MessageSquare,
  Heart,
  Shield,
  ChevronRight,
  Compass,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGameData } from '../context/GameDataContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedFilterCategory: string;
  setSelectedFilterCategory: (cat: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  selectedFilterCategory,
  setSelectedFilterCategory,
}) => {
  const { isStaff } = useAuth();
  const { proposals, games, setSelectedGame } = useGameData();

  const mainNavItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'games', label: 'Todos los Juegos', icon: Gamepad2, count: games.length },
    { id: 'new', label: 'Juegos Nuevos', icon: Sparkles },
    { id: 'popular', label: 'Más Jugados', icon: Flame },
    { id: 'creating', label: 'Estamos Creando', icon: Hammer },
    { id: 'proposals', label: 'Proponer Juego', icon: Lightbulb, count: proposals.length },
    { id: 'community', label: 'Comunidad', icon: MessageSquare },
    { id: 'support', label: 'Apoyar ANAPSE', icon: Heart },
  ];

  const categories = [
    { id: 'TODAS', label: 'Todas las Categorías', icon: '⭐' },
    { id: 'ARCADE', label: 'Arcade', icon: '🎯' },
    { id: 'ANIMALES', label: 'Animales', icon: '🐾' },
    { id: 'AVENTURA', label: 'Aventura', icon: '🏃' },
    { id: 'PUZZLE', label: 'Puzzle', icon: '🧩' },
    { id: 'CARRERAS', label: 'Carreras', icon: '🏎️' },
  ];

  const handleNav = (id: string) => {
    setSelectedGame(null);
    setCurrentTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedFilterCategory(catId);
    setSelectedGame(null);
    if (currentTab !== 'games') {
      setCurrentTab('games');
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-56 lg:w-60 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 min-h-[calc(100vh-4.5rem)] p-3 lg:p-4 space-y-6 select-none sticky top-18 transition-colors">
      
      {/* Primary Discovery Navigation */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 font-['Orbitron']">
          Descubrir
        </p>

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all text-left group ${
                isActive
                  ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Navigation Section */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 font-['Orbitron']">
          Categorías
        </p>

        {categories.map((cat) => {
          const isSelected = selectedFilterCategory === cat.id && currentTab === 'games';

          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left ${
                isSelected
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span className="truncate">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Admin / Staff Access (Discrete at bottom) */}
      {isStaff && (
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-1.5 font-['Orbitron']">
            Administración
          </p>
          <button
            onClick={() => handleNav('admin')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
              currentTab === 'admin'
                ? 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/40'
                : 'text-orange-600/80 dark:text-orange-400/80 hover:text-orange-600 dark:hover:text-orange-300 hover:bg-orange-500/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-orange-500" />
              <span>Dashboard Admin</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      )}

      {/* Footer Tagline */}
      <div className="mt-auto pt-4 border-t border-slate-200/60 dark:border-slate-800/60 px-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-bold text-slate-700 dark:text-slate-300">ANAPSE VIDEO GAMES</p>
        <p className="text-[10px] leading-relaxed">Juegos gratis para jugar y descubrir.</p>
        <p className="text-[9px] text-slate-400 dark:text-slate-500 pt-1">© 2026 ANAPSE</p>
      </div>
    </aside>
  );
};
