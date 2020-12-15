
/*
 |  ASSIGN POLYFILL
 |  @target     IE
 |  @source     https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
 */
if(typeof Object.assign !== "function") {
    Object.defineProperty(Object, "assign", {
        value: function assign(target, _) {
            var to = Object(target);
            for(var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
      
                if(nextSource != null) {
                    for(var nextKey in nextSource) {
                        if(Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        }
    });
}

/*
 |  CUSTOM EVENT POLYFILL
 |  @target     IE
 |  @source     https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
 */
if(typeof CustomEvent !== "undefined" && typeof CustomEvent.constructor !== "function") {
    CustomEvent.constructor = function(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
}