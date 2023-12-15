import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@store-service": resolve(__dirname, "./src/storeService/storeContext.tsx"),
      "@user-service": resolve(__dirname, "../../dist/user-service.esm.js"),
      "@user-service/*": resolve(__dirname, "../../dist/types/*"),
    },
  },
});
