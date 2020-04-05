/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/locales/ru.js
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
     |  @author     Roman Yepanchenko - (https://github.com/tizis)
     |  @source     https://github.com/pytesNET/tail.select/issues/38
     */
    select.strings.add("ru", {
        buttonAll: "Все",
        buttonNone: "Ничего",
        disabled: "Поле отключено",
        empty: "Нет доступных вариантов",
        emptySearch: "Ничего не найдено",
        multiple: "Выберите вариант...",
        multipleCount: function (args) {
            var strings = ['варианта', 'вариантов', 'вариантов'], cases = [2, 0, 1, 1, 1, 2], num = args['[1]'];
            var string = strings[(num%100 > 4 && num%100 < 20)? 2: cases[(num%10 < 5)? num%10: 5]];
            return 'Выбор до [1] ' + string + '...';
        },
        multipleLimit: "Вы не можете выбрать больше вариантов",
        search: "Начните набирать для поиска...",
        single: "Выберите вариант..."
    });
    return select;
}