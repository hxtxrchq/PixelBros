import logoIconPixel from '../../images/LogoIconPixel.png';

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const toMoney = (value) =>
  `S/ ${Number(value || 0).toLocaleString('es-PE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const toDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return new Date().toLocaleDateString('es-PE');
  return parsed.toLocaleDateString('es-PE');
};

const toAbsoluteAssetUrl = (path) => {
  const raw = String(path || '').trim();
  if (!raw) return '';
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  const base = (import.meta.env.BASE_URL || '/').replace(/^\/+/, '').replace(/\/+$/, '');
  const origin = window.location.origin;
  return new URL(raw.replace(/^\/+/, ''), base ? `${origin}/${base}/` : `${origin}/`).toString();
};

const buildInvoiceModel = (record) => {
  const subtotal = Number(record.monthlyAmount) || 0;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes;
  const creatorName = record.createdByName || record.responsible || 'Equipo comercial';

  return {
    invoiceNumber: record.invoiceNumber || `FV-${record.id}`,
    invoiceDate: record.invoiceDate || record.startDate || new Date().toISOString().slice(0, 10),
    client: record.client || '-',
    company: record.company || '-',
    service: record.service || 'Servicio',
    responsible: creatorName,
    responsibleRole: record.createdByRole || 'Usuario',
    billingStatus: record.billingStatus || 'Facturado',
    quantity: 1,
    subtotal,
    taxes,
    total,
    footerPhone: '(51) 1234-5678',
    footerWeb: 'www.pixelbros.com',
    footerEmail: 'hola@pixelbros.com',
  };
};

const buildInvoiceHtml = (record) => {
  const data = buildInvoiceModel(record);

  return `
  <!doctype html>
  <html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Factura ${escapeHtml(data.invoiceNumber)}</title>
    <style>
      :root {
        --paper: #f6f7fb;
        --ink: #111111;
        --muted: #4b5563;
        --red: #e73c50;
        --navy: #06091b;
        --indigo: #1e1c50;
      }
      * { box-sizing: border-box; }
      @page { size: A4; margin: 0; }
      html, body {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        padding: 0;
        background: var(--paper);
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      body { font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif; color: var(--ink); }
      .controls { position: fixed; right: 14px; top: 14px; z-index: 40; }
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
        padding: 14mm 16mm 0;
        position: relative;
        overflow: hidden;
        background: linear-gradient(180deg, #ffffff 0%, #fbfbff 74%, #f7f9ff 100%);
      }
      .brand-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .brand img {
        width: 34px;
        height: 34px;
        object-fit: contain;
      }
      .invoice-head {
        text-align: right;
      }
      .invoice-head h1 {
        margin: 0;
        font-size: 48px;
        line-height: 0.95;
        letter-spacing: 0.04em;
      }
      .month-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 10px;
        padding: 4px 12px;
        border-radius: 999px;
        background: var(--red);
        color: white;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.18em;
      }
      .client-grid {
        margin-top: 26px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }
      .client-name {
        margin: 0;
        font-size: 22px;
        font-weight: 900;
        letter-spacing: 0.02em;
      }
      .client-sub {
        margin: 4px 0 0;
        font-size: 12px;
        font-weight: 700;
        color: #111827;
      }
      .meta-block {
        text-align: left;
      }
      .meta-block p {
        margin: 0;
        font-size: 12px;
        font-weight: 800;
        line-height: 1.35;
      }
      .table-head {
        margin-top: 22px;
        display: grid;
        grid-template-columns: 1.7fr 0.9fr 0.7fr 0.9fr;
        gap: 0;
        padding: 7px 8px;
        background: var(--red);
        color: white;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      .line-item {
        display: grid;
        grid-template-columns: 1.7fr 0.9fr 0.7fr 0.9fr;
        gap: 0;
        padding: 14px 8px 10px;
        border-bottom: 1px solid rgba(17,24,39,0.18);
        font-size: 12px;
      }
      .line-item strong { display: block; font-weight: 900; }
      .line-item p { margin: 0; color: #374151; font-size: 11px; }
      .totals {
        margin-top: 18px;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 16px;
      }
      .totals-box {
        margin-left: auto;
        width: min(320px, 100%);
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 7px 0;
        font-size: 12px;
        font-weight: 900;
      }
      .total-row.final {
        border-top: 1px solid rgba(17,24,39,0.35);
        margin-top: 4px;
        padding-top: 10px;
        font-size: 14px;
      }
      .details {
        margin-top: 24px;
      }
      .details h3 {
        margin: 0 0 6px;
        font-size: 15px;
        font-weight: 900;
      }
      .details p {
        margin: 0;
        font-size: 11px;
        line-height: 1.45;
      }
      .footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 18px;
        color: white;
        font-size: 11px;
        font-weight: 800;
        text-align: center;
        background: var(--red);
      }
      .footer span {
        padding: 0;
        background: transparent;
        border: 0;
        border-radius: 0;
        min-height: 0;
        backdrop-filter: none;
      }
      @media print {
        .controls { display: none; }
        body, .sheet { background: white; }
      }
    </style>
  </head>
  <body>
    <div class="controls">
      <button class="print-btn" onclick="window.print()">Descargar PDF</button>
    </div>

    <section class="sheet">
      <div class="brand-row">
        <div class="brand">
          <img src="${escapeHtml(toAbsoluteAssetUrl(logoIconPixel))}" alt="PixelBros" />
          <span>pixelbros</span>
        </div>
        <div class="invoice-head">
          <h1>FACTURA</h1>
          <div class="month-chip">${escapeHtml(new Date(data.invoiceDate).toLocaleDateString('es-PE', { month: 'short' }).toUpperCase())} ${escapeHtml(new Date(data.invoiceDate).toLocaleDateString('es-PE', { year: '2-digit' }))}</div>
        </div>
      </div>

      <div class="client-grid">
        <div>
          <p class="client-name">${escapeHtml(data.client)}</p>
          <p class="client-sub">${escapeHtml(data.company)}</p>
          <p class="client-sub">${escapeHtml(data.invoiceNumber)}</p>
        </div>
        <div class="meta-block">
          <p>Fecha: ${escapeHtml(toDate(data.invoiceDate))}</p>
          <p>Estado: ${escapeHtml(data.billingStatus)}</p>
          <p>Emitida por: ${escapeHtml(data.responsible)}</p>
          <p>Rol: ${escapeHtml(data.responsibleRole)}</p>
        </div>
      </div>

      <div class="table-head">
        <span>Descripción</span>
        <span>Precio</span>
        <span>Cant.</span>
        <span>Precio</span>
      </div>
      <div class="line-item">
        <div>
          <strong>${escapeHtml(data.service)}</strong>
          <p>Servicio facturado del periodo seleccionado.</p>
        </div>
        <div>${escapeHtml(toMoney(data.subtotal))}</div>
        <div>${escapeHtml(String(data.quantity))} unidad</div>
        <div>${escapeHtml(toMoney(data.subtotal))}</div>
      </div>

      <div class="totals">
        <div class="details">
          <h3>DETALLES DE PAGO</h3>
          <p>Registro de facturación comercial de PixelBros. El PDF refleja el servicio, el periodo y el estado de pago para seguimiento interno y consulta rápida.</p>
          <p style="margin-top:6px;">Periodo: ${escapeHtml(toDate(data.invoiceDate))}</p>
        </div>

        <div class="totals-box">
          <div class="total-row"><span>SUBTOTAL</span><span>${escapeHtml(toMoney(data.subtotal))}</span></div>
          <div class="total-row"><span>IMPUESTOS</span><span>${escapeHtml(toMoney(data.taxes))}</span></div>
          <div class="total-row final"><span>TOTAL</span><span>${escapeHtml(toMoney(data.total))}</span></div>
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

const openInvoiceTab = (html) => {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const tab = window.open(blobUrl, '_blank');

  if (!tab) {
    URL.revokeObjectURL(blobUrl);
    throw new Error('No se pudo abrir la factura en una nueva pestaña. Habilita pop-ups para continuar.');
  }

  tab.addEventListener('load', () => {
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1200);
  }, { once: true });

  return tab;
};

export const viewInvoiceVoucher = (record) => {
  openInvoiceTab(buildInvoiceHtml(record));
};

export const printInvoiceVoucher = (record) => {
  const tab = openInvoiceTab(buildInvoiceHtml(record));
  const tryPrint = () => {
    try {
      tab.focus();
      tab.print();
    } catch {
      // no-op
    }
  };

  tab.addEventListener('load', tryPrint, { once: true });
  window.setTimeout(tryPrint, 800);
};
