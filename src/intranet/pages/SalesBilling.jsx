import { Outlet } from 'react-router-dom';
import { useIntranet } from '../context/IntranetContext';

export default function SalesBilling() {
  const { theme } = useIntranet();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <section className={`relative overflow-hidden rounded-3xl border p-6 ${isDark ? 'border-white/10 bg-[#111943]' : 'border-slate-200 bg-gradient-to-r from-white via-[#f7f8ff] to-[#eef1ff]'}`}>
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_15%_20%,rgba(231,60,80,0.20),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(90,179,229,0.18),transparent_34%)]' : 'bg-[radial-gradient(circle_at_15%_20%,rgba(231,60,80,0.10),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(90,179,229,0.10),transparent_34%)]'}`} />
        <div className="relative">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#d64d62]">Ventas y facturación</p>
          <h2 className={`intranet-heading mt-2 text-3xl font-black leading-tight md:text-4xl ${isDark ? 'text-white' : 'text-[#111827]'}`}>
            Ventas y facturas
          </h2>
          <p className={`mt-2 max-w-3xl text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            Igual que cotizaciones: usa el submenú lateral para agregar o listar, sin saturar el panel.
          </p>
        </div>
      </section>

      <Outlet />
    </div>
  );
}
