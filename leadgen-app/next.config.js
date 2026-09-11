import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This app lives inside a monorepo alongside an unrelated Vite app that
  // has its own lockfile; pin the tracing root so Next doesn't guess wrong.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
