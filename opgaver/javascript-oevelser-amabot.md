# JavaScript-øvelser til AMAbot

I denne øvelse træner I JavaScript-logikken fra [øvelse 3](express-ejs-amabot.md) og [øvelse 4](express-ejs-amabot-statistik.md) uden Express, routes og EJS.

I opretter selv en tom JavaScript-fil og bygger logikken i små trin:

```text
tekst -> if/else -> objekter og arrays -> for...of -> score -> statistik
```

Del A hjælper jer med svarlogikken i øvelse 3. Del B bygger videre med scoring og statistik fra øvelse 4.

I træner:

- kontrolstrukturer med `if`, `else if` og `else`
- objekter og arrays
- loops med fokus på `for...of`
- pattern matching med `toLowerCase()`, `includes()`, `.some()`, `.filter()` og `.length`
- funktioner, `return` og kontrolflow

---

## 1. Opret en tom øvelsesfil

Åbn terminalen i jeres AMAbot-projekt, og opret en ny, tom fil med navnet:

```text
amabot-javascript-oevelser.js
```

Filen skal ligge i projektets rod ved siden af `server.js`:

```text
jeres-amabot/
├── amabot-javascript-oevelser.js
├── server.js
├── package.json
├── public/
└── views/
```

Kør filen fra terminalen:

```bash
node amabot-javascript-oevelser.js
```

Der kommer endnu ingen tekst i terminalen, fordi filen er tom.

### Sådan arbejder I

For hvert trin skal I:

1. skrive koden i `amabot-javascript-oevelser.js`
2. forudsige resultatet, før I kører filen
3. køre filen med Node.js
4. rette koden, indtil resultatet er som forventet
5. forklare, hvad koden modtager, undersøger og returnerer

Skriv selv koden. Kodeudsnittene med `console.log()` er tests, som I må bruge til at kontrollere jeres løsning.

---

## Del A: Grundlæggende svarlogik fra øvelse 3

### 2. Match ét nøgleord

Skriv en funktion med navnet `containsKeyword()`.

Funktionen skal:

1. modtage `question` og `keyword` som parametre
2. gøre spørgsmålet til små bogstaver med `toLowerCase()`
3. undersøge spørgsmålet med `includes()`
4. returnere `true` eller `false`

Test funktionen:

```js
console.log(containsKeyword("Hvad HEDDER du?", "hedder")); // true
console.log(containsKeyword("Hvad HEDDER du?", "bor")); // false
```

Her betyder **pattern matching**, at I undersøger, om et bestemt tekstmønster findes i spørgsmålet. I dette trin er mønsteret ét nøgleord.

#### Forklar

- Hvad er funktionens parametre?
- Hvad er argumenterne i det første kald?
- Hvilken datatype returnerer `includes()`?

---

### 3. Vælg et svar med `if`, `else if` og `else`

Skriv en funktion med navnet `findSimpleAnswer(question)`.

Funktionen skal:

1. bruge `containsKeyword()` til at undersøge spørgsmålet
2. returnere et svar om navn med `if`, hvis spørgsmålet indeholder `"navn"`
3. returnere et svar om bosted med `else if`, hvis spørgsmålet indeholder `"bor"`
4. returnere standardsvaret med `else`, hvis ingen af delene matcher

Skriv personlige svar i de to første kodeveje. Brug denne tekst som standardsvar:

```text
Det kender jeg ikke svaret på endnu.
```

Test alle tre kodeveje:

```js
console.log(findSimpleAnswer("Hvad er dit navn?"));
console.log(findSimpleAnswer("Hvor bor du?"));
console.log(findSimpleAnswer("Kan du bage?"));
```

#### Forklar

- Hvilken betingelse undersøges først?
- Hvornår bliver `else if` undersøgt?
- Hvornår kører `else`?
- Hvorfor kører resten af funktionen ikke, når en kodevej rammer `return`?

---

### 4. Saml reglerne i objekter og et array

Den forrige funktion har nøgleord og svar direkte i sin kontrolstruktur. Nu skal dataene flyttes ud i objekter, så flere regler får samme struktur.

Opret først et objekt med navnet `nameAnswer`:

