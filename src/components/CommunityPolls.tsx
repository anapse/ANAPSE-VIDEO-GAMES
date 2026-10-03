import React, { useState } from 'react';
import { Vote, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const CommunityPolls: React.FC = () => {
  const { polls, votePoll, userPollVotes, createPoll } = useGameData();
  const { isModerator } = useAuth();

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-['Orbitron']">
              Encuestas de la Comunidad
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Vota por las decisiones de desarrollo: personajes, modos de juego y próximos lanzamientos.
          </p>
        </div>

        {isModerator && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Encuesta</span>
          </button>
        )}
      </div>

      {/* Polls List */}
      <div className="space-y-6">
        {polls.map((poll) => {
          const userVoteIdx = userPollVotes[poll.id];

          return (
            <div
              key={poll.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold border border-cyan-200 dark:border-cyan-800">
                    <Sparkles className="w-3 h-3" />
                    <span>ENCUESTA OFICIAL ANAPSE</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-['Orbitron']">
                    {poll.question}
                  </h2>
                  {poll.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300">{poll.description}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                    {poll.totalVotes.toLocaleString()} votos
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">● Activa</span>
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
                      className={`relative w-full p-3.5 rounded-xl border text-left overflow-hidden transition-all duration-200 group ${
                        isSelected
                          ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 text-slate-900 dark:text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {/* Animated Progress Bar fill */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 transition-all duration-500 rounded-xl ${
                          isSelected ? 'bg-cyan-200/50 dark:bg-cyan-500/20' : 'bg-slate-200/40 dark:bg-slate-700/40'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />}
                          <span className="font-semibold">{option.text}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono shrink-0">
                          <span className="text-[11px] opacity-75">{option.votes} votos</span>
                          <span className="font-bold text-cyan-700 dark:text-cyan-300 min-w-[32px] text-right">{percentage}%</span>
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

      {/* Modal Crear Encuesta */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-['Orbitron']">
              Crear Nueva Encuesta
            </h3>
            <form onSubmit={handleCreatePoll} className="space-y-3">
              <input
                type="text"
                placeholder="Pregunta principal..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
              <textarea
                placeholder="Descripción o contexto (opcional)..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 resize-none"
              />

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Opciones de Respuesta:</p>
                {newOptions.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Opción ${i + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newOptions];
                      updated[i] = e.target.value;
                      setNewOptions(updated);
                    }}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  />
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold"
                >
                  Publicar Encuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
