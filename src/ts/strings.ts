
export class Strings implements RatSelect_Strings {
    /*
     |  STATIC :: DEFAULT LOCALE
     */
    static en = {
        "key": "value"
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
    _(key: string, params?: string[]): string {
        let string = (key in this.strings)? this.strings[key]: key;
        if(typeof params !== undefined && params.length > 0) {
            params.map((replace, index) => {
                let regexp = new RegExp("\[" + index + "\]", "g");
                return string.replace(regexp, replace);
            });
        }
        return string;
    }
}