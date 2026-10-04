import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Game } from '../types';
import { Trophy } from 'lucide-react';

interface BestPlayerWidgetProps {
  game: Game;
}

export const BestPlayerWidget: React.FC<BestPlayerWidgetProps> = ({ game }) => {
  const [topPlayer, setTopPlayer] = useState<{ name: string; score: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTop = async () => {
      try {
        const config = game.rankingConfig;
        const targetCollection = config?.collection || 'scores';
        const scoreField = config?.scoreField || 'score';
        const playerField = config?.playerField || 'playerName';
        const orderDir = config?.order || 'desc';

        const colRef = collection(db, targetCollection);
        let q;

        if (config?.collection) {
          q = query(colRef, orderBy(scoreField, orderDir), limit(1));
        } else {
          q = query(colRef, where('gameId', '==', game.gameId), orderBy(scoreField, orderDir), limit(1));
        }

        const snapshot = await getDocs(q);
        if (!snapshot.empty && isMounted) {
          const docData = snapshot.docs[0].data();
          const name = docData[playerField] || docData['playerName'] || docData['name'] || 'Jugador Anónimo';
          const score = Number(docData[scoreField] ?? docData['score'] ?? 0);
          setTopPlayer({ name, score });
        } else if (isMounted) {
          setTopPlayer(null);
        }
      } catch (err) {
        if (isMounted) setTopPlayer(null);
      }
    };

    fetchTop();
    return () => {
      isMounted = false;
    };
  }, [game.gameId, game.rankingConfig]);

  return (
    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-0.5">
      <div className="flex items-center gap-1 text-amber-500 font-bold font-['Orbitron'] text-[10px] tracking-wider">
        <Trophy className="w-3 h-3" />
        <span>MEJOR JUGADOR</span>
      </div>
      {topPlayer ? (
        <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
          <span className="font-bold truncate max-w-[110px]" title={topPlayer.name}>{topPlayer.name}</span>
          <span className="font-mono font-black text-amber-600 dark:text-amber-400">⭐ {topPlayer.score}</span>
        </div>
      ) : (
        <p className="text-[11px] text-slate-400 italic">Aún no hay puntuaciones</p>
      )}
    </div>
  );
};
