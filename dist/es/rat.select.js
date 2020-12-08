/*!
 |  rat.select - The vanilla solution to level up your HTML <select> fields.
 |  @file       dist/es/rat.select.js
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
        if (typeof string === "function") {
            string = string.apply(this, params);
        }
        if (typeof params !== "undefined" && params.length > 0) {
            params.map((replace, index) => {
                let regexp = new RegExp("\\[" + index.toString() + "\\]", "g");
                string = string.replace(regexp, replace.toString());
            });
        }
        return string;
    }
}
Strings.en = {
    buttonAll: "All",
    buttonNone: "None",
    disabled: "This field is disabled",
    empty: "No options available",
    multiple: "Choose one or more options...",
    multipleCount: (count) => {
        return `[0] ${count === 1 ? "option" : "options"} selected...`;
    },
    multipleLimit: "No more options selectable",
    single: "Choose an option..."
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
        let cbs = [];
        for (let name in this.plugins) {
            if (hook in this.plugins[name].hooks) {
                cbs.push(this.plugins[name].hooks[hook]);
            }
        }
        return cbs;
    }
}
Plugins.plugins = {};

class Options {
    constructor(select) {
        this.select = select;
        this.source = select.source;
        [].map.call(this.source.querySelectorAll('option:not([value])'), (option) => {
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
        group = group === "" ? false : group;
        let selector = states ? states.map((state) => {
            return state[0] === "!" ? `:not(${format[state.slice(1)]})` : format[state];
        }) : "";
        selector += ":not([data-rat-ignore])";
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
                changes.disabled = item.disabled = !item.disabled;
            }
            if (states.hasOwnProperty("hidden") && states.hidden !== item.hidden) {
                changes.hidden = item.hidden = !item.hidden;
            }
            while (states.hasOwnProperty("selected") && states.selected !== item.selected) {
                if (item.disabled || item.hidden) {
                    break;
                }
                if (!item.selected && this.source.multiple && limit >= 0 && limit <= this.count(null, [":selected"])) {
                    break;
                }
                if (item.selected && !this.source.multiple && !this.select.get("deselect", !1)) {
                    break;
                }
                if (!this.source.multiple && !item.selected && this.source.selectedIndex >= 0) {
                    result.push([this.source.options[this.source.selectedIndex], { selected: false }]);
                }
                changes.selected = item.selected = !item.selected;
                if (!this.source.multiple && !item.selected) {
                    let oaap = `option[value=""]:not(:disabled):checked:first-child`;
                    this.source.selectedIndex = this.source.querySelector(oaap) ? 0 : -1;
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
        this.config.placeholder = config.placeholder || source.dataset.placeholder || null;
        let oaap = source.querySelector("option[value='']:checked:first-child");
        if (oaap && (oaap.dataset.ratIgnore = "1")) {
            this.config.deselect = !oaap.disabled;
            this.config.placeholder = oaap.innerText || config.placeholder;
        }
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
        if (this.trigger("hook", "init:before") === false) {
            return this;
        }
        if (typeof this.config.items !== "undefined") {
            let items = this.config.items;
            this.options.parse(typeof items === "function" ? items.call(this, this.options) : items);
        }
        if (this.trigger("hook", "build:before") === true) {
            this.build();
            this.trigger("hook", "build:after");
        }
        if (this.trigger("hook", "bind:before") === true) {
            this.bind();
            this.trigger("hook", "bind:after");
        }
        if (this.source.nextElementSibling) {
            this.source.parentElement.insertBefore(this.select, this.source.nextElementSibling);
        }
        else {
            this.source.parentElement.appendChild(this.select);
        }
        this.updateLabel();
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
        this.label.innerHTML = `<span class="label-inner"></span>`;
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
    calculate() {
        let clone = this.dropdown;
        let height = ((height) => {
            var _a, _b;
            let temp = clone.cloneNode(true);
            temp.classList.add("height");
            this.select.appendChild(temp);
            if (typeof height === "string" && height.charAt(0) === ":") {
                let opt = (_b = (_a = clone.querySelector(".dropdown-option")) === null || _a === void 0 ? void 0 : _a.offsetHeight) !== null && _b !== void 0 ? _b : 50;
                temp.style.maxHeight = opt * parseInt(height.slice(1)) + "px";
            }
            else {
                temp.style.maxHeight = height + (isNaN(height) ? "" : "px");
            }
            height = temp.offsetHeight > height ? height : temp.offsetHeight;
            return this.select.removeChild(temp) ? height : height;
        })((!this.get("height", 350)) ? "auto" : this.get("height", 350));
        clone.style.maxHeight = height + "px";
        return this;
    }
    bind(unbind) {
        if (!this.handler) {
            this.handler = this.handle.bind(this);
        }
        if (!unbind) {
            document.addEventListener("keydown", this.handler);
            document.addEventListener("click", this.handler);
            if (this.get("sourceBind")) {
                this.source.addEventListener("change", this.handler);
            }
            return this;
        }
        document.removeEventListener("keydown", this.handler);
        document.removeEventListener("click", this.handler);
        if (this.get("sourceBind")) {
            this.source.removeEventListener("change", this.handler);
        }
        return this;
    }
    handle(event) {
        let target = event.target;
        if (event.type === "keydown") ;
        if (event.type === "click") {
            if (target === this.label || this.label.contains(target)) {
                return this.toggle();
            }
            if (!this.select.contains(target) && !this.get("stayOpen")) {
                return this.close();
            }
            if (this.dropdown.contains(target)) {
                while (target && this.dropdown.contains(target) && !target.dataset.action) {
                    target = target.parentElement;
                }
                let disabled = target.classList.contains("disabled");
                if (!disabled && target.dataset.action && (target.dataset.value || target.dataset.group)) {
                    let items = this.options.get(target.dataset.value, target.dataset.group);
                    let action = target.dataset.action;
                    this.options.selected(items, action === "toggle" ? null : action === "select");
                    if (!this.get("stayOpen") && !this.source.multiple) {
                        return this.close();
                    }
                }
            }
        }
        if (event.type === "change" && !(event instanceof CustomEvent)) ;
    }
    trigger(type, name, args) {
        if (type === "event") {
            let data = { bubbles: false, cancelable: true, detail: { args: args, select: this } };
            let event = new CustomEvent(`rat::${name}`, data);
            var cancelled = this.select.dispatchEvent(event);
            if (name === "change") {
                let input = new CustomEvent("input", data);
                let event = new CustomEvent("change", data);
                this.source.dispatchEvent(input);
                this.source.dispatchEvent(event);
            }
        }
        let _arg = true;
        let callbacks = this.plugins.hook(name).concat(this.events[name] || []);
        callbacks.map((cb) => {
            if (type === "filter") {
                args = cb.apply(this, args);
            }
            else if (this.handle.apply(this, args) === false) {
                _arg = false;
            }
        });
        return (type === "hook") ? _arg : ((type === "filter") ? args : cancelled);
    }
    query(query) {
        if (this.trigger("hook", "query:before") === false) {
            return this;
        }
        query = typeof query === "function" ? query : this.get("query", () => this.options.get());
        query = this.trigger("filter", "query", [query])[0];
        let el = null;
        let skip = void 0;
        let head = [];
        let items = query.call(this);
        for (let item of items) {
            let group = item.parentElement instanceof HTMLOptGroupElement ? item.parentElement.label : null;
            [item, group] = this.trigger("filter", "walk", [item, group]);
            if (group === skip) {
                continue;
            }
            if (!(head.length > 0 && head[0].dataset.group === (!group ? "" : group))) {
                let arg = item.parentElement instanceof HTMLOptGroupElement ? item.parentElemnt : null;
                if (!arg) {
                    arg = document.createElement("OPTGROUP");
                    arg.innerText = this.get("ungroupedLabel", null);
                }
                if ((el = this.render(arg)) === null) {
                    skip = group;
                    continue;
                }
                else if (el === false) {
                    break;
                }
                head.push(el);
            }
            if ((el = this.render(item)) === null) {
                continue;
            }
            else if (el === false) {
                break;
            }
            head[0].appendChild(el);
            if (this.get("titleOverflow") === "scroll") {
                (function (el, self) {
                    let style = window.getComputedStyle(el);
                    let inner = el.clientWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight) - 17;
                    let title = el.querySelector(".option-title");
                    if (title.scrollwidth > inner) {
                        let number = inner - title.scrollWidth - 15;
                        title.style.paddingLeft = Math.abs(number) + "px";
                        el.style.textIndent = number + "px";
                    }
                }(el));
            }
        }
        let root = this.dropdown.querySelector(".dropdown-inner");
        let clone = root.cloneNode();
        head.map((item) => clone.appendChild(item));
        this.dropdown.replaceChild(clone, root);
        if (this.select.classList.contains("active")) {
            this.calculate();
        }
        this.trigger("hook", "query:after");
        return this;
    }
    render(element) {
        var _a;
        let tag = element.tagName.toUpperCase();
        let output = document.createElement(tag === "OPTION" ? "LI" : "OL");
        let classes = (item) => {
            let selected = (this.get("multiple") && item.hasAttribute("selected")) || item.selected;
            return ((selected ? " selected" : "") + (item.disabled ? " disabled" : "") + (item.hidden ? " hidden" : "")).trim();
        };
        if (tag === "OPTION") {
            output.className = "dropdown-option " + classes(element);
            output.innerHTML = `<span class="option-title">${element.innerHTML}</span>`;
            output.dataset.group = ((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.label) || "";
            output.dataset.value = element.value;
            output.dataset.action = "toggle";
            if (element.dataset.description) {
                output.innerHTML += `<span clasS="option-description">${element.dataset.description}</span>`;
            }
        }
        else {
            output.className = "dropdown-optgroup";
            output.innerHTML = `<li class="optgroup-title">${element.label}</li>`;
            output.dataset.group = element.label;
            if (this.get("multiple") && this.get("multiSelectGroup", 1)) {
                for (let item of ['select-none', 'select-all']) {
                    let btn = document.createElement("BUTTON");
                    btn.dataset.action = item;
                    btn.innerHTML = this.locale._(item === "select-all" ? "buttonAll" : "buttonNone");
                    output.querySelector(".optgroup-title").appendChild(btn);
                }
            }
        }
        return this.trigger("filter", `render#${tag}`, [output, element, tag])[0];
    }
    update(changes) {
        if (changes.length === 0) {
            return this;
        }
        if (this.trigger("hook", "update:before", [changes]) !== true) {
            return this;
        }
        this.trigger("event", "change", [changes]);
        if (this.source.multiple && this.get("multiLimit") > 0) {
            if (this.options.count(null, ["selected"]) >= this.get("multiLimit")) {
                this.trigger("event", "limit", [changes]);
            }
        }
        [].map.call(changes, (dataset) => {
            let [option, change] = dataset;
            let value = option.value.replace(/('|\\)/g, "\\$1");
            let group = option.parentElement ? option.parentElement.label || "" : "";
            let item = this.dropdown.querySelector(`li[data-value="${value}"][data-group="${group}"]`);
            if (item) {
                for (let key in change) {
                    item.classList[change[key] ? "add" : "remove"](key);
                }
            }
        });
        this.trigger("hook", "update:after", [changes]);
        return this.updateCSV().updateLabel();
    }
    updateCSV() {
        if (this.get("csvOutput")) {
            this.csv.value = this.trigger("filter", "update#csv", [this.value("csv")])[0];
        }
        return this;
    }
    updateLabel(label) {
        let value = this.value("array");
        let limit = this.get("multiLimit");
        if (this.source.disabled || !this.options.count()) {
            label = this.source.disabled ? "disabled" : "empty";
        }
        else if (this.source.multiple && value.length > 0) {
            label = limit === value.length ? "multipleLimit" : "multipleCount";
        }
        else if (!this.source.multiple && value.length === 1) {
            label = value[0];
        }
        else {
            label = this.get("placeholder") || (this.source.multiple ? "multiple" : "single");
        }
        this.label.innerText = this.locale._(label, [value.length]);
        return this;
    }
    open() {
        if (this.select.classList.contains("active")) {
            return this;
        }
        this.calculate();
        this.select.classList.add("active");
        this.trigger("event", "open", []);
        return this;
    }
    close() {
        if (!this.select.classList.contains("active")) {
            return this;
        }
        this.dropdown.style.removeProperty("max-height");
        this.select.classList.remove("active");
        this.trigger("event", "close", []);
        return this;
    }
    toggle() {
        return this[this.select.classList.contains("active") ? "close" : "open"]();
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
        let items = this.options.get(null, null, ["selected"]);
        switch (format) {
            case 'csv': return [].map.call(items, (i) => i.value).join(this.get("csvSeparator", ","));
            case 'array': return [].map.call(items, (i) => i.value);
            case 'node': return !this.source.multiple ? (items[0] || null) : [].map.call(items, (i) => i.value);
            default: return format === "array" ? [] : null;
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
RatSelect.Strings = Strings;
RatSelect.Plugins = Plugins;

export default RatSelect;
//# sourceMappingURL=rat.select.js.map
