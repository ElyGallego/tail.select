
import pkg from "./package.json";

import typescript from '@rollup/plugin-typescript';
import consts from 'rollup-plugin-consts';
import { terser } from 'rollup-plugin-terser';
import { RatRollupResolve } from '@rat.md/rollup-resolve'; 
import { RatSass, RatSassSkip, RatSassOutput } from '@rat.md/rollup-plugin-sass';


/*
 |  DEFINE DISTRIBUTION BANNERs
 */
const copyright = `/*!
 |  ${pkg.global} - ${pkg.description}
 |  @file       ${pkg.main}
 |  @version    ${pkg.version} - ${pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
 |  @author     ${pkg.author}${pkg.contributors? "\n |\t\t\t\t" + pkg.contributors.join("\n |\t\t\t\t"): ""}
 |  
 |  @website    ${pkg.homepage}
 |  @license    ${pkg.license} License
 |  @copyright  Copyright © 2014 - ${(new Date()).getFullYear()} ${pkg.copyright}
 */`;
const copysmall = `/*! pytesNET/${pkg.global} | @version ${pkg.version} | @license ${pkg.license} | @copyright ${pkg.copyright} */`;


/*
 |  RESOLVE LANGUAGE FILEs
 */
const langs = RatRollupResolve('src/ts/langs/*.ts', [
    {
        output: {
            dir: 'dist/js/langs',
            esModule: false,
            format: 'umd',
            interop: false
        },
        plugins: [
            typescript({ sourceMap: false })
        ]
    },
    {
        output: {
            dir: 'dist/es/langs',
            esModule: true,
            format: 'es'
        },
        plugins: [
            typescript({ sourceMap: false, target: 'ES6' })
        ]
    }
], {
    output: {
        banner: copysmall,
        compact: true,
        extend: true,
        footer: `\n/*! Visit this project on ${pkg.homepage} */`,
        globals: {
            'rat.select': 'rat.select'
        },
        intro: '"use strict";',
        name: pkg.global,
        preserveModules: false,
        strict: false,
        sourcemap: false,
        plugins: [
            terser()
        ]
    },
    external: ['rat.select'],
    plugins: [
        RatSassSkip()
    ]
});


/*
 |  RESOLVE PLUGIN FILEs
 */
const plugins = RatRollupResolve('src/ts/plugins/*.ts', [
    {
        output: {
            dir: 'dist/js/plugins',
            esModule: false,
            format: 'umd',
            interop: false
        },
        plugins: [
            typescript({ sourceMap: false })
        ]
    },
    {
        output: {
            dir: 'dist/es/plugins',
            esModule: false,
            format: 'es'
        },
        plugins: [
            typescript({ sourceMap: false, target: 'es6' })
        ]
    }
], {
    output: {
        banner: copysmall,
        compact: true,
        extend: true,
        footer: `\n/*! Visit this project on ${pkg.homepage} */`,
        globals: {
            'rat.select': 'rat.select'
        },
        intro: '"use strict";',
        name: pkg.global,
        preserveModules: false,
        strict: false,
        sourcemap: false,
        plugins: [
            terser()
        ]
    },
    external: ['rat.select'],
    plugins: [
        RatSassSkip()
    ]
});


/*
 |  EXPORT ROLLUP CONFIGURATION
 */
export default [
    /*
     |  EXPORT ECMASCRIPT 5 VERSION
     |      uses the RatSass and RatSassOutput to compile the stylesheets
     |      uses the const to pass version constants
     |      uses the typescript to transpile to JavaScript
     |      uses the terser to minify the second output
     */
    {
        input: 'src/ts/index.ts',
        output: [
            {
                amd: {
                    id: pkg.global
                },
                banner: copyright,
                compact: false,
                dir: `dist`,
                entryFileNames: `js/${pkg.global}.js`,
                esModule: false,
                format: 'umd',
                intro: '"use strict";',
                name: pkg.global,
                strict: false,
                sourcemap: true,
                sourcemapExcludeSources: true,
                plugins: [
                    RatSassOutput({
                        banner: copyright.replace('dist/js/rat.select.js', 'dist/css/rat.[name].css')
                    })
                ]
            },
            {
                amd: {
                    id: pkg.global
                },
                banner: copysmall,
                compact: true,
                dir: `dist`,
                entryFileNames: `js/${pkg.global}.min.js`,
                esModule: false,
                footer: `\n/*! Visit this project on ${pkg.homepage} */`,
                format: 'umd',
                intro: '"use strict";',
                name: pkg.global,
                strict: false,
                sourcemap: true,
                sourcemapExcludeSources: true,
                plugins: [
                    RatSassOutput({
                        banner: copysmall,
                        outputStyle: 'compressed'
                    }),
                    terser({
                        output: { comments: /^!(?! \*)/ }
                    })
                ]
            }
        ],
        plugins: [
            RatSass({
                bundle: false,
                fileNames: 'css/rat.[name].css',
                indentType: 'space',
                indentWidth: 4,
                includePaths: ['src/sass'],
                watch: [
                    "src/sass/_core",
                    "src/sass/bootstrap2",
                    "src/sass/bootstrap3",
                    "src/sass/bootstrap4",
                    "src/sass/chosen",
                    "src/sass/harx",
                    "src/sass/select",
                    "src/sass/selectize"
                ]
            }),
            consts({
                version: pkg.version,
                status: pkg.status
            }),
            typescript({ 
                sourceMap: true
            })
        ]
    },

    /*
     |  EXPORT ECMASCRIPT 6 VERSION
     |      uses the RatSassSkip to skip the SASS files
     |      uses the const to pass version constants
     |      uses the ignoreImport to skip ES5 Polyfills
     |      uses the typescript to transpile to JavaScript
     |      uses the terser to minify the second output
     */
    {
        input: 'src/ts/index.ts',
        output: [
            {
                banner: copyright.replace(/dist\/js/g, "dist/es"),
                compact: false,
                dir: `dist`,
                entryFileNames: `es/${pkg.global}.js`,
                esModule: true,
                format: 'es',
                intro: '"use strict";',
                name: pkg.global,
                strict: false,
                sourcemap: true,
                sourcemapExcludeSources: true
            },
            {
                banner: copysmall.replace(/dist\/js/g, "dist/es"),
                compact: true,
                dir: `dist`,
                entryFileNames: `es/${pkg.global}.js`,
                esModule: true,
                footer: `\n/*! Visit this project on ${pkg.homepage} */`,
                format: 'es',
                intro: '"use strict";',
                name: pkg.global,
                strict: false,
                sourcemap: true,
                sourcemapExcludeSources: true,
                plugins: [
                    terser()
                ]
            }
        ],
        plugins: [
            RatSassSkip(),
            consts({
                version: pkg.version,
                status: pkg.status
            }),
            ((body) => {
                return {
                    transform(code, id) {
                        if (id.endsWith('es5.ts') || id.endsWith('es5.js')) {
                            return { code: body, map: null };
                        }
                    }
                };
            })('export default undefined;'),
            typescript({ 
                sourceMap: true, 
                target: "ES6" 
            })
        ],
    },

    /*
     |  EXPORT LANGUAGE FILEs
     */
    ...langs,

    /*
     |  EXPORT PLUGIN FILEs
     */
    ...plugins
];
