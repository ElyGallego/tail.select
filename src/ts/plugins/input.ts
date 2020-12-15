
import RatSelect from "rat.select";

class SelectPluginInput implements RatSelect_Plugin {
    /*
     |  CORE :: SELECT INSTANCE
     */
    select: RatSelect_PluginInputSelect;

    /*
     |  CORE :: CONSTRUCTOR
     */ 
    constructor(select: RatSelect_PluginInputSelect) {
        this.select = select;
    }

    /*
     |  HOOK :: BIND BEFORE
     */
    "bind:before"(this: RatSelect_PluginInputSelect) {
        if(this.search && this.search instanceof HTMLInputElement) {
            this.input = this.search;
        } else {
            this.input = document.createElement("INPUT") as HTMLInputElement;
            this.input.type = "text";
        }
        this.input.className = "label-input";
        this.label.insertBefore(this.input, this.label.querySelector(".label-placeholder"));
        this.select.classList.add("plugin-input");
    }

    /*
     |  HOOK :: BIND AFTER
     */
    "bind:after"(this: RatSelect_PluginInputSelect) {
        
    }

    /*
     |  FILTER :: PLACEHOLDER
     */
    "update#placeholder"(this: RatSelect_PluginInputSelect, placeholder: string, counter: string) {
        this.input.placeholder = placeholder;
        return [null, null];
    }

}

/*
 |  REGISTER DATA
 */
RatSelect.Strings.en["input"] = "Press Return to add...";
RatSelect.Plugins.add("input", SelectPluginInput);
