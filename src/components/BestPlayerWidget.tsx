import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where, getFirestore } from 'firebase/firestore';
import { db, app } from '../lib/firebase';
import { Game } from '../types';
import { Trophy } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

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
        const databaseId = config?.databaseId?.trim();
        const targetCollection = config?.collection || 'scores';
        const scoreField = config?.scoreField || 'score';
        const playerField = config?.playerField || 'playerName';
        const orderDir = config?.order || 'desc';

        console.log('[BestPlayer]');
        console.log(`Game: ${game.gameId}`);
        console.log(`Firebase projectId: ${firebaseConfig.projectId}`);
        console.log(`Database ID: ${databaseId || '(default)'}`);
        console.log(`Collection: ${targetCollection}`);
        console.log(`PlayerField: ${playerField}`);
        console.log(`ScoreField: ${scoreField}`);
        console.log(`Order: ${orderDir}`);

        const targetDb = databaseId ? getFirestore(app, databaseId) : db;
        const colRef = collection(targetDb, targetCollection);
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
          console.log('[BestPlayer] Best player found');
          console.log(`[BestPlayer] Player: ${name}`);
          console.log(`[BestPlayer] Score: ${score}`);
          setTopPlayer({ name, score });
        } else {
          console.log('[BestPlayer] No documents found');
          if (isMounted) setTopPlayer(null);
        }
      } catch (err: any) {
        console.error('[BestPlayer] Error:', err);
        const errMsg = err?.message || String(err);
        console.log(`[BestPlayer] Database error: ${errMsg}`);
        if (errMsg.includes('permission') || errMsg.includes('Missing or insufficient permissions')) {
          console.log('[BestPlayer] Permission denied');
        }
        if (isMounted) setTopPlayer(null);
      }
    };

    fetchTop();
    return () => {
      isMounted = false;
    };
  }, [game.gameId, game.rankingConfig]);

  return (
    <div className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-xl bg-white/35 dark:bg-stone-900/25 border border-white/45 dark:border-amber-100/15 px-3 py-2 shadow-[0_3px_10px_rgba(80,55,20,0.08)] backdrop-blur-sm">
      <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-300 shrink-0" />
      {topPlayer ? (
        <>
          <span className="max-w-[120px] sm:max-w-[160px] font-bold text-slate-800 dark:text-white text-xs truncate" title={topPlayer.name}>{topPlayer.name}</span>
          <span className="font-mono font-black text-amber-700 dark:text-amber-300 text-xs shrink-0">{topPlayer.score.toLocaleString()}</span>
        </>
      ) : (
        <span className="text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">Sin récord</span>
      )}
    </div>
  );
};
