import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // This prevents Vite from reloading the browser
      // when json-server updates db.json
      ignored: ["**/db.json"],
    },
  },
});
