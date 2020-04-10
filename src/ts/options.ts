/*
 |  OPTIONS :: CLASS
 */
class Options {
    parent: Select
    source: HTMLSelectElement

    /*
     |  CONSTRUCTOR
     |  @since  0.6.0 [0.6.0]
     |
     |  @param  object  The respective Select instance.
     */
    constructor(select: Select) {
        this.parent = select;
        this.source = select.e;

        // Add Attribute to each <option>
        [].map.call(this.source.querySelectorAll("option:not([value])"), (i) => {
            if(i.innerText !== "") {
                i.setAttribute("value", i.innerText);
            }
        });

        // Init Deselectability
        if(this.parent.get("deselect") && !this.parent.get("multiple")) {
            let option: HTMLOptionElement = this.source.querySelector("option:checked");
            if(this.source.querySelector("option[selected]") === null) {
                if(option) {
                    option.selected = false;
                }
                this.source.selectedIndex = -1;
            }
        }
        return this;
    }

    /*
     |  HELPER :: CREATE A NEW OPTION
     |  @since  0.6.0  [0.6.0]
     |  
     |  @param  string  The value of the new <option> Element.
     |  @param  string  The innerText of the new <option> Element.
     |  @param  onject  Additional data for the <option> Element.
     |
     |  @return object  The <option> HTML Element. 
     */
    create(value: string, text: string, data?: object): HTMLElement | HTMLOptionElement {
        let temp = d.createElement("OPTION");
        temp.setAttribute("value", value);
        temp.innerText = text;

        if(data !== void 0 && data instanceof Object) {
            for(let key in data) {
                if(["group", "optgroup", "position"].indexOf(key) >= 0) {
                    continue;
                }
                if(["disabled", "selected", "hidden"].indexOf(key) >= 0) {
                    temp[key] = data[key];
                    continue;
                }
                temp.setAttribute((key === "description")? "data-description": key, data[key]);
            }
        }
        return temp;
    }

    /*
     |  SELECTOR :: GET ONE OR MORE ITEMS
     |  @since  0.3.0 [0.6.0]
     |
     |  @param  multi   [See Below]. Passed objects (such as an HTMLOptionElement) gets returned
     |                  the way they are passed to avoid errors on repeated method calls.
     |          string  The value of the desired <option> element OR
     |          int     The position number of the desired <option> element OR
     |          null    Nothing or Null to get all <option> elements.
     |  @param  string  The label value of the <optgroup> element (or '#' for ungrouped) OR
     |          null    Nothing or Null to don't restrict the selection to an <optgroup>.
     |  @param  bool    TRUE to explicit get selected <option>s, FALSE to explicit avoid them.
     |  @param  bool    TRUE to explicit get disabled <option>s, FALSE to explicit avoid them.
     |  @param  bool    TRUE to explicit get hidden <option>s, FALSE to explicit avoid them.
     |
     |  @return multi   All <option> elements, based on the passed arguments, as NodeList.
     |                  An empty Array if [value] or [group] are invalid.
     |                  The passed [value] argument if it is an object.
     */
    get(value?: any, group?: string | null, checked?: boolean, disabled?: boolean, hidden?: boolean): any {
        if(value instanceof Object) {
            return value;
        }

        // Base Selector
        let selector = ((hidden)? "[hidden]": (hidden === false)? ":not([hidden])": "")
                     + ((checked)? ":checked": (checked === false)? ":not(:checked)": "")
                     + ((disabled)? ":disabled": (disabled === false)? ":not(:disabled)": "");

        // Option Selector
        if(typeof value === "number") {
            let _nth = (value > 0)? ":nth-child": ":nth-last-child";
            selector = `option${_nth}(${Math.abs(value)})${selector}`;
        } else if(typeof value === "string" || !value) {
            selector = `option` + (typeof value === "string"? `[value="${value}"]`: ``) + selector;
        } else {
            return [];
        }

        // Select & Return
        if(!group){
            return this.source.querySelectorAll(selector);
        } else if(group !== "#") {
            return this.source.querySelectorAll(`optgroup[label="${group}"] ${selector}`);
        } else if(group === "#") {
            selector = `select[data-tail-select="tail-${this.parent.id}"] > ${selector}`;
            return this.source.parentElement.querySelectorAll(selector);
        }

        // Invalid Parameters
        return [];
    }
    
