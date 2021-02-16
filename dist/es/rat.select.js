/*!
 |  rat.select - The vanilla solution to level up your HTML <select> fields.
 |  @file       dist/es/rat.select.js
 |  @version    1.0.0 - RC.1
 |  @author     SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |				Lenivyy <lenivyy@pytes.net> (https://www.pytes.net)
 |  
 |  @website    https://rat.md/select
 |  @license    MIT License
 |  @copyright  Copyright © 2014 - 2021 pytesNET <info@pytes.net>
 */
"use strict";

var version = "1.0.0-rc.1";

var status = "rc.1";

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
    constructor(plugins, select) {
        this.plugins = {};
        for (let key in plugins) {
            if (Plugins.plugins[key]) {
                this.plugins[key] = new Plugins.plugins[key](select);
            }
        }
    }
    static add(name, pluginClass) {
        if (name in this.plugins) {
            return false;
        }
        this.plugins[name] = pluginClass;
        return true;
    }
    methods(method) {
        let cbs = [];
        for (let name in this.plugins) {
            if (method in this.plugins[name]) {
                cbs.push(this.plugins[name][method]);
            }
        }
        return cbs;
    }
}
Plugins.plugins = {};

class Options {
    constructor(select) {
        this.ungrouped = "#";
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
        if (!group) {
            return this.source.querySelectorAll(selector);
        }
        else if (group === this.ungrouped) {
            selector = `select[data-rat-select="${this.source.dataset.ratSelect}"] > ${selector}`;
            return this.source.parentElement.querySelectorAll(selector);
        }
        else if (typeof group === "string") {
            return this.source.querySelectorAll(`optgroup[label="${group}"] ${selector}`);
        }
        return [];
    }
    getGroups(objects) {
        let groups = this.source.querySelectorAll("optgroup");
        return (objects) ? groups : [].map.call(groups, (i) => i.label);
    }
    count(group, states) {
        console.log(this.source.options);
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
        position = typeof position === "number" ? position : -1;
        if (group === void 0 || group === null) {
            group = item.parentElement ? item.parentElement.label || "#" : "#";
        }
        if (typeof group === "string" && group !== this.ungrouped) {
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
        if (group === this.ungrouped) {
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
        this.plugins = new Plugins(Object.assign({}, config.plugins || {}), this);
        this.events = ((events) => {
            for (let event in events) {
                events[event] = [events[event]];
            }
            return events;
        })(Object.assign({}, config.on || {}));
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
        this.build();
        this.bind();
        if (this.get("sourceHide", true)) {
            this.source.style.display = "none";
        }
        if (this.source.nextElementSibling) {
            this.source.parentElement.insertBefore(this.select, this.source.nextElementSibling);
        }
        else {
            this.source.parentElement.appendChild(this.select);
        }
        this.updateLabel();
        this.trigger("hook", "init:after");
        this.query();
        if (this.get("startOpen") && !this.get("disabled")) {
            return this.open();
        }
        else if (this.source.autofocus && !this.get("disabled")) {
            return this.focus();
        }
        return this;
    }
    build() {
        if (this.trigger("hook", "build:before") === false) {
            return this;
        }
        let cls = this.get("classNames") === true ? this.source.className : this.get("classNames", "");
        this.select = document.createElement("DIV");
        this.select.className = ((cls) => {
            let _l = ["rtl", "hideSelected", "hideDisabled", "hideHidden", "disabled", "required", "multiple", "deselect"];
            _l.map((item) => {
                if (this.get(item, item === "hideHidden")) {
                    cls.unshift(item.replace(/[A-Z]/, (char) => `-${char.toLowerCase()}`));
                }
            });
            cls.unshift(`rat-select theme-${this.get("theme").replace("-", " scheme-").replace(".", " ")}`);
            return cls.join(" ").trim();
        })(typeof cls === "string" ? cls.split(" ") : cls);
        this.select.tabIndex = this.source.tabIndex || 1;
        this.select.dataset.ratSelect = this.source.dataset.ratSelect;
        let width = this.get("width", 250);
        if (width !== null) {
            this.select.style.width = width + (isNaN(width) ? "" : "px");
        }
        this.label = document.createElement("LABEL");
        this.label.className = "select-label";
        this.label.innerHTML = `<div class="label-placeholder"></div>`;
        this.dropdown = document.createElement("DIV");
        this.dropdown.className = `select-dropdown overflow-${this.get("titleOverflow", "clip")}`;
        this.dropdown.innerHTML = `<div class="dropdown-inner"></div>`;
        this.csv = document.createElement("INPUT");
        this.csv.className = "select-search";
        this.csv.name = ((name) => {
            if (name === true) {
                name = this.source.name || "";
            }
            return name === false ? "" : name;
        })(this.get("csvOutput", !1));
        this.select.appendChild(this.label);
        this.select.appendChild(this.dropdown);
        this.get("csvOutput") ? this.select.appendChild(this.csv) : null;
        this.trigger("hook", "build:after");
        return this;
    }
    calculate() {
        let clone = this.dropdown;
        let offset = 0;
        let height = ((height) => {
            let temp = clone.cloneNode(true);
            temp.classList.add("cloned");
            this.select.appendChild(temp);
            if (typeof height === "string" && height.charAt(0) === ":") {
                let len = parseInt(height.slice(1));
                let count = 0;
                let items = [].slice.call(clone.querySelectorAll("li"));
                for (let c = 0, i = 0; i < items.length; i++) {
                    if (items[i].offsetHeight > 0) {
                        count += items[i].offsetHeight;
                        if (c++ >= len) {
                            break;
                        }
                    }
                }
                temp.style.maxHeight = count + "px";
                height = count;
            }
            else {
                temp.style.maxHeight = height + (isNaN(height) ? "" : "px");
                height = temp.offsetHeight > height ? height : temp.offsetHeight;
            }
            offset = temp.querySelector(".dropdown-inner").offsetTop;
            return this.select.removeChild(temp) ? height + offset : height + offset;
        })((!this.get("height", 350)) ? "auto" : this.get("height", 350));
        let rect = this.select.getBoundingClientRect();
        let free = { top: rect.top, bottom: window.innerHeight - (rect.top + rect.height) };
        let side = this.get("openAbove", null) || !(free.bottom >= height || free.bottom >= free.top);
        height = Math.min(height, (side ? free.top : free.bottom) - 15);
        this.select.classList[side ? "add" : "remove"]("open-top");
        clone.style.maxHeight = height + "px";
        clone.querySelector(".dropdown-inner").style.maxHeight = height - offset + "px";
        return this;
    }
    bind() {
        if (!this.handler) {
            this.handler = this.handle.bind(this);
        }
        if (this.trigger("hook", "bind:before") === false) {
            return this;
        }
        document.addEventListener("keydown", this.handler);
        document.addEventListener("click", this.handler);
        if (this.get("sourceBind")) {
            this.source.addEventListener("change", this.handler);
        }
        this.trigger("hook", "bind:after");
        return this;
    }
    handle(event) {
        if (this.trigger("hook", "handle:before", [event]) === false) {
            return this;
        }
        if (!(event instanceof Event) || this.get("disabled")) {
            return this;
        }
        let target = event.target;
        if (event.type === "keydown") {
            if (document.activeElement !== this.select) {
                return;
            }
            let key = event.keyCode;
            let sel = ".dropdown-option:not(.disabled):not(.hidden)";
            if (key === 32 && !this.select.classList.contains("active")) {
                return this.open();
            }
            else if (!this.select.classList.contains("active")) {
                return;
            }
            switch (key) {
                case 13:
                case 32:
                    let itm = this.dropdown.querySelector(".dropdown-option.hover");
                    if (itm) {
                        this.options.selected(this.options.get(itm.dataset.value, itm.dataset.group));
                        return !this.get("stayOpen") && !this.get("multiple") ? this.close() : 1;
                    }
                    return;
                case 27:
                    return this.close();
                case 38:
                case 40:
                    let items = this.dropdown.querySelectorAll(sel);
                    let item = null;
                    let opt = [].slice.call(items).indexOf(this.dropdown.querySelector(".dropdown-option.hover"));
                    if (opt >= 0 && items[opt + (key > 38 ? +1 : -1)]) {
                        item = items[opt + (key > 38 ? +1 : -1)];
                    }
                    if (!item) {
                        item = items[key > 38 ? 0 : items.length - 1];
                    }
                    if (item) {
                        item.classList.add("hover");
                        (items[opt]) ? items[opt].classList.remove("hover") : 0;
                        let pos = ((el, pos) => {
                            while ((el = el.parentElement) !== this.dropdown) {
                                pos.top += el.offsetTop;
                            }
                            return pos;
                        })(item, { top: item.offsetTop, height: item.offsetHeight });
                        this.dropdown.scrollTop = Math.max(0, pos.top - (pos.height * 2));
                    }
                    return;
            }
        }
        if (event.type === "click") {
            if (target === this.label || this.label.contains(target)) {
                return this.toggle();
            }
            if (target.getAttribute("for") === this.source.id) {
                return this.focus();
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
        if (event.type === "change" && !(event instanceof CustomEvent)) {
            [].map.call(this.select.querySelectorAll(".dropdown-option.active"), (item) => {
                item.classList.remove("active");
            });
            let changes = [];
            [].map.call(this.source.querySelectorAll("option:checked"), (item) => changes.push([item, { selected: true }]));
            return this.update(changes, false);
        }
        this.trigger("hook", "handle:after", [event]);
        return this;
    }
    trigger(type, name, args) {
        if (type === "event") {
            let data = { bubbles: false, cancelable: true, detail: { args: args, select: this } };
            let event = new CustomEvent(`rat::${name}`, data);
            var cancelled = this.select.dispatchEvent(event) || this.source.dispatchEvent(event);
            if (name === "change") {
                let input = new CustomEvent("input", data);
                let event = new CustomEvent("change", data);
                this.source.dispatchEvent(input);
                this.source.dispatchEvent(event);
            }
        }
        let _arg = true;
        let callbacks = this.plugins.methods(name).concat(this.events[name] || []);
        callbacks.map((cb) => {
            if (type === "filter") {
                args = cb.apply(this, args);
            }
            else if (cb.apply(this, args) === false) {
                _arg = false;
            }
        });
        return (type === "hook") ? _arg : ((type === "filter") ? args : cancelled);
    }
    query(query, args) {
        if (this.trigger("hook", "query:before") === false) {
            return this;
        }
        query = typeof query === "function" ? query : this.get("query", () => this.options.get());
        query = this.trigger("filter", "query", [query])[0];
        let el = null;
        let skip = void 0;
        let head = [];
        let items = query.apply(this, args || []);
        for (let item of items) {
            let group = item.parentElement instanceof HTMLOptGroupElement ? item.parentElement.label : null;
            [item, group] = this.trigger("filter", "walk", [item, group]);
            if (this.get("hideEmpty", true) && item.value === "") {
                continue;
            }
            if (group === skip) {
                continue;
            }
            if (!(head.length > 0 && head[0].dataset.group === (!group ? this.options.ungrouped : group))) {
                let arg = item.parentElement instanceof HTMLOptGroupElement ? item.parentElement : null;
                if (!arg) {
                    arg = document.createElement("OPTGROUP");
                }
                if ((el = this.render(arg)) === null) {
                    skip = group;
                    continue;
                }
                else if (el === false) {
                    break;
                }
                head.unshift(el);
            }
            if ((el = this.render(item)) === null) {
                continue;
            }
            else if (el === false) {
                break;
            }
            head[0].appendChild(el);
        }
        let root = this.dropdown.querySelector(".dropdown-inner");
        let clone = root.cloneNode();
        head.reverse().map((item) => clone.appendChild(item));
        this.dropdown.replaceChild(clone, root);
        this.dropdown.querySelector(".dropdown-inner").className = "dropdown-inner";
        if (this.get("titleOverflow") === "scroll") {
            [].map.call(this.dropdown.querySelectorAll(".dropdown-option"), (el) => {
                let width = el.clientWidth - el.querySelector(".option-title").offsetLeft;
                let scroll = el.querySelector(".option-title").scrollWidth;
                if (scroll > width) {
                    el.style.textIndent = width - scroll + "px";
                    el.querySelector(".option-title").style.marginLeft = scroll - width + "px";
                }
            });
        }
        if (this.select.classList.contains("active")) {
            this.calculate();
        }
        this.trigger("hook", "query:after");
        return this;
    }
    render(element) {
        var _a;
        let tag = element.tagName.toLowerCase();
        let output = document.createElement(tag === "option" ? "LI" : "OL");
        let classes = (item) => {
            let selected = (this.get("multiple") && item.hasAttribute("selected")) || item.selected;
            return ((selected ? " selected" : "") + (item.disabled ? " disabled" : "") + (item.hidden ? " hidden" : "")).trim();
        };
        if (tag === "option") {
            output.className = "dropdown-option " + classes(element);
            output.innerHTML = `<span class="option-title">${element.innerHTML}</span>`;
            output.dataset.group = ((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.label) || this.options.ungrouped;
            output.dataset.value = element.value;
            output.dataset.action = "toggle";
            if (element.dataset.description) {
                output.innerHTML += `<span clasS="option-description">${element.dataset.description}</span>`;
            }
        }
        else {
            let label = element.label || this.get("ungroupedLabel", null) || "";
            output.className = `dropdown-optgroup${this.get("stickyGroups") ? " optgroup-sticky" : ""}`;
            output.innerHTML = `<li class="optgroup-title">${label}</li>`;
            output.dataset.group = element.label || this.options.ungrouped;
            if (this.get("multiple") && this.get("multiSelectGroup", 1)) {
                for (let item of ['buttonAll', 'buttonNone']) {
                    let btn = document.createElement("BUTTON");
                    btn.dataset.action = (item === "buttonAll" ? "select" : "unselect");
                    btn.dataset.group = output.dataset.group;
                    btn.innerHTML = this.locale._(item);
                    output.querySelector(".optgroup-title").appendChild(btn);
                }
            }
        }
        return this.trigger("filter", `render#${tag}`, [output, element, tag])[0];
    }
    update(changes, skipEvents) {
        if (changes.length === 0) {
            return this;
        }
        if (this.trigger("hook", "update:before", [changes, skipEvents]) !== true) {
            return this;
        }
        if (typeof skipEvents === "boolean" && skipEvents) {
            this.trigger("event", "change", [changes]);
            if (this.source.multiple && this.get("multiLimit") > 0) {
                if (this.options.count(null, ["selected"]) >= this.get("multiLimit")) {
                    this.trigger("event", "limit", [changes]);
                }
            }
        }
        [].map.call(changes, (dataset) => {
            let [option, change] = dataset;
            let value = option.value.replace(/('|\\)/g, "\\$1");
            let group = option.parentElement.label ? option.parentElement.label : this.options.ungrouped;
            let item = this.dropdown.querySelector(`li[data-value="${value}"][data-group="${group}"]`);
            if (item) {
                for (let key in change) {
                    item.classList[change[key] ? "add" : "remove"](key);
                }
            }
        });
        this.trigger("hook", "update:after", [changes, skipEvents]);
        return this.updateCSV().updateLabel();
    }
    updateCSV() {
        let csvValue = this.trigger("filter", "update#csv", [this.value("csv")])[0];
        if (this.get("csvOutput") && csvValue) {
            this.csv.value = csvValue;
        }
        return this;
    }
    updateLabel(label) {
        let value = this.value("array");
        let limit = this.get("multiLimit");
        if (!label && typeof this.get("placeholder") === "function") {
            label = this.get("placeholder").call(this);
        }
        if (!label) {
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
                label = this.source.multiple ? "multiple" : "single";
            }
        }
        let counter = this.source.multiple ? this.get("placeholderCount", false) : false;
        if (counter) {
            let selected = this.options.count(null, ["selected"]);
            let count = this.options.count(null, ["!disabled", "!hidden"]);
            let max = limit < 0 ? count : limit;
            counter = counter === true ? "count-up" : counter;
            switch (counter) {
                case "count-up":
                    counter = selected;
                    break;
                case "count-down":
                    counter = limit - selected;
                    break;
                case "limit":
                    counter = max;
                    break;
                case "both":
                    counter = `${selected}/${max}`;
                    break;
            }
            if (typeof counter === "function") {
                counter = counter.call(this);
            }
        }
        let [pl, cl] = this.trigger("filter", "update#placeholder", [this.locale._(label, [value.length]), counter]);
        let placeholder = this.label.querySelector(".label-placeholder");
        if (pl && placeholder) {
            placeholder.innerHTML = `${cl ? `<span class="label-count">${cl}</span>` : ``}${pl}`;
        }
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
        if (this.trigger("hook", "reload:before", [hard]) !== true) {
            return this;
        }
        (hard) ? this.remove().init() : this.query();
        this.trigger("hook", "reload:after", [hard]);
        return this;
    }
    remove(keep) {
        if (this.trigger("hook", "remove:before", [keep]) !== true) {
            return this;
        }
        if (!keep) {
            [].map.call(this.source.querySelectorAll("optgroup[data-select='add']"), (item) => {
                item.parentElement.removeChild(item);
            });
            [].map.call(this.source.querySelectorAll("option[data-select='add']"), (item) => {
                item.parentElement.removeChild(item);
            });
        }
        if (this.get("sourceHide")) {
            this.source.style.removeProperty("display");
            this.source.style.removeProperty("visibility");
        }
        if (this.select.parentElement) {
            this.select.parentElement.removeChild(this.select);
        }
        this.source.removeAttribute("data-rat-select");
        this.trigger("hook", "remove:after", [keep]);
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
        if (key.indexOf(".") > 0) {
            let [name, config] = key.split(".");
            let plugin = this.config.plugins[name];
            return (plugin && plugin[config]) ? plugin[config] : def;
        }
        return (key in this.config) ? this.config[key] : def;
    }
    set(key, value, reload) {
        if (key.indexOf(".") > 0) {
            let [name, config] = key.split(".");
            let plugin = this.config.plugins[name];
            if (plugin) {
                plugin[config] = value;
            }
            return (reload) ? this.reload() : this;
        }
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
        this.trigger("event", "enable", [reload]);
        this.config.disabled = this.source.disabled = false;
        this.select.classList.remove("disabled");
        return (reload) ? this.reload() : this;
    }
    disable(reload) {
        this.trigger("event", "disable", [reload]);
        this.config.disabled = this.source.disabled = true;
        this.select.classList.add("disabled");
        return (reload) ? this.reload() : this;
    }
    focus() {
        this.select.focus();
        return this;
    }
    state(state, status) {
        if (typeof status === "undefined") {
            return this.select.classList.contains(`state-${state}`);
        }
        status = status === null ? !this.select.classList.contains(`state-${state}`) : status;
        this.select.classList[status ? "add" : "remove"](`state-${state}`);
        return this;
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
