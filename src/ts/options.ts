
export class Options implements RatSelect_Options {
    /*
     |  CORE :: SOURCE SELECT FIELD
     */
    source: HTMLSelectElement;

    /*
     |  CORE :: RAT.SELECT INSTANCE
     */
    select: RatSelect_Select;

    /*
     |  CORE :: UNGROUPED PSEUDEO ID
     */
    ungrouped: string = "#";

    /*
     |  CORE :: CONSTRUCTOR
     */
    constructor(select?: RatSelect_Select) {
        this.select = select;
        this.source = select.source;

        // Prepare Source Select
        [].map.call(this.source.querySelectorAll('option:not([value])'), (option) => {
            if(option.innerText !== "") {
                option.setAttribute("value", option.innerText);
            }
        });

        // Prepare Deselectability
        if(select.get("deselect") && !select.get("multiple")) {
            let option = this.source.querySelector('option:checked') as HTMLOptionElement;
            if(option && this.source.querySelector('option[selected]') === null) {
                option.selected = false;
                this.source.selectedIndex = -1;
            }
        }
    }

    /*
     |  HELPER :: CREATE A NEW OPTION
     */
    create(value?: string, item?: RatSelect_ItemExtended): HTMLOptionElement {
        let option = document.createElement("OPTION") as HTMLOptionElement;
        option.value = value;
        option.innerText = item.title;
        option.selected = item.selected || false;
        option.disabled = item.disabled || false;
        option.hidden = item.hidden || false;
        if(item.description) {
            option.dataset.description = item.description;
        }
        return option;
    }

    /*
     |  HELPER :: PARSE OPTION OBJECT
     */
    parse(items?: RatSelect_Item[]): RatSelect_Options {
        for(let key in items) {
            if(typeof items[key] === "string") {
                var item = this.create(key, Object({ title: items[key] }));
            } else {
                var item = this.create(key, items[key] as RatSelect_ItemExtended);
            }
            this.set(item);
        }
        return this;
    }

    /*
     |  API :: GET ONE OR MORE OPTIONs
     */
    get(value?: null | Number | string, group?: null | false | string, states?: string[]): Array<null> | NodeListOf<HTMLOptionElement> {
        let format = { disabled: ":disabled", selected: ":checked", hidden: "[hidden]" };
        group = group === ""? false: group;

        // State Selector
        let selector = states? states.map((state) => {
            return state[0] === "!"? `:not(${format[state.slice(1)]})`: format[state];
        }): "";
        selector += ":not([data-rat-ignore])";

        // Option Selector
        if(typeof value === "number") {
            let nth = (value > 0)? ":nth-child": ":nth-last-child";
            selector = `option${nth}(${Math.abs(value)})${selector}`;
        } else if(typeof value === "string" || !value) {
            selector = `option${!value? "": `[value="${value}"]`}${selector}`;
        } else {
            return [];
        }

        // Group Selector
        if(!group) {
            return this.source.querySelectorAll(selector);
        } else if(group === this.ungrouped) {
            selector = `select[data-rat-select="${this.source.dataset.ratSelect}"] > ${selector}`;
            return this.source.parentElement.querySelectorAll(selector);
        } else if(typeof group === "string") {
            return this.source.querySelectorAll(`optgroup[label="${group}"] ${selector}`);
        }
        return [];
    }

    /*
     |  API :: GET ONE OR MORE GROUPs
     */
    getGroups(objects?: boolean): string[] | NodeListOf<HTMLOptGroupElement> {
        let groups = this.source.querySelectorAll("optgroup");
        return (objects)? groups: [].map.call(groups, (i) => i.label);
    }

    /*
     |  API :: COUNT OPTIONs
     */
    count(group?: null | false | string, states?: string[]): number {
        if(arguments.length === 0) {
            return this.source.options.length;
        }
        let result = this.get(null, group, states);
        return result? result.length: 0;
    }