    /*
     |  SELECTOR :: GET ALL AVAILABLE GROUPS
     |  @since  0.6.0 [0.6.0]
     |
     |  @param  bool    TRUE to return the <optgroup> Elements, FALSE to return just the labels
     |
     |  @return multi   The <optgroup> elements as NodeList or just the <optgroup>.labels as ARRAY.
     */
    getGroups(objects?: boolean): Array<string> | NodeList | any {
        var groups = this.source.querySelectorAll("optgroup");
        return (objects)? groups: [].map.call(groups, (i) => i.label);
    }

    /*
     |  SELECTOR :: COUNT
     |  @since  0.6.0 [0.6.0]
     |
     |  @param  string  The label value of the <optgroup> element (or '#' for ungrouped) OR
     |          null    Nothing or Null to don't restrict the selection to an <optgroup>.
     |  @param  bool    TRUE to exclude, FALSE to explicit get selected <option>s.
     |  @param  bool    TRUE to exclude, FALSE to explicit get disabled <option>s.
     |  @param  bool    TRUE to exclude, FALSE to explicit get hidden <option>s.
     |
     |  @return int     The number of options depending on the passed parameters.
     */
    count(group?: any, checked?: boolean, disabled?: boolean, hidden?: boolean): number {
        if(arguments.length === 0) {
            return this.source.options.length;
        }
        return this.get(null, group || null, checked, disabled, hidden).length;
    }

    /*
     |  CORE :: SET A NEW OPTiON
     |  @since  0.3.0 [0.6.0]
     |
     |  @param  multi   A single new <option> HTML Element object,
     |                  An Array with multiple HTML Elements objects.
     |  @param  string  The <optgroup> label or '#' to add as ungrouped <option>.
     |                  If the group doesn't exist, it will be automatically added.
     |  @param  int     The position number, where the item should be added.
     |                  Use `-1` to add the new item on the end of the list.
     |  @param  bool    TRUE to reload the dropdown list, FALSE to prevent reloading.
     |  
     |  @return this    The Options instance.
     */
    set(item: any, group?: string | null, position?: number, reload: boolean = true): Options {
        if(!(item instanceof HTMLOptionElement)) {
            if(item.forEach && item.length && item.length > 0) {
                item.forEach((e, i) => this.set(e, group, (position < 0)? -1: (position + i), !1));
            }
            return (reload && this.parent.reload(true))? this: this;
        }
        if(group === null) {
            group = (<HTMLOptGroupElement>item.parentElement).label || "#";
        }

        // Handle Optgroup
        let before: any = null;
        let append: any = null;
        if(typeof group === "string" && group !== "#") {
            let optgroup: any = this.source.querySelector(`optgroup[label='${group}']`);
            if(optgroup === null) {
                optgroup = d.createElement("OPTGROUP");
                optgroup.setAttribute("label", group);
                optgroup.setAttribute("data-select", "add");
                optgroup.appendChild(item);
                this.source.appendChild(optgroup);
                position = -1;
            }

            let options: any = optgroup.querySelectorAll("option");
            if(position < 0 || position > options.length) {
                append = optgroup;
            } else {
                before = options[position];
            }
        } else {
            let selector: string = `select[data-tail-select="tail-${this.parent.id}"] > option`;
            let options: any = this.source.parentElement.querySelectorAll(selector);

            var p = Math.min((position < 0? options.length: position), options.length);
            if(this.source.children.length === p || !options[p-1].nextElementSibling) {
                append = this.source;
            } else {
                before = options[p-1].nextElementSibling || this.source.children[0];
            }
        }

        // Add Option
        if(item.parentElement === null) {
            item.setAttribute("data-select", "add");
        }
        if(before) {
            before.parentElement.insertBefore(item, before);
        } else {
            (append || this.source).appendChild(item);
        }
        return (reload && this.parent.reload(true))? this: this;
    }

