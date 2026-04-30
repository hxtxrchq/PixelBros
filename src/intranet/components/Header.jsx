import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntranet } from '../context/IntranetContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useIntranet();
  const { user, logout } = useAuth();
  const isDark = theme === 'dark';
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate('/intranet/login');
  };

  const displayName = user?.fullName ?? 'Admin';
  const roleLabel = user?.role === 'GLOBAL_ADMIN' ? 'Administrador Global' : 'Usuario';

  return (
    <header
      className={`sticky top-0 z-20 border-b px-4 py-3 backdrop-blur-xl md:px-7 ${
        isDark ? 'border-white/10 bg-[#0b1025]/85' : 'border-slate-200 bg-white/90'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className={`rounded-md border p-2 lg:hidden ${
              isDark
                ? 'border-white/15 text-white/75 hover:border-white/35 hover:text-white'
                : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900'
            }`}
            aria-label="Abrir menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
              isDark
                ? 'border-white/15 bg-white/[0.05] text-white/80 hover:border-white/30'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            {isDark ? 'Claro' : 'Oscuro'}
          </button>

          <button
            type="button"
            className={`relative rounded-xl border p-2 transition ${
              isDark
                ? 'border-white/10 bg-white/[0.05] text-white/65 hover:border-white/30 hover:text-white'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-800'
            }`}
            aria-label="Notificaciones"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e73c50] px-1 text-[10px] font-bold text-white">3</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className={`group flex items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition ${
                isDark
                  ? 'border-white/10 bg-[#0f1534] hover:border-white/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#e73c50] to-[#b3262e] text-sm font-bold text-white">PB</div>
              <div className="hidden sm:block">
                <p className={`text-sm font-semibold ${isDark ? 'text-white/90' : 'text-slate-800'}`}>{displayName}</p>
                <p className={`text-xs ${isDark ? 'text-white/55' : 'text-slate-500'}`}>{roleLabel}</p>
              </div>
              <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''} ${isDark ? 'text-white/70' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-52 rounded-xl border p-1.5 shadow-xl ${
                  isDark ? 'border-white/10 bg-[#121a3e]' : 'border-slate-200 bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(false)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                    isDark ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Mi perfil
                </button>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(false)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                    isDark ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Configuracion
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                    isDark ? 'text-[#ffb8c3] hover:bg-[#e73c50]/20' : 'text-[#b3262e] hover:bg-[#ffe9ed]'
                  }`}
                >
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
