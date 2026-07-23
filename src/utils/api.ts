export const getApiUrl = (path: string = "") => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  let host = hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // If we are running under Capacitor, redirect requests to the host PC's Wi-Fi IP address
    const isCapacitor = typeof window !== 'undefined' && (window as any).Capacitor;
    if (isCapacitor) {
      host = '172.20.10.4';
    }
  }
  
  // Normalize path suffix prefix
  const apiPath = path.startsWith("/") ? path : `/${path}`;
  return `http://${host}:5000${apiPath}`;
};
