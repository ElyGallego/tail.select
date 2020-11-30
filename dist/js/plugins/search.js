/*! pytesNET/rat.select | @version 1.0.0 | @license MIT | @copyright pytesNET <info@pytes.net> */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('rat.select')) :
    typeof define === 'function' && define.amd ? define(['rat.select'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rat.select));
}(this, (function (rat_select) {
    "use strict";

    rat_select.Select.Plugins.add("search", { }, {
        "init:before": function() {
            this.options.finder = function*() {
                yield "1";
            };
        }
    });

})));
//# sourceMappingURL=search.js.map
