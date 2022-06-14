// @ts-check
(function (
  /** @type {Document} */
  document,
  /** @type {InitializeData} */
  initializeData
) {
  var firstScript = document.getElementsByTagName('script')[0];
  var aasaamAnalyticScript = document.createElement('script');
  aasaamAnalyticScript.async = true;
  aasaamAnalyticScript.setAttribute(
    'data-i',
    btoa(encodeURIComponent(JSON.stringify(initializeData)))
  );
  aasaamAnalyticScript.src = initializeData.s + '/a.js';
  firstScript.parentNode.insertBefore(aasaamAnalyticScript, firstScript);
})(
  document,
  // @ts-ignore
  __INITIALIZE_DATA__
);
