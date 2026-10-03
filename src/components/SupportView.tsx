import React, { useState } from 'react';
import { Heart, Sparkles, Trophy, Check, CreditCard, Smartphone } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export const SupportView: React.FC = () => {
  const { donations, addDonation, games } = useGameData();
  const { profile } = useAuth();

  const [selectedGameId, setSelectedGameId] = useState<string>('anapse-general');
  const [presetAmount, setPresetAmount] = useState<number | 'custom'>(5);
  const [customAmount, setCustomAmount] = useState('15');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'Yape' | 'Plin' | 'Tarjeta' | 'PayPal'>('Yape');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const actualAmount = presetAmount === 'custom' ? parseFloat(customAmount) || 5 : presetAmount;
  const targetGame = games.find((g) => g.gameId === selectedGameId);
  const targetName = targetGame ? targetGame.name : 'ANAPSE VIDEO GAMES (General)';

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    await new Promise((r) => setTimeout(r, 600));

    await addDonation({
      gameId: selectedGameId,
      gameName: targetName,
      amount: actualAmount,
      message: message.trim() || undefined,
      isPublic,
      paymentMethod,
    });

    setIsProcessing(false);
    setSuccess(true);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      setSuccess(false);
      setMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold font-['Orbitron']">
          <Heart className="w-3.5 h-3.5 fill-rose-400" />
          <span>COMUNIDAD & APOYO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Orbitron']">
          APOYA A ANAPSE VIDEO GAMES
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Tu donación apoya directamente a los desarrolladores de nuestros juegos gratuitos y nos ayuda a crear nuevas experiencias cada mes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 6 cols: Donation Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-3xl">
                ❤️
              </div>
              <h3 className="text-2xl font-black text-white font-['Orbitron']">¡MUCHAS GRACIAS POR TU APOYO!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Tu aporte de <b>S/ {actualAmount}</b> para <b>{targetName}</b> ha sido registrado con éxito.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDonate} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">¿A qué juego deseas apoyar?</label>
                <select
                  value={selectedGameId}
                  onChange={(e) => setSelectedGameId(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-rose-400"
                >
                  <option value="anapse-general">🌟 ANAPSE VIDEO GAMES (Apoyo General al Estudio)</option>
                  {games.map((g) => (
                    <option key={g.gameId} value={g.gameId}>
                      🎮 {g.name} ({g.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-2">Selecciona el monto:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 10].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPresetAmount(amt)}
                      className={`py-3 rounded-2xl font-black font-['Orbitron'] text-sm transition-all ${
                        presetAmount === amt
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
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
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
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
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-rose-400"
                    />
                  </div>
                )}
              </div>

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
                          : 'bg-slate-950 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Escribe un mensaje (Opcional):</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="¡Sigan adelante con más juegos!"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500"
                />
                <label htmlFor="pub-check" className="text-xs text-slate-300 cursor-pointer">
                  ☑ Publicar mi mensaje en el muro de donaciones
                </label>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 text-white font-black text-sm font-['Orbitron'] shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>{isProcessing ? 'PROCESANDO...' : `APOYAR CON S/ ${actualAmount}`}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right 5 cols: Public Wall of Supporters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-black text-rose-300 font-['Orbitron'] flex items-center gap-2">
              <Heart className="w-5 h-5 fill-rose-400" />
              <span>MURO DE APODERADOS & SUPPORTERS</span>
            </h3>

            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {donations.filter((d) => d.isPublic).length > 0 ? (
                donations
                  .filter((d) => d.isPublic)
                  .map((d) => (
                    <div key={d.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{d.userName}</span>
                        <span className="font-mono font-black text-rose-400">
                          {d.currency} {d.amount}
                        </span>
                      </div>
                      <p className="text-[11px] text-cyan-400 font-bold">Apoyó a: {d.gameName}</p>
                      {d.message && <p className="text-xs text-slate-300 italic">"{d.message}"</p>}
                    </div>
                  ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-8">
                  ¡Sé el primer donante en aparecer en el muro!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
