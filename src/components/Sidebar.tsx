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
  Menu,
  Wrench,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGameData } from '../context/GameDataContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedFilterCategory: string;
  setSelectedFilterCategory: (cat: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  selectedFilterCategory,
  setSelectedFilterCategory,
  collapsed,
  onToggleCollapse,
}) => {
  const { isStaff, isAdmin, isModerator } = useAuth();
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

  const toolNavItems = [
    { id: 'tools', label: 'Herramientas', icon: Wrench },
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
    <aside
      className={`hidden md:flex flex-col shrink-0 bg-[#f5efe3]/75 dark:bg-[#302b23]/75 backdrop-blur-xl border-r border-white/50 dark:border-amber-100/15 shadow-[8px_0_28px_rgba(25,20,12,0.18)] min-h-[calc(100vh-4.5rem)] p-2 sm:p-3 select-none sticky top-18 transition-all duration-300 ${
        collapsed ? 'w-16 items-center' : 'w-56 lg:w-60'
      }`}
    >
      {/* Sidebar Header with Hamburger Toggle */}
      <div className={`w-full flex items-center mb-3 ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
        {!collapsed && (
          <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 font-['Orbitron'] truncate">
            MENÚ ANAPSE
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
          title={collapsed ? 'Expandir menú (☰)' : 'Contraer menú'}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Discovery Navigation */}
      <div className="w-full space-y-1">
        {!collapsed && (
          <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 font-['Orbitron']">
            Descubrir
          </p>
        )}

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-2xl text-xs sm:text-sm font-semibold transition-all group relative ${
                collapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2 text-left'
              } ${
                isActive
                  ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 font-bold shadow-[0_5px_14px_rgba(217,119,6,0.35),inset_0_1px_0_rgba(255,255,255,0.6)]'
                  : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-white/45 dark:hover:bg-white/10 hover:shadow-[0_4px_12px_rgba(25,20,12,0.12)] hover:-translate-y-0.5'
              }`}
            >
              <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-slate-950' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!collapsed && item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-slate-950/20 text-slate-950'
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

      {/* Tools - separate row */}
      <div className="w-full pt-3 mt-2 border-t border-slate-200/80 dark:border-slate-800/80">
        {toolNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-2xl text-xs sm:text-sm font-semibold transition-all group relative ${collapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2 text-left'} ${isActive ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'}`}
            >
              <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-500 dark:text-slate-400'}`} />
                {!collapsed && <span className="truncate">Herramientas</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Category Navigation Section */}
      <div className="w-full pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1">
        {!collapsed && (
          <p className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 font-['Orbitron']">
            Categorías
          </p>
        )}

        {categories.map((cat) => {
          const isSelected = selectedFilterCategory === cat.id && currentTab === 'games';

          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              title={collapsed ? cat.label : undefined}
              className={`w-full flex items-center rounded-xl text-xs font-medium transition-all group ${
                collapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-1.5 text-left'
              } ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              {!collapsed && <span className="truncate">{cat.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Admin / Moderator Access (Discrete at bottom) */}
      {isStaff && (
        <div className="w-full pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
          {!collapsed && (
            <p className={`px-2 text-[10px] font-extrabold uppercase tracking-widest mb-1 font-['Orbitron'] ${
              isAdmin ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {isAdmin ? 'Administración' : 'Moderación'}
            </p>
          )}
          <button
            onClick={() => handleNav('admin')}
            title={collapsed ? (isAdmin ? 'Dashboard Admin' : 'Panel Moderador') : undefined}
            className={`w-full flex items-center rounded-xl text-xs font-bold transition-all ${
              collapsed ? 'justify-center p-2' : 'justify-between px-3 py-2 text-left'
            } ${
              currentTab === 'admin'
                ? isAdmin
                  ? 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/40'
                  : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                : isAdmin
                ? 'text-orange-600/80 dark:text-orange-400/80 hover:text-orange-600 dark:hover:text-orange-300 hover:bg-orange-500/10'
                : 'text-emerald-600/80 dark:text-emerald-400/80 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
              <Shield className={`w-4 h-4 ${isAdmin ? 'text-orange-500' : 'text-emerald-500'}`} />
              {!collapsed && <span>{isAdmin ? 'Dashboard Admin' : 'Panel Moderador'}</span>}
            </div>
            {!collapsed && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </button>
        </div>
      )}
    </aside>
  );
};
