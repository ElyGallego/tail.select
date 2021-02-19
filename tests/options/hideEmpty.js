
t.test('hideEmpty', (t) => {
    createDocument().body.outerHTML;

    t.truthy(false);

});
