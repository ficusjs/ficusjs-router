if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return i[e]||(s=new Promise((async s=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]}))},s=(s,i)=>{Promise.all(s.map(e)).then((e=>i(1===e.length?e[0]:e)))},i={require:Promise.resolve(s)};self.define=(s,r,o)=>{i[s]||(i[s]=Promise.resolve().then((()=>{let i={};const a={uri:location.origin+s.slice(1)};return Promise.all(r.map((s=>{switch(s){case"exports":return i;case"module":return a;default:return e(s)}}))).then((e=>{const s=o(...e);return i.default||(i.default=s),i}))})))}}define("./sw.js",["./workbox-f7715658"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"db8fb6bb5a7d20034100ba1931c71869"},{url:"assets/img/android-chrome-192x192.png",revision:"5fa932c70edfb28a70264dce1a842fa9"},{url:"assets/img/android-chrome-384x384.png",revision:"1bf9a5b559dc7ec4db478d99844f9e6a"},{url:"assets/img/apple-touch-icon.png",revision:"852742b2d3b94d4d75a9cd66f7ff76d2"},{url:"assets/img/favicon-16x16.png",revision:"d044aff1f55cb0938155d501ae63dbe2"},{url:"assets/img/favicon-32x32.png",revision:"407645a6bcf8698917f0daed1aa4a678"},{url:"assets/img/favicon.ico",revision:"634ec555cd23e3496499c186bd774974"},{url:"assets/img/ficus-components-logo-white.svg",revision:"f0f5737b09e51536cd402c7e49959276"},{url:"assets/img/ficus-components-logo.svg",revision:"2801e2b4261c954b32d4e447ed282282"},{url:"assets/img/ficus-logo-white.svg",revision:"9c645bb95deaf0547f70af606fdc1a1d"},{url:"assets/img/ficus-logo.svg",revision:"3f4ee9a3cc8a0285fab04596049d0d7f"},{url:"assets/img/ficus-router-logo-white.svg",revision:"514405a9a2911340a2e40444d440ed5b"},{url:"assets/img/ficus-router-logo.svg",revision:"3930b75ea5c76983e7d74dccc83e3741"},{url:"assets/img/ficus-script-logo-white.svg",revision:"fa25d469f4a72bf369b6653834fe0b61"},{url:"assets/img/ficus-script-logo.svg",revision:"cdf8372e36321adbf4fd785958ad45fb"},{url:"assets/img/ficus-styles-logo-white.svg",revision:"046449261d69f8bc016ba759728ad141"},{url:"assets/img/ficus-styles-logo.svg",revision:"566ea7d1cc115f5941c1d43ec8054240"},{url:"assets/img/logo.png",revision:"d1af81e7e9f5ade1f1c10784926b13dc"},{url:"favicon.ico",revision:"26ef20ace859bbae981ebaa977e3f48a"},{url:"img/angle_up.svg",revision:"374066f276653a657f519a665abc08a4"},{url:"img/checkmark.svg",revision:"c21feaddd1021e077125a5ab772f22cf"},{url:"img/icon-192x192.png",revision:"f0253382b205261b04a4c53f5814d3f2"},{url:"img/icon-512x512.png",revision:"72b4804f9936b26f85aa633636832a35"},{url:"img/logo.svg",revision:"e5232ea1022c4c208c829002570e13b3"}],{})}));
//# sourceMappingURL=sw.js.map