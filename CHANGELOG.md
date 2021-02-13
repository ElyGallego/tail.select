rat.select - CHANGELOG
======================

Version 1.0.0 - Stable
----------------------
-   Info: The **tail.select** package has been refactored to **rat.select** and contains a few 
    breaking changes (based on v0.6.0-beta), view BREAKING.md for more details.
-   Info: The new **rat.select** package is now completely written in TypeScript and SCSS, using 
    Rollup as bundler engine and offering a no-longer-experimental ES6 module build as well.

### Select() class
-   Add: Labels, which are attached to the source select field focus now the rat.select instance.
-   Add: Handles the `autofocus` attribute when set on the source select field.
-   Add: The new `focus()` public method, which allows to set the focus to the rat.select field.
-   Add: The new `state()` public method, which allows to set a custom state for design purposes.
-   Add: The new `get()` public method to get the used configuration values.
-   Add: The new `set()` public method to set the desired  configuration values.
-   Add: The new `build()` internal method to generate the rat.select instance structure.
-   Add: The new `calculate()` internal method replaces the former `calc()` method.
-   Add: The new `render()` method replaces the `cbGroup()` and `cbItem()` methods.
-   Update: The event handlers are now attached to the document instead to each single option.
-   Update: ENTER & SPACE keys can now also be used to toggle an option.
-   Update: The dropdown fields doesn't close, when an option is selected with ENTER or SPACE.
-   Update: The `.open()`, `.close()` and `.toggle()` methods doesn't allow any parameter anymore.
-   Update: The `.trigger()` method is now the main API handler.
-   Update: The plain Select constructor requires a single HTMLSelectElement now.
-   Update: The plain Select constructor allows now to pass a custom `Options` class.
-   Update: The `.on()` method doesn't allow to pass own arguments (third parameter) anymore.
-   Update: The `remove()` method allows now to keep added options using `true` as first parameter.
-   Update: The `reload()` method allows now to use the hard reload using `true` as first parameter.
-   Update: The `.value()` method allows now a first parameter, which controls the returning value 
    and the respective format (Available: 'auto', 'csv', 'array' and 'nodes').
-   Remove: The jQuery and MooTools bidnings has been removed completely.
-   Remove: The `multiPinSelected` and `multiContainer` options and it's functionallity has been 
    outsourced to a plugin.
-   Remove: The options `multiShowCount` and `multiShowLimit` has been replaced with the new 
    `placeholderCount` option.
-   Remove: The options `cbComplete`, `cbEmpty`, `cbLoopItem` and `cbLoopGroup` has been replaced 
    with the new `on` method and option.
-   Remove: The `.callback()` method has been removed, `.update()` does the job now.
-   Remove: The `.cbGroup()` and `.cbItem()` method has been replaced with `.render()`.
-   Remove: The `.updateContainer()` and `.updatePin()` methods has been removed completely.
-   Remove: The helper methods `_e()` and `_cls()` has been removed completely. 
-   Remove: All helper methods has been removed, instead it adds 2 polyfills on the ES5 version.

#### Select Options
-   Add: The new `hideEmpty` option to skip empty-valued `<option>` elements.
-   Add: The new `hideHidden` option to hide  `<option hidden>` elements.
-   Add: The new `on` option to attach event, filter and hook listeners directly.
-   Add: The new `placeholderCount` option to add a counter element to the label structure.
-   Add: The new `plugins` option to init and use additional features on the rat.select instances.
-   Add: The new `rtl` option to change the read direction to right-to-left.
-   Add: The new `stickyGroups` option to use `sticky` position on the optgroup labels.
-   Add: The new `theme` option to set a theme and colour scheme.
-   Add: The new `titleOverflow` option to scroll too long titles on mouseover.
-   Add: The new `ungroupedLabel` option to add a group label for ungrouped `<option>` elements.
-   Update: The `csvOutput` option can now also contain a string, which is used as name of the 
    hidden `<input />` field instead of `true` to take over the source `<select>` name.
-   Update: The `height` option can now also be a string with a unit type of your choice or a new 
    syntax starting with a colon and the number of optons to show (example: `:15`).
-   Update: The `items` option now allows now 2 object formats to pass custom options.
-   Update: The `width` option has now a new default value `250`.
-   Update: The `width` and `height` options doesn't get regular-expressed anymore.
-   Update: The option `placeholder` can now also be a callable function.
-   Remove: The `animate` option has been removed completely. You can use the `no-animation` class
    name additionally to remove the dropdown animations.
-   Remove: The `descriptions` option has been removed completely, descriptions are now always 
    shown if a `data-description` attribute is available.
-   Remove: All `cb*` callback options has been replaced with the new `on` option and method.
-   Remove: All search related options, including `linguisticRules` has been merged out to a plugin.
-   Remove: The `sortItems` and `sortGroups` options has been replaced with `query`.
-   Remove: The default option initialization has been removed.
-   Remove: The json-attribute configuration as been removed (it was a unofficial feature anyway.)

