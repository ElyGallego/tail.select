/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/locales/ka.js
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
}