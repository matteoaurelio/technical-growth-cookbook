import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Cookie consent + dataLayer audit
 *
 * This script runs the same page twice in fresh browser contexts:
 * 1. accept-all: clicks the full cookie acceptance button
 * 2. decline: clicks the decline / necessary-only button
 *
 * It captures:
 * - browser environment
 * - dataLayer on load
 * - dataLayer after waiting a few seconds
 * - storage before clicking the banner
 * - storage after the cookie choice
 * - dataLayer after the cookie choice
 * - selected tracking network requests after the choice
 * - screenshots before and after the choice
 *
 * Run:
 * node examples/playwright/cookie-consent-datalayer-audit.mjs
 *
 * Optional:
 * TARGET_URL="https://example.com" node examples/playwright/cookie-consent-datalayer-audit.mjs
 */

const TARGET_URL = process.env.TARGET_URL || "https://sagradafamilia.org/";
const OUTPUT_DIR = process.env.OUTPUT_DIR || "cookie-consent-audit-results";
const HEADLESS = process.env.HEADLESS === "true";

const WAIT_AFTER_LOAD_MS = 6000;
const WAIT_AFTER_CHOICE_MS = 3000;

const scenarios = [
  {
    name: "accept-all",
    buttonTexts: [
      "Accepta-ho tot",
      "Accept all",
      "Accept All",
      "Aceptar todo",
      "Aceptar todos",
      "Accepter tout",
      "Akzeptieren",
      "Allow all",
    ],
  },
  {
    name: "decline",
    buttonTexts: [
      "Declina",
      "Decline",
      "Reject all",
      "Reject All",
      "Rechazar todo",
      "Solo necesarias",
      "Accept Necessary",
      "Necessary only",
      "Only necessary",
    ],
  },
];

await fs.mkdir(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch({
  headless: HEADLESS,
  slowMo: HEADLESS ? 0 : 150,
});

try {
  for (const scenario of scenarios) {
    console.log(`\nRunning scenario: ${scenario.name}`);

    const result = await runScenario(browser, scenario);

    const jsonPath = path.join(OUTPUT_DIR, `${scenario.name}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(result, null, 2), "utf8");

    console.log(`Saved: ${jsonPath}`);
  }
} finally {
  await browser.close();
}

async function runScenario(browser, scenario) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "ca-ES",
    timezoneId: "Europe/Madrid",
    extraHTTPHeaders: {
      "Accept-Language": "ca-ES,ca;q=0.9,es;q=0.8,en;q=0.7",
    },
  });

  const page = await context.newPage();

  const trackingRequests = [];

  page.on("request", (request) => {
    const url = request.url();

    if (isTrackingRequest(url)) {
      trackingRequests.push({
        timestamp: new Date().toISOString(),
        method: request.method(),
        url,
      });
    }
  });

  await page.goto(TARGET_URL, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });

  const environment = await getEnvironment(page);
  const onLoad = await getDataLayerSummary(page);

  await page.waitForTimeout(WAIT_AFTER_LOAD_MS);

  const afterWait = await getDataLayerSummary(page);
  const storageBeforeChoice = await getStorageSummary(page);

  const beforeScreenshotPath = path.join(
    OUTPUT_DIR,
    `${scenario.name}-before-choice.png`,
  );

  await page.screenshot({
    path: beforeScreenshotPath,
    fullPage: true,
  });

  const clickResult = await clickCookieButton(page, scenario.buttonTexts);

  await page.waitForTimeout(WAIT_AFTER_CHOICE_MS);

  const afterChoice = await getDataLayerSummary(page);
  const storageAfterChoice = await getStorageSummary(page);

  const afterScreenshotPath = path.join(
    OUTPUT_DIR,
    `${scenario.name}-after-choice.png`,
  );

  await page.screenshot({
    path: afterScreenshotPath,
    fullPage: true,
  });

  await context.close();

  return {
    scenario: scenario.name,
    targetUrl: TARGET_URL,
    environment,
    clickResult,
    screenshots: {
      beforeChoice: beforeScreenshotPath,
      afterChoice: afterScreenshotPath,
    },
    dataLayer: {
      onLoad,
      afterWait,
      afterChoice,
    },
    storage: {
      beforeChoice: storageBeforeChoice,
      afterChoice: storageAfterChoice,
    },
    trackingRequests,
  };
}

async function getEnvironment(page) {
  return page.evaluate(() => ({
    url: location.href,
    language: navigator.language,
    languages: navigator.languages,
    userAgent: navigator.userAgent,
    webdriver: navigator.webdriver,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }));
}

async function getDataLayerSummary(page) {
  return page.evaluate(() => {
    const dataLayer = window.dataLayer;

    if (!Array.isArray(dataLayer)) {
      return {
        exists: Boolean(dataLayer),
        isArray: false,
        length: 0,
        eventNames: [],
        consentEvents: [],
        consentCommands: [],
        lastEntries: [],
      };
    }

    const eventNames = dataLayer
      .map((item) => item && item.event)
      .filter(Boolean);

    const consentEvents = dataLayer.filter((item) => {
      return (
        item &&
        typeof item.event === "string" &&
        item.event.toLowerCase().includes("consent")
      );
    });

    const consentCommands = dataLayer.filter((item) => {
      return item && item[0] === "consent";
    });

    return {
      exists: true,
      isArray: true,
      length: dataLayer.length,
      eventNames,
      consentEvents,
      consentCommands,
      lastEntries: dataLayer.slice(-8),
    };
  });
}

async function getStorageSummary(page) {
  const cookies = await page.context().cookies();

  const browserStorage = await page.evaluate(() => {
    function readStorage(storage) {
      const result = {};

      for (let i = 0; i < storage.length; i += 1) {
        const key = storage.key(i);
        result[key] = storage.getItem(key);
      }

      return result;
    }

    return {
      documentCookie: document.cookie,
      localStorage: readStorage(window.localStorage),
      sessionStorage: readStorage(window.sessionStorage),
    };
  });

  return {
    cookies: cookies.map((cookie) => ({
      name: cookie.name,
      domain: cookie.domain,
      value: cookie.value,
      expires: cookie.expires,
    })),
    ...browserStorage,
  };
}

async function clickCookieButton(page, buttonTexts) {
  for (const text of buttonTexts) {
    const locator = page.getByText(text, { exact: true }).first();

    const isVisible = await locator
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (!isVisible) {
      continue;
    }

    await locator.click();

    return {
      clicked: true,
      matchedText: text,
    };
  }

  return {
    clicked: false,
    matchedText: null,
    reason:
      "No matching cookie button was visible. Check the banner language or add the button text to the scenario config.",
  };
}

function isTrackingRequest(url) {
  return [
    "google-analytics.com/g/collect",
    "google-analytics.com/j/collect",
    "googletagmanager.com",
    "googleadservices.com",
    "doubleclick.net",
    "analytics.google.com",
  ].some((pattern) => url.includes(pattern));
}
