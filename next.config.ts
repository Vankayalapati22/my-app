import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ 
  output: "export",
   basePath: "/my-app",
  assetPrefix: "/my-app/",
  trailingSlash: true,
};

export default nextConfig;
