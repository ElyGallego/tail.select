/*!
 |  SYNTER - [SYN]ders [T]ail [E]xtension [R]ebuilder
 |  @file       ./synter-docs.js
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
 |  THIS CLASS RENDERS AND GENERATED THE DOCUMENTATION PAGES
 */
module.exports = class SynterDocs {
    /*
     |  REGEXP :: HEADER
     */
    get regexHeader() {
        return /\<h([1-6])(?:\s+[^\>]+)?\>([\s\S]*?)\<\/h\1\>/gm;
    }

    /*
     |  CONSTRUCTOR
     |  @since  0.1.0 [0.1.0]
     */ 
    constructor(config, outdir, self) {
        let root = path.dirname(config);

        // Check Data
        if(!fs.existsSync(config)) {
            throw new Error(`The config file ${config} doesn't exist.`);
        }
        if(!fs.existsSync(outdir)) {
            throw new Error(`The documentation folder ${outdir} doesn't exist.`);
        }
        if(!fs.existsSync(path.join(root, "layout.html"))) {
            throw new Error(`The documentation layout file ${root}layout.html doesn't exist.`);
        }

        // Add Data
        this.synter = self;
        this.root = root;
        this.outdir = outdir;
        this.index = JSON.parse(fs.readFileSync(config).toString());
        this.layout = fs.readFileSync(path.join(root, "layout.html")).toString();
        this.headers = [];
        return this;
    }

    /*
     |  REPLACE DATA
     |  @since  0.1.0 [0.1.0]
     */
    replace(content, replace) {
        for(let key in replace) {
            let regexp = new RegExp(`\\{\\{(\\s)?${key}(\\s)?\\}\\}`, `g`);
            content = content.replace(regexp, replace[key]);
        }
        return content;
    }

    /*
     |  RENDER DOCUMENTATION
     |  @since  0.1.0 [0.1.0]
     */
    render() {
        for(let page in this.index) {
            this.synter.writeConsole(0, `./src/docs/${page}.html`);

            // Load Content
            let skip = false;
            let content = fs.readFileSync(path.join(this.root, page + ".html")).toString();
            this.index[page]["content"] = "\n" + content.trim().split("\n").map((line) => {
                if(line.trim().startsWith("<pre")) {
                    skip = true;
                }
                if(skip && line.indexOf("</pre>") >= 0) {
                    skip = false;
                }
                return (skip)? line: "    ".repeat(6) + line.trimRight();
            }).join("\n");

            // Parse Navigation
            let header;
            let lastnum = 1;
            let lastitem = null;
            let navigation = [];

            let regex = this.regexHeader;
            while((header = regex.exec(content)) !== null) {
                let number = parseInt(header[1]);
                let title = header[2].substr(0, Math.max(header[2].indexOf("<"), 0) || header[2].length).trim();
                let hash = /id\=\"(.+?)\"/g.exec(header[0]);
                if(hash !== null) {
                    hash = hash[1];
                }

                // Move
                if(number !== lastnum) {
                    if(number < lastnum) {
                        navigation = navigation.slice(0, number);
                    } else if(number > lastnum) {
                        navigation.push(lastitem);
                    }
                    lastnum = number;
                }

                // Create New Item
                lastitem = {
                    title: title,
                    hash: hash,
                    number: number,
                    page: `${page}.html`,
                    children: []
                };

                // Add Main Header
                if(number === 1) {
                    this.headers.push(lastitem);
                    navigation = [lastitem];
                }

                // Add Children Header
                if(number > 1) {
                    navigation[navigation.length - 1].children.push(lastitem);
                }
            }
        }

        // Write Pages
        let date = (new Date()).toUTCString().split(", ")[1].split(" ");
        let navihtml = this.renderNavigation(this.headers);
        for(let page in this.index) {
            let html = this.replace(this.layout, {
                file: page,
                title: this.index[page].title, 
                description: this.index[page].description, 
                tags: this.index[page].tags.join(", "),
                content: this.index[page].content, 
                toc: "\n" + navihtml.trim().split("\n").map((line) => "    ".repeat(7) + line).join("\n"), 
                "last-update": `${date[1]}. ${date[0]}, ${date[2]}`, 
                "last-version": this.synter.package.version + " - " + this.synter.package.status.charAt(0).toUpperCase() + this.synter.package.status.slice(1)
            });

            // Write Content
            fs.writeFileSync(path.join(this.outdir, page + ".html"), html, "utf-8");
            this.synter.writeConsole(2, `./src/docs/${page}.html`);
        }
    }

    /*
     |  RENDER NAVIGATION
     |  @since  0.1.0 [0.1.0]
     */
    renderNavigation(data) {
        let count = 0;
        let content = "";
    
        // Render Navigation
        for(let key in data) {
            let page = data[key];
            let space = "    ".repeat(page.number - 1);
    
            // Render <UL>
            if(count === 0) {
                content += (page.number > 1)? "\n": "";
                content += `${space}<ul class="${page.number === 1? 'toc-navi': 'toc-sub-navi'} navi-depth-${page.number}">\n`;
            }
    
            // Render <LI>
            content += `${space}    <li class="navi-item${page.children.length > 0? ' item-has-sub': ''}" data-toggle="show" data-strict="true">\n`;
    
            // Render Link
            content += `${space}        <a href="${page.page}#${page.hash}" title="${page.title}">${page.title}</a>\n`;
    
            // Render Children
            if(page.children && page.children.length > 0) {
                content += this.renderNavigation(page.children);
            }
    
            // Render </LI>
            content += `${space}    </li>\n`;
    
            // Render </UL>
            if(count++ === (data.length - 1)) {
                content += `${space}</ul>\n`;
            }
        }
    
        // Return
        return content;
    }
};