    /*
     |  CORE :: PARSE AN OPTION OBJECT
     |  @since  0.3.0 [0.6.0]
     |
     |  @param  object  The respective items object formated as:
     |                  { key: value, key: value }
     |                  { key: { <attr>: value } }
     |  @param  string  The default <optgroup> used when no group is specified in the [data] object.
     |  @param  bool    TRUE to reload the dropdown list, FALSE to prevent reloading.
     |
     |  @return this    The Options instance.
     */
    add(data: object, group?: string | null, reload: boolean = true): Options {
        let option, optgroup, position;
        
        // Loop Data
        for(let key in data) {
            if(typeof data[key] === "string") {
                this.set(this.create(key, data[key]), group || "#", -1, false);
                continue;
            }

            optgroup = data[key].optgroup || data[key].group || group || "#";
            position = data[key].position || -1;
            option = this.create(data[key].key || key, data[key].value || data[key].text, data[key]);
            this.set(option, optgroup, position, false);
        }
        return (reload && this.parent.reload(true))? this: this;
    }


    /*
     |  CORE :: REMOVE OPTION[s]
     |  @since  0.3.0 [0.6.0]
     |
     |  @param  multi   See .get() for more informations.
     |                  Pass multiple values, which should be passed to .get(), as ARRAY.
     |  @param  bool    TRUE to reload the dropdown list, FALSE to prevent reloading.
     |
     |  @return this    The Options instance.
     */
    remove(item: any, reload: boolean = true): Options {
        if(!(item instanceof HTMLOptionElement)) {
            let items = this.get[(item instanceof Array)? "apply": "call"](this, item);
            for(let i = 0; i < items.length; i++) {
                this.remove(items[i], false);
            }
            return (reload && this.parent.reload(true))? this: this;
        }
        item.parentElement.removeChild(item);
        return (reload && this.parent.reload(true))? this: this;
    }

    /*
     |  HANDLER :: HANDLE STATEs
     |  @since  0.3.0 [0.6.0]
     |  
     |  @param  multi   See .get() for more informations.
     |                  Pass multiple values, which should be passed to .get(), as ARRAY.
     |  @param  multi   Pass an object with the state (you want to change) as key and a boolean
     |                  value or use `null` to toggle the state.
     |                  Usable keys are: "selected", "disabled" and "hidden".
     |  @param  bool    TRUE to prevent the update call.
     |  @param  bool    TRUE to forget about any rule and try to force the state.
     |
     |  @return array   An array containing [item, changes] arrays for each single item, which 
     |                  state(s) could be successfully changes. If nothing could be changes, it
     |                  just returns an empty Array.
     */
    handle(item: any, state: object, prevent?: boolean, force?: boolean): Array<any> {
        if(!(item instanceof HTMLOptionElement)) {
            let items = this.get[(item instanceof Array)? "apply": "call"](this, item);
            let result = [];
            for(let t, i = 0; i < items.length; i++) {
                if((t = this.handle(items[i], state, true, force)).length > 0) {
                    result = result.concat(t);
                }
            }
            return (!prevent && this.parent.update(result, true, force))? result: result;
        }
        let con = this.parent.get.bind(this.parent);
        let result = [];
        let changes = {};

        // Disabled & Hidden
        if(state.hasOwnProperty("disabled") && state["disabled"] !== item.disabled) {
            item.disabled = (state["disabled"] === null)? !item.disabled: state["disabled"];
            changes["disabled"] = item.disabled;
        }
        if(state.hasOwnProperty("hidden") && state["hidden"] !== item.hidden) {
            item.hidden = (state["hidden"] === null)? !item.hidden: state["hidden"];
            changes["hidden"] = item.hidden;
        }

        // Selected
        while(state.hasOwnProperty("selected")) {
            state["selected"] = (state["selected"] === null)? !item.selected: state["selected"];

            if(item.disabled || item.hidden || item.selected === state["selected"]) {
                if(!force) break;   // <option> is disabled, hidden or state is already on/off
            }
            if(state["selected"] && con("multiple") && con("multiLimit", Infinity) <= this.count(null, true)) {
                if(!force) break;   // Too many <option>s already selected
            }
            if(!state["selected"] && !con("multiple") && !con("deselect")) {
                if(!force) break;   // Not-Deselectable single select field
            }

            // Handle
            let temp = this.source.options[this.source.selectedIndex];
            item.selected = state["selected"];
            item[(state["selected"]? "set": "remove") + "Attribute"]("selected", "selected");
            changes["selected"] = item.selected;

            if(state["selected"] && !con("multiple") && temp) {
                temp.selected = false;
                temp.removeAttribute("selected"); 
                result.push([temp, { selected: false }])
            } else if(!state["selected"] && !con("multiple") && temp && temp === item) {
                this.source.selectedIndex = -1;
            }
            break;
        }

        // Return
        if(Object.keys(changes).length > 0) {
            result.push([item, changes]);
        }
        return (!prevent && this.parent.update(result, true, force))? result: result;
    }

