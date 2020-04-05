/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/plugins/select-columns.js
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
     |  SELECT - COLUMNS
     |  @description    Shows the dropdown groups side-by-side and allows collapsing them.
     */
    
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
    
    return select;
}