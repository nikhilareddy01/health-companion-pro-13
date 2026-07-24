import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    base: "./",
    server: {
      host: true,
      port: 8081,
      strictPort: true,
    },
  },
});
