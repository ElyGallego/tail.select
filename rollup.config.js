
// Load package.json
import pkg from "./package.json";
import tsc from "./tsconfig.json";

// Load custom rollup plugins
import ratSASS from './src/_rat/rat-sass';
import ratExports from './src/_rat/rat-exports';

// Load external rollup plugins
import ignoreImport from 'rollup-plugin-ignore-import';
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import { terser } from 'rollup-plugin-terser';
import consts from 'rollup-plugin-consts';

// Define banner
const copyright = `/*!
 |  ${pkg.name} - ${pkg.description}
 |  @file       ${pkg.main}
 |  @version    ${pkg.version} - ${pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
 |  @author     ${pkg.author}${pkg.contributors? "\n |\t\t\t\t" + pkg.contributors.join("\n |\t\t\t\t"): ""}
 |  
 |  @website    ${pkg.homepage}
 |  @license    ${pkg.license} License
 |  @copyright  Copyright © 2014 - 2020 ${pkg.copyright}
 */`;
const copysmall = `/*! pytesNET/${pkg.name} | @version ${pkg.version} | @license ${pkg.license} | @copyright ${pkg.copyright} */`;

// Export Rollup Configuration
export default [

    // ES5
    {
        input: 'src/ts/index.ts',
        output: [
            {
                name: pkg.name,
                file: `dist/js/${pkg.name}.js`,
                format: 'umd',
                banner: copyright,
                intro: '"use strict";',
                compact: false,
                sourcemap: true,
                sourcemapExcludeSources: true,
                amd: {
                    id: pkg.name
                },
                esModule: false,
                strict: false
            },
            {
                name: pkg.name,
                file: `dist/js/${pkg.name}.min.js`,
                format: 'umd',
                banner: copysmall,
                footer: `\n/*! Visit this project on ${pkg.homepage} */`,
                intro: '"use strict";',
                compact: true,
                sourcemap: true,
                sourcemapExcludeSources: true,
                amd: {
                    id: pkg.name
                },
                esModule: false,
                strict: false,
                plugins: [
                    terser({
                        output: { comments: /^!(?! \*)/ }
                    })
                ]
            }
        ],
        plugins: [
            ratSASS({
                output: {
                    expanded: 'dist/css/rat.[name].css',
                    compressed: 'dist/css/rat.[name].min.css'
                },
                banner: {
                    expanded: copyright.replace('dist/js/tail.select.js', 'dist/css/rat.[name].css'),
                    compressed: copysmall
                },
                bundle: false,
                indentType: 'space',
                indentWidth: 4,
                sourceMap: true
            }),
            consts({
                version: pkg.version,
                status: pkg.status
            }),
            typescript({ 
                sourceMap: true
            })
        ],
    },

    // ES5 Langs
    {
        input: ['src/langs/*.js'],
        output: {
            name: pkg.name,
            dir: 'dist/js/langs',
            format: 'umd',
            banner: copysmall,
            intro: '"use strict";',
            compact: false,
            extend: true,
            globals: {
                'rat.select': 'rat.select'
            },
            esModule: false,
            preserveModules: false,
            sourcemap: true,
            sourcemapExcludeSources: true,
            strict: false
        },
        external: ['rat.select'],
        plugins: [
            ratExports()
        ]
    },

    // ES5 Plugins
    {
        input: ['src/plugins/*.ts'],
        output: {
            name: pkg.name,
            dir: 'dist/js/plugins',
            format: 'umd',
            banner: copysmall,
            intro: '"use strict";',
            compact: false,
            extend: true,
            globals: {
                'rat.select': 'rat.select',
                '../ts/select': 'rat.select'
            },
            esModule: false,
            preserveModules: false,
            sourcemap: true,
            sourcemapExcludeSources: true,
            strict: false
        },
        external: ['rat.select', '../ts/select'],
        plugins: [
            ratExports({
                plugins: [
                    consts({
                        version: pkg.version,
                        status: pkg.status
                    }),
                    typescript({ tsconfig: __dirname + '/tsconfig.json' }),
                    alias({
                        entries: {
                            'rat.select': "../ts/select",
                            '../ts/select': "rat.select"
                        }
                    }),
                ]
            })
        ]
    },

    // ES6
    {
        input: 'src/ts/index.ts',
        output: [
            {
                name: pkg.name,
                file: `dist/es/${pkg.name}.js`,
                format: 'es',
                banner: copyright.replace(/dist\/js/g, "dist/es"),
                intro: '"use strict";',
                compact: false,
                sourcemap: true,
                sourcemapExcludeSources: true,
                esModule: true,
                strict: false
            },
            {
                name: pkg.name,
                file: `dist/es/${pkg.name}.min.js`,
                format: 'es',
                banner: copysmall.replace(/dist\/js/g, "dist/es"),
                footer: `\n/*! Visit this project on ${pkg.homepage} */`,
                intro: '"use strict";',
                compact: true,
                sourcemap: true,
                sourcemapExcludeSources: true,
                esModule: true,
                strict: false,
                plugins: [
                    terser()
                ]
            }
        ],
        plugins: [
            ratSASS({
                output: false
            }),
            consts({
                version: pkg.version,
                status: pkg.status
            }),
            ignoreImport({
                extensions: ['es5.ts', 'es5.js']
            }),
            typescript({ 
                sourceMap: true, 
                target: "ES6" 
            })
        ],
    },

    // ES6 Langs
    {
        input: ['src/langs/*.js'],
        output: {
            name: pkg.name,
            dir: 'dist/es/langs',
            format: 'es',
            banner: copysmall,
            intro: '"use strict";',
            compact: false,
            extend: true,
            globals: {
                'rat.select': 'rat.select'
            },
            esModule: false,
            sourcemap: true,
            sourcemapExcludeSources: true,
            preserveModules: false,
            strict: false
        },
        external: ['rat.select'],
        plugins: [
            ratExports()
        ]
    },

    // ES6 Plugins
    {
        input: ['src/plugins/*.js'],
        output: {
            name: pkg.name,
            dir: 'dist/es/plugins',
            format: 'es',
            banner: copysmall,
            intro: '"use strict";',
            compact: false,
            extend: true,
            globals: {
                'rat.select': 'rat.select'
            },
            esModule: false,
            sourcemap: true,
            sourcemapExcludeSources: true,
            preserveModules: false,
            strict: false
        },
        external: ['rat.select'],
        plugins: [
            ratExports()
        ]
    }
];
