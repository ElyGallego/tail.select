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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

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
        Options.prototype.walker = function (orderGroups, orderItems) {
            var groups, _a, _b, _i, group;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        groups = this.getGroups(false);
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
                        _a = [];
                        for (_b in groups)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        group = _a[_i];
                        return [4, group];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        };
        Options.prototype.get = function () {
        };
        Options.prototype.getGroups = function (objects) {
            var groups = this.source.querySelectorAll("optgroup");
            return (objects) ? groups : [].map.call(groups, function (i) { return i.label; });
        };
        Options.prototype.count = function () {
        };
        Options.prototype.set = function (item, group, position, reload) {
            return this;
        };
        Options.prototype.remove = function () {
        };
        Options.prototype.reload = function () {
        };
        Options.prototype.handle = function () {
        };
        Options.prototype.selected = function (items, state) {
        };
        Options.prototype.disabled = function (items, state) {
        };
        Options.prototype.hidden = function (items, state) {
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
            return this.query("walker");
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
        Select.prototype.query = function (method, args, limit, offset) {
            this.trigger("hook", "query:before", []);
            this.trigger("hook", "query:after");
            return this;
        };
        Select.prototype.render = function () {
            return this;
        };
        Select.prototype.update = function () {
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
            }
            return null;
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
