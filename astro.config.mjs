import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://carmediahub.github.io",
  output: "static",
  build: { format: "directory" },
  vite: { server: { host: true } }
});
