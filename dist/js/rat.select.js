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

    /*
     |  ASSIGN POLYFILL
     |  @target     IE
     |  @source     https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
     */
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
    /*
     |  CUSTOM EVENT POLYFILL
     |  @target     IE
     |  @source     https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
     */
    if (typeof CustomEvent.constructor !== "function") {
        CustomEvent.constructor = function (event, params) {
            params = params || { bubbles: false, cancelable: false, detail: null };
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };
    }

    var Strings = /** @class */ (function () {
        /*
         |  CORE :: CONSTRUCTOR
         */
        function Strings(locale) {
            this.strings = Strings[locale] || Strings.en;
        }
        /*
         |  CORE :: TRANSLATE STRING
         */
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
        /*
         |  STATIC :: DEFAULT LOCALE
         */
        Strings.en = {
            "key": "value"
        };
        return Strings;
    }());

    var Plugins = /** @class */ (function () {
        /*
         |  CORE :: CONSTRUCTOR
         */
        function Plugins(plugins) {
            this.plugins = plugins;
        }
        /*
         |  STATIC :: REGSTER A PLUGIN
         */
        Plugins.add = function (name, config, hooks) {
            if (name in this.plugins) {
                return false;
            }
            this.plugins[name] = { config: config, hooks: hooks };
            return true;
        };
        /*
         |  CORE :: RETURN HOOKs
         */
        Plugins.prototype.hook = function (hook) {
            var cbs = [];
            for (var name_1 in this.plugins) {
                if (hook in this.plugins[name_1].hooks) {
                    cbs.push(this.plugins[name_1].hooks[hook]);
                }
            }
            return cbs;
        };
        /*
         |  STATIC :: PLUGIN OBJECTs
         */
        Plugins.plugins = {};
        return Plugins;
    }());

    var Options = /** @class */ (function () {
        /*
         |  CORE :: CONSTRUCTOR
         */
        function Options(select) {
            this.select = select;
            this.source = select.source;
            // Prepare Source Select
            [].map.call(this.source.querySelectorAll('options:not([value])'), function (option) {
                if (option.innerText !== "") {
                    option.setAttribute("value", option.innerText);
                }
            });
            // Prepare Deselectability
            if (select.get("deselect") && !select.get("multiple")) {
                var option = this.source.querySelector('option:checked');
                if (option && this.source.querySelector('option[selected]') === null) {
                    option.selected = false;
                    this.source.selectedIndex = -1;
                }
            }
        }
        /*
         |  HELPER :: CREATE A NEW OPTION
         */
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
        /*
         |  HELPER :: PARSE OPTION OBJECT
         */
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
        /*
         |  API :: GET ONE OR MORE OPTIONs
         */
        Options.prototype.get = function (value, group, states) {
            var format = { disabled: ":disabled", selected: ":checked", hidden: "[hidden]" };
            // State Selector
            var selector = states ? states.map(function (state) {
                return state[0] === "!" ? ":not(" + format[state.slice(1)] + ")" : format[state];
            }) : "";
            // Option Selector
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
            // Select & Return
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
        /*
         |  API :: GET ONE OR MORE GROUPs
         */
        Options.prototype.getGroups = function (objects) {
            var groups = this.source.querySelectorAll("optgroup");
            return (objects) ? groups : [].map.call(groups, function (i) { return i.label; });
        };
        /*
         |  API :: COUNT OPTIONs
         */
        Options.prototype.count = function (group, states) {
            if (arguments.length === 0) {
                return this.source.options.length;
            }
            var result = this.get(null, group, states);
            return result ? result.length : 0;
        };
        /*
         |  API :: SET A NEW OPTION
         */
        Options.prototype.set = function (item, group, position, reload) {
            var _this = this;
            if (!(item instanceof HTMLOptionElement)) {
                [].map.call(item, function (el, i) { return _this.set(el, group, (position < 0) ? -1 : (position + i), !1); });
                return (reload && this.select.reload()) ? this : this;
            }
            // Check Group
            if (group === void 0 || group === null) {
                group = item.parentElement.label || false;
            }
            // Add to Group
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
            // Add to Select
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
            // Return
            item.dataset.select = "add";
            return (reload && this.select.reload()) ? this : this;
        };
        /*
         |  API :: REMOVE ONE OR MORE OPTION
         */
        Options.prototype.remove = function (items, reload) {
            if (items instanceof HTMLOptionElement) {
                items = [items];
            }
            [].map.call(items, function (item) {
                item.parentElement.removeChild(item);
            });
            return (reload && this.select.reload) ? this : this;
        };
        /*
         |  PUBLIC :: OPTION STATEs
         */
        Options.prototype.handle = function (items, states) {
            var _this = this;
            if (items instanceof HTMLOptionElement) {
                items = [items];
            }
            var result = [];
            var limit = this.select.get("multiLimit", -1);
            [].map.call(items, function (item) {
                var changes = {};
                // Handle Disabled
                if (states.hasOwnProperty("disabled") && states.disabled !== item.disabled) {
                    changes.disabled = item.disabled = states.disabled;
                }
                // Handle Hidden
                if (states.hasOwnProperty("hidden") && states.hidden !== item.hidden) {
                    changes.hidden = item.hidden = states.hidden;
                }
                // Handle Selected
                while (states.hasOwnProperty("selected") && states.selected !== item.selected) {
                    if (item.disabled || item.hidden) {
                        break; // <option> is disabled or hidden
                    }
                    if (states.selected && _this.source.multiple && limit >= 0 && limit <= _this.count(null, [":selected"])) {
                        break; // Too many <option>s are selected
                    }
                    if (!states.selected && !_this.source.multiple && _this.select.get("deselect", !1)) {
                        break; // Non-Deselectable single <select>
                    }
                    changes.selected = item.selected = states.selected;
                    if (!_this.source.multiple && !states.selected) {
                        _this.source.selectedIndex = -1;
                    }
                    break; // Done
                }
                // Append Changes
                if (Object.keys(changes).length > 0) {
                    result.push([item, changes]);
                }
            });
            return this.select.update(result) ? this : this;
        };
        /*
         |  PUBLIC :: OPTION STATEs <ALIASES>
         */
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

    var Select = /** @class */ (function () {
        /*
         |  CORE :: CONSTRUCTOR
         */
        function Select(source, config, options) {
            this.source = source;
            this.config = config;
            this.options = new (options || Options)(this);
            this.locale = new Strings(config.locale || "en");
            this.plugins = new Plugins(config.plugins || {});
            this.events = config.on || {};
            // Init States
            this.config.multiple = this.source.multiple = config.multiple || source.multiple;
            this.config.disabled = this.source.disabled = config.disabled || source.disabled;
            this.config.required = this.source.required = config.required || source.required;
            // Init Placeholder
            var placeholder = config.placeholder || source.dataset.placeholder || null;
            if (!placeholder || source.options[0].value === "") {
                placeholder = source.options[0].innerText;
            }
            this.config.placeholder = placeholder;
            // Init RTL
            if ((config.rtl || null) === null) {
                this.config.rtl = ['ar', 'fa', 'he', 'mdr', 'sam', 'syr'].indexOf(config.locale || "en") >= 0;
            }
            // Init Theme
            if ((config.theme || null) === null) {
                var evaluate = document.createElement("SPAN");
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
        Select.prototype.init = function () {
            if (this.trigger("hook", "init:before") === false) {
                return this;
            }
            // Init Options
            if (typeof this.config.items !== "undefined") {
                var items = this.config.items;
                this.options.parse(typeof items === "function" ? items.call(this, this.options) : items);
            }
            // Handle Build Step
            if (this.trigger("hook", "build:before") === true) {
                this.build();
                this.trigger("hook", "build:after");
            }
            // Handle Bind Step
            if (this.trigger("hook", "bind:before") === true) {
                this.bind();
                this.trigger("hook", "bind:after");
            }
            // Append to DOM
            if (this.source.nextElementSibling) {
                this.source.parentElement.insertBefore(this.select, this.source.nextElementSibling);
            }
            else {
                this.source.parentElement.appendChild(this.select);
            }
            this.trigger("hook", "init:after");
            return this.query();
        };
        /*
         |  CORE :: BUILD SELECT FIELD
         */
        Select.prototype.build = function () {
            var _this = this;
            var cls = this.get("classNames") === true ? this.source.className : this.get("classNames", "");
            // Create :: Select
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
            // Create :: Label
            this.label = document.createElement("LABEL");
            this.label.className = "select-label";
            this.label.innerHTML = "<span class=\"label-inner\">Test Placeholder</span>";
            // Create :: Dropdown
            this.dropdown = document.createElement("DIV");
            this.dropdown.className = "select-dropdown overflow-" + this.get("titleOverflow", "clip");
            this.dropdown.innerHTML = "<div class=\"dropdown-inner\"></div>";
            // Create :: CSV Input
            this.csv = document.createElement("INPUT");
            this.csv.className = "select-search";
            this.csv.name = (function (name) {
                if (name === true) {
                    name = _this.source.dataset.name || _this.source.name || "";
                }
                return name === false ? "" : name;
            })(this.get("csvOutput", !1));
            // Build Up
            this.select.appendChild(this.label);
            this.select.appendChild(this.dropdown);
            this.get("csvOutput") ? this.select.appendChild(this.csv) : null;
            return this;
        };
        /*
         |  CORE :: BIND SELECT FIELD
         */
        Select.prototype.bind = function () {
            var handle = this.handle.bind(this);
            // Attach Events
            document.addEventListener("keydown", this.handle);
            document.addEventListener("click", this.handle);
            if (this.get("sourceBind")) {
                this.source.addEventListener("change", this.handle);
            }
            return this;
        };
        /*
         |  CORE :: HANDLE EVENTs
         */
        Select.prototype.handle = function (event) {
            //console.log(event);
        };
        /*
         |  API :: TRIGGER EVENT, FILTER OR HOOK
         */
        Select.prototype.trigger = function (type, name, args) {
            var _this = this;
            if (type === "event") {
                var data = { bubbles: false, cancelable: true, detail: { args: args, select: this } };
                var event_1 = new CustomEvent("rat::" + name, data);
                var cancelled = this.select.dispatchEvent(event_1);
                if (name === "change") {
                    var input = new CustomEvent("input", data);
                    var event_2 = new CustomEvent("change", data);
                    this.source.dispatchEvent(input);
                    this.source.dispatchEvent(event_2);
                }
            }
            // Handle Hooks & Filters
            var _arg = true;
            var callbacks = this.plugins.hook(name).concat(this.events[name] || []);
            callbacks.map(function (cb) {
                if (type === "filter") {
                    args = cb.apply(_this, args);
                }
                else if (_this.handle.apply(_this, args) === false) {
                    _arg = false;
                }
            });
            // Return
            return (type === "hook") ? _arg : ((type === "filter") ? args : cancelled);
        };
        /*
         |  API :: QUERY DROPDOWN
         */
        Select.prototype.query = function (query) {
            var _a;
            var _this = this;
            if (this.trigger("hook", "query:before") === false) {
                return this;
            }
            // Handle Query
            query = typeof query === "function" ? query : this.get("query", function () { return _this.options.get(); });
            query = this.trigger("filter", "query", [query])[0];
            // Handle Walker
            var el = null;
            var skip = void 0;
            var head = [];
            var items = query.call(this);
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                var group = item.parentElement instanceof HTMLOptGroupElement ? item.parentElement.label : null;
                _a = this.trigger("filter", "walk", [item, group]), item = _a[0], group = _a[1];
                // Skip Group, but keep loop running
                if (group === skip) {
                    continue;
                }
                // Create Group
                if (!(head.length > 0 && head[0].dataset.group === group)) {
                    var arg = item.parentElement instanceof HTMLOptGroupElement ? item.parentElemnt : null;
                    if (!arg) {
                        arg = document.createElement("OPTGROUP");
                        arg.innerText = this.get("ungroupedLabel", null);
                    }
                    if ((el = this.render(arg)) === null) {
                        skip = group;
                        continue; // Skip Group
                    }
                    else if (el === false) {
                        break; // Break Loop
                    }
                    head.unshift(el);
                }
                // Create Item
                if ((el = this.render(item)) === null) {
                    continue; // Skip Item
                }
                else if (el === false) {
                    break; // Break Loop
                }
                head[0].appendChild(el);
                // Experimental Scroll Function
                if (this.get("titleOverflow") === "scroll") {
                    (function (el, self) {
                        var style = window.getComputedStyle(el);
                        var inner = el.clientWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight) - 17;
                        var title = el.querySelector(".option-title");
                        if (title.scrollwidth > inner) {
                            var number = inner - title.scrollWidth - 15;
                            title.style.paddingLeft = Math.abs(number) + "px";
                            el.style.textIndent = number + "px";
                        }
                    }(el));
                }
            }
            // Replace
            var root = this.dropdown.querySelector(".dropdown-inner");
            var clone = root.cloneNode();
            head.map(function (item) { return clone.appendChild(item); });
            this.dropdown.replaceChild(clone, root);
            // Hook & Return
            this.trigger("hook", "query:after");
            return this;
        };
        /*
         |  API :: RENDER DROPDOWN
         */
        Select.prototype.render = function (element) {
            var _a;
            var tag = element.tagName.toUpperCase();
            var output = document.createElement(tag === "OPTION" ? "LI" : "OL");
            // Render Item
            if (tag === "OPTION") {
                output.className = "dropdown-option";
                output.innerHTML = "<span class=\"option-title\">" + element.innerHTML + "</span>";
                output.dataset.group = ((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.label) || "#";
                output.dataset.value = element.value;
                if (element.dataset.description) {
                    output.innerHTML += "<span clasS=\"option-description\">" + element.dataset.description + "</span>";
                }
            }
            else {
                output.className = "dropdown-optgroup";
                output.innerHTML = "<li class=\"optgroup-title\">" + element.label + "</li>";
                output.dataset.group = element.label;
                if (this.get("multiple") && this.get("multiSelectGroup", 1)) {
                    for (var _i = 0, _b = ['select-none', 'select-all']; _i < _b.length; _i++) {
                        var item = _b[_i];
                        var btn = document.createElement("BUTTON");
                        btn.dataset.action = item;
                        btn.innerHTML = this.locale._(item === "select-all" ? "buttonAll" : "buttonNone");
                        output.querySelector(".optgroup-title").appendChild(btn);
                    }
                }
            }
            // Filter & Return
            return this.trigger("filter", "render#" + tag, [output, element, tag])[0];
        };
        /*
         |  API :: UPDATE INSTANCE
         */
        Select.prototype.update = function (changes) {
            return this;
        };
        /*
         |  API :: OPEN DROPDOWN
         */
        Select.prototype.open = function () {
            if (this.select.classList.contains("active")) {
                return this;
            }
            this.select.classList.add("active");
            this.trigger("event", "open", []);
            return this;
        };
        /*
         |  API :: CLOSE DROPDOWN
         */
        Select.prototype.close = function () {
            if (!this.select.classList.contains("active")) {
                return this;
            }
            this.select.classList.remove("active");
            this.trigger("event", "close", []);
            return this;
        };
        /*
         |  API :: RELOAD SELECT INSTANCE
         */
        Select.prototype.reload = function (hard) {
            return this;
        };
        /*
         |  API :: REMOVE SELECT INSTANCE
         */
        Select.prototype.remove = function () {
            return this;
        };
        /*
         |  PUBLIC :: GET VALUE
         */
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
        /*
         |  PUBLIC :: GET CONFIG
         */
        Select.prototype.get = function (key, def) {
            return (key in this.config) ? this.config[key] : def;
        };
        /*
         |  PUBLIC :: SET CONFIG
         */
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
        /*
         |  PUBLIC :: ENABLE SELECT INSTANCE
         */
        Select.prototype.enable = function (reload) {
            this.config.disabled = this.source.disabled = false;
            this.select.classList.remove("disabled");
            return (reload) ? this.reload() : this;
        };
        /*
         |  PUBLIC :: DISABLE SELECT INSTANCE
         */
        Select.prototype.disable = function (reload) {
            this.config.disabled = this.source.disabled = true;
            this.select.classList.add("disabled");
            return (reload) ? this.reload() : this;
        };
        /*
         |  PUBLIC :: EVENT LISTENER
         */
        Select.prototype.on = function (name, callback) {
            var _this = this;
            name.split(",").map(function (event) {
                _this.events[event] = _this.events[event] || [];
                _this.events[event].push(callback);
            });
            return this;
        };
        /*
         |  STATIC :: INSTANCES
         */
        Select.inst = {
            length: 0
        };
        /*
         |  STATIC :: STRING HANDLER
         */
        Select.strings = Strings;
        /*
         |  STATIC :: PLUGINS HANDLER
         */
        Select.plugins = Plugins;
        return Select;
    }());

    /*
     |  MAIN RAT.SELECT FUNCTION
     */
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
