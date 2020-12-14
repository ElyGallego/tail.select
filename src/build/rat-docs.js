
const pkg = require("../../package.json");
const fs = require("fs");
const path = require("path");
const marked = require("marked");

/*
 |  INIT MARKED
 */
marked.use({ 
    renderer: {
        heading(text, level) {
            let parts = text.split(/\!/)
            let title = parts.shift().trim();

            let label = [];
            parts.forEach((part) => {
                let inner = part.split(":");
                let [className, innerText] = [inner[0], inner[1] || inner[0].toUpperCase()];
                label.push(`<span class="badge badge-${className.trim()}">${innerText.trim()}</span>`);
            });

            return `<h${level}>${title}${label.join("")}</h${level}>\n`;
        },
        blockquote(quote) {
            if(quote.indexOf(">Changelog") !== 3) {
                return quote;
            }
            quote = quote.replace(/<(\/)?[a-z0-9]+>/g, "").split("\n");
            let title = quote.shift();

            let list = "";
            quote.forEach((line) => {
                let [symbol, text] = [line.charAt(0), line.slice(1)];
                if(text.trim().length === 0) {
                    return;
                }
                if(symbol === ";") {
                    list += `<dt>${text.trim()}</dt>`;
                } else {
                    list += `<dd>${text.trim()}</dd>`;
                }
            });
            return `<div class="changelog"><div class="changelog-title">${title}</div><dl>${list}</dl></div>\n`;
        },
        image(href, title, text) {
            if(text !== "types") {
                return false;
            }
            let list = `<ul><li>${href.split("|").join("</li><li>")}</li></ul>`;
            return `<div class="types"><span class="default-value">${title}</span>${list}</div>`;
        }
    }
})

/*
 |  RENDER PROCESS
 */
function render(content, indent) {
    let head = [];
    let header = { };

    // Extract Header
    content = content.split("\n").map((line) => {
        if(line.startsWith("@")) {
            head.push(line);
            return "";
        }
        return line;
    });
    content = content.join("\n");

    // Format Header
    head.forEach((line) => {
        let [name, data] = line.slice(1).split(":", 2);
        header[name.trim()] = data.trim();
    });

    // Return Header & Content
    return {
        header: header,
        content: marked(content),
        package: pkg
    };
}

/*
 |  MAIN FUNCTION
 */
function main() {
    const root = path.join(__dirname, "..", "docs");
    const files = fs.readdirSync(root, "utf-8");
    const template = fs.readFileSync(path.join(root, "template", "index.html"), "utf-8");

    let index = template.search(/^(\s+)\{\{(\s+)?content/m);
    let indent = (template.indexOf("{", index) - index+1) / 4 

    files.forEach((file) => {
        if(!file.endsWith("md")) {
            return;
        }
        let filename = file.replace(".md", ".html");
        let content = fs.readFileSync(path.join(root, file), "utf-8");
        let rendered = render(content, indent);

        // Render Template
        let page = template;
        page = page.replace(/\{\{(?:\s+)?([a-zA-Z0-9._-]+)(?:\s+)?\}\}/g, (match, replace) => {
            let reference = rendered;
            replace.split(".").forEach((item) => {
                reference = reference[item] || null;
            });
            if(reference instanceof Array) {
                reference = reference.join(", ");
            }
            if(reference && replace !== "content") {
                reference = reference.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
            return reference? reference: match;
        });

        // Store Page
        fs.writeFileSync(path.join(__dirname, "..", "..", "docs", filename), page, "utf-8");
    });
}
main();
