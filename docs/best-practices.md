# Best practices

For better tracking use this steps for grab automatically from your page.

## Canonical link element

Use [Canonical link element](https://en.wikipedia.org/wiki/Canonical_link_element) in your html page.

## Main entity

As semantic design each page must has one `<main>` tag that represent of main entity identifier of page. Add these attributes for track view of your entity.

```html
<main
  data-entity-id="100"
  data-entity-module="blog"
  data-entity-taxonomy="A0000"
>
  <!-- rest of your html code -->
</main>
```

## HTML language

Define your page default language using `<html lang="en">` for standard language.

## Open graph title

As open graph standard add `<meta property="og:title" content="Actual page title">` for get correct version of page title.