    /*
     |  HANDLER :: HANDLE STATEs <ALIASES>
     |  @since  0.3.0 [0.6.0]
     */
    select(item: any, prevent?: boolean): Array<any> {
        return this.handle(item, { selected: true }, prevent);
    }
    unselect(item: any, prevent?: boolean): Array<any> {
        return this.handle(item, { selected: false }, prevent);
    }
    disable(item: any, prevent?: boolean): Array<any> {
        return this.handle(item, { disabled: true }, prevent);
    }
    enable(item: any, prevent?: boolean): Array<any> {
        return this.handle(item, { disabled: false }, prevent);
    }
    hide(item: any, prevent?: boolean): Array<any> {
        return this.handle(item, { hidden: true }, prevent);
    }
    show(item: any, prevent?: boolean): Array<any> {
        return this.handle(item, { hidden: false }, prevent);
    }
    toggle(item: any, state: string, prevent?: boolean): Array<any> {
        let obj = (function(i){ i[state] = null; return i; })({});
        return this.handle(item, obj, prevent);
    }

    /*
     |  HANDLER :: RELOAD
     |  @since  0.6.0 [0.6.0]
     |
     |  @param  bool    TRUE to prevent the update call.
     |  @param  bool    TRUE to forget about any rule and try to force the state.
     |
     |  @return array   An array containing [item, changes] arrays for each single item, which 
     |                  state(s) could be successfully changes. If nothing could be changes, it
     |                  just returns an empty Array.
     */
    reload(prevent?: boolean, force?: boolean): Array<any> {
        let limit = this.parent.get("multiple")? this.parent.get("multiLimit",): 1;
        let select = this.source.querySelectorAll("option:checked").length;
        let options = this.source.options;

        // Loop Options
        let changes = [];
        for(let i = options.length - 1; i >= 0; i--) {
            let change:any = { };
            let group = (<HTMLOptGroupElement>options[i].parentElement).label || "#";
            let selc = `li[data-value="${options[i].value}"][data-group="${group}"]`;
            let opt = this.parent._dropdown.querySelector(selc);

            // Current
            for(let key in { 'selected': '', 'disabled': '', 'hidden': '' }) {
                if(opt.classList.contains(key) !== options[i][key]) {
                    change[key] = options[i][key];
                }
            }

            // Check
            if(!force && change.selected && select > limit) {
                delete change["selected"];
                options[i].selected = false;
                select--;
            }
            if(Object.keys(change).length > 0) {
                changes.push([options[i], change]);
            }
        }

        // Update Call & Return
        if(changes.length === 0) {
            return [];  // No Changes
        }
        return (!prevent && this.parent.update(changes, true, false))? changes: changes;
    }
    
