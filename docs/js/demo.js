/*
 |  TAIL.SELECT SCRIPTs FOR ./index.html
 */
;(function() {
    "use strict";

    /*
     |  READY?
     */
    var ready = function(event) {
        /*
         |  SELECT :: HANDLE CHANGES
         */
        var changes = document.querySelectorAll("#change-theme, #change-scheme, #change-locale");
        for(var i = 0; i < changes.length; i++) {
            changes[i].addEventListener("change", function() {
                [].map.call(tail.select(document.querySelectorAll("select.select-demo")), function(inst) {
                    inst.set("locale", changes[2].value);
                    inst.set("theme", changes[0].value + "-" + changes[1].value);
                    inst.reload(false);
                });
            });
        }


        /*
         |  SELECT :: BASIC EXAMPLEs (1, 2)
         */
        tail.select("select.select-default", {
            locale: changes[2].value,
            theme: changes[0].value + "-" + changes[1].value
        });

        /*
         |  SELECT :: OPTGROUP EXAMPLE (3)
         */
        tail.select("select.select-optgroups", {
            locale: changes[2].value,
            theme: changes[0].value + "-" + changes[1].value
        });

        /*
         |  SELECT :: DESCRIPTION EXAMPLE (4)
         */
        tail.select("select.select-descriptions", { 
            stickyGroups: true,
            locale: changes[2].value,
            theme: changes[0].value + "-" + changes[1].value
        });

        /*
         |  SELECT :: SEARCH EXAMPLE (5)
         */
        tail.select("select.select-search", { 
            search: true,
            locale: changes[2].value,
            theme: changes[0].value + "-" + changes[1].value
        });

        /*
         |  SELECT :: MULTI LIMIT EXAMPLE (6)
         */
        tail.select("select.select-limit", { 
            search: true, 
            multiLimit: 5, 
            multiLabelCount: true,
            multiLabelLimit: true,
            multiSelectGroup: false,
            stickyGroups: true,
            locale: changes[2].value,
            theme: changes[0].value + "-" + changes[1].value
        });

        /*
         |  EXTENSION :: AJAX PLUGIN
         */
        tail.select("select.select-ajax", {
            plugins: {
                ajax: {
                    ajax: true
                }
            }
        });
        tail.select("select.select-ajax-on", {
            plugins: {
                ajax: {
                    ajax: true
                }
            }
        });

        /*
         |  EXTENSION :: COLUMNS PLUGIN
         */
        tail.select("select.select-columns", {
            plugins: {
                columns: {
                    columns: 2
                }
            }
        });

        /*
         |  EXTENSION :: COLUMNS PLUGIN
         */
        tail.select("select.select-input", {
            plugins: {
                input: {
                    input: true
                }
            }
        });
    }
    
    // Ready
    document.addEventListener("DOMContentLoaded", function() {
        var interval = setInterval(function() {
            if(window.isReady === true) {
                clearInterval(interval);
                ready();
            }
        }, 10);
    });
}());
