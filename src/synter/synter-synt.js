/*!
 |  SYNTER - [SYN]ders [T]ail [E]xtension [R]ebuilder
 |  @file       ./synter-synt.js
 |  @author     SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |  @version    0.1.0 - Alpha
 |
 |  @website    https://github.com/pytesNET/synter
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2019 - 2020 SamBrishes @ pytesNET <info@pytes.net>
 */

/*
 |  THIS CLASS BUILDS UP THE DISTRIBUTION FILES DEPENDING ON THE *.SYNT DECLARATIONs.
 */
module.exports = class SynterSynt {
    /*
     |  SYNT :: REGULAR EXPRESSIONs
     |
     |  Functions       @[function] ( param, param )
     |  Statements      %[statement] ... %end-[statement]
     |  Variables       $[variable]
     |                  $[namespace].[variable]
     */
    get regex() {
        return {
            functions: /(?:\/\*\*(?: )*\@([a-z]+)(?: )*\((.*)\)(?: )*(?: )*\*\*\/|\{\{(?: )*\@([a-z]+)(?: )*\((.*?)\)(?: )*\}\})/g,
            statements: '',
            variables: /(?:\/\*\*(?: )*\$([a-z_.-]+)(?: )*\*\*\/|\{\{(?: )*\$([a-z_.-]+)(?: )*\}\})/g,
            variable: /\$([a-z_.-]+)/gi
        };
    }

    /*
     |  SYNT :: TEMPLATE FUNCTIONS
     |  Contains all available template functions.
     */
    get functions() {
        return {
            /*
             |  CHECK VARIABLE / PRINT DATA
             |  @since  0.1.0 [0.1.0]
             */
            is: function(expr, output_if, output_else) {
                let value = this.getScope(expr.trim());

                if(value !== undefined || this.isNamespace(expr.trim()) !== false) {
                    return (output_if)? this.parseVariables(output_if, true): true;
                }
                return (output_else)? this.parseVariables(output_else, true): false;
            },

            /*
             |  RENDER A PART INSIDE A TEMPLATE
             |  @since  0.1.0 [0.1.0]
             */
            part: function(part, params) {
                if(!(part in this.parts)) {
                    return [false, `The part module ${part} doesn't exist!`];
                }
                return this.parse(this.parts[part], params);
            },

            /*
             |  CAPITALIZE TEXT
             |  @since  0.1.0 [0.1.0]
             */
            capitalize: function(string) {
                let result = this.parseVariables(string, true);
                if(!result[0]) {
                    return result;
                }

                // Handle
                return [true, result[1].split(" ").map((letter) => { 
                    return letter.charAt(0).toUpperCase() + letter.slice(1); 
                }).join(" ")];
            },

            /*
             |  LOWER TEXT
             |  @since  0.1.0 [0.1.0]
             */
            lower: function(string) {
                let result = this.parseVariables(string, true);
                if(!result[0]) {
                    return result;
                }

                // Handle
                return [true, result[1].toLowerCase()];
            },

            /*
             |  UPPER TEXT
             |  @since  0.1.0 [0.1.0]
             */
            upper: function(string) {
                let result = this.parseVariables(string, true);
                if(!result[0]) {
                    return result;
                }

                // Handle
                return [true, result[1].toUpperCase()];
            },

            /*
             |  QUOTE TEXT
             |  @since  0.1.0 [0.1.0]
             */
            quote: function(string, double) {
                let result = this.parseVariables(string, true);
                if(!result[0]) {
                    return result;
                }

                // Handle
                return [true, (double)? `"${result[1]}"`: `'${result[1]}'`];
            },

            /*
             |  UNQUOTE TEXT
             |  @since  0.1.0 [0.1.0]
             */
            unquote: function(string) {
                let result = this.parseVariables(string, true);
                if(!result[0]) {
                    return result;
                }

                // Handle
                if(/^(\"(.*?)\"|\'(.*?)\')$/.test(result[1])) {
                    result[1] = result[1].slice(1, result[1].length - 1);
                }
                return [true, result];
            }
        };
    }

    /*
     |  SYNT :: TEMPLATE STATEMENTs
     |  Contains all available template statements.
     */
    get statements() {
        return {
            /*
             |  IF ... ELSE ... ENDIF STATEMENT
             |  @since  0.1.0 [0.1.0]
             */
            if: {
                regexp: /\/\*\*(?: )*\%if(?: )*\(([^\n\r]*)\)(?: )*\*\*\/([\s\S]+?)\/\*\*(?: )*\%endif(?: )*\*\*\//gi,
                callback: function(match) {
                    let [exp, val] = [match[1], match[2]];
                    if(this.parse({ content: `{{ ${exp} }}` }) && this.parseFunctions(`{{ ${exp} }}`) === true) {
                        val = val.split("\n").filter((i) => i.trim().length > 0);
                        val[0] = val[0].replace(/^([ ]{4}|\t)/, "");
                        return [true, val.join("\n")];
                    }
                    return [true, ""];
                }
            },

            /*
             |  FOR LOOP STATEMENT
             |  @since  0.1.0 [0.1.0]
             */
            for: {
                regexp: /\/\*\*(?: )*\%for(?: )*\((?: )*\$([a-z]+)(?: )*in(?: )*\$([a-z._-]+)\)(?: )*\*\*\/([\s\S]+?)\/\*\*(?: )*\%endfor(?: )*\*\*\//gi,
                callback: function(match) {
                    let [variable] = [match[1]];
                    let [key, val] = match[2].split(".");
                    
                    // Make Copy of existing Variables
                    let copy = this.scope[variable] || null;
                    let clone = [].concat(this.scope[key][val]);

                    // Loop Expression
                    let temp = [];
                    let content = [];
                    let template = { content: match[3] };

                    for(let item in clone) {
                        this.local[variable] = clone[item];

                        temp = this.parse(template);
                        if(temp[0]) {
                            content.push(temp[1].replace(/(\r\n)$/, ""));
                        }
                    }
                    content[0] = content[0].replace(/^(\r\n(?:[ ]{4}|\t))/, "");

                    // Return Copy
                    if(copy !== null) {
                        this.scope[variable] = copy;
                    }
                    return [true, content.join("\n")];
                }
            },

            /*
             |  WHILE LOOP STATEMENT
             |  @since  0.1.0 [0.1.0]
             */
            while: {
                regexp: /not-available-yet/,
                callback: function(match) {
                    return [true, content];
                }
            }
        }
    }

    /*
     |  CONSTRUCTOR
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  string  The content of your `.synt` template file.
     |  @param  object  The JSON.parsed content of your `package.json` file or null.
     |  @param  object  The JSON.parsed content of your `bower.json` file or null.
     |
     |  @return this    The SynterSynt instance itself.
     */
    constructor(synt, package_data = null, bower_data = null) {
        if(!/^:(template|part)/gm.test(synt)) {
            throw new Error("The passed .synt content seems invalid or is empty.");
        }

        // Set Synt
        this.templates = { };
        this.parts = { };

        // Set Package
        this.bower = bower_data || { };
        this.package = package_data || { };

        // Set Scope
        this.global = {
            core: { },
            data: { },
            date: { }
        };
        this.local = { };

        // Build
        return this.build(synt);
    }
    
    /*
     |  BUILD SYNDER TEMPLATE FILE
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  string  The content of your `.synt` template file.
     |
     |  @return this    The SynterSynt instance itself.
     */
    build(content) {
        let id;                 // Unique Template | Part ID
        let type;               // Template or Part Type
        let params = {};        // Template or Part Attributes

        let skip = false;       // Skip this Template or Part
        let comment = false;    // Skip major comments

        // Parse Content
        content.split("\n").forEach((line, index) => {
            if(/^\/\//.test(line)) {        // Single Line Comment
                return false;
            }
            if(/^\/\*/.test(line)) {        // Start Multiple Line Comment
                comment = true;
            }
            if(comment === true) {          // End Multiple Line Comment
                if(/\*\//.test(line)) {
                    comment = false;
                }
                return false;
            }

            // Block Start
            if(line.startsWith(":template") || line.startsWith(":part")) {
                type = (line.startsWith(":template"))? "template": "part";

                // Fetch Name
                let name = line.match(/(?: )+\b([\w-]+)\b(?: )+(?![=])/);
                if(name instanceof Array && name.length >= 2) {
                    id = name[1];
                } else {
                    skip = true;
                    return false;
                }

                // Fetch Attributes
                let match;
                let matches = new RegExp(/([a-z_-]+)\=(?:\"([\s\S]*?)\"|\'([\s\S]*?)\')(?= |$)/gi);
                while((match = matches.exec(line)) !== null) {
                    let [key, val] = [match[1], match[2] || match[3]];
                    if(key && val) {
                        params[key] = val;
                    }
                }
                params.content = "";
                return true;
            }

            // Block Content
            if(!skip && (/^(    |\t)+/.test(line) || line.trim().length === 0)) {
                params.content += line + "\n";
            }

            // Block End
            if(line.startsWith(":end")) {
                if(!skip) {
                    params.content = params.content.replace(/([\s]+)$/, "");
                    if(type === "part") {
                        this.parts[id] = params;
                    } else {
                        this.templates[id] = params;
                    }
                }

                id = "";
                type = "";
                skip = false;
                params = {};
            }
        });
        return this;
    }

    /*
     |  SCOPE :: PREPARE CORE GLOBALs
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  string  The distribution path including the file itself.
     |  @param  string  The source code for the distribution file.
     |
     |  @return this    The SynterSynt instance itself.
     */
    prepareCore(filepath, source) {
        let split = filepath.replace(/\\/g, "/").split("/");
        let [file, path] = [split.pop(), split.join("/") + "/"];

        let filename = file.split(".");
            filename.pop();
        if(["min", "com", "comp", "compressed"].indexOf(filename[filename.length - 1]) >= 0) {
            filename.pop();
        }

        return this.setScope({
            path: path,
            file: file,
            filename: filename.join("."),
            source: source,
            size: source.length + " Bytes",
            sizeKB: (source.length / 1024).toFixed(2) + " KB",
            sizeMB: (source.length / (1024 * 1024)).toFixed(2) + " MB"
        });
    }

    /*
     |  SCOPE :: SET DATA TO SCOPE
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  object  The namespaced-object you want to add to the globals.
     |                  Using no namespace will add all object parameters to the core object.
     |                  Example (Custom):   { namespace: { key: value } }
     |                  Example (Core):     { key: value }
     |
     |  @return this    The SynterSynt instance itself.
     */
    setScope(object, global = true) {
        let scope = global? this.global: this.local;

        for(let key in object) {
            if(!(object[key] instanceof Object)) {
                if(scope === this.global) {
                    this.global.core[key] = object[key];
                }
                continue;
            }
            if(!(key in scope)) {
                scope[key] = object[key];
                continue;
            }
            for(let val in object[key]) {
                scope[key][val] = object[key][val];
            }
        }
        return this;
    }

    /*
     |  HANDLE :: GET VARIABLE
     |  @since  0.1.0 [0.1.0]
     */
    getScope(variable) {
        let [key, val] = variable.replace(/^\$/, "").split(".");
        if(!val) {
            [key, val] = ["core", key]; 
        }

        if(key === "data") {
            return (val in this.package? this.package[val]: val in this.bower? this.bower[val]: undefined);
        } else if((key === "bower" || key === "package") && val in this[key]) {
            return this[key][val];
        } else if(key in this.global) {
            return this.global[key][val];
        } else if(key in this.local) {
            return this.local[key][val];
        }
        return undefined;
    }

    /*
     |  HANDLE :: CHECK IF NAMESPACE IS AVAILABLE
     |  @since  0.1.0 [0.1.0]
     */
    isNamespace(ns) {
        ns = ns.replace(/^\$/, "");
        if(["data", "bower", "package"].indexOf(ns) >= 0) {
            return true;
        }
        if(ns in this.global || ns in this.local) {
            return true;
        }
        return false;
    }

    /*
     |  RENDER TEMPLATE (ASYNC)
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  string  The :template file name, as defined in the pased *.synt file
     |  @param  string  The distribution filename with the full path you want to show up.
     |  @param  string  The source code, which should be used within the declaration file.
     |  @param  object  Some additional global variables.
     |
     |  @return 
     */
    render(template, path, source, global = { }) {

    }

    /*
     |  RENDER TEMPLATE (SYNC)
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  string  The :template file name, as defined in the pased *.synt file
     |  @param  string  The distribution filename with the full path you want to show up.
     |  @param  string  The source code, which should be used within the declaration file.
     |
     |  @return 
     */
    renderSync(template, path = null, source = null) {
        if(!(template in this.templates)) {
            throw new Error(`The passed template name ${template} doesn't exist!`);
        }

        // Prepare Core Namespace
        if(path !== null && source !== null) {
            this.prepareCore(path, source);
        }

        // Prepare Date Namespace
        let date = new Date();
        let data = {
            date:       null,
            day:        ("0" + date.getDate().toString()).slice(-2),
            month:      ("0" + (date.getMonth()+1).toString()).slice(-2),
            year:       date.getFullYear(),
            time:       null,
            hours:      ("0" + date.getHours().toString()).slice(-2),
            minutes:    ("0" + date.getMinutes().toString()).slice(-2),
            seconds:    ("0" + date.getSeconds().toString()).slice(-2)
        };
        data.date = `${data.year}-${data.month}-${data.day}`;
        data.date = `${data.hours}:${data.minutes}:${data.seconds}`;
        this.setScope({ date: data });

        // Parse Template File
        let [status, content] = this.parse(this.templates[template]);
        if(status !== true) {
            throw new Error(content);
        }
        this.local = { };
        return content;
    }

    /*
     |  PARSE TEMPLATE & PART MODULES
     |  @since  0.1.0 [0.1.0]
     |
     |  @param  object  The template or part module to render.
     |  @param  object  Some additional parameters exclusive for this template or part module.
     |                  The same requirements as on the params parameter on `.render()`.
     |
     |  @return array   [status: boolean, content: string]
     */
    parse(template, params) {
        let status = true;
        let content = template.content;
    
        // Replace Starting Tabs / Spaces
        content = content.split("\n").map((line) => {
            if(template.indent) {
                if(template.indent == 4 && template.indenter == "space") {
                    return line;        // The code has 4 Space-Indent per Default
                }
            }

            // Remove Indention
            if(/^    /.test(line)) {
                line = line.substr(4);
            }
            if(/^\t/.test(line)) {
                line = line.substr(1);
            }

            // Add Indents
            let indent = (template.indenter === "tab")? "\t": " ";
            return indent.repeat(template.indent) + line;
        }).join("\n");

        // Parse Statements
        [status, content] = this.parseStatements(content);
        if(!status) {
            return [status, content];
        }

        // Parse Functions
        [status, content] = this.parseFunctions(content);
        if(!status) {
            return [status, content];
        }

        // Parse Variables
        [status, content] = this.parseVariables(content);
        if(!status) {
            return [status, content];
        }

        // Everything is cool
        this.loopLastStatus = status;
        this.loopLastResult = content;
        this.loopLastArguments = [template, params];
        return [status, content];
    }

    /*
     |  PARSE MODULE STATEMENTs
     |  @since  0.1.0 [0.1.0]
     */
    parseStatements(content) {
        let match;
        let result;
        for(let key in this.statements) {
            let statement = this.statements[key];

            while((match = statement.regexp.exec(content)) !== null) {
                result = statement.callback.call(this, match);
                if(!result[0]) {
                    return result;
                }

                // Replace
                content = content.slice(0, match.index - 4) + result[1] + 
                          content.slice(match.index + match[0].length + 1);
            }
        }
        return [true, content];
    }

    /*
     |  PARSE MODULE FUNCTIONs
     |  @since  0.1.0 [0.1.0]
     */
    parseFunctions(content) {
        if(content.trim().length == 0) {
            return [true, content];
        }

        // Loop Functions
        let match;
        let replace;
        while((match = this.regex.functions.exec(content)) !== null) {
            let [func, args] = [match[1] || match[3], match[2] || match[4]];
            if(args !== "") {
                args = this.parseArguments.apply(this, args.split(",").map((arg) => arg.trim()));
            }

            // Check Function
            if(!(func in this.functions)) {
                console.error(`The function ${func} doesn't exist!`);
                return [false, `The function ${func} doesn't exist!`];
            }

            // Handle Function
            replace = this.functions[func].apply(this, args);
            if(replace === false) {
                replace = [true, ""];
            }
            if(!replace[0]) {
                return [false, ""];
            }

            // Replace
            content = content.slice(0, match.index) + replace[1] + 
                      content.slice(match.index + match[0].length);
        }
        return [true, content];
    }

    /*
     |  PARSE MODULE VARIABLEs
     |  @since  0.1.0 [0.1.0]
     */
    parseVariables(content, inner) {
        if(content.trim().length == 0) {
            return [true, content];
        }
        let self = this;

        // Replace Variable
        if(inner) {
            return [true, content.replace(self.regex.variable, (match, val1, val2, index) => {
                let value = self.getScope.call(self, val1 || val2);
                if(value === undefined) {
                    console.error(`The variable ${val1 || val2 || match} doesn't exist.`);
                    return "undefined";
                }
                return value;
            })];
        }

        // Replace Variables
        let match;
        while((match = this.regex.variables.exec(content)) !== null) {
            let value = self.getScope.call(self, match[1] || match[2]);
            if(value === undefined) {
                console.error(`The variable ${val1 || val2 || match} doesn't exist.`);
                value = "undefined";
            }

            let sub = 0;
            if(/[ ]{4}$/.test(content.slice(0, match.index))) {
                sub = 0;
            }

            // Replace
            content = content.slice(0, match.index - sub) + value + content.slice(match.index + match[0].length);
        }
        return [true, content];
    }

    /*
     |  PARSE FUNCTION ARGUMENTs
     |  @since  0.1.0 [0.1.0]
     */
    parseArguments() {
        let args = [];
        for(let i = 0; i < arguments.length; i++) {
            if(/(?:\"(.*?)\"|\'(.*?)\')/.test(arguments[i])) {
                args.push(arguments[i].slice(1, arguments[i].length - 1));
            } else if(!isNaN(parseInt(arguments[i]))) {
                args.push(parseInt(arguments[i]));
            } else if(arguments[i] == "true" || arguments[i] == "false") {
                args.push(arguments[i] == "true"? true: false);
            } else if(arguments[i] == "null") {
                args.push(null);
            } else {
                args.push(arguments[i]);
            }
        }
        return args;
    }
}
