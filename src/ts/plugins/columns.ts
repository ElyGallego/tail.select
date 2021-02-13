
import RatSelect from "rat.select";

class SelectPluginColumns implements RatSelect_Plugin {
    /*
     |  CORE :: SELECT INSTANCE
     */
    select: RatSelect_PluginColumnsSelect;

    /*
     |  CORE :: CONSTRUCTOR
     */ 
    constructor(select: RatSelect_PluginColumnsSelect) {
        this.select = select;
    }
}

RatSelect.Plugins.add("columns", SelectPluginColumns);
