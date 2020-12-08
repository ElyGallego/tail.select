/*! pytesNET/rat.select | @version 1.0.0 | @license MIT | @copyright pytesNET <info@pytes.net> */
"use strict";

import RatSelect from '../rat.select.js';

RatSelect.Plugins.add("search", {}, {
    "init:before": function () {
        this.options.finder = function () {
            return "1";
        };
    }
});

/*! Visit this project on https://rat.md/select */
//# sourceMappingURL=search.js.map
