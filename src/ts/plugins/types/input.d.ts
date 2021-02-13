
declare interface RatSelect_PluginInputDefaults {
    /*
     |  CREATE NEW OPTIONs
     |  @since          0.6.0
     |
     |  @values
     |      boolean     True to allow creating new options, FALSE to do it not.
     |
     |  @default
     |      false
     */
    create: boolean;

    /*
     |  CREATE NEW OPTION GROUP
     |  @since          0.6.0
     |
     |  @values
     |      null        Add new created items as ungrouped item.
     |      string      The <optgroup /> label of new created items. If the <optgroup> does not 
     |                  exist, it will be created even if createHidden is set to true!
     |
     |  @default
     |      null
     */
    createGroup: null | boolean;

    /*
     |  CREATE NEW OPTIONs HIDDEN
     |  @since          0.6.0
     |
     |  @values
     |      boolean     True to create new options [hidden] and selected to don't show them in the
     |                  dropdown field itself.
     |
     |  @default
     |      false
     */
    createHidden: boolean;

    /*
     |  REMOVE CREATED OPTIONs
     |  @since          0.6.0
     |
     |  @values
     |      boolean     True to remove new-created options, when the user deselected / removed them,
     |                  False to keep all created options.
     |
     |  @default
     |      false
     */
    createRemove: boolean;
}

declare interface RatSelect_PluginInputSelect extends RatSelect_Select {
    /*
     |  RAT :: SEARCH INPUT
     */
    search?: HTMLInputElement;

    /*
     |  RAT :: INPUT FIELD
     */
    input: HTMLInputElement;
}
