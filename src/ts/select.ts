/// <reference path="declare.ts" />
/// <reference path="helpers.ts" />
/// <reference path="strings.ts" />
/// <reference path="plugins.ts" />
/// <reference path="options.ts" />

/*
 |  SELECT :: CLASS
 */
class Select {
    static version = "0.6.0";
    static status = "beta";

    /*
     |  HELPER FUNCTIONS
     */
    static __ = tail;
    
    /*
     |  INDEX COUNTER
     */
    static count = 0;
    
    /*
     |  INSTANCE STORAGE
     */
    static inst = { };
    
    /*
     |  CLASS | FUNCTION ASSIGNMENT
     */
    static strings = Strings;
    static options = Options;
    static plugins = Plugins;

    /*
     |  CONSTRUCTOR
     |  @since  0.6.0 [0.6.0]
     */
    constructor(el: any, conf?: Object, options?: any) {
        el = (typeof el === "string")? d.querySelectorAll(el): el;
        if(!(el instanceof Element)){
            var temp = [].map.call(el, item => new Select(item, conf, options) ); 
            return temp.filter(item => "id" in item);
        }
    
        // Check Element
        if(!(el instanceof HTMLSelectElement && this instanceof Select)) {
            return (el instanceof HTMLSelectElement)? new Select(el, conf, options): void 0;
        }
        if(Select.inst[el.getAttribute("data-tail-select")]) {
            return Select.inst[el.getAttribute("data-tail-select")];
        }
    
        // Get States
        conf = tail.clone((conf instanceof Object)? conf: { }, {
            multiple: el.multiple,
            disabled: el.disabled,
            required: el.required,
            placeholder: el.getAttribute("data-placeholder") || (<any>conf || { }).placeholder
        });
    
        // Add Instance
        this.id = ++Select.count;
        Select.inst["tail-" + this.id] = this;
    
        // Init Instance
        this.e = el;
        this.con = tail.clone({ }, conf);
        this.options = options || Options;
        this.callbacks = { };
        return this.init();
    }

    /*
     |  HELPER :: TRANSLATE STRING
     |  @since  0.5.8 [0.6.0]
     |
     |  @param  string  The string ID to translate.
     |  @param  object  A { key: value } paired object of strings to replace.
     |  
     |  @return string  The translated and replaced string on success, the default string otherwise.
     */
    _e(string: string, replace?: object): string {
        string = (string in this.__)? this.__[string]: string;
        string = (typeof string === "function")? (<Function>string).call(this, replace): string;

        for(var key in (replace || { })) {
            string = string.replace(key, replace[key]);
        }
        return string;
    }
    
    /*
     |  HELPER :: GET CLASS NAMES
     |  @since  0.6.0 [0.6.0]
     |  
     |  @param  object  The respective <option> element.
     |  @param  string  Optional additional class names.
     |
     |  @return string  All available class names for the list item depending on the <option> element.
     */
    _cls(item: HTMLOptionElement, string: string): string {
        let selected = (this.get("multiple") && item.hasAttribute("selected")) || item.selected;
        return (string + (selected? " selected": "")
                       + (item.disabled? " disabled": "")
                       + (item.hidden? " hidden": "")).trim();
    }
    
