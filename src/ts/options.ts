
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
     |  CORE :: CONSTRUCTOR
     */
    constructor(select?: RatSelect_Select) {
        this.select = select;
        this.source = select.source;

        // Prepare Source Select
        [].map.call(this.source.querySelectorAll('options:not([value])'), (option) => {
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
     |  CORE :: OPTIONs WALKER
     */
    *walker(orderGroups?: null | string | Function, orderItems?: null | string | Function): Generator {
        let groups = this.getGroups(false) as string[];
        if(typeof orderGroups === "function") {
            groups = orderGroups.call(this, groups);
        } else if(typeof orderGroups === "string") {
            if(orderGroups.toLowerCase() === "asc") {
                groups = groups.sort();
            } else {
                groups = groups.sort().reverse();
            }
        }
        groups.unshift(null);

        // Loop Groups
        for(let group in groups) {
            yield group;
        }
    }

    /*
     |  API :: GET ONE OR MOER OPTIONs
     */
    get() {

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
    count() {

    }

    /*
     |  API :: SET A NEW OPTION
     */
    set(item: HTMLOptionElement, group?: null | string, position?: null | number, reload?: boolean): RatSelect_Options {

        return this;
    }

    /*
     |  API :: REMOVE ONE OR MORE OPTION
     */
    remove() {

    }

    /*
     |  API :: RELOAD OPTIONS
     */
    reload() {

    }

    /*
     |  PUBLIC :: OPTION STATEs
     */
    handle() {

    }

    /*
     |  PUBLIC :: OPTION STATEs <ALIASES>
     */
    selected(items: any, state?: boolean) {

    }
    disabled(items: any, state?: boolean) {

    }
    hidden(items: any, state?: boolean) {

    }
}