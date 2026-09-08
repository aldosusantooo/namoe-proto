import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tenant photo uploads go through a server action; the file limit is 5 MB plus form overhead.
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
};

export default nextConfig;
