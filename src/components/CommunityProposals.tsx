import React, { useState } from 'react';
import {
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  Plus,
  Send,
  X,
} from 'lucide-react';
import { Proposal } from '../types';
import { useGameData } from '../context/GameDataContext';
import confetti from 'canvas-confetti';

interface CommunityProposalsProps {
  onOpenNewProposal: () => void;
}

export const CommunityProposals: React.FC<CommunityProposalsProps> = ({ onOpenNewProposal }) => {
  const { proposals, voteProposal, userVotes, addComment, comments } = useGameData();

  const [activeCommentModalProposal, setActiveCommentModalProposal] = useState<Proposal | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const handleVote = (proposalId: string) => {
    voteProposal(proposalId);
    if (!userVotes[proposalId]) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentModalProposal || !newCommentText.trim()) return;
    addComment('proposal', activeCommentModalProposal.id, newCommentText.trim(), null);
    setNewCommentText('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-['Orbitron']">
              Propuestas de la Comunidad
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ¿Qué juego quieres que cree ANAPSE? Propón tus ideas y vota por las mejores.
          </p>
        </div>

        <button
          onClick={onOpenNewProposal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Propón un juego</span>
        </button>
      </div>

      {/* Grid de Propuestas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {proposals.map((proposal) => {
          const isVoted = !!userVotes[proposal.id];
          const proposalComments = comments.filter((c) => c.targetType === 'proposal' && c.targetId === proposal.id);

          return (
            <div key={proposal.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    {proposal.category}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    por {proposal.authorName}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {proposal.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {proposal.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => handleVote(proposal.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isVoted
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>👍 {proposal.votesCount} Votos</span>
                </button>

                <button
                  onClick={() => setActiveCommentModalProposal(proposal)}
                  className="flex items-center gap-1 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{proposalComments.length} comentarios</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Comentarios de Propuesta */}
      {activeCommentModalProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                Comentarios: {activeCommentModalProposal.title}
              </h3>
              <button
                onClick={() => setActiveCommentModalProposal(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostComment} className="space-y-2">
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Escribe tu opinión sobre esta propuesta..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Comentar</span>
                </button>
              </div>
            </form>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {comments
                .filter((c) => c.targetType === 'proposal' && c.targetId === activeCommentModalProposal.id)
                .map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{c.userName}</span>
                    <p className="text-slate-600 dark:text-slate-300">{c.content}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
