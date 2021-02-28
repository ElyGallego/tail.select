
t.test('csvSeparator', (t) => {
    let document = createDocument();
    let source = document.querySelector('select');
    let select;

    // csvSeparator
    source.name = 'custom-name';
    source.multiple = true;
    source.innerHTML = '<option value="a" selected>Value A</option><option value="b" selected>Value B</option>';
    select = rat(source, { csvOutput: true, csvSeparator: ',' });
    t.is(select.csv.value, "")

});
