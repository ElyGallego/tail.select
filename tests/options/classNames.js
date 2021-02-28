
t.test('classNames', (t) => {
    let document = createDocument();
    let source = document.querySelector('select');
    let select;

    // Class Name as Option
    select = rat(source, { classNames: 'custom-class custom-class-2' });
    t.ok(select.select.classList.contains('custom-class'), "Custom classNames as option");
    t.ok(select.select.classList.contains('custom-class') && select.select.classList.contains('custom-class-2'), "Custom classNames as option [Multiple]");
    select.destroy();

    // Class Name from Source
    source.className = 'custom-source-class custom-source-class-2';
    select = rat(source, { classNames: true });
    t.ok(select.select.classList.contains('custom-source-class'), "Custom classNames from source");
    t.ok(select.select.classList.contains('custom-source-class') && select.select.classList.contains('custom-source-class-2'), "Custom classNames from source [Multiple]");
    select.destroy();

    // Prevent ClassNames
    select = rat(source, { classNames: false });
    t.notOk(select.select.classList.contains('custom-source-class'), "Prevent Custom classNames from source");
    select.destroy();
});
