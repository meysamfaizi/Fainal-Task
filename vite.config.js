import { defineConfig } from "vite";

export default defineConfig({
  base: "/T04-Meysam-Faizi/",
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
