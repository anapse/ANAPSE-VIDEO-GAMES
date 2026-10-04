import React, { useState } from 'react';
import {
  Heart,
  MoreVertical,
  EyeOff,
  Eye,
  Trash2,
  Flag,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { Comment } from '../types';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';
import { UserBadge } from './UserBadge';
import { ReportCommentModal } from './ReportCommentModal';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const { toggleLikeComment, hideComment, deleteComment } = useGameData();
  const { profile, currentUser, isModerator, isAdmin } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmHideOpen, setConfirmHideOpen] = useState(false);

  const isAuthor = (currentUser && currentUser.uid === comment.userId) || (profile && profile.uid === comment.userId);
  const canModerate = isModerator || isAdmin;

  const handleHide = async () => {
    try {
      await hideComment(comment.id, !comment.hidden, 'Acción manual de moderador');
      setMenuOpen(false);
      setConfirmHideOpen(false);
    } catch (err) {
      console.error('Error toggling hide on comment:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id, 'Eliminado por moderación');
      setMenuOpen(false);
      setConfirmDeleteOpen(false);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  // If hidden and user is NOT a moderator/admin:
  if (comment.hidden && !canModerate) {
    return (
      <div className="p-3.5 rounded-2xl bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500/80 shrink-0" />
          <span className="italic">⚠️ Este comentario fue ocultado por moderación.</span>
        </div>
        <span className="text-[10px] text-slate-400">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`relative p-4 rounded-2xl border transition-all space-y-2.5 ${
          comment.hidden
            ? 'bg-amber-950/20 border-amber-500/30 text-slate-300'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs'
        }`}
      >
        {/* Hidden notice for Moderator/Admin */}
        {comment.hidden && canModerate && (
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/20 text-[11px] text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Oculto por moderación {comment.moderatedBy ? `(${comment.moderatedBy})` : ''}</span>
            </span>
            <button
              onClick={handleHide}
              className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold"
            >
              Restaurar comentario
            </button>
          </div>
        )}

        {/* Header: User Badge, Date & Menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={comment.userPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.userId}`}
              alt={comment.userName}
              className="w-7 h-7 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <UserBadge
                name={comment.userName}
                role={comment.userRole}
                size="sm"
                className="text-slate-900 dark:text-white font-bold"
              />
              <p className="text-[10px] text-slate-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Options Dropdown Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Opciones del comentario"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-7 z-30 w-48 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl py-1.5 text-xs text-slate-200 animate-in fade-in zoom-in-95 space-y-0.5">
                  {/* Moderator & Admin options */}
                  {canModerate && (
                    <>
                      <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider flex items-center gap-1 border-b border-slate-800 pb-1 mb-1">
                        <Shield className="w-3 h-3" />
                        <span>Moderación</span>
                      </div>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setConfirmHideOpen(true);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors"
                      >
                        {comment.hidden ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{comment.hidden ? 'Restaurar comentario' : 'Ocultar comentario'}</span>
                      </button>
                    </>
                  )}

                  {/* Delete Option (For Author or Moderator/Admin) */}
                  {(isAuthor || canModerate) && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setConfirmDeleteOpen(true);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-500/15 flex items-center gap-2 text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar comentario</span>
                    </button>
                  )}

                  {/* Report Option (For everyone on someone else's comment) */}
                  {!isAuthor && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setReportModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reportar comentario</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-pre-line">
          {comment.content}
        </p>

        {/* Footer: Like counter */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-400">
          <button
            onClick={() => toggleLikeComment(comment.id)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors group"
          >
            <Heart className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold">{comment.likesCount || 0}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-white font-['Orbitron']">¿Eliminar comentario?</h4>
              <p className="text-xs text-slate-400">
                Esta acción es definitiva y eliminará el comentario de la plataforma.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-['Orbitron'] shadow-md shadow-rose-600/30"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Hide / Unhide */}
      {confirmHideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              {comment.hidden ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-white font-['Orbitron']">
                {comment.hidden ? '¿Restaurar comentario?' : '¿Ocultar comentario?'}
              </h4>
              <p className="text-xs text-slate-400">
                {comment.hidden
                  ? 'El comentario volverá a ser visible para todos los usuarios de la comunidad.'
                  : 'Los usuarios normales verán un aviso de comentario oculto por moderación.'}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setConfirmHideOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleHide}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black font-['Orbitron'] shadow-md shadow-amber-500/30"
              >
                {comment.hidden ? 'Restaurar' : 'Ocultar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <ReportCommentModal
          comment={comment}
          onClose={() => setReportModalOpen(false)}
        />
      )}
    </>
  );
};
