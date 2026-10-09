import React, { useState } from 'react';
import { X, Heart, Copy, Check, Smartphone, DollarSign, QrCode, ExternalLink } from 'lucide-react';
import { Game } from '../types';
import { useGameData } from '../context/GameDataContext';

interface DonationModalProps {
  game: Game | null;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ game, onClose }) => {
  const { supportSettings } = useGameData();
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!game) return null;

  const yapePhone = supportSettings?.yape?.phone || '+51 912391502';
  const paypalEmail = supportSettings?.paypal?.email || 'anapse_j@yahoo.es';
  const handleCopyYape = async () => {
    try {
      await navigator.clipboard.writeText(yapePhone);
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2200);
    } catch {
      setCopiedPhone(false);
    }
  };

  const paypalUrl = supportSettings?.paypal?.url ||
    `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${encodeURIComponent(paypalEmail)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-modal-title"
        className="relative w-full max-w-md rounded-3xl bg-white/95 dark:bg-[#302b23]/95 border border-amber-200/70 dark:border-amber-100/15 shadow-2xl p-5 sm:p-6 space-y-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 id="donation-modal-title" className="text-base font-black text-slate-900 dark:text-white font-['Orbitron']">
                APOYAR ANAPSE
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Ayuda a seguir desarrollando {game.name}.
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Selecciona un método y completa el pago en la aplicación correspondiente. Abrir este panel o copiar los datos no registra una donación.
        </p>

        {(supportSettings?.yape?.enabled ?? true) && (
          <div className="rounded-2xl p-4 bg-purple-500/5 border border-purple-300/50 dark:border-purple-400/20 space-y-3">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
              <Smartphone className="w-4 h-4" /> YAPE
            </div>
            <p className="text-base font-black font-mono tracking-wide text-slate-900 dark:text-white">{yapePhone}</p>
            {supportSettings?.yape?.holderName && <p className="text-[10px] text-slate-500 dark:text-slate-400">{supportSettings.yape.holderName}</p>}
            <button onClick={handleCopyYape} className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2">
              {copiedPhone ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedPhone ? 'Número copiado' : 'Copiar número de Yape'}
            </button>
          </div>
        )}

        {(supportSettings?.paypal?.enabled ?? true) && (
          <div className="rounded-2xl p-4 bg-sky-500/5 border border-sky-300/50 dark:border-sky-400/20 space-y-3">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-bold text-xs">
              <DollarSign className="w-4 h-4" /> PAYPAL
            </div>
            <p className="text-xs font-bold font-mono break-all text-slate-900 dark:text-white">{paypalEmail}</p>
            <a href={paypalUrl} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> Abrir PayPal
            </a>
          </div>
        )}

        {supportSettings?.qr?.enabled && supportSettings.qr.imageUrl && (
          <div className="rounded-2xl p-4 bg-amber-500/5 border border-amber-300/50 dark:border-amber-400/20 space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
              <QrCode className="w-4 h-4" /> QR DE PAGO
            </div>
            <img src={supportSettings.qr.imageUrl} alt="QR de pago de ANAPSE" className="w-36 h-36 object-contain mx-auto rounded-xl bg-white p-2" />
            <p className="text-[10px] text-slate-600 dark:text-slate-300">Escanea el código desde tu aplicación de pago.</p>
          </div>
        )}

        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
          No se mostrará ninguna confirmación ni se contabilizará un aporte sin verificación del pago.
        </p>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/15">
          Cerrar
        </button>
      </div>
    </div>
  );
};
