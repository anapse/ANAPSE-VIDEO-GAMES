import React, { useState } from 'react';
import { Heart, Check, DollarSign, Facebook, ExternalLink, QrCode, Copy, Smartphone, MessageCircle } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';
import confetti from 'canvas-confetti';

export const SupportView: React.FC = () => {
  const { addDonation, supportSettings } = useGameData();

  const [presetAmount, setPresetAmount] = useState<number | 'custom'>(5);
  const [customAmount, setCustomAmount] = useState('15');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const actualAmount = presetAmount === 'custom' ? parseFloat(customAmount) || 5 : presetAmount;

  const handleCopyYape = () => {
    if (supportSettings?.yape?.phone) {
      navigator.clipboard.writeText(supportSettings.yape.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  const handleRegisterDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    await new Promise((r) => setTimeout(r, 500));

    await addDonation({
      gameId: 'anapse-general',
      gameName: 'ANAPSE VIDEO GAMES',
      amount: actualAmount,
      message: message.trim() || undefined,
      isPublic: true,
      paymentMethod: 'Yape / PayPal',
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
      
      {/* 1. HEADER LIMPIO Y DIRECTO */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-extrabold font-['Orbitron']">
          <Heart className="w-4 h-4 fill-current" />
          <span>❤️ APOYA A ANAPSE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Orbitron']">
          {supportSettings.title || 'Ayúdanos a seguir creando juegos'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
          {supportSettings.subtitle || 'Tus aportes nos permiten desarrollar más videojuegos gratuitos e independientes.'}
        </p>
      </div>

      {/* 2. FORMAS PRINCIPALES DE APOYO (CONFIGURABLES DESDE DASHBOARD) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* A) YAPE (NO WHATSAPP, SOLO YAPE) */}
        {supportSettings.yape?.enabled && (
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-purple-200/80 dark:border-purple-900/50 shadow-lg flex flex-col items-center justify-between text-center space-y-4 hover:-translate-y-1 transition-all">
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-['Orbitron'] uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>YAPE</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pago móvil rápido</p>
            </div>

            <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/30 w-full text-center space-y-1">
              <p className="text-lg font-black text-purple-700 dark:text-purple-300 font-mono tracking-wider">
                {supportSettings.yape.phone || '+51 912391502'}
              </p>
              {supportSettings.yape.holderName && (
                <p className="text-[10px] text-purple-600/80 dark:text-purple-300/80 uppercase font-bold">
                  {supportSettings.yape.holderName}
                </p>
              )}
            </div>

            <button
              onClick={handleCopyYape}
              className="w-full py-2.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              {copiedPhone ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPhone ? '¡Número copiado!' : 'Pagar por Yape'}</span>
            </button>
          </div>
        )}

        {/* B) PAYPAL */}
        {supportSettings.paypal?.enabled && (
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-sky-200/80 dark:border-sky-900/50 shadow-lg flex flex-col items-center justify-between text-center space-y-4 hover:-translate-y-1 transition-all">
            <div className="space-y-1">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 font-['Orbitron'] uppercase tracking-wider flex items-center justify-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                <span>PAYPAL</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Aportes internacionales</p>
            </div>

            <div className="p-4 bg-sky-500/10 rounded-2xl border border-sky-500/30 w-full text-center space-y-1">
              <p className="text-xs font-bold text-sky-700 dark:text-sky-300 font-mono truncate">
                {supportSettings.paypal.email || 'anapse_j@yahoo.es'}
              </p>
              <p className="text-[10px] text-sky-600/80 dark:text-sky-300/80">Donación segura vía PayPal</p>
            </div>

            <a
              href={
                supportSettings.paypal.url ||
                `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${encodeURIComponent(
                  supportSettings.paypal.email
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Apoyar con PayPal</span>
            </a>
          </div>
        )}

        {/* C) QR DE PAGO (SOLO SI ESTÁ ACTIVADO DESDE DASHBOARD) */}
        {supportSettings.qr?.enabled && supportSettings.qr.imageUrl && (
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-amber-200/80 dark:border-amber-900/50 shadow-lg flex flex-col items-center justify-between text-center space-y-4 hover:-translate-y-1 transition-all">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-['Orbitron'] uppercase tracking-wider flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4" />
                <span>QR DE PAGO</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Escanea para apoyar</p>
            </div>

            <div className="p-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center max-w-[160px]">
              <img
                src={supportSettings.qr.imageUrl}
                alt="QR de Pago Oficial ANAPSE"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>

            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Escanea con tu app móvil
            </p>
          </div>
        )}

        {/* D) WHATSAPP (SOLO SI ESTÁ ACTIVADO DESDE DASHBOARD INDEPENDIENTEMENTE DE YAPE) */}
        {supportSettings.whatsapp?.enabled && supportSettings.whatsapp.phone && (
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-900/50 shadow-lg flex flex-col items-center justify-between text-center space-y-4 hover:-translate-y-1 transition-all">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-['Orbitron'] uppercase tracking-wider flex items-center justify-center gap-1.5">
                <MessageCircle className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                <span>WHATSAPP</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Contacto directo</p>
            </div>

            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 w-full text-center space-y-1">
              <p className="text-base font-black text-emerald-700 dark:text-emerald-400 font-mono tracking-wider">
                {supportSettings.whatsapp.phone}
              </p>
              <p className="text-[10px] text-emerald-600/80 dark:text-emerald-300/80">Atención oficial</p>
            </div>

            <a
              href={`https://wa.me/${supportSettings.whatsapp.phone.replace(/[^0-9]/g, '')}?text=Hola%20ANAPSE%2C%20quiero%20apoyar%20sus%20videojuegos%20%F0%9F%8E%AE`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Escribir por WhatsApp</span>
            </a>
          </div>
        )}

      </div>

      {/* 3. SELECCIÓN DE MONTO RÁPIDO & MENSAJE */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-lg space-y-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Registrar Monto de Apoyo</span>
        </h2>

        <form onSubmit={handleRegisterDonation} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Selecciona o ingresa la cantidad ($ USD):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {(supportSettings.customAmounts || [2, 5, 10, 20]).map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setPresetAmount(amt)}
                  className={`py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                    presetAmount === amt
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  ${amt}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPresetAmount('custom')}
                className={`py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  presetAmount === 'custom'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Otro
              </button>
            </div>

            {presetAmount === 'custom' && (
              <div className="pt-2">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Monto personalizado USD"
                  className="w-full p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Mensaje para los creadores (Opcional):
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="¡Sigan adelante equipo ANAPSE!"
              className="w-full p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs tracking-wider shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {success ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡MUCHAS GRACIAS POR TU APOYO!</span>
              </>
            ) : isProcessing ? (
              <span>Registrando...</span>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white" />
                <span>REGISTRAR MI APOYO (${actualAmount} USD)</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 4. REDES SOCIALES & FACEBOOK */}
      <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Facebook className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-800 dark:text-slate-200">Sigue a ANAPSE en Facebook</span>
        </div>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
        >
          <span>Facebook</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
};
