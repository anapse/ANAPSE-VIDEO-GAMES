import React, { useState } from 'react';
import {
  FileCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  GitBranch,
  Database,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { validateAnapseGameSpec } from '../../services/specValidator';
import { SpecValidationResult } from '../../types/anapseGameSpec';
import { useGameData } from '../../context/GameDataContext';
import confetti from 'canvas-confetti';

const SAMPLE_SPEC_JSON = `{
  "gameId": "fox-thief",
  "name": "FOX THIEF",
  "version": "1.2.4",
  "category": "Animales",
  "status": "published",
  "web": {
    "url": "https://anapse.github.io/fox-thief/",
    "allowEmbed": true
  },
  "repository": {
    "provider": "github",
    "owner": "anapse",
    "name": "fox-thief",
    "branch": "main"
  },
  "firebase": {
    "projectId": "fox-thief-prod",
    "databaseType": "firestore"
  },
  "collections": {
    "players": "players",
    "ranking": "rankings",
    "scores": "scores",
    "events": "gameEvents"
  },
  "features": {
    "ranking": true,
    "likes": true,
    "ratings": true,
    "comments": true,
    "sharing": true,
    "donations": true
  },
  "ranking": {
    "enabled": true,
    "type": "score",
    "limit": 50,
    "scoreField": "score",
    "order": "desc",
    "unit": "pts"
  }
}`;

export const SpecSyncViewer: React.FC = () => {
  const { games, addOrUpdateGame } = useGameData();
  const [jsonInput, setJsonInput] = useState(SAMPLE_SPEC_JSON);
  const [validation, setValidation] = useState<SpecValidationResult>(() =>
    validateAnapseGameSpec(SAMPLE_SPEC_JSON)
  );
  const [copied, setCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleValidate = () => {
    const res = validateAnapseGameSpec(jsonInput);
    setValidation(res);
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(SAMPLE_SPEC_JSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncToPortal = async () => {
    const res = validateAnapseGameSpec(jsonInput);
    if (!res.isValid || !res.spec) {
      alert('Corrige los errores del manifiesto antes de sincronizar.');
      return;
    }

    const spec = res.spec;
    await addOrUpdateGame({
      gameId: spec.gameId,
      name: spec.name,
      version: spec.version || '1.0.0',
      category: spec.category || 'SIN CATEGORÍA',
      webUrl: spec.web?.url,
      embedAllowed: spec.web?.allowEmbed ?? true,
      repository: spec.repository
        ? {
            provider: spec.repository.provider,
            owner: spec.repository.owner,
            name: spec.repository.name,
            branch: spec.repository.branch,
            lastSync: new Date().toISOString(),
          }
        : undefined,
      firebaseConfig: spec.firebase
        ? {
            projectId: spec.firebase.projectId,
            databaseType: spec.firebase.databaseType,
            collections: spec.collections,
          }
        : undefined,
      rankingConfig: spec.ranking
        ? {
            enabled: spec.ranking.enabled,
            type: spec.ranking.type,
            scoreField: spec.ranking.scoreField || 'score',
            order: spec.ranking.order || 'desc',
            limit: spec.ranking.limit || 50,
            unit: spec.ranking.unit || 'pts',
          }
        : undefined,
    });

    setSyncStatus(`¡Juego "${spec.name}" sincronizado con éxito en ANAPSE!`);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setSyncStatus(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Orbitron']">
            ANAPSE GAME SPEC v1 — ESTÁNDAR & SINCRONIZACIÓN
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          El manifiesto estándar <code>anapse-game.json</code> permite que cualquier nuevo juego se conecte al portal central sin tocar el código fuente principal.
        </p>
      </div>

      {/* Editor & Live Diagnosis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: JSON Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span>Archivo: anapse-game.json</span>
            </h3>
            <button
              onClick={handleCopySample}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar Plantilla'}</span>
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <textarea
              rows={18}
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setValidation(validateAnapseGameSpec(e.target.value));
              }}
              className="w-full p-4 font-mono text-xs text-emerald-400 bg-slate-950 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleValidate}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Validar Manifiesto</span>
            </button>

            <button
              onClick={handleSyncToPortal}
              disabled={!validation.isValid}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-40 text-slate-950 font-black text-xs font-['Orbitron'] flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>SINCRONIZAR REPOSITORIO</span>
            </button>
          </div>

          {syncStatus && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-300 text-center animate-in fade-in">
              {syncStatus}
            </div>
          )}
        </div>

        {/* Right Column: AI / Spec Live Diagnosis (Section 8 & 26) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white font-['Orbitron'] flex items-center gap-2">
                <span>DIAGNÓSTICO EN VIVO</span>
              </h3>
              <div
                className={`px-3 py-1 rounded-full text-xs font-black font-mono ${
                  validation.isValid
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                Compatibilidad: {validation.score}%
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {validation.checks.map((check) => (
                <div
                  key={check.id}
                  className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                    check.status === 'pass'
                      ? 'bg-slate-950/80 border-emerald-500/30 text-emerald-300'
                      : check.status === 'warn'
                      ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <span className="text-sm shrink-0 mt-0.5">
                    {check.status === 'pass' ? '🟢' : check.status === 'warn' ? '⚠️' : '🔴'}
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">{check.title}</p>
                    <p className="text-[11px] opacity-90">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">🛡️ Regla de Seguridad ANAPSE:</p>
              <p>
                Nunca almacenes contraseñas, private keys ni credenciales de Service Account en este manifiesto. El portal se conecta mediante referencias seguras de Firestore y client tokens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
