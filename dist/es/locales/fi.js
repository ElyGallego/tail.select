/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/locales/fi.js
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
     |  @author     Noxludio - (https://github.com/noxludio)
     |  @source     https://github.com/pytesNET/tail.select/pull/35
     */
    select.strings.add("fi", {
        buttonAll: "Kaikki",
        buttonNone: "Ei mitään",
        disabled: "Kenttä on poissa käytöstä",
        empty: "Ei vaihtoehtoja",
        emptySearch: "Etsimääsi vaihtoehtoa ei löytynyt",
        multiple: "Valitse...",
        multipleCount: "Valitse maksimissaan [1]...",
        multipleLimit: "Muita vaihtoehtoja ei voi valita",
        search: "Hae tästä...",
        single: "Valitse..."
    });
    return select;
}