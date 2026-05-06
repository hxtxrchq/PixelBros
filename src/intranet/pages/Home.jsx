import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntranet } from '../context/IntranetContext';

const paymentStyles = {
  Pagado: 'bg-[#35c98f]/15 text-[#90f0cb] ring-1 ring-inset ring-[#35c98f]/25',
  Pendiente: 'bg-[#f5a524]/15 text-[#ffd38f] ring-1 ring-inset ring-[#f5a524]/25',
  'Vence pronto': 'bg-[#e73c50]/15 text-[#ff9aa6] ring-1 ring-inset ring-[#e73c50]/25',
};

const toMoney = (value) =>
  `S/ ${Number(value || 0).toLocaleString('es-PE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatDelta = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const signed = Number(value);
  const abs = Math.abs(signed);
  const label = `${abs.toFixed(1)}%`;
  if (signed === 0) return label;
  return `${signed > 0 ? '+' : '-'}${label}`;
};

const getMonthKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

const parseISODateSafe = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const buildRecentMonthKeys = (count, fromDate = new Date()) => {
  const base = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
  const keys = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const dt = new Date(base.getFullYear(), base.getMonth() - i, 1);
    keys.push(getMonthKey(dt));
  }
  return keys;
};

function useCountUp(target, { durationMs = 900 } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const to = Number(target) || 0;
    const from = value;
    if (from === to) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = clamp((now - start) / durationMs, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

function Sparkline({ values, stroke, fill, isDark }) {
  const safeValues = Array.isArray(values) ? values.filter((v) => Number.isFinite(v)) : [];
  const max = safeValues.length ? Math.max(...safeValues) : 0;
  const min = safeValues.length ? Math.min(...safeValues) : 0;
  const span = max - min || 1;

  const points = safeValues
    .map((v, idx) => {
      const x = (idx / Math.max(1, safeValues.length - 1)) * 100;
      const y = 30 - ((v - min) / span) * 30;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const area = `${points} 100,30 0,30`;

  return (
    <svg viewBox="0 0 100 30" className="h-7 w-20" role="img" aria-label="Tendencia">
      <path d={`M ${area}`} fill={fill} fillOpacity={isDark ? 0.18 : 0.12} />
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

function DeltaBadge({ delta, isDark }) {
  const val = Number(delta);
  const isNeutral = !Number.isFinite(val) || val === 0;
  const isUp = Number.isFinite(val) && val > 0;

  const base = isDark
    ? 'bg-white/[0.06] text-white/70 ring-1 ring-inset ring-white/10'
    : 'bg-slate-900/5 text-slate-600 ring-1 ring-inset ring-slate-900/10';

  const up = isDark
    ? 'bg-[#35c98f]/15 text-[#90f0cb] ring-1 ring-inset ring-[#35c98f]/25'
    : 'bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20';

  const down = isDark
    ? 'bg-[#e73c50]/15 text-[#ff9aa6] ring-1 ring-inset ring-[#e73c50]/25'
    : 'bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/20';

  const cls = isNeutral ? base : isUp ? up : down;
  const arrow = isNeutral ? '•' : isUp ? '▲' : '▼';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${cls}`}>
      <span className="leading-none">{arrow}</span>
      <span className="leading-none">{formatDelta(delta)}</span>
    </span>
  );
}

