import logoIconPixel from '../../images/LogoIconPixel.png';
import { TEAM_PROFILES } from '../../config/teamProfiles';

const VOUCHER_META_KEY = 'pixelbros-quote-voucher-meta';

const defaultTeam = TEAM_PROFILES.map((member) => ({
  name: member.name,
  role: member.role,
  image: member.images?.[0] || '',
}));

const defaultBudgetBlocks = [
  {
    title: 'Investigacion y Branding',
    hours: 7,
    cost: 1000,
    slots: [
      { title: 'Brief / Entrevista', description: 'Levantamiento de informacion y objetivos.' },
      { title: 'Bocetos / Exploracion', description: 'Ideas visuales y caminos de concepto.' },
      { title: 'Manual de identidad', description: 'Lineamientos visuales y de uso.' },
    ],
  },
  {
    title: 'Diseno y Programacion',
    hours: 17,
    cost: 10000,
    slots: [
      { title: 'Prototipo', description: 'Vista previa y estructura inicial.' },
      { title: 'Pruebas', description: 'Validacion y ajustes de calidad.' },
      { title: 'Programacion', description: 'Desarrollo e integracion final.' },
    ],
  },
  {
    title: 'Lanzamiento de Campana',
    hours: 7,
    cost: 5000,
    slots: [
      { title: 'SEO inicial', description: 'Configuracion y optimizacion base.' },
      { title: 'Anuncios', description: 'Ejecucion de campañas y pauta.' },
    ],
  },
];

