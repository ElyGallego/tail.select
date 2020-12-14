@title: Public Options

Public Options
==============

The current version of our **rat.select** library contains 33 settings, all of these can be passed 
as second argument on the main [`rat.select()`]() function. The default value of a few options relates
on the source &lt;select&gt; field, such as `disabled` or `multiple`. The options can also be 
changed at any time using the [`set()`]() function.

classNames !added:0.3.0
----------

![types](boolean|string|array "false")

This option allows you to add additional class names to the main **rat.select** container element. 
You can pass the class names as space separated `string`, within an `Array` or you can also pass 
just `true` to copy the class names of the source &lt;select&gt; field.

> ### Changelog
> ; Version 0.3.0
> : The option `copy_class` was used prior version 0.3.0.

csvOutput !added:0.3. !updated:0.6.0
---------

![types](boolean|string "false")

This option creates a hidden &lt;input /&gt; HTML field containing all selected option values 
separated as defined in [csvSeparator](#csvSeparator). You can either pass the desired `name` 
attribute as string, `true` to copy the `name` attribute of the source &lt;select&gt; field or 
`false` to skip the hidden &lt;input /&gt; field.

> ### Changelog
> ; Version 1.0.0
> : You can now pass a string to use a different name attribute.
> ; Version 0.5.0
> : The name attribute of the source &lt;select&gt; field gets removed, when this option is in use.

csvSeparator !added:0.3.0
------------


deselect !added:0.3.0
--------


disabled !added:0.5.0
--------


height !added:0.2.0 !updated:1.0.0
------


hideDisabled !added:0.3.0
------------


hideEmpty !new !added:1.0.0
---------


hideHidden !new !added:1.0.0
----------


hideSelected !added:0.3.0
------------


items !added:0.3.0 !updated:1.0.0
-----


locale !added:0.5.0
------


multiple !added:0.3.0
--------


multiLimit !added:0.3.0 !updated:0.5.0
----------


multiSelectAll !added:0.4.0
--------------


multiSelectGroup !added:0.4.0
----------------


on !new !added:1.0.0
---


openAbove !added:0.3.0
---------


placeholder !added:0.1.0 !updated:1.0.0
-----------


placeholderCount !new !added:1.0.0
----------------


plugins !new !added:1.0.0
-------


query !new !added:1.0.0
-----


required !new !added:1.0.0
--------


rtl !new !added:1.0.0
---


sourceBind !added:0.5.0
----------


sourceHide !added:0.5.0
----------


startOpen !added:0.3.0
---------


stayOpen !added:0.3.0
--------


stickyGroups !new !added:1.0.0
------------


theme !new !added:1.0.0
-----


titleOverflow !new !experimental !added:1.0.0
-------------


ungroupedLabel !new !added:1.0.0
--------------


width !added:0.2.0 !updated:0.5.0
-----


Removed Options
---------------

### animate !added:0.3.0 !removed:1.0.0

### bindSourceSelect !added:0.3.0 !removed:0.5.0

### cbComplete !added:0.5.0 !removed:1.0.0

### cbEmpty !added:0.5.0 !removed:1.0.0

### cbLoopItem !added:0.4.0 !removed:1.0.0

### cbLoopGroup !added:0.4.0 !removed:1.0.0

### descriptions !added:0.3.0 !removed:1.0.0

### hideSelect !added:0.3.0 !removed:1.0.0

### multiContainer !added:0.3.0 !removed:1.0.0

### multiPinSelected !added:0.5.0 !removed:1.0.0

### multiShowCount !added:0.3.0 !removed:1.0.0

### multiShowLimit !added:0.3.0 !removed:1.0.0

### search !added:0.3.0 !removed:1.0.0

### searchConfig !added:0.5.13 !removed:1.0.0

### searchFocus !added:0.3.0 !removed:1.0.0

### searchMarked !added:0.3.0 !removed:1.0.0

### searchMinLength !added:0.5.13 !removed:1.0.0

### searchDisabled !added:0.5.5 !removed:1.0.0

### sortItems !added:0.3.0 !removed:1.0.0

### sortGroups !added:0.3.0 !removed:1.0.0
