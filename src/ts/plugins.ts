
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
    plugins: Object;

    /*
     |  CORE :: CONSTRUCTOR
     */
    constructor(plugins: Object) {
        this.plugins = plugins;
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