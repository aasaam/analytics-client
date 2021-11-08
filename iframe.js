// @ts-check
(function (window, document, Date) {
  /**
   * @param {String} cid
   * @returns {[String|Boolean, Date|Boolean, Date|Boolean, String|Boolean]}
   */
  var parseClientIdentifierCreationTime =
    function parseClientIdentifierCreationTime(cid) {
      try {
        var matchedTimePart = window
          .atob(cid)
          .match(new RegExp('([a-z]{1}):([a-z0-9]+):([a-z0-9]+):([a-z0-9]+)'));
        if (matchedTimePart) {
          return [
            matchedTimePart[1],
            new Date(parseInt(matchedTimePart[2], 10) * 1000),
            new Date(parseInt(matchedTimePart[3], 10) * 1000),
            matchedTimePart[4],
          ];
        }
      } catch (e) {
        console.error(e);
      }

      return [false, false, false, false];
    };

  /**
   * @returns {String}
   */
  var randomString = function randomString() {
    return (
      new Date().getTime().toString(32) + Math.random().toString(32).substr(2)
    ).substr(0, 16);
  };

  /**
   * @param {String} [modeOfClientID]
   * @param {Date} [initDate]
   * @param {String} [random]
   */
  var generateClientIdentifier = function generateClientIdentifier(
    modeOfClientID,
    initDate,
    random
  ) {
    return window.btoa(
      [
        modeOfClientID ? modeOfClientID : 'c',
        Math.round(
          initDate ? initDate.getTime() / 1000 : new Date().getTime() / 1000
        ).toString(),
        Math.round(new Date().getTime() / 1000).toString(),
        random ? random : randomString(),
      ].join(':')
    );
  };

  /**
   * @param {String} keyName
   * @param {String} cid
   */
  var setClientIdentifier = function setClientIdentifier(keyName, cid) {
    var expires = new Date();
    expires.setDate(expires.getDate() + 365);
    document.cookie =
      keyName +
      '=' +
      cid +
      ';Expires=' +
      expires.toUTCString() +
      ';Path=/;SameSite=None;Secure';
    localStorage.setItem(keyName, cid);
  };

  /**
   * @param {String} str
   * @returns {String}
   */
  var escapeStringRegexp = function escapeStringRegexp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
  };

  /**
   * @param {String} prefix
   * @return {String}
   */
  var getClientIdentifier = function getClientIdentifier(prefix) {
    try {
      var clientIdentifierFound = [];

      // localStorage
      var localStorageClientIdentifier = localStorage.getItem(prefix);

      if (localStorageClientIdentifier) {
        clientIdentifierFound[0] = localStorageClientIdentifier;
      }

      // cookie
      var cookieClientIdentifierMatched = document.cookie.match(
        new RegExp(escapeStringRegexp(prefix) + '=([^;]+)')
      );
      if (cookieClientIdentifierMatched) {
        clientIdentifierFound[1] = cookieClientIdentifierMatched[1].trim();
      }

      // both exist
      if (
        clientIdentifierFound.length === 2 &&
        clientIdentifierFound[0] === clientIdentifierFound[1]
      ) {
        return clientIdentifierFound[0];
      }

      // one exist so set it again
      if (clientIdentifierFound.length === 1) {
        setClientIdentifier(prefix, clientIdentifierFound[0]);
        return clientIdentifierFound[0];
      }
    } catch (e) {
      // new user so will not need to error log
      // errorLog('cannot get client id', e);
    }

    // none exist
    return '';
  };

  try {
    var u = new URL(window.location.href);
    var prefix = 'aai_ift';
    var url = u.searchParams.get('u');
    var newVisitTime = parseInt(u.searchParams.get('nvs'), 10);

    /**
     * @var {String}
     */
    var clientIdentifier = getClientIdentifier(prefix);

    var needNewClientIdentifier = true;

    // exist
    if (clientIdentifier) {
      var clientParted = parseClientIdentifierCreationTime(clientIdentifier);
      if (clientParted.length === 4 && clientParted[0] !== false) {
        var modeOfClientID = clientParted[0];
        var initVisitDate = clientParted[1];
        var dayVisitDate = clientParted[2];
        var randomPart = clientParted[3];
        var newVisitDateTime = new Date();
        newVisitDateTime.setTime(
          newVisitDateTime.getTime() - newVisitTime * 1000
        );
        needNewClientIdentifier = false;
        // if user not seen page tody
        if (dayVisitDate < newVisitDateTime) {
          // generate new one base on random and same initialize visit
          clientIdentifier = generateClientIdentifier(
            // @ts-ignore
            modeOfClientID,
            // @ts-ignore
            initVisitDate,
            randomPart
          );
          // set to storage
          setClientIdentifier(prefix, clientIdentifier);
        }
      }
    }

    // new client identifier required
    if (needNewClientIdentifier) {
      clientIdentifier = generateClientIdentifier();
      setClientIdentifier(prefix, clientIdentifier);
    }

    parent.postMessage(
      {
        aasaamAnalyticsClientIdentifier: clientIdentifier,
      },
      url
    );
  } catch (e) {
    console.error(e);
    // nothing
  }
})(window, document, Date);
