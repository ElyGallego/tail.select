
t.test('csvOutput', (t) => {
    let document = createDocument();
    let source = document.querySelector('select');
    let select;
    
    // csvOutput Field source name
    source.name = "input-name";
    select = rat(source, { csvOutput: true });
    t.is(source.nextElementSibling.querySelector('[name="input-name"]').outerHTML, '<INPUT name="input-name" class="select-search">', "Create csv input field using name of source.");
    select.destroy();
    
    // csvOutput Field custom name
    select = rat(source, { csvOutput: 'custom-name' });
    t.is(source.nextElementSibling.querySelector('[name="custom-name"]').outerHTML, '<INPUT name="custom-name" class="select-search">', "Create csv input field using custom name.");
    select.destroy();

    // Prevent csvOutput Field
    select = rat(source, { csvOutput: false });
    t.is(source.nextElementSibling.querySelector('[name="custom-name"]'), null, "Prevent creation of csv input field.");
    select.destroy();
});
