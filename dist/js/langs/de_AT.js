/*! pytesNET/rat.select | @version 1.0.0 | @license MIT | @copyright pytesNET <info@pytes.net> */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('rat.select')) :
    typeof define === 'function' && define.amd ? define(['rat.select'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rat.select));
}(this, (function (RatSelect) {
    "use strict";

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    RatSelect.Strings["de_AT"] = {
        "key": "value"
    };
    function test(object) {
        return __assign(__assign({}, object), { test: 14 });
    }
    test({ test: 12 });

})));

/*! Visit this project on https://rat.md/select */
//# sourceMappingURL=de_AT.js.map
