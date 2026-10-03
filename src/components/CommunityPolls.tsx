import React, { useState } from 'react';
import { Vote, CheckCircle2, Plus, Sparkles, Clock, BarChart3 } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const CommunityPolls: React.FC = () => {
  const { polls, votePoll, userPollVotes, createPoll } = useGameData();
  const { isAdmin, isModerator } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '']);

  const handleVote = (pollId: string, optionIndex: number) => {
    votePoll(pollId, optionIndex);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = newOptions.filter((o) => o.trim().length > 0);
    if (!newQuestion.trim() || validOptions.length < 2) return;

    await createPoll({
      question: newQuestion.trim(),
      description: newDescription.trim() || undefined,
      options: validOptions,
    });

    setShowCreateModal(false);
    setNewQuestion('');
    setNewDescription('');
    setNewOptions(['', '', '']);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Vote className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Orbitron']">
              ENCUESTAS DE LA COMUNIDAD
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Vota por las decisiones de desarrollo: personajes, modos de juego y próximos lanzamientos.
          </p>
        </div>

        {isModerator && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs font-['Orbitron'] flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>NUEVA ENCUESTA</span>
          </button>
        )}
      </div>

      {/* Polls List */}
      <div className="space-y-6">
        {polls.map((poll) => {
          const userVoteIdx = userPollVotes[poll.id];
          const hasVoted = userVoteIdx !== undefined;

          return (
            <div
              key={poll.id}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/85 border border-slate-800 shadow-xl space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>ENCUESTA OFICIAL ANAPSE</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white font-['Orbitron']">
                    {poll.question}
                  </h2>
                  {poll.description && (
                    <p className="text-xs text-slate-300">{poll.description}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-300 block">
                    {poll.totalVotes.toLocaleString()} votos
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">● Activa</span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {poll.options.map((option, idx) => {
                  const percentage =
                    poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                  const isSelected = userVoteIdx === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleVote(poll.id, idx)}
                      className={`relative w-full p-4 rounded-2xl border text-left overflow-hidden transition-all duration-200 group ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Animated Progress Bar fill */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 transition-all duration-500 rounded-2xl ${
                          isSelected ? 'bg-cyan-500/20' : 'bg-slate-800/40'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 font-bold text-slate-200 group-hover:text-white">
                          <span
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected
                                ? 'bg-cyan-400 border-cyan-400 text-slate-950 font-black'
                                : 'border-slate-600 text-transparent'
                            }`}
                          >
                            ✓
                          </span>
                          <span>{option.text}</span>
                        </div>

                        <div className="flex items-center gap-2 font-mono shrink-0">
                          <span className="text-xs text-slate-400">({option.votes})</span>
                          <span className={`font-black ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Poll Modal (Admin) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-lg font-black text-white font-['Orbitron']">Crear Nueva Encuesta</h3>
            <form onSubmit={handleCreatePoll} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Pregunta *</label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ej: ¿Qué nuevo modo de juego prefieres?"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Descripción</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Contexto adicional..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-300">Opciones de Respuesta</label>
                {newOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newOptions];
                      updated[idx] = e.target.value;
                      setNewOptions(updated);
                    }}
                    placeholder={`Opción ${idx + 1}`}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold font-['Orbitron']"
                >
                  Crear Encuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
