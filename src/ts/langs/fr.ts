/*!
 |  French Translation
 |  @author     Anthony Rabine (https://github.com/arabine)
 |  @source     https://github.com/pytesNET/rat.select/issues/11
 */
import RatSelect from "rat.select";

RatSelect.Strings["fr"] = {
    buttonAll: "Tous",
    buttonNone: "Aucun",
    disabled: "Ce champs est désactivé",
    empty: "Aucune option disponible",
    multiple: "Choisissez une option...",
    multipleCount: (count) => {
        return `Choisissez jusqu'à [0] ${count === 1? "option": "options"}...`
    },
    multipleLimit: "Aucune autre option sélectionnable",
    search: "Rechercher...",
    single: "Choisissez une option..."
};
