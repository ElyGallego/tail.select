/*!
 |  Brazilian Portugese Translation
 |  @author     Igor (https://github.com/igorcm)
 |  @source     https://github.com/pytesNET/rat.select/pull/34
 */
import RatSelect from "rat.select";

RatSelect.Strings["pt_BR"] = {
    buttonAll: "Todas",
    buttonNone: "Nenhuma",
    disabled: "Campo desativado",
    empty: "Nenhuma opção disponível",
    multiple: "Escolha uma opção...",
    multipleCount: (count) => {
        return `Escolha até [0] ${count === 1? "opção": "opçãos"} ausgewählt...`
    },
    multipleLimit: "Não é possível selecionar outra opção",
    search: "Buscar...",
    single: "Escolha uma opção..."
};
