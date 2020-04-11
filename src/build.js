/*
 |  COMPILER SCRIPT FOR THE TAIL.SELECT LIBRARY
 |  @note       This node.js script compiles the complete tail.select library, including the SCSS
 |              stylesheets, the TypeScript JavaScripts and the docs pages using SYNTER.
 |
 |  @file       ./build.js
 |  @author     SamBrishes <sam@pytes.net>
 |  @version    0.6.0 [0.6.0] - Beta
 |
 |  @website    https://github.com/pytesNET/tail.select
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2019 - 2020 SamBrishes @ pytesNET <info@pytes.net>
 */

/*
 |  INIT SYNTER DEPENDENCY
 */
const Synter = require("./synter/synter.js");
const synter = new Synter(__dirname + "/");

/*
 |  SYNTER COMMUNICATOR
 |  @since  0.1.0 [0.1.0]
 */
function SynterConsole(status, file, line, number, message) {
    let msg = "[" + ["RUN", "ERR", "FIN"][status] + "]"
            + `[${file}${line? ":" + line + (number? ":" + number: ""): ""}]`
            + `${message? ' - ' + message: ''}`;

    switch(status) {
        case 0:  console.log("\x1b[37m\x1b[2m%s\x1b[0m", msg); break;
        case 1:  console.log("\x1b[31m\x1b[1m%s\x1b[0m", msg); break;
        case 2:  console.log("\x1b[32m\x1b[1m%s\x1b[0m", msg); break;
        default: console.log(msg); break;
    }
}

/*
 |  COMPILE TYPESCRIPT FILES
 |  @since  0.1.0 [0.1.0]
 */
function CompileTypeScript(type) {
    let walk = function(file, name, code) {
        let data = this.header("ts/plugins/" + name + ".ts");
        this.synt.setScope({ plugin: { name: data[0], description: data.description } }, false);
    };

    //  RENDER COREs
    //
    //  This Part renders the ECMAScript 5 AND ECMAScript 2015 core files.
    if(type == "all" || type == "core") {
        synter.console(SynterConsole, "TypeScript");

        // Compile ES5
        synter.typescript("./ts/tsconfig.json", {
            target: 1,
            outDir: "../dist/js/",
            outFile: "../dist/js/tail.select.js"
        });
        synter.synt.setScope({ build: "ECMAScript 5" });
        synter.render("main-es5", "../dist/js/tail.select.js");
        synter.minify("uglify-js", "minified-js", "../dist/js/tail.select.min.js");

        // Compile ES6
        synter.typescript("./ts/tsconfig.json", {
            target: 2,
            outDir: "../dist/es/",
            outFile: "../dist/es/tail.select.js"
        });
        synter.synt.setScope({ build: "ECMAScript 2015" });
        synter.render("main-es6", "../dist/es/tail.select.js");
        synter.minify("uglify-es", "minified-js", "../dist/es/tail.select.min.js");
    }

    //  RENDER PLUGINs
    //
    //  This Part renders the single and the "all" Plugin files for ES5 and ES6.
    if(type == "all" || type == "plugins") {
        synter.console(SynterConsole, "TypeScript :: Plugins");

        // Compile ES5
        synter.typescript("./ts/plugins/tsconfig.json", {
            target: 1,
            outDir: "../dist/js/plugins/"
        });
        synter.synt.setScope({ build: "ECMAScript 5" });
        synter.render("plugin-es5", "../dist/js/plugins/$name.js", walk);
        synter.minify("uglify-js", "minified-js", "../dist/js/plugins/$name.min.js");
        synter.renderAll("plugin-es5", "../dist/js/plugins/all.js");
        synter.minify("uglify-js", "minified-js", "../dist/js/plugins/all.min.js");

        // Compile ES6
        synter.typescript("./ts/plugins/tsconfig.json", {
            target: 2,
            outDir: "../dist/es/plugins/"
        });
        synter.synt.setScope({ build: "ECMAScript 2015" });
        synter.render("plugin-es6", "../dist/es/plugins/$name.js", walk);
        synter.minify("uglify-es", "minified-js", "../dist/es/plugins/$name.min.js");
        synter.renderAll("plugin-es6", "../dist/es/plugins/all.js");
        synter.minify("uglify-es", "minified-js", "../dist/es/plugins/all.min.js");
    }

    //  RENDER LOCALEs
    //
    //  This Part renders the single and the "all" Language files for ES5 and ES6.
    if(type == "all" || type == "langs") {
        synter.console(SynterConsole, "TypeScript :: Locales");

        // Compile ES5
        let cb = synter.locales("./locales/");
        synter.synt.setScope({ build: "ECMAScript 5" });
        synter.render("locale-es5", "../dist/js/locales/$name.js", cb);
        synter.minify("uglify-js", "minified-js", "../dist/js/locales/$name.min.js");
        synter.renderAll("locale-es5", "../dist/js/locales/all.js", "locales");
        synter.minify("uglify-js", "minified-js", "../dist/js/locales/all.min.js");

        // Compile ES6
        synter.synt.setScope({ build: "ECMAScript 2015" });
        synter.render("locale-es6", "../dist/es/locales/$name.js", cb);
        synter.minify("uglify-es", "minified-js", "../dist/es/locales/$name.min.js");
        synter.renderAll("locale-es6", "../dist/es/locales/all.js", "locales");
        synter.minify("uglify-es", "minified-js", "../dist/es/locales/all.min.js");
    }
}

