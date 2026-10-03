import React from 'react';
import { Gamepad2, Lightbulb, Vote, Trophy, MessageSquare, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGameData } from '../context/GameDataContext';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const { isModerator } = useAuth();
  const { setSelectedGame } = useGameData();

  const navItems = [
    { id: 'catalog', label: 'Juegos', icon: Gamepad2 },
    { id: 'proposals', label: 'Propuestas', icon: Lightbulb },
    { id: 'polls', label: 'Encuestas', icon: Vote },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'community', label: 'Comunidad', icon: MessageSquare },
  ];

  if (isModerator) {
    navItems.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  const handleTabClick = (tabId: string) => {
    setSelectedGame(null);
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-cyan-500/20 shadow-sm shadow-cyan-500/30' : ''
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
