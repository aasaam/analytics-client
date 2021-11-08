// prettier-ignore
// @ts-check
(
  /**
   * @param {window} window
   * @param {document} document
   * @param {InitializeData} initializeData
   * @returns {void}
   */
  function (window, document, initializeData) {
    /**
     * @param {Function} callback
     */
    var tryError = function tryError(callback) {
      try {
        callback();
      } catch (e) {
        if (console && 'error' in console) {
          console.error('aasaam analytics: script', e);
        }
      }
    };

    tryError(function () {
      var firstScript = document.getElementsByTagName('script')[0];

      // condition for modern browser detect about ~ 90% total users
      // https://caniuse.com/mdn-javascript_builtins_promise_any
      if ('Promise' in window && 'any' in Promise) {
        var aasaamAnalyticScript = document.createElement('script');
        aasaamAnalyticScript.setAttribute(
          'data-i',
          window.btoa(JSON.stringify(initializeData))
        );
        aasaamAnalyticScript.async = true;
        aasaamAnalyticScript.src = initializeData.s + '/a.js';
        firstScript.parentNode.insertBefore(aasaamAnalyticScript, firstScript);
        return;
      }

      // rest of legacy browser that js is enabled
      // otherwise noscript must use instead
      var DOMReady = function DOMReady(callableFunction) {
        var eventName = 'addEventListener';
        document[eventName]
          ? document[eventName]('DOMContentLoaded', callableFunction)
          : // @ts-ignore
            window.attachEvent('onload', callableFunction);
      };

      DOMReady(function () {
        tryError(function () {
          var encode = encodeURIComponent;

          /** @type {ModeOfRequest} */
          var mode = 'il';

          var params = [
            'm=' + mode,
            'i=' + initializeData.i,
            'u=' + encode(window.location.href),
            'r=' + encode(document.referrer),
          ];

          var mainArticleTag = document.querySelector('main');
          if (mainArticleTag && mainArticleTag.getAttribute('data-id')) {
            params.push('mid=' + encode(mainArticleTag.getAttribute('data-id')));
          }
          var canonicalTag = document.querySelector('link[rel=canonical]');
          if (canonicalTag && canonicalTag.getAttribute('href')) {
            params.push('cn=' + encode(canonicalTag.getAttribute('href')));
          }

          var imgTag = document.createElement('img');
          imgTag.src = initializeData.s + '/?' + params.join('&');
          imgTag.width = 1;
          imgTag.height = 1;
          imgTag.alt = '';
          imgTag.setAttribute('style', 'display:none');

          firstScript.parentNode.insertBefore(imgTag, firstScript);
        });
      });
    });
  }
// @ts-ignore
)(window, document, __INITIALIZE_DATA__);
