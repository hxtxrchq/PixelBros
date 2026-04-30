import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIntranet } from '../context/IntranetContext';

const STORAGE_KEY = 'pixelbros-calendar-manual-events-v2';

const eventTypes = [
  'Recordatorio',
  'Vencimiento de contrato',
  'Renovación cliente',
  'Visita presencial',
  'Aniversario',
  'Campaña',
  'Otro',
];
const visibilityOptions = [
  { value: 'team', label: 'Equipo' },
  { value: 'all', label: 'Todos' },
  { value: 'private', label: 'Solo yo' },
];
const repeatOptions = [
  { value: 'none', label: 'Una vez' },
  { value: 'yearly', label: 'Cada año' },
];

const emptyDraft = {
  title: '',
  date: '',
  type: 'Recordatorio',
  repeat: 'none',
  visibility: 'team',
  reminderDaysBefore: '7',
  notes: '',
};

const toDateInput = (value) => {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const parseLocalDate = (value) => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value, options = {}) => {
  const date = parseLocalDate(value);
  if (!date) return typeof value === 'string' && value ? value : 'Sin fecha';
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  });
};

const formatMonthTitle = (date) =>
  date.toLocaleDateString('es-PE', {
    month: 'long',
    year: 'numeric',
  });

const daysInMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();

const clampDay = (year, monthIndex, day) => Math.min(day, daysInMonth(year, monthIndex));

const makeDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getMondayStartGrid = (year, monthIndex) => {
  const first = new Date(year, monthIndex, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return current;
  });
};

const nextOccurrence = (event, fromDate = new Date()) => {
  const sourceDate = parseLocalDate(event.date);
  if (!sourceDate) return null;

  if (event.repeat === 'yearly') {
    const targetYear = fromDate.getFullYear();
    const monthIndex = sourceDate.getMonth();
    const day = sourceDate.getDate();
    let candidate = new Date(targetYear, monthIndex, clampDay(targetYear, monthIndex, day));

    if (candidate < fromDate) {
      const nextYear = targetYear + 1;
      candidate = new Date(nextYear, monthIndex, clampDay(nextYear, monthIndex, day));
    }

    return candidate;
  }

  return sourceDate >= fromDate ? sourceDate : null;
};

const occurrenceForMonth = (event, year, monthIndex) => {
  const sourceDate = parseLocalDate(event.date);
  if (!sourceDate) return null;

  if (event.repeat === 'yearly') {
    if (sourceDate.getMonth() !== monthIndex) return null;
    const candidate = new Date(year, monthIndex, clampDay(year, monthIndex, sourceDate.getDate()));
    return candidate;
  }

  return sourceDate.getFullYear() === year && sourceDate.getMonth() === monthIndex ? sourceDate : null;
};

const loadManualEvents = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const buildSystemEvents = () => [
  {
    id: 'pixel-anniversary-2026',
    title: 'Aniversario PixelBros - 6 años',
    date: '2026-05-01',
    type: 'Aniversario',
    repeat: 'yearly',
    visibility: 'all',
    notes: 'Aniversario de la empresa.',
    source: 'system',
    editable: false,
    reminderDaysBefore: 7,
  },
];

