import React from 'react';
import { Gamepad2, Heart, Shield, Code2, ExternalLink, Sparkles } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs mt-16 pb-20 lg:pb-12 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-orange-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-['Orbitron'] font-black text-cyan-400 text-sm">
                  A
                </div>
              </div>
              <span className="font-black text-base text-white font-['Orbitron'] tracking-wider">
                ANAPSE VIDEO GAMES
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Portal central de videojuegos desarrollados por ANAPSE. Catálogo unificado, comunidad activa, propuestas de nuevos juegos, encuestas interactivas y rankings mundiales.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
              <span>● Firebase Central Activo</span>
              <span>•</span>
              <span>● ANAPSE Spec v1 Ready</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider font-['Orbitron']">
              Plataforma
            </p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onTabChange('catalog')} className="hover:text-cyan-400 transition-colors">
                  Catálogo de Juegos
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('proposals')} className="hover:text-cyan-400 transition-colors">
                  Propuestas de la Comunidad
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('polls')} className="hover:text-cyan-400 transition-colors">
                  Encuestas y Votaciones
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('rankings')} className="hover:text-cyan-400 transition-colors">
                  Rankings & Récords
                </button>
              </li>
            </ul>
          </div>

          {/* Developers & Tech */}
          <div className="space-y-2">
            <p className="font-bold text-white uppercase text-[11px] tracking-wider font-['Orbitron']">
              Desarrollo
            </p>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onTabChange('spec')} className="hover:text-cyan-400 transition-colors">
                  ANAPSE Game Spec v1
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('admin')} className="hover:text-cyan-400 transition-colors">
                  Dashboard Administrativo
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/anapse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <span>GitHub de ANAPSE</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} ANAPSE VIDEO GAMES. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>para la comunidad gamer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
