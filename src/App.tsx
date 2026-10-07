import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameDataProvider, useGameData } from './context/GameDataContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { RobloxHomeView } from './components/RobloxHomeView';
import { Catalog } from './components/Catalog';
import { GameDetailView } from './components/GameDetailView';
import { GameModalPlayer } from './components/GameModalPlayer';
import { CommunityProposals } from './components/CommunityProposals';
import { NewProposalModal } from './components/NewProposalModal';
import { CommunityFeed } from './components/CommunityFeed';
import { SupportView } from './components/SupportView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DonationModal } from './components/DonationModal';
import { ShareModal } from './components/ShareModal';
import { MascotPet } from './components/MascotPet';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { ToolsView } from './components/ToolsView';
import { Game, ToolItem } from './types';
import { ASSETS } from './lib/assets';
import { X, Home, Gamepad2, Sparkles, Flame, Hammer, Lightbulb, MessageSquare, Heart } from 'lucide-react';
import { ToolModalPlayer } from './components/ToolModalPlayer';

const MainAppContent: React.FC = () => {
  const { games, selectedGame, setSelectedGame, activeGameModal, setActiveGameModal, recordPlatformVisit } = useGameData();
  const { isStaff } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('TODAS');
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [shareModalGame, setShareModalGame] = useState<Game | null>(null);
  const [donationModalGame, setDonationModalGame] = useState<Game | null>(null);
  const [activeToolModal, setActiveToolModal] = useState<ToolItem | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Count one website visit per browser session. Reloads in the same tab do not inflate the counter.
  useEffect(() => {
    const visitKey = 'anapse_platform_visit_recorded';
    if (sessionStorage.getItem(visitKey) === '1') return;
    sessionStorage.setItem(visitKey, '1');
    void recordPlatformVisit();
  }, [recordPlatformVisit]);

  // Redirect non-staff users to home if they attempt to access admin/moderation tab
  useEffect(() => {
    if (currentTab === 'admin' && !isStaff) {
      setCurrentTab('home');
    }
  }, [currentTab, isStaff]);

  // Hash-based routing check for #game-fox-thief etc.
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#game-')) {
        const gameId = hash.replace('#game-', '');
        const found = games.find((g) => g.gameId === gameId);
        if (found) {
          setSelectedGame(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [games, setSelectedGame]);

  const handlePlayGame = (game: Game) => {
    setActiveGameModal(game);
  };

  const handleViewGameDetails = (game: Game) => {
    setSelectedGame(game);
    window.location.hash = `game-${game.gameId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedGame(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mobileNavDrawerItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'games', label: 'Todos los Juegos', icon: Gamepad2 },
    { id: 'new', label: 'Juegos Nuevos', icon: Sparkles },
    { id: 'popular', label: 'Más Jugados', icon: Flame },
    { id: 'creating', label: 'Estamos Creando', icon: Hammer },
    { id: 'proposals', label: 'Proponer Juego', icon: Lightbulb },
    { id: 'community', label: 'Comunidad', icon: MessageSquare },
    { id: 'support', label: 'Apoyar ANAPSE', icon: Heart },
    { id: 'tools', label: 'Herramientas', icon: Hammer },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden transition-colors">
      
      {/* Official Fantasy Valley Background - pausado durante el juego para liberar GPU */}
      {!activeGameModal && (
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={ASSETS.background}
          alt="Portal Ambient Background"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
          className="w-full h-full object-cover opacity-95 dark:opacity-75 scale-102"
        />
        {/* Capa ultra sutil e iluminada para ver el paisaje como un mapa de fondo */}
        <div className="absolute inset-0 bg-white/20 dark:bg-slate-950/50 backdrop-blur-[1px]" />
      </div>
      )}
      
      {/* Topbar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedGame(null);
          setCurrentTab(tab);
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q.trim().length > 0 && currentTab !== 'games') {
            setCurrentTab('games');
          }
        }}
        onOpenMobileMenu={() => setMobileDrawerOpen(true)}
      />

      {/* Publicidad superior: visible solo en el portal, nunca dentro del juego */}
      {!activeGameModal && <AdBanner slot="top" />}

      {/* Main Layout: Left Sidebar + Central Discovery Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        
        {/* Persistent Left Sidebar on Desktop / Tablet */}
        {!selectedGame && currentTab !== 'admin' && (
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={(tab) => {
              setSelectedGame(null);
              setCurrentTab(tab);
            }}
            selectedFilterCategory={selectedFilterCategory}
            setSelectedFilterCategory={setSelectedFilterCategory}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          />
        )}

        {/* Central Content Column */}
        <main className="flex-1 min-w-0 pb-16">
          {selectedGame ? (
            /* Ficha Individual del Juego */
            <GameDetailView
              game={selectedGame}
              onBack={handleBackToHome}
              onPlay={handlePlayGame}
              onShare={(g) => setShareModalGame(g)}
              onDonate={(g) => setDonationModalGame(g)}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <RobloxHomeView
                  onPlayGame={handlePlayGame}
                  onViewGameDetails={handleViewGameDetails}
                  onShareGame={(g) => setShareModalGame(g)}
                  onDonateGame={(g) => setDonationModalGame(g)}
                  onNavigateTab={(tab) => {
                    setCurrentTab(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenNewProposal={() => setIsNewProposalOpen(true)}
                  onOpenTool={setActiveToolModal}
                />
              )}

              {(currentTab === 'games' || currentTab === 'new' || currentTab === 'popular' || currentTab === 'creating') && (
                <div className="pt-2">
                  <Catalog
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onPlayGame={handlePlayGame}
                    onViewDetails={handleViewGameDetails}
                    onShareGame={(g) => setShareModalGame(g)}
                    onDonateGame={(g) => setDonationModalGame(g)}
                  />
                </div>
              )}

              {currentTab === 'proposals' && (
                <CommunityProposals onOpenNewProposal={() => setIsNewProposalOpen(true)} />
              )}

              {currentTab === 'community' && <CommunityFeed />}

              {currentTab === 'support' && <SupportView />}

              {currentTab === 'tools' && <ToolsView onOpenTool={setActiveToolModal} />}

              {currentTab === 'admin' && <AdminDashboard />}
            </>
          )}
        </main>
      </div>

      {/* Mascot Companion - pausada durante el juego para liberar CPU/GPU */}
      {!activeGameModal && <MascotPet />}

      {/* Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex">
          <div className="w-72 bg-white dark:bg-slate-900 h-full p-4 space-y-4 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-left duration-200 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold font-['Orbitron'] text-slate-900 dark:text-amber-400 text-sm">MENÚ ANAPSE</span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {mobileNavDrawerItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedGame(null);
                        setCurrentTab(item.id);
                        setMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left ${
                        isActive
                          ? 'bg-amber-500 text-slate-950'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              © 2026 ANAPSE VIDEO GAMES
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* Game Modal Launcher */}
      <AuthModal />
      {activeToolModal && (
        <ToolModalPlayer
          tool={activeToolModal}
          onClose={() => setActiveToolModal(null)}
        />
      )}

      {activeGameModal && (
        <GameModalPlayer
          game={activeGameModal}
          onClose={() => setActiveGameModal(null)}
          onShare={(g) => setShareModalGame(g)}
          onDonate={(g) => setDonationModalGame(g)}
        />
      )}

      {/* Share Modal */}
      {shareModalGame && (
        <ShareModal game={shareModalGame} onClose={() => setShareModalGame(null)} />
      )}

      {/* Donation Modal */}
      {donationModalGame && (
        <DonationModal game={donationModalGame} onClose={() => setDonationModalGame(null)} />
      )}

      {/* New Proposal Modal */}
      <NewProposalModal
        isOpen={isNewProposalOpen}
        onClose={() => setIsNewProposalOpen(false)}
      />

      {/* Publicidad inferior: franja discreta antes del footer */}
      {!activeGameModal && <AdBanner slot="footer" />}

      {/* Footer */}
      <Footer
        onTabChange={(tab) => {
          setSelectedGame(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GameDataProvider>
          <MainAppContent />
        </GameDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
