
import version from "consts:version";
import status from "consts:status";

import "../sass/harx.scss";
import "../sass/select.scss";
import "../sass/smep.scss";

import "../sass/bluma.scss";
import "../sass/bootstrap2.scss";
import "../sass/bootstrap3.scss";
import "../sass/bootstrap4.scss";
import "../sass/foundation.scss";
import "../sass/materialize.scss";

import "../sass/chosen.scss";
import "../sass/select2.scss";
import "../sass/selectize.scss";

import { Select } from "./select";
import { Options } from "./options";
import { Strings } from "./strings";
import { Plugins } from "./plugins";

/*
 |  MAIN RAT.SELECT FUNCTION
 */
function RatSelect(selector: RatSelect_SelectSelector, config?: RatSelect_Config, options?: RatSelect_OptionsConstructor): null | RatSelect_Select | RatSelect_Select[] {
    let _return = (source) => {
        if(!(source instanceof HTMLSelectElement)) {
            return null;
        }
        if(source.dataset.ratSelect) {
            return Select.inst[source.dataset.ratSelect];
        }
        return new Select(source, config? Object.assign({}, config): ({ } as RatSelect_Config), options? options: Options);
    };
    if(typeof selector === "string") {
        selector = document.querySelectorAll(selector);
    }
    if(selector instanceof HTMLSelectElement) {
        return _return(selector);
    }
    return [].map.call(selector, _return);
}
RatSelect.version = version;
RatSelect.status = status;
RatSelect.Select = Select;
RatSelect.Options = Options;
RatSelect.Strings = Strings;
RatSelect.Plugins = Plugins;

// Export
export default RatSelect;
