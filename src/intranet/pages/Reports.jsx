import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntranet } from '../context/IntranetContext';
import { useAuth } from '../context/AuthContext';
import { viewReportVoucher, saveReportMeta, loadReportMeta } from '../services/reportVoucher';
import { monthlyReportsClient } from '../services/monthlyReportsClient';
import ReportPreview from './ReportPreview';

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const now = new Date();

const SECTION_OPTIONS = [
  { key: 'showIntro', label: 'Introducción' },
  { key: 'showMessage', label: 'Mensaje del equipo' },
  { key: 'showStats', label: 'Estadísticas clave' },
  { key: 'showClients', label: 'Nuestros clientes' },
  { key: 'showFinancialChart', label: 'Estado financiero' },
  { key: 'showServices', label: 'Ventas por servicio' },
  { key: 'showPipeline', label: 'Pipeline comercial' },
  { key: 'showCRM', label: 'Clientes CRM' },
  { key: 'showQuotes', label: 'Cotizaciones' },
  { key: 'showAnalysis', label: 'Análisis del mes' },
  { key: 'showConclusion', label: 'Conclusión' },
];

const initMeta = (saved, fullName) => ({
  monthLabel: saved.monthLabel || `${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
  preparedBy: saved.preparedBy || fullName || 'Equipo PixelBros',
  introduction: saved.introduction || 'El presente reporte resume el desempeño comercial, marketing y retención de clientes durante el periodo indicado.',
  executiveMessage: saved.executiveMessage || 'Este mes consolidamos nuestra operación y seguimos construyendo relaciones sólidas con nuestros clientes.',
  conclusionText: saved.conclusionText || 'Los resultados del período muestran un avance positivo. Se recomienda enfocarse en la conversión de prospectos.',
  conclusionPoints: saved.conclusionPoints || [
    { title: 'PUNTO 1', text: 'Continuar el seguimiento activo de prospectos y cotizaciones sin respuesta.' },
    { title: 'PUNTO 2', text: 'Reforzar estrategias de retención con clientes activos.' },
    { title: 'PUNTO 3', text: 'Evaluar el pipeline e identificar etapas con mayor fuga de deals.' },
  ],
  clientsIntro: saved.clientsIntro || 'Trabajamos con marcas que confían en nuestra agencia para potenciar su presencia digital.',
  financialSummaryTitle: saved.financialSummaryTitle || `Resumen del año ${now.getFullYear()}`,
  financialSummaryDesc: saved.financialSummaryDesc || 'Distribución de ingresos por servicio en el período reportado.',
  financialResumeText: saved.financialResumeText || 'Los ingresos reflejan la diversificación de servicios y la consolidación de cuentas recurrentes.',
  kpi1Value: saved.kpi1Value || '', kpi1Label: saved.kpi1Label || 'registros de ventas en el período',
  kpi2Value: saved.kpi2Value || '', kpi2Label: saved.kpi2Label || 'clientes activos en la plataforma',
  footerPhone: saved.footerPhone || '(51) 1234-5678',
  footerWeb: saved.footerWeb || 'www.pixelbros.pe',
  footerEmail: saved.footerEmail || 'pixelbrosperu@outlook.com',
  showIntro: saved.showIntro !== false, showMessage: saved.showMessage !== false,
  showStats: saved.showStats !== false, showClients: saved.showClients !== false,
  showFinancialChart: saved.showFinancialChart !== false, showServices: saved.showServices !== false,
  showPipeline: saved.showPipeline !== false, showCRM: saved.showCRM !== false,
  showQuotes: saved.showQuotes !== false, showAnalysis: saved.showAnalysis !== false,
  showConclusion: saved.showConclusion !== false,
});

export default function Reports() {
  const { salesRecords, brands, crmRecords, quotes, pipelineDeals } = useIntranet();
  const { user } = useAuth();
  const [meta, setMeta] = useState(() => initMeta(loadReportMeta(), user?.fullName));
  const [configOpen, setConfigOpen] = useState(false);
  const [tab, setTab] = useState('preview'); // 'preview' | 'history' | 'config'
  const [savedReports, setSavedReports] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const autoSaveRef = useRef(false);

  const updateMeta = (patch) => setMeta((p) => ({ ...p, ...patch }));
  useEffect(() => { saveReportMeta(meta); }, [meta]);

  // ── Stats computation ──────────────────────────────────────────────────────
  const visibleSales = useMemo(() => {
    if (user?.role === 'GLOBAL_ADMIN') return salesRecords;
    return salesRecords.filter((r) =>
      r.createdById ? r.createdById === user?.id : (r.createdByName || '').toLowerCase() === (user?.fullName || '').toLowerCase()
    );
  }, [salesRecords, user]);

  const stats = useMemo(() => {
    const totalBilling = visibleSales.reduce((a, s) => a + Number(s.monthlyAmount || 0), 0);
    const activeClients = crmRecords.filter((c) => c.clientStatus === 'Cliente activo').length;
    const lostClients = crmRecords.filter((c) => c.clientStatus === 'Cliente perdido').length;
    const prospects = crmRecords.filter((c) => c.clientStatus === 'Prospecto').length;
    const retentionRate = pct(activeClients, crmRecords.length);
    const conversionRate = pct(pipelineDeals.filter((d) => d.stage === 'Cierre venta').length, pipelineDeals.length);
    const avgTicket = visibleSales.length ? totalBilling / visibleSales.length : 0;
    const approvedQuotes = quotes.filter((q) => q.status === 'Aprobada').length;
    const pendingQuotes = quotes.filter((q) => q.status === 'Enviada').length;
    const rejectedQuotes = quotes.filter((q) => q.status === 'Rechazada').length;
    const salesByService = Object.entries(
      visibleSales.reduce((m, s) => { m[s.service] = (m[s.service] || 0) + Number(s.monthlyAmount || 0); return m; }, {})
    ).sort((a, b) => b[1] - a[1]);
    const pipelineByStage = ['Lead','Reunion','Negociacion','Cierre venta'].map((s) => ({
      stage: s,
      count: pipelineDeals.filter((d) => d.stage === s).length,
      amount: pipelineDeals.filter((d) => d.stage === s).reduce((a, d) => a + Number(d.estimatedAmount || 0), 0),
    }));
    const analysis = [];
    if (totalBilling > 0) analysis.push(`Facturación de S/ ${totalBilling.toLocaleString('es-PE')} con ${visibleSales.length} ventas.`);
    if (retentionRate > 0) analysis.push(`Tasa de retención del ${retentionRate}% — ${retentionRate >= 70 ? 'saludable' : 'mejorable'}.`);
    if (prospects > 0) analysis.push(`${prospects} prospectos sin convertir — priorizar seguimiento.`);
    if (pendingQuotes > 0) analysis.push(`${pendingQuotes} cotizaciones pendientes de respuesta.`);
    if (conversionRate > 0) analysis.push(`Conversión pipeline: ${conversionRate}%.`);
    if (salesByService.length > 0) analysis.push(`Servicio líder: ${salesByService[0][0]}.`);
    if (lostClients > 0) analysis.push(`${lostClients} cliente${lostClients > 1 ? 's' : ''} perdido${lostClients > 1 ? 's' : ''} — analizar cancelación.`);
    if (!analysis.length) analysis.push('Sin datos suficientes. Registra ventas y clientes para ver insights.');
    return { totalBilling, activeClients, lostClients, prospects, retentionRate, conversionRate, avgTicket,
      totalSales: visibleSales.length, totalBrands: brands.length, approvedQuotes, pendingQuotes, rejectedQuotes,
      totalQuotes: quotes.length, salesByService, pipelineByStage, analysis, crmTotal: crmRecords.length, brands };
  }, [visibleSales, crmRecords, pipelineDeals, quotes, brands]);

  // ── Load history ───────────────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try { setSavedReports(await monthlyReportsClient.list()); } catch {}
    finally { setLoadingHistory(false); }
  }, []);

  useEffect(() => { if (tab === 'history') loadHistory(); }, [tab, loadHistory]);

  // ── Auto-save on last day of month ─────────────────────────────────────────
  useEffect(() => {
    if (autoSaveRef.current) return;
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    if (now.getDate() !== lastDayOfMonth) return;
    autoSaveRef.current = true;
    (async () => {
      try {
        await monthlyReportsClient.save({
          type: 'MONTHLY', period: `${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
          year: now.getFullYear(), month: now.getMonth() + 1, snapshot: stats, meta,
        });
      } catch {}
    })();
  }, [stats, meta]);

  // ── Save handler ───────────────────────────────────────────────────────────
  const handleSave = async (type) => {
    setSaving(true);
    try {
      await monthlyReportsClient.save({
        type, year: now.getFullYear(),
        month: type === 'MONTHLY' ? now.getMonth() + 1 : undefined,
        snapshot: stats, meta,
      });
      setToast(`Reporte ${type === 'MONTHLY' ? 'mensual' : 'anual'} guardado correctamente.`);
      setTimeout(() => setToast(''), 3500);
    } catch (e) { setToast('Error al guardar: ' + e.message); setTimeout(() => setToast(''), 4000); }
    finally { setSaving(false); }
  };

  const openPDF = () => { try { viewReportVoucher(stats, meta); } catch (e) { alert(e.message); } };

  const Field = ({ label, value, onChange, textarea }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="rounded-lg border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none resize-none focus:border-[#e73c50]/60" />
        : <input value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none focus:border-[#e73c50]/60" />}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0f1230] to-[#151c49] p-6">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ff9eac]">Dashboard</p>
          <h3 className="intranet-heading mt-1 text-3xl font-black text-white">Reportes</h3>
          <p className="mt-1 text-sm text-white/60">{meta.monthLabel} · Se guarda automáticamente el último día del mes</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => handleSave('MONTHLY')} disabled={saving}
            className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white/80 hover:border-white/40 disabled:opacity-50 transition">
            {saving ? '...' : '💾 Mensual'}
          </button>
          <button onClick={() => handleSave('ANNUAL')} disabled={saving}
            className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white/80 hover:border-white/40 disabled:opacity-50 transition">
            {saving ? '...' : '📅 Anual'}
          </button>
          <button onClick={openPDF}
            className="rounded-xl bg-gradient-to-r from-[#e73c50] to-[#c42b3c] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(231,60,80,0.35)] hover:brightness-110 transition">
            ⬇ Ver / PDF
          </button>
        </div>
      </section>

      {toast && (
        <div className="rounded-xl border border-[#35c98f]/40 bg-[#35c98f]/10 px-4 py-3 text-sm text-[#bff6e2]">{toast}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {[['preview','Vista previa'],['config','Personalizar'],['history','Historial']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === k ? 'bg-[#e73c50] text-white' : 'border border-white/15 text-white/60 hover:text-white'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Preview tab */}
      {tab === 'preview' && <ReportPreview meta={meta} stats={stats} />}

      {/* Config tab */}
      {tab === 'config' && (
        <section className="rounded-3xl border border-white/10 bg-[#0d122d]/90 p-6 space-y-6">
          <h4 className="intranet-heading text-xl font-black text-white">Personalizar reporte</h4>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-3">Secciones</p>
            <div className="flex flex-wrap gap-2">
              {SECTION_OPTIONS.map(({ key, label }) => (
                <button key={key} onClick={() => updateMeta({ [key]: !meta[key] })}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${meta[key] ? 'border-[#e73c50]/60 bg-[#e73c50]/15 text-[#ff9eac]' : 'border-white/15 text-white/50 hover:border-white/25'}`}>
                  {meta[key] ? '✓ ' : ''}{label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Período" value={meta.monthLabel} onChange={(v) => updateMeta({ monthLabel: v })} />
            <Field label="Preparado por" value={meta.preparedBy} onChange={(v) => updateMeta({ preparedBy: v })} />
            <Field label="Teléfono" value={meta.footerPhone} onChange={(v) => updateMeta({ footerPhone: v })} />
            <Field label="Web" value={meta.footerWeb} onChange={(v) => updateMeta({ footerWeb: v })} />
            <Field label="Email" value={meta.footerEmail} onChange={(v) => updateMeta({ footerEmail: v })} />
            <Field label="KPI 1 valor" value={meta.kpi1Value} onChange={(v) => updateMeta({ kpi1Value: v })} />
            <Field label="KPI 1 etiqueta" value={meta.kpi1Label} onChange={(v) => updateMeta({ kpi1Label: v })} />
            <Field label="KPI 2 valor" value={meta.kpi2Value} onChange={(v) => updateMeta({ kpi2Value: v })} />
            <Field label="KPI 2 etiqueta" value={meta.kpi2Label} onChange={(v) => updateMeta({ kpi2Label: v })} />
          </div>
          <div className="grid gap-4">
            <Field label="Introducción" value={meta.introduction} onChange={(v) => updateMeta({ introduction: v })} textarea />
            <Field label="Mensaje del equipo" value={meta.executiveMessage} onChange={(v) => updateMeta({ executiveMessage: v })} textarea />
            <Field label="Intro de clientes" value={meta.clientsIntro} onChange={(v) => updateMeta({ clientsIntro: v })} textarea />
            <Field label="Título gráfico financiero" value={meta.financialSummaryTitle} onChange={(v) => updateMeta({ financialSummaryTitle: v })} />
            <Field label="Descripción gráfico" value={meta.financialSummaryDesc} onChange={(v) => updateMeta({ financialSummaryDesc: v })} />
            <Field label="Resumen financiero" value={meta.financialResumeText} onChange={(v) => updateMeta({ financialResumeText: v })} textarea />
            <Field label="Conclusión principal" value={meta.conclusionText} onChange={(v) => updateMeta({ conclusionText: v })} textarea />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-3">Puntos de conclusión</p>
            <div className="grid gap-3">
              {meta.conclusionPoints.map((pt, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-[#090c22] p-3 space-y-2">
                  <input value={pt.title} onChange={(e) => { const pts = [...meta.conclusionPoints]; pts[i] = { ...pts[i], title: e.target.value }; updateMeta({ conclusionPoints: pts }); }}
                    className="w-full rounded-lg border border-white/15 bg-[#0d1029] px-2 py-1.5 text-xs font-bold text-white outline-none" placeholder={`Título Punto ${i + 1}`} />
                  <textarea value={pt.text} onChange={(e) => { const pts = [...meta.conclusionPoints]; pts[i] = { ...pts[i], text: e.target.value }; updateMeta({ conclusionPoints: pts }); }} rows={2}
                    className="w-full rounded-lg border border-white/15 bg-[#0d1029] px-2 py-1.5 text-xs text-white outline-none resize-none" />
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/30">Los cambios se guardan automáticamente en tu navegador.</p>
        </section>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <section className="rounded-3xl border border-white/10 bg-[#0d122d]/80 p-6">
          <div className="flex items-center justify-between mb-5">
            <h4 className="intranet-heading text-xl font-black text-white">Historial de reportes</h4>
            <button onClick={loadHistory} className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-bold text-white/60 hover:text-white transition">↻ Actualizar</button>
          </div>
          {loadingHistory ? (
            <p className="text-sm text-white/50">Cargando...</p>
          ) : savedReports.length === 0 ? (
            <p className="text-sm text-white/40">No hay reportes guardados aún. Guarda tu primer reporte con el botón "💾 Mensual" o "📅 Anual".</p>
          ) : (
            <div className="space-y-3">
              {savedReports.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase ${r.type === 'ANNUAL' ? 'bg-[#6c84ff]/20 text-[#b8c9ff]' : 'bg-[#e73c50]/20 text-[#ff9eac]'}`}>
                      {r.type === 'ANNUAL' ? 'Anual' : 'Mensual'}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{r.period}</p>
                      <p className="text-xs text-white/40">{new Date(r.createdAt).toLocaleDateString('es-PE')} · {r.createdBy?.fullName || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={async () => {
                      const full = await monthlyReportsClient.get(r.id);
                      viewReportVoucher(full.snapshot, { ...meta, ...full.meta });
                    }} className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-bold text-white/70 hover:border-white/30 hover:text-white transition">
                      Ver PDF
                    </button>
                    <button onClick={async () => { await monthlyReportsClient.remove(r.id); loadHistory(); }}
                      className="rounded-lg border border-[#e73c50]/30 px-2.5 py-1 text-xs font-bold text-[#ffb1bc] hover:bg-[#e73c50]/15 transition">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
