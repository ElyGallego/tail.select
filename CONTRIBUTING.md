How to Contribute
=================

First of all, thanks for thinking about contributing to our select package and reading this file. 
Your contribution adds a real value to this library, and we really appreciate that! In order to be 
able to accept your pull request as soon as possible, please follow the following procedures.


General
-------

**TLDR**: ALL OF YOUR CHANGES SHOULD BE MADE IN THE `SRC` FOLDER.

The rat.select package is written in TypeScript and SASS (SCSS-Syntax), using node.js and related 
tools and packages - such as rollup - to build the distribution files. Unlike many other npm 
packages we keep the latest `dist` files on our GitHub repository, thus also node-unfamiliar 
developers can use them without building the latest `master` branch first.

However, even if the distribution files are available, please do NEVER edit them yourself. If you 
aren't familiar with TypeScript, consider to post your desired changes as ISSUE on the repo and we 
will take care of your code.


**TLDR**: BUNDLE BEFORE SUBMIT YOUR PULL REQUEST

But this also means, that changes on your Code must be bundled first, before your submit your Pull 
Request to our repository. Just enter `npm run build` or `npm run docs:build` will fully meet this 
requirement. Please don't 'play around' with custom scripts, and don't add one of your own. If you 
think we can optimize one of our scripts, let us discuss your concept and idea as ISSUE first.


How to add a translation
------------------------

Translations are one of the most important things you can do, because this opens the rat.select 
library to a whole new world, allowing even more users to interact with it more natively. However, 
even a small mistake can make your translation invalid or unusable, therefore you should pay close 
attention to the following things:

1.  Keep your strings as small as possible, but try to avoid abbreviations.

