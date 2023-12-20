import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "src": resolve(__dirname, "./src"),
      "@store-service": resolve(__dirname, "./src/storeService/storeContext.ts"),
      "@user-service": resolve(__dirname, "../../dist/user-service.esm.js"),
    },
  },
});
