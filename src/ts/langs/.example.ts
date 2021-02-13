/*!
 |  [LOCALIZATION] Translation
 |  @author     [AUTHOR] <[OPTIONAL_AUTHOR@MAIL.COM]> ([WEBSITE])
 |  @source     [GITHUB PULL / ISSUE LINK]
 */
import RatSelect from "rat.select";

RatSelect.Strings["[LOCALE]"] = {
    buttonAll: "All",
    buttonNone: "None",
    disabled: "This field is disabled",
    empty: "No options available",
    error: "Oops, an error is occured",
    loading: "Loading, please wait.",
    multiple: "Choose one or more options...",
    multipleCount: "[0] options selected...",
    multipleLimit: "No more options selectable",
    search: "Tap to search...",
    single: "Choose an option...",
    waiting: "Waiting for your input."
};

/*
 |  TRANSLATION NOTES <-- PLEASE REMOVE THIS WHOLE COMMENT ON PULL REQUESTS -->
 |
 |  All translation keys marked with a star are "native" strings, the rest are
 |  only available on one or more of the included plugins.
 |  PS: Don't forget to replace the locale on `RatSelect.Strings["[LOCALE]"]`
 |  this MUST match with the filename of your new `*.ts` translation.
 |
 | 
 |  *   buttonAll
 |          Button to select all options (completely or of a single optgroup).
 |          SHOULD BE AS SMALL AS POSSIBLE IN YOUR LANGUAGE!
 |
 |  *   buttonNone
 |          Button to deselect all options (completely or of a single optgroup).
 |          SHOULD BE AS SMALL AS POSSIBLE IN YOUR LANGUAGE!
 |
 |  *   disabled
 |          Is shown as placeholder when the select field is 'disabled'.
 |
 |  *   empty
 |          Is shown in the dropdown field when no option is available (empty).
 |
 |      error
 |          Is shown in the dropdown field when an error has occured.
 |          THIS IS ONLY USED ON THE AJAX PLUGIN.
 |
 |      loading
 |          Is shown in the dropdown field while the AJAX callback is working.
 |          THIS IS ONLY USED ON THE AJAX PLUGIN.
 |  
 |  *   multiple
 |          Is shown as placeholder when the select field is 'multiple'.
 |
 |  *   multipleCount
 |          Is shown as placeholder when one or more options on a 'multiple' 
 |          select field are selected. The `[0]` part is replaced by the number
 |          of selected options (you can also pass a function, which receives
 |          the count as first and only argument, useful if your language 
 |          decides between singular and plural as in '1 option', '2 options'.
 |          See 'de.ts' or 'ru.ts' for examples!
 | 
 |  *   multipleLimit
 |          Is shown as placeholder when the 'multiLimit' option is reached and 
 |          the user cannot select more options anymore.
 |
 |      search
 |          Is shown as placeholder text on the search input field.
 |          THIS IS ONLY USED ON THE SEARCH PLUGIN.
 |
 |  *   single
 |          Is shown as placeholder on single 'deselect'-able select fields.
 |
 |      waiting
 |          Is shown in the dropdown field while the AJAX callback is waiting
 |          for some user input (before any option gets shown).
 |          THIS IS ONLY USED ON THE AJAX PLUGIN
 |
 |
 |  Thanks for translation rat.select, you're awesome <3
 */