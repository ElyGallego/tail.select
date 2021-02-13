
import RatSelect from "rat.select";

class SelectPluginSearch implements RatSelect_PluginSearch {
    /*
     |  CORE :: SELECT INSTANCE
     */
    select: RatSelect_PluginSearchSelect;

    /*
     |  CORE :: CONSTRUCTOR
     */ 
    constructor(select: RatSelect_PluginSearchSelect) {
        this.select = select;
    }

    /*
     |  HELPER :: APPLY LINGUISTIC RULEs
     */
    applyLinguistic(term: string, strict: boolean): string {
        let rules = this.select.get("search.linguistic", { });
        let values = Object.keys(rules).map((key) => values.push(`(${key}|[${rules[key]}])`));

        if(values.length > 0) {
            if(strict) {
                values = values.concat(values.map((i) => i.toLocaleUpperCase() ));
            }
            term = term.replace(new RegExp(values.join("|"), strict? "g": "gi"), function(i) {
                return values[[].indexOf.call(arguments, i, 1) - 1];
            });
        }
        return term;
    }

    /*
     |  WALKER :: OPTION FINDER
     */
    finder(this: RatSelect_PluginSearchSelect, term: string, config: RatSelect_PluginSearchConfigOptions[]): HTMLOptionElement[] | HTMLCollectionOf<HTMLOptionElement> | NodeListOf<HTMLOptionElement> {
        this.state("search", true);
    
        // Assign Configuration
        let con: any = { };
        config.map((i) => con[i === "regex"? "regexp": i] = true);
    
        // Apply Linguistic Rules
        if(this.get("search.linguistic")) {
            term = this.plugins.plugins["search"].applyLinguistic(term, con.strict);
        }
        
        // Prepare Search Callback
        let exp = term;
        let searchCB;
        if(con.regexp) {
            exp = con.comma? `(${exp.split(",").map(i => i.trim()).join("|")})`: exp;
            exp = con.whole? `\\b${exp}\\b`: exp;
            searchCB = (word) => {
                let regexp = new RegExp(exp, con.strict? "m": "mi");
                return regexp.test(word);
            };
        } else {
            exp = con.strict? exp.toLocaleLowerCase(): exp;
            searchCB = (word) => {
                word = con.strict? word.toLocaleLowerCase(): word;
                if(con.comma) {
                    return term.split(",").some(i => i.trim().indexOf(word) >= 0);
                }
                return word.indexOf(term) >= 0;
            };
        }
    
        // Handle
        let handle;
        if(con.any) {
            handle = (item) => { return searchCB(item.innerText) || [].some.call(item.attributes, searchCB); }
        } else if(con.attr) {
            handle = (item) => { return [].some.call(item.attributes, searchCB); }
        } else if(con.visible) {
            handle = (item) => { return searchCB(item.innerText) || searchCB(item.dataset.description || ""); }
        } else {
            handle = (item) => { return searchCB(item.innerText); }
        }
    
        // Return
        return [].filter.call(this.source.options, (item) => {
            return handle.call(this, item);
        });
    }

    /*
     |  HOOK :: BUILD AFTER
     */
    "build:after"(this: RatSelect_PluginSearchSelect): void {
        this.search = document.createElement("INPUT") as HTMLInputElement;
        this.search.type = "text";
        this.search.className = "dropdown-search";
        this.search.placeholder = this.locale._("search");
        this.dropdown.insertBefore(this.search, this.dropdown.children[0]);
        this.select.classList.add("plugin-search");
    }

    /*
     |  HOOK :: BIND AFTER
     */
    "bind:after"(this: RatSelect_PluginSearchSelect): void {
        this.search.addEventListener("input", this.handler);
    }

    /*
     |  HOOK :: HANDLE BEFORE
     */
    "handle:before"(this: RatSelect_PluginSearchSelect, event: Event): void {
        if(!(event instanceof Event) || this.get("disabled")) {
            return;
        }
        if(event.type !== "input" || event.target !== this.search) {
            return;
        }
        let target = event.target as HTMLInputElement;
        let value = target.value;

        // Apply Search
        if(value.length >= this.get("search.minimum", 3)) {
            let finder = this.get("search.finder", this.plugins.plugins["search"].finder);

            if(this.get("search.async")) {
                let spinner = document.createElement("DIV");
                spinner.className = "dropdown-spinner";
                this.dropdown.querySelector(".dropdown-inner").innerHTML = spinner.outerHTML;

                setTimeout(() => {
                    this.query(finder, [value, this.get("search.config", ["text", "visible"])]);
                }, 250);
            } else {
                this.query(finder, [value, this.get("search.config", ["text", "visible"])]);
            }
        } else if(this.state("search")) {
            this.state("search", false);
            this.query();
        }
    }

    /*
     |  FILTER :: RENDERED ELEMENT
     */
    "render#option"(this: RatSelect_PluginSearchSelect, output, element, tag) {
        if(!this.state("search") || !this.get("search.mark", true)) {
            return [output, element, tag];
        }
        let value = this.search.value;
        let regexp = new RegExp(`(${this.plugins.plugins["search"].applyLinguistic(value, false)})`, "gi");
        [].map.call(output.children, (child) => {
            child.innerHTML = child.innerHTML.replace(regexp, "<mark>$1</mark>");
        });
        return [output, element, tag];
    }

    /*
     |  EVENT :: OPEN
     */
    "open"(this: RatSelect_PluginSearchSelect): void {
        if(this.get("search.focus", false)) {
            this.search.focus();
        }
    }
}

/*
 |  REGISTER DATA
 */
RatSelect.Strings.en["search"] = "Tap to search...";
RatSelect.Plugins.add("search", SelectPluginSearch);
