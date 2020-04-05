/*!
 |  SELECT - INPUT
 |  @description    Adds the search <input /> to the label and allows to create new items.
 */
declare var select: any;
declare var Select: any;

/*
 |  PLUGIN OPTIONs
 */
var options: any = {
    input: true,
    create: false,
    createCallback: null,
    createHidden: false,
    createGroup: "#",
    createRemove: false
};

/*
 |  PLUGIN HOOKS
 */
var hooks: any = {
    /*
     |  HOOK :: CHECK SETTINGS
     |  @since  0.6.0 [0.6.0]
     */
    "init:before": function() {
        if(this.get("input")) {
            this.set("search", true);
        }
        return true;
    },

    /*
     |  HOOK :: PREPARE HTML
     |  @since  0.6.0 [0.6.0]
     */
    "build:after": function() {
        if(this.get("input")) {
            this._label.classList.add("label-input");
            this._search.querySelector("input").removeAttribute("placeholder");
            this._search.className = "label-search";
        }
        return true;
    },

    /*
     |  HOOK :: LSITEN TO SEARCH FIELD
     |  @since  0.6.0 [0.6.0]
     */
    "bind:before": function(event) {
        if(!(event instanceof Event) || !this.get("input")) {
            return true;
        }
        if(event.type !== "input" || event.target !== this._search.children[0]) {
            return true;
        }
        this.calculateLabelInput();
        
        // Query & Return
        let input = <HTMLInputElement>event.target;
        if(input.value.length >= Math.max(this.get("searchMinLength", 3), 1)) {
            this.query("finder", [input.value, this.get("searchConfig", ["text", "value"]), this.get("sortSearch")]);
        } else if(this._last_query[0] !== this.options.walker) {
            this.query("walker", [this.get("sortGroups"), this.get("sortItems")]);
        }
        input.focus();
        return false;
    },

    /*
     |  FILTER :: SET LABEL
     |  @since  0.6.0 [0.6.0]
     */
    "update#label": function(string, label, count, replace) {
        if(!this.get("input")) {
            return [string, label, count, replace];
        }
        let tlabel = select.__.create("DIV", this._label.className);

        // Search
        if(!this.get("multiple") && label === this.value()) {
            this._search.children[0].value = label;
            this.calculateLabelInput(label);
        } else {
            this._search.children[0].setAttribute("placeholder", this._e(label, replace));
            this.calculateLabelInput(this._e(label, replace));
        }

        // Create Count
        if(count) {
            let tcount = select.__.create("DIV", "label-count");
                tcount.innerHTML = this._e(count, replace);
                tlabel.appendChild(tcount);
        }
        
        // Create Inner + Append Search
        let tinner = select.__.create("DIV", "label-inner");
            tinner.appendChild(this._search);
            tlabel.appendChild(tinner);

        // Return as String
        return [tlabel, label, count, replace];
    },

    /*
     |  FILTER :: RENDER EMPTY TYPE
     |  @since  0.6.0 [0.6.0]
     */
    "render#empty": function(content) {
        if(!(this.get("input") && this.get("inputCreate"))) {
            return [content];
        }
        let item = select.__.create("SPAN", "dropdown-create");
        item.innerHTML = `<b>${this._e("createOption")}</b>`
                       + `<span>${this._search.children[0].value}</span>`;
        return [item]
    }
};

/*
 |  ADD PLUGIN
 */
select.plugins.add("input", options, hooks);
select.strings.en["createOption"] = "Press Return to create";

/*
 |  ADD CALCULATE LABEL INPUT
 |  @since  0.6.0 [0.6.0]
 */
select.prototype.calculateLabelInput = function(value?: string | null) {
    if(!this.get("input")) {
        return this;
    }

    // Caclulate and Return
    let temp = select.__.create("SPAN", "search-width");
    temp.innerText = value || this._search.children[0].value;
    this._label.appendChild(temp);
    this._search.children[0].style.width = Math.max(temp.offsetWidth, 2) + "px";
    this._label.removeChild(temp);
    return this;
};
