import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Shield, Zap, Sparkles, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FoxThiefGameProps {
  onGameOver?: (score: number) => void;
  onExit?: () => void;
}

export const FoxThiefMiniGame: React.FC<FoxThiefGameProps> = ({ onGameOver, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio effects synthesizer via Web Audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playSfx = (type: 'egg' | 'alert' | 'win' | 'lose') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'egg') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'win') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      // audio ignore
    }
  };

  // Game Engine State
  const gameStateRef = useRef({
    player: { x: 50, y: 50, size: 24, speed: 3.5, stealth: false },
    eggs: [] as { x: number; y: number; collected: boolean }[],
    guards: [] as { x: number; y: number; vx: number; vy: number; range: number; angle: number }[],
    exit: { x: 540, y: 340, width: 40, height: 40, unlocked: false },
    keys: { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, s: false, a: false, d: false },
  });

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setVictory(false);
    setScore(0);
    setLives(3);
    setLevel(1);
    initLevel(1);
  };

  const initLevel = (lvl: number) => {
    const width = 600;
    const height = 400;

    // Eggs scattered
    const eggsCount = 5 + lvl * 2;
    const newEggs = [];
    for (let i = 0; i < eggsCount; i++) {
      newEggs.push({
        x: 80 + Math.random() * (width - 160),
        y: 80 + Math.random() * (height - 160),
        collected: false,
      });
    }

    // Guards patrol
    const guardsCount = 1 + lvl;
    const newGuards = [];
    for (let i = 0; i < guardsCount; i++) {
      newGuards.push({
        x: 200 + i * 100,
        y: 150 + (i % 2) * 100,
        vx: (Math.random() > 0.5 ? 1 : -1) * (1.5 + lvl * 0.4),
        vy: (Math.random() > 0.5 ? 1 : -1) * (1.2 + lvl * 0.4),
        range: 75 + lvl * 5,
        angle: 0,
      });
    }

    gameStateRef.current = {
      ...gameStateRef.current,
      player: { x: 50, y: 50, size: 24, speed: 3.5, stealth: false },
      eggs: newEggs,
      guards: newGuards,
      exit: { x: width - 70, y: height - 70, width: 44, height: 44, unlocked: false },
    };
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's', 'a', 'd', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key in gameStateRef.current.keys) {
        (gameStateRef.current.keys as any)[e.key] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in gameStateRef.current.keys) {
        (gameStateRef.current.keys as any)[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver || victory) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const { player, eggs, guards, exit, keys } = gameStateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // 1. Move Player
      let dx = 0;
      let dy = 0;
      if (keys.ArrowUp || keys.w) dy -= 1;
      if (keys.ArrowDown || keys.s) dy += 1;
      if (keys.ArrowLeft || keys.a) dx -= 1;
      if (keys.ArrowRight || keys.d) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }

      player.x = Math.max(player.size, Math.min(w - player.size, player.x + dx * player.speed));
      player.y = Math.max(player.size, Math.min(h - player.size, player.y + dy * player.speed));

      // 2. Collect eggs
      eggs.forEach((egg) => {
        if (!egg.collected) {
          const dist = Math.hypot(player.x - egg.x, player.y - egg.y);
          if (dist < player.size + 12) {
            egg.collected = true;
            setScore((prev) => prev + 250);
            playSfx('egg');
          }
        }
      });

      // Check if all eggs collected
      const remainingEggs = eggs.filter((e) => !e.collected).length;
      if (remainingEggs === 0 && !exit.unlocked) {
        exit.unlocked = true;
      }

      // Check exit collision
      if (exit.unlocked) {
        const atExit =
          player.x > exit.x &&
          player.x < exit.x + exit.width &&
          player.y > exit.y &&
          player.y < exit.y + exit.height;

        if (atExit) {
          playSfx('win');
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          if (level < 3) {
            setLevel((prev) => prev + 1);
            setScore((prev) => prev + 1000);
            initLevel(level + 1);
          } else {
            setVictory(true);
            setIsPlaying(false);
            setScore((prev) => {
              const finalScore = prev + 3000;
              onGameOver?.(finalScore);
              return finalScore;
            });
          }
        }
      }

      // 3. Move guards & Detect player
      guards.forEach((guard) => {
        guard.x += guard.vx;
        guard.y += guard.vy;

        if (guard.x < 50 || guard.x > w - 50) guard.vx *= -1;
        if (guard.y < 50 || guard.y > h - 50) guard.vy *= -1;

        guard.angle = Math.atan2(guard.vy, guard.vx);

        // Guard detection cone / radius
        const dist = Math.hypot(player.x - guard.x, player.y - guard.y);
        if (dist < guard.range) {
          // Player caught!
          playSfx('alert');
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameOver(true);
              setIsPlaying(false);
              onGameOver?.(score);
            } else {
              // Reset player to start
              player.x = 50;
              player.y = 50;
            }
            return nextL;
          });
        }
      });

      // 4. Render Graphics
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // Grid background pattern
      ctx.strokeStyle = '#1e293b22';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Render Exit Barn
      ctx.fillStyle = exit.unlocked ? '#10b98133' : '#33415533';
      ctx.strokeStyle = exit.unlocked ? '#10b981' : '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(exit.x, exit.y, exit.width, exit.height);
      ctx.fillRect(exit.x, exit.y, exit.width, exit.height);
      ctx.font = '16px sans-serif';
      ctx.fillText(exit.unlocked ? '🚪' : '🔒', exit.x + 12, exit.y + 28);

      // Render Guard Searchlights & Dogs
      guards.forEach((guard) => {
        // Searchlight zone
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.beginPath();
        ctx.arc(guard.x, guard.y, guard.range, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.stroke();

        // Guard body (Dog/Farmer)
        ctx.font = '20px sans-serif';
        ctx.fillText('🐕', guard.x - 10, guard.y + 7);
      });

      // Render Golden Eggs
      eggs.forEach((egg) => {
        if (!egg.collected) {
          ctx.save();
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 10;
          ctx.font = '18px sans-serif';
          ctx.fillText('🥚', egg.x - 9, egg.y + 7);
          ctx.restore();
        }
      });

      // Render Player Fox
      ctx.save();
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.font = '24px sans-serif';
      ctx.fillText('🦊', player.x - 12, player.y + 9);
      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, gameOver, victory, level, score]);

  const handleMobileTouch = (direction: 'up' | 'down' | 'left' | 'right', state: boolean) => {
    const keyMap = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    };
    const key = keyMap[direction];
    (gameStateRef.current.keys as any)[key] = state;
  };

  return (
    <div className="flex flex-col items-center bg-slate-950 p-3 sm:p-5 rounded-3xl border border-cyan-500/30 shadow-2xl max-w-2xl mx-auto w-full">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {onExit && (
            <button
              onClick={onExit}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Volver</span>
            </button>
          )}
          <span className="font-['Orbitron'] font-black text-xs sm:text-sm text-cyan-400">FOX THIEF v1.2</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold">
            NIVEL {level}/3
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score.toLocaleString()} pts</span>
          </div>

          <div className="flex items-center gap-0.5 text-xs text-rose-400">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i}>{i < lives ? '❤️' : '🖤'}</span>
            ))}
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
        <canvas ref={canvasRef} width={600} height={400} className="w-full h-full object-contain" />

        {/* Start Overlay */}
        {!isPlaying && !gameOver && !victory && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
            <div className="text-5xl animate-bounce">🦊</div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white font-['Orbitron'] tracking-wider">
                MISIÓN: ROBO DE HUEVOS DORADOS
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                Muévete sigilosamente con las <b>Flechas del teclado</b> o <b>WASD</b>. Recolecta todos los huevos 🥚 y escapa por la puerta 🚪 sin ser detectado por los perros guardianes 🐕.
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm font-['Orbitron'] flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>INICIAR PARTIDA</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="text-4xl">🚨</div>
            <h3 className="text-2xl font-black text-rose-300 font-['Orbitron']">¡TE HAN ATRAPADO!</h3>
            <p className="text-xs text-slate-300">Puntaje acumulado: <b className="text-amber-300 font-mono text-sm">{score} pts</b></p>
            <button
              onClick={startGame}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs font-['Orbitron'] flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REINTENTAR</span>
            </button>
          </div>
        )}

        {/* Victory Overlay */}
        {victory && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="text-4xl">🏆</div>
            <h3 className="text-2xl font-black text-emerald-300 font-['Orbitron']">¡MISIÓN CUMPLIDA!</h3>
            <p className="text-xs text-slate-300">¡Lograste escapar con todos los huevos dorados!</p>
            <p className="text-lg font-mono font-black text-amber-300">Puntaje Final: {score.toLocaleString()} pts</p>
            <button
              onClick={startGame}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs font-['Orbitron'] flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>JUGAR DE NUEVO</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controller (On-Screen D-Pad) */}
      <div className="sm:hidden pt-3 w-full flex flex-col items-center">
        <p className="text-[10px] text-slate-500 font-bold mb-1">Controles táctiles</p>
        <div className="grid grid-cols-3 gap-1 w-40">
          <div />
          <button
            onTouchStart={() => handleMobileTouch('up', true)}
            onTouchEnd={() => handleMobileTouch('up', false)}
            onMouseDown={() => handleMobileTouch('up', true)}
            onMouseUp={() => handleMobileTouch('up', false)}
            className="p-3 bg-slate-800 active:bg-cyan-500 active:text-slate-950 rounded-xl text-center font-bold"
          >
            ▲
          </button>
          <div />
          <button
            onTouchStart={() => handleMobileTouch('left', true)}
            onTouchEnd={() => handleMobileTouch('left', false)}
            onMouseDown={() => handleMobileTouch('left', true)}
            onMouseUp={() => handleMobileTouch('left', false)}
            className="p-3 bg-slate-800 active:bg-cyan-500 active:text-slate-950 rounded-xl text-center font-bold"
          >
            ◀
          </button>
          <button
            onTouchStart={() => handleMobileTouch('down', true)}
            onTouchEnd={() => handleMobileTouch('down', false)}
            onMouseDown={() => handleMobileTouch('down', true)}
            onMouseUp={() => handleMobileTouch('down', false)}
            className="p-3 bg-slate-800 active:bg-cyan-500 active:text-slate-950 rounded-xl text-center font-bold"
          >
            ▼
          </button>
          <button
            onTouchStart={() => handleMobileTouch('right', true)}
            onTouchEnd={() => handleMobileTouch('right', false)}
            onMouseDown={() => handleMobileTouch('right', true)}
            onMouseUp={() => handleMobileTouch('right', false)}
            className="p-3 bg-slate-800 active:bg-cyan-500 active:text-slate-950 rounded-xl text-center font-bold"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
