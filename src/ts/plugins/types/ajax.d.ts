
declare type RatSelect_PluginAjaxConfigListenTypes = "init" | "open" | "input";

declare interface RatSelect_PluginAjaxDefaults {
    /*
     |  AJAX Callback function
     |  @since          0.6.0
     |
     |  @values
     |      function    The callback function which should be called for receiving the items.
     |                  The callback function receives 3 arguments:
     |                      resolve     A callback function to successfully resolve the callback.
     |                      reject      A callback function to reject the callback.
     |                      select      The source select instance.
     |  
     |                  Even if this sounds similar, the callback is not called as async Promise, 
     |                  these functions are just ... functions. However, your callback handler can
     |                  also return a Promise / async object itself, just keep in mind that this
     |                  is not compatible with IE 11.
     |
     |  @default
     |      null
     */
    callback: Function;

    /*
     |  AJAX Force configured Placeholder
     |  @since          1.0.0
     |
     |  @values
     |      boolean     True to force the configured placeholder on empty <select> fields.
     |
     |  @default
     |      true
     */
    forcePlaceholder: Function;

    /*
     |  AJAX Callback Listener
     |  @since          0.6.0
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
     |  @since          0.6.0
     |
     |  @values
     |      boolean     True to reset the options everytime the dropdown field gets closed, False
     |                  to keep all options.
     |
     |  @default
     |      false
     */
    reset: boolean;

    /*
     |  AJAX Search Callback
     |  @since          0.6.0
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

declare interface RatSelect_PluginAjaxSelect extends RatSelect_Select {
    /*
     |  RAT :: AJAX STATE
     */
    ajax: boolean | "resolved" | "rejected";

    /*
     |  RAT :: AJAX ITEMs
     */
    ajaxItems: RatSelect_Item[];
}