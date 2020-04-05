/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/plugins/select-movement.js
 |  @authors    SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |              Lenivyy <lenivyy@pytes.net> (https://www.pytes.net)
 |  @version    0.6.0 - Beta : ECMAScript 5
 |
 |  @website    https://github.com/pytesNET/tail.select
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2014 - 2020 pytesNET <info@pytes.net>
 */
;(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(['tail.select'], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory;
    } else {
        factory(root.tail.select);
    }
}((typeof window !== "undefined"? window: (typeof global !== "undefined")? global: this), function (select) {
    "use strict";

    /*
     |  SELECT - MOVEMENT
     |  @description    Move selected options to an own container or pin them up on the dropdown list.
     */
    
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
            var container = this.get("move");
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
            var value;
            var group;
            var action;
            var target = event.target;
            do {
                if (!target || target == this._container) {
                    return true;
                }
                value = target.getAttribute("data-value");
                group = target.getAttribute("data-group");
                action = target.getAttribute("data-action");
            } while (!(action && (value || group)) && (target = target.parentElement) !== null);
            if (!!(action && (value || group))) {
                var args = (action === "toggle") ? [[value, group], "selected"] : [[value, group]];
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
                this._container_index = [].map.call(this._dropdown.querySelectorAll("li.dropdown-option"), function (i) { return i; });
                this._container_items = ".".repeat(this._container_index.length - 1).split(".");
            }
            if (this.get("move") || this.get("pinSelected")) {
                var selected = this.options.get(null, null, true);
                var result = [];
                for (var i = 0; i < selected.length; i++) {
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
                var group = (option.parentElement instanceof HTMLOptGroupElement) ? option.parentElement.label || "#" : "#";
                var item = select.__.create("DIV", "select-item");
                var title = select.__.create("SPAN", "item-title");
                var remove = select.__.create("SPAN", "item-unselect");
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
        for (var i = 0; i < items.length; i++) {
            var _a = items[i], option = _a[0], states = _a[1];
            var value = option.value || option.innerText;
            var group = (option.parentElement instanceof HTMLOptGroupElement) ? option.parentElement.label || "#" : "#";
            var item = this._container.querySelector(".select-item[data-value='" + value + "'][data-group='" + group + "']");
            if (states.selected && !item) {
                var item_1 = this.render("move-item", option, null);
                if (!this.get("moveOrder")) {
                    this._container.appendChild(item_1);
                    continue;
                }
                var list = this._dropdown.querySelector("li[data-value='" + value + "'][data-group='" + group + "']");
                var index = this._container_index.indexOf(list);
                var position = this._container.querySelector(".select-item") ? index : this._container_index.length;
                do {
                    position++;
                } while (this._container_items.length > position && this._container_items[position] === "");
                if (this._container_items[position]) {
                    this._container.insertBefore(item_1, this._container_items[position]);
                } else {
                    this._container.appendChild(item_1);
                }
                this._container_items[index] = item_1;
            } else if (!states.selected && item) {
                this._container.removeChild(item);
                var index = this._container_items.indexOf(item);
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
        for (var i = 0; i < items.length; i++) {
            var _a = items[i], option = _a[0], states = _a[1];
            var value = option.value || option.innerText;
            var group = (option.parentElement instanceof HTMLOptGroupElement) ? option.parentElement.label || "#" : "#";
            var item = this._dropdown.querySelector("li[data-value='" + value + "'][data-group='" + group + "']");
            if (states.selected && !item.classList.contains("pinned")) {
                var keep = item.cloneNode(true);
                var parent_1 = item.parentElement;
                item.classList.add("pinned");
                keep.style.display = "none";
                parent_1.replaceChild(keep, item);
                parent_1.insertBefore(item, parent_1.querySelector("li:not(.pinned)"));
            } else if (!states.selected && item.classList.contains("pinned")) {
                var keep = this._dropdown.querySelector("li[data-value='" + value + "'][data-group='" + group + "']:not(.pinned)");
                item.classList.remove("pinned");
                keep.parentElement.replaceChild(item, keep);
            }
        }
        return this;
    };
    
    return select;
}));