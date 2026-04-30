const normalizeBaseUrl = (url) => url.replace(/\/$/, '');

const resolveApiBaseUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (typeof envApiUrl === 'string' && envApiUrl.trim().length > 0) {
    return normalizeBaseUrl(envApiUrl.trim());
  }

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;

    if (hostname === 'pixelbros.pe' || hostname === 'www.pixelbros.pe') {
      return 'https://backendpixel.chiqo.site/api/v1';
    }
  }

  return 'http://localhost:4000/api/v1';
};

const API_BASE_URL = resolveApiBaseUrl();

const toAbsoluteUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL.replace(/\/api\/v1$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const listPublicContent = async () => {
  const response = await fetch(`${API_BASE_URL}/public/content`, {
    credentials: 'include',
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message ?? 'No se pudo cargar contenido publico');
  }

  return (payload.items ?? []).map((item) => ({
    ...item,
    coverUrl: toAbsoluteUrl(item.coverUrl),
    medias: Array.isArray(item.medias)
      ? item.medias.map((media) => ({
          ...media,
          url: toAbsoluteUrl(media.url),
        }))
      : [],
  }));
};
