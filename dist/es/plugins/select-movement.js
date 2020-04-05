/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/plugins/select-movement.js
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