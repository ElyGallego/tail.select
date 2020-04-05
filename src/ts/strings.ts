/*
 |  STORAGE :: STRINGS
 */
const Strings = {
    /*
     |  DEFAULT LOCALE
     */
    en: {
        buttonAll: "All",
        buttonNone: "None",
        disabled: "This field is disabled",
        empty: "No options available",
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