```js
const nameAnswer = {
  keywords: ["navn", "hedder", "hvem er du"],
  answer: "Jeg hedder Ada."
};
```

Opret selv to objekter mere:

- `locationAnswer` med nøgleord og et svar om bosted
- `hobbyAnswer` med nøgleord og et svar om fritid

Saml derefter de tre objekter i et array med navnet `answers`.

Test jeres data:

```js
console.log(nameAnswer.keywords);
console.log(nameAnswer.answer);
console.log(answers);
console.log(answers.length); // 3
```

#### Forklar

- Hvilke properties har hvert objekt?
- Hvilken værdi er selv et array?
- Hvad fortæller `answers.length`?
- Hvorfor er det nyttigt, at alle regler har samme struktur?

---

### 5. Match flere nøgleord med `.some()`

Skriv en funktion med navnet `hasKeyword()`.

Funktionen skal:

1. modtage et spørgsmål og et array af nøgleord
2. bruge `.some()` til at gennemløbe nøgleordene
3. kalde `containsKeyword()` for hvert nøgleord
4. returnere `true`, hvis mindst ét nøgleord matcher

Test funktionen:

```js
console.log(hasKeyword("Hvad hedder du?", nameAnswer.keywords)); // true
console.log(hasKeyword("Kan du bage?", nameAnswer.keywords)); // false
```

#### Forklar

- Hvad indeholder callback-parameteren på én tur gennem arrayet?
- Hvorfor kan `.some()` stoppe, så snart et nøgleord matcher?

---

### 6. Find det første matchende svar med `for...of`

Skriv funktionen `findAnswer(question)`.

Funktionen skal:

1. gennemløbe `answers` med `for...of`
2. bruge `hasKeyword()` til at undersøge hver regel
3. returnere reglens `answer`, når den første regel matcher
4. returnere `"Det kender jeg ikke svaret på endnu."` efter løkken, hvis ingen regler matcher

Test med spørgsmål, der rammer forskellige kodeveje:

```js
console.log(findAnswer("Hvad hedder du?"));
console.log(findAnswer("Hvor bor du?"));
console.log(findAnswer("Kan du bage en kage?"));
```

Skriv også ét spørgsmål, som matcher nøgleord fra to forskellige regler. Flyt derefter den ene regel øverst i `answers`, og kør testen igen.

#### Forklar

- Hvad indeholder `answerGroup` på én tur gennem løkken?
- Hvorfor stopper funktionen ved det første match?
- Hvorfor står standardsvaret efter løkken?

#### Stop efter del A

Nu har I trænet svarlogikken fra øvelse 3. Vend tilbage til afsnit 10–12 i [øvelse 3](express-ejs-amabot.md), og brug samme tankegang i jeres `server.js`.

Fortsæt med del B, når `findAnswer()` virker, og I begynder på øvelse 4.

---

## Del B: Scoring og statistik fra øvelse 4

### 7. Tæl matchende nøgleord med `.filter()` og `.length`

Skriv funktionen `countMatches(keywords, normalizedQuestion)`.

Funktionen skal:

1. bruge `.filter()` til at finde de nøgleord, der findes i spørgsmålet
2. bruge `.length` til at tælle de matchende nøgleord
3. returnere antallet

Test funktionen:

```js
console.log(
  countMatches(
    ["navn", "hedder", "hvem er du"],
    "hvad hedder du, og hvad er dit navn?"
  )
); // 2

console.log(
  countMatches(["navn", "hedder", "hvem er du"], "kan du bage?")
); // 0
```

#### Forklar

- Hvad indeholder det nye array fra `.filter()`?
- Hvad er forskellen på resultatet fra `.some()` og `.filter().length`?

---

### 8. Find svaret med den højeste score

Skriv funktionen `findBestAnswer(question)`.

Begynd med disse værdier inde i funktionen:

```js
const normalizedQuestion = question.toLowerCase();
let bestScore = 0;
let bestAnswer = "Det kender jeg ikke svaret på endnu.";
```

Skriv derefter selv en `for...of`-løkke, som:

