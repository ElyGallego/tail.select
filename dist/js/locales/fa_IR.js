/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/locales/fa_IR.js
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
     |  @author     abdulhalim - (https://github.com/abdulhalim)
     |  @source     https://github.com/pytesNET/tail.select/issues/129
     */
    select.strings.add("fa_IR", {
        buttonAll: "همه",
        buttonNone: "هیچکدام",
        disabled: "کادر غیرفعال است",
        empty: "انتخابی موجود نیست",
        emptySearch: "انتخابی یافت نشد",
        multiple: "یک گزینه ای را انتخاب کنید",
        multipleCount: "حداکثر انتخاب تا:[0] را محدود کنید ...",
        multipleLimit: "نمیتوانید گزینه‌های بیشتری داشته باشید",
        search: "برای جستجو تایپ کنید...",
        single: "یک گزینه ای را انتخاب کنید"
    });
    return select;
}));