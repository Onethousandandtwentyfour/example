(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4af10679"],{"5a83":function(t,e,o){},"6b9c":function(t,e,o){},b105:function(t,e,o){"use strict";o("6b9c")},f5b8:function(t,e,o){"use strict";o.r(e);var i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"home-outer"},[o("home-swiper"),o("div",{staticClass:"img-tips-block-1",style:t.bgUrlComputed(t.imgs.tips1),attrs:{"bg-img-contain":""}}),o("div",{staticClass:"img-tips-block-2",style:t.bgUrlComputed(t.imgs.tips2),attrs:{"bg-img-contain":""}}),o("div",{staticClass:"controller-block-outer"},[t._l(t.controllerData,(function(e){return[o("div",{key:e.id,staticClass:"controller-block",style:t.bgUrlComputed(t.imgs.boxshadow_bg),attrs:{"bg-img-contain":""}},[o("div",{staticClass:"controller-icon",style:t.bgUrlComputed(e.icon),attrs:{"bg-img-contain":""}}),o("div",{staticClass:"controller-text",style:t.bgUrlComputed(e.textIcon),attrs:{"bg-img-contain":""}})])]}))],2)],1)},n=[],s=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"swiper-outer-box"},[o("swiper",{directives:[{name:"swiper",rawName:"v-swiper:mySwiper",value:t.swiperOptions.options,expression:"swiperOptions.options",arg:"mySwiper"}],staticClass:"swiper-outer",on:{slideChange:t.swiperSlideChange}},[t._l(t.swiperOptions.slideList,(function(e){return[o("swiper-slide",{key:e.id},[o("div",{staticClass:"swiper-inner",style:t.bgUrlComputed(e.bgUrl),attrs:{"bg-img-cover":""}})])]}))],2),o("div",{staticClass:"swiper-pagination-outer"},[t._l(t.swiperOptions.slideList,(function(e,i){return[o("div",{key:i,staticClass:"swiper-pagination-inner",class:t.swiperCurrentProgress(i)})]}))],2)],1)},a=[],r={name:"page-home-swiper",data:function(){return{swiperOptions:{options:{direction:"horizontal",slidesPerView:0,initialSlide:0,loop:!1,observer:!0,observerParents:!0,observeSlideChildren:!0,touchRatio:.1,resistanceRatio:.01},progress:0,slideList:[{id:"slide_1",bgUrl:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/home-swiper-1.png")},{id:"slide_2",bgUrl:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/home-swiper-2.png")}]}}},computed:{bgUrlComputed:function(){return function(t){return{"background-image":"url(".concat(t,")")}}},swiperCurrentProgress:function(){var t=this;return function(e){return e==Math.abs(t.swiperOptions.progress)?"checked":""}}},methods:{swiperSlideChange:function(t){var e=t.activeIndex;this.swiperOptions.progress=e}}},c=r,l=(o("b105"),o("0c7c")),p=Object(l["a"])(c,s,a,!1,null,"180f46f0",null),u=p.exports,g={name:"home",components:{HomeSwiper:u},data:function(){return{imgs:{tips1:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/home-tips-1.png"),boxshadow_bg:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/shadow-bg.png"),tips2:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/home-tips-2.png")},controllerData:[{id:"zhengfu_1",icon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/icon-zhengfu.png"),textIcon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/text-zhengfu.png")},{id:"ai_1",icon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/icon-ai.png"),textIcon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/text-ai.png")},{id:"dianshang_1",icon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/icon-dianshang.png"),textIcon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/text-dianshang.png")},{id:"hulianwang_1",icon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/icon-hulianwang.png"),textIcon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/text-hulianwang.png")},{id:"jinrong_1",icon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/icon-jinrong.png"),textIcon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/text-jinrong.png")},{id:"pinpaishang_1",icon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/icon-pinpaishang.png"),textIcon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/text-pinpaishang.png")},{id:"yiliaojiankang_1",icon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/icon-yiliaojiankang.png"),textIcon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/text-yiliaojiankang.png")},{id:"lvyoujiaotong_1",icon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/icon-lvyoujiaotong.png"),textIcon:"".concat("https://onethousandandtwentyfour.github.io/example/official-website/","/imgs/home/controller/text-lvyoujiaotong.png")}]}},computed:{bgUrlComputed:function(){return function(t){return{"background-image":"url(".concat(t,")")}}}}},h=g,d=(o("f6a4"),Object(l["a"])(h,i,n,!1,null,"d1730c30",null));e["default"]=d.exports},f6a4:function(t,e,o){"use strict";o("5a83")}}]);
//# sourceMappingURL=chunk-4af10679.357d5961.js.map