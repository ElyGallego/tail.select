
import RatSelect from "rat.select";

/*
 |  DEFAULT OPTIONs
 */
const DEFAULTS: RatSelect_PluginSearchDefaults = {
    async: false,
    config: [
        "text"
    ],
    finder: null,
    focus: false,
    linguistic: null,
    mark: false,
    minimum: 3
};

/*
 |  PLUGIN METHODs
 */
const METHODS: RatSelect_PluginSearchMethods = {
    /*
     |  HOOK :: BUILD AFTER
     */
    "build:after": function(this: RatSelect_SelectSearch) {
        this.search = document.createElement("INPUT") as HTMLInputElement;
        this.search.type = "text";
        this.search.className = "dropdown-search";
        this.search.placeholder = this.locale._("search");
        this.dropdown.insertBefore(this.search, this.dropdown.children[0]);
    },

    /*
     |  HOOK :: BIND AFTER
     */
    "bind:after": function(this: RatSelect_SelectSearch) {
        this.search.addEventListener("input", this.handler);
    },

    /*
     |  HOOK :: HANDLE BEFORE
     */
    "handle:before": function(this: RatSelect_SelectSearch, event: Event) {
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
            let finder = this.get("search.finder", this.options["finder"]);

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
    },

    /*
     |  EVENT :: OPEN
     */
    "open": function(this: RatSelect_SelectSearch) {
        if(this.get("search.focus", false)) {
            this.search.focus();
        }
    }
};

/*
 |  SEARCH :: FIND ITEMs
 */
RatSelect.Options.prototype["finder"] = function(this: RatSelect_SelectSearch, term: string, config: RatSelect_PluginSearchConfigOptions[]): HTMLOptionElement[] | HTMLCollectionOf<HTMLOptionElement> | NodeListOf<HTMLOptionElement> {
    this.state("search", true);

    // Assign Configuration
    let con: any = { };
    config.map((i) => con[i === "regex"? "regexp": i] = true);

    // Apply Linguistic Rules
    if(this.get("search.linguistic")) {
        let rules = this.get("search.linguistic", { });
        let values = Object.keys(rules).map((key) => values.push(`(${key}|[${rules[key]}])`));

        if(values.length > 0) {
            if(con.strict) {
                values = values.concat(values.map((i) => i.toLocaleUpperCase() ));
            }
            term = term.replace(new RegExp(values.join("|"), con.strict? "g": "gi"), function(i) {
                return values[[].indexOf.call(arguments, i, 1) - 1];
            });
        }
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
 |  ADD PLUGIN
 */
RatSelect.Plugins.add("search", DEFAULTS, METHODS);

/*
 |  ADD LOCALE STRING
 */
RatSelect.Strings.en["search"] = "Tap to search...";