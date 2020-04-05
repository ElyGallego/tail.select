/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/locales/fi.js
 |  @authors    SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |              Lenivyy <lenivyy@pytes.net> (https://www.pytes.net)
 |  @version    0.6.0 - Beta : ECMAScript 5
 |
 |  @website    https://github.com/pytesNET/tail.select
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2014 - 2020 pytesNET <info@pytes.net>
 */
;(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(['tail.select'], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory;
    } else {
        factory(root.tail.select);
    }
}((typeof window !== "undefined"? window: (typeof global !== "undefined")? global: this), function (select) {
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
}));