import { authRequest } from './authClient';

const parsePayload = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message ?? fallbackMessage);
  }

  return payload;
};

export const usersClient = {
  async list() {
    const response = await authRequest('/users');
    const payload = await parsePayload(response, 'No se pudo cargar usuarios');
    return payload.users ?? [];
  },

  async create(input) {
    const response = await authRequest('/users', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    const payload = await parsePayload(response, 'No se pudo crear el usuario');
    return payload.user;
  },

  async update(userId, input) {
    const response = await authRequest(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });

    const payload = await parsePayload(response, 'No se pudo actualizar el usuario');
    return payload.user;
  },
};
