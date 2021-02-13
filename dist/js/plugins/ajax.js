/*! pytesNET/rat.select | @version 1.0.0-rc.1 | @license MIT | @copyright pytesNET <info@pytes.net> */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(require("rat.select")):"function"==typeof define&&define.amd?define(["rat.select"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).rat.select)}(this,(function(e){"use strict";var t=function(){function e(e){this.select=e}return e.prototype.render=function(e,t){var i=document.createElement("DIV");return i.className="dropdown-inner dropdown-ajax-holder dropdown-ajax-"+t,i.innerText=e,i},e.prototype["init:after"]=function(){this.ajax="init"===this.get("ajax.listen","init"),this.select.classList.add("plugin-ajax")},e.prototype.open=function(){this.ajax||(this.ajax="open"===this.get("ajax.listen","open")),this.query()},e.prototype.close=function(){this.get("ajax.reset")&&(this.ajax="init"===this.get("ajax.listen","init"),this.ajaxItems=[])},e.prototype["query:before"]=function(){if(!0===this.ajax){var e=this.get("ajax.callback",(function(e,t,i){t()})),t=function(e){this.ajax="resolved",this.ajaxItems=e,this.options.parse(this.ajaxItems),this.query()}.bind(this),i=function(e){this.ajax="rejected",this.ajaxItems=[];var t=this.plugins.plugins.ajax.render(this.locale._("error"),"error");this.dropdown.replaceChild(t,this.dropdown.querySelector(".dropdown-inner")),this.calculate()}.bind(this),n=e.call(this,t,i,this);"undefined"!=typeof Promise&&n instanceof Promise&&n.then(t,i);var a=this.plugins.plugins.ajax.render(this.locale._("loading"),"loading");this.dropdown.replaceChild(a,this.dropdown.querySelector(".dropdown-inner")),this.calculate()}return"resolved"===this.ajax||(this.ajax,!1)},e.prototype["update#placeholder"]=function(e,t){return this.get("ajax.forcePlaceholder",!0)&&e===this.locale._("empty")&&(e=this.get("placeholder")||e),[e,t]},e}();e.Strings.en.error="Oops, an error is occured",e.Strings.en.loading="Loading, please wait.",e.Strings.en.waiting="Waiting for your input.",e.Plugins.add("ajax",t)}));
/*! Visit this project on https://rat.md/select */