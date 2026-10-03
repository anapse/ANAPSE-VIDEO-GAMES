import React, { useState } from 'react';
import { MessageSquare, Heart, Send } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';

export const CommunityFeed: React.FC = () => {
  const { comments, addComment, toggleLikeComment } = useGameData();
  const { profile } = useAuth();
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
      
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-['Orbitron']">
            Muro de la Comunidad
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Comparte tips, récords y habla con otros jugadores y los creadores de ANAPSE.
        </p>
      </div>

      {/* New Post Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={profile?.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=userCommunity'}
            alt={profile?.displayName || 'Gamer'}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-cyan-500/30"
          />
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{profile?.displayName || 'Jugador ANAPSE'}</p>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase">{profile?.role || 'USUARIO'}</span>
          </div>
        </div>

        <form onSubmit={handlePost} className="space-y-3">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="¿Qué estás jugando hoy? Comparte tus comentarios..."
            rows={2}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
          />

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={!postText.trim()}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar</span>
            </button>
          </div>
        </form>
      </div>

      {/* Posts Stream */}
      <div className="space-y-3">
        {feedComments.length > 0 ? (
          feedComments.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={item.userPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.userId}`}
                    alt={item.userName}
                    className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800"
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.userName}</span>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{item.content}</p>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
                <button
                  onClick={() => toggleLikeComment(item.id)}
                  className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{item.likesCount || 0}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-400">
            Sé el primero en dejar un mensaje en la comunidad.
          </div>
        )}
      </div>
    </div>
  );
};
