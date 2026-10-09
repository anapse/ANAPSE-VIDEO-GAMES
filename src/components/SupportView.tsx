import React, { useState } from 'react';
import { Heart, DollarSign, Facebook, ExternalLink, QrCode, Copy, Smartphone, MessageCircle } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';

export const SupportView: React.FC = () => {
  const { supportSettings } = useGameData();
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyYape = () => {
    if (supportSettings?.yape?.phone) {
      navigator.clipboard.writeText(supportSettings.yape.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
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

      {/* Aviso transparente: no se registran donaciones desde esta página */}
      <div className="rounded-3xl p-5 sm:p-6 bg-white/65 dark:bg-slate-900/55 backdrop-blur-md border border-amber-200/70 dark:border-amber-900/40 shadow-lg space-y-2">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white font-['Orbitron'] flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>¿Cómo colaborar?</span>
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Elige uno de los métodos de pago disponibles y completa la operación en la aplicación correspondiente. Copiar un número o abrir un enlace no significa que se haya realizado una donación.
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Esta página no registra aportes ni muestra confirmaciones de pago automáticamente.
        </p>
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