### Options() class
-	Add: The new `create()` method allows to easily create new and valid `<option>`s.
-   Add: The new `getGroups()` method returns all `<optgroup>`s nodes or labels.
-   Add: The new `count()` method allows to count the available `<option>`s.
-   Add: The new `parse()` method to parse a basic or advanced items object.
-   Add: The new alias methods are now `selected()`, `disabled()` and  `hidden()`.
-   Update: The new `Options` class doesn't store the `<option>`s and `<optgroup>`s elements anymore.
-   Update: The new `Options` Constructor requires now only the **rat.select** instance.
-   Update: The new `Options` Constructor prepares the deselectability if enabled.
-   Update: The new `Options` Constructor prepares the missing value attribute on all `<option>`.
-   Update: The `get()` method has been completely rewritten.
-   Update: The `set()` method has been completely rewritten.
-   Update: The `handle()` method has been completely rewritten.
-   Remove: The `add()` method has been removed, use `parse()` or `set()` instead.
-   Remove: The `walker()` and `finder()` methods has been removed.
-   Remove: The `._r()` helper method has been removed completely. Just don't do typos ;)
-   Remove: The `.move()` handler method has been removed completely.
-   Remove: The `.remove()` handler method has been removed completely.
-   Remove: The `.is()` handler method has been removed completely.
-   Remove: The `.all()`, `.walk()` and `.invert()` methods has been removed. Use the default option 
    handler methods instead, since they walk also through multiple `<option>`s at once.
-   Remove: The `.invert()` method has been removed, use `.toggle()` instead.

