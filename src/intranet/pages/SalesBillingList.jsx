import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIntranet } from '../context/IntranetContext';
import { viewInvoiceVoucher } from '../services/invoiceVoucher';

const statusOptions = ['Todos', 'Facturado', 'Pagado', 'Pendiente'];
const toMoney = (value) => `S/ ${Number(value || 0).toLocaleString('es-PE')}`;

const toDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value ?? '');
  return parsed.toLocaleDateString('es-PE');
};

const monthKey = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
};

const monthLabel = (key) => {
  if (!key) return 'Sin fecha';
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
};

export default function SalesBillingList() {
  const { salesRecords, updateSaleBillingStatus, updateSaleRecord, deleteSaleRecord, theme } = useIntranet();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const canViewAll = user?.role === 'GLOBAL_ADMIN';

  const visibleSalesRecords = useMemo(() => {
    if (canViewAll) return salesRecords;

    return salesRecords.filter((record) => {
      if (record.createdById) return record.createdById === user?.id;
      return (record.createdByName || record.responsible || '').toLowerCase() === (user?.fullName || '').toLowerCase();
    });
  }, [salesRecords, canViewAll, user?.id, user?.fullName]);

  const availablePeriods = useMemo(() => {
    const keys = Array.from(
      new Set(
        visibleSalesRecords
          .map((item) => monthKey(item.invoiceDate || item.startDate))
          .filter(Boolean),
      ),
    ).sort((a, b) => b.localeCompare(a));

    return ['Todos los tiempos', ...keys];
  }, [visibleSalesRecords]);

  const [periodFilter, setPeriodFilter] = useState(() => availablePeriods[1] || 'Todos los tiempos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [serviceFilter, setServiceFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [draft, setDraft] = useState(null);

  const serviceOptions = useMemo(() => {
    const values = new Set(visibleSalesRecords.map((item) => item.service).filter(Boolean));
    return ['Todos', ...Array.from(values)];
  }, [visibleSalesRecords]);

  const filteredSales = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return visibleSalesRecords.filter((record) => {
      const recordPeriod = monthKey(record.invoiceDate || record.startDate);
      const matchesPeriod = periodFilter === 'Todos los tiempos' || recordPeriod === periodFilter;
      const matchesStatus = statusFilter === 'Todos' || record.billingStatus === statusFilter;
      const matchesService = serviceFilter === 'Todos' || record.service === serviceFilter;
      const matchesSearch =
        !needle ||
        record.client.toLowerCase().includes(needle) ||
        record.company.toLowerCase().includes(needle) ||
        (record.invoiceNumber || '').toLowerCase().includes(needle) ||
        record.service.toLowerCase().includes(needle);

      return matchesPeriod && matchesStatus && matchesService && matchesSearch;
    });
  }, [visibleSalesRecords, search, periodFilter, statusFilter, serviceFilter]);

  const summary = useMemo(() => ({
    count: filteredSales.length,
    amount: filteredSales.reduce((acc, item) => acc + (Number(item.monthlyAmount) || 0), 0),
  }), [filteredSales]);

  const fieldClass = `rounded-xl border px-3 py-2 text-sm outline-none ${
    isDark
      ? 'border-white/10 bg-[#090c22] text-white placeholder:text-white/35'
      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400'
  }`;

  const sectionClass = isDark
    ? 'rounded-3xl border border-white/10 bg-[#0d1029]/75 shadow-[0_18px_40px_rgba(0,0,0,0.32)]'
    : 'rounded-3xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]';

  const openEditor = (record) => {
    setEditingRecord(record);
    setDraft({
      client: record.client || '',
      company: record.company || '',
      service: record.service || '',
      monthlyAmount: String(record.monthlyAmount ?? ''),
      invoiceDate: record.invoiceDate || record.startDate || '',
      responsible: record.responsible || '',
      billingStatus: record.billingStatus || 'Pendiente',
    });
  };

  const closeEditor = () => {
    setEditingRecord(null);
    setDraft(null);
  };

  const saveEditor = (event) => {
    event.preventDefault();
    if (!editingRecord || !draft) return;

    updateSaleRecord(editingRecord.id, {
      client: draft.client.trim(),
      company: draft.company.trim(),
      service: draft.service.trim(),
      monthlyAmount: Number(draft.monthlyAmount) || 0,
      invoiceDate: draft.invoiceDate,
      responsible: draft.responsible.trim(),
      billingStatus: draft.billingStatus,
    });

    closeEditor();
  };

  const removeRecord = (record) => {
    const confirmed = window.confirm(`¿Eliminar la factura ${record.invoiceNumber || `FV-${record.id}`}?`);
    if (!confirmed) return;
    deleteSaleRecord(record.id);
  };

  return (
    <section className={`${sectionClass} overflow-hidden`}>
      <div className={`border-b px-5 py-4 md:px-6 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Lista de ventas / facturas</h3>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className={`rounded-full px-2.5 py-1 ${isDark ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-600'}`}>{summary.count} registros</span>
            <span className="rounded-full bg-[#4f8cff]/20 px-2.5 py-1 text-[#9ec0ff]">{toMoney(summary.amount)}</span>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por cliente, empresa o factura"
            className={fieldClass}
          />
          <select value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)} className={fieldClass}>
            {availablePeriods.map((period) => (
              <option key={period} value={period}>
                {period === 'Todos los tiempos' ? period : monthLabel(period)}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={fieldClass}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)} className={fieldClass}>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredSales.length === 0 ? (
        <p className={`px-5 py-8 text-center text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
          No hay facturas que coincidan con los filtros.
        </p>
      ) : (
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3 md:p-6">
          {filteredSales.map((record) => (
            <article key={record.id} className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{record.client}</h4>
                  <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{record.company}</p>
                  <p className={`text-[10px] font-bold ${isDark ? 'text-white/45' : 'text-slate-400'}`}>{record.invoiceNumber || `FV-${record.id}`}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${record.billingStatus === 'Pagado' ? 'bg-[#35c98f]/20 text-[#90f0cb]' : record.billingStatus === 'Pendiente' ? 'bg-[#f5a524]/20 text-[#ffd38f]' : 'bg-[#4f8cff]/20 text-[#9ec0ff]'}`}>
                  {record.billingStatus}
                </span>
              </div>

              <div className="space-y-1.5 text-sm">
                <p className={isDark ? 'text-white/80' : 'text-slate-700'}><span className={isDark ? 'text-white/55' : 'text-slate-500'}>Servicio:</span> {record.service}</p>
                <p className={isDark ? 'text-white/80' : 'text-slate-700'}><span className={isDark ? 'text-white/55' : 'text-slate-500'}>Factura:</span> {toDate(record.invoiceDate || record.startDate)}</p>
                <p className={isDark ? 'text-white/80' : 'text-slate-700'}><span className={isDark ? 'text-white/55' : 'text-slate-500'}>Monto:</span> <span className="font-black text-[#d33147]">{toMoney(record.monthlyAmount)}</span></p>
                <p className={isDark ? 'text-white/65' : 'text-slate-500'}>
                  Emitida por: {record.createdByName || record.responsible || 'Equipo comercial'}
                  {record.createdByRole ? ` · ${record.createdByRole}` : ''}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <select
                  value={record.billingStatus}
                  onChange={(e) => updateSaleBillingStatus(record.id, e.target.value)}
                  className={`w-full rounded-lg border px-2 py-1.5 text-xs outline-none ${isDark ? 'border-white/15 bg-[#090c22] text-white' : 'border-slate-300 bg-white text-slate-900'}`}
                >
                  {statusOptions.filter((status) => status !== 'Todos').map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => viewInvoiceVoucher(record)}
                  className="w-full rounded-lg border border-[#4f8cff]/45 px-2 py-1.5 text-xs font-bold text-[#1d4ed8] transition hover:bg-[#eff6ff]"
                >
                  Ver PDF de factura
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openEditor(record)}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-bold transition ${isDark ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'}`}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRecord(record)}
                    className="rounded-lg border border-[#e73c50]/30 bg-[#e73c50]/10 px-2 py-1.5 text-xs font-bold text-[#c53044] transition hover:bg-[#e73c50]/15"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingRecord && draft ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <form
            onSubmit={saveEditor}
            className={`w-full max-w-2xl rounded-3xl border p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ${isDark ? 'border-white/10 bg-[#0d1029]' : 'border-slate-200 bg-white'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#d64d62]">Editar factura</p>
                <h3 className={`mt-1 text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {editingRecord.invoiceNumber || `FV-${editingRecord.id}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${isDark ? 'bg-white/10 text-white/70 hover:bg-white/15' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <input
                value={draft.client}
                onChange={(event) => setDraft((current) => ({ ...current, client: event.target.value }))}
                className={fieldClass}
                placeholder="Cliente"
              />
              <input
                value={draft.company}
                onChange={(event) => setDraft((current) => ({ ...current, company: event.target.value }))}
                className={fieldClass}
                placeholder="Empresa"
              />
              <input
                value={draft.service}
                onChange={(event) => setDraft((current) => ({ ...current, service: event.target.value }))}
                className={fieldClass}
                placeholder="Servicio"
              />
              <input
                type="number"
                min="0"
                value={draft.monthlyAmount}
                onChange={(event) => setDraft((current) => ({ ...current, monthlyAmount: event.target.value }))}
                className={fieldClass}
                placeholder="Monto"
              />
              <input
                type="date"
                value={draft.invoiceDate}
                onChange={(event) => setDraft((current) => ({ ...current, invoiceDate: event.target.value }))}
                className={fieldClass}
              />
              <input
                value={draft.responsible}
                onChange={(event) => setDraft((current) => ({ ...current, responsible: event.target.value }))}
                className={fieldClass}
                placeholder="Responsable"
              />
              <select
                value={draft.billingStatus}
                onChange={(event) => setDraft((current) => ({ ...current, billingStatus: event.target.value }))}
                className={fieldClass}
              >
                {statusOptions.filter((status) => status !== 'Todos').map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={closeEditor}
                className={`rounded-full px-4 py-2 text-sm font-bold ${isDark ? 'bg-white/10 text-white/80 hover:bg-white/15' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#e73c50] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#cf3044]"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
