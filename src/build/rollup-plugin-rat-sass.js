/*!
 |  ratSASS - An adapted SCSS plugin bundler for rollup.
 |  @file       rat-sass.js
 |  @version    1.0.0 - Stable
 |  @author     SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |  
 |  @website    https://rat.md/rollup/ratSASS
 |  @license    MIT License
 |  @copyright  Copyright © 2020 pytesNET <info@pytes.net>
 |
 |  @fork       https://github.com/thgh/rollup-plugin-scss
 |              Copyright © 2016 - 2020 Thomas Ghysels
 */
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { basename, dirname } from 'path';
import { createFilter } from 'rollup-pluginutils';

/*
 |  HELPER :: CONSOLE COLOURs
 */
function red(text) {
    return '\x1b[1m\x1b[31m' + text + '\x1b[0m'
}

/*
 |  HELPER :: CONSOLE COLOURs
 */
function green(text) {
    return '\x1b[1m\x1b[32m' + text + '\x1b[0m'
}

/*
 |  HELPER :: GET SIZE
 */
function getSize(bytes) {
    return bytes < 10000
        ? bytes.toFixed(0) + ' B'
        : bytes < 1024000
            ? (bytes / 1024).toPrecision(3) + ' kB'
            : (bytes / 1024 / 1024).toPrecision(4) + ' MB'
}

/*
 |  HELPER :: ENSURE PARENT DIRECTORY
 */
function ensureParentDirsSync(dir) {
    if (existsSync(dir)) {
        return
    }

    try {
        mkdirSync(dir)
    } catch (err) {
        if (err.code === 'ENOENT') {
            ensureParentDirsSync(dirname(dir))
            ensureParentDirsSync(dir)
        }
    }
}

/*
 |  ROLLUP PLUGIN
 */
export default function ratSCSS(options = { }) {
    const sass = require('sass');
    const filter = createFilter(options.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], options.exclude);

    // Stylesheets
    let styles = { };

    // Include Paths
    let includes = options.includePaths || ['node_modules'];
    includes.push(process.cwd());
    delete options.includePaths;

    /*
     |  COMPILE FUNCTION
     */
    const compile = function(styles, overwrite) {
        try {
            let data = sass.renderSync(Object.assign({
                data: styles,
                includePaths: includes
            }, options, overwrite));
    
            return {
                css: data.css.toString(),
                map: (data.map || "").toString()
            };
        } catch(e) {
            console.log();
            console.log(red('Error:\n\t' + e.message));
            if(e.message.includes('Invalid CSS')) {
                console.log(green('Solution:\n\t' + 'fix your Sass code'));
                console.log('Line:   ' + e.line);
                console.log('Column: ' + e.column);
            }
            if(e.message.includes('node-sass') && e.message.includes('find module')) {
                console.log(green('Solution:\n\t' + 'npm install --save node-sass'));
            }
            if(e.message.includes('node-sass') && e.message.includes('bindings')) {
                console.log(green('Solution:\n\t' + 'npm rebuild node-sass --force'));
            }
            console.log();
        }
    };

    /*
     |  TRANSFORM FUNCTION
     */
    const transform = function(code, id) {
        if(!filter(id)) {
            return;
        }
        includes.push(dirname(id));

        // Attach Watcher
        if('watch' in options) {
            let files = Array.isArray(options.watch)? options.watch: [options.watch];
            files.forEach(file => this.addWatchFile(file));
        }

        // Disabled Output
        if(options.output === false) {
            return {
                code: "",
                map: { mappings: "" }
            };
        }
        styles[id] = code;
        return "";
    };

    /*
     |  GENERATE BUNDLE
     */
    const generateBundle = (opts) => {
        if(options.output === false) {
            return;
        }
        if(typeof options.output === "object") {
            for(let outputStyle in options.output) {
                let dest = options.output[outputStyle];

                for(let path in styles) {
                    let name = basename(path, path.indexOf(".scss") >= 0? ".scss": ".sass");
                    let store = dest.replace("[name]", name);
                    let overwrite = { outputStyle: outputStyle };

                    // Handle SourceMap
                    if("sourceMap" in options) {
                        if(options.sourceMap === true) {
                            overwrite.sourceMap = store.slice(store.lastIndexOf("/")+1) + ".map";
                        } else if(typeof options.sourceMap === "string") {
                            overwrite.sourceMap = options.sourceMap.replace("[name]", name);
                        }
                    }

                    // Render
                    let data = compile(styles[path], overwrite);
                    if(!("css" in data) || data.css.length <= 0) {
                        continue;
                    }

                    // Check if Directory exists
                    ensureParentDirsSync(dirname(store))

                    // Write CSS File
                    let banner = options.banner? options.banner[outputStyle] || "": "";
                    banner = banner.replace("[name]", name);

                    writeFileSync(store, banner + "\n" + data.css);
                    if("map" in data && data.map.length >= 0) {
                        writeFileSync(store + ".map", data.map);
                        console.log(`\x1b[32mcreated \x1b[32m\x1b[1m${store}, ${store}.map ${getSize(data.css.length)}\x1b[0m`);
                    } else {
                        console.log(`\x1b[32mcreated \x1b[32m\x1b[1m${store} ${getSize(data.css.length)}\x1b[0m`);
                    }
                }
            }
        }
    }

    // Return Rollup Plugin
    return {
        name: "ratSASS", transform, generateBundle
    };
};
