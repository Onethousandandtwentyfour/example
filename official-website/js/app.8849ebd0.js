(function(e){function t(t){for(var r,a,u=t[0],l=t[1],c=t[2],s=0,d=[];s<u.length;s++)a=u[s],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&d.push(o[a][0]),o[a]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);f&&f(t);while(d.length)d.shift()();return i.push.apply(i,c||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,a=1;a<n.length;a++){var u=n[a];0!==o[u]&&(r=!1)}r&&(i.splice(t--,1),e=l(l.s=n[0]))}return e}var r={},a={app:0},o={app:0},i=[];function u(e){return l.p+"js/"+({}[e]||e)+"."+{"chunk-dff657a6":"6d8e49da"}[e]+".js"}function l(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,l),n.l=!0,n.exports}l.e=function(e){var t=[],n={"chunk-dff657a6":1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var r="css/"+({}[e]||e)+"."+{"chunk-dff657a6":"5cfb392b"}[e]+".css",o=l.p+r,i=document.getElementsByTagName("link"),u=0;u<i.length;u++){var c=i[u],s=c.getAttribute("data-href")||c.getAttribute("href");if("stylesheet"===c.rel&&(s===r||s===o))return t()}var d=document.getElementsByTagName("style");for(u=0;u<d.length;u++){c=d[u],s=c.getAttribute("data-href");if(s===r||s===o)return t()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=t,f.onerror=function(t){var r=t&&t.target&&t.target.src||o,i=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=r,delete a[e],f.parentNode.removeChild(f),n(i)},f.href=o;var p=document.getElementsByTagName("head")[0];p.appendChild(f)})).then((function(){a[e]=0})));var r=o[e];if(0!==r)if(r)t.push(r[2]);else{var i=new Promise((function(t,n){r=o[e]=[t,n]}));t.push(r[2]=i);var c,s=document.createElement("script");s.charset="utf-8",s.timeout=120,l.nc&&s.setAttribute("nonce",l.nc),s.src=u(e);var d=new Error;c=function(t){s.onerror=s.onload=null,clearTimeout(f);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+r+": "+a+")",d.name="ChunkLoadError",d.type=r,d.request=a,n[1](d)}o[e]=void 0}};var f=setTimeout((function(){c({type:"timeout",target:s})}),12e4);s.onerror=s.onload=c,document.head.appendChild(s)}return Promise.all(t)},l.m=e,l.c=r,l.d=function(e,t,n){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(l.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)l.d(n,r,function(t){return e[t]}.bind(null,r));return n},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="",l.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],s=c.push.bind(c);c.push=t,c=c.slice();for(var d=0;d<c.length;d++)t(c[d]);var f=s;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"00f5":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("page-header"),n("router-view"),n("page-footer")],1)},o=[],i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"header-outer"},[n("div",{staticClass:"header-logo",style:e.bgUrlComputed(e.logoUrl),attrs:{"bg-img-cover":""}}),n("ul",[e._l(e.controllerList,(function(t){return[n("li",{key:t.id},[e._v(" "+e._s(t.name)+" ")])]}))],2)])},u=[],l={name:"layout-header",data:function(){return{logoUrl:"".concat("","imgs/home/logo.png"),controllerList:[{id:"shouye",name:"首页"},{id:"hangye",name:"行业"},{id:"fuwunengli",name:"服务能力"},{id:"jingdiananli",name:"经典案例"},{id:"guanyuwomen",name:"关于我们"}]}},computed:{bgUrlComputed:function(){return function(e){return{"background-image":"url(".concat(e,")")}}}}},c=l,s=(n("d082"),n("0c7c")),d=Object(s["a"])(c,i,u,!1,null,"b36df4ac",null),f=d.exports,p=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"footer-outer"},[n("ul",{staticClass:"parant-ul"},[e._l(e.textData,(function(t){return[n("li",{key:t.id,staticClass:"paranet-li"},[n("div",[e._v(e._s(t.text))]),n("ul",[e._l(t.children,(function(t){return[n("li",{key:t.id,staticClass:"child-li"},[e._v(e._s(t.text))])]}))],2)])]})),n("li",{staticClass:"last-parent-li"},[n("div",[e._l(e.contactData,(function(t){return[n("div",{key:t.id},[n("span",[e._v(e._s(t.text))]),n("span",[e._v(e._s(t.value))])])]}))],2)])],2)])},h=[],g={name:"layout-footer",data:function(){return{textData:[{id:"gongsijianjie_1",text:"公司简介",children:[{id:"gongsijieshao_1",text:"公司介绍"},{id:"gongsifuwu_1",text:"公司服务"}]},{id:"jingdiananli_1",text:"经典案例",children:[{id:"anlijieshao_1",text:"案例介绍"}]},{id:"shangwuhezuo_1",text:"商务合作",children:[{id:"shichanghezuo_1",text:"市场合作"},{id:"touzihezuo_1",text:"投资合作"}]},{id:"guanyuwomen_1",text:"关于我们",children:[{id:"lainxiwomen_1",text:"联系我们"},{id:"guanyuwomen_2",text:"关于我们"}]}],contactData:[{id:"mobile_1",text:"电话：",value:"13283839173"},{id:"email_1",text:"邮箱：",value:"lp@luanpenglp.com"},{id:"keep_on_record_1",text:"备注：",value:"-----------"}]}}},m=g,v=(n("8dba"),Object(s["a"])(m,p,h,!1,null,"4beb92f2",null)),b=v.exports,_={name:"app",components:{PageHeader:f,PageFooter:b}},y=_,w=(n("5c0b"),Object(s["a"])(y,a,o,!1,null,null,null)),x=w.exports,j=(n("d3b7"),n("3ca3"),n("ddb0"),n("8c4f"));r["default"].use(j["a"]);var k=[{path:"/",name:"Home",component:function(){return n.e("chunk-dff657a6").then(n.bind(null,"f5b8"))}}],C=new j["a"]({routes:k}),O=C,E=n("7212"),P=(n("bbe3"),{install:function(){r["default"].component("swiper",E["Swiper"]),r["default"].component("swiper-slide",E["SwiperSlide"]),r["default"].directive("swiper",E["directive"])}}),S=P;r["default"].use(S),r["default"].config.productionTip=!1,new r["default"]({router:O,render:function(e){return e(x)}}).$mount("#app")},"5c0b":function(e,t,n){"use strict";n("00f5")},6645:function(e,t,n){},"77ce":function(e,t,n){},"8dba":function(e,t,n){"use strict";n("6645")},d082:function(e,t,n){"use strict";n("77ce")}});
//# sourceMappingURL=app.8849ebd0.js.map