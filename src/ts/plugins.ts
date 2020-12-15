
export class Plugins implements RatSelect_Plugins {
    /*
     |  STATIC :: PLUGIN OBJECTs
     */
    static plugins: RatSelect_PluginsStorage = { };

    /*
     |  STATIC :: REGSTER A PLUGIN
     */
    static add(name: string, config: Object, hooks: Object): boolean {
        if(name in this.plugins) {
            return false;
        }
        this.plugins[name] = { config: config, hooks: hooks };
        return true;
    }


    /*
     |  CORE :: ENABLED PLUGINS
     */
    plugins: RatSelect_PluginsStorage;

    /*
     |  CORE :: CONSTRUCTOR
     */
    constructor(plugins: Object, select: RatSelect_Select) {
        this.plugins = { };
        for(let key in plugins) {
            let plugin = Plugins.plugins[key];
            if(plugin) {
                let config = Object.assign({ }, plugin.config, plugins[key]);
                this.plugins[key] = { 
                    config: config,
                    hooks: Object.assign({ }, plugin.hooks) 
                };
                select.config.plugins[key] = config;
            }
        }
    }

    /*
     |  CORE :: RETURN HOOKs
     */
    hook(hook: string): Function[] {
        let cbs = [];
        for(let name in this.plugins) {
            if(hook in this.plugins[name].hooks) {
                cbs.push(this.plugins[name].hooks[hook]);
            }
        }
        return cbs;
    }
}