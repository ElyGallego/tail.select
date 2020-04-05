/*
 |  PLUGINS :: CLASS
 */
class Plugins {
    /*
     |  AVAILABLE PLUGINS STORAGE
     */
    static plugins = {};

    /*
     |  ADD PLUGIN
     |  @since  0.6.0 [0.6.0]
     |
     |  @param  string  The unique plugin name.
     |  @param  object  The { key: default } option set for this plugin.
     |  @param  object  The { key: callback } hook set for this plugin.
     |
     |  @return bool    TRUE if everything is fluffy, FALSE if not.
     */
    static add = function(plugin: any, options: object, hooks: object): boolean {
        if(!(plugin in this.plugins)) {
            this.plugins[plugin] = { hooks: hooks, options: options };
            return true;
        }
        return false;
    }

    /*
     |  INSTANCE VARs
     */
    self: Select;
    active: Object;

    /*
     |  CONSTRUCTOR
     |  @since  0.6.0 [0.6.0]
     |
     |  @param  object  The set of plugins for the respective tail.select instance.
     |  @param  object  The tail.select instance itself.
     |
     |  @return boid
     */
    constructor(plugins: Object, self: Select) {
        this.self = self;
        this.active = {};

        for(let key in plugins) {
            if(key in Plugins.plugins) {
                let plugin = Plugins.plugins[key];
                self.set(tail.clone(plugin.options, plugins[key]));
                this.active[key] = plugin;
            }
        }
    }

    /*
     |  INSTANCE :: GET CALLBACKS
     |  @since  0.6.0 [0.6.0]
     */
    callbacks(name: string): Array<any> {
        let cb = [];
        for(let plugin in this.active) {
            if(name in this.active[plugin].hooks) {
                cb.push(this.active[plugin].hooks[name]);
            }
        }
        return cb;
    }
}
