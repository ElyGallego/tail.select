
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
     |
     |  @default
     |      null
     */
    linguistic: Object;

    /*
     |  MARK FOUND TERMS
     |  @since          1.0.0
     |
     |  @values
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
     |
     |  @default
     |      3
     */
    minimum: number;
}

declare interface RatSelect_PluginSearchMethods {
    [key: string]: Function
}

declare interface RatSelect_SelectSearch extends RatSelect_Select {
    /*
     |  RAT :: SEARCH INPUT
     */
    search: HTMLInputElement;
}
