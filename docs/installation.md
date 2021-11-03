# Installation

For installation of analytic client you must add following step for full coverage of clients data.

After get config from analytics server assume you have this properties:

| Key   | Default value | Example value                  | Required | Description                         |
| ----- | ------------- | ------------------------------ | -------- | ----------------------------------- |
| `i`   | `undefined`   | `0123456789az`                 | **Yes**  | Project public hash                 |
| `s`   | `undefined`   | `https://collector.vendor.tld` | **Yes**  | Collector server URL                |
| `p`   | `"aai"`       | ``                             | _No_     | Prefix for local storage and cookie |
| `pv`  | `undefined`   | `true` or `PageViewPayload`    | _No_     | Initialize instance with page view  |
| `nvs` | `3600`        | ``                             | _No_     | New visit state in minutes          |
| `gto` | `10`          | ``                             | _No_     | Geo location timeout in seconds     |
| `glt` | `86400`       | ``                             | _No_     | Geo location lifetime in seconds    |

For API usage this paramaters are required.

| Key    | Default value | Example value                                                                  | Required | Description                                        |
| ------ | ------------- | ------------------------------------------------------------------------------ | -------- | -------------------------------------------------- |
| `ph`   | `undefined`   | `0123456789abcdefgh`                                                           | **Yes**  | Project private hash for api and server side usage |
| `c_ip` | `undefined`   | `1.1.1.1`                                                                      | **Yes**  | Client IP address                                  |
| `c_ua` | `undefined`   | `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0` | **Yes**  | Client User Agent string                           |

And your page have following properties:

| Parameter | Default value                                                                  | Example value                                  | Required | Description                                                 |
| --------- | ------------------------------------------------------------------------------ | ---------------------------------------------- | -------- | ----------------------------------------------------------- |
| `u`       | `window.location.href`                                                         | `https://example.tld/page-1.html?foo=bar#hash` | **Yes**  | Actual URL of page                                          |
| `r`       | `document.referrer`                                                            | `https://search.tld/`                          | _No_     | Referrer URL                                                |
| `cn`      | [Canonical link element](https://en.wikipedia.org/wiki/Canonical_link_element) | `https://example.tld/page-1.html`              | _No_     | Canonical URL                                               |
| `mid`     | `document.querySelector('main article').getAttribute('data-id')`               | `page-1`                                       | _No_     | Main identifier represent of main entity identifier of page |

## Javascript

You must render `noscript img` tag and putting url encoded parameters also add script tag with special `__INITIALIZE_DATA__` data:

There is two script method:

1. `script.js` for modern and legacy browsers (IE 9+)
2. `script-modern.js` for modern browsers

```html
<noscript
  ><img
    style="display:none"
    height="1"
    width="1"
    alt=""
    src="https://collector.vendor.tld/?m=ins&i=0123456789az&u=https%3A%2F%2Fexample.tld%2Fpage-1.html%3Ffoo%3Dbar%23hash&r=https%3A%2F%2Fsearch.tld%2F&cn=https%3A%2F%2Fexample.tld%2Fpage-1.html&mid=page-1"
/></noscript>
<script>
  // script.js or script-modern.js with __INITIALIZE_DATA__ data replacement
    {
      // geo: true, // ask user for geo location data
      pv: true,
      s: 'https://collector.vendor.tld',
      i: '0123456789az'
    };
</script>
```

## AMP

For tracking amp page use following html for track page view:

```html
<noscript
  ><img
    style="display:none"
    height="1"
    width="1"
    alt=""
    src="https://collector.vendor.tld/?m=ins&i=0123456789az&u=https%3A%2F%2Fexample.tld%2Fpage-1.html%3Ffoo%3Dbar%23hash&r=https%3A%2F%2Fsearch.tld%2F&cn=https%3A%2F%2Fexample.tld%2Fpage-1.html&mid=page-1"
/></noscript>
<amp-analytics id="aasaam" config="https://collector.vendor.tld/amp.json">
  <script type="application/json">
    {
      "vars": {
        "i": "0123456789az",
        "mid": "page-1",
        "t": "Special page title",
        "k": "Special,Keywords,Separated,By,Comma"
      }
    }
  </script>
</amp-analytics>
```

## Service worker

For using in service worker there is no URL or document or view, so page view not available. But you can send your event to collector server.

```javascript
fetch('https://collector.vendor.tld/?m=sw&i=0123456789az', {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
  body: JSON.stringify({
    e: [
      {
        ec: 'Event category', // {String} required
        ea: 'Event action', // {String} required
        el: 'Event label', // {String} optional
        ev: 64, // {Number} optional
      },
    ],
  }),
});
```

## Server side

In case you want to send server side event to collector you need **project private hash** can use following examples:

### PHP

This is sample PHP version of event tracking on server side.

```php
<?php

/**
 * @param string $category
 * @param string $action
 * @param string $label (optional)
 * @param int $value (optional)
 */
function sendEvent($category, $action, $label = '', $value = '') {
  $ch = curl_init('https://collector.vendor.tld/?m=api&i=0123456789az&ph=0123456789abcdefgh&c_ip=1.1.1.1&c_ua=Mozilla%2F5.0%20(X11%3B%20Ubuntu%3B%20Linux%20x86_64%3B%20rv%3A93.0)%20Gecko%2F20100101%20Firefox%2F93.0');
  $event = [
    'ec' => $category,
    'ea' => $action,
  ];
  if (!empty($label)) {
    $event['el'] = $label;
  }
  if (!empty($value)) {
    $event['ev'] = (int)$value;
  }
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'e' => [
      $event,
    ],
  ]));
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
  ]);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true );
  curl_exec($ch);
  curl_close($ch);
}

// call
sendEvent('Event category', 'Event action', 'Event label', 64);
sendEvent('Event category', 'Event action');
```
