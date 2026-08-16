const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const withBase = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}` || '/';
