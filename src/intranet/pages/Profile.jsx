import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '' });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      fullName: user.fullName ?? '',
      email: user.email ?? '',
    });
  }, [user]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');

    if (!profileForm.fullName.trim()) {
      setProfileError('Ingresa tu nombre completo.');
      return;
    }

    if (!profileForm.email.trim()) {
      setProfileError('Ingresa tu correo.');
      return;
    }

    try {
      setProfileSaving(true);
      await updateProfile({
        fullName: profileForm.fullName.trim(),
        email: profileForm.email.trim(),
      });
      setProfileMessage('Perfil actualizado correctamente.');
    } catch (error) {
      setProfileError(error.message || 'No se pudo actualizar el perfil.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError('Completa todos los campos de contraseña.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('La confirmación no coincide.');
      return;
    }

    try {
      setPasswordSaving(true);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage('Contraseña actualizada.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.message || 'No se pudo actualizar la contraseña.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <article className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#0f1230] to-[#151c49] p-6 shadow-[0_20px_56px_rgba(0,0,0,0.35)]">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ff9eac]">Mi perfil</p>
        <h3 className="intranet-heading mt-2 text-3xl font-black text-white">Actualiza tus datos</h3>
        <p className="mt-2 text-sm text-white/70">Modifica tu información y cambia tu contraseña cuando lo necesites.</p>
      </article>

      <article className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0d1029]/75 p-5">
          <h4 className="text-lg font-bold text-white">Datos personales</h4>
          <p className="mt-1 text-sm text-white/65">Nombre completo y correo de acceso.</p>

          {profileError && (
            <p className="mt-4 rounded-xl border border-[#e73c50]/40 bg-[#e73c50]/10 px-3 py-2 text-sm text-[#ffd2d8]">{profileError}</p>
          )}
          {profileMessage && (
            <p className="mt-4 rounded-xl border border-[#35c98f]/40 bg-[#35c98f]/10 px-3 py-2 text-sm text-[#bff6e2]">{profileMessage}</p>
          )}

          <form onSubmit={handleProfileSubmit} className="mt-4 grid gap-3">
            <input
              value={profileForm.fullName}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Nombre completo"
              className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
            />
            <input
              value={profileForm.email}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Correo"
              className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
            />
            <button
              type="submit"
              disabled={profileSaving}
              className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/20 disabled:opacity-60"
            >
              {profileSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1029]/75 p-5">
          <h4 className="text-lg font-bold text-white">Cambiar contraseña</h4>
          <p className="mt-1 text-sm text-white/65">Recomendado al primer ingreso.</p>

          {passwordError && (
            <p className="mt-4 rounded-xl border border-[#e73c50]/40 bg-[#e73c50]/10 px-3 py-2 text-sm text-[#ffd2d8]">{passwordError}</p>
          )}
          {passwordMessage && (
            <p className="mt-4 rounded-xl border border-[#35c98f]/40 bg-[#35c98f]/10 px-3 py-2 text-sm text-[#bff6e2]">{passwordMessage}</p>
          )}

          <form onSubmit={handlePasswordSubmit} className="mt-4 grid gap-3">
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Contraseña actual"
              className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
            />
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Nueva contraseña"
              className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
            />
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirmar nueva contraseña"
              className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none"
            />
            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/20 disabled:opacity-60"
            >
              {passwordSaving ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </article>
    </section>
  );
}
