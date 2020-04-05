/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/locales/fa.js
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
}