import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");


const nextConfig: NextConfig = {
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
