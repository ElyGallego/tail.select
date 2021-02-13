rat.select - LvL-UP your select fields
======================================
[![npm Version](https://s.pytes.me/47a6bf48)](https://s.pytes.me/2a8c886a)
[![npm Downloads](https://s.pytes.me/f678004c)](https://s.pytes.me/2a8c886a)
[![Support Me](https://s.pytes.me/4a1717aa)](https://buymeacoffee.com/pytesNET)
[![plainJS](https://s.pytes.me/cb2d2d94)](https://s.pytes.me/21d65dff)
[![License](https://s.pytes.me/8257ac72)](LICENSE.md)

The vanilla JavaScript solution to **LEVEL UP** and **IMPROVE** your HTML `<select>` fields!

Create, Design, Archive awesome and feature-rich single and multiple `<select>` fields using 
the power and flexibility of **rat.select** (former known as *tail.select*). You don't need any 
additional library, JavaScript Framework or Polyfills, since this package comes with everything 
you need, optimized and adapted for IE 11, Safari and modern browsers as well.

- [Wanna see **rat.select** in action?]()
- [Wanna translate **rat.select** in your language?]()
- [Still using the former **tail.select** package? Migrate now!]()


Features
--------

- **It's Beautiful**. 12 unique themes with many colour schemes.
    - Perfectly fits Bluma, Bootstrap (2, 3, 4), Foundation and Materialize,
    - Adapts the design of Chosen, Selectize and Select2,
    - Comes up with the unqiue Select, Harx and Smep themes. 
- **It's Extensive**. You don't need any other solution.
    - Asynchronous and Searchable, capable for thousands of options.
    - Supports all native behaviours plus de-selectability and more.
    - Allows to be used as input / tag field as well (ex. for eMail forms).
- **It's Lightweight**. Just 20,4 KB minified (6,5 KB gzipped).
    - Delivered as UMD package, ES6 Module and ESNext build.
    - **NEW** Also available as WebComponent, Svelte and Vue.js plugins.
- **It's Extendable**. A feature-rich API to create all kind of plugins easily.
- **It's Configurable**. Many settings, hooks, filters and community translations.
- **It's Vanilla**. No dependencies, just include, initialize and use.
- **It's Free/To/Use**. Published under the MIT license <3


Support
-------

You can support as and the development of our rat packages...

- by translating the strings to your (native) languages
- by reporting any errors or missing features
- by contributing on the source code or the occured issues
- by spending us a coffee on [BuyMeACoffee](https://www.buymeacoff.ee/pytesNET)
- by sending us some good old money on [PayPal.me](https://www.paypal.com/paypalme/pytesNET)

Thanks for your support and the use of our package, we really appreciate that!


Install
-------

The master branch will always contain the latest updates and fixes, but may also some not-enough 
tested features or commits. Therefore it is **HIGHLY** recommended download and using the versions
released on our [GitHub Release History]().

Way easier is the use of a package manager such as NPM or Yarn (bower support has been dropped):

```
npm i @rat.md/select
```

```
yarn add @rat.md/select
```

But of course, you can also directly jump in using the awesome CDN services from jsDelivr and UNPKG.

```
[https://cdn.jsdelivr.net/npm/@rat.md/select@test]()
```

```
[https://unpkg.com/@rat.md/select@test]()
```


Package Overview
----------------

The **rat.select** library is available in the following official packages.

| Package      | Dependencies                  | Visit Branch | NPM Package           |
| ------------ | ----------------------------- |:------------:|  -------------------- |
| Vanilla UMD  | -                             | [Master]()   | @rat.md/select        |
| Vanilla ES6  | Modern Browser                | [Master]()   | @rat.md/select        |
| WebComponent | Modern Browser                | [WebC]()     | @rat.md/select.webc   |
| ESNext **\***| Latest Browser                | [ESNext]()   | @rat.md/select.esnext |
| Svelte       | [Svelte](https://svelte.dev)  | [Svelte]()   | @rat.md/select.svelte |
| Vue.js       | [Vue.js](https://vuejs.org)   | [VueJS]()    | @rat.md/select.vue    |

Packages, which are marked with **\*** are experimental and shouldn't be used productive.


Thanks To
---------

- The community for helping out, translating and improving the rat.select package.
- [Octicons]() and [Feather]() for the awesome icons
- [Rollup]() for the awesome bundler engine
- [prismJS]() for the syntax highlighting library
- [MenuSpy]() for the used menu navigation on the docs


Documentation
-------------

Check out our up-to-date documentation on [rat.md/select](https://rat.md/select/docs), which also 
includes dozens of examples, tutorials, snippets and answers. The [GitHub Docs]() are also filled 
with the latest information, and the package contains a small docs bundle as well.

However, below you will find a quick cheatsheet with all available core as well as included plugin 
options and their default values:

```javascript
/*
 |  ALL *-DEFAULT VALUES DEPENDS ON THE SOURCE SELECT FIELDs
 */
rat.select('select', {
    classNames: false,          //   boolean | string | string[]
    csvOutput: false,           //   boolean | string
    csvSeparator: ',',          //   string
    deselect: false,            //   boolean
    disabled: false,            // * boolean
    height: 350,                //   null | number | string
    hideDisabled: false,        //   boolean
    hideEmpty: true,            //   boolean
    hideHidden: true,           //   boolean
    hideSelected: false,        //   boolean
    items: nullm                //   null | array | function
    locale: 'en',               //   string
    multiple: false,            // * boolean
    multiLimit: -1,             //   number
    multiSelectAll: false,      //   boolean
    multiSelectGroup: false,    //   boolean
    on: null,                   //   null | object
    openAbove: null,            //   null | boolean
    placeholder: null,          //   null | string | function
    placeholderCount: false,    //   boolean, string, function
    plugins: {                  //   null | object
        ajax: {

        },
        columns: {

        },
        input: {

        },
        movement: {

        },
        search: {
            async: false,       //   [EXPERIMENTAL] boolean
            config: [           //   string[]
                'text', 
                'visible'
            ],
            finder: null,       //   null | function
            focus: false,       //   boolean
            linguistic: null,   //   null | object
            mark: true,         //   boolean
            minimum: 3          //   number
        }
    },
    query: null,                //   null | functon
    required: false,            // * boolean
    rtl: null,                  //   null | boolean
    sourceBind: false,          //   boolean
    sourceHide: true,           //   boolean
    startOpen: false,           //   boolean
    stayOpen: null,             //   null | boolean
    stickyGroups: true,         //   boolean
    theme: null,                //   null | string
    titleOverflow: 'break',     //   [EXPERIMENTAL] 'break' | 'clip' | 'scroll'
    ungroupedLabel: null,       //   null | string
    width: 250                  //   null | number | string
}, rat.select.Options);
```


Copyright & License
-------------------

Written by SamBrishes (sam@pytes.net), Lenivyy (lenivyy@pytes.net) and many awesome contributors.

Published under the MIT license, Copyright &copy; 2014 - 2021 pytesNET.
