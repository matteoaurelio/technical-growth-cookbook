# Technical Growth Cookbook

Reusable code recipes for SEO, analytics, campaign tracking, browser diagnostics, performance, Search Console analysis, and large-scale data workflows.

This cookbook is built around practical business problems. Each recipe explains the problem, shows a code pattern, explains how it works, and connects the technical solution to measurement, visibility, or decision-making.

## Why this exists

Technical growth work often sits between marketing, analytics, SEO, engineering, and data analysis.

A small script can help answer a real business question:

- Which campaign variant converts better?
- Which pages have broken metadata?
- Which scripts are slowing down a page?
- Which Search Console queries deserve attention?
- Which landing pages are isolated from internal links?
- Which large datasets need a better workflow than spreadsheets?

This cookbook collects practical patterns across technical SEO, analytics, and data work.

## What this repository contains

This repository is the GitHub version of the Technical Growth Cookbook.

The website version is more polished and easier to browse. The GitHub version is more technical, transparent, and easier to reuse.

The structure is:

```txt
technical-growth-cookbook/
  README.md
  chapters/
    01-campaign-tracking/
      001-split-campaign-traffic-utm.md
    02-analytics-qa/
    03-seo-growth/
    04-crawling-redirects/
    05-browser-diagnostics/
    06-performance/
    07-search-console-serp/
    08-internal-linking/
    09-data-workflows/
    10-reporting/
  examples/
    cloudflare-workers/
      split-campaign-traffic-utm.js
```

## Chapters

1. [Campaign Tracking & UTM Systems](chapters/01-campaign-tracking/)
2. [Analytics QA & Conversion Measurement](chapters/02-analytics-qa/)
3. [SEO Growth & Audit Automation](chapters/03-seo-growth/)
4. [Crawling, Broken Links & Redirect Logic](chapters/04-crawling-redirects/)
5. [Rendering, JavaScript & Browser Diagnostics](chapters/05-browser-diagnostics/)
6. [Core Web Vitals & Performance Diagnostics](chapters/06-performance/)
7. [Search Console, SERP & Search Demand Analysis](chapters/07-search-console-serp/)
8. [Internal Linking & Site Architecture Graphs](chapters/08-internal-linking/)
9. [Large-Scale Data Workflows with Python, Polars & Cloud](chapters/09-data-workflows/)
10. [Reporting, Visualization & Decision Systems](chapters/10-reporting/)

## Available recipes

### Campaign Tracking & UTM Systems

- [Recipe 001 — Split one campaign URL between two landing pages and track variants with UTMs](chapters/01-campaign-tracking/001-split-campaign-traffic-utm.md)

### Browser Diagnostics

- [Recipe 002 - Understand your canonical URL and whether they align with your business strategy](chapters/05-browser-diagnostics/002-canonical-analyzer-part-1.md)

## Code examples

Some recipes include standalone code files that can be reused or adapted.

- [Cloudflare Worker example — Split campaign traffic with UTMs](examples/cloudflare-workers/split-campaign-traffic-utm.js)

## Recipe format

Each recipe follows this structure:

1. Business problem
2. When to use it
3. When not to use it
4. Code recipe
5. How it works
6. What to measure
7. Mistakes to avoid
8. Related website article or service

## Website version

The web version of this cookbook lives here:

https://matteoarellano.com/resources/

The first published recipe is here:

https://matteoarellano.com/resources/campaign-tracking/split-campaign-traffic-utm/

## Related article

The first recipe is connected to this Analytics & Measurement article:

https://matteoarellano.com/blog/analytics-measurement/utm-ab-test-traffic-split-food-delivery/

## How this will grow

This cookbook will grow recipe by recipe.

The plan is to publish practical patterns across:

- UTM systems and campaign tracking
- Analytics QA and conversion measurement
- Technical SEO audit automation
- Crawling, broken links, and redirects
- Browser rendering and JavaScript diagnostics
- Core Web Vitals and performance diagnostics
- Search Console, SERP, and search demand analysis
- Internal linking and site architecture
- Python, Polars, cloud, and large-scale data workflows
- Reporting, visualization, and decision systems

Each recipe can become:

- a website resource
- a GitHub recipe
- a LinkedIn post
- a future cookbook chapter

## Author

Created by [Matteo Arellano](https://www.linkedin.com/in/matteoarellano/).

I work on technical SEO, analytics, AI visibility, campaign tracking, and large-scale data analysis.
