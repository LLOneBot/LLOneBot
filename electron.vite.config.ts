import cp from 'vite-plugin-cp';
import "./scripts/gen-version"
export default {
    main: {
        build: {
            outDir: "dist/main",
            emptyOutDir: true,
            lib: {
                formats: ["cjs"],
                entry: { "main": "src/main/main.ts" },
            },
            rollupOptions: {
                external: ["silk-wasm"],
                input: "src/main/main.ts",
            }
        },
        resolve:{
            alias: {
                './lib-cov/fluent-ffmpeg': './lib/fluent-ffmpeg'
            },
        },
        plugins: [cp({ targets: [{src: './node_modules/silk-wasm', dest: 'dist/node_modules/silk-wasm', flatten: false}, { src: './manifest.json', dest: 'dist' }] })]
    },
    preload: {
        // vite config options
        build: {
            outDir: "dist/preload",
            emptyOutDir: true,
            lib: {
                formats: ["cjs"],
                entry: { "preload": "src/preload.ts" },
            },
            rollupOptions: {
                // external: externalAll,
                input: "src/preload.ts",
            }
        },
        resolve:{
        }
    },
    renderer: {
        // vite config options
        build: {
            outDir: "dist/renderer",
            emptyOutDir: true,
            lib: {
                formats: ["es"],
                entry: { "renderer": "src/renderer.ts" },
            },
            rollupOptions: {
                // external: externalAll,
                input: "src/renderer.ts",
            }
        },
        resolve:{
        }
    }
}