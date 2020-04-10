/*!
 |  SELECT - AJAX LOADER
 |  @description    Speed up your website and load your dropdown options asynchronously.
 */
declare var select: any;

/*
 |  PLUGIN OPTIONs
 */
var options: any = {
    ajax: true,
    ajaxCallback: null,
    ajaxOn: "init",
    ajaxReset: false,
    ajaxSearch: false
};

/*
 |  PLUGIN HOOKS
 */
var hooks: any = {
    /*
     |  HOOK :: SET INTERNAL AJAX VARIABLE
     |  @since  0.6.0 [0.6.0]
     */
    "init:before": function(): boolean {
        this.set("ajax", (this.get("ajax") && typeof this.get("ajaxCallback") === "function"));
        this._ajax = false;
        this._ajax_call = false;
        this._ajax_result = undefined;
        return true;
    },

    /*
     |  HOOK :: UPDATE INTERNAL AJAX VARIABLE
     |  @since  0.6.0 [0.6.0]
     */
    "init:after": function(): boolean {
        this._ajax = this.get("ajaxOn") === "init";
        return true;
    },

    /*
     |  EVENT :: UPDATE INTERNAL AJAX VARIABLE
     |  @since  0.6.0 [0.6.0]
     */
    "open": function(): void {
        if(this.get("ajaxOn") === "open") {
            this._ajax = true;
            this.query.apply(this, this._last_query);
        }
    },

    /*
     |  HOOK :: TAKE OVER QUERY
     |  @since  0.6.0 [0.6.0]
     */
    "query:before": function(method: string, args: Array<any>): boolean {
        if(!this.get("ajax") || (method === "finder" && !this.get("ajaxSearch"))) {
            return true;
        }
        let label = (this.get("ajaxOn") === "init")? "loading": void 0;
        let loading = (function(input) {
            let load = this.render(`ajax-${input? "waiting": "loading"}`, null, [method, args]);
            let root = select.__.create("DIV", "dropdown-inner");
                root.appendChild(load);
            
            let inner = this._dropdown.querySelector(".dropdown-inner");
            this._dropdown[(inner? "replace": "append") + "Child"](root, inner);
        }).bind(this);

        // AJAX :: Input
        if(this.get("ajaxOn") === "input" && method === "finder") {
            this._ajax = true;
        }

        // AJAX :: Waiting
        if(!this._ajax) {
            loading(this.get("ajaxOn") === "input");
        }

        // AJAX :: Active
        if(this._ajax) {
            if(this._ajax_result === void 0 || (this.get("ajaxReset") && method !== "ajax")) {
                if(this._ajax_call) {
                    return false;
                }
                this._ajax_call = true;
                
                (function(self) {
                    loading(0);
                    setTimeout(function(){ ajaxHandler.call(self, method, args); }, 0);
                }).call(this, this);
            } else {
                return true;
            }
        }

        // Set Label
        let value = this.value();
        let limit = this.get("multiLimit", Infinity);
        if(label === void 0) {
            switch(true) {
                case this.get("disabled"): 
                    label = "disabled"; break;
                case this.get("multiple") && limit === Infinity:
                    label = (value.length === 0)? "multiple": "multipleList"; break;
                case this.get("multiple") && limit !== Infinity:
                    label = (value.length === limit)? "multipleLimit": "multipleCount"; break;
                default:
                    label = (this.get("multiple"))? "multiple": "single"; break;
            }
            if(label !== "disabled") {
                label = (typeof this.get("placeholder") === "string")? this.get("placeholder"): label;
            }
        }

        // Return
        this.updateLabel(label).updateCSV();
        return false;
    },

    "query:after": function() {
        this._label.querySelector("input").focus();
        return true;
    },

    /*
     |  FILTER :: EXTEND RENDER OBJECT
     |  @since  0.6.0 [0.6.0]
     */
    "render": function(types: Object): Array<any> {
        types["ajax-waiting"] = function(string) {
            let span = select.__.create("DIV", "dropdown-ajax dropdown-ajax-waiting");
            span.innerHTML = `<span>${string || this._e("waiting")}</span>`;
            return span;
        };
        types["ajax-loading"] = function() {
            let span = select.__.create("DIV", "dropdown-ajax dropdown-ajax-loading");
            span.innerHTML = `<span>${this._e("loading")}</span>`;
            return span;
        };
        types["ajax-error"] = function(string) {
            let span = select.__.create("DIV", "dropdown-ajax dropdown-ajax-error");
            span.innerHTML = `<span>${string || this._e("error")}</span>`;
            return span;
        };
        return [types];
    }
};

/*
 |  PLUGIN :: ASYNCHRON AJAX HANDLER
 */
let ajaxHandler = function(method: string, args: Array<any>): void {
    let self: any = this;
    let ajax: Object = {
        success: function(items: Object | boolean, keepOld?: boolean): void {
            if(self._ajax_result !== void 0 && !keepOld) {
                for(let key in self._ajax_result) {
                    let item = self._ajax_result[key];
                    if(typeof item === "string" || item instanceof HTMLElement) {
                        self.options.remove(key, true);
                    } else {
                        self.options.remove([key, item.group || item.optgroup || "#"], true);
                    }
                }
            }
            self._ajax_call = false;
            self._ajax_result = items;

            // Add and Apply
            self.options.add(items, null, false);
            self.query.apply(self, ["ajax", self._last_query[1]]);
        },
        error: function(message?: string | null): void {
            self._ajax_call = false;
            self._ajax_result = undefined;

            // Create Error
            let root = select.__.create("DIV", "dropdown-inner");
            let load = self.render("ajax-error", message, [method, args]);
                root.appendChild(load);
            
            // Add
            let inner = self._dropdown.querySelector(".dropdown-inner");
            self._dropdown[(inner? "replace": "append") + "Child"](root, inner);
        }
    };
    (self.get("ajaxCallback") || function() { this.error("No Walker set"); }).call(ajax, method, args);
};

/*
 |  ADD PLUGIN AND STRINGs
 */
select.plugins.add("ajax", options, hooks);
select.strings.en["error"] = "An Error is occured";
select.strings.en["loading"] = "Loading";
select.strings.en["waiting"] = "Waiting for input";
