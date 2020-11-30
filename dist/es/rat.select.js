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
    *walker(orderGroups, orderItems) {
        let groups = this.getGroups(false);
        if (typeof orderGroups === "function") {
            groups = orderGroups.call(this, groups);
        }
        else if (typeof orderGroups === "string") {
            if (orderGroups.toLowerCase() === "asc") {
                groups = groups.sort();
            }
            else {
                groups = groups.sort().reverse();
            }
        }
        groups.unshift(null);
        for (let group in groups) {
            yield group;
        }
    }
    get() {
    }
    getGroups(objects) {
        let groups = this.source.querySelectorAll("optgroup");
        return (objects) ? groups : [].map.call(groups, (i) => i.label);
    }
    count() {
    }
    set(item, group, position, reload) {
        return this;
    }
    remove() {
    }
    reload() {
    }
    handle() {
    }
    selected(items, state) {
    }
    disabled(items, state) {
    }
    hidden(items, state) {
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
        return this.query("walker");
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
    query(method, args, limit, offset) {
        this.trigger("hook", "query:before", []);
        this.trigger("hook", "query:after");
        return this;
    }
    render() {
        return this;
    }
    update() {
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
        }
        return null;
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
