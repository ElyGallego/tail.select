/*!
 |  SELECT - COLUMNS
 |  @description    Shows the dropdown groups side-by-side and allows collapsing them.
 */
declare var select: any;

/*
 |  PLUGIN OPTIONs
 */
var options: any = {
    columns: 1,
    groupCollapse: false
};

/*
 |  PLUGIN HOOKS
 */
var hooks: any = {
    /*
     |  HOOK :: VALIDATE OPTIONS
     |  @since  0.6.0 [0.6.0]
     */
    "init:after": function(): boolean {
        let columns = this.get("columns");
        this.set("columns", columns < 1? 1: columns > 5? 5: columns);
        return true;
    },

    /*
     |  HOOK :: COLLAPSE GROUP
     |  @since  0.6.0 [0.6.0]
     */
    "bind:after": function(event: any): boolean {
        if(!this.get("groupCollapse")) {
            return true;
        }
        if(event.type === "click" && event.target.classList.contains("optgroup-collapse")) {
            this.collapse(event.target.parentElement.parentElement);
        }
        return true;
    },

    /*
     |  HOOK :: QUERY AFTER
     |  @since  0.6.0 [0.6.0]
     */
    "query:after": function(): boolean {
        if(!this.get("groupCollapse")) {
            return true;
        }
        let groups = this._dropdown.querySelectorAll("ul");
        for(var i = 0; i < groups.length; i++) {
            groups[i].style.maxHeight = groups[i].offsetHeight + "px";
        }
        return true;
    },

    /*
     |  FILTER :: RENDER GROUP
     |  @since  0.6.0 [0.6.0]
     */
    "render#group": function(group: HTMLElement): Array<any> {
        if(this.get("groupCollapse") && group.querySelector("li.optgroup-title")) {
            let collapse = select.__.create("SPAN", "optgroup-collapse");
            collapse.setAttribute("data-collapse", "true");
            group.querySelector("li.optgroup-title").appendChild(collapse);
        }
        return [group];
    },

    /*
     |  FILTER :: HANDLE DROPDOWN
     |  @since  0.6.0 [0.6.0]
     */
    "dropdown": function(dropdown: HTMLElement): Array<any> {
        if(this.get("columns") <= 1) {
            return [dropdown];
        }
        let items = dropdown.querySelectorAll("li");
        let columns = parseInt(this.get("columns"));
        let lists = ".".repeat(columns - 1).split(".").map(() => {
            return select.__.create("DIV", "inner-column");
        });

        //  MAXIMUM POSSIBLE ELEMENTs
        //
        //  [count] = available items + available group-labels + possible group-label continues
        let count = items.length + (columns - 1);

        //  LOOP ALL ITEMS + GROUP LABELs
        //
        //      [row_num]       The last used column number
        //      [row_grp]       The last used column group <ul> (+ label)
        //      [row]           The current, the last-used (if higher) or the last (if to high) column
        //      [i]             The current item counter
        //      [l]             The current item-place counter
        //                          ... contains continue group-labels
        //                          ... contains skipped item-places
        let row_num = -1;
        let row_grp = null;
        for(let l = 0, i = 0; i < items.length; l++, i++) {
            let row = Math.max(Math.floor(l / Math.ceil(count / columns)), row_num);
                row = Math.min(row, columns-1);

            // Handle Group
            if(row !== row_num || items[i].classList.contains("optgroup-title") || !row_grp) {
                if(!row_grp || items[i].classList.contains("optgroup-title")) {
                    let label = items[i].parentElement.getAttribute("data-group");
                    let group = this.e.querySelector(`optgroup[label='${label}']`);
                    row_grp = this.render("group", group, null);
                } else {
                    let temp = row_grp.cloneNode()
                    if(row_grp.querySelector(".optgroup-title b")) {
                        let label = row_grp.querySelector(".optgroup-title").cloneNode(true);
                        label.querySelector("b").innerText += ` (${this._e("continue")})`;
                        temp.appendChild(label);
                    }
                    row_grp = temp;
                    l++;    // Add Continue Group Label
                }

                //  SKIP OPTGROUP
                //
                //  Skip the optgroup label item, if it is on the bottom of the column
                let temp = Math.floor((l+1) / Math.ceil(count / columns));
                if(temp > row && temp < columns) {
                    l++;    // Add Skipped Item Place
                    row_num = row = temp;
                } else {
                    row_num = row;
                }

                // Append Label Item
                lists[row].appendChild(row_grp);
            }
            if(items[i].classList.contains("optgroup-title")) {
                continue;
            }

            // Append Option Item
            row_grp.appendChild(items[i]);
        }

        // Append & Return
        dropdown.innerHTML = "";
        dropdown.classList.add("dropdown-columns");
        dropdown.classList.add("columns-" + this.get("columns"));
        for(let i = 0; i < lists.length; i++) {
            dropdown.appendChild(lists[i]);
        }
        return [dropdown];
    }
};

/*
 |  ADD PLUGIN
 */
select.plugins.add("columns", options, hooks);
select.strings.en["continue"] = "Continue";

/*
 |  ADD GROUP COLLAPSE METHOD
 |  @since  0.6.0 [0.6.0]
 */
select.prototype.collapse = function(group: string | HTMLElement) {
    if(typeof group === "string") {
        group = this._dropdown.querySelector(`ul[data-group='${group}']`);
    }
    if(group instanceof HTMLElement) {
        group.classList.toggle("collapsed");
    }
    return this;
};
