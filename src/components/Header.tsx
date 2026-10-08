import React, { useState } from 'react';
import {
  Gamepad2,
  Search,
  LogIn,
  LogOut,
  Menu,
  Shield,
  Sun,
  Moon,
  Heart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGameData } from '../context/GameDataContext';
import { useTheme } from '../context/ThemeContext';
import { ASSETS } from '../lib/assets';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  onOpenMobileMenu,
}) => {
  const {
    profile,
    signOut,
    isAdmin,
    isModerator,
    isStaff,
    setShowAuthModal,
  } = useAuth();
  const { setSelectedGame } = useGameData();
  const { theme, toggleTheme } = useTheme();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleLogoClick = () => {
    setSelectedGame(null);
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs h-16 sm:h-18 flex items-center transition-colors">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Mobile Menu Toggle + Official Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            title="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-amber-600 p-0.5 shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
              <img
                src={ASSETS.logo}
                alt="ANAPSE Logo"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = (e.target as HTMLElement).nextElementSibling;
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
                className="w-full h-full object-contain bg-white dark:bg-slate-950 rounded-[14px]"
              />
              <div
                style={{ display: 'none' }}
                className="w-full h-full bg-slate-900 rounded-[14px] items-center justify-center relative overflow-hidden"
              >
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 font-['Orbitron'] text-base">
                  A
                </span>
                <Gamepad2 className="w-3 h-3 text-amber-400 absolute bottom-1 right-1 opacity-80" />
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-wider text-base sm:text-lg text-slate-900 dark:text-white font-['Orbitron'] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  ANAPSE
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-['Orbitron']">
                  GAMES
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">Descubre y juega gratis</p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md lg:max-w-lg mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 focus:border-amber-500 dark:focus:border-amber-400 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Support Button + Theme Toggle + User Menu */}
        <div className="flex items-center gap-2 shrink-0">
          
          <button
            onClick={() => {
              setSelectedGame(null);
              setCurrentTab('support');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold shadow-xs active:scale-95 transition-all"
            title="Apoyar a ANAPSE VIDEO GAMES"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">APOYAR ANAPSE</span>
            <span className="sm:hidden">APOYAR</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {profile ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500/40 transition-all"
              >
                <img
                  src={profile.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.uid}`}
                  alt={profile.displayName}
                  className="w-7 h-7 rounded-xl object-cover bg-slate-200 dark:bg-slate-700 border border-amber-500/30"
                />
                <span className="hidden lg:inline text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {profile.displayName}
                </span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-50 backdrop-blur-xl animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{profile.displayName}</p>
                    <span className="mt-1 inline-block px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-500/40 text-[9px] font-black text-amber-800 dark:text-amber-300">
                      {profile.role}
                    </span>
                  </div>

                  {isStaff && (
                    <button
                      onClick={() => {
                        setSelectedGame(null);
                        setShowRoleMenu(false);
                        window.location.href = `${window.location.origin}/ANAPSE-VIDEO-GAMES/admin`;
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 mt-1 border-b border-slate-100 dark:border-slate-800 ${
                        isAdmin
                          ? 'text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10'
                          : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>{isAdmin ? 'Panel de Administración' : 'Panel de Moderación'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      signOut();
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setShowAuthModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold transition-all shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
