
declare interface RatSelect_PluginsStorageStatic {
    [key: string]: RatSelect_PluginConstructor
}

declare interface RatSelect_PluginsStorage {
    [key: string]: RatSelect_Plugin
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
     |  CORE :: RETURN METHODs
     |  @since  1.0.0
     |
     |  @param  string  The method name.
     |
     |  @return array   The existing method callbacks from all available plugins.
     */
    methods(method: string): Function[];
}

declare interface RatSelect_PluginConstructor {
    /*
     |  CONSTRUCTOR
     |  @since  1.0.0
     |
     |  @param  string  The desired locale to use.
     */
    new(select: RatSelect_Select): RatSelect_Plugin
}

declare interface RatSelect_Plugin {
    [key: string]: any;
}