/*!
 |  tail.select - The vanilla solution to level up your HTML <select> fields!
 |  @file       ./dist/es/locales/all.js
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
     |  @author     SamBrishes - (https://www.github.com/SamBrishes)
     |  @source     <internal>
     */
    select.strings.add("de", {
        buttonAll: "Alle",
        buttonNone: "Keine",
        disabled: "Das Feld ist deaktiviert",
        empty: "Keine Optionen verfügbar",
        emptySearch: "Keine Optionen gefunden",
        multiple: "Wähle eine oder mehrere Optionen...",
        multipleCount: function (args) {
            var num = args['[1]'];
            return 'Wähle bis zu [1] ' + (num === 1? 'Option': 'Optionen') + '...';
        },
        multipleLimit: "Keine weiteren Optionen wählbar",
        search: "Tippen um zu suchen...",
        single: "Wähle eine Option..."
    });

    /*
     |  @author     elPesecillo - (https://github.com/elPesecillo)
     |  @source     https://github.com/pytesNET/tail.select/issues/41
     */
    select.strings.add("es", {
        buttonAll: "Todos",
        buttonNone: "Ninguno",
        disabled: "Este campo esta deshabilitado",
        empty: "No hay opciones disponibles",
        emptySearch: "No se encontraron opciones",
        multiple: "Selecciona una opción...",
        multipleCount: function (args) {
            var num = args['[1]'];
            return 'Selecciona hasta [1] ' + (num === 1? 'opción': 'opciones') + '...';
        },
        multipleLimit: "No puedes seleccionar mas opciones",
        search: "Escribe dentro para buscar...",
        single: "Selecciona una opción..."
    });

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

    /*
     |  @author     Noxludio - (https://github.com/noxludio)
     |  @source     https://github.com/pytesNET/tail.select/pull/35
     */
    select.strings.add("fi", {
        buttonAll: "Kaikki",
        buttonNone: "Ei mitään",
        disabled: "Kenttä on poissa käytöstä",
        empty: "Ei vaihtoehtoja",
        emptySearch: "Etsimääsi vaihtoehtoa ei löytynyt",
        multiple: "Valitse...",
        multipleCount: "Valitse maksimissaan [1]...",
        multipleLimit: "Muita vaihtoehtoja ei voi valita",
        search: "Hae tästä...",
        single: "Valitse..."
    });

    /*
     |  @author     Anthony Rabine - (https://github.com/arabine)
     |  @source     https://github.com/pytesNET/tail.select/issues/11
     */
    select.strings.add("fr", {
        buttonAll: "Tous",
        buttonNone: "Aucun",
        disabled: "Ce champs est désactivé",
        empty: "Aucune option disponible",
        emptySearch: "Aucune option trouvée",
        multiple: "Choisissez une option...",
        multipleCount: function (args) {
            var num = args['[1]'];
            return 'Choisissez jusqu\'à [1] ' + (num === 1? 'option': 'options') + '...';
        },
        multipleLimit: "Aucune autre option sélectionnable",
        search: "Rechercher...",
        single: "Choisissez une option..."
    });

    /*
     |  @author     Alberto Vincenzi - (https://github.com/albertovincenzi)
     |  @source     https://github.com/pytesNET/tail.select/issues/43
     */
    select.strings.add("it", {
        buttonAll: "Tutti",
        buttonNone: "Nessuno",
        disabled: "Questo Campo è disabilitato",
        empty: "Nessuna voce disponibile",
        emptySearch: "Nessuna voce trovata",
        multiple: "Seleziona una Voce...",
        multipleCount: "Selezione limitata a [1] Voci...",
        multipleLimit: "Non puoi selezionare più Voci",
        search: "Digita per cercare...",
        single: "Seleziona una Voce..."
    });

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

    /*
     |  @author     WoxVold - (https://github.com/woxvold)
     |  @source     https://github.com/pytesNET/tail.select/issues/45
     */
    select.strings.add("no", {
        buttonAll: "Alle",
        buttonNone: "Ingen",
        disabled: "Dette feltet er deaktivert",
        empty: "Ingen valg tilgjengelig",
        emptySearch: "Ingen valg funnet",
        multiple: "Velg...",
        multipleCount: "Velg opptil [1]...",
        multipleLimit: "Du kan ikke velge flere",
        search: "Søk...",
        single: "Velg..."
    });

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

    /*
     |  @author     Noxludio - (https://github.com/noxludio)
     |  @source     https://github.com/pytesNET/tail.select/pull/35
     */
    select.strings.add("tr", {
        buttonAll: "Tümü",
        buttonNone: "Hiçbiri",
        disabled: "Bu Alan kullanılamaz",
        empty: "Seçenek yok",
        emptySearch: "Seçenek bulunamadı",
        multiple: "Bir Seçenek seçin...",
        multipleCount: "En fazla [1] Seçenek seçin...",
        multipleLimit: "Daha fazla Seçenek seçemezsiniz",
        search: "Aramak için yazın...",
        single: "Bir Seçenek seçin..."
    });

    /*
     |  @author     SamBrishes - (https://www.github.com/SamBrishes)
     |  @source     <internal>
     */
    select.strings.add("de", {
        buttonAll: "Alle",
        buttonNone: "Keine",
        disabled: "Das Feld ist deaktiviert",
        empty: "Keine Optionen verfügbar",
        emptySearch: "Keine Optionen gefunden",
        multiple: "Wähle eine oder mehrere Optionen...",
        multipleCount: function (args) {
            var num = args['[1]'];
            return 'Wähle bis zu [1] ' + (num === 1? 'Option': 'Optionen') + '...';
        },
        multipleLimit: "Keine weiteren Optionen wählbar",
        search: "Tippen um zu suchen...",
        single: "Wähle eine Option..."
    });

    /*
     |  @author     elPesecillo - (https://github.com/elPesecillo)
     |  @source     https://github.com/pytesNET/tail.select/issues/41
     */
    select.strings.add("es", {
        buttonAll: "Todos",
        buttonNone: "Ninguno",
        disabled: "Este campo esta deshabilitado",
        empty: "No hay opciones disponibles",
        emptySearch: "No se encontraron opciones",
        multiple: "Selecciona una opción...",
        multipleCount: function (args) {
            var num = args['[1]'];
            return 'Selecciona hasta [1] ' + (num === 1? 'opción': 'opciones') + '...';
        },
        multipleLimit: "No puedes seleccionar mas opciones",
        search: "Escribe dentro para buscar...",
        single: "Selecciona una opción..."
    });

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

    /*
     |  @author     Noxludio - (https://github.com/noxludio)
     |  @source     https://github.com/pytesNET/tail.select/pull/35
     */
    select.strings.add("fi", {
        buttonAll: "Kaikki",
        buttonNone: "Ei mitään",
        disabled: "Kenttä on poissa käytöstä",
        empty: "Ei vaihtoehtoja",
        emptySearch: "Etsimääsi vaihtoehtoa ei löytynyt",
        multiple: "Valitse...",
        multipleCount: "Valitse maksimissaan [1]...",
        multipleLimit: "Muita vaihtoehtoja ei voi valita",
        search: "Hae tästä...",
        single: "Valitse..."
    });

    /*
     |  @author     Anthony Rabine - (https://github.com/arabine)
     |  @source     https://github.com/pytesNET/tail.select/issues/11
     */
    select.strings.add("fr", {
        buttonAll: "Tous",
        buttonNone: "Aucun",
        disabled: "Ce champs est désactivé",
        empty: "Aucune option disponible",
        emptySearch: "Aucune option trouvée",
        multiple: "Choisissez une option...",
        multipleCount: function (args) {
            var num = args['[1]'];
            return 'Choisissez jusqu\'à [1] ' + (num === 1? 'option': 'options') + '...';
        },
        multipleLimit: "Aucune autre option sélectionnable",
        search: "Rechercher...",
        single: "Choisissez une option..."
    });

    /*
     |  @author     Alberto Vincenzi - (https://github.com/albertovincenzi)
     |  @source     https://github.com/pytesNET/tail.select/issues/43
     */
    select.strings.add("it", {
        buttonAll: "Tutti",
        buttonNone: "Nessuno",
        disabled: "Questo Campo è disabilitato",
        empty: "Nessuna voce disponibile",
        emptySearch: "Nessuna voce trovata",
        multiple: "Seleziona una Voce...",
        multipleCount: "Selezione limitata a [1] Voci...",
        multipleLimit: "Non puoi selezionare più Voci",
        search: "Digita per cercare...",
        single: "Seleziona una Voce..."
    });

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

    /*
     |  @author     WoxVold - (https://github.com/woxvold)
     |  @source     https://github.com/pytesNET/tail.select/issues/45
     */
    select.strings.add("no", {
        buttonAll: "Alle",
        buttonNone: "Ingen",
        disabled: "Dette feltet er deaktivert",
        empty: "Ingen valg tilgjengelig",
        emptySearch: "Ingen valg funnet",
        multiple: "Velg...",
        multipleCount: "Velg opptil [1]...",
        multipleLimit: "Du kan ikke velge flere",
        search: "Søk...",
        single: "Velg..."
    });

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

    /*
     |  @author     Noxludio - (https://github.com/noxludio)
     |  @source     https://github.com/pytesNET/tail.select/pull/35
     */
    select.strings.add("tr", {
        buttonAll: "Tümü",
        buttonNone: "Hiçbiri",
        disabled: "Bu Alan kullanılamaz",
        empty: "Seçenek yok",
        emptySearch: "Seçenek bulunamadı",
        multiple: "Bir Seçenek seçin...",
        multipleCount: "En fazla [1] Seçenek seçin...",
        multipleLimit: "Daha fazla Seçenek seçemezsiniz",
        search: "Aramak için yazın...",
        single: "Bir Seçenek seçin..."
    });
    return select;
}