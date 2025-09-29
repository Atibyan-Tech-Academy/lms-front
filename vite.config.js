import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Default Vite config (runs on 5173)
export default defineConfig({
  plugins: [react()],
});
