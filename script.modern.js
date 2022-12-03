// @ts-check
(function (
  /** @type {Window} */
  window,
  /** @type {Document} */
  document,
  /** @type {InitializeData} */
  initializeData
) {
  var firstScript = document.querySelector('script');
  var aasaamAnalyticScript = document.createElement('script');
  aasaamAnalyticScript.async = true;
  aasaamAnalyticScript.defer = true;

  var prefix =
    'https://' +
    initializeData.s +
    '/_/' +
    new Date().toISOString().split('T')[0].replace(/-/g, '');

  aasaamAnalyticScript.setAttribute(
    'data-i',
    window.btoa(encodeURIComponent(JSON.stringify(initializeData)))
  );
  aasaamAnalyticScript.src = prefix + '/a.js';

  firstScript.parentNode.insertBefore(aasaamAnalyticScript, firstScript);
})(
  window,
  document,
  // @ts-ignore
  __INITIALIZE_DATA__
);
