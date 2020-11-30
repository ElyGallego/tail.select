
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
     |  HELPER :: CREATE A NEW OPTION
     |  @since  1.0.0
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
     |  CORE :: OPTIONs WALKER
     |  @since  0.3.0
     */
    walker(): Generator;

    /*
     |  API :: GET ONE OR MOER OPTIONs
     |  @since  0.3.0
     */
    get();

    /*
     |  API :: GET ONE OR MORE GROUPs
     |  @since  1.0.0
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
     |  @since  1.0.0
     */
    count();

    /*
     |  API :: SET A NEW OPTION
     |  @since  0.3.0
     |
     |  @param  object  The HTMLOptionElement instance to add to.
     |  @param  string  The optgroup label string.
     |  @param  number  The position where the new option should be placed.
     |                  Use '0' for the first and '-1' for the last position.
     |  @param  bool    TRUE to reload the rat.select field, FALSE to do it not.
     |
     |  @return this    The Options instance.
     */
    set(item: HTMLOptionElement, group?: null | string, position?: null | number, reload?: boolean): RatSelect_Options;

    /*
     |  API :: REMOVE ONE OR MORE OPTION
     |  @since  0.3.0
     */
    remove();

    /*
     |  API :: RELOAD OPTIONS
     |  @since  1.0.0
     */
    reload();

    /*
     |  PUBLIC :: OPTION STATEs
     |  @since  0.3.0
     */
    handle();

    /*
     |  PUBLIC :: OPTION STATEs <ALIASES>
     |  @since  0.3.0
     */
    selected(items: any, state?: boolean);
    disabled(items: any, state?: boolean);
    hidden(items: any, state?: boolean);
}
