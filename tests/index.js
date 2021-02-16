
const fs = require('fs');
const path = require('path');

const test = require('zora');
const dom = require('../../~linkedom');
const rat = require('../dist/js/rat.select');

/*
 |  DEFINE BASIC WINDOW OBJECT
 */
const window = {
    innerHeight: 1080,
    getComputedStyle: () => {
        return {
            content: '"default-theme"'
        }
    }
};

/*
 |  DEFINE BASIC DOCUMENT OBJECT
 */
const document = (new dom.DOMParser).parseFromString('<!DOCTYPE html><html><head></head><body><select></select></body></html>', 'text/html');

/*
 |  GLOBALIZE
 */
global.window = window;
global.document = document;
for (let key in dom) {
    global[key] = dom[key];
}

/*
 |  HELLO WORLD TESTING
 */
test.test('Hello World', (t) => {
    select = new rat(document.querySelector('select'));
    t.is(select.source.outerHTML, '<select style="display:none" data-rat-select="0"></select>');
    t.is(select.select.outerHTML, '<DIV style="width:250px" data-rat-select="0" tabindex="-1" class="rat-select theme-default scheme-theme hide-hidden"><LABEL class="select-label"><div class="label-placeholder">No options available</div></LABEL><DIV class="select-dropdown overflow-clip"><div class="dropdown-inner"></div></DIV></DIV>');
});

/*
 |  HANDLE OPTIONS TESTS
 */
test.test('Testing Options', (t) => {
    globalThis.t = t;

    fs.readdirSync('./tests/options', 'utf-8').map((file) => {
        const module = path.join(__dirname, 'options', file);
        require(module);
        delete require.cache[module];
    });
});
