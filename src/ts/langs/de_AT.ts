
import RatSelect from "rat.select";

RatSelect.Strings["de_AT"] = {
    "key": "value"
};

function test(object): Object {
    return { ...object, test: 14 };
}
test({ test:12 });