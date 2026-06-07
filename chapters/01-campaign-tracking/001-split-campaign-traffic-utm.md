# Recipe 001 — Split one campaign URL between two landing pages and track variants with UTMs

## Business problem

A business wants to promote one campaign URL, QR code, flyer, or physical call-to-action, but it wants to test two different landing pages.

For example, a fictional food delivery business wants to compare:

- Menu A: family combo meals
- Menu B: quick lunch options

Instead of printing two different QR codes, the business can use one public campaign URL and split visitors between the two destinations.

The important part is not only the redirect. The important part is that each visitor is labelled correctly with UTM parameters so the business can compare conversions later.

## When to use this

Use this pattern when:

- You want one public campaign URL.
- You want to test two destination pages.
- You want to label each variant in analytics.
- You want a lightweight alternative to a full A/B testing platform.
- You want to compare campaign outcomes such as orders, leads, checkout starts, or revenue per visitor.

## When not to use this

Do not use this pattern when:

- You need advanced experimentation statistics.
- You cannot measure conversions after the redirect.
- The destination pages are changing constantly during the test.
- You do not have enough traffic to compare variants meaningfully.
- You need user-level persistence across sessions.

## Code recipe

```js
export default {
  async fetch(request) {
    const menuA = "https://example-food.co/menu/family-combos";
    const menuB = "https://example-food.co/menu/quick-lunch";

    const variant =
      Math.random() < 0.5 ? "menu_a_family_combos" : "menu_b_quick_lunch";

    const target = variant === "menu_a_family_combos" ? menuA : menuB;

    const url = new URL(target);

    url.searchParams.set("utm_source", "restaurant_qr");
    url.searchParams.set("utm_medium", "qr");
    url.searchParams.set("utm_campaign", "menu_ab_test_june");
    url.searchParams.set("utm_content", variant);

    return Response.redirect(url.toString(), 302);
  }
};
```

## How it works

The public campaign URL receives the visitor first.

The script randomly assigns the visitor to one of two variants:

```js
const variant =
  Math.random() < 0.5 ? "menu_a_family_combos" : "menu_b_quick_lunch";
```

Then it chooses the matching destination page:

```js
const target = variant === "menu_a_family_combos" ? menuA : menuB;
```

Then it adds UTM parameters to the final URL:

```js
url.searchParams.set("utm_source", "restaurant_qr");
url.searchParams.set("utm_medium", "qr");
url.searchParams.set("utm_campaign", "menu_ab_test_june");
url.searchParams.set("utm_content", variant);
```

The most important parameter for the test is:

```txt
utm_content
```

That is where the variant is stored.

Finally, the user is redirected with a temporary redirect:

```js
return Response.redirect(url.toString(), 302);
```

A `302` redirect is appropriate because this is an experiment, not a permanent URL move.

## What to measure

After launching the test, compare both variants using metrics such as:

- Users by variant
- Landing page views
- Checkout starts
- Orders or leads
- Conversion rate
- Average order value
- Revenue per visitor

The winning version is not always the one with the highest conversion rate. One version may convert less often but create higher-value orders.

## Mistakes to avoid

Avoid these common mistakes:

- Changing UTM names halfway through the test.
- Using inconsistent values such as `qr`, `QR`, and `qrcode`.
- Measuring clicks but not conversions.
- Testing too many variants with too little traffic.
- Changing page design, offer, or pricing during the test.
- Publishing real client URLs, IDs, prices, or private business parameters in public examples.

## Website version

A polished website version of this recipe lives here:

https://matteoarellano.com/resources/campaign-tracking/split-campaign-traffic-utm/

## Related article

Full explanation:

https://matteoarellano.com/blog/analytics-measurement/utm-ab-test-traffic-split-food-delivery/
