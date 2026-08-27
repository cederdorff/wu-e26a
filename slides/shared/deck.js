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

const agenda = document.querySelector("section#agenda");
if (agenda) {
  const link = document.createElement("a");
  link.className = "agenda-link";
  link.href = "#/agenda";
  link.textContent = "Agenda";
  link.setAttribute("aria-label", "Gå til agendaen");
  document.querySelector(".reveal")?.append(link);
  const sync = () => { link.hidden = deck.getCurrentSlide() === agenda; };
  deck.on("slidechanged", sync);
  sync();
}

document.documentElement.classList.add("deck-ready");
