// @ts-check
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["elysia", "@elysiajs/openapi"],
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },

  adapter: cloudflare(),
});
