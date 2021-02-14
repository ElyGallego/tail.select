How to Contribute
=================

First of all, thanks for thinking about contributing to our select package and reading this file. 
Your contribution adds a real value to this library, and we really appreciate that! In order to be 
able to accept your pull request as soon as possible, please follow the following procedures.


General information for Pull Requests
-------------------------------------

**TLDR**: ALL OF YOUR CHANGES SHOULD BE MADE IN THE `SRC` FOLDER.

The rat.select package is written in TypeScript and SASS (SCSS-Syntax), using node.js and related 
tools and packages - such as rollup - to build the distribution files. Unlike many other npm 
packages we keep the latest `dist` files on our GitHub repository, thus also node-unfamiliar 
developers can use them without building the latest `master` branch first.

However, even if the distribution files are available, please do NEVER edit them yourself. If you 
aren't familiar with TypeScript, consider to post your desired changes as ISSUE on the repo and we 
will take care of your code.


**TLDR**: BUNDLE BEFORE SUBMIT YOUR PULL REQUEST.

But this also means, that changes on your Code must be bundled first, before your submit your Pull 
Request to our repository. Just enter `npm run build` or `npm run docs:build` will fully meet this 
requirement. Please don't 'play around' with custom scripts, and don't add one of your own. If you 
think we can optimize one of our scripts, let us discuss your concept and idea as ISSUE first.


**TLDR**: TEST BEFORE YOU SUBMIT YOUR PULL REQUEST.

Many contributors out there aren't familiar with unit-testing (in fact: we are also fairly new to 
this topic) and we don't require you to write one, even if you add a new feature or possibilty. 
The only thing we require is, that you test your package before submitting them. Using the script 
`npm run test` will run all of our included unit-tests. Of course, you can submit your Pull Request 
even if one or more tests failed. Just note the name of the failing tests in your Pull Request and 
we will check it out together.


How to add a translation
------------------------

Translations are one of the most important things you can do, because this opens the rat.select 
library to a whole new world, allowing even more users to interact with it more natively. However, 
even a small mistake can make your translation invalid or unusable, therefore you should pay close 
attention to the following things:

1.  Keep your strings as small as possible, but try to avoid abbreviations.
2.  Keep the placeholders as they are (ex. `[0]`) in their grammatically correct place.
3.  Pay attention to your locale name ([it MUST be in this list](https://github.com/umpirsky/locale-list/blob/master/data/en_GB/locales.csv)).

As a translator you don't need to be familiar with TypeScript or any other programming language 
itself, just follow the following instructions and we will do the rest to make your locale file 
available for everyone after we accept your pull request.


### Translate directly on GitHub.com

This part requires you to create an account on GitHub.com.

1.  Visit the example locale file [here](https://github.com/pytesNET/rat.select/blob/master/src/ts/langs/.example.ts).
2.  Click on the `Edit this file` button on the right upper corner of the file.
3.  Change the file name (above the editor) using a locale name [listed here](https://github.com/umpirsky/locale-list/blob/master/data/en_GB/locales.csv).
4.  Change the `[LOCALE]` part in `RatSelect.Strings["[LOCALE]"]` using the locale name from step 3.
5.  Do your translation as described on the comment on the bottom of this file.
6.  Optional: Fill out the translation header with your data (accept the `@source` part).
7.  Remove the translation comment and press the green `Commit Changes` button on the bottom.
8.  Press the `Create Pull Request` button, add some description and, again, press the `Create Pull Request` button.
9.  Thanks for your contribution, we will come back to you as soon as possible.


### Translate using Git

This part requires you to install [`Git`](https://git-scm.com/) or any Git UI application (such as 
[GitHub Desktop](https://desktop.github.com/)) on your computer and you need to create an account 
on GitHub.com as well.

1.  Fork and Clone our `rat.select` repository as described [here](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo).
2.  Visit the `src/ts/langs` directory and copy'n'paste the `.example.ts` file using a locale name [listed here](https://github.com/umpirsky/locale-list/blob/master/data/en_GB/locales.csv).
3.  Edit the file in an text-editor (like Notepad, but we recommend using [Atom](https://atom.io/) or [Notepad++](https://notepad-plus-plus.org/downloads/) instead).
4.  Change the `[LOCALE]` part in `RatSelect.Strings["[LOCALE]"]` using the locale name from step 2.
5.  Do your translation as described on the comment on the bottom of this file.
6.  Optional: Fill out the translation header with your data (accept the `@source` part).
7.  Remove the translation comment and push your changes to your repository as described [here](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/pushing-changes-to-github).
8.  Create a Pull request back to our `rat.select` repository as described [here](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).
9.  Thanks for your contribution, we will come back to you as soon as possible.


### Translate using ISSUE or E-MAIL

You can also still send us your translation via ISSUE or E-MAIL (localization@rat.md), creating an 
issue requires you to create an account on GitHub.com.

1.  Visit the example locale file [here](https://github.com/pytesNET/rat.select/blob/master/src/ts/langs/.example.ts).
2.  Edit the file using an text-editor (like Notepad, but we recommend using [Atom](https://atom.io/) or [Notepad++](https://notepad-plus-plus.org/downloads/) instead).
3.  Change the `[LOCALE]` part in `RatSelect.Strings["[LOCALE]"]` using a locale name [listed here](https://github.com/umpirsky/locale-list/blob/master/data/en_GB/locales.csv).
4.  Do your translation as described on the comment on the bottom of this file.
5.  Optional: Fill out the translation header with your data (accept the `@source` part).
6.  Remove the translation comment and submit your translation as ISSUE or mail them to localization@rat.md.
7.  Thanks for your contribution, we will come back to you as soon as possible.
