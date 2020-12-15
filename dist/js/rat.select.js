/*!
 |  rat.select - The vanilla solution to level up your HTML <select> fields.
 |  @file       dist/js/rat.select.js
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
    if (typeof CustomEvent !== "undefined" && typeof CustomEvent.constructor !== "function") {
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
            if (typeof string === "function") {
                string = string.apply(this, params);
            }
            if (typeof params !== "undefined" && params.length > 0) {
                params.map(function (replace, index) {
                    var regexp = new RegExp("\\[" + index.toString() + "\\]", "g");
                    string = string.replace(regexp, replace.toString());
                });
            }
            return string;
        };
        Strings.en = {
            buttonAll: "All",
            buttonNone: "None",
            disabled: "This field is disabled",
            empty: "No options available",
            multiple: "Choose one or more options...",
            multipleCount: function (count) {
                return "[0] " + (count === 1 ? "option" : "options") + " selected...";
            },
            multipleLimit: "No more options selectable",
            single: "Choose an option..."
        };
        return Strings;
    }());

    var Plugins = (function () {
        function Plugins(plugins, select) {
            this.plugins = {};
            for (var key in plugins) {
                var plugin = Plugins.plugins[key];
                if (plugin) {
                    var config = Object.assign({}, plugin.config, plugins[key]);
                    this.plugins[key] = {
                        config: config,
                        hooks: Object.assign({}, plugin.hooks)
                    };
                    select.config.plugins[key] = config;
                }
            }
        }
        Plugins.add = function (name, config, hooks) {
            if (name in this.plugins) {
                return false;
            }
            this.plugins[name] = { config: config, hooks: hooks };
            return true;
        };
        Plugins.prototype.hook = function (hook) {
            var cbs = [];
            for (var name_1 in this.plugins) {
                if (hook in this.plugins[name_1].hooks) {
                    cbs.push(this.plugins[name_1].hooks[hook]);
                }
            }
            return cbs;
        };
        Plugins.plugins = {};
        return Plugins;
    }());

    var Options = (function () {
        function Options(select) {
            this.ungrouped = "#";
            this.select = select;
            this.source = select.source;
            [].map.call(this.source.querySelectorAll('option:not([value])'), function (option) {
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
            group = group === "" ? false : group;
            var selector = states ? states.map(function (state) {
                return state[0] === "!" ? ":not(" + format[state.slice(1)] + ")" : format[state];
            }) : "";
            selector += ":not([data-rat-ignore])";
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
            if (!group) {
                return this.source.querySelectorAll(selector);
            }
            else if (group === this.ungrouped) {
                selector = "select[data-rat-select=\"" + this.source.dataset.ratSelect + "\"] > " + selector;
                return this.source.parentElement.querySelectorAll(selector);
            }
            else if (typeof group === "string") {
                return this.source.querySelectorAll("optgroup[label=\"" + group + "\"] " + selector);
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
            if (typeof group === "string" && group !== this.ungrouped) {
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
                    changes.disabled = item.disabled = !item.disabled;
                }
                if (states.hasOwnProperty("hidden") && states.hidden !== item.hidden) {
                    changes.hidden = item.hidden = !item.hidden;
                }
                while (states.hasOwnProperty("selected") && states.selected !== item.selected) {
                    if (item.disabled || item.hidden) {
                        break;
                    }
                    if (!item.selected && _this.source.multiple && limit >= 0 && limit <= _this.count(null, [":selected"])) {
                        break;
                    }
                    if (item.selected && !_this.source.multiple && !_this.select.get("deselect", !1)) {
                        break;
                    }
                    if (!_this.source.multiple && !item.selected && _this.source.selectedIndex >= 0) {
                        result.push([_this.source.options[_this.source.selectedIndex], { selected: false }]);
                    }
                    changes.selected = item.selected = !item.selected;
                    if (!_this.source.multiple && !item.selected) {
                        var oaap = "option[value=\"\"]:not(:disabled):checked:first-child";
                        _this.source.selectedIndex = _this.source.querySelector(oaap) ? 0 : -1;
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
            this.plugins = new Plugins(Object.assign({}, config.plugins || {}), this);
            this.events = (function (events) {
                for (var event_1 in events) {
                    events[event_1] = [events[event_1]];
                }
                return events;
            })(Object.assign({}, config.on || {}));
            this.config.multiple = this.source.multiple = config.multiple || source.multiple;
            this.config.disabled = this.source.disabled = config.disabled || source.disabled;
            this.config.required = this.source.required = config.required || source.required;
            this.config.placeholder = config.placeholder || source.dataset.placeholder || null;
            var oaap = source.querySelector("option[value='']:checked:first-child");
            if (oaap && (oaap.dataset.ratIgnore = "1")) {
                this.config.deselect = !oaap.disabled;
                this.config.placeholder = oaap.innerText || config.placeholder;
            }
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
            if (this.trigger("hook", "init:before") === false) {
                return this;
            }
            if (typeof this.config.items !== "undefined") {
                var items = this.config.items;
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
        };
        Select.prototype.build = function () {
            var _this = this;
            if (this.trigger("hook", "build:before") === false) {
                return this;
            }
            var cls = this.get("classNames") === true ? this.source.className : this.get("classNames", "");
            this.select = document.createElement("DIV");
            this.select.className = (function (cls) {
                var _l = ["rtl", "hideSelected", "hideDisabled", "hideHidden", "disabled", "required", "multiple", "deselect"];
                _l.map(function (item) {
                    if (_this.get(item, item === "hideHidden")) {
                        cls.unshift(item.replace(/[A-Z]/, function (char) { return "-" + char.toLowerCase(); }));
                    }
                });
                cls.unshift("rat-select theme-" + _this.get("theme").replace("-", " scheme-").replace(".", " "));
                return cls.join(" ").trim();
            })(typeof cls === "string" ? cls.split(" ") : cls);
            this.select.tabIndex = this.source.tabIndex || 1;
            this.select.dataset.ratSelect = this.source.dataset.ratSelect;
            var width = this.get("width", 250);
            if (width !== null) {
                this.select.style.width = width + (isNaN(width) ? "" : "px");
            }
            this.label = document.createElement("LABEL");
            this.label.className = "select-label";
            this.dropdown = document.createElement("DIV");
            this.dropdown.className = "select-dropdown overflow-" + this.get("titleOverflow", "clip");
            this.dropdown.innerHTML = "<div class=\"dropdown-inner\"></div>";
            this.csv = document.createElement("INPUT");
            this.csv.className = "select-search";
            this.csv.name = (function (name) {
                if (name === true) {
                    name = _this.source.name || "";
                }
                return name === false ? "" : name;
            })(this.get("csvOutput", !1));
            this.select.appendChild(this.label);
            this.select.appendChild(this.dropdown);
            this.get("csvOutput") ? this.select.appendChild(this.csv) : null;
            this.trigger("hook", "build:after");
            return this;
        };
        Select.prototype.calculate = function () {
            var _this = this;
            var clone = this.dropdown;
            var offset = 0;
            var height = (function (height) {
                var temp = clone.cloneNode(true);
                temp.classList.add("cloned");
                _this.select.appendChild(temp);
                if (typeof height === "string" && height.charAt(0) === ":") {
                    var len = parseInt(height.slice(1));
                    var count = 0;
                    var items = [].slice.call(clone.querySelectorAll("li"));
                    for (var c = 0, i = 0; i < items.length; i++) {
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
                return _this.select.removeChild(temp) ? height + offset : height + offset;
            })((!this.get("height", 350)) ? "auto" : this.get("height", 350));
            var rect = this.select.getBoundingClientRect();
            var free = { top: rect.top, bottom: window.innerHeight - (rect.top + rect.height) };
            var side = this.get("openAbove", null) || !(free.bottom >= height || free.bottom >= free.top);
            height = Math.min(height, (side ? free.top : free.bottom) - 15);
            this.select.classList[side ? "add" : "remove"]("open-top");
            clone.style.maxHeight = height + "px";
            clone.querySelector(".dropdown-inner").style.maxHeight = height - offset + "px";
            return this;
        };
        Select.prototype.bind = function () {
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
        };
        Select.prototype.handle = function (event) {
            var _this = this;
            if (this.trigger("hook", "handle:before", [event]) === false) {
                return this;
            }
            if (!(event instanceof Event) || this.get("disabled")) {
                return this;
            }
            var target = event.target;
            if (event.type === "keydown") {
                if (document.activeElement !== this.select) {
                    return;
                }
                var key = event.keyCode;
                var sel = ".dropdown-option:not(.disabled):not(.hidden)";
                if (key === 32 && !this.select.classList.contains("active")) {
                    return this.open();
                }
                else if (!this.select.classList.contains("active")) {
                    return;
                }
                switch (key) {
                    case 13:
                    case 32:
                        var itm = this.dropdown.querySelector(".dropdown-option.hover");
                        if (itm) {
                            this.options.selected(this.options.get(itm.dataset.value, itm.dataset.group));
                            return !this.get("stayOpen") && !this.get("multiple") ? this.close() : 1;
                        }
                        return;
                    case 27:
                        return this.close();
                    case 38:
                    case 40:
                        var items = this.dropdown.querySelectorAll(sel);
                        var item = null;
                        var opt = [].slice.call(items).indexOf(this.dropdown.querySelector(".dropdown-option.hover"));
                        if (opt >= 0 && items[opt + (key > 38 ? +1 : -1)]) {
                            item = items[opt + (key > 38 ? +1 : -1)];
                        }
                        if (!item) {
                            item = items[key > 38 ? 0 : items.length - 1];
                        }
                        if (item) {
                            item.classList.add("hover");
                            (items[opt]) ? items[opt].classList.remove("hover") : 0;
                            var pos = (function (el, pos) {
                                while ((el = el.parentElement) !== _this.dropdown) {
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
                    var disabled = target.classList.contains("disabled");
                    if (!disabled && target.dataset.action && (target.dataset.value || target.dataset.group)) {
                        var items = this.options.get(target.dataset.value, target.dataset.group);
                        var action = target.dataset.action;
                        this.options.selected(items, action === "toggle" ? null : action === "select");
                        if (!this.get("stayOpen") && !this.source.multiple) {
                            return this.close();
                        }
                    }
                }
            }
            if (event.type === "change" && !(event instanceof CustomEvent)) {
                [].map.call(this.select.querySelectorAll(".dropdown-option.active"), function (item) {
                    item.classList.remove("active");
                });
                var changes_1 = [];
                [].map.call(this.source.querySelectorAll("option:checked"), function (item) { return changes_1.push([item, { selected: true }]); });
                return this.update(changes_1, false);
            }
            this.trigger("hook", "handle:after", [event]);
            return this;
        };
        Select.prototype.trigger = function (type, name, args) {
            var _this = this;
            if (type === "event") {
                var data = { bubbles: false, cancelable: true, detail: { args: args, select: this } };
                var event_2 = new CustomEvent("rat::" + name, data);
                var cancelled = this.select.dispatchEvent(event_2) || this.source.dispatchEvent(event_2);
                if (name === "change") {
                    var input = new CustomEvent("input", data);
                    var event_3 = new CustomEvent("change", data);
                    this.source.dispatchEvent(input);
                    this.source.dispatchEvent(event_3);
                }
            }
            var _arg = true;
            var callbacks = this.plugins.hook(name).concat(this.events[name] || []);
            callbacks.map(function (cb) {
                if (type === "filter") {
                    args = cb.apply(_this, args);
                }
                else if (cb.apply(_this, args) === false) {
                    _arg = false;
                }
            });
            return (type === "hook") ? _arg : ((type === "filter") ? args : cancelled);
        };
        Select.prototype.query = function (query, args) {
            var _a;
            var _this = this;
            if (this.trigger("hook", "query:before") === false) {
                return this;
            }
            query = typeof query === "function" ? query : this.get("query", function () { return _this.options.get(); });
            query = this.trigger("filter", "query", [query])[0];
            var el = null;
            var skip = void 0;
            var head = [];
            var items = query.apply(this, args || []);
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                var group = item.parentElement instanceof HTMLOptGroupElement ? item.parentElement.label : null;
                _a = this.trigger("filter", "walk", [item, group]), item = _a[0], group = _a[1];
                if (this.get("hideEmpty", true) && item.value === "") {
                    continue;
                }
                if (group === skip) {
                    continue;
                }
                if (!(head.length > 0 && head[0].dataset.group === (!group ? this.options.ungrouped : group))) {
                    var arg = item.parentElement instanceof HTMLOptGroupElement ? item.parentElement : null;
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
            var root = this.dropdown.querySelector(".dropdown-inner");
            var clone = root.cloneNode();
            head.reverse().map(function (item) { return clone.appendChild(item); });
            this.dropdown.replaceChild(clone, root);
            if (this.get("titleOverflow") === "scroll") {
                [].map.call(this.dropdown.querySelectorAll(".dropdown-option"), function (el) {
                    var width = el.clientWidth - el.querySelector(".option-title").offsetLeft;
                    var scroll = el.querySelector(".option-title").scrollWidth;
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
        };
        Select.prototype.render = function (element) {
            var _this = this;
            var _a;
            var tag = element.tagName.toUpperCase();
            var output = document.createElement(tag === "OPTION" ? "LI" : "OL");
            var classes = function (item) {
                var selected = (_this.get("multiple") && item.hasAttribute("selected")) || item.selected;
                return ((selected ? " selected" : "") + (item.disabled ? " disabled" : "") + (item.hidden ? " hidden" : "")).trim();
            };
            if (tag === "OPTION") {
                output.className = "dropdown-option " + classes(element);
                output.innerHTML = "<span class=\"option-title\">" + element.innerHTML + "</span>";
                output.dataset.group = ((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.label) || this.options.ungrouped;
                output.dataset.value = element.value;
                output.dataset.action = "toggle";
                if (element.dataset.description) {
                    output.innerHTML += "<span clasS=\"option-description\">" + element.dataset.description + "</span>";
                }
            }
            else {
                var label = element.label || this.get("ungroupedLabel", null) || "";
                output.className = "dropdown-optgroup" + (this.get("stickyGroups") ? " optgroup-sticky" : "");
                output.innerHTML = "<li class=\"optgroup-title\">" + label + "</li>";
                output.dataset.group = element.label || this.options.ungrouped;
                if (this.get("multiple") && this.get("multiSelectGroup", 1)) {
                    for (var _i = 0, _b = ['buttonAll', 'buttonNone']; _i < _b.length; _i++) {
                        var item = _b[_i];
                        var btn = document.createElement("BUTTON");
                        btn.dataset.action = (item === "buttonAll" ? "select" : "unselect");
                        btn.dataset.group = output.dataset.group;
                        btn.innerHTML = this.locale._(item);
                        output.querySelector(".optgroup-title").appendChild(btn);
                    }
                }
            }
            return this.trigger("filter", "render#" + tag, [output, element, tag])[0];
        };
        Select.prototype.update = function (changes, skipEvents) {
            var _this = this;
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
            [].map.call(changes, function (dataset) {
                var option = dataset[0], change = dataset[1];
                var value = option.value.replace(/('|\\)/g, "\\$1");
                var group = option.parentElement.label ? option.parentElement.label : _this.options.ungrouped;
                var item = _this.dropdown.querySelector("li[data-value=\"" + value + "\"][data-group=\"" + group + "\"]");
                if (item) {
                    for (var key in change) {
                        item.classList[change[key] ? "add" : "remove"](key);
                    }
                }
            });
            this.trigger("hook", "update:after", [changes, skipEvents]);
            return this.updateCSV().updateLabel();
        };
        Select.prototype.updateCSV = function () {
            if (this.get("csvOutput")) {
                this.csv.value = this.trigger("filter", "update#csv", [this.value("csv")])[0];
            }
            return this;
        };
        Select.prototype.updateLabel = function (label) {
            var value = this.value("array");
            var limit = this.get("multiLimit");
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
            var counter = this.source.multiple ? this.get("placeholderCount", false) : false;
            if (counter) {
                var selected = this.options.count(null, ["selected"]);
                var count = this.options.count(null, ["!disabled", "!hidden"]);
                var max = limit < 0 ? count : limit;
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
                        counter = selected + "/" + max;
                        break;
                }
                if (typeof counter === "function") {
                    counter = counter.call(this);
                }
            }
            this.label.innerHTML = "" + (counter ? "<span class=\"label-count\">" + counter + "</span>" : "")
                + ("<span class=\"label-placeholder\">" + this.locale._(label, [value.length]) + "</span>");
            return this;
        };
        Select.prototype.open = function () {
            if (this.select.classList.contains("active")) {
                return this;
            }
            this.calculate();
            this.select.classList.add("active");
            this.trigger("event", "open", []);
            return this;
        };
        Select.prototype.close = function () {
            if (!this.select.classList.contains("active")) {
                return this;
            }
            this.dropdown.style.removeProperty("max-height");
            this.select.classList.remove("active");
            this.trigger("event", "close", []);
            return this;
        };
        Select.prototype.toggle = function () {
            return this[this.select.classList.contains("active") ? "close" : "open"]();
        };
        Select.prototype.reload = function (hard) {
            if (this.trigger("hook", "reload:before", [hard]) !== true) {
                return this;
            }
            (hard) ? this.remove().init() : this.query();
            this.trigger("hook", "reload:after", [hard]);
            return this;
        };
        Select.prototype.remove = function (keep) {
            if (this.trigger("hook", "remove:before", [keep]) !== true) {
                return this;
            }
            if (!keep) {
                [].map.call(this.source.querySelectorAll("optgroup[data-select='add']"), function (item) {
                    item.parentElement.removeChild(item);
                });
                [].map.call(this.source.querySelectorAll("option[data-select='add']"), function (item) {
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
        };
        Select.prototype.value = function (format) {
            if (typeof format === 'undefined' || format === 'auto') {
                format = this.source.multiple ? 'array' : 'csv';
            }
            var items = this.options.get(null, null, ["selected"]);
            switch (format) {
                case 'csv': return [].map.call(items, function (i) { return i.value; }).join(this.get("csvSeparator", ","));
                case 'array': return [].map.call(items, function (i) { return i.value; });
                case 'node': return !this.source.multiple ? (items[0] || null) : [].map.call(items, function (i) { return i.value; });
                default: return format === "array" ? [] : null;
            }
        };
        Select.prototype.get = function (key, def) {
            if (key.indexOf(".") > 0) {
                var _a = key.split("."), name_1 = _a[0], config = _a[1];
                var plugin = this.config.plugins[name_1];
                return (plugin && plugin[config]) ? plugin[config] : def;
            }
            return (key in this.config) ? this.config[key] : def;
        };
        Select.prototype.set = function (key, value, reload) {
            if (key.indexOf(".") > 0) {
                var _a = key.split("."), name_2 = _a[0], config = _a[1];
                var plugin = this.config.plugins[name_2];
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
        };
        Select.prototype.enable = function (reload) {
            this.trigger("event", "enable", [reload]);
            this.config.disabled = this.source.disabled = false;
            this.select.classList.remove("disabled");
            return (reload) ? this.reload() : this;
        };
        Select.prototype.disable = function (reload) {
            this.trigger("event", "disable", [reload]);
            this.config.disabled = this.source.disabled = true;
            this.select.classList.add("disabled");
            return (reload) ? this.reload() : this;
        };
        Select.prototype.focus = function () {
            this.select.focus();
            return this;
        };
        Select.prototype.state = function (state, status) {
            if (typeof state === "undefined") {
                return this.select.classList.contains("state-" + state);
            }
            status = status === null ? !this.select.classList.contains("state-" + state) : status;
            this.select.classList[status ? "add" : "remove"]("state-" + state);
            return this;
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
    RatSelect.Strings = Strings;
    RatSelect.Plugins = Plugins;

    return RatSelect;

})));
//# sourceMappingURL=rat.select.js.map
