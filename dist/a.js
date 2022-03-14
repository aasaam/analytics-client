!function(d,y,b,v,n,a){if(!d.aasaamAnalytics){const e="on"===a.getItem("aasaam-analytics:debug"),h=function(t){e&&n.debug(t)},S=function(t,e){n.group("aasaam-analytics:error:"+t),e instanceof Error?n.error(e):e&&n.warn(e),n.groupEnd()},r=function(t){return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")},A=function(t){if("object"==typeof t&&o(t.acc)&&o(t.lat)&&o(t.lon)&&0<=t.acc&&t.acc<=1e6&&Math.abs(t.lat)<=90&&Math.abs(t.lon)<=180)return t},i=function(t){if(t)try{return JSON.parse(t)}catch(t){S("storageParse",t)}return{}},c=function(t){let e={};var n=a.getItem(t);return n?e=i(n):(n=y.cookie.match(new RegExp(r(t)+"=([^;]+)")))&&(e=i(d.atob(j(n[1])))),e},w=function(t,e,n,r){const i=c(t);n={v:n,e:r?Date.now()+1e3*r:void 0};i[e]=n,a.setItem(t,JSON.stringify(i));const o=new Date;o.setFullYear(o.getFullYear()+1),y.cookie=t+"="+d.btoa(JSON.stringify(i))+";Expires="+o.toUTCString()+";Path=/;SameSite=Lax"},E=function(t,e){t=c(t);if(t[e]){t=t[e];if(!(t.e&&t.e<=Date.now()))return t.v}},j=function(t){return s(t)?t.replace(/[\n\s\r]+/g," ").trim():""},o=function(t){return"number"==typeof t&&isFinite(t)},P=function(t){try{var e=new URL(t);return/^http/.test(e.protocol)}catch(t){}return!1},s=function(t){var e=typeof t;return"string"==e||"object"==e&&null!=t&&!Array.isArray(t)&&"[object String]"==u(t)},L=function(t){return s(t)&&0<j(t).length},O=function(t){return L(t)&&/^[a-zA-Z0-9-_\/]{1,63}$/.test(t)},N=function(t){return L(t)&&/[a-z_]{1,31}/.test(t)},u=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":toString.call(t)},x=function(t){return!("string"!=typeof t||!/^[A-Z]{1}[0-9a-z]{4}$/.test(t))},D=function(t,e,n,r){return t&&Number.isInteger(t)&&e<=t&&t<=n?parseInt(t.toString(),10):r},I=function(t,e,n){return d.btoa([Math.round(t instanceof Date?t.getTime()/1e3:Date.now()/1e3).toString(),Math.round(e instanceof Date?e.getTime()/1e3:Date.now()/1e3).toString(),L(n)?n:((new Date).getTime().toString(32)+Math.random().toString(32).substring(2)).substring(0,16)].join(":"))},T=function(t){try{var e=d.atob(t).match(new RegExp("^([0-9]+):([0-9]+):([a-z0-9]{16})$"));if(e)return{i:new Date(1e3*parseInt(e[1],10)),s:new Date(1e3*parseInt(e[2],10)),r:e[3]};S("cidParse:regex",t)}catch(t){S("cidParse",t)}},J=function(t,e){w(t,"cid",e)},k=function(t){(!Number.isInteger(t.position)||t.position<1||5<t.position)&&S("breadcrumbValidateItem:position",t);const e={p:t.position,n:"",u:""};"string"==typeof t.name&&"string"==typeof t.item&&L(t.name)&&L(t.item)?(e.n=t.name,e.u=t.item,h(["breadcrumb:vi:ni",e])):"object"==typeof t.item&&"string"==typeof t.item["@id"]&&"string"==typeof t.item.name&&L(t.item["@id"])&&L(t.item.name)&&(e.n=t.item.name,e.u=t.item["@id"],h(["breadcrumb:vi:item",e])),e.n=j(e.n);try{var n=new URL(e.u);e.u=n.pathname+n.search+n.hash}catch(t){return void S("breadcrumbValidateItem:url",t)}if(0<e.n.length||0<e.u.length)return e},_=function(t,e){return t.p>e.p?1:-1},q=function(t){let e=void 0;if(t.mainEntityOfPage&&t.mainEntityOfPage.breadcrumb?e=Array.isArray(t.mainEntityOfPage.breadcrumb)?t.mainEntityOfPage.breadcrumb[0]:t.mainEntityOfPage.breadcrumb:t["@type"]&&"breadcrumblist"===t["@type"].toLowerCase()?e=t:Array.isArray(t)&&t[0]&&t[0]["@type"]&&"breadcrumblist"===t[0]["@type"].toLowerCase()&&(e=t[0]),e&&e.itemListElement&&Array.isArray(e.itemListElement)&&0<e.itemListElement.length)return e},C=function(t){const i={};let o=!0;if(t.forEach(function(t,e){const n=e+1;var e=n.toString(),r="n"+e,e="u"+e;t.p!==n||t.p<1||5<t.p?o=!1:(i[r]=t.n,i[e]=t.u)}),o)return i},M=function(t,e,n){const r=void 0===n?t[e]:t[n]-t[e];if(o(r)&&0<=r)return r.toString()};d.aasaamAnalytics=function(c){const r={cid:void 0,pageView:void 0,event:void 0},s=(e=c.p,t="aa_std",L(e)?e:t);var t;const u=D(c.sd,60,86400,1800);let i,o=[],a=function(t){var e=E(t,"cid");if("string"==typeof e)return.5<Math.random()&&J(t,e),e}(s);{let t=!0;if(a){var e=T(a);if(e){const p=new Date;p.setTime(p.getTime()-1e3*u),e.s<p?(a=I(e.i,new Date,e.r),J(s,a)):t=!1}}t&&(a=I(),J(s,a))}let f=A(E(s,"gs"));function l(t,e){const n=new URL(c.s);Object.entries(t).forEach(function(t){n.searchParams.set(t[0],t[1])}),d.navigator.sendBeacon(n.toString(),JSON.stringify(e))}function g(){if(o.length){const r=o.reduce(function(t,e){return(t[e.i]=t[e.i]||[]).push(e),t},{});Object.keys(r).forEach(function(t){var e=t===c.i?"e_js_pv":"e_js_c",n=r[t].map(function(t){return{c:t.c,a:t.a,l:t.l,v:t.v}});l({i:t,m:e},{cid_std:a,p:i,ev:n})}),o=[]}}async function n(i){const e=i||{};var n,i=function(){const e=y.querySelector("main");if(e){var n=j(e.getAttribute("data-entity-id")),r=j(e.getAttribute("data-entity-module"));let t;var i=e.getAttribute("data-entity-taxonomy");if(x(i)&&(t=i),O(n)&&N(r))return{i:n,m:r,t:t};S("mainEntity",{i:"",m:""})}return{i:"",m:""}}();const o={u:P(e.u)?e.u:d.location.href,t:L(e.t)?e.t:function(){let t=y.title;const e=y.querySelector('meta[property="og:title"]');return e&&e.hasAttribute("content")&&(t=e.getAttribute("content")),j(t)}(),l:L(e.l)?e.l:function(){let t="";const e=y.querySelector("html[lang]");return e&&e.hasAttribute("lang")&&(t=e.getAttribute("lang")),j(t)}(),cu:P(e.cu)?e.cu:function(){const t=y.querySelector("link[rel=canonical]");if(t&&t.hasAttribute("href")){var e=t.getAttribute("href");if(P(e))return e;S("canonicalURL",e)}}(),ei:L(e.ei)?e.ei:i.i,em:N(e.em)?e.em:i.m,et:x(e.et)?e.et:i.t,r:void 0,bc:{},scr:d.screen.width+"x"+d.screen.height,vps:d.innerWidth+"x"+d.innerHeight,cd:d.screen.colorDepth.toString(),k:void 0,rs:void 0,dpr:d.devicePixelRatio.toString(),if:function(){try{return d.self!==d.top}catch(t){}return!0}(),ts:"ontouchstart"in d||0<v.maxTouchPoints,sot:function(){if(d.screen.orientation&&d.screen.orientation.type)return d.screen.orientation.type.split("-").map(function(t){return t.substring(0,1)}).join("-")}(),prf:{},geo:f,usr:L(e.usr)?e.usr:void 0};{let t=y.referrer;e.r&&P(t)&&(t=e.r),o.r=t,o.rs=(i=t,"string"==typeof(a=E(s,"rs"))?a:(w(s,"rs",i,u),i))}{let t=function(){let t=[];const e=y.querySelector("meta[name=keywords]");return t=e&&e.hasAttribute("content")?j(e.getAttribute("content")).split(","):t}();Array.isArray(e.k)&&(t=e.k),o.k=t.map(function(t){return j(t).toLowerCase()}).slice(0,10).join(",")}if(e.bc&&(o.bc=function(t){let e=[];if("object"==typeof t&&Array.isArray(t.itemListElement)&&0<t.itemListElement.length)e=t.itemListElement;else if("string"==typeof t&&L(t)){var n=t,r=y.querySelector(n);if(r)try{var i=JSON.parse(r.innerHTML),o=q(i);o?e=o.itemListElement:S("breadcrumbProcess:selector:invalid:"+n)}catch(t){S("breadcrumbProcess:selector:"+n,t)}}else if(!0===t){r=y.querySelector('script[type="application/ld+json"]');if(r)try{var a=JSON.parse(r.innerHTML),c=q(a);c?e=c.itemListElement:S("breadcrumbProcess:first-json+ld",a)}catch(t){S("breadcrumbProcess:first-json+ld",t)}else S("breadcrumbProcess:first-json+ld:not-found")}if(0<e.length){const u=[];for(let t=0;t<e.length;t+=1){var s=k(e[t]);if(!s)return S("breadcrumbProcess:item-invalid",{list:e,item:s}),{};u.push(s)}if(0<u.length){i=u.sort(_),o=C(i);if(o)return o}}return{}}(e.bc)),"object"!=typeof o.geo)if(!0===e.geo){var a=E(s,"gf");if("1"!==a){let e=86400,n=604800,t=10,r=!0;c.gl&&(n=D(c.gl.lt,3600,7776e3,n),e=D(c.gl.fc,60,86400,e),t=D(c.gl.fc,1,60,t),r=(a=c.gl.ha,i=r,"boolean"==typeof a?a:i)),!async function(t,r,i){return new Promise(function(e,n){v.geolocation.getCurrentPosition(function(t){t={lat:t.coords.latitude,lon:t.coords.longitude,acc:t.coords.accuracy};e(t)},function(t){n(t)},{maximumAge:t,timeout:r,enableHighAccuracy:i})})}(1e3*n,1e3*t,r).then(function(t){o.geo=t,w(s,"gs",t,n),h(["processGeo:success",t,{storagePrefix:s,geoCacheSuccessKey:"gs",geo:t,geoSuccessAgeSeconds:n}])}).catch(function(t){w(s,"gf","1",e),h(["processGeo:failed",t])})}}else"object"==typeof e.geo&&A(e.geo)&&(o.geo=e.geo);return n=e.pwt,(a=await new Promise(function(t){const e=d.performance;setTimeout(function(){if(!e||0===b.timeOrigin)return t(void 0);t(e.toJSON())},D(n,50,2e3,500))}))&&(o.prf.plt=M(a.timing,"navigationStart","loadEventStart"),o.prf.dlt=M(a.timing,"domainLookupStart","domainLookupEnd"),o.prf.tct=M(a.timing,"connectStart","connectEnd"),o.prf.srt=M(a.timing,"requestStart","responseStart"),o.prf.pdt=M(a.timing,"responseStart","responseEnd"),o.prf.rt=M(a.timing,"navigationStart","fetchStart"),o.prf.dit=M(a.timing,"navigationStart","domInteractive"),o.prf.clt=M(a.timing,"navigationStart","domContentLoadedEventStart")),o.prf.r=JSON.parse(JSON.stringify(d.performance.getEntries())).length,o}let m;return r.pageView=function(t){return n(t).then(function(t){i=JSON.parse(JSON.stringify(t)),l({i:c.i,m:"pv_js"},{cid_std:a,p:t}),d.aai.ie&&d.aai.ie.forEach(function(t){r.event(t)})}).catch(function(t){S("pageView",t)}),r},r.event=function(t,e){let n=c.i;return L(e)&&(n=e),N(t.c)?N(t.a)?void 0===t.l&&L(t.l)?void 0!==t.v&&(!Number.isInteger(t.v)||t.v<1)?S("event:value",t):(o.push({i:n,c:t.c,a:t.a,l:t.l,v:t.v}),50<=o.length?g():(d.clearTimeout(m),m=d.setTimeout(function(){g()},1e3))):S("event:label",t):S("event:action",t):S("event:category",t),r},void 0===c.pv||!0===c.pv?r.pageView():"object"==typeof c.pv&&r.pageView(c.pv),r.cid=function(){const t=T(a);if(t)return{i:t.i,s:t.s,r:t.r,p:t.i.getTime().toString()+t.r}},r.i=!0,r}}if(!0!==d.aai.i&&y.currentScript&&y.currentScript.hasAttribute("data-i"))try{d.aai=d.aasaamAnalytics(JSON.parse(decodeURIComponent(d.atob(y.currentScript.getAttribute("data-i")))))}catch(t){n.error("aasaam-analytics:initialize-error:",t)}}(window,document,performance,navigator,console,localStorage);
//# sourceMappingURL=a.js.map