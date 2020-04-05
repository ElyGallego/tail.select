/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/locales/es.js
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
     |  @author     elPesecillo - (https://github.com/elPesecillo)
     |  @source     https://github.com/pytesNET/tail.select/issues/41
     */
    select.strings.add("es", {
        buttonAll: "Todos",
        buttonNone: "Ninguno",
        disabled: "Este campo esta deshabilitado",
        empty: "No hay opciones disponibles",
        emptySearch: "No se encontraron opciones",
        multiple: "Selecciona una opción...",
        multipleCount: function (args) {
            var num = args['[1]'];
            return 'Selecciona hasta [1] ' + (num === 1? 'opción': 'opciones') + '...';
        },
        multipleLimit: "No puedes seleccionar mas opciones",
        search: "Escribe dentro para buscar...",
        single: "Selecciona una opción..."
    });
    return select;
}));