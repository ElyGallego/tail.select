/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/locales/it.js
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
     |  @author     Alberto Vincenzi - (https://github.com/albertovincenzi)
     |  @source     https://github.com/pytesNET/tail.select/issues/43
     */
    select.strings.add("it", {
        buttonAll: "Tutti",
        buttonNone: "Nessuno",
        disabled: "Questo Campo è disabilitato",
        empty: "Nessuna voce disponibile",
        emptySearch: "Nessuna voce trovata",
        multiple: "Seleziona una Voce...",
        multipleCount: "Selezione limitata a [1] Voci...",
        multipleLimit: "Non puoi selezionare più Voci",
        search: "Digita per cercare...",
        single: "Seleziona una Voce..."
    });
    return select;
}));