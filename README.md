tail.select - Awesome Select Fields
===================================
[![npm Version](https://s.pytes.me/47a6bf48)](https://s.pytes.me/2a8c886a)
[![npm Downloads](https://s.pytes.me/f678004c)](https://s.pytes.me/2a8c886a)
[![Support Me](https://s.pytes.me/4a1717aa)](https://buymeacoffee.com/pytesNET)
[![plainJS](https://s.pytes.me/cb2d2d94)](https://s.pytes.me/21d65dff)
[![License](https://s.pytes.me/8257ac72)](LICENSE.md)

The vanilla JavaScript solution to **LEVEL UP** and **IMPROVE** your HTML `<select>` fields!

<p align="center" style="text-align:center"><a href="https://github.pytes.net/tail.select">
<img src="https://repository-images.githubusercontent.com/150568173/1ad2ae00-a16e-11e9-9d27-4b29de95ebe6" style="width:auto;max-width:640px;" />
</a></p>

Create awesome and feature-rich single and multiple `<select>` fields using **tail.select**. You 
don't need any additional library or JavaScript framework, because this vanilla JavaScript is 
completely written without any additional dependency.

The power of **tail.select** contains a configurable search field, multi-selection tools (such as 
`All` and `None` buttons on your `<optgroup>`s), a deselectability on single `<select>` fields, 7 
really beautiful designs (including bootstrap 2, 3, 4) with many different color schemes and many 
more user-friendly functions to upgrade your websites and web applications.

----------------------------

[Wanna see **tail.select** in action?](https://github.pytes.net/tail.select)

[Wanna translate **tail.select** in your language?](https://github.com/pytesNET/tail.select/wiki/Help-Translating)

**Already using V.0.5.x? [Check out the Migration Guide!](https://github.com/pytesNET/tail.select/wiki/Help-Translating)**

Support
-------
<p align="center" atyle="text-align:center">
You really like my <b>tail.select</b> script and want to support me and all of my projects?<br/>
Then I would be extremely grateful for a coffee! (<b>Thanks to all Supporters</b>)<br/><br/>
<a href="https://www.buymeacoffee.com/pytesNET"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" title="Buy Me A Coffee" /></a>
</p>

Features
--------
-   **Beautiful**. 7 different Designs in many color schemes...
-   **Extensive**.
    -   A search field to find options quickly...
    -   All / None `<optgroup>` selection buttons...
    -   Add, Edit, Delete and Modifiy options at any time...
    -   De-selection on single select fields...
    -   ... and way more ...
-   **Extendable**. Feature-Rich API to create all kinds of plugins...
    -   with 4 already included and ready-to-use core-plugins.
-   **Configurable**. 40 settings and many bindable events...
-   **Translatable**. Already available in 10+ languages...
-   **Zero Dependencies**. Just include and use...
-   **Free/To/Use**. And also MIT Licensed <3

Install & Embed
---------------
The master branch will always contain the latest Release, which you can download directly here
as [.tar](https://github.com/pytesNET/tail.select/tarball/master) or as [.zip](https://github.com/pytesNET/tail.select/zipball/master)
archive, or just visit the [Releases](https://github.com/pytesNET/tail.select/releases) Page
on GitHub directly. You can also be cool and using npm, Yarn or bower:

```markup
npm install tail.select --save
```

```markup
yarn add tail.select --save
```

```markup
bower install tail.select --save
```

### Using a CDN
You can also use the awesome CDN services from jsDelivr or UNPKG.

```markup
https://cdn.jsdelivr.net/npm/tail.select@latest/
```

```markup
https://unpkg.com/tail.select/
```

Thanks To
---------
-   [Octicons](https://octicons.github.com/) for the cute Icons
-   [jsCompress](https://jscompress.com/) for the Compressor
-   [prismJS](https://prismjs.com) for the Syntax highlighting library
-   [MenuSpy](https://github.com/lcdsantos/menuspy) for the Menu Navigation

### Translations
-   [Anthony Rabine](https://github.com/arabine) / [French Translation](https://github.com/pytesNET/tail.select/issues/11)
-   [Igor](https://github.com/igorcm) / [Brazilian Portuguese Translation](https://github.com/pytesNET/tail.select/pull/34)
-   [Noxludio](https://github.com/noxludio) / [Finnish Translation](https://github.com/pytesNET/tail.select/pull/35)
-   [Roman Yepanchenko](https://github.com/tizis) / [Russian Translation](https://github.com/pytesNET/tail.select/issues/38)
-   [elPesecillo](https://github.com/elPesecillo) / [Spanish Translation](https://github.com/pytesNET/tail.select/issues/41)
-   [Alberto Vincenzi](https://github.com/albertovincenzi) / [Italian Translation](https://github.com/pytesNET/tail.select/issues/43)
-   [WoxVold](https://github.com/woxwold) / [Norwegian Translation](https://github.com/pytesNET/tail.select/issues/45)
-   [Spritus](https://github.com/spritus) / [Turkish Translation](https://github.com/pytesNET/tail.select/issues/48)

Documentation
-------------
The Documentation has been moved to [GitHubs Wiki Pages](https://github.com/pytesNET/tail.select/wiki),
but I will keep a table of contents list here and some basic instructions.

-   [Install & Embed](https://www.github.com/pytesNET/tail.select/wiki/instructions)
-   [Default Usage](https://www.github.com/pytesNET/tail.select/wiki/default-usage)
-   [Public Options](https://www.github.com/pytesNET/tail.select/wiki/public-options)
-   [Public Methods](https://www.github.com/pytesNET/tail.select/wiki/public-methods)
-   [Events & Callbacks](https://www.github.com/pytesNET/tail.select/wiki/events-callbacks)
-   [Internal Variables & Methods](https://www.github.com/pytesNET/tail.select/wiki/internal)
-   [HowTos, Tips & Tricks](https://www.github.com/pytesNET/tail.select/wiki/How-Tos)

### Files
The `tail.select` package contains different directories and files.

-   `js/tail.select(.min).js` The main JavaScript with `en` tranlation strings only.
-   `js/tail.select-full(.min).js` The main JavaScript with ALL available translations.
-   `js/tail.select-es6(.min).js` An **experimental** ECMAScript 2015 / ES6 Module version (includes all translations).
-   `langs/tail.select-all(.min).js` Just ALL translation strings itself.
-   `langs/tail.select-{locale}.js` Just the {locale} translation strings.

### Basic Instructions
You can pass up to 2 arguments to the **tail.select** constructor, the first parameter is required
and need to be an `Element`, a `NodeList`, a `HTMLCollection`, an Array with `Element` objects or
just a single selector as `string`, which calls the `querySelectorAll()` method on its own. The
second parameter is optional and, if set, MUST be an object with your *tail.select* options.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />

        <link type="text/css" rel="stylesheet" href="css/tail.select-default.css" />
    </head>
    <body>
        <script type="text/javascript" src="js/tail.select.min.js"></script>
        <!-- <script type="text/javascript" src="langs/tail.select-{lang}.js"></script> -->

        <select>
            <option>My Option</option>
        </select>

        <script type="text/javascript">
            document.addEventListener("DOMContentLoaded", function(){
                tail.select("select", { /* Your Options */ });
            });
        </script>
    </body>
</html>
```

### Default options
Please check out [GitHubs Wiki Pages](https://github.com/pytesNET/tail.select/wiki) to read more
about each single option!

```javascript
tail.select("select", {
    classNames: false,                  // [0.3.0]      Boolean, String, Array
    csvOutput: false,                   // [0.3.4]      Boolean, String
    csvSeparator: ',',                  // [0.3.4]      String
    descriptions: true,                 // [0.3.0]      Boolean
    deselect: false,                    // [0.3.0]      Boolean
    disabled: false,                    // [0.5.0]      Boolean
    grouplessName: null,                // [0.6.0][NEW] String, null
    height: 350,                        // [0.2.0]      Integer, String, null
    hideDisabled: false,                // [0.3.0]      Boolean
    hideEmpty: true,                    // [0.6.0][NEW] Boolean
    hideHidden: true,                   // [0.6.0][NEW] Boolean
    hideSelected: false,                // [0.3.0]      Boolean
    items: { },                         // [0.3.0]      Object, Function
    locale: 'en',                       // [0.5.0]      String
    linguisticRules: { },               // [0.5.9]      Object
    multiple: true,                     // [0.3.0]      Boolean
    multiLimit: Infinity,               // [0.3.0]      Integer, Infinity
    multiSelectAll: false,              // [0.4.0]      Boolean
    multiSelectGroup: true,             // [0.4.0]      Boolean
    on: { },                            // [0.6.0][NEW] Object
    openAbove: null,                    // [0.3.0]      Boolean, null
    placeholder: null,                  // [0.1.0]      String, Function, null
    placeholderCount: null,             // [0.6.0][NEW] String, Function, null
    plugins: { },                       // [0.6.0][NEW] Object
    rtl: null,                          // [0.6.0][NEW] Boolean, null
    search: false,                      // [0.3.0]      Boolean
    searchConfig: ['text', 'value'],    // [0.5.13]     Array, Function
    searchFocus: true,                  // [0.3.0]      Boolean
    searchMarked: true,                 // [0.3.0]      Boolean
    searchMinLength: 3,                 // [0.5.13]     Integer
    sortItems: null,                    // [0.3.0]      String, Function, null
    sortGroups: null,                   // [0.3.0]      String, Function, null
    sortSearch: null,                   // [0.6.0][NEW] String, Function, null
    sourceBind: false,                  // [0.5.0]      Boolean
    sourceHide: true,                   // [0.5.0]      Boolean
    startOpen: false,                   // [0.3.0]      Boolean
    stayOpen: false,                    // [0.3.0]      Boolean, null
    stickyGroups: false,                // [0.6.0][NEW] Boolean
    theme: null,                        // [0.6.0][NEW] String, null
    titleOverflow: 'break',             // [0.6.0][NEW] String
    width: 250,                         // [0.2.0]      Integer, String, null
});
```

Copyright & License
-------------------
Written by SamBrishes (sam@pytes.net), Lenivyy (lenivyy@pytes.net) and many awesome contributors!

Published under the MIT-License; Copyright &copy; 2014 - 2020 pytesNET
