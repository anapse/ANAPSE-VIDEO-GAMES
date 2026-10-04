import React, { useState } from 'react';
import { X, Save, Gamepad2, Image as ImageIcon, Link2, Trophy, Layers } from 'lucide-react';
import { Game, GameStatus } from '../../types';
import { useGameData } from '../../context/GameDataContext';

interface GameEditorModalProps {
  gameToEdit?: Game | null;
  onClose: () => void;
}

export const GameEditorModal: React.FC<GameEditorModalProps> = ({ gameToEdit, onClose }) => {
  const { categories, addOrUpdateGame } = useGameData();

  const [gameId, setGameId] = useState(gameToEdit?.gameId || '');
  const [name, setName] = useState(gameToEdit?.name || '');
  const [tagline, setTagline] = useState(gameToEdit?.tagline || '');
  const [description, setDescription] = useState(gameToEdit?.description || '');
  const [mainImage, setMainImage] = useState(
    gameToEdit?.mainImage ||
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
  );
  const [bannerImage, setBannerImage] = useState(gameToEdit?.bannerImage || '');
  const [category, setCategory] = useState(gameToEdit?.category || 'SIN CATEGORÍA');
  const [status, setStatus] = useState<GameStatus>(gameToEdit?.status || 'SIN CATEGORÍA');
  const [version, setVersion] = useState(gameToEdit?.version || '1.0.0');
  const [webUrl, setWebUrl] = useState(gameToEdit?.webUrl || '');
  const [embedAllowed, setEmbedAllowed] = useState(gameToEdit?.embedAllowed ?? true);
  const [featured, setFeatured] = useState(gameToEdit?.featured ?? false);
  const [inPromotion, setInPromotion] = useState(gameToEdit?.inPromotion ?? false);
  const [rankingEnabled, setRankingEnabled] = useState(gameToEdit?.rankingConfig?.enabled ?? true);
  const [rankingType, setRankingType] = useState(gameToEdit?.rankingConfig?.type || 'score');
  const [rankingUnit, setRankingUnit] = useState(gameToEdit?.rankingConfig?.unit || 'pts');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allStatuses: GameStatus[] = [
    'SIN CATEGORÍA',
    'PROPUESTO',
    'EN ENCUESTA',
    'SELECCIONADO',
    'EN CREACIÓN',
    'BETA',
    'PUBLICADO',
    'EN REPARACIÓN',
    'EN PROMOCIÓN',
    'PRÓXIMAMENTE',
    'ARCHIVADO',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameId.trim() || !name.trim()) return;

    setIsSubmitting(true);
    await addOrUpdateGame({
      gameId: gameId.trim().toLowerCase().replace(/\s+/g, '-'),
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      mainImage: mainImage.trim(),
      bannerImage: bannerImage.trim() || undefined,
      category,
      status,
      version: version.trim(),
      webUrl: webUrl.trim() || undefined,
      embedAllowed,
      featured,
      inPromotion,
      rankingConfig: {
        enabled: rankingEnabled,
        type: rankingType as any,
        scoreField: 'score',
        order: 'desc',
        limit: 50,
        unit: rankingUnit,
      },
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white font-['Orbitron']">
                {gameToEdit ? `EDITAR: ${gameToEdit.name}` : 'REGISTRAR NUEVO JUEGO'}
              </h3>
              <p className="text-xs text-slate-400">Panel Central de Videojuegos ANAPSE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">ID Único (gameId) *</label>
              <input
                type="text"
                required
                disabled={!!gameToEdit}
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="ej: fox-thief, gearpunk"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Nombre Público *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del juego"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Categoría</label>
              {(() => {
                const defaultCategories = [
                  'SIN CATEGORÍA',
                  'Arcade',
                  'Acción',
                  'Aventura',
                  'Estrategia',
                  'Deportes',
                  'Plataformas',
                  'Puzzles',
                ];
                const availableCategories = categories && categories.length > 0
                  ? Array.from(new Set([...categories.map((c) => c.name), ...defaultCategories]))
                  : defaultCategories;

                return (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold focus:outline-none focus:border-cyan-400"
                  >
                    {availableCategories.map((catName) => (
                      <option key={catName} value={catName}>
                        {catName}
                      </option>
                    ))}
                  </select>
                );
              })()}
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Estado de Publicación *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GameStatus)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-black focus:outline-none focus:border-cyan-400"
              >
                {allStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Versión</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Lema o Tagline Breve</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Frase de impacto del juego"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Descripción Completa</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sinopsis, controles y objetivos del juego..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">URL Imagen Principal</label>
              <input
                type="url"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="https://..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">URL Banner Panorámico</label>
              <input
                type="url"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                placeholder="https://..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">URL Web del Juego (Embebido)</label>
            <input
              type="url"
              value={webUrl}
              onChange={(e) => setWebUrl(e.target.value)}
              placeholder="https://anapse.github.io/mi-juego/"
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Checkboxes & Config */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={embedAllowed}
                onChange={(e) => setEmbedAllowed(e.target.checked)}
                className="rounded text-cyan-500"
              />
              <span className="font-bold text-slate-300">Iframe Habilitado</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded text-cyan-500"
              />
              <span className="font-bold text-slate-300">Destacado</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inPromotion}
                onChange={(e) => setInPromotion(e.target.checked)}
                className="rounded text-orange-500"
              />
              <span className="font-bold text-orange-400">En Promoción</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={rankingEnabled}
                onChange={(e) => setRankingEnabled(e.target.checked)}
                className="rounded text-amber-500"
              />
              <span className="font-bold text-amber-400">Activar Ranking</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs font-['Orbitron'] flex items-center gap-2 shadow-md shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'GUARDANDO...' : 'GUARDAR JUEGO'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
