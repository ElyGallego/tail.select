/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/plugins/all.js
 |  @authors    SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |              Lenivyy <lenivyy@pytes.net> (https://www.pytes.net)
 |  @version    0.6.0 - Beta : ECMAScript 2015
 |
 |  @website    https://github.com/pytesNET/tail.select
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2014 - 2020 pytesNET <info@pytes.net>
 */
export function plugin(select) {
    "use strict";
    
    
    
    var options = {
        ajax: true,
        ajaxCallback: null,
        ajaxOn: "init",
        ajaxReset: false,
        ajaxSearch: false
    };

    var hooks = {
        "init:before": function () {
            this.set("ajax", (this.get("ajax") && typeof this.get("ajaxCallback") === "function"));
            this._ajax = false;
            this._ajax_call = false;
            this._ajax_result = undefined;
            return true;
        },
        "init:after": function () {
            this._ajax = this.get("ajaxOn") === "init";
            return true;
        },
        "open": function () {
            if (this.get("ajaxOn") === "open") {
                this._ajax = true;
                this.query.apply(this, this._last_query);
            }
        },
        "query:before": function (method, args) {
            if (!this.get("ajax") || (method === "finder" && !this.get("ajaxSearch"))) {
                return true;
            }
            let label = (this.get("ajaxOn") === "init") ? "loading" : void 0;
            let loading = (function () {
                let load = this.render("ajax-loading", null, [method, args]);
                let root = select.__.create("DIV", "dropdown-inner");
                root.appendChild(load);
                let inner = this._dropdown.querySelector(".dropdown-inner");
                this._dropdown[(inner ? "replace" : "append") + "Child"](root, inner);
            }).bind(this);
            if (!this._ajax) {
                loading();
            }
            if (this._ajax) {
                if (this._ajax_result === void 0 || (this.get("ajaxReset") && method !== "ajax")) {
                    if (this._ajax_call) {
                        return false;
                    }
                    this._ajax_call = true;
                    (function (self) {
                        loading();
                        setTimeout(function () { ajaxHandler.call(self, method, args); }, 0);
                    }).call(this, this);
                } else {
                    return true;
                }
            }
            let value = this.value();
            let limit = this.get("multiLimit", Infinity);
            if (label === void 0) {
                switch (true) {
                    case this.get("disabled"):
                        label = "disabled";
                        break;
                    case this.get("multiple") && limit === Infinity:
                        label = (value.length === 0) ? "multiple" : "multipleList";
                        break;
                    case this.get("multiple") && limit !== Infinity:
                        label = (value.length === limit) ? "multipleLimit" : "multipleCount";
                        break;
                    default:
                        label = (this.get("multiple")) ? "multiple" : "single";
                        break;
                }
                if (label !== "disabled") {
                    label = (typeof this.get("placeholder") === "string") ? this.get("placeholder") : label;
                }
            }
            this.updateLabel(label).updateCSV();
            return false;
        },
        "render": function (types) {
            types["ajax-loading"] = function () {
                let span = select.__.create("DIV", "dropdown-ajax-loading");
                span.innerHTML = `<span>${this._e("loading")}</span>`;
                return span;
            };
            types["ajax-error"] = function (string) {
                let span = select.__.create("DIV", "dropdown-ajax-error");
                span.innerHTML = `<span>${string || this._e("error")}</span>`;
                return span;
            };
            return [types];
        }
    };
    let ajaxHandler = function (method, args) {
        let self = this;
        let ajax = {
            success: function (items, keepOld) {
                if (self._ajax_result !== void 0 && !keepOld) {
                    for (let key in self._ajax_result) {
                        let item = self._ajax_result[key];
                        if (typeof item === "string" || item instanceof HTMLElement) {
                            self.options.remove(key, false);
                        } else {
                            self.options.remove([key, item.group || item.optgroup || "#"], false);
                        }
                    }
                }
                self._ajax_call = false;
                self._ajax_result = items;
                self.options.add(items, null, false);
                self.query.apply(self, ["ajax", self._last_query[1]]);
            },
            error: function (message) {
                self._ajax_call = false;
                self._ajax_result = undefined;
                let root = select.__.create("DIV", "dropdown-inner");
                let load = self.render("ajax-error", message, [method, args]);
                root.appendChild(load);
                let inner = self._dropdown.querySelector(".dropdown-inner");
                self._dropdown[(inner ? "replace" : "append") + "Child"](root, inner);
            }
        };
        (self.get("ajaxCallback") || function () { this.error("No Walker set"); }).call(ajax, method, args);
    };
    select.plugins.add("ajax", options, hooks);
    select.strings.en["error"] = "An Error is occured";
    select.strings.en["loading"] = "Loading";
    

    var options = {
        columns: 1,
        groupCollapse: false
    };

    var hooks = {
        "init:after": function () {
            let columns = this.get("columns");
            this.set("columns", columns < 1 ? 1 : columns > 5 ? 5 : columns);
            return true;
        },
        "bind:after": function (event) {
            if (!this.get("groupCollapse")) {
                return true;
            }
            if (event.type === "click" && event.target.classList.contains("optgroup-collapse")) {
                this.collapse(event.target.parentElement.parentElement);
            }
            return true;
        },
        "query:after": function () {
            if (!this.get("groupCollapse")) {
                return true;
            }
            let groups = this._dropdown.querySelectorAll("ul");
            for (var i = 0; i < groups.length; i++) {
                groups[i].style.maxHeight = groups[i].offsetHeight + "px";
            }
            return true;
        },
        "render#group": function (group) {
            if (this.get("groupCollapse") && group.querySelector("li.optgroup-title")) {
                let collapse = select.__.create("SPAN", "optgroup-collapse");
                collapse.setAttribute("data-collapse", "true");
                group.querySelector("li.optgroup-title").appendChild(collapse);
            }
            return [group];
        },
        "dropdown": function (dropdown) {
            if (this.get("columns") <= 1) {
                return [dropdown];
            }
            let items = dropdown.querySelectorAll("li");
            let columns = parseInt(this.get("columns"));
            let lists = ".".repeat(columns - 1).split(".").map(() => {
                return select.__.create("DIV", "inner-column");
            });
            let count = items.length + (columns - 1);
            let row_num = -1;
            let row_grp = null;
            for (let l = 0, i = 0; i < items.length; l++, i++) {
                let row = Math.max(Math.floor(l / Math.ceil(count / columns)), row_num);
                row = Math.min(row, columns - 1);
                if (row !== row_num || items[i].classList.contains("optgroup-title") || !row_grp) {
                    if (!row_grp || items[i].classList.contains("optgroup-title")) {
                        let label = items[i].parentElement.getAttribute("data-group");
                        let group = this.e.querySelector(`optgroup[label='${label}']`);
                        row_grp = this.render("group", group, null);
                    } else {
                        let temp = row_grp.cloneNode();
                        if (row_grp.querySelector(".optgroup-title b")) {
                            let label = row_grp.querySelector(".optgroup-title").cloneNode(true);
                            label.querySelector("b").innerText += ` (${this._e("continue")})`;
                            temp.appendChild(label);
                        }
                        row_grp = temp;
                        l++;
                    }
                    let temp = Math.floor((l + 1) / Math.ceil(count / columns));
                    if (temp > row && temp < columns) {
                        l++;
                        row_num = row = temp;
                    } else {
                        row_num = row;
                    }
                    lists[row].appendChild(row_grp);
                }
                if (items[i].classList.contains("optgroup-title")) {
                    continue;
                }
                row_grp.appendChild(items[i]);
            }
            dropdown.innerHTML = "";
            dropdown.classList.add("dropdown-columns");
            dropdown.classList.add("columns-" + this.get("columns"));
            for (let i = 0; i < lists.length; i++) {
                dropdown.appendChild(lists[i]);
            }
            return [dropdown];
        }
    };
    select.plugins.add("columns", options, hooks);
    select.strings.en["continue"] = "Continue";

    select.prototype.collapse = function (group) {
        if (typeof group === "string") {
            group = this._dropdown.querySelector(`ul[data-group='${group}']`);
        }
        if (group instanceof HTMLElement) {
            group.classList.toggle("collapsed");
        }
        return this;
    };
    

    var options = {
        input: true,
        create: false,
        createCallback: null,
        createHidden: false,
        createGroup: "#",
        createRemove: false
    };

    var hooks = {
        "init:before": function () {
            if (this.get("input")) {
                this.set("search", true);
            }
            return true;
        },
        "build:after": function () {
            if (this.get("input")) {
                this._label.classList.add("label-input");
                this._search.querySelector("input").removeAttribute("placeholder");
                this._search.className = "label-search";
            }
            return true;
        },
        "bind:before": function (event) {
            if (!(event instanceof Event) || !this.get("input")) {
                return true;
            }
            if (event.type !== "input" || event.target !== this._search.children[0]) {
                return true;
            }
            this.calculateLabelInput();
            let input = event.target;
            if (input.value.length >= Math.max(this.get("searchMinLength", 3), 1)) {
                this.query("finder", [input.value, this.get("searchConfig", ["text", "value"]), this.get("sortSearch")]);
            } else if (this._last_query[0] !== this.options.walker) {
                this.query("walker", [this.get("sortGroups"), this.get("sortItems")]);
            }
            input.focus();
            return false;
        },
        "update#label": function (string, label, count, replace) {
            if (!this.get("input")) {
                return [string, label, count, replace];
            }
            let tlabel = select.__.create("DIV", this._label.className);
            if (!this.get("multiple") && label === this.value()) {
                this._search.children[0].value = label;
                this.calculateLabelInput(label);
            } else {
                this._search.children[0].setAttribute("placeholder", this._e(label, replace));
                this.calculateLabelInput(this._e(label, replace));
            }
            if (count) {
                let tcount = select.__.create("DIV", "label-count");
                tcount.innerHTML = this._e(count, replace);
                tlabel.appendChild(tcount);
            }
            let tinner = select.__.create("DIV", "label-inner");
            tinner.appendChild(this._search);
            tlabel.appendChild(tinner);
            return [tlabel, label, count, replace];
        },
        "render#empty": function (content) {
            if (!(this.get("input") && this.get("inputCreate"))) {
                return [content];
            }
            let item = select.__.create("SPAN", "dropdown-create");
            item.innerHTML = `<b>${this._e("createOption")}</b>`
                + `<span>${this._search.children[0].value}</span>`;
            return [item];
        }
    };
    select.plugins.add("input", options, hooks);
    select.strings.en["createOption"] = "Press Return to create";

    select.prototype.calculateLabelInput = function (value) {
        if (!this.get("input")) {
            return this;
        }
        let temp = select.__.create("SPAN", "search-width");
        temp.innerText = value || this._search.children[0].value;
        this._label.appendChild(temp);
        this._search.children[0].style.width = Math.max(temp.offsetWidth, 2) + "px";
        this._label.removeChild(temp);
        return this;
    };
    

    var options = {
        move: null,
        moveHide: false,
        moveOrder: true,
        pinSelected: false
    };

    var hooks = {
        "init:before": function () {
            if (!this.get("multiple", 0)) {
                return true;
            }
            let container = this.get("move");
            if (typeof container === "string") {
                this._container = document.querySelector(container);
            } else if (container instanceof HTMLElement) {
                this._container = container;
            } else if (container === true) {
                this._container = document.createElement("DIV");
            }
            if (this._container) {
                this._container.classList.add("tail-select-container");
            }
            return true;
        },
        "bind:before": function (event) {
            if (!this._container || !(event instanceof Event && this._container.contains(event.target))) {
                return true;
            }
            let value;
            let group;
            let action;
            let target = event.target;
            do {
                if (!target || target == this._container) {
                    return true;
                }
                value = target.getAttribute("data-value");
                group = target.getAttribute("data-group");
                action = target.getAttribute("data-action");
            } while (!(action && (value || group)) && (target = target.parentElement) !== null);
            if (!!(action && (value || group))) {
                let args = (action === "toggle") ? [[value, group], "selected"] : [[value, group]];
                this.options[action].apply(this.options, args);
                return false;
            }
            return true;
        },
        "update:after": function (items, trigger, force) {
            if (this.get("move")) {
                this.updateContainer(items);
            }
            if (this.get("pinSelected")) {
                this.updatePin(items);
            }
            return true;
        },
        "query:after": function (method, args) {
            if (method !== "walker") {
                return true;
            }
            if (this.get("moveOrder")) {
                this._container_index = [].map.call(this._dropdown.querySelectorAll("li.dropdown-option"), (i) => i);
                this._container_items = ".".repeat(this._container_index.length - 1).split(".");
            }
            if (this.get("move") || this.get("pinSelected")) {
                let selected = this.options.get(null, null, true);
                let result = [];
                for (let i = 0; i < selected.length; i++) {
                    result.push([selected[i], { selected: true }]);
                }
                if (this.get("move")) {
                    this.updateContainer(result);
                }
                if (this.get("pinSelected")) {
                    this.updatePin(result);
                }
            }
            return true;
        },
        "render": function (types) {
            types["move-item"] = function (option) {
                let group = (option.parentElement instanceof HTMLOptGroupElement) ? option.parentElement.label || "#" : "#";
                let item = select.__.create("DIV", "select-item");
                let title = select.__.create("SPAN", "item-title");
                let remove = select.__.create("SPAN", "item-unselect");
                item.setAttribute("data-value", option.value || option.innerText);
                item.setAttribute("data-group", group);
                item.setAttribute("data-action", "unselect");
                title.innerText = option.innerText;
                item.appendChild(remove);
                item.appendChild(title);
                return item;
            };
            return [types];
        }
    };
    select.plugins.add("movement", options, hooks);

    select.prototype.updateContainer = function (items) {
        if (!this._container) {
            return this;
        }
        for (let i = 0; i < items.length; i++) {
            let [option, states] = items[i];
            let value = option.value || option.innerText;
            let group = (option.parentElement instanceof HTMLOptGroupElement) ? option.parentElement.label || "#" : "#";
            let item = this._container.querySelector(`.select-item[data-value='${value}'][data-group='${group}']`);
            if (states.selected && !item) {
                let item = this.render("move-item", option, null);
                if (!this.get("moveOrder")) {
                    this._container.appendChild(item);
                    continue;
                }
                let list = this._dropdown.querySelector(`li[data-value='${value}'][data-group='${group}']`);
                let index = this._container_index.indexOf(list);
                let position = this._container.querySelector(".select-item") ? index : this._container_index.length;
                do {
                    position++;
                } while (this._container_items.length > position && this._container_items[position] === "");
                if (this._container_items[position]) {
                    this._container.insertBefore(item, this._container_items[position]);
                } else {
                    this._container.appendChild(item);
                }
                this._container_items[index] = item;
            } else if (!states.selected && item) {
                this._container.removeChild(item);
                let index = this._container_items.indexOf(item);
                if (this.get("moveOrder") && index >= 0) {
                    this._container_items[index] = "";
                }
            }
        }
        return this;
    };

    select.prototype.updatePin = function (items) {
        if (!this.get("pinSelected")) {
            return this;
        }
        for (let i = 0; i < items.length; i++) {
            let [option, states] = items[i];
            let value = option.value || option.innerText;
            let group = (option.parentElement instanceof HTMLOptGroupElement) ? option.parentElement.label || "#" : "#";
            let item = this._dropdown.querySelector(`li[data-value='${value}'][data-group='${group}']`);
            if (states.selected && !item.classList.contains("pinned")) {
                let keep = item.cloneNode(true);
                let parent = item.parentElement;
                item.classList.add("pinned");
                keep.style.display = "none";
                parent.replaceChild(keep, item);
                parent.insertBefore(item, parent.querySelector("li:not(.pinned)"));
            } else if (!states.selected && item.classList.contains("pinned")) {
                let keep = this._dropdown.querySelector(`li[data-value='${value}'][data-group='${group}']:not(.pinned)`);
                item.classList.remove("pinned");
                keep.parentElement.replaceChild(item, keep);
            }
        }
        return this;
    };
    
    return select;
}