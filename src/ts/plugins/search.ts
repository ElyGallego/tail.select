
import RatSelect from "rat.select";

RatSelect.Plugins.add("search", { }, {
    "init:before": function() {
        this.options.finder = function() {
            return "1";
        };
    }
});
