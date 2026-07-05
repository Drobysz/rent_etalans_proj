const BACKEND_PROXY_BASE = "/api/backend";

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function normalizeBasePath(path?: string) {
  if (!path || path === "/") {
    return "";
  }

  const value = /^https?:\/\//.test(path) ? new URL(path).pathname : path;
  const normalizedPath = `/${value.replace(/^\/+|\/+$/g, "")}`;

  return normalizedPath === "/" ? "" : normalizedPath;
}

export function getBackendApiUrl(path: string) {
  const normalizedPath = normalizePath(path);

  if (typeof window !== "undefined") {
    const basePath = normalizeBasePath(
      process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.NEXT_PUBLIC_BASE_URL,
    );

    return `${basePath}${BACKEND_PROXY_BASE}${normalizedPath}`;
  }

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return "";
  }

  console.log(`${apiUrl.replace(/\/$/, "")}${normalizedPath}`)

  return `${apiUrl.replace(/\/$/, "")}${normalizedPath}`;
}

export function getAppApiUrl(path: string) {
  const normalizedPath = normalizePath(path);
  const basePath = normalizeBasePath(
    process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.NEXT_PUBLIC_BASE_URL,
  );

  return `${basePath}${normalizedPath}`;
}
