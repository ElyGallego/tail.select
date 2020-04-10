/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/tail.select.js
 |  @authors    SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |              Lenivyy <lenivyy@pytes.net> (https://www.pytes.net)
 |  @version    0.6.0 - Beta : ECMAScript 2015
 |
 |  @website    https://github.com/pytesNET/tail.select
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2014 - 2020 pytesNET <info@pytes.net>
 */
let { select, options } = (function (w, d) {
    "use strict";
    
    const tail = {
        trigger: (el, event, opt) => {
            let ev = new CustomEvent(event, opt);
            return el.dispatchEvent(ev);
        },
        clone: (obj, rep) => {
            return Object.assign({}, obj, rep || {});
        },
        create: (tag, classes = []) => {
            var el = d.createElement(tag);
            el.className = (Array.isArray(classes)) ? classes.join(" ") : classes || "";
            return el;
        }
    };

    const Strings = {
        en: {
            buttonAll: "All",
            buttonNone: "None",
            disabled: "This field is disabled",
            empty: "No options available",
            emptySearch: "No options found",
            multiple: "Choose one or more options...",
            multipleCount: "Choose up to [1] options...",
            multipleLimit: "No more options selectable...",
            multipleList: "[0] options selected",
            search: "Tap to search...",
            single: "Choose an option..."
        },
        add: function (locale, key, value) {
            if (!(locale in this)) {
                this[locale] = tail.clone(this.en, {});
            }
            if (key instanceof Object) {
                this[locale] = tail.clone(this[locale], key);
                return true;
            } else if (typeof key === "string" && typeof value === "string") {
                this[locale][key] = value;
                return true;
            }
            return false;
        }
    };

    class Plugins {
        constructor(plugins, self) {
            this.self = self;
            this.active = {};
            for (let key in plugins) {
                if (key in Plugins.plugins) {
                    let plugin = Plugins.plugins[key];
                    self.set(tail.clone(plugin.options, plugins[key]));
                    this.active[key] = plugin;
                }
            }
        }
        callbacks(name) {
            let cb = [];
            for (let plugin in this.active) {
                if (name in this.active[plugin].hooks) {
                    cb.push(this.active[plugin].hooks[name]);
                }
            }
            return cb;
        }
    }
    Plugins.plugins = {};
    Plugins.add = function (plugin, options, hooks) {
        if (!(plugin in this.plugins)) {
            this.plugins[plugin] = { hooks: hooks, options: options };
            return true;
        }
        return false;
    };

    class Options {
        constructor(select) {
            this.parent = select;
            this.source = select.e;
            [].map.call(this.source.querySelectorAll("option:not([value])"), (i) => {
                if (i.innerText !== "") {
                    i.setAttribute("value", i.innerText);
                }
            });
            if (this.parent.get("deselect") && !this.parent.get("multiple")) {
                let option = this.source.querySelector("option:checked");
                if (this.source.querySelector("option[selected]") === null) {
                    if (option) {
                        option.selected = false;
                    }
                    this.source.selectedIndex = -1;
                }
            }
            return this;
        }
        create(value, text, data) {
            let temp = d.createElement("OPTION");
            temp.setAttribute("value", value);
            temp.innerText = text;
            if (data !== void 0 && data instanceof Object) {
                for (let key in data) {
                    if (["group", "optgroup", "position"].indexOf(key) >= 0) {
                        continue;
                    }
                    if (["disabled", "selected", "hidden"].indexOf(key) >= 0) {
                        temp[key] = data[key];
                        continue;
                    }
                    temp.setAttribute((key === "description") ? "data-description" : key, data[key]);
                }
            }
            return temp;
        }
        get(value, group, checked, disabled, hidden) {
            if (value instanceof Object) {
                return value;
            }
            let selector = ((hidden) ? "[hidden]" : (hidden === false) ? ":not([hidden])" : "")
                + ((checked) ? ":checked" : (checked === false) ? ":not(:checked)" : "")
                + ((disabled) ? ":disabled" : (disabled === false) ? ":not(:disabled)" : "");
            if (typeof value === "number") {
                let _nth = (value > 0) ? ":nth-child" : ":nth-last-child";
                selector = `option${_nth}(${Math.abs(value)})${selector}`;
            } else if (typeof value === "string" || !value) {
                selector = `option` + (typeof value === "string" ? `[value="${value}"]` : ``) + selector;
            } else {
                return [];
            }
            if (!group) {
                return this.source.querySelectorAll(selector);
            } else if (group !== "#") {
                return this.source.querySelectorAll(`optgroup[label="${group}"] ${selector}`);
            } else if (group === "#") {
                selector = `select[data-tail-select="tail-${this.parent.id}"] > ${selector}`;
                return this.source.parentElement.querySelectorAll(selector);
            }
            return [];
        }
        getGroups(objects) {
            var groups = this.source.querySelectorAll("optgroup");
            return (objects) ? groups : [].map.call(groups, (i) => i.label);
        }
        count(group, checked, disabled, hidden) {
            if (arguments.length === 0) {
                return this.source.options.length;
            }
            return this.get(null, group || null, checked, disabled, hidden).length;
        }
        set(item, group, position, reload = true) {
            if (!(item instanceof HTMLOptionElement)) {
                if (item.forEach && item.length && item.length > 0) {
                    item.forEach((e, i) => this.set(e, group, (position < 0) ? -1 : (position + i), !1));
                }
                return (reload && this.parent.reload(true)) ? this : this;
            }
            if (group === null) {
                group = item.parentElement.label || "#";
            }
            let before = null;
            let append = null;
            if (typeof group === "string" && group !== "#") {
                let optgroup = this.source.querySelector(`optgroup[label='${group}']`);
                if (optgroup === null) {
                    optgroup = d.createElement("OPTGROUP");
                    optgroup.setAttribute("label", group);
                    optgroup.setAttribute("data-select", "add");
                    optgroup.appendChild(item);
                    this.source.appendChild(optgroup);
                    position = -1;
                }
                let options = optgroup.querySelectorAll("option");
                if (position < 0 || position > options.length) {
                    append = optgroup;
                } else {
                    before = options[position];
                }
            } else {
                let selector = `select[data-tail-select="tail-${this.parent.id}"] > option`;
                let options = this.source.parentElement.querySelectorAll(selector);
                var p = Math.min((position < 0 ? options.length : position), options.length);
                if (this.source.children.length === p || !options[p - 1].nextElementSibling) {
                    append = this.source;
                } else {
                    before = options[p - 1].nextElementSibling || this.source.children[0];
                }
            }
            if (item.parentElement === null) {
                item.setAttribute("data-select", "add");
            }
            if (before) {
                before.parentElement.insertBefore(item, before);
            } else {
                (append || this.source).appendChild(item);
            }
            return (reload && this.parent.reload(true)) ? this : this;
        }
        add(data, group, reload = true) {
            let option, optgroup, position;
            for (let key in data) {
                if (typeof data[key] === "string") {
                    this.set(this.create(key, data[key]), group || "#", -1, false);
                    continue;
                }
                optgroup = data[key].optgroup || data[key].group || group || "#";
                position = data[key].position || -1;
                option = this.create(data[key].key || key, data[key].value || data[key].text, data[key]);
                this.set(option, optgroup, position, false);
            }
            return (reload && this.parent.reload(true)) ? this : this;
        }
        remove(item, reload = true) {
            if (!(item instanceof HTMLOptionElement)) {
                let items = this.get[(item instanceof Array) ? "apply" : "call"](this, item);
                for (let i = 0; i < items.length; i++) {
                    this.remove(items[i], false);
                }
                return (reload && this.parent.reload(true)) ? this : this;
            }
            item.parentElement.removeChild(item);
            return (reload && this.parent.reload(true)) ? this : this;
        }
        handle(item, state, prevent, force) {
            if (!(item instanceof HTMLOptionElement)) {
                let items = this.get[(item instanceof Array) ? "apply" : "call"](this, item);
                let result = [];
                for (let t, i = 0; i < items.length; i++) {
                    if ((t = this.handle(items[i], state, true, force)).length > 0) {
                        result = result.concat(t);
                    }
                }
                return (!prevent && this.parent.update(result, true, force)) ? result : result;
            }
            let con = this.parent.get.bind(this.parent);
            let result = [];
            let changes = {};
            if (state.hasOwnProperty("disabled") && state["disabled"] !== item.disabled) {
                item.disabled = (state["disabled"] === null) ? !item.disabled : state["disabled"];
                changes["disabled"] = item.disabled;
            }
            if (state.hasOwnProperty("hidden") && state["hidden"] !== item.hidden) {
                item.hidden = (state["hidden"] === null) ? !item.hidden : state["hidden"];
                changes["hidden"] = item.hidden;
            }
            while (state.hasOwnProperty("selected")) {
                state["selected"] = (state["selected"] === null) ? !item.selected : state["selected"];
                if (item.disabled || item.hidden || item.selected === state["selected"]) {
                    if (!force)
                        break;
                }
                if (state["selected"] && con("multiple") && con("multiLimit", Infinity) <= this.count(null, true)) {
                    if (!force)
                        break;
                }
                if (!state["selected"] && !con("multiple") && !con("deselect")) {
                    if (!force)
                        break;
                }
                let temp = this.source.options[this.source.selectedIndex];
                item.selected = state["selected"];
                item[(state["selected"] ? "set" : "remove") + "Attribute"]("selected", "selected");
                changes["selected"] = item.selected;
                if (state["selected"] && !con("multiple") && temp) {
                    temp.selected = false;
                    temp.removeAttribute("selected");
                    result.push([temp, { selected: false }]);
                } else if (!state["selected"] && !con("multiple") && temp && temp === item) {
                    this.source.selectedIndex = -1;
                }
                break;
            }
            if (Object.keys(changes).length > 0) {
                result.push([item, changes]);
            }
            return (!prevent && this.parent.update(result, true, force)) ? result : result;
        }
        select(item, prevent) {
            return this.handle(item, { selected: true }, prevent);
        }
        unselect(item, prevent) {
            return this.handle(item, { selected: false }, prevent);
        }
        disable(item, prevent) {
            return this.handle(item, { disabled: true }, prevent);
        }
        enable(item, prevent) {
            return this.handle(item, { disabled: false }, prevent);
        }
        hide(item, prevent) {
            return this.handle(item, { hidden: true }, prevent);
        }
        show(item, prevent) {
            return this.handle(item, { hidden: false }, prevent);
        }
        toggle(item, state, prevent) {
            let obj = (function (i) { i[state] = null; return i; })({});
            return this.handle(item, obj, prevent);
        }
        reload(prevent, force) {
            let limit = this.parent.get("multiple") ? this.parent.get("multiLimit") : 1;
            let select = this.source.querySelectorAll("option:checked").length;
            let options = this.source.options;
            let changes = [];
            for (let i = options.length - 1; i >= 0; i--) {
                let change = {};
                let group = options[i].parentElement.label || "#";
                let selc = `li[data-value="${options[i].value}"][data-group="${group}"]`;
                let opt = this.parent._dropdown.querySelector(selc);
                for (let key in { 'selected': '', 'disabled': '', 'hidden': '' }) {
                    if (opt.classList.contains(key) !== options[i][key]) {
                        change[key] = options[i][key];
                    }
                }
                if (!force && change.selected && select > limit) {
                    delete change["selected"];
                    options[i].selected = false;
                    select--;
                }
                if (Object.keys(change).length > 0) {
                    changes.push([options[i], change]);
                }
            }
            if (changes.length === 0) {
                return [];
            }
            return (!prevent && this.parent.update(changes, true, false)) ? changes : changes;
        }
        applyLinguisticRules(search, strict) {
            var values = [], rules = this.parent.get("linguisticRules", {});
            Object.keys(rules).forEach((key) => values.push("(" + key + "|[" + rules[key] + "])"));
            if (strict) {
                values = values.concat(values.map(function (s) { return s.toUpperCase(); }));
            }
            if (values.length === 0) {
                return search;
            }
            return search.replace(new RegExp(values.join("|"), (!strict) ? "ig" : "g"), function (i) {
                return values[[].indexOf.call(arguments, i, 1) - 1];
            });
        }
        find(search, config, order) {
            var self = this, matches, has = {};
            if (typeof config === "function") {
                matches = config.bind(this, search);
            } else {
                config = typeof config === "string" ? [config] : config;
            }
            if (config instanceof Array) {
                config.forEach((c) => { if (typeof c === "string")
                    has[c] = true; });
                has.any = (!has.any) ? has.attributes && has.value : has.any;
                if (!has.regex || has.text) {
                    search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                }
                if (!has.strict) {
                    search = self.applyLinguisticRules.call(self, search, has.case);
                }
                if (has.word) {
                    search = '\\b' + search + '\\b';
                }
                var regex = new RegExp(search, (!has.case) ? "mi" : "m"), sfunc = function (opt) { return regex.test(opt.innerText || opt.value); };
                if (has.any) {
                    matches = function (opt) { return sfunc(opt) || [].some.call(opt.attributes, sfunc); };
                } else if (has.attributes) {
                    matches = function (opt) { return [].some.call(opt.attributes, sfunc); };
                } else {
                    matches = sfunc;
                }
            }
            let d = this.parent.get("hideDisabled") === null ? "disabled" : "";
            let e = this.parent.get("hideEmpty", !0) ? "value" : "";
            let s = this.parent.get("hideSelected") === null ? "selected" : "";
            let h = this.parent.get("hideHidden", !0) === null ? "hidden" : "";
            let result = [].filter.call(this.source.options, (i) => {
                return (i[d] || i[e] === "" || i[s] || i[h]) ? false : matches.call(this, i);
            });
            if (order === "ASC") {
                result = [].sort.call([].slice.call(result, 0), (a, b) => a.value > b.value);
            } else if (order === "DESC") {
                result = [].sort.call([].slice.call(result, 0), (a, b) => a.value < b.value);
            } else if (typeof order === "function") {
                result = order.call(this, result);
            }
            return result;
        }
        *finder(search, config, order) {
            let items = this.find(search, config, order);
            for (let item of items) {
                yield item;
            }
        }
        *walker(orderg, orderi) {
            let groups = this.getGroups(false) || [];
            if (orderg === "ASC") {
                groups.sort();
            } else if (orderg === "DESC") {
                groups.sort().reverse();
            } else if (typeof orderg === "function") {
                groups = orderg.call(this, groups);
            }
            groups.unshift("#");
            for (let group of groups) {
                let items = this.get(null, group);
                if (orderi === "ASC") {
                    items.sort((a, b) => a.value > b.value);
                } else if (orderi === "DESC") {
                    items.sort((a, b) => a.value < b.value);
                } else if (typeof orderi === "function") {
                    items = orderi.call(this, items);
                }
                let d = this.parent.get("hideDisabled") === null ? "disabled" : "";
                let e = this.parent.get("hideEmpty", !0) ? "value" : "";
                let s = this.parent.get("hideSelected") === null ? "selected" : "";
                let h = this.parent.get("hideHidden", !0) === null ? "hidden" : "";
                for (let item of items) {
                    if (item[d] || item[e] === "" || item[s] || item[h]) {
                        continue;
                    }
                    yield item;
                }
            }
        }
    }

    class Select {
        constructor(el, conf, options) {
            el = (typeof el === "string") ? d.querySelectorAll(el) : el;
            if (!(el instanceof Element)) {
                var temp = [].map.call(el, item => new Select(item, conf, options));
                return temp.filter(item => "id" in item);
            }
            if (!(el instanceof HTMLSelectElement && this instanceof Select)) {
                return (el instanceof HTMLSelectElement) ? new Select(el, conf, options) : void 0;
            }
            if (Select.inst[el.getAttribute("data-tail-select")]) {
                return Select.inst[el.getAttribute("data-tail-select")];
            }
            conf = tail.clone((conf instanceof Object) ? conf : {}, {
                multiple: el.multiple,
                disabled: el.disabled,
                required: el.required,
                placeholder: el.getAttribute("data-placeholder") || (conf || {}).placeholder
            });
            this.id = ++Select.count;
            Select.inst["tail-" + this.id] = this;
            this.e = el;
            this.con = tail.clone({}, conf);
            this.options = options || Options;
            this.callbacks = {};
            return this.init();
        }
        _e(string, replace) {
            string = (string in this.__) ? this.__[string] : string;
            string = (typeof string === "function") ? string.call(this, replace) : string;
            for (var key in (replace || {})) {
                string = string.replace(key, replace[key]);
            }
            return string;
        }
        _cls(item, string) {
            let selected = (this.get("multiple") && item.hasAttribute("selected")) || item.selected;
            return (string + (selected ? " selected" : "")
                + (item.disabled ? " disabled" : "")
                + (item.hidden ? " hidden" : "")).trim();
        }
        init() {
            this.__ = tail.clone(Select.strings.en, Select.strings[this.get("locale", -1)] || {});
            this.plugins = new Plugins(this.get("plugins", {}), this);
            if (this.options instanceof Options) {
                this.options = new this.options.constructor(this);
            } else {
                this.options = new this.options(this);
            }
            this._spacing = 1;
            this._last_query = ["walker", [this.get("sortGroups"), this.get("sortItems")]];
            if (this.get("rtl") === null) {
                this.set("rtl", ['ar', 'fa', 'he', 'mdr', 'sam', 'syr'].indexOf(this.get("locale", "en")) >= 0);
            }
            if (!this.get("theme")) {
                let test = tail.create("SPAN", "tail-select-theme-name");
                d.body.appendChild(test);
                this.set("theme", w.getComputedStyle(test, ":after").content.replace(/"/g, ""));
                d.body.removeChild(test);
            }
            if (this.trigger("hook", "init:before") !== true) {
                return (this.get("startOpen") && !this.get("disabled")) ? this.open() : this;
            }
            this.build(this);
            this.e.setAttribute("data-tail-select", `tail-${this.id}`);
            if (this.get("items") instanceof Object) {
                this.options.add(this.get("items", {}), null, false);
            }
            for (var key in this.get("on", {})) {
                this.on(key, this.get("on", {})[key]);
            }
            if (this.listen === void 0) {
                this.listen = (function (ev) { this.bind.call(this, ev); }).bind(this);
            }
            if (this.e.nextElementSibling) {
                this.e.parentElement.insertBefore(this._select, this.e.nextElementSibling);
            } else {
                this.e.parentElement.appendChild(this._select);
            }
            if (this.get("sourceHide", true)) {
                if (this.e.style.display === "none") {
                    this._select.style.display = "none";
                } else if (this.e.style.visibility === "hidden") {
                    this._select.style.visibility = "hidden";
                } else {
                    this.e.style.display = "none";
                    this.e.setAttribute("data-tail-hidden", "display");
                }
            }
            this.trigger("hook", "init:after");
            this.bind(this).query("walker", [this.get("sortGroups"), this.get("sortItems")]);
            return (this.get("startOpen") && !this.get("disabled")) ? this.open() : this;
        }
        build(self) {
            if (this.trigger("hook", "build:before") !== true) {
                return this;
            }
            let cls = this.get("classNames") === true ? this.e.className : this.get("classNames");
            this._select = tail.create("DIV", (function (cls) {
                this.get("rtl") ? cls.unshift("rtl") : null;
                this.get("hideSelected") ? cls.unshift("hide-selected") : null;
                this.get("hideDisabled") ? cls.unshift("hide-disabled") : null;
                this.get("hideHidden", !0) ? cls.unshift("hide-hidden") : null;
                this.get("disabled") ? cls.unshift("disabled") : null;
                this.get("multiple") ? cls.unshift("multiple") : null;
                this.get("deselect") ? cls.unshift("deselectable") : null;
                cls.unshift(`tail-select theme-${this.get("theme").replace('-', ' scheme-').replace('.', ' ')}`);
                return cls;
            }).call(this, [].concat((!cls) ? [] : cls.split ? cls.split(" ") : cls)));
            this._select.setAttribute("tabindex", this.e.getAttribute("tabindex") || "0");
            if (this.get("width", 250)) {
                this._select.style.width = this.get("width", 250) + (isNaN(this.get("width", 250)) ? "" : "px");
            }
            this._label = tail.create("DIV", "select-label");
            this._dropdown = tail.create("DIV", `select-dropdown title-${this.get("titleOverflow", "break")}`);
            this._search = tail.create("DIV", "dropdown-search");
            this._search.innerHTML = '<input type="text" class="search-input" />';
            this._search.children[0].setAttribute("placeholder", this._e("search"));
            this._csv = tail.create("INPUT", "select-search");
            this._csv.type = "hidden";
            this._csv.name = (function (name) {
                if (name === true && !this.e.hasAttribute("data-name") && (name = this.e.name)) {
                    this.e.removeAttribute("name");
                }
                return name.split ? name : this.e.getAttribute("data-name");
            }).call(this, this.get("csvOutput", !1));
            this._select.appendChild(this._label);
            this._select.appendChild(this._dropdown);
            this.get("search") ? this._dropdown.appendChild(this._search) : null;
            this.get("csvOutput") ? this._select.appendChild(this._csv) : null;
            this.trigger("hook", "build:after");
            return this;
        }
        bind(arg) {
            if (this.trigger("hook", "bind:before", [arg]) !== true) {
                return this;
            }
            if (arg instanceof Select) {
                d.addEventListener("keydown", this.listen);
                d.addEventListener("click", this.listen);
                if (this.get("search")) {
                    this._search.children[0].addEventListener("input", this.listen);
                }
                if (this.get("sourceBind")) {
                    this.e.addEventListener("change", this.listen);
                }
            } else if (arg === null) {
                d.removeEventListener("keydown", this.listen);
                d.removeEventListener("click", this.listen);
                this._search.children[0].addEventListener("input", this.listen);
                this.e.removeEventListener("change", this.listen);
            }
            if (!(arg instanceof Event) || this.get("disabled")) {
                return this;
            }
            let stop = (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                return true;
            };
            let event = arg;
            let target = event.target;
            if (event.type === "click" && target.getAttribute("for") === this.e.id) {
                this._select.focus();
                return stop(event);
            }
            if (event.type === "input" && target === this._search.children[0]) {
                let value = target.value;
                if (value.length >= Math.max(this.get("searchMinLength", 3), 1)) {
                    return this.query("finder", [value, this.get("searchConfig", ["text", "value"]), this.get("sortSearch")]);
                } else if (this._last_query[0] !== this.options.walker) {
                    return this.query("walker", [this.get("sortGroups"), this.get("sortItems")]);
                }
            }
            if (event.type === "keydown") {
                let sel = ".dropdown-option:not(.disabled):not(.hidden)";
                let key = event.keyCode || event.which;
                let opt = this._dropdown.querySelector(".dropdown-option.hover");
                switch (key + !!this._select.classList.contains("active")) {
                    case 32:
                        if (this._select === d.activeElement) {
                            return stop(event) ? this.open() : !1;
                        }
                    default:
                        if (!this._select.classList.contains("active")) {
                            return;
                        }
                }
                switch (key) {
                    case 13:
                    case 32 + d.activeElement.tagName === "INPUT":
                        if (stop(event) && opt) {
                            let item = [opt.getAttribute("data-value"), opt.getAttribute("data-group")];
                            this.options.toggle(item, "selected");
                        }
                        return (opt && !this.get("multiple")) && !this.get("stayOpen") ? this.close() : !1;
                    case 27:
                        return stop(event) ? this.close() : !1;
                    case 38:
                    case 40:
                        let inner = this._dropdown.querySelector(".dropdown-inner");
                        let items = [].map.call(this._dropdown.querySelectorAll(sel), (i) => i);
                        let itm = null;
                        if (opt && items[items.indexOf(opt) + (key === 40 ? +1 : -1)]) {
                            itm = items[items.indexOf(opt) + (key === 40 ? +1 : -1)];
                        }
                        if (!itm && key == 40) {
                            itm = this._dropdown.querySelector(sel);
                        } else if (!itm && key == 38) {
                            itm = items[items.length - 1];
                        }
                        if (itm) {
                            (itm) ? itm.classList.add("hover") : null;
                            (opt) ? opt.classList.remove("hover") : null;
                            let pos = (function (el, pos) {
                                while ((el = el.parentElement) != inner) {
                                    pos.top += el.offsetTop;
                                }
                                return pos;
                            })(itm, { top: itm.offsetTop, height: itm.offsetHeight });
                            inner.scrollTop = Math.max(0, pos.top - (pos.height * 2));
                        }
                        return stop(event);
                }
            }
            if (event.type === "click") {
                if (this._label.contains(target)) {
                    return this.toggle();
                }
                if (!this._select.contains(target) && this.get("stayOpen") !== true) {
                    return this.close();
                }
                if (this._dropdown.contains(target)) {
                    let value, group, action;
                    do {
                        if (!target || target == d) {
                            return false;
                        }
                        value = target.getAttribute("data-value");
                        group = target.getAttribute("data-group");
                        action = target.getAttribute("data-action");
                    } while (!(action && (value || group)) && (target = target.parentElement) !== null);
                    if (!!(action && (value || group))) {
                        let args = (action === "toggle") ? [[value, group], "selected"] : [[value, group]];
                        this.options[action].apply(this.options, args);
                        if (!this.get("stayOpen")) {
                            if (this.options.count(null, true) >= (!this.get("multiple") ? 1 : this.get("multiLimit"))) {
                                return this.close();
                            }
                        }
                    }
                }
            }
            if (event.type === "change" && event.detail === void 0) {
                return stop(event) ? this.options.reload() : false;
            }
            return this.trigger("hook", "bind:after", [arg]) ? true : true;
        }
        calculate() {
            let clone = this._dropdown;
            let inner = this._dropdown.querySelector(".dropdown-inner");
            let search = this._dropdown.contains(this._search) ? this._search.clientHeight : 0;
            if (!inner) {
                return this;
            }
            let height = (function (height) {
                let temp = clone.cloneNode(true);
                temp.classList.add("cloned");
                this._select.appendChild(temp);
                if (typeof height === "string" && height.charAt(0) === ":") {
                    let off = inner.querySelector(".dropdown-option").offsetHeight;
                    let pad = parseInt(w.getComputedStyle(inner.querySelector("li:first-child")).marginTop);
                    temp.style.setProperty("max-height", (off * parseInt(height.slice(1)) + pad) + "px");
                } else {
                    temp.style.setProperty("max-height", height + (isNaN(height) ? "" : "px"));
                }
                height = (temp.offsetHeight > height) ? height : temp.offsetHeight;
                return this._select.removeChild(temp) ? height : height;
            }).call(this, (!this.get("height", 350)) ? "auto" : this.get("height", 350));
            if (typeof this.get("height") === "string" && this.get("height").charAt(0) === ":") {
                height = height + search;
            }
            let rect = this._select.getBoundingClientRect();
            let free = { top: rect.x || rect.top, bottom: w.innerHeight - (rect.top + rect.height) };
            let side = this.get("openAbove", null) || !(free.bottom >= height || free.bottom >= free.top);
            height = Math.min(height, (side ? free.top : free.bottom) - 15);
            this._select.classList[(side ? "add" : "remove")]("open-top");
            if (this._dropdown.querySelector("li.optgroup-sticky")) {
                this._spacing = this._dropdown.querySelector("li.optgroup-sticky").offsetHeight;
            }
            clone.style.maxHeight = height + "px";
            inner.style.maxHeight = height - search + "px";
            return this;
        }
        trigger(type, name, args = []) {
            if (type === "event") {
                let event = { bubbles: false, cancelable: true, detail: { args: args, self: this } };
                if (name === "change") {
                    tail.trigger(this.e, "input", event);
                    tail.trigger(this.e, "change", event);
                }
                tail.trigger(this._select, `tail::${name}`, event);
            }
            let _arg = true;
            (this.plugins.callbacks(name).concat(this.callbacks[name] || [])).forEach((handle) => {
                if (type === "filter") {
                    args = handle.apply(this, args);
                } else if (handle.apply(this, args) === false) {
                    _arg = false;
                }
            });
            return (type === "filter") ? args : _arg;
        }
        query(method, args) {
            if (this.trigger("hook", "query:before", [method, args]) !== true) {
                return this;
            }
            [method, args] = this.trigger("filter", "query", [method, args || []]);
            if (typeof method === "string") {
                method = this.options[(method in this.options) ? method : "walker"];
            }
            let head = [];
            let elem = null;
            let skip = null;
            let walk = (function (item) {
                let group = (item.parentElement instanceof HTMLOptGroupElement) ? item.parentElement.label || "#" : "#";
                [item, group] = this.trigger("filter", "query#walk", [item, group]);
                if (skip === group) {
                    return true;
                }
                if (!(head.length > 0 && head[0].getAttribute("data-group") === group)) {
                    let pass = item.parentElement instanceof HTMLOptGroupElement ? item.parentElement : null;
                    if ((elem = this.render("group", pass, [method, args])) === null) {
                        skip = group;
                        return true;
                    } else if (elem === false) {
                        return false;
                    }
                    elem.setAttribute("data-group", group);
                    head.unshift(elem);
                }
                if ((elem = this.render("item", item, [method, args])) === null) {
                    return true;
                } else if (elem === false) {
                    return false;
                }
                elem.setAttribute("data-group", group);
                elem.setAttribute("data-value", item.value || item.innerText);
                elem.setAttribute("data-action", "toggle");
                head[0].appendChild(elem);
                if (this.get("titleOverflow") === "scroll") {
                    (function (elem, self) {
                        setTimeout(function () {
                            let style = w.getComputedStyle(elem);
                            let inner = elem.clientWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight) - 17;
                            let title = elem.querySelector(".option-title");
                            if (title.scrollWidth > inner) {
                                let number = inner - title.scrollWidth - 15;
                                title.style.paddingLeft = Math.abs(number) + "px";
                                elem.style.textIndent = number + "px";
                            }
                        }, 150);
                    }(elem, this));
                }
                return true;
            }).bind(this);
            for (let item of method.apply(this.options, args)) {
                if (!walk(item)) {
                    break;
                }
            }
            let visible = "li.dropdown-option[data-value]"
                + (this.get("hideHidden", 1) ? ":not(.hidden)" : "")
                + (this.get("hideDisabled") ? ":not(.disabled)" : "")
                + (this.get("hideSelected") ? ":not(.selected)" : "");
            let root = tail.create("DIV", "dropdown-inner");
            root.addEventListener("scroll", (event) => {
                let groups = event.target.querySelectorAll("ul li.optgroup-sticky");
                for (let i = 0; i < groups.length; i++) {
                    if (groups[i].offsetTop > this._spacing) {
                        groups[i].classList.add("moving");
                    } else if (groups[i].classList.contains("moving")) {
                        groups[i].classList.remove("moving");
                    }
                }
            });
            for (let i = head.length - 1; i >= 0; i--) {
                if (head[i].querySelectorAll(visible).length > 0) {
                    root.appendChild(head[i]);
                }
            }
            if (root.innerText === "") {
                if ((elem = this.render("empty", null, [method, args])) instanceof Element) {
                    root.appendChild(elem);
                }
            }
            this.trigger("event", (root.innerText === "" ? "no" : "") + "results", [root, method, args]);
            if (root.innerText !== "" && this.get("multiple") && this.get("multiSelectAll")) {
                let actions = tail.create("SPAN", "dropdown-action");
                for (let key in { "select-all": '', "select-none": '' }) {
                    let btn = tail.create("BUTTON", key);
                    btn.setAttribute("data-action", key === 'select-all' ? 'select' : 'unselect');
                    btn.innerHTML = this._e(key === 'select-all' ? 'buttonAll' : 'buttonNone');
                    actions.appendChild(btn);
                }
                root.insertBefore(actions, root.children[0]);
            }
            let inner = this._dropdown.querySelector(".dropdown-inner");
            this._dropdown[(inner ? "replace" : "append") + "Child"]((this.trigger("filter", "dropdown", [root])[0]), inner);
            if (this._select.classList.contains("active")) {
                this.calculate();
            }
            this._last_query = [method, args];
            this.trigger("hook", "query:after", [method, args]);
            return this.updateLabel().updateCSV();
        }
        render(type, data, query) {
            let content = "";
            let types = this.trigger("filter", "render", [{
                    item: function (element, query) {
                        let li = tail.create("LI", this._cls(element, "dropdown-option"));
                        if (query[0] === this.options.finder && this.get("searchMarked", 1)) {
                            let regexp = new RegExp(`(${this.options.applyLinguisticRules(query[1][0])})`, "i");
                            li.innerHTML = element.innerHTML.replace(regexp, "<mark>$1</mark>");
                        } else {
                            li.innerHTML = element.innerHTML;
                        }
                        li.innerHTML = `<span class="option-title">${li.innerHTML}</span>`;
                        if (this.get("descriptions", 1) && element.hasAttribute("data-description")) {
                            li.innerHTML += `<span class="option-description">${element.getAttribute("data-description")}</span>`;
                        }
                        return li;
                    },
                    group: function (element, query) {
                        let ul = tail.create("UL", "dropdown-optgroup");
                        if (!element && !this.get("grouplessName")) {
                            return ul;
                        }
                        let group = element ? element.label : "#";
                        let label = element ? element.label : this.get("grouplessName");
                        ul.innerHTML = `<li class="optgroup-title${this.get("stickyGroups") ? " optgroup-sticky" : ""}"><b>${label}</b></li>`;
                        if (this.get("multiple") && this.get("multiSelectGroup", 1)) {
                            for (let key in { "select-none": '', "select-all": '' }) {
                                let btn = tail.create("BUTTON", key);
                                btn.setAttribute("data-group", group);
                                btn.setAttribute("data-action", key === 'select-all' ? 'select' : 'unselect');
                                btn.innerHTML = this._e(key === 'select-all' ? 'buttonAll' : 'buttonNone');
                                ul.children[0].appendChild(btn);
                            }
                        }
                        return ul;
                    },
                    empty: function (element, query) {
                        let li = tail.create("SPAN", "dropdown-empty");
                        li.innerHTML = this._e("empty");
                        return li;
                    }
                }])[0];
            return this.trigger("filter", `render#${type}`, [types[type].apply(this, [data, query]), data, query])[0];
        }
        update(items, trigger = true, force) {
            if (items.length === 0) {
                return this;
            }
            [items, trigger] = this.trigger("filter", "update", [items, trigger]);
            if (this.trigger("hook", "update:before", [items, trigger, force]) !== true) {
                return this;
            }
            if (trigger) {
                this.trigger("event", "change", [items, force]);
                if (this.e.querySelectorAll("option:checked") >= this.get("multiLimit", Infinity)) {
                    this.trigger("event", "limit", [items, force]);
                }
            }
            for (let opt, i = 0; i < items.length; i++) {
                let value = (items[i][0]).value.replace(/('|\\)/g, "\\$1");
                let group = (items[i][0].parentElement) ? items[i][0].parentElement.label || "#" : "#";
                let selector = `[data-value='${value}'][data-group='${group}']`;
                if ((opt = this._dropdown.querySelector(selector)) !== null) {
                    let names = opt.className.replace(/\b(selected|disabled|hidden)\b/gi, "").trim();
                    opt.className = this._cls(items[i][0], names.replace(/[ ]+/g, " "));
                }
            }
            this.updateCSV();
            this.updateLabel();
            this.trigger("hook", "update:after", [items, trigger, force]);
            return this;
        }
        updateCSV() {
            if (this.get("csvOutput")) {
                this._csv.value = this.trigger("filter", "update#csv", [this.value("csv")])[0];
            }
            return this;
        }
        updateLabel(label) {
            let value = this.value("array");
            let limit = this.get("multiLimit", Infinity);
            let string = "";
            let replace = {
                '[0]': value.length,
                '[1]': (limit === Infinity) ? "&infin;" : limit,
                '[2]': (limit === Infinity) ? this.options.count(null, !1, !1, !1) : limit - value.length
            };
            if (label === void 0) {
                switch (true) {
                    case this.get("disabled"):
                        label = "disabled";
                        break;
                    case this.options.count() === 0:
                        label = "empty" + (this._last_query[0] === "finder" ? "Search" : "");
                        break;
                    case this.get("multiple") && limit === Infinity:
                        label = (value.length === 0) ? "multiple" : "multipleList";
                        break;
                    case this.get("multiple") && limit !== Infinity:
                        label = (value.length === limit) ? "multipleLimit" : "multipleCount";
                        break;
                    case !this.get("multiple"):
                        label = (this.value("nodes")[0] && this.value("nodes")[0].innerHTML) || "single";
                        break;
                    default:
                        label = (this.get("multiple")) ? "multiple" : "single";
                        break;
                }
                if (['multiple', 'multipleCount', 'multipleList', 'single'].indexOf(label) >= 0) {
                    label = (typeof this.get("placeholder") === "string") ? this.get("placeholder") : label;
                }
            }
            let count = this.get("multiple") ? this.get("placeholderCount") : null;
            if (count !== null) {
                switch (true) {
                    case count === "count-up":
                        count = '[0]';
                        break;
                    case count === "count-down":
                        count = '[2]';
                        break;
                    case count === "limit":
                        count = '[1]';
                        break;
                    case count === "both":
                        count = '[0]/[1]';
                        break;
                    case typeof count === "function":
                        count = count.call(this, label, replace);
                        break;
                    default:
                        count = null;
                        break;
                }
            }
            if (typeof this.get("placeholder") === "function") {
                [label, count, replace] = this.get("placeholder").call(this, label, count, replace);
            }
            [string, label, count, replace] = this.trigger("filter", "update#label", [string, label, count, replace]);
            if (string === "") {
                string = (count ? `<span class="label-count">${this._e(count, replace)}</span>` : ``)
                    + (label ? `<span class="label-inner">${this._e(label, replace)}</span>` : ``);
            }
            if (string instanceof HTMLElement && string.classList.contains("select-label")) {
                this._select.replaceChild(string, this._label);
                this._label = string;
            } else {
                this._label.innerHTML = string.innerHTML ? string.innerHTML : string;
            }
            return this;
        }
        open() {
            if (this._select.classList.contains("active")) {
                return this;
            }
            this.calculate();
            this.trigger("event", "open", []);
            this._select.classList.add("active");
            if (this.get("search") && this.get("searchFocus", !0)) {
                this._search.querySelector("input").focus();
            }
            return this;
        }
        close() {
            if (!this._select.classList.contains("active")) {
                return this;
            }
            this.trigger("event", "close", []);
            this._select.classList.remove("active");
            this._dropdown.style.removeProperty("max-height");
            this._dropdown.querySelector(".dropdown-inner").style.removeProperty("max-height");
            return this;
        }
        toggle() {
            return this._select.classList.contains("active") ? this.close() : this.open();
        }
        reload(soft = true) {
            if (this.trigger("hook", "reload:before", [soft]) !== true) {
                return this;
            }
            (soft) ? this.query.apply(this, this._last_query) : this.remove().init();
            this.trigger("hook", "reload:after", [soft]);
            return this;
        }
        remove(keep) {
            if (this.trigger("hook", "remove:before", [keep]) !== true) {
                return this;
            }
            this.bind(null);
            if (this.get("csvOutput") && !this.e.hasAttribute("data-name")) {
                this.e.setAttribute("name", this._csv.name);
            }
            if (!(keep !== void 0 && keep === true)) {
                [].map.call(this.e.querySelectorAll("optgroup[data-select='add']"), function (i) {
                    i.parentElement.removeChild(i);
                });
                [].map.call(this.e.querySelectorAll("option[data-select='add']"), function (i) {
                    i.parentElement.removeChild(i);
                });
            }
            if (this.e.hasAttribute("data-tail-hidden")) {
                this.e.style.removeProperty(this.e.getAttribute("data-tail-hidden"));
                this.e.removeAttribute("data-tail-hidden");
            }
            if (this._select.parentElement) {
                this._select.parentElement.removeChild(this._select);
            }
            this.e.removeAttribute("data-tail-select");
            this.trigger("hook", "remove:after", [keep]);
            return this;
        }
        get(key, def) {
            return (key in this.con) ? this.con[key] : def;
        }
        set(key, value) {
            if (typeof key === "object") {
                for (let k in key) {
                    this.set(k, key[k]);
                }
                return this;
            }
            if (key === "disabled") {
                return this[key ? "disable" : "enable"](true);
            }
            if (key === "multiple") {
                this.e.multiple = value;
            }
            this.con[key] = value;
            return this;
        }
        enable(reload) {
            this.trigger("event", "enable", [reload]);
            this._select.classList.remove("disabled");
            this.con.disabled = this.e.disabled = false;
            return (reload === true) ? this.reload() : this;
        }
        disable(reload) {
            this.trigger("event", "disable", [reload]);
            this._select.classList.add("disabled");
            this.con.disabled = this.e.disabled = true;
            return (reload === true) ? this.reload() : this;
        }
        on(name, func) {
            name = (typeof name === "string") ? [name] : name;
            for (let i = 0; i < name.length; i++) {
                if (!(name[i] in this.callbacks)) {
                    this.callbacks[name[i]] = [];
                }
                this.callbacks[name[i]].push(func);
            }
            return this;
        }
        value(format = "auto") {
            var itm = this.options.get(null, null, true);
            switch ((format === "auto") ? (this.get("multiple") ? "array" : "csv") : format) {
                case "csv": return [].map.call(itm, (i) => i.value).join(this.get("csvSeparator", ","));
                case "array": return [].map.call(itm, (i) => i.value);
                case "nodes": return itm;
            }
            return false;
        }
    }
    Select.version = "0.6.0";
    Select.status = "beta";
    Select.__ = tail;
    Select.count = 0;
    Select.inst = {};
    Select.strings = Strings;
    Select.options = Options;
    Select.plugins = Plugins;
    
    return { select: Select, options: Options };
})(window, window.document);
export { select, options };