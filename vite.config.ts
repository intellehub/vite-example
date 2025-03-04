import {defineConfig} from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import svgLoader from 'vite-svg-loader'
import vueDevTools from 'vite-plugin-vue-devtools'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import terser from '@rollup/plugin-terser'

export default defineConfig({
    plugins: [
        vueDevTools({
            appendTo: 'main.ts'
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        svgLoader({
            defaultImport: 'url',
            svgo: true
        })
    ],
    css: {
        postcss: {
            plugins: [
                tailwindcss(),
                autoprefixer(),
                cssnano({
                    preset: 'default',
                }),
            ]
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url))
        }
    },
    build: {
        lib: false,
        target: 'es2015',
        minify: 'terser',
        cssMinify: 'esbuild',
        sourcemap: false,
        assetsInlineLimit: 4096,
        rollupOptions: {
            output: {
                sourcemap: false,
                minifyInternalExports: true,
                manualChunks: {
                    'core-vendor': ['vue', 'vue-router', 'pinia'],
                    'element-plus': ['element-plus'],
                    'data-utils': ['axios', 'lodash'],
                    'charts': ['vue3-apexcharts'],
                    'editor': ['@vueup/vue-quill']
                }
            },
            plugins: [
                terser({
                    format: {
                        comments: false,
                    },
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                    }
                })
            ]
        }
    },
    server: {
        hmr: {
            host: 'test.devel',
        },
        host: true,
        strictPort: true,
        port: 5174,
    },
});
