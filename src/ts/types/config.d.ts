
declare interface RatSelect_Config {
    /*
     |  ADDITIONAL CLASSNAMES FOR THE MAIN RAT.SELECT CONTAINER
     |  @since          0.3.0
     |
     |  @values
     |      string      Pass a single class name as string.
     |      string[]    Pass multiple class names within an array.
     |      boolean     True to copy the source class names, False to don't add custom classes.
     |
     |  @default
     |      false
     */
    classNames: boolean | string | string[];

    /*
     |  COMMA-SEPARATE VALUE OUTPUT
     |  @since          0.3.4
     |
     |  @values
     |      boolean     True to handle the selected values as csv string, False to do it not.
     |      string      Enable and Pass a custom name value for the csv input.
     |
     |  @default
     |      false
     */
    csvOutput: boolean | string;

    /*
     |  COMMA-SEPARATE VALUE SEPARATOR
     |  @since          0.3.4
     |
     |  @values
     |      string      The separator to be used for the csv list (as defined in csvOutput).
     |
     |  @default
     |      ','
     */
    csvSeparator: string;

    /*
     |  DESELECTABLE OPTIONs
     |  @since          0.3.0
     |
     |  @values
     |      boolean     True to allow deselecting options, False to do it not.
     |
     |  @default
     |      true (if select is multiple), false (if select is single)
     */
    deselect: boolean;

    /*
     |  DISABLED STATE OF THE SELECT FIELD
     |  @since          0.5.0
     |
     |  @values
     |      boolean     True to disable the select field, False to enable it.
     |
     |  @default
     |      uses the state of the source select field
     */
    disabled: boolean;

    /*
     |  HEIGHT FOR THE DROPDOWN FIELD
     |  @since          0.2.0
     |
     |  @values
     |      null        Don't restrict the height of the dropdown field.
     |      Number      The desired dropdown height as integer (calculated in px).
     |      string      The desired dropdown height with the desired unit.
     |
     |  @default
     |      350
     */
    height: null | Number | string;

    /*
     |  HIDE DISABLED OPTIONS
     |  @since          0.3.0
     |
     |  @values
     |      boolean     True to hide disabled options, False to do it not.
     |
     |  @default
     |      false
     */
    hideDisabled: boolean;

    /*
     |  HIDE EMPTY OPTIONS
     |  @since          1.0.0
     |
     |  @values
     |      boolean     True to skip empty-valued options (without options text or value), False to do it not.
     |
     |  @default
     |      true
     */
    hideEmpty: boolean;

    /*
     |  HIDE HIDDEN OPTIONS
     |  @since          1.0.0
     |
     |  @values
     |      boolean     True to hide as-hidden-marked options, False to do it not.
     |
     |  @default
     |      true
     */
    hideHidden: boolean;

    /*
     |  HIDE SELECTED OPTIONS
     |  @since          0.3.0
     |
     |  @values
     |      boolean     True to hide seleted options, False to do it not.
     |
     |  @default
     |      true
     */
    hideSelected: boolean;

    /*
     |  PASS ADDITIONAL ITEMS TO THE SELECT FIELD
     |  @since          0.3.0
     |
     |  @values
     |      Null        Don't add additional items.
     |      Array       An array of RatSelectItem valid items.
     |      Function    A callback function, which returns RatSelectItem valid items.
     |
     |  @default
     |      null
     */
    items: RatSelect_Item[] | Function;

    /*
     |  USED LOCALE STRING-SET FOR RAT.SELECT 
     |  @since          0.3.0
     |
     |  @values
     |      string      The desired locale string.set for rat.select.
     |
     |  @default
     |      'en'
     */
    locale: string;

    /*
     |  THE MULTIPLE STATE OF THE SELECT FIELD
     |  @since          0.3.0
     |
     |  @values
     |      boolean     True if the select field allows multiple options, False if not.
     |
     |  @default
     |      uses the state of the source select field
     */
    multiple: boolean;

    /*
     |  THE NUMBER OF SELECTABLE OPTIONS
     |  @since          0.3.0
     |
     |  @values
     |      Number      The number of selectable options, use -1 to disable any limit.
     |
     |  @default
     |      -1
     */
    multiLimit: Number;

    /*
     |  [DE] SELECT ALL OPTIONs
     |  @since          0.4.0
     |
     |  @values
     |      boolean     True to show the 'all' and 'none' buttons, False to do it not.
     |
     |  @default
     |      false
     */
    multiSelectAll: boolean;

    /*
     |  [DE] SELECT ALL OPTIONs FROM A SPECIFIC OPTGROUP
     |  @since          0.4.0
     |
     |  @values
     |      boolean     True to show the 'all' and 'none' buttons, False to do it not.
     |
     |  @default
     |      false
     */
    multiSelectGroup: boolean;

    /*
     |  ADD EVENT LISTENERs
     |  @since          1.0.0
     |
     |  @values
     |      null        Don't add any custom events.
     |      Object      A event : callback paired object of all custom events.
     |
     |  @default
     |      null
     */
    on: RatSelect_Events;

