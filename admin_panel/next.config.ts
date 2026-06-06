import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