    /*
     |  HELPER :: APPLY LINGUSTIC RULES
     |  @since  0.5.13 [0.6.0]
     |
     |  @param  string  The search value, as passed in `.find()`.
     |  @param  bool    TRUE to handle case sensitive, FALSE to do it not.
     |
     |  @return sting   The replaced search value.
     */
    applyLinguisticRules(search: string, strict?: boolean): string {
        var values = [], rules = this.parent.get("linguisticRules", { });
        
        // Prepare Rules
        Object.keys(rules).forEach((key) => values.push("(" + key + "|[" + rules[key] + "])"));
        if(strict){
            values = values.concat(values.map(function(s){ return s.toUpperCase(); })); 
        }
        if(values.length === 0) {
            return search;
        }
        return search.replace(new RegExp(values.join("|"), (!strict)? "ig": "g"), function(i) {
            return values[[].indexOf.call(arguments, i, 1) - 1];
        });
    }

    /*
     |  WALKER :: FINDER
     |  @since  0.3.0 [0.6.0]
     |
     |  @param  string  The value to search for.
     |  @param  multi   The search configuration Array (or a single configuration as string),
     |                  or a custom callback function, which should be used for the searching.
     |  @param  multi   An order direction ("ASC" or "DESC"), an custom order function or null to 
     |                  keep the current <option> order inside the source <select> field.
     |
     |  @return array   An array with all options, depending on [search] and [config].
     */
    find(search: string, config: any, order?: string | Function | null): Array<any> {
        var self = this, matches, has: any = {};

        // Config Callback
        if(typeof config === "function") {
            matches = config.bind(this, search);
        } else {
            config = typeof config === "string"? [config]: config;
        }

        // Config Handler
        if(config instanceof Array) {
            config.forEach((c) => { if(typeof c === "string") has[c] = true });
            has.any = (!has.any)? has.attributes && has.value: has.any;
            
            // Cleanup & Prepare
            if(!has.regex || has.text){
                search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            }
            if(!has.strict){
                search = self.applyLinguisticRules.call(self, search, has.case);
            }
            if(has.word){
                search = '\\b' + search + '\\b';
            }

            // Search
            var regex = new RegExp(search, (!has.case)? "mi": "m"),
                sfunc = function(opt){ return regex.test(opt.innerText || opt.value); };
            
            // Handle
            if(has.any){
                matches = function(opt){ return sfunc(opt) || [].some.call(opt.attributes, sfunc); };
            } else if(has.attributes){
                matches = function(opt){ return [].some.call(opt.attributes, sfunc); };
            } else {
                matches = sfunc;
            }
        }

        // Hammer Time
        let d = this.parent.get("hideDisabled") === null? "disabled": "";
        let e = this.parent.get("hideEmpty", !0)? "value": "";
        let s = this.parent.get("hideSelected") === null? "selected": "";
        let h = this.parent.get("hideHidden", !0) === null? "hidden": "";
        let result = [].filter.call(this.source.options, (i) => {
            return (i[d] || i[e] === "" ||  i[s] || i[h])? false: matches.call(this, i);
        });

        // Sort & Return
        if(order === "ASC") {
            result = [].sort.call([].slice.call(result, 0), (a, b) => a.value > b.value);
        } else if(order === "DESC") {
            result = [].sort.call([].slice.call(result, 0), (a, b) => a.value < b.value);
        } else if(typeof order === "function") {
            result = order.call(this, result);
        }
        return result;
    }

    /*
     |  WALKER :: FINDER <WALKER EDITION>
     |  @since  0.3.0 [0.6.0]
     |
     |  @param  string  The search value.
     |  @param  multi   The search configuration or an custom search function.
     |
     |  @return <Custom> Generatpr
     */
    ///@ts-target:ES5
    ///@ts-ignore
    finder(search: string, config: any, order?: string | Function | null): Array<any> | boolean {
        if(typeof this === "string" && this === "reset") {
            delete arguments[0].__finderLoop;
            return false;
        }

        if(this.__finderLoop === void 0){
            this.__finderLoop = this.find(search, config, order);
        }
        var item;
        while((item = this.__finderLoop.shift()) !== undefined){
            return item;
        }
        return this.finder.call("reset", this);
    }
    __finderLoop: any = undefined;
    ///@ts-target:ES5
    ///@ts-target:ES6
    ///@ts-ignore
    *finder(search: string, config: any, order?: string | Function | null): Generator {
        let items = this.find(search, config, order);
        for(let item of items) {
            yield item;
        }
    }
    ///@ts-target:ES6