/*
 |  COMPILE SASS FILEs
 |  @since  0.1.0 [0.1.0]
 */
function CompileStylesheets(type) {
    let config = {
        files: /^theme\-*/,
        indentType: 'space',
        indentWidth: 4,
        linefeed: 'lf',
        sourceMap: true,
        sourceMapRoot: "/",
        outFile: "dist/css/$name/theme-$name.css"
    };

    //  RENDER THEMEs
    if(type == "all" || type == "themes") {
        synter.console(SynterConsole, "SASS :: Themes");

        // Compile Theme Files
        synter.sass("./scss/", config);
        synter.render("stylesheet", "../dist/css/$name0/theme-$name.css");
        synter.renderMap("../dist/css/$name0/theme-$name.css.map");
        synter.minify("sass", "minified-css", "../dist/css/$name0/theme-$name.min.css");
    }

    //  RENDER PLUGINs
    config.files = /^select\-*/;
    config.outFile = "dist/css/$name/select-$name.css";
    if(type == "all" || type == "plugins") {
        synter.console(SynterConsole, "SASS :: Plugins");

        // Compile Plugin Files
        synter.sass("./scss/", config);
        synter.render("stylesheet", "../dist/css/$name0/plugins/select-$name1.css")
        synter.renderMap("../dist/css/$name0/plugins/select-$name1.css.map");
        synter.minify("sass", "minified-css", "../dist/css/$name0/plugins/select-$name1.min.css");
    }
}

/*
 |  COMPILE DOCUMENTATION
 |  @since  0.1.0 [0.1.0]
 */
function CompileDocumentation(type) {
    if(type == "all" || type == "pages") {
        synter.console(SynterConsole, "Documentation");
        synter.documentation("./docs/docs.json", "../docs/docs/");
    }
}


//
//  CLI-SCRIPT USAGE
//

/*
 |  MAIN SCRIPT
 */
function main(args) {
    console.log("");
    if(args.ts) {
        if(args.ts == "all" || args.ts == "core") {
            console.log("\x1b[30m\x1b[47m%s\x1b[0m", "    TYPESCRIPT :: CORE    ");
            CompileTypeScript("core");
            console.log("");
        }
        if(args.ts == "all" || args.ts == "plugins") {
            console.log("\x1b[30m\x1b[47m%s\x1b[0m", "    TYPESCRIPT :: PLUGINS    ");
            CompileTypeScript("plugins");
            console.log("");
        }
        if(args.ts == "all" || args.ts == "langs") {
            console.log("\x1b[30m\x1b[47m%s\x1b[0m", "    TYPESCRIPT :: LOCALES    ");
            CompileTypeScript("langs");
            console.log("");
        }
    }
    
    if(args.sass) {
        if(args.sass == "all" || args.sass == "themes") {
            console.log("\x1b[30m\x1b[47m%s\x1b[0m", "    SASS :: CORE    ");
            CompileStylesheets("themes");
            console.log("");
        }
        if(args.sass == "all" || args.sass == "plugins") {
            console.log("\x1b[30m\x1b[47m%s\x1b[0m", "    SASS :: PLUGINS    ");
            CompileStylesheets("plugins");
            console.log("");
        }
    }
    
    if(args.docs && args.docs === "all") {
        console.log("\x1b[30m\x1b[47m%s\x1b[0m", "    DOCUMENTATION    ");
        console.log("");
        CompileDocumentation("all");
        console.log("");
    }
}

