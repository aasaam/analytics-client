!function(t,e){function i(e){"console"in t&&(console.group("aasaam-analytics:legacy-script"),console.error(e),console.groupEnd())}if(t.aai_lid)try{var r,n,a,o,l,c=e.getElementsByTagName("script")[0],d=t.aai_lid,g=(new Date).getTime().toString()+Math.random().toString().replace(/[^0-9]/g,""),u={m:"pv_il",i:d.i,u:t.location.href,r:e.referrer,_:g,t:e.title},m=("querySelector"in e&&((r=e.querySelector('meta[property="og:title"]'))&&(u.t=r.getAttribute("content")),(n=e.querySelector("html[lang]"))&&(u.l=n.getAttribute("lang")),(a=e.querySelector("main"))&&(u.ei=a.getAttribute("data-entity-id"),u.em=a.getAttribute("data-entity-module"),u.et=a.getAttribute("data-entity-taxonomy")),(o=e.querySelector("link[rel=canonical]"))&&o.getAttribute("href")&&(u.cu=o.getAttribute("href"))),[]);for(l in u)m.push(l+"="+encodeURIComponent(u[l]));var s=e.createElement("img");s.src=d.s+"/?"+m.join("&"),s.decoding="async",s.width=1,s.height=1,s.alt="",c.parentNode.insertBefore(s,c),s.onload=function(){delete t.aai_lid,t.aai_lid=void 0,s.parentNode.removeChild(s)}}catch(e){i(e)}else i("initializeData not set")}(window,document);
//# sourceMappingURL=l.js.map