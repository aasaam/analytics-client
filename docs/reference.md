# Reference

This is list of reference that collector must support.

## Request mode

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
