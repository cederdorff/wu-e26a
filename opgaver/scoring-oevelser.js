// Små øvelser om scoring i AMAbotten
// Kør filen med: node scoring-oevelser.js
//
// Arbejd med én del ad gangen:
// 1. Forudsig resultatet.
// 2. Kør filen.
// 3. Forklar resultatet med egne ord.
// 4. Lav ændringen i kommentaren, og kør igen.

const answers = [
  {
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Ada."
  },
  {
    category: "bosted",
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor i Aarhus."
  },
  {
    category: "fritid",
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "I min fritid kan jeg godt lide at læse."
  }
];

console.log("\n--- 1. filter() finder de matchende nøgleord ---");

const exampleKeywords = ["navn", "hedder", "hvem er du"];
const exampleQuestion = "hvad hedder du, og hvad er dit navn?";

const matchingKeywords = exampleKeywords.filter((keyword) =>
  exampleQuestion.includes(keyword)
);

console.log("Matchende nøgleord:", matchingKeywords);
console.log("Antal match:", matchingKeywords.length);

// OPGAVE:
// Forudsig arrayet og antallet, inden du kører filen.
// Tilføj nøgleordet "alder". Ændrer det antallet? Hvorfor/hvorfor ikke?
// Tilføj derefter ordet "alder" til spørgsmålet, og kør igen.

console.log("\n--- 2. countMatches() kan genbruges ---");

function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) =>
    normalizedQuestion.includes(keyword)
  );

  return matches.length;
}

const nameScore = countMatches(
  answers[0].keywords,
  "hvad hedder du, og hvad er dit navn?"
);

const unknownScore = countMatches(
  answers[0].keywords,
  "kan du bage en kage?"
);

console.log("Score for kendt spørgsmål:", nameScore);
console.log("Score for ukendt spørgsmål:", unknownScore);

// OPGAVE:
// Hvad er argumenterne i de to funktionskald?
// Hvorfor bliver den ene score 2 og den anden 0?
// Skriv et nyt funktionskald, der bruger bostedsreglens keywords.

console.log("\n--- 3. for...of beregner score for alle regler ---");

function showScores(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const score = countMatches(answerGroup.keywords, normalizedQuestion);
    console.log(answerGroup.category, score);
  }
}

showScores("Hvad hedder du, hvad er dit navn, og hvor bor du?");

// OPGAVE:
// Hvilken regel får den højeste score?
// Hvor mange gange kører for...of-løkken?
// Ret spørgsmålet, så bostedsreglen får den højeste score.
// Ret derefter spørgsmålet, så alle regler får scoren 0.

console.log("\n--- 4. if gemmer den højeste score ---");

function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  let bestScore = 0;
  let bestAnswer = "Det kender jeg ikke svaret på endnu.";
  let bestCategory = "";

  for (const answerGroup of answers) {
    const score = countMatches(answerGroup.keywords, normalizedQuestion);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answerGroup.answer;
      bestCategory = answerGroup.category;
    }
  }

  return {
    answer: bestAnswer,
    category: bestCategory
  };
}

const nameResult = findBestAnswer(
  "Hvad hedder du, hvad er dit navn, og hvor bor du?"
);

const homeResult = findBestAnswer(
  "Hvad er dit navn, og hvilken by bor du i?"
);

const unknownResult = findBestAnswer("Kan du bage en kage?");

console.log("Navn vinder:", nameResult);
console.log("Bosted vinder:", homeResult);
console.log("Intet match:", unknownResult);

// OPGAVE:
// Følg værdierne i bestScore, bestAnswer og bestCategory gennem løkken.
// Hvorfor beholder et ukendt spørgsmål standardsvaret og den tomme kategori?
// Skriv et spørgsmål, hvor to regler får samme score.
// Hvilken regel vinder ved samme score, og hvorfor?

console.log("\n--- 5. Din egen regel ---");

// OPGAVE:
// Tilføj et nyt objekt til answers med category, keywords og answer.
// Kald showScores() med et spørgsmål, der matcher den nye regel.
// Kald findBestAnswer() med det samme spørgsmål.
// Kontrollér både score, svar og kategori i terminalen.
