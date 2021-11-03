// @ts-check

(async function (window, document) {
  /**
   * @param {String} message
   * @param {Error|any} err
   */
  var errorLog = function errorLog(message, err) {
    console.group('aasaam analytics: ' + message);
    console.error(err);
    console.groupEnd();
  };

  if (!window.aasaamAnalytics) {
    /**
     * @param {InitializeData} initData
     */
    window.aasaamAnalytics = function aasaamAnalytics(initData) {
      /**
       * @see {@link encodeURIComponent}
       */
      var encode = encodeURIComponent;

      /**
       * @var {aasaamAnalytics}
       */
      var instance = this;

      /**
       * @type {PageData}
       */
      var defaultPageData;

      /**
       * @type {GetParams}
       */
      var defaultPageParams = {
        i: initData.i,
        u: window.location.href,
        r: document.referrer,
      };

      /**
       * @var {Number}
       */
      var newVisitTime = initData.nvs ? initData.nvs * 1000 : 3600;

      /**
       * @var {String}
       */
      var storagePrefix = initData.p ? initData.p : 'aai';

      /**
       * @type {EventData[]}
       */
      var events = [];

      /**
       * @param {String} name
       * @param {any} value
       * @param {Number} ttl
       * @returns {void}
       */
      var cacheSet = function cacheSet(name, value, ttl) {
        var key = storagePrefix + '_' + name;
        localStorage.setItem(
          key,
          JSON.stringify({
            e: new Date().getTime() + ttl * 1000,
            d: value,
          })
        );
      };

      /**
       * @param {String} name
       * @returns {undefined|any}
       */
      var cacheGet = function cacheGet(name) {
        var key = storagePrefix + '_' + name;
        var cacheData = localStorage.getItem(key);
        if (cacheData) {
          try {
            var cacheObject = JSON.parse(cacheData);
            if (cacheObject.e > new Date().getTime()) {
              return cacheObject.d;
            }
          } catch (e) {
            errorLog('cache', e);
          }
        }
        return undefined;
      };

      /**
       * @param {String} referrer
       * @returns {String}
       */
      var referrerState = function referrerState(referrer) {
        var cacheName = 'rs';
        var cacheData = cacheGet(cacheName);
        if (cacheData) {
          return cacheData;
        }
        cacheSet(cacheName, referrer, newVisitTime);
        return referrer;
      };

      /**
       * @param {String} str
       * @returns {String}
       */
      var trimString = function trimString(str) {
        return str.replace(/[\n\s\r]+/g, ' ').trim();
      };

      /**
       * @param {String} string
       * @returns {Boolean}
       */
      var isValidURL = function isValidURL(string) {
        var mightURL;

        try {
          mightURL = new URL(string);
        } catch (_) {
          return false;
        }

        return mightURL.protocol === 'http:' || mightURL.protocol === 'https:';
      };

      /**
       * @param {String} str
       * @returns {String}
       */
      var escapeStringRegexp = function escapeStringRegexp(str) {
        return str
          .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
          .replace(/-/g, '\\x2d');
      };

      /**
       * @param {Object} data
       * @param {ModeOfRequest} mode
       */
      var sendData = function sendData(data, mode) {
        window.navigator.sendBeacon(
          initData.s +
            '/?m=' +
            encode(mode) +
            '&i=' +
            encode(defaultPageParams.i) +
            '&mid=' +
            encode(defaultPageParams.mid) +
            '&r=' +
            encode(defaultPageParams.r) +
            '&cn=' +
            encode(defaultPageParams.cn) +
            '&u=' +
            encode(defaultPageParams.u),
          JSON.stringify(data)
        );
      };

      /**
       * @returns {void}
       */
      var sendEvents = function sendEvents() {
        if (events.length) {
          var data = {
            c: clientIdentifier,
            p: defaultPageData,
            e: events,
          };
          sendData(data, 'jse');
          events = [];
        }
      };

      /**
       * @returns {String}
       */
      var randomString = function randomString() {
        return (
          new Date().getTime().toString(32) +
          Math.random().toString(32).substr(2)
        ).substr(0, 16);
      };

      /**
       * @param {*} value
       * @returns {String}
       */
      var getTag = function getTag(value) {
        if (value == null) {
          return value === undefined ? '[object Undefined]' : '[object Null]';
        }
        return toString.call(value);
      };

      /**
       * @param {any} value
       * @returns {Boolean}
       */
      var isString = function isString(value) {
        const type = typeof value;
        return (
          type === 'string' ||
          (type === 'object' &&
            value != null &&
            !Array.isArray(value) &&
            getTag(value) == '[object String]')
        );
      };

      /**
       * @param {Date?} [initDate]
       * @param {String?} [random]
       */
      var generateClientIdentifier = function generateClientIdentifier(
        initDate,
        random
      ) {
        return window.btoa(
          [
            Math.round(
              initDate ? initDate.getTime() / 1000 : new Date().getTime() / 1000
            ).toString(),
            Math.round(new Date().getTime() / 1000).toString(),
            random ? random : randomString(),
          ].join(':')
        );
      };

      /**
       * @param {String} cid
       * @returns {[Date|Boolean, Date|Boolean, String|Boolean]}
       */
      var parseClientIdentifierCreationTime =
        function parseClientIdentifierCreationTime(cid) {
          try {
            var matchedTimePart = window
              .atob(cid)
              .match(new RegExp('([a-z0-9]+):([a-z0-9]+):([a-z0-9]+)'));
            if (matchedTimePart) {
              return [
                new Date(parseInt(matchedTimePart[1], 10)),
                new Date(parseInt(matchedTimePart[2], 10)),
                matchedTimePart[3],
              ];
            }
          } catch (e) {
            errorLog('cannot parse client id', e);
          }

          return [false, false, false];
        };

      /**
       * @param {String} cid
       */
      var setClientIdentifier = function setClientIdentifier(cid) {
        const expires = new Date();
        expires.setDate(expires.getDate() + 365);
        document.cookie =
          storagePrefix +
          '=' +
          cid +
          ';Expires=' +
          expires.toUTCString() +
          ';Path=/;SameSite=lax';
        localStorage.setItem(storagePrefix, cid);
      };

      /**
       * @param {any} value
       * @returns {Boolean}
       */
      var isFiniteNumber = function isFiniteNumber(value) {
        return typeof value === 'number' && isFinite(value);
      };

      /**
       * @return {String}
       */
      var getClientIdentifier = function getClientIdentifier() {
        try {
          var clientIdentifierFound = [];

          // localStorage
          var localStorageClientIdentifier =
            localStorage.getItem(storagePrefix);

          if (localStorageClientIdentifier) {
            clientIdentifierFound[0] = localStorageClientIdentifier;
          }

          // cookie
          var cookieClientIdentifierMatched = document.cookie.match(
            new RegExp(escapeStringRegexp(storagePrefix) + '=([^;]+)')
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
            setClientIdentifier(clientIdentifierFound[0]);
            return clientIdentifierFound[0];
          }
        } catch (e) {
          // new user so will not need to error log
          // errorLog('cannot get client id', e);
        }

        // none exist
        return '';
      };

      /**
       * @returns {Promise<Object>}
       */
      var getWindowPerformance = async function getWindowPerformance() {
        return new Promise(function (resolve) {
          const timingInfo = window.performance;
          setTimeout(() => {
            // @ts-ignore
            if (!timingInfo || timingInfo.navigationStart === 0) {
              return resolve(undefined);
            }
            resolve(timingInfo.toJSON());
          }, 100);
        });
      };

      /**
       * @param {PerformanceEntry} timing
       * @param {String} startEvent
       * @param {String} endEvent
       * @returns {String|undefined}
       */
      var processTiming = function processTiming(timing, startEvent, endEvent) {
        var metric =
          endEvent === undefined
            ? timing[startEvent]
            : timing[endEvent] - timing[startEvent];
        if (isFiniteNumber(metric) && metric >= 0) {
          return metric.toString();
        }
        return undefined;
      };

      /**
       * @returns {Promise<GeographyData|undefined>}
       */
      var getGeoData = async function getGeoData() {
        return new Promise(function (resolve) {
          var cacheName = 'geo';
          var cacheData = cacheGet(cacheName);
          if (cacheData) {
            return resolve(cacheData);
          }
          var maximumAgeSeconds = initData.glt ? initData.glt : 604800;
          navigator.geolocation.getCurrentPosition(
            function getCurrentPosition(position) {
              var geo = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                acc: position.coords.accuracy,
              };
              cacheSet(cacheName, geo, maximumAgeSeconds);
              resolve(geo);
            },
            function error(e) {
              resolve(undefined);
              // many user disallow share location so error will not needed
              // errorLog('geo info failed', e);
            },
            {
              maximumAge: maximumAgeSeconds * 1000,
              timeout: initData.gto ? initData.gto * 1000 : 10000,
              enableHighAccuracy: true,
            }
          );
        });
      };

      /**
       * @param {PageViewPayload} payloadInput
       * @returns {Promise<PageData>}
       */
      var processPageData = async function processPageData(payloadInput) {
        var payload = payloadInput ? payloadInput : {};

        /**
         * @type {PageData}
         */
        var pageData = {
          // screen size
          scr: window.screen.width + 'x' + window.screen.height,

          // viewport size
          vps: window.innerWidth + 'x' + window.innerHeight,

          // color depth
          cd: window.screen.colorDepth.toString(),

          // title
          t: trimString(document.title),

          // keywords
          k: undefined,

          // referer state
          rs: undefined,

          // device pixel ratio
          dpr: window.devicePixelRatio
            ? window.devicePixelRatio.toString()
            : '1',

          // iframe
          if: window.self !== window.top,

          // screen orientation
          so: undefined,

          // page performance
          prf: {},

          // location
          geo: undefined,

          // user name/id
          usr: undefined,
        };

        /**
         * screen orientation
         */
        if (window.screen.orientation && window.screen.orientation.type) {
          pageData.so = window.screen.orientation.type
            .split('-')
            .map(function (n) {
              return n.substr(0, 1);
            })
            .join('-');
        }

        var pagePerformanceData = await getWindowPerformance();

        if (pagePerformanceData) {
          // PAGE_LOAD_TIME
          pageData.prf.plt = processTiming(
            pagePerformanceData.timing,
            'navigationStart',
            'loadEventStart'
          );
          // DOMAIN_LOOKUP_TIME
          pageData.prf.dlt = processTiming(
            pagePerformanceData.timing,
            'domainLookupStart',
            'domainLookupEnd'
          );
          // TCP_CONNECT_TIME
          pageData.prf.tct = processTiming(
            pagePerformanceData.timing,
            'connectStart',
            'connectEnd'
          );
          // SERVER_RESPONSE_TIME
          pageData.prf.srt = processTiming(
            pagePerformanceData.timing,
            'requestStart',
            'responseStart'
          );
          // PAGE_DOWNLOAD_TIME
          pageData.prf.pdt = processTiming(
            pagePerformanceData.timing,
            'responseStart',
            'responseEnd'
          );
          // REDIRECT_TIME
          pageData.prf.rt = processTiming(
            pagePerformanceData.timing,
            'navigationStart',
            'fetchStart'
          );
          // DOM_INTERACTIVE_TIME
          pageData.prf.dit = processTiming(
            pagePerformanceData.timing,
            'navigationStart',
            'domInteractive'
          );
          // CONTENT_LOAD_TIME
          pageData.prf.clt = processTiming(
            pagePerformanceData.timing,
            'navigationStart',
            'domContentLoadedEventStart'
          );
        }

        /**
         * URL
         */
        if (payload.url) {
          if (isValidURL(payload.url)) {
            defaultPageParams.u = payload.url;
          } else {
            errorLog('URL must valid http(s) uri', payload.url);
          }
        }

        /**
         * User name/id
         */
        if (payload.user) {
          if (isString(payload.user)) {
            pageData.usr = payload.user;
          } else {
            errorLog('User name/id must be string', payload.user);
          }
        }

        /**
         * geolocation
         */
        if (payload.geo === true) {
          // user permission and cache
          getGeoData()
            .then(function (geo) {
              pageData.geo = geo;
            })
            .catch(function () {});
        } else if (
          // for inject variables
          payload.geo &&
          payload.geo.lat &&
          payload.geo.lon &&
          payload.geo.acc
        ) {
          pageData.geo = payload.geo;
        }

        /**
         * referrer
         */
        var referrer = document.referrer;
        if (payload.referrer) {
          referrer = payload.referrer;
        }
        if (referrer) {
          if (isValidURL(referrer)) {
            defaultPageParams.r = referrer;
            pageData.rs = referrerState(referrer);
          } else {
            errorLog('referrer is not valid URL', canonical);
          }
        }

        /**
         * canonical
         */
        var canonical = undefined;
        if (payload.canonical) {
          canonical = payload.canonical;
        } else {
          var canonicalTag = document.querySelector('link[rel=canonical]');
          if (canonicalTag && canonicalTag.hasAttribute('href')) {
            canonical = trimString(canonicalTag.getAttribute('href'));
          }
        }
        if (canonical) {
          if (isValidURL(canonical)) {
            defaultPageParams.cn = canonical;
          } else {
            errorLog('canonical is not valid URL', canonical);
          }
        }

        /**
         * title
         */
        if (payload.title && isString(payload.title)) {
          pageData.t = payload.title;
        } else {
          var titleTagOG = document.querySelector('meta[property="og:title"]');
          if (titleTagOG && titleTagOG.hasAttribute('content')) {
            pageData.t = trimString(titleTagOG.getAttribute('content'));
          }
        }

        /**
         * keywords
         */
        var keywords = [];
        if (payload.keywords) {
          if (Array.isArray(payload.keywords)) {
            keywords = payload.keywords;
          } else {
            errorLog('keywords must be array of string', canonical);
          }
        } else {
          var metaKeywords = document.querySelector('meta[name=keywords]');
          if (metaKeywords && metaKeywords.hasAttribute('content')) {
            keywords = trimString(metaKeywords.getAttribute('content')).split(
              ','
            );
          }
        }
        if (keywords.length) {
          pageData.k = keywords
            .map(function (k) {
              return k.trim();
            })
            .slice(0, 10)
            .join(',');
        }

        /**
         * main identifier
         */
        if (payload.mainID) {
          if (isString(payload.mainID)) {
            defaultPageParams.mid = payload.mainID;
          } else {
            errorLog('main identifier must string', canonical);
          }
        } else {
          var mainTag = document.querySelector('main');
          if (mainTag && mainTag.hasAttribute('data-id')) {
            defaultPageParams.mid = mainTag.getAttribute('data-id');
          }
        }

        // set default page data
        defaultPageData = JSON.parse(JSON.stringify(pageData));

        return pageData;
      };

      /**
       * @var {String}
       */
      var clientIdentifier = getClientIdentifier();

      // exist
      if (clientIdentifier) {
        var clientParted = parseClientIdentifierCreationTime(clientIdentifier);
        var initVisitDate = clientParted[0];
        var dayVisitDate = clientParted[1];
        var randomPart = clientParted[2];
        var newVisitDateTime = new Date();
        newVisitDateTime.setTime(
          newVisitDateTime.getTime() - newVisitTime * 1000
        );
        // if user not seen page tody
        if (dayVisitDate < newVisitDateTime) {
          // generate new one base on random and same initialize visit
          clientIdentifier = generateClientIdentifier(
            // @ts-ignore
            initVisitDate,
            randomPart
          );
          // set to storage
          setClientIdentifier(clientIdentifier);
        }
      } else {
        // new one
        clientIdentifier = generateClientIdentifier();
        setClientIdentifier(clientIdentifier);
      }

      /**
       * @param {PageViewPayload} [payload]
       * @returns {Promise<aasaamAnalyticsInstance>}
       */
      instance.pageView = async function pageView(payload) {
        var data = await processPageData(payload);
        defaultPageData = data;
        sendData(
          {
            c: clientIdentifier,
            p: data,
          },
          'jsp'
        );
        // initialize event
        if (window.aae && Array.isArray(window.aae)) {
          window.aae.forEach(function (initializeEvent) {
            instance.event(initializeEvent);
          });
          window.aae = [];
        }
        return instance;
      };

      /**
       * @param {EventItem} payload
       * @returns {aasaamAnalyticsInstance}
       */
      instance.event = function event(payload) {
        if (!isString(payload.category) || payload.category.length < 1) {
          errorLog(
            'Event "category" must exist and none empty string',
            payload
          );
          return instance;
        }
        if (!isString(payload.action) || payload.action.length < 1) {
          errorLog('Event "action" must exist and none empty string', payload);
          return instance;
        }
        if (payload.label !== undefined && !isString(payload.label)) {
          errorLog('Event "label" must be none empty string', payload);
          return instance;
        }
        if (payload.value !== undefined && isNaN(payload.value)) {
          errorLog('Event "value" must be numeric type', payload);
          return instance;
        }
        events.push({
          ec: payload.category,
          ea: payload.action,
          el: payload.label ? payload.label : undefined,
          ev: payload.value !== undefined ? payload.value : undefined,
        });
        if (events.length >= 50) {
          sendEvents();
        } else {
          eventSender();
        }
        return instance;
      };

      var sendTimer;
      var eventSender = function eventSender() {
        window.clearTimeout(sendTimer);
        sendTimer = window.setTimeout(function () {
          sendEvents();
        }, 1000);
      };

      if (initData.pv) {
        instance
          .pageView(initData.pv === true ? undefined : initData.pv)
          .then()
          .catch((e) => errorLog(e));
      }

      return instance;
    };
  }

  if (!window.aai) {
    if (document.currentScript && document.currentScript.hasAttribute('data-i')) {
      var initData;
      try {
        initData = JSON.parse(
          window.atob(document.currentScript.getAttribute('data-i'))
        );
        window.aai = window.aasaamAnalytics(initData);
      } catch (e) {
        errorLog('initialize', e);
      }
    }
  }
})(window, document);
