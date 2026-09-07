// JavaScript-øvelse 3: Byg et objekt som tæller
// Kør filen med: node statistik-oevelser.js
//
// Arbejd oppefra og ned. Ret én TODO ad gangen, indtil dens tests viser ✅.
// Funktionerne modtager stats-objektet som argument, så hver test kan begynde
// med friske tællere og ikke afhænger af tidligere tests.
// check() er et givet testværktøj. Du skal bruge det, men ikke ændre det.

function check(label, actual, expected) {
  const passed = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(passed ? "✅" : "❌", label);

  if (!passed) {
    console.log("   Forventet:", expected);
    console.log("   Modtog:   ", actual);
  }
}

function createTopicStats() {
  return {
    navn: 0,
    bosted: 0,
    fritid: 0
  };
}

console.log("\n--- 1. Læs properties ---");

const exampleStats = createTopicStats();

// OPGAVE:
// Erstat startværdierne. Brug punktnotation til nameCount og bracket notation
// med selectedCategory til selectedCount.
const nameCount = -1;
const selectedCategory = "bosted";
const selectedCount = -1;

check("punktnotation læser navn", nameCount, 0);
check("bracket notation læser den valgte kategori", selectedCount, 0);

// FORKLAR:
// Hvorfor virker exampleStats.selectedCategory ikke i den anden opgave?

console.log("\n--- 2. Forhøj en bestemt tæller ---");

// OPGAVE:
// Forhøj stats.navn med 1. Funktionen skal ændre objektet, den modtager.
function incrementName(stats) {
  // TODO: Skriv din kode her.
}

const nameStats = createTopicStats();
incrementName(nameStats);
incrementName(nameStats);

check("navn bliver forhøjet to gange", nameStats, {
  navn: 2,
  bosted: 0,
  fritid: 0
});

// FORKLAR:
// Hvilken værdi står på højre side ved første og andet funktionskald?

console.log("\n--- 3. Vælg tælleren med en variabel ---");

// OPGAVE:
// Brug category og bracket notation til at vælge den rigtige property.
// En tom kategori skal ikke ændre objektet.
function countTopic(stats, category) {
  // TODO: Skriv en if-sætning og opdatér tælleren.
}

const selectedStats = createTopicStats();
countTopic(selectedStats, "bosted");
countTopic(selectedStats, "fritid");
countTopic(selectedStats, "fritid");
countTopic(selectedStats, "");

check("variablen vælger de rigtige tællere", selectedStats, {
  navn: 0,
  bosted: 1,
  fritid: 2
});

// FORKLAR:
// Hvilke tre kald ændrer objektet? Hvorfor ændrer det tomme kald ingenting?

console.log("\n--- 4. Forbind et resultat med statistikken ---");

const matchedResult = {
  answer: "Jeg hedder Ada.",
  category: "navn"
};

const unknownResult = {
  answer: "Det kender jeg ikke svaret på endnu.",
  category: ""
};

// OPGAVE:
// Brug countTopic() til at tælle kategorien fra result.
function countResult(stats, result) {
  // TODO: Skriv din kode her.
}

const resultStats = createTopicStats();
countResult(resultStats, matchedResult);
countResult(resultStats, unknownResult);

check("kun resultatet med en kategori bliver talt", resultStats, {
  navn: 1,
  bosted: 0,
  fritid: 0
});

// FORKLAR:
// Hvordan ligner result objektet fra findBestAnswer()?
// Hvorfor skal countResult() ikke kende kategoriernes navne på forhånd?

console.log("\n--- 5. Skriv din egen test ---");

// OPGAVE:
// 1. Opret et nyt stats-objekt med createTopicStats().
// 2. Opret selv et resultat med kategorien "bosted".
// 3. Tæl resultatet to gange.
// 4. Skriv en check(), der kontrollerer hele stats-objektet.

console.log("\n--- EKSTRA: Gennemløb objektet ---");

// EKSTRAOPGAVE:
// Brug Object.entries() og for...of til at vise fx "navn: 1" for hver
// property i resultStats. Hvilke to værdier indeholder hvert element?

console.log("\n--- TJEK JER SELV ---");
console.log("Kan du forklare punktnotation, bracket notation, property og tæller?");
console.log("Kan du bruge result.category til at vælge en tæller i AMAbotten?");
