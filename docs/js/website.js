/*
 |  SOME ESSENTIAL SCRIPTS FOR THE WEBSITE ITSELF
 */
;(function() {
    "use strict";

    /*
     |  HELPER :: ITERABLE LOOP
     |  @since  0.1.0 [0.1.0]
     */
    function each(iterable, callback, end_callback) {
        if("length" in iterable) {
            for(var i = 0; i < iterable.length; i++) {
                callback.call(iterable[i], iterable[i]);
            }
        } else if(iterable) {
            callback.call(iterable, iterable);
        }
        if(typeof end_callback === "function") {
            end_callback.call(iterable, iterable);
        }
    }

    /*
     |  GENERAL :: TOGGLE HANDLER
     |  @since  0.1.0 [0.1.0]
     */
    var toggleHandler = function(event) {
        if(this.getAttribute("data-strict") === "true") {
            if(this !== event.target) {
                return false;
            }
        }
        event.preventDefault();
        var classes = this.getAttribute("data-toggle").split(",");

        // Get Target
        if(this.hasAttribute("data-target")) {
            if(this.getAttribute("data-target") === ":parent") {
                var targets = this.parentElement;
            } else if(this.getAttribute("data-target") === ":parent:parent") {
                var targets = this.parentElement.parentElement;
            } else {
                var targets = document.querySelectorAll(this.getAttribute("data-target"));
            }
        } else {
            var targets = this;
        }

        // Loop
        each(classes, function() {
            var classname = this.trim();

            each(targets, function() {
                if(this.classList.contains(classname)) {
                    this.classList.remove(classname);
                } else {
                    this.classList.add(classname);
                }
            });
        });
    };

    /*
     |  GENERAL :: TAB HANDLER
     |  @since  0.1.0 [0.1.0]
     */
    var tabHandler = function(event) {
        var self = this;
        var navi = this;

        // Get Navi
        do {
            navi = navi.parentElement;
        } while(navi && navi.getAttribute("data-handle") !== "tabs");

        if(!navi || navi.getAttribute("data-handle") !== "tabs") {
            return false;
        }

        // Get Tab Contents
        if(navi.hasAttribute("data-target")) {
            var contents = document.querySelectorAll(navi.getAttribute("data-target"));
        } else {
            var contents = navi.parentElement.querySelectorAll(".tab-content");
        }
        if(contents.length == 0) {
            return false;
        }

        // Prevent Event
        event.preventDefault();

        // Handle Navi Links
        each(navi.querySelectorAll("a[href]"), function() {
            var toggle = (this.parentElement.tagName === "LI")? this.parentElement: this;
            if(self.hash === this.hash) {
                toggle.classList.add("active");
            } else {
                toggle.classList.remove("active");
            }
        });

        // Handle Tab Contents
        each(contents, function() {
            if("#" + this.id === self.hash) {
                this.classList.add("active");
            } else {
                this.classList.remove("active");
            }
        });
    };

    /*
     |  GENERAL :: TOOLTIP HANDLER
     |  @since  0.1.0 [0.1.0]
     */
    var toolID = 0, tooltipHandler = function(ev) {
        var _in = this.getAttribute("data-event-in") || "mouseenter";
        var _out = this.getAttribute("data-event-out") || "mouseleave";
        var action = (_in == _out)? !this.hasAttribute("data-tooltip-id"): (ev.type == _in);
    
        // Show Tooltip
        if(action) {
            var config = {
                color: "white", 
                position: "top", 
                animation: "ease-in", 
                classNames: ""
            }, tip, pos;
    
            if(!this.hasAttribute("data-tooltip-id")) {
                if(this.hasAttribute("data-tooltip-config")) {
                    this.getAttribute("data-tooltip-config").split(",").forEach(function(item) {
                        if(["white", "black", "red", "orange", "green", "blue", "violet"].indexOf(item) >= 0) {
                            config.color = item;
                        } else if(["top", "left", "right", "bottom"].indexOf(item) >= 0) {
                            config.position = item;
                        } else if(["blank", "fade", "ease-in", "ease-out"].indexOf(item) >= 0) {
                            config.animation = item;
                        } else {
                            config.classNames += " " + item;
                        }
                    });
                }
                tip = document.createElement("DIV");
                tip.id = "tooltip-" + ++toolID;
                tip.innerHTML = this.getAttribute("data-tooltip");
                tip.className = "tooltip tooltip-" + config.color + " tooltip-" + config.position + " "
                              + "tooltip-" + config.animation + config.classNames;
                document.body.appendChild(tip);
    
                pos = function(element) {
                    var position = {
                        top:    element.offsetTop    || 0,
                        left:   element.offsetLeft   || 0,
                        width:  element.offsetWidth  || 0,
                        height: element.offsetHeight || 0
                    };
                    while(element = element.offsetParent){
                        position.top  += element.offsetTop;
                        position.left += element.offsetLeft;
                    }
                    return position;
                }(this);
                switch(config.position) {
                    case "left":
                        tip.style.top = (pos.top + (pos.height/2) - (tip.offsetHeight/2)) + "px";
                        tip.style.left = (pos.left - tip.offsetWidth - 10) + "px";
                        break;
                    case "right":
                        tip.style.top = (pos.top + (pos.height/2) - (tip.offsetHeight/2)) + "px";
                        tip.style.left = (pos.left + pos.width + 10) + "px";
                        break;
                    case "bottom":
                        tip.style.top = (pos.top + pos.height + 10) + "px";
                        tip.style.left = (pos.left + (pos.width / 2) - (tip.offsetWidth / 2)) + "px";
                        break;
                    default:
                        tip.style.top = (pos.top - tip.offsetHeight - 10) + "px";
                        tip.style.left = (pos.left + (pos.width / 2) - (tip.offsetWidth / 2)) + "px";
                        break;
                }
                this.setAttribute("data-tooltip-id", "tooltip-" + toolID);
            }
            (function(id) {
                setTimeout(function(){ document.querySelector("#" + id).className += " show" }, 25);
            }(this.getAttribute("data-tooltip-id")));
            return;
        }
    
        // Hide Tooltip
        var tip = document.querySelector("#" + this.getAttribute("data-tooltip-id"));
        tip.className = tip.className.replace(/(?:^|\s+)(show)(?:\s+|$)/, "");
        this.removeAttribute("data-tooltip-id");
        (function(e) {
            setTimeout(function(){ e.parentElement.removeChild(e); }, 200);
        })(tip);
        return;
    };

    /*
     |  DEMO :: SELECT FROM STORAGE
     |  @since  0.1.0 [0.1.0]
     */
    window.selectStorage = function(id, storageKey) {
        if(typeof Storage === "undefined") {
            return false;
        }

        var element = document.querySelector(id);
        if(!element) {
            return false;
        }

        var value = sessionStorage.getItem(storageKey) || element.value;
        if(element.value === value) {
            return true;
        }
        element.querySelector("option[value='" + value + "']").selected = true;
        
        if(id === "#change-scheme" && (value.indexOf("dark") >= 0)) {
            document.body.classList.add("demo-dark");
        } else {
            document.body.classList.remove("demo-dark");
        }
        return true;
    }

    /*
     |  DEMO :: STORE IN STORAGE
     |  @since  0.1.0 [0.1.0]
     */
    window.storeStorage = function(id, storageKey) {
        if(typeof Storage === "undefined") {
            return false;
        }

        var element = document.querySelector(id);
        if(!element) {
            return false;
        }

        sessionStorage.setItem(storageKey, element.value);

        if(id === "#change-scheme" && (element.value.indexOf("dark") >= 0)) {
            document.body.classList.add("demo-dark");
        } else {
            document.body.classList.remove("demo-dark");
        }
        return true;
    }

    /*
     |  DEMO :: THEME SELECTION HAS CHANGED
     |  @since  0.1.0 [0.1.0]
     */
    window.changedTheme = function(handle) {
        var theme = document.querySelector("#change-theme");
        var scheme = document.querySelector("#change-scheme");
        for(var l = scheme.options.length, i = 0; i < l; i++) {
            scheme.options[i].hidden = !(scheme.options[i].getAttribute("data-theme") === theme.value);
        }

        if(handle !== false) {
            scheme.querySelector("option:not([hidden])").selected = true;
            storeStorage("#change-scheme", "select-scheme");
        }
    };

    // Ready?
    document.addEventListener("DOMContentLoaded", function() {
        "use strict";
        
        /*
         |  ATTR :: HANDLE LOADs
         */
        each(document.querySelectorAll("*[data-onload]"), function(navi) {
            this.classList.add(this.getAttribute("data-onload"));
        });

        /*
         |  ATTR :: HANDLE TOGGLEs
         */
        each(document.querySelectorAll("*[data-toggle]"), function(navi) {
            this.addEventListener("click", toggleHandler);
        });

        /*
         |  ATTR :: HANDLE TABs
         */
        each(document.querySelectorAll("*[data-handle='tabs'] a[href]"), function(navi) {
            this.addEventListener("click", tabHandler);

            if(this.hash === window.location.hash) {
                this.click();
            }
        });

        /*
         |  ATTR :: HANDLE TOOLTIPS
         */
        each(document.querySelectorAll("*[data-tooltip]"), function(item){
            item.addEventListener(item.getAttribute("data-event-in") || "mouseenter", tooltipHandler);
            item.addEventListener(item.getAttribute("data-event-out") || "mouseleave", tooltipHandler);
        });

        /*
         |  INIT :: MENU SPY
         */
        var path = location.pathname.split("/");
            path = path[path.length - 1];
        var navi = document.querySelector("ul.toc-navi > li.navi-item.item-has-sub > a[href^='" + path + "']");

        if(navi !== null) {
            navi.parentElement.classList.add("active");
            new MenuSpy(navi.parentElement.querySelector("ul.toc-sub-navi"), {
                menuItemSelector: 'a[href^="' + path + '#"]',
                threshold: 0,
                callback: function(current) {
                    var item = current.elm.parentElement;
                    var navi = item.parentElement;

                    let pos = (function(el, pos){
                        while((el = el.parentElement) != navi){
                            pos.top += el.offsetTop;
                        }
                        return pos;
                    })(item, { top: item.offsetTop, height: item.offsetHeight });

                    if(navi.scrollTop + 300 <= pos.top) {
                        navi.scrollTop = Math.max(0, pos.top - (pos.height * 2));
                    } else if(navi.scrollTop >= pos.top - current.elm.offsetHeight) {
                        navi.scrollTop = Math.max(0, pos.top - (pos.height * 2));
                    }
                }
            });
        }

        /*
         |  IS READY
         */
        window.isReady = true;
    });
}());
