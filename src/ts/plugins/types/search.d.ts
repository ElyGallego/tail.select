
declare type RatSelect_PluginSearchConfigOptionTypes = "text" | "regexp" | "regex";
declare type RatSelect_PluginSearchConfigOptionTargets = "any" | "attr" | "value" | "visible";
declare type RatSelect_PluginSearchConfigOptionSpecials = "strict" | "whole" | "comma";
declare type RatSelect_PluginSearchConfigOptions = RatSelect_PluginSearchConfigOptionTypes | RatSelect_PluginSearchConfigOptionTargets | RatSelect_PluginSearchConfigOptionSpecials

declare interface RatSelect_PluginSearchDefaults {
    /*
     |  [EXPERIMENTAL] ASYNCHRONOUS SEARCH
     |  @since          1.0.0
     |
     |  @values
     |      boolean     True to search asychronously, False to do it not.
     |
     |  @default
     |      false
     */
    async: boolean;

    /*
     |  CONFIGURE FINDER
     |  @since          1.0.0
     |
     |  @values
     |      Array       One or more of the following values, keep in mind that some values may 
     |                  overwrite others.
     |                      'text'      Use a textual search only (no regexp).
     |                      'regexp'    Use a regular expression instead of textual search.
     |                      'any'       Search in all attributes + in the option title.
     |                      'attr'      Search in the attributes only.
     |                      'value'     Search in the value attribute only.
     |                      'visible'   Search in the option title or description only.
     |                      'strict'    Apply a strict (case-sensitive) search.
     |                      'whole'     Search for whole words only.
     |                      'comma'     Allow multiple search terms in a csv manner.
     |
     |  @default
     |      [ 'text', 'visible' ]
     */
    config: Array<RatSelect_PluginSearchConfigOptions>;

    /*
     |  CUSTOM FINDER METHOD
     |  @since          1.0.0
     |
     |  @values
     |      null        Use the default finder method.
     |      callback    Define and pass a custom finder method.
     |
     |  @default
     |      null
     */
    finder: null | Function;

    /*
     |  FOCUS SEARCH FIELD ON OPEN
     |  @since          1.0.0
     |
     |  @values
     |      bool        True to focus the input field on open, False to do it not.
     |  @default
     |      false
     */
    focus: boolean;

    /*
     |  PASS SOME LINGUISTIC REPLACEMENTs
     |  @since          1.0.0
     |
     |  @values
     |      object      An object using the ascii keys and their linguistic equivalents
     |
     |  @default
     |      null
     */
    linguistic: null | Object;

    /*
     |  MARK FOUND TERMS
     |  @since          1.0.0
     |
     |  @values
     |      boolean     True to <mark> the found visible terms, False to do it not.
     |
     |  @default
     |      true
     */
    mark: Object;

    /*
     |  MINIMUM LENGTH TO TRIGGER A SEARCH
     |  @since          1.0.0
     |
     |  @values
     |      number      The minimum length to trigger a search from the input field.
     |
     |  @default
     |      3
     */
    minimum: number;
}

declare interface RatSelect_PluginSearchSelect extends RatSelect_Select {
    /*
     |  RAT :: SEARCH INPUT
     */
    search: HTMLInputElement;
}

declare interface RatSelect_PluginSearch extends RatSelect_Plugin {
    /*
     |  CORE :: SELECT INSTANCE
     */
    select: RatSelect_PluginSearchSelect;

    /*
     |  HELPER :: APPLY LINGUISTIC RULEs
     |  @since  1.0.0
     |
     |  @param  string  The desired search term to apply the linguistic rules on.
     |  @param  bool    TRUE to apply them case-sensitive, FALSE to do it not.
     |
     |  @return string  The formatted string, on which the lingusitic rules has been applid on.
     */
    applyLinguistic(term: string, strict: boolean): string;

    /*
     |  WALKER :: OPTION FINDER
     |  @since  1.0.0
     |
     |  @param  string  The search term.
     |  @param  array   The search configuration array.
     |
     |  @return mixed   The resulted options.
     */
    finder(this: RatSelect_PluginSearchSelect, term: string, config: RatSelect_PluginSearchConfigOptions[]): HTMLOptionElement[] | HTMLCollectionOf<HTMLOptionElement> | NodeListOf<HTMLOptionElement>;
    
    /*
     |  HOOK :: BUILD AFTER
     |  @since  1.0.0
     |  @info   Creates the search field and appends them on the dropdown field.
     |
     |  @return void
     */
    "build:after"(this: RatSelect_PluginSearchSelect): void;

    /*
     |  HOOK :: BIND AFTER
     |  @since  1.0.0
     |  @info   Adds the event listener on the search field.
     |
     |  @return void
     */
    "bind:after"(this: RatSelect_PluginSearchSelect): void;

    /*
     |  HOOK :: HANDLE BEFORE
     |  @since  1.0.0
     |  @info   Handles the events triggered on the search field.
     |
     |  @return void
     */
    "handle:before"(this: RatSelect_PluginSearchSelect, event: Event): void;

    /*
     |  FILTER :: RENDERED ELEMENT
     |  @since  1.0.0
     |  @info   Changes the rendered format of the resulted options.
     |
     |  @param  object  The HTMLDivElement representing the item option within the dropdown field.
     |  @param  object  The source HTMLOptionElement of the source select field.
     |  @param  string  The lowercased tag name of the source HTMLOptionElement.
     |
     |  @return array   The passed, may manipulated / adapted passed parameters.
     */
    "render#option"(this: RatSelect_PluginSearchSelect, output, element, tag);

    /*
     |  EVENT :: OPEN
     |  @since  1.0.0
     |  @info   Focus the search field if the `focus` option is enabled.
     |
     |  @return void
     */
    "open"(this: RatSelect_PluginSearchSelect): void;
}