    /*
     |  INTERNAL :: INIT SELECT FIELD
     |  @note   This method is intended for internal use only!
     |  @since  0.3.0 [0.6.0]
     |
     |  @return this    The tail.select instance.
     */
    init(): Select {
        this.__ = tail.clone(Select.strings.en, Select.strings[this.get("locale", -1)] || {});
        this.plugins = new Plugins(this.get("plugins", { }), this);
        if(this.options instanceof Options) {
            this.options = new this.options.constructor(this);
        } else {
            this.options = new this.options(this);
        }
        this._spacing = 1;
        this._last_query = ["walker", [this.get("sortGroups"), this.get("sortItems")]];

        // Prepare RTL
        if(this.get("rtl") === null) {
            this.set("rtl", ['ar','fa','he','mdr','sam','syr'].indexOf(this.get("locale", "en")) >= 0);
        }

        // Prepare Theme
        if(!this.get("theme")) {
            let test = tail.create("SPAN", "tail-select-theme-name");
            d.body.appendChild(test);
            this.set("theme", w.getComputedStyle(test, ":after").content.replace(/"/g, ""))
            d.body.removeChild(test);
        }
    
        // Hook init:before
        if(this.trigger("hook", "init:before") !== true) {
            return (this.get("startOpen") && !this.get("disabled"))? this.open(): this;
        }
    
        // Build HTML
        this.build(this);
        this.e.setAttribute("data-tail-select", `tail-${this.id}`);
    
        // Prepare Stuff
        if(this.get("items") instanceof Object) {
            this.options.add(this.get("items", { }), null, false);
        }
        for(var key in this.get("on", { })) {
            this.on(key, this.get("on", { })[key]);
        }
        if(this.listen === void 0) {
            this.listen = (function(ev) { this.bind.call(this, ev); }).bind(this);
        }
    
        // Prepare DOM
        if(this.e.nextElementSibling) {
            this.e.parentElement.insertBefore(this._select, this.e.nextElementSibling);
        } else {
            this.e.parentElement.appendChild(this._select);
        }
        
        // Prepare Visibility
        if(this.get("sourceHide", true)) {
            if(this.e.style.display === "none") {
                this._select.style.display = "none";
            } else if(this.e.style.visibility === "hidden") {
                this._select.style.visibility = "hidden";
            } else {
                this.e.style.display = "none";
                this.e.setAttribute("data-tail-hidden", "display");
            }
        }

        // Hook & Open
        this.trigger("hook", "init:after");
        this.bind(this).query("walker", [this.get("sortGroups"), this.get("sortItems")]);
        return (this.get("startOpen") && !this.get("disabled"))? this.open(): this;
    }
    
    /*
     |  INTERNAL :: BUILD SELECT FIELD
     |  @note   This method is intended for internal use only!
     |  @since  0.6.0 [0.6.0]
     |
     |  @return this    The tail.select instance.
     */
    build(self: Select): Select {
        if(this.trigger("hook", "build:before") !== true) {
            return this;
        }
        let cls = this.get("classNames") === true? this.e.className: this.get("classNames");
    
        // Element :: Select
        this._select = tail.create("DIV", (function(cls) {
            this.get("rtl")? cls.unshift("rtl"): null;
            this.get("hideSelected")? cls.unshift("hide-selected"): null;
            this.get("hideDisabled")? cls.unshift("hide-disabled"): null;
            this.get("hideHidden", !0)? cls.unshift("hide-hidden"): null;
            this.get("disabled")? cls.unshift("disabled"): null;
            this.get("multiple")? cls.unshift("multiple"): null;
            this.get("deselect")? cls.unshift("deselectable"): null;
            cls.unshift(`tail-select theme-${this.get("theme").replace('-', ' scheme-').replace('.', ' ')}`);
            return cls;
        }).call(this, [].concat((!cls)? []: cls.split? cls.split(" "): cls)));
        this._select.setAttribute("tabindex", this.e.getAttribute("tabindex") || "0");
        if(this.get("width", 250)) {
            this._select.style.width = this.get("width", 250) + (isNaN(this.get("width", 250))? "": "px");
        }
    
        // Element :: Label & Dropdown
        this._label = tail.create("DIV", "select-label");
        this._dropdown = tail.create("DIV", `select-dropdown title-${this.get("titleOverflow", "break")}`);
    
        // Element :: Search
        this._search = tail.create("DIV", "dropdown-search");
        this._search.innerHTML = '<input type="text" class="search-input" />';
        this._search.children[0].setAttribute("placeholder", this._e("search"));
    
        // Element :: CSV
        this._csv = tail.create("INPUT", "select-search");
        this._csv.type = "hidden";
        this._csv.name = (function(name){
            if(name === true && !this.e.hasAttribute("data-name") && (name = this.e.name)) {
                this.e.removeAttribute("name");
            }
            return name.split? name: this.e.getAttribute("data-name");
        }).call(this, this.get("csvOutput", !1));
    
        // Build Up and Return
        this._select.appendChild(this._label);
        this._select.appendChild(this._dropdown);
        this.get("search")? this._dropdown.appendChild(this._search): null;
        this.get("csvOutput")? this._select.appendChild(this._csv): null;
        this.trigger("hook", "build:after");
        return this;
    }
    
    /*
     |  INTERNAL :: BIND SELECT FIELD
     |  @note   This method is intended for internal use only!
     |  @since  0.3.0 [0.6.0]
     |
     |  @return this    The tail.select instance.
     */
    bind(arg: any): Select | any {
        if(this.trigger("hook", "bind:before", [arg]) !== true) {
            return this;
        }

        // De/Attach Listeners
        if(arg instanceof Select) {
            d.addEventListener("keydown", this.listen);
            d.addEventListener("click", this.listen);
            if(this.get("search")) {
                this._search.children[0].addEventListener("input", this.listen);
            }
            if(this.get("sourceBind")){
                this.e.addEventListener("change", this.listen);
            }
        } else if(arg === null) {
            d.removeEventListener("keydown", this.listen);
            d.removeEventListener("click", this.listen);
            this._search.children[0].addEventListener("input", this.listen);
            this.e.removeEventListener("change", this.listen);
        }

        // Handle Listeners
        if(!(arg instanceof Event) || this.get("disabled")) {
            return this;
        }
        let stop = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            return true;
        };
        let event: any = arg;
        let target: HTMLElement = event.target;

        // Event :: Label
        if(event.type === "click" && target.getAttribute("for") === this.e.id) {
            this._select.focus();
            return stop(event);
        }

        // Event :: Input
        if(event.type === "input" && target === this._search.children[0]) {
            let value = (<HTMLInputElement> target).value;
            if(value.length >= Math.max(this.get("searchMinLength", 3), 1)) {
                return this.query("finder", [value, this.get("searchConfig", ["text", "value"]), this.get("sortSearch")]);
            } else if(this._last_query[0] !== this.options.walker) {
                return this.query("walker", [this.get("sortGroups"), this.get("sortItems")]);
            }
        }

        // Event :: Keydown
        if(event.type === "keydown") {
            let sel = ".dropdown-option:not(.disabled):not(.hidden)";
            let key = event.keyCode || event.which;
            let opt = this._dropdown.querySelector(".dropdown-option.hover");
    
            switch(key + !!this._select.classList.contains("active")) {
                case 32:    // Space [Open]
                    if(this._select === d.activeElement) {
                        return stop(event)? this.open(): !1;
                    }
                default:
                    if(!this._select.classList.contains("active")) {
                        return;
                    }
            }

            switch(key) {
                case 13:    // Enter [Toggle]
                case 32 + d.activeElement.tagName === "INPUT":    // Space [Toggle]
                    if(stop(event) && opt) {
                        let item = [opt.getAttribute("data-value"), opt.getAttribute("data-group")];
                        this.options.toggle(item, "selected");
                    }
                    return (opt && !this.get("multiple")) && !this.get("stayOpen")? this.close(): !1;
                case 27:    // Escape [Close]
                    return stop(event)? this.close(): !1;
                case 38:    // ArrowUp [Move]
                case 40:    // ArrowDown [Move]
                    let inner = this._dropdown.querySelector(".dropdown-inner");
                    let items = [].map.call(this._dropdown.querySelectorAll(sel), (i) => i);
                    
                    // Select Next | Previous
                    let itm = null;
                    if(opt && items[items.indexOf(opt) + (key === 40? +1: -1)]) {
                        itm = items[items.indexOf(opt) + (key === 40? +1: -1)];
                    }
                    if(!itm && key == 40){
                        itm = this._dropdown.querySelector(sel);
                    } else if(!itm && key == 38){
                        itm = items[items.length - 1];
                    }
    
                    // Select and Move
                    if(itm) {
                        (itm)? itm.classList.add("hover"): null;
                        (opt)? opt.classList.remove("hover"): null; 
    
                        let pos = (function(el, pos){
                            while((el = el.parentElement) != inner){
                                pos.top += el.offsetTop;
                            }
                            return pos;
                        })(itm, { top: itm.offsetTop, height: itm.offsetHeight });
                        inner.scrollTop = Math.max(0, pos.top - (pos.height * 2));
                    }
                    return stop(event);
            }
        }

        // Event :: Click
        if(event.type === "click") {
            if(this._label.contains(target)) {
                return this.toggle();
            }

            // Close Dropdown
            if(!this._select.contains(target) && this.get("stayOpen") !== true) {
                return this.close();
            }

            // Select Item
            if(this._dropdown.contains(target)) {
                let value, group, action;

                do {
                    if(!target || <any>target == d) {
                        return false;
                    }
                    value = target.getAttribute("data-value");
                    group = target.getAttribute("data-group");
                    action = target.getAttribute("data-action");
                } while(!(action && (value || group)) && (target = target.parentElement) !== null);

                // Handle
                if(!!(action && (value || group))) {
                    let args = (action === "toggle")? [[value, group], "selected"]: [[value, group]]
                    this.options[action].apply(this.options, args);
                    if(!this.get("stayOpen")){
                        if(this.options.count(null, true) >= (!this.get("multiple")? 1: this.get("multiLimit"))) {
                            return this.close();
                        }
                    }
                }
            }
        }

        // Event Source
        if(event.type === "change" && event.detail === void 0) {
            return stop(event)? this.options.reload(): false;
        }
        return this.trigger("hook", "bind:after", [arg])? true: true;
    }
    
    /*
     |  INTERNAL :: CALCULATE DROPDOWN
     |  @note   This method is intended for internal use only!
     |  @since  0.6.0 [0.6.0]
     |
     |  @return this    The tail.select instance.
     */
    calculate(): Select {
        let clone = <HTMLElement>this._dropdown;
        let inner = <HTMLElement>this._dropdown.querySelector(".dropdown-inner");
        let search = this._dropdown.contains(this._search)? this._search.clientHeight: 0;
        if(!inner) {
            return this; // No inner? No height to calculcate!
        }

        // Set Height (Required vs. Maximum)
        let height = (function(height) {
            let temp = <HTMLElement>clone.cloneNode(true);
            temp.classList.add("cloned");
            this._select.appendChild(temp);

            if(typeof height === "string" && height.charAt(0) === ":") {
                let off = (<HTMLElement>inner.querySelector(".dropdown-option")).offsetHeight;
                let pad = parseInt(w.getComputedStyle(inner.querySelector("li:first-child")).marginTop);
                temp.style.setProperty("max-height", (off * parseInt(height.slice(1)) + pad) + "px");
            } else {
                temp.style.setProperty("max-height", height + (isNaN(height)? "": "px"));
            }

            height = (temp.offsetHeight > height)? height: temp.offsetHeight;
            return this._select.removeChild(temp)? height: height;
        }).call(this, (!this.get("height", 350))? "auto": this.get("height", 350));

        // Add Searchbar on ":<number>" Syntax only
        if(typeof this.get("height") === "string" && this.get("height").charAt(0) === ":") {
            height = height + search;
        }

        // Set Side
        let rect: any = this._select.getBoundingClientRect();
        let free: any = { top: rect.x || rect.top, bottom: w.innerHeight - (rect.top + rect.height) };
        let side: boolean = this.get("openAbove", null) || !(free.bottom >= height || free.bottom >= free.top);
        height = Math.min(height, (side? free.top: free.bottom) - 15);
        this._select.classList[(side? "add": "remove")]("open-top");

        // Get Optgroup Spacing
        if(this._dropdown.querySelector("li.optgroup-sticky")) {
            this._spacing = (<HTMLElement>this._dropdown.querySelector("li.optgroup-sticky")).offsetHeight;
        }

        // Set Height
        clone.style.maxHeight = height + "px";
        inner.style.maxHeight = height - search + "px";
        return this;
    }
    
    /*
     |  API :: TRIGGER AN EVENT, FILTER OR HOOK
     |  @since  0.4.0 [0.6.0]
     |
     |  @param  string  The callback type to trigger: 'event', 'filter' or 'hook.
     |  @param  name    The callback name of the event, filter or hook.
     |  @param  array   The arguments, which should be passed to the callback functions.
     |
     |  @return multi   
     */
    trigger(type: string, name: string, args: Array<any> = []): any {
        if(type === "event") {
            let event = { bubbles: false, cancelable: true, detail: { args: args, self: this } };
            if(name === "change") {
                tail.trigger(this.e, "input", event);
                tail.trigger(this.e, "change", event);
            }
            tail.trigger(this._select, `tail::${name}`, event);
        }

        // Handle Callbacks
        let _arg = true;
        (this.plugins.callbacks(name).concat(this.callbacks[name] || [])).forEach((handle) => {
            if(type === "filter") {
                args = handle.apply(this, args);
            } else if(handle.apply(this, args) === false) {
                _arg = false;
            }
        });

        // Return 
        return (type === "filter")? args: _arg;
    }
    
    /*
     |  API :: QUERY DROPDOWN LIST
     |  @since  0.5.0 [0.6.0]
     |
     |  @param  multi   The query callback method. Pass either a <string>, which points to the 
     |                  method name within the Options class, or a callable <function>.
     |  @param  args    The additional arguments, which gets passed to the query method.
     |                  : Walker Arguments
     |                          [ <sortGroups>, <sortItems> ]
     |                  : Finder Arguments
     |                          [ <searchValue>, <searchConfig>, <sortSearch> ]
     |
     |  @return this    The tail.select instance.
     */
    query(method: any, args?: Array<any>): Select {
        if(this.trigger("hook", "query:before", [method, args]) !== true) {
            return this;
        }

        // Parameters
        [method, args] = this.trigger("filter", "query", [method, args || [ ]]);
        if(typeof method === "string") {
            method = <Function>this.options[(method in this.options)? method: "walker"];
        }

        // Item Builder
        let head = [];
        let elem = null;
        let skip = null;
        let walk = (function(item: HTMLOptionElement): boolean {
            let group = (item.parentElement instanceof HTMLOptGroupElement)? item.parentElement.label || "#": "#";
            [item, group] = this.trigger("filter", "query#walk", [item, group]);

            if(skip === group) {
                return true;        // Skip Group, but keep the Loop running
            }

            // Create Group
            if(!(head.length > 0 && head[0].getAttribute("data-group") === group)) {
                let pass = item.parentElement instanceof HTMLOptGroupElement? item.parentElement: null;
                if((elem = this.render("group", pass, [method, args])) === null) {
                    skip = group;
                    return true;    // Skip Group, but keep the Loop running
                } else if (elem === false) {
                    return false;   // Break Loop
                }
                elem.setAttribute("data-group", group);
                head.unshift(elem);
            }

            // Create Item
            if((elem = this.render("item", item, [method, args])) === null) {
                return true;        // Skip Item, but keep the Loop running
            } else if(elem === false) {
                return false;       // Break Loop
            }
            elem.setAttribute("data-group", group);
            elem.setAttribute("data-value", item.value || item.innerText);
            elem.setAttribute("data-action", "toggle");
            head[0].appendChild(elem);

            // Experimental Scroll Function
            if(this.get("titleOverflow") === "scroll") {
                (function(elem, self) {
                    setTimeout(function() {
                        let style = w.getComputedStyle(elem);
                        let inner = elem.clientWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight) - 17;
                        let title = elem.querySelector(".option-title");

                        if(title.scrollWidth > inner) {
                            let number = inner - title.scrollWidth - 15;
                            title.style.paddingLeft = Math.abs(number) + "px";
                            elem.style.textIndent = number + "px";
                        }
                    }, 150);
                }(elem, this))
            }
            return true;
        }).bind(this);

        // Item Query
        ///@ts-target:ES5
        let item: any;
        while((item = method.apply(this.options, args)) !== false) {
            if(!walk(item)) {
                method.call("reset", this.options); 
                break;
            }
        }
        ///@ts-target:ES5
        ///@ts-target:ES6
        for(let item of method.apply(this.options, args)) {
            if(!walk(item)) {
                break;
            }
        }
        ///@ts-target:ES6

        // Visible Selector
        let visible = "li.dropdown-option[data-value]"
                    + (this.get("hideHidden",1)? ":not(.hidden)": "")
                    + (this.get("hideDisabled")? ":not(.disabled)": "")
                    + (this.get("hideSelected")? ":not(.selected)": "");

        // Prepare Root
        let root = tail.create("DIV", "dropdown-inner");
        root.addEventListener("scroll", (event) => {
            let groups = event.target.querySelectorAll("ul li.optgroup-sticky");
            for(let i = 0; i < groups.length; i++) {
                if(groups[i].offsetTop > this._spacing) {
                    groups[i].classList.add("moving");
                } else if(groups[i].classList.contains("moving")) {
                    groups[i].classList.remove("moving");
                }
            }
        });
        for(let i = head.length - 1; i >= 0; i--) {
            if(head[i].querySelectorAll(visible).length > 0) {
                root.appendChild(head[i]);
            }
        }
    
        // Empty Query
        if(root.innerText === "") {
            if((elem = this.render("empty", null, [method, args])) instanceof Element) {
                root.appendChild(elem);
            }
        }
        this.trigger("event", (root.innerText === ""? "no": "") + "results", [root, method, args]);

        // Append MultiSelect
        if(root.innerText !== "" && this.get("multiple") && this.get("multiSelectAll")) {
            let actions = tail.create("SPAN", "dropdown-action");
            for(let key in { "select-all": '', "select-none": '' }) {
                let btn = tail.create("BUTTON", key);
                btn.setAttribute("data-action", key === 'select-all'? 'select': 'unselect');
                btn.innerHTML = this._e(key === 'select-all'? 'buttonAll': 'buttonNone');
                actions.appendChild(btn);
            }
            root.insertBefore(actions, root.children[0]);
        }
    
        // Append Dropdown
        let inner = this._dropdown.querySelector(".dropdown-inner");
        this._dropdown[(inner? "replace": "append") + "Child"]((this.trigger("filter", "dropdown", [root])[0]), inner);
        if(this._select.classList.contains("active")) {
            this.calculate();
        }
    
        // Store Last Query & Return
        this._last_query = [method, args];
        this.trigger("hook", "query:after", [method, args]);
        return this.updateLabel().updateCSV();
    }
    
