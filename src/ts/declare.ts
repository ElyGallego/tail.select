/*
 |  WHAT IS THIS FILE?
 |  This file declares the classes provided and variables internally-used by tail.select.
 */
type Infinity = 999e999999;

/*
 |  INTERNALLY USED VARIABLES
 |  This variable are used internally only.
 */
declare var w: Window;
declare var d: Document;

/*
 |  AVAILABLE OPTIONS
 |  This declaration is only for a better overview, because since version 0.6.0 
 |  the default option object set is no longer included in the script files!
 */
declare interface Defaults {
    classNames: false                   // [0.3.0]      Boolean, String, Array
    csvOutput: false                    // [0.3.4]      Boolean, String
    csvSeparator: ','                   // [0.3.4]      String
    descriptions: true                  // [0.3.0]      Boolean
    deselect: false                     // [0.3.0]      Boolean
    disabled: false                     // [0.5.0]      Boolean
    grouplessName: null                 // [0.6.0][NEW] String, null
    height: 350                         // [0.2.0]      Integer, String, null
    hideDisabled: false                 // [0.3.0]      Boolean
    hideEmpty: true                     // [0.6.0][NEW] Boolean
    hideHidden: true                    // [0.6.0][NEW] Boolean
    hideSelected: false                 // [0.3.0]      Boolean
    items: { }                          // [0.3.0]      Object, Function
    locale: 'en'                        // [0.5.0]      String
    linguisticRules: { }                // [0.5.9]      Object
    multiple: true                      // [0.3.0]      Boolean
    multiLimit: Infinity                // [0.3.0]      Integer, Infinity
    multiSelectAll: false               // [0.4.0]      Boolean
    multiSelectGroup: true              // [0.4.0]      Boolean
    on: { }                             // [0.6.0][NEW] Object
    openAbove: null                     // [0.3.0]      Boolean, null
    placeholder: null                   // [0.1.0]      String, Function, null
    placeholderCount: null              // [0.6.0][NEW] String, Function, null
    plugins: { }                        // [0.6.0][NEW] Object
    rtl: null                           // [0.6.0][NEW] Boolean, null
    search: false                       // [0.3.0]      Boolean
    searchConfig: ['text', 'value']     // [0.5.13]     Array, Function
    searchFocus: true                   // [0.3.0]      Boolean
    searchMarked: true                  // [0.3.0]      Boolean
    searchMinLength: 3                  // [0.5.13]     Integer
    sortItems: null                     // [0.3.0]      String, Function, null
    sortGroups: null                    // [0.3.0]      String, Function, null
    sortSearch: null                    // [0.6.0][NEW] String, Function, null
    sourceBind: false                   // [0.5.0]      Boolean
    sourceHide: true                    // [0.5.0]      Boolean
    startOpen: false                    // [0.3.0]      Boolean
    stayOpen: false                     // [0.3.0]      Boolean, null
    stickyGroups: false                 // [0.6.0][NEW] Boolean
    theme: null                         // [0.6.0][NEW] String, null
    titleOverflow: 'break'              // [0.6.0][NEW] String
    width: 250                          // [0.2.0]      Integer, String, null
}

/*
 |  DECLARE SELECT CLASS
 */
declare interface Select {
    /*
     |  INSTANCE :: UNIQUE IDENTIFIER
     |  The identifier gets counted using the `Select.count` static variable.
     */
    id: number

    /*
     |  INSTANCE :: SOURCE <SELECT> ELEMENT
     */
    e: HTMLSelectElement

    /*
     |  INSTANCE :: CONFIGURATION OBJECT
     */
    con: any

    /*
     |  INSTANCE :: LISTEN EVENT HANDLER
     */
    listen: any

    /*
     |  INSTANCE :: CALLBACK OBJECT
     */
    callbacks: Object

    /*
     |  INSTANCE :: OPTIONS INSTANCE
     */
    options: any

    /*
     |  INSTANCE :: PLUGINS INSTANCE
     */
    plugins: Plugins

    /*
     |  INTERNAL :: STRINGS OBJECT FOR CURRENT LOCALE
     */
    __: Object

    /*
     |  INTERNAL :: LAST CALLED QUERY ARGUMENTS
     */
    _last_query: Array<any>

    /*
     |  INTERNAL :: SPACING FOR OPTGROUPs
     */
    _spacing: Number

    /*
     |  ELEMENT :: MAIN TAIL.SELECT CONTAINER
     */
    _select: HTMLElement

    /*
     |  ELEMENT :: MAIN TAIL.SELECT LABEL
     */
    _label: HTMLElement

    /*
     |  ELEMENT :: MAIN TAIL.SELECT DROPDOWN
     */
    _dropdown: HTMLElement

