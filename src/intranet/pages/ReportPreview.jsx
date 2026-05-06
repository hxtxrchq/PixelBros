// Subcomponente: muestra solo las secciones activas del reporte (espejo del PDF)
const toMoney = (v) => `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 0 })}`;
const SC = ['#e73c50','#6c84ff','#35c98f','#f5a524','#c084fc'];

function KpiCard({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d122d]/80 p-4" style={{ borderTop: `3px solid ${color}` }}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export default function ReportPreview({ meta, stats }) {
  const maxSvc = Math.max(...(stats.salesByService || []).map(([,v]) => v), 1);
  const maxPl  = Math.max(...(stats.pipelineByStage || []).map((r) => r.count), 1);

  const Section = ({ title, children, show }) =>
    show ? (
      <section className="rounded-3xl border border-white/10 bg-[#0d122d]/80 p-6 space-y-4">
        <h4 className="intranet-heading text-lg font-black text-white border-b border-white/10 pb-2">{title}</h4>
        {children}
      </section>
    ) : null;

  return (
    <div className="space-y-5">
      {/* Intro */}
      <Section title="Introducción" show={meta.showIntro}>
        <p className="text-sm text-white/70 leading-relaxed">{meta.introduction}</p>
      </Section>

      {/* Message */}
      <Section title="Mensaje del equipo" show={meta.showMessage}>
        <p className="text-sm text-white/70 leading-relaxed">{meta.executiveMessage}</p>
        <blockquote className="border-l-4 border-[#e73c50] pl-4 text-sm font-bold text-white/80 italic">
          "JUNTOS CONSTRUIMOS RESULTADOS DE ALTO IMPACTO"
        </blockquote>
      </Section>

      {/* Stats */}
      {meta.showStats && (
        <section className="space-y-3">
          <h4 className="intranet-heading text-lg font-black text-white">Estadísticas clave</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Facturación" value={toMoney(stats.totalBilling)} color="#e73c50" />
            <KpiCard label="Clientes activos" value={stats.activeClients} color="#35c98f" />
            <KpiCard label="Cuentas" value={stats.totalBrands} color="#6c84ff" />
            <KpiCard label="Ticket promedio" value={toMoney(stats.avgTicket)} color="#f5a524" />
            <KpiCard label="Retención" value={`${stats.retentionRate}%`} color="#35c98f" />
            <KpiCard label="Conversión" value={`${stats.conversionRate}%`} color="#c084fc" />
            <KpiCard label="Ventas" value={stats.totalSales} color="#e73c50" />
            <KpiCard label="Perdidos" value={stats.lostClients} color="#f87171" />
          </div>
        </section>
      )}

      {/* Clients */}
      {meta.showClients && (
        <Section title="Nuestros Clientes" show>
          <p className="text-sm text-white/60">{meta.clientsIntro}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(stats.brands || []).slice(0, 4).map((b, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#e73c50]/20 text-xs font-black text-[#ff9eac]">
                  {(b.name || b.brandName || 'C').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{b.name || b.brandName}</p>
                  <p className="text-xs text-white/50">{b.service || 'Marketing digital'}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Financial chart */}
      {meta.showFinancialChart && (
        <Section title="Estado Financiero" show>
          <p className="text-sm font-bold text-white">{meta.financialSummaryTitle}</p>
          <p className="text-xs text-white/50">{meta.financialSummaryDesc}</p>
          <div className="space-y-2 mt-2">
            {(stats.salesByService || []).map(([svc, amt], i) => (
              <div key={svc} className="flex items-center gap-3">
                <span className="w-28 text-xs text-white/60 truncate">{svc}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full" style={{ width: `${Math.round((amt / maxSvc) * 100)}%`, background: SC[i % SC.length] }} />
                </div>
                <span className="text-xs font-bold text-white w-20 text-right">{toMoney(amt)}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 mt-3">
            <div className="rounded-xl border border-[#e73c50]/30 bg-[#e73c50]/10 p-3 text-center">
              <p className="text-2xl font-black text-[#ff9eac]">{meta.kpi1Value || stats.totalSales}</p>
              <p className="text-xs text-white/50 mt-1">{meta.kpi1Label}</p>
            </div>
            <div className="rounded-xl border border-[#e73c50]/30 bg-[#e73c50]/10 p-3 text-center">
              <p className="text-2xl font-black text-[#ff9eac]">{meta.kpi2Value || stats.activeClients}</p>
              <p className="text-xs text-white/50 mt-1">{meta.kpi2Label}</p>
            </div>
          </div>
        </Section>
      )}

      {/* Services */}
      {meta.showServices && (stats.salesByService || []).length > 0 && (
        <Section title="Ventas por Servicio" show>
          <div className="space-y-3">
            {stats.salesByService.map(([svc, amt], i) => (
              <div key={svc} className="flex items-center gap-3">
                <span className="w-32 text-sm text-white/70 truncate">{i + 1}. {svc}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full" style={{ width: `${Math.round((amt / maxSvc) * 100)}%`, background: SC[i % SC.length] }} />
                </div>
                <span className="text-sm font-bold text-white w-24 text-right">{toMoney(amt)}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Pipeline */}
      {meta.showPipeline && (
        <Section title="Pipeline Comercial" show>
          <div className="space-y-2">
            {(stats.pipelineByStage || []).map((row) => (
              <div key={row.stage} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white">{row.stage}</span>
                  <span className="text-white/60">{row.count} · {toMoney(row.amount)}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/10">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-[#6c84ff] to-[#e73c50]"
                    style={{ width: `${Math.round((row.count / maxPl) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* CRM */}
      {meta.showCRM && (
        <Section title="Clientes CRM" show>
          <div className="grid gap-3 sm:grid-cols-4">
            {[{l:'Activos',v:stats.activeClients,c:'#35c98f'},{l:'Prospectos',v:stats.prospects,c:'#6c84ff'},{l:'Perdidos',v:stats.lostClients,c:'#e73c50'},{l:'Total',v:stats.crmTotal,c:'#f5a524'}].map((r) => (
              <div key={r.l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-xs text-white/50 uppercase tracking-wide">{r.l}</p>
                <p className="text-2xl font-black mt-1" style={{ color: r.c }}>{r.v}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Quotes */}
      {meta.showQuotes && (
        <Section title="Cotizaciones" show>
          <div className="grid gap-3 sm:grid-cols-4">
            {[{l:'Enviadas',v:stats.pendingQuotes,c:'#6c84ff'},{l:'Aprobadas',v:stats.approvedQuotes,c:'#35c98f'},{l:'Rechazadas',v:stats.rejectedQuotes,c:'#e73c50'},{l:'Total',v:stats.totalQuotes,c:'#f5a524'}].map((r) => (
              <div key={r.l} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-xs text-white/50 uppercase tracking-wide">{r.l}</p>
                <p className="text-2xl font-black mt-1" style={{ color: r.c }}>{r.v}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Analysis */}
      {meta.showAnalysis && (stats.analysis || []).length > 0 && (
        <Section title="Análisis del mes" show>
          <ul className="space-y-2">
            {stats.analysis.map((point, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#e73c50]/20 text-[10px] font-black text-[#ff9eac]">{i + 1}</span>
                <span className="text-sm text-white/70 leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Conclusion */}
      {meta.showConclusion && (
        <Section title="Conclusión" show>
          <p className="text-sm text-white/70 leading-relaxed">{meta.conclusionText}</p>
          <div className="space-y-3 mt-2">
            {(meta.conclusionPoints || []).map((pt, i) => (
              <div key={i} className="border-l-2 border-[#e73c50] pl-4">
                <p className="text-sm font-black text-white">{pt.title}</p>
                <p className="text-xs text-white/60 mt-1">{pt.text}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
