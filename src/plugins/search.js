
import { Select } from "rat.select";

Select.Plugins.add("search", { }, {
    "init:before": function() {
        this.options.finder = function*() {
            yield "1";
        };
    }
});