    /*
     |  API :: SET A NEW OPTION
     */
    set(item: RatSelect_OptionSelector, group?: null | false | string, position?: null | number, reload?: boolean): RatSelect_Options {
        if(!(item instanceof HTMLOptionElement)) {
            [].map.call(item, (el, i) => this.set(el, group, (position < 0)? -1: (position+i), !1));
            return (reload && this.select.reload())? this: this;
        }
        position = typeof position === "number"? position: -1;

        // Check Group
        if(group === void 0 || group === null) {
            group = item.parentElement? (item.parentElement as HTMLOptGroupElement).label || "#": "#";
        }


        // Add to Group
        if(typeof group === "string" && group !== this.ungrouped) {
            let optgroup = this.source.querySelector(`optgroup[label="${group}"]`) as HTMLOptGroupElement;
            if(!optgroup) {
                optgroup = document.createElement("OPTGROUP") as HTMLOptGroupElement;
                optgroup.label = group;
                optgroup.dataset.select = "add";
                this.source.appendChild(optgroup);
            }

            if(position < 0 || position > optgroup.children.length) {
                optgroup.appendChild(item);
            } else {
                optgroup.insertBefore(item, optgroup.children[position]);
            }
        }

        // Add to Select
        if(group === this.ungrouped) {
            let selector = `select[data-rat-select="${this.source.dataset.ratSelect}"] > option`;
            let options = this.source.parentElement.querySelectorAll(selector) as NodeListOf<HTMLOptionElement>;
            
            let calc = Math.min(position < 0? options.length: position, options.length);
            if(this.source.children.length === calc || !options[calc-1].nextElementSibling) {
                this.source.appendChild(item);
            } else {
                this.source.insertBefore(item, options[calc-1].nextElementSibling || this.source.children[0]);
            }
        }

        // Return
        item.dataset.select = "add";
        return (reload && this.select.reload())? this: this;
    }

    /*
     |  API :: REMOVE ONE OR MORE OPTION
     */
    remove(items: RatSelect_OptionSelector, reload: boolean): RatSelect_Options {
        if(items instanceof HTMLOptionElement) {
            items = [items];
        }
        [].map.call(items, (item) => {
            item.parentElement.removeChild(item);
        });
        return(reload && this.select.reload)? this: this;
    }

    /*
     |  PUBLIC :: OPTION STATEs
     */
    handle(items: RatSelect_OptionSelector, states: RatSelect_OptionStates): RatSelect_Options {
        if(items instanceof HTMLOptionElement) {
            items = [items];
        }

        let result = [];
        let limit = this.select.get("multiLimit", -1);
        [].map.call(items, (item) => {
            let changes: RatSelect_OptionStates = { };

            // Handle Disabled
            if(states.hasOwnProperty("disabled") && states.disabled !== item.disabled) {
                changes.disabled = item.disabled = !item.disabled;
            }

            // Handle Hidden
            if(states.hasOwnProperty("hidden") && states.hidden !== item.hidden) {
                changes.hidden = item.hidden = !item.hidden;
            }

            // Handle Selected
            while(states.hasOwnProperty("selected") && states.selected !== item.selected) {
                if(item.disabled || item.hidden) {
                    break;  // <option> is disabled or hidden
                }
                if(!item.selected && this.source.multiple && limit >= 0 && limit <= this.count(null, [":selected"])) {
                    break;  // Too many <option>s are selected
                }
                if(item.selected && !this.source.multiple && !this.select.get("deselect", !1)) {
                    break;  // Non-Deselectable single <select>
                }
                
                // Deselect
                if(!this.source.multiple && !item.selected && this.source.selectedIndex >= 0) {
                    result.push([this.source.options[this.source.selectedIndex], { selected: false }]);
                }

                // Change
                changes.selected = item.selected = !item.selected;
                if(!this.source.multiple && !item.selected) {
                    let oaap = `option[value=""]:not(:disabled):checked:first-child`;
                    this.source.selectedIndex = this.source.querySelector(oaap)? 0: -1;
                }
                break;      // Done
            }

            // Append Changes
            if(Object.keys(changes).length > 0) {
                result.push([item, changes]);
            }
        });
        return this.select.update(result)? this: this;
    }

    /*
     |  PUBLIC :: OPTION STATEs <ALIASES>
     */
    selected(items: RatSelect_OptionSelector, state?: null | boolean): RatSelect_Options {
        return this.handle(items, { selected: state });
    }
    disabled(items: RatSelect_OptionSelector, state?: null | boolean) {
        return this.handle(items, { disabled: state });
    }
    hidden(items: RatSelect_OptionSelector, state?: null | boolean) {
        return this.handle(items, { hidden: state });
    }
}
