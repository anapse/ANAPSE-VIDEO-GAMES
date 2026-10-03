import React, { useState } from 'react';
import { X, Sparkles, Lightbulb, Image as ImageIcon, Send } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface NewProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProposalModal: React.FC<NewProposalModalProps> = ({ isOpen, onClose }) => {
  const { categories, addProposal } = useGameData();
  const { profile, currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [idea, setIdea] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    await addProposal({
      title: title.trim(),
      description: description.trim(),
      category,
      idea: idea.trim(),
      imageUrl: imageUrl.trim() || undefined,
    });
    setIsSubmitting(false);

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-['Orbitron']">
                PROPÓN UN NUEVO JUEGO
              </h2>
              <p className="text-xs text-slate-400">Tu idea para la plataforma de ANAPSE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-300 mb-1">Nombre o Título del Juego *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: CAT THIEF: Misión Pescado Dorado"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400 font-bold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">URL de Imagen / Mockup (Opcional)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Descripción de la Historia o Concepto *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿De qué trata el juego? ¿Quién es el protagonista y qué objetivo tiene?"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Mecánica o Idea Clave de Jugabilidad</label>
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Ej: Sigilo nocturno con maullidos distractores y saltos de tejados"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-xs font-['Orbitron'] flex items-center gap-2 shadow-md shadow-orange-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'PUBLICANDO...' : 'PUBLICAR PROPUESTA'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
