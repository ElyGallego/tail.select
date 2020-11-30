
declare interface RatSelect_StringsLocale {
    [key: string]: string
}

declare interface RatSelect_StringsConstructor {
    /*
     |  STATIC :: LOCALE TRANSLATION OBJECTs
     */
    [key: string]: RatSelect_StringsLocale;

    /*
     |  CORE :: CONSTRUCTOR
     |  @since  1.0.0
     |
     |  @param  string  The desired locale to use.
     */
    new(locale: string): RatSelect_Strings
}

declare interface RatSelect_Strings {
    /*
     |  CORE :: STRING STORAGE
     */
    strings: RatSelect_StringsLocale;

    /*
     |  CORE :: TRANSLATE STRING
     |  @since  1.0.0
     |
     |  @param  string  The locale string key to translate.
     |  @param  array   Some additional arguments to parse.
     |
     |  @return string  The translated and parsed string.
     */
    _(key: string, params?: string[]): string
}
