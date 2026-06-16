# Recipe 002: Canonical Tag Analyzer with JavaScript

A small browser-console recipe for checking whether a page has a canonical tag, whether it has more than one canonical tag, and whether the canonical URL matches the current page URL.

This recipe is part of the Technical Growth Cookbook.

## Business problem

Canonical tags are not only a technical SEO detail. They are part of a business decision about which pages deserve search visibility, which URLs should collect ranking signals, and which version of similar content should be treated as the preferred page.

A common example is a business with two regional landing pages:

```txt
/us/color-analysis/
/uk/colour-analysis/
```

If both pages sell the same service, use the same pricing, show the same testimonials, represent the same business entity, and only change the spelling from American English to British English, search engines may treat them as duplicate or near-duplicate pages.

In that case, the business may want one preferred URL and one canonicalized duplicate.

But if each page serves a different regional audience with different pricing, contact details, legal language, testimonials, examples, and offers, then each page may deserve its own self-referencing canonical.

This recipe helps inspect what the live page is currently declaring.

## What the snippet checks

The snippet checks four things:

1. Whether the page has a canonical tag.
2. Whether the page has more than one canonical tag.
3. Which canonical URL is declared in the HTML.
4. Whether the canonical URL matches the current browser URL.

## JavaScript snippet

```js
function canonicalAnalyzer() {
  const canonicals = [...document.querySelectorAll('link[rel="canonical"]')];

  console.log("Canonical count:", canonicals.length);

  if (canonicals.length === 0) {
    console.warn("No canonical tag found.");
    return;
  }

  canonicals.forEach((tag, index) => {
    console.log("Canonical " + (index + 1) + ":", tag.href);
  });

  const currentUrl = window.location.href.split("#")[0];
  const canonicalUrl = canonicals[0].href;

  if (canonicals.length > 1) {
    console.warn("Problem: More than one canonical tag found.");
  }

  if (canonicalUrl !== currentUrl) {
    console.warn("Canonical points to a different URL:", canonicalUrl);
  } else {
    console.log("Canonical matches the current URL.");
  }
}

canonicalAnalyzer();
```

## How to use it

Open the page you want to inspect.

Open browser DevTools.

Go to the Console tab.

Paste the snippet.

Run it.

The output will tell you whether the page has no canonical tag, one canonical tag, multiple canonical tags, or a canonical that points to a different URL.

## Example outputs

A healthy self-referencing canonical may look like this:

```txt
Canonical count: 1
Canonical 1: https://example.com/services/data-automation/
Canonical matches the current URL.
```

A missing canonical may look like this:

```txt
Canonical count: 0
No canonical tag found.
```

A possible conflict may look like this:

```txt
Canonical count: 2
Canonical 1: https://example.com/services/data-automation/
Canonical 2: https://example.com/services/
Problem: More than one canonical tag found.
```

A page consolidating into another URL may look like this:

```txt
Canonical count: 1
Canonical 1: https://example.com/us/color-analysis/
Canonical points to a different URL: https://example.com/us/color-analysis/
```

That last result is not automatically wrong. It means the current page is declaring another URL as the preferred version. The important question is whether that matches the business strategy.

## When to use this

Use this diagnostic after publishing a new landing page, creating regional pages, duplicating a page for a campaign, changing a CMS template, installing an SEO plugin, migrating URLs, or investigating why a page is not appearing in search results.

It is useful because canonical problems are often invisible when looking at the page visually. The page may look correct to a user while the HTML is sending a different signal to search engines.

## What this does not check

This snippet does not check whether Google has indexed the page.

It does not check whether Google has accepted the canonical.

It does not check robots.txt, sitemap entries, redirects, internal links, robots meta tags, or hreflang annotations.

It is a quick browser-level diagnostic. For a deeper investigation, compare the canonical tag with the sitemap, internal links, redirects, robots meta tag, hreflang setup, and Google Search Console inspection result.

## Related links

Website recipe:

https://matteoarellano.com/resources/browser-diagnostics/canonical-analyzer-part-1/

Medium article:

https://medium.com/p/adc110c16197?postPublishedType=initial

Chrome extension:

https://chromewebstore.google.com/detail/seo-page-audit/ehoodgoogeajolhoecncknkcgfgjnjji

## Author

Created by [Matteo Arellano](https://www.linkedin.com/in/matteoarellano/).

I work on technical SEO, analytics, AI visibility, campaign tracking, and large-scale data analysis.