    /*
     |  ELEMENT :: MAIN TAIL.SELECT SEARCH CONTAINER
     */
    _search: HTMLElement

    /*
     |  ELEMENT :: MAIN TAIL.SELECT CSV INPUT FIELD
     */
    _csv: HTMLInputElement



    /*
     |  INSTANCE :: CONSTRUCTOR
     */
    constructor(el: any, conf: object, options: any)

    /*
     |  HELPER :: PRINT STRING (WITH REPLACEMENT)
     */
    _e(string: string, replace?: object): string

    /*
     |  HELPER :: GET CLASS NAMES
     */
    _cls(item: HTMLOptionElement, string: string): string

    /*
     |  INTERNAL :: INIT TAIL.SELECT INSTANCE
     */
    init(): Select

    /*
     |  INTERNAL :: BUILD TAIL.SELECT ELEMENTs
     */
    build(self: Select): Select

    /*
     |  INTERNAL :: BIND EVENTS TO TAIL.SELECT
     */
    bind(arg: any): Select | any

    /*
     |  INTERNAL :: CALCULATE DROPDOWN HEIGHT
     */
    calculate(): Select

    /*
     |  API :: TRIGGER AN EVENT
     */
    trigger(type:String, name: string, args: Array<any>): any
    
    /*
     |  API :: QUERY DROPDOWN
     */
    query(method?: string | Function, args?: Array<any>): Select
    
    /*
     |  API :: RENDER A QUERY DROPDOWN
     */
    render(type: string, data: any, query: Array<any>): any
    
    /*
     |  API :: UPDATE DROPDOWN (USED ALSO AS CALLBACK FOR OPTIONS CLASS)
     */
    update(itens: any, trigger: boolean, force?: boolean): Select
    
    /*
     |  API :: UPDATE CSV INPUT VALUE
     */
    updateCSV(): Select
    
    /*
     |  API :: UPDATE TAIL.SELECT INSTANCE
     */
    updateLabel(label?: string | undefined): Select

    /*
     |  PUBLIC :: OPEN DROPDOWN
     */
    open(): Select
    
    /*
     |  PUBLIC :: CLOSE DROPDOWN
     */
    close(): Select
    
    /*
     |  PUBLIC :: TOGGLE DROPDOWN
     */
    toggle(): Select
    
    /*
     |  PUBLIC :: RELOAD DROPDOWN / INSTANCE
     */
    reload(soft: boolean): Select
    
    /*
     |  PUBLIC :: REMOVE INSTANCE
     */
    remove(keep?: boolean): Select
    
    /*
     |  PUBLIC :: GET CONFIGURATION
     */
    get(key: string, def?: any): any

    /*
     |  PUBLIC :: GET CONFIGURATION
     */
    set(key: string | Object, value?: any): Select

    /*
     |  PUBLIC :: ENABLE TAIL.SELECT FIELD
     */
    enable(reload: boolean): Select
    
    /*
     |  PUBLIC :: DISABLE TAIL.SELECT FIELD
     */
    disable(reload: boolean): Select
    
    /*
     |  PUBLIC :: ADD EVENT | HOOK | CALLBACK HANDLER
     */
    on(name: string | Array<string>, func: Function): Select
    
    /*
     |  PUBLIC :: GET CURRENT VALUEs
     */
    value(format: string): any
}


/*
 |  DECLARE OPTIONS CLASS
 */
declare interface Options {
    /*
     |  INSTANCE :: PARENT TAIL.ELECT INSTANDE
     */
    parent: Select

    /*
     |  INSTANCE :: SOURCE <SELECT> ELEMENT
     */
    source: HTMLSelectElement

    /*
     |  INTERNAL :: PSEUDO GENERATOR [ES5 ONLY]
     |  This variable is used to offer an pseudo-generator for the `.finder()` method.
     */
    __finderLoop: any | Array<any>

    /*
     |  INTERNAL :: PSEUDO GENERATOR [ES5 ONLY]
     |  This variable is used to offer an pseudo-generator for the `.walker()` method.
     */
    __walkerLoop: any | number

    /*
     |  INTERNAL :: PSEUDO GENERATOR [ES5 ONLY]
     |  This variable is used to offer an pseudo-generator for the `.walker()` method.
     */
    __walkerGroups: any | Array<string>

    /*
     |  INTERNAL :: PSEUDO GENERATOR [ES5 ONLY]
     |  This variable is used to offer an pseudo-generator for the `.walker()` method.
     */
    __walkerItems: any | Array<string>


    
    /*
     |  INSTANCE CONTRUCTOR
     */
    constructor(select: Select): void