1. gennemløber alle regler i `answers`
2. beregner hver regels score med `countMatches()`
3. opdaterer `bestScore` og `bestAnswer`, når en score er højere
4. returnerer `bestAnswer` efter løkken

Test funktionen:

```js
console.log(
  findBestAnswer("Hvad hedder du, hvad er dit navn, og hvor bor du?")
);
console.log(findBestAnswer("Kan du bage en kage?"));
```

Det første spørgsmål skal vælge navnereglen, fordi den matcher flere nøgleord. Det andet skal give standardsvaret.

#### Forklar

- Hvordan ændrer `bestScore` sig gennem løkken?
- Hvorfor skal alle regler undersøges?
- Hvorfor returnerer funktionen først efter løkken?

---

### 9. Returnér svar og kategori

Tilføj en unik `category` til hvert objekt i `answers`:

```js
{
  category: "navn",
  keywords: ["navn", "hedder", "hvem er du"],
  answer: "Jeg hedder Ada."
}
```

Udvid derefter `findBestAnswer()`, så den også husker kategorien fra den bedste regel.

- Opret `let bestCategory = "";` sammen med `bestScore` og `bestAnswer`.
- Opdatér `bestCategory`, når en regel får en højere score.
- Lad den tomme tekst blive stående, hvis ingen regel matcher.

Funktionen skal nu returnere et objekt:

```js
{
  answer: bestAnswer,
  category: bestCategory
}
```

Et ukendt spørgsmål skal returnere standardsvaret og en tom kategori.

Test funktionen:

```js
console.log(findBestAnswer("Hvad hedder du?"));
// { answer: "...", category: "navn" }

console.log(findBestAnswer("Kan du bage?"));
// { answer: "Det kender jeg ikke svaret på endnu.", category: "" }
```

#### Forklar

- Hvorfor er returværdien nu et objekt i stedet for en tekst?
- Hvordan læser I henholdsvis svaret og kategorien fra resultatet?

---

### 10. Tæl spørgsmål efter kategori

Opret et objekt med navnet `topicStats`. Tilpas properties til jeres egne kategorier:

```js
const topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};
```

Skriv funktionen `countTopic(stats, category)`.

Funktionen skal:

1. undersøge med `if`, om `category` har en værdi
2. bruge bracket notation til at vælge den rigtige property
3. forhøje den valgte tæller med `1`

Test funktionen:

```js
countTopic(topicStats, "navn");
countTopic(topicStats, "fritid");
countTopic(topicStats, "fritid");
countTopic(topicStats, "");

console.log(topicStats);
// { navn: 1, bosted: 0, fritid: 2 }
```

#### Forklar

- Hvorfor bruges `stats[category]` og ikke `stats.category`?
- Hvorfor skal en tom kategori ikke ændre statistikken?

---

### 11. Forbind svaret med statistikken

Brug funktionerne sammen:

1. Kald `findBestAnswer()` med et spørgsmål.
2. Gem returværdien i en variabel med navnet `result`.
3. Send `result.category` til `countTopic()`.
4. Log både `result` og `topicStats`.

Test med:

- to spørgsmål om samme kategori
- ét spørgsmål om en anden kategori
- ét ukendt spørgsmål

Forudsig statistikken, før I kører filen.

#### Forklar

- Hvilken funktion vælger svaret?
- Hvilken funktion ændrer statistikken?
- Hvordan bevæger kategorien sig fra `findBestAnswer()` til `topicStats`?

---

## Tjekpunkt

I er klar til at vende tilbage til AMAbotten, når I kan:

- bruge `if`, `else if` og `else` til at vælge mellem kodeveje
- forklare forskellen på et objekt og et array
- normalisere og matche tekst med `toLowerCase()` og `includes()`
- forklare forskellen på `.some()` og `.filter().length`
- forklare forskellen på første match og bedste match
- gennemløbe et array af objekter med `for...of`
- forklare, hvordan `return` påvirker en funktions kontrolflow
- returnere både svar og kategori i et objekt
- vælge og opdatere en property med bracket notation

Brug idéerne i jeres egen `server.js`, men kopiér ikke hele øvelsesfilen. Express-routes og EJS hører fortsat til i øvelse 3 og 4.
