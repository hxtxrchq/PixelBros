import { useMemo, useState } from 'react';
import { useIntranet } from '../context/IntranetContext';

const STAGES = ['Lead', 'Reunion', 'Negociacion', 'No desea', 'Desea luego', 'Sin respuestas', 'Cierre venta'];
const INTEREST_OPTIONS = ['Alta', 'Media', 'Baja'];
const LEAD_SOURCES = ['Referido', 'Instagram', 'Web', 'Evento', 'Networking', 'Otro'];

const STAGE_GROUP = {
  Lead: 'Pendiente',
  Reunion: 'En curso',
  Negociacion: 'En curso',
  'No desea': 'Completado',
  'Desea luego': 'Completado',
  'Sin respuestas': 'Completado',
  'Cierre venta': 'Completado',
};

const STAGE_TONE = {
  Lead: 'bg-[#f472b6]/20 text-[#fbcfe8] border-[#f472b6]/40',
  Reunion: 'bg-[#60a5fa]/20 text-[#bfdbfe] border-[#60a5fa]/40',
  Negociacion: 'bg-[#c084fc]/20 text-[#e9d5ff] border-[#c084fc]/40',
  'No desea': 'bg-white/15 text-white/80 border-white/20',
  'Desea luego': 'bg-[#fb923c]/20 text-[#fed7aa] border-[#fb923c]/40',
  'Sin respuestas': 'bg-[#f87171]/20 text-[#fecaca] border-[#f87171]/40',
  'Cierre venta': 'bg-[#34d399]/20 text-[#a7f3d0] border-[#34d399]/40',
};

const emptyForm = {
  name: '',
  clientId: '',
  company: '',
  contact: '',
  responsible: '',
  stage: 'Lead',
  interest: 'Alta',
  businessSector: '',
  email: '',
  phone: '',
  address: '',
  socialHandle: '',
  leadSource: LEAD_SOURCES[0],
  estimatedAmount: '',
  requirement: '',
  quoteReference: '',
};

const toMoney = (value) => `S/ ${Number(value || 0).toLocaleString('es-PE')}`;
const toDateTime = (value) => (value ? value : '-');

const toFileSize = (bytes = 0) => {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ''));
  reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
  reader.readAsDataURL(file);
});

const buildClientLabel = (item) => {
  const fullName = [item.firstName, item.lastName].filter(Boolean).join(' ').trim();
  if (!fullName) return item.companyName || `Cliente ${item.id}`;
  if (!item.companyName) return fullName;
  return `${fullName} - ${item.companyName}`;
};