    /*
     |  WALKER :: WALKER
     |  @since  0.3.0 [0.6.0]
     |
     |  @param  multi   An order direction ("ASC" or "DESC"), an custom order function or null to 
     |                  keep the source field order of the <optgroup> elements. 
     |  @param  multi   An order direction ("ASC" or "DESC"), an custom order function or null to 
     |                  keep the source field order of the <option> elements.
     | 
     |  @return <Custom> Generator 
     */
    ///@ts-target:ES5
    ///@ts-ignore
    walker(orderg: string | Function | null, orderi: string | Function | null): HTMLElement | boolean {
        if(typeof this === "string" && this === "reset") {
            delete arguments[0].__walkerLoop;
            delete arguments[0].__walkerGroups;
            delete arguments[0].__walkerItems;
            return false;
        }

        // Init Loop
        if(this.__walkerLoop === void 0) {
            let groups: Array<string> = this.getGroups(false) || [];
            if(orderg == "ASC"){
                groups.sort();
            } else if(orderg == "DESC"){
                groups.sort().reverse();
            } else if(typeof orderg === "function"){
                groups = orderg.call(this, groups);
            }
            groups.unshift("#");

            this.__walkerLoop = 0;
            this.__walkerGroups = groups;
            this.__walkerItems = [];
        }

        // Loop Groups
        if(this.__walkerGroups.length > 0 && this.__walkerItems.length === this.__walkerLoop) {
            while(this.__walkerGroups.length > 0) {
                var items = this.get(null, this.__walkerGroups.shift());
                if(items.length > 0) {
                    break;
                }
            }
            if(orderi === "ASC") {
                items = [].sort.call([].slice.call(items, 0), (a, b) => a.value > b.value);
            } else if(orderi === "DESC") {
                items = [].sort.call([].slice.call(items, 0), (a, b) => a.value < b.value);
            } else if(typeof orderi === "function") {
                items = orderi.call(this, items);
            }
            this.__walkerLoop = 0;
            this.__walkerItems = items;
        }

        // Loop Items
        if(this.__walkerLoop < this.__walkerItems.length) {
            let d = this.parent.get("hideDisabled") === null? "disabled": "";
            let e = this.parent.get("hideEmpty", !0)? "value": "";
            let s = this.parent.get("hideSelected") === null? "selected": "";
            let h = this.parent.get("hideHidden", !0) === null? "hidden": "";

            let temp = this.__walkerItems[this.__walkerLoop++];
            if(temp) {
                return (temp[d] || temp[e] === "" || temp[s] || temp[h])? this.walker(orderi, orderg): temp;
            }
        }
        return this.walker.call("reset", this);
    }
    __walkerLoop: any = undefined;
    __walkerGroups: any = undefined;
    __walkerItems: any = undefined;
    ///@ts-target:ES5
    ///@ts-target:ES6
    ///@ts-ignore
    *walker(orderg: any, orderi: any): Generator {
        let groups: Array<string> = this.getGroups(false) || [];
        if(orderg === "ASC") {
            groups.sort();
        } else if(orderg === "DESC") {
            groups.sort().reverse();
        } else if(typeof orderg === "function") {
            groups = orderg.call(this, groups);
        }
        groups.unshift("#");

        // Loop Groups
        for(let group of groups) {
            let items: any = this.get(null, group);
            if(orderi === "ASC") {
                items.sort((a, b) => a.value > b.value);
            } else if(orderi === "DESC") {
                items.sort((a, b) => a.value < b.value);
            } else if(typeof orderi === "function") {
                items = orderi.call(this, items);
            }

            // Loop Items
            let d = this.parent.get("hideDisabled") === null? "disabled": "";
            let e = this.parent.get("hideEmpty", !0)? "value": "";
            let s = this.parent.get("hideSelected") === null? "selected": "";
            let h = this.parent.get("hideHidden", !0) === null? "hidden": "";
            for(let item of items){
                if(item[d] || item[e] === "" || item[s] || item[h]) {
                    continue;
                }
                yield item;
            }
        }
    }
    ///@ts-target:ES6
}
