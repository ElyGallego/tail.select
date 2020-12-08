rat.select - DEVELOPER NOTES
============================

OAAP - Option as a Placeholder
------------------------------

rat.select v1.0.0 supports the OAAP structure, where the first option within the `<select>` list 
is treated as a placeholder. This is a famous method to show a small introduction text, before the 
user needs to made a decision, which can also be natively also for JavaScript-disabled browser 
environments. The OAAP method is known in 2 different ways, but both requires the option to be the 
first item in the `<select>` list, containing a `selected` and empty `value=""` attribute.


### Rollback

The first `Rollback` known method allows to select the placeholder again, even if the user already 
made a decision. Using this will force-enable the `deselect` option (even if you explicitly disable 
them on the configuration object).

```html
<select>
    <option value="" selected>My Placeholder Text</option>
<select>
```


### Irreversible

The second `Irreversible` method doesn't allow the user to select the placeholder again if he 
already made a decision on the first place. Keep in mind, that this option will keep the `<select>`s 
selectedIndex to 0 - for native behaviour purposes - and force-disables the `deselect` option (even 
if you explicitly enable them on the configuration object).

```html
<select>
    <option value="" disabled selected>My Placeholder Text</option>
<select>
```


Ignores options
---------------

All `<option>` elements, which contains a `data-rat-ignore` attribute will be completely ignored by 
the rat.select environment. They will not be passed, not be rendered or handled in any other known 
way. This attribute has not only been introduced for the OAAP feature, but also for doing awesome 
magic stuff with your select fields and a few JavaScript lines. (More in the examples)
