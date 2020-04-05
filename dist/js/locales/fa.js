/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/locales/fa.js
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
     |  @author     MrJavadAdib - (https://github.com/MrJavadAdib)
     |  @source     https://github.com/pytesNET/tail.select/pull/115
     */
    select.strings.add("fa", {
        buttonAll: "همه",
        buttonNone: "هیچ‌کدام",
        disabled: "غیرفعال",
        empty: "خالی",
        emptySearch: "خالی کردن جستجو",
        multiple: "نگهدارنده چندتایی",
        multipleCount: "نگهدارنده چندتایی",
        multipleLimit: "محدودیت",
        search: "جستجو",
        single: "نگهدارنده"
    });
    return select;
}));