const BACKEND_PROXY_BASE = "/api/backend";

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function getBackendApiUrl(path: string) {
  const normalizedPath = normalizePath(path);

  if (typeof window !== "undefined") {
    return `${BACKEND_PROXY_BASE}${normalizedPath}`;
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return "";
  }

  return `${apiUrl.replace(/\/$/, "")}${normalizedPath}`;
}

export function getBackendApiBaseUrl() {
  if (typeof window !== "undefined") {
    return BACKEND_PROXY_BASE;
  }

  return (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

