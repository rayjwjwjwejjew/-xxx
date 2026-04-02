var _a;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var repoName = (_a = process.env.GITHUB_REPOSITORY) === null || _a === void 0 ? void 0 : _a.split('/')[1];
var base = process.env.GITHUB_ACTIONS && repoName ? "/".concat(repoName, "/") : '/';
export default defineConfig({
    base: base,
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        host: '0.0.0.0',
    },
});
