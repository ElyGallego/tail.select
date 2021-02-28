
require.config({
    baseUrl: "../../dist/js"
})
require(["rat.select"], function(select) {
    require(["langs/de_AT", "plugins/ajax"], function() {
        select("select");
    });
});