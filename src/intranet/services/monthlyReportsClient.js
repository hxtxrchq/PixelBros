import { authRequest } from './authClient';

const BASE = '/monthly-reports';

const parse = async (res, fallback) => {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.message ?? fallback);
  return payload;
};

export const monthlyReportsClient = {
  async list(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.year) params.set('year', String(filters.year));
    const qs = params.toString();
    const res = await authRequest(`${BASE}${qs ? `?${qs}` : ''}`);
    const payload = await parse(res, 'No se pudieron cargar los reportes');
    return payload.reports ?? [];
  },

  async get(id) {
    const res = await authRequest(`${BASE}/${id}`);
    const payload = await parse(res, 'No se pudo cargar el reporte');
    return payload.report;
  },

  async save({ type, period, year, month, snapshot, meta }) {
    const res = await authRequest(BASE, {
      method: 'POST',
      body: JSON.stringify({ type, period, year, month, snapshot, meta }),
    });
    const payload = await parse(res, 'No se pudo guardar el reporte');
    return payload.report;
  },

  async remove(id) {
    const res = await authRequest(`${BASE}/${id}`, { method: 'DELETE' });
    await parse(res, 'No se pudo eliminar el reporte');
  },
};
