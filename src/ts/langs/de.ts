/*!
 |  German Translation
 |  @author     SamBrishes <sam@pytes.net> (https://www.pytes.net)
 |  @source     None
 */
import RatSelect from "rat.select";

RatSelect.Strings["de"] = {
    buttonAll: "Alle",
    buttonNone: "Keine",
    disabled: "Dieses Feld ist deaktiviert",
    empty: "Keine Optionen verfügbar",
    error: "Hoppla, ein Fehler ist aufgetreten.",
    input: "Drücke Enter um hinzuzufügen...",
    loading: "Bitte warten.",
    multiple: "Wähle eine oder mehrere Optionen...",
    multipleCount: (count) => {
        return `[0] ${count === 1? "Option": "Optionen"} ausgewählt...`
    },
    multipleLimit: "Keine weiteren Optionen wählbar",
    search: "Tippen um zu suchen...",
    single: "Wähle eine Option...",
    waiting: "Warte auf Eingabe..."
};
