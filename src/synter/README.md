SYNTER - Synders Template Extension Rebuilder
=============================================

**SYNTER** is an experimental tool helping us building up all TypeScript and Stylesheet distribution 
files, as available in the main `.dist` directory, as well as parsing the documentation pages. The 
distribution files uses the Application Programming Interfaces from SASS and TypeScript and combines 
the output with the *distribution file declarations*, defined within the main `./src/build.synt` file.

**Please Note:** This node.js script is developed for our `tail` project series only, the use 
outside of our projects is not intended!

**VISUAL STUDIO CODE - SYNTAX HIGHLIGHTER**

The `vscode/synt` folder contains a Syntax Highlighting extension for the Visual Studio Code editor. 
This highlighter is NOT available on the official Marketplace, so you need to copy and paste them 
into your extension folder on your own.


What is SYNTER?
---------------

SYNTER builds up the different JavaScript Files (including the languages and plugins) as well as 
all available Stylesheets using the file-template modules defined in `build.synt`. Next to some 
template-limited global variables, it also uses the informations provided within the `package.json` 
file, which allows an easy integration into all projects without having to adjust many details.

The current version is really limited, offering just 2 different module types as well as a bunch of 
functions and statements. Future versions may extend the environment, but at the moment, the range 
of functions is only designed for our own projects.

**Please Note** You don't have to learn / work with SYNTER if you want to help us with the `tail` 
project you currently looking at! Just visit the `./src/ts` or `./src/scss` folder. Thanks!


Understanding SYNTERs Syntax
----------------------------
The Syntax, as used in SYNTER, is in the current version neither extensive nor complex. Some parts 
may remmebers on HTML (like the attributes) other may on JINJA2 (the template engine).

### Comments
SYNTER allows you to use comments outside the module definitions. Single-Line comments can be 
achieved using the `// <Your Comment>` syntax, Multi-Line ones requires an starting `/*` als well 
as an ending `*/` comment tag.

```
// This is a single line comment

/*
   This is a multi line comment.
 */
```

### Module Definitions
**SYNTER** provides the file template structures within modules. A module MUST start with a `:` 
(without any whitespace before) followed by the module type. The current version just allows to 
use the types `:template` and `:part`. After a whitespace it is REQUIRED to define the module name
(using `a-zA-Z_-` only) followed by some additional and optional, XML / HTML -styled, attributes.
SYNTER currently knows `indent` and `indenter`.

The module definition line can also end with a syntax value, which just change the Syntax 
highlighting within the Visual Studio Code Editor (if the respective language extension is 
available) and has absolutely no effect to the SYNTER script itself. A Syntax value MUST start 
with a `@` (at-sign) followed by the language you want to use. At the moment just the `@js` and 
`@css` values are supported.

Each line of the module body MUST be prefixed with 4 spaces or a single tab. This indentation 
gets automatically removed by the node.js script. After the body, it is **REQUIRED** using the 
`:end` definition to close / wrap the body of the module.

Example:
```
:template template-name @js
    /*!
     |  This is my file wrapper.
     */
:end

:part part-name indent="4" indenter="space" @css
    @charset "UTF-8";
    /*
     |  This is a part of a template, which can be included
     |  in any template module you want!
     */
:end
```

### Variables
Using variables allows you to add some dynamic content to your module body, which SYNTER generates 
itself (such as the source code or some path / file related informations) or which are provided by 
your `package.json` file, for example. However, a variable is ALWAYS defined within a namespace, 
which MUST ALWAYS be used too with exception of the `core` namespace.

A Variable can be used in 2 different ways, depending where you want to write them. Within a
template comment, which should get parsed, your need to use the `{{ $<namespace>.<key> }}` syntax 
as shown below:

```
/*!
 |  {{ $package.name }}
 |  @copyright  Copyright (C) 2018 {{ $package.author }}
 */
```

Output:
```
/*!
 |  SYNTER
 |  @copyright  Copyright (C) 2018 pytesNET <info@pytes.net>
 */
```

Outside a template comment you need to use the `/** $<namespace>.<key> **/` Syntax. **KEEP IN MIND** 
that this statement will **NOT** quote the respective value, if you need some quotes use the 
`@quote()` function as shown below.

```
function main_/** $package.name **/() {
    console.log("Hellow World!");
}
```

Output:
```
function main_SYNTER() {
    console.log("Hellow World!");
}
```

#### core Namespace
The core namespace object contains the main and basic file data (such as the filename or the path) 
as well as the source code itself. Every key inside the core namespace can also be printed without 
using the namespace itself as prefix. For Example: Instead of using `$core.source` you can directly 
use `$source`.

-   `$path` - The path to the dist file (without the file itself)
-   `$file` - The filename with the extension
-   `$filename` - The filename without the extension
-   `$source` - The source code of the dist file
-   `$size` - The size in bytes (with " Bytes" on the end)
-   `$sizeKB` - The size in kilobytes (with " KB" on the end)
-   `$sizeMB` - The size in megabytes (with " MB" on the end)

#### data Namespace
The data namespace object points to the `package.json` and `bower.json` namespaces, but the first is 
being used preferentially. You can also explicit use the respective data inside the package.json OR 
bower.json directly, using the respective namespaces `$package.[key]` or `$bower.[key]`.

### date Namesoace
The date namespace object contains a few date output informations, as listed below. The date object 
gets re-generated everytime you call the `.render()` or `.minify()` method on your own.

-   `$date.date` - The current `{year}-{month}-{day}` date string
-   `$date.time` - The current `{hours}:{minutes}:{seconds}` time string
-   `$date.day` - The current day, with leading zero
-   `$date.month` - The current month number, with leading zero (starting with 01 for January)
-   `$date.year` - The current year number with 4 characters
-   `$date.hours` - The current number of hours, with leading zero
-   `$date.minutes` - The current number of minutes, with leading zero
-   `$date.seconds` - The current number of seconds, with leading zero

### Functions
Functions gets called on the same way as the variables above, you just need to prefix them using `@`
instead of `$`. Functions are global per default, so doesn't require any namespace and currently 
they also can't be assigned to a namespace!

```
/*!
 |  {{ @lower($package.name) }}
 |  @copyright  Copyright (C) 2018 {{ $package.author }}
 */

let __author__ = /** @quote($package.author) **/;
```

Output:
```
/*!
 |  synter
 |  @copyright  Copyright (C) 2018 pytesNET <info@pytes.net>
 */

let __author__ = "pytesNET <info@pytes.net>";
```

### Statements
Next to variables and functions you can also use statements. However, these are currently 
experimental and doesn't work very well. Statements ALWAYS requires a starting as well as an 
ending line, prefixed with `%`.


Changelog
---------

### Version 0.1.0
-   Experimental Version with support for JavaScript and CSS only
