# Best practices

For better tracking use this steps for grab automatically from your page.

## Canonical link element

Use [Canonical link element](https://en.wikipedia.org/wiki/Canonical_link_element) in your html page.

## Main entity

As semantic design each page must has one `<main>` tag that represent of main entity identifier of page. Add these attributes for track view of your entity.

```html
<main data-entity-id="100" data-entity-module="blog" data-entity-taxonomy="100">
  <!--
    rest of your html code
  -->
  <h1>Headline</h1>
  <p>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
  </p>
</main>
```

- `data-entity-id` is **required** and must valid via `/^[a-zA-Z0-9-_\/]{1,63}$/`; Generic database autogenerate identifier
- `data-entity-module` is **required** and must valid via `/^[a-z0-9_]{1,31}$/`; Module name like `news`, `comment`, `post` and etc...
- `data-entity-taxonomy` is _optional_ and must valid via `/^[0-9]{1,5}$/`; It's number between 1 to 65535

## HTML language

Define your page default language using `<html lang="en">` for standard language.

## Open graph title

As open graph standard add `<meta property="og:title" content="Actual page title">` for get correct version of page title.
