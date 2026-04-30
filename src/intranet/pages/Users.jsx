import { useEffect, useMemo, useState } from 'react';
import { usersClient } from '../services/usersClient';

const roleOptions = [
  { value: 'GLOBAL_ADMIN', label: 'Administrador global' },
  { value: 'TI_ADMIN', label: 'TI' },
];

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
  role: roleOptions[0].value,
  isActive: true,
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const rows = await usersClient.list();
      setUsers(rows);
    } catch (loadError) {
      setError(loadError.message || 'No se pudo cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const activeUsers = useMemo(() => users.filter((u) => u.isActive).length, [users]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.fullName.trim()) return;

    try {
      setSubmitting(true);
      setError('');

      if (editingId) {
        const payload = {
          fullName: form.fullName.trim(),
          role: form.role,
          isActive: form.isActive,
        };

        const updated = await usersClient.update(editingId, payload);
        setUsers((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        resetForm();
        return;
      }

      if (!form.email.trim() || !form.password.trim()) {
        setError('Email y password son obligatorios para crear usuario.');
        return;
      }

      const created = await usersClient.create({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      setUsers((prev) => [created, ...prev]);
      resetForm();
    } catch (submitError) {
      setError(submitError.message || 'No se pudo guardar el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (user) => {
    setEditingId(user.id);
    setForm({
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
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

  const roleLabelByValue = useMemo(() => Object.fromEntries(roleOptions.map((role) => [role.value, role.label])), []);

  return (
    <section className="space-y-6">
      <article className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0f1230] to-[#151c49] p-6 shadow-[0_20px_56px_rgba(0,0,0,0.35)]">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ff9eac]">Usuarios</p>
        <h3 className="intranet-heading mt-2 text-3xl font-black text-white">Gestion de equipo</h3>
        <p className="mt-2 text-sm text-white/70">Visualiza roles y estado de cada integrante con una vista clara y rapida.</p>
      </article>

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

      <article className="rounded-2xl border border-white/10 bg-[#0d1029]/75 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setFormOpen(true);
              setEditingId(null);
              setForm(emptyForm);
            }}
            className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2 text-sm font-bold text-white"
          >
            Agregar usuario
          </button>
          <span className="text-sm text-white/65">Usuarios y roles sincronizados con la base de datos.</span>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-[#e73c50]/40 bg-[#e73c50]/10 px-3 py-2 text-sm text-[#ffd2d8]">{error}</p>
        )}

        {formOpen && (
          <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-4">
            <input
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Nombre"
              className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
            />

            <input
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Correo"
              disabled={Boolean(editingId)}
              className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none disabled:opacity-50"
            />

            {!editingId && (
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
              />
            )}

            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            <label className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 accent-[#e73c50]"
              />
              Activo
            </label>

            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/20 disabled:opacity-60">
                {submitting ? 'Guardando...' : editingId ? 'Guardar' : 'Crear'}
              </button>
              <button type="button" onClick={resetForm} className="rounded-xl border border-white/20 px-3 py-2 text-sm font-bold text-white/80">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </article>

      <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1029]/75 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        <div className="grid grid-cols-[1.2fr_1fr_0.7fr_0.9fr] border-b border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white/60 md:px-6">
          <span>Nombre</span>
          <span>Rol</span>
          <span>Estado</span>
          <span>Acciones</span>
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
              <span className="text-white/75">{roleLabelByValue[user.role] ?? user.role}</span>
              <span className={`inline-flex w-max rounded-full px-2 py-1 text-xs font-semibold ${user.isActive ? 'bg-[#35c98f]/20 text-[#90f0cb]' : 'bg-[#f5a524]/20 text-[#ffd38f]'}`}>
                {user.isActive ? 'Activo' : 'Inactivo'}
              </span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onEdit(user)} className="rounded-lg border border-white/20 px-2 py-1 text-xs font-bold text-white/85 hover:border-white/40">
                  Editar
                </button>
                <button type="button" onClick={() => onDelete(user.id)} className="rounded-lg border border-[#e73c50]/40 px-2 py-1 text-xs font-bold text-[#ffb1bc] hover:bg-[#e73c50]/15">
                  Desactivar
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
