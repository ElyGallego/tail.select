
import { Select } from "../ts/select";

Select.plugins.add("search", { }, {
    "init:before": function() {
        this.options.finder = function() {
            return "1";
        };
    }
});
