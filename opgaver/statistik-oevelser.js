// Små øvelser om objekter som tællere
// Kør filen med: node statistik-oevelser.js
//
// Arbejd med én del ad gangen:
// 1. Forudsig resultatet.
// 2. Kør filen.
// 3. Forklar resultatet med egne ord.
// 4. Lav ændringen i kommentaren, og kør igen.
//
// Alle dele bruger det samme topicStats-objekt. Tællerne bygger derfor videre
// på de tidligere dele. Standardresultaterne forudsætter den oprindelige kode.
// Hent en frisk kopi, hvis dine ændringer gør outputtet svært at følge.

const topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};

console.log("\n--- 1. Læs properties med punktnotation ---");

console.log("Hele objektet:", topicStats);
console.log("Navn:", topicStats.navn);
console.log("Bosted:", topicStats.bosted);

// OPGAVE:
// Hvad forventer du, at de tre logs viser?
// Skriv en log, der viser fritid.
// Tilføj en ny property med værdien 0, og vis den i terminalen.

console.log("\n--- 2. Læs en property med bracket notation ---");

const selectedCategory = "navn";

console.log("Valgt kategori:", selectedCategory);
console.log("Valgt tæller:", topicStats[selectedCategory]);

// OPGAVE:
// Hvorfor kan vi ikke skrive topicStats.selectedCategory her?
// Skift værdien til "bosted" og derefter "fritid".
// Hvad sker der, hvis værdien ikke findes som property i objektet?

console.log("\n--- 3. Opdatér en tæller ---");

topicStats.navn = topicStats.navn + 1;
console.log("Efter ét spørgsmål om navn:", topicStats);

topicStats.navn = topicStats.navn + 1;
console.log("Efter endnu et spørgsmål om navn:", topicStats);

// OPGAVE:
// Hvilken værdi står der på højre side ved hver opdatering?
// Hvorfor ender navn på 2?
// Opdatér bosted én gang og fritid tre gange.

console.log("\n--- 4. Opdatér den kategori, en variabel peger på ---");

function countTopic(category) {
  if (category) {
    topicStats[category] = topicStats[category] + 1;
  }
}

countTopic("bosted");
countTopic("fritid");
countTopic("fritid");
countTopic("");

console.log("Efter countTopic():", topicStats);

// OPGAVE:
// Hvilke tre funktionskald ændrer objektet?
// Hvorfor ændrer countTopic("") ikke objektet?
// Tilføj to kald med kategorien "navn".

console.log("\n--- 5. Fra et resultat til statistik ---");

const matchedResult = {
  answer: "Jeg hedder Ada.",
  category: "navn"
};

const unknownResult = {
  answer: "Det kender jeg ikke svaret på endnu.",
  category: ""
};

countTopic(matchedResult.category);
countTopic(unknownResult.category);

console.log("Efter de to resultater:", topicStats);

// OPGAVE:
// Hvilket resultat bliver talt med?
// Hvordan ligner matchedResult det objekt, findBestAnswer() returnerer?
// Lav et nyt resultat med kategorien "bosted", og tæl det med.

console.log("\n--- 6. Ekstra: Object.entries() ---");

const topicEntries = Object.entries(topicStats);
console.log("Objektet som array:", topicEntries);

for (const stat of topicEntries) {
  console.log("Kategori:", stat[0], "Antal:", stat[1]);
}

// EKSTRAOPGAVE:
// Hvor mange elementer indeholder topicEntries?
// Hvilke to værdier indeholder hvert element?
// Tilføj en ny property til topicStats, og kør filen igen.

console.log("\n--- 7. Ekstra: switch ---");

function reactionFor(category) {
  switch (category) {
    case "navn":
      return "👋";
    case "bosted":
      return "🏠";
    case "fritid":
      return "🎉";
    default:
      return "🤖";
  }
}

console.log("Navn:", reactionFor("navn"));
console.log("Bosted:", reactionFor("bosted"));
console.log("Ukendt:", reactionFor("ukendt"));

// EKSTRAOPGAVE:
// Hvilken case passer til hvert funktionskald?
// Hvornår bruges default?
// Tilføj en case til den nye kategori, du selv har oprettet.

console.log("\n--- KLAR TIL INTEGRATION? ---");

// Du er klar, når du kan:
// - læse en property med både punktnotation og bracket notation
// - forklare, hvordan en tæller bliver forhøjet med 1
// - bruge en category-variabel til at vælge den rigtige tæller
// - forklare, hvorfor en tom kategori ikke bliver talt
