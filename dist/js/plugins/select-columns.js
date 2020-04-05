/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/plugins/select-columns.js
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
     |  SELECT - COLUMNS
     |  @description    Shows the dropdown groups side-by-side and allows collapsing them.
     */
    
    var options = {
        columns: 1,
        groupCollapse: false
    };

    var hooks = {
        "init:after": function () {
            var columns = this.get("columns");
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
            var groups = this._dropdown.querySelectorAll("ul");
            for (var i = 0; i < groups.length; i++) {
                groups[i].style.maxHeight = groups[i].offsetHeight + "px";
            }
            return true;
        },
        "render#group": function (group) {
            if (this.get("groupCollapse") && group.querySelector("li.optgroup-title")) {
                var collapse = select.__.create("SPAN", "optgroup-collapse");
                collapse.setAttribute("data-collapse", "true");
                group.querySelector("li.optgroup-title").appendChild(collapse);
            }
            return [group];
        },
        "dropdown": function (dropdown) {
            if (this.get("columns") <= 1) {
                return [dropdown];
            }
            var items = dropdown.querySelectorAll("li");
            var columns = parseInt(this.get("columns"));
            var lists = ".".repeat(columns - 1).split(".").map(function () {
                return select.__.create("DIV", "inner-column");
            });
            var count = items.length + (columns - 1);
            var row_num = -1;
            var row_grp = null;
            for (var l = 0, i = 0; i < items.length; l++, i++) {
                var row = Math.max(Math.floor(l / Math.ceil(count / columns)), row_num);
                row = Math.min(row, columns - 1);
                if (row !== row_num || items[i].classList.contains("optgroup-title") || !row_grp) {
                    if (!row_grp || items[i].classList.contains("optgroup-title")) {
                        var label = items[i].parentElement.getAttribute("data-group");
                        var group = this.e.querySelector("optgroup[label='" + label + "']");
                        row_grp = this.render("group", group, null);
                    } else {
                        var temp_1 = row_grp.cloneNode();
                        if (row_grp.querySelector(".optgroup-title b")) {
                            var label = row_grp.querySelector(".optgroup-title").cloneNode(true);
                            label.querySelector("b").innerText += " (" + this._e("continue") + ")";
                            temp_1.appendChild(label);
                        }
                        row_grp = temp_1;
                        l++;
                    }
                    var temp = Math.floor((l + 1) / Math.ceil(count / columns));
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
            for (var i = 0; i < lists.length; i++) {
                dropdown.appendChild(lists[i]);
            }
            return [dropdown];
        }
    };
    select.plugins.add("columns", options, hooks);
    select.strings.en["continue"] = "Continue";

    select.prototype.collapse = function (group) {
        if (typeof group === "string") {
            group = this._dropdown.querySelector("ul[data-group='" + group + "']");
        }
        if (group instanceof HTMLElement) {
            group.classList.toggle("collapsed");
        }
        return this;
    };
    
    return select;
}));