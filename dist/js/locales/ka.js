/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/js/locales/ka.js
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
     |  @author     Sandro Pirtskhalava - (https://github.com/spirtskhalava)
     |  @source     https://github.com/pytesNET/tail.select/issues/122
     */
    select.strings.add("ka", {
        buttonAll: "ყველას მონიშვნა",
        buttonNone: "ყველას გაუქმება",
        disabled: "ველი გაუქმებულია",
        empty: "ოფცია არ არის ხელმისაწვდომი",
        emptySearch: "ოფცია ვერ მოიძებნა",
        multiple: "აირჩიეთ ოფცია...",
        multipleCount: "აირჩიეთ [0]-ზე მეტი ოფცია...",
        multipleLimit: "თქვენ არ შეგიძლიათ მეტი ოფციის არჩევა",
        search: "ძებნისთვის აკრიფეთ...",
        single: "აირჩიეთ ოფცია..."
    });
    return select;
}));