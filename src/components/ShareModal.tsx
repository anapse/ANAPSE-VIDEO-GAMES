import React, { useState } from 'react';
import { X, Share2, Mail, Copy, Check, MessageCircle } from 'lucide-react';
import { Game } from '../types';

interface ShareModalProps {
  game: Game | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ game, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!game) return null;

  const currentUrl = `${window.location.origin}/#game-${game.gameId}`;
  const shareText = `¡Ven a jugar ${game.name} en ANAPSE VIDEO GAMES! 🎮\n${game.tagline || game.description}\nJuega gratis aquí: ${currentUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${game.name} — ANAPSE VIDEO GAMES`,
          text: game.tagline || game.description,
          url: currentUrl,
        });
      } catch (e) {
        // user cancelled
      }
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(
    `Juega ${game.name} en ANAPSE VIDEO GAMES`
  )}&body=${encodeURIComponent(
    `Hola!\n\nTe comparto este juego: ${game.name}\n\n${game.description}\n\nEnlace directo: ${currentUrl}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-['Orbitron']">
                COMPARTIR {game.name}
              </h3>
              <p className="text-xs text-slate-400">Invita a tus amigos a jugar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3 text-xs font-bold">
          
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex flex-col items-center justify-center gap-2 transition-all group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🟢</span>
            <span>WhatsApp</span>
          </a>

          {/* Email */}
          <a
            href={emailUrl}
            className="p-4 rounded-2xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 flex flex-col items-center justify-center gap-2 transition-all group"
          >
            <Mail className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Correo</span>
          </a>
        </div>

        {/* Native Web Share API if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Compartir con aplicaciones del celular</span>
          </button>
        )}

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400">Enlace directo:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
