/*!
 |  Russian Translation
 |  @author     Roman Yepanchenko (https://github.com/tizis)
 |  @source     https://github.com/pytesNET/rat.select/issues/38
 */
import RatSelect from "rat.select";

RatSelect.Strings["ru"] = {
    buttonAll: "Все",
    buttonNone: "Ничего",
    disabled: "Поле отключено",
    empty: "Нет доступных вариантов",
    multiple: "Выберите вариант...",
    multipleCount: (count) => {
        let strings = ['варианта', 'вариантов', 'вариантов'];
        let cases = [2, 0, 1, 1, 1, 2];
        let string = strings[(count%100 > 4 && count%100 < 20)? 2: cases[(count%10 < 5)? count%10: 5]];
        return `Выбор до [0] ${string}...`
    },
    multipleLimit: "Вы не можете выбрать больше вариантов",
    search: "Начните набирать для поиска...",
    single: "Выберите вариант..."
};
