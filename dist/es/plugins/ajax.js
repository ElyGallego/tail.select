/*! pytesNET/@rat.md/select | @version 1.0.0-rc.1 | @license MIT | @copyright pytesNET <info@pytes.net> */
import e from"rat.select";e.Strings.en.error="Oops, an error is occured",e.Strings.en.loading="Loading, please wait.",e.Strings.en.waiting="Waiting for your input.",e.Plugins.add("ajax",class{constructor(e){this.select=e}render(e,t){let i=document.createElement("DIV");return i.className="dropdown-inner dropdown-ajax-holder dropdown-ajax-"+t,i.innerText=e,i}"init:after"(){this.ajax="init"===this.get("ajax.listen","init"),this.select.classList.add("plugin-ajax")}open(){this.ajax||(this.ajax="open"===this.get("ajax.listen","open")),this.query()}close(){this.get("ajax.reset")&&(this.ajax="init"===this.get("ajax.listen","init"),this.ajaxItems=[])}"query:before"(){if(!0===this.ajax){let e=this.get("ajax.callback",((e,t,i)=>{t()})),t=function(e){this.ajax="resolved",this.ajaxItems=e,this.options.parse(this.ajaxItems),this.query()}.bind(this),i=function(e){this.ajax="rejected",this.ajaxItems=[];let t=this.plugins.plugins.ajax.render(this.locale._("error"),"error");this.dropdown.replaceChild(t,this.dropdown.querySelector(".dropdown-inner")),this.calculate()}.bind(this),a=e.call(this,t,i,this);"undefined"!=typeof Promise&&a instanceof Promise&&a.then(t,i);let s=this.plugins.plugins.ajax.render(this.locale._("loading"),"loading");this.dropdown.replaceChild(s,this.dropdown.querySelector(".dropdown-inner")),this.calculate()}return"resolved"===this.ajax||(this.ajax,!1)}"update#placeholder"(e,t){return this.get("ajax.forcePlaceholder",!0)&&e===this.locale._("empty")&&(e=this.get("placeholder")||e),[e,t]}});
/*! Visit this project on https://rat.md/select */