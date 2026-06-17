const normalizeBaseUrl = (url) => url.replace(/\/$/, '');

const resolveApiBaseUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (typeof envApiUrl === 'string' && envApiUrl.trim().length > 0) {
    return normalizeBaseUrl(envApiUrl.trim());
  }

  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;

    if (hostname === 'pixelbros.pe' || hostname.endsWith('.pixelbros.pe')) {
      return 'https://backendpixel.chiqo.site/api/v1';
    }

    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${normalizeBaseUrl(origin)}/api/v1`;
    }
  }

  return 'http://localhost:4000/api/v1';
};

const API_BASE_URL = resolveApiBaseUrl();

const toAbsoluteUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/logos/')) return url;
  // Keep the API prefix so uploaded assets can be served from `${API_BASE}/uploads/...`
  // (useful behind reverse proxies that only expose the API prefix).
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

let publicContentCache = null; // cached items
let homeContentCache = null; // cached home items

export const clearPublicContentCache = () => {
  publicContentCache = null;
  homeContentCache = null;
};

export const listPublicContent = async () => {
  if (publicContentCache) return publicContentCache;

  const run = async () => {
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
      logoUrl: toAbsoluteUrl(item.logoUrl),
      medias: Array.isArray(item.medias)
        ? item.medias.map((media) => ({
            ...media,
            url: toAbsoluteUrl(media.url),
          }))
        : [],
    }));
  };

  publicContentCache = run().catch((err) => {
    publicContentCache = null;
    throw err;
  });

  return publicContentCache;
};

export const listHomeContent = async () => {
  if (homeContentCache) return homeContentCache;

  const run = async () => {
    const response = await fetch(`${API_BASE_URL}/public/content/home`, {
      credentials: 'include',
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message ?? 'No se pudo cargar contenido publico');
    }

    return (payload.items ?? []).map((item) => ({
      ...item,
      coverUrl: toAbsoluteUrl(item.coverUrl),
      logoUrl: toAbsoluteUrl(item.logoUrl),
      medias: Array.isArray(item.medias)
        ? item.medias.map((media) => ({
            ...media,
            url: toAbsoluteUrl(media.url),
          }))
        : [],
    }));
  };

  homeContentCache = run().catch((err) => {
    homeContentCache = null;
    throw err;
  });

  return homeContentCache;
};

