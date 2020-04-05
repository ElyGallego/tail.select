/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/locales/fr.js
 |  @authors    SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |              Lenivyy <lenivyy@pytes.net> (https://www.pytes.net)
 |  @version    0.6.0 - Beta : ECMAScript 2015
 |
 |  @website    https://github.com/pytesNET/tail.select
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2014 - 2020 pytesNET <info@pytes.net>
 */
export function locale(select) {
    "use strict";

    /*
     |  @author     Anthony Rabine - (https://github.com/arabine)
     |  @source     https://github.com/pytesNET/tail.select/issues/11
     */
    select.strings.add("fr", {
        buttonAll: "Tous",
        buttonNone: "Aucun",
        disabled: "Ce champs est désactivé",
        empty: "Aucune option disponible",
        emptySearch: "Aucune option trouvée",
        multiple: "Choisissez une option...",
        multipleCount: function (args) {
            var num = args['[1]'];
            return 'Choisissez jusqu\'à [1] ' + (num === 1? 'option': 'options') + '...';
        },
        multipleLimit: "Aucune autre option sélectionnable",
        search: "Rechercher...",
        single: "Choisissez une option..."
    });
    return select;
}