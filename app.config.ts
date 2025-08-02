import rehypeShiki from '@shikijs/rehype';
import { transformerNotationHighlight, transformerNotationWordHighlight } from '@shikijs/transformers';
import { transformerTwoslash } from '@shikijs/twoslash';
import { defineConfig } from '@solidjs/start/config';
import mdx from '@vinxi/plugin-mdx';
import { execSync } from 'child_process';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import svgPlugin from 'vite-plugin-solid-svg';

const defineString = (str?: string) => `"${str || 'unknown'}"`;

export default defineConfig({
    ssr: true,
    server: {
        esbuild: {
            options: {
                target: 'es2022', // Use modern JavaScript syntax
            },
        },
        preset: process.env.NITRO_PRESET ?? 'netlify', // Use 'netlify' preset for deployment
    },
    extensions: ['mdx'],
    vite: {
        build: {
            target: 'es2022',
            rollupOptions: {
                output: {
                    format: 'esm', // Explicitly set output format to 'esm' to support top-level await
                },
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern',
                },
            },
        },
        plugins: [
            mdx.default.withImports({})({
                jsx: true,
                jsxImportSource: 'solid-js',
                providerImportSource: 'solid-mdx',
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    rehypeSlug,
                    [
                        rehypeShiki,
                        {
                            themes: {
                                dark: 'ayu-dark',
                                light: 'github-light',
                            },
                            transformers: [
                                transformerNotationHighlight(),
                                transformerNotationWordHighlight(),
                                transformerTwoslash({
                                    explicitTrigger: true,
                                }),
                            ],
                        },
                    ],
                ],
            }),
            svgPlugin({ defaultAsComponent: true }),
        ],
        define: {
            __APP_COMMIT: defineString(
                process.env.COMMIT_REF ?? 
                (() => {
                    try {
                        return execSync('git rev-parse HEAD').toString().trim()
                    } catch {
                        return 'unknown'
                    }
                })()
            ),
            __APP_DEPLOY_CONTEXT: defineString(process.env.CONTEXT ?? process.env.NODE_ENV),
            __APP_BRANCH: defineString(
                process.env.BRANCH ?? 
                (() => {
                    try {
                        return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
                    } catch {
                        return 'unknown'
                    }
                })()
            ),
        },
    },
});
