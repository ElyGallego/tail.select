/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/plugins/select-ajax.js
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
     |  SELECT - AJAX LOADER
     |  @description    Speed up your website and load your dropdown options asynchronously.
     */
    
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
    
    return select;
}