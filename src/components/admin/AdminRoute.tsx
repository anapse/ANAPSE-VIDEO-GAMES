import React, { useEffect } from 'react';
import { ShieldAlert, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { AuthModal } from '../AuthModal';

export const AdminRoute: React.FC = () => {
  const { loading, currentUser, isStaff, signOut, setShowAuthModal } = useAuth();

  useEffect(() => {
    if (!loading && !currentUser) setShowAuthModal(true);
  }, [loading, currentUser, setShowAuthModal]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
    </div>
  );

  if (!currentUser) return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AuthModal forceOpen />
    </div>
  );

  if (!isStaff) return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center shadow-2xl">
        <ShieldAlert className="w-12 h-12 mx-auto text-amber-400 mb-4" />
        <h1 className="text-xl font-black mb-2">Acceso restringido</h1>
        <p className="text-sm text-slate-400 mb-6">
          Tu cuenta está autenticada, pero no tiene permisos para acceder al panel de administración.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { window.location.href = '/ANAPSE-VIDEO-GAMES/'; }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold">
            Volver al portal
          </button>
          <button onClick={() => void signOut()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );

  return <AdminDashboard />;
};
