/*! pytesNET/rat.select | @version 1.0.0 | @license MIT | @copyright pytesNET <info@pytes.net> */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../ts/select')) :
	typeof define === 'function' && define.amd ? define(['../ts/select'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rat.select));
}(this, (function (select) {
	"use strict";

	select.Select.plugins.add("movement", {}, {});

})));
//# sourceMappingURL=movement.js.map
