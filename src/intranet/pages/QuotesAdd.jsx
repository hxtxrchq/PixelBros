import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIntranet } from '../context/IntranetContext';
import { printVoucherDirect, saveQuoteVoucherMeta, viewQuoteVoucher } from '../services/quoteVoucher';
import { TEAM_PROFILES } from '../../config/teamProfiles';

const toMoney = (value) => `S/ ${Number(value || 0).toLocaleString('es-PE')}`;

const TEAM_OPTIONS = TEAM_PROFILES.map((member) => ({
  id: member.id,
  name: member.name,
  role: member.role,
  image: member.images?.[0] || '',
}));

const DEFAULT_BUDGET_BLOCKS = [
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

const blankForm = () => ({
  client: '',
  company: '',
  clientRole: '',
  quoteDate: new Date().toLocaleDateString('es-PE'),
  preparedByOne: 'Sandra Haro',
  preparedRoleOne: 'Directora de ventas',
  preparedByTwo: 'Elena Paula',
  preparedRoleTwo: 'Directora ejecutiva',
  durationMonths: 6,
  roi: '',
  conversionRate: '',
  newClients: '',
  challenge: '',
  solution: '',
  whoWeAre: '',
  teamIntro: '',
  methodologyIntro: '',
  methodologyStep1: '',
  methodologyStep2: '',
  methodologyStep3: '',
  footerPhone: '(51) 1234-5678',
  footerWeb: 'www.pixelbros.com',
  footerEmail: 'pixelbrosperu@outlook.com',
  teamIds: TEAM_OPTIONS.map((member) => member.id),
});

const blankBudgetBlocks = () =>
  DEFAULT_BUDGET_BLOCKS.map((block) => ({
    ...block,
    slots: (block.slots || []).map((slot) => ({ ...slot })),
  }));

export default function QuotesAdd() {
  const { user } = useAuth();
  const { addQuote, theme } = useIntranet();
  const isDark = theme === 'dark';
  const panelClass = isDark ? 'border-white/10 bg-[#111638] shadow-[0_10px_26px_rgba(0,0,0,0.2)]' : 'border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.06)]';
  const softPanelClass = isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50';
  const labelClass = `text-xs font-semibold ${isDark ? 'text-white/75' : 'text-slate-600'}`;
  const fieldClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
    isDark
      ? 'border-white/10 bg-[#0b1027] text-white placeholder:text-white/35 focus:border-[#4f8cff]/70'
      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#4f8cff]/70'
  }`;
  const textareaClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
    isDark
      ? 'min-h-[94px] border-white/10 bg-[#0b1027] text-white placeholder:text-white/35 focus:border-[#4f8cff]/70'
      : 'min-h-[94px] border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#4f8cff]/70'
  }`;
  const chipClass = `flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
    isDark
      ? 'border-white/10 bg-[#0b1027] text-white/90 hover:border-[#35c98f]/60'
      : 'border-slate-200 bg-white text-slate-700 hover:border-[#35c98f]/50'
  }`;

  const userAvatarLabel = (user?.fullName || 'PB')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const userRoleLabel = user?.role === 'GLOBAL_ADMIN' ? 'Administrador Global' : user?.role === 'TI_ADMIN' ? 'Administrador TI' : 'Usuario';
  const preparedName = user?.fullName || 'Usuario autenticado';

  const [form, setForm] = useState(blankForm());
  const [budgetBlocks, setBudgetBlocks] = useState(blankBudgetBlocks());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdQuote, setCreatedQuote] = useState(null);

  const totalBudgetHours = useMemo(
    () => budgetBlocks.reduce((sum, block) => sum + Number(block.hours || 0), 0),
    [budgetBlocks],
  );

  const totalBudgetCost = useMemo(
    () => budgetBlocks.reduce((sum, block) => sum + Number(block.cost || 0), 0),
    [budgetBlocks],
  );

  const updateBudgetBlock = (index, patch) => {
    setBudgetBlocks((prev) => prev.map((block, blockIndex) => (blockIndex === index ? { ...block, ...patch } : block)));
  };

  const addBudgetBlock = () => {
    setBudgetBlocks((prev) => [
      ...prev,
      { title: '', hours: 0, cost: 0, slots: [{ title: '', description: '' }] },
    ]);
  };

  const removeBudgetBlock = (index) => {
    setBudgetBlocks((prev) => prev.filter((_, blockIndex) => blockIndex !== index));
  };

  const addBudgetSlot = (blockIndex) => {
    setBudgetBlocks((prev) =>
      prev.map((block, index) =>
        index === blockIndex
          ? { ...block, slots: [...(block.slots || []), { title: '', description: '' }] }
          : block,
      ),
    );
  };

  const updateBudgetSlot = (blockIndex, slotIndex, patch) => {
    setBudgetBlocks((prev) =>
      prev.map((block, index) =>
        index === blockIndex
          ? {
              ...block,
              slots: (block.slots || []).map((slot, currentSlotIndex) =>
                currentSlotIndex === slotIndex ? { ...slot, ...patch } : slot,
              ),
            }
          : block,
      ),
    );
  };

  const removeBudgetSlot = (blockIndex, slotIndex) => {
    setBudgetBlocks((prev) =>
      prev.map((block, index) =>
        index === blockIndex
          ? { ...block, slots: (block.slots || []).filter((_, currentSlotIndex) => currentSlotIndex !== slotIndex) }
          : block,
      ),
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.client.trim() || !form.company.trim()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const finalPrice = totalBudgetCost;
      const item = await addQuote({
        client: form.client,
        company: form.company,
        serviceType: 'Propuesta integral',
        detail: 'Cotizacion por bloques',
        durationMonths: Number(form.durationMonths) || 1,
        duration: `${form.durationMonths} meses`,
        basePrice: finalPrice,
        discount: 0,
        observations: '',
        finalPrice,
      });

      saveQuoteVoucherMeta(item.id, {
        preparedBy: preparedName,
        preparedRole: userRoleLabel,
        quoteDate: form.quoteDate,
        clientName: form.client,
        companyName: form.company,
        clientRole: form.clientRole,
        duration: `${form.durationMonths} meses`,
        roi: form.roi,
        conversionRate: form.conversionRate,
        newClients: form.newClients,
        challenge: form.challenge,
        solution: form.solution,
        whoWeAre: form.whoWeAre,
        teamIntro: form.teamIntro,
        methodologyIntro: form.methodologyIntro,
        methodologySteps: [form.methodologyStep1, form.methodologyStep2, form.methodologyStep3].filter(Boolean),
        team: TEAM_OPTIONS.filter((member) => form.teamIds.includes(member.id)).map((member) => ({
          name: member.name,
          role: member.role,
          image: member.image,
        })),
        budgetBlocks: budgetBlocks.map((block) => ({
          title: block.title,
          hours: Number(block.hours) || 0,
          cost: Number(block.cost) || 0,
          slots: (block.slots || []).map((slot) => ({
            title: slot.title,
            description: slot.description,
          })),
        })),
        footerPhone: form.footerPhone,
        footerWeb: form.footerWeb,
        footerEmail: form.footerEmail,
      });

      setCreatedQuote(item);
      setForm(blankForm());
      setBudgetBlocks(blankBudgetBlocks());
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo guardar la cotizacion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`rounded-3xl border p-5 ${panelClass}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className={`intranet-heading text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Agregar cotizacion</h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Completa solo los datos que van a salir en la propuesta.</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${isDark ? 'bg-[#4f8cff]/15 text-[#cfe0ff]' : 'bg-slate-100 text-slate-600'}`}>
          Cotizacion editable por bloques
        </span>
      </div>

      {submitError ? (
        <p className={`mb-4 rounded-2xl border px-3 py-2 text-sm ${isDark ? 'border-[#e73c50]/45 bg-[#e73c50]/15 text-[#ffd6dc]' : 'border-[#f8b4bd] bg-[#fff1f3] text-[#8b1a2b]'}`}>
          {submitError}
        </p>
      ) : null}

      {createdQuote ? (
        <div className={`mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 ${isDark ? 'border-[#35c98f]/40 bg-[#35c98f]/12' : 'border-[#9ee7cb] bg-[#ecfff6]'}`}>
          <p className={`text-sm ${isDark ? 'text-[#d4ffe9]' : 'text-[#0f5132]'}`}>
            Cotizacion creada: <span className="font-black">{createdQuote.quoteNumber}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                viewQuoteVoucher(createdQuote);
              } catch (error) {
                setSubmitError(error instanceof Error ? error.message : 'No se pudo abrir la cotizacion.');
              }
            }}
            className="rounded-lg bg-[#0f766e] px-3 py-1.5 text-xs font-bold text-white"
          >
            Ver cotización
          </button>
          <button
            type="button"
            onClick={() => {
              try {
                printVoucherDirect(createdQuote);
              } catch (error) {
                setSubmitError(error instanceof Error ? error.message : 'No se pudo imprimir la cotizacion.');
              }
            }}
            className="rounded-lg border border-[#0f766e]/40 px-3 py-1.5 text-xs font-bold text-[#0f766e]"
          >
            Imprimir voucher
          </button>
        </div>
      ) : null}

      <form onSubmit={submit} className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className={labelClass}>Cliente</span>
              <input value={form.client} onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))} placeholder="Nombre y apellido" className={fieldClass} />
            </label>
            <label className="space-y-1.5">
              <span className={labelClass}>Empresa</span>
              <input value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} placeholder="Razon social" className={fieldClass} />
            </label>
          </div>

          <div className={`rounded-3xl border p-4 ${softPanelClass}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.14em] ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Datos de cotizacion</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className={labelClass}>Fecha</span>
                <input value={form.quoteDate} onChange={(e) => setForm((prev) => ({ ...prev, quoteDate: e.target.value }))} className={fieldClass} />
              </label>
              <label className="space-y-1.5">
                <span className={labelClass}>Cargo del cliente</span>
                <input value={form.clientRole} onChange={(e) => setForm((prev) => ({ ...prev, clientRole: e.target.value }))} placeholder="Ej. Gerente General" className={fieldClass} />
              </label>
            </div>
            <div className={`mt-3 flex items-center gap-3 rounded-2xl border p-3 ${isDark ? 'border-white/10 bg-[#0b1027]' : 'border-slate-200 bg-white'}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full font-black ${isDark ? 'bg-[#4f8cff]/20 text-[#d6e4ff]' : 'bg-[#dbeafe] text-[#1d4ed8]'}`}>
                {userAvatarLabel}
              </div>
              <div className="min-w-0">
                <p className={`truncate text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{preparedName}</p>
                <p className={`text-xs ${isDark ? 'text-white/55' : 'text-slate-500'}`}>{userRoleLabel}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl border p-4 ${softPanelClass}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.14em] ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Contenido de la cotizacion</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label className="space-y-1.5">
                <span className={labelClass}>Duracion</span>
                <input type="number" min="1" value={form.durationMonths} onChange={(e) => setForm((prev) => ({ ...prev, durationMonths: Number(e.target.value) || 1 }))} className={fieldClass} />
              </label>
              <label className="space-y-1.5">
                <span className={labelClass}>ROI</span>
                <input value={form.roi} onChange={(e) => setForm((prev) => ({ ...prev, roi: e.target.value }))} placeholder="Ej. 900%" className={fieldClass} />
              </label>
              <label className="space-y-1.5">
                <span className={labelClass}>Tasa</span>
                <input value={form.conversionRate} onChange={(e) => setForm((prev) => ({ ...prev, conversionRate: e.target.value }))} placeholder="Ej. 65%" className={fieldClass} />
              </label>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className={labelClass}>Clientes nuevos</span>
                <input value={form.newClients} onChange={(e) => setForm((prev) => ({ ...prev, newClients: e.target.value }))} placeholder="Ej. 1000" className={fieldClass} />
              </label>
              <label className="space-y-1.5">
                <span className={labelClass}>La solucion</span>
                <input value={form.solution} onChange={(e) => setForm((prev) => ({ ...prev, solution: e.target.value }))} placeholder="Resumen corto" className={fieldClass} />
              </label>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className={labelClass}>El reto</span>
                <textarea value={form.challenge} onChange={(e) => setForm((prev) => ({ ...prev, challenge: e.target.value }))} rows={3} className={textareaClass} />
              </label>
              <label className="space-y-1.5">
                <span className={labelClass}>Quienes somos</span>
                <textarea value={form.whoWeAre} onChange={(e) => setForm((prev) => ({ ...prev, whoWeAre: e.target.value }))} rows={3} className={textareaClass} />
              </label>
            </div>

            <label className="mt-3 block space-y-1">
              <span className={labelClass}>Texto de equipo</span>
              <textarea value={form.teamIntro} onChange={(e) => setForm((prev) => ({ ...prev, teamIntro: e.target.value }))} rows={2} className={textareaClass} />
            </label>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM_OPTIONS.map((member) => {
                const selected = form.teamIds.includes(member.id);
                return (
                  <label key={member.id} className={`${chipClass} ${selected ? (isDark ? 'border-[#35c98f]/60 bg-[#0b1027] text-[#d4ffe9]' : 'border-[#35c98f]/60 bg-[#ecfff6] text-[#0f5132]') : ''}`}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          teamIds: e.target.checked ? [...prev.teamIds, member.id] : prev.teamIds.filter((id) => id !== member.id),
                        }));
                      }}
                    />
                      <span>{member.name}</span>
                  </label>
                );
              })}
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
                <input value={form.methodologyStep1} onChange={(e) => setForm((prev) => ({ ...prev, methodologyStep1: e.target.value }))} placeholder="Paso 1" className={fieldClass} />
                <input value={form.methodologyStep2} onChange={(e) => setForm((prev) => ({ ...prev, methodologyStep2: e.target.value }))} placeholder="Paso 2" className={fieldClass} />
                <input value={form.methodologyStep3} onChange={(e) => setForm((prev) => ({ ...prev, methodologyStep3: e.target.value }))} placeholder="Paso 3" className={fieldClass} />
            </div>
          </div>
        </div>

          <aside className={`h-fit space-y-4 rounded-3xl border p-4 ${softPanelClass}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.14em] ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Bloques de presupuesto</p>
            <p className={`text-sm ${isDark ? 'text-white/55' : 'text-slate-500'}`}>Cada bloque debe verse como una sección clara del presupuesto.</p>

          {budgetBlocks.map((block, index) => (
            <div key={`${block.title}-${index}`} className={`space-y-3 rounded-2xl border p-3 ${isDark ? 'border-white/10 bg-[#0b1027]' : 'border-slate-200 bg-white'}`}>
                <input value={block.title} onChange={(e) => updateBudgetBlock(index, { title: e.target.value })} placeholder="Titulo del bloque" className={fieldClass} />
              <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={block.hours} onChange={(e) => updateBudgetBlock(index, { hours: Number(e.target.value) || 0 })} placeholder="Horas" className={fieldClass} />
                  <input type="number" value={block.cost} onChange={(e) => updateBudgetBlock(index, { cost: Number(e.target.value) || 0 })} placeholder="Costo" className={fieldClass} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Slots del bloque</p>
                  <button type="button" onClick={() => addBudgetSlot(index)} className="rounded-lg border border-[#4f8cff]/40 px-2 py-1 text-[11px] font-bold text-[#1d4ed8]">
                    Agregar slot
                  </button>
                </div>
                <div className="space-y-2">
                  {(block.slots || []).map((slot, slotIndex) => (
                    <div key={`${block.title}-${index}-slot-${slotIndex}`} className={`rounded-xl border p-2 ${isDark ? 'border-white/10 bg-[#12183a]' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Slot {slotIndex + 1}</span>
                        <button type="button" onClick={() => removeBudgetSlot(index, slotIndex)} className="rounded-md border border-[#e73c50]/40 px-2 py-1 text-[10px] font-bold text-[#d12d43]">
                          Quitar
                        </button>
                      </div>
                      <div className="mt-2 grid gap-2 md:grid-cols-[0.9fr_1.1fr]">
                        <input value={slot.title} onChange={(e) => updateBudgetSlot(index, slotIndex, { title: e.target.value })} placeholder="Titulo del slot" className={fieldClass} />
                        <input value={slot.description} onChange={(e) => updateBudgetSlot(index, slotIndex, { description: e.target.value })} placeholder="Descripcion breve" className={fieldClass} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => removeBudgetBlock(index)} className="rounded-lg border border-[#e73c50]/45 px-2 py-1 text-[11px] font-bold text-[#d12d43]">
                Eliminar bloque
              </button>
            </div>
          ))}

          <button type="button" onClick={addBudgetBlock} className="rounded-lg border border-[#4f8cff]/45 px-2 py-1.5 text-xs font-bold text-[#1d4ed8]">
            Agregar bloque
          </button>

          <div className={`rounded-2xl border p-3 text-xs ${isDark ? 'border-white/10 bg-[#0b1027] text-white/85' : 'border-slate-200 bg-white text-slate-700'}`}>
            <p>Total horas: <strong>{totalBudgetHours}</strong></p>
            <p>Total costo: <strong>{toMoney(totalBudgetCost)}</strong></p>
          </div>

          <div className={`space-y-2 rounded-2xl border p-3 ${isDark ? 'border-white/10 bg-[#0b1027]' : 'border-slate-200 bg-white'}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.12em] ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Footer</p>
            <input value={form.footerPhone} onChange={(e) => setForm((prev) => ({ ...prev, footerPhone: e.target.value }))} placeholder="Telefono" className={fieldClass} />
            <input value={form.footerWeb} onChange={(e) => setForm((prev) => ({ ...prev, footerWeb: e.target.value }))} placeholder="Web" className={fieldClass} />
            <input value={form.footerEmail} onChange={(e) => setForm((prev) => ({ ...prev, footerEmail: e.target.value }))} placeholder="Email" className={fieldClass} />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2.5 text-sm font-black text-white shadow-[0_10px_22px_rgba(199,43,60,0.25)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45">
            {isSubmitting ? 'Guardando...' : 'Guardar cotizacion'}
          </button>
        </aside>
      </form>
    </section>
  );
}
