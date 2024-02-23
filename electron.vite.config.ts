import { defineConfig } from "electron-vite";
import { resolve } from "path";

export default defineConfig({
    main: {
        build: {
            lib: {
                entry: resolve(__dirname, "./src/main/main.ts")
            },
        }
    },
    preload: {
        build: {
            lib: {
                entry: resolve(__dirname, "./src/preload.ts")
            }
        }
    },
    renderer: {
        build: {
            lib: {
                entry: resolve(__dirname, "./src/renderer.ts"),
                name: 'renderer'
            },
            rollupOptions: {
                input: './src/renderer.ts'
            }
        }
    }
})