/**
 * Applies filtering rules to job listings based on a blacklist of companies.
 * @module filter
 */

/**
 * Site-specific rules for identifying job cards and company names.
 * We can add more sites as needed.
 */
const SITE_RULES = {
  linkedin_logged: {
    match: () => document.querySelector("div.job-card-container[data-job-id]"),
    jobCard: "div.job-card-container[data-job-id]",
    company: ".artdeco-entity-lockup__subtitle span",
  },

  linkedin_public: {
    match: () => document.querySelector("div.base-search-card"),
    jobCard: "div.base-search-card",
    company: ".base-search-card__subtitle a",
  },
  indeed: {
    match: () => document.querySelector("div.job_seen_beacon"),
    jobCard: "li:has(div.job_seen_beacon)",
    company: 'span[data-testid="company-name"]',
  },

  computrabajo: {
    match: () => document.querySelector("article.box_offer"),
    jobCard: "article.box_offer",
    company: "p.fs16.fc_base",
  },
};

let activeRules = null;

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
  if (!rules) return;
  const cards = document.querySelectorAll(rules.jobCard);
  cards.forEach((card) => {
    // avoide re-processing cards
    if (card.dataset.jobFiltered === "true") return;
    const companyEl = card.querySelector(rules.company);
    if (!companyEl) return;

    const companyName = companyEl.innerText || "";
    if (isBlacklisted(companyName, blacklist)) {
      //card.remove();
      card.style.display = "none";
      card.style.setProperty("display", "none", "important");
      card.dataset.jobFiltered = "true";
    }
  });
}

/**
 * Waiting for rules
 * @param {*} callback
 */
function waitForRules(callback) {
  const interval = setInterval(() => {
    const rules = Object.values(SITE_RULES).find((r) => r.match());
    if (rules) {
      //console.log("✅ Rules detected:", rules);
      clearInterval(interval);
      callback(rules);
    }
  }, 500);
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
  waitForRules((rules) => {
    activeRules = rules;

    chrome.storage.local.get(
      ["blacklist", "enabled"],
      ({ blacklist = [], enabled = true }) => {
        if (!enabled) return;
        applyFilter(activeRules, blacklist);
        startObserver(activeRules);
      },
    );
  });
})();

/**
 * Listen for toggle events
 */
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TOGGLE" && msg.enabled && activeRules) {
    chrome.storage.local.get(["blacklist"], ({ blacklist = [] }) => {
      applyFilter(activeRules, blacklist);
    });
  }
});
