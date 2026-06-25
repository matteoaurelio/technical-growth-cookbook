# Recipe 003 – Audit Cookie Consent, Browser Storage, and the dataLayer With Playwright

This recipe is connected to the article:

[Is Your Cookie Banner Aligned With Your Tracking? A Case Study of the Sagrada Família Website](https://matteoarellano.com/blog/technical-seo/is-your-cookie-banner-aligned-with-your-tracking/)

The article explains the investigation.  
This script gives you a repeatable way to run the same kind of check.

## What this recipe checks

Cookie banners are easy to see in the browser, but the interesting part happens behind the UI.

This script checks what changes when a user accepts all cookies and what changes when a user declines cookies or accepts only necessary cookies.

It looks at three layers:

- What exists in `window.dataLayer`
- What is stored in cookies, `localStorage`, and `sessionStorage`
- Which tracking requests appear in the Network layer

This is useful because a cookie banner can look correct visually, but still send the wrong signal to GTM, GA4, Google Ads, or another marketing tool.

## When to use this

Use this recipe when:

- You want to test whether a cookie banner is connected to tracking behavior.
- You want to compare “accept all” versus “decline” in a clean way.
- You want to see what the browser stores after each consent choice.
- You want to check whether consent events appear in the `dataLayer`.
- You want screenshots and JSON evidence for an audit.

Do not use this as the only proof that tracking is fully correct.

This script helps you inspect the browser state and the `dataLayer`. To fully prove whether a GA4 tag, Google Ads tag, or remarketing tag fired correctly, you should also use GTM Preview, Tag Assistant, and network request inspection.

## Files

Recommended structure:

```txt
technical-cookbook/
  chapters/
    02-analytics-qa/
      003-cookie-consent-datalayer-audit.md
  examples/
    playwright/
      cookie-consent-datalayer-audit.mjs
```

## Install Playwright

If your project does not have Playwright yet:

```bash
npm install -D playwright
npx playwright install chromium
```

## Run the script

Default run:

```bash
node examples/playwright/cookie-consent-datalayer-audit.mjs
```

Run against a specific website:

```bash
TARGET_URL="https://sagradafamilia.org/" node examples/playwright/cookie-consent-datalayer-audit.mjs
```

Run in headless mode:

```bash
HEADLESS=true node examples/playwright/cookie-consent-datalayer-audit.mjs
```

Choose a custom output folder:

```bash
OUTPUT_DIR="audit-results/sagrada-familia" node examples/playwright/cookie-consent-datalayer-audit.mjs
```

## What the script creates

The script creates a folder called:

```txt
cookie-consent-audit-results
```

Inside it, you get:

```txt
accept-all.json
decline.json
accept-all-before-choice.png
accept-all-after-choice.png
decline-before-choice.png
decline-after-choice.png
```

The two JSON files are the main evidence.

The screenshots help you confirm which banner state was visible before and after the click.

## Why the script uses two browser contexts

The script does not accept cookies and then decline cookies in the same browser context.

It opens a fresh context for each scenario:

```txt
Scenario 1: accept all cookies
Scenario 2: decline or necessary-only cookies
```

This matters because cookies and `localStorage` can persist inside the same browser context.

If you accept cookies first and then try to test decline in the same context, the second test may already be affected by the first choice.

Fresh context means cleaner evidence.

## What happens in each scenario

For each scenario, the script does this:

```txt
Open the page
Capture the browser environment
Capture the dataLayer on load
Wait 6 seconds
Capture the dataLayer again
Capture cookies and browser storage before the click
Take a screenshot before the click
Click the cookie button
Wait 3 seconds
Capture the dataLayer after the choice
Capture cookies and browser storage after the choice
Take a screenshot after the click
Save everything as JSON
```

That flow matches the logic from the article.

You are not only checking the banner. You are checking whether the browser state and tracking state change after the consent choice.

## What to inspect in the JSON

### 1. Environment

Look at:

```json
"environment": {
  "url": "https://sagradafamilia.org/",
  "language": "ca-ES",
  "languages": ["ca-ES", "ca", "es", "en"],
  "webdriver": true,
  "timezone": "Europe/Madrid"
}
```

This tells you the browser language, timezone, user agent, and whether the browser is automated.

The `webdriver` value is normally `true` when running Playwright. That is expected.

### 2. dataLayer on load

Look at:

```json
"dataLayer": {
  "onLoad": {
    "exists": true,
    "isArray": true,
    "length": 4,
    "eventNames": ["gtm.js"]
  }
}
```

This tells you whether the website created a `window.dataLayer`.

If `exists` is false, then GTM may not be using a standard `dataLayer`, or the site may not have loaded it yet.

### 3. dataLayer after waiting

Some consent tools push events after a short delay.

That is why the script waits 6 seconds and captures again.

Look for events such as:

```txt
cf_consent_necessary
cf_consent_advertising
cf_consent_performance
cf_consent_functional
cf_after_consent_update
cf_layer_ready
```

These events can show whether the banner state is being communicated to GTM.

### 4. Browser storage before and after the choice

Look at:

```json
"storage": {
  "beforeChoice": {},
  "afterChoice": {}
}
```

Inside this section, compare:

- `cookies`
- `documentCookie`
- `localStorage`
- `sessionStorage`

After accepting all cookies, you may expect to see analytics or advertising cookies, depending on the website setup.

After declining, you should usually see only necessary or consent-related storage.

The exact result depends on the site, the consent tool, the region, and the tag setup.

### 5. Consent commands

The script also captures `gtag` consent commands inside the `dataLayer`.

They may look like this:

```json
{
  "0": "consent",
  "1": "default",
  "2": {
    "ad_storage": "denied",
    "analytics_storage": "denied",
    "wait_for_update": 2000,
    "region": ["ES", "FR", "DE"]
  }
}
```

This is useful because consent is not always pushed as a normal event.

Sometimes it appears as a command.

That is why the script captures both:

- `consentEvents`
- `consentCommands`

## Important interpretation

The `dataLayer` works like a timeline.

If a category was false before acceptance and true after acceptance, both values can exist in the same `dataLayer`.

That does not automatically mean the site is broken.

It means the list contains the previous state and the updated state.

The order matters.

A simple way to read it:

```txt
Early entries show defaults.
Later entries show what changed after the user choice.
```

## Tracking requests

The script also listens for tracking requests that include:

```txt
google-analytics.com/g/collect
google-analytics.com/j/collect
googletagmanager.com
googleadservices.com
doubleclick.net
analytics.google.com
```

This helps connect the consent state with actual network behavior.

If you accept all cookies and then see GA4 requests, that may be expected.

If you decline cookies and still see advertising or analytics requests with identifiers, that needs deeper investigation.

Do not jump to conclusions from one request alone. Some systems can send cookieless pings, consent-mode pings, or limited measurement requests. Use GTM Preview and Tag Assistant when you need final confirmation.

## Adjusting button text

Cookie banners use different languages.

The script has two button text lists:

```js
buttonTexts: [
  "Accepta-ho tot",
  "Accept all",
  "Aceptar todo"
]
```

and:

```js
buttonTexts: [
  "Declina",
  "Decline",
  "Reject all",
  "Accept Necessary"
]
```

If the script does not click the banner, add the exact button text you see in the browser.

## Why this is useful for audits

This gives you evidence instead of guessing.

You can show:

- What the banner displayed
- What the browser stored
- What the `dataLayer` received
- What changed after accepting cookies
- What changed after declining cookies
- Which tracking requests appeared after the choice

That is a much stronger audit than only saying “the cookie banner seems fine.”

## Related article

I explain the full investigation here:

[Is Your Cookie Banner Aligned With Your Tracking? A Case Study of the Sagrada Família Website](https://matteoarellano.com/blog/technical-seo/is-your-cookie-banner-aligned-with-your-tracking/)

The article walks through the cookie storage, the `dataLayer`, consent defaults, regional consent rules, and why the sequence of events matters.
