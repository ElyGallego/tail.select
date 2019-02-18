/*
 |  tail.select - Another solution to make select fields beautiful again!
 |  @file       ./langs/tail.select-fi.js
 |  @author     SamBrishes <sam@pytes.net>
 |  @version    0.5.6 - Beta
 |
 |  @website    https://github.com/pytesNET/tail.select
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2014 - 2019 SamBrishes, pytesNET <info@pytes.net>
 */
;(function(factory){
   if(typeof(define) == "function" && define.amd){
       define(function(){
           return function(select){ factory(select); };
       });
   } else {
       if(typeof(window.tail) != "undefined" && window.tail.select){
           factory(window.tail.select);
       }
   }
}(function(select){
    select.strings.register("fi", {
        all: "Kaikki",
        none: "Ei mitään",
        actionAll: "Valitse kaikki",
        actionNone: "Poista kaikki valinnat",
        empty: "Ei vaihtoehtoja",
        emptySearch: "Etsimääsi vaihtoehtoa ei löytynyt",
        limit: "Muita vaihtoehtoja ei voi valita",
        placeholder: "Valitse...",
        placeholderMulti: "Valitse maksimissaan :limit...",
        search: "Kosketa etsiäksesi",
        disabled: "Kenttä on poissa käytöstä"
    });
    return select;
}));
