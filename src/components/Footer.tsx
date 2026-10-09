import React, { useState, useEffect } from 'react';
import { Heart, Shield, Users } from 'lucide-react';
import { ASSETS } from '../lib/assets';
import { useGameData } from '../context/GameDataContext';
import { isUserOnline } from './UserBadge';

interface FooterProps {
  onTabChange: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  const { users } = useGameData();

  // Periodic heartbeat timer to re-evaluate presence every 30 seconds
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // 1. Total registered users
  const totalUsers = users.length;

  // 2. All moderators registered (Total count, both online & offline)
  const allModerators = users.filter((u) => u.role === 'MODERADOR');
  const totalModeratorsCount = allModerators.length;

  // 3. Only online moderators (sorted by most recently active)
  const onlineModerators = allModerators
    .filter((u) => isUserOnline(u.lastSeen))
    .sort((a, b) => {
      const timeA = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
      const timeB = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
      return timeB - timeA;
    });

  // Limit of shown online moderators: 3
  const displayedOnlineMods = onlineModerators.slice(0, 3);
  const remainingOnlineCount = onlineModerators.length - 3;

  return (
    <footer className="relative z-10 w-full bg-[#f5efe3]/65 dark:bg-[#302b23]/55 backdrop-blur-[2px] border-t border-white/35 dark:border-amber-100/10 shadow-[0_-6px_24px_rgba(35,25,10,0.06)] text-slate-600 dark:text-slate-300 text-xs mt-16 pb-20 lg:pb-12 pt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3 sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-xs flex items-center justify-center overflow-hidden">
                <img
                  src={ASSETS.logo}
                  alt="ANAPSE Logo"
                  className="w-full h-full object-contain rounded-[10px] bg-white dark:bg-slate-950"
                />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white font-['Orbitron'] tracking-wider">
                ANAPSE VIDEO GAMES
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Plataforma de descubrimiento de videojuegos independientes desarrollados por ANAPSE. Gratis para jugar, probar y compartir con tus amigos.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider font-['Orbitron']">
              Navegación
            </p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onTabChange('games')} className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Catálogo de Juegos
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('proposals')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Propuestas de la Comunidad
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('community')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Muro de la Comunidad
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('support')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Apoyar ANAPSE
                </button>
              </li>
              <li className="pt-1">
                <button onClick={() => onTabChange('admin')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-[11px] text-slate-400">
                  Panel de Administración
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Moderation Section */}
          <div className="space-y-4">
            
            {/* 👥 COMUNIDAD */}
            <div className="space-y-1">
              <p className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider font-['Orbitron'] flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <Users className="w-3.5 h-3.5" />
                <span>COMUNIDAD</span>
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {totalUsers} {totalUsers === 1 ? 'jugador registrado' : 'jugadores registrados'}
              </p>
            </div>

            {/* 🛡️ MODERACIÓN */}
            <div className="space-y-2">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider font-['Orbitron'] flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>MODERACIÓN</span>
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {totalModeratorsCount} {totalModeratorsCount === 1 ? 'moderador' : 'moderadores'}
                </p>
              </div>

              {/* Only show online moderators */}
              {displayedOnlineMods.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {displayedOnlineMods.map((mod) => (
                    <div
                      key={mod.uid}
                      className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium"
                    >
                      <span
                        className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs shadow-emerald-500/50 animate-pulse shrink-0"
                        title="En línea"
                      />
                      <span className="truncate">{mod.displayName}</span>
                      <span className="text-slate-400 dark:text-slate-500">·</span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Mod
                      </span>
                    </div>
                  ))}

                  {/* If more than 3 online moderators */}
                  {remainingOnlineCount > 0 && (
                    <p className="text-[11px] text-emerald-600/90 dark:text-emerald-400/90 font-medium pt-0.5">
                      + {remainingOnlineCount} {remainingOnlineCount === 1 ? 'moderador en línea' : 'moderadores en línea'}
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="border-t border-slate-200/80 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} ANAPSE VIDEO GAMES. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>para jugadores de todo el mundo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
