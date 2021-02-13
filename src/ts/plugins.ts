
export class Plugins implements RatSelect_Plugins {
    /*
     |  STATIC :: PLUGIN OBJECTs
     */
    static plugins: RatSelect_PluginsStorageStatic = { };

    /*
     |  STATIC :: REGSTER A PLUGIN
     */
    static add(name: string, pluginClass: RatSelect_PluginConstructor): boolean {
        if(name in this.plugins) {
            return false;
        }
        this.plugins[name] = pluginClass;
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
            if(Plugins.plugins[key]) {
                this.plugins[key] = new Plugins.plugins[key](select);
            }
        }
    }

    /*
     |  CORE :: RETURN METHODs
     */
    methods(method: string): Function[] {
        let cbs = [];
        for(let name in this.plugins) {
            if(method in this.plugins[name]) {
                cbs.push(this.plugins[name][method]);
            }
        }
        return cbs;
    }
}