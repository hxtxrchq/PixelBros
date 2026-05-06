import { useCallback, useEffect, useMemo, useState } from 'react';
import { usersClient } from '../services/usersClient';
import { rolesClient } from '../services/rolesClient';

const ROLE_KEYS = ['GLOBAL_ADMIN', 'TI_ADMIN', 'STAFF'];

const DEFAULT_ROLE_META = {
  GLOBAL_ADMIN: { label: 'Administrador global', description: 'Acceso completo al sistema', color: '#e73c50' },
  TI_ADMIN: { label: 'TI', description: 'Administrador de tecnología', color: '#6c84ff' },
  STAFF: { label: 'Staff', description: 'Usuario estándar del equipo', color: '#35c98f' },
};

const panelOptions = [
  { value: 'home', label: 'Home' },
  { value: 'usuarios', label: 'Usuarios' },
  { value: 'contenido', label: 'Contenido' },
  { value: 'crm', label: 'CRM' },
  { value: 'cotizaciones', label: 'Cotizaciones' },
  { value: 'embudo', label: 'Kanban' },
  { value: 'requerimientos', label: 'Requerimientos' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'reportes', label: 'Reportes' },
  { value: 'calendario', label: 'Calendario' },
];

const emptyForm = { fullName: '', email: '', role: 'GLOBAL_ADMIN', isActive: true, dashboardPanels: [] };

// ─── Roles Panel (solo lectura) ─────────────────────────────────────────────────
function RolesPanel() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await rolesClient.list();
      setRoles(data.length ? data : ROLE_KEYS.map((k) => ({ key: k, ...DEFAULT_ROLE_META[k] })));
    } catch {
      setRoles(ROLE_KEYS.map((k) => ({ key: k, ...DEFAULT_ROLE_META[k] })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRoles(); }, [loadRoles]);

  return (
    <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f1230] to-[#12173d] p-6 shadow-[0_20px_56px_rgba(0,0,0,0.35)]">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#6c84ff]">Configuración</p>
        <h4 className="intranet-heading mt-1 text-xl font-black text-white">Roles del sistema</h4>
        <p className="mt-1 text-sm text-white/60">Roles disponibles para los integrantes del equipo.</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {loading
          ? ROLE_KEYS.map((k) => (
              <div key={k} className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-4 h-20" />
            ))
          : roles.map((role) => (
              <div key={role.key} className="rounded-2xl border border-white/10 bg-[#090c22]/80 p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ background: role.color || '#888' }}
                  />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">{role.key}</p>
                </div>
                <p className="text-base font-black text-white">{role.label}</p>
                {role.description && <p className="text-xs text-white/50">{role.description}</p>}
              </div>
            ))}
      </div>
    </article>
  );
}

