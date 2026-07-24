export const getApiUrl = (path: string = "") => {
  let baseUrl = '';

  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('custom_backend_url');
    if (custom && custom.trim() !== '') {
      baseUrl = custom.trim();
    }
  }

  if (!baseUrl && import.meta.env.VITE_BACKEND_URL) {
    baseUrl = import.meta.env.VITE_BACKEND_URL;
  }

  if (!baseUrl) {
    if (typeof window !== 'undefined') {
      const isCapacitor = !!(window as any).Capacitor;
      const hostname = window.location.hostname;

      if (isCapacitor) {
        baseUrl = 'http://192.168.1.17:5000';
      } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        baseUrl = 'http://localhost:5000';
      } else {
        // Web deployment fallback — uses local/network host IP or default server
        baseUrl = `http://${hostname}:5000`;
      }
    } else {
      baseUrl = 'http://localhost:5000';
    }
  }

  baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const apiPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${apiPath}`;
};

export const setCustomBackendUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    if (url && url.trim() !== '') {
      localStorage.setItem('custom_backend_url', url.trim());
    } else {
      localStorage.removeItem('custom_backend_url');
    }
  }
};
