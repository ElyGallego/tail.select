
import RatSelect from "rat.select";

class SelectPluginColumns implements RatSelect_Plugin {
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

RatSelect.Plugins.add("columns", SelectPluginColumns);
