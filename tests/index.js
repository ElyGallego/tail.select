const fs = require('fs');
const path = require('path');
const dom = require('../../~linkedom');
const rat = require('../dist/js/rat.select');

const { reporter } = require('@rat.md/zora-reporter');
const { createHarness } = require('zora');
const harness = createHarness();
const { test } = harness;

/*
 |  DEFINE TESTING GLOBALS
 */
global.window = {
    innerHeight: 1080,
    getComputedStyle: () => {
        return {
            content: '"default-theme"'
        }
    }
};
global.createDocument = () => {
    global.document = (new dom.DOMParser).parseFromString('<!DOCTYPE html><html><head></head><body><select></select></body></html>', 'text/html');
    return global.document;
};
global.rat = rat;
global.HTMLElement = dom.HTMLElement;
global.HTMLSelectElement = dom.HTMLSelectElement;
global.HTMLOptionElement = dom.HTMLOptionElement;
global.HTMLOptGroupElement = dom.HTMLOptGroupElement;

/*
 |  HELLO WORLD TESTING
 */
test('Hello World', (t) => {
    let select = new rat(createDocument().querySelector('select'));
    t.is(select.source.outerHTML, '<select style="display:none" data-rat-select="0"></select>', 'The source select field looks fine.');
    t.is(select.select.outerHTML, '<DIV style="width:250px" data-rat-select="0" tabindex="-1" class="rat-select theme-default scheme-theme hide-hidden"><LABEL class="select-label"><div class="label-placeholder">No options available</div></LABEL><DIV class="select-dropdown overflow-clip"><div class="dropdown-inner"></div></DIV></DIV>', 'The rat.select field looks fine');
});

/*
 |  HANDLE OPTIONS TESTS
 */
test('Options', (t) => {
    globalThis.t = t;
    fs.readdirSync('./tests/options', 'utf-8').map((file) => {
        const module = path.join(__dirname, 'options', file);
        require(module);
        delete require.cache[module];
    });
});

/*
 |  TEST OUTPUT
 */
harness.report(reporter()).then(() => { });
