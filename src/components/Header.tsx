import React, { useState } from 'react';
import {
  Gamepad2,
  Search,
  LogIn,
  LogOut,
  User as UserIcon,
  Menu,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGameData } from '../context/GameDataContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';
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
  const { profile, signInWithGoogle, signOut, simulateRoleChange, isStaff } = useAuth();
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-amber-500 p-0.5 shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
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
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400 font-['Orbitron'] text-base">
                  A
                </span>
                <Gamepad2 className="w-3 h-3 text-cyan-400 absolute bottom-1 right-1 opacity-80" />
              </div>
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-wider text-base sm:text-lg text-slate-900 dark:text-white font-['Orbitron'] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
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

        {/* Center: Search Bar (Clean, friendly) */}
        <div className="flex-1 max-w-md lg:max-w-lg mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar juegos..."
              className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 focus:border-cyan-500 dark:focus:border-cyan-400 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
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

        {/* Right: Theme Toggle + User Login / Profile Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Theme Toggle (☀️ / 🌙) */}
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
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/40 transition-all"
              >
                <img
                  src={profile.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.uid}`}
                  alt={profile.displayName}
                  className="w-7 h-7 rounded-xl object-cover bg-slate-200 dark:bg-slate-700 border border-cyan-500/30"
                />
                <span className="hidden lg:inline text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {profile.displayName}
                </span>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-50 backdrop-blur-xl animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{profile.displayName}</p>
                    <span className="mt-1 inline-block px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/40 text-[9px] font-black text-cyan-800 dark:text-cyan-300">
                      {profile.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-3 uppercase tracking-wider mb-1">
                      Roles del Sistema
                    </p>
                    {(
                      ['ADMINISTRADOR', 'MAYORDOMO', 'EDITOR', 'MODERADOR', 'USUARIO', 'VISITANTE'] as UserRole[]
                    ).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          simulateRoleChange(r);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                          profile.role === r
                            ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{r}</span>
                        {profile.role === r && <span className="text-cyan-600 dark:text-cyan-400 text-xs">✓</span>}
                      </button>
                    ))}
                  </div>

                  {isStaff && (
                    <button
                      onClick={() => {
                        setSelectedGame(null);
                        setCurrentTab('admin');
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 flex items-center gap-2 mt-1 border-t border-slate-100 dark:border-slate-800"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Abrir Dashboard Admin</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      signOut();
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2 mt-1 border-t border-slate-100 dark:border-slate-800"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-xs"
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
