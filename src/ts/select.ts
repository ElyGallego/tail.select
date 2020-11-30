

import "./polyfill.es5";

import { Strings } from "./strings";
import { Plugins } from "./plugins";
import { Options } from "./options";


export class Select implements RatSelect_Select {
    /*
     |  STATIC :: INSTANCES
     */
    static inst = { 
        length: 0
    };

    /*
     |  STATIC :: STRING HANDLER
     */
    static strings = Strings;

    /*
     |  STATIC :: PLUGINS HANDLER
     */
    static plugins = Plugins;


    /*
     |  CORE :: SOURCE SELECT FIELD
     */
    source: HTMLSelectElement;
    
    /*
     |  CORE :: CONFIG OBJECT
     */
    config: RatSelect_Config;

    /*
     |  CORE :: OPTIONS CLASS INSTANCE
     */
    options: RatSelect_Options;

    /*
     |  CORE :: LOCALIZATION CLASS INSTANCE
     */
    locale: RatSelect_Strings;

    /*
     |  CORE :: PLUGIN API CLASS INSTANCE
     */
    plugins: RatSelect_Plugins;

    /*
     |  CORE :: EVENT CALLBACKs
     */
    events: Object;

    /*
     |  RAT :: MAIN SELECT ELEMENT
     */
    select: HTMLDivElement;

    /*
     |  RAT :: MAIN LABEL ELEMENT
     */
    label: HTMLLabelElement;

    /*
     |  RAT :: MAIN DROPDOWN ELEMENT
     */
    dropdown: HTMLDivElement;

    /*
     |  RAT :: MAIN DROPDOWN ELEMENT
     */
    csv: HTMLInputElement;

