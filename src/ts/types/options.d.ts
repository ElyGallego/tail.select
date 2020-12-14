
declare interface RatSelect_OptionsConstructor {
    /*
     |  CORE :: CONSTRUCTOR
     |  @since  1.0.0
     |
     |  @param  object  The rat.select instance.
     */
    new(select: RatSelect_Select): RatSelect_Options;
}

declare interface RatSelect_Options {
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
    ungrouped: string;

    /*
     |  HELPER :: CREATE A NEW OPTION
     |  @since  0.6.0
     |
     |  @param  string  The option value.
     |  @param  object  The option data.
     |
     |  @return object  The HTMLOptionElement instance.
     */
    create(value?: string, item?: RatSelect_ItemExtended): HTMLOptionElement;

    /*
     |  HELPER :: PARSE OPTION OBJECT
     |  @since  1.0.0
     |
     |  @param  object  Additional items to load using the basic or extended
     |                  syntax of the RatSelect_Item definitions.
     |
     |  @return this    The Options instance.
     */
    parse(items: RatSelect_Item[]): RatSelect_Options;

    /*
     |  API :: GET ONE OR MORE OPTIONs
     |  @since  0.3.0
     |
     |  @param  mixed   The option selector, which allows different types:
     |          null    Get all options depending on the followed parameters
     |          number  Get the option depending on the position, use negative
     |                  numbers to start from the end.
     |          string  Get the option by it's value attribute.
     |  @param  mixed   The optgroup selector, which allows different types:
     |          null    Don't restrict the returning options to a group.
     |          string  Return options from this specific group label.
     |  @param  array   The state selector, which may contains one or more of:
     |                  ':selected'     Get only selected options
     |                  '!selected'     Get only non-selected options
     |                  ':disabled'     Get only disabled options
     |                  '!disabled'     Get only non-disabled options
     |                  ':hidden'       Get only hidden options
     |                  '!hidden'       Get only non-hidden options
     |
     |  @return mixed   All selected options as NodeList or an empty Array.
     */
    get(value?: null | Number | string, group?: null | string, states?: string[]): Array<null> | NodeListOf<HTMLOptionElement>;

    /*
     |  API :: GET ONE OR MORE GROUPs
     |  @since  0.6.0
     |
     |  @param  bool    TRUE to return the HTMLOptGroupElement instances,
     |                  FALSE to just return the label strings.
     |
     |  @return mixed   The HTMLOptGroupElement instances or an Array with the
     |                  respective labels.
     */
    getGroups(objects?: boolean): string[] | NodeListOf<HTMLOptGroupElement>;

    /*
     |  API :: COUNT OPTIONs
     |  @since  0.6.0
     |
     |  @param  mixed   The optgroup selector, which allows different types:
     |          null    Don't restrict the returnin options to a group.
     |          string  Return options from this specific group label.
     |  @param  array   The state selector, which may contains one or more of:
     |                  ':selected'     Get only selected options
     |                  '!selected'     Get only non-selected options
     |                  ':disabled'     Get only disabled options
     |                  '!disabled'     Get only non-disabled options
     |                  ':hidden'       Get only hidden options
     |                  '!hidden'       Get only non-hidden options
     |
     |  @return number  The number of selected options.
     */
    count(group?: null | string, states?: string[]): number;

    /*
     |  API :: SET A NEW OPTION
     |  @since  0.3.0
     |
     |  @param  mixed   A single HTMLOptionElement to set or multiple as Array
     |                  or within a NodeList or HTMLCollection.
     |  @param  string  The optgroup label string.
     |  @param  number  The position where the new option should be placed.
     |                  Use '0' for the first and '-1' for the last position.
     |  @param  bool    TRUE to reload the rat.select field, FALSE to do it not.
     |
     |  @return this    The Options instance.
     */
    set(item: RatSelect_OptionSelector, group?: null | string, position?: null | number, reload?: boolean): RatSelect_Options;

    /*
     |  API :: REMOVE ONE OR MORE OPTION
     |  @since  0.3.0
     |
     |  @param  mixed   A single HTMLOptionElement to remove or multiple as
     |                  Array or within a NodeList or HTMLCollection.
     |  @param  bool    TRUE to reload the rat.select field, FALSE to do it not.
     |
     |  @return this    The Options instance.
     */
    remove(items: RatSelect_OptionSelector, reload: boolean): RatSelect_Options;

    /*
     |  PUBLIC :: OPTION STATEs
     |  @since  0.3.0
     */
    handle(items: RatSelect_OptionSelector, states: RatSelect_OptionStates): RatSelect_Options;

    /*
     |  PUBLIC :: OPTION STATEs <ALIASES>
     |  @since  1.0.0
     */
    selected(items: RatSelect_OptionSelector, state?: boolean): RatSelect_Options;
    disabled(items: RatSelect_OptionSelector, state?: boolean): RatSelect_Options;
    hidden(items: RatSelect_OptionSelector, state?: boolean): RatSelect_Options;
}
