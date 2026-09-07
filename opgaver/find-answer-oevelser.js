// JavaScript-øvelse 1: Byg findAnswer() af små dele
// Kør filen med: node find-answer-oevelser.js
//
// Arbejd oppefra og ned. Hver funktion indeholder en TODO og en startværdi,
// så filen kan køre fra begyndelsen. En test med ❌ betyder, at der stadig
// mangler kode. Ret kun én del ad gangen, indtil dens tests viser ✅.
// check() er et givet testværktøj. Du skal bruge det, men ikke ændre det.

function check(label, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(passed ? "✅" : "❌", label);

  if (!passed) {
    console.log("   Forventet:", expected);
    console.log("   Modtog:   ", actual);
  }
}

console.log("\n--- 1. Funktion, parameter, argument og return ---");

// OPGAVE:
// Skriv funktionens body, så den returnerer teksten "Hej Ada", når argumentet
// er "Ada". Brug parameteren name — skriv ikke navnet direkte i teksten.
function makeGreeting(name) {
  // TODO: Skriv din kode her.
  return undefined;
}

check("makeGreeting bruger argumentet", makeGreeting("Ada"), "Hej Ada");
check("funktionen kan genbruges", makeGreeting("Sam"), "Hej Sam");

// FORKLAR:
// Hvad er parameteren? Hvad er argumentet i det første kald?
// Hvad sender return tilbage til check()?

console.log("\n--- 2. Normalisér tekst ---");

// OPGAVE:
// Brug toLowerCase(), så funktionen returnerer spørgsmålet med små bogstaver.
function normalizeQuestion(question) {
  // TODO: Erstat startværdien.
  return question;
}

check(
  "store bogstaver bliver små",
  normalizeQuestion("Hvad HEDDER du?"),
  "hvad hedder du?"
);
check(
  "en anden tekst kan normaliseres",
  normalizeQuestion("HVOR BOR DU?"),
  "hvor bor du?"
);

// FORKLAR:
// Bliver argumentet ændret, eller returnerer metoden en ny tekst?

console.log("\n--- 3. Undersøg ét nøgleord ---");

// OPGAVE:
// Funktionen skal være uafhængig af store og små bogstaver.
// Normalisér spørgsmålet, og brug includes() til at returnere en boolean.
function containsKeyword(question, keyword) {
  // TODO: Skriv din kode her.
  return undefined;
}

check(
  "finder et kendt nøgleord",
  containsKeyword("Hvad HEDDER du?", "hedder"),
  true
);
check(
  "afviser et ukendt nøgleord",
  containsKeyword("Hvad HEDDER du?", "bor"),
  false
);

// FORKLAR:
// Hvilken datatype returnerer includes()?
// Hvilke to argumenter modtager containsKeyword()?

console.log("\n--- 4. Undersøg flere nøgleord ---");

// OPGAVE:
// Brug .some() og containsKeyword(). Funktionen skal returnere true, så snart
// mindst ét element i keywords matcher spørgsmålet.
function hasKeyword(question, keywords) {
  // TODO: Erstat startværdien.
  return undefined;
}

check(
  "mindst ét nøgleord matcher",
  hasKeyword("Hvad hedder du?", ["navn", "hedder", "hvem er du"]),
  true
);
check(
  "ingen nøgleord matcher",
  hasKeyword("Kan du bage?", ["navn", "hedder", "hvem er du"]),
  false
);

// FORKLAR:
// Hvad indeholder callback-parameteren på én tur gennem arrayet?
// Hvorfor behøver .some() ikke undersøge resten efter et match?

console.log("\n--- 5. Byg findAnswer() ---");

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

// OPGAVE:
// Byg funktionen med for...of, hasKeyword(), if og return.
// Returnér svaret fra den første regel, der matcher.
// Returnér standardsvaret efter løkken, hvis ingen regel matcher.
function findAnswer(question) {
  // TODO: Skriv løkken og din if-sætning her.
  return undefined;
}

check("finder navnereglen", findAnswer("Hvad hedder du?"), "Jeg hedder Ada.");
check("finder bostedsreglen", findAnswer("Hvor BOR du?"), "Jeg bor i Aarhus.");
check(
  "bruger standardsvaret",
  findAnswer("Kan du bage en kage?"),
  "Det kender jeg ikke svaret på endnu."
);

// UNDERSØG EFTER TESTENE ER GRØNNE:
// 1. Tilføj console.log(answerGroup.keywords) inde i løkken.
// 2. Sammenlign et kendt og et ukendt spørgsmål.
// 3. Flyt bostedsreglen øverst. Hvad sker der ved et spørgsmål, der matcher
//    både navn og bosted?

console.log("\n--- TJEK JER SELV ---");
console.log("Kan du forklare parameter, argument, callback, boolean og return?");
console.log("Kan du forklare, hvorfor den første matchende regel vinder?");
