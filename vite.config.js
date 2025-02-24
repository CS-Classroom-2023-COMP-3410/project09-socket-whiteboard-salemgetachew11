// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'public'), // Set the root to the 'public' directory
  server: {
    port: 5421, // Ensure the port is correct
    open: true // Automatically opens the browser
  }
});
