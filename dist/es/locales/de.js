/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/locales/de.js
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
     |  @author     SamBrishes - (https://www.github.com/SamBrishes)
     |  @source     <internal>
     */
    select.strings.add("de", {
        buttonAll: "Alle",
        buttonNone: "Keine",
        disabled: "Das Feld ist deaktiviert",
        empty: "Keine Optionen verfügbar",
        emptySearch: "Keine Optionen gefunden",
        multiple: "Wähle eine oder mehrere Optionen...",
        multipleCount: function (args) {
            var num = args['[1]'];
            return 'Wähle bis zu [1] ' + (num === 1? 'Option': 'Optionen') + '...';
        },
        multipleLimit: "Keine weiteren Optionen wählbar",
        search: "Tippen um zu suchen...",
        single: "Wähle eine Option..."
    });
    return select;
}