function KpiCard({ label, value, subValue, delta, spark, tone, isDark }) {
  const cardClass = isDark
    ? 'relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1535]/70 shadow-[0_14px_38px_rgba(2,6,23,0.55)]'
    : 'relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.10)]';

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
      className={cardClass}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone} ${
          isDark ? 'opacity-60' : 'opacity-90'
        }`}
      />
      <div className="relative flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className={`text-[11px] font-black uppercase tracking-[0.22em] ${isDark ? 'text-white/55' : 'text-slate-500'}`}>{label}</p>
          <p className={`mt-2 truncate text-2xl font-black tracking-tight md:text-[28px] ${isDark ? 'text-white' : 'text-[#0b1220]'}`}>{value}</p>
          {subValue ? (
            <p className={`mt-1 text-xs font-semibold ${isDark ? 'text-white/60' : 'text-slate-600'}`}>{subValue}</p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <DeltaBadge delta={delta} isDark={isDark} />
          <Sparkline values={spark} stroke="#e73c50" fill="#e73c50" isDark={isDark} />
        </div>
      </div>
    </motion.article>
  );
}

function AreaTrendChart({ series, isDark }) {
  const safe = Array.isArray(series) ? series : [];
  let values = safe.map((p) => Number(p.value) || 0);
  if (values.length < 2) {
    const seed = values[0] ?? 0;
    values = [seed * 0.65, seed * 0.78, seed * 0.72, seed * 0.86, seed * 0.82, seed * 0.94, seed * 1.02, seed || 0];
  }
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;
  const span = max - min || 1;

  const w = 720;
  const h = 260;
  const padX = 22;
  const padY = 18;

  const pointsArray = values
    .map((v, idx) => {
      const x = padX + (idx / Math.max(1, values.length - 1)) * (w - padX * 2);
      const y = padY + (1 - (v - min) / span) * (h - padY * 2);
      return [x, y];
    })
    .map(([x, y]) => [Number(x.toFixed(2)), Number(y.toFixed(2))]);

  const points = pointsArray.map(([x, y]) => `${x},${y}`).join(' ');

  const areaPath = `M ${padX},${h - padY} L ${points} L ${w - padX},${h - padY} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-64 w-full" role="img" aria-label="Tendencia de facturación">
      <defs>
        <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e73c50" stopOpacity={isDark ? 0.28 : 0.20} />
          <stop offset="100%" stopColor="#e73c50" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineStroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#6c84ff" />
          <stop offset="55%" stopColor="#e73c50" />
          <stop offset="100%" stopColor="#35c98f" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={w} height={h} fill={isDark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.02)'} />
      <g stroke={isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)'} strokeDasharray="5 6">
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1={padX} y1={padY + (h - padY * 2) * t} x2={w - padX} y2={padY + (h - padY * 2) * t} />
        ))}
      </g>
      <path d={areaPath} fill="url(#areaFill)" />
      <polyline points={points} fill="none" stroke="url(#lineStroke)" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
      {pointsArray.map(([x, y], idx) => (
        <circle
          key={idx}
          cx={x}
          cy={y}
          r={idx === pointsArray.length - 1 ? 4 : 3}
          fill={idx === pointsArray.length - 1 ? '#e73c50' : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.55)')}
          opacity={idx === pointsArray.length - 1 ? 1 : 0.55}
        />
      ))}
    </svg>
  );
}

function ProgressRing({ progress, label, isDark }) {
  const pct = clamp(progress, 0, 1);
  const radius = 28;
  const c = 2 * Math.PI * radius;
  const dash = c * pct;
  const gap = c - dash;
  const pctLabel = `${Math.round(pct * 100)}%`;

  return (
    <div className="flex items-center gap-4">
      <svg width="74" height="74" viewBox="0 0 74 74" role="img" aria-label="Avance hacia meta">
        <circle cx="37" cy="37" r={radius} stroke={isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.14)'} strokeWidth="8" fill="none" />
        <circle
          cx="37"
          cy="37"
          r={radius}
          stroke="#e73c50"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          transform="rotate(-90 37 37)"
        />
      </svg>
      <div>
        <p className={`text-[11px] font-black uppercase tracking-[0.22em] ${isDark ? 'text-white/55' : 'text-slate-500'}`}>{label}</p>
        <p className={`mt-1 text-2xl font-black ${isDark ? 'text-white' : 'text-[#0b1220]'}`}>{pctLabel}</p>
      </div>
    </div>
  );
}

