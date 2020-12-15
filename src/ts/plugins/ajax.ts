
import RatSelect from "rat.select";

class SelectPluginAjax implements RatSelect_Plugin {
    /*
     |
     */
    select: RatSelect_Select;

    /*
     |  CONSTRUCTOR
     */ 
    constructor(select: RatSelect_Select) {
        this.select = select;
    }
}

/*
 |  REGISTER DATA
 */
RatSelect.Strings.en["error"] = "Oops, an error is occured";
RatSelect.Strings.en["loading"] = "Loading, please wait.";
RatSelect.Strings.en["waiting"] = "Waiting for your input.";
RatSelect.Plugins.add("ajax", SelectPluginAjax);
