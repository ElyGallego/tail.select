
export class Strings implements RatSelect_Strings {
    /*
     |  STATIC :: DEFAULT LOCALE
     */
    static en = {
        buttonAll: "All",
        buttonNone: "None",
        disabled: "This field is disabled",
        empty: "No options available",
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