    /*
     |  CORE :: CONSTRUCTOR
     */
    constructor(source: HTMLSelectElement, config: RatSelect_Config, options?: RatSelect_OptionsConstructor) {
        this.source = source;
        this.config = config;
        this.options = new (options || Options)(this);
        this.locale = new Strings(config.locale || "en");
        this.plugins = new Plugins(config.plugins || { });
        this.events = config.on || { };

        // Init States
        this.config.multiple = this.source.multiple = config.multiple || source.multiple;
        this.config.disabled = this.source.disabled = config.disabled || source.disabled;
        this.config.required = this.source.required = config.required || source.required;

        // Init Placeholder
        let placeholder = config.placeholder || source.dataset.placeholder || null;
        if(!placeholder || source.options[0].value === "") {
            placeholder = source.options[0].innerText;
        }
        this.config.placeholder = placeholder;

        // Init RTL
        if((config.rtl || null) === null) {
            this.config.rtl = ['ar','fa','he','mdr','sam','syr'].indexOf(config.locale || "en") >= 0;
        }

        // Init Theme
        if((config.theme || null) === null) {
            let evaluate = document.createElement("SPAN");
            evaluate.className = "rat-select-theme-name";
            document.body.appendChild(evaluate);
            this.config.theme = window.getComputedStyle(evaluate, ":after").content.replace(/"/g, "");
            document.body.removeChild(evaluate);
        }

        // Add Instance
        source.dataset.ratSelect = Select.inst.length.toString();
        Select.inst[Select.inst.length++] = this;
        this.init();
    }

    /*
     |  CORE :: INIT SELECT FIELD
     */
    init(): RatSelect_Select {
        this.trigger("hook", "init:before");

        // Init Options
        if(typeof this.config.items !== "undefined") {
            let items = this.config.items;
            this.options.parse(typeof items === "function"? items.call(this, this.options): items);
        }

        // Handle Build Step
        this.trigger("hook", "build:before");
        this.build();
        this.trigger("hook", "build:after");

        // Handle Bind Step
        this.trigger("hook", "bind:before");
        this.bind();
        this.trigger("hook", "bind:after");


        // Append to DOM
        if(this.source.nextElementSibling) {
            this.source.parentElement.insertBefore(this.select, this.source.nextElementSibling);
        } else {
            this.source.parentElement.appendChild(this.select);
        }
        this.trigger("hook", "init:after");
        return this.query("walker");
    }

    /*
     |  CORE :: BUILD SELECT FIELD
     */
    build(): RatSelect_Select {
        let cls = this.get("classNames") === true? this.source.className: this.get("classNames", "");

        // Create :: Select
        this.select = document.createElement("DIV") as HTMLDivElement;
        this.select.className = ((cls) => {
            this.get("rtl")? cls.unshift("rtl"): null;
            this.get("hideSelected")? cls.unshift("hide-selected"): null;
            this.get("hideDisabled")? cls.unshift("hide-disabled"): null;
            this.get("hideHidden", !0)? cls.unshift("hide-hidden"): null;
            this.get("disabled")? cls.unshift("disabled"): null;
            this.get("required")? cls.unshift("required"): null;
            this.get("multiple")? cls.unshift("multiple"): null;
            this.get("deselect")? cls.unshift("deselect"): null;
            cls.unshift(`rat-select theme-${this.get("theme").replace("-", " scheme-").replace(".", " ")}`);
            return cls.filter((item) => item.length > 0).join(" ");
        })(typeof cls === "string"? cls.split(" "): cls);
        this.select.tabIndex = this.source.tabIndex || 0;
        this.select.dataset.ratSelect = this.source.dataset.ratSelect;

        let width = this.get("width", 250);
        if(width !== null) {
            this.select.style.width = width + (isNaN(width)? "": "px")
        }

        // Create :: Label
        this.label = document.createElement("LABEL") as HTMLLabelElement;
        this.label.className = "select-label";
        this.label.innerHTML = `<span class="label-inner">Test Placeholder</span>`;

        // Create :: Dropdown
        this.dropdown = document.createElement("DIV") as HTMLDivElement;
        this.dropdown.className = `select-dropdown overflow-${this.get("titleOverflow", "clip")}`;
        this.dropdown.innerHTML = `<div class="dropdown-inner"></div>`;

        // Create :: CSV Input
        this.csv = document.createElement("INPUT") as HTMLInputElement;
        this.csv.className = "select-search";
        this.csv.name = ((name) => {
            if(name === true) {
                name = this.source.dataset.name || this.source.name || "";
            }
            return name === false? "": name;
        })(this.get("csvOutput", !1));

        // Build Up
        this.select.appendChild(this.label);
        this.select.appendChild(this.dropdown);
        this.get("csvOutput")? this.select.appendChild(this.csv): null;
        return this;
    }

    /*
     |  CORE :: BIND SELECT FIELD
     */
    bind(): RatSelect_Select {
        let handle = this.handle.bind(this);

        // Attach Events
        document.addEventListener("keydown", this.handle);
        document.addEventListener("click", this.handle);
        if(this.get("sourceBind")) {
            this.source.addEventListener("change", this.handle);
        }
        return this;
    }

    /*
     |  CORE :: HANDLE EVENTs
     */
    handle(event: Event) {
        console.log(event);
    }

    /*
     |  API :: TRIGGER EVENT, FILTER OR HOOK
     */
    trigger(type: "hook" | "event", name: string, args?: Array <any>): any {
        if(type === "event") {
            let data = { bubbles: false, cancelable: true, detail: { args: args, select: this } };
            let event = new CustomEvent(`rat::${name}`, data);
            this.select.dispatchEvent(event);

            if(name === "change") {
                let input = new CustomEvent("input", data);
                let event = new CustomEvent("change", data);
                this.source.dispatchEvent(input);
                this.source.dispatchEvent(event);
            }
        }

        // Handle Hooks

        return null;
    }

    /*
     |  API :: QUERY DROPDOWN
     */
    query(method: string | Function, args?: Array<any>, limit?: null | Number, offset?: null | Number): RatSelect_Select {
        this.trigger("hook", "query:before", []);

        // Handle Walker


        this.trigger("hook", "query:after");
        return this;
    }

    /*
     |  API :: RENDER DROPDOWN
     */
    render(): RatSelect_Select {
        return this;
    }

    /*
     |  API :: UPDATE INSTANCE
     */
    update(): RatSelect_Select {
        return this;
    }

    /*
     |  API :: OPEN DROPDOWN
     */
    open(): RatSelect_Select {
        if(this.select.classList.contains("active")) {
            return this;
        }
        this.select.classList.add("active");
        this.trigger("event", "open", []);
        return this;
    }

    /*
     |  API :: CLOSE DROPDOWN
     */
    close(): RatSelect_Select {
        if(!this.select.classList.contains("active")) {
            return this;
        }
        this.select.classList.remove("active");
        this.trigger("event", "close", []);
        return this;
    }

    /*
     |  API :: RELOAD SELECT INSTANCE
     */
    reload(hard?: boolean): RatSelect_Select {

        return this;
    }

    /*
     |  API :: REMOVE SELECT INSTANCE
     */
    remove(): RatSelect_Select {

        return this;
    }

    /*
     |  PUBLIC :: GET VALUE
     */
    value(format?: 'auto' | 'csv' | 'array' | 'node'): null | string | string[] | HTMLOptionElement {
        if(typeof format === 'undefined' || format === 'auto') {
            format = this.source.multiple? 'array': 'csv';
        }

        switch(format) {
            case 'csv':   return null;
            case 'array': return null;
            case 'node':  return null;
        }
        return null;
    }

    /*
     |  PUBLIC :: GET CONFIG
     */
    get(key: string, def?: any): any {
        return (key in this.config)? this.config[key]: def;
    }

    /*
     |  PUBLIC :: SET CONFIG
     */
    set(key: string, value: any, reload?: boolean): RatSelect_Select {
        if(['multiple', 'disabled', 'required'].indexOf(key) >= 0) {
            if(key === 'disabled') {
                return this[value? 'enable': 'disable'](reload);
            }
            this.config[key] = this.source[key] = !!key;
        } else {
            this.config[key] = value;
        }
        return (reload)? this.reload(): this;
    }

    /*
     |  PUBLIC :: ENABLE SELECT INSTANCE
     */
    enable(reload: boolean): RatSelect_Select {
        this.config.disabled = this.source.disabled = false;
        this.select.classList.remove("disabled");
        return (reload)? this.reload(): this;
    }

    /*
     |  PUBLIC :: DISABLE SELECT INSTANCE
     */
    disable(reload: boolean): RatSelect_Select {
        this.config.disabled = this.source.disabled = true;
        this.select.classList.add("disabled");
        return (reload)? this.reload(): this;
    }

    /*
     |  PUBLIC :: EVENT LISTENER
     */
    on(name: string, callback: Function): RatSelect_Select {
        name.split(",").map((event) => {
            this.events[event] = this.events[event] || [];
            this.events[event].push(callback);
        });
        return this;
    }
}
