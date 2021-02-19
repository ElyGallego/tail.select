rat.select - BREAKING CHANGES
=============================

Version 1.0.0 of the refactored **rat.select** package contains dozens of breaking changes compared 
to version 0.6.0-beta, which is the unreleased successor of version 0.5.x. This document contains 
almost all import breaking changes you should know of, if you're switching from a previous release 
to the brandnew one.


rat.select() returning values
-----------------------------

The versions before 1.0.0 used an inconsistent returning value, depending on the amount of passed 
`<select>` fields instead of the parameter type itself. Now you will ALWAYS receive a single object 
instance ONLY if the first argument is a HTMLSelectElement object, everything else (Array, NodeList, 
HTMLCollection, ...) will return an ARRAY containing all object instances, even if this constructs
just contains a single `<select>` field at all.
