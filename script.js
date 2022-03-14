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
  window.aai = {
    cid: function () {
      return undefined;
    },
    event: function () {
      return undefined;
    },
    pageView: function () {
      return undefined;
    },
  };

  var firstScript = document.getElementsByTagName('script')[0];
  var aasaamAnalyticScript = document.createElement('script');
  aasaamAnalyticScript.async = true;

  // modern browser
  // condition for modern browser detect about ~ 90% total users
  // https://caniuse.com/mdn-javascript_builtins_promise_any
  if (
    'URLSearchParams' in window &&
    'entries' in Object &&
    'Promise' in window &&
    'any' in Promise
  ) {
    aasaamAnalyticScript.setAttribute(
      'data-i',
      window.btoa(encodeURIComponent(JSON.stringify(initializeData)))
    );
    aasaamAnalyticScript.src = initializeData.s + '/a.js';
  } else {
    // legacy browsers
    window.aai_lid = initializeData;
    aasaamAnalyticScript.src = initializeData.s + '/l.js';
  }

  firstScript.parentNode.insertBefore(aasaamAnalyticScript, firstScript);
})(
  window,
  document,
  // @ts-ignore
  __INITIALIZE_DATA__
);
