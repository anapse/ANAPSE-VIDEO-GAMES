import React, { useState } from 'react';
import { MessageSquare, Heart, Send, Sparkles, User, Shield, Share2 } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';
import { Comment } from '../types';

export const CommunityFeed: React.FC = () => {
  const { comments, addComment, toggleLikeComment, deleteComment } = useGameData();
  const { profile, currentUser, isAdmin, isModerator } = useAuth();
  const [postText, setPostText] = useState('');

  const feedComments = comments.filter((c) => c.targetType === 'community' || !c.targetType);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;
    addComment('community', 'general-board', postText.trim(), null);
    setPostText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Feed Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Orbitron']">
            MURO DE LA COMUNIDAD
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Comparte récords, tips de videojuegos, charla con otros jugadores y el equipo de desarrollo de ANAPSE.
        </p>
      </div>

      {/* New Post Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={profile?.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=userCommunity'}
            alt={profile?.displayName || 'Gamer'}
            className="w-10 h-10 rounded-2xl bg-slate-800 border border-cyan-500/30"
          />
          <div>
            <p className="text-xs font-bold text-white">{profile?.displayName || 'Gamer ANAPSE'}</p>
            <span className="text-[10px] text-cyan-400 font-bold uppercase">{profile?.role || 'USUARIO'}</span>
          </div>
        </div>

        <form onSubmit={handlePost} className="space-y-3">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="¿Qué juego estás jugando hoy? Comparte tus ideas, récords o saludos..."
            rows={3}
            className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Respeta las normas de la comunidad gamer</span>
            <button
              type="submit"
              disabled={!postText.trim()}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black text-xs font-['Orbitron'] flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>PUBLICAR</span>
            </button>
          </div>
        </form>
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {feedComments.length > 0 ? (
          feedComments.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.userPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.userId}`}
                    alt={item.userName}
                    className="w-9 h-9 rounded-xl bg-slate-800"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{item.userName}</p>
                    <p className="text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {(isAdmin || isModerator || item.userId === currentUser?.uid) && (
                  <button
                    onClick={() => deleteComment(item.id)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded bg-rose-500/10"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-1">{item.content}</p>

              <div className="flex items-center gap-4 pt-1 border-t border-slate-800/60 text-xs text-slate-400">
                <button
                  onClick={() => toggleLikeComment(item.id)}
                  className="flex items-center gap-1.5 hover:text-rose-400 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{item.likesCount || 0} Likes</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
            No hay publicaciones en el muro aún. ¡Sé el primero en saludar a la comunidad!
          </div>
        )}
      </div>
    </div>
  );
};
