// Små øvelser til at forstå findAnswer()
// Kør filen med: node find-answer-oevelser.js
//
// Arbejd med én del ad gangen:
// 1. Forudsig, hvad den viser.
// 2. Kør filen.
// 3. Forklar resultatet med egne ord.
// 4. Lav den lille ændring, der står i kommentaren, og kør igen.

console.log("\n--- 1. Funktion, parameter, argument og return ---");

function makeGreeting(name) {
  return `Hej ${name}`;
}

const greeting = makeGreeting("Ada");
console.log(greeting);

// ØVELSE:
// Hvad er funktionens parameter?
// Hvad er argumentet i funktionskaldet?
// Hvad sender return tilbage?
// Skift "Ada" til dit eget navn.

console.log("\n--- 2. toLowerCase() ---");

const exampleQuestion = "Hvad HEDDER du?";
const normalizedExample = exampleQuestion.toLowerCase();

console.log("Før:", exampleQuestion);
console.log("Efter:", normalizedExample);

// ØVELSE:
// Forudsig de to tekster, inden du kører filen.
// Bliver exampleQuestion ændret?
// Prøv bagefter med teksten "HVOR BOR DU?".

console.log("\n--- 3. includes() og boolean ---");

console.log('Indeholder "hedder":', normalizedExample.includes("hedder"));
console.log('Indeholder "bor":', normalizedExample.includes("bor"));

// ØVELSE:
// Hvilken linje giver true, og hvilken giver false?
// Prøv selv med "du" og "navn".

console.log("\n--- 4. Array, callback og some() ---");

const exampleKeywords = ["navn", "hedder", "hvem er du"];

const hasExampleMatch = exampleKeywords.some((keyword) =>
  normalizedExample.includes(keyword)
);

console.log("Nøgleord:", exampleKeywords);
console.log("Matcher mindst ét:", hasExampleMatch);

// ØVELSE:
// Hvad er keyword første gang callback-funktionen kører?
// Hvilket nøgleord giver et match?
// Skift alle nøgleordene, så resultatet bliver false.

console.log("\n--- 5. Array, objekter og for...of ---");

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

for (const answerGroup of answers) {
  console.log("Objekt:", answerGroup);
  console.log("Keywords:", answerGroup.keywords);
  console.log("Svar:", answerGroup.answer);
}

// ØVELSE:
// Hvor mange gange kører løkken?
// Hvad indeholder answerGroup på én tur gennem løkken?
// Hvilken datatype er answerGroup.keywords?
// Tilføj et nyt objekt til answers, og kør filen igen.

console.log("\n--- 6. if/else ---");

if (hasExampleMatch) {
  console.log("Mindst ét nøgleord matcher");
} else {
  console.log("Ingen nøgleord matcher");
}

// ØVELSE:
// Hvilken boolean undersøger if?
// Hvornår kører if-blokken, og hvornår kører else-blokken?
// Ret exampleQuestion eller exampleKeywords, så den anden blok kører.

console.log("\n--- 7. Delene samlet i findAnswer() ---");

function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) =>
      normalizedQuestion.includes(keyword)
    );

    console.log("Undersøger:", answerGroup.keywords);
    console.log("Matcher:", hasMatch);

    if (hasMatch) {
      return answerGroup.answer;
    }
  }

  return "Det kender jeg ikke svaret på endnu.";
}

const knownAnswer = findAnswer("Hvad hedder du?");
console.log("Kendt spørgsmål:", knownAnswer);

const unknownAnswer = findAnswer("Kan du bage en kage?");
console.log("Ukendt spørgsmål:", unknownAnswer);

// ØVELSE:
// Hvorfor stopper det kendte spørgsmål ved den første matchende regel?
// Hvorfor undersøger det ukendte spørgsmål alle regler?
// Skriv et spørgsmål, der matcher bostedsreglen.
// Flyt bostedsreglen øverst i answers. Hvad ændrer det?