export default function CommercialCalendar() {
  const { updateCrmRecord, updateBrand } = useIntranet();
  const { user } = useAuth();

  const [manualEvents, setManualEvents] = useState(loadManualEvents);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [activeEvent, setActiveEvent] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(manualEvents));
  }, [manualEvents]);

  const systemEvents = useMemo(() => buildSystemEvents(), []);

  const allEvents = useMemo(() => [...systemEvents, ...manualEvents], [systemEvents, manualEvents]);

  const canSeeAll = user?.role === 'GLOBAL_ADMIN';

  const visibleEvents = useMemo(() => {
    if (canSeeAll) return allEvents;

    return allEvents.filter((event) => {
      if (event.visibility === 'all' || event.visibility === 'team') return true;
      if (event.visibility === 'private') return event.createdById === user?.id;
      return event.createdById === user?.id;
    });
  }, [allEvents, canSeeAll, user?.id]);

  const monthEvents = useMemo(() => {
    const year = viewDate.getFullYear();
    const monthIndex = viewDate.getMonth();

    return visibleEvents
      .map((event) => {
        const occurrence = occurrenceForMonth(event, year, monthIndex);
        if (!occurrence) return null;
        return { ...event, occurrence };
      })
      .filter(Boolean)
      .sort((a, b) => a.occurrence - b.occurrence);
  }, [visibleEvents, viewDate]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return visibleEvents
      .map((event) => {
        const occurrence = nextOccurrence(event, today);
        if (!occurrence) return null;

        const alertDate = new Date(occurrence);
        alertDate.setDate(alertDate.getDate() - Number(event.reminderDaysBefore || 0));

        return {
          ...event,
          occurrence,
          alertDate,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.alertDate - b.alertDate || a.occurrence - b.occurrence);
  }, [visibleEvents]);

  const monthEventMap = useMemo(() => {
    const map = new Map();
    monthEvents.forEach((event) => {
      const key = makeDateKey(event.occurrence);
      const list = map.get(key) || [];
      list.push(event);
      map.set(key, list);
    });
    return map;
  }, [monthEvents]);

  const selectedKey = makeDateKey(selectedDay);
  const selectedEvents = monthEventMap.get(selectedKey) || [];

  const calendarDays = useMemo(
    () => getMondayStartGrid(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate],
  );

  const openNewEvent = (date) => {
    setActiveEvent(null);
    setEditingEvent(null);
    setEditorOpen(true);
    setDraft({
      ...emptyDraft,
      date: toDateInput(date.toISOString().slice(0, 10)),
      visibility: canSeeAll ? 'team' : 'private',
    });
  };

  const openEditEvent = (event) => {
    setActiveEvent(null);
    setEditingEvent(event);
    setEditorOpen(true);
    setDraft({
      title: event.title,
      date: toDateInput(event.date),
      type: event.type || 'Recordatorio',
      repeat: event.repeat || 'none',
      visibility: event.visibility || 'team',
      reminderDaysBefore: String(event.reminderDaysBefore ?? 7),
      notes: event.notes || '',
    });
  };

  const closeModal = () => {
    setActiveEvent(null);
    setEditingEvent(null);
    setEditorOpen(false);
    setDraft(emptyDraft);
  };

  const applyEventUpdate = (event, nextDraft) => {
    const nextDate = nextDraft.date;

    if (event.source === 'crm') {
      const patch = { [event.sourceField]: nextDate };
      updateCrmRecord(event.sourceId, patch);
      return;
    }

    if (event.source === 'brand') {
      updateBrand(event.sourceId, { [event.sourceField]: nextDate });
      return;
    }

    setManualEvents((prev) =>
      prev.map((item) =>
        item.id === event.id
          ? {
              ...item,
              title: nextDraft.title.trim(),
              date: nextDraft.date,
              type: nextDraft.type,
              repeat: nextDraft.repeat,
              visibility: nextDraft.visibility,
              reminderDaysBefore: Number(nextDraft.reminderDaysBefore) || 0,
              notes: nextDraft.notes,
            }
          : item,
      ),
    );
  };

  const onSave = (event) => {
    event.preventDefault();
    if (!draft.date) return;

    if (editingEvent) {
      applyEventUpdate(editingEvent, draft);
      closeModal();
      return;
    }

    setManualEvents((prev) => [
      {
        id: `manual-${Date.now()}`,
        title: draft.title.trim(),
        date: draft.date,
        type: draft.type,
        repeat: draft.repeat,
        visibility: draft.visibility,
        reminderDaysBefore: Number(draft.reminderDaysBefore) || 0,
        notes: draft.notes,
        source: 'manual',
        createdById: user?.id || null,
        createdByName: user?.fullName || 'Equipo comercial',
        createdByRole: user?.role || null,
        editable: true,
      },
      ...prev,
    ]);

    closeModal();
  };

  const deleteEvent = (event) => {
    if (event.source === 'crm') {
      updateCrmRecord(event.sourceId, { [event.sourceField]: '' });
      closeModal();
      return;
    }

    if (event.source === 'brand') {
      updateBrand(event.sourceId, { [event.sourceField]: '' });
      closeModal();
      return;
    }

    setManualEvents((prev) => prev.filter((item) => item.id !== event.id));
    closeModal();
  };

  const selectedMonthLabel = formatMonthTitle(viewDate);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1029]/90 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(231,60,80,0.14),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(90,179,229,0.12),transparent_30%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff9eac]">Calendario comercial</p>
            <h2 className="intranet-heading mt-2 text-3xl font-black text-white">Recordatorios con fecha y contexto</h2>
            <p className="mt-2 max-w-3xl text-sm text-white/70">
              Un solo aniversario base de PixelBros y, desde ahí, recordatorios para vencimientos de contrato, renovaciones de clientes y visitas presenciales.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openNewEvent(new Date())}
            className="rounded-full bg-[#e73c50] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#cf3044]"
          >
            Nuevo evento
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="rounded-3xl border border-white/10 bg-[#0d1029]/90 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-2xl font-black text-white">{selectedMonthLabel}</h3>
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">
                {monthEvents.length} eventos visibles este mes
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/[0.08]"
              >
                Mes anterior
              </button>
              <button
                type="button"
                onClick={() => setViewDate(new Date())}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/[0.08]"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/[0.08]"
              >
                Mes siguiente
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
            {['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-2">
            {calendarDays.map((date) => {
              const key = makeDateKey(date);
              const dayEvents = monthEventMap.get(key) || [];
              const inMonth = date.getMonth() === viewDate.getMonth();
              const isToday = key === makeDateKey(new Date());
              const isSelected = key === selectedKey;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDay(date)}
                  onDoubleClick={() => openNewEvent(date)}
                  className={`group min-h-[120px] rounded-2xl border p-2 text-left transition ${
                    inMonth
                      ? isSelected
                        ? 'border-[#e73c50] bg-[#e73c50]/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                      : 'border-white/5 bg-white/[0.01] opacity-45'
                  } ${isToday ? 'ring-1 ring-[#5ab3e5]/55' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${isToday ? 'bg-[#5ab3e5] text-[#08111f]' : 'bg-white/[0.08] text-white'}`}>
                      {date.getDate()}
                    </span>
                    {dayEvents.length > 0 ? (
                      <span className="rounded-full bg-[#ff9eac]/15 px-2 py-0.5 text-[10px] font-black text-[#ffbac4]">
                        {dayEvents.length}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveEvent(event);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          if (event.source === 'manual') {
                            openEditEvent(event);
                            return;
                          }
                          setActiveEvent(event);
                        }}
                        role="button"
                        tabIndex={0}
                        className={`cursor-pointer rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] transition ${
                          event.type === 'Renovación'
                            ? 'bg-[#e73c50]/18 text-[#ffb8c3]'
                            : event.type === 'Aniversario'
                              ? 'bg-[#5ab3e5]/18 text-[#bfe7ff]'
                              : 'bg-white/[0.08] text-white/80'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 ? (
                      <div className="text-[10px] font-bold text-white/45">+{dayEvents.length - 3} más</div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-[#0d1029]/90 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">Eventos siguientes</h3>
                <p className="text-xs uppercase tracking-[0.14em] text-white/45">Lista completa ordenada por aviso</p>
              </div>
              <button
                type="button"
                onClick={() => openNewEvent(new Date())}
                className="rounded-full bg-[#e73c50] px-3 py-2 text-xs font-black text-white transition hover:bg-[#cf3044]"
              >
                Agregar evento
              </button>
            </div>

            <div className="mt-4 max-h-[560px] space-y-3 overflow-auto pr-1">
              {upcomingEvents.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-sm text-white/55">
                  Todavía no hay eventos programados.
                </p>
              ) : (
                upcomingEvents.map((event) => {
                  const daysLeft = Math.ceil((event.alertDate - new Date()) / (1000 * 60 * 60 * 24));
                  const canEdit = event.source === 'manual';

                  return (
                    <div
                      key={`${event.id}-${makeDateKey(event.occurrence)}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveEvent(event)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#ff9eac]">{event.type}</p>
                          <h4 className="mt-1 text-sm font-black text-white">{event.title}</h4>
                          <p className="mt-1 text-xs text-white/55">Evento: {formatDate(makeDateKey(event.occurrence))}</p>
                          <p className="text-xs text-white/55">Aviso: {daysLeft <= 0 ? 'Hoy' : `en ${daysLeft} días`}</p>
                        </button>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${daysLeft <= 3 ? 'bg-[#e73c50]/20 text-[#ffb8c3]' : 'bg-[#5ab3e5]/15 text-[#cdeeff]'}`}>
                            {event.repeat === 'yearly' ? 'Anual' : 'Una vez'}
                          </span>
                          <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-black text-white/60">
                            {event.source === 'system' ? 'PixelBros' : event.source === 'manual' ? 'Manual' : 'Vinculado'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveEvent(event)}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-black text-white/80"
                        >
                          Ver
                        </button>
                        {canEdit ? (
                          <button
                            type="button"
                            onClick={() => openEditEvent(event)}
                            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-black text-white/80"
                          >
                            Editar
                          </button>
                        ) : null}
                        {canEdit ? (
                          <button
                            type="button"
                            onClick={() => deleteEvent(event)}
                            className="rounded-full border border-[#e73c50]/30 bg-[#e73c50]/10 px-3 py-1.5 text-xs font-black text-[#ffb8c3]"
                          >
                            Eliminar
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#0d1029]/90 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">Día seleccionado</h3>
                <p className="text-xs uppercase tracking-[0.14em] text-white/45">{formatDate(selectedKey)}</p>
              </div>
              <button
                type="button"
                onClick={() => openNewEvent(selectedDay)}
                className="rounded-full bg-[#e73c50] px-3 py-2 text-xs font-black text-white transition hover:bg-[#cf3044]"
              >
                Agregar aquí
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {selectedEvents.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-sm text-white/55">
                  No hay eventos en este día. Puedes hacer doble click en la fecha para crear uno.
                </p>
              ) : (
                selectedEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#ff9eac]">{event.type}</p>
                        <h4 className="mt-1 font-black text-white">{event.title}</h4>
                        <p className="text-xs text-white/55">{event.source === 'manual' ? 'Evento manual' : 'Evento vinculado a CRM/Marca'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveEvent(event)}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/80"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </section>

      {activeEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0d1029] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff9eac]">Detalle del evento</p>
                <h3 className="mt-1 text-2xl font-black text-white">{activeEvent.title}</h3>
                <p className="text-sm text-white/60">{activeEvent.type} · {formatDate(activeEvent.occurrence || activeEvent.date)}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-black text-white/75"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/45">Evento</p>
                  <p className="mt-1 text-sm font-bold text-white">{activeEvent.title}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/45">Fuente</p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {activeEvent.source === 'manual'
                      ? 'Manual'
                      : activeEvent.source === 'system'
                        ? 'PixelBros'
                        : activeEvent.source === 'crm'
                          ? 'CRM'
                          : 'Marca'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/45">Aviso</p>
                  <p className="mt-1 text-sm font-bold text-white">{activeEvent.reminderDaysBefore || 0} días antes</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/45">Notas</p>
                  <p className="mt-1 text-sm text-white/70">{activeEvent.notes || 'Sin notas'}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                {activeEvent.source === 'manual' ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditEvent(activeEvent)}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-black text-white/80"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteEvent(activeEvent)}
                      className="rounded-full border border-[#e73c50]/30 bg-[#e73c50]/10 px-4 py-2 text-sm font-black text-[#ffb8c3]"
                    >
                      Quitar fecha
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-white/60">
                    Este es el evento base de PixelBros. Las fechas operativas se agregan como eventos manuales.
                  </p>
                )}

                <p className="mt-4 text-xs text-white/55">
                  Si el evento viene de CRM o de una marca, al editarlo se actualiza la fecha original para mantener coherencia.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {editorOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm">
          <form
            onSubmit={onSave}
            className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0d1029] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff9eac]">
                  {editingEvent ? 'Editar evento' : 'Nuevo evento'}
                </p>
                <h3 className="mt-1 text-2xl font-black text-white">
                  {editingEvent ? editingEvent.title : 'Crear recordatorio'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-black text-white/75"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <input
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder="Nombre del evento"
                disabled={Boolean(editingEvent && editingEvent.source !== 'manual')}
                className="rounded-xl border border-white/10 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
              <input
                type="date"
                value={draft.date}
                onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                className="rounded-xl border border-white/10 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
              />
              <select
                value={draft.type}
                onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))}
                disabled={Boolean(editingEvent && editingEvent.source !== 'manual')}
                className="rounded-xl border border-white/10 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={draft.repeat}
                onChange={(event) => setDraft((current) => ({ ...current, repeat: event.target.value }))}
                disabled={Boolean(editingEvent && editingEvent.source !== 'manual')}
                className="rounded-xl border border-white/10 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {repeatOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={draft.visibility}
                onChange={(event) => setDraft((current) => ({ ...current, visibility: event.target.value }))}
                disabled={Boolean(editingEvent && editingEvent.source !== 'manual')}
                className="rounded-xl border border-white/10 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {visibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                value={draft.reminderDaysBefore}
                onChange={(event) => setDraft((current) => ({ ...current, reminderDaysBefore: event.target.value }))}
                placeholder="Días de aviso"
                className="rounded-xl border border-white/10 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <textarea
              value={draft.notes}
              onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Notas, contexto o motivo del recordatorio"
              rows={4}
              className="mt-3 w-full rounded-xl border border-white/10 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
            />

            <div className="mt-5 flex flex-wrap justify-between gap-2">
              <div className="text-xs text-white/55">
                {editingEvent
                  ? 'Los eventos manuales quedan guardados para el usuario actual en este navegador.'
                  : 'Usa esto para vencimientos de contrato, renovaciones de cliente y visitas presenciales.'}
              </div>

              <div className="flex flex-wrap gap-2">
                {editingEvent ? (
                  <button
                    type="button"
                    onClick={() => deleteEvent(editingEvent)}
                    className="rounded-full border border-[#e73c50]/30 bg-[#e73c50]/10 px-4 py-2 text-sm font-black text-[#ffb8c3]"
                  >
                    Eliminar
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-black text-white/80"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#e73c50] px-4 py-2 text-sm font-black text-white"
                >
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
