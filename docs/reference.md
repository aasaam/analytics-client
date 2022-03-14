# Reference

This is list of reference that collector must support.

## AnalyticsRequestMode

It's `String` that define which mode of analytics will be send into analytics server and collector behave special for each request mode:

### Page view

| Key        | Description                                                             |
| ---------- | ----------------------------------------------------------------------- |
| `pv_js`    | Page view with JavaScript                                               |
| `pv_il`    | Page view using `<img>` tag when Javascript engine is legacy            |
| `pv_ins`   | Page view using `<img>` using none JavaScript client using `<noscript>` |
| `pv_amp`   | Page view for **AMP** pages                                             |
| `pv_amp_i` | Page view for **AMP** pages using image not js using `<noscript>`       |

### Events

| Key       | Description                                              |
| --------- | -------------------------------------------------------- |
| `e_js_pv` | Event from page view for current project                 |
| `e_js_c`  | Event from page view for cross project                   |
| `e_sw`    | Event from service worker                                |
| `e_api`   | Event from another server/service that send to collector |
| `e_o`     | Event from other method like mobile application          |

## PublicInstanceID

It's `String` that define project public instance id that usually is `/^[a-zA-Z0-9]{12}$/`. All data will store for project with this unique string.
For example `0123456789az` is valid public instance id.

## PageCommonData

It's parameters to page parameters could be send to server as get parameters.

