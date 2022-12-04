!function(d,p,v,r,o){const y="__COLLECTOR_URL__";let b="";const h=function(t){return JSON.stringify(t,(()=>{const n=new WeakSet;return(t,e)=>{if("object"==typeof e&&null!==e){if(n.has(e))return;n.add(e)}return e}})())},S=function(t,e){r.group("aasaam-analytics:error:"+t),e instanceof Error?r.error(e):e&&r.warn(e),r.groupEnd();var n=new URL(y);n.searchParams.set("m","err"),n.searchParams.set("i",b),n.searchParams.set("u",d.location.href),v.sendBeacon(n.toString(),h({msg:t,err:e?JSON.stringify(e,Object.getOwnPropertyNames(e)):void 0}))};if(!d.aasaamAnalytics){const e="on"===o.getItem("aasaam-analytics:debug"),w=function(t){e&&r.debug(t)},i=function(t){return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")},A=function(t){if("object"==typeof t&&s(t.lat)&&s(t.lon)&&Math.abs(t.lat)<=90&&Math.abs(t.lon)<=180)return t},a=function(t){if(t)try{return JSON.parse(t)}catch(t){S("storageParse",t)}return{}},c=function(t){let e={};var n=o.getItem(t);return n?e=a(n):(n=p.cookie.match(new RegExp(i(t)+"=([a-zA-Z0-9=+/]+)")))&&(e=a(d.atob(L(n[1])))),e},E=function(t,e,n,r){var i=c(t),n={v:n,e:r?Date.now()+1e3*r:864e5},r=(i[e]=n,o.setItem(t,h(i)),new Date);r.setFullYear(r.getFullYear()+1),p.cookie=t+"="+d.btoa(h(i))+";Expires="+r.toUTCString()+";Path=/;SameSite=Lax"},P=function(t,e){t=c(t);if(t[e]){t=t[e];if(!(t.e&&t.e<=Date.now()))return t.v}},L=function(t){return n(t)?t.replace(/[\n\s\r]+/g," ").trim():""},s=function(t){return"number"==typeof t&&isFinite(t)},O=function(t){try{var e=new URL(t);return/^http/.test(e.protocol)}catch(t){}return!1},n=function(t){var e=typeof t;return"string"==e||"object"==e&&null!=t&&!Array.isArray(t)&&"[object String]"==u(t)},j=function(t){return n(t)&&0<L(t).length},I=function(t){return j(t)&&/^[a-zA-Z0-9-_\/]{1,63}$/.test(t)},N=function(t){return j(t)&&/^[a-z0-9_]{1,31}$/.test(t)},u=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":toString.call(t)},T=function(t){let e=-1;return"string"==typeof t&&/^[0-9]+$/.test(t)?e=parseInt(t,10):"number"==typeof t&&Number.isInteger(t)&&(e=t),0<e&&e<=65535},_=function(t,e,n,r){return t&&Number.isInteger(t)&&e<=t&&t<=n?parseInt(t.toString(),10):r},k=function(t,e,n){return d.btoa([Math.round(t instanceof Date?t.getTime()/1e3:Date.now()/1e3).toString(),Math.round(e instanceof Date?e.getTime()/1e3:Date.now()/1e3).toString(),j(n)?n:((new Date).getTime().toString(32)+Math.random().toString(32).substring(2)).substring(0,16)].join(":"))},x=function(t){try{var e=d.atob(t).match(new RegExp("^([0-9]+):([0-9]+):([a-z0-9]{16})$"));if(e)return{i:new Date(1e3*parseInt(e[1],10)),s:new Date(1e3*parseInt(e[2],10)),r:e[3]};S("cidParse:regex",t)}catch(t){S("cidParse",t)}},D=function(t,e){E(t,"cid",e)},R=function(t){(!Number.isInteger(t.position)||t.position<1||5<t.position)&&S("breadcrumbValidateItem:position",t);var e={p:t.position,n:"",u:""};"string"==typeof t.name&&"string"==typeof t.item&&j(t.name)&&j(t.item)?(e.n=t.name,e.u=t.item,w(["breadcrumb:vi:ni",e])):"object"==typeof t.item&&"string"==typeof t.item["@id"]&&"string"==typeof t.item.name&&j(t.item["@id"])&&j(t.item.name)&&(e.n=t.item.name,e.u=t.item["@id"],w(["breadcrumb:vi:item",e])),e.n=L(e.n);try{var n=new URL(e.u);e.u=n.toString()}catch(t){return void S("breadcrumbValidateItem:url",t)}if(0<e.n.length||0<e.u.length)return e},C=function(t,e){return t.p>e.p?1:-1},J=function(t){let e=void 0;if(t.mainEntityOfPage&&t.mainEntityOfPage.breadcrumb?e=Array.isArray(t.mainEntityOfPage.breadcrumb)?t.mainEntityOfPage.breadcrumb[0]:t.mainEntityOfPage.breadcrumb:t["@type"]&&"breadcrumblist"===t["@type"].toLowerCase()?e=t:Array.isArray(t)&&t[0]&&t[0]["@type"]&&"breadcrumblist"===t[0]["@type"].toLowerCase()&&(e=t[0]),e&&e.itemListElement&&Array.isArray(e.itemListElement)&&0<e.itemListElement.length)return e},U=function(t){const i={};let o=!0;if(t.forEach(function(t,e){var e=e+1,n=e.toString(),r="n"+n,n="u"+n;t.p!==e||t.p<1||5<t.p?o=!1:(i[r]=t.n,i[n]=t.u)}),o)return i},q=function(t,e,n){n=void 0===n?t[e]:t[n]-t[e];if(s(n)&&0<=n)return n.toString()};d.aasaamAnalytics=function(c){b=c.i;const r={cid:void 0,pageView:void 0,event:void 0},s=(e=c.p,n="aa_std",j(e)?e:n);var e,n;const u=_(c.sd,60,86400,1800);let i,o=[],a=function(t){var e=P(t,"cid");if("string"==typeof e)return.5<Math.random()&&D(t,e),e}(s);{let t=!0;a&&(e=x(a))&&((n=new Date).setTime(n.getTime()-1e3*u),e.s<n?(a=k(e.i,new Date,e.r),D(s,a)):t=!1),t&&(a=k(),D(s,a))}let t=A(P(s,"gs"));function f(t,e){const n=new URL(y);Object.entries(t).forEach(function(t){n.searchParams.set(t[0],t[1])}),v.sendBeacon(n.toString(),h(e))}function l(){if(o.length){const r=o.reduce(function(t,e){return(t[e.i]=t[e.i]||[]).push(e),t},{});Object.keys(r).forEach(function(t){var e=t===c.i?"e_js_pv":"e_js_c",n=r[t].map(function(t){return{c:t.c,a:t.a,l:t.l,id:t.id,v:t.v}});f({i:t,m:e},{cid_std:a,p:i,ev:n})}),o=[]}}async function m(e){const n=e||{};var i,r,e=function(){var e=p.querySelector("main");if(e){var n=L(e.getAttribute("data-entity-id")),r=L(e.getAttribute("data-entity-module"));if(1<=n.length&&1<=r.length){let t;e=e.getAttribute("data-entity-taxonomy");if(T(e)&&(t=e),I(n)&&N(r))return{i:n,m:r,t:t};w({i:"",m:""})}}return{i:"",m:""}}();const o={u:O(n.u)?n.u:d.location.href,t:j(n.t)?n.t:function(){let t=p.title;var e=p.querySelector('meta[property="og:title"]');return e&&e.hasAttribute("content")&&(t=e.getAttribute("content")),L(t)}(),l:j(n.l)?n.l:function(){let t=p.documentElement.lang;var e=p.querySelector("html[lang]");return e&&e.hasAttribute("lang")&&(t=e.getAttribute("lang")),L(t)}(),cu:O(n.cu)?n.cu:function(){var t=p.querySelector("link[rel=canonical]");if(t&&t.hasAttribute("href")){t=t.getAttribute("href");if(O(t))return t;S("canonicalURL",t)}}(),ei:I(n.ei)?n.ei:e.i,em:N(n.em)?n.em:e.m,et:T(n.et)?n.et:e.t,r:void 0,bc:{},scr:d.screen.width+"x"+d.screen.height,vps:d.innerWidth+"x"+d.innerHeight,cd:d.screen.colorDepth.toString(),k:void 0,seg:function(t){if(Array.isArray(t)){const i=[1,2,3,4,5],o={};return t.forEach(t=>{var e=L(t.n),n=L(t.v),r=parseInt(t.s);i.includes(r)&&e&&N(e)&&n?(o[`s${r}n`]=e,o[`s${r}v`]=n):w(["invalid segment",t])}),Object.keys(o).length?o:void 0}}(n.sg),rs:void 0,dpr:d.devicePixelRatio.toString(),if:function(){try{return d.self!==d.top}catch(t){}return!0}(),ts:"ontouchstart"in d||0<v.maxTouchPoints,sot:function(){if(d.screen.orientation&&d.screen.orientation.type)return d.screen.orientation.type}(),prf:{},geo:t,usr:j(n.usr)?n.usr:void 0};{let t=p.referrer;n.r&&O(n.r)&&(t=n.r),o.r=t,o.rs=(e=t,"string"==typeof(i=P(s,"rs"))?i:(E(s,"rs",e,u),e))}{let t=function(){let t=[];var e=p.querySelector("meta[name=keywords]");return t=e&&e.hasAttribute("content")?L(e.getAttribute("content")).split(","):t}();Array.isArray(n.k)&&(t=n.k),o.k=t.map(function(t){return L(t).toLowerCase()}).slice(0,10).join(",")}if(n.bc&&(o.bc=function(t){let e=[];if("object"==typeof t&&Array.isArray(t.itemListElement)&&0<t.itemListElement.length)e=t.itemListElement;else if("string"==typeof t&&j(t)){var n=t,r=p.querySelector(n);if(r)try{var i=JSON.parse(r.innerHTML),o=J(i);o?e=o.itemListElement:S("breadcrumbProcess:selector:invalid:"+n)}catch(t){S("breadcrumbProcess:selector:"+n,t)}}else if(!0===t){r=p.querySelector('script[type="application/ld+json"]');if(r)try{var a=JSON.parse(r.innerHTML),c=J(a);c?e=c.itemListElement:w(["breadcrumbProcess:first-json+ld",a])}catch(t){w(["breadcrumbProcess:first-json+ld",t])}else w("breadcrumbProcess:first-json+ld:not-found")}if(0<e.length){var s=[];for(let t=0;t<e.length;t+=1){var u=R(e[t]);if(!u)return S("breadcrumbProcess:item-invalid",{list:e,item:u}),{};s.push(u)}if(0<s.length){i=s.sort(C),o=U(i);if(o)return o}}return{}}(n.bc)),void 0===o.geo)if(!0===n.geo){var a=P(s,"gf");if("1"!==a){let e=86400,n=604800,t=10,r=!0;c.gl&&(n=_(c.gl.lt,3600,7776e3,n),e=_(c.gl.fc,60,86400,e),t=_(c.gl.fc,1,60,t),r=(a=c.gl.ha,i=r,"boolean"==typeof a?a:i)),!async function(t,r,i){return new Promise(function(e,n){v.geolocation.getCurrentPosition(function(t){t={lat:t.coords.latitude,lon:t.coords.longitude};e(t)},function(t){n(t)},{maximumAge:t,timeout:r,enableHighAccuracy:i})})}(1e3*n,1e3*t,r).then(function(t){o.geo=t,E(s,"gs",t,n),w(["processGeo:success",t,{storagePrefix:s,geoCacheSuccessKey:"gs",geo:t,geoSuccessAgeSeconds:n}])}).catch(function(t){E(s,"gf","1",e),w(["processGeo:failed",t])})}}else"object"==typeof n.geo&&(a=A(n.geo))&&(o.geo=a);return r=n.pwt,(e=await new Promise(function(e){if("performance"in d&&"timeOrigin"in d.performance&&"timeOrigin"in d.performance){const t=d.performance;setTimeout(function(){if(!t||0===d.performance.timeOrigin)return e(void 0);try{e(JSON.parse(h(t.toJSON())))}catch(t){return S("timingInfo",t),e(void 0)}},_(r,50,2e3,500))}else e(void 0)}))&&(o.prf.plt=q(e.timing,"navigationStart","loadEventStart"),o.prf.dlt=q(e.timing,"domainLookupStart","domainLookupEnd"),o.prf.tct=q(e.timing,"connectStart","connectEnd"),o.prf.srt=q(e.timing,"requestStart","responseStart"),o.prf.pdt=q(e.timing,"responseStart","responseEnd"),o.prf.rt=q(e.timing,"navigationStart","fetchStart"),o.prf.dit=q(e.timing,"navigationStart","domInteractive"),o.prf.clt=q(e.timing,"navigationStart","domContentLoadedEventStart")),o.prf.r=function(){try{return JSON.parse(h(d.performance.getEntries())).filter(t=>"resource"===t.entryType).length}catch(t){S("performanceResources",t)}return 0}(),o}let g;return r.pageView=function(t){return m(t).then(function(t){i=JSON.parse(h(t)),f({i:c.i,m:"pv_js"},{cid_std:a,p:t}),d.aai.ie&&d.aai.ie.forEach(function(t){r.event(t)})}).catch(function(t){S("pageView",t)}),r},r.event=function(t,e){let n=c.i;return j(e)&&(n=e),N(t.c)?N(t.a)?void 0===t.l||j(t.l)?void 0===t.id||I(t.id)?void 0!==t.v&&(!Number.isInteger(t.v)||t.v<1)?S("event:value",t):(o.push({i:n,c:t.c,a:t.a,l:t.l,id:t.id,v:t.v}),50<=o.length?l():(d.clearTimeout(g),g=d.setTimeout(function(){l()},1e3))):S("event:ident",t):S("event:label",t):S("event:action",t):S("event:category",t),r},void 0===c.pv||!0===c.pv?r.pageView():"object"==typeof c.pv&&r.pageView(c.pv),r.cid=function(){var t=x(a);if(t)return{i:t.i,s:t.s,r:t.r,p:t.i.getTime().toString()+t.r}},r}}if(!d.aai&&p.currentScript&&p.currentScript.hasAttribute("data-i"))try{d.aai=d.aasaamAnalytics(JSON.parse(decodeURIComponent(d.atob(p.currentScript.getAttribute("data-i")))))}catch(t){S("aasaam-analytics:initialize-error:",t)}}(window,document,(performance,navigator),console,localStorage);