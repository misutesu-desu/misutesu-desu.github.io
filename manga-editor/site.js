const ui = document.getElementById("locale");
const group = document.getElementById("demo-switch");
const dialogue = document.getElementById("dialogue");
const lines = { ja: "これが最後の電車だ。", tr: "Bu son tren.", en: "This is the last train." };
const elements = [...document.querySelectorAll("[data-tr], [data-alt-tr], [data-label-tr]")].map(element => {
  const attribute = element.dataset.altTr ? "alt" : element.dataset.labelTr ? "aria-label" : null;
  return [
    element,
    attribute,
    attribute ? element.getAttribute(attribute) : element.textContent,
    element.dataset.altTr ?? element.dataset.labelTr ?? element.dataset.tr,
  ];
});
let english = new URLSearchParams(location.search).get("lang") !== "tr";

let panelLanguage;

function showDialogue(language) {
  for (const item of group.querySelectorAll("button")) {
    item.setAttribute("aria-pressed", String(item.dataset.lang === language));
  }
  dialogue.lang = language;
  dialogue.textContent = lines[language];
}

function localize() {
  document.documentElement.lang = english ? "en" : "tr";
  for (const [element, attribute, en, tr] of elements) {
    const label = english ? en : tr;
    if (attribute) element.setAttribute(attribute, label);
    else element.textContent = label;
  }
  ui.textContent = english ? "TR" : "EN";
  ui.setAttribute("aria-label", english ? "Switch site to Turkish" : "Siteyi İngilizceye çevir");
  showDialogue(panelLanguage ?? (english ? "en" : "tr"));
}
localize();

ui.addEventListener("click", () => {
  english = !english;
  const url = new URL(location.href);
  if (english) url.searchParams.delete("lang");
  else url.searchParams.set("lang", "tr");
  history.replaceState(null, "", url);
  localize();
});

group.addEventListener("click", event => {
  const button = event.target.closest("button[data-lang]");
  if (!button) return;
  panelLanguage = button.dataset.lang;
  showDialogue(panelLanguage);
});
