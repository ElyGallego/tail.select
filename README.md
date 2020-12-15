rat.select - LvL+ for your select fields
========================================

The vanilla JavaScript solution to **LEVEL UP** and **IMPROVE** your HTML `&lt;select&gt;` fields!

Create, Design, Archive awesome and feature-rich single and multiple `&lt;select&gt;` fields using 
the power and flexibility of **rat.select** (former known as *tail.select*). You don't need any 
additional library, JavaScript Framework or Polyfills, since this package comes with everything 
you need, optimized and adapted for IE 11, Safari and modern browsers as well.

- [Wanna see **rat.select** in action?]()
- [Wanna translate **rat.select** in your language?]()
- [Still using the former **tail.select** package? Migrate now!]()


Features
--------

- **It's Beautiful**. 12 unique themes with many colour schemes.
    - Perfectly fits Bluma, Bootstrap (2, 3, 4), Materialize, Foundation, ...
    - Adapts the design of Chosen, Selectize, Select2, ...
- **It's Extensive**. You don't need any other solution.
    - Asynchronous and Searchable, capable for thousands of options.
    - Supports all native behaviours plus de-selectability and more.
    - Allows to be used as input / tag field as well (ex. for eMail forms).
- **It's Lightweight**. Just 20,4 KB minified (6,5 KB gzipped).
    - Delivered as UMD package or ES6 Module.
    - **NEW** Also available as WebComponent, Svelte and Vue.js module.
- **It's Extendable**. A feature-rich API to create all kind of plugins.
- **It's Configurable**. Many settings, hooks, filters and community translations.
- **It's Vanilla**. No dependencies, just include, initialize and use.
- **It's Free/To/Use**. Published under the MIT license <3


Install & Embed
---------------

The master branch will always contain the latest updates and fixes, but may also some not-enough 
tested features or commits. Therefore it is **HIGHLY** recommended download and using the versions
released on our [GitHub Release History]().

Way easier is the use of a package manager such as NPM, Yarn or bower:

```
npm i @rat.md/select
```

```
yarn add @rat.md/select
```

```
bower install rat.select
```

But of course, you can also directly jump in using the awesome CDN services from jsDelivr and UNPKG.

```
[https://cdn.jsdelivr.net/npm/@rat.md/select@test]()
```

```
[https://unpkg.com/@rat.md/select@test]()
```


Thanks To
---------

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
options and their default value:

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
    titleOverflow: 'break',     //   [EXPERIMENTAL ]'break' | 'clip' | 'scroll'
    ungroupedLabel: null,       //   null | string
    width: 250                  //   null | number | string
}, rat.select.Options);
```

Copyright & License
-------------------

Written by SamBrishes (sam@pytes.net), Lenivyy (lenivyy@pytes.net) and many awesome contributors.

Published under the MIT license, Coypright &copy; 2014 - 2021 pytesNET.
