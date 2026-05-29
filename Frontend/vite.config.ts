import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("apexcharts") || id.includes("react-apexcharts")) return "charts";
          if (id.includes("@fullcalendar")) return "calendar";
          if (id.includes("@react-jvectormap") || id.includes("jvectormap")) return "maps";
          if (id.includes("react-router") || id.includes("react-dom") || id.includes("/react/")) {
            return "react-vendor";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
});
