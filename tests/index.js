const fs = require('fs');
const path = require('path');
const dom = require('../../~linkedom');
const rat = require('../dist/js/rat.select');

const { reporter } = require('../../zora-reporter');
const ratReporter = reporter({
    break: false,       // Break | Continue on Failure
    intro: true,        // Show  | Hide Intro
    summary: true       // Show  | Hide Summary
});

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
global.HTMLElement = dom.HTMLElement;
global.HTMLSelectElement = dom.HTMLSelectElement;
global.HTMLOptionElement = dom.HTMLOptionElement;
global.HTMLOptGroupElement = dom.HTMLOptGroupElement;

/*
 |  HELLO WORLD TESTING
 */
//test('Hello World', (t) => {
//    select = new rat(createDocument().querySelector('select'));
//    t.is(select.source.outerHTML, '<select style="display:none" data-rat-select="0"></select>', 'The source select field looks fine.');
//    t.is(select.select.outerHTML, '<DIV style="width:250px" data-rat-select="0" tabindex="-1" class="rat-select theme-default scheme-theme hide-hidden"><LABEL class="select-label"><div class="label-placeholder">No options available</div></LABEL><DIV class="select-dropdown overflow-clip"><div class="dropdown-inner"></div></DIV></DIV>', 'The rat.select field looks fine');
//});

/*
 |  HANDLE OPTIONS TESTS
 */
//test('Options', (t) => {
//    globalThis.t = t;
//    fs.readdirSync('./tests/options', 'utf-8').map((file) => {
//        const module = path.join(__dirname, 'options', file);
//        require(module);
//        delete require.cache[module];
//    });
//});

function getData() {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, 1500);
    });

}

test('Basic Tests', (t) => {
    

    t.equal('1', '1');
    t.notEqual('1', '2');
    t.is("ok", "ok");
    t.isNot("ok", "not ok");
    t.ok(true);
    t.notOk(false);
    t.fail();
    t.throws(() => {
        throw new Error('Everything is fine');
    });
    t.doesNotThrow(() => {
        return true;
    })
    
    //equal(actual: T, expected: T, message?: string) verify if two values/instances are equivalent. It is often described as deepEqual in assertion libraries. aliases: eq, equals, deepEqual
    //notEqual(actual: T, expected: T, message?: string) opposite of equal. aliases: notEquals, notEq, notDeepEqual
    //is(actual: T, expected: T, message ?: string) verify whether two instances are the same (basically it is Object.is) aliases: same
    //isNot(actual: T, expected: T, message ?: string) aliases: notSame
    //ok(actual: T, message?: string) verify whether a value is truthy aliases: truthy
    //notOk(actual: T, message?:string) verify whether a value is falsy aliases: falsy
    //fail(message?:string) an always failing test, usually when you want a branch of code not to be traversed
    //throws(fn: Function, expected?: string | RegExp | Function, description ?: string) expect an error to be thrown, you check the expected error by Regexp, Constructor or name
    //doesNotThrow(fn: Function, expected?: string | RegExp | Function, description ?: string) expect an error not to be thrown, you check the expected error by Regexp, Constructor or name

});


/*
 |  TEST OUTPUT
 */
harness.report(ratReporter).then(() => {
});
