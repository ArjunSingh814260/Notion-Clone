import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.externals = config.externals || {};

    // Exclude pg and pgpass from the client-side bundle
    config.externals["pg"] = "commonjs pg";
    config.externals["pgpass"] = "commonjs pgpass";

    return config;
  },
  // Use the correct property for Next.js 15.3.2
  serverExternalPackages: [
    "pg",
    "pg-native",
    "pgpass",
    "postgres",
    "postgres-migrate",
    "postgres-migrations",
    "vertx",
    "bindings",
    "libpq",
    "file-uri-to-path",
  ],
};

export default nextConfig;
