/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/locales/tr.js
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
    select.strings.add("tr", {
        buttonAll: "Tümü",
        buttonNone: "Hiçbiri",
        disabled: "Bu Alan kullanılamaz",
        empty: "Seçenek yok",
        emptySearch: "Seçenek bulunamadı",
        multiple: "Bir Seçenek seçin...",
        multipleCount: "En fazla [1] Seçenek seçin...",
        multipleLimit: "Daha fazla Seçenek seçemezsiniz",
        search: "Aramak için yazın...",
        single: "Bir Seçenek seçin..."
    });
    return select;
}));