// @ts-check
(function (
  /** @type {Window} */
  window,
  /** @type {Document} */
  document
) {
  var collectorURL = '__COLLECTOR_URL__';
  var publicInstanceID = '';

  /**
   * @param {any} anyValue
   */
  var errorLog = function errorLog(anyValue) {
    // console log if exist
    if ('console' in window) {
      console.group('aasaam-analytics:legacy-script');
      console.error(anyValue);
      console.groupEnd();
    }

    // send error if possible
    if ('JSON' in window && 'XMLHttpRequest' in window) {
      var xmlHTTPReq = new XMLHttpRequest();
      var targetURL =
        collectorURL +
        '/?m=err&i=' +
        publicInstanceID +
        '&u=' +
        encodeURIComponent(window.location.href);
      xmlHTTPReq.open('POST', targetURL);
      xmlHTTPReq.setRequestHeader(
        'Content-Type',
        'application/json;charset=UTF-8'
      );
      xmlHTTPReq.send(
        JSON.stringify({
          msg: 'legacy-script',
          err: anyValue
            ? JSON.stringify(anyValue, Object.getOwnPropertyNames(anyValue))
            : undefined,
        })
      );
    }
  };

  // if not loaded initializeData script will not work
  if (!window.aai_lid) {
    errorLog(new Error('initialize data not set'));
    return;
  }

  try {
    publicInstanceID = initializeData.i;

    var firstScript = document.getElementsByTagName('script')[0];

    var initializeData = window.aai_lid;

    /** @type {AnalyticsRequestMode} */
    var mode = 'pv_il';

    var randomString =
      new Date().getTime().toString() +
      Math.random()
        .toString()
        .replace(/[^0-9]/g, '');

    var params = {
      m: mode,
      i: initializeData.i,
      u: window.location.href,
      r: document.referrer,
      _: randomString,
      t: document.title,
    };

    if ('querySelector' in document) {
      var titleTagOG = document.querySelector('meta[property="og:title"]');
      if (titleTagOG) {
        params.t = titleTagOG.getAttribute('content');
      }

      var langAttribute = document.querySelector('html[lang]');
      if (langAttribute) {
        params.l = langAttribute.getAttribute('lang');
      }

      var mainArticleTag = document.querySelector('main');
      if (mainArticleTag) {
        params.ei = mainArticleTag.getAttribute('data-entity-id');
        params.em = mainArticleTag.getAttribute('data-entity-module');
        params.et = mainArticleTag.getAttribute('data-entity-taxonomy');
      }
      var canonicalTag = document.querySelector('link[rel=canonical]');
      if (canonicalTag && canonicalTag.getAttribute('href')) {
        params.cu = canonicalTag.getAttribute('href');
      }
    }

    var queryParams = [];
    for (var key in params) {
      queryParams.push(key + '=' + encodeURIComponent(params[key]));
    }

    /** @type {HTMLImageElement} */
    var imgTag = document.createElement('img');
    imgTag.src = initializeData.s + '/?' + queryParams.join('&');
    imgTag.decoding = 'async';
    imgTag.width = 1;
    imgTag.height = 1;
    imgTag.alt = '';
    firstScript.parentNode.insertBefore(imgTag, firstScript);
    imgTag.onload = function () {
      delete window.aai_lid;
      window.aai_lid = undefined;
      imgTag.parentNode.removeChild(imgTag);
    };
  } catch (e) {
    errorLog(e);
  }
})(window, document);