    /*
     |  OPEN ABOVE
     |  @since          0.3.0
     |
     |  @values
     |      null        Calculate where the dropdown should be appear.
     |      boolean     True to open the dropdown always above, False do the opposite.
     |
     |  @default
     |      null
     */
    openAbove: null | boolean;

    /*
     |  PLACEHOLDER TO SHOW
     |  @since          0.3.0
     |
     |  @values
     |      null        Use the default placeholder or the first empty-valued option.
     |      string      Pass a custom placeholder text itself.
     |      Function    Pass a function which returns the placeholder on each rendering-
     |
     |  @default
     |      null
     */
    placeholder: null | string | Function;

    /*
     |  PLACEHOLDER COUNTER TO SHOW
     |  @since          1.0.0
     |
     |  @values
     |      boolean     True to use the default behaviour, False to disable the placeholder Counter.
     |      string      Use one of the following special strings:
     |                      'count-up'      Count up the selected options
     |                      'count-down'    Count down the selectable options (requires multiLimit)
     |                      'limit'         Show the selectable options limit (requires multiLimit)
     |                      'both'          Show the selectable options / optioms limit (requires multiLimit)
     |      Function    Pass a function which returns the placeholder counter on each rendering-
     |
     |  @default
     |      false
     */
    placeholderCount: boolean | "count-up" | "count-down" | "limit" | "both" | Function;

    /*
     |  PLUGINS TO LOAD
     |  @since          0.6.0
     |
     |  @values
     |      null        Don't add any plugins.
     |      Object      A plugin : options paired object of all plugins to add.
     |
     |  @default
     |      null
     */
    plugins: null | RatSelect_Plugins;

    /*
     |  QUERY ITEMS
     |  @since          1.0.0
     |
     |  @values
     |      null        Use the default items query.
     |      Function    Pass a custom function to query the items on your own.
     |
     |  @default
     |      null
     */
    query: null | Function;

    /*
     |  REQUIRED STATE OF THE SELECT FIELD
     |  @since          0.5.0
     |
     |  @values
     |      boolean     True to require the select field, False to enable it.
     |
     |  @default
     |      uses the state of the source select field
     */
    required: boolean;

    /*
     |  RIGHT-TO-LEFT RENDERING
     |  @since          1.0.0
     |
     |  @values
     |      null        Decide the rtl stylings depending on the used locale
     |      boolean     True to use the rtl stylings, False to don't use them.
     |
     |  @default
     |      null
     */
    rtl: null | boolean;

    /*
     |  BIND THE SOURCE SELECT FIELD
     |  @since          0.5.0
     |
     |  @values
     |      boolean     True to bind rat.select to the source select field, False to do it not.
     |
     |  @default
     |      false
     */
    sourceBind: boolean;

    /*
     |  HIDE THE SOURCE SELECT FIELD
     |  @since          0.5.0
     |
     |  @values
     |      boolean     True to hide the source select field, False to do it not.
     |
     |  @default
     |      true
     */
    sourceHide: boolean;

    /*
     |  OPEN THE DROPDOWN FIELD INITIALLY
     |  @since          0.3.0
     |
     |  @values
     |      boolean     True to open the dropdown field after init, False to do it not.
     |
     |  @default
     |      false
     */
    startOpen: boolean;

    /*
     |  KEEP THE DROPDOWN FIELD OPEN
     |  @since          0.3.0
     |
     |  @values
     |      null        Use the default behaviour depending on the multiple state.
     |      boolean     True to keep the dropdown field open until the toggle is pressed.
     |                  False to close the dropdown field until a selection or unclick has applied.
     |
     |  @default
     |      null
     */
    stayOpen: null | boolean;

    /*
     |  STICKY GROUPs
     |  @since          1.0.0
     |
     |  @values
     |      boolean     True to 'sticky-ify' the optgroup titles, False to do it not.
     |
     |  @default
     |      true
     */
    stickyGroups: boolean;

    /*
     |  USED THEME
     |  @since          1.0.0
     |
     |  @values
     |      null        Use the first included theme stylesheet.
     |      string      The theme name you want to use.
     |
     |  @default
     |      null
     */
    theme: null | string;

    /*
     |  [EXPERIMENTAL] TITLE OVERFLOW BEHAVIOUR
     |  @since          1.0.0
     |
     |  @values
     |      string      The desired behaviour if the option title doesn't fit the width:
     |                      'break'     Break up onto multiple lines.
     |                      'clip'      Clip them and add a '...' on the end.
     |                      'scroll'    Scroll to show the whole title.
     |
     |  @default
     |      'clip'
     */
    titleOverflow: "break" | "clip" | "scroll";

    /*
     |  LABEL FOR THE UNGROUPED OPTIONs
     |  @since          0.6.0
     |
     |  @values
     |      null        Skip the title for ungrouped options.
     |      string      The title to be used for the ungrouped options.
     |
     |  @default
     |      null
     */
    ungroupedLabel: null | string;

    /*
     |  WIDTH FOR THE RAT.SELECT FIELD
     |  @since          0.2.0
     |
     |  @values
     |      null        Don't restrict the height of the select field.
     |      Number      The desired width as integer (calculated in px).
     |      string      The desired width with the desired unit.
     |
     |  @default
     |      250
     */
    width: null | Number | string;
}
