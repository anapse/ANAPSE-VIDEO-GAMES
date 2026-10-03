import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, X, Volume2, Gamepad2, Settings } from 'lucide-react';
import { useGameData } from '../context/GameDataContext';

export const MascotPet: React.FC = () => {
  const { mascotConfig, updateMascotConfig } = useGameData();
  const [speechIndex, setSpeechIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'walk' | 'jump' | 'wave'>('idle');
  const [frameIndex, setFrameIndex] = useState(0);

  // Position CSS mapping
  const positionClasses = {
    'bottom-right': 'bottom-20 sm:bottom-6 right-4 sm:right-6',
    'bottom-left': 'bottom-20 sm:bottom-6 left-4 sm:left-6',
    'top-right': 'top-20 right-4 sm:right-6',
    'floating-right': 'top-1/2 -translate-y-1/2 right-4 sm:right-6',
  }[mascotConfig.position || 'bottom-right'];

  // Size mapping
  const sizeConfig = {
    small: { w: 'w-11 h-11 sm:w-12 sm:h-12', cloud: 'w-12 h-2.5', icon: 'text-xl' },
    medium: { w: 'w-14 h-14 sm:w-16 sm:h-16', cloud: 'w-16 h-3.5', icon: 'text-2xl sm:text-3xl' },
    large: { w: 'w-18 h-18 sm:w-20 sm:h-20', cloud: 'w-20 h-4.5', icon: 'text-3xl sm:text-4xl' },
  }[mascotConfig.size || 'medium'];

  // Frame animation loop (for spritesheets / animated frames)
  useEffect(() => {
    if (!mascotConfig.enabled) return;
    const frameInterval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 4);
    }, mascotConfig.frameSpeedMs || 250);
    return () => clearInterval(frameInterval);
  }, [mascotConfig.enabled, mascotConfig.frameSpeedMs]);

  // Periodic appearance / disappearance scheduler
  useEffect(() => {
    if (!mascotConfig.enabled) {
      setIsVisible(false);
      return;
    }

    const triggerCycle = () => {
      setIsVisible(true);
      setIsTalking(true);
      setAnimationState('wave');
      setSpeechIndex((prev) => (prev + 1) % (mascotConfig.messages.length || 1));

      // After 1 second, switch to jump/idle
      setTimeout(() => setAnimationState('jump'), 1000);
      setTimeout(() => setAnimationState('idle'), 2000);

      // Hide talk bubble after display duration
      const hideTalkTimer = setTimeout(() => {
        setIsTalking(false);
      }, (mascotConfig.displayDurationSeconds || 5) * 1000);

      // Keep mascot present or hide if intermittent
      return hideTalkTimer;
    };

    // Initial trigger
    const initialTimer = setTimeout(triggerCycle, 3000);

    // Recurring interval
    const intervalMs = Math.max(10, mascotConfig.frequencySeconds || 15) * 1000;
    const interval = setInterval(triggerCycle, intervalMs);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [
    mascotConfig.enabled,
    mascotConfig.frequencySeconds,
    mascotConfig.displayDurationSeconds,
    mascotConfig.messages,
  ]);

  if (!mascotConfig.enabled) return null;

  const handleMascotClick = () => {
    if (!mascotConfig.allowClickInteraction) return;
    setAnimationState('jump');
    setIsTalking(true);
    setSpeechIndex((prev) => (prev + 1) % (mascotConfig.messages.length || 1));
    setTimeout(() => setAnimationState('idle'), 800);
  };

  const currentMessage =
    mascotConfig.messages[speechIndex] || '¡Bienvenido a ANAPSE VIDEO GAMES!';

  return (
    <div className={`fixed ${positionClasses} z-40 pointer-events-none select-none transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="relative pointer-events-auto flex flex-col items-end">
        
        {/* Speech Bubble Container */}
        {isTalking && (
          <div className="mb-2 mr-2 max-w-[240px] p-3 rounded-2xl bg-slate-900/95 border border-cyan-400/60 shadow-2xl text-xs text-white backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="flex items-start justify-between gap-1 mb-1">
              <span className="font-['Orbitron'] font-black text-[9px] text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                ANAPSE COMPANION
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTalking(false);
                }}
                className="text-slate-500 hover:text-white text-[10px]"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-200 font-medium leading-tight">
              {currentMessage}
            </p>
            {/* Bubble Tail */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-cyan-400/60 rotate-45" />
          </div>
        )}

        {/* Mascot Character / Sprite Render Box */}
        <div
          onClick={handleMascotClick}
          className={`cursor-pointer group flex flex-col items-center transition-transform duration-300 ${
            animationState === 'jump' ? '-translate-y-5 scale-110' : 'hover:-translate-y-1'
          }`}
          title="Mascota interactiva ANAPSE (Configurable desde el Dashboard)"
        >
          {/* Animated Sprite Box Container */}
          <div className={`relative ${sizeConfig.w} flex items-center justify-center`}>
            
            {/* Ambient Aura Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-sky-400/20 to-orange-500/20 rounded-full blur-md animate-pulse" />

            {/* Custom Sprite Sheet / Frame Renderer / Placeholder Engine */}
            {mascotConfig.spriteSourceType === 'custom_sprite' && mascotConfig.customSpriteUrl ? (
              <img
                src={mascotConfig.customSpriteUrl}
                alt="Mascota ANAPSE"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(6,182,212,0.4)]"
              />
            ) : (
              /* Flexible Animated Vector Avatar */
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-orange-500 p-0.5 shadow-lg shadow-cyan-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                  <span
                    className={`transition-transform duration-200 ${sizeConfig.icon} ${
                      animationState === 'jump'
                        ? 'scale-125'
                        : animationState === 'wave'
                        ? 'rotate-12'
                        : frameIndex % 2 === 0
                        ? '-rotate-3'
                        : 'rotate-3'
                    }`}
                  >
                    🎮
                  </span>
                  <span className="absolute bottom-0.5 right-1 text-[8px] font-black text-cyan-400 font-['Orbitron']">
                    A
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Floating Cyber Cloud Pedestal */}
          {mascotConfig.showCloud && (
            <div
              className={`${sizeConfig.cloud} bg-gradient-to-r from-cyan-500/40 via-sky-400/60 to-indigo-500/40 rounded-full blur-[1.5px] -mt-1 shadow-sm shadow-cyan-400 animate-pulse`}
            />
          )}
        </div>

        {/* Quick minimize toggle button */}
        <button
          onClick={() => updateMascotConfig({ enabled: false })}
          className="mt-1 text-[8px] font-bold text-slate-500 hover:text-slate-300 bg-slate-950/80 px-1.5 py-0.5 rounded-full border border-slate-800"
          title="Desactivar Mascota"
        >
          Ocultar
        </button>
      </div>
    </div>
  );
};
