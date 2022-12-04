!function(d,p,v,r,o){const y="__COLLECTOR_URL__";let b="";const h=function(t,e){r.group("aasaam-analytics:error:"+t),e instanceof Error?r.error(e):e&&r.warn(e),r.groupEnd();var n=new URL(y);n.searchParams.set("m","err"),n.searchParams.set("i",b),n.searchParams.set("u",d.location.href),v.sendBeacon(n.toString(),JSON.stringify({msg:t,err:e?JSON.stringify(e,Object.getOwnPropertyNames(e)):void 0}))};if(!d.aasaamAnalytics){const e="on"===o.getItem("aasaam-analytics:debug"),S=function(t){e&&r.debug(t)},i=function(t){return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")},A=function(t){if("object"==typeof t&&s(t.lat)&&s(t.lon)&&Math.abs(t.lat)<=90&&Math.abs(t.lon)<=180)return t},a=function(t){if(t)try{return JSON.parse(t)}catch(t){h("storageParse",t)}return{}},c=function(t){let e={};var n=o.getItem(t);return n?e=a(n):(n=p.cookie.match(new RegExp(i(t)+"=([a-zA-Z0-9=+/]+)")))&&(e=a(d.atob(O(n[1])))),e},w=function(t,e,n,r){var i=c(t),n={v:n,e:r?Date.now()+1e3*r:864e5},r=(i[e]=n,o.setItem(t,JSON.stringify(i)),new Date);r.setFullYear(r.getFullYear()+1),p.cookie=t+"="+d.btoa(JSON.stringify(i))+";Expires="+r.toUTCString()+";Path=/;SameSite=Lax"},E=function(t,e){t=c(t);if(t[e]){t=t[e];if(!(t.e&&t.e<=Date.now()))return t.v}},O=function(t){return n(t)?t.replace(/[\n\s\r]+/g," ").trim():""},s=function(t){return"number"==typeof t&&isFinite(t)},P=function(t){try{var e=new URL(t);return/^http/.test(e.protocol)}catch(t){}return!1},n=function(t){var e=typeof t;return"string"==e||"object"==e&&null!=t&&!Array.isArray(t)&&"[object String]"==u(t)},L=function(t){return n(t)&&0<O(t).length},j=function(t){return L(t)&&/^[a-zA-Z0-9-_\/]{1,63}$/.test(t)},N=function(t){return L(t)&&/^[a-z0-9_]{1,31}$/.test(t)},u=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":toString.call(t)},I=function(t){let e=-1;return"string"==typeof t&&/^[0-9]+$/.test(t)?e=parseInt(t,10):"number"==typeof t&&Number.isInteger(t)&&(e=t),0<e&&e<=65535},T=function(t,e,n,r){return t&&Number.isInteger(t)&&e<=t&&t<=n?parseInt(t.toString(),10):r},_=function(t,e,n){return d.btoa([Math.round(t instanceof Date?t.getTime()/1e3:Date.now()/1e3).toString(),Math.round(e instanceof Date?e.getTime()/1e3:Date.now()/1e3).toString(),L(n)?n:((new Date).getTime().toString(32)+Math.random().toString(32).substring(2)).substring(0,16)].join(":"))},J=function(t){try{var e=d.atob(t).match(new RegExp("^([0-9]+):([0-9]+):([a-z0-9]{16})$"));if(e)return{i:new Date(1e3*parseInt(e[1],10)),s:new Date(1e3*parseInt(e[2],10)),r:e[3]};h("cidParse:regex",t)}catch(t){h("cidParse",t)}},x=function(t,e){w(t,"cid",e)},D=function(t){(!Number.isInteger(t.position)||t.position<1||5<t.position)&&h("breadcrumbValidateItem:position",t);var e={p:t.position,n:"",u:""};"string"==typeof t.name&&"string"==typeof t.item&&L(t.name)&&L(t.item)?(e.n=t.name,e.u=t.item,S(["breadcrumb:vi:ni",e])):"object"==typeof t.item&&"string"==typeof t.item["@id"]&&"string"==typeof t.item.name&&L(t.item["@id"])&&L(t.item.name)&&(e.n=t.item.name,e.u=t.item["@id"],S(["breadcrumb:vi:item",e])),e.n=O(e.n);try{var n=new URL(e.u);e.u=n.toString()}catch(t){return void h("breadcrumbValidateItem:url",t)}if(0<e.n.length||0<e.u.length)return e},k=function(t,e){return t.p>e.p?1:-1},R=function(t){let e=void 0;if(t.mainEntityOfPage&&t.mainEntityOfPage.breadcrumb?e=Array.isArray(t.mainEntityOfPage.breadcrumb)?t.mainEntityOfPage.breadcrumb[0]:t.mainEntityOfPage.breadcrumb:t["@type"]&&"breadcrumblist"===t["@type"].toLowerCase()?e=t:Array.isArray(t)&&t[0]&&t[0]["@type"]&&"breadcrumblist"===t[0]["@type"].toLowerCase()&&(e=t[0]),e&&e.itemListElement&&Array.isArray(e.itemListElement)&&0<e.itemListElement.length)return e},C=function(t){const i={};let o=!0;if(t.forEach(function(t,e){var e=e+1,n=e.toString(),r="n"+n,n="u"+n;t.p!==e||t.p<1||5<t.p?o=!1:(i[r]=t.n,i[n]=t.u)}),o)return i},U=function(t,e,n){n=void 0===n?t[e]:t[n]-t[e];if(s(n)&&0<=n)return n.toString()};d.aasaamAnalytics=function(c){b=c.i;const r={cid:void 0,pageView:void 0,event:void 0},s=(e=c.p,n="aa_std",L(e)?e:n);var e,n;const u=T(c.sd,60,86400,1800);let i,o=[],a=function(t){var e=E(t,"cid");if("string"==typeof e)return.5<Math.random()&&x(t,e),e}(s);{let t=!0;a&&(e=J(a))&&((n=new Date).setTime(n.getTime()-1e3*u),e.s<n?(a=_(e.i,new Date,e.r),x(s,a)):t=!1),t&&(a=_(),x(s,a))}let t=A(E(s,"gs"));function f(t,e){const n=new URL(y);Object.entries(t).forEach(function(t){n.searchParams.set(t[0],t[1])}),v.sendBeacon(n.toString(),JSON.stringify(e))}function l(){if(o.length){const r=o.reduce(function(t,e){return(t[e.i]=t[e.i]||[]).push(e),t},{});Object.keys(r).forEach(function(t){var e=t===c.i?"e_js_pv":"e_js_c",n=r[t].map(function(t){return{c:t.c,a:t.a,l:t.l,id:t.id,v:t.v}});f({i:t,m:e},{cid_std:a,p:i,ev:n})}),o=[]}}async function m(e){const n=e||{};var i,r,e=function(){var e=p.querySelector("main");if(e){var n=O(e.getAttribute("data-entity-id")),r=O(e.getAttribute("data-entity-module"));if(1<=n.length&&1<=r.length){let t;e=e.getAttribute("data-entity-taxonomy");if(I(e)&&(t=e),j(n)&&N(r))return{i:n,m:r,t:t};S({i:"",m:""})}}return{i:"",m:""}}();const o={u:P(n.u)?n.u:d.location.href,t:L(n.t)?n.t:function(){let t=p.title;var e=p.querySelector('meta[property="og:title"]');return e&&e.hasAttribute("content")&&(t=e.getAttribute("content")),O(t)}(),l:L(n.l)?n.l:function(){let t=p.documentElement.lang;var e=p.querySelector("html[lang]");return e&&e.hasAttribute("lang")&&(t=e.getAttribute("lang")),O(t)}(),cu:P(n.cu)?n.cu:function(){var t=p.querySelector("link[rel=canonical]");if(t&&t.hasAttribute("href")){t=t.getAttribute("href");if(P(t))return t;h("canonicalURL",t)}}(),ei:j(n.ei)?n.ei:e.i,em:N(n.em)?n.em:e.m,et:I(n.et)?n.et:e.t,r:void 0,bc:{},scr:d.screen.width+"x"+d.screen.height,vps:d.innerWidth+"x"+d.innerHeight,cd:d.screen.colorDepth.toString(),k:void 0,seg:function(t){if(Array.isArray(t)){const i=[1,2,3,4,5],o={};return t.forEach(t=>{var e=O(t.n),n=O(t.v),r=parseInt(t.s);i.includes(r)&&e&&N(e)&&n?(o[`s${r}n`]=e,o[`s${r}v`]=n):S(["invalid segment",t])}),Object.keys(o).length?o:void 0}}(n.sg),rs:void 0,dpr:d.devicePixelRatio.toString(),if:function(){try{return d.self!==d.top}catch(t){}return!0}(),ts:"ontouchstart"in d||0<v.maxTouchPoints,sot:function(){if(d.screen.orientation&&d.screen.orientation.type)return d.screen.orientation.type}(),prf:{},geo:t,usr:L(n.usr)?n.usr:void 0};{let t=p.referrer;n.r&&P(n.r)&&(t=n.r),o.r=t,o.rs=(e=t,"string"==typeof(i=E(s,"rs"))?i:(w(s,"rs",e,u),e))}{let t=function(){let t=[];var e=p.querySelector("meta[name=keywords]");return t=e&&e.hasAttribute("content")?O(e.getAttribute("content")).split(","):t}();Array.isArray(n.k)&&(t=n.k),o.k=t.map(function(t){return O(t).toLowerCase()}).slice(0,10).join(",")}if(n.bc&&(o.bc=function(t){let e=[];if("object"==typeof t&&Array.isArray(t.itemListElement)&&0<t.itemListElement.length)e=t.itemListElement;else if("string"==typeof t&&L(t)){var n=t,r=p.querySelector(n);if(r)try{var i=JSON.parse(r.innerHTML),o=R(i);o?e=o.itemListElement:h("breadcrumbProcess:selector:invalid:"+n)}catch(t){h("breadcrumbProcess:selector:"+n,t)}}else if(!0===t){r=p.querySelector('script[type="application/ld+json"]');if(r)try{var a=JSON.parse(r.innerHTML),c=R(a);c?e=c.itemListElement:S(["breadcrumbProcess:first-json+ld",a])}catch(t){S(["breadcrumbProcess:first-json+ld",t])}else S("breadcrumbProcess:first-json+ld:not-found")}if(0<e.length){var s=[];for(let t=0;t<e.length;t+=1){var u=D(e[t]);if(!u)return h("breadcrumbProcess:item-invalid",{list:e,item:u}),{};s.push(u)}if(0<s.length){i=s.sort(k),o=C(i);if(o)return o}}return{}}(n.bc)),void 0===o.geo)if(!0===n.geo){var a=E(s,"gf");if("1"!==a){let e=86400,n=604800,t=10,r=!0;c.gl&&(n=T(c.gl.lt,3600,7776e3,n),e=T(c.gl.fc,60,86400,e),t=T(c.gl.fc,1,60,t),r=(a=c.gl.ha,i=r,"boolean"==typeof a?a:i)),!async function(t,r,i){return new Promise(function(e,n){v.geolocation.getCurrentPosition(function(t){t={lat:t.coords.latitude,lon:t.coords.longitude};e(t)},function(t){n(t)},{maximumAge:t,timeout:r,enableHighAccuracy:i})})}(1e3*n,1e3*t,r).then(function(t){o.geo=t,w(s,"gs",t,n),S(["processGeo:success",t,{storagePrefix:s,geoCacheSuccessKey:"gs",geo:t,geoSuccessAgeSeconds:n}])}).catch(function(t){w(s,"gf","1",e),S(["processGeo:failed",t])})}}else"object"==typeof n.geo&&(a=A(n.geo))&&(o.geo=a);return r=n.pwt,(e=await new Promise(function(e){if("performance"in d&&"timeOrigin"in d.performance&&"timeOrigin"in d.performance){const t=d.performance;setTimeout(function(){if(!t||0===d.performance.timeOrigin)return e(void 0);try{e(t.toJSON())}catch(t){return h("timingInfo",t),e(void 0)}},T(r,50,2e3,500))}else e(void 0)}))&&(o.prf.plt=U(e.timing,"navigationStart","loadEventStart"),o.prf.dlt=U(e.timing,"domainLookupStart","domainLookupEnd"),o.prf.tct=U(e.timing,"connectStart","connectEnd"),o.prf.srt=U(e.timing,"requestStart","responseStart"),o.prf.pdt=U(e.timing,"responseStart","responseEnd"),o.prf.rt=U(e.timing,"navigationStart","fetchStart"),o.prf.dit=U(e.timing,"navigationStart","domInteractive"),o.prf.clt=U(e.timing,"navigationStart","domContentLoadedEventStart")),o.prf.r=function(){try{return JSON.parse(JSON.stringify(d.performance.getEntries())).filter(t=>"resource"===t.entryType).length}catch(t){h("performanceResources",t)}return 0}(),o}let g;return r.pageView=function(t){return m(t).then(function(t){i=JSON.parse(JSON.stringify(t)),f({i:c.i,m:"pv_js"},{cid_std:a,p:t}),d.aai.ie&&d.aai.ie.forEach(function(t){r.event(t)})}).catch(function(t){h("pageView",t)}),r},r.event=function(t,e){let n=c.i;return L(e)&&(n=e),N(t.c)?N(t.a)?void 0===t.l||L(t.l)?void 0===t.id||j(t.id)?void 0!==t.v&&(!Number.isInteger(t.v)||t.v<1)?h("event:value",t):(o.push({i:n,c:t.c,a:t.a,l:t.l,id:t.id,v:t.v}),50<=o.length?l():(d.clearTimeout(g),g=d.setTimeout(function(){l()},1e3))):h("event:ident",t):h("event:label",t):h("event:action",t):h("event:category",t),r},void 0===c.pv||!0===c.pv?r.pageView():"object"==typeof c.pv&&r.pageView(c.pv),r.cid=function(){var t=J(a);if(t)return{i:t.i,s:t.s,r:t.r,p:t.i.getTime().toString()+t.r}},r}}if(!d.aai&&p.currentScript&&p.currentScript.hasAttribute("data-i"))try{d.aai=d.aasaamAnalytics(JSON.parse(decodeURIComponent(d.atob(p.currentScript.getAttribute("data-i")))))}catch(t){h("aasaam-analytics:initialize-error:",t)}}(window,document,(performance,navigator),console,localStorage);