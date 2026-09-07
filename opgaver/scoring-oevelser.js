// JavaScript-øvelse 2: Byg scoring og findBestAnswer()
// Kør filen med: node scoring-oevelser.js
//
// Begynd først på denne fil, når du kan forklare findAnswer(). Arbejd oppefra
// og ned. Ret én TODO ad gangen, indtil de tilhørende tests viser ✅.
// check() er et givet testværktøj. Du skal bruge det, men ikke ændre det.

function check(label, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(passed ? "✅" : "❌", label);

  if (!passed) {
    console.log("   Forventet:", expected);
    console.log("   Modtog:   ", actual);
  }
}

const answers = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Ada."
  },
  {
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor i Aarhus."
  },
  {
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "I min fritid kan jeg godt lide at læse."
  }
];

console.log("\n--- 1. Tæl matchende nøgleord ---");

// OPGAVE:
// Brug filter() til at finde de nøgleord, som findes i normalizedQuestion.
// Returnér antallet af elementer i det nye array.
function countMatches(keywords, normalizedQuestion) {
  // TODO: Skriv din kode her.
  return undefined;
}

check(
  "to nøgleord matcher",
  countMatches(answers[0].keywords, "hvad hedder du, og hvad er dit navn?"),
  2
);
check(
  "ingen nøgleord matcher",
  countMatches(answers[0].keywords, "kan du bage en kage?"),
  0
);
check(
  "bostedsreglen kan også bruges",
  countMatches(answers[1].keywords, "hvilken by bor du i?"),
  2
);

// FORKLAR:
// Hvad returnerer filter()? Hvorfor skal vi også bruge .length?
// Hvordan er resultatet anderledes end resultatet fra some()?

console.log("\n--- 2. Beregn score for alle regler ---");

// OPGAVE:
// Gennemløb answers med for...of. Beregn hver regels score, og tilføj tallet
// til scores med push(). Funktionen skal returnere fx [2, 1, 0].
function scoresFor(question) {
  const normalizedQuestion = question.toLowerCase();
  const scores = [];

  // TODO: Skriv løkken her.

  return scores;
}

check(
  "alle tre regler får en score",
  scoresFor("Hvad hedder du, hvad er dit navn, og hvor bor du?"),
  [2, 1, 0]
);

// FORKLAR:
// Hvor mange gange kører løkken? Hvad indeholder answerGroup på én tur?
// Hvorfor må funktionen ikke returnere inde i løkken?

console.log("\n--- 3. Vælg reglen med den højeste score ---");

// OPGAVE:
// 1. Gennemløb alle regler.
// 2. Beregn den aktuelle regels score.
// 3. Opdatér bestScore og bestAnswer, når den nye score er højere.
// 4. Returnér det bedste svar som en tekst efter løkken.
function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  let bestScore = 0;
  let bestAnswer = "Det kender jeg ikke svaret på endnu.";

  // TODO: Skriv løkken og sammenligningen her.
  // TODO: Erstat placeholderen med den værdi, funktionen skal returnere.
  return undefined;
}

check(
  "navn vinder med flest match",
  findBestAnswer("Hvad hedder du, hvad er dit navn, og hvor bor du?"),
  "Jeg hedder Ada."
);
check(
  "bosted vinder med flest match",
  findBestAnswer("Hvad er dit navn, og hvilken by bor du i?"),
  "Jeg bor i Aarhus."
);
check(
  "standardsvaret bliver stående uden match",
  findBestAnswer("Kan du bage en kage?"),
  "Det kender jeg ikke svaret på endnu."
);
check(
  "den første regel vinder ved samme score",
  findBestAnswer("Hvad er dit navn, og hvor bor du?"),
  "Jeg hedder Ada."
);

// FORKLAR:
// Følg bestScore og bestAnswer gennem én af testene.
// Hvorfor bruger sammenligningen > og ikke >=?
// Hvorfor bliver standardsvaret stående, når alle scores er 0?

console.log("\n--- 4. Skriv og test din egen regel ---");

// OPGAVE:
// 1. Tilføj en fjerde regel til answers.
// 2. Skriv selv en check(), hvor mindst to af dens nøgleord matcher.
// 3. Kontrollér den returnerede svartekst.

console.log("\n--- TJEK JER SELV ---");
console.log("Kan du forklare filter, score, løkke, sammenligning og return?");
console.log("Kan du bygge algoritmen igen uden at kopiere den til AMAbotten?");