| Key  | Description                                               | Example                                                                                      |
| ---- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `u`  | Page URL                                                  | `https://example.tld/page-1.html?foo=bar#hash`                                               |
| `r`  | Referrer URL                                              | `https://search-engine.tld/`                                                                 |
| `t`  | Page title                                                | `Page title`                                                                                 |
| `l`  | Page language. valid ISO 639-1 language code              | `en`, `fa`                                                                                   |
| `ei` | Main entity id. valid via `/^[a-zA-Z0-9-_\/]{1,63}$/`     | `100`, `5e0bbe150000000000000000`, `myusers/3456789`, `6F9619FF-8B86-D011-B42D-00C04FC964FF` |
| `em` | Main entity module. valid via `/^[a-zA-Z0-9-_\/]{1,63}$/` | `news`, `blog`, `product`, `video_gallery`                                                   |
| `et` | Main entity taxonomy id. integer between 0-99999          | `316`; See more info on [aasaam taxonomy](https://github.com/aasaam/taxonomy)                |

## InitializeData

This is example parameters for initialize data of analytics:

```json
// minimal initialize data
{
  // PublicInstanceID
  "i": "0123456789az",
  // CollectorServerURL
  "s": "https://collector.your-organization.tld"
}
```

<!-- ## Request mode

This will represent how client send data to collector for future usage.

Type of request exist with `m` in URL, at GET parameters.

| Key   | Description                                              | Page view | Event |
| ----- | -------------------------------------------------------- | --------- | ----- |
| `jsp` | JavaScript client, send page view with initialize events | ✅        | ✅    |
| `jse` | JavaScript client, send page view with new events        | ✅        | ✅    |
| `amp` | amp page send page view                                  | ✅        | ⬜️   |
| `sw`  | In server worker, send event                             | ⬜️       | ✅    |
| `api` | Using api in server side or etc..., send event           | ⬜️       | ✅    |
| `il`  | image legacy browser send page view                      | ✅        | ⬜️   |
| `ins` | noscript image, no script send page view                 | ✅        | ⬜️   |
| `ia`  | noscript image, AMP for send page view                   | ✅        | ⬜️   |

## GET url parameters

| Key    | Example value                                                                  | Description                                                                    |
| ------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `m`    | `jsp`                                                                          | Request mode                                                                   |
| `i`    | `0123456789az`                                                                 | Project public hash                                                            |
| `u`    | `https://example.tld/page-1.html?foo=bar#hash`                                 | Page URL                                                                       |
| `r`    | `https://another-website.tld/`                                                 | Referrer URL                                                                   |
| `cn`   | `https://example.tld/page-1.html`                                              | [Canonical link element](https://en.wikipedia.org/wiki/Canonical_link_element) |
| `mid`  | `page-1`                                                                       | Main identifier represent of main entity identifier of page                    |
| `ph`   | `0123456789abcdefgh`                                                           | Project private hash for API and server side usage                             |
| `c_ip` | `1.2.3.4`                                                                      | Client IP                                                                      |
| `c_ua` | `Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0` | Client User Agent string                                                       |

## POST body

```jsonc
{
  // client identifier
  "c": "MTYzNTk2MzQwNjoxNjM1OTYzNDA2OjFmampnOTFqMW5yY2NhbGI=",
  // page data
  "p": {
    // screen size
    "scr": "1920x1080",
    // view port size
    "vps": "1868x380",
    // colorDepth
    "cd": "24",
    // title
    "t": "Page title",
    // keywords
    "k": "key1,key2",
    // internal system user identifier
    "usr": "user-1",

    // performance data
    "prf": {
      // page load time
      "plt": "${pageLoadTime}",
      // domain lookup time
      "dlt": "${domainLookupTime}",
      // tcp connect time
      "tct": "${tcpConnectTime}",
      // server response time
      "srt": "${serverResponseTime}",
      // page download time
      "pdt": "${pageDownloadTime}",
      // redirect time
      "rt": "${redirectTime}",
      // dom interactive time
      "dit": "${domInteractiveTime}",
      // content load time
      "clt": "${contentLoadTime}"
    },

    /**
     * JavaScript modern clients only
     */
    // `devicePixelRatio`
    "dpr": "1",
    // is page loaded in iframe
    "if": false,
    // screen orientation
    "so": "l-p",
    // referrer url for store referrer that save until nvs (New visit state in minutes); default is 3600 seconds
    "rs": "https://another-website.tld/",

    // geo location
    "geo": {
      // latitude
      "lat": 35.6892,
      // longitude
      "lat": 51.389,
      // accuracy
      "acc": 1000
    }
  },
  // events
  "e": [
    {
      "ec": "Event category", // {String} required
      "ea": "Event action", // {String} required
      "el": "Event label", // {String} optional
      "ev": 64 // {Number(Integer)} optional
    }
    // ...
  ]
}
```

## Browser (JavaScript)

Useful for

T `__INITIALIZE_DATA__` data:

There is two script method:

1. `script.js` for modern and legacy browsers (IE 6+)
2. `script-modern.js` for modern browsers

### Minimal setup

This is tiniest possible script tag

```html
<script>
  // script.js or script-modern.js with __INITIALIZE_DATA__ data replacement
  // InitializeData:
  {
    // REQUIREMENTS:
    s: 'https://collector.your-organization.tld',
    i:  '0123456789az'
  };
</script>
```

For see possible object keys see [InitializeData](https://github.com/aasaam/analytics-client/blob/master/index.d.ts)

## AMP

For tracking amp page use following html for track page view:

```html
<noscript
  ><img
    style="display:none"
    height="1"
    width="1"
    alt=""
    src="https://collector.your-organization.tld/?m=ins&i=0123456789az&u=https%3A%2F%2Fexample.tld%2Fpage-1.html%3Ffoo%3Dbar%23hash&r=https%3A%2F%2Fsearch.tld%2F&cn=https%3A%2F%2Fexample.tld%2Fpage-1.html&mid=page-1"
/></noscript>
<amp-analytics
  id="aasaam"
  config="https://collector.your-organization.tld/amp.json"
>
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
fetch('https://collector.your-organization.tld/?m=sw&i=0123456789az', {
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
  $ch = curl_init('https://collector.your-organization.tld/?m=api&i=0123456789az&ph=0123456789abcdefgh&c_ip=1.1.1.1&c_ua=Mozilla%2F5.0%20(X11%3B%20Ubuntu%3B%20Linux%20x86_64%3B%20rv%3A93.0)%20Gecko%2F20100101%20Firefox%2F93.0');
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
``` -->
