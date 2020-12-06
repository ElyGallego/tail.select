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
import { dirname, resolve } from 'path';
import { glob } from 'glob';
import { rollup } from 'rollup';
import { createFilter } from 'rollup-pluginutils';

/*
 |  ROLLUP PLUGIN
 */
export default function ratExports(options = { }) {
    let config = { };

    return {
        name: "ratExports",
        options: function(conf) {
            let files = [ ];
            for(let input in conf.input) {
                files = files.concat(glob.sync(conf.input[input]));
            }

            // Create Filter & Return
            createFilter(files);
            config = { ...conf, input: files };
            
            if(config.output[0].format === "umd") {
                delete config.output[0].format;
            }
            return config;
        },
        renderChunk: async function(code, chunk) {
            let path = dirname(chunk.facadeModuleId).replace(__dirname, "").replace(/\\/g, "/").slice(1) + "/";
            let name = chunk.fileName;
            let dest = config.output[0].dir + "/" + name;

            // Skip ES6
            if(config.output[0].format === "es") {
                console.log(`\x1b[32mcreated \x1b[32m\x1b[1m${dest}, ${dest}.map\x1b[0m`);
                return null;
            }

            // Options
            let inputOptions = { 
                input: path + name, 
                external: [...config.external, 'index'], 
                plugins: options.plugins || []
            };
            let outputOptions = { ...config.output[0], format: "umd" };

            if((inputOptions.plugins || []).length > 0) {

                let externalID = resolve(__dirname, "src/ts/select");

                inputOptions.input = inputOptions.input.replace(".js", ".ts");
                inputOptions.external = [externalID, "../ts/select"];
                outputOptions.format = "umd";
                outputOptions.globals = { [externalID]: "rat.select", "../ts/select": "rat.select" };

                console.log(externalID);
            }

            // Render Files
            let bundle  = await rollup(inputOptions);
            await bundle.generate(outputOptions);
            let { output } = await bundle.write(outputOptions);

            // Log & Return
            console.log(`\x1b[32mcreated \x1b[32m\x1b[1m${dest}, ${dest}.map\x1b[0m`);
            return {
                code: output[0].code,
                map: output[0].map
            };
        }
    };
};