    /*
     |  API :: RENDER DROPDOWN LIST
     |  @since  0.6.0 [0.6.0]
     |
     |  @param  string  The type, which should be rendered. ("group", "item" or "empty")
     |  @param  any     Any data, which is required for the render type.
     |  @param  array   The method and arguments how the .query() method was called.
     |
     |  @return multi   The respective rendered element, false to break or null to skip.
     */
    render(type: string, data: any, query: Array<any> | null): any {
        let content = "";

        // Default Methods
        let types = this.trigger("filter", "render", [{
            item: function(element, query) {
                let li = tail.create("LI", this._cls(element, "dropdown-option"));

                // Inner Text
                if(query[0] === this.options.finder && this.get("searchMarked", 1)) {
                    let regexp = new RegExp(`(${this.options.applyLinguisticRules(query[1][0])})`, "i");
                    li.innerHTML = element.innerHTML.replace(regexp, "<mark>$1</mark>")
                } else {
                    li.innerHTML = element.innerHTML;
                }
                li.innerHTML = `<span class="option-title">${li.innerHTML}</span>`;

                // Inner Description
                if(this.get("descriptions", 1) && element.hasAttribute("data-description")){
                    li.innerHTML += `<span class="option-description">${element.getAttribute("data-description")}</span>`;
                }
                return li;
            },

            group: function(element, query) {
                let ul = tail.create("UL", "dropdown-optgroup");
                if(!element && !this.get("grouplessName")) {
                    return ul;
                }
                let group = element? element.label: "#";
                let label = element? element.label: this.get("grouplessName");

                // Group Header
                ul.innerHTML = `<li class="optgroup-title${this.get("stickyGroups")? " optgroup-sticky": ""}"><b>${label}</b></li>`;
                if(this.get("multiple") && this.get("multiSelectGroup", 1)) {
                    for(let key in { "select-none": '', "select-all": '' }) {
                        let btn = tail.create("BUTTON", key);
                        btn.setAttribute("data-group", group);
                        btn.setAttribute("data-action", key === 'select-all'? 'select': 'unselect');
                        btn.innerHTML = this._e(key === 'select-all'? 'buttonAll': 'buttonNone');
                        ul.children[0].appendChild(btn);
                    }
                }
                return ul;
            },

            empty: function(element, query) {
                let li = tail.create("SPAN", "dropdown-empty");
                li.innerHTML = this._e("empty");
                return li;
            }
        }])[0];

        // Render & Return
        return this.trigger("filter", `render#${type}`, [types[type].apply(this, [data, query]), data, query])[0];
    }
    
