!function(r,i){function t(e){"console"in r&&(console.group("aasaam-analytics:legacy-script"),console.error(e),console.groupEnd());var t,n,a="veryLegacy";e.message&&(a=e.message);try{a=e.toString()}catch(e){}try{a=JSON.stringify(e,Object.getOwnPropertyNames(e))}catch(e){}"JSON"in r&&"XMLHttpRequest"in r?(e=new XMLHttpRequest,t="__COLLECTOR_URL__/?m=err&i="+o+"&u="+encodeURIComponent(r.location.href),e.open("POST",t),e.setRequestHeader("Content-Type","application/json;charset=UTF-8"),e.send(JSON.stringify({msg:"legacy-script",err:a}))):((n=i.createElement("img")).src="https://"+l.s+"/?m=err_l&err="+encodeURIComponent(a),i.body.appendChild(n),n.onload=function(){n.parentNode.removeChild(n)})}var o="";if(r.aai_lid)try{for(var e,n,a,l=r.aai_lid,o=l.i,g=(new Date).getTime().toString()+Math.random().toString().replace(/[^0-9]/g,""),c={m:"pv_il",i:l.i,u:r.location.href,r:i.referrer,_:g,t:i.title},d=i.getElementsByTagName("html"),s=(d&&d[0]&&(c.l=d[0].getAttribute("lang")),i.getElementsByTagName("main")),m=(s&&s[0]&&(e=s[0].getAttribute("data-entity-id"),n=s[0].getAttribute("data-entity-module"),e&&n&&(c.ei=e,c.em=n),a=s[0].getAttribute("data-entity-taxonomy"))&&(c.et=a),i.getElementsByTagName("meta")),p=0;p<m.length;p+=1){var u=m[p];u.getAttribute("property")&&"og:title"===u.getAttribute("property")&&(c.t=u.getAttribute("content"))}for(var y=i.getElementsByTagName("link"),p=0;p<y.length;p+=1){var h=y[p];h.getAttribute("rel")&&"canonical"===h.getAttribute("rel")&&(c.cu=h.getAttribute("href"))}var f,b=[];for(f in c)c[f]&&b.push(f+"="+encodeURIComponent(c[f]));var v=i.createElement("img");v.src="https://"+l.s+"/?"+b.join("&"),v.decoding="async",v.width=1,v.height=1,v.alt="",i.body.appendChild(v),v.onload=function(){r.aai_lid&&(delete r.aai_lid,r.aai_lid=void 0),v.parentNode.removeChild(v)}}catch(e){t(e)}else t(new Error("initialize data not set"))}(window,document);