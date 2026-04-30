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
const ACCESS_TOKEN_KEY = 'pixelbros_intranet_access_token';

const getAccessToken = () => window.localStorage.getItem(ACCESS_TOKEN_KEY);

const setAccessToken = (token) => {
  if (!token) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

const authFetch = async (path, options = {}) => {
  const token = getAccessToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  return response;
};

export const authRequest = async (path, options = {}) => {
  return authFetch(path, options);
};

export const getApiBaseUrl = () => API_BASE_URL;

export const authClient = {
  async login(email, password) {
    const response = await authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message ?? 'No se pudo iniciar sesion');
    }

    setAccessToken(payload.accessToken);
    return payload.user;
  },

  async refresh() {
    const response = await authFetch('/auth/refresh', {
      method: 'POST',
    });

    if (!response.ok) {
      setAccessToken(null);
      return null;
    }

    const payload = await response.json();
    setAccessToken(payload.accessToken);
    return payload.user;
  },

  async me() {
    const response = await authFetch('/auth/me');

    if (response.status === 401) {
      const refreshedUser = await authClient.refresh();
      if (!refreshedUser) return null;

      const retryResponse = await authFetch('/auth/me');
      if (!retryResponse.ok) return null;
      const retryPayload = await retryResponse.json();
      return retryPayload.user;
    }

    if (!response.ok) return null;

    const payload = await response.json();
    return payload.user;
  },

  async logout() {
    await authFetch('/auth/logout', {
      method: 'POST',
    });
    setAccessToken(null);
  },

  clearSession() {
    setAccessToken(null);
  },
};
