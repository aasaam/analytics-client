# Installation

These instruction show you, how use aasaam analytics in your project.

All example consider you setup your collector on `https://collector.your-organization.tld`.

?> If you wonder about parameters see [reference](/reference.md) for more info.

## Javascript

This method is default behavior for analytics that collect page view and events from your web page.

### Add script

First you need add script into your webpage with. There are two version, modern and normal. Modern script tag is smaller script tag but support only modern browser.

- [script.js](https://raw.githubusercontent.com/aasaam/analytics-client/master/dist/script.js)
- [script-modern](https://raw.githubusercontent.com/aasaam/analytics-client/master/dist/script-modern.js)

And replace `__INITIALIZE_DATA__` with [InitializeData](/reference?id=initializedata).

## Noscript

This method useful for tracking none JavaScript client like crawlers, disabled JS browsers and etc...

?> If you wonder about parameters see [reference](/reference.md) for more info.

### Minimal set

This is example of minimal setup.

!> This method is not recommended but might work; for achieve better data store in your analytics better to use [Full setup](./installation.md#full-setup)

!> If client send [HTTP Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header (In normal scenario will be URL of current page), collector can process data, otherwise data is **not valid** and **will not stored**.

```html
<noscript>
  <img
    style="display:none"
    height="1"
    width="1"
    alt=""
    src="https://collector.your-organization.tld/?m=pv_il&i=0123456789az"
  />
</noscript>
```

This is list of parameters:

- `m` [AnalyticsRequestMode](/reference.md#analyticsrequestmode)
- `i` [PublicInstanceID](/reference.md#publicinstanceid)

For minimal setup and send valid data ensure `u` was set:

```html
<noscript>
  <img
    style="display:none"
    height="1"
    width="1"
    alt=""
    src="https://collector.your-organization.tld/?m=pv_il&i=0123456789az&u=https%3A%2F%2Fexample.tld%2Fpage-1.html%3Ffoo%3Dbar%23hash"
  />
</noscript>
```

This is list of parameters:

- `m` [AnalyticsRequestMode](/reference.md#analyticsrequestmode)
- `i` [PublicInstanceID](/reference.md#publicinstanceid)
- `u` [PageURL](/reference.md#pagecommondata)

### Full setup

And if you add these parameters all possible data for noscript mode will be store.

For example this is final parameters:

```txt
m   pv_il
i   0123456789az
u   https://example.tld/page-1.html?foo=bar#hash
r   https://search-engine.tld/
cu  https://example.tld/page-1.html
t   Page title
l   en
ei	100
em	blog
et	A0000
```

```html
<noscript>
  <img
    style="display:none"
    height="1"
    width="1"
    alt=""
    src="https://collector.your-organization.tld/?m=pv_il&i=0123456789az&u=https%3A%2F%2Fexample.tld%2Fpage-1.html%3Ffoo%3Dbar%23hash&r=https%3A%2F%2Fsearch-engine.tld%2F&cu=https%3A%2F%2Fexample.tld%2Fpage-1.html&t=Page%20title&l=en&ei=100&em=blog&et=A0000"
  />
</noscript>
```

This is list of parameters:

- `m` [AnalyticsRequestMode](/reference.md#analyticsrequestmode)
- `i` [PublicInstanceID](/reference.md#publicinstanceid)
- `u` [PageURL](/reference.md#pagecommondata)
- `r` [ReferrerURL](/reference.md#pagecommondata)
- `cu` [CanonicalURL](/reference.md#pagecommondata)
- `t` [PageTitle](/reference.md#pagecommondata)
- `l` [PageLanguage](/reference.md#pagecommondata)
- `ei` [MainEntityID](/reference.md#pagecommondata)
- `em` [MainEntityModule](/reference.md#pagecommondata)
- `et` [MainEntityTaxonomyID](/reference.md#pagecommondata)
