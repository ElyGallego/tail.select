/*
 |  HELPER METHODS
 */
const tail = {
    /*
     |  TRIGGER AN EVENT
     |  @since  0.3.0 [0.6.0]
     |
     |  @param  string  The HTMLElement, where the event shoud be triggered.
     |  @param  string  The event name, which should be triggered.
     |  @param  object  The event datra object.
     |
     |  @return bool
     */
    ///@ts-target:ES5
    ///@ts-ignore
    trigger: (el: Element, event: string, opt: any): boolean => {
        if(CustomEvent && CustomEvent.name) {
            let ev: CustomEvent = new CustomEvent(event, opt);
            return el.dispatchEvent(ev);
        }
        let ev: CustomEvent = d.createEvent("CustomEvent");
        ev.initCustomEvent(event, !!opt.bubbles, !!opt.cancelable, opt.detail);
        return el.dispatchEvent(ev);
    },
    ///@ts-target:ES5
    ///@ts-target:ES6
    ///@ts-ignore
    trigger: (el: Element, event: string, opt: any): boolean => {
        let ev: CustomEvent = new CustomEvent(event, opt);
        return el.dispatchEvent(ev);
    },
    ///@ts-target:ES6

    /*
     |  CLONE OBJECT
     |  @since  0.3.1 [0.6.0]
     |
     |  @param  object  The object, which you want to clone.
     |  @param  object  An optional object, which data should replace the first one.
     |
     |  @return object  The cloned and replaced (if passed) object.
     */
    ///@ts-target:ES5
    ///@ts-ignore
    clone: (obj: object, rep?: object): object => {
        if(typeof Object.assign === "function") {
            return Object.assign({}, obj, rep || {});
        }
        var clone = new Object();
        for(let key in obj) {
            clone[key] = obj[key];
        }
        for(let key in rep) {
            clone[key] = rep[key];
        }
        return clone;
    },
    ///@ts-target:ES5
    ///@ts-target:ES6
    ///@ts-ignore
    clone: (obj: object, rep: object): object => {
        return Object.assign({}, obj, rep || {});
    },
    ///@ts-target:ES6

    /*
     |  CREATE ELEMENT
     |  @since  0.5.0 [0.6.0]
     |
     |  @param  string  The tag name of the new element.
     |  @param  multi   The class names of the new element, can be an ARRAY with multiple names
     |                  or just a class name, which gets added to `.className` directly.
     |
     |  @return object  The HTMLElement object.
     */
    create: (tag: string, classes: any = []): any => {
        var el = d.createElement(tag);
            el.className = (Array.isArray(classes))? classes.join(" "): classes || "";
        return el;
    }
};
