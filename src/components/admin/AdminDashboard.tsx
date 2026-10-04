import React, { useState, useMemo } from 'react';
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
  ShieldAlert,
  Search,
  Sparkles,
  Database,
  ArrowRight,
  Eye,
  EyeOff,
  Bot,
  Save,
  X,
  Flag,
  Check,
  AlertTriangle,
  History,
  FileText,
  UserCheck,
  UserX,
  Filter,
  RefreshCw,
  LayoutDashboard,
} from 'lucide-react';
import { useGameData } from '../../context/GameDataContext';
import { useAuth } from '../../context/AuthContext';
import { Game, GameStatus, Proposal, Category, UserRole, MascotConfig, Report, ModerationLog } from '../../types';
import { GameEditorModal } from './GameEditorModal';
import { SpecSyncViewer } from './SpecSyncViewer';
import { UserBadge, isUserOnline } from '../UserBadge';
import confetti from 'canvas-confetti';

export const AdminDashboard: React.FC = () => {
  const {
    games,
    categories,
    proposals,
    polls,
    comments,
    reports,
    moderationLogs,
    users,
    donations,
    announcements,
    globalAnalytics,
    deleteGame,
    updateGameStatus,
    updateProposalStatus,
    deleteComment,
    hideComment,
    resolveReport,
    changeUserRole,
    addCategory,
    deleteCategory,
    mascotConfig,
    updateMascotConfig,
    supportSettings,
    updateSupportSettings,
  } = useGameData();

  const { profile, isAdmin, isModerator } = useAuth();

  // Tab state (default to 'comentarios' if moderator, 'resumen' if admin)
  const [activeTab, setActiveTab] = useState<string>(isAdmin ? 'resumen' : 'comentarios');

  const [isGameEditorOpen, setIsGameEditorOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [activeDashboardGame, setActiveDashboardGame] = useState<Game | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newMascotMessage, setNewMascotMessage] = useState('');

  // Moderation filter and search states
  const [commentSearch, setCommentSearch] = useState('');
  const [commentFilter, setCommentFilter] = useState<'ALL' | 'VISIBLE' | 'HIDDEN'>('ALL');
  const [reportFilter, setReportFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED' | 'DISMISSED'>('PENDING');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [logActionFilter, setLogActionFilter] = useState<string>('ALL');

  // Confirmation modals
  const [selectedReportAction, setSelectedReportAction] = useState<{
    report: Report;
    action: 'RESOLVE_HIDE' | 'RESOLVE_ONLY' | 'DISMISS';
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const pendingReportsCount = useMemo(
    () => reports.filter((r) => r.status === 'PENDING').length,
    [reports]
  );

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Nav items configuration based on role
  // Desktop: exactly 3 rows for admin (Row 1: 6, Row 2: 6, Row 3: 5)
  const adminNavItems = [
    // Fila 1 (6 botones)
    { id: 'resumen', label: 'Resumen', icon: '📊' },
    { id: 'juegos', label: 'Juegos', icon: '🎮', count: games.length },
    { id: 'propuestas', label: 'Propuestas', icon: '💡', count: proposals.length },
    { id: 'encuestas', label: 'Encuestas', icon: '🗳️', count: polls.length },
    { id: 'comentarios', label: 'Comentarios', icon: '💬', count: comments.length },
    { id: 'reportes', label: 'Denuncias', icon: '🚩', count: pendingReportsCount, alert: pendingReportsCount > 0 },
    // Fila 2 (6 botones)
    { id: 'logs', label: 'Moderación', icon: '📜', count: moderationLogs.length },
    { id: 'usuarios', label: 'Usuarios', icon: '👥', count: users.length },
    { id: 'apoyos', label: 'Apoyos', icon: '❤️', count: donations.length },
    { id: 'analitica', label: 'Analítica', icon: '📈' },
    { id: 'rankings', label: 'Rankings', icon: '🏆' },
    { id: 'categorias', label: 'Categorías', icon: '📁', count: categories.length },
    // Fila 3 (5 botones)
    { id: 'repos', label: 'Repositorios', icon: '🔗' },
    { id: 'firebase', label: 'Firebase', icon: '🔥' },
    { id: 'recursos', label: 'Recursos', icon: '🖼️' },
    { id: 'anuncios', label: 'Anuncios', icon: '📢', count: announcements.length },
    { id: 'config', label: 'Configuración', icon: '⚙️' },
  ];

  const moderatorNavItems = [
    { id: 'comentarios', label: 'Comentarios', icon: '💬', count: comments.length },
    { id: 'reportes', label: 'Denuncias', icon: '🚩', count: pendingReportsCount, alert: pendingReportsCount > 0 },
    { id: 'logs', label: 'Moderación', icon: '📜', count: moderationLogs.length },
    { id: 'usuarios', label: 'Comunidad', icon: '👥', count: users.length },
  ];

  const navItems = isAdmin ? adminNavItems : moderatorNavItems;

  // Filtered comments
  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      const matchesSearch =
        c.content.toLowerCase().includes(commentSearch.toLowerCase()) ||
        c.userName.toLowerCase().includes(commentSearch.toLowerCase()) ||
        (c.targetId && c.targetId.toLowerCase().includes(commentSearch.toLowerCase()));

      const matchesFilter =
        commentFilter === 'ALL'
          ? true
          : commentFilter === 'HIDDEN'
          ? c.hidden === true
          : !c.hidden;

      return matchesSearch && matchesFilter;
    });
  }, [comments, commentSearch, commentFilter]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (reportFilter === 'ALL') return true;
      return r.status === reportFilter;
    });
  }, [reports, reportFilter]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.displayName && u.displayName.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
        u.uid.toLowerCase().includes(userSearch.toLowerCase());

      const matchesRole = userRoleFilter === 'ALL' ? true : u.role === userRoleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return moderationLogs.filter((log) => {
      if (logActionFilter === 'ALL') return true;
      return log.action === logActionFilter;
    });
  }, [moderationLogs, logActionFilter]);

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
    showNotification('Categoría agregada correctamente');
  };

  const handleAddMascotMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMascotMessage.trim()) return;
    updateMascotConfig({
      messages: [...mascotConfig.messages, newMascotMessage.trim()],
    });
    setNewMascotMessage('');
    confetti({ particleCount: 20, spread: 30, origin: { y: 0.7 } });
    showNotification('Frase agregada a la mascota');
  };

  const handleRemoveMascotMessage = (index: number) => {
    const updated = mascotConfig.messages.filter((_, i) => i !== index);
    updateMascotConfig({ messages: updated });
  };

  const handleRoleChange = async (userId: string, newRole: UserRole, userName: string) => {
    try {
      await changeUserRole(userId, newRole);
      showNotification(`Rol de ${userName} actualizado a ${newRole}`);
    } catch (err) {
      showNotification('Error al actualizar el rol', 'error');
    }
  };

  const handleConfirmReportAction = async () => {
    if (!selectedReportAction) return;
    const { report, action } = selectedReportAction;

    try {
      if (action === 'RESOLVE_HIDE') {
        // Hide comment + resolve report
        await hideComment(report.commentId, true, `Ocultado tras resolver denuncia #${report.id}: ${actionNotes || report.reason}`);
        await resolveReport(report.id, 'RESOLVED', actionNotes || `Resuelto: comentario ocultado (${report.reason})`);
        showNotification('Denuncia resuelta y comentario ocultado');
      } else if (action === 'RESOLVE_ONLY') {
        // Just resolve
        await resolveReport(report.id, 'RESOLVED', actionNotes || `Resuelto sin ocultar comentario`);
        showNotification('Denuncia marcada como resuelta');
      } else if (action === 'DISMISS') {
        // Dismiss
        await resolveReport(report.id, 'DISMISSED', actionNotes || `Denuncia descartada: no infringe normas`);
        showNotification('Denuncia descartada');
      }
      setSelectedReportAction(null);
      setActionNotes('');
    } catch (err) {
      showNotification('Error al procesar el reporte', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Status Notification Toast */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold animate-in slide-in-from-bottom duration-300 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/95 border-rose-500/50 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Dashboard Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className={`p-3.5 rounded-2xl border ${
            isAdmin
              ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}>
            {isAdmin ? <ShieldAlert className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Orbitron']">
                {isAdmin ? 'PANEL DE ADMINISTRACIÓN ANAPSE' : 'PANEL DE MODERACIÓN ANAPSE'}
              </h1>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                isAdmin
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                {isAdmin ? 'Superadmin' : 'Moderador Oficial'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAdmin
                ? 'Control integral de catálogo, comunidad, moderadores, specs, Firebase y métricas'
                : 'Gestión activa de la comunidad: moderación de comentarios, resolución de denuncias y auditoría'}
            </p>
          </div>
        </div>

        {isAdmin && (
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
        )}
      </div>

      {/* Main Tabs Navigation (3 rows in desktop via CSS Grid, compact buttons) */}
      <div className={`grid gap-2 border-b border-slate-800 pb-4 ${
        isAdmin
          ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6'
          : 'grid-cols-2 sm:grid-cols-4'
      }`}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-2 sm:p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all relative border ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-lg shadow-cyan-500/25 scale-[1.02]'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-base sm:text-lg leading-none mb-1">{item.icon}</span>
              <span className="text-[11px] sm:text-xs font-bold tracking-tight line-clamp-1 truncate w-full">
                {item.label}
              </span>
              {item.count !== undefined && (
                <span
                  className={`mt-1 text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-slate-950/40 text-slate-950 font-black'
                      : item.alert
                      ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 📊 RESUMEN (Admin only) */}
      {isAdmin && activeTab === 'resumen' && (
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
              <span className="text-xs font-bold text-slate-400 uppercase">Denuncias Pendientes</span>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 font-['Orbitron']">
                {pendingReportsCount}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Apoyos / Donaciones</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-['Orbitron']">
                S/ {globalAnalytics.totalDonations}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-black text-white font-['Orbitron']">Top Juegos Más Jugados</h3>
              <div className="space-y-2">
                {globalAnalytics.topGamesByPlays.length === 0 ? (
                  <p className="text-xs text-slate-500 font-bold p-4 text-center">No hay juegos publicados todavía.</p>
                ) : (
                  globalAnalytics.topGamesByPlays.map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                      <span className="font-bold text-slate-200">#{i + 1} {g.name}</span>
                      <span className="font-mono text-cyan-300 font-bold">{g.count.toLocaleString()} partidas</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-black text-white font-['Orbitron']">Últimas Acciones de Moderación</h3>
              <div className="space-y-2">
                {moderationLogs.slice(0, 5).length === 0 ? (
                  <p className="text-xs text-slate-500 font-bold p-4 text-center">No hay registros de moderación todavía.</p>
                ) : (
                  moderationLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                      <div>
                        <p className="font-bold text-slate-200">
                          <span className="text-emerald-400">{log.moderatorName}</span>: {log.action}
                        </p>
                        {log.reason && <p className="text-[10px] text-slate-400">{log.reason}</p>}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎮 JUEGOS (Admin only) */}
      {isAdmin && activeTab === 'juegos' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-black text-white font-['Orbitron']">
              Catálogo de Juegos ({games.length})
            </h3>
            <button
              onClick={() => {
                setEditingGame(null);
                setIsGameEditorOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Juego</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900">
            {games.length === 0 ? (
              <p className="text-sm text-slate-500 font-bold p-12 text-center">No hay juegos registrados.</p>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Juego</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-center">Dashboard</th>
                    <th className="p-4 text-center">Partidas</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {games.map((g) => (
                    <tr key={g.id || g.gameId} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={g.mainImage}
                          alt={g.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{g.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {g.gameId}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-bold">
                          {g.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={g.status}
                          onChange={(e) => updateGameStatus(g.gameId, e.target.value as GameStatus)}
                          className="p-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-500"
                        >
                          <option value="PUBLICADO">PUBLICADO</option>
                          <option value="BETA">BETA</option>
                          <option value="EN CREACIÓN">EN CREACIÓN</option>
                          <option value="EN REPARACIÓN">EN REPARACIÓN</option>
                          <option value="EN PROMOCIÓN">EN PROMOCIÓN</option>
                          <option value="PRÓXIMAMENTE">PRÓXIMAMENTE</option>
                          <option value="ARCHIVADO">ARCHIVADO</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setActiveDashboardGame(g)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                          title={`Abrir Dashboard de ${g.name}`}
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>Dashboard</span>
                        </button>
                      </td>
                      <td className="p-4 text-center font-mono text-cyan-300 font-bold">{g.playsCount || 0}</td>
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingGame(g);
                            setIsGameEditorOpen(true);
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                          title="Editar Juego"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar ${g.name}? Esta acción no se puede deshacer.`)) {
                              deleteGame(g.gameId);
                              showNotification(`Juego ${g.name} eliminado`);
                            }
                          }}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Eliminar Juego"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 💬 COMENTARIOS (Moderator & Admin) */}
      {activeTab === 'comentarios' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white font-['Orbitron'] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>Moderación de Comentarios ({comments.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Filtra, oculta o elimina comentarios inapropiados en tiempo real.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={commentSearch}
                  onChange={(e) => setCommentSearch(e.target.value)}
                  placeholder="Buscar texto o autor..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 w-44"
                />
              </div>

              <select
                value={commentFilter}
                onChange={(e) => setCommentFilter(e.target.value as any)}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-bold focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Todos los estados</option>
                <option value="VISIBLE">Solo Visibles</option>
                <option value="HIDDEN">Ocultos por Moderación</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredComments.length === 0 ? (
              <p className="text-sm text-slate-500 font-bold p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
                No se encontraron comentarios con los filtros actuales.
              </p>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    comment.hidden
                      ? 'bg-amber-950/20 border-amber-500/40 text-slate-300'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <UserBadge
                        name={comment.userName}
                        role={comment.userRole}
                        size="sm"
                        className="text-white"
                      />
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-slate-800 text-slate-300">
                        {comment.targetType || 'comunidad'} : {comment.targetId || 'general'}
                      </span>

                      {comment.hidden && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          <span>Oculto {comment.moderatedBy ? `por ${comment.moderatedBy}` : ''}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed break-words whitespace-pre-line bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      "{comment.content}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start pt-1 sm:pt-0">
                    <button
                      onClick={async () => {
                        await hideComment(comment.id, !comment.hidden);
                        showNotification(comment.hidden ? 'Comentario restaurado' : 'Comentario ocultado');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        comment.hidden
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {comment.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{comment.hidden ? 'Restaurar' : 'Ocultar'}</span>
                    </button>

                    <button
                      onClick={async () => {
                        if (confirm('¿Eliminar definitivamente este comentario de la base de datos?')) {
                          await deleteComment(comment.id, 'Eliminado por moderación');
                          showNotification('Comentario eliminado');
                        }
                      }}
                      className="p-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30"
                      title="Eliminar definitivamente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 🚩 DENUNCIAS & REPORTES (Moderator & Admin) */}
      {activeTab === 'reportes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white font-['Orbitron'] flex items-center gap-2">
                <Flag className="w-5 h-5 text-amber-400" />
                <span>Denuncias y Reportes de la Comunidad ({reports.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Revisa los comentarios denunciados por los jugadores y toma acciones directas.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2 text-xs">
              <select
                value={reportFilter}
                onChange={(e) => setReportFilter(e.target.value as any)}
                className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="PENDING">Pendientes ({pendingReportsCount})</option>
                <option value="ALL">Todas las Denuncias</option>
                <option value="RESOLVED">Resueltas</option>
                <option value="DISMISSED">Descartadas</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <p className="text-sm text-slate-500 font-bold p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
                No hay denuncias con el estado seleccionado.
              </p>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {report.reason}
                      </span>
                      <span className="text-xs text-slate-400">
                        Denunciado por <strong className="text-white">{report.reporterName}</strong>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      {report.status === 'PENDING' && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
                          Pendiente de revisión
                        </span>
                      )}
                      {report.status === 'RESOLVED' && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Resuelto {report.resolvedBy ? `por ${report.resolvedBy}` : ''}
                        </span>
                      )}
                      {report.status === 'DISMISSED' && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          Descartado {report.resolvedBy ? `por ${report.resolvedBy}` : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">
                      Comentario denunciado (Autor: <span className="text-amber-400">{report.commentAuthorName}</span>):
                    </p>
                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      "{report.commentContent}"
                    </p>
                  </div>

                  {report.details && (
                    <p className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
                      <strong className="text-slate-300">Nota del denunciante:</strong> {report.details}
                    </p>
                  )}

                  {report.status === 'PENDING' && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => setSelectedReportAction({ report, action: 'DISMISS' })}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                      >
                        Descartar Denuncia
                      </button>
                      <button
                        onClick={() => setSelectedReportAction({ report, action: 'RESOLVE_ONLY' })}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold"
                      >
                        Marcar Resuelto
                      </button>
                      <button
                        onClick={() => setSelectedReportAction({ report, action: 'RESOLVE_HIDE' })}
                        className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black font-['Orbitron'] shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Resolver y Ocultar Comentario</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 📜 HISTORIAL DE MODERACIÓN (Moderator & Admin) */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white font-['Orbitron'] flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <span>Registro de Auditoría de Moderación ({moderationLogs.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Historial transparente de todas las acciones ejecutadas por moderadores y administradores.
              </p>
            </div>

            <select
              value={logActionFilter}
              onChange={(e) => setLogActionFilter(e.target.value)}
              className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Todas las acciones</option>
              <option value="HIDDEN">Comentarios Ocultados</option>
              <option value="RESTORED">Comentarios Restaurados</option>
              <option value="DELETED">Comentarios Eliminados</option>
              <option value="RESOLVED_REPORT">Reportes Resueltos</option>
              <option value="DISMISSED_REPORT">Reportes Descartados</option>
              <option value="ROLE_CHANGED">Cambios de Rol</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900">
            {filteredLogs.length === 0 ? (
              <p className="text-sm text-slate-500 font-bold p-12 text-center">
                No hay registros de auditoría disponibles con el filtro seleccionado.
              </p>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Fecha / Hora</th>
                    <th className="p-4">Moderador</th>
                    <th className="p-4">Acción</th>
                    <th className="p-4">Motivo / Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {log.moderatorName}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          log.action === 'HIDDEN'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : log.action === 'RESTORED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : log.action === 'DELETED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : log.action === 'ROLE_CHANGED'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {log.reason || 'Sin detalles adicionales'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 👥 USUARIOS & ROLES (Admin & Moderator view) */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white font-['Orbitron'] flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>{isAdmin ? 'Gestión de Usuarios y Roles' : 'Directorio de Jugadores de la Comunidad'} ({users.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isAdmin
                  ? 'Asigna o revoca el rol de MODERADOR o ADMINISTRADOR a los usuarios registrados.'
                  : 'Directorio de usuarios registrados y estado de conexión en la plataforma.'}
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Buscar usuario o email..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 w-48"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-bold focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Todos los roles</option>
                <option value="ADMINISTRADOR">Administradores</option>
                <option value="MODERADOR">Moderadores</option>
                <option value="USUARIO">Usuarios regulares</option>
              </select>
            </div>
          </div>

          {/* Quick stats badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Jugadores</span>
              <p className="text-xl font-black text-white font-['Orbitron']">{users.length}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Moderadores Activos</span>
              <p className="text-xl font-black text-emerald-400 font-['Orbitron']">
                {users.filter((u) => u.role === 'MODERADOR').length}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Administradores</span>
              <p className="text-xl font-black text-amber-400 font-['Orbitron']">
                {users.filter((u) => u.role === 'ADMINISTRADOR').length}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">En Línea Ahora</span>
              <p className="text-xl font-black text-cyan-400 font-['Orbitron']">
                {users.filter((u) => isUserOnline(u.lastSeen)).length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900">
            {filteredUsers.length === 0 ? (
              <p className="text-sm text-slate-500 font-bold p-12 text-center">No se encontraron usuarios.</p>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Usuario</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Rol Asignado</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Registro</th>
                    {isAdmin && <th className="p-4 text-right">Asignar Rol</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredUsers.map((u) => {
                    const online = isUserOnline(u.lastSeen);
                    return (
                      <tr key={u.uid} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`}
                            alt={u.displayName}
                            className="w-9 h-9 rounded-xl object-cover bg-slate-950 border border-slate-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{u.displayName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">UID: {u.uid.substring(0, 8)}...</p>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-[11px]">
                          {u.email || 'Sin email público'}
                        </td>
                        <td className="p-4">
                          <UserBadge name="" role={u.role} size="md" />
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              online
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                            {online ? 'En Línea' : 'Desconectado'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                        </td>

                        {isAdmin && (
                          <td className="p-4 text-right">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole, u.displayName)}
                              className={`p-1.5 rounded-xl text-xs font-bold border focus:outline-none ${
                                u.role === 'ADMINISTRADOR'
                                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                                  : u.role === 'MODERADOR'
                                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                                  : 'bg-slate-950 border-slate-800 text-slate-300'
                              }`}
                            >
                              <option value="USUARIO">👤 USUARIO</option>
                              <option value="MODERADOR">🛡️ MODERADOR</option>
                              <option value="ADMINISTRADOR">👑 ADMINISTRADOR</option>
                            </select>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 💡 PROPUESTAS (Admin only) */}
      {isAdmin && activeTab === 'propuestas' && (
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white font-['Orbitron']">Propuestas de la Comunidad ({proposals.length})</h3>
          {proposals.length === 0 ? (
            <p className="text-sm text-slate-500 font-bold p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">No hay propuestas todavía.</p>
          ) : (
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
                        onClick={() => {
                          updateProposalStatus(p.id, 'APPROVED');
                          showNotification('Propuesta aprobada');
                        }}
                        className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold rounded-lg"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => {
                          updateProposalStatus(p.id, 'IN_DEVELOPMENT');
                          showNotification('Propuesta pasada a Creación');
                        }}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold rounded-lg"
                      >
                        A Creación
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🗳️ ENCUESTAS (Admin only) */}
      {isAdmin && activeTab === 'encuestas' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-base font-black text-white font-['Orbitron']">Encuestas activas de la comunidad ({polls.length})</h3>
          {polls.length === 0 ? (
            <p className="text-slate-500 font-bold p-8 text-center">No hay encuestas todavía.</p>
          ) : (
            <div className="space-y-3">
              {polls.map((poll) => (
                <div key={poll.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="font-bold text-slate-200">{poll.question}</p>
                  {poll.description && <p className="text-[11px] text-slate-400">{poll.description}</p>}
                  <div className="text-[10px] text-cyan-400 font-bold">{poll.totalVotes} votos totales</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ❤️ APOYOS (Admin only) */}
      {isAdmin && activeTab === 'apoyos' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-base font-black text-white font-['Orbitron']">Apoyos & Donaciones ({donations.length})</h3>
          {donations.length === 0 ? (
            <p className="text-slate-500 font-bold p-8 text-center">No hay apoyos todavía.</p>
          ) : (
            <div className="space-y-2">
              {donations.map((don) => (
                <div key={don.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-200">{don.userName} apoyó al juego <span className="text-amber-400">"{don.gameName}"</span></p>
                    {don.message && <p className="text-[11px] text-slate-400">"{don.message}"</p>}
                  </div>
                  <span className="font-mono font-black text-rose-400 text-sm">S/ {don.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 📈 ANALÍTICA (Admin only) */}
      {isAdmin && activeTab === 'analitica' && (
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

      {/* 🏆 RANKINGS (Admin only) */}
      {isAdmin && activeTab === 'rankings' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-base font-black text-white font-['Orbitron']">Clasificaciones & Rankings Globales</h3>
          <p className="text-slate-400">Las clasificaciones se consultan dinámicamente desde la base de datos Firestore configurada para cada juego.</p>
          <p className="text-cyan-400 font-bold font-mono">🟢 Los rankings globales se sincronizan individualmente en el portal de cada juego.</p>
        </div>
      )}

      {/* 📁 CATEGORÍAS (Admin only) */}
      {isAdmin && activeTab === 'categorias' && (
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
                    onClick={() => {
                      deleteCategory(c.id);
                      showNotification('Categoría eliminada');
                    }}
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

      {/* 🔗 REPOSITORIOS (Admin only) */}
      {isAdmin && activeTab === 'repos' && <SpecSyncViewer />}

      {/* 🔥 FIREBASE (Admin only) */}
      {isAdmin && activeTab === 'firebase' && (
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
            <p className="text-slate-300">🛡️ Reglas de Seguridad: Desplegadas (Roles ABAC: Usuario, Moderador, Administrador)</p>
          </div>
        </div>
      )}

      {/* 🖼️ RECURSOS (Admin only) */}
      {isAdmin && activeTab === 'recursos' && (
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

      {/* 📢 ANUNCIOS (Admin only) */}
      {isAdmin && activeTab === 'anuncios' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-base font-black text-white font-['Orbitron']">Anuncios de la Plataforma ({announcements.length})</h3>
          {announcements.length === 0 ? (
            <p className="text-slate-500 font-bold p-8 text-center">No hay anuncios todavía.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <p className="font-bold text-white">{ann.title}</p>
                  <p className="text-slate-300">{ann.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ⚙️ CONFIGURACIÓN (Admin only) */}
      {isAdmin && activeTab === 'config' && (
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
            </div>

            {/* Speech Messages Pool */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">Frases & Mensajes Configurables</h4>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {mascotConfig.messages.map((msg, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 text-[11px] text-slate-300 border border-slate-850">
                      <span className="truncate pr-2">{msg}</span>
                      <button
                        onClick={() => handleRemoveMascotMessage(i)}
                        className="text-rose-400 hover:text-rose-300 p-1"
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
                  placeholder="Nueva frase para la mascota..."
                  className="flex-1 p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
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
        </div>
      )}

      {/* Modal for Report Actions */}
      {selectedReportAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-black text-white font-['Orbitron'] flex items-center gap-2">
                <Flag className="w-4 h-4 text-amber-400" />
                <span>
                  {selectedReportAction.action === 'RESOLVE_HIDE' && 'Resolver y Ocultar Comentario'}
                  {selectedReportAction.action === 'RESOLVE_ONLY' && 'Marcar Denuncia como Resuelta'}
                  {selectedReportAction.action === 'DISMISS' && 'Descartar Denuncia'}
                </span>
              </h4>
              <button
                onClick={() => setSelectedReportAction(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Comentario:</p>
                <p className="text-slate-200 italic">"{selectedReportAction.report.commentContent}"</p>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300">
                  Nota / Justificación de la acción (opcional):
                </label>
                <input
                  type="text"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Ej: Contenido inapropiado confirmado..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedReportAction(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReportAction}
                className={`px-5 py-2 rounded-xl text-white text-xs font-black font-['Orbitron'] ${
                  selectedReportAction.action === 'RESOLVE_HIDE'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : selectedReportAction.action === 'RESOLVE_ONLY'
                    ? 'bg-cyan-600 hover:bg-cyan-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                Confirmar Acción
              </button>
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

      {/* Game Dashboard Modal (Iframe / Fullscreen Viewer with Native Scroll) */}
      {activeDashboardGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-[95vw] max-w-[1400px] h-[92vh] max-h-[92vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header Fijo */}
            <header className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b border-slate-800 bg-slate-950 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="p-2 sm:p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
                  <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-white font-['Orbitron'] flex items-center gap-2 truncate">
                    <span>DASHBOARD — {activeDashboardGame.name}</span>
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate max-w-xl">
                    ID: {activeDashboardGame.gameId} {activeDashboardGame.dashboardUrl && `· ${activeDashboardGame.dashboardUrl}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveDashboardGame(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 ml-2"
                title="Cerrar (✕)"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Modal Body: Área del iframe con flex-1 y min-h-0 para permitir scroll interno completo */}
            <main className="flex-1 min-h-0 w-full bg-slate-950 relative">
              {activeDashboardGame.dashboardUrl ? (
                <iframe
                  src={activeDashboardGame.dashboardUrl}
                  title={`Dashboard de ${activeDashboardGame.name}`}
                  className="w-full h-full border-0 block"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <LayoutDashboard className="w-8 h-8 opacity-80" />
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <h4 className="text-base font-bold text-white font-['Orbitron']">
                      📊 Dashboard no configurado
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Este juego todavía no tiene una URL de dashboard asignada. Puedes agregarla editando las propiedades del juego en el catálogo.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const target = activeDashboardGame;
                        setActiveDashboardGame(null);
                        setEditingGame(target);
                        setIsGameEditorOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar Juego</span>
                    </button>
                    <button
                      onClick={() => setActiveDashboardGame(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </main>

            {/* Modal Footer Fijo */}
            <footer className="flex items-center justify-between p-3 sm:p-4 border-t border-slate-800 bg-slate-950 shrink-0 text-xs">
              {activeDashboardGame.dashboardUrl ? (
                <a
                  href={activeDashboardGame.dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1.5 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>↗ Abrir en nueva pestaña</span>
                </a>
              ) : (
                <span className="text-slate-500 text-[11px]">URL no configurada</span>
              )}

              <button
                onClick={() => setActiveDashboardGame(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
              >
                Cerrar
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
