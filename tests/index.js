require('dotenv').config()

const fs = require('fs');
const path = require('path');
const dom = require('../../~linkedom');
const rat = require('../dist/js/rat.select');

const RatZoraReporter = require('./zora-reporter');

const { createHarness } = require('zora');
const { time } = require('console');
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
global.HTMLElement = dom.HTMLElement;
global.HTMLSelectElement = dom.HTMLSelectElement;
global.HTMLOptionElement = dom.HTMLOptionElement;
global.HTMLOptGroupElement = dom.HTMLOptGroupElement;

/*
 |  HELLO WORLD TESTING
 */
test('Hello World', (t) => {
    select = new rat(createDocument().querySelector('select'));
    t.is(select.source.outerHTML, '<select style="display:none" data-rat-select="0"></select>', 'The source select field looks fine.');
    t.is(select.select.outerHTML, '<DIV style="width:250px" data-rat-select="0" tabindex="-1" class="rat-select theme-default scheme-theme hide-hidden"><LABEL class="select-label"><div class="label-placeholder">No options available</div></LABEL><DIV class="select-dropdown overflow-clip"><div class="dropdown-inner"></div></DIV></DIV>', 'The rat.select field looks fine');
});

/*
 |  HANDLE OPTIONS TESTS
 */
test('Testing Options', async (t) => {
    globalThis.t = t;

    fs.readdirSync('./tests/options', 'utf-8').map((file) => {
        const module = path.join(__dirname, 'options', file);
        require(module);
        delete require.cache[module];
    });
});


let handle = 1;
let timer = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 250);
    });
}

function testing() {
    if (handle++ >= 197) {
        return;
    }
    test('Test Title', async (t) => {
        let value = await timer();
        t.truthy(Math.floor(Math.random() * Math.floor(20)) < 18);
    }).then(() => {
        testing();
    });
}
testing();


harness.report(RatZoraReporter()).then(() => {
});
