/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/locales/pt_BR.js
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
     |  @author     Igor - (https://github.com/igorcm)
     |  @source     https://github.com/pytesNET/tail.select/pull/34
     */
    select.strings.add("pt_BR", {
        buttonAll: "Todas",
        buttonNone: "Nenhuma",
        disabled: "Campo desativado",
        empty: "Nenhuma opção disponível",
        emptySearch: "Nenhuma opção encontrada",
        multiple: "Escolha uma opção...",
        multipleCount: function (args) {
            var num = args['[1]'];
            return 'Escolha até [1] ' + (num === 1? 'opção': 'opções') + '...';
        },
        multipleLimit: "Não é possível selecionar outra opção",
        search: "Buscar...",
        single: "Escolha uma opção..."
    });
    return select;
}