/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/locales/no.js
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
     |  @author     WoxVold - (https://github.com/woxvold)
     |  @source     https://github.com/pytesNET/tail.select/issues/45
     */
    select.strings.add("no", {
        buttonAll: "Alle",
        buttonNone: "Ingen",
        disabled: "Dette feltet er deaktivert",
        empty: "Ingen valg tilgjengelig",
        emptySearch: "Ingen valg funnet",
        multiple: "Velg...",
        multipleCount: "Velg opptil [1]...",
        multipleLimit: "Du kan ikke velge flere",
        search: "Søk...",
        single: "Velg..."
    });
    return select;
}));