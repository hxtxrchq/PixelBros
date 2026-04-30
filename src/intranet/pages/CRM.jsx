import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useIntranet } from '../context/IntranetContext';

export default function CRM() {
  const { crmRecords, theme } = useIntranet();
  const isDark = theme === 'dark';

  const activeCount = useMemo(
    () => crmRecords.filter((item) => item.clientStatus === 'Cliente activo').length,
    [crmRecords],
  );

  const prospectCount = useMemo(
    () => crmRecords.filter((item) => item.clientStatus === 'Prospecto').length,
    [crmRecords],
  );

  return (
    <div className="space-y-6">
      <section className={`rounded-2xl border p-5 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
        <p className={`text-[11px] font-black uppercase tracking-[0.24em] ${isDark ? 'text-[#ff9eac]' : 'text-[#c93246]'}`}>CRM</p>
        <h2 className={`intranet-heading mt-2 text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Base de datos de clientes y prospectos</h2>
        <p className={`mt-2 text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Agregar cliente y lista CRM estan disponibles debajo de CRM en el menu lateral.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
          <p className={`text-xs uppercase tracking-[0.16em] ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Registros</p>
          <p className={`mt-1 text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{crmRecords.length}</p>
        </article>
        <article className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
          <p className={`text-xs uppercase tracking-[0.16em] ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Clientes activos</p>
          <p className="mt-1 text-3xl font-black text-[#90f0cb]">{activeCount}</p>
        </article>
        <article className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
          <p className={`text-xs uppercase tracking-[0.16em] ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Prospectos</p>
          <p className="mt-1 text-3xl font-black text-[#ffd38f]">{prospectCount}</p>
        </article>
      </section>

      <Outlet />
    </div>
  );
}