    /*
     |  API :: UPDATE OPTIONs
     |  @since  0.5.0 [0.6.0]
     |
     |  @param  multi   An array containing [item, changes] arrays for every item, which state has
     |                  been changed. If nothing has been changes, the Array is just empty.
     |  @param  bool    TRUE to trigger all the events, FALSE to do it not.
     |  @param  bool    TRUE if the `.handle()` method has been forced, FALSE if not.
     |
     |  @return this    The tail.select instance.
     */
    update(items: any, trigger: boolean = true, force?: boolean): Select {
        if(items.length === 0) {
            return this;
        }
        [items, trigger] = this.trigger("filter", "update", [items, trigger]);

        // Hook
        if(this.trigger("hook", "update:before", [items, trigger, force]) !== true) {
            return this;
        }

        // Events
        if(trigger) {
            this.trigger("event", "change", [items, force]);
            if(this.e.querySelectorAll("option:checked") >= this.get("multiLimit", Infinity)) {
                this.trigger("event", "limit", [items, force]);
            }
        }

        // Loop Items
        for(let opt, i = 0; i < items.length; i++) {
            let value = (items[i][0]).value.replace(/('|\\)/g, "\\$1");
            let group = (items[i][0].parentElement)? items[i][0].parentElement.label || "#": "#";

            let selector = `[data-value='${value}'][data-group='${group}']`;
            if((opt = this._dropdown.querySelector(selector)) !== null) {
                let names = opt.className.replace(/\b(selected|disabled|hidden)\b/gi, "").trim();
                opt.className = this._cls(items[i][0], names.replace(/[ ]+/g, " "));
            }
        }
        this.updateCSV();
        this.updateLabel();
    
        // Return
        this.trigger("hook", "update:after", [items, trigger, force]);
        return this;
    }
    
    /*
     |  API :: UPDATE CSVs
     |  @since  0.5.0 [0.6.0]
     | 
     |  @return this    The tail.select instance.
     */
    updateCSV(): Select {
        if(this.get("csvOutput")){
            this._csv.value = this.trigger("filter", "update#csv", [this.value("csv")])[0];
        }
        return this;
    }
    
    /*
     |  API :: UPDATE LABEL
     |  @since  0.5.0 [0.6.0]
     | 
     |  @return this    The tail.select instance.
     */
    updateLabel(label?: string | undefined): Select {
        let value: Array<any> = this.value("array");
        let limit: number | Infinity = this.get("multiLimit", Infinity);
        let string: any = "";
        let replace: Object = {
            '[0]': value.length,
            '[1]': (limit === Infinity)? "&infin;": limit,
            '[2]': (limit === Infinity)? this.options.count(null, !1, !1, !1): limit - value.length
        };
    
        // Set Label
        if(label === void 0) {
            switch(true) {
                case this.get("disabled"): 
                    label = "disabled"; break;
                case this.options.count() === 0:
                    label = "empty" + (this._last_query[0] === "finder"? "Search": ""); break;
                case this.get("multiple") && limit === Infinity:
                    label = (value.length === 0)? "multiple": "multipleList"; break;
                case this.get("multiple") && limit !== Infinity:
                    label = (value.length === limit)? "multipleLimit": "multipleCount"; break;
                case !this.get("multiple"):
                    label = (this.value("nodes")[0] && this.value("nodes")[0].innerHTML) || "single"; break;
                default:
                    label = (this.get("multiple"))? "multiple": "single"; break;
            }
            if(['multiple', 'multipleCount', 'multipleList', 'single'].indexOf(label) >= 0) {
                label = (typeof this.get("placeholder") === "string")? this.get("placeholder"): label;
            }
        }

        // Set Label Count
        let count = this.get("multiple")? this.get("placeholderCount"): null;
        if(count !== null) {
            switch(true) {
                case count === "count-up": count = '[0]'; break; 
                case count === "count-down": count = '[2]'; break; 
                case count === "limit": count = '[1]'; break; 
                case count === "both": count = '[0]/[1]'; break; 
                case typeof count === "function": count = count.call(this, label, replace); break;
                default: count = null; break;
            }
        }

        // Filter
        if(typeof this.get("placeholder") === "function") {
            [label, count, replace] = this.get("placeholder").call(this, label, count, replace);
        }

        // Replace Data
        [string, label, count, replace] = this.trigger("filter", "update#label", [string, label, count, replace]);
        if(string === "") {
            string = (count? `<span class="label-count">${this._e(count, replace)}</span>`: ``)
                   + (label? `<span class="label-inner">${this._e(label, replace)}</span>`: ``);
        }

        // Set & Return
        if(string instanceof HTMLElement && string.classList.contains("select-label")) {
            this._select.replaceChild(string, this._label);
            this._label = string;
        } else {
            this._label.innerHTML = string.innerHTML? string.innerHTML: string;
        }
        return this;
    }
    
    /*
     |  PUBLIC :: OPEN DROPDOWN
     |  @since  0.3.0 [0.6.0]
     |
     |  @return this    The tail.select instance.
     */
    open(): Select {
        if(this._select.classList.contains("active")) {
            return this;
        }
        this.calculate();
        this.trigger("event", "open", []);

        // Open
        this._select.classList.add("active");
        if(this.get("search") && this.get("searchFocus", !0)) {
            this._search.querySelector("input").focus();
        }
        return this;
    }
    
    /*
     |  PUBLIC :: CLOSE DROPDOWN
     |  @since  0.3.0 [0.6.0]
     |
     |  @return this    The tail.select instance.
     */
    close(): Select {
        if(!this._select.classList.contains("active")) {
            return this;
        }
        this.trigger("event", "close", []);

        // Close
        this._select.classList.remove("active");
        (<HTMLElement>this._dropdown).style.removeProperty("max-height");
        (<HTMLElement>this._dropdown.querySelector(".dropdown-inner")).style.removeProperty("max-height");
        return this;
    }
    
    /*
     |  PUBLIC :: TOGGLE DROPDOWN
     |  @since  0.3.0 [0.6.0]
     |
     |  @return this    The tail.select instance.
     */
    toggle(): Select {
        return this._select.classList.contains("active")? this.close(): this.open();
    }
    
    /*
     |  PUBLIC :: RELOAD DROPDOWN
     |  @since  0.3.0 [0.6.0]
     |
     |  @param  bool    TRUE for an soft reload (requery dropdown list), 
     |                  FALSE to rebuild the complete tail.select instance.
     |
     |  @return this    The tail.select instance.
     */
    reload(soft: boolean = true): Select {
        if(this.trigger("hook", "reload:before", [soft]) !== true) {
            return this;
        }
        (soft)? this.query.apply(this, this._last_query): this.remove().init();
        this.trigger("hook", "reload:after", [soft]);
        return this;
    }
    
    /*
     |  PUBLIC :: REMOVE INSTANCE
     |  @since  0.3.0 [0.6.0]
     |
     |  @param  bool    TRUE to keep the added options, FALSE or nothing otherwise.
     |
     |  @return this    The tail.select instance.
     */
    remove(keep?: boolean): Select {
        if(this.trigger("hook", "remove:before", [keep]) !== true) {
            return this;
        }
        this.bind(null);

        // Return Name Attribute
        if(this.get("csvOutput") && !this.e.hasAttribute("data-name")) {
            this.e.setAttribute("name", this._csv.name);
        }
    
        // Remove Added Items
        if(!(keep !== void 0 && keep === true)){
            [].map.call(this.e.querySelectorAll("optgroup[data-select='add']"), function(i) {
                i.parentElement.removeChild(i);
            });
            [].map.call(this.e.querySelectorAll("option[data-select='add']"), function(i) {
                i.parentElement.removeChild(i);
            });
        }
    
        // Handle Visibility States
        if(this.e.hasAttribute("data-tail-hidden")) {
            this.e.style.removeProperty(this.e.getAttribute("data-tail-hidden"));
            this.e.removeAttribute("data-tail-hidden");
        }

        // Good Bye
        if(this._select.parentElement) {
            this._select.parentElement.removeChild(this._select);
        }
        this.e.removeAttribute("data-tail-select");

        // Return
        this.trigger("hook", "remove:after", [keep]);
        return this;
    }

    /*
     |  PUBLIC :: GET CONFIGURATION
     |  @since  0.6.0 [0.6.0]
     |
     |  @param  string  The configuration key, you want to receive.
     |  @param  any     The default value, if the configuration key doesn't exist.
     |
     |  @return any     The respective value or the default value if the config doesn't exist.
     */
    get(key: string, def?: any): any {
        return (key in this.con)? this.con[key]: def;
    }

    /*
     |  PUBLIC :: SET CONFIGURATION
     |  @since  0.6.0 [0.6.0]
     |
     |  @param  string  The configuration key you want to set.
     |          object  The configuration { key: value } paired object you want to set.
     |  @param  any     The value you want to set, if [key] is a string (single option key).
     |
     |  @return this    The tail.select instance.
     */
    set(key: string | Object, value?: any): Select {
        if(typeof key === "object") {
            for(let k in key) {
                this.set(k, key[k]);
            }
            return this;
        }
        if(key === "disabled") {
            return this[key? "disable": "enable"](true);
        }
        if(key === "multiple") {
            this.e.multiple = value;
        }
        this.con[key] = value;
        return this;
    }
    
    /*
     |  PUBLIC :: ENABLE SELECT
     |  @since  0.5.0 [0.6.0]
     |
     |  @param  bool    TRUE to reload the instance (if you change / set an option), FALSE if not.
     |
     |  @return this    The tail.select instance.
     */
    enable(reload: boolean) {
        this.trigger("event", "enable", [reload]);
        this._select.classList.remove("disabled");
        this.con.disabled = this.e.disabled = false;
        return (reload === true)? this.reload(): this;
    }
    
    /*
     |  PUBLIC :: DISABLE SELECT
     |  @since  0.5.0 [0.6.0]
     |
     |  @param  bool    TRUE to reload the instance (if you change / set an option), FALSE if not.
     |
     |  @return this    The tail.select instance.
     */
    disable(reload: boolean) {
        this.trigger("event", "disable", [reload]);
        this._select.classList.add("disabled");
        this.con.disabled = this.e.disabled = true;
        return (reload === true)? this.reload(): this;
    }
    
    /*
     |  PUBLIC :: LISTENER
     |  @since  0.4.0 [0.6.0]
     |
     |  @param  multi   A single event, filter or hook name as STRING, multiple as ARRAY.
     |                  :: AVAILABLE EVENTS::
     |                  Something happened, and you may need to know it!
     |                      "open"          When dropdown gets opened.
     |                      "close"         When dropdown gets closed.
     |                      "change"        When one or more <option> states gets changed (at once).
     |                      "enable"        When the tail.select instance gets enabled.
     |                      "disable"       When the tail.select instance gets disabled.
     |                      "limit"         When the maxLimit gets reached.
     |                      "results"       When the search query results not empty.
     |                      "noresults"     When the search query results empty.
     |
     |                  :: AVAILABLE FILTERS ::
     |                  Something has been created, and you may want to change it!
     |                      "query"         The query call [func, args].
     |                      "query#walk"    The query loop parameters.
     |                      "render"        The default render types.
     |                      "render#<type>" The specific render type.
     |                      "dropdown"      The query dropdown container.
     |                      "update"        The `.update()` method with all arguments.
     |                      "update:csv"    The `.updateCSV()` method with the value attribute.
     |                      "update:label"  The `.updateLabel()` method with the label outut.
     | 
     |                  :: AVAILABLE HOOKS ::
     |                  Something is or has been done, and you may want to intervene!
     |                      "init:before"   On the top of the `.init()` method.
     |                      "init:after"    On the bottom of the `.init()` method.
     |                      "build:before"  On the top of the `.build()` method.
     |                      "build:after"   On the bottom of the `.build()` method.
     |                      "bind:before"   On the top of the `.bind()` method.
     |                      "bind:after"    On the bottom of the `.bind()` method.
     |                      "query:before"  On the top of the `.query()` method.
     |                      "query:after"   On the bottom of the `.query()` method.
     |                      "update:before" On the top of the `.update()` method.
     |                      "update:after"  On the bottom of the `.update()` method.
     |                      "remove:before" On the top of the `.remove()` method.
     |                      "remove:after"  On the bottom of the `.remove()` method.
     |                      "reload:before" On the top of the `.reload()` method.
     |                      "reload:after"  On the bottom of the `.reload()` method.
     |
     |  @param  func    A callback function, which gets the following arguments passed.
     |                  @arg1   string      The event, callback or hook name as string.
     |                  @arg2   array       The event depending arguments within an array.
     |                  @arg3   array       The [args] you passed as third parameter.
     |                  @arg4   object      The this / self object of the respective instance.
     |
     |  @return this    The tail.select instance.
     */
    on(name: string | Array<string>, func: Function) {
        name = (typeof name === "string")? [name]: name;
        for(let i = 0; i < name.length; i++) {
            if(!(name[i] in this.callbacks)) {
                this.callbacks[name[i]] = [];
            }
            this.callbacks[name[i]].push(func);
        }
        return this;
    }
    
    /*
     |  PUBLIC :: GET VALUE
     |  @since  0.5.13 [0.6.0]
     |
     |  @param  string  The Type of formatting of the returning value:
     |                      "auto"      Returns a String on Single and an Array on Multiple Fields.
     |                      "csv"       A comma-separated string with all selected values.
     |                      "array"     An array with all selected values.
     |                      "nodes"     A NodeList with all selected <option>s.
     |
     |  @return multi   The selected values or elements using the return type defined in [format].
     |                  Returns `false` if [format] is invalid.
     */
    value(format: string = "auto") {
        var itm = this.options.get(null, null, true);
        switch((format === "auto")? (this.get("multiple")? "array": "csv"): format){
            case "csv": return [].map.call(itm, (i) => i.value).join(this.get("csvSeparator", ","));
            case "array": return [].map.call(itm, (i) => i.value);
            case "nodes": return itm;
        }
        return false;
    }
}
