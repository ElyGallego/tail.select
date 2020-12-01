
declare interface RatSelect_PluginsStorage {
    [key: string]: RatSelect_PluginsStorageItem
}

declare interface RatSelect_PluginsStorageItem {
    config: Object,
    hooks: Object
}

declare interface RatSelect_PluginsConstructor {
    /*
     |  STATIC :: PLUGIN OBJECTs
     */
    plugins: RatSelect_PluginsStorage;

    /*
     |  STATIC :: REGSTER A PLUGIN
     |  @since  1.0.0
     |
     |  @param  string  The unique plugin name.
     |  @param  object  The plugin configuration object.
     |  @param  object  The plugin hooks object.
     |
     |  @return bool    TRUE if everything is fluffy, FALSE if not.
     */
    add(name: string, config: Object, hooks: Object): boolean;

    /*
     |  CONSTRUCTOR
     |  @since  1.0.0
     |
     |  @param  string  The desired locale to use.
     */
    new(plugins: Object): RatSelect_Plugins
}

declare interface RatSelect_Plugins {
    /*
     |  CORE :: ENABLED PLUGINS
     */
    plugins: Object;

    /*
     |  CORE :: RETURN HOOKs
     |  @since  1.0.0
     |
     |  @param  string  The hook name.
     |
     |  @return array   All function callbacks, attached to the passed hook.
     */
    hook(hook: string): Function[];
}
