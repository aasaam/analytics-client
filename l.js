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

    var err = 'veryLegacy';
    if (anyValue.message) {
      err = anyValue.message;
    }
    try {
      err = anyValue.toString();
    } catch (eJSON) {}
    try {
      err = JSON.stringify(anyValue, Object.getOwnPropertyNames(anyValue));
    } catch (eJSON) {}

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
          err: err
        })
      );
    } else {
      /** @type {HTMLImageElement} */
      var errImgTag = document.createElement('img');
      errImgTag.src =
        'https://' +
        initializeData.s +
        '/?m=err_l&err=' +
        encodeURIComponent(err);
      document.body.appendChild(errImgTag);
      errImgTag.onload = function () {
        errImgTag.parentNode.removeChild(errImgTag);
      };
    }
  };

  // if not loaded initializeData script will not work
  if (!window.aai_lid) {
    errorLog(new Error('initialize data not set'));
    return;
  }

  try {
    var initializeData = window.aai_lid;

    publicInstanceID = initializeData.i;

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
      t: document.title
    };

    // language
    var htmlTags = document.getElementsByTagName('html');
    if (htmlTags && htmlTags[0]) {
      params.l = htmlTags[0].getAttribute('lang');
    }

    // entity
    var mainArticleTags = document.getElementsByTagName('main');
    if (mainArticleTags && mainArticleTags[0]) {
      var ei = mainArticleTags[0].getAttribute('data-entity-id');
      var em = mainArticleTags[0].getAttribute('data-entity-module');
      if (ei && em) {
        params.ei = ei;
        params.em = em;
      }
      var et = mainArticleTags[0].getAttribute('data-entity-taxonomy');
      if (et) {
        params.et = et;
      }
    }

    // title
    var metaTags = document.getElementsByTagName('meta');
    for (var i = 0; i < metaTags.length; i += 1) {
      var meta = metaTags[i];
      if (
        meta.getAttribute('property') &&
        meta.getAttribute('property') === 'og:title'
      ) {
        params.t = meta.getAttribute('content');
      }
    }

    // canonical
    var linkTags = document.getElementsByTagName('link');
    for (var i = 0; i < linkTags.length; i += 1) {
      var link = linkTags[i];
      if (
        link.getAttribute('rel') &&
        link.getAttribute('rel') === 'canonical'
      ) {
        params.cu = link.getAttribute('href');
      }
    }

    var queryParams = [];
    for (var key in params) {
      if (params[key]) {
        queryParams.push(key + '=' + encodeURIComponent(params[key]));
      }
    }

    /** @type {HTMLImageElement} */
    var imgTag = document.createElement('img');
    imgTag.src = 'https://' + initializeData.s + '/?' + queryParams.join('&');
    imgTag.decoding = 'async';
    imgTag.width = 1;
    imgTag.height = 1;
    imgTag.alt = '';
    document.body.appendChild(imgTag);
    imgTag.onload = function () {
      if (window.aai_lid) {
        delete window.aai_lid;
        window.aai_lid = undefined;
      }
      imgTag.parentNode.removeChild(imgTag);
    };
  } catch (e) {
    errorLog(e);
  }
})(window, document);
