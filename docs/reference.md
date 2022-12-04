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

## Specials

| Key     | Description                 |
| ------- | --------------------------- |
| `err`   | Error reporting             |
| `err_l` | Error reporting legacy mode |

## PublicInstanceID

It's `String` that define project public instance id that usually is `/^[a-zA-Z0-9]{12}$/`. All data will store for project with this unique string.
For example `0123456789az` is valid public instance id.

## PageCommonData

It's parameters to page parameters could be send to server as get parameters.

| Key  | Description                                                                     | Example                                                                                      |
| ---- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `u`  | Page URL                                                                        | `https://example.tld/page-1.html?foo=bar#hash`                                               |
| `r`  | Referrer URL                                                                    | `https://search-engine.tld/`                                                                 |
| `t`  | Page title                                                                      | `Page title`                                                                                 |
| `l`  | Page language. valid ISO 639-1 language code                                    | `en`, `fa`                                                                                   |
| `ei` | Main entity id. valid via `/^[a-zA-Z0-9-_\/]{1,63}$/`                           | `100`, `5e0bbe150000000000000000`, `myusers/3456789`, `6F9619FF-8B86-D011-B42D-00C04FC964FF` |
| `em` | Main entity module. valid via `/^[a-zA-Z0-9-_\/]{1,63}$/`                       | `news`, `blog`, `product`, `video_gallery`                                                   |
| `et` | Main entity taxonomy id. [aasaam/taxonomy](https://github.com/aasaam/taxonomy/) | `316`; See more info on [aasaam taxonomy](https://github.com/aasaam/taxonomy)                |

## InitializeData

This is example parameters for initialize data of analytics:

```json
// minimal initialize data
{
  // PublicInstanceID
  "i": "0123456789az",
  // CollectorServerHost
  "s": "collector.your-organization.tld"
}
```

Full example

```json
// minimal initialize data
{
  // PublicInstanceID
  "i": "0123456789az",
  // CollectorServerHost
  "s": "collector.your-organization.tld"
}
```