// Handle --help / -h
if(process.argv.length === 2 || process.argv.length === 3) {
    if(!process.argv[2]) {
        console.log("");
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m%s", "    Enter '", "-help", "' to learn how you can use this script.");
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m%s", "    Enter '", "-version", "' to print the package and synter versions.");
        console.log("");
        process.exit(1);
    }
    if(process.argv[2] === "-help" || process.argv[2] === "--help") {
        console.log("");
        console.log("\x1b[30m\x1b[47m%s\x1b[0m", "   COMMAND LINE   ");
        console.log("");
        console.log("\x1b[32m\x1b[1m%s\x1b[0m", "    node build.js <arg>(=<value>) (<arg>=<value>) ...");
        console.log("");
        console.log("");
        console.log("\x1b[30m\x1b[47m%s\x1b[0m", "   GENERAL ARGUMENTS   ");
        console.log("");
        console.log("\x1b[2m%s\x1b[0m", "The following arguments doesn't contain a '=<value>' part!");
        console.log("");
        console.log("    -help                   Print this help screen");
        console.log("    -info                   Print some informations about the package");
        console.log("    -version                Print the package version");
        console.log("");
        console.log("");
        console.log("\x1b[30m\x1b[47m%s\x1b[0m", "   COMPILER ARGUMENTS   ");
        console.log("");
        console.log("\x1b[2m%s\x1b[0m", "The '=<value>' part is optional, if not given '=all' will used instead!");
        console.log("");
        console.log("\x1b[1m%s\x1b[0m%s", "    -all", "                    Compile the whole environment");
        console.log("");
        console.log("\x1b[1m%s\x1b[0m%s", "    -typescript", "             Compile TypeScript");
        console.log("\x1b[1m%s\x1b[0m%s", "    -ts", "                     <alias> ");
        console.log("\x1b[1m%s\x1b[0m%s", "            =all", "            Compile all TypeScript files");
        console.log("\x1b[1m%s\x1b[0m%s", "            =core", "           Compile the core TypeScript files");
        console.log("\x1b[1m%s\x1b[0m%s", "            =langs", "          Compile the language TypeScript files");
        console.log("\x1b[1m%s\x1b[0m%s", "            =plugins", "        Compile the plugin TypeScript files");
        console.log("    ");
        console.log("\x1b[1m%s\x1b[0m%s", "    -sass", "                   Compile SASS/SCSS");
        console.log("\x1b[1m%s\x1b[0m%s", "    -scss", "                   <alias>");
        console.log("\x1b[1m%s\x1b[0m%s", "            =all", "            Compile all SCSS Theme files");
        console.log("\x1b[1m%s\x1b[0m%s", "            =themes", "         Compile the core SCSS Theme files");
        console.log("\x1b[1m%s\x1b[0m%s", "            =plugins", "        Compile the plugin SCSS Theme files");
        console.log("    ");
        console.log("\x1b[1m%s\x1b[0m%s", "    -docs", "                   Compile Documentation");
        console.log("\x1b[1m%s\x1b[0m%s", "    -demo", "                   <alias>");
        console.log("\x1b[1m%s\x1b[0m%s", "            =all", "            Compile all documentation pages");
        console.log("");
        process.exit(1);
    }
    if(process.argv[2] === "-info" || process.argv[2] === "--info") {
        let author = synter.package.author.split(" ");
        let copyright = synter.package.copyright.split(" ");
        console.log("");
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    tail.", synter.package.name.split(".")[1], "  " + synter.package.description);
        console.log("");
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    Version:", "      " + synter.package.version, synter.package.status.charAt(0).toUpperCase() + synter.package.status.slice(1));
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    Author:", "       " + author.shift(), author.join(" "));
        console.log("");
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    License:", "      " + synter.package.license);
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    Copyright:", "    " + copyright.shift(), copyright.join(" "));
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    Website:", "      " + synter.package.homepage);
        console.log("");
        console.log("");
        console.log("        \x1b[46m\x1b[1m%s\x1b[0m\x1b[36m\x1b[1m%s\x1b[0m", "Thanks", " for using our tail. project series!");
        console.log("\x1b[46m\x1b[1m%s\x1b[0m\x1b[36m\x1b[1m%s\x1b[0m", "Special Thanks", " to every contributor and every financial and technical support!");
        console.log("");
        process.exit(1);
    }
    if(process.argv[2] === "-version" || process.argv[2] === "--version") {
        let ts = require("typescript");
        let sass = require("sass");

        console.log("");
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    tail.select  ", `v${synter.package.version}-${synter.package.status}`);
        console.log("");
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    synter       ", `v${Synter.version}-${Synter.status}`);
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    dart-sass    ", `v${sass.info.replace(/dart-sass\s+([0-9\.]+)([\s\S]*)/gm, "$1")}`);
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    dart2js      ", `v${sass.info.replace(/([\s\S]+?)dart2js\s+([0-9\.]+)([\s\S]*)/gm, "$2")}`);
        console.log("\x1b[0m%s\x1b[1m%s\x1b[0m", "    typescript   ", `v${ts.version}`);
        console.log("");
        process.exit(1);
    }
}

// Handle Parameters
let args = { };
let argv = process.argv.slice(2).join(" ").replace(/\s+\=\s+/g, "=").split(" ");
for(let i = 0; i < argv.length; i++ ) {
    let [key, value] = (argv[i] + (argv[i].indexOf("=") < 0? "=all": "")).split("=");

    // Render All
    if(key == "-all") {
        args.ts = "all";
        args.sass = "all";
        args.docs = "all";
        break;
    }

    // TypeScript Instructions
    if(key == "-typescript" || key == "-ts") {
        args.ts = ["all", "core", "langs", "plugins"].indexOf(value) > 0? value: "all";
        continue;
    }

    // SASS/SCSS Instructions
    if(key == "-sass" || key == "-scss") {
        args.sass = ["all", "themes", "plugins"].indexOf(value) > 0? value: "all";
        continue;
    }

    // SASS/SCSS Instructions
    if(key == "-docs" || key == "-demo") {
        args.docs = ["all"].indexOf(value) > 0? value: "all";
        continue;
    }
}

if(Object.keys(args).length === 0) {
    console.log("");
    console.log("\x1b[31m\x1b[1m%s\x1b[0m",    "    The passed Arguments are invalid");
    console.log("\x1b[0m%s\x1b[1m%s\x1b[0m%s", "    Enter '", "-help", "' to learn how you can use this script.");
    console.log("");
    process.exit(1);
}
main(args);