    /*
     |  HELPER :: CREATE OPTION
     |  This method just returns a build <option> element.
     */
    create(value: string, text: string, data?: object): HTMLElement | HTMLOptionElement

    /*
     |  OPTIONS :: SELECT OPTIONS BY PARAMS
     */
    get(value: any, group?: any, checked?: boolean, disabled?: boolean, hidden?: boolean): any

    /*
     |  OPTIONS :: SELECT OPTGROUPS BY PARAMS
     */
    getGroups(objects?: boolean): Array<string> | NodeList | any

    /*
     |  OPTIONS :: COUNT OPTIONS BY PARAMS
     */
    count(group?: any, checked?: boolean, disabled?: boolean, hidden?: boolean): number

    /*
     |  HANDLER :: SET OPTION
     |  This method allows to add / set new or move existing <option> elements.
     */
    set(item: any, group?: string | null, position?: number, reload?: boolean): Options

    /*
     |  HANDLER :: ADD OPTIONS
     |  This method parses the passed object value and creates the <option> elements based on it.
     |  Its <option> elements gets passed to the `.set()` method, where it gets added.
     */
    add(data: object, group?: string | null, reload?: boolean): Options

    /*
     |  HANDLER :: REMOVE OPTIONS
     */
    remove(item: any, reload?: boolean): Options

    /*
     |  HANDLER :: CHECK OPTION STATEs
     */
    is(item: any, state: string): null | boolean | Array<boolean>

    /*
     |  HANDLER :: MAIN OPTION HANDLER
     |  This method handles the `selected`, `disabled` and `hidden` attributes / states.
     */
    handle(item: any, state: object, prevent?: boolean, force?: boolean): Array<any>

    /*
     |  HANDLER :: SELECT OPTIONS
     |  This method is just an alias for `.handle()`.
     */
    select(item: any, prevent?: boolean): Array<any>

    /*
     |  HANDLER :: UNSELECT OPTIONS
     |  This method is just an alias for `.handle()`.
     */
    unselect(item: any, prevent?: boolean): Array<any>

    /*
     |  HANDLER :: DISABLE OPTIONS
     |  This method is just an alias for `.handle()`.
     */
    disable(item: any, prevent?: boolean): Array<any>

    /*
     |  HANDLER :: ENABLE OPTIONS
     |  This method is just an alias for `.handle()`.
     */
    enable(item: any, prevent?: boolean): Array<any>

    /*
     |  HANDLER HIDE OPTIONS
     |  This method is just an alias for `.handle()`.
     */
    hide(item: any, prevent?: boolean): Array<any>

    /*
     |  HANDLER :: SHOW OPTIONS
     |  This method is just an alias for `.handle()`.
     */
    show(item: any, prevent?: boolean): Array<any>

    /*
     |  HANDLER :: TOGGLE OPTIONS
     |  This method is just an alias for `.handle()`.
     */
    toggle(item: any, state: string, prevent?: boolean): Array<any>

    /*
     |  HANDLER :: RELOAD
     |  This method reloads the dropdown field based on the options changed on the source.
     */
    reload(prevent?: boolean): Array<any>

    /*
     |  INTERNAL :: APPLY LINGUISTIC RULES
     |  This method is only used in the `.find()` method.
     */
    applyLinguisticRules(search: string, strict?: boolean): string

    /*
     |  OPTIONS :: FINDER
     |  This method search through the `<option`> elements of the source `<select>` field.
     */
    find(search: string, config?: any, order?: string | Function | null): Array<any>

    /*
     |  OPTIONS :: FINDER WALKER
     |  This method uses `find` and just walks through all found `<option>` elements
     */
    ///@ts-ignore
    finder(search: string, config?: any, order?: string | Function | null): Array<any> | boolean | Generator

    /*
     |  OPTIONS :: WALKER
     |  This method walks through all available options. Depending on the ECMAScript Version you're 
     |  using it will return wither the <option> element or false (ES6) or an valid Generator (ES6)
     */
    ///@ts-ignore
    walker(orderg: string | Function | null, orderi: string | Function | null): HTMLElement | boolean | Generator
}


/*
 |  DECLARE PLUGINS CLASS
 */
declare interface Plugins {
    /*
     |  INSTANCE :: THE PARENT SELECT INSTANCE
     */
    self: Select
    
    /*
     |  THE ACTIVE PLUGINS DATA
     */
    active: Object
    
    /*
     |  INSTANCE CONTRUCTOR
     */
    constructor(plugins: Array<string>, self: any): Plugins
    
    /*
     |  INSTANCE :: TRIGGER EVENTS | HOOKS | CALLBACKS
     */
    hook(hook: string, args: Array<any>, self?: any): any
}
