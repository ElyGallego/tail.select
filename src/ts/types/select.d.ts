
declare interface RatSelect_SelectConstructor {
    /*
     |  STATIC :: INSTANCES
     */
    inst: Object;

    /*
     |  CONSTRUCTOR
     |  @since  1.0.0
     |
     |  @param  object  The HTMLSelectElement instance.
     |  @param  object  The desired options to apply to.
     |  @param  object  A custom options class to use.
     */
    new(source: HTMLSelectElement, config?: RatSelect_Config, options?: RatSelect_Options): RatSelect_Select
}

declare interface RatSelect_Select {
    /*
     |  CORE :: SOURCE SELECT FIELD
     */
    source: HTMLSelectElement;

    /*
     |  CORE :: CONFIG OBJECT
     */
    config: RatSelect_Config;

    /*
     |  CORE :: OPTIONS CLASS INSTANCE
     */
    options: RatSelect_Options;

    /*
     |  CORE :: LOCALIZATION CLASS INSTANCE
     */
    locale: RatSelect_Strings;

    /*
     |  CORE :: PLUGIN API CLASS INSTANCE
     */
    plugins: RatSelect_Plugins;
    
    /*
     |  CORE :: EVENT CALLBACKs
     */
    events: Object;
    
    /*
     |  RAT :: MAIN SELECT ELEMENT
     */
    select: HTMLDivElement;
    
    /*
     |  RAT :: MAIN LABEL ELEMENT
     */
    label: HTMLLabelElement;
    
    /*
     |  RAT :: MAIN DROPDOWN ELEMENT
     */
    dropdown: HTMLDivElement;
    
    /*
     |  RAT :: MAIN DROPDOWN ELEMENT
     */
    csv: HTMLInputElement;

    /*
     |  RAT :: EVENT HANDLER
     */
    handler: () => any;

    /*
     |  CORE :: INIT SELECT FIELD
     |  @since  0.3.0
     |
     |  @return this    The select instance.
     */
    init(): RatSelect_Select;

    /*
     |  CORE :: BUILD SELECT FIELD
     |  @since  1.0.0
     |
     |  @return this    The select instance.
     */
    build(): RatSelect_Select;

    /*
     |  CORE :: CALCULATE DROPDOWN FIELD
     |  @since  0.6.0
     |
     |  @return this    The select instance.
     */
    calculate(): RatSelect_Select;

    /*
     |  CORE :: BIND SELECT FIELD
     |  @since  0.3.0
     |
     |  @return this    The select instance.
     */
    bind(): RatSelect_Select;

    /*
     |  CORE :: HANDLE EVENTs
     |  @since  1.0.0
     |
     |  @return this    The select instance.
     */
    handle(this: RatSelect_Select, event: Event | CustomEvent);

    /*
     |  API :: TRIGGER EVENT, FILTER OR HOOK
     |  @since  0.4.0
     |
     |  @param  string  The callback type to do: "hook", "filter" or "event".
     |  @param  string  The hook or event name to call.
     |  @param  array   The arguments to be passed to the callback functions.
     |
     |  @return mixed   Returns the boolean process state on hooks,
     |                  Returns the filtered arguments on filters,
     |                  Returns the boolean cancel state on events.
     */
    trigger(type: "hook" | "filter" | "event", name: string, args?: Array <any>): boolean | Array<any>;
    
    /*
     |  API :: QUERY DROPDOWN
     |  @since  0.5.0
     |
     |  @return this    The select instance.
     */
    query(query?: null | Function): RatSelect_Select;
    
    /*
     |  API :: RENDER DROPDOWN
     |  @since  0.5.0
     |
     |  @param  object  The HTMLElement to render, which is either a 
     |                  HTMLOptionElement or a HTMLOptGroupElement.
     |
     |  @return mixed   The HTMLElement object to pass to the dropdown field,
     |                  null to skip this item or false to break the loop.
     */
    render(element: HTMLOptionElement | HTMLOptGroupElement): null | boolean | HTMLElement;
    
    /*
     |  API :: UPDATE INSTANCE
     |  @since  0.5.0
     |
     |  @return this    The select instance.
     */
    update(changes: Array<HTMLOptionElement | RatSelect_OptionStates>): RatSelect_Select;

