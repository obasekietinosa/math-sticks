import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@math-sticks/shared': resolve(__dirname, '../shared/src/index.ts')
        }
    },
    server: {
        port: 5173
    }
});
