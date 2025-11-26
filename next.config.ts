import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  // Vercel copies the repo into /vercel/path0 then into /vercel/path1; trace from monorepo root
  // (one level up from this project) to avoid path1/path1 duplication when looking for .next artifacts.
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;
