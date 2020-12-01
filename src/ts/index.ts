
import version from "consts:version";
import status from "consts:status";

import "../sass/select.scss";
import "../sass/bootstrap2.scss";
import "../sass/bootstrap3.scss";
import "../sass/bootstrap4.scss";
import "../sass/selectize.scss";
import "../sass/harx.scss";
import "../sass/chosen.scss";

import { Select } from "./select";
import { Options } from "./options";

/*
 |  MAIN RAT.SELECT FUNCTION
 */
function RatSelect(selector: RatSelect_SelectSelector, config?: RatSelect_Config, options?: RatSelect_OptionsConstructor): null | Select | Array<Select | null>  {
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

// Export
export default RatSelect;