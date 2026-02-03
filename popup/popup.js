const listEl = document.getElementById("blacklist");
const countEl = document.getElementById("count");
const inputEl = document.getElementById("company-input");
const formEl = document.getElementById("add-form");
const refreshBtn = document.getElementById("refresh");
const toggleEl = document.getElementById("enabled-toggle");
const disableToggleEl = document.getElementById("disabled-toggle");
const applyBtn = document.getElementById("refresh");

chrome.storage.local.get(["enabled"], ({ enabled = true }) => {
  toggleButtonStyle(enabled);
});

/**
 * Helpers
 * @param {*} text
 * @returns
 */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Render
 * @param {*} list
 */
function render(list) {
  listEl.innerHTML = "";
  countEl.textContent = `${list.length} companies`;

  list.forEach((company, index) => {
    const li = document.createElement("li");
    li.textContent = company;

    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.onclick = () => removeCompany(index);

    li.appendChild(delBtn);
    listEl.appendChild(li);
  });
}

/**
 * Storage
 */
function load() {
  chrome.storage.local.get(["blacklist"], ({ blacklist = [] }) => {
    render(blacklist);
  });
}

function save(list) {
  chrome.storage.local.set({ blacklist: list }, load);
}

function addCompany(name) {
  chrome.storage.local.get(["blacklist"], ({ blacklist = [] }) => {
    const normalized = normalize(name);

    if (!normalized || blacklist.some((e) => normalize(e) === normalized)) {
      return;
    }

    blacklist.push(name.trim());
    save(blacklist);
  });
}

function removeCompany(index) {
  chrome.storage.local.get(["blacklist"], ({ blacklist = [] }) => {
    blacklist.splice(index, 1);
    save(blacklist);
  });
}

/**
 * Event listener
 */
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  addCompany(inputEl.value);
  inputEl.value = "";
});

refreshBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.reload(tabs[0].id);
  });
});

/**
 * Toggle style for the button
 * @param {*} state
 */
function toggleButtonStyle(state) {
  if (state) {
    toggleEl.classList.add("enabled");
    toggleEl.classList.remove("neutral");
    disableToggleEl.classList.add("neutral");
    disableToggleEl.classList.remove("disabled");
    applyBtn.disabled = false;
    applyBtn.classList.remove("btn-disabled");
    applyBtn.classList.add("btn-apply");
  } else {
    toggleEl.classList.add("neutral");
    toggleEl.classList.remove("enabled");
    disableToggleEl.classList.add("disabled");
    disableToggleEl.classList.remove("enabled");
    applyBtn.disabled = true;
    applyBtn.classList.add("btn-disabled");
    applyBtn.classList.remove("btn-apply");
  }
}

function toggleButtonState() {
  chrome.storage.local.get(["enabled"], ({ enabled = true }) => {
    const newState = !enabled;
    //Save new state
    chrome.storage.local.set({ enabled: newState });

    //Toggle style part
    toggleButtonStyle(newState);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "TOGGLE",
        enabled: newState,
      });
    });
  });
}

/**
 * Event listener for toggle buttons
 */
toggleEl.addEventListener("click", () => {
  toggleButtonState();
});
disableToggleEl.addEventListener("click", () => {
  toggleButtonState();
});

load();
