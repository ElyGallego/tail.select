/*!
 |  rat.select - The vanilla solution to level up your HTML <select> fields.
 |  @file       dist/js/tail.select.js
 |  @version    1.0.0 - Stable
 |  @author     SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |				Lenivyy <lenivyy@pytes.net> (https://www.pytes.net)
 |  
 |  @website    https://rat.md/select
 |  @license    MIT License
 |  @copyright  Copyright © 2014 - 2020 pytesNET <info@pytes.net>
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('rat.select', factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.rat = global.rat || {}, global.rat.select = factory()));
}(this, (function () {
    "use strict";

    var version = "1.0.0";

    var status = "stable";

    if (typeof Object.assign !== "function") {
        Object.defineProperty(Object, "assign", {
            value: function assign(target, _) {
                var to = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];
                    if (nextSource != null) {
                        for (var nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            }
        });
    }
    if (typeof CustomEvent.constructor !== "function") {
        CustomEvent.constructor = function (event, params) {
            params = params || { bubbles: false, cancelable: false, detail: null };
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };
    }

    var Strings = (function () {
        function Strings(locale) {
            this.strings = Strings[locale] || Strings.en;
        }
        Strings.prototype._ = function (key, params) {
            var string = (key in this.strings) ? this.strings[key] : key;
            if (typeof params !== undefined && params.length > 0) {
                params.map(function (replace, index) {
                    var regexp = new RegExp("\[" + index + "\]", "g");
                    return string.replace(regexp, replace);
                });
            }
            return string;
        };
        Strings.en = {
            "key": "value"
        };
        return Strings;
    }());

    var Plugins = (function () {
        function Plugins(plugins) {
            this.plugins = plugins;
        }
        Plugins.add = function (name, config, hooks) {
            if (name in this.plugins) {
                return false;
            }
            this.plugins[name] = { config: config, hooks: hooks };
            return true;
        };
        Plugins.prototype.hook = function (hook) {
            for (var name_1 in this.plugins) {
                if (hook in this.plugins[name_1].hooks) ;
            }
        };
        Plugins.plugins = {};
        return Plugins;
    }());

    var Options = (function () {
        function Options(select) {
            this.select = select;
            this.source = select.source;
            [].map.call(this.source.querySelectorAll('options:not([value])'), function (option) {
                if (option.innerText !== "") {
                    option.setAttribute("value", option.innerText);
                }
            });
            if (select.get("deselect") && !select.get("multiple")) {
                var option = this.source.querySelector('option:checked');
                if (option && this.source.querySelector('option[selected]') === null) {
                    option.selected = false;
                    this.source.selectedIndex = -1;
                }
            }
        }
        Options.prototype.create = function (value, item) {
            var option = document.createElement("OPTION");
            option.value = value;
            option.innerText = item.title;
            option.selected = item.selected || false;
            option.disabled = item.disabled || false;
            option.hidden = item.hidden || false;
            if (item.description) {
                option.dataset.description = item.description;
            }
            return option;
        };
        Options.prototype.parse = function (items) {
            for (var key in items) {
                if (typeof items[key] === "string") {
                    var item = this.create(key, Object({ title: items[key] }));
                }
                else {
                    var item = this.create(key, items[key]);
                }
                this.set(item);
            }
            return this;
        };
        Options.prototype.get = function (value, group, states) {
            var format = { disabled: ":disabled", selected: ":checked", hidden: "[hidden]" };
            var selector = states ? states.map(function (state) {
                return state[0] === "!" ? ":not(" + format[state.slice(1)] + ")" : format[state];
            }) : "";
            if (typeof value === "number") {
                var nth = (value > 0) ? ":nth-child" : ":nth-last-child";
                selector = "option" + nth + "(" + Math.abs(value) + ")" + selector;
            }
            else if (typeof value === "string" || !value) {
                selector = "option" + (!value ? "" : "[value=\"" + value + "\"]") + selector;
            }
            else {
                return [];
            }
            if (!group && group !== false) {
                return this.source.querySelectorAll(selector);
            }
            else if (typeof group === "string") {
                return this.source.querySelectorAll("optgroup[label=\"" + group + "\"] " + selector);
            }
            else if (group === false) {
                selector = "select[data-rat-select=\"" + this.source.dataset.ratSelect + "\"] > " + selector;
                return this.source.parentElement.querySelectorAll(selector);
            }
            return [];
        };
        Options.prototype.getGroups = function (objects) {
            var groups = this.source.querySelectorAll("optgroup");
            return (objects) ? groups : [].map.call(groups, function (i) { return i.label; });
        };
        Options.prototype.count = function (group, states) {
            if (arguments.length === 0) {
                return this.source.options.length;
            }
            var result = this.get(null, group, states);
            return result ? result.length : 0;
        };
        Options.prototype.set = function (item, group, position, reload) {
            var _this = this;
            if (!(item instanceof HTMLOptionElement)) {
                [].map.call(item, function (el, i) { return _this.set(el, group, (position < 0) ? -1 : (position + i), !1); });
                return (reload && this.select.reload()) ? this : this;
            }
            if (group === void 0 || group === null) {
                group = item.parentElement.label || false;
            }
            if (typeof group === "string") {
                var optgroup = this.source.querySelector("optgroup[label=\"" + group + "\"]");
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
                var selector = "select[data-rat-select=\"" + this.source.dataset.ratSelect + "\"] > option";
                var options = this.source.parentElement.querySelectorAll(selector);
                var calc = Math.min(position < 0 ? options.length : position, options.length);
                if (this.source.children.length === calc || !options[calc - 1].nextElementSibling) {
                    this.source.appendChild(item);
                }
                else {
                    this.source.insertBefore(item, options[calc - 1].nextElementSibling || this.source.children[0]);
                }
            }
            item.dataset.select = "add";
            return (reload && this.select.reload()) ? this : this;
        };
        Options.prototype.remove = function (items, reload) {
            if (items instanceof HTMLOptionElement) {
                items = [items];
            }
            [].map.call(items, function (item) {
                item.parentElement.removeChild(item);
            });
            return (reload && this.select.reload) ? this : this;
        };
        Options.prototype.handle = function (items, states) {
            var _this = this;
            if (items instanceof HTMLOptionElement) {
                items = [items];
            }
            var result = [];
            var limit = this.select.get("multiLimit", -1);
            [].map.call(items, function (item) {
                var changes = {};
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
                    if (states.selected && _this.source.multiple && limit >= 0 && limit <= _this.count(null, [":selected"])) {
                        break;
                    }
                    if (!states.selected && !_this.source.multiple && _this.select.get("deselect", !1)) {
                        break;
                    }
                    changes.selected = item.selected = states.selected;
                    if (!_this.source.multiple && !states.selected) {
                        _this.source.selectedIndex = -1;
                    }
                    break;
                }
                if (Object.keys(changes).length > 0) {
                    result.push([item, changes]);
                }
            });
            return this.select.update(result) ? this : this;
        };
        Options.prototype.selected = function (items, state) {
            return this.handle(items, { selected: state });
        };
        Options.prototype.disabled = function (items, state) {
            return this.handle(items, { disabled: state });
        };
        Options.prototype.hidden = function (items, state) {
            return this.handle(items, { hidden: state });
        };
        return Options;
    }());

    var Select = (function () {
        function Select(source, config, options) {
            this.source = source;
            this.config = config;
            this.options = new (options || Options)(this);
            this.locale = new Strings(config.locale || "en");
            this.plugins = new Plugins(config.plugins || {});
            this.events = config.on || {};
            this.config.multiple = this.source.multiple = config.multiple || source.multiple;
            this.config.disabled = this.source.disabled = config.disabled || source.disabled;
            this.config.required = this.source.required = config.required || source.required;
            var placeholder = config.placeholder || source.dataset.placeholder || null;
            if (!placeholder || source.options[0].value === "") {
                placeholder = source.options[0].innerText;
            }
            this.config.placeholder = placeholder;
            if ((config.rtl || null) === null) {
                this.config.rtl = ['ar', 'fa', 'he', 'mdr', 'sam', 'syr'].indexOf(config.locale || "en") >= 0;
            }
            if ((config.theme || null) === null) {
                var evaluate = document.createElement("SPAN");
                evaluate.className = "rat-select-theme-name";
                document.body.appendChild(evaluate);
                this.config.theme = window.getComputedStyle(evaluate, ":after").content.replace(/"/g, "");
                document.body.removeChild(evaluate);
            }
            source.dataset.ratSelect = Select.inst.length.toString();
            Select.inst[Select.inst.length++] = this;
            this.init();
        }
        Select.prototype.init = function () {
            this.trigger("hook", "init:before");
            if (typeof this.config.items !== "undefined") {
                var items = this.config.items;
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
        };
        Select.prototype.build = function () {
            var _this = this;
            var cls = this.get("classNames") === true ? this.source.className : this.get("classNames", "");
            this.select = document.createElement("DIV");
            this.select.className = (function (cls) {
                _this.get("rtl") ? cls.unshift("rtl") : null;
                _this.get("hideSelected") ? cls.unshift("hide-selected") : null;
                _this.get("hideDisabled") ? cls.unshift("hide-disabled") : null;
                _this.get("hideHidden", !0) ? cls.unshift("hide-hidden") : null;
                _this.get("disabled") ? cls.unshift("disabled") : null;
                _this.get("required") ? cls.unshift("required") : null;
                _this.get("multiple") ? cls.unshift("multiple") : null;
                _this.get("deselect") ? cls.unshift("deselect") : null;
                cls.unshift("rat-select theme-" + _this.get("theme").replace("-", " scheme-").replace(".", " "));
                return cls.filter(function (item) { return item.length > 0; }).join(" ");
            })(typeof cls === "string" ? cls.split(" ") : cls);
            this.select.tabIndex = this.source.tabIndex || 0;
            this.select.dataset.ratSelect = this.source.dataset.ratSelect;
            var width = this.get("width", 250);
            if (width !== null) {
                this.select.style.width = width + (isNaN(width) ? "" : "px");
            }
            this.label = document.createElement("LABEL");
            this.label.className = "select-label";
            this.label.innerHTML = "<span class=\"label-inner\">Test Placeholder</span>";
            this.dropdown = document.createElement("DIV");
            this.dropdown.className = "select-dropdown overflow-" + this.get("titleOverflow", "clip");
            this.dropdown.innerHTML = "<div class=\"dropdown-inner\"></div>";
            this.csv = document.createElement("INPUT");
            this.csv.className = "select-search";
            this.csv.name = (function (name) {
                if (name === true) {
                    name = _this.source.dataset.name || _this.source.name || "";
                }
                return name === false ? "" : name;
            })(this.get("csvOutput", !1));
            this.select.appendChild(this.label);
            this.select.appendChild(this.dropdown);
            this.get("csvOutput") ? this.select.appendChild(this.csv) : null;
            return this;
        };
        Select.prototype.bind = function () {
            var handle = this.handle.bind(this);
            document.addEventListener("keydown", this.handle);
            document.addEventListener("click", this.handle);
            if (this.get("sourceBind")) {
                this.source.addEventListener("change", this.handle);
            }
            return this;
        };
        Select.prototype.handle = function (event) {
            console.log(event);
        };
        Select.prototype.trigger = function (type, name, args) {
            if (type === "event") {
                var data = { bubbles: false, cancelable: true, detail: { args: args, select: this } };
                var event_1 = new CustomEvent("rat::" + name, data);
                this.select.dispatchEvent(event_1);
                if (name === "change") {
                    var input = new CustomEvent("input", data);
                    var event_2 = new CustomEvent("change", data);
                    this.source.dispatchEvent(input);
                    this.source.dispatchEvent(event_2);
                }
            }
            return null;
        };
        Select.prototype.query = function (query) {
            var _this = this;
            this.trigger("hook", "query:before", []);
            query = typeof query !== "function" ? this.get("query", null) : null;
            if (!query) {
                query = function () { return _this.options.get(); };
            }
            var items = query.call(this);
            console.log(items);
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                console.log(item);
            }
            this.trigger("hook", "query:after");
            return this;
        };
        Select.prototype.render = function () {
            return this;
        };
        Select.prototype.update = function (changes) {
            return this;
        };
        Select.prototype.open = function () {
            if (this.select.classList.contains("active")) {
                return this;
            }
            this.select.classList.add("active");
            this.trigger("event", "open", []);
            return this;
        };
        Select.prototype.close = function () {
            if (!this.select.classList.contains("active")) {
                return this;
            }
            this.select.classList.remove("active");
            this.trigger("event", "close", []);
            return this;
        };
        Select.prototype.reload = function (hard) {
            return this;
        };
        Select.prototype.remove = function () {
            return this;
        };
        Select.prototype.value = function (format) {
            if (typeof format === 'undefined' || format === 'auto') {
                format = this.source.multiple ? 'array' : 'csv';
            }
            switch (format) {
                case 'csv': return null;
                case 'array': return null;
                case 'node': return null;
                default: return null;
            }
        };
        Select.prototype.get = function (key, def) {
            return (key in this.config) ? this.config[key] : def;
        };
        Select.prototype.set = function (key, value, reload) {
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
        };
        Select.prototype.enable = function (reload) {
            this.config.disabled = this.source.disabled = false;
            this.select.classList.remove("disabled");
            return (reload) ? this.reload() : this;
        };
        Select.prototype.disable = function (reload) {
            this.config.disabled = this.source.disabled = true;
            this.select.classList.add("disabled");
            return (reload) ? this.reload() : this;
        };
        Select.prototype.on = function (name, callback) {
            var _this = this;
            name.split(",").map(function (event) {
                _this.events[event] = _this.events[event] || [];
                _this.events[event].push(callback);
            });
            return this;
        };
        Select.inst = {
            length: 0
        };
        Select.strings = Strings;
        Select.plugins = Plugins;
        return Select;
    }());

    function RatSelect(selector, config, options) {
        var _return = function (source) {
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

    return RatSelect;

})));
//# sourceMappingURL=rat.select.js.map
