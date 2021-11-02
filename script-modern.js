// @ts-check
/**
 * @param {window} window
 * @param {document} document
 * @param {InitializeData} initializeData
 * @returns
 */
(function (window, document, initializeData) {
  if ('Promise' in window && 'any' in Promise) {
    var firstScript = document.getElementsByTagName('script')[0];
    var aasaamAnalyticScript = document.createElement('script');
    aasaamAnalyticScript.setAttribute(
      'data-i',
      window.btoa(JSON.stringify(initializeData))
    );
    aasaamAnalyticScript.async = true;
    aasaamAnalyticScript.src = initializeData.s + '/a.js';
    firstScript.parentNode.insertBefore(aasaamAnalyticScript, firstScript);
  }
  // @ts-ignore
})(window, document, __INITIALIZE_DATA__);
