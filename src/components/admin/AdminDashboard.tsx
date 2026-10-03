import React, { useState } from 'react';
import {
  BarChart3,
  Gamepad2,
  Lightbulb,
  Vote,
  MessageSquare,
  Users,
  Heart,
  TrendingUp,
  Trophy,
  FolderTree,
  GitBranch,
  Flame,
  Settings,
  Image as ImageIcon,
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Shield,
  Search,
  Sparkles,
  Database,
  ArrowRight,
  Eye,
  Bot,
  Save,
} from 'lucide-react';
import { useGameData } from '../../context/GameDataContext';
import { useAuth } from '../../context/AuthContext';
import { Game, GameStatus, Proposal, Category, UserRole, MascotConfig } from '../../types';
import { GameEditorModal } from './GameEditorModal';
import { SpecSyncViewer } from './SpecSyncViewer';
import confetti from 'canvas-confetti';

export const AdminDashboard: React.FC = () => {
  const {
    games,
    categories,
    proposals,
    polls,
    comments,
    donations,
    announcements,
    globalAnalytics,
    deleteGame,
    updateGameStatus,
    updateProposalStatus,
    deleteComment,
    addCategory,
    deleteCategory,
    mascotConfig,
    updateMascotConfig,
    supportSettings,
    updateSupportSettings,
  } = useGameData();

  const { profile } = useAuth();

  const [activeTab, setActiveTab] = useState<
    | 'resumen'
    | 'juegos'
    | 'propuestas'
    | 'encuestas'
    | 'comentarios'
    | 'usuarios'
    | 'apoyos'
    | 'analitica'
    | 'rankings'
    | 'categorias'
    | 'repos'
    | 'firebase'
    | 'config'
    | 'recursos'
    | 'anuncios'
  >('resumen');

  const [isGameEditorOpen, setIsGameEditorOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newMascotMessage, setNewMascotMessage] = useState('');

  const navItems = [
    { id: 'resumen', label: '📊 Resumen' },
    { id: 'juegos', label: '🎮 Juegos', count: games.length },
    { id: 'propuestas', label: '💡 Propuestas', count: proposals.length },
    { id: 'encuestas', label: '🗳️ Encuestas', count: polls.length },
    { id: 'comentarios', label: '💬 Comentarios', count: comments.length },
    { id: 'usuarios', label: '👥 Usuarios' },
    { id: 'apoyos', label: '❤️ Apoyos', count: donations.length },
    { id: 'analitica', label: '📈 Analítica' },
    { id: 'rankings', label: '🏆 Rankings' },
    { id: 'categorias', label: '📁 Categorías', count: categories.length },
    { id: 'repos', label: '🔗 Repositorios' },
    { id: 'firebase', label: '🔥 Firebase' },
    { id: 'recursos', label: '🖼️ Recursos' },
    { id: 'anuncios', label: '📢 Anuncios', count: announcements.length },
    { id: 'config', label: '⚙️ Configuración' },
  ];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catId = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
    addCategory({
      id: catId,
      name: newCatName.trim(),
      icon: 'Gamepad2',
      order: categories.length,
    });
    setNewCatName('');
  };

  const handleAddMascotMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMascotMessage.trim()) return;
    updateMascotConfig({
      messages: [...mascotConfig.messages, newMascotMessage.trim()],
    });
    setNewMascotMessage('');
    confetti({ particleCount: 20, spread: 30, origin: { y: 0.7 } });
  };

  const handleRemoveMascotMessage = (index: number) => {
    const updated = mascotConfig.messages.filter((_, i) => i !== index);
    updateMascotConfig({ messages: updated });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Dashboard Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Orbitron']">
              PANEL DE ADMINISTRACIÓN ANAPSE
            </h1>
            <p className="text-xs text-slate-400">
              Control centralizado de catálogo, comunidad, specs, Firebase y métricas en vivo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingGame(null);
              setIsGameEditorOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs font-['Orbitron'] flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>REGISTRAR JUEGO</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-950/40 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 📊 RESUMEN */}
      {activeTab === 'resumen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Partidas Jugadas</span>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400 font-['Orbitron']">
                {globalAnalytics.totalPlays.toLocaleString()}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Juegos Activos</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-['Orbitron']">
                {games.length}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Propuestas Comunidad</span>
              <p className="text-2xl sm:text-3xl font-black text-indigo-400 font-['Orbitron']">
                {proposals.length}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Apoyos / Donaciones</span>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 font-['Orbitron']">
                S/ {globalAnalytics.totalDonations}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-black text-white font-['Orbitron']">Top Juegos Más Jugados</h3>
              <div className="space-y-2">
                {globalAnalytics.topGamesByPlays.map((g, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="font-bold text-slate-200">#{i + 1} {g.name}</span>
                    <span className="font-mono text-cyan-300 font-bold">{g.count.toLocaleString()} partidas</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-black text-white font-['Orbitron']">Últimas Propuestas por Moderar</h3>
              <div className="space-y-2">
                {proposals.slice(0, 3).map((p) => (
                  <div key={p.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-200">{p.title}</p>
                      <p className="text-[10px] text-slate-400">{p.votesCount} votos • {p.authorName}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('propuestas')}
                      className="text-xs font-bold text-cyan-400"
                    >
                      Revisar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎮 JUEGOS */}
      {activeTab === 'juegos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white font-['Orbitron']">Registro de Juegos ({games.length})</h3>
            <button
              onClick={() => {
                setEditingGame(null);
                setIsGameEditorOpen(true);
              }}
              className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 font-['Orbitron']"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Juego</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Juego</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5">Partidas</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {games.map((g) => (
                  <tr key={g.gameId} className="hover:bg-slate-850/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={g.mainImage} alt={g.name} className="w-10 h-10 rounded-xl object-cover bg-slate-950" />
                      <div>
                        <p className="font-bold text-white font-['Orbitron']">{g.name}</p>
                        <span className="font-mono text-[10px] text-slate-400">ID: {g.gameId}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-cyan-300">{g.category}</td>
                    <td className="p-3.5">
                      <select
                        value={g.status}
                        onChange={(e) => updateGameStatus(g.gameId, e.target.value as GameStatus)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-[11px] font-bold text-cyan-400"
                      >
                        {[
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
                        ].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 font-mono">{g.playsCount.toLocaleString()}</td>
                    <td className="p-3.5 font-mono text-amber-300">⭐ {g.ratingAvg}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingGame(g);
                          setIsGameEditorOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar ${g.name}?`)) deleteGame(g.gameId);
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 💡 PROPUESTAS */}
      {activeTab === 'propuestas' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white font-['Orbitron']">Propuestas de la Comunidad ({proposals.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposals.map((p) => (
              <div key={p.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-sm">{p.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {p.votesCount} votos
                  </span>
                </div>
                <p className="text-xs text-slate-300">{p.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Por {p.authorName}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => updateProposalStatus(p.id, 'APPROVED')}
                      className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold rounded-lg"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => updateProposalStatus(p.id, 'IN_DEVELOPMENT')}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold rounded-lg"
                    >
                      A Creación
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📈 ANALÍTICA */}
      {activeTab === 'analitica' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-black text-white font-['Orbitron']">Tráfico Semanal del Portal</h3>
            <div className="grid grid-cols-7 gap-2 pt-4">
              {globalAnalytics.dailyVisits.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-full h-32 bg-slate-950 rounded-2xl relative flex items-end p-1 border border-slate-800">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-xl transition-all duration-500"
                      style={{ height: `${(d.visits / 6000) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400">{d.date}</span>
                  <span className="text-[10px] font-mono text-cyan-300">{d.visits}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🔗 REPOSITORIOS / ANAPSE SPEC */}
      {activeTab === 'repos' && <SpecSyncViewer />}

      {/* 📁 CATEGORÍAS */}
      {activeTab === 'categorias' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-black text-white font-['Orbitron']">Gestor de Categorías</h3>
            <form onSubmit={handleAddCategory} className="flex gap-2 text-xs">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Nombre de nueva categoría..."
                className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl"
              >
                Agregar
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-xs">{c.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {c.id}</p>
                </div>
                {c.id !== 'sin-categoria' && (
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 FIREBASE */}
      {activeTab === 'firebase' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-black text-white font-['Orbitron'] flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <span>CONFIGURACIÓN FIREBASE CENTRAL</span>
          </h3>
          <p className="text-xs text-slate-300">
            El portal opera sobre su base de datos Firestore y Firebase Authentication independientes, permitiendo conectar cada videojuego individual sin mezclar sus estados internos.
          </p>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
            <p className="text-emerald-400">🟢 Firestore Database: ai-studio-anapsevideogames-e3f1db0c-f816-48f3-b38d-796d7fa776cf</p>
            <p className="text-cyan-400">🟢 Google Authentication: Habilitada</p>
            <p className="text-slate-300">🛡️ Reglas de Seguridad: Desplegadas (ABAC Zero-Trust)</p>
          </div>
        </div>
      )}

      {/* 🖼️ RECURSOS */}
      {activeTab === 'recursos' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-black text-white font-['Orbitron'] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
            <span>RECURSOS VISUALES & ASSETS</span>
          </h3>
          <p className="text-xs text-slate-300">
            Recursos oficiales registrados para ANAPSE VIDEO GAMES:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-amber-300">1. Anapse Video Games_ Logo Gamer.png</span>
              <p className="text-slate-400 text-[11px]">Logo oficial con mando gamer, personajes y tipografía 3D.</p>
              <div className="p-2 bg-slate-900 rounded-xl text-center text-emerald-400 font-bold">Activo</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-cyan-300">2. Héroes y mundos de videojuegos neón.png</span>
              <p className="text-slate-400 text-[11px]">Banner panorámico con héroes, mundos neón y plataformas Android / iOS / PC / Mac.</p>
              <div className="p-2 bg-slate-900 rounded-xl text-center text-emerald-400 font-bold">Activo</div>
            </div>
          </div>
        </div>
      )}

      {/* ⚙️ CONFIGURACIÓN */}
      {activeTab === 'config' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-base font-black text-white font-['Orbitron'] flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span>CONFIGURACIÓN DEL MOTOR DE MASCOTA / SPRITE ANIMADO</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            {/* General Toggles */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm">Parámetros de Comportamiento</h4>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Activar Mascota en Pantalla</p>
                  <p className="text-[10px] text-slate-500">Muestra el sprite decorativo en la plataforma</p>
                </div>
                <button
                  onClick={() => updateMascotConfig({ enabled: !mascotConfig.enabled })}
                  className={`px-3 py-1.5 rounded-xl font-bold font-mono text-xs ${
                    mascotConfig.enabled ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {mascotConfig.enabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">Posición en Pantalla</label>
                <select
                  value={mascotConfig.position}
                  onChange={(e) => updateMascotConfig({ position: e.target.value as any })}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-cyan-300 font-bold"
                >
                  <option value="bottom-right">Inferior Derecha (Por defecto)</option>
                  <option value="bottom-left">Inferior Izquierda</option>
                  <option value="top-right">Superior Derecha</option>
                  <option value="floating-right">Flotante Lateral Centro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-300">Tamaño del Sprite</label>
                <select
                  value={mascotConfig.size}
                  onChange={(e) => updateMascotConfig({ size: e.target.value as any })}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-amber-300 font-bold"
                >
                  <option value="small">Pequeño (48px)</option>
                  <option value="medium">Mediano (64px)</option>
                  <option value="large">Grande (80px)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300">Frecuencia (segundos)</label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={mascotConfig.frequencySeconds}
                    onChange={(e) => updateMascotConfig({ frequencySeconds: parseInt(e.target.value) || 15 })}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300">Duración Globo (seg)</label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={mascotConfig.displayDurationSeconds}
                    onChange={(e) => updateMascotConfig({ displayDurationSeconds: parseInt(e.target.value) || 5 })}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-300">Mostrar Nube Cibernética</span>
                <input
                  type="checkbox"
                  checked={mascotConfig.showCloud}
                  onChange={(e) => updateMascotConfig({ showCloud: e.target.checked })}
                  className="rounded text-cyan-500"
                />
              </div>
            </div>

            {/* Speech Messages Pool */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Frases & Mensajes Configurables</h4>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {mascotConfig.messages.map((msg, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-200 truncate max-w-[240px]">"{msg}"</span>
                      <button
                        onClick={() => handleRemoveMascotMessage(i)}
                        className="text-rose-400 hover:text-rose-300 text-[10px] font-bold px-1.5"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddMascotMessage} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newMascotMessage}
                  onChange={(e) => setNewMascotMessage(e.target.value)}
                  placeholder="Nueva frase gamer..."
                  className="flex-1 p-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Agregar
                </button>
              </form>
            </div>
          </div>

          {/* Configuración del Sistema de Apoyo (Yape, PayPal, QR, WhatsApp) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-['Orbitron']">
                  Configuración del Sistema de Apoyo
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                Ajustes de Donación
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* YAPE Config */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-700 dark:text-purple-400 font-['Orbitron']">📱 YAPE</span>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span>Activar</span>
                    <input
                      type="checkbox"
                      checked={supportSettings?.yape?.enabled ?? true}
                      onChange={(e) => updateSupportSettings({ yape: { ...supportSettings.yape, enabled: e.target.checked } })}
                      className="rounded text-purple-600"
                    />
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Número de Celular Yape:</label>
                  <input
                    type="text"
                    value={supportSettings?.yape?.phone || ''}
                    onChange={(e) => updateSupportSettings({ yape: { ...supportSettings.yape, phone: e.target.value } })}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* PAYPAL Config */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-sky-700 dark:text-sky-400 font-['Orbitron']">💙 PAYPAL</span>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span>Activar</span>
                    <input
                      type="checkbox"
                      checked={supportSettings?.paypal?.enabled ?? true}
                      onChange={(e) => updateSupportSettings({ paypal: { ...supportSettings.paypal, enabled: e.target.checked } })}
                      className="rounded text-sky-600"
                    />
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Correo PayPal:</label>
                  <input
                    type="text"
                    value={supportSettings?.paypal?.email || ''}
                    onChange={(e) => updateSupportSettings({ paypal: { ...supportSettings.paypal, email: e.target.value } })}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* QR CONFIG (OFF BY DEFAULT) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-700 dark:text-amber-400 font-['Orbitron']">🖼️ QR DE PAGO</span>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span>Activar QR</span>
                    <input
                      type="checkbox"
                      checked={supportSettings?.qr?.enabled ?? false}
                      onChange={(e) => updateSupportSettings({ qr: { ...supportSettings.qr, enabled: e.target.checked } })}
                      className="rounded text-amber-600"
                    />
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">URL de Imagen QR:</label>
                  <input
                    type="text"
                    placeholder="https://... (URL de la imagen del QR)"
                    value={supportSettings?.qr?.imageUrl || ''}
                    onChange={(e) => updateSupportSettings({ qr: { ...supportSettings.qr, imageUrl: e.target.value } })}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* WHATSAPP CONFIG (OFF BY DEFAULT, INDEPENDENT FROM YAPE) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 font-['Orbitron']">💬 WHATSAPP SOPORTE</span>
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span>Activar WhatsApp</span>
                    <input
                      type="checkbox"
                      checked={supportSettings?.whatsapp?.enabled ?? false}
                      onChange={(e) => updateSupportSettings({ whatsapp: { ...supportSettings.whatsapp, enabled: e.target.checked } })}
                      className="rounded text-emerald-600"
                    />
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">Número de WhatsApp:</label>
                  <input
                    type="text"
                    placeholder="+51..."
                    value={supportSettings?.whatsapp?.phone || ''}
                    onChange={(e) => updateSupportSettings({ whatsapp: { ...supportSettings.whatsapp, phone: e.target.value } })}
                    className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Editor Modal */}
      {isGameEditorOpen && (
        <GameEditorModal
          gameToEdit={editingGame}
          onClose={() => {
            setIsGameEditorOpen(false);
            setEditingGame(null);
          }}
        />
      )}
    </div>
  );
};
