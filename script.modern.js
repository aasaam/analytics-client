// @ts-check
(function (
  /** @type {Document} */
  document,
  /** @type {InitializeData} */
  initializeData
) {
  var firstScript = document.querySelector('script');
  var aasaamAnalyticScript = document.createElement('script');
  aasaamAnalyticScript.async = true;

  var prefix =
    'https://' +
    initializeData.s +
    '/_/' +
    new Date()
      .toISOString()
      .split('T')[0]
      .replace(/[^0-9]/g, '');

  aasaamAnalyticScript.setAttribute(
    'data-i',
    btoa(encodeURIComponent(JSON.stringify(initializeData)))
  );
  aasaamAnalyticScript.src = prefix + '/a.js';

  firstScript.parentNode.insertBefore(aasaamAnalyticScript, firstScript);
})(
  document,
  // @ts-ignore
  __INITIALIZE_DATA__
);
