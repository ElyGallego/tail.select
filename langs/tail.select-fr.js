/*
 |  tail.select - Another solution to make select fields beautiful again!
 |  @file       ./langs/tail.select-fr.js
 |  @author     Anthony Rabine [https://github.com/arabine]
 |  @version    0.5.2 - Beta
 |
 |  @website    https://github.com/pytesNET/tail.select
 |  @license    X11 / MIT License
 |  @copyright  Copyright © 2014 - 2018 SamBrishes, pytesNET <pytes@gmx.net>
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
    select.strings.register("fr", {
        all: "Tous",
        none: "Aucun",
        actionAll: "Sélectionner tout",
        actionNone: "Sélectionner aucun",
        empty: "Aucune option disponible",
        emptySearch: "Aucune option trouvée",
        limit: "Aucune autre option sélectionnable",
        placeholder: "Choisissez une option ...",
        placeholderMulti: "Choisissez jusqu'à :limit option(s) ...",
        search: "Rechercher ...",
        disabled: "Ce champs est désactivé"
    });
    return select;
}));
