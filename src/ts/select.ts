
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
        this.plugins = new Plugins(Object.assign({ }, config.plugins || { }), this);
        this.events = ((events: object) => {
            for(let event in events) {
                events[event] = [events[event]];
            }
            return events;
        })(Object.assign({ }, config.on || { }));

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
        
        // Handle Logic
        this.build();
        this.bind();

        // Handle Visibility
        if(this.get("sourceHide", true)) {
            this.source.style.display = "none";
        }

        // Append to DOM
        if(this.source.nextElementSibling) {
            this.source.parentElement.insertBefore(this.select, this.source.nextElementSibling);
        } else {
            this.source.parentElement.appendChild(this.select);
        }
        this.updateCSV().updateLabel();
        this.trigger("hook", "init:after");

        // Handle & Return
        this.query();
        if(this.get("startOpen") && !this.get("disabled")) {
            return this.open();
        } else if(this.source.autofocus && !this.get("disabled")) {
            return this.focus();
        }
        return this;
    }

    /*
     |  CORE :: BUILD SELECT FIELD
     */
    build(): RatSelect_Select {
        if(this.trigger("hook", "build:before") === false) {
            return this;
        }
        let cls = this.get("classNames") === true? this.source.className: this.get("classNames", "") || "";

        // Create :: Select
        this.select = document.createElement("DIV") as HTMLDivElement;
        this.select.className = ((cls) => {
            let _l = ["rtl", "hideSelected", "hideDisabled", "hideHidden", "disabled", "required", "multiple", "deselect"];
            _l.map((item) => {
                if(this.get(item, item === "hideHidden")) {
                    cls.unshift(item.replace(/[A-Z]/, (char) => `-${char.toLowerCase()}`));
                }
            });
            cls.unshift(`rat-select theme-${this.get("theme").replace("-", " scheme-").replace(".", " ")}`);
            return cls.join(" ").trim();
        })(typeof cls === "string"? cls.split(" "): cls);
        this.select.tabIndex = this.source.tabIndex || 1;
        this.select.dataset.ratSelect = this.source.dataset.ratSelect;

        let width = this.get("width", 250);
        if(width !== null) {
            this.select.style.width = width + (isNaN(width)? "": "px")
        }

        // Create :: Label
        this.label = document.createElement("LABEL") as HTMLLabelElement;
        this.label.className = "select-label";
        this.label.innerHTML = `<div class="label-placeholder"></div>`;

        // Create :: Dropdown
        this.dropdown = document.createElement("DIV") as HTMLDivElement;
        this.dropdown.className = `select-dropdown overflow-${this.get("titleOverflow", "clip")}`;
        this.dropdown.innerHTML = `<div class="dropdown-inner"></div>`;

        // Create :: CSV Input
        this.csv = document.createElement("INPUT") as HTMLInputElement;
        this.csv.className = "select-search";
        this.csv.name = ((name) => {
            if(name === true) {
                name = this.source.name || "";
            }
            return name === false? "": name;
        })(this.get("csvOutput", !1));

        // Build Up
        this.select.appendChild(this.label);
        this.select.appendChild(this.dropdown);
        this.get("csvOutput")? this.select.appendChild(this.csv): null;

        // Hook & Return
        this.trigger("hook", "build:after");
        return this;
    }

    /*
     |  CORE :: CALCULATE DROPDOWN HEIGHT
     */
    calculate(): RatSelect_Select {
        let clone = this.dropdown;

        // Calculate Height
        let offset = 0;
        let height = ((height) => {
            let temp = clone.cloneNode(true) as HTMLDivElement;
            temp.classList.add("cloned");
            this.select.appendChild(temp);

            if(typeof height === "string" && height.charAt(0) === ":") {
                let len = parseInt(height.slice(1));
                let count = 0;
                let items = [].slice.call(clone.querySelectorAll("li"));
                for(let c = 0, i = 0; i < items.length; i++) {
                    if(items[i].offsetHeight > 0) {
                        count += items[i].offsetHeight;
                        if(c++ >= len) {
                            break;
                        }
                    }
                }
                temp.style.maxHeight = count + "px";
                height = count;
            } else {
                temp.style.maxHeight = height + (isNaN(height)? "": "px");
                height = temp.offsetHeight > height? height: temp.offsetHeight;
            }
            offset = (temp.querySelector(".dropdown-inner") as HTMLDivElement).offsetTop;
            return this.select.removeChild(temp)? height + offset: height + offset;
        })((!this.get("height", 350))? "auto": this.get("height", 350));

        // Calculate Position
        let rect: any = this.select.getBoundingClientRect();
        let free: any = { top: rect.top, bottom: window.innerHeight - (rect.top + rect.height) };
        let side: boolean = this.get("openAbove", null) || !(free.bottom >= height || free.bottom >= free.top);
        height = Math.min(height, (side? free.top: free.bottom) - 15);
        this.select.classList[side? "add": "remove"]("open-top");

        // Set Height
        clone.style.maxHeight = height + "px";
        (clone.querySelector(".dropdown-inner") as HTMLDivElement).style.maxHeight = height - offset + "px";
        return this;
    }

    /*
     |  CORE :: BIND SELECT FIELD
     */
    bind(): RatSelect_Select {
        if(!this.handler) {
            this.handler = this.handle.bind(this);
        }
        if(this.trigger("hook", "bind:before") === false) {
            return this;
        }

        // Bind Events
        document.addEventListener("keydown", this.handler);
        document.addEventListener("click", this.handler);
        if(this.get("sourceBind")) {
            this.source.addEventListener("change", this.handler);
        }

        // Hook & Return
        this.trigger("hook", "bind:after");
        return this;
    }

    /*
     |  CORE :: HANDLE EVENTs
     */
    handle(this: RatSelect_Select, event: Event) {
        if(this.trigger("hook", "handle:before", [event]) === false) {
            return this;
        }
        if(!(event instanceof Event) || this.get("disabled")) {
            return this;
        }
        let target = event.target as HTMLElement;

        // Event :: Keydown
        if(event.type === "keydown") {
            if(document.activeElement !== this.select) {
                return;
            }
            let key = (event as KeyboardEvent).keyCode;
            let sel = ".dropdown-option:not(.disabled):not(.hidden)";

            // Handle if Closed
            if(key === 32 && !this.select.classList.contains("active")) {
                return this.open();
            } else if(!this.select.classList.contains("active")) {
                return;
            }

            // Handle if Opened
            switch(key) {
                case 13:        // [Return] Toggle
                case 32:        // [Space] Toggle
                    let itm = this.dropdown.querySelector(".dropdown-option.hover") as HTMLDivElement;
                    if(itm) {
                        this.options.selected(this.options.get(itm.dataset.value, itm.dataset.group));
                        return !this.get("stayOpen") && !this.get("multiple")? this.close(): 1;
                    }
                    return;
                case 27:        // [ESC] Close
                    return this.close();
                case 38:        // [↑] Move Up
                case 40:        // [↓] Move Down
                    let items = this.dropdown.querySelectorAll(sel) as NodeListOf<HTMLDivElement>;
                    let item = null;
                    let opt = [].slice.call(items).indexOf(this.dropdown.querySelector(".dropdown-option.hover"));

                    // Select Next / Previous
                    if(opt >= 0 && items[opt + (key > 38? +1: -1)]) {
                        item = items[opt + (key > 38? +1: -1)]
                    }

                    // Select First / Last
                    if(!item) {
                        item = items[key > 38? 0: items.length-1];
                    }

                    // Select
                    if(item) {
                        item.classList.add("hover");
                        (items[opt])? items[opt].classList.remove("hover"): 0;

                        let pos = ((el, pos) => {
                            while((el = el.parentElement) !== this.dropdown) {
                                pos.top += el.offsetTop;
                            }
                            return pos;
                        })(item, { top: item.offsetTop, height: item.offsetHeight });
                        this.dropdown.scrollTop = Math.max(0, pos.top - (pos.height * 2));
                    }
                    return;
            }
        }

        // Event :: Click
        if(event.type === "click") {
            if(target === this.label || this.label.contains(target)) {
                return this.toggle();
            }
            if(target.getAttribute("for") === this.source.id) {
                return this.focus();
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
            [].map.call(this.select.querySelectorAll(".dropdown-option.active"), (item) => {
                item.classList.remove("active");
            });
            let changes = [];
            [].map.call(this.source.querySelectorAll("option:checked"), (item) => changes.push([item, { selected: true }]));
            return this.update(changes, false);
        }

        // Hook & Return
        this.trigger("hook", "handle:after", [event]);
        return this;
    }

    /*
     |  API :: TRIGGER EVENT, FILTER OR HOOK
     */
    trigger(type: "hook" | "filter" | "event", name: string, args?: Array <any>): boolean | Array<any> {
        if(type === "event") {
            let data = { bubbles: false, cancelable: true, detail: { args: args, select: this } };
            let event = new CustomEvent(`rat::${name}`, data);
            var cancelled = this.select.dispatchEvent(event) || this.source.dispatchEvent(event);

            if(name === "change") {
                let input = new CustomEvent("input", data);
                let event = new CustomEvent("change", data);
                this.source.dispatchEvent(input);
                this.source.dispatchEvent(event);
            }
        }

        // Handle Hooks & Filters
        let _arg = true;
        let callbacks = this.plugins.methods(name).concat(this.events[name] || []);
        callbacks.map((cb) => {
            if(type === "filter") {
                args = cb.apply(this, args);
            } else if(cb.apply(this, args) === false) {
                _arg = false;
            }
        });

        // Return
        return (type === "hook")? _arg: ((type === "filter")? args: cancelled);
    }

    /*
     |  API :: QUERY DROPDOWN
     */
    query(query?: null | Function, args?: Array<any>): RatSelect_Select {
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
        let items = query.apply(this, args || []);
        for(let item of items) {
            let group = item.parentElement instanceof HTMLOptGroupElement? item.parentElement.label: null;
            [item, group] = this.trigger("filter", "walk", [item, group]) as Array<any>;

            // Skip Empty
            if(this.get("hideEmpty", true) && item.value === "") {
                continue;
            }

            // Skip Group, but keep loop running
            if(group === skip) {
                continue;
            }

            // Create Group
            if(!(head.length > 0 && head[0].dataset.group === (!group? this.options.ungrouped: group))) {
                let arg = item.parentElement instanceof HTMLOptGroupElement? item.parentElement: null;
                if(!arg) {
                    arg = document.createElement("OPTGROUP");
                }

                if((el = this.render(arg)) === null) {
                    skip = group;
                    continue; // Skip Group
                } else if(el === false) {
                    break; // Break Loop
                }
                head.unshift(el);
            }

            // Create Item
            if((el = this.render(item)) === null) {
                continue;  // Skip Item
            } else if(el === false) {
                break;  // Break Loop
            }
            head[0].appendChild(el);
        }

        // Replace
        let root = this.dropdown.querySelector(".dropdown-inner");
        let clone = root.cloneNode();
        head.reverse().map((item) => clone.appendChild(item));
        this.dropdown.replaceChild(clone, root);
        this.dropdown.querySelector(".dropdown-inner").className = "dropdown-inner";

        // Experimental Scroll Width
        if(this.get("titleOverflow") === "scroll") {
            [].map.call(this.dropdown.querySelectorAll(".dropdown-option"), (el) => {
                let width = el.clientWidth-el.querySelector(".option-title").offsetLeft;
                let scroll = el.querySelector(".option-title").scrollWidth;
                if(scroll > width) {
                    el.style.textIndent = width-scroll + "px";
                    el.querySelector(".option-title").style.marginLeft = scroll-width + "px";
                }
            });
        }

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
        let tag = element.tagName.toLowerCase();
        let output = document.createElement(tag === "option"? "LI": "OL");
        let classes = (item) => {
            let selected = (this.get("multiple") && item.hasAttribute("selected")) || item.selected;
            return ((selected? " selected": "") + (item.disabled? " disabled": "") + (item.hidden? " hidden": "")).trim();
        };

        // Render Item
        if(tag === "option") {
            output.className = "dropdown-option " + classes(element);
            output.innerHTML = `<span class="option-title">${element.innerHTML}</span>`;
            output.dataset.group = (element.parentElement as HTMLOptGroupElement)?.label || this.options.ungrouped;
            output.dataset.value = (element as HTMLOptionElement).value;
            output.dataset.action = "toggle";
            if(element.dataset.description) {
                output.innerHTML += `<span clasS="option-description">${element.dataset.description}</span>`
            }
        } else {
            let label = element.label || this.get("ungroupedLabel", null) || "";
            output.className = `dropdown-optgroup${this.get("stickyGroups")? " optgroup-sticky": ""}`;
            output.innerHTML = `<li class="optgroup-title">${label}</li>`;
            output.dataset.group = element.label || this.options.ungrouped;

            if(this.get("multiple") && this.get("multiSelectGroup", 1)) {
                for(let item of ['buttonAll', 'buttonNone']) {
                    let btn = document.createElement("BUTTON");
                    btn.dataset.action = (item === "buttonAll"? "select": "unselect");
                    btn.dataset.group = output.dataset.group;
                    btn.innerHTML = this.locale._(item);
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
    update(changes: Array<HTMLOptionElement | RatSelect_OptionStates>, skipEvents?: boolean): RatSelect_Select {
        if(changes.length === 0) {
            return this;
        }

        // Hook
        if(this.trigger("hook", "update:before", [changes, skipEvents]) !== true) {
            return this;
        }
        
        // Events
        if(typeof skipEvents === "boolean" && skipEvents) {
            this.trigger("event", "change", [changes]);
            if(this.source.multiple && this.get("multiLimit") > 0) {
                if(this.options.count(null, ["selected"]) >= this.get("multiLimit")) {
                    this.trigger("event", "limit", [changes]);
                }
            }
        }

        // Update Items
        [].map.call(changes, (dataset) => {
            let [option, change] = dataset;
            let value = option.value.replace(/('|\\)/g, "\\$1");
            let group = option.parentElement.label? option.parentElement.label: this.options.ungrouped;
            let item = this.dropdown.querySelector(`li[data-value="${value}"][data-group="${group}"]`);
            if(item) {
                for(let key in change) {
                    item.classList[change[key]? "add": "remove"](key);
                }
            }
        });

        // Hook & Update
        this.trigger("hook", "update:after", [changes, skipEvents]);
        return this.updateCSV().updateLabel();
    }

    /*
     |  API :: UPDATE CSV
     */
    updateCSV(): RatSelect_Select {
        this.csv.value = this.trigger("filter", "update#csv", [this.value("csv")])[0];
        return this;
    }

    /*
     |  API :: UPDATE LABEL
     */
    updateLabel(label?: string): RatSelect_Select {
        let value = this.value("array") as string[];
        let limit = this.get("multiLimit");

        // Set Placeholder label
        if(!label && typeof this.get("placeholder") === "function") {
            label = this.get("placeholder").call(this);
        }
        if(!label) {
            if(this.source.disabled || !this.options.count()) {
                label = this.source.disabled? "disabled": "empty";
            } else if(this.source.multiple && value.length > 0) {
                label = limit === value.length? "multipleLimit": "multipleCount";
            } else if(!this.source.multiple && value.length === 1) {
                label = value[0];
            } else {
                label = this.source.multiple? "multiple": "single";
            }
        }

        // Set Placeholder counter
        let counter = this.source.multiple? this.get("placeholderCount", false): false;
        if(counter) {
            let selected = this.options.count(null, ["selected"]);
            let count = this.options.count(null, ["!disabled", "!hidden"]);
            let max = limit < 0? count: limit; 

            counter = counter === true? "count-up": counter;
            switch(counter) {
                case "count-up": counter = selected; break;
                case "count-down": counter = limit-selected; break;
                case "limit": counter = max; break;
                case "both": counter = `${selected}/${max}`; break;
            }
            if(typeof counter === "function") {
                counter = counter.call(this);
            }
        }

        // Set Placeholder Count
        let [pl, cl] = this.trigger("filter", "update#placeholder", [this.locale._(label, [value.length]), counter]) as Array<any>;
        let placeholder = this.label.querySelector(".label-placeholder");
        if(pl && placeholder) {
            placeholder.innerHTML = `${cl? `<span class="label-count">${cl}</span>`: ``}${pl}`;
        }
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
        if(this.trigger("hook", "reload:before", [hard]) !== true) {
            return this;
        }
        (hard)? this.destroy().init(): this.query();
        this.trigger("hook", "reload:after", [hard]);
        return this;
    }

    /*
     |  API :: DESTROY SELECT INSTANCE
     */
    destroy(keep?: boolean): RatSelect_Select {
        if(this.trigger("hook", "destroy:before", [keep]) !== true) {
            return this;
        }

        // Handle Options
        if(!keep) {
            [].map.call(this.source.querySelectorAll("optgroup[data-select='add']"), (item) => {
                item.parentElement.removeChild(item);
            });
            [].map.call(this.source.querySelectorAll("option[data-select='add']"), (item) => {
                item.parentElement.removeChild(item);
            });
        }

        // Handle Visibility
        if(this.get("sourceHide")) {
            this.source.style.removeProperty("display");
            this.source.style.removeProperty("visibility");
        }

        // Good Bye :(
        if(this.select.parentElement) {
            this.select.parentElement.removeChild(this.select);
        }
        this.source.removeAttribute("data-rat-select");

        // Return
        this.trigger("hook", "destroy:after", [keep]);
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
        if(key.indexOf(".") > 0) {
            let [name, config] = key.split(".");
            let plugin = this.config.plugins[name];
            return (plugin && plugin[config])? plugin[config]: def;
        }
        return (key in this.config)? this.config[key]: def;
    }

    /*
     |  PUBLIC :: SET CONFIG
     */
    set(key: string, value: any, reload?: boolean): RatSelect_Select {
        if(key.indexOf(".") > 0) {
            let [name, config] = key.split(".");
            let plugin = this.config.plugins[name];
            if(plugin) {
                plugin[config] = value;
            }
            return (reload)? this.reload(): this;
        }
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
        this.trigger("event", "enable", [reload]);
        this.config.disabled = this.source.disabled = false;
        this.select.classList.remove("disabled");
        return (reload)? this.reload(): this;
    }

    /*
     |  PUBLIC :: DISABLE SELECT INSTANCE
     */
    disable(reload: boolean): RatSelect_Select {
        this.trigger("event", "disable", [reload]);
        this.config.disabled = this.source.disabled = true;
        this.select.classList.add("disabled");
        return (reload)? this.reload(): this;
    }

    /*
     |  PUBLIC :: FOCUS SELECT FIELD
     */
    focus(): RatSelect_Select {
        this.select.focus();
        return this;
    }

    /*
     |  PUBLIC :: SET OR REMOVE STATE
     */
    state(state: string, status?: null | boolean): boolean | RatSelect_Select {
        if(typeof status === "undefined"){
            return this.select.classList.contains(`state-${state}`);
        }
        status = status === null? !this.select.classList.contains(`state-${state}`): status;
        this.select.classList[status? "add": "remove"](`state-${state}`);
        return this;
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
