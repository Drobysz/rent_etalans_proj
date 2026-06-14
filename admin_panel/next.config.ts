import type { NextConfig } from "next";

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
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },

  webpack(config) {
    const excludeSvg = (rules: Array<Record<string, unknown>>) => {
      rules.forEach((rule) => {
        const test = rule.test as { test?: (value: string) => boolean } | undefined;

        if (test?.test?.(".svg")) {
          rule.exclude = /\.svg$/i;
        }

        if (Array.isArray(rule.oneOf)) {
          excludeSvg(rule.oneOf as Array<Record<string, unknown>>);
        }
      });
    };

    excludeSvg(config.module.rules as Array<Record<string, unknown>>);

    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
