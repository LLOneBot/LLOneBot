import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                // renderer: resolve(__dirname, 'dist/renderer.js') // 入口文件的路径
                renderer: resolve(__dirname, 'src/renderer.ts') // 入口文件的路径
            },
            output: {
                entryFileNames: '[name].js', // 打包后的文件名
            }
        }
    }
});