### Strings
-   Add: The new Farsi Translation for Persians.
    - Thanks to [#115](https://github.com/pytesNET/tail.select/pull/115).
-   Add: The new Georgian Translation.
    - Thanks to [#122](https://github.com/pytesNET/tail.select/issues/122).
-   Add: The new Lithuanian Translation.
    - Thanks to [#124](https://github.com/pytesNET/tail.select/issues/124).
-   Add: The new Persian Translation for Iran.
    - Thanks to [#129](https://github.com/pytesNET/tail.select/issues/129).
-   Add: The new Arabic Translation.
    - Thanks to [#147](https://github.com/pytesNET/tail.select/pull/147).
-   Add: The new Greek Translation.
    - Thanks to [#151](https://github.com/pytesNET/tail.select/pull/151).
-   Add: The new Swedish Translation.
    - Thanks to [#153](https://github.com/pytesNET/tail.select/pull/153).
-   Add: The new Polish Translation.
    - Thanks to [#162](https://github.com/pytesNET/tail.select/issues/162).
-   Add: The `Strings` class has been reduced to a single method for translating strings.

### Plugins
-   Info: The previously native search abilities has been moved to an own plugin.
-   Add: A new approved Plugin API.
-   Add: The new `ajax` plugin adds an asynchronous interface for loading options and items.
-   Add: The new `columns` plugin extends the dropdown field in collaps-able groups (side-by-side).
-   Add: The new `input` plugin turns the **rat.select** label element into an input field.
-   Add: The new `movement` plugin allows to handle selected options in a moveable manor.
-   Add: The new `search` plugin now contains the whole search-related functionallity.

### Themes
-   Info: Switched from Less to SASS (SCSS Syntax).
-   Info: All available schemes of a theme are now included in a single stylesheet.
-   Add: The new theme `theme-chosen`, with the scheme `scheme-default`.
-   Add: The new theme `theme-selectize`, with the schemes `scheme-default` and `scheme-legacy`.
-   Add: A new CSS setting / property for the auto-initialization of the used / included theme.
-   Add: The themes completely take-over the open / close animation.
-   Add: The custom additional class name `no-animation` to disable the dropdown animation.
-   Add: The `.title-break`, `.title-clip` and `.title-scroll` classes.
-   Add: The new Functions `@replace()` and `@encode()` for string operations.
-   Add: The new Functions `@fadein()` and `@fadeout()` for an easier Adaption of the alpha channel.
-   Add: The new Mixin `@worb()` to use white or black color depending on the lightness. 
-   Add: The new Mixins `@animation()` and `@prefix()` to prefix CSS properties.
-   Add: The new additional class names `form-control`, `form-control-sm` and `form-control-lg` for
    the re-designed Bootstrap-4 design.
-   Update: Many other small and particular changes on all available themes.
-   Update: The dropdown item icon is now always in the vertical middle.
-   Update: Better Design for Selected AND Disabled / Hidden items.
-   Update: More accurate replica of all available bootstrap designs.
-   Remove: Unnecessary Prefixes on `box-shadow` and `transition` including its Mixins.

### Bugfixes
-   Bugfix: ClassNames have been taken over if the **rat.select** selector points to more then one 
    `<select>` field.
-   Bugfix: The `multiSelectAll` option has also been used, where `multiSelectGroup` should be used.
-   Bugfix: The `.query()` method was triggered every time even if `searchMinLength` wasn't reached.
-   Bugfix: Invalid replacement by `Options.applyLinguisticRules()` when no rules where defined.
-   Bugfix: The empty message didn't show up, when only hidden options (`hideDisabled`, 
    `hideSelected`) are available.
-   Bugfix: The group items in the dropdown list gets rendered even if no visible item are available.
-   Bugfix: The ES5 walker variables hasn't been reseted, if the loop has been breaked before.
-   Bugfix: The dropdown scrollbar is longer then the dropdown container (Windows).
-   Bugfix: IE doesn't recognize `Object.constructor()` as object (instead as function).
    - Thanks to [#92](https://github.com/pytesNET/tail.select/issues/92).
-   Bugfix: Deselect options on `None` button if no searched option is selected.
    - Thanks to [#117](https://github.com/pytesNET/tail.select/issues/117).
-   Bugfix: Keep the dropdown field open when clicking on a disabled option.


Version 0.6.0 - Beta
--------------------

-   Info: This release has been skipped due to too many changes during the development and building
    process and the huge amount of time, which has already been invested into it. However, many 
    features and ideas has become a part of version 1.0.0 though.


Version 0.5.15 - Beta
---------------------
-   Update: Support for `hidden` options (didn't get queried).
    - Thanks to [#67](https://github.com/pytesNET/tail.select/issues/67).
-   Update: Differentiate .disabled and .hover colors.
    - Thanks to [#79](https://github.com/pytesNET/tail.select/issues/79),
    - Thanks to [#81](https://github.com/pytesNET/tail.select/pull/81) (Pull Request).
-   Bugfix: Typo in `searchConfig` option key.
-   Bugfix: Using `this.rebuild` instead of `rebuild` in the `.config()` method.
-   Bugfix: Using the olf method `._replaceTypo` on the `.invert()` method (options class).
-   Bugfix: The `.query()` method doesn't handle false as item return [ES6 only].
-   Bugfix: Missing minified JavaScript files.
    - Thanks to [#77](https://github.com/pytesNET/tail.select/issues/77).
-   Bugfix: Some Less styling issues.
    - Thanks to [#74](https://github.com/pytesNET/tail.select/issues/74),
    - Thanks to [#78](https://github.com/pytesNET/tail.select/issues/78),
    - Thanks to [#75](https://github.com/pytesNET/tail.select/pull/75) (Pull Request).
-   Bugfix: Bootstrap 4 Theme Icon Issue in Chrome.
    - Thanks to [#82](https://github.com/pytesNET/tail.select/issues/82).


Version 0.5.14 - Beta
---------------------
-   Hotfix: Unable to select options with apostrophes.
    - Thanks to [#53](https://github.com/pytesNET/tail.select/issues/53),
    - Thanks to [#55](https://github.com/pytesNET/tail.select/pull/55) (Pull Request).


Version 0.5.13 - Beta
---------------------
-   Add: The new public method `.value()` to get the current selected option value(s).
-   Add: Allow to change the minimum search length with the new `searchMinLength` option.
    - Thanks to [#60](https://github.com/pytesNET/tail.select/pull/60).
-   Add: A new public `.applyLinguisticRules()` method on the options class.
    - Thanks to [#63](https://github.com/pytesNET/tail.select/pull/63).
-   Update: A new search function, configurable with `searchConfig`.
    - Thanks to [#63](https://github.com/pytesNET/tail.select/pull/63).
-   Update: Using window on the main factory function (required for Webpack / VueJS).
-   Update: The internal helper methods `cHAS()`, `cADD()` and `cREM()`.
-   Bugfix: The helper method `clone()` use an IE-unsupported function called `Object.assign`.
-   Update: The translations `actionAll` and `actionNone` has been removed completely.
-   Update: Select the latest added option on single select fields.
-   Bugfix: The `.scrollBy()` function isn't available in IE10+.
    - Thanks to [#56](https://github.com/pytesNET/tail.select/issues/56).
-   Bugfix: Up-Arrow doesn't work when last option is disabled.
    - Thanks to [#66](https://github.com/pytesNET/tail.select/issues/66).
-   Bugfix: Adding a selected option doesn't work.
    - Thanks to [#52](https://github.com/pytesNET/tail.select/issues/52),
    - Thanks to [#65](https://github.com/pytesNET/tail.select/issues/65),
    - Thanks to [#64](https://github.com/pytesNET/tail.select/pull/64) (Pull Request).
-   Bugfix: Escaping bad characters for search RegExp.
    - Thanks to [#53](https://github.com/pytesNET/tail.select/issues/53),
    - Thanks to [#59](https://github.com/pytesNET/tail.select/issues/59),
    - Thanks to [#61](https://github.com/pytesNET/tail.select/issues/61),
    - Thanks to [#63](https://github.com/pytesNET/tail.select/pull/63) (Pull Request).

### Less / CSS Changes
-   Add: A new node.js script to compile the Less files.
-   Add: Minified Stylesheets and Source Maps (for both types).
-   Update: The complete Less stylesheet structure.
-   Update: A few design changes on all designs.
-   Update: Each single CSS color scheme contains now the complete styles instead of "imports".
-   Update: The `dropdown-actions` container has been moved over the search field.
-   Update: The `All` and `None` buttons are only visible on hover of the respective optgroup.
-   Update: Change the color of selected items.
-   Update: Bootstrap* - Change table-structured label into `display: inline-block;`s.
-   Update: Bootstrap2 - The new `funky` (Pink) and `mystery` (Purple) bootstrap2 color schemes.
-   Update: Bootstrap3 - Line-Through on disabled options.
-   Update: Bootstrap4 - The new `default` (White) and the moved `secondary` (Grey) schemes.
-   Update: Bootstrap4 - The new color schemes `funky`. `myster`, `indigo`, `teal` and `orange`.
-   Remove: All obsolete (not required) `-o-` and `-moz-` vendor-prefixed CSS properties.
-   Bugfix: Flickering outline on focus (Google Chrome).
    - Thanks to [#51](https://github.com/pytesNET/tail.select/issues/51).
-   Bugfix: Too long values destroy label.
    - Thanks to [#51](https://github.com/pytesNET/tail.select/issues/51).
-   Bugfix: Enabled user selection on the select elements.
    - Thanks to [#51](https://github.com/pytesNET/tail.select/issues/51).


Version 0.5.12 - Beta
---------------------
-   Info: This is the first version, which drops IE 9 support!
-   Add: Support for module exporting, tested with browserify.
-   Add: New german linguistic rules for `ä`, `ö`, `ü` and `ß`.
-   Add: The new `browser` package variable pointing to `js/tail.select-full.js`.
-   Update: Using `classList` to add / remove / check class names.
-   Update: Using `Object.assign` only to merge / clone object properties.
-   Rename: The internal `tailSelect` variable has been renamed into `select`.
-   Rename: The internal `tailOptions` variable has been renamed into `options`.
-   Remove: Support for Internet Explorer 9.
-   Bugfix: Add correct file to the `main` bower variable.
-   Bugfix: Add correct file to the `jsdelivr` package variable.

### Changes in ES6 Version
-   Add: Missing `searchDisabled` default option within the storage.
-   Update: Use internal `select` (former `tailSelect`) variable as constant.
-   Update: Use internal `options` (former `tailOptions`) variable as constant.
-   Update: Use global `w` and `d` variables as constants.


Version 0.5.11 - Beta
---------------------
-   Add: The new Turkish Translation.
    - Thanks to [#48](https://github.com/pytesNET/tail.select/issues/48).
-   Add: Support for `tabindex` (using Tab to move from input field to input field).
    - Thanks to [#47](https://github.com/pytesNET/tail.select/issues/47).
-   Add: Key-Support for Space to open the current focused select field.
-   Bugfix: Replace classnames with an Space to prevent missing space between class names.


Version 0.5.10 - Beta
---------------------
-   Add: The new Italian Translation.
    - Thanks to [#43](https://github.com/pytesNET/tail.select/issues/43).
-   Add: The new Norwegish Translation.
    - Thanks to [#45](https://github.com/pytesNET/tail.select/issues/45).


Version 0.5.9 - Beta
--------------------
-   Add: The new Spanish Translation.
    - Thanks to [#41](https://github.com/pytesNET/tail.select/issues/41).
-   Add: The new experimental `linguisticRules` options, which allows to regex letters, which are
    (used) similiar. 
    - Thanks to ([#42](https://github.com/pytesNET/tail.select/issues/42)).
-   Update: **ES6** Changed the last `var` variables into `let`.


Version 0.5.8 - Beta
--------------------
-   Add: The new Russian Translation.
    - Thanks to [#38](https://github.com/pytesNET/tail.select/issues/38).
-   Add: Allow callback functions as strings to allow a deeper translation.
-   Add: The new internal method `_e`, which handles the translations.
-   Bugfix: Invalid `bower.json` file.


Version 0.5.7 - Beta
--------------------
-   Info: It isn't longer possible to get an option using the internal option number!
-   Add: The new Finnish Translation.
    - Thanks to [#35](https://github.com/pytesNET/tail.select/pull/35).
-   Remove: The internal-Array storage has been completely removed.
-   Bugfix: The `.remove()` method on the options hasn't worked on the internal-Array storage.
-   Bugfix: The ECMAScript 6 Version returns an Array, while the default version does not.
-   Bugfix: TypeError: Cannot convert undefined or null to object.
    - Thanks To [#32](https://github.com/pytesNET/tail.select/issues/32).
-   Bugfix: Remove default options sorting.
    - Thanks To [#37](https://github.com/pytesNET/tail.select/issues/37).


Version 0.5.6 - Beta
--------------------
-   Add: The new Brazilian Portuguese Translation.
    - Thanks to [#34](https://github.com/pytesNET/tail.select/pull/34).
-   Update: the `bower.json` and `package.json` files
-   Update: Add 2019 to all Copyright notes.


Version 0.5.5 - Beta
--------------------
-   Add: The new `searchDisabled` option, which allows to exclude disabled options on the search.
-   Update: The `.finder()` method depends now on the `.find()` method.
-   Bugfix: Wrong Version Number on the main object.
-   Bugfix: Options floats over the dropdown field.
    - Thanks to [#28](https://github.com/pytesNET/tail.select/issues/28).
-   Bugfix: Terrible performance of search when descriptions included.
    - Thanks to [#27](https://github.com/pytesNET/tail.select/issues/27).
-   Bugfix: Search functionality hangs exponentially when regular expression matches against larger 
    source options.
    - Thanks to [#25](https://github.com/pytesNET/tail.select/issues/24).


Version 0.5.4 - Beta
--------------------
-   Add: The new `modify()` method on the string Storage to change the strings globally.
    - Thanks to [#20](https://github.com/pytesNET/tail.select/issues/20).
-   Update: The `.register()` method checks now if locale is a string and object a object.
-   Update: The `.register()` method returns now `true` on success and `false` on failure.
-   Bugfix: **ES6** The "Select All" Button doesn't work on Search (All options gets selected).
-   Bugfix: Z-Index CSS Styling bug (:hover).
    - Thanks to: [#19](https://github.com/pytesNET/tail.select/issues/19).
-   Bugfix: Unnecessary Scrollbar (during a wrong calculation of the dropdown field).
    - Thanks to: [#19](https://github.com/pytesNET/tail.select/issues/19).
-   Bugfix: "Select All" Button selects more items as shown on search results.
    - Thanks to [#21](https://github.com/pytesNET/tail.select/issues/21).
-   Bugfix: Search functionality breaks when source select's options contain hyphenated attributes.
    - Thanks to [#23](https://github.com/pytesNET/tail.select/pull/23).


Version 0.5.3 - Beta
--------------------
-   Add: The new `.walk()` method on the tailOptions class to "loop" multiple items.
-   Add: The new internal variable `_query` for the current query.
-   Update: Changed the RegExp `\b`, because it isn't accurate enough.
-   Update: The complete `sourceBind` listener function has been renewed / fixed.
-   Update: The `.enable()` and `.disable()` methods allows now a single parameter, which controls
    the new rendering if the respective DOM Elements.
-   Update: Support also [{ key: <>, [...] }] array objects.
-   Remove: Unused variable `_pos`.
-   Bugfix: The "(Un)Select All" buttons were not limited to the current query!
-   Bugfix: The `.en/disable()` methods doesn't sets the configuration correctly.
-   Bugfix: The `description` property on the `items` option is required.
    - Thanks to [#15](https://github.com/pytesNET/tail.select/issues/15).
-   Bugfix: Only the last item gets unchecked after pressing "Unselect All" on specific conditions.
    - Thanks to [#16](https://github.com/pytesNET/tail.select/issues/16).
-   Bugfix: When the `sourceBind` option is `true`, the dropdown becomes unusable.
    - Thanks to [#17](https://github.com/pytesNET/tail.select/issues/17).
-   Bugfix: Throws `TypeError` on "(Un)Select All" buttons on Search Queries.
    - Thanks to [#18](https://github.com/pytesNET/tail.select/issues/18).
-   Bugfix: Wrong `.en/disable()` and `.config(disabled, true|false)` order.
    - Thanks to [#12](https://github.com/pytesNET/tail.select/issues/12#issuecomment-442318722).


Version 0.5.2 - Beta
--------------------
-   Hotfix: Trigger hasn't triggered on each call!


Version 0.5.1 - Beta
--------------------
-   Hotfix: Wrong If-Condition for `sourceHide`.
-   Hotfix: Wrong attribute assignment on the tail.select field for `sourceHide`.


Version 0.5.0 - Beta
--------------------
-   Info: The ES6 Edition is just a "REALLY experimental" version.
-   Info: The Priority has changed: Defined Settings > Element Attributes.
-   Add: The new French Translation.
    - Thanks to [#11](https://github.com/pytesNET/tail.select/issues/11).
-   Add: The origin select fields gets now also triggered on any `change` / `input` event.
    - Thanks to [#10](https://github.com/pytesNET/tail.select/issues/10).
-   Add: Three new designs "Bootstrap2", "Bootstrap3" and "Bootstrap4" (+ Multiple Color Schemes).
-   Add: A IE incompatible, highly modern ECMAScript 2015 (6) edition (as \*-es6.js).
-   Add: The new script version `tail.select-full(.min).js`, which contains also all language strings.
-   Add: The new additional file `langs/tail.select-all(.min).js` which contains all language strings.
-   Add: Key Listener: Use the Arrow Keys (Down, Up) to scroll through the opened dropdown list.
-   Add: Key Listener: Use the Enter / Return Key to "click" on the focused option.
-   Add: Key Listener: Use the Escape Key to close the dropdown list.
-   Add: The new helper method `create()`.
-   Add: The new option `locale`, to change the shown language strings.
-   Add: The new option `disabled`, which disables the complete tail.select instance.
-   Add: The new option `multiShowLimit`, which shows the max. number of selectable options.
-   Add: The new option `sourceBind` and `sourceHide` replaces the deprecated methods
    `bindSourceSelect` and `hideSelect` respectively.
-   Add: The new callback option `cbComplete`, which fires when the tail.select instance
    has been completely rendered.
-   Add: The new option `multiPinSelected`, which "pins" selected options to the top of the
    dropdown list.
-   Add: The new public methods `enable()` and `disable()` to en/dis -able the complete field.
    - Thanks to [#12](https://github.com/pytesNET/tail.select/issues/12).
-   Add: The new tailOptions methods `.select()`, `.unselect()`, `.enable()` and `.disable()`.
-   Add: The new tailOptions methods `.toggle()`, `.invert()` and `.all()`.
-   Add: The new tailOptions methods `.move()` to change the optgroup of an option.
-   Update: The helper methods.
-   Update: The `sourceBind` event listener has been optimized and renewed.
-   Update: The `tailOptions` class is now an ArrayLike object.
-   Update: The settings are higher ranked then the select attributes.
-   Update: Switched from SASS (SCSS) to LESS.
-   Update: Language Files and Locale / Translation System.
-   Update: The new language files are now compatible with AMD.
-   Update: Many design changes on the default and modern theme.
-   Update: Some Changes on the main RegExp on the search function.
    - Thanks to [You've been Haacked](https://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx).
-   Update: The tail.select container will be inserted AFTER the source select field.
-   Update: Check the source select field stylings.
-   Update: A new animation flow, using `setTimeout()`.
-   Update: The `bind()` method binds global events only and gets called by the constructor.
-   Update: The internal `_replaceTypo` method has been renamed into `_r`.
-   Update: The internal `build()` method has been replaced by the API method `query()`.
-   Update: Remove the `name` attribute on the source select field when using `csvOutput`.
-   Update: The option `width` now also supports other length units next to "px".
-   Update: The option `multiContainer` allows now also "true" as value, to move selected
    options to the label element of the respective tail.select instance.
-   Update: The main callback function `cbLoopItem` can now also return `null` to skip the item
    and false to "skip / escape" the complete render Loop.
-   Update: The public method `.config()` allows now an object as first parameter to set
    multiple settings at once.
-   Update: The public method `.config()` allows now a third parameter, which prevents the
    rebuilding of the selection field, if you change any option.
-   Update: The `update*()` API methods replaces all `set*()` API methods.
-   Remove: The `tail.animate()` helper function.
-   Remove: The `bindSourceSelect` and `hideSelect` options has been replaced.
-   Remove: The `.walk()` method has been removed (use `walker()` instead).
-   Remove: The `.build()` method has been removed (use `query()` instead).
-   Remove: The `.choose()` method has been removed (use the tail options API instead).
-   Bugfix: The `placeholder` attribute is used with `.getAttribute()`, because its invalid HTML 5.
-   Bugfix: The custom group sorting hasn't worked due to an faulty statement.
-   Bugfix: The HTML option structure was invalid (`ul ul li` instead of `ul li ul li`).
-   Bugfix: The hidden csvInput field functions didn't work on specific cases.
-   Bugfix: The `clone` helper function didn't worked on the IE 9+ browsers.
-   Bugfix: Tags duplicated when preselected.
    - Thanks to [#14](https://github.com/pytesNET/tail.select/issues/14).
-   Bugfix: Non-Source Options gets duplicated.
    - Thanks to [#13](https://github.com/pytesNET/tail.select/issues/13).
-   Bugfix: The hidden csvInput field is rendered, even if the option is disabled
    - Thanks to [#12](https://github.com/pytesNET/tail.select/issues/12).
-   Bugfix: The instance ignores the disabled attribute on the main source element.
    - Thanks to [#12](https://github.com/pytesNET/tail.select/issues/12).
-   Bugfix: Check the visibility of the source select field.
    - Thanks to [#10](https://github.com/pytesNET/tail.select/issues/10).


Version 0.4.2 - Beta
--------------------
-   Bugfix: Search problem.
    - Thanks to [#8](https://github.com/pytesNET/tail.select/issues/8).


Version 0.4.1 - Beta
--------------------
-   Add: The new design `modern-white` as additional stylesheet `tail.select-modern-white.css`.
-   Add: The `.scss` preprocessor stylesheet(-ing) (I'm new at pre-processing, and I'm not sure
    if i'm using it right :/).
-   Update: Many design changed and optimizations.
-   Bugfix: Ignoring `selected` attribute.
    - Thanks to [#6](https://github.com/pytesNET/tail.select/issues/6).


Version 0.4.0 - Beta
--------------------
-   Info: First Beta Version
-   Add: A custom event listener which allows more details / arguments.
-   Add: The new `on()` method to use the new custom event listener.
-   Add: The new `config()` method to get and set configurations after init.
-   Add: The new `setCSVInput()` method to handle the CSV Input field.
-   Add: The new internal `trigger()` method which handles the events.
-   Add: The new default `createGroup()` and `createItem()` callback methods.
-   Add: The new `cbLoopItem` and `cbLoopGroup` options, which allows to use a custom callback
    function for the creation of options and groups within the dropdown list.
-   Add: The new `multiSelectAll` and `multiSelectGroup` options, which allows to (un)select all
    options or all options within a group!
-   Add: The new `walker()` function which replaces `walk()`.
-   Add: The additional class name `in-search` on search-results.
-   Update: The jQuery and MooTools Bindings.
-   Update: The `init()` method on `tailOptions` uses now also `set()`.
-   Update: The `reload()` method uses the same instance instead of creating a new one.
-   Update: The `open()`, `close()` and `toggle()` method accepts now one parameter, which disables
    the animation (if turned on).
-   Update: The Group will also be shown on search-results.
-   Update: New strings including a new string-key structure (+ updated translations).
-   Update: Assign HTML String method instead of Single Element Creation on `init()`.
-   Update: The default option for `height` has been changed to 350 (px) according to the new
    `maxHeight` JS-based setup (replaces the CSS setup).
-   Update: The sort callback on the `walker()` method is now called directly instead as
    callback within the `sort()` function.
-   Update: The CSS design has been modified and adapted to the new features.
-   Codacy: Expected '!==' and instead saw '!='. (eqeqeq).
-   Codacy: Avoid assignments in operands. (At least on if).
-   Codacy: 'tailOptions' was used before it was defined. (no-use-before-define).
-   Codacy: 'i' is already defined. (no-redeclare)
-   Rename: The internval variable `tailSelect.instances` has been renamed into `tailSelect.inst`.
-   Bugfix: Displaying of tail.select out of viewport
    - Thanks to [#4](https://github.com/pytesNET/tail.select/issues/4).
-   Bugfix: The `items` option object doesn't added a option description.
-   Bugfix: Don't close the dropdown list, when playing with the `multiContainer` element.
-   Bugfix: Already selected items can be selected again.
-   Bugfix: Load Items into the `multiContainer` and `csvInput` field on soft reloads.
-   Deprecated: The `walk()` function has been marked as deprecated and gets removed in the future.


Version 0.3.6 - Alpha
---------------------
-   Hotfix: Mismatching / Faulty Search Regex on different HTML conditions.


Version 0.3.5 - Alpha
---------------------
-   Update: Change for loop expression.
-   Codacy: 'ev' is already defined. (no-redeclare).
-   Codacy: 'ev' used outside of binding context. (block-scoped-var).
-   Bugfix: Constructor Instance check.
-   Bugfix: Wrong Version Number.
-   Hotfix: Searching when data-description containes > char
    - Thanks to [#2](https://github.com/pytesNET/tail.select/issues/2).


Version 0.3.4 - Alpha
---------------------
-   Info: I don't understand why some JS window/DOM-depended libraries exports their library to
    nodeJS using `module.exports`, so I'll just offer AMD only for the moment!
-   Add: The options `csvOutput` and `csvSeparator` as well as a hidden CSV input method.
-   Add: Support as Asynchronous Module Definition, tested with requireJS (I'm new with AMD).
-   Update: The `animate` option is now set to `true` per default!
-   Update: Correct use of the labels / placeholders.
-   Update: The string-keys (+ the german translation).
-   Bugfix: Escape RegExp Characters in Search string.


Version 0.3.3 - Alpha
---------------------
-   Hotfix: Nothing can be selected anymore when using the search function
    - Thanks to [#1](https://github.com/pytesNET/tail.select/issues/1).


Version 0.3.2 - Alpha
---------------------
-   Add: jQuery bindings, tested with jQuery v.1.12.4 only!
-   Add: MooTools bindings, text with MooTools 1.5.2 only!
-   Update: The helper method `animate()` is now backward compatible with IE >= 9.
-   Update: Add `Object.assign` check directly to the `clone()` method.
-   Codacy: Avoid assignments in operands.
-   Codacy: Use ===/!== to compare with true/false or Numbers.
-   Codacy: Always provide a base when using parseInt() functions.
-   Codacy: Unsafe assignment to innerHTML.
-   Codacy: Move the invocation into the parens that contain the function.
-   Bugfix: Wrong key assignment on the helper method `clone()`.
-   Bugfix: The `searchFocus` option doesn't work on animated dropdown elements!
-   Bugfix: Wrong return variable on the mein IIFE function wrapper.


Version 0.3.1 - Alpha
---------------------
-   Info: Official support for IE >= 9 starts now :(
-   Add: New `clone()` helper function as Fallback for IE >= 9.
-   Add: New `.IE` helper variable for Fallback use for IE >= 9.
-   Bugfix: Almost complete IE >= 9 support, except the `animate` option.


Version 0.3.0 - Alpha
---------------------
-   Info: The complete script has been re-written from scratch and doesn't depend on jQuery anymore!
-   Info: The default design uses vectors from GitHubs [Octicons](https://octicons.github.com/).
-   Info: The minified version is compressed with [jsCompress](https://jscompress.com/).
-   Add: A search function / field within the dropdown area, which is partly still in a test phase.
-   Add: A complete new interface and a complete new design (including a new demonstration).
-   Add: The tail helper methods: `hasClass()`, `addClass()`, `removeClass()`, `trigger()` and
    `animate()`.
-   Add: The `tailSelect` prototype class handles all tail.select elements and the communication
    between the user and the elements as well as between the `tailOptions` class.
-   Add: The `tailOptions` prototyping class, which manages the original options and items. This new
    class is only responsible for the main item object collections as well as the original select 
    field. The tail.select elements are handled by the main `tailSelect` class only!
-   Add: A `search`, `searchFocus` and `searchMarked` option to configure the new search feature.
-   Add: The new `bindSourceSelect` option, which allows to still use the source select field.
-   Add: The new `hideSelect` option to hide the source select field.
-   Add: The new `stayOpen` and `startOpen` option to manipulate the dropdown field.
-   Add: The new `items` option to add some additional options during the initialization, the new
    structure allows you to add and remove options also during the runtime. Use therefore the 
    methods of the `tailOptions` prototype class.
-   Add: The new `sortItems` and `sortGroups` options, to sort the order of the options and the
    option groups in the dropdown field.
-   Add: The new `animate` and `openAbove` methods to control the dropdown behavior.
-   Add: The new strings `searchField`, `searchEmpty`, and`selectLimit` has been added.
-   Add: A german locale file.
-   Update: The events has been changed into 'tail.select::open', 'tail.select::close', and
    'tail.select::{state}'
-   Update: The complete HTML / ClassNames and CSS structure has been changed.
-   Update: The `copy_class` option has been renamed into `classNames` and allows now also a
    string as well as an array parameter. (You can still use `true` to copy the class names from the 
    source select field.)
-   Update: The `single_deselect` option has been renamed into `deselect`, the behavior is the same.
-   Update: The `multi_limit` option has been renamed into `multiLimit` and requires now `-1` as
    parameter to enable the "unlimited" selection option (-1 is the default option!).
-   Update: The `multi_show_count` option has been renamed into `multiShowCount`, the behavior is
    the same.
-   Update: The `multi_move_to` option has been renamed into `multiContainer` and does now ONLY
    offer the possibility to "move" the selected options (in the form of handles) into the (with an 
    plain selector linked) container. The possibility to "move" selected options to the top of the 
    dropdown list has been removed!
-   Update: The `multi_hide_selected` option has been renamed into `hideSelected` and doesn't
    require a multiple select field anymore, the rest of the behavior is the same.
-   Update: The `description` option has been renamed into `descriptions`, the behavior is the same.
-   Update: The `hide_disabled` option has been renamed into `hideDisabled`, the behavior is almost
    the same, except that `hideDisabled` and `hideSelected` just add a new CSS class name to the 
    main tail.select element.
-   Update: The `width` option keeps his name, but allows now 'auto' (to calculate the width from
    the source select element) and `null`, to set no width at all (default).
-   Update: The `height` option keeps his name, but allows now also `null` to set no maxHeight at
    all (which is also the default, it's may better to handle this with pure CSS).
-   Update: The string options `text_empty`, `text_limit` and `text_placeholder` has been moved
    to and own core object, which is accessible through the `tail.select.strings` variable.
-   Remove: The jQuery support has been completely removed.
-   Remove: The jQuery `mousewheel` plugin has been removed.
-   Remove: The option and functionality behind `hide_on_mobile` and `hide_on_supported` has been
    completely removed. There will be probably no substitute for this.
-   Remove: The feather icons has been replaced with the GitHub Octicons.


Version 0.2.0 - Alpha
---------------------
-   Info: Tested with and Includes now jQuery 1.4.0, 1.6.0 and 1.11.2.
-   Add: (option) Specify a width.
-   Add: (option) Auto-Disable on Mobile browsers.
-   Add: (option) Auto-Disable on Unsupported browsers.
-   Add: (option) Take class names from select fields.
-   Add: 4 other functions: reload, open, close and remove.
-   Add: Extended Class Names for each tail.Select status.
-   Add: Prevent multi-selections on single select fields.
-   Add: Open the select field ONLY if the left mouse button is pressed.
-   Update: The tail.Select design.
-   Update: The tail.Select configuration.
-   Update: The tail.Select HTML structure.
-   Update: Embeds now the complete Feather icon font.
-   Update: Feather icons are used now only via css (+ new icons are used).
-   Update:	A better and bigger demonstration (./demo/index.html).
-   Update:	Change placeholder attribute to data-placeholder.
-   Bugfix: Open above Bug.
-   Bugfix: Pull-Down / Pull-Up Switch-Icon Bug.
-   Bugfix: Faulty De-Selection on Single-Select fields with optgroup.
-   Remove: (function) "stringArray".
-   Remove: (function) "getIcon" and "switchIcon".
-   Remove: (function) Some other unused functions.
-   Remove: (option) "icons".
-   Remove: (option) "multi_hide_selected".


Version 0.1.1 - Alpha
---------------------
-   Update: Some jQuery 1.4+ Compatibility fixes.
-   Update: New render function with Compatibility to jQuery 1.4+.
-   Bugfix: Optgroup-Sorting Bug.
-   Bugfix: Few small Bugs.


Version 0.1.0 - Alpha
---------------------
-   Initial Release