export default function Pipeline() {
  const {
    theme,
    crmRecords,
    pipelineDeals,
    addPipelineDeal,
    updatePipelineStage,
    updatePipelineDeal,
    removePipelineAttachment,
    deletePipelineDeal,
  } = useIntranet();

  const isDark = theme === 'dark';
  const [form, setForm] = useState(emptyForm);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

  const clientOptions = useMemo(
    () => crmRecords.map((item) => ({ id: String(item.id), label: buildClientLabel(item), raw: item })),
    [crmRecords],
  );

  const dealsByStage = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((stage) => [stage, []]));
    pipelineDeals.forEach((deal) => {
      if (!map[deal.stage]) {
        map.Lead.push(deal);
        return;
      }
      map[deal.stage].push(deal);
    });
    return map;
  }, [pipelineDeals]);

  const summary = useMemo(() => {
    const totalAmount = pipelineDeals.reduce((acc, item) => acc + (Number(item.estimatedAmount) || 0), 0);
    const active = (dealsByStage.Reunion?.length || 0) + (dealsByStage.Negociacion?.length || 0);

    return {
      totalDeals: pipelineDeals.length,
      totalAmount,
      active,
    };
  }, [dealsByStage, pipelineDeals]);

  const selectedDeal = useMemo(
    () => pipelineDeals.find((deal) => deal.id === selectedDealId) || null,
    [pipelineDeals, selectedDealId],
  );

  const onClientChange = (clientId) => {
    if (!clientId) {
      setForm((prev) => ({ ...prev, clientId: '' }));
      return;
    }

    const selected = clientOptions.find((item) => item.id === clientId)?.raw;
    if (!selected) return;

    const contact = [selected.firstName, selected.lastName].filter(Boolean).join(' ').trim();

    setForm((prev) => ({
      ...prev,
      clientId,
      company: selected.companyName || prev.company,
      contact: contact || prev.contact,
      estimatedAmount: String(selected.monthlyAmount || prev.estimatedAmount || ''),
      leadSource: selected.leadSource || prev.leadSource,
      name: prev.name || `${selected.companyName || 'Cliente'} - Oportunidad comercial`,
    }));
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setForm(emptyForm);
  };

  const openDealDetail = (deal) => {
    setSelectedDealId(deal.id);
  };

  const closeDealDetail = () => {
    setSelectedDealId(null);
    setIsUploadingAttachment(false);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const hasName = form.name.trim().length > 0;
    const hasClientData = form.company.trim().length > 0 || form.contact.trim().length > 0 || form.clientId;
    if (!hasName || !hasClientData) return;

    const client = clientOptions.find((item) => item.id === form.clientId)?.raw;

    addPipelineDeal({
      name: form.name.trim(),
      clientId: form.clientId || null,
      clientLabel: client ? buildClientLabel(client) : '',
      company: form.company.trim() || client?.companyName || '',
      contact: form.contact.trim() || [client?.firstName, client?.lastName].filter(Boolean).join(' ').trim(),
      responsible: form.responsible.trim(),
      stage: form.stage,
      interest: form.interest,
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      socialHandle: form.socialHandle.trim(),
      leadSource: form.leadSource,
      estimatedAmount: Number(form.estimatedAmount) || 0,
      requirement: form.requirement.trim(),
      quoteReference: form.quoteReference.trim(),
    });

    setIsCreateModalOpen(false);
    setForm(emptyForm);
  };

  const updateAmount = (deal, value) => {
    const nextAmount = Number(value) || 0;
    if (nextAmount === Number(deal.estimatedAmount || 0)) return;
    updatePipelineDeal(deal.id, { estimatedAmount: nextAmount });
  };

  const addAttachments = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!selectedDeal || !files.length) return;

    setIsUploadingAttachment(true);

    try {
      const incomingAttachments = await Promise.all(
        files.map(async (file) => ({
          id: `${selectedDeal.id}-${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          type: file.type || '',
          size: file.size || 0,
          dataUrl: await readFileAsDataUrl(file),
          uploadedAt: new Date().toLocaleString('es-PE'),
        })),
      );

      updatePipelineDeal(selectedDeal.id, {
        attachments: [...(selectedDeal.attachments || []), ...incomingAttachments],
      });
    } finally {
      setIsUploadingAttachment(false);
      event.target.value = '';
    }
  };

  const panelClass = isDark
    ? 'rounded-3xl border border-white/10 bg-[#0d1029]/75 shadow-[0_18px_40px_rgba(0,0,0,0.32)]'
    : 'rounded-3xl border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.08)]';

  const fieldClass = isDark
    ? 'rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none'
    : 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none';

  const cardClass = isDark
    ? 'rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/80'
    : 'rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700';

  const captionClass = isDark ? 'text-white/65' : 'text-slate-600';
  const titleClass = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-6">
      <section className={`${panelClass} p-5 md:p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div>
              <h2 className={`intranet-heading text-2xl font-black ${titleClass}`}>Kanban comercial</h2>
              <p className={`mt-1 text-sm ${captionClass}`}>
                Agregado y Ultimo contacto se registran automaticamente al crear o editar cada lead.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2 text-xs font-black text-white"
            >
              Crear lead
            </button>
          </div>
          <div className="grid shrink-0 grid-cols-3 gap-2 text-xs md:text-sm">
            <article className={`rounded-xl border px-3 py-2 ${isDark ? 'border-white/15 bg-white/[0.04] text-white/85' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
              <p className="font-semibold">Leads</p>
              <p className="text-lg font-black">{summary.totalDeals}</p>
            </article>
            <article className={`rounded-xl border px-3 py-2 ${isDark ? 'border-white/15 bg-white/[0.04] text-white/85' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
              <p className="font-semibold">En curso</p>
              <p className="text-lg font-black">{summary.active}</p>
            </article>
            <article className={`rounded-xl border px-3 py-2 ${isDark ? 'border-white/15 bg-white/[0.04] text-white/85' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
              <p className="font-semibold">Monto</p>
              <p className="text-lg font-black">{toMoney(summary.totalAmount)}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="overflow-x-auto pb-2">
        <div className="grid min-w-[2240px] grid-cols-7 gap-4">
          {STAGES.map((stage) => {
            const stageDeals = dealsByStage[stage] || [];
            const groupTitle = STAGE_GROUP[stage];

            return (
              <article key={stage} className={`${panelClass} min-h-[640px] p-4`}>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${captionClass}`}>{groupTitle}</p>
                    <h3 className={`mt-1 text-sm font-black uppercase tracking-[0.1em] ${captionClass}`}>{stage}</h3>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${isDark ? 'border-white/20 text-white/75' : 'border-slate-300 text-slate-600'}`}>
                    {stageDeals.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className={cardClass}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{deal.name || deal.company || 'Sin nombre'}</p>
                          <p className={isDark ? 'text-[11px] text-white/65' : 'text-[11px] text-slate-600'}>{deal.company || '-'}</p>
                        </div>
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${STAGE_TONE[deal.stage] || 'border-white/20 text-white/80'}`}>
                          {deal.interest || 'Media'}
                        </span>
                      </div>

                      <div className={`mt-2 grid gap-1 text-[11px] ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                        <p><strong className={isDark ? 'text-white/90' : 'text-slate-900'}>Contacto:</strong> {deal.contact || '-'}</p>
                        <p><strong className={isDark ? 'text-white/90' : 'text-slate-900'}>Responsable:</strong> {deal.responsible || '-'}</p>
                        <p><strong className={isDark ? 'text-white/90' : 'text-slate-900'}>Origen:</strong> {deal.leadSource || '-'}</p>
                        <p><strong className={isDark ? 'text-white/90' : 'text-slate-900'}>Agregado:</strong> {toDateTime(deal.createdAt)}</p>
                        <p><strong className={isDark ? 'text-white/90' : 'text-slate-900'}>Ultimo contacto:</strong> {toDateTime(deal.lastContactAt || deal.updatedAt)}</p>
                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{toMoney(deal.estimatedAmount)}</p>
                      </div>

                      <div className="mt-3 space-y-2">
                        <select value={deal.stage} onChange={(e) => updatePipelineStage(deal.id, e.target.value)} className={`${fieldClass} w-full text-[11px]`}>
                          {STAGES.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                          <select value={deal.interest || 'Media'} onChange={(e) => updatePipelineDeal(deal.id, { interest: e.target.value })} className={`${fieldClass} text-[11px]`}>
                            {INTEREST_OPTIONS.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="0"
                            defaultValue={deal.estimatedAmount || 0}
                            onBlur={(e) => updateAmount(deal, e.target.value)}
                            className={`${fieldClass} text-[11px]`}
                            placeholder="Monto"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => openDealDetail(deal)}
                          className={`mt-1 inline-flex w-full items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-bold ${isDark ? 'border-white/20 text-white/85 hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                        >
                          Ver detalle y archivos
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 ? (
                    <p className={`rounded-lg border border-dashed px-2 py-2 text-[11px] ${isDark ? 'border-white/15 text-white/45' : 'border-slate-300 text-slate-500'}`}>
                      Sin oportunidades en este estado.
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className={`${panelClass} max-h-[92vh] w-full max-w-6xl overflow-hidden`}>
            <div className={`flex items-center justify-between border-b px-5 py-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div>
                <p className={`text-[11px] font-black uppercase tracking-[0.22em] ${captionClass}`}>Popup</p>
                <h3 className={`mt-1 text-xl font-black ${titleClass}`}>Crear lead</h3>
              </div>
              <button type="button" onClick={closeCreateModal} className={`rounded-xl border px-3 py-2 text-xs font-bold ${isDark ? 'border-white/20 text-white/85 hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                Cerrar
              </button>
            </div>

            <div className="max-h-[calc(92vh-73px)] overflow-y-auto p-5 md:p-6">
              {crmRecords.length === 0 ? (
                <div className={`mb-4 rounded-2xl border border-dashed p-3 text-sm ${isDark ? 'border-white/20 bg-white/[0.02] text-white/75' : 'border-slate-300 bg-slate-50 text-slate-700'}`}>
                  No hay clientes cargados en CRM. Puedes crear uno y volver para seleccionarlo desde aqui.
                </div>
              ) : null}

              <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nombre de oportunidad" className={fieldClass} required />

                <select value={form.clientId} onChange={(e) => onClientChange(e.target.value)} className={fieldClass}>
                  <option value="">Seleccionar cliente CRM (opcional)</option>
                  {clientOptions.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>

                <input value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} placeholder="Empresa" className={fieldClass} />
                <input value={form.contact} onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))} placeholder="Contacto" className={fieldClass} />

                <input value={form.responsible} onChange={(e) => setForm((prev) => ({ ...prev, responsible: e.target.value }))} placeholder="Responsable" className={fieldClass} />
                <select value={form.stage} onChange={(e) => setForm((prev) => ({ ...prev, stage: e.target.value }))} className={fieldClass}>
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
                <select value={form.interest} onChange={(e) => setForm((prev) => ({ ...prev, interest: e.target.value }))} className={fieldClass}>
                  {INTEREST_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <input type="number" min="0" value={form.estimatedAmount} onChange={(e) => setForm((prev) => ({ ...prev, estimatedAmount: e.target.value }))} placeholder="Monto estimado" className={fieldClass} />

                <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className={fieldClass} />
                <input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Telefono" className={fieldClass} />
                <select value={form.leadSource} onChange={(e) => setForm((prev) => ({ ...prev, leadSource: e.target.value }))} className={fieldClass}>
                  {LEAD_SOURCES.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>

                <input value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} placeholder="Direccion" className={fieldClass} />
                <input value={form.socialHandle} onChange={(e) => setForm((prev) => ({ ...prev, socialHandle: e.target.value }))} placeholder="IG / FB" className={fieldClass} />
                <input value={form.quoteReference} onChange={(e) => setForm((prev) => ({ ...prev, quoteReference: e.target.value }))} placeholder="Cotizacion" className={fieldClass} />
                <input value={form.requirement} onChange={(e) => setForm((prev) => ({ ...prev, requirement: e.target.value }))} placeholder="Requerimiento" className={fieldClass} />

                <div className="xl:col-span-4 flex flex-wrap gap-2 pt-1">
                  <button type="submit" className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2 text-sm font-black text-white">Guardar en kanban</button>
                  <button type="button" onClick={closeCreateModal} className={`rounded-xl border px-4 py-2 text-sm font-bold ${isDark ? 'border-white/20 text-white/85 hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className={`${panelClass} max-h-[92vh] w-full max-w-5xl overflow-hidden`}>
            <div className={`flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div>
                <p className={`text-[11px] font-black uppercase tracking-[0.22em] ${captionClass}`}>Detalle del lead</p>
                <h3 className={`mt-1 text-xl font-black ${titleClass}`}>{selectedDeal.name || selectedDeal.company || 'Sin nombre'}</h3>
                <p className={`mt-1 text-sm ${captionClass}`}>{selectedDeal.company || '-'} · {selectedDeal.contact || 'Sin contacto'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // confirmation before delete
                    // eslint-disable-next-line no-alert
                    if (window.confirm('Eliminar lead? Esta accion no se puede deshacer.')) {
                      deletePipelineDeal(selectedDeal.id);
                      closeDealDetail();
                    }
                  }}
                  className="rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white"
                >
                  Eliminar lead
                </button>
                <button type="button" onClick={closeDealDetail} className={`rounded-xl border px-3 py-2 text-xs font-bold ${isDark ? 'border-white/20 text-white/85 hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                  Cerrar
                </button>
              </div>
            </div>

            <div className="max-h-[calc(92vh-73px)] overflow-y-auto p-5 md:p-6">
              <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="space-y-4">
                  <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="space-y-1.5">
                        <span className={`text-[11px] font-black uppercase tracking-[0.12em] ${captionClass}`}>Responsable</span>
                        <input
                          defaultValue={selectedDeal.responsible || ''}
                          onBlur={(e) => {
                            const nextResponsible = e.target.value.trim();
                            if (nextResponsible !== (selectedDeal.responsible || '')) {
                              updatePipelineDeal(selectedDeal.id, { responsible: nextResponsible });
                            }
                          }}
                          className={fieldClass}
                          placeholder="Asignar responsable"
                        />
                      </label>
                      <label className="space-y-1.5">
                        <span className={`text-[11px] font-black uppercase tracking-[0.12em] ${captionClass}`}>Etapa</span>
                        <select value={selectedDeal.stage} onChange={(e) => updatePipelineStage(selectedDeal.id, e.target.value)} className={fieldClass}>
                          {STAGES.map((stage) => (
                            <option key={stage} value={stage}>{stage}</option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-1.5">
                        <span className={`text-[11px] font-black uppercase tracking-[0.12em] ${captionClass}`}>Interes</span>
                        <select value={selectedDeal.interest || 'Media'} onChange={(e) => updatePipelineDeal(selectedDeal.id, { interest: e.target.value })} className={fieldClass}>
                          {INTEREST_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-1.5">
                        <span className={`text-[11px] font-black uppercase tracking-[0.12em] ${captionClass}`}>Monto estimado</span>
                        <input
                          type="number"
                          min="0"
                          defaultValue={selectedDeal.estimatedAmount || 0}
                          onBlur={(e) => updateAmount(selectedDeal, e.target.value)}
                          className={fieldClass}
                        />
                      </label>
                      <label className="space-y-1.5 md:col-span-2">
                        <span className={`text-[11px] font-black uppercase tracking-[0.12em] ${captionClass}`}>Requerimiento</span>
                        <textarea
                          defaultValue={selectedDeal.requirement || ''}
                          onBlur={(e) => updatePipelineDeal(selectedDeal.id, { requirement: e.target.value.trim() })}
                          rows={4}
                          className={`${fieldClass} min-h-[110px] w-full resize-y`}
                          placeholder="Describe aqui lo que necesita el cliente"
                        />
                      </label>
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className={`text-[11px] font-black uppercase tracking-[0.18em] ${captionClass}`}>Archivos adjuntos</p>
                        <p className={`mt-1 text-sm ${captionClass}`}>{selectedDeal.attachments?.length || 0} archivo(s) cargado(s)</p>
                      </div>
                      <label className={`inline-flex cursor-pointer items-center rounded-xl border px-3 py-2 text-xs font-bold ${isDark ? 'border-white/20 text-white/85 hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                        <input type="file" multiple onChange={addAttachments} className="hidden" />
                        {isUploadingAttachment ? 'Cargando...' : 'Agregar archivos'}
                      </label>
                    </div>

                    <div className="mt-4 space-y-3">
                      {(selectedDeal.attachments || []).length === 0 ? (
                        <p className={`rounded-xl border border-dashed px-3 py-4 text-sm ${isDark ? 'border-white/15 text-white/50' : 'border-slate-300 text-slate-500'}`}>
                          Aun no hay archivos adjuntos en este lead.
                        </p>
                      ) : (
                        (selectedDeal.attachments || []).map((attachment) => (
                          <div key={attachment.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-3 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white'}`}>
                            <div>
                              <p className={`text-sm font-bold ${titleClass}`}>{attachment.name}</p>
                              <p className={`text-xs ${captionClass}`}>{toFileSize(attachment.size)} · {attachment.uploadedAt || 'Sin fecha'}</p>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={attachment.dataUrl}
                                download={attachment.name}
                                className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-3 py-2 text-xs font-black text-white"
                              >
                                Descargar
                              </a>
                              <button
                                type="button"
                                onClick={() => removePipelineAttachment(selectedDeal.id, attachment.id)}
                                className="rounded-xl border px-3 py-2 text-xs font-bold text-red-600"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>

                <aside className="space-y-4">
                  <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
                    <p className={`text-[11px] font-black uppercase tracking-[0.18em] ${captionClass}`}>Resumen del lead</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <p><strong className={titleClass}>Empresa:</strong> <span className={captionClass}>{selectedDeal.company || '-'}</span></p>
                      <p><strong className={titleClass}>Contacto:</strong> <span className={captionClass}>{selectedDeal.contact || '-'}</span></p>
                      <p><strong className={titleClass}>Telefono:</strong> <span className={captionClass}>{selectedDeal.phone || '-'}</span></p>
                      <p><strong className={titleClass}>Email:</strong> <span className={captionClass}>{selectedDeal.email || '-'}</span></p>
                      <p><strong className={titleClass}>Origen:</strong> <span className={captionClass}>{selectedDeal.leadSource || '-'}</span></p>
                      <p><strong className={titleClass}>Cotizacion:</strong> <span className={captionClass}>{selectedDeal.quoteReference || '-'}</span></p>
                      <p><strong className={titleClass}>Direccion:</strong> <span className={captionClass}>{selectedDeal.address || '-'}</span></p>
                      <p><strong className={titleClass}>Agregado:</strong> <span className={captionClass}>{toDateTime(selectedDeal.createdAt)}</span></p>
                      <p><strong className={titleClass}>Ultimo contacto:</strong> <span className={captionClass}>{toDateTime(selectedDeal.lastContactAt || selectedDeal.updatedAt)}</span></p>
                    </div>
                  </div>

                  <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
                    <p className={`text-[11px] font-black uppercase tracking-[0.18em] ${captionClass}`}>Notas de trabajo</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <p className={captionClass}>Usa este detalle para asignar seguimiento, revisar archivos y descargar documentos cuando el cliente los necesite.</p>
                      <p className={captionClass}>Si agregas cotizaciones o documentos al lead, quedaran visibles aqui para descarga rapida durante la gestion.</p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
