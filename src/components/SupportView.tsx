import React, { useState } from 'react';
import { Heart, Sparkles, Trophy, Check } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import confetti from 'canvas-confetti';

export const SupportView: React.FC = () => {
  const { donations, addDonation, games } = useGameData();

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold font-['Orbitron']">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>Apoya ANAPSE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Orbitron']">
          Apoya ANAPSE VIDEO GAMES
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Somos desarrolladores independientes. Tus donaciones nos ayudan a mantener los servidores y publicar más videojuegos gratuitos sin publicidad molesta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Donation Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Orbitron']">
            Realizar un Aporte
          </h2>

          <form onSubmit={handleDonate} className="space-y-4">
            {/* Destino */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Destino del Apoyo:
              </label>
              <select
                value={selectedGameId}
                onChange={(e) => setSelectedGameId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="anapse-general">🌟 ANAPSE (Fondo General de Videojuegos)</option>
                {games.map((g) => (
                  <option key={g.gameId} value={g.gameId}>
                    🎮 {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Presets */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Monto ($ USD):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 5, 10, 20].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setPresetAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      presetAmount === amt
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Método de pago */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Método de Pago:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Yape', 'Plin', 'Tarjeta', 'PayPal'] as const).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      paymentMethod === method
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Mensaje opcional */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Mensaje de aliento (Opcional):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="¡Sigan así equipo ANAPSE!"
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-['Orbitron'] tracking-wide shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {success ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡MUCHAS GRACIAS POR TU APOYO!</span>
                </>
              ) : isProcessing ? (
                <span>Procesando...</span>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white" />
                  <span>DONAR ${actualAmount} USD</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Donors */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Muro de Aportantes</span>
          </h2>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {donations.filter((d) => d.isPublic).map((d) => (
              <div key={d.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{d.userName}</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">+${d.amount} USD</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">para {d.gameName}</p>
                {d.message && <p className="text-xs text-slate-600 dark:text-slate-300">"{d.message}"</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
