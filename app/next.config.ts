import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

function getEnvValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();

    if (value) {
      return value;
    }
  }
}

function getBasePath() {
  const rawBasePath = getEnvValue(
    "NEXT_PUBLIC_BASE_PATH",
    "NEXT_PUBLIC_BASE_URL"
  );

  if (!rawBasePath || rawBasePath === "/") {
    return undefined;
  }

  let path = rawBasePath;

  if (/^https?:\/\//.test(rawBasePath)) {
    path = new URL(rawBasePath).pathname;
  }

  const normalizedPath = `/${path.replace(/^\/+|\/+$/g, "")}`;

  return normalizedPath === "/" ? undefined : normalizedPath;
}

const basePath = getBasePath();

const nextConfig: NextConfig = {
  ...(basePath ? { basePath } : {}),
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rent-etalans.s3.eu-west-3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
