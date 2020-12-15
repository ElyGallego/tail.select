
import RatSelect from "rat.select";

class SelectPluginAjax implements RatSelect_Plugin {
    /*
     |  CORE :: SELECT INSTANCE
     */
    select: RatSelect_PluginAjaxSelect;

    /*
     |  CORE :: CONSTRUCTOR
     */ 
    constructor(select: RatSelect_PluginAjaxSelect) {
        this.select = select;
    }
    
    /*
     |  CORE :: RENDER DROPDOWN
     */
    render() {
        
    }

    /*
     |  HOOK :: INIT BEFORE
     */
    "init:after"(this: RatSelect_PluginAjaxSelect) {
        this.ajax = this.get("ajax.listen", "init") === "init";
    }

    /*
     |  EVENT :: OPEN
     */
    "open"(this: RatSelect_PluginAjaxSelect) {
        if(!this.ajax) {
            this.ajax = this.get("ajax.listen", "open") === "open";
        }
        this.query();
    }

    /*
     |  EVENT :: CLOSE
     */
    "close"(this: RatSelect_PluginAjaxSelect) {
        if(this.get("ajax.reset")) {
            this.ajax = this.get("ajax.listen", "init") === "init";
            this.ajaxItems = [ ];
        }
    }

    /*
     |  HOOK :: QUERY BEFORE
     */
    "query:before"(this: RatSelect_PluginAjaxSelect) {
        if(this.ajax === true) {
            let callback = this.get("ajax.callback", (_0, _1, _2) => { _1(); });

            // Resolve
            let resolve = (function(items) {
                this.ajax = "resolved";
                this.ajaxItems = items;
                this.options.parse(this.ajaxItems);
                this.query();
            }).bind(this);

            // Reject
            let reject = (function(error) {
                this.ajax = "rejected";
                this.ajaxItems = [ ];
                this.query();
            }).bind(this);

            // Call
            let result = callback.call(this, resolve, reject, this);
            if(typeof Promise !== "undefined" && result instanceof Promise) {
                result.then(resolve, reject);
            }
        }
        if(this.ajax === "resolved") {
            return true;
        }
        if(this.ajax === "rejected") {
            return false;
        }
        return false;
    }

    /*
     |  FILTER :: PLACEHOLDER
     */
    "update#placeholder"(this: RatSelect_PluginAjaxSelect, label: string, count: string) {
        if(this.get("ajax.forcePlaceholder", true) && label === this.locale._("empty")) {
            label = this.get("placeholder") || label;
        }
        return [label, count];
    }
}

/*
 |  REGISTER DATA
 */
RatSelect.Strings.en["error"] = "Oops, an error is occured";
RatSelect.Strings.en["loading"] = "Loading, please wait.";
RatSelect.Strings.en["waiting"] = "Waiting for your input.";
RatSelect.Plugins.add("ajax", SelectPluginAjax);
