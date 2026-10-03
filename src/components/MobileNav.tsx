import React from 'react';
import { Home, Gamepad2, Lightbulb, MessageSquare, Heart } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const { setSelectedGame } = useGameData();

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'games', label: 'Juegos', icon: Gamepad2 },
    { id: 'proposals', label: 'Proponer', icon: Lightbulb },
    { id: 'community', label: 'Comunidad', icon: MessageSquare },
    { id: 'support', label: 'Apoyar', icon: Heart },
  ];

  const handleTabClick = (tabId: string) => {
    setSelectedGame(null);
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 shadow-lg safe-area-pb transition-colors">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-cyan-50 dark:bg-cyan-500/20' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