const toMoney = (value) =>
  `S/ ${Number(value || 0).toLocaleString('es-PE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const toDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toLocaleDateString('es-PE');
  }

  return parsed.toLocaleDateString('es-PE');
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const getAppBaseUrl = () => {
  const base = (import.meta.env.BASE_URL || '/').replace(/^\/+/, '').replace(/\/+$/, '');
  const origin = window.location.origin;
  return base ? `${origin}/${base}/` : `${origin}/`;
};

const toAbsoluteAssetUrl = (path) => {
  const raw = String(path || '').trim();
  if (!raw) return '';

  if (/^(https?:|data:|blob:)/i.test(raw)) {
    return raw;
  }

  const base = getAppBaseUrl();
  const clean = raw.replace(/^\/+/, '');
  return new URL(clean, base).toString();
};

const safeStorage = {
  get() {
    try {
      const raw = window.localStorage.getItem(VOUCHER_META_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  },
  set(value) {
    try {
      window.localStorage.setItem(VOUCHER_META_KEY, JSON.stringify(value));
    } catch {
      // no-op
    }
  },
};

export const saveQuoteVoucherMeta = (quoteId, meta) => {
  if (!quoteId) return;
  const data = safeStorage.get();
  data[String(quoteId)] = meta;
  safeStorage.set(data);
};

const getQuoteVoucherMeta = (quote) => {
  if (!quote?.id) return {};
  const data = safeStorage.get();
  return data[String(quote.id)] || {};
};

const buildQuoteModel = (quote) => {
  const localMeta = getQuoteVoucherMeta(quote);
  const budgetBlocks = Array.isArray(localMeta.budgetBlocks) && localMeta.budgetBlocks.length > 0
    ? localMeta.budgetBlocks.map((block) => ({
        ...block,
        slots: Array.isArray(block.slots) ? block.slots : [],
      }))
    : defaultBudgetBlocks;

  const totalHours = budgetBlocks.reduce((sum, block) => sum + Number(block.hours || 0), 0);
  const totalCost = budgetBlocks.reduce((sum, block) => sum + Number(block.cost || 0), 0);

  return {
    quoteNumber: quote.quoteNumber || quote.id || '-',
    quoteDate: localMeta.quoteDate || toDate(quote.createdAt),
    status: quote.status || 'Enviada',
    clientName: localMeta.clientName || quote.client || '-',
    companyName: localMeta.companyName || quote.company || '-',
    clientRole: localMeta.clientRole || 'Representante Comercial',
    preparedBy: localMeta.preparedBy || quote?.createdBy?.fullName || 'PixelBros',
    preparedRole: localMeta.preparedRole || 'Equipo PixelBros',
    duration: localMeta.duration || quote.duration || `${quote.durationMonths || 1} meses`,
    roi: localMeta.roi || '900%',
    conversionRate: localMeta.conversionRate || '65%',
    newClients: localMeta.newClients || '1000',
    challenge:
      localMeta.challenge ||
      'Conectar la marca con su audiencia ideal de forma consistente y medible.',
    solution:
      localMeta.solution ||
      'Implementar estrategia integral con branding, contenidos y performance.',
    whoWeAre:
      localMeta.whoWeAre ||
      'Somos PixelBros, una agencia enfocada en resultados comerciales, posicionamiento y experiencias digitales de alto impacto.',
    teamIntro:
      localMeta.teamIntro ||
      'Equipo multidisciplinario especializado en branding, marketing digital y ejecucion creativa.',
    methodologyIntro:
      localMeta.methodologyIntro ||
      'Nuestra metodologia combina diagnostico, ejecucion iterativa y optimizacion continua para garantizar resultados.',
    methodologySteps: Array.isArray(localMeta.methodologySteps) && localMeta.methodologySteps.length > 0
      ? localMeta.methodologySteps
      : [
          'Diagnostico y descubrimiento de oportunidades con enfoque comercial.',
          'Implementacion creativa con objetivos claros por fase.',
          'Medicion, mejora continua y escalamiento de acciones.',
        ],
    team: (Array.isArray(localMeta.team) && localMeta.team.length > 0 ? localMeta.team : defaultTeam).map(
      (member) => ({
        ...member,
        image: toAbsoluteAssetUrl(member.image),
      }),
    ),
    budgetBlocks,
    totalHours: totalHours || Number(quote.durationMonths || 0),
    totalCost: totalCost || Number(quote.finalPrice || 0),
    footerPhone: localMeta.footerPhone || '(51) 1234-5678',
    footerWeb: localMeta.footerWeb || 'www.pixelbros.com',
    footerEmail: localMeta.footerEmail || 'pixelbrosperu@outlook.com',
  };
};

const buildQuoteVoucherHtml = (quote) => {
  const data = buildQuoteModel(quote);

  return `
  <!doctype html>
  <html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Cotizacion ${escapeHtml(data.quoteNumber)}</title>
    <style>
      :root {
        --paper: #f6f7fb;
        --card: #ffffff;
        --ink: #111111;
        --muted: #4b5563;
        --red: #c42b3c;
        --blue: #4f8cff;
        --brand-red: #e73c50;
        --brand-navy: #06091b;
        --brand-indigo: #1e1c50;
      }
      * { box-sizing: border-box; }
      @page {
        size: A4;
        margin: 0;
      }
      html, body {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 0;
        background: var(--paper);
      }
      body {
        margin: 0;
        background: var(--paper);
        color: var(--ink);
        font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
      }
      .controls {
        position: fixed;
        right: 14px;
        top: 14px;
        z-index: 40;
      }
      .print-btn {
        border: 0;
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        background: #111827;
        color: white;
      }
      .sheet {
        width: 210mm;
        height: 297mm;
        margin: 0;
        padding: 16mm 18mm 22mm;
        background: var(--paper);
        position: relative;
        overflow: hidden;
        page-break-after: always;
      }
      .sheet:last-child { page-break-after: auto; }
      .footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--brand-red);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 18px;
        border-top: 0;
        box-shadow: none;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.03em;
        text-align: center;
        color: #fff;
        isolation: isolate;
      }
      .footer::after {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: rgba(255, 255, 255, 0.03);
        z-index: 0;
      }
      .footer span {
        position: relative;
        z-index: 1;
        display: inline-block;
        padding: 0;
        border-radius: 0;
        background: transparent;
        border: 0;
        min-height: 0;
        backdrop-filter: none;
      }
      .footer span::before {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.92);
      }
      .topline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 6mm;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.08em;
      }
      .brand img {
        width: 26px;
        height: 26px;
        object-fit: contain;
      }
      .avatar {
        width: 46px;
        height: 46px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--red), var(--blue));
        color: #fff;
        font-size: 14px;
        font-weight: 900;
        letter-spacing: 0.04em;
      }
      .date { font-size: 10px; font-weight: 800; }
      .big-center {
        margin: 44mm auto 0;
        border: 5px solid var(--blue);
        max-width: 145mm;
        padding: 18px 16px 16px;
        text-align: center;
        background: rgba(255,255,255,0.5);
      }
      .big-center h1 {
        margin: 0;
        font-size: 54px;
        letter-spacing: 0.22em;
        font-weight: 800;
      }
      .bottom-pair {
        position: absolute;
        left: 16mm;
        right: 16mm;
        bottom: 42mm;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12mm;
        font-size: 12px;
      }
      .bottom-pair p { margin: 2px 0; }
      .section-title {
        margin-top: 10mm;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .section-title .arrow {
        color: var(--red);
        font-size: 36px;
        line-height: 1;
        font-weight: 900;
      }
      .section-title h2 {
        margin: 0;
        font-size: 48px;
        letter-spacing: 0.08em;
        line-height: 1;
      }
      .section-mini { margin-top: 18px; }
      .section-mini h3 {
        margin: 0 0 10px;
        font-size: 34px;
        letter-spacing: 0.04em;
        font-weight: 800;
      }
      .section-mini p {
        margin: 0 0 8px;
        font-size: 14px;
        line-height: 1.6;
        max-width: 100%;
      }
      .team-grid {
        margin-top: 30px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 28px 22px;
        max-width: 100%;
      }
      .team-card { text-align: center; }
      .team-card img {
        width: 104px;
        height: 104px;
        object-fit: cover;
        border-radius: 18px;
        filter: saturate(1.05) contrast(1.02);
        box-shadow: 0 8px 18px rgba(17, 24, 39, 0.12);
      }
      .team-card .name {
        margin-top: 8px;
        font-size: 11px;
        font-weight: 800;
        line-height: 1.1;
      }
      .team-card .role {
        font-size: 9px;
        font-weight: 700;
        color: var(--muted);
      }
      .method-intro {
        margin-top: 16px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid rgba(79, 140, 255, 0.18);
        background: rgba(255,255,255,0.55);
      }
      .method-intro p {
        margin: 0;
        font-size: 14px;
        line-height: 1.55;
      }
      .step { margin-top: 10px; }
      .step h4 {
        margin: 0 0 4px;
        font-size: 32px;
        font-weight: 800;
      }
      .step p {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        padding: 8px 10px;
        border-radius: 10px;
        background: rgba(255,255,255,0.56);
      }
      .budget-table {
        margin-top: 22px;
      }
      .budget-summary {
        margin-top: 18px;
      }
      .budget-block {
        margin-bottom: 10px;
      }
      .budget-head {
        border: 3px solid var(--blue);
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 8px;
        padding: 4px 8px;
        font-size: 15px;
        font-weight: 800;
      }
      .budget-items {
        padding: 8px 4px 3px;
      }
      .budget-slot {
        border: 1px solid rgba(79, 140, 255, 0.14);
        border-radius: 10px;
        padding: 8px 10px;
        margin-bottom: 6px;
        background: rgba(255, 255, 255, 0.84);
      }
      .budget-slot-title {
        font-size: 12px;
        font-weight: 800;
        margin: 0 0 2px;
      }
      .budget-slot-desc {
        font-size: 11px;
        line-height: 1.35;
        margin: 0;
        color: #374151;
      }
      .budget-total {
        border: 3px solid var(--red);
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 8px;
        padding: 6px 8px;
        font-size: 16px;
        font-weight: 800;
        margin-top: 8px;
      }
      .cover-number {
        position: absolute;
        right: 16mm;
        top: 18mm;
        font-size: 10px;
        font-weight: 800;
      }
      @media print {
        .controls { display: none; }
        body { background: white; }
        .sheet { margin: 0; }
        body, .sheet, .footer {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .sheet {
          break-after: page;
        }
      }
    </style>
  </head>
  <body>
    <div class="controls">
      <button class="print-btn" onclick="window.print()">Descargar PDF</button>
    </div>

    <section class="sheet">
      <div class="cover-number">${escapeHtml(data.quoteNumber)} · ${escapeHtml(data.status)}</div>
      <div class="topline">
        <div class="brand">
          <img src="${escapeHtml(toAbsoluteAssetUrl(logoIconPixel))}" alt="PixelBros" />
          <span>pixelbros</span>
        </div>
        <div class="date">${escapeHtml(data.quoteDate)}</div>
      </div>

      <div class="big-center">
        <h1>PROPUESTA</h1>
      </div>

      <div class="bottom-pair">
        <div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="avatar">${escapeHtml(String(data.preparedBy || 'U').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase())}</div>
            <div>
              <p><strong>Preparado por:</strong> ${escapeHtml(data.preparedBy)}</p>
              <p>${escapeHtml(data.preparedRole)}</p>
            </div>
          </div>
          <p style="margin-top:6px;">${escapeHtml(data.footerPhone)}</p>
        </div>
        <div>
          <p><strong>Preparado para:</strong> ${escapeHtml(data.clientName)}</p>
          <p>${escapeHtml(data.clientRole)}</p>
          <p>${escapeHtml(data.companyName)}</p>
        </div>
      </div>

      <footer class="footer">
        <span>${escapeHtml(data.footerPhone)}</span>
        <span>${escapeHtml(data.footerWeb)}</span>
        <span>${escapeHtml(data.footerEmail)}</span>
      </footer>
    </section>

    <section class="sheet">
      <div class="section-title">
        <span class="arrow">→</span>
        <h2>INTRODUCCION</h2>
      </div>

      <div class="section-mini">
        <h3>QUIENES SOMOS</h3>
        <p>${escapeHtml(data.whoWeAre)}</p>
      </div>

      <div class="section-mini">
        <h3>CONOCE AL EQUIPO</h3>
        <p>${escapeHtml(data.teamIntro)}</p>
        <div class="team-grid">
          ${data.team
            .slice(0, 6)
            .map(
              (member) => `
                <article class="team-card">
                  ${member.image
                    ? `<img src="${escapeHtml(member.image)}" alt="${escapeHtml(member.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />`
                    : ''}
                  <div style="display:${member.image ? 'none' : 'inline-flex'};width:96px;height:96px;border-radius:18px;align-items:center;justify-content:center;background:#e5e7eb;color:#111827;font-weight:800;">${escapeHtml(String(member.name || '?').charAt(0).toUpperCase())}</div>
                  <div class="name">${escapeHtml(member.name)}</div>
                  <div class="role">${escapeHtml(member.role)}</div>
                </article>
              `,
            )
            .join('')}
        </div>
      </div>

      <footer class="footer">
        <span>${escapeHtml(data.footerPhone)}</span>
        <span>${escapeHtml(data.footerWeb)}</span>
        <span>${escapeHtml(data.footerEmail)}</span>
      </footer>
    </section>

    <section class="sheet">
      <div class="section-title">
        <span class="arrow">→</span>
        <h2>METODOLOGIA</h2>
      </div>

      <div class="method-intro">
        <p>${escapeHtml(data.methodologyIntro)}</p>
      </div>

      ${data.methodologySteps
        .slice(0, 3)
        .map(
          (step, index) => `
            <article class="step">
              <h4>PASO ${index + 1}</h4>
              <p>${escapeHtml(step)}</p>
            </article>
          `,
        )
        .join('')}

      <footer class="footer">
        <span>${escapeHtml(data.footerPhone)}</span>
        <span>${escapeHtml(data.footerWeb)}</span>
        <span>${escapeHtml(data.footerEmail)}</span>
      </footer>
    </section>

    <section class="sheet">
      <div class="section-title">
        <span class="arrow">→</span>
        <h2>PRESUPUESTO</h2>
      </div>

      <div class="section-mini budget-summary">
        <p><strong>Duracion:</strong> ${escapeHtml(data.duration)} · <strong>ROI:</strong> ${escapeHtml(data.roi)} · <strong>Tasa:</strong> ${escapeHtml(data.conversionRate)} · <strong>Clientes nuevos:</strong> ${escapeHtml(data.newClients)}</p>
        <p style="margin-top:6px;"><strong>El reto:</strong> ${escapeHtml(data.challenge)}</p>
        <p style="margin-top:4px;"><strong>La solucion:</strong> ${escapeHtml(data.solution)}</p>
      </div>

      <div class="budget-table">
        ${data.budgetBlocks
          .map(
            (block) => `
              <section class="budget-block">
                <div class="budget-head">
                  <span>${escapeHtml(block.title || 'Bloque')}</span>
                  <span>${escapeHtml(String(block.hours || 0))} HORAS</span>
                  <span>${escapeHtml(toMoney(block.cost))}</span>
                </div>
                <div class="budget-items">
                  ${(block.slots || [])
                    .map(
                      (slot, index) => `
                        <div class="budget-slot">
                          <p class="budget-slot-title">Slot ${index + 1} · ${escapeHtml(slot.title || 'Sin titulo')}</p>
                          <p class="budget-slot-desc">${escapeHtml(slot.description || 'Sin descripcion.')}</p>
                        </div>
                      `,
                    )
                    .join('')}
                </div>
              </section>
            `,
          )
          .join('')}

        <div class="budget-total">
          <span>TOTAL</span>
          <span>${escapeHtml(String(data.totalHours))} HORAS</span>
          <span>${escapeHtml(toMoney(data.totalCost))}</span>
        </div>
      </div>

      <footer class="footer">
        <span>${escapeHtml(data.footerPhone)}</span>
        <span>${escapeHtml(data.footerWeb)}</span>
        <span>${escapeHtml(data.footerEmail)}</span>
      </footer>
    </section>
  </body>
  </html>
  `;
};

export const printQuoteVoucher = (quote) => buildQuoteVoucherHtml(quote);

const openVoucherTab = (html) => {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const tab = window.open(blobUrl, '_blank');

  if (!tab) {
    URL.revokeObjectURL(blobUrl);
    throw new Error('No se pudo abrir la cotizacion en una nueva pestaña. Habilita pop-ups para continuar.');
  }

  tab.addEventListener('load', () => {
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1200);
  }, { once: true });

  return tab;
};

export const viewQuoteVoucher = (quote) => {
  const html = buildQuoteVoucherHtml(quote);
  openVoucherTab(html);
};

export const printVoucherDirect = (quote) => {
  const html = buildQuoteVoucherHtml(quote);
  const targetWindow = openVoucherTab(html);

  const tryPrint = () => {
    try {
      targetWindow.focus();
      targetWindow.print();
    } catch {
      // no-op
    }
  };

  targetWindow.addEventListener('load', tryPrint, { once: true });
  window.setTimeout(tryPrint, 800);
};