    /*
     |  API :: UPDATE CSV FIELD
     |  @since  0.5.0
     |
     |  @return this    The select instance.
     */
    updateCSV(): RatSelect_Select;
    
    /*
     |  API :: UPDATE LABEL INSTANCE
     |  @since  0.5.0
     |
     |  @return this    The select instance.
     */
    updateLabel(label?: string | Function): RatSelect_Select;
    
    /*
     |  API :: OPEN DROPDOWN
     |  @since  0.3.0
     |
     |  @return this    The select instance.
     */
    open(): RatSelect_Select;
    
    /*
     |  API :: CLOSE DROPDOWN
     |  @since  0.3.0
     |
     |  @return this    The select instance.
     */
    close(): RatSelect_Select;

    /*
     |  API :: TOGGLE DROPDOWN
     |  @since  0.3.0
     |
     |  @return this    The select instance.
     */
    toggle(): RatSelect_Select;
    
    /*
     |  API :: RELOAD SELECT INSTANCE
     |  @since  0.3.0
     |
     |  @param  bool    True to hard reload the instance, False to soft reload.
     |
     |  @return this    The select instance.
     */
    reload(hard?: boolean): RatSelect_Select;
    
    /*
     |  API :: REMOVE SELECT INSTANCE
     |  @since  0.3.0
     |
     |  @param  bool    TRUE to keep options which has been added after init,
     |                  FALSE to remove them and reset everything.
     |
     |  @return this    The select instance.
     */
    remove(): RatSelect_Select;

    /*
     |  PUBLIC :: GET VALUE
     |  @since  0.5.13
     |
     |  @param  string  The format type to return the values in:
     |                      'auto'      Return csv-string on single and array on multiple.
     |                      'csv'       Return all selected values as csv-string.
     |                      'array'     Return all selected values as array.
     |                      'node'      Return all selected HTMLOptionElements.
     |
     |  @return mixed   The selected values in the desired format or null if format is invalid.
     */
    value(format?: 'auto' | 'csv' | 'array' | 'node'): null | string | string[] | HTMLOptionElement | NodeListOf<HTMLOptionElement>;
    
    /*
     |  PUBLIC :: GET CONFIG
     |  @since  1.0.0
     |
     |  @param  string  The configuration key to receive the value.
     |  @param  mixed   The default value if the config key does not exist.
     |
     |  @return mixed   The configuration value of the passed default value.
     */
    get(key: string, def?: any): any;
    
    /*
     |  PUBLIC :: SET CONFIG
     |  @since  1.0.0
     |
     |  @param  string  The configuration key to set the value for.
     |  @param  mixed   The desired value to set.
     |  @param  bool    True to soft-reload the instance, False to do it not.
     |
     |  @return this    The select instance.
     */
    set(key: string, value: any, reload?: boolean): RatSelect_Select;
    
    /*
     |  PUBLIC :: ENABLE SELECT INSTANCE
     |  @since  0.5.0
     |
     |  @param  bool    True to soft-reload the instance, False to do it not.
     |
     |  @return this    The select instance.
     */
    enable(reload: boolean): RatSelect_Select;
    
    /*
     |  PUBLIC :: DISABLE SELECT INSTANCE
     |  @since  0.5.0
     |
     |  @param  bool    True to soft-reload the instance, False to do it not.
     |
     |  @return this    The select instance.
     */
    disable(reload: boolean): RatSelect_Select;

    /*
     |  PUBLIC :: FOCUS SELECT FIELD
     |  @since  1.0.0
     |
     |  @return this    The select instance.
     */
    focus(): RatSelect_Select;
    
    /*
     |  PUBLIC :: CHANGE SELECT STATE
     |  @since  1.0.0
     |
     |  @param  string  The state you want to set, mostly 'error' or 'success'.
     |  @param  bool    TRUE to set, FALSE to remove, noting to toggle state.
     |
     |  @return this    The select instance.
     */
    state(state: string, status: null | boolean): RatSelect_Select;
    
    /*
     |  PUBLIC :: EVENT LISTENER
     |  @since  0.4.0
     |
     |  @param  string  The event name as string, multiple comma-separated.
     |  @param  callb.  The callback function for the listener.
     |
     |  @return this    The select instance.
     */
    on(name: string, callback: Function): RatSelect_Select;
}
