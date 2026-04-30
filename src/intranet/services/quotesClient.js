import { authRequest } from './authClient';

const parsePayload = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message ?? fallbackMessage);
  }

  return payload;
};

export const quoteStatuses = ['Enviada', 'Aprobada', 'Rechazada', 'En negociación'];

export const quotesClient = {
  async list(filters = {}) {
    const params = new URLSearchParams();

    if (filters.status) {
      params.set('status', filters.status);
    }

    if (filters.search) {
      params.set('search', filters.search);
    }

    const query = params.toString();
    const response = await authRequest(`/quotes${query ? `?${query}` : ''}`);
    const payload = await parsePayload(response, 'No se pudo cargar cotizaciones');

    return payload.items ?? [];
  },

  async getById(quoteId) {
    const response = await authRequest(`/quotes/${quoteId}`);
    const payload = await parsePayload(response, 'No se pudo cargar la cotizacion');
    return payload.item;
  },

  async create(input) {
    const response = await authRequest('/quotes', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    const payload = await parsePayload(response, 'No se pudo crear la cotizacion');
    return payload.item;
  },

  async updateStatus(quoteId, status) {
    const response = await authRequest(`/quotes/${quoteId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    const payload = await parsePayload(response, 'No se pudo actualizar el estado de la cotizacion');
    return payload.item;
  },

  async remove(quoteId) {
    const response = await authRequest(`/quotes/${quoteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message ?? 'No se pudo eliminar la cotizacion');
    }
  },
};
