import React, { useState } from 'react';
import {
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Code2,
  Layers,
  X,
  Send,
} from 'lucide-react';
import { Proposal } from '../types';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface CommunityProposalsProps {
  onOpenNewProposal: () => void;
}

export const CommunityProposals: React.FC<CommunityProposalsProps> = ({ onOpenNewProposal }) => {
  const { proposals, voteProposal, userVotes, categories, addComment, comments } = useGameData();
  const { profile, currentUser } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [activeCommentModalProposal, setActiveCommentModalProposal] = useState<Proposal | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  const handleVote = (proposalId: string) => {
    voteProposal(proposalId);
    if (!userVotes[proposalId]) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }
  };

  const getStatusBadge = (status: Proposal['status']) => {
    switch (status) {
      case 'IN_DEVELOPMENT':
        return { label: 'EN CREACIÓN', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'APPROVED':
        return { label: 'SELECCIONADO', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'COMPLETED':
        return { label: 'PUBLICADO', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'REJECTED':
        return { label: 'ARCHIVADO', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'PENDING':
      default:
        return { label: 'PROPUESTO', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
  };

  const filteredProposals = proposals.filter((p) => {
    if (selectedCategory !== 'TODAS' && p.category !== selectedCategory) return false;
    if (selectedStatus !== 'TODOS' && p.status !== selectedStatus) return false;
    return true;
  });

  // Modal comments for proposal
  const proposalComments = activeCommentModalProposal
    ? comments.filter((c) => c.targetType === 'proposal' && c.targetId === activeCommentModalProposal.id)
    : [];

  const handleSendProposalComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentModalProposal || !newCommentText.trim()) return;
    addComment('proposal', activeCommentModalProposal.id, newCommentText.trim(), null);
    setNewCommentText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in">
      
      {/* Header & CTA Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-indigo-950/60 border border-amber-500/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-['Orbitron']">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMUNIDAD ACTIVA ANAPSE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-['Orbitron']">
              💡 PROPÓN UN JUEGO
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ¿Tienes una gran idea para el próximo videojuego de ANAPSE? Compártela con la comunidad, vota por tus favoritas y las ideas más votadas entrarán a desarrollo oficial.
            </p>
          </div>

          <button
            onClick={onOpenNewProposal}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm font-['Orbitron'] shadow-lg shadow-orange-500/25 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>ENVIAR MI IDEA</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedStatus('TODOS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'TODOS'
                ? 'bg-cyan-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Todos ({proposals.length})
          </button>
          <button
            onClick={() => setSelectedStatus('PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'PENDING'
                ? 'bg-cyan-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            En Votación
          </button>
          <button
            onClick={() => setSelectedStatus('APPROVED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'APPROVED'
                ? 'bg-cyan-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Seleccionados
          </button>
          <button
            onClick={() => setSelectedStatus('IN_DEVELOPMENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === 'IN_DEVELOPMENT'
                ? 'bg-cyan-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            En Creación
          </button>
        </div>

        <span className="text-xs font-mono text-slate-400">{filteredProposals.length} propuestas registradas</span>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProposals.map((proposal) => {
          const isVoted = !!userVotes[proposal.id];
          const badge = getStatusBadge(proposal.status);

          return (
            <div
              key={proposal.id}
              className="rounded-3xl bg-slate-900/85 border border-slate-800 hover:border-amber-500/40 p-5 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-amber-500/10 transition-all"
            >
              <div className="space-y-3">
                {/* Top author & status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={proposal.authorPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${proposal.id}`}
                      alt={proposal.authorName}
                      className="w-7 h-7 rounded-lg bg-slate-800"
                    />
                    <span className="text-xs font-bold text-slate-300">{proposal.authorName}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase font-['Orbitron'] ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Optional Image */}
                {proposal.imageUrl && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
                    <img
                      src={proposal.imageUrl}
                      alt={proposal.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-cyan-400">
                      {proposal.category}
                    </span>
                  </div>
                )}

                {/* Title & Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white font-['Orbitron'] line-clamp-1">
                    {proposal.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                    {proposal.description}
                  </p>
                  {proposal.idea && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-amber-300">
                      <b>Mecánica clave:</b> {proposal.idea}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Bar: [VOTAR] + [COMENTAR] */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleVote(proposal.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs font-['Orbitron'] flex items-center justify-center gap-2 transition-all ${
                    isVoted
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? 'fill-current' : ''}`} />
                  <span>{isVoted ? 'VOTADO' : 'VOTAR'} ({proposal.votesCount})</span>
                </button>

                <button
                  onClick={() => setActiveCommentModalProposal(proposal)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{proposal.commentsCount || 0}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Proposal Comments Modal */}
      {activeCommentModalProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white font-['Orbitron'] truncate max-w-[340px]">
                  {activeCommentModalProposal.title}
                </h3>
                <p className="text-xs text-slate-400">Comentarios sobre esta propuesta</p>
              </div>
              <button
                onClick={() => setActiveCommentModalProposal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {proposalComments.length > 0 ? (
                proposalComments.map((c) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-300">{c.userName}</span>
                      <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-200">{c.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-500 py-8">
                  No hay comentarios aún. ¡Sé el primero en aportar ideas a esta propuesta!
                </p>
              )}
            </div>

            {/* Add comment */}
            <form onSubmit={handleSendProposalComment} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Escribe tu sugerencia..."
                className="flex-1 p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-4 py-2.5 bg-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
