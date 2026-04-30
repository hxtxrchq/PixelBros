import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIntranet } from '../context/IntranetContext';

const toMoney = (value) => `S/ ${Number(value || 0).toLocaleString('es-PE')}`;

export default function Reports() {
  const { salesRecords, brands, crmRecords, theme } = useIntranet();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const visibleSalesRecords = useMemo(() => {
    if (user?.role === 'GLOBAL_ADMIN') return salesRecords;

    return salesRecords.filter((record) => {
      if (record.createdById) return record.createdById === user?.id;
      return (record.createdByName || record.responsible || '').toLowerCase() === (user?.fullName || '').toLowerCase();
    });
  }, [salesRecords, user?.id, user?.fullName, user?.role]);

  const salesByService = useMemo(() => {
    const map = {};
    for (const sale of visibleSalesRecords) {
      map[sale.service] = (map[sale.service] || 0) + Number(sale.monthlyAmount || 0);
    }
    return Object.entries(map);
  }, [visibleSalesRecords]);

  const retentionRate = useMemo(() => {
    if (crmRecords.length === 0) return 0;
    const active = crmRecords.filter((c) => c.clientStatus === 'Cliente activo').length;
    return Math.round((active / crmRecords.length) * 100);
  }, [crmRecords]);

  return (
    <div className="space-y-6">
      <section className={`rounded-2xl border p-5 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
        <h2 className={`intranet-heading text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Reportes</h2>
        <p className={`mt-2 text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Analisis comerciales, marketing y de clientes.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
          <p className={`text-xs uppercase tracking-[0.14em] ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Facturacion mensual</p>
          <p className={`mt-1 text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{toMoney(visibleSalesRecords.reduce((a, s) => a + Number(s.monthlyAmount || 0), 0))}</p>
        </article>
        <article className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
          <p className={`text-xs uppercase tracking-[0.14em] ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Cuentas marketing activas</p>
          <p className={`mt-1 text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{brands.length}</p>
        </article>
        <article className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
          <p className={`text-xs uppercase tracking-[0.14em] ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Tasa de retencion</p>
          <p className={`mt-1 text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{retentionRate}%</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className={`rounded-2xl border p-5 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
          <h3 className={`intranet-heading text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Ventas por servicio</h3>
          <ul className="mt-4 space-y-2">
            {salesByService.map(([service, amount]) => (
              <li key={service} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
                <span className={isDark ? 'text-white/75' : 'text-slate-700'}>{service}</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{toMoney(amount)}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={`rounded-2xl border p-5 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
          <h3 className={`intranet-heading text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Clientes nuevos vs perdidos</h3>
          <div className="mt-4 space-y-2 text-sm">
            <p className={`rounded-lg border px-3 py-2 ${isDark ? 'border-white/10 bg-white/[0.03] text-white/80' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>Nuevos: {crmRecords.filter((c) => c.clientStatus !== 'Cliente perdido').length}</p>
            <p className={`rounded-lg border px-3 py-2 ${isDark ? 'border-white/10 bg-white/[0.03] text-white/80' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>Perdidos: {crmRecords.filter((c) => c.clientStatus === 'Cliente perdido').length}</p>
          </div>
        </article>
      </section>
    </div>
  );
}
