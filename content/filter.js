/**
 * Applies filtering rules to job listings based on a blacklist of companies.
 * @module filter
 */

/**
 * Site-specific rules for identifying job cards and company names.
 * We can add more sites as needed.
 */
const SITE_RULES = {
  "linkedin.com": {
    jobCard: "li.jobs-search-results__list-item",
    company: "span.job-card-container__company-name",
  },
  "indeed.com": {
    jobCard: "div.job_seen_beacon",
    company: "span.companyName",
  },
  "computrabajo.com": {
    jobCard: "article.box_offer",
    company: "p.fs16.fc_base",
  },
};

/**
 * Utilities
 */
function normalize(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isBlacklisted(companyName, blacklist) {
  const normalizedCompany = normalize(companyName);

  return blacklist.some((entry) => {
    const normalizedEntry = normalize(entry);
    return normalizedCompany.includes(normalizedEntry);
  });
}

/**
 * Filters magic
 */
function applyFilter(rules, blacklist) {
  const cards = document.querySelectorAll(rules.jobCard);

  cards.forEach((card) => {
    // avoide re-processing cards
    if (card.dataset.jobFiltered === "true") return;

    const companyEl = card.querySelector(rules.company);
    if (!companyEl) return;

    const companyName = companyEl.innerText || "";

    if (isBlacklisted(companyName, blacklist)) {
      card.style.display = "none";
      card.dataset.jobFiltered = "true";
    }
  });
}

/**
 * Dynamic DOM observer
 */
function startObserver(rules) {
  const observer = new MutationObserver(() => {
    chrome.storage.local.get(
      ["blacklist", "enabled"],
      ({ blacklist = [], enabled = true }) => {
        if (!enabled) return;
        applyFilter(rules, blacklist);
      },
    );
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Just init
 */
(function init() {
  const hostname = window.location.hostname;

  const siteKey = Object.keys(SITE_RULES).find((site) =>
    hostname.includes(site),
  );

  if (!siteKey) return;

  const rules = SITE_RULES[siteKey];

  /* chrome.storage.local.get(["blacklist"], ({ blacklist = [] }) => {
    applyFilter(rules, blacklist);
    startObserver(rules);
  }); */
  chrome.storage.local.get(
    ["blacklist", "enabled"],
    ({ blacklist = [], enabled = true }) => {
      if (!enabled) return;
      applyFilter(rules, blacklist);
      startObserver(rules);
    },
  );
})();

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TOGGLE") {
    if (msg.enabled) {
      chrome.storage.local.get(["blacklist"], ({ blacklist = [] }) => {
        applyFilter(rules, blacklist);
      });
    }
  }
});
