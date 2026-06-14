import { NextRequest, NextResponse } from "next/server";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function getApiUrl(path: string[], search: string) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return null;
  }

  const normalizedBaseUrl = apiUrl.replace(/\/$/, "");
  const normalizedPath = path.map(encodeURIComponent).join("/");

  return `${normalizedBaseUrl}/${normalizedPath}${search}`;
}

function getForwardHeaders(request: NextRequest) {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  headers.set("accept", headers.get("accept") ?? "application/json");

  return headers;
}

function getResponseHeaders(response: Response) {
  const headers = new Headers();

  response.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();

    if (!HOP_BY_HOP_HEADERS.has(lowerKey) && lowerKey !== "content-encoding") {
      headers.set(key, value);
    }
  });

  return headers;
}

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const targetUrl = getApiUrl(path, request.nextUrl.search);

  if (!targetUrl) {
    return NextResponse.json(
      { message: "API_URL is not configured." },
      { status: 503 },
    );
  }

  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : await request.arrayBuffer();

  let response: Response;

  try {
    response = await fetch(targetUrl, {
      method: request.method,
      headers: getForwardHeaders(request),
      body,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Backend API proxy request failed", error);

    return NextResponse.json(
      { message: "Backend API is unavailable." },
      { status: 502 },
    );
  }

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: getResponseHeaders(response),
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
