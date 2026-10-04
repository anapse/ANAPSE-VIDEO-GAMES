import React from 'react';
import { Shield, ShieldAlert } from 'lucide-react';
import { UserRole } from '../types';

interface UserBadgeProps {
  name: string;
  role?: UserRole | string;
  isOnline?: boolean;
  showOnlineStatus?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Determines if a user is online based on their lastSeen timestamp (threshold: 2 minutes).
 */
export const isUserOnline = (lastSeen?: string): boolean => {
  if (!lastSeen) return false;
  try {
    const lastSeenTime = new Date(lastSeen).getTime();
    if (isNaN(lastSeenTime)) return false;
    const now = Date.now();
    // Active within the last 2 minutes (120,000 ms)
    return now - lastSeenTime < 2 * 60 * 1000;
  } catch {
    return false;
  }
};

export const UserBadge: React.FC<UserBadgeProps> = ({
  name,
  role,
  isOnline,
  showOnlineStatus = false,
  className = '',
  size = 'md',
}) => {
  const isMod = role === 'MODERADOR';
  const isAdmin = role === 'ADMINISTRADOR';

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const textSizes = {
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const tagSizes = {
    sm: 'text-[9px] px-1 py-0.2',
    md: 'text-[10px] px-1.5 py-0.2',
    lg: 'text-[11px] px-2 py-0.5',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold ${textSizes[size]} ${className}`}>
      {/* Online indicator dot if requested */}
      {showOnlineStatus && (
        <span
          className={`inline-block w-2 h-2 rounded-full shrink-0 ${
            isOnline ? 'bg-emerald-400 shadow-xs shadow-emerald-500/50 animate-pulse' : 'bg-slate-500/60'
          }`}
          title={isOnline ? 'En línea' : 'Desconectado'}
        />
      )}

      {/* Insignia a la izquierda */}
      {isMod && (
        <span
          className="inline-flex items-center justify-center p-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0"
          title="Moderador Oficial"
        >
          <Shield className={`${iconSizes[size]} fill-emerald-500/20`} />
        </span>
      )}

      {isAdmin && (
        <span
          className="inline-flex items-center justify-center p-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0"
          title="Administrador"
        >
          <ShieldAlert className={`${iconSizes[size]} fill-amber-500/20`} />
        </span>
      )}

      {/* Nombre de usuario */}
      <span className="truncate">{name}</span>

      {/* Etiqueta Mod o Admin a la derecha */}
      {isMod && (
        <span
          className={`font-black uppercase tracking-wider rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 shrink-0 ${tagSizes[size]}`}
        >
          Mod
        </span>
      )}

      {isAdmin && (
        <span
          className={`font-black uppercase tracking-wider rounded bg-amber-500/20 text-amber-400 border border-amber-500/35 shrink-0 ${tagSizes[size]}`}
        >
          Admin
        </span>
      )}
    </span>
  );
};