// ─── Main Users Page ────────────────────────────────────────────────────────────
export default function Users() {
  const [users, setUsers] = useState([]);
  const [rolesMeta, setRolesMeta] = useState(DEFAULT_ROLE_META);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [tempPassword, setTempPassword] = useState('');

  const roleOptions = useMemo(
    () => ROLE_KEYS.map((k) => ({ value: k, label: rolesMeta[k]?.label ?? k })),
    [rolesMeta],
  );

  const buildTempPassword = (value) => {
    const cleaned = String(value ?? '').replace(/[^a-z0-9]/gi, '');
    const base = cleaned.length > 0 ? cleaned : 'Usuario';
    const padded = base.length >= 6 ? base : base.padEnd(6, '0');
    return `${padded}01`;
  };

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [rows, remoteRoles] = await Promise.all([
        usersClient.list(),
        rolesClient.list().catch(() => []),
      ]);
      setUsers(rows);
      if (remoteRoles.length) {
        const map = {};
        remoteRoles.forEach((r) => { map[r.key] = r; });
        setRolesMeta((prev) => ({ ...prev, ...map }));
      }
    } catch (loadError) {
      setError(loadError.message || 'No se pudo cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const activeUsers = useMemo(() => users.filter((u) => u.isActive).length, [users]);

  const resetForm = (keepTempPassword = false) => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
    if (!keepTempPassword) setTempPassword('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.fullName.trim()) return;
    try {
      setSubmitting(true);
      setError('');
      if (editingId) {
        const updated = await usersClient.update(editingId, {
          fullName: form.fullName.trim(), role: form.role, isActive: form.isActive, dashboardPanels: form.dashboardPanels,
        });
        setUsers((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        resetForm();
        return;
      }
      if (!form.email.trim()) { setError('Email es obligatorio para crear usuario.'); return; }
      const created = await usersClient.create({
        fullName: form.fullName.trim(), email: form.email.trim(), role: form.role, isActive: form.isActive, dashboardPanels: form.dashboardPanels,
      });
      if (created?.tempPassword) setTempPassword(created.tempPassword);
      setUsers((prev) => [created.user ?? created, ...prev]);
      resetForm(true);
    } catch (submitError) {
      setError(submitError.message || 'No se pudo guardar el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (user) => {
    setEditingId(user.id);
    setForm({ fullName: user.fullName, email: user.email, role: user.role, isActive: user.isActive, dashboardPanels: Array.isArray(user.dashboardPanels) ? user.dashboardPanels : [] });
    setTempPassword('');
    setFormOpen(true);
  };

  const onDelete = async (id) => {
    try {
      const updated = await usersClient.update(id, { isActive: false });
      setUsers((prev) => prev.map((item) => (item.id === id ? updated : item)));
      if (editingId === id) resetForm();
    } catch (deleteError) {
      setError(deleteError.message || 'No se pudo desactivar el usuario');
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <article className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0f1230] to-[#151c49] p-6 shadow-[0_20px_56px_rgba(0,0,0,0.35)]">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ff9eac]">Usuarios</p>
        <h3 className="intranet-heading mt-2 text-3xl font-black text-white">Gestion de equipo</h3>
        <p className="mt-2 text-sm text-white/70">Visualiza roles y estado de cada integrante con una vista clara y rapida.</p>
      </article>

      {/* Stats */}
      <article className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#0d1029]/75 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/55">Total usuarios</p>
          <p className="mt-1 text-3xl font-black text-white">{users.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d1029]/75 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/55">Activos</p>
          <p className="mt-1 text-3xl font-black text-[#90f0cb]">{activeUsers}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d1029]/75 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/55">Pendientes</p>
          <p className="mt-1 text-3xl font-black text-[#ffd38f]">{users.length - activeUsers}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d1029]/75 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/55">Roles</p>
          <p className="mt-1 text-3xl font-black text-white">{new Set(users.map((u) => u.role)).size}</p>
        </div>
      </article>

      {/* Roles management panel */}
      <RolesPanel />

      {/* User form */}
      <article className="rounded-2xl border border-white/10 bg-[#0d1029]/75 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => { setFormOpen(true); setEditingId(null); setForm(emptyForm); setTempPassword(''); }}
            className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2 text-sm font-bold text-white"
          >
            Agregar usuario
          </button>
          <span className="text-sm text-white/65">Usuarios y roles sincronizados con la base de datos.</span>
        </div>

        {error && <p className="mt-4 rounded-xl border border-[#e73c50]/40 bg-[#e73c50]/10 px-3 py-2 text-sm text-[#ffd2d8]">{error}</p>}
        {tempPassword && (
          <p className="mt-4 rounded-xl border border-[#35c98f]/40 bg-[#35c98f]/10 px-3 py-2 text-sm text-[#bff6e2]">
            Contrasena temporal creada: <span className="font-semibold">{tempPassword}</span>
          </p>
        )}

      {formOpen && (
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                {editingId ? 'Editar usuario' : 'Nuevo usuario'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  title={editingId ? 'Guardar cambios' : 'Crear usuario'}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#35c98f]/20 text-[#90f0cb] hover:bg-[#35c98f]/35 disabled:opacity-50 transition"
                >
                  {submitting ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  title="Cancelar"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/50 hover:border-white/30 hover:text-white transition"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="Nombre" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" />
              <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Correo" disabled={Boolean(editingId)} className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none disabled:opacity-50" />
              <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none">
                {roleOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <label className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="h-4 w-4 accent-[#e73c50]" />
                Activo
              </label>
              {!editingId && (
                <div className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white/75">
                  Contrasena temporal: <span className="font-semibold text-white">{buildTempPassword(form.fullName || form.email)}</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Paneles permitidos</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {panelOptions.map((panel) => (
                  <label key={panel.value} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white">
                    <input type="checkbox" checked={form.dashboardPanels.includes(panel.value)} onChange={(e) => setForm((p) => ({ ...p, dashboardPanels: e.target.checked ? [...p.dashboardPanels, panel.value] : p.dashboardPanels.filter((i) => i !== panel.value) }))} className="h-4 w-4 accent-[#e73c50]" />
                    {panel.label}
                  </label>
                ))}
              </div>
            </div>
          </form>
        )}
      </article>

      {/* Users table */}
      <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1029]/75 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        <div className="grid grid-cols-[1.2fr_1fr_0.7fr_0.9fr] border-b border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white/60 md:px-6">
          <span>Nombre</span><span>Rol</span><span>Estado</span><span>Acciones</span>
        </div>
        <div className="divide-y divide-white/10">
          {isLoading ? (
            <div className="px-6 py-6 text-sm text-white/70">Cargando usuarios...</div>
          ) : users.map((user) => (
            <div key={user.id} className="grid grid-cols-[1.2fr_1fr_0.7fr_0.9fr] items-center px-4 py-3.5 text-sm md:px-6">
              <span className="flex items-center gap-2 font-semibold text-white">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-black text-white">{user.fullName.slice(0, 2).toUpperCase()}</span>
                {user.fullName}
              </span>
              <span className="flex items-center gap-1.5 text-white/75">
                {rolesMeta[user.role]?.color && <span className="inline-block h-2 w-2 rounded-full flex-shrink-0" style={{ background: rolesMeta[user.role].color }} />}
                {rolesMeta[user.role]?.label ?? user.role}
              </span>
              <span className={`inline-flex w-max rounded-full px-2 py-1 text-xs font-semibold ${user.isActive ? 'bg-[#35c98f]/20 text-[#90f0cb]' : 'bg-[#f5a524]/20 text-[#ffd38f]'}`}>
                {user.isActive ? 'Activo' : 'Inactivo'}
              </span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onEdit(user)} className="rounded-lg border border-white/20 px-2 py-1 text-xs font-bold text-white/85 hover:border-white/40">Editar</button>
                <button type="button" onClick={() => onDelete(user.id)} className="rounded-lg border border-[#e73c50]/40 px-2 py-1 text-xs font-bold text-[#ffb1bc] hover:bg-[#e73c50]/15">Desactivar</button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
