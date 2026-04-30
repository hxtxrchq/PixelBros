import { authRequest, getApiBaseUrl } from './authClient';

const parsePayload = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message ?? fallbackMessage);
  }

  return payload;
};

const toAbsoluteUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;

  return `${getApiBaseUrl().replace(/\/api\/v1$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
};

const normalizeItem = (item) => ({
  ...item,
  coverUrl: toAbsoluteUrl(item.coverUrl),
  medias: Array.isArray(item.medias)
    ? item.medias.map((media) => ({
        ...media,
        url: toAbsoluteUrl(media.url),
      }))
    : undefined,
});

export const contentClient = {
  async list() {
    const response = await authRequest('/content');
    const payload = await parsePayload(response, 'No se pudo cargar el contenido');
    return (payload.items ?? []).map(normalizeItem);
  },

  async getById(contentId) {
    const response = await authRequest(`/content/${contentId}`);
    const payload = await parsePayload(response, 'No se pudo cargar el detalle del contenido');
    return normalizeItem(payload.item);
  },

  async create(input) {
    const form = new FormData();
    form.append('companyName', input.companyName);
    form.append('title', input.title || '');
    form.append('category', input.category);
    form.append('showOnHome', String(Boolean(input.showOnHome)));
    form.append('showOnPortfolio', String(Boolean(input.showOnPortfolio)));

    if (input.coverFile) {
      form.append('cover', input.coverFile);
    }

    for (const file of input.galleryFiles ?? []) {
      form.append('gallery', file);
    }

    const response = await authRequest('/content', {
      method: 'POST',
      body: form,
    });

    const payload = await parsePayload(response, 'No se pudo crear el contenido');
    return normalizeItem(payload.item);
  },

  async update(contentId, input) {
    const hasFileChanges = Boolean(input.coverFile) || Boolean(input.galleryFiles?.length);
    const removeMediaIds = Array.isArray(input.removeMediaIds) ? input.removeMediaIds : [];

    const response = hasFileChanges
      ? await authRequest(`/content/${contentId}`, {
          method: 'PATCH',
          body: (() => {
            const form = new FormData();
            if (input.companyName !== undefined) form.append('companyName', input.companyName);
            if (input.title !== undefined) form.append('title', input.title);
            if (input.category !== undefined) form.append('category', input.category);
            if (input.showOnHome !== undefined) form.append('showOnHome', String(Boolean(input.showOnHome)));
            if (input.showOnPortfolio !== undefined) form.append('showOnPortfolio', String(Boolean(input.showOnPortfolio)));
            if (input.coverFile) form.append('cover', input.coverFile);
            for (const file of input.galleryFiles ?? []) {
              form.append('gallery', file);
            }
            for (const mediaId of removeMediaIds) {
              form.append('removeMediaIds', mediaId);
            }
            return form;
          })(),
        })
      : await authRequest(`/content/${contentId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            ...input,
            removeMediaIds,
          }),
        });

    const payload = await parsePayload(response, 'No se pudo actualizar el contenido');
    return normalizeItem(payload.item);
  },

  async remove(contentId) {
    const response = await authRequest(`/content/${contentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message ?? 'No se pudo eliminar el contenido');
    }
  },

  async listPublic() {
    const response = await authRequest('/public/content', {
      headers: {},
    });

    const payload = await parsePayload(response, 'No se pudo cargar contenido publico');
    return (payload.items ?? []).map(normalizeItem);
  },
};
