import logoIconPixel from '../../images/LogoIconPixel.png';
// Brand palette: --red:#e73c50  --navy:#06091b  --indigo:#1e1c50  --ink:#111111

const REPORT_META_KEY = 'pixelbros-report-voucher-meta';

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const toMoney = (v) => `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const escapeHtml = (v) => String(v ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const getAppBaseUrl = () => {
  const base = (import.meta.env.BASE_URL || '/').replace(/^\/+/, '').replace(/\/+$/, '');
  return base ? `${window.location.origin}/${base}/` : `${window.location.origin}/`;
};
const toAbsoluteUrl = (path) => {
  const raw = String(path || '').trim();
  if (!raw) return '';
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  return new URL(raw.replace(/^\/+/, ''), getAppBaseUrl()).toString();
};

const safeStorage = {
  get() { try { const r = localStorage.getItem(REPORT_META_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; } },
  set(v) { try { localStorage.setItem(REPORT_META_KEY, JSON.stringify(v)); } catch {} },
};

export const saveReportMeta = (meta) => safeStorage.set({ ...safeStorage.get(), ...meta });
export const loadReportMeta = () => safeStorage.get();

const buildReportModel = (stats, meta = {}) => {
  const now = new Date();
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
  return {
    monthLabel: meta.monthLabel || monthLabel,
    preparedBy: meta.preparedBy || 'Equipo PixelBros',
    introduction: meta.introduction || 'El presente reporte resume el desempeño comercial, marketing y retención de clientes durante el periodo indicado, con el objetivo de tomar decisiones estratégicas basadas en datos reales.',
    executiveMessage: meta.executiveMessage || 'Este mes consolidamos nuestra operación y seguimos construyendo relaciones sólidas con nuestros clientes. Cada indicador refleja el compromiso y la dedicación de todo el equipo.',
    conclusionText: meta.conclusionText || 'Los resultados del período muestran un avance positivo en retención y facturación. Se recomienda enfocarse en la conversión de prospectos para maximizar el cierre del siguiente mes.',
    conclusionPoints: Array.isArray(meta.conclusionPoints) && meta.conclusionPoints.length
      ? meta.conclusionPoints
      : [
          { title: 'PUNTO 1', text: 'Continuar el seguimiento activo de prospectos y cotizaciones enviadas sin respuesta.' },
          { title: 'PUNTO 2', text: 'Reforzar estrategias de retención con clientes activos para mantener la tasa de fidelización.' },
          { title: 'PUNTO 3', text: 'Evaluar el desempeño del pipeline e identificar etapas con mayor fuga de deals.' },
        ],
    clientsIntro: meta.clientsIntro || 'Trabajamos con marcas que confían en nuestra agencia para potenciar su presencia digital y alcanzar resultados comerciales sostenibles.',
    financialSummaryTitle: meta.financialSummaryTitle || `Resumen del año ${new Date().getFullYear()}`,
    financialSummaryDesc: meta.financialSummaryDesc || 'Aquí se muestra la distribución de ingresos por servicio en el período reportado.',
    financialResumeText: meta.financialResumeText || 'Los ingresos del período reflejan la diversificación de servicios y la consolidación de cuentas recurrentes. Se mantiene un crecimiento sostenido en las principales líneas de negocio.',
    kpi1Value: meta.kpi1Value || String(stats.totalSales ?? 0),
    kpi1Label: meta.kpi1Label || 'registros de ventas en el período',
    kpi2Value: meta.kpi2Value || String(stats.activeClients ?? 0),
    kpi2Label: meta.kpi2Label || 'clientes activos en la plataforma',
    footerPhone: meta.footerPhone || '(51) 1234-5678',
    footerWeb: meta.footerWeb || 'www.pixelbros.pe',
    footerEmail: meta.footerEmail || 'pixelbrosperu@outlook.com',
    // stats (auto from data)
    totalBilling: stats.totalBilling ?? 0,
    activeClients: stats.activeClients ?? 0,
    prospects: stats.prospects ?? 0,
    lostClients: stats.lostClients ?? 0,
    retentionRate: stats.retentionRate ?? 0,
    conversionRate: stats.conversionRate ?? 0,
    avgTicket: stats.avgTicket ?? 0,
    totalSales: stats.totalSales ?? 0,
    totalBrands: stats.totalBrands ?? 0,
    approvedQuotes: stats.approvedQuotes ?? 0,
    pendingQuotes: stats.pendingQuotes ?? 0,
    rejectedQuotes: stats.rejectedQuotes ?? 0,
    totalQuotes: stats.totalQuotes ?? 0,
    salesByService: stats.salesByService ?? [],
    pipelineByStage: stats.pipelineByStage ?? [],
    analysis: stats.analysis ?? [],
    crmTotal: stats.crmTotal ?? 0,
    brands: stats.brands ?? [],
    // sections toggle
    showIntro: meta.showIntro !== false,
    showMessage: meta.showMessage !== false,
    showStats: meta.showStats !== false,
    showClients: meta.showClients !== false,
    showFinancialChart: meta.showFinancialChart !== false,
    showServices: meta.showServices !== false,
    showPipeline: meta.showPipeline !== false,
    showCRM: meta.showCRM !== false,
    showQuotes: meta.showQuotes !== false,
    showAnalysis: meta.showAnalysis !== false,
    showConclusion: meta.showConclusion !== false,
  };
};

const SERVICE_COLORS = ['#e73c50', '#4f8cff', '#35c98f', '#f5a524', '#c084fc', '#38bdf8'];

const buildReportHtml = (stats, meta) => {
  const d = buildReportModel(stats, meta);
  const logo = toAbsoluteUrl(logoIconPixel);

  const footer = `<footer class="footer"><span>${escapeHtml(d.footerPhone)}</span><span>${escapeHtml(d.footerWeb)}</span><span>${escapeHtml(d.footerEmail)}</span></footer>`;

  const header = (title, sub = '') => `
    <div class="section-header">
      <div class="header-accent"></div>
      <div>
        <p class="header-sub">${escapeHtml(sub || 'PixelBros · ' + d.monthLabel)}</p>
        <h2 class="header-title">${escapeHtml(title)}</h2>
      </div>
    </div>`;

  const statBox = (label, value, color = '#e73c50') => `
    <div class="stat-box" style="border-top:3px solid ${color}">
      <p class="stat-label">${escapeHtml(label)}</p>
      <p class="stat-value" style="color:${color}">${escapeHtml(String(value))}</p>
    </div>`;

  const barRow = (label, value, max, color, i) => {
    const w = max > 0 ? Math.round((value / max) * 100) : 0;
    return `<div class="bar-row">
      <span class="bar-label">${escapeHtml(String(i + 1))}. ${escapeHtml(label)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${w}%;background:${color}"></div></div>
      <span class="bar-val">${escapeHtml(toMoney(value))}</span>
    </div>`;
  };

  // SVG area chart from salesByService
  const buildSvgChart = () => {
    if (!d.salesByService.length) return '<p style="color:#aaa;font-size:11px;text-align:center;padding:20px">Sin datos de ventas para graficar.</p>';
    const W = 440, H = 110, PL = 28, PR = 8, PT = 10, PB = 24;
    const cW = W - PL - PR, cH = H - PT - PB;
    const vals = d.salesByService.map(([, v]) => v);
    const max = Math.max(...vals, 1);
    const step = vals.length > 1 ? cW / (vals.length - 1) : cW;
    const pts = vals.map((v, i) => `${PL + i * step},${PT + cH * (1 - v / max)}`);
    const polyPts = pts.join(' ');
    const areaPts = `${PL},${PT + cH} ${polyPts} ${PL + (vals.length - 1) * step},${PT + cH}`;
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((r) => {
      const y = PT + cH * (1 - r);
      return `<line x1="${PL}" y1="${y}" x2="${W - PR}" y2="${y}" stroke="#eee" stroke-width="1"/><text x="${PL - 4}" y="${y + 3}" text-anchor="end" font-size="8" fill="#bbb">${Math.round(max * r / 1000)}k</text>`;
    }).join('');
    const labels = d.salesByService.map(([svc], i) =>
      `<text x="${PL + i * step}" y="${H - 6}" text-anchor="middle" font-size="8" fill="#999" font-family="Arial">${escapeHtml(svc.slice(0,10))}</text>`
    ).join('');
    const dots = pts.map((p) => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="3.5" fill="#e73c50" stroke="#fff" stroke-width="1.5"/>`);
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block">
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e73c50" stop-opacity="0.25"/><stop offset="100%" stop-color="#e73c50" stop-opacity="0.02"/></linearGradient></defs>
      ${gridLines}<polygon points="${areaPts}" fill="url(#ag)"/>
      <polyline points="${polyPts}" fill="none" stroke="#e73c50" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${dots.join('')}${labels}</svg>`;
  };

  // Build index items
  const indexItems = [
    d.showIntro && ['01', 'INTRODUCCIÓN'],
    d.showMessage && ['02', 'MENSAJE DEL EQUIPO'],
    d.showStats && ['03', 'ESTADÍSTICAS CLAVE'],
    d.showClients && ['04', 'NUESTROS CLIENTES'],
    d.showFinancialChart && ['05', 'ESTADO FINANCIERO'],
    d.showServices && ['06', 'VENTAS POR SERVICIO'],
    d.showPipeline && ['07', 'PIPELINE COMERCIAL'],
    d.showCRM && ['08', 'CLIENTES CRM'],
    d.showQuotes && ['09', 'COTIZACIONES'],
    d.showAnalysis && ['10', 'ANÁLISIS DEL MES'],
    d.showConclusion && ['11', 'CONCLUSIÓN'],
  ].filter(Boolean);

  const maxService = Math.max(...d.salesByService.map(([, v]) => v), 1);
  const maxPipeline = Math.max(...d.pipelineByStage.map((r) => r.count), 1);

  const sections = [];

  // COVER
  sections.push(`
    <section class="sheet cover-sheet">
      <div class="cover-top">
        <div class="brand"><img src="${logo}" alt="PixelBros" /><span>PIXELBROS</span></div>
        <div class="cover-date">${escapeHtml(d.monthLabel)}</div>
      </div>
      <div class="cover-body">
        <div class="cover-accent-line"></div>
        <h1 class="cover-title">REPORTE<br/>MENSUAL</h1>
        <p class="cover-year">${new Date().getFullYear()} <span class="cover-arrow">→</span></p>
        <p class="cover-sub">Análisis comercial, marketing y retención · ${escapeHtml(d.monthLabel)}</p>
      </div>
      <div class="cover-bottom">
        <p>Preparado por: <strong>${escapeHtml(d.preparedBy)}</strong></p>
      </div>
      ${footer}
    </section>`);

  // INDEX
  sections.push(`
    <section class="sheet">
      <h2 class="index-title">ÍNDICE</h2>
      <div class="index-line"></div>
      <ul class="index-list">
        ${indexItems.map(([num, label]) => `
          <li class="index-item">
            <span class="index-num">${num}</span>
            <span class="index-label">${label}</span>
          </li>`).join('')}
      </ul>
      ${footer}
    </section>`);

  // INTRO
  if (d.showIntro) {
    sections.push(`
      <section class="sheet">
        ${header('INTRODUCCIÓN')}
        <div class="body-text">
          <p>${escapeHtml(d.introduction)}</p>
        </div>
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  // EXECUTIVE MESSAGE
  if (d.showMessage) {
    sections.push(`
      <section class="sheet">
        ${header('MENSAJE DEL EQUIPO')}
        <div class="body-text">
          <p>${escapeHtml(d.executiveMessage)}</p>
        </div>
        <div class="message-quote">
          <p class="quote-mark">&ldquo;</p>
          <p class="quote-text">JUNTOS CONSTRUIMOS RESULTADOS DE ALTO IMPACTO</p>
        </div>
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  // STATS
  if (d.showStats) {
    sections.push(`
      <section class="sheet">
        ${header('ESTADO FINANCIERO', 'Resumen del período')}
        <div class="stats-grid">
          ${statBox('Facturación total', toMoney(d.totalBilling), '#e73c50')}
          ${statBox('Clientes activos', d.activeClients, '#35c98f')}
          ${statBox('Cuentas en gestión', d.totalBrands, '#4f8cff')}
          ${statBox('Ticket promedio', toMoney(d.avgTicket), '#f5a524')}
          ${statBox('Tasa de retención', d.retentionRate + '%', '#35c98f')}
          ${statBox('Conversión pipeline', d.conversionRate + '%', '#c084fc')}
          ${statBox('Registros de venta', d.totalSales, '#e73c50')}
          ${statBox('Clientes perdidos', d.lostClients, '#f87171')}
        </div>
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  // SERVICES
  if (d.showServices && d.salesByService.length > 0) {
    sections.push(`
      <section class="sheet">
        ${header('VENTAS POR SERVICIO', 'Distribución de facturación')}
        <div class="bars-section">
          ${d.salesByService.map(([svc, amt], i) => barRow(svc, amt, maxService, SERVICE_COLORS[i % SERVICE_COLORS.length], i)).join('')}
        </div>
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  // PIPELINE
  if (d.showPipeline && d.pipelineByStage.length > 0) {
    sections.push(`
      <section class="sheet">
        ${header('PIPELINE COMERCIAL', 'Deals por etapa')}
        <div class="pipeline-list">
          ${d.pipelineByStage.map((row) => {
            const w = maxPipeline > 0 ? Math.round((row.count / maxPipeline) * 100) : 0;
            return `<div class="pipeline-row">
              <div class="pipeline-info">
                <span class="pipeline-stage">${escapeHtml(row.stage)}</span>
                <span class="pipeline-meta">${row.count} deals · ${toMoney(row.amount)}</span>
              </div>
              <div class="bar-track"><div class="bar-fill" style="width:${w}%;background:linear-gradient(90deg,#4f8cff,#e73c50)"></div></div>
            </div>`;
          }).join('')}
        </div>
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  // CRM
  if (d.showCRM) {
    sections.push(`
      <section class="sheet">
        ${header('CLIENTES CRM', 'Estado de la base de clientes')}
        <div class="crm-grid">
          <div class="crm-card" style="border-color:#35c98f">
            <p class="crm-num" style="color:#35c98f">${d.activeClients}</p>
            <p class="crm-lbl">Activos</p>
          </div>
          <div class="crm-card" style="border-color:#4f8cff">
            <p class="crm-num" style="color:#4f8cff">${d.prospects}</p>
            <p class="crm-lbl">Prospectos</p>
          </div>
          <div class="crm-card" style="border-color:#e73c50">
            <p class="crm-num" style="color:#e73c50">${d.lostClients}</p>
            <p class="crm-lbl">Perdidos</p>
          </div>
          <div class="crm-card" style="border-color:#f5a524">
            <p class="crm-num" style="color:#f5a524">${d.crmTotal}</p>
            <p class="crm-lbl">Total CRM</p>
          </div>
        </div>
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  // QUOTES
  if (d.showQuotes) {
    sections.push(`
      <section class="sheet">
        ${header('COTIZACIONES', 'Estado de propuestas comerciales')}
        <div class="stats-grid">
          ${statBox('Enviadas', d.pendingQuotes, '#4f8cff')}
          ${statBox('Aprobadas', d.approvedQuotes, '#35c98f')}
          ${statBox('Rechazadas', d.rejectedQuotes, '#e73c50')}
          ${statBox('Total emitidas', d.totalQuotes, '#f5a524')}
        </div>
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  // CLIENTS (Nuestros Clientes)
  if (d.showClients) {
    const brandCards = d.brands.length > 0
      ? d.brands.slice(0, 4).map((b) => {
          const name = escapeHtml(b.name || b.brandName || 'Cliente');
          const desc = escapeHtml(b.service || b.description || 'Servicio de marketing digital y posicionamiento de marca.');
          const initials = name.slice(0, 2).toUpperCase();
          return `<div class="client-card">
            <div class="client-logo"><span>${initials}</span></div>
            <p class="client-name">${name}</p>
            <p class="client-desc">${desc}</p>
          </div>`;
        }).join('')
      : ['Cliente A','Cliente B','Cliente C','Cliente D'].map((n) =>
          `<div class="client-card"><div class="client-logo"><span>${n.slice(0,2)}</span></div><p class="client-name">${n}</p><p class="client-desc">Servicio de marketing digital y branding.</p></div>`
        ).join('');
    sections.push(`
      <section class="sheet">
        <div class="clients-header">
          <div class="clients-accent-block"></div>
          <div>
            <p class="clients-pre">NUESTROS</p>
            <h2 class="clients-title">CLIENTES</h2>
          </div>
        </div>
        <div class="clients-intro"><p>${escapeHtml(d.clientsIntro)}</p></div>
        <h3 class="clients-section-lbl">GENERAL</h3>
        <div class="clients-grid">${brandCards}</div>
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  // FINANCIAL CHART
  if (d.showFinancialChart) {
    sections.push(`
      <section class="sheet">
        <div class="clients-header">
          <div class="clients-accent-block"></div>
          <div>
            <p class="clients-pre">ESTADO</p>
            <h2 class="clients-title">FINANCIERO</h2>
          </div>
        </div>
        <p class="fin-chart-title">${escapeHtml(d.financialSummaryTitle)}</p>
        <p class="fin-chart-desc">${escapeHtml(d.financialSummaryDesc)}</p>
        <div class="fin-chart">${buildSvgChart()}</div>
        <div class="fin-bottom">
          <div class="fin-resume">
            <h3 class="fin-resume-lbl">RESUMEN</h3>
            <p class="fin-resume-text">${escapeHtml(d.financialResumeText)}</p>
          </div>
          <div class="fin-kpis">
            <div class="fin-kpi">
              <p class="fin-kpi-val">${escapeHtml(d.kpi1Value)}</p>
              <p class="fin-kpi-lbl">${escapeHtml(d.kpi1Label)}</p>
            </div>
            <div class="fin-kpi">
              <p class="fin-kpi-val">${escapeHtml(d.kpi2Value)}</p>
              <p class="fin-kpi-lbl">${escapeHtml(d.kpi2Label)}</p>
            </div>
          </div>
        </div>
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  // ANALYSIS
  if (d.showAnalysis && d.analysis.length > 0) {
    sections.push(`
      <section class="sheet">
        ${header('ANÁLISIS DEL MES', 'Insights automáticos')}
        <ul class="analysis-list">
          ${d.analysis.map((point, i) => `
            <li class="analysis-item">
              <span class="analysis-num">${String(i + 1).padStart(2, '0')}</span>
              <p class="analysis-text">${escapeHtml(point)}</p>
            </li>`).join('')}
        </ul>
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  // CONCLUSION
  if (d.showConclusion) {
    sections.push(`
      <section class="sheet">
        <h2 class="concl-title">CONCLUSIÓN</h2>
        <p class="concl-main">${escapeHtml(d.conclusionText)}</p>
        ${d.conclusionPoints.map((pt) => `
          <div class="concl-point">
            <h4 class="concl-point-title">${escapeHtml(pt.title)}</h4>
            <p class="concl-point-text">${escapeHtml(pt.text)}</p>
          </div>`).join('')}
        <div class="intro-stripe"></div>
        ${footer}
      </section>`);
  }

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<title>Reporte Mensual PixelBros · ${escapeHtml(d.monthLabel)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  @page{size:A4;margin:0}
  html,body{width:210mm;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;color:#111}
  .controls{position:fixed;top:14px;right:14px;z-index:99}
  .print-btn{background:#111827;color:#fff;border:0;border-radius:10px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer}
  .sheet{width:210mm;min-height:297mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;background:#fff;padding:14mm 16mm 26mm}
  .sheet:last-child{page-break-after:auto}
  .footer{position:absolute;left:0;right:0;bottom:0;background:#e73c50;display:flex;align-items:center;justify-content:space-between;padding:10px 16mm;font-size:10px;font-weight:800;letter-spacing:.04em;color:#fff}

  /* COVER */
  .cover-sheet{padding:0;display:flex;flex-direction:column}
  .cover-top{display:flex;align-items:center;justify-content:space-between;padding:10mm 14mm 0}
  .brand{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:900;letter-spacing:.1em}
  .brand img{width:28px;height:28px;object-fit:contain}
  .cover-date{font-size:10px;font-weight:800;color:#666}
  .cover-body{flex:1;padding:10mm 14mm 0;display:flex;flex-direction:column;justify-content:center}
  .cover-accent-line{width:60px;height:5px;background:#e73c50;margin-bottom:12mm}
  .cover-title{font-size:64px;font-weight:900;letter-spacing:.04em;line-height:1.05;color:#111}
  .cover-year{font-size:28px;font-weight:800;margin-top:6mm;color:#444}
  .cover-arrow{color:#e73c50}
  .cover-sub{font-size:12px;color:#666;margin-top:4mm}
  .cover-bottom{padding:6mm 14mm 22mm}

  /* INDEX */
  .index-title{font-size:54px;font-weight:900;letter-spacing:.04em;margin-bottom:6mm}
  .index-line{height:4px;background:#e73c50;margin-bottom:10mm}
  .index-num{min-width:36px;height:36px;background:#e73c50;color:#fff;font-size:13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;border-radius:6px}
  .index-list{list-style:none}
  .index-item{display:flex;align-items:center;gap:14px;padding:7px 10px;margin-bottom:4px;background:#f9f9f9;border-radius:6px}
  .index-num{min-width:36px;height:36px;background:#e73c50;color:#fff;font-size:13px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;border-radius:6px}
  .index-label{font-size:14px;font-weight:800;letter-spacing:.06em}

  /* SECTION HEADER */
  .section-header{display:flex;align-items:flex-start;gap:12px;margin-bottom:9mm}
  .header-accent{width:6px;min-height:54px;background:#e73c50;border-radius:3px;flex-shrink:0;margin-top:2px}
  .header-sub{font-size:9px;font-weight:800;letter-spacing:.18em;color:#e73c50;text-transform:uppercase;margin-bottom:3px}
  .header-title{font-size:40px;font-weight:900;letter-spacing:.04em;line-height:1}

  /* BODY */
  .body-text p{font-size:13px;line-height:1.7;color:#333;margin-bottom:8px}
  .intro-stripe{position:absolute;left:0;right:0;bottom:52px;height:14px;background:#06091b}

  /* STATS */
  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:4mm}
  .stat-box{background:#fafafa;border-top-width:3px;border-top-style:solid;border-radius:8px;padding:12px 10px;text-align:center}
  .stat-label{font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#666;margin-bottom:6px}
  .stat-value{font-size:20px;font-weight:900}

  /* BARS */
  .bars-section{margin-top:4mm;display:flex;flex-direction:column;gap:14px}
  .bar-row{display:flex;align-items:center;gap:10px}
  .bar-label{min-width:130px;font-size:11px;font-weight:700;color:#333}
  .bar-track{flex:1;height:10px;background:#f0f0f0;border-radius:99px;overflow:hidden}
  .bar-fill{height:100%;border-radius:99px;transition:width .3s}
  .bar-val{min-width:80px;text-align:right;font-size:11px;font-weight:800}

  /* PIPELINE */
  .pipeline-list{margin-top:4mm;display:flex;flex-direction:column;gap:12px}
  .pipeline-row{display:flex;flex-direction:column;gap:5px;background:#fafafa;border-radius:8px;padding:10px 12px}
  .pipeline-info{display:flex;justify-content:space-between;align-items:center}
  .pipeline-stage{font-size:12px;font-weight:800}
  .pipeline-meta{font-size:11px;color:#666}

  /* CRM */
  .crm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:4mm}
  .crm-card{border-width:3px;border-style:solid;border-radius:10px;padding:20px 10px;text-align:center;background:#fafafa}
  .crm-num{font-size:38px;font-weight:900}
  .crm-lbl{font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#666;margin-top:4px}

  /* ANALYSIS */
  .analysis-list{list-style:none;display:flex;flex-direction:column;gap:8px;margin-top:4mm}
  .analysis-item{display:flex;align-items:flex-start;gap:12px;background:#fafafa;border-radius:8px;padding:10px 12px}
  .analysis-num{min-width:28px;height:28px;background:#e73c50;color:#fff;font-size:11px;font-weight:900;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;flex-shrink:0}
  .analysis-text{font-size:12px;line-height:1.6;color:#333}

  /* MESSAGE */
  .message-quote{margin-top:10mm;padding:16px 20px;border-left:5px solid #e73c50;background:#fff9f9}
  .quote-mark{font-size:48px;line-height:1;color:#e73c50;font-family:Georgia,serif}
  .quote-text{font-size:22px;font-weight:900;letter-spacing:.04em;color:#111;margin-top:4px}

  /* CONCLUSION */
  .closing-box{margin-top:12mm;padding:20px;background:#111;border-radius:12px;text-align:center}
  .closing-brand{font-size:28px;font-weight:900;letter-spacing:.12em;color:#fff}
  .closing-sub{font-size:11px;color:#aaa;margin-top:4px}
  .concl-title{font-size:48px;font-weight:900;letter-spacing:.04em;margin-bottom:6mm}
  .concl-main{font-size:12px;line-height:1.7;color:#333;margin-bottom:6mm}
  .concl-point{margin-top:5mm;padding-bottom:4mm;border-bottom:1px solid #eee}
  .concl-point:last-child{border-bottom:none}
  .concl-point-title{font-size:18px;font-weight:900;letter-spacing:.06em;margin-bottom:2mm}
  .concl-point-text{font-size:12px;line-height:1.65;color:#444}

  /* CLIENTS */
  .clients-header{display:flex;align-items:flex-end;gap:10px;margin-bottom:4mm}
  .clients-accent-block{width:18px;height:44px;background:#e73c50;border-radius:3px;flex-shrink:0;margin-bottom:4px}
  .clients-pre{font-size:14px;font-weight:800;letter-spacing:.14em;color:#555;text-transform:uppercase}
  .clients-title{font-size:46px;font-weight:900;letter-spacing:.04em;line-height:1;color:#111}
  .clients-intro p{font-size:12px;line-height:1.65;color:#555;margin-bottom:4mm}
  .clients-section-lbl{font-size:16px;font-weight:900;letter-spacing:.06em;margin-bottom:3mm;padding-bottom:2mm;border-bottom:2px solid #e73c50}
  .clients-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 18px;margin-top:3mm}
  .client-card{display:flex;flex-direction:column;gap:4px}
  .client-logo{width:48px;height:48px;border-radius:10px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#666;margin-bottom:2px}
  .client-name{font-size:11px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:#111}
  .client-desc{font-size:10px;line-height:1.55;color:#666}

  /* FINANCIAL CHART */
  .fin-chart-title{font-size:15px;font-weight:800;margin-bottom:2px;color:#111}
  .fin-chart-desc{font-size:10px;color:#888;margin-bottom:4mm}
  .fin-chart{background:#fafafa;border:1px solid #eee;border-radius:8px;padding:10px;margin-bottom:4mm}
  .fin-bottom{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:start}
  .fin-resume-lbl{font-size:18px;font-weight:900;letter-spacing:.04em;margin-bottom:3mm}
  .fin-resume-text{font-size:11px;line-height:1.65;color:#444}
  .fin-kpis{display:flex;flex-direction:column;gap:10px;min-width:100px}
  .fin-kpi{text-align:right}
  .fin-kpi-val{font-size:36px;font-weight:900;color:#e73c50;line-height:1}
  .fin-kpi-lbl{font-size:9px;color:#888;line-height:1.4;margin-top:2px}

  @media print{
    .controls{display:none}
    body,.sheet,.footer{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .sheet{break-after:page}
  }
</style>
</head>
<body>
<div class="controls"><button class="print-btn" onclick="window.print()">⬇ Descargar PDF</button></div>
${sections.join('\n')}
</body>
</html>`;
};

const openTab = (html) => {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const tab = window.open(url, '_blank');
  if (!tab) { URL.revokeObjectURL(url); throw new Error('Habilita pop-ups para continuar.'); }
  tab.addEventListener('load', () => setTimeout(() => URL.revokeObjectURL(url), 1200), { once: true });
  return tab;
};

export const viewReportVoucher = (stats, meta) => openTab(buildReportHtml(stats, meta));
export const printReportVoucher = (stats, meta) => {
  const tab = openTab(buildReportHtml(stats, meta));
  const tryPrint = () => { try { tab.focus(); tab.print(); } catch {} };
  tab.addEventListener('load', tryPrint, { once: true });
  setTimeout(tryPrint, 800);
};
