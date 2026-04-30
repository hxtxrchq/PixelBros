import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoPixelBros from '../../images/LogoPixelBros.png';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isInitializing } = useAuth();
  const [email, setEmail] = useState('proyectos@pixelbros.pe');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/intranet/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      const destination = location.state?.from?.pathname ?? '/intranet/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message ?? 'No se pudo iniciar sesion');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitializing) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06071a] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#06071a_0%,#090c24_52%,#06071a_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(231,60,80,0.12),transparent_35%,rgba(101,96,184,0.16)_80%)]" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-white/[0.06] p-7 shadow-[0_30px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-9">
        <div className="mb-7 text-center">
          <img src={LogoPixelBros} alt="PixelBros" className="mx-auto h-14 w-auto" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#f38e9b]">Intranet</p>
          <h2 className="mt-1 text-2xl font-extrabold">Acceso interno</h2>
          <p className="mt-2 text-sm text-white/65">Ingresa para continuar al panel administrativo.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white/80">Usuario</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="usuario@pixelbros.pe"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#e73c50]/65 focus:ring-2 focus:ring-[#e73c50]/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-white/80">Contrasena</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#e73c50]/65 focus:ring-2 focus:ring-[#e73c50]/30"
            />
          </div>

          {error ? <p className="text-sm text-[#ff9aaa]">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            {isSubmitting ? 'Ingresando...' : 'Entrar'}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
