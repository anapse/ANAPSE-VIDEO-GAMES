import React, { useState } from 'react';
import {
  Home,
  Gamepad2,
  Lightbulb,
  MessageSquare,
  Heart,
  Shield,
  Search,
  LogIn,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Bot,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGameData } from '../context/GameDataContext';
import { UserRole } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewProposal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  onOpenNewProposal,
}) => {
  const { profile, signInWithGoogle, signOut, simulateRoleChange, isAdmin, isStaff } = useAuth();
  const { mascotConfig, updateMascotConfig, proposals, setSelectedGame } = useGameData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Simple Public Navigation Menu (Roblox-style simplicity as requested in Section 4)
  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'games', label: 'Juegos', icon: Gamepad2 },
    { id: 'proposals', label: 'Proponer', icon: Lightbulb, badge: proposals.length },
    { id: 'community', label: 'Comunidad', icon: MessageSquare },
    { id: 'support', label: 'Apoyar', icon: Heart },
  ];

  const handleNavClick = (tabId: string) => {
    setSelectedGame(null);
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/92 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Official Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-orange-500 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400 font-['Orbitron'] text-lg sm:text-xl">
                  A
                </span>
                <Gamepad2 className="w-3.5 h-3.5 text-cyan-400 absolute bottom-1 right-1 opacity-80" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-wider text-base sm:text-xl text-white font-['Orbitron'] group-hover:text-cyan-400 transition-colors">
                  ANAPSE
                </span>
                <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-['Orbitron']">
                  GAMES
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">Juegos gratis para jugar y compartir</p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar juegos, géneros o etiquetas..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-900/90 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Simple Public Menu (Roblox style) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-orange-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin Dashboard Protected Access */}
            {isStaff && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentTab === 'admin'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'text-orange-300 hover:bg-orange-500/10'
                }`}
              >
                <Shield className="w-4 h-4 text-orange-400" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          {/* User Profile & Right Actions */}
          <div className="flex items-center gap-2">
            
            {/* Mascot Quick Toggle */}
            <button
              onClick={() => updateMascotConfig({ enabled: !mascotConfig.enabled })}
              title={mascotConfig.enabled ? 'Desactivar Mascota' : 'Activar Mascota'}
              className={`p-2 rounded-xl border text-xs flex items-center transition-all ${
                mascotConfig.enabled
                  ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Bot className="w-4 h-4" />
            </button>

            {/* Quick Propose CTA */}
            <button
              onClick={onOpenNewProposal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs font-['Orbitron'] shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>PROPONER</span>
            </button>

            {/* User Auth Profile */}
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/40 transition-all"
                >
                  <img
                    src={profile.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.uid}`}
                    alt={profile.displayName}
                    className="w-7 h-7 rounded-lg object-cover bg-slate-800 border border-cyan-500/30"
                  />
                  <div className="hidden sm:block text-left pr-1">
                    <p className="text-xs font-bold text-slate-200 truncate max-w-[90px] leading-tight">
                      {profile.displayName}
                    </p>
                    <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-wider block">
                      {profile.role}
                    </span>
                  </div>
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/98 border border-slate-700 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-xs font-bold text-white truncate">{profile.displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{profile.email || 'Gamer ANAPSE'}</p>
                      <span className="mt-1 inline-block px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[9px] font-black text-cyan-300">
                        {profile.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <p className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-1">
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
                            profile.role === r ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{r}</span>
                          {profile.role === r && <span className="text-cyan-400 text-xs">✓</span>}
                        </button>
                      ))}
                    </div>

                    {isStaff && (
                      <button
                        onClick={() => {
                          handleNavClick('admin');
                          setShowRoleMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-orange-400 hover:bg-orange-500/10 flex items-center gap-2 mt-1 border-t border-slate-800"
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
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 mt-1 border-t border-slate-800"
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-sm shadow-cyan-500/10"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Ingresar</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 border-b border-slate-800 px-4 py-4 space-y-2 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-left ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenNewProposal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 mr-2 font-['Orbitron']"
            >
              <Lightbulb className="w-4 h-4" />
              <span>PROPONER JUEGO</span>
            </button>

            {isStaff && (
              <button
                onClick={() => handleNavClick('admin')}
                className="py-2 px-3 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
