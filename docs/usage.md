# Usage

When you initialize the javascript client this object are available on `window`.

## Initialize event

You can set initialize event that send with page view event on create instance stage.

```html
<script>
  /** @type {EventItem[]} */
  window.aae = [
    {
      ec: 'Event category 1', // {String} required
      ea: 'Event action 1', // {String} required
      el: 'Event label 1', // {String} optional
      ev: 1, // {Number} optional
    },
    {
      ec: 'Event category 2', // {String} required
      ea: 'Event action 2', // {String} required
      el: 'Event label 2', // {String} optional
      ev: 2, // {Number} optional
    },
  ];
</script>
```

## Custom page view

You can disable(or omit) `pv` in `__INITIALIZE_DATA__` and send page view manually.

```javascript
window.aai.pageView(); // for manually trigger page view event
```

Or custom payload [PageViewPayload](https://github.com/aasaam/analytics-client/blob/master/index.d.ts)

```javascript
// or inject special with `PageViewPayload` for SSR or other use cases
window.aai.pageView({
  usr: 'user-128',
  // ...
});
```

## Custom custom event

Pass [EventItem](https://github.com/aasaam/analytics-client/blob/master/index.d.ts) to trigger event.

```javascript
window.aai.event({
  category: 'Event category', // {String} required
  action: 'Event action', // {String} required
  label: 'Event label', // {String} optional
  value: 64, // {Number} optional
});
```
