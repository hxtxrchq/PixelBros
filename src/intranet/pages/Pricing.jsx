import { useMemo, useState } from 'react';

const baseServices = [
  { name: 'Gestion redes sociales', price: 1500 },
  { name: 'Branding', price: 3000 },
  { name: 'Campana Ads', price: 1200 },
  { name: 'Produccion audiovisual', price: 2500 },
];

const toMoney = (value) => `S/ ${Number(value || 0).toLocaleString('es-PE')}`;

export default function Pricing() {
  const [calc, setCalc] = useState({
    basePrice: 1500,
    additional: 0,
    discount: 0,
    maxDiscount: 25,
    minMargin: 20,
  });

  const result = useMemo(() => {
    const subtotal = Number(calc.basePrice) + Number(calc.additional);
    const discountAmount = (subtotal * Number(calc.discount || 0)) / 100;
    const finalPrice = subtotal - discountAmount;
    return { subtotal, discountAmount, finalPrice };
  }, [calc]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        <h2 className="intranet-heading text-3xl font-black text-white">Tabla de precios / Calculadora</h2>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1029]/75 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-white/60">
              <tr>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Precio base</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {baseServices.map((service) => (
                <tr key={service.name} className="text-white/85">
                  <td className="px-4 py-3 font-semibold">{service.name}</td>
                  <td className="px-4 py-3">{toMoney(service.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
          <h3 className="intranet-heading text-xl font-black text-white">Calculadora</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="space-y-1"><span className="text-xs text-white/65">Precio base</span><input type="number" value={calc.basePrice} onChange={(e) => setCalc((p) => ({ ...p, basePrice: Number(e.target.value) || 0 }))} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" /></label>
            <label className="space-y-1"><span className="text-xs text-white/65">Servicios adicionales</span><input type="number" value={calc.additional} onChange={(e) => setCalc((p) => ({ ...p, additional: Number(e.target.value) || 0 }))} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" /></label>
            <label className="space-y-1"><span className="text-xs text-white/65">Descuento aplicado (%)</span><input type="number" value={calc.discount} onChange={(e) => setCalc((p) => ({ ...p, discount: Number(e.target.value) || 0 }))} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" /></label>
            <label className="space-y-1"><span className="text-xs text-white/65">Descuento maximo permitido (%)</span><input type="number" value={calc.maxDiscount} onChange={(e) => setCalc((p) => ({ ...p, maxDiscount: Number(e.target.value) || 0 }))} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" /></label>
            <label className="space-y-1 md:col-span-2"><span className="text-xs text-white/65">Margen minimo (%)</span><input type="number" value={calc.minMargin} onChange={(e) => setCalc((p) => ({ ...p, minMargin: Number(e.target.value) || 0 }))} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" /></label>
          </div>

          <div className="mt-5 space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
            <p className="text-white/75">Subtotal: <span className="font-bold text-white">{toMoney(result.subtotal)}</span></p>
            <p className="text-white/75">Descuento: <span className="font-bold text-white">-{toMoney(result.discountAmount)}</span></p>
            <p className="text-white/75">Precio final: <span className="font-black text-[#90f0cb]">{toMoney(result.finalPrice)}</span></p>
            <p className="text-xs text-white/60">Control: descuento maximo {calc.maxDiscount}% | margen minimo {calc.minMargin}%</p>
          </div>
        </article>
      </section>
    </div>
  );
}
