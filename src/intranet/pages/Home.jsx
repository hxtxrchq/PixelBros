import { useMemo, useState } from 'react';
import { useIntranet } from '../context/IntranetContext';

const paymentStyles = {
  Pagado: 'bg-[#35c98f]/20 text-[#90f0cb]',
  Pendiente: 'bg-[#f5a524]/20 text-[#ffd38f]',
  'Vence pronto': 'bg-[#e73c50]/20 text-[#ff9aa6]',
};

const toMoney = (value) => `S/ ${Number(value || 0).toLocaleString('es-PE')}`;

export default function Home() {
  const { metrics, brands, quotes, crmRecords, salesRecords, pipelineDeals, theme } = useIntranet();
  const isDark = theme === 'dark';
  const [periodView, setPeriodView] = useState('Mensual');
  const [showOnlyCriticalAlerts, setShowOnlyCriticalAlerts] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('Todos');

  const sectionClass = isDark
    ? 'rounded-3xl border border-white/10 bg-[#0f1535]/78 shadow-[0_12px_30px_rgba(2,6,23,0.5)]'
    : 'rounded-3xl border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.08)]';

  const kpiCardClass = isDark
    ? 'group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111943] p-5 shadow-[0_10px_24px_rgba(2,6,23,0.45)] transition-all duration-300 hover:border-[#e73c50]/45'
    : 'group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.08)] transition-all duration-300 hover:border-[#e73c50]/35';

  const kpis = [
    { label: 'Facturacion total del mes', value: toMoney(metrics.monthlyBilling), tone: 'from-[#e73c50]/30 to-transparent' },
    {
      label: 'Meta mensual vs facturacion actual',
      value: `${Math.round((metrics.monthlyBilling / metrics.monthlyTarget) * 100)}% de ${toMoney(metrics.monthlyTarget)}`,
      tone: 'from-[#4f8cff]/25 to-transparent',
    },
    { label: 'Proyeccion de cierre del mes', value: toMoney(metrics.projectedClose), tone: 'from-[#35c98f]/25 to-transparent' },
    { label: 'Total de clientes activos', value: String(metrics.activeClients), tone: 'from-[#8a7dff]/25 to-transparent' },
    { label: 'Total de prospectos en proceso', value: String(metrics.prospects), tone: 'from-[#f5a524]/25 to-transparent' },
    { label: 'Cotizaciones enviadas del mes', value: String(metrics.quotesSent), tone: 'from-[#42c1d1]/25 to-transparent' },
  ];

  const funnelValues = useMemo(() => {
    return metrics.stageOrder.map((stage) => ({
      stage,
      count: pipelineDeals.filter((deal) => deal.stage === stage).length,
    }));
  }, [metrics.stageOrder, pipelineDeals]);

  const alerts = [
    {
      label: 'Clientes pendientes de pago',
      value: salesRecords.filter((s) => s.billingStatus === 'Pendiente').length,
      color: 'text-[#ffd38f]',
    },
    {
      label: 'Contratos por vencer',
      value: brands.filter((b) => b.endDate && b.endDate <= '2026-06-30').length,
      color: 'text-[#ff9aa6]',
    },
    {
      label: 'Cotizaciones pendientes de respuesta',
      value: quotes.filter((q) => q.status === 'Enviada').length,
      color: 'text-[#8fb3ff]',
    },
    {
      label: 'Prospectos sin seguimiento',
      value: crmRecords.filter((c) => c.clientStatus === 'Prospecto').length,
      color: 'text-[#c5bcff]',
    },
  ];

  const visibleAlerts = useMemo(() => {
    if (!showOnlyCriticalAlerts) return alerts;
    return alerts.filter((item) => item.value > 0);
  }, [alerts, showOnlyCriticalAlerts]);

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const needle = brandSearch.trim().toLowerCase();
      const matchesSearch =
        !needle ||
        brand.brandName.toLowerCase().includes(needle) ||
        brand.clientManager.toLowerCase().includes(needle) ||
        brand.servicesActive.toLowerCase().includes(needle);

      const matchesPayment = paymentFilter === 'Todos' || brand.paymentStatus === paymentFilter;
      return matchesSearch && matchesPayment;
    });
  }, [brands, brandSearch, paymentFilter]);

  return (
    <div className="space-y-6">
      <section className={`relative overflow-hidden rounded-3xl border p-6 md:p-7 ${isDark ? 'border-white/10 bg-[#111943]' : 'border-slate-200 bg-gradient-to-r from-white via-[#f7f8ff] to-[#eef1ff]'}`}>
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_15%_20%,rgba(231,60,80,0.20),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(90,179,229,0.18),transparent_34%)]' : 'bg-[radial-gradient(circle_at_15%_20%,rgba(231,60,80,0.10),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(90,179,229,0.10),transparent_34%)]'}`} />
        <div className="relative">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#d64d62]">Dashboard general</p>
          <h3 className={`intranet-heading mt-2 text-3xl font-black leading-tight md:text-4xl ${isDark ? 'text-white' : 'text-[#111827]'}`}>Vista de operacion comercial del mes</h3>
          <p className={`mt-2 max-w-3xl text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Monitorea facturacion, kanban, cotizaciones, alertas y cuentas activas de la agencia en una sola pantalla.</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {['Mensual', 'Trimestral', 'Anual'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setPeriodView(period)}
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] transition ${
                  periodView === period
                    ? 'bg-[#e73c50] text-white'
                    : isDark
                      ? 'bg-white/10 text-white/70 hover:bg-white/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => (
          <article key={kpi.label} className={kpiCardClass}>
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${kpi.tone} ${isDark ? 'opacity-65' : 'opacity-90'}`} />
            <p className={`relative text-xs font-bold uppercase tracking-[0.14em] ${isDark ? 'text-white/70' : 'text-slate-600'}`}>{kpi.label}</p>
            <p className={`relative mt-2 text-3xl font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>{kpi.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <article className={`${sectionClass} p-5 md:p-6`}>
          <h4 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Facturacion mensual (mock)</h4>
          <div className="mt-5 h-64">
            <svg width="100%" height="100%" viewBox="0 0 620 260" role="img" aria-label="Facturacion mensual">
              <g stroke={isDark ? 'rgba(255,255,255,0.16)' : 'rgba(15,23,42,0.14)'}>
                <line x1="40" y1="30" x2="40" y2="220" />
                <line x1="40" y1="220" x2="600" y2="220" />
              </g>
              <g fill="#e73c50">
                <rect x="80" y="130" width="42" height="90" rx="6" />
                <rect x="155" y="95" width="42" height="125" rx="6" />
                <rect x="230" y="70" width="42" height="150" rx="6" />
                <rect x="305" y="110" width="42" height="110" rx="6" />
                <rect x="380" y="82" width="42" height="138" rx="6" />
                <rect x="455" y="58" width="42" height="162" rx="6" />
                <rect x="530" y="76" width="42" height="144" rx="6" />
              </g>
            </svg>
          </div>
        </article>

        <article className="space-y-6">
          <div className={`${sectionClass} p-5`}>
            <h4 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Estado de ventas del kanban</h4>
            <div className="mt-4 space-y-3">
              {funnelValues.map((item) => (
                <div key={item.stage}>
                  <div className={`mb-1 flex items-center justify-between text-xs font-semibold ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                    <span>{item.stage}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className={`h-2 rounded-full ${isDark ? 'bg-white/15' : 'bg-slate-200'}`}>
                    <div className="h-2 rounded-full bg-gradient-to-r from-[#e73c50] to-[#8a7dff]" style={{ width: `${Math.min(item.count * 18, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${sectionClass} p-5`}>
            <h4 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Alertas rapidas</h4>
            <ul className="mt-4 space-y-2">
              {visibleAlerts.map((alert) => (
                <li key={alert.label} className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50'}`}>
                  <span className={`text-sm ${isDark ? 'text-white/75' : 'text-slate-600'}`}>{alert.label}</span>
                  <span className={`text-sm font-bold ${alert.color}`}>{alert.value}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowOnlyCriticalAlerts((prev) => !prev)}
              className="mt-3 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-bold text-white/80"
            >
              {showOnlyCriticalAlerts ? 'Ver todas las alertas' : 'Ver solo alertas con pendientes'}
            </button>
          </div>
        </article>
      </section>

      <section className={`${sectionClass} overflow-hidden`}>
        <div className={`border-b px-5 py-4 md:px-6 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Resumen rapido de marcas</h4>
            <div className="flex flex-wrap gap-2">
              <input
                value={brandSearch}
                onChange={(event) => setBrandSearch(event.target.value)}
                placeholder="Buscar marca o ejecutiva"
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
              />
              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900"
              >
                <option value="Todos">Todos</option>
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Vence pronto">Vence pronto</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className={`${isDark ? 'bg-white/[0.05] text-white/60' : 'bg-slate-50 text-slate-500'} text-xs uppercase tracking-[0.16em]`}>
              <tr>
                <th className="px-5 py-3 md:px-6">Marca</th>
                <th className="px-5 py-3 md:px-6">Servicio</th>
                <th className="px-5 py-3 md:px-6">Facturacion mensual</th>
                <th className="px-5 py-3 md:px-6">Estado pago</th>
                <th className="px-5 py-3 md:px-6">Ejecutiva</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/10' : 'divide-slate-200'}`}>
              {filteredBrands.map((row) => (
                <tr key={row.id} className={isDark ? 'text-white/85' : 'text-slate-700'}>
                  <td className="px-5 py-3 font-semibold md:px-6">{row.brandName}</td>
                  <td className="px-5 py-3 md:px-6">{row.servicesActive}</td>
                  <td className="px-5 py-3 md:px-6">{toMoney(row.monthlyAmount)}</td>
                  <td className="px-5 py-3 md:px-6">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${paymentStyles[row.paymentStatus] || 'bg-white/10 text-white/70'}`}>
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 md:px-6">{row.clientManager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
