
import { join } from "path";

import pkg from "./package.json";
import ratSASS from './src/build/rollup-plugin-rat-sass';
import ratExports from './src/build/rollup-plugin-rat-exports';

import typescript from '@rollup/plugin-typescript';
import ignoreImport from 'rollup-plugin-ignore-import';
import { terser } from 'rollup-plugin-terser';
import consts from 'rollup-plugin-consts';

/*
 |  DEFINE DISTRIBUTION BANNERs
 */
const copyright = `/*!
 |  ${pkg.name} - ${pkg.description}
 |  @file       ${pkg.main}
 |  @version    ${pkg.version} - ${pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
 |  @author     ${pkg.author}${pkg.contributors? "\n |\t\t\t\t" + pkg.contributors.join("\n |\t\t\t\t"): ""}
 |  
 |  @website    ${pkg.homepage}
 |  @license    ${pkg.license} License
 |  @copyright  Copyright © 2014 - ${(new Date()).getFullYear()} ${pkg.copyright}
 */`;
const copysmall = `/*! pytesNET/${pkg.name} | @version ${pkg.version} | @license ${pkg.license} | @copyright ${pkg.copyright} */`;

/*
 |  EXPORT ROLLUP CONFIGURATION
 */
export default [
    /*
     |  EXPORT ECMASCRIPT 5 VERSION
     |      uses the ratSASS Plugin to compile the stylesheets
     |      uses the const Plugin to pass version constants
     |      uses the typescript Plugin to transpile to JavaScript
     |      uses the terser Plugin to minify the second output
     */
    {
        input: 'src/ts/index.ts',
        output: [
            {
                amd: {
                    id: pkg.name
                },
                banner: copyright,
                compact: false,
                esModule: false,
                file: `dist/js/${pkg.name}.js`,
                format: 'umd',
                intro: '"use strict";',
                name: pkg.name,
                strict: false,
                sourcemap: true,
                sourcemapExcludeSources: true
            },
            {
                amd: {
                    id: pkg.name
                },
                banner: copysmall,
                compact: true,
                esModule: false,
                file: `dist/js/${pkg.name}.min.js`,
                footer: `\n/*! Visit this project on ${pkg.homepage} */`,
                format: 'umd',
                intro: '"use strict";',
                name: pkg.name,
                strict: false,
                sourcemap: true,
                sourcemapExcludeSources: true,
                plugins: [
                    terser({
                        output: { comments: /^!(?! \*)/ }
                    })
                ]
            }
        ],
        plugins: [
            ratSASS({
                banner: {
                    expanded: copyright.replace('dist/js/tail.select.js', 'dist/css/rat.[name].css'),
                    compressed: copysmall
                },
                bundle: false,
                indentType: 'space',
                indentWidth: 4,
                sourceMap: true,
                output: {
                    expanded: 'dist/css/rat.[name].css',
                    compressed: 'dist/css/rat.[name].min.css'
                },
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
     |      uses the ratSASS Plugin to skip the SASS files
     |      uses the const Plugin to pass version constants
     |      uses the ignoreImport Plugin to skip ES5 Polyfills
     |      uses the typescript Plugin to transpile to JavaScript
     |      uses the terser Plugin to minify the second output
     */
    {
        input: 'src/ts/index.ts',
        output: [
            {
                banner: copyright.replace(/dist\/js/g, "dist/es"),
                compact: false,
                esModule: true,
                file: `dist/es/${pkg.name}.js`,
                format: 'es',
                intro: '"use strict";',
                name: pkg.name,
                strict: false,
                sourcemap: true,
                sourcemapExcludeSources: true
            },
            {
                banner: copysmall.replace(/dist\/js/g, "dist/es"),
                compact: true,
                esModule: true,
                file: `dist/es/${pkg.name}.min.js`,
                footer: `\n/*! Visit this project on ${pkg.homepage} */`,
                format: 'es',
                intro: '"use strict";',
                name: pkg.name,
                strict: false,
                sourcemap: true,
                sourcemapExcludeSources: true,
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

    /*
     |  EXPORT LANGUAGE FILEs
     |      uses the ratExports Plugin to export file-per-file
     |      uses the terser Plugin to minify the distribution files
     */
    {
        input: ['src/ts/langs/*.ts'],
        output: [
            {
                banner: copysmall,
                compact: true,
                dir: 'dist/js/langs',
                esModule: false,
                extend: true,
                footer: `\n/*! Visit this project on ${pkg.homepage} */`,
                format: 'umd',
                globals: {
                    'rat.select': 'rat.select'
                },
                interop: false,
                intro: '"use strict";',
                name: pkg.name,
                preserveModules: false,
                strict: false,
                sourcemap: false,
                plugins: [
                    terser()
                ]
            },
            {
                banner: copysmall,
                compact: true,
                dir: 'dist/es/langs',
                esModule: true,
                extend: true,
                footer: `\n/*! Visit this project on ${pkg.homepage} */`,
                format: 'es',
                globals: {
                    'rat.select': 'rat.select'
                },
                intro: '"use strict";',
                name: pkg.name,
                preserveModules: false,
                strict: false,
                sourcemap: false,
                plugins: [
                    terser()
                ]
            }
        ],
        external: ['rat.select'],
        plugins: [
            ratExports()
        ]
    },

    /*
     |  EXPORT PLUGIN FILEs
     |      uses the ratExports Plugin to export file-per-file
     |      uses the terser Plugin to minify the distribution files
     */
    {
        input: ['src/ts/plugins/*.ts'],
        output: [
            {
                banner: copysmall,
                compact: true,
                dir: 'dist/js/plugins',
                esModule: false,
                extend: true,
                footer: `\n/*! Visit this project on ${pkg.homepage} */`,
                format: 'umd',
                globals: {
                    'rat.select': 'rat.select'
                },
                interop: false,
                intro: '"use strict";',
                name: pkg.name,
                preserveModules: false,
                strict: false,
                sourcemap: false,
                plugins: [
                    terser()
                ]
            },
            {
                banner: copysmall,
                compact: true,
                dir: 'dist/es/plugins',
                esModule: false,
                extend: true,
                footer: `\n/*! Visit this project on ${pkg.homepage} */`,
                format: 'es',
                globals: {
                    'rat.select': 'rat.select'
                },
                intro: '"use strict";',
                name: pkg.name,
                preserveModules: false,
                strict: false,
                sourcemap: false,
                plugins: [
                    terser()
                ]
            }
        ],
        external: ['rat.select'],
        plugins: [
            ratExports()
        ]
    }
];
