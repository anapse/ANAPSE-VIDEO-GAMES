import React, { useState } from 'react';
import { X, Flag, AlertTriangle, Send } from 'lucide-react';
import { Comment, Report } from '../types';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';

interface ReportCommentModalProps {
  comment: Comment;
  onClose: () => void;
}

export const ReportCommentModal: React.FC<ReportCommentModalProps> = ({ comment, onClose }) => {
  const { reportComment } = useGameData();
  const { profile, currentUser } = useAuth();

  const [reason, setReason] = useState<Report['reason']>('Spam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const reasonsList: { value: Report['reason']; label: string; desc: string }[] = [
    { value: 'Spam', label: 'Spam o Publicidad', desc: 'Enlaces sospechosos, promociones repetitivas o mensajes no deseados' },
    { value: 'Insultos', label: 'Insultos o Faltas de Respeto', desc: 'Lenguaje ofensivo o ataques directos a otros usuarios' },
    { value: 'Acoso', label: 'Acoso o Intimidación', desc: 'Comportamiento tóxico reiterado o amenazas' },
    { value: 'Contenido inapropiado', label: 'Contenido Inapropiado', desc: 'Material explícito, ilegal o fuera de lugar' },
    { value: 'Otro', label: 'Otro Motivo', desc: 'Cualquier otra infracción a las normas de la comunidad' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await reportComment({
        commentId: comment.id,
        commentContent: comment.content,
        commentAuthorName: comment.userName,
        commentAuthorId: comment.userId,
        targetType: comment.targetType,
        targetId: comment.targetId,
        reportedBy: currentUser?.uid || profile?.uid || 'anonymous',
        reporterName: profile?.displayName || 'Usuario de la Comunidad',
        reason,
        details: details.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error reporting comment:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white font-['Orbitron']">REPORTAR COMENTARIO</h3>
              <p className="text-[11px] text-slate-400">Ayúdanos a mantener una comunidad segura</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              ✓
            </div>
            <h4 className="text-sm font-bold text-white font-['Orbitron']">Reporte Enviado</h4>
            <p className="text-xs text-slate-400">
              Gracias por tu reporte. Nuestro equipo de moderadores lo revisará a la brevedad.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Comment snippet */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Comentario de {comment.userName}:</p>
              <p className="text-xs text-slate-300 italic line-clamp-2">"{comment.content}"</p>
            </div>

            {/* Reasons radio options */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Motivo del reporte:
              </label>
              <div className="space-y-1.5">
                {reasonsList.map((item) => (
                  <label
                    key={item.value}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      reason === item.value
                        ? 'bg-amber-500/10 border-amber-500/40 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={item.value}
                      checked={reason === item.value}
                      onChange={() => setReason(item.value)}
                      className="mt-0.5 text-amber-500 focus:ring-amber-500"
                    />
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-200">{item.label}</p>
                      <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional details textarea */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Detalles adicionales (opcional):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Añade más contexto para los moderadores..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold font-['Orbitron'] flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Enviando...' : 'Enviar Reporte'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
