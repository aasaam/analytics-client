// @ts-check
(function (
  /** @type {Window} */
  window,
  /** @type {Document} */
  document,
  /** @type {Performance} */
  performance,
  /** @type {Navigator} */
  navigator,
  /** @type {Console} */
  console,
  /** @type {Storage} */
  localStorage
) {
  const collectorURL = '__COLLECTOR_URL__';
  let publicInstanceID = '';

  const getCircularReplacer = () => {
    const seen = new WeakSet();
    /**
     * @param {String} key
     * @param {any} value
     */
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  /**
   * @param {any} o
   * @returns {String}
   */
  const safeStringify = function safeStringify(o) {
    return JSON.stringify(o, getCircularReplacer());
  };

  /**
   * @param {String} message
   * @param {Error|any} err
   */
  const errorLog = function errorLog(message, err) {
    console.group('aasaam-analytics:error:' + message);
    if (err instanceof Error) {
      console.error(err);
    } else if (err) {
      console.warn(err);
    }
    console.groupEnd();
    const sendURL = new URL(collectorURL);
    sendURL.searchParams.set('m', 'err');
    sendURL.searchParams.set('i', publicInstanceID);
    sendURL.searchParams.set('u', window.location.href);
    navigator.sendBeacon(
      sendURL.toString(),
      safeStringify({
        msg: message,
        err: err
          ? JSON.stringify(err, Object.getOwnPropertyNames(err))
          : undefined
      })
    );
  };

  if (!window.aasaamAnalytics) {
    const debugMode = localStorage.getItem('aasaam-analytics:debug') === 'on';

    /**
     * @param  {any} o
     */
    const debugLog = function debugLog(o) {
      if (debugMode) {
        console.debug(o);
      }
    };

    /**
     * @param {String} str
     * @returns {String}
     */
    const escapeRegExp = function escapeRegExp(str) {
      return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
    };

    /**
     * @param {GeographyData|any} obj
     * @return {GeographyData|undefined}
     */
    const sanitizeGeographyData = function sanitizeGeographyData(obj) {
      if (
        typeof obj === 'object' &&
        isFiniteNumber(obj.lat) &&
        isFiniteNumber(obj.lon) &&
        Math.abs(obj.lat) <= 90 &&
        Math.abs(obj.lon) <= 180
      ) {
        return obj;
      }
    };

    /**
     * @param {Number} maximumAge
     * @param {Number} timeout
     * @param {Boolean} enableHighAccuracy
     * @returns {Promise<GeographyData>}
     */
    const getGeoLocation = async function getGeoLocation(
      maximumAge,
      timeout,
      enableHighAccuracy
    ) {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(
          function getCurrentPosition(position) {
            /** @type {GeographyData} */
            const geo = {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            };
            resolve(geo);
          },
          function error(e) {
            reject(e);
          },
          {
            maximumAge: maximumAge,
            timeout: timeout,
            enableHighAccuracy: enableHighAccuracy
          }
        );
      });
    };

    /**
     * @private
     * @param {String} data
     * @returns {Object}
     */
    const storageParse = function storageParse(data) {
      if (data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          errorLog('storageParse', e);
        }
      }
      return {};
    };

    /**
     * @param {String} prefix
     * @return {StorageData}
     */
    const storageInitialize = function storageInitialize(prefix) {
      let storageData = {};
      const localStorageData = localStorage.getItem(prefix);
      if (localStorageData) {
        storageData = storageParse(localStorageData);
      } else {
        const cookieMatched = document.cookie.match(
          new RegExp(escapeRegExp(prefix) + '=([a-zA-Z0-9=+/]+)')
        );
        if (cookieMatched) {
          storageData = storageParse(window.atob(trimString(cookieMatched[1])));
        }
      }
      return storageData;
    };

    /**
     * @param {String} prefix
     * @param {String} name
     * @param {StorageValue} value
     * @param {Number?} [ttl]
     */
    const storageSet = function storageSet(prefix, name, value, ttl) {
      // load
      const storageData = storageInitialize(prefix);

      // update/inject item
      /** @type {StorageItem} */
      const item = {
        v: value,
        e: ttl ? Date.now() + ttl * 1000 : 86400000
      };

      // save
      storageData[name] = item;

      // localStorage
      localStorage.setItem(prefix, safeStringify(storageData));

      // cookie
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie =
        prefix +
        '=' +
        window.btoa(safeStringify(storageData)) +
        ';Expires=' +
        expires.toUTCString() +
        ';Path=/;SameSite=Lax';
    };

    /**
     * @param {String} prefix
     * @param {String} name
     * @return {StorageValue}
     */
    const storageGet = function storageGet(prefix, name) {
      const storageData = storageInitialize(prefix);
      if (storageData[name]) {
        /** @type {StorageItem} */
        const item = storageData[name];
        if (item.e && item.e <= Date.now()) {
          return undefined;
        }
        return item.v;
      }
    };

    /**
     * @param {String} str
     * @returns {String}
     */
    const trimString = function trimString(str) {
      if (isString(str)) {
        return str.replace(/[\n\s\r]+/g, ' ').trim();
      }
      return '';
    };

    /**
     * @param {any} value
     * @returns {Boolean}
     */
    const isFiniteNumber = function isFiniteNumber(value) {
      return typeof value === 'number' && isFinite(value);
    };

    /**
     * @param {any} str
     * @returns {Boolean}
     */
    const isValidURL = function isValidURL(str) {
      try {
        const mightURL = new URL(str);
        return /^http/.test(mightURL.protocol);
      } catch (_) {}
      return false;
    };

    /**
     * @param {any} value
     * @returns {Boolean}
     */
    const isString = function isString(value) {
      const type = typeof value;
      return (
        type === 'string' ||
        (type === 'object' &&
          value != null &&
          !Array.isArray(value) &&
          getObjectTag(value) == '[object String]')
      );
    };

    /**
     * @param {any} value
     * @returns {Boolean}
     */
    const isFillString = function isFillString(value) {
      return isString(value) && trimString(value).length > 0;
    };

    /**
     * @param {any} value
     * @returns {Boolean}
     */
    const isIDString = function isIDString(value) {
      return isFillString(value) && /^[a-zA-Z0-9-_\/]{1,63}$/.test(value);
    };

    /**
     * @param {String} name
     * @returns {Boolean}
     */
    const isSanitizeName = function isSanitizeName(name) {
      return isFillString(name) && /^[a-z0-9_]{1,31}$/.test(name);
    };

    /**
     * @returns {String}
     */
    const randomString = function randomString() {
      return (
        new Date().getTime().toString(32) +
        Math.random().toString(32).substring(2)
      ).substring(0, 16);
    };

    /**
     * @param {any} value
     * @returns {String}
     */
    const getObjectTag = function getObjectTag(value) {
      if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
      }
      return toString.call(value);
    };

    /**
     * @param {EventDataBuffer[]} arr
     * @returns {EventDataGroup}
     */
    const eventDataBufferGroupBy = function eventDataBufferGroupBy(arr) {
      return arr.reduce(function reduceArray(rv, x) {
        (rv[x.i] = rv[x.i] || []).push(x);
        return rv;
      }, {});
    };

    /**
     * @returns {PageTitle}
     */
    const getPageTitle = function getPageTitle() {
      let pageTitle = document.title;
      const titleTagOG = document.querySelector('meta[property="og:title"]');
      if (titleTagOG && titleTagOG.hasAttribute('content')) {
        pageTitle = titleTagOG.getAttribute('content');
      }
      return trimString(pageTitle);
    };

    /**
     * @returns {PageLanguage}
     */
    const getPageLanguage = function getPageLanguage() {
      let pageLanguage = document.documentElement.lang;
      const langAttribute = document.querySelector('html[lang]');
      if (langAttribute && langAttribute.hasAttribute('lang')) {
        pageLanguage = langAttribute.getAttribute('lang');
      }
      return trimString(pageLanguage);
    };

    /**
     * @returns {PageKeywords[]}
     */
    const getKeywords = function getKeywords() {
      let keywords = [];
      const metaKeywords = document.querySelector('meta[name=keywords]');
      if (metaKeywords && metaKeywords.hasAttribute('content')) {
        keywords = trimString(metaKeywords.getAttribute('content')).split(',');
      }
      return keywords;
    };

    /**
     * @returns {CanonicalURL}
     */
    const getCanonicalURL = function getCanonicalURL() {
      const canonicalTag = document.querySelector('link[rel=canonical]');
      if (canonicalTag && canonicalTag.hasAttribute('href')) {
        const canonicalURL = canonicalTag.getAttribute('href');
        if (isValidURL(canonicalURL)) {
          return canonicalURL;
        }
        errorLog('canonicalURL', canonicalURL);
      }
    };

    /**
     * @param {Segment[]} segments
     * @returns {SegmentPayload}
     */
    const sanitizeSegments = function sanitizeSegments(segments) {
      if (!Array.isArray(segments)) {
        return undefined;
      }

      const validScopes = [1, 2, 3, 4, 5];
      /** @type {SegmentPayload} */
      const result = {};
      segments.forEach((s) => {
        const name = trimString(s.n);
        const value = trimString(s.v);
        // @ts-ignore
        const scope = parseInt(s.s);
        if (
          validScopes.includes(scope) &&
          name &&
          isSanitizeName(name) &&
          value
        ) {
          result[`s${scope}n`] = name;
          result[`s${scope}v`] = value;
        } else {
          debugLog(['invalid segment', s]);
        }
      });
      return Object.keys(result).length ? result : undefined;
    };

    /**
     * @param {String|Number} inp
     * @returns {Boolean}
     */
    const isValidTaxonomyID = function isValidTaxonomyID(inp) {
      let valid = false;
      let number = -1;
      if (typeof inp === 'string' && /^[0-9]+$/.test(inp)) {
        number = parseInt(inp, 10);
      } else if (typeof inp === 'number' && Number.isInteger(inp)) {
        number = inp;
      }
      return number > 0 && number <= 65535;
    };

    /**
     * @returns {MainEntityProps}
     */
    const getMainEntity = function getMainEntity() {
      /** @type {MainEntityProps} */
      const mainEntity = {
        i: '',
        m: ''
      };
      const mainTag = document.querySelector('main');
      if (mainTag) {
        const id = trimString(mainTag.getAttribute('data-entity-id'));
        const module = trimString(mainTag.getAttribute('data-entity-module'));
        if (id.length >= 1 && module.length >= 1) {
          let taxonomy;
          const taxonomyValue = mainTag.getAttribute('data-entity-taxonomy');
          if (isValidTaxonomyID(taxonomyValue)) {
            taxonomy = taxonomyValue;
          }
          if (isIDString(id) && isSanitizeName(module)) {
            return {
              i: id,
              m: module,
              t: taxonomy
            };
          } else {
            debugLog(mainEntity);
          }
        }
      }
      return {
        i: '',
        m: ''
      };
    };

    /**
     * @returns {Boolean}
     */
    const isIFrame = function isIFrame() {
      try {
        return window.self !== window.top;
      } catch (_) {}
      return true;
    };

    /**
     * @returns {Boolean}
     */
    const isTouchSupport = function isTouchSupport() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    /**
     * @returns {ScreenOrientationType}
     */
    const getScreenOrientation = function getScreenOrientation() {
      if (window.screen.orientation && window.screen.orientation.type) {
        return window.screen.orientation.type;
      }
    };

    /**
     * @param {String[]} items
     * @returns {String[]}
     */
    const keywordsNormalize = function keywordsNormalize(items) {
      return items
        .map(function mapKeys(item) {
          return trimString(item).toLowerCase();
        })
        .slice(0, 10);
    };

    /**
     * @param {Number} input
     * @param {Number} min
     * @param {Number} max
     * @param {Number} defaultValue
     * @returns {Number}
     */
    const sanitizeInteger = function sanitizeInteger(
      input,
      min,
      max,
      defaultValue
    ) {
      if (input && Number.isInteger(input) && input >= min && input <= max) {
        return parseInt(input.toString(), 10);
      }
      return defaultValue;
    };

    /**
     * @param {Boolean|any} input
     * @param {Boolean} defaultValue
     * @returns {Boolean}
     */
    const sanitizeBoolean = function sanitizeBoolean(input, defaultValue) {
      if (typeof input === 'boolean') {
        return input;
      }
      return defaultValue;
    };

    /**
     * @param {String} input
     * @param {String} defaultValue
     * @returns {String}
     */
    const sanitizeString = function sanitizeString(input, defaultValue) {
      if (isFillString(input)) {
        return input;
      }
      return defaultValue;
    };

    /**
     * @param {Date?} [initDate]
     * @param {Date?} [sessionDate]
     * @param {String?} [random]
     */
    const cidGenerate = function cidGenerate(initDate, sessionDate, random) {
      return window.btoa(
        [
          Math.round(
            initDate instanceof Date
              ? initDate.getTime() / 1000
              : Date.now() / 1000
          ).toString(),
          Math.round(
            sessionDate instanceof Date
              ? sessionDate.getTime() / 1000
              : Date.now() / 1000
          ).toString(),
          isFillString(random) ? random : randomString()
        ].join(':')
      );
    };

    /**
     * @param {String} cidString
     * @returns {ClientIdentifier|undefined}
     */
    const cidParse = function cidParse(cidString) {
      try {
        const matchedParts = window.atob(cidString).match(
          // initDate:sessionDate:random
          new RegExp('^([0-9]+):([0-9]+):([a-z0-9]{16})$')
        );
        if (matchedParts) {
          /** @type {ClientIdentifier} */
          const clientIdentifierData = {
            i: new Date(parseInt(matchedParts[1], 10) * 1000),
            s: new Date(parseInt(matchedParts[2], 10) * 1000),
            r: matchedParts[3]
          };

          return clientIdentifierData;
        } else {
          errorLog('cidParse:regex', cidString);
        }
      } catch (e) {
        errorLog('cidParse', e);
      }

      return undefined;
    };

    /**
     * @param {String} storageName
     * @param {String} cid
     */
    const cidSet = function cidSet(storageName, cid) {
      storageSet(storageName, 'cid', cid);
    };

    /**
     * @param {String} storageName
     * @return {String}
     */
    const cidGet = function cidGet(storageName) {
      const cid = storageGet(storageName, 'cid');
      if (typeof cid === 'string') {
        if (Math.random() > 0.5) {
          cidSet(storageName, cid);
        }
        return cid;
      }
    };

    /**
     * @param {BreadcrumbListItemListElement} item
     * @returns {PageBreadcrumbItem}
     */
    const breadcrumbValidateItem = function breadcrumbValidateItem(item) {
      if (
        !Number.isInteger(item.position) ||
        item.position < 1 ||
        item.position > 5
      ) {
        errorLog('breadcrumbValidateItem:position', item);
      }
      /** @type {PageBreadcrumbItem} */
      const result = {
        p: item.position,
        n: '',
        u: ''
      };

      if (
        typeof item.name === 'string' &&
        typeof item.item === 'string' &&
        isFillString(item.name) &&
        isFillString(item.item)
      ) {
        result.n = item.name;
        result.u = item.item;
        debugLog(['breadcrumb:vi:ni', result]);
      } else if (
        typeof item.item === 'object' &&
        typeof item.item['@id'] === 'string' &&
        typeof item.item.name === 'string' &&
        isFillString(item.item['@id']) &&
        isFillString(item.item.name)
      ) {
        result.n = item.item.name;
        result.u = item.item['@id'];
        debugLog(['breadcrumb:vi:item', result]);
      }

      result.n = trimString(result.n);

      try {
        // parse url and remove before path
        const ur = new URL(result.u);
        result.u = ur.toString();
      } catch (e) {
        errorLog('breadcrumbValidateItem:url', e);
        return undefined;
      }

      if (result.n.length > 0 || result.u.length > 0) {
        return result;
      }

      return undefined;
    };

    /**
     * @param {PageBreadcrumbItem} item1
     * @param {PageBreadcrumbItem} item2
     * @returns {Number}
     */
    const breadcrumbSort = function breadcrumbSort(item1, item2) {
      return item1.p > item2.p ? 1 : -1;
    };

    /**
     * @param {Object} inputJSON
     * @returns {BreadcrumbList}
     */
    const breadcrumbFindObject = function breadcrumbFindObject(inputJSON) {
      let breadcrumbObject = undefined;
      if (inputJSON.mainEntityOfPage && inputJSON.mainEntityOfPage.breadcrumb) {
        breadcrumbObject = Array.isArray(inputJSON.mainEntityOfPage.breadcrumb)
          ? inputJSON.mainEntityOfPage.breadcrumb[0]
          : inputJSON.mainEntityOfPage.breadcrumb;
      } else if (
        inputJSON['@type'] &&
        inputJSON['@type'].toLowerCase() === 'breadcrumblist'
      ) {
        breadcrumbObject = inputJSON;
      } else if (
        Array.isArray(inputJSON) &&
        inputJSON[0] &&
        inputJSON[0]['@type'] &&
        inputJSON[0]['@type'].toLowerCase() === 'breadcrumblist'
      ) {
        breadcrumbObject = inputJSON[0];
      }
      if (
        breadcrumbObject &&
        breadcrumbObject.itemListElement &&
        Array.isArray(breadcrumbObject.itemListElement) &&
        breadcrumbObject.itemListElement.length > 0
      ) {
        return breadcrumbObject;
      }

      return undefined;
    };

    /**
     * @param {PageBreadcrumbItem[]} items
     * @return {PageBreadcrumbObject}
     */
    const breadcrumbToObject = function breadcrumbToObject(items) {
      /** @type {PageBreadcrumbObject} */
      const result = {};
      let valid = true;
      items.forEach(function iterateItems(item, itemIndex) {
        const position = itemIndex + 1;
        const positionString = position.toString();
        const nameName = 'n' + positionString;
        const urlName = 'u' + positionString;
        if (item.p !== position || item.p < 1 || item.p > 5) {
          valid = false;
          return;
        }

        result[nameName] = item.n;
        result[urlName] = item.u;
      });

      if (valid) {
        return result;
      }
    };

    /**
     * @param {BreadcrumbList|String|Boolean} selectorOrObject
     * @returns {PageBreadcrumbObject}
     */
    const breadcrumbProcess = function breadcrumbProcess(selectorOrObject) {
      /** @type {BreadcrumbListItemListElement[]} */
      let itemListElements = [];

      // direct inject object of `BreadcrumbList`
      if (
        typeof selectorOrObject === 'object' &&
        Array.isArray(selectorOrObject.itemListElement) &&
        selectorOrObject.itemListElement.length > 0
      ) {
        itemListElements = selectorOrObject.itemListElement;
      } else if (
        typeof selectorOrObject === 'string' &&
        isFillString(selectorOrObject)
      ) {
        // using selector
        const selector = selectorOrObject;
        const jsonLDTag = document.querySelector(selector);
        if (jsonLDTag) {
          try {
            const jsonData = JSON.parse(jsonLDTag.innerHTML);
            const obj = breadcrumbFindObject(jsonData);
            if (obj) {
              itemListElements = obj.itemListElement;
            } else {
              errorLog('breadcrumbProcess:selector:invalid:' + selector);
            }
          } catch (e) {
            errorLog('breadcrumbProcess:selector:' + selector, e);
          }
        }
      } else if (selectorOrObject === true) {
        // try first ld+json
        const jsonLDTag = document.querySelector(
          'script[type="application/ld+json"]'
        );
        if (jsonLDTag) {
          try {
            const jsonData = JSON.parse(jsonLDTag.innerHTML);

            const obj = breadcrumbFindObject(jsonData);
            if (obj) {
              itemListElements = obj.itemListElement;
            } else {
              debugLog(['breadcrumbProcess:first-json+ld', jsonData]);
            }
          } catch (e) {
            debugLog(['breadcrumbProcess:first-json+ld', e]);
          }
        } else {
          debugLog('breadcrumbProcess:first-json+ld:not-found');
        }
      }

      if (itemListElements.length > 0) {
        const items = [];
        for (let i = 0; i < itemListElements.length; i += 1) {
          const item = breadcrumbValidateItem(itemListElements[i]);
          if (!item) {
            errorLog('breadcrumbProcess:item-invalid', {
              list: itemListElements,
              item: item
            });
            return {};
          }
          items.push(item);
        }

        if (items.length > 0) {
          const sorted = items.sort(breadcrumbSort);
          const objectItem = breadcrumbToObject(sorted);
          if (objectItem) {
            return objectItem;
          }
        }
      }

      return {};
    };

    /**
     * @param {Number} waitTime [250] between 50-2000 in millisecond
     * @returns {Promise<Object>}
     */
    const performanceFromWindow = async function performanceFromWindow(
      waitTime
    ) {
      return new Promise(function resolveFunction(resolve) {
        if (
          'performance' in window &&
          'timeOrigin' in window.performance &&
          'timeOrigin' in window.performance
        ) {
          const timingInfo = window.performance;
          setTimeout(function timeoutFunction() {
            if (!timingInfo || window.performance.timeOrigin === 0) {
              return resolve(undefined);
            }

            try {
              resolve(JSON.parse(safeStringify(timingInfo.toJSON())));
            } catch (e) {
              errorLog('timingInfo', e);
              return resolve(undefined);
            }
          }, sanitizeInteger(waitTime, 50, 2000, 500));
        } else {
          resolve(undefined);
        }
      });
    };

    /**
     * @param {PerformanceEntry} timing
     * @param {String} startEvent
     * @param {String} endEvent
     * @returns {String|undefined}
     */
    const performanceTiming = function performanceTiming(
      timing,
      startEvent,
      endEvent
    ) {
      const metric =
        endEvent === undefined
          ? timing[startEvent]
          : timing[endEvent] - timing[startEvent];
      if (isFiniteNumber(metric) && metric >= 0) {
        return metric.toString();
      }
      return undefined;
    };

    /**
     * @returns {Number}
     */
    const performanceResources = function performanceResources() {
      try {
        return JSON.parse(
          safeStringify(window.performance.getEntries())
        ).filter(
          /**
           * @param {PerformanceEntry} entry
           */
          (entry) => entry.entryType === 'resource'
        ).length;
      } catch (e) {
        errorLog('performanceResources', e);
      }
      return 0;
    };

    /**
     * @param {InitializeData} initializeData
     * @returns {aasaamAnalyticsInstance}
     */
    window.aasaamAnalytics = function aasaamAnalytics(initializeData) {
      // update public instance id
      publicInstanceID = initializeData.i;

      /**
       * @type {aasaamAnalyticsInstance}
       */
      const instanceObject = {
        cid: undefined,
        pageView: undefined,
        event: undefined
      };

      /**
       * @const {String}
       */
      const storagePrefix = sanitizeString(initializeData.p, 'aa_std');

      /**
       * @const {Number}
       */
      const sessionDuration = sanitizeInteger(
        initializeData.sd,
        60,
        86400,
        1800
      );

      /**
       * @type {PageData}
       */
      let defaultPageData;

      /**
       * @type {EventDataBuffer[]}
       */
      let events = [];

      let cid = cidGet(storagePrefix);
      /** ClientIdentifier */
      {
        let cidNew = true;

        // cid exist
        if (cid) {
          const parsedCID = cidParse(cid);

          if (parsedCID) {
            const expireSession = new Date();
            expireSession.setTime(
              expireSession.getTime() - sessionDuration * 1000
            );

            // session must be update
            if (parsedCID.s < expireSession) {
              cid = cidGenerate(parsedCID.i, new Date(), parsedCID.r);
              cidSet(storagePrefix, cid);
            } else {
              // session is active so there is no require for new cid
              cidNew = false;
            }
          }
        }

        // generate local cid
        if (cidNew) {
          cid = cidGenerate();
          cidSet(storagePrefix, cid);
        }
      }

      /**
       * @param {String} referrer
       * @returns {String}
       */
      const referrerStateStore = function referrerStateStore(referrer) {
        const cacheKey = 'rs';
        const cacheData = storageGet(storagePrefix, cacheKey);
        if (typeof cacheData === 'string') {
          return cacheData;
        }
        storageSet(storagePrefix, cacheKey, referrer, sessionDuration);
        return referrer;
      };

      const geoCacheSuccessKey = 'gs';

      /** @type {GeographyData} */
      let geo = sanitizeGeographyData(
        storageGet(storagePrefix, geoCacheSuccessKey)
      );

      /**
       * @param {AnalyticsRequestGET} getParameters
       * @param {AnalyticsRequestPOST} postParameters
       */
      const sendData = function sendData(getParameters, postParameters) {
        const sendURL = new URL(collectorURL);

        Object.entries(getParameters).forEach(function (i) {
          sendURL.searchParams.set(i[0], i[1]);
        });

        navigator.sendBeacon(sendURL.toString(), safeStringify(postParameters));
      };

      /**
       * @returns {void}
       */
      const sendEvents = function sendEvents() {
        if (events.length) {
          const groups = eventDataBufferGroupBy(events);
          Object.keys(groups).forEach(function (pid) {
            /** @type {AnalyticsRequestMode} */
            const mode = pid === initializeData.i ? 'e_js_pv' : 'e_js_c';

            /** @type {EventData[]} */
            const targetEvents = groups[pid].map(function stripEvent(ev) {
              return {
                c: ev.c,
                a: ev.a,
                l: ev.l,
                id: ev.id,
                v: ev.v
              };
            });

            sendData(
              {
                i: pid,
                m: mode
              },
              {
                cid_std: cid,
                p: defaultPageData,
                ev: targetEvents
              }
            );
          });

          events = [];
        }
      };

      /**
       * @param {PageViewPayload} injectPayload
       * @returns {Promise<PageData>}
       */
      const processPageData = async function processPageData(injectPayload) {
        /** @type {PageViewPayload} */
        const payload = injectPayload ? injectPayload : {};

        const mainEntity = getMainEntity();

        /**
         * @type {PageData}
         */
        const pageData = {
          // url
          u: isValidURL(payload.u) ? payload.u : window.location.href,
          // title
          t: isFillString(payload.t) ? payload.t : getPageTitle(),

          l: isFillString(payload.l) ? payload.l : getPageLanguage(),

          // canonical url
          cu: isValidURL(payload.cu) ? payload.cu : getCanonicalURL(),

          // entity id
          ei: isIDString(payload.ei) ? payload.ei : mainEntity.i,

          // entity module
          em: isSanitizeName(payload.em) ? payload.em : mainEntity.m,

          // entity taxonomy id
          et: isValidTaxonomyID(payload.et) ? payload.et : mainEntity.t,

          // referrer
          r: undefined,

          // breadcrumb
          bc: {},

          // screen size
          scr: window.screen.width + 'x' + window.screen.height,

          // viewport size
          vps: window.innerWidth + 'x' + window.innerHeight,

          // color depth
          cd: window.screen.colorDepth.toString(),

          // keywords
          k: undefined,

          // segments
          seg: sanitizeSegments(payload.sg),

          // referrer state
          rs: undefined,

          // device pixel ratio
          dpr: window.devicePixelRatio.toString(),

          // iframe
          if: isIFrame(),

          // touch support
          ts: isTouchSupport(),

          // screen orientation
          sot: getScreenOrientation(),

          // page performance
          prf: {},

          // location
          geo: geo,

          // user name/id
          usr: isFillString(payload.usr) ? payload.usr : undefined
        };

        /**
         * referrer
         */
        {
          let referrer = document.referrer;
          if (payload.r && isValidURL(payload.r)) {
            referrer = payload.r;
          }
          pageData.r = referrer;
          pageData.rs = referrerStateStore(referrer);
        }

        /**
         * keywords
         */
        {
          let keywords = getKeywords();
          if (Array.isArray(payload.k)) {
            keywords = payload.k;
          }
          pageData.k = keywordsNormalize(keywords).join(',');
        }

        /**
         * breadcrumb
         */
        if (payload.bc) {
          pageData.bc = breadcrumbProcess(payload.bc);
        }

        /**
         * geolocation
         */
        if (typeof pageData.geo === 'undefined') {
          (function processGeo() {
            if (payload.geo === true) {
              // check failed
              const geoCacheFailedValue = '1';
              const geoCacheFailedKey = 'gf';

              const geoCacheFailedData = storageGet(
                storagePrefix,
                geoCacheFailedKey
              );

              if (geoCacheFailedData === geoCacheFailedValue) {
                return;
              }

              let geoFailedAgeSeconds = 86400;
              let geoSuccessAgeSeconds = 604800;
              let geoTimeout = 10;
              let geoEnableHighAccuracy = true;

              if (initializeData.gl) {
                geoSuccessAgeSeconds = sanitizeInteger(
                  initializeData.gl.lt,
                  3600,
                  7776000,
                  geoSuccessAgeSeconds
                );
                geoFailedAgeSeconds = sanitizeInteger(
                  initializeData.gl.fc,
                  60,
                  86400,
                  geoFailedAgeSeconds
                );
                geoTimeout = sanitizeInteger(
                  initializeData.gl.fc,
                  1,
                  60,
                  geoTimeout
                );
                geoEnableHighAccuracy = sanitizeBoolean(
                  initializeData.gl.ha,
                  geoEnableHighAccuracy
                );
              }

              getGeoLocation(
                geoSuccessAgeSeconds * 1000,
                geoTimeout * 1000,
                geoEnableHighAccuracy
              )
                .then(function successGeoData(geo) {
                  pageData.geo = geo;
                  storageSet(
                    storagePrefix,
                    geoCacheSuccessKey,
                    geo,
                    geoSuccessAgeSeconds
                  );
                  debugLog([
                    'processGeo:success',
                    geo,
                    {
                      storagePrefix,
                      geoCacheSuccessKey,
                      geo,
                      geoSuccessAgeSeconds
                    }
                  ]);
                })
                .catch(function (e) {
                  storageSet(
                    storagePrefix,
                    geoCacheFailedKey,
                    geoCacheFailedValue,
                    geoFailedAgeSeconds
                  );
                  debugLog(['processGeo:failed', e]);
                });
            } else if (typeof payload.geo === 'object') {
              const geoPayload = sanitizeGeographyData(payload.geo);
              if (geoPayload) {
                pageData.geo = geoPayload;
              }
            }
          })();
        }

        // performanceWindow
        const performanceWindow = await performanceFromWindow(payload.pwt);
        if (performanceWindow) {
          // PAGE_LOAD_TIME
          pageData.prf.plt = performanceTiming(
            performanceWindow.timing,
            'navigationStart',
            'loadEventStart'
          );
          // DOMAIN_LOOKUP_TIME
          pageData.prf.dlt = performanceTiming(
            performanceWindow.timing,
            'domainLookupStart',
            'domainLookupEnd'
          );
          // TCP_CONNECT_TIME
          pageData.prf.tct = performanceTiming(
            performanceWindow.timing,
            'connectStart',
            'connectEnd'
          );
          // SERVER_RESPONSE_TIME
          pageData.prf.srt = performanceTiming(
            performanceWindow.timing,
            'requestStart',
            'responseStart'
          );
          // PAGE_DOWNLOAD_TIME
          pageData.prf.pdt = performanceTiming(
            performanceWindow.timing,
            'responseStart',
            'responseEnd'
          );
          // REDIRECT_TIME
          pageData.prf.rt = performanceTiming(
            performanceWindow.timing,
            'navigationStart',
            'fetchStart'
          );
          // DOM_INTERACTIVE_TIME
          pageData.prf.dit = performanceTiming(
            performanceWindow.timing,
            'navigationStart',
            'domInteractive'
          );
          // CONTENT_LOAD_TIME
          pageData.prf.clt = performanceTiming(
            performanceWindow.timing,
            'navigationStart',
            'domContentLoadedEventStart'
          );
        }

        pageData.prf.r = performanceResources();

        return pageData;
      };

      const initEvents = function initEvents() {
        if (window.aai.ie) {
          window.aai.ie.forEach(function eventPick(ev) {
            instanceObject.event(ev);
          });
        }
      };

      let eventsSetTimeout;
      const eventTimingSender = function eventTimingSender() {
        window.clearTimeout(eventsSetTimeout);
        eventsSetTimeout = window.setTimeout(function () {
          sendEvents();
        }, 1000);
      };

      /**
       * @param {PageViewPayload?} injectPayload
       * @returns {aasaamAnalyticsInstance}
       */
      instanceObject.pageView = function pageView(injectPayload) {
        processPageData(injectPayload)
          .then(function processPageDataSuccess(pageData) {
            defaultPageData = JSON.parse(safeStringify(pageData));
            sendData(
              {
                i: initializeData.i,
                m: 'pv_js'
              },
              {
                cid_std: cid,
                p: pageData
              }
            );
            initEvents();
          })
          .catch(function processPageDataFailed(e) {
            errorLog('pageView', e);
          });
        return instanceObject;
      };

      /**
       * @param {EventData} eventData
       * @param {PublicInstanceID?} crossProjectPublicInstanceID
       * @returns {aasaamAnalyticsInstance}
       */
      instanceObject.event = function event(
        eventData,
        crossProjectPublicInstanceID
      ) {
        let pid = initializeData.i;
        if (isFillString(crossProjectPublicInstanceID)) {
          pid = crossProjectPublicInstanceID;
        }
        if (!isSanitizeName(eventData.c)) {
          errorLog('event:category', eventData);
          return instanceObject;
        }
        if (!isSanitizeName(eventData.a)) {
          errorLog('event:action', eventData);
          return instanceObject;
        }
        if (eventData.l !== undefined && !isFillString(eventData.l)) {
          errorLog('event:label', eventData);
          return instanceObject;
        }
        if (eventData.id !== undefined && !isIDString(eventData.id)) {
          errorLog('event:ident', eventData);
          return instanceObject;
        }
        if (
          eventData.v !== undefined &&
          (!Number.isInteger(eventData.v) || eventData.v < 1)
        ) {
          errorLog('event:value', eventData);
          return instanceObject;
        }

        events.push({
          i: pid,
          c: eventData.c,
          a: eventData.a,
          l: eventData.l,
          id: eventData.id,
          v: eventData.v
        });

        if (events.length >= 50) {
          sendEvents();
        } else {
          eventTimingSender();
        }

        return instanceObject;
      };

      // if `true` or not set page view triggered with default values
      if (
        typeof initializeData.pv === 'undefined' ||
        initializeData.pv === true
      ) {
        if (document.readyState !== 'loading') {
          instanceObject.pageView();
        } else {
          document.addEventListener('DOMContentLoaded', function () {
            instanceObject.pageView();
          });
        }
      } else if (typeof initializeData.pv === 'object') {
        instanceObject.pageView(initializeData.pv);
      }

      instanceObject.cid = function getCID() {
        const cidParsed = cidParse(cid);
        if (cidParsed) {
          /** @type {PublicCIDData} */
          return {
            i: cidParsed.i,
            s: cidParsed.s,
            r: cidParsed.r,
            p: cidParsed.i.getTime().toString() + cidParsed.r
          };
        }
      };

      return instanceObject;
    };
  }

  if (!window.aai) {
    if (
      document.currentScript &&
      document.currentScript.hasAttribute('data-i')
    ) {
      try {
        window.aai = window.aasaamAnalytics(
          JSON.parse(
            decodeURIComponent(
              window.atob(document.currentScript.getAttribute('data-i'))
            )
          )
        );
      } catch (e) {
        errorLog('aasaam-analytics:initialize-error:', e);
      }
    }
  }
})(window, document, performance, navigator, console, localStorage);
