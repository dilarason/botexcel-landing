import type { NextConfig } from "next";
import { dirname } from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingRoot: dirname(__dirname),
};

export default nextConfig;
