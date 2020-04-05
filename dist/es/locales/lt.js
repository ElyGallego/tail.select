/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/locales/lt.js
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
     |  @author     Apskaita5 - (https://github.com/Apskaita5)
     |  @source     https://github.com/pytesNET/tail.select/issues/124
     */
    select.strings.add("lt", {
        buttonAll: "Visi",
        buttonNone: "Nei vienas",
        disabled: "Šis laukelis išjungtas",
        empty: "Nėra pasirinkimų",
        emptySearch: "Nepavyko rasti pasirinktimų",
        multiple: "Pasirinkite variantą...",
        multipleCount: "Pasirinkite iki [0] variantų...",
        multipleLimit: "Jūs negalite pasirinkti daugiau variantų",
        search: "Įrašykite paieškos teksto fragmentą...",
        single: "Pasirinkite variantą..."
    });
    return select;
}