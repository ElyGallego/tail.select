rat.select - LvL-UP your select fields
======================================
[![Minfied Size](https://b.rat.md/select/~minified)](https://b.rat.md/select/+minified)
[![Version](https://b.rat.md/select/~version)](https://b.rat.md/select/+version)
[![Downloads](https://b.rat.md/select/~downloads)](https://b.rat.md/select/+downloads)
[![Support](https://b.rat.md/global/~bmac)](https://b.rat.md/global/+bmac)
[![plainJS](https://b.rat.md/select/~plainJS)](https://b.rat.md/select/+plainJS)

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


Installation
------------

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

| Package      | Dependencies                   |  NPM Package          | Visit Branch                                                  |
| ------------ | ------------------------------ | --------------------- |:-------------------------------------------------------------:|
| Vanilla UMD  | -                              | @rat.md/select        | [Master](https://github.com/pytesNET/tail.select)             |
| Vanilla ES6  | Modern Browser                 | @rat.md/select        | [Master](https://github.com/pytesNET/tail.select)             |
| WebComponent | Modern Browser                 | @rat.md/select.webc   | [WebC](https://github.com/pytesNET/rat.select/tree/webc)      |
| ESNext **\***| Latest Browser                 | @rat.md/select.esnext | [ESNext](https://github.com/pytesNET/rat.select/tree/esnext)  |
| Svelte       | [Svelte](https://svelte.dev)   | @rat.md/select.svelte | [Svelte](https://github.com/pytesNET/tail.select/tree/svelte) |
| Vue.js       | [Vue.js](https://vuejs.org) v3 | @rat.md/select.vue    | [VueJS](https://github.com/pytesNET/tail.select/tree/vuejs)   |

Packages, which are marked with **\*** are experimental and shouldn't be used productive.


Thanks To
---------

- The community for helping out, translating and improving the rat.select package.
- [Octicons](https://primer.style/octicons) and [Feather](https://feathericons.com/) for the awesome icons.
- [Rollup](https://rollupjs.org) for the awesome bundler engine.
- [Zora](https://github.com/lorenzofox3/zora) and [LinkeDOM](https://github.com/WebReflection/linkedom) for the awesome testing environment.
- [prismJS](https://prismjs.com/) for the syntax highlighting library.
- [MenuSpy](https://leocs.me/menuspy/) for the used menu navigation on the docs.


Documentation
-------------

Check out our up-to-date documentation on [rat.md/select](https://rat.md/select/docs), which also 
includes dozens of examples, tutorials, snippets and answers. The [GitHub Docs]() are also filled 
with the latest information, and the package contains a small docs bundle as well.

However, below you will find a quick cheatsheet with all available core options with their defaults.

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
    plugins: { },               //   null | object
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
