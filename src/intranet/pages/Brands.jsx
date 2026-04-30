import { useState } from 'react';
import { useIntranet } from '../context/IntranetContext';

const toMoney = (value) => `S/ ${Number(value || 0).toLocaleString('es-PE')}`;

const paymentStyles = {
  Pagado: 'bg-[#35c98f]/20 text-[#90f0cb]',
  Pendiente: 'bg-[#f5a524]/20 text-[#ffd38f]',
  'Vence pronto': 'bg-[#e73c50]/20 text-[#ff9aa6]',
};

export default function Brands() {
  const { brands, addBrand } = useIntranet();
  const [form, setForm] = useState({
    brandName: '',
    clientManager: '',
    servicesActive: '',
    monthlyAmount: '',
    startDate: '',
    endDate: '',
    reach: '',
    engagement: '',
    leads: '',
    adSpend: '',
    attributedSales: '',
    paymentStatus: 'Pendiente',
    invoicesIssued: 0,
  });

  const onSubmit = (event) => {
    event.preventDefault();
    if (!form.brandName.trim() || !form.clientManager.trim()) return;

    addBrand({
      ...form,
      monthlyAmount: Number(form.monthlyAmount) || 0,
      reach: Number(form.reach) || 0,
      leads: Number(form.leads) || 0,
      adSpend: Number(form.adSpend) || 0,
      attributedSales: Number(form.attributedSales) || 0,
      invoicesIssued: Number(form.invoicesIssued) || 0,
    });

    setForm({
      brandName: '',
      clientManager: '',
      servicesActive: '',
      monthlyAmount: '',
      startDate: '',
      endDate: '',
      reach: '',
      engagement: '',
      leads: '',
      adSpend: '',
      attributedSales: '',
      paymentStatus: 'Pendiente',
      invoicesIssued: 0,
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        <h2 className="intranet-heading text-3xl font-black text-white">Marcas / Cuentas</h2>
        <p className="mt-2 text-sm text-white/70">Gestiona cada marca con informacion general, rendimiento y facturacion.</p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        <h3 className="intranet-heading text-xl font-black text-white">Agregar marca</h3>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-3">
          <input value={form.brandName} onChange={(e) => setForm((p) => ({ ...p, brandName: e.target.value }))} placeholder="Nombre de marca" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input value={form.clientManager} onChange={(e) => setForm((p) => ({ ...p, clientManager: e.target.value }))} placeholder="Cliente responsable" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input value={form.servicesActive} onChange={(e) => setForm((p) => ({ ...p, servicesActive: e.target.value }))} placeholder="Servicios activos" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input type="number" value={form.monthlyAmount} onChange={(e) => setForm((p) => ({ ...p, monthlyAmount: e.target.value }))} placeholder="Monto mensual" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input type="number" value={form.reach} onChange={(e) => setForm((p) => ({ ...p, reach: e.target.value }))} placeholder="Alcance" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input value={form.engagement} onChange={(e) => setForm((p) => ({ ...p, engagement: e.target.value }))} placeholder="Engagement (ej. 4.2%)" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input type="number" value={form.leads} onChange={(e) => setForm((p) => ({ ...p, leads: e.target.value }))} placeholder="Leads generados" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input type="number" value={form.adSpend} onChange={(e) => setForm((p) => ({ ...p, adSpend: e.target.value }))} placeholder="Gasto anuncios" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input type="number" value={form.attributedSales} onChange={(e) => setForm((p) => ({ ...p, attributedSales: e.target.value }))} placeholder="Ventas atribuidas" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <select value={form.paymentStatus} onChange={(e) => setForm((p) => ({ ...p, paymentStatus: e.target.value }))} className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none">
            <option>Pagado</option>
            <option>Pendiente</option>
            <option>Vence pronto</option>
          </select>
          <button type="submit" className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2 text-sm font-black text-white">Guardar marca</button>
        </form>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1029]/75 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-white/60">
              <tr>
                <th className="px-4 py-3">Marca</th>
                <th className="px-4 py-3">Responsable</th>
                <th className="px-4 py-3">Servicios</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">KPI</th>
                <th className="px-4 py-3">Facturacion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {brands.map((brand) => (
                <tr key={brand.id} className="text-white/85">
                  <td className="px-4 py-3 font-semibold">{brand.brandName}</td>
                  <td className="px-4 py-3">{brand.clientManager}</td>
                  <td className="px-4 py-3">{brand.servicesActive}</td>
                  <td className="px-4 py-3">{toMoney(brand.monthlyAmount)}</td>
                  <td className="px-4 py-3">Alcance {Number(brand.reach).toLocaleString('es-PE')} / Eng {brand.engagement || '0%'}</td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${paymentStyles[brand.paymentStatus] || 'bg-white/10 text-white/70'}`}>{brand.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
