/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/plugins/select-input.js
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
     |  SELECT - INPUT
     |  @description    Adds the search <input /> to the label and allows to create new items.
     */
    
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
            var input = event.target;
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
            var tlabel = select.__.create("DIV", this._label.className);
            if (!this.get("multiple") && label === this.value()) {
                this._search.children[0].value = label;
                this.calculateLabelInput(label);
            } else {
                this._search.children[0].setAttribute("placeholder", this._e(label, replace));
                this.calculateLabelInput(this._e(label, replace));
            }
            if (count) {
                var tcount = select.__.create("DIV", "label-count");
                tcount.innerHTML = this._e(count, replace);
                tlabel.appendChild(tcount);
            }
            var tinner = select.__.create("DIV", "label-inner");
            tinner.appendChild(this._search);
            tlabel.appendChild(tinner);
            return [tlabel, label, count, replace];
        },
        "render#empty": function (content) {
            if (!(this.get("input") && this.get("inputCreate"))) {
                return [content];
            }
            var item = select.__.create("SPAN", "dropdown-create");
            item.innerHTML = "<b>" + this._e("createOption") + "</b>"
                + ("<span>" + this._search.children[0].value + "</span>");
            return [item];
        }
    };
    select.plugins.add("input", options, hooks);
    select.strings.en["createOption"] = "Press Return to create";

    select.prototype.calculateLabelInput = function (value) {
        if (!this.get("input")) {
            return this;
        }
        var temp = select.__.create("SPAN", "search-width");
        temp.innerText = value || this._search.children[0].value;
        this._label.appendChild(temp);
        this._search.children[0].style.width = Math.max(temp.offsetWidth, 2) + "px";
        this._label.removeChild(temp);
        return this;
    };
    
    return select;
}));