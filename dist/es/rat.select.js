/*!
 |  rat.select - The vanilla solution to level up your HTML <select> fields.
 |  @file       dist/es/tail.select.js
 |  @version    1.0.0 - Stable
 |  @author     SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |				Lenivyy <lenivyy@pytes.net> (https://www.pytes.net)
 |  
 |  @website    https://rat.md/select
 |  @license    MIT License
 |  @copyright  Copyright © 2014 - 2020 pytesNET <info@pytes.net>
 */
"use strict";

var version = "1.0.0";

var status = "stable";

class Strings {
    constructor(locale) {
        this.strings = Strings[locale] || Strings.en;
    }
    _(key, params) {
        let string = (key in this.strings) ? this.strings[key] : key;
        if (typeof params !== undefined && params.length > 0) {
            params.map((replace, index) => {
                let regexp = new RegExp("\[" + index + "\]", "g");
                return string.replace(regexp, replace);
            });
        }
        return string;
    }
}
Strings.en = {
    "key": "value"
};

class Plugins {
    constructor(plugins) {
        this.plugins = plugins;
    }
    static add(name, config, hooks) {
        if (name in this.plugins) {
            return false;
        }
        this.plugins[name] = { config: config, hooks: hooks };
        return true;
    }
    hook(hook) {
        for (let name in this.plugins) {
            if (hook in this.plugins[name].hooks) ;
        }
    }
}
Plugins.plugins = {};

class Options {
    constructor(select) {
        this.select = select;
        this.source = select.source;
        [].map.call(this.source.querySelectorAll('options:not([value])'), (option) => {
            if (option.innerText !== "") {
                option.setAttribute("value", option.innerText);
            }
        });
        if (select.get("deselect") && !select.get("multiple")) {
            let option = this.source.querySelector('option:checked');
            if (option && this.source.querySelector('option[selected]') === null) {
                option.selected = false;
                this.source.selectedIndex = -1;
            }
        }
    }
    create(value, item) {
        let option = document.createElement("OPTION");
        option.value = value;
        option.innerText = item.title;
        option.selected = item.selected || false;
        option.disabled = item.disabled || false;
        option.hidden = item.hidden || false;
        if (item.description) {
            option.dataset.description = item.description;
        }
        return option;
    }
    parse(items) {
        for (let key in items) {
            if (typeof items[key] === "string") {
                var item = this.create(key, Object({ title: items[key] }));
            }
            else {
                var item = this.create(key, items[key]);
            }
            this.set(item);
        }
        return this;
    }
    get(value, group, states) {
        let format = { disabled: ":disabled", selected: ":checked", hidden: "[hidden]" };
        let selector = states ? states.map((state) => {
            return state[0] === "!" ? `:not(${format[state.slice(1)]})` : format[state];
        }) : "";
        if (typeof value === "number") {
            let nth = (value > 0) ? ":nth-child" : ":nth-last-child";
            selector = `option${nth}(${Math.abs(value)})${selector}`;
        }
        else if (typeof value === "string" || !value) {
            selector = `option${!value ? "" : `[value="${value}"]`}${selector}`;
        }
        else {
            return [];
        }
        if (!group && group !== false) {
            return this.source.querySelectorAll(selector);
        }
        else if (typeof group === "string") {
            return this.source.querySelectorAll(`optgroup[label="${group}"] ${selector}`);
        }
        else if (group === false) {
            selector = `select[data-rat-select="${this.source.dataset.ratSelect}"] > ${selector}`;
            return this.source.parentElement.querySelectorAll(selector);
        }
        return [];
    }
    getGroups(objects) {
        let groups = this.source.querySelectorAll("optgroup");
        return (objects) ? groups : [].map.call(groups, (i) => i.label);
    }
    count(group, states) {
        if (arguments.length === 0) {
            return this.source.options.length;
        }
        let result = this.get(null, group, states);
        return result ? result.length : 0;
    }
    set(item, group, position, reload) {
        if (!(item instanceof HTMLOptionElement)) {
            [].map.call(item, (el, i) => this.set(el, group, (position < 0) ? -1 : (position + i), !1));
            return (reload && this.select.reload()) ? this : this;
        }
        if (group === void 0 || group === null) {
            group = item.parentElement.label || false;
        }
        if (typeof group === "string") {
            let optgroup = this.source.querySelector(`optgroup[label="${group}"]`);
            if (!optgroup) {
                optgroup = document.createElement("OPTGROUP");
                optgroup.label = group;
                optgroup.dataset.select = "add";
                this.source.appendChild(optgroup);
            }
            if (position < 0 || position > optgroup.children.length) {
                optgroup.appendChild(item);
            }
            else {
                optgroup.insertBefore(item, optgroup.children[position]);
            }
        }
        if (!group) {
            let selector = `select[data-rat-select="${this.source.dataset.ratSelect}"] > option`;
            let options = this.source.parentElement.querySelectorAll(selector);
            let calc = Math.min(position < 0 ? options.length : position, options.length);
            if (this.source.children.length === calc || !options[calc - 1].nextElementSibling) {
                this.source.appendChild(item);
            }
            else {
                this.source.insertBefore(item, options[calc - 1].nextElementSibling || this.source.children[0]);
            }
        }
        item.dataset.select = "add";
        return (reload && this.select.reload()) ? this : this;
    }
    remove(items, reload) {
        if (items instanceof HTMLOptionElement) {
            items = [items];
        }
        [].map.call(items, (item) => {
            item.parentElement.removeChild(item);
        });
        return (reload && this.select.reload) ? this : this;
    }
    handle(items, states) {
        if (items instanceof HTMLOptionElement) {
            items = [items];
        }
        let result = [];
        let limit = this.select.get("multiLimit", -1);
        [].map.call(items, (item) => {
            let changes = {};
            if (states.hasOwnProperty("disabled") && states.disabled !== item.disabled) {
                changes.disabled = item.disabled = states.disabled;
            }
            if (states.hasOwnProperty("hidden") && states.hidden !== item.hidden) {
                changes.hidden = item.hidden = states.hidden;
            }
            while (states.hasOwnProperty("selected") && states.selected !== item.selected) {
                if (item.disabled || item.hidden) {
                    break;
                }
                if (states.selected && this.source.multiple && limit >= 0 && limit <= this.count(null, [":selected"])) {
                    break;
                }
                if (!states.selected && !this.source.multiple && this.select.get("deselect", !1)) {
                    break;
                }
                changes.selected = item.selected = states.selected;
                if (!this.source.multiple && !states.selected) {
                    this.source.selectedIndex = -1;
                }
                break;
            }
            if (Object.keys(changes).length > 0) {
                result.push([item, changes]);
            }
        });
        return this.select.update(result) ? this : this;
    }
    selected(items, state) {
        return this.handle(items, { selected: state });
    }
    disabled(items, state) {
        return this.handle(items, { disabled: state });
    }
    hidden(items, state) {
        return this.handle(items, { hidden: state });
    }
}

class Select {
    constructor(source, config, options) {
        this.source = source;
        this.config = config;
        this.options = new (options || Options)(this);
        this.locale = new Strings(config.locale || "en");
        this.plugins = new Plugins(config.plugins || {});
        this.events = config.on || {};
        this.config.multiple = this.source.multiple = config.multiple || source.multiple;
        this.config.disabled = this.source.disabled = config.disabled || source.disabled;
        this.config.required = this.source.required = config.required || source.required;
        let placeholder = config.placeholder || source.dataset.placeholder || null;
        if (!placeholder || source.options[0].value === "") {
            placeholder = source.options[0].innerText;
        }
        this.config.placeholder = placeholder;
        if ((config.rtl || null) === null) {
            this.config.rtl = ['ar', 'fa', 'he', 'mdr', 'sam', 'syr'].indexOf(config.locale || "en") >= 0;
        }
        if ((config.theme || null) === null) {
            let evaluate = document.createElement("SPAN");
            evaluate.className = "rat-select-theme-name";
            document.body.appendChild(evaluate);
            this.config.theme = window.getComputedStyle(evaluate, ":after").content.replace(/"/g, "");
            document.body.removeChild(evaluate);
        }
        source.dataset.ratSelect = Select.inst.length.toString();
        Select.inst[Select.inst.length++] = this;
        this.init();
    }
    init() {
        this.trigger("hook", "init:before");
        if (typeof this.config.items !== "undefined") {
            let items = this.config.items;
            this.options.parse(typeof items === "function" ? items.call(this, this.options) : items);
        }
        this.trigger("hook", "build:before");
        this.build();
        this.trigger("hook", "build:after");
        this.trigger("hook", "bind:before");
        this.bind();
        this.trigger("hook", "bind:after");
        if (this.source.nextElementSibling) {
            this.source.parentElement.insertBefore(this.select, this.source.nextElementSibling);
        }
        else {
            this.source.parentElement.appendChild(this.select);
        }
        this.trigger("hook", "init:after");
        return this.query();
    }
    build() {
        let cls = this.get("classNames") === true ? this.source.className : this.get("classNames", "");
        this.select = document.createElement("DIV");
        this.select.className = ((cls) => {
            this.get("rtl") ? cls.unshift("rtl") : null;
            this.get("hideSelected") ? cls.unshift("hide-selected") : null;
            this.get("hideDisabled") ? cls.unshift("hide-disabled") : null;
            this.get("hideHidden", !0) ? cls.unshift("hide-hidden") : null;
            this.get("disabled") ? cls.unshift("disabled") : null;
            this.get("required") ? cls.unshift("required") : null;
            this.get("multiple") ? cls.unshift("multiple") : null;
            this.get("deselect") ? cls.unshift("deselect") : null;
            cls.unshift(`rat-select theme-${this.get("theme").replace("-", " scheme-").replace(".", " ")}`);
            return cls.filter((item) => item.length > 0).join(" ");
        })(typeof cls === "string" ? cls.split(" ") : cls);
        this.select.tabIndex = this.source.tabIndex || 0;
        this.select.dataset.ratSelect = this.source.dataset.ratSelect;
        let width = this.get("width", 250);
        if (width !== null) {
            this.select.style.width = width + (isNaN(width) ? "" : "px");
        }
        this.label = document.createElement("LABEL");
        this.label.className = "select-label";
        this.label.innerHTML = `<span class="label-inner">Test Placeholder</span>`;
        this.dropdown = document.createElement("DIV");
        this.dropdown.className = `select-dropdown overflow-${this.get("titleOverflow", "clip")}`;
        this.dropdown.innerHTML = `<div class="dropdown-inner"></div>`;
        this.csv = document.createElement("INPUT");
        this.csv.className = "select-search";
        this.csv.name = ((name) => {
            if (name === true) {
                name = this.source.dataset.name || this.source.name || "";
            }
            return name === false ? "" : name;
        })(this.get("csvOutput", !1));
        this.select.appendChild(this.label);
        this.select.appendChild(this.dropdown);
        this.get("csvOutput") ? this.select.appendChild(this.csv) : null;
        return this;
    }
    bind() {
        let handle = this.handle.bind(this);
        document.addEventListener("keydown", this.handle);
        document.addEventListener("click", this.handle);
        if (this.get("sourceBind")) {
            this.source.addEventListener("change", this.handle);
        }
        return this;
    }
    handle(event) {
        console.log(event);
    }
    trigger(type, name, args) {
        if (type === "event") {
            let data = { bubbles: false, cancelable: true, detail: { args: args, select: this } };
            let event = new CustomEvent(`rat::${name}`, data);
            this.select.dispatchEvent(event);
            if (name === "change") {
                let input = new CustomEvent("input", data);
                let event = new CustomEvent("change", data);
                this.source.dispatchEvent(input);
                this.source.dispatchEvent(event);
            }
        }
        return null;
    }
    query(query) {
        this.trigger("hook", "query:before", []);
        query = typeof query !== "function" ? this.get("query", null) : null;
        if (!query) {
            query = () => this.options.get();
        }
        let items = query.call(this);
        console.log(items);
        for (let item of items) {
            console.log(item);
        }
        this.trigger("hook", "query:after");
        return this;
    }
    render() {
        return this;
    }
    update(changes) {
        return this;
    }
    open() {
        if (this.select.classList.contains("active")) {
            return this;
        }
        this.select.classList.add("active");
        this.trigger("event", "open", []);
        return this;
    }
    close() {
        if (!this.select.classList.contains("active")) {
            return this;
        }
        this.select.classList.remove("active");
        this.trigger("event", "close", []);
        return this;
    }
    reload(hard) {
        return this;
    }
    remove() {
        return this;
    }
    value(format) {
        if (typeof format === 'undefined' || format === 'auto') {
            format = this.source.multiple ? 'array' : 'csv';
        }
        switch (format) {
            case 'csv': return null;
            case 'array': return null;
            case 'node': return null;
            default: return null;
        }
    }
    get(key, def) {
        return (key in this.config) ? this.config[key] : def;
    }
    set(key, value, reload) {
        if (['multiple', 'disabled', 'required'].indexOf(key) >= 0) {
            if (key === 'disabled') {
                return this[value ? 'enable' : 'disable'](reload);
            }
            this.config[key] = this.source[key] = !!key;
        }
        else {
            this.config[key] = value;
        }
        return (reload) ? this.reload() : this;
    }
    enable(reload) {
        this.config.disabled = this.source.disabled = false;
        this.select.classList.remove("disabled");
        return (reload) ? this.reload() : this;
    }
    disable(reload) {
        this.config.disabled = this.source.disabled = true;
        this.select.classList.add("disabled");
        return (reload) ? this.reload() : this;
    }
    on(name, callback) {
        name.split(",").map((event) => {
            this.events[event] = this.events[event] || [];
            this.events[event].push(callback);
        });
        return this;
    }
}
Select.inst = {
    length: 0
};
Select.strings = Strings;
Select.plugins = Plugins;

function RatSelect(selector, config, options) {
    let _return = (source) => {
        if (!(source instanceof HTMLSelectElement)) {
            return null;
        }
        if (source.dataset.ratSelect) {
            return Select.inst[source.dataset.ratSelect];
        }
        return new Select(source, config ? Object.assign({}, config) : {}, options ? options : Options);
    };
    if (typeof selector === "string") {
        selector = document.querySelectorAll(selector);
    }
    if (selector instanceof HTMLSelectElement) {
        return _return(selector);
    }
    return [].map.call(selector, _return);
}
RatSelect.version = version;
RatSelect.status = status;
RatSelect.Select = Select;
RatSelect.Options = Options;

export default RatSelect;
//# sourceMappingURL=rat.select.js.map
