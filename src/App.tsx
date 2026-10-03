import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameDataProvider, useGameData } from './context/GameDataContext';
import { Header } from './components/Header';
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
import { Game } from './types';

const MainAppContent: React.FC = () => {
  const { games, selectedGame, setSelectedGame, activeGameModal, setActiveGameModal } = useGameData();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [shareModalGame, setShareModalGame] = useState<Game | null>(null);
  const [donationModalGame, setDonationModalGame] = useState<Game | null>(null);

  // Hash-based clean routing check for #game-fox-thief etc.
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Gamer Header with public Roblox-style nav */}
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
        onOpenNewProposal={() => setIsNewProposalOpen(true)}
      />

      {/* Main Public Body */}
      <main className="flex-1">
        {selectedGame ? (
          /* Individual Game Detail View (/juegos/:slug) */
          <GameDetailView
            game={selectedGame}
            onBack={handleBackToHome}
            onPlay={handlePlayGame}
            onShare={(g) => setShareModalGame(g)}
            onDonate={(g) => setDonationModalGame(g)}
          />
        ) : (
          /* Tab Navigation Views */
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
              />
            )}

            {currentTab === 'games' && (
              <div className="pt-4">
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

            {currentTab === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Modular Configurable Mascot Pet */}
      <MascotPet />

      {/* Game Modal / Embedded Player */}
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

      {/* Footer */}
      <Footer
        onTabChange={(tab) => {
          setSelectedGame(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Nav Bar */}
      <MobileNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <GameDataProvider>
        <MainAppContent />
      </GameDataProvider>
    </AuthProvider>
  );
}
