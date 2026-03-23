import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  transpilePackages: ["@workspace/api-client-react"],
};

export default nextConfig;
