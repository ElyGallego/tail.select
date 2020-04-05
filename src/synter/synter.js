/*!
 |  SYNTER - [SYN]ders [T]ail [E]xtension [R]ebuilder
 |  @file       ./synter.js
 |  @author     SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |  @version    0.1.0 - Alpha
 |
 |  @website    https://github.com/pytesNET/synter
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2019 - 2020 SamBrishes @ pytesNET <info@pytes.net>
 */

/*
 |  LOAD CORE DEPENDENCIES
 */
const fs = require("fs");
const path = require("path");

/*
 |  LOAD TYPESCRIPT DEPENDENCIES
 */
const ts = require("typescript");
const minifyES5 = require("uglify-js");
const minifyES6 = require("uglify-es");

/*
 |  LOAD SASS DEPENDENCY
 */
const sass = require("sass");

/*
 |  LOAD INTERNAL PACKAGES
 */
const SynterSynt = require("./synter-synt");
const SynterDocs = require("./synter-docs");


/*
 |  THIS MAIN CLASS HANDLES THE SYNTER ENVIRONMENT AND COMPILER PROCESSES
 */
module.exports = class Synter {
    /*
     |  THE SYNTER VERSION
     */
    static version = "0.1.0";

    /*
     |  THE SYNTER VERSION STATUS
     */
    static status = "alpha";


    /*
     |  CORE :: BOWER
     |  Contains the parsed 'bower.json' content if available.
     */
    bower = null;

    /*
     |  CORE :: PACKAGE
     |  Contains the parsed 'package.json' content if available.
     */
    package = null;

    /*
     |  CORE :: SYNT INSTANCE
     |  The SynterSynt class instance using the '*.synt' builder file.
     */
    synt = null;

    /*
     |  BUILD :: SOURCE CODEs
     |  Contains all compiled source codes (see '.typescript()' or '.sass()').
     */
    source = [];

    /*
     |  BUILD :: SOURCE MAPs
     |  Contains all available source maps (currently only available on SASS).
     */
    map = [];

    /*
     |  RENDER :: CONTENT CODEs
     |  Conatins all rendered distribution files (see '.render()').
     */
    content = [];

    /*
     |  RENDER :: CONTENT MINIFIED
     |  Conatins all minified rendered distribution files (see '.minify()').
     */
    minified = [];

    /*
     |  CONSOLE :: WRITE
     |  The console to render compiler or rendering errors.
     */
    writeConsole = function(status, file, line, character, message){ };

    /*
     |  CONSOLE :: PREFIX
     |  The current console prefix.
     */
    writeConsolePrefix = "";

    /*
     |  CONSTRUCTOR
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  string  The root directory of the project.
     |  @param  string  A custom synt filename, 'build.synt' will be used as default.
     |
     |  @return this    The Synter instance itself.
     */
    constructor(root, synt = null) {
        synt = !synt? "build": "";
        synt = !synt.endsWith(".synt")? synt + ".synt": synt;

        // Get Package / Bower .json
        if(fs.existsSync(`${root}package.json`)) {
            this.package = JSON.parse(fs.readFileSync(`${root}package.json`).toString());
        } else if(fs.existsSync(`./package.json`)) {
            this.package = JSON.parse(fs.readFileSync(`./package.json`).toString());
        }
        if(fs.existsSync(`${root}bower.json`)) {
            this.bower = JSON.parse(fs.readFileSync(`${root}bower.json`).toString());
        } else if(fs.existsSync(`./bower.json`)) {
            this.bower = JSON.parse(fs.readFileSync(`./bower.json`).toString());
        }
        if(!this.package && !this.bower) {
            throw new Error("Neither a package.json nor a bower.json file was found.");
        }

        // Init SYNT
        if(fs.existsSync(`${root}${synt}`)) {
            this.synt = new SynterSynt(fs.readFileSync(`${root}${synt}`).toString(), this.package, this.bower);
        } else if(fs.existsSync(`./${synt}`)) {
            this.synt = new SynterSynt(fs.readFileSync(`./${synt}`).toString(), this.package, this.bower);
        } else {
            throw new Error(`The ${synt} file couldn't be found.`);
        }
        return this;
    }

    /*
     |  ATTACH CONSOLE
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  callb.  The respective callback function.
     |  @param  string  The console handler prefix.
     |
     |  @return this    The Synter instance itself.
     */
    console(func, prefix = "") {
        if(this.writeConsolePrefix !== prefix && prefix !== "") {
            this.writeConsole = func;
            this.writeConsolePrefix = prefix;
        }
        return this;
    }

    /*
     |  COMPILE TYPESCRIPT
     |  @since  0.1.0 [0.1.0]
     |  @source https://github.com/Microsoft/TypeScript/issues/6387#issuecomment-169739615
     |
     |  @param  string  The path to the tsconfig file.
     |  @param  array   Some additional configurations.
     |
     |  @return this    The Synter instance itself.
     */
    typescript(config_path, options = []) {
        let self = this;
        this.source = [];
        this.content = [];

        // TypeScript Reporter
        const tsreport = (diagnostics) => {
            diagnostics.forEach((diagnostic) => {
                let msg = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                let line = null;
                let character = null;
                if(diagnostic.file) {
                    line, character = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
                }
                this.writeConsole(1, "./src/" + diagnostic.file.fileName, line, character, msg);
            });
        };

        // TypeScript Config Parser
        const tsconfig = (filename) => {
            const filein = fs.readFileSync(filename).toString();
            const result = ts.parseConfigFileTextToJson(filename, filein);
            const config = result.config;
            if(!config) {
                process.exit(1);
            }
        
            const parse = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(filename));
            if(parse.errors.length > 0) {
                process.exit(1);
            }
            return parse;
        };

        // TypeScript Modify Host
        const tshost = (config, options) => {
            let host = ts.createCompilerHost(Object.assign(config.options, options));
            let source = host.getSourceFile;
            let write = host.writeFile;

            // Modify Source File
            host.getSourceFile = function(filename, target, onError, newSourceFile) {
                if(filename.indexOf("ts/") < 0) {
                    return source.call(host, filename, target, onError, newSourceFile);
                }
                let file = fs.readFileSync(`./${filename}`).toString();

                // Remove ES5 / ES6 specific content
                if(target === 1) {
                    file = file.replace(/[ ]+\/\/\/\@ts\-target\:ES6\s+([\s\S]*?)\/\/\/\@ts\-target\:ES6/gm, "");
                }  else {
                    file = file.replace(/[ ]+\/\/\/\@ts\-target\:ES5\s+([\s\S]*?)\/\/\/\@ts\-target\:ES5/gm, "");
                }

                // Create SourceFile and Return
                self.writeConsole(0, "./src/" + filename, null, null, "");
                return ts.createSourceFile(filename, file, target, true);
            };

            // Modify Write File
            host.writeFile = function(filename, content, writeMark, onError, sources) {
                if(!filename.trim().endsWith(".js")) {
                    return write.call(hist, filename, content, writeMark, onError, sources);
                }

                // Customize Output
                content = content.split("\n").map((l) => {
                    if(/^(var|const|function|class|[a-zA-Z]+\.prototype)/.test(l)) {
                        return "\n    " + l;        // Some Line Breaks doesn't hurt
                    }
                    return "    " + l;              // Indent for using with template file
                }).join("\n").replace(
                    /\}\s+(else)/gm, "} else"       // Remove line breaks on `} else` statements
                ),

                // Don't write file, push them
                self.source.push([filename.split("/").pop().replace(".js", ""), content]);
                return false;
            };
            return host;
        };

        // Read Configuration
        const config = tsconfig(config_path);
        const host = tshost(config, options);
        
        // Run TypeScript
        let program = ts.createProgram(config.fileNames, config.options, host);
        let emitResult = program.emit();

        tsreport(ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics));
        if(emitResult.emitSkipped) {
            process.exit(1);
        }
        return this;
    }

    /*
     |  COMPILE LOCALs
     |  @todo   Hacky way, try to find a better solution!!
     |  @since  0.1.0 [0.1.0]
     |  
     |  @param  string  
     |
     |  @return this    The Synter instance itself.
     */
    locales(path) {
        this.source = [];
        this.content = [];

        // Read Locale Directory
        let files = fs.readdirSync(path);
        for(let i = 0; i < files.length; i++) {
            if(files[i][0] === "_") {
                continue;
            }
            this.source.push([files[i].replace(".json", ""), ""]);
            this.writeConsole(0, "./src/locales/" + files[i], null, null, "");
        }

        // Return Callback
        this._locales = [];
        return function(file, name, code) {
            let json = JSON.parse(fs.readFileSync(`${path}${name}.json`).toString());

            // Prepare Strings
            let strings = [];
            for(let key in json["strings"]) {
                if(typeof json["strings"][key] === "string") {
                    strings.push(`${key}: "${json["strings"][key]}"`);
                } else {
                    let content = "function (args) {\n"
                                + "            " + json["strings"][key].join("\n            ") + "\n"
                                + "        }";
                    strings.push(`${key}: ${content}`);
                }
            }
            json["locale"] = name;
            json["strings"] = strings.join(",\n        ");

            //@todo Hacky way
            this.synt.setScope({ locale: json }, false);
            this._locales.push(this.synt.parse(this.synt.parts.locale)[1]);

            // Set Data
            this.synt.setScope({ locale: json }, false);
        };
    }

    /*
     |  COMPILE SASS
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  array   The sass configurations.
     |
     |  @return this    The Synter instance itself.
     */ 
    sass(path, config = []) {
        let themes = fs.readdirSync(path, "utf-8");
        this.map = [];
        this.source = [];
        this.content = [];
        this.minified = [];

        // Loop Themes
        for(let i = 0; i < themes.length; i++) {
            let theme = themes[i];
            let files = fs.readdirSync(path + theme, "utf-8").filter((f) => config.files.test(f));


            for(let i = 0; i < files.length; i++) {
                let file = path + theme + "/" + files[i];
                this.writeConsole(0, `${file.replace("./", "./src/")}`, null, null, "");

                // Prepare Config
                let conf = Object.assign({ }, config);
                conf.file = file;
                conf.outFile = conf.outFile.replace(/\$name/g, theme);

                // Parse
                let content = "";
                let minified = "";
                try {
                    content = sass.renderSync(((c) => { c.outputStyle = "expanded"; return c; })(conf));
                    minified = sass.renderSync(((c) => { c.sourceMap = false; c.outputStyle = "compressed"; return c; })(conf));
                } catch (err) {
                    this.writeConsole(1, `${file.replace("./", "./src/")}`, err.line, err.column, err.formatted);
                }
                if(content === "" && minified === "") {
                    continue;
                }

                // Prepare SourceMaps
                let json = JSON.parse(content.map.toString());
                json.sources = json.sources.map((i) => {
                    if(i === "stdin") {
                        return "./src/scss/" + name + ".scss";
                    }
                    return "./src/" + i.split("src/")[1];
                });
                
                // Push
                let fullname = files[i].split(".").slice(0, -1).join(".");
                if(files[i].startsWith("theme-")) {
                    fullname = fullname.split("-").slice(1).join("-");
                } else if(files[i].startsWith("select-")) {
                    fullname = fullname.replace("select", theme);
                }
                this.map.push([fullname, JSON.stringify(json)]);
                this.source.push([fullname, content.css.toString()]);
                this.minified.push([fullname, minified.css.toString()]);
            }
        }
        return this;
    }

    /*
     |  DOCUMENTATION
     |  @since  0.1.0 [0.1.0]
     */
    documentation(config, path) {
        let docs;
        try {
            docs = new SynterDocs(config, path, this);
            docs.render();
        } catch(err) {
            console.error(err.message);
        }
        return this;
    }

    /*
     |  GET FILE HEADER
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  string  The path to the sourcefile.
     |
     |  @return object  The found copyright header informations.
     */
    header(file) {
        let content = fs.readFileSync(file).toString().split("\n");
        let data = { };

        if(content[0].trim() === "/*!") {
            for(let i = 1; i < content.length; i++) {
                if(content[i].trim() == "*/") {
                    break;
                }
                let line = content[i].trim();

                // First Line
                if(i === 1) {
                    data["0"] = line.replace(/^\|/, "").trim();
                    continue;
                }

                // Additional Lines
                let match = line.match(/[\t \|]+\@([a-z]+)\s+([^\r\n]+)/);
                if(match[1] && match[2]) {
                    data[match[1].trim()] = match[2].trim();
                }
            }
        }

        return data;
    }

    /*
     |  RENDER
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  string  The template string as available on the .synt file.
     |  @param  string  The path to the outfile.
     |
     |  @return this    The Synter instance itself.
     */
    render(template, outfile, callback) {
        let file = outfile.replace("../", "./");

        for(let i = 0; i < this.source.length; i++) {
            let [name, code] = this.source[i];
            (callback || function(){ }).call(this, file, name, code);
            let filename = file.replace(/\$name0/g, name.split("-")[0]).replace(/\$name1/g, name.split("-")[1]).replace(/\$name/g, name);
            
            // Set
            let content = this.synt.renderSync(template, filename, code);
            this.content.push([name, content]);

            // Check DIR
            let dir = "." + filename.split("/").slice(0, -1).join("/") + "/";
            if(!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true }, (err) => {
                    console.log(err);
                });
            }

            // Write
            fs.writeFileSync("." + filename, content);
            this.writeConsole(2, filename, null, null, "");
        }
        return this;
    }

    /*
     |  
     |  @since  0.1.0
     |
     |  @param  string  The template string as available on the .synt file.
     |  @param  string  The path to the outfile.
     |
     |  @return this    The Synter instance itself.
     */
    renderAll(template, outfile, callback) {
        let file = outfile.replace("../", "./");

        // Get
        let source = [];
        let content = "";
        if(callback === "locales") {
            source = [].concat(this._locales);
            let copy = Object.assign({ }, this.synt.templates[template]);
            this.synt.templates[template].content = this.synt.templates[template].content.replace('@part("locale")', "$source");
            content = this.synt.renderSync(template, file, source.join("\n\n"));
            this.content = [ ["all", content] ];
            this.synt.templates[template] = copy;
        } else {
            source = ([].concat(this.source)).map((i) => i[1]);
            content = this.synt.renderSync(template, file, source.join("\n"));
            this.content = [ ["all", content] ];
        }
        
        // Write
        fs.writeFileSync(outfile, content);
        this.writeConsole(2, file, null, null, "");
        return this;
    }

    /*
     |  RENDER SOURCE MAPs
     |  @since  0.1.0 [0.1.0]
     */
    renderMap(outfile) {
        let file = outfile.replace("../", "./");

        for(let i = 0; i < this.map.length; i++) {
            let [name, code] = this.map[i];
            let filename = file.replace(/\$name0/g, name.split("-")[0]).replace(/\$name1/g, name.split("-")[1]).replace(/\$name/g, name);

            // Write
            fs.writeFileSync("." + filename, code);
            this.writeConsole(2, filename, null, null, "");
        }
        return this;
    }

    /*
     |  MINIFY TYPESCRIPT
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  string  The type of minification: 'uglify-js' or 'uglify-es'.
     |  @param  string  The template string as available on the .synt file.
     |  @param  string  The path to the outfile.
     |
     |  @return this    The Synter instance itself.
     */
    minify(type, template, outfile) {
        let file = outfile.replace("../", "./");

        if(type === "uglify-js" || type === "uglify-es") {
            let minify = type === "uglify-js"? minifyES5: minifyES6;
            for(let i = 0; i < this.content.length; i++) {
                let [name, code] = this.content[i];
                let filename = file.replace("$name", name);

                // Minify Source
                let minified = minify.minify(code, {
                    compress: {
                        dead_code: true,
                        keep_fnames: true,
                        toplevel: false,
                        unused: false,
                        warnings: true
                    },
                    mangle: {
                        keep_fnames: true
                    },
                    sourceMap: false,
                    toplevel: false,
                    warnings: true
                });
                if(minified.error) {
                    this.writeConsole(1, filename, minified.error.line, minified.error.col, minified.error.message);
                }
                if(minified.warnings) {
                    this.writeConsole(1, filename, minified.warnings.line, minified.warnings.col, minified.warnings.message);
                }

                // Write Content
                let content = this.synt.renderSync(template, filename, minified.code);
                this.minified.push([name, content]);
                fs.writeFileSync(outfile.replace("$name", name), content);
                this.writeConsole(2, filename, null, null, "");
            }
        }
        
        if(type === "sass" || type === "scss") {
            for(let i = 0; i < this.minified.length; i++) {
                let [name, code] = this.minified[i];
                let filename = file.replace(/\$name0/g, name.split("-")[0]).replace(/\$name1/g, name.split("-")[1]).replace(/\$name/g, name);
                
                // Set
                let content = this.synt.renderSync(template, filename, code);
                this.content.push([name, content]);
    
                // Write
                fs.writeFileSync("." + filename, content);
                this.writeConsole(2, filename, null, null, "");
            }
        }
        return this;
    }
}
