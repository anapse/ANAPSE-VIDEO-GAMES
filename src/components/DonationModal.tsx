import React, { useState } from 'react';
import { X, Heart, Sparkles, Check, CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { Game } from '../types';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface DonationModalProps {
  game: Game | null;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ game, onClose }) => {
  const { addDonation } = useGameData();
  const { profile } = useAuth();

  const [presetAmount, setPresetAmount] = useState<number | 'custom'>(5);
  const [customAmount, setCustomAmount] = useState('15');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'Yape' | 'Plin' | 'Tarjeta' | 'PayPal'>('Yape');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!game) return null;

  const actualAmount = presetAmount === 'custom' ? parseFloat(customAmount) || 5 : presetAmount;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    await new Promise((r) => setTimeout(r, 600)); // Simulate gateway

    await addDonation({
      gameId: game.gameId,
      gameName: game.name,
      amount: actualAmount,
      message: message.trim() || undefined,
      isPublic,
      paymentMethod,
    });

    setIsProcessing(false);
    setSuccess(true);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400">
              <Heart className="w-5 h-5 fill-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-['Orbitron']">
                APOYAR A {game.name}
              </h3>
              <p className="text-xs text-slate-400">Impulsa el desarrollo de este juego</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-3xl">
              ❤️
            </div>
            <h4 className="text-xl font-black text-white font-['Orbitron']">¡MUCHAS GRACIAS!</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Tu apoyo de <b>S/ {actualAmount}</b> ayuda directamente a los creadores de <b>{game.name}</b>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDonate} className="space-y-4 text-xs">
            
            {/* Amount Selection */}
            <div>
              <label className="block font-bold text-slate-300 mb-2">Selecciona el monto de apoyo:</label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 10].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPresetAmount(amt)}
                    className={`py-3 rounded-2xl font-black font-['Orbitron'] text-sm transition-all ${
                      presetAmount === amt
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-102'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-rose-500/40'
                    }`}
                  >
                    S/ {amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPresetAmount('custom')}
                  className={`py-3 rounded-2xl font-black font-['Orbitron'] text-xs transition-all ${
                    presetAmount === 'custom'
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-102'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-rose-500/40'
                  }`}
                >
                  OTRO
                </button>
              </div>

              {presetAmount === 'custom' && (
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">S/</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Monto personalizado"
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-rose-400"
                  />
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Método de Pago:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Yape', 'Plin', 'Tarjeta', 'PayPal'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === m
                        ? 'bg-indigo-950 border-indigo-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div>
              <label className="block font-bold text-slate-300 mb-1">Escribe un mensaje de aliento:</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="¡Gran juego! Sigan con más niveles..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 resize-none"
              />
            </div>

            {/* Public toggle checkbox */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <input
                type="checkbox"
                id="public-toggle"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="public-toggle" className="text-xs text-slate-300 font-medium cursor-pointer">
                ☑ Publicar mi mensaje en la ficha de {game.name}
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isProcessing || actualAmount <= 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-black text-sm font-['Orbitron'] tracking-wider shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isProcessing ? 'PROCESANDO...' : `APOYAR CON S/ ${actualAmount}`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
