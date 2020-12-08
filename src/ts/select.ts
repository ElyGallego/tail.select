

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
     |  RAT :: EVENT HANDLER
     */
    handler: () => any;

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
        this.config.placeholder = config.placeholder || source.dataset.placeholder || null;

        // Init [O]ption [A]s [A] [P]laceholder
        let oaap = source.querySelector("option[value='']:checked:first-child") as HTMLOptionElement;
        if(oaap && (oaap.dataset.ratIgnore = "1")) {
            this.config.deselect = !oaap.disabled;
            this.config.placeholder = oaap.innerText || config.placeholder;
        }

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
        if(this.trigger("hook", "init:before") === false) {
            return this;
        }

        // Init Options
        if(typeof this.config.items !== "undefined") {
            let items = this.config.items;
            this.options.parse(typeof items === "function"? items.call(this, this.options): items);
        }

        // Handle Build Step
        if(this.trigger("hook", "build:before") === true) {
            this.build();
            this.trigger("hook", "build:after");
        }

        // Handle Bind Step
        if(this.trigger("hook", "bind:before") === true) {
            this.bind();
            this.trigger("hook", "bind:after");
        }

        // Append to DOM
        if(this.source.nextElementSibling) {
            this.source.parentElement.insertBefore(this.select, this.source.nextElementSibling);
        } else {
            this.source.parentElement.appendChild(this.select);
        }
        this.updateLabel();
        this.trigger("hook", "init:after");
        return this.query();
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
        this.label.innerHTML = `<span class="label-inner"></span>`;

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
     |  CORE :: CALCULATE DROPDOWN HEIGHT
     */
    calculate(): RatSelect_Select {
        let clone = this.dropdown as HTMLDivElement;

        // Calculate Height
        let height = ((height) => {
            let temp = clone.cloneNode(true) as HTMLDivElement;
            temp.classList.add("height");
            this.select.appendChild(temp);

            if(typeof height === "string" && height.charAt(0) === ":") {
                let opt = (clone.querySelector(".dropdown-option") as HTMLElement)?.offsetHeight ?? 50;
                temp.style.maxHeight = opt * parseInt(height.slice(1)) + "px";
            } else {
                temp.style.maxHeight = height + (isNaN(height)? "": "px");
            }

            height = temp.offsetHeight > height? height: temp.offsetHeight;
            return this.select.removeChild(temp)? height: height;
        })((!this.get("height", 350))? "auto": this.get("height", 350));

        //@TODO Calculate openAbove

        // Set Height
        clone.style.maxHeight = height + "px";
        return this;
    }

    /*
     |  CORE :: BIND SELECT FIELD
     */
    bind(unbind?: boolean): RatSelect_Select {
        if(!this.handler) {
            this.handler = this.handle.bind(this);
        }

        // Attach Events
        if(!unbind) {
            document.addEventListener("keydown", this.handler);
            document.addEventListener("click", this.handler);
            if(this.get("sourceBind")) {
                this.source.addEventListener("change", this.handler);
            }
            return this;
        }

        // Remove Events
        document.removeEventListener("keydown", this.handler);
        document.removeEventListener("click", this.handler);
        if(this.get("sourceBind")) {
            this.source.removeEventListener("change", this.handler);
        }
        return this;
    }

    /*
     |  CORE :: HANDLE EVENTs
     */
    handle(this: RatSelect_Select, event: Event) {
        let target = event.target as HTMLElement;

        // Event :: Keydown
        if(event.type === "keydown") {

        }

        // Event :: Click
        if(event.type === "click") {
            if(target === this.label || this.label.contains(target)) {
                return this.toggle();
            }
            if(!this.select.contains(target) && !this.get("stayOpen")) {
                return this.close();
            }
            if(this.dropdown.contains(target)) {
                while(target && this.dropdown.contains(target) && !target.dataset.action) {
                    target = target.parentElement;
                }

                let disabled = target.classList.contains("disabled");
                if(!disabled && target.dataset.action && (target.dataset.value || target.dataset.group)) {
                    let items = this.options.get(target.dataset.value, target.dataset.group);
                    let action = target.dataset.action;
                    this.options.selected(items, action === "toggle"? null: action === "select");

                    if(!this.get("stayOpen") && !this.source.multiple) {
                        return this.close();
                    }
                }
            }
        }

        // Event :: Change
        if(event.type === "change" && !(event instanceof CustomEvent)) {
            
        }
    }

    /*
     |  API :: TRIGGER EVENT, FILTER OR HOOK
     */
    trigger(type: "hook" | "filter" | "event", name: string, args?: Array <any>): boolean | Array<any> {
        if(type === "event") {
            let data = { bubbles: false, cancelable: true, detail: { args: args, select: this } };
            let event = new CustomEvent(`rat::${name}`, data);
            var cancelled = this.select.dispatchEvent(event);

            if(name === "change") {
                let input = new CustomEvent("input", data);
                let event = new CustomEvent("change", data);
                this.source.dispatchEvent(input);
                this.source.dispatchEvent(event);
            }
        }

        // Handle Hooks & Filters
        let _arg = true;
        let callbacks = this.plugins.hook(name).concat(this.events[name] || []);
        callbacks.map((cb) => {
            if(type === "filter") {
                args = cb.apply(this, args);
            } else if(this.handle.apply(this, args) === false) {
                _arg = false;
            }
        });

        // Return
        return (type === "hook")? _arg: ((type === "filter")? args: cancelled);
    }

    /*
     |  API :: QUERY DROPDOWN
     */
    query(query?: null | Function): RatSelect_Select {
        if(this.trigger("hook", "query:before") === false) {
            return this;
        }

        // Handle Query
        query = typeof query === "function"? query: this.get("query", () => this.options.get());
        query = this.trigger("filter", "query", [query])[0];

        // Handle Walker
        let el = null;
        let skip = void 0;
        let head = [];
        let items = query.call(this);
        for(let item of items) {
            let group = item.parentElement instanceof HTMLOptGroupElement? item.parentElement.label: null;
            [item, group] = this.trigger("filter", "walk", [item, group]) as Array<any>;

            // Skip Group, but keep loop running
            if(group === skip) {
                continue;
            }

            // Create Group
            if(!(head.length > 0 && head[0].dataset.group === (!group? "": group))) {
                let arg = item.parentElement instanceof HTMLOptGroupElement? item.parentElemnt: null;
                if(!arg) {
                    arg = document.createElement("OPTGROUP");
                    arg.innerText = this.get("ungroupedLabel", null);
                }

                if((el = this.render(arg)) === null) {
                    skip = group;
                    continue; // Skip Group
                } else if(el === false) {
                    break; // Break Loop
                }
                head.push(el);
            }

            // Create Item
            if((el = this.render(item)) === null) {
                continue;  // Skip Item
            } else if(el === false) {
                break;  // Break Loop
            }
            head[0].appendChild(el);

            // Experimental Scroll Function
            if(this.get("titleOverflow") === "scroll") {
                (function(el, self) {
                    let style = window.getComputedStyle(el);
                    let inner = el.clientWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight) - 17;
                    let title = el.querySelector(".option-title");

                    if(title.scrollwidth > inner) {
                        let number = inner - title.scrollWidth - 15;
                        title.style.paddingLeft = Math.abs(number) + "px";
                        el.style.textIndent = number + "px";
                    }
                }(el, this));
            }
        }

        // Replace
        let root = this.dropdown.querySelector(".dropdown-inner");
        let clone = root.cloneNode();
        head.map((item) => clone.appendChild(item));
        this.dropdown.replaceChild(clone, root);

        // Hook & Return
        if(this.select.classList.contains("active")) {
            this.calculate();
        }
        this.trigger("hook", "query:after");
        return this;
    }

    /*
     |  API :: RENDER DROPDOWN
     */
    render(element: HTMLOptionElement | HTMLOptGroupElement): null | false | HTMLElement {
        let tag = element.tagName.toUpperCase();
        let output = document.createElement(tag === "OPTION"? "LI": "OL");
        let classes = (item) => {
            let selected = (this.get("multiple") && item.hasAttribute("selected")) || item.selected;
            return ((selected? " selected": "") + (item.disabled? " disabled": "") + (item.hidden? " hidden": "")).trim();
        };

        // Render Item
        if(tag === "OPTION") {
            output.className = "dropdown-option " + classes(element);
            output.innerHTML = `<span class="option-title">${element.innerHTML}</span>`;
            output.dataset.group = (element.parentElement as HTMLOptGroupElement)?.label || "";
            output.dataset.value = (element as HTMLOptionElement).value;
            output.dataset.action = "toggle";
            if(element.dataset.description) {
                output.innerHTML += `<span clasS="option-description">${element.dataset.description}</span>`
            }
        } else {
            output.className = "dropdown-optgroup";
            output.innerHTML = `<li class="optgroup-title">${element.label}</li>`;
            output.dataset.group = element.label;

            if(this.get("multiple") && this.get("multiSelectGroup", 1)) {
                for(let item of ['select-none', 'select-all']) {
                    let btn = document.createElement("BUTTON");
                    btn.dataset.action = item;
                    btn.innerHTML = this.locale._(item === "select-all"? "buttonAll": "buttonNone");
                    output.querySelector(".optgroup-title").appendChild(btn);
                }
            }
        }

        // Filter & Return
        return this.trigger("filter", `render#${tag}`, [output, element, tag])[0];
    }

    /*
     |  API :: UPDATE INSTANCE
     */
    update(changes: Array<HTMLOptionElement | RatSelect_OptionStates>): RatSelect_Select {
        if(changes.length === 0) {
            return this;
        }

        // Hook
        if(this.trigger("hook", "update:before", [changes]) !== true) {
            return this;
        }
        
        // Events
        this.trigger("event", "change", [changes]);
        if(this.source.multiple && this.get("multiLimit") > 0) {
            if(this.options.count(null, ["selected"]) >= this.get("multiLimit")) {
                this.trigger("event", "limit", [changes]);
            }
        }

        // Update Items
        [].map.call(changes, (dataset) => {
            let [option, change] = dataset;
            let value = option.value.replace(/('|\\)/g, "\\$1");
            let group = option.parentElement? option.parentElement.label || "": "";
            let item = this.dropdown.querySelector(`li[data-value="${value}"][data-group="${group}"]`);
            if(item) {
                for(let key in change) {
                    item.classList[change[key]? "add": "remove"](key);
                }
            }
        });

        // Hook & Update
        this.trigger("hook", "update:after", [changes]);
        return this.updateCSV().updateLabel();
    }

    /*
     |  API :: UPDATE CSV
     */
    updateCSV(): RatSelect_Select {
        if(this.get("csvOutput")){
            this.csv.value = this.trigger("filter", "update#csv", [this.value("csv")])[0];
        }
        return this;
    }

    /*
     |  API :: UPDATE LABEL
     */
    updateLabel(label?: string): RatSelect_Select {
        let value = this.value("array") as string[];
        let limit = this.get("multiLimit");

        // Set Placeholder label
        if(this.source.disabled || !this.options.count()) {
            label = this.source.disabled? "disabled": "empty";
        } else if(this.source.multiple && value.length > 0) {
            label = limit === value.length? "multipleLimit": "multipleCount";
        } else if(!this.source.multiple && value.length === 1) {
            label = value[0];
        } else {
            label = this.get("placeholder") || (this.source.multiple? "multiple": "single");
        }

        // Set Placeholder Count
        this.label.innerText = this.locale._(label, [value.length]);
        return this;
    }

    /*
     |  API :: OPEN DROPDOWN
     */
    open(): RatSelect_Select {
        if(this.select.classList.contains("active")) {
            return this;
        }
        this.calculate();
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
        this.dropdown.style.removeProperty("max-height");
        this.select.classList.remove("active");
        this.trigger("event", "close", []);
        return this;
    }

    /*
     |  API :: TOGGLE DROPDOWN
     */
    toggle(): RatSelect_Select {
        return this[this.select.classList.contains("active")? "close": "open"]();
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
    value(format?: 'auto' | 'csv' | 'array' | 'node'): null | string | string[] | HTMLOptionElement | NodeListOf<HTMLOptionElement> {
        if(typeof format === 'undefined' || format === 'auto') {
            format = this.source.multiple? 'array': 'csv';
        }

        let items = this.options.get(null, null, ["selected"]);
        switch(format) {
            case 'csv':   return [].map.call(items, (i) => i.value).join(this.get("csvSeparator", ","));
            case 'array': return [].map.call(items, (i) => i.value);
            case 'node':  return !this.source.multiple? (items[0] || null): [].map.call(items, (i) => i.value);
            default:      return format === "array"? []: null;
        }
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
