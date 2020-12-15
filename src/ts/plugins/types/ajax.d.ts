
declare type RatSelect_PluginAjaxConfigListenTypes = "init" | "open" | "input";

declare interface RatSelect_PluginAjaxDefaults {
    /*
     |  AJAX Callback function
     |  @since          1.0.0
     |
     |  @values
     |      function    The callback function which should be called for receiving the items.
     |
     |  @default
     |      null
     */
    callback: Function;

    /*
     |  AJAX Callback Listener
     |  @since          1.0.0
     |
     |  @values
     |      string      The event where the callback function should be applied.
     |                      'init'      Directly when the select instance gets initialized.
     |                      'open'      When the dropdown field get's opened.
     |                      'input'     When the user taps something into the input field
     |                        -> requires the search or input plugin as well!
     |
     |  @default
     |      'init'
     */
    listen: RatSelect_PluginAjaxConfigListenTypes;

    /*
     |  AJAX Reset Options
     |  @since          1.0.0
     |
     |  @values
     |      boolean     True to reset the options everytime the listen event occurs, False to keep
     |                  the items until they get removed using the provided method.
     |
     |  @default
     |      false
     */
    reset: boolean;

    /*
     |  AJAX Search Callback
     |  @since          1.0.0
     |
     |  @values
     |      boolean     True to trigger the callback also when the user search for something, False
     |                  to do it not (requires the search plugin).
     |
     |  @default
     |      false
     */
    search: boolean;
}
