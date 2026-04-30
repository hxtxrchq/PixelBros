import { Outlet } from 'react-router-dom';
import { useIntranet } from '../context/IntranetContext';

export default function Quotes() {
  const { theme, quotes, quotesLoading, quotesError, loadQuotes } = useIntranet();
  const isDark = theme === 'dark';

  const sent = quotes.filter((item) => item.status === 'Enviada').length;
  const approved = quotes.filter((item) => item.status === 'Aprobada').length;
  const inNegotiation = quotes.filter((item) => item.status === 'En negociación').length;

  return (
    <div className="space-y-6">
      <section className={`rounded-2xl border px-5 py-4 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
        <h2 className={`intranet-heading text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Cotizaciones</h2>
        <p className={`mt-1 text-sm ${isDark ? 'text-white/65' : 'text-slate-600'}`}>
          Gestiona cotizaciones con estados, resumen comercial y acciones rapidas en un solo flujo.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${quotesLoading ? (isDark ? 'bg-[#4f8cff]/20 text-[#9ec0ff]' : 'bg-[#dbeafe] text-[#1d4ed8]') : (isDark ? 'bg-[#35c98f]/18 text-[#9ff0cd]' : 'bg-[#dcfce7] text-[#166534]')}`}>
            {quotesLoading ? 'Sincronizando...' : 'Sincronizado'}
          </span>
          {quotesError ? (
            <button
              type="button"
              onClick={() => {
                void loadQuotes();
              }}
              className="rounded-full border border-[#f5a524]/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#f5a524]"
            >
              Reintentar carga
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <article className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Enviadas</p>
            <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{sent}</p>
          </article>
          <article className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Aprobadas</p>
            <p className="text-xl font-black text-[#35c98f]">{approved}</p>
          </article>
          <article className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${isDark ? 'text-white/55' : 'text-slate-500'}`}>En negociación</p>
            <p className="text-xl font-black text-[#f5a524]">{inNegotiation}</p>
          </article>
        </div>
      </section>

      <Outlet />
    </div>
  );
}
