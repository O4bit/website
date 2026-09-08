import rehypeShiki from '@shikijs/rehype';
import { transformerNotationHighlight, transformerNotationWordHighlight } from '@shikijs/transformers';
import { defineConfig } from '@solidjs/start/config';
import mdx from '@vinxi/plugin-mdx';
import { execSync } from 'child_process';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import svgPlugin from 'vite-plugin-solid-svg';

import { createLogger } from 'vite';

const customLogger = createLogger();
const originalWarn = customLogger.warn;
customLogger.warn = (msg, options) => {
    if (
        msg.includes('missing source files') ||
        msg.includes('legacy-js-api') ||
        msg.includes('Dart Sass')
    ) {
        return;
    }
    originalWarn(msg, options);
};

// Filter out legacy Dart Sass deprecation noise printed directly to stderr
const origStderrWrite = process.stderr.write.bind(process.stderr);
(process.stderr as any).write = (chunk: any, ...args: any[]) => {
    const str = typeof chunk === 'string' ? chunk : chunk?.toString?.() || '';
    if (str.includes('legacy-js-api') || str.includes('Dart Sass 2.0.0')) {
        return true;
    }
    return (origStderrWrite as any)(chunk, ...args);
};

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
        customLogger,
        ssr: {
            resolve: {
                conditions: ['solid', 'node', 'import', 'require'],
                externalConditions: ['solid'],
            },
        },
        build: {
            target: 'es2022',
            rollupOptions: {
                output: {
                    format: 'esm', // Explicitly set output format to 'esm' to support top-level await
                },
                onwarn(warning, defaultHandler) {
                    if (
                        warning.code === 'SOURCEMAP_BROKEN' ||
                        warning.message?.includes('missing source files') ||
                        warning.message?.includes('Dart Sass')
                    ) {
                        return;
                    }
                    defaultHandler(warning);
                },
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    silenceDeprecations: ['legacy-js-api'],
                    quietDeps: true,
                },
                sass: {
                    api: 'modern-compiler',
                    silenceDeprecations: ['legacy-js-api'],
                    quietDeps: true,
                },
            },
        },
        plugins: [
            ((m: any) => {
                const withImports = m?.default?.withImports ?? m?.withImports
                const opts = {
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
                                ],
                            },
                        ],
                    ],
                }

                if (withImports) return withImports({})(opts)
                // fallback: assume default export is a function that accepts options directly
                return m(opts)
            })(mdx),
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