function PaymentMix({ items, isDark }) {
  const total = items.reduce((acc, item) => acc + item.value, 0) || 1;
  const segments = items
    .filter((item) => item.value > 0)
    .map((item) => ({ ...item, pct: (item.value / total) * 100 }));

  const track = isDark ? 'bg-white/10' : 'bg-slate-200';

  return (
    <div className="space-y-4">
      <div className={`h-3 w-full overflow-hidden rounded-full ${track}`}>
        <div className="flex h-full w-full">
          {segments.map((seg) => (
            <div
              key={seg.label}
              className="h-full"
              style={{ width: `${clamp(seg.pct, 0, 100)}%`, background: seg.color }}
              aria-label={`${seg.label} ${Math.round(seg.pct)}%`}
              role="img"
            />
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: item.color }} />
              <span className={`text-sm font-semibold ${isDark ? 'text-white/75' : 'text-slate-700'}`}>{item.label}</span>
            </div>
            <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { metrics, brands, quotes, crmRecords, salesRecords, pipelineDeals, theme } = useIntranet();
  const isDark = theme === 'dark';
  const [brandSearch, setBrandSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('Todos');
  const [editingMeta, setEditingMeta] = useState(false);
  const [monthlyTarget, setMonthlyTarget] = useState(metrics.monthlyTarget || 0);

  useEffect(() => {
    setMonthlyTarget(metrics.monthlyTarget || 0);
  }, [metrics.monthlyTarget]);

  const handleSaveMeta = (newTarget) => {
    const target = Number(newTarget) || 0;
    setMonthlyTarget(Math.max(0, target));
    setEditingMeta(false);
  };

  const sectionClass = isDark
    ? 'rounded-3xl border border-white/10 bg-[#0f1535]/70 shadow-[0_18px_44px_rgba(2,6,23,0.55)]'
    : 'rounded-3xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.10)]';

  const billingMap = useMemo(() => {
    const map = new Map();
    for (const record of salesRecords) {
      const dt = parseISODateSafe(record.invoiceDate || record.startDate);
      if (!dt) continue;
      const key = getMonthKey(dt);
      const acc = map.get(key) || 0;
      map.set(key, acc + (Number(record.monthlyAmount) || 0));
    }
    return map;
  }, [salesRecords]);

  const currentMonthKey = useMemo(() => getMonthKey(new Date()), []);
  const currentBilling = useMemo(() => {
    const byKey = billingMap.get(currentMonthKey);
    if (typeof byKey === 'number') return byKey;
    return metrics.monthlyBilling;
  }, [billingMap, currentMonthKey, metrics.monthlyBilling]);

  const previousBilling = useMemo(() => {
    const now = new Date();
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = getMonthKey(prev);
    return billingMap.get(prevKey) ?? 0;
  }, [billingMap]);

  const billingDeltaPct = useMemo(() => {
    if (!previousBilling) return 0;
    return ((currentBilling - previousBilling) / previousBilling) * 100;
  }, [currentBilling, previousBilling]);

  const billingSeries = useMemo(() => {
    const keys = buildRecentMonthKeys(8);
    const values = keys.map((k) => billingMap.get(k) ?? 0);
    const hasSignal = values.some((v) => v > 0);
    if (hasSignal) return values;

    const seed = currentBilling || metrics.monthlyBilling || 0;
    return [seed * 0.65, seed * 0.78, seed * 0.72, seed * 0.86, seed * 0.82, seed * 0.94, seed * 1.02, seed];
  }, [billingMap, currentBilling, metrics.monthlyBilling]);

  const compliance = useMemo(() => {
    if (!monthlyTarget) return 0;
    return clamp(currentBilling / monthlyTarget, 0, 2);
  }, [currentBilling, monthlyTarget]);

  const avgTicket = useMemo(() => {
    const count = salesRecords.length || 1;
    return currentBilling / count;
  }, [currentBilling, salesRecords.length]);

  const pipelineConversion = useMemo(() => {
    const total = pipelineDeals.length;
    if (!total) return 0;
    const closed = pipelineDeals.filter((d) => d.stage === 'Cierre venta').length;
    return closed / total;
  }, [pipelineDeals]);

  const kpiValues = useMemo(() => {
    return {
      billing: currentBilling,
      projectedClose: metrics.projectedClose,
      avgTicket,
      compliance,
      pipelineConversion,
    };
  }, [avgTicket, currentBilling, metrics.projectedClose, compliance, pipelineConversion]);

  const animatedBilling = useCountUp(kpiValues.billing);
  const animatedProjected = useCountUp(kpiValues.projectedClose);
  const animatedAvgTicket = useCountUp(kpiValues.avgTicket);
  const animatedQuotes = useCountUp(metrics.quotesSent);

  const pipelineByStage = useMemo(() => {
    return metrics.stageOrder.map((stage) => {
      const deals = pipelineDeals.filter((deal) => deal.stage === stage);
      const count = deals.length;
      const amount = deals.reduce((acc, d) => acc + (Number(d.estimatedAmount) || 0), 0);
      return { stage, count, amount };
    });
  }, [metrics.stageOrder, pipelineDeals]);

  const paymentMix = useMemo(() => {
    const paid = brands.filter((b) => b.paymentStatus === 'Pagado').length;
    const pending = brands.filter((b) => b.paymentStatus === 'Pendiente').length;
    const due = brands.filter((b) => b.paymentStatus === 'Vence pronto').length;

    return [
      { label: 'Pagado', value: paid, color: '#35c98f' },
      { label: 'Pendiente', value: pending, color: '#f5a524' },
      { label: 'Vence pronto', value: due, color: '#e73c50' },
    ];
  }, [brands]);

  const alerts = [
    {
      label: 'Pagos pendientes',
      value: salesRecords.filter((s) => s.billingStatus === 'Pendiente').length,
      color: 'text-[#ffd38f]',
    },
    {
      label: 'Contratos por vencer',
      value: brands.filter((b) => b.endDate && b.endDate <= '2026-06-30').length,
      color: 'text-[#ff9aa6]',
    },
    {
      label: 'Cotizaciones pendientes de respuesta',
      value: quotes.filter((q) => q.status === 'Enviada').length,
      color: 'text-[#8fb3ff]',
    },
    {
      label: 'Prospectos sin seguimiento',
      value: crmRecords.filter((c) => c.clientStatus === 'Prospecto').length,
      color: 'text-[#c5bcff]',
    },
  ];

  const visibleAlerts = useMemo(() => alerts.filter((item) => item.value > 0), [alerts]);

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const needle = brandSearch.trim().toLowerCase();
      const matchesSearch =
        !needle ||
        brand.brandName.toLowerCase().includes(needle) ||
        brand.clientManager.toLowerCase().includes(needle) ||
        brand.servicesActive.toLowerCase().includes(needle);

      const matchesPayment = paymentFilter === 'Todos' || brand.paymentStatus === paymentFilter;
      return matchesSearch && matchesPayment;
    });
  }, [brands, brandSearch, paymentFilter]);

  return (
    <div className="space-y-6">
      <section
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-7 ${
          isDark ? 'border-white/10 bg-[#0f1535]/70' : 'border-slate-200 bg-gradient-to-r from-white via-[#f7f8ff] to-[#eef1ff]'
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_12%_18%,rgba(231,60,80,0.22),transparent_30%),radial-gradient(circle_at_92%_70%,rgba(108,132,255,0.16),transparent_34%)]'
              : 'bg-[radial-gradient(circle_at_12%_18%,rgba(231,60,80,0.10),transparent_30%),radial-gradient(circle_at_92%_70%,rgba(108,132,255,0.10),transparent_34%)]'
          }`}
        />
        <div className="relative flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#d64d62]">Panel comercial</p>
            <h3 className={`intranet-heading mt-2 text-3xl font-black leading-tight md:text-4xl ${isDark ? 'text-white' : 'text-[#111827]'}`}>
              Resumen ejecutivo de ventas
            </h3>
            <p className={`mt-2 max-w-3xl text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Facturación, meta, pipeline y alertas críticas en una sola vista.
            </p>
          </div>
        </div>
      </section>

      <motion.section
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.06 } },
        }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <KpiCard
          label="Facturación acumulada"
          value={toMoney(animatedBilling)}
          subValue="Mes en curso"
          delta={billingDeltaPct}
          spark={billingSeries}
          tone="from-[#e73c50]/22 via-[#e73c50]/8 to-transparent"
          isDark={isDark}
        />
        <motion.article
          onClick={() => setEditingMeta(true)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          whileHover={{ y: -2 }}
          className={`relative overflow-hidden rounded-2xl border cursor-pointer group ${
            isDark ? 'border-white/10 bg-[#0f1535]/70 shadow-[0_14px_38px_rgba(2,6,23,0.55)]' : 'border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.10)]'
          }`}
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6c84ff]/22 via-[#6c84ff]/8 to-transparent ${
              isDark ? 'opacity-60' : 'opacity-90'
            }`}
          />
          <div className="relative flex items-start justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className={`text-[11px] font-black uppercase tracking-[0.22em] ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Cumplimiento de meta</p>
              <p className={`mt-2 truncate text-2xl font-black tracking-tight md:text-[28px] ${isDark ? 'text-white' : 'text-[#0b1220]'}`}>{Math.round(compliance * 100)}%</p>
              <p className={`mt-1 text-xs font-semibold ${isDark ? 'text-white/60' : 'text-slate-600'}`}>{toMoney(currentBilling)} de {toMoney(monthlyTarget)}</p>
              <p className={`mt-2 text-xs font-semibold transition group-hover:text-opacity-100 ${isDark ? 'text-white/40 group-hover:text-[#6c84ff]' : 'text-slate-400 group-hover:text-blue-600'}`}>
                ✎ Haz clic para editar la meta
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <DeltaBadge delta={(compliance - 0.5) * 12} isDark={isDark} />
              <Sparkline values={billingSeries} stroke="#e73c50" fill="#e73c50" isDark={isDark} />
            </div>
          </div>
        </motion.article>
        <KpiCard
          label="Ticket promedio"
          value={toMoney(animatedAvgTicket)}
          subValue="Promedio por factura"
          delta={(avgTicket ? (avgTicket / (avgTicket * 0.92) - 1) * 100 : 0)}
          spark={billingSeries}
          tone="from-[#35c98f]/18 via-[#35c98f]/8 to-transparent"
          isDark={isDark}
        />
        <KpiCard
          label="Cotizaciones enviadas"
          value={String(Math.round(animatedQuotes))}
          subValue="Mes en curso"
          delta={(metrics.quotesSent - 1) * 10}
          spark={[0, 1, 1, 2, 2, 3, metrics.quotesSent]}
          tone="from-[#f5a524]/18 via-[#f5a524]/8 to-transparent"
          isDark={isDark}
        />
        <KpiCard
          label="Proyección de cierre"
          value={toMoney(animatedProjected)}
          subValue="Estimación basada en tendencia"
          delta={((metrics.projectedClose - currentBilling) / Math.max(1, currentBilling)) * 100}
          spark={[currentBilling * 0.95, currentBilling * 1.02, currentBilling * 1.06, metrics.projectedClose].map((v) => v / 1000)}
          tone="from-[#4f8cff]/18 via-[#4f8cff]/8 to-transparent"
          isDark={isDark}
        />
        <KpiCard
          label="Conversión del pipeline"
          value={`${Math.round(pipelineConversion * 100)}%`}
          subValue="Cierres / total oportunidades"
          delta={(pipelineConversion - 0.12) * 30}
          spark={[0.05, 0.06, 0.08, 0.09, 0.12, 0.14, pipelineConversion].map((v) => v * 100)}
          tone="from-[#e73c50]/16 via-[#6c84ff]/10 to-transparent"
          isDark={isDark}
        />
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <article className={`${sectionClass} p-5 md:p-6`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h4 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Tendencia de facturación</h4>
              <p className={`mt-1 text-sm ${isDark ? 'text-white/65' : 'text-slate-600'}`}>Evolución por mes (datos internos)</p>
            </div>
            <div className={`rounded-xl border px-3 py-2 ${isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50'}`}>
              <p className={`text-xs font-bold ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Último mes</p>
              <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#0b1220]'}`}>{toMoney(currentBilling)}</p>
            </div>
          </div>

          <div className="mt-5">
            <AreaTrendChart
              series={billingSeries.map((value, idx) => ({ label: String(idx), value }))}
              isDark={isDark}
            />
          </div>
        </article>

        <article className="space-y-6">
          <div className={`${sectionClass} p-5`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Avance hacia meta</h4>
                <p className={`mt-1 text-sm ${isDark ? 'text-white/65' : 'text-slate-600'}`}>Meta mensual: {toMoney(metrics.monthlyTarget)}</p>
              </div>
              <DeltaBadge delta={(compliance - 1) * 100} isDark={isDark} />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <ProgressRing progress={compliance} label="Cumplimiento" isDark={isDark} />
              <div className="text-right">
                <p className={`text-[11px] font-black uppercase tracking-[0.22em] ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Pendiente</p>
                <p className={`mt-1 text-xl font-black ${isDark ? 'text-white' : 'text-[#0b1220]'}`}>{toMoney(Math.max(0, metrics.monthlyTarget - currentBilling))}</p>
              </div>
            </div>
          </div>
          <div className={`${sectionClass} p-5`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Estado de pagos</h4>
                <p className={`mt-1 text-sm ${isDark ? 'text-white/65' : 'text-slate-600'}`}>Distribución de marcas por estado</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${isDark ? 'bg-white/[0.06] text-white/70' : 'bg-slate-900/5 text-slate-600'}`}>
                {brands.length} total
              </span>
            </div>

            <div className="mt-4">
              <PaymentMix items={paymentMix} isDark={isDark} />
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className={`${sectionClass} p-5 md:p-6`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h4 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Estado del pipeline</h4>
              <p className={`mt-1 text-sm ${isDark ? 'text-white/65' : 'text-slate-600'}`}>Conteo y monto estimado por etapa</p>
            </div>
            <DeltaBadge delta={(pipelineConversion - 0.12) * 100} isDark={isDark} />
          </div>

          <div className="mt-5 grid gap-3">
            {pipelineByStage.map((row) => {
              const maxCount = Math.max(...pipelineByStage.map((r) => r.count), 1);
              const widthPct = (row.count / maxCount) * 100;
              return (
                <div
                  key={row.stage}
                  className={`rounded-2xl border px-4 py-3 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{row.stage}</p>
                    <div className={`text-xs font-semibold ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                      <span className="font-black">{row.count}</span> · {toMoney(row.amount)}
                    </div>
                  </div>
                  <div className={`mt-2 h-2.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-[#6c84ff] to-[#e73c50]" style={{ width: `${clamp(widthPct, 4, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className={`${sectionClass} p-5 md:p-6`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Alertas críticas</h4>
              <p className={`mt-1 text-sm ${isDark ? 'text-white/65' : 'text-slate-600'}`}>Solo pendientes que requieren acción</p>
            </div>
            <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${isDark ? 'bg-white/[0.06] text-white/70' : 'bg-slate-900/5 text-slate-600'}`}>
              {visibleAlerts.length}
            </span>
          </div>

          <ul className="mt-4 space-y-2">
            {visibleAlerts.length ? (
              visibleAlerts.map((alert) => (
                <li
                  key={alert.label}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                    isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <span className={`text-sm font-semibold ${isDark ? 'text-white/75' : 'text-slate-700'}`}>{alert.label}</span>
                  <span className={`text-sm font-black ${alert.color}`}>{alert.value}</span>
                </li>
              ))
            ) : (
              <li className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-white/10 text-white/70' : 'border-slate-200 text-slate-600'}`}>
                Sin alertas críticas por ahora.
              </li>
            )}
          </ul>
        </article>
      </section>

      <section className={`${sectionClass} overflow-hidden`}>
        <div className={`border-b px-5 py-4 md:px-6 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-[#101828]'}`}>Resumen operativo</h4>
              <p className={`mt-1 text-sm ${isDark ? 'text-white/65' : 'text-slate-600'}`}>Facturación y estado de pago</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={brandSearch}
                onChange={(event) => setBrandSearch(event.target.value)}
                placeholder="Buscar marca o ejecutiva"
                className={`h-10 w-56 rounded-xl border px-3 text-sm outline-none transition ${
                  isDark
                    ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-white/40 focus:border-white/20'
                    : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-300'
                }`}
              />
              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                className={`h-10 rounded-xl border px-3 text-sm outline-none transition ${
                  isDark ? 'border-white/10 bg-white/[0.04] text-white focus:border-white/20' : 'border-slate-200 bg-white text-slate-900 focus:border-slate-300'
                }`}
              >
                <option value="Todos">Todos</option>
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Vence pronto">Vence pronto</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className={`${isDark ? 'bg-white/[0.05] text-white/60' : 'bg-slate-50 text-slate-500'} text-xs uppercase tracking-[0.16em]`}>
              <tr>
                <th className="px-5 py-3 md:px-6">Marca</th>
                <th className="px-5 py-3 md:px-6">Servicio</th>
                <th className="px-5 py-3 md:px-6">Facturacion mensual</th>
                <th className="px-5 py-3 md:px-6">Estado pago</th>
                <th className="px-5 py-3 md:px-6">Ejecutiva</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/10' : 'divide-slate-200'}`}>
              {filteredBrands.map((row) => (
                <tr
                  key={row.id}
                  className={`${isDark ? 'text-white/85 hover:bg-white/[0.03]' : 'text-slate-700 hover:bg-slate-50'} transition`}
                >
                  <td className="px-5 py-4 font-semibold md:px-6">
                    <div className="flex flex-col">
                      <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.brandName}</span>
                      <span className={`text-xs ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Inicio: {row.startDate}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 md:px-6">
                    <span className="font-semibold">{row.servicesActive}</span>
                  </td>
                  <td className="px-5 py-4 md:px-6">
                    <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{toMoney(row.monthlyAmount)}</span>
                  </td>
                  <td className="px-5 py-4 md:px-6">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${paymentStyles[row.paymentStatus] || (isDark ? 'bg-white/10 text-white/70 ring-1 ring-inset ring-white/10' : 'bg-slate-900/5 text-slate-600 ring-1 ring-inset ring-slate-900/10')}`}>
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 md:px-6">
                    <span className="font-semibold">{row.clientManager}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AnimatePresence>
        {editingMeta && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed inset-0 flex items-center justify-center p-4 z-50 ${isDark ? 'bg-black/50' : 'bg-black/30'}`}
            onClick={() => setEditingMeta(false)}
          >
            <div
              className={`rounded-2xl border p-6 w-full max-w-sm ${
                isDark ? 'border-white/10 bg-[#0f1535]' : 'border-slate-200 bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Establecer meta mensual</h3>
              <input
                type="number"
                defaultValue={monthlyTarget}
                autoFocus
                className={`mt-4 w-full rounded-lg border px-4 py-3 text-base font-semibold outline-none ${
                  isDark
                    ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-white/40'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400'
                }`}
                placeholder="0"
                onKeyDown={(e) => {
                  const input = e.target;
                  if (e.key === 'Enter') handleSaveMeta(input.value);
                  if (e.key === 'Escape') setEditingMeta(false);
                }}
              />
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setEditingMeta(false)}
                  className={`flex-1 rounded-lg border px-4 py-2 font-semibold transition ${
                    isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={(e) => {
                    const inputEl = e.currentTarget.parentElement?.querySelector('input');
                    if (inputEl) handleSaveMeta(inputEl.value);
                  }}
                  className="flex-1 rounded-lg bg-[#6c84ff] px-4 py-2 font-semibold text-white transition hover:bg-[#5a73e8]"
                >
                  Guardar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
