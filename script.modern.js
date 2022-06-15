// @ts-check
(function (
  /** @type {Window} */
  window,
  /** @type {Document} */
  document,
  /** @type {InitializeData} */
  initializeData
) {
  // prevent error if not loaded
  var notImplemented = function () {
    return undefined;
  };
  window.aai = {
    cid: notImplemented,
    event: notImplemented,
    pageView: notImplemented,
  };

  var firstScript = document.getElementsByTagName('script')[0];
  var aasaamAnalyticScript = document.createElement('script');
  aasaamAnalyticScript.async = true;
  aasaamAnalyticScript.setAttribute(
    'data-i',
    window.btoa(encodeURIComponent(JSON.stringify(initializeData)))
  );
  aasaamAnalyticScript.src = 'https://' + initializeData.s + '/a.js';
  firstScript.parentNode.insertBefore(aasaamAnalyticScript, firstScript);
})(
  window,
  document,
  // @ts-ignore
  __INITIALIZE_DATA__
);
