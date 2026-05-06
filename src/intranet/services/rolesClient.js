import { authRequest } from './authClient';

const parsePayload = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message ?? fallbackMessage);
  }
  return payload;
};

export const rolesClient = {
  async list() {
    const response = await authRequest('/roles');
    const payload = await parsePayload(response, 'No se pudieron cargar los roles');
    return payload.roles ?? [];
  },

  async update(key, { label, description, color }) {
    const response = await authRequest(`/roles/${key}`, {
      method: 'PATCH',
      body: JSON.stringify({ label, description, color }),
    });
    const payload = await parsePayload(response, 'No se pudo actualizar el rol');
    return payload.role;
  },
};
