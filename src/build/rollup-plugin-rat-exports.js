/*!
 |  ratExports - Special input -> output mapping plugin for rollup.
 |  @file       rat-exports.js
 |  @version    1.0.0 - Stable
 |  @author     SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |  
 |  @website    https://rat.md/rollup/ratExports
 |  @license    MIT License
 |  @copyright  Copyright © 2020 pytesNET <info@pytes.net>
 */
import { dirname, join } from 'path';
import { glob } from 'glob';
import { rollup } from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import typescript from '@rollup/plugin-typescript';


/*
 |  ROLLUP PLUGIN
 */
export default function ratExports(options = { }) {
    let filter = null;
    let bundleOptions = { };

    return {
        name: "ratExports",

        /*
         |  HANDLE OPTIONS
         */
        options: function(conf) {
            let files = [ ];
            for(let input in conf.input) {
                files = files.concat(glob.sync(conf.input[input])).filter((item) => {
                    return item.indexOf(".example.") < 0;
                });
            }

            // Create Filter and Adapt Input
            filter = createFilter(files);
            let config = { ...conf, input: files };
            
            // Bypass Rollup Unsupported-UMD error
            for(let i = 0; i < config.output.length; i++) {
                if(config.output[i].format === "umd") {
                    delete config.output[i].format;
                }
            }

            // Return new Configuration
            bundleOptions = { ...config };
            return config;
        },

        /*
         |  TRANSFORM CODE
         */
        transform: function(code, id) {
            if(!filter(id)) {
                return;
            }
            return { code: "string", map: null };
        },

        /*
         |  RENDER CHUNK
         */
        renderChunk: async function(code, chunk, outputOptions) {
            let path = dirname(chunk.facadeModuleId).replace(__dirname, "").replace(/\\/g, "/").slice(1) + "/";
            let name = chunk.fileName;
            let dest = join(outputOptions.dir, name);

            let target = outputOptions.dir.indexOf("dist/es") >= 0? "ES6": "ES5";
            let tsconfig = join(__dirname, "tsconfig.json");

            // Handle Options
            let inputOptions = {
                input: (path + name).replace(".js", ".ts"),
                external: ["rat.select"], 
                plugins: [ typescript({ tsconfig, target, sourceMap: false }) ]
            };
            outputOptions.format = (target === "ES6")? "es": "umd";

            // Render Files
            let bundle = await rollup(inputOptions);
            await bundle.generate(outputOptions);
            let output = await bundle.write(outputOptions);

            // Log & Return
            console.log(`\x1b[32mcreated \x1b[32m\x1b[1m${dest}, ${dest}.map\x1b[0m`);
            return {
                code: output.output[0].code.replace(/from '([a-zA-Z0-9_.-]+)';/, "from '../$1.js';"),
                map: output.output[0].map
            };
        }
    };
};
