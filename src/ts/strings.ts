<<<<<<< HEAD
/*
 |  STORAGE :: STRINGS
 */
const Strings = {
    /*
     |  DEFAULT LOCALE
     */
    en: {
=======

export class Strings implements RatSelect_Strings {
    /*
     |  STATIC :: DEFAULT LOCALE
     */
    static en = {
>>>>>>> master
        buttonAll: "All",
        buttonNone: "None",
        disabled: "This field is disabled",
        empty: "No options available",
<<<<<<< HEAD
        emptySearch: "No options found",
        multiple: "Choose one or more options...",
        multipleCount: "Choose up to [1] options...",
        multipleLimit: "No more options selectable...",
        multipleList: "[0] options selected",
        search: "Tap to search...",
        single: "Choose an option..."
    },

    /*
     |  ADD OF MODIFY LOCALE
     |  @since  0.6.0 [0.6.0]
     |
     |  @param  string  The locale string.
     |  @param  multi   The { key: value } strings object or just the strings key.
     |  @param  string  The strings value, if [key] is a string too.
     |
     |  @return bool    TRUE if everything is fluffy, FALSE if not.
     */
    add: function(locale: string, key: object | string, value?: string): boolean {
        if(!(locale in this)) {
            this[locale] = tail.clone(this.en, { });
        }
        if(key instanceof Object) {
            this[locale] = tail.clone(this[locale], key);
            return true;
        } else if(typeof key === "string" && typeof value === "string") {
            this[locale][key] = value;
            return true;
        }
        return false;
    }
};
=======
        multiple: "Choose one or more options...",
        multipleCount: (count) => {
            return `[0] ${count === 1? "option": "options"} selected...`
        },
        multipleLimit: "No more options selectable",
        single: "Choose an option..."
    };

    /*
     |  CORE :: STRING STORAGE
     */
    strings: RatSelect_StringsLocale;

    /*
     |  CORE :: CONSTRUCTOR
     */
    constructor(locale: string) {
        this.strings = Strings[locale] || Strings.en;
    }

    /*
     |  CORE :: TRANSLATE STRING
     */
    _(key: string, params?: Array<string | number>): string {
        let string = (key in this.strings)? this.strings[key]: key;
        if(typeof string === "function") {
            string = (string as Function).apply(this, params);
        }
        if(typeof params !== "undefined" && params.length > 0) {
            params.map((replace, index) => {
                let regexp = new RegExp("\\[" + index.toString() + "\\]", "g");
                string = string.replace(regexp, replace.toString());
            });
        }
        return string;
    }
}
>>>>>>> master
