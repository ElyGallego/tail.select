/*! pytesNET/rat.select | @version 1.0.0 | @license MIT | @copyright pytesNET <info@pytes.net> */
"use strict";

import { Select } from 'rat.select';

Select.Plugins.add("search", { }, {
    "init:before": function() {
        this.options.finder = function*() {
            yield "1";
        };
    }
});
//# sourceMappingURL=search.js.map
