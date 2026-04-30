import { useMemo, useState } from 'react';
import { useIntranet } from '../context/IntranetContext';
import { viewQuoteVoucher } from '../services/quoteVoucher';

const statuses = ['Todas', 'Enviada', 'Aprobada', 'Rechazada', 'En negociación'];
const toMoney = (value) => `S/ ${Number(value || 0).toLocaleString('es-PE')}`;
const toDateTime = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value ?? '');
  }

  return parsed.toLocaleString('es-PE');
};

export default function QuotesList() {
  const { quotes, updateQuoteStatus, deleteQuote, quotesLoading, quotesError, theme } = useIntranet();
  const isDark = theme === 'dark';

  const [statusFilter, setStatusFilter] = useState('Todas');
  const [search, setSearch] = useState('');
  const [pendingActionId, setPendingActionId] = useState('');
  const [actionError, setActionError] = useState('');

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesStatus = statusFilter === 'Todas' || quote.status === statusFilter;
      const needle = search.trim().toLowerCase();
      const matchesSearch =
        !needle ||
        quote.client.toLowerCase().includes(needle) ||
        quote.company.toLowerCase().includes(needle) ||
        (quote.detail || quote.serviceType).toLowerCase().includes(needle);
      return matchesStatus && matchesSearch;
    });
  }, [quotes, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: quotes.length,
      sent: quotes.filter((item) => item.status === 'Enviada').length,
      approved: quotes.filter((item) => item.status === 'Aprobada').length,
      rejected: quotes.filter((item) => item.status === 'Rechazada').length,
    }),
    [quotes],
  );

  return (
    <section className={`rounded-2xl border p-4 md:p-5 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Lista de cotizaciones</h3>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className={`rounded-full px-2.5 py-1 ${isDark ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'}`}>Total: {stats.total}</span>
          <span className="rounded-full bg-[#4f8cff]/20 px-2.5 py-1 text-[#9ec0ff]">Enviadas: {stats.sent}</span>
          <span className="rounded-full bg-[#35c98f]/20 px-2.5 py-1 text-[#90f0cb]">Aprobadas: {stats.approved}</span>
          <span className="rounded-full bg-[#e73c50]/20 px-2.5 py-1 text-[#ffb1bc]">Rechazadas: {stats.rejected}</span>
        </div>
      </div>

      {quotesError ? (
        <p className={`mb-4 rounded-xl border px-3 py-2 text-sm ${isDark ? 'border-[#e73c50]/45 bg-[#e73c50]/10 text-[#ffd6dc]' : 'border-[#f8b4bd] bg-[#fff1f3] text-[#8b1a2b]'}`}>
          {quotesError}
        </p>
      ) : null}

      {actionError ? (
        <p className={`mb-4 rounded-xl border px-3 py-2 text-sm ${isDark ? 'border-[#f5a524]/45 bg-[#f5a524]/10 text-[#ffe3b2]' : 'border-[#f9d394] bg-[#fff9eb] text-[#92400e]'}`}>
          {actionError}
        </p>
      ) : null}

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por cliente, empresa o servicio"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none md:col-span-2"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {quotesLoading ? (
        <p className={`rounded-xl border border-dashed px-4 py-6 text-center text-sm ${isDark ? 'border-white/20 text-white/70' : 'border-slate-300 text-slate-500'}`}>
          Cargando cotizaciones...
        </p>
      ) : filteredQuotes.length === 0 ? (
        <p className={`rounded-xl border border-dashed px-4 py-6 text-center text-sm ${isDark ? 'border-white/20 text-white/60' : 'border-slate-300 text-slate-500'}`}>
          No hay cotizaciones que coincidan con los filtros.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredQuotes.map((quote) => (
            <article
              key={quote.id}
              className={`rounded-2xl border p-4 shadow-[0_10px_25px_rgba(0,0,0,0.14)] ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{quote.client}</h4>
                  <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{quote.company}</p>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-white/45' : 'text-slate-400'}`}>{quote.quoteNumber}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                    quote.status === 'Aprobada'
                      ? 'bg-[#35c98f]/20 text-[#90f0cb]'
                      : quote.status === 'Rechazada'
                        ? 'bg-[#e73c50]/20 text-[#ffb1bc]'
                        : quote.status === 'En negociación'
                          ? 'bg-[#f5a524]/20 text-[#ffd38f]'
                          : 'bg-[#4f8cff]/20 text-[#9ec0ff]'
                  }`}
                >
                  {quote.status}
                </span>
              </div>

              <div className="space-y-1.5 text-sm">
                <p className={isDark ? 'text-white/80' : 'text-slate-700'}>
                  <span className={isDark ? 'text-white/55' : 'text-slate-500'}>Servicio:</span> {quote.detail || quote.serviceType}
                </p>
                <p className={isDark ? 'text-white/80' : 'text-slate-700'}>
                  <span className={isDark ? 'text-white/55' : 'text-slate-500'}>Duracion:</span> {quote.duration}
                </p>
                <p className={isDark ? 'text-white/80' : 'text-slate-700'}>
                  <span className={isDark ? 'text-white/55' : 'text-slate-500'}>Monto:</span>{' '}
                  <span className="font-black text-[#d33147]">{toMoney(quote.finalPrice)}</span>
                </p>
                <p className={isDark ? 'text-white/65' : 'text-slate-500'}>{toDateTime(quote.createdAt)}</p>
              </div>

              <div className="mt-4 space-y-2">
                <select
                  value={quote.status}
                  disabled={pendingActionId === quote.id}
                  onChange={async (event) => {
                    setActionError('');
                    setPendingActionId(quote.id);
                    try {
                      await updateQuoteStatus(quote.id, event.target.value);
                    } catch (error) {
                      setActionError(error instanceof Error ? error.message : 'No se pudo actualizar el estado.');
                    } finally {
                      setPendingActionId('');
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none"
                >
                  {statuses.filter((item) => item !== 'Todas').map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      viewQuoteVoucher(quote);
                    } catch (error) {
                      setActionError(error instanceof Error ? error.message : 'No se pudo abrir el voucher.');
                    }
                  }}
                  className="w-full rounded-lg border border-[#4f8cff]/45 px-2 py-1.5 text-xs font-bold text-[#1d4ed8] transition hover:bg-[#eff6ff]"
                >
                  Ver cotización
                </button>

                <button
                  type="button"
                  disabled={pendingActionId === quote.id}
                  onClick={async () => {
                    setActionError('');
                    setPendingActionId(quote.id);
                    try {
                      await deleteQuote(quote.id);
                    } catch (error) {
                      setActionError(error instanceof Error ? error.message : 'No se pudo eliminar la cotizacion.');
                    } finally {
                      setPendingActionId('');
                    }
                  }}
                  className="w-full rounded-lg border border-[#e73c50]/45 px-2 py-1.5 text-xs font-bold text-[#d12d43] transition hover:bg-[#ffeef1]"
                >
                  {pendingActionId === quote.id ? 'Procesando...' : 'Eliminar cotizacion'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
