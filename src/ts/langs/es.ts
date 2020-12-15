/*!
 |  Spanish Translation
 |  @author     elPesecillo (https://github.com/elPesecillo)
 |  @source     https://github.com/pytesNET/rat.select/issues/41
 */
import RatSelect from "rat.select";

RatSelect.Strings["es"] = {
    buttonAll: "Todos",
    buttonNone: "Ninguno",
    disabled: "Este campo esta deshabilitado",
    empty: "No hay opciones disponibles",
    multiple: "Selecciona una opción...",
    multipleCount: (count) => {
        return `Seleccionva hasta [0] ${count === 1? "opción": "opciónes"}...`
    },
    multipleLimit: "No puedes seleccionar mas opciones",
    search: "Escribe dentro para buscar...",
    single: "Selecciona una opción..."
};
