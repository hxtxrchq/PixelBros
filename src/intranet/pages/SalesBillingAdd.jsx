import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIntranet } from '../context/IntranetContext';

const toMoney = (value) => `S/ ${Number(value || 0).toLocaleString('es-PE')}`;

export default function SalesBillingAdd() {
  const { user } = useAuth();
  const { addSaleRecord, theme } = useIntranet();
  const isDark = theme === 'dark';
  const defaultResponsible = user?.fullName || 'Equipo comercial';

  const [form, setForm] = useState({
    client: '',
    company: '',
    service: '',
    monthlyAmount: '',
    invoiceDate: new Date().toISOString().slice(0, 10),
    duration: '6 meses',
    responsible: defaultResponsible,
    billingStatus: 'Facturado',
  });
  const [preview, setPreview] = useState(null);

  const fieldClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
    isDark
      ? 'border-white/10 bg-[#0b1027] text-white placeholder:text-white/35 focus:border-[#4f8cff]/70'
      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#4f8cff]/70'
  }`;

  const submit = (event) => {
    event.preventDefault();
    if (!form.client.trim() || !form.company.trim() || !form.service.trim()) return;

    const payload = {
      ...form,
      monthlyAmount: Number(form.monthlyAmount) || 0,
      invoiceDate: form.invoiceDate || new Date().toISOString().slice(0, 10),
      responsible: defaultResponsible,
      createdById: user?.id || null,
      createdByName: user?.fullName || defaultResponsible,
      createdByRole: user?.role || null,
    };

    addSaleRecord(payload);
    setPreview({
      client: payload.client,
      company: payload.company,
      service: payload.service,
      monthlyAmount: payload.monthlyAmount,
    });

    setForm({
      client: '',
      company: '',
      service: '',
      monthlyAmount: '',
      invoiceDate: new Date().toISOString().slice(0, 10),
      duration: '6 meses',
      responsible: defaultResponsible,
      billingStatus: 'Facturado',
    });
  };

  return (
    <section className={`rounded-3xl border p-5 md:p-6 ${isDark ? 'border-white/10 bg-[#111638] shadow-[0_10px_26px_rgba(0,0,0,0.2)]' : 'border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.06)]'}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Agregar venta</h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Registra una venta o factura con el mismo cuidado visual que una cotización.</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${isDark ? 'bg-[#4f8cff]/15 text-[#cfe0ff]' : 'bg-slate-100 text-slate-600'}`}>
          Formulario compacto
        </span>
      </div>

      {preview ? (
        <div className={`mb-4 rounded-2xl border px-3 py-2.5 ${isDark ? 'border-[#35c98f]/40 bg-[#35c98f]/12 text-[#d4ffe9]' : 'border-[#9ee7cb] bg-[#ecfff6] text-[#0f5132]'}`}>
          Venta registrada para <span className="font-black">{preview.client}</span> · {preview.company} · {toMoney(preview.monthlyAmount)}
        </div>
      ) : null}

      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input value={form.client} onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))} placeholder="Cliente" className={fieldClass} />
        <input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Empresa" className={fieldClass} />
        <input value={form.service} onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))} placeholder="Servicio" className={fieldClass} />
        <input type="number" value={form.monthlyAmount} onChange={(e) => setForm((p) => ({ ...p, monthlyAmount: e.target.value }))} placeholder="Monto mensual" className={fieldClass} />
        <input type="date" value={form.invoiceDate} onChange={(e) => setForm((p) => ({ ...p, invoiceDate: e.target.value }))} className={fieldClass} />
        <input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="Duracion" className={fieldClass} />
        <input value={defaultResponsible} readOnly className={fieldClass} />
        <select value={form.billingStatus} onChange={(e) => setForm((p) => ({ ...p, billingStatus: e.target.value }))} className={fieldClass}>
          <option>Facturado</option>
          <option>Pagado</option>
          <option>Pendiente</option>
        </select>
        <button type="submit" className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2 text-sm font-black text-white xl:col-span-4">
          Registrar venta
        </button>
      </form>
    </section>
  );
}
