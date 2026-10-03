import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { ASSETS } from '../lib/assets';

interface FooterProps {
  onTabChange: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs mt-16 pb-20 lg:pb-12 pt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-amber-500 p-0.5 shadow-xs flex items-center justify-center overflow-hidden">
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
                <button onClick={() => onTabChange('games')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
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
            </ul>
          </div>

          {/* Admin & Info */}
          <div className="space-y-2">
            <p className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider font-['Orbitron']">
              Información
            </p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onTabChange('admin')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Dashboard de Administración
                </button>
              </li>
            </ul>
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
