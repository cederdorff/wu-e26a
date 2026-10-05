import Reveal from "reveal.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
import RevealNotes from "reveal.js/plugin/notes/notes.esm.js";
import "reveal.js/dist/reveal.css";
import "reveal.js/plugin/highlight/monokai.css";

const deck = new Reveal({
  width: 1600,
  height: 900,
  margin: 0,
  minScale: 0.2,
  maxScale: 2,
  controls: true,
  progress: true,
  hash: true,
  history: true,
  center: false,
  transition: "fade",
  backgroundTransition: "fade",
  slideNumber: "c/t",
  plugins: [RevealNotes, RevealHighlight]
});

await deck.initialize();

// Pill buttons that always jump back to the overview slides (if the deck has them)
for (const [id, label, aria, extra] of [
  ["agenda", "Agenda", "Gå til agendaen", ""],
  ["ovelser", "Øvelser", "Gå til oversigten over øvelser", "exercises-link"]
]) {
  const target = document.querySelector(`section#${id}`);
  if (!target) continue;
  const link = document.createElement("a");
  link.className = `agenda-link ${extra}`.trim();
  link.href = `#/${id}`;
  link.textContent = label;
  link.setAttribute("aria-label", aria);
  document.querySelector(".reveal .slides")?.append(link);
}

for (const pre of document.querySelectorAll("pre[data-copy]")) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-button";
  button.textContent = "Kopiér";
  button.addEventListener("click", async () => {
    await navigator.clipboard.writeText(pre.querySelector("code").textContent);
    button.textContent = "Kopieret ✓";
    setTimeout(() => { button.textContent = "Kopiér"; }, 1500);
  });
  pre.append(button);
}

document.documentElement.classList.add("deck-ready");
