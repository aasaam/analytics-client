!async function(C,J){function O(t,e){console.group("aasaam analytics: "+t),console.error(e),console.groupEnd()}var t;if((C.aasaamAnalytics||(C.aasaamAnalytics=function(r){async function t(){return new Promise(function(e){var t=J.createElement("iframe");t.src=r.s+"/i.html?u="+l(C.location.href)+"&nvs="+m,t.setAttribute("aria-hidden","true"),t.width="0",t.tabIndex=-1,t.height="0",t.style.display="none",t.style.visibility="hidden",t.style.border="none",J.body.appendChild(t);var n=setTimeout(function(){e(void 0)},1e3);C.addEventListener("message",function(t){clearTimeout(n),t.data&&t.data.aasaamAnalyticsClientIdentifier&&e(t.data.aasaamAnalyticsClientIdentifier)},!0)})}function e(t,e,n){return C.btoa([t||"t",Math.round(e?e.getTime()/1e3:(new Date).getTime()/1e3).toString(),Math.round((new Date).getTime()/1e3).toString(),n||E()].join(":"))}function i(t){var e=new Date;e.setDate(e.getDate()+365),J.cookie=f+"="+t+";Expires="+e.toUTCString()+";Path=/;SameSite=Lax",localStorage.setItem(f,t)}var o,n,a,c,u,s,l=encodeURIComponent,g=this,d={m:"jsp",i:r.i,u:C.location.href,r:J.referrer},m=r.nvs||3600,f=r.p||"aai",p=[],v=function(t,e,n){t=f+"_"+t;localStorage.setItem(t,JSON.stringify({e:(new Date).getTime()+1e3*n,d:e}))},y=function(t){t=f+"_"+t,t=localStorage.getItem(t);if(t)try{var e=JSON.parse(t);if(e.e>(new Date).getTime())return e.d}catch(t){O("cache",t)}},h=function(t){var e=y("rs");return e||(v("rs",t,m),t)},S=function(t){return t.replace(/[\n\s\r]+/g," ").trim()},b=function(t){var e;try{e=new URL(t)}catch(t){return!1}return"http:"===e.protocol||"https:"===e.protocol},w=function(t,e){C.navigator.sendBeacon(r.s+"/?m="+l(e)+"&i="+l(d.i)+"&mid="+l(d.mid)+"&r="+l(d.r)+"&cn="+l(d.cn)+"&u="+l(d.u),JSON.stringify(t))},A=function(){p.length&&(w({c:L,p:o,e:p},"jse"),p=[])},E=function(){return((new Date).getTime().toString(32)+Math.random().toString(32).substr(2)).substr(0,16)},D=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":toString.call(t)},I=function(t){var e=typeof t;return"string"==e||"object"==e&&null!=t&&!Array.isArray(t)&&"[object String]"==D(t)},T=function(t){try{var e=C.atob(t).match(new RegExp("([a-z]{1}):([a-z0-9]+):([a-z0-9]+):([a-z0-9]+)"));if(e)return[e[1],new Date(1e3*parseInt(e[2],10)),new Date(1e3*parseInt(e[3],10)),e[4]]}catch(t){O("cannot parse client id",t)}return[!1,!1,!1,!1]},x=function(t){return"number"==typeof t&&isFinite(t)},k=async function(){return new Promise(function(t){var e=C.performance;setTimeout(()=>e&&0!==e.navigationStart?void t(e.toJSON()):t(void 0),200)})},j=function(t,e,n){e=void 0===n?t[e]:t[n]-t[e];if(x(e)&&0<=e)return e.toString()},N=async function(){return new Promise(function(e){var t=y("geo");if(t)return e(t);var n=r.glt||604800;navigator.geolocation.getCurrentPosition(function(t){t={lat:t.coords.latitude,lon:t.coords.longitude,acc:t.coords.accuracy};v("geo",t,n),e(t)},function(t){e(void 0)},{maximumAge:1e3*n,timeout:r.gto?1e3*r.gto:1e4,enableHighAccuracy:!0})})},L=function(){try{var t=[],e=localStorage.getItem(f);e&&(t[0]=e);var n=J.cookie.match(new RegExp(f.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")+"=([^;]+)"));if(n&&(t[1]=n[1].trim()),2===t.length&&t[0]===t[1])return t[0];if(1===t.length)return i(t[0]),t[0]}catch(t){}return""}(),R=!0;!L||4===(u=T(L)).length&&!1!==u[0]&&(R=!1,n=(u=T(L))[0],a=u[1],c=u[2],T=u[3],(u=new Date).setTime(u.getTime()-1e3*m),c<u&&(L=e(n,a,T),i(L),t().then(function(t){t&&i(L=t)}))),R&&(L=e(),i(L),t().then(function(t){t&&i(L=t)})),g.pageView=async function(t){t=await async function(t){var e=t||{},n={scr:C.screen.width+"x"+C.screen.height,vps:C.innerWidth+"x"+C.innerHeight,cd:C.screen.colorDepth.toString(),t:S(J.title),k:void 0,rs:void 0,dpr:C.devicePixelRatio?C.devicePixelRatio.toString():"1",if:C.self!==C.top,so:void 0,prf:{},geo:void 0,usr:void 0};C.screen.orientation&&C.screen.orientation.type&&(n.so=C.screen.orientation.type.split("-").map(function(t){return t.substr(0,1)}).join("-"));t=await k();t&&(n.prf.plt=j(t.timing,"navigationStart","loadEventStart"),n.prf.dlt=j(t.timing,"domainLookupStart","domainLookupEnd"),n.prf.tct=j(t.timing,"connectStart","connectEnd"),n.prf.srt=j(t.timing,"requestStart","responseStart"),n.prf.pdt=j(t.timing,"responseStart","responseEnd"),n.prf.rt=j(t.timing,"navigationStart","fetchStart"),n.prf.dit=j(t.timing,"navigationStart","domInteractive"),n.prf.clt=j(t.timing,"navigationStart","domContentLoadedEventStart")),e.url&&(b(e.url)?d.u=e.url:O("URL must valid http(s) uri",e.url)),e.user&&(I(e.user)?n.usr=e.user:O("User name/id must be string",e.user)),!0===e.geo?N().then(function(t){n.geo=t}).catch(function(){}):e.geo&&e.geo.lat&&e.geo.lon&&e.geo.acc&&(n.geo=e.geo);t=J.referrer;(t=e.referrer?e.referrer:t)&&(b(t)?(d.r=t,n.rs=h(t)):O("referrer is not valid URL",r));var r=void 0;e.canonical?r=e.canonical:(a=J.querySelector("link[rel=canonical]"))&&a.hasAttribute("href")&&(r=S(a.getAttribute("href"))),r&&(b(r)?d.cn=r:O("canonical is not valid URL",r)),e.title&&I(e.title)?n.t=e.title:(i=J.querySelector('meta[property="og:title"]'))&&i.hasAttribute("content")&&(n.t=S(i.getAttribute("content")));var i,a=[];return e.keywords?Array.isArray(e.keywords)?a=e.keywords:O("keywords must be array of string",r):(i=J.querySelector("meta[name=keywords]"))&&i.hasAttribute("content")&&(a=S(i.getAttribute("content")).split(",")),a.length&&(n.k=a.map(function(t){return t.trim()}).slice(0,10).join(",")),e.mainID?I(e.mainID)?d.mid=e.mainID:O("main identifier must string",r):(r=J.querySelector("main"))&&r.hasAttribute("data-id")&&(d.mid=r.getAttribute("data-id")),o=JSON.parse(JSON.stringify(n)),n}(t);return w({c:L,p:o=t},"jsp"),C.aae&&Array.isArray(C.aae)&&(C.aae.forEach(function(t){g.event(t)}),C.aae=[]),g},g.event=function(t){return!I(t.category)||t.category.length<1?O('Event "category" must exist and none empty string',t):!I(t.action)||t.action.length<1?O('Event "action" must exist and none empty string',t):void 0===t.label||I(t.label)?void 0!==t.value&&isNaN(t.value)?O('Event "value" must be numeric type',t):(p.push({ec:t.category,ea:t.action,el:t.label||void 0,ev:void 0!==t.value?t.value:void 0}),(50<=p.length?A:U)()):O('Event "label" must be none empty string',t),g};var U=function(){C.clearTimeout(s),s=C.setTimeout(function(){A()},1e3)};return r.pv&&g.pageView(!0===r.pv?void 0:r.pv).then().catch(t=>O(t)),g}),!C.aai)&&(J.currentScript&&J.currentScript.hasAttribute("data-i")))try{t=JSON.parse(C.atob(J.currentScript.getAttribute("data-i"))),C.aai=C.aasaamAnalytics(t)}catch(t){O("initialize",t)}}(window,document);