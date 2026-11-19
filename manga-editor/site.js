const ui = document.getElementById("locale");
const group = document.getElementById("demo-switch");
const dialogue = document.getElementById("dialogue");
const copy = document.getElementById("copy");
const status = document.getElementById("copy-status");
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

function localize() {
  document.documentElement.lang = english ? "en" : "tr";
  for (const [element, attribute, en, tr] of elements) {
    const label = english ? en : tr;
    if (attribute) element.setAttribute(attribute, label);
    else element.textContent = label;
  }
  ui.textContent = english ? "TR" : "EN";
  ui.setAttribute("aria-label", english ? "Switch site to Turkish" : "Siteyi İngilizceye çevir");
  status.textContent = "";
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
  for (const item of group.querySelectorAll("button")) {
    item.setAttribute("aria-pressed", String(item === button));
  }
  dialogue.lang = button.dataset.lang;
  dialogue.textContent = lines[dialogue.lang];
});

copy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById("commands").textContent);
    status.textContent = english ? "Commands copied." : "Komutlar kopyalandı.";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById("commands"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = english ? "Press Ctrl+C to copy the selected commands." : "Seçili komutları kopyalamak için Ctrl+C’ye bas.";
  }
});
