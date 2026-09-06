# Øvelse 4: Gør AMAbotten klogere med scoring og statistik

I denne øvelse bygger I videre på **det samme projekt** fra [øvelse 3](express-ejs-amabot.md). Øvelsen genbesøger den svarlogik, I allerede har arbejdet med, og udvider den i små trin.

I skal ikke bygge en ny app eller lære en helt ny måde at programmere på. I skal bruge de samme arrays, objekter, løkker, funktioner og `if`-sætninger igen — men forstå dem bedre og bruge dem til lidt mere.

Skriv og test ét trin ad gangen. Hvis I ikke er færdige med den grundlæggende AMAbot fra øvelse 3, skal I færdiggøre den først.

## Det træner du

Når du arbejder med øvelsen, træner du at:

- læse og forklare en funktion, du allerede har skrevet
- finde værdier i arrays og objekter
- gennemløbe et array med `for...of`
- bruge `toLowerCase()`, `includes()` og `.some()` igen
- sammenligne `.some()` med `.filter()`
- bruge `if` til at sammenligne scores
- bruge et objekt som en simpel tæller
- sende data fra Express til EJS

## Det bygger du

Den nuværende `findAnswer()` stopper ved den **første** regel, der matcher. I udvider den, så AMAbotten undersøger alle regler og vælger den regel, der matcher flest nøgleord.

Til sidst viser appen en enkel statistik over tre emner:

```text
Browser -> POST /ask -> findBestAnswer() -> messages -> EJS -> HTML
                              |
                              -> topicStats
```

## Sådan er øvelsen opdelt

I bruger tre små JavaScript-filer til at undersøge logikken uden Express og EJS:

| Fase | Træningsfil | Det træner I |
| --- | --- | --- |
| 1. Forstå den kendte funktion | [`find-answer-oevelser.js`](find-answer-oevelser.js) | Funktioner, tekst, arrays, objekter, `for...of`, `.some()` og `if`/`else` |
| 2. Find det bedste svar | [`scoring-oevelser.js`](scoring-oevelser.js) | `.filter()`, `.length`, score og sammenligning med `if` |
| 3. Tæl emner | [`statistik-oevelser.js`](statistik-oevelser.js) | Properties, bracket notation og objekter som tællere |

Hent én fil ad gangen, og gem den i samme mappe som jeres `server.js`. Træningsfilerne skal **ikke** importeres i AMAbotten. De er små, selvstændige programmer, som I kører direkte med Node.js.

Når en træningsfil virker, fortæller opgaven præcist, hvilken kode I skal bruge i den rigtige AMAbot.

---

## 1. Kontrollér AMAbotten fra øvelse 3

Start serveren:

```bash
npm run dev
```

Prøv derefter tre slags input:

| Input | Forventet resultat |
| --- | --- |
| Et spørgsmål, der matcher et nøgleord | Et svar fra `answers` |
| Et spørgsmål uden et kendt nøgleord | Standardsvaret |
| Et tomt spørgsmål | En fejlbesked |

Hvis de tre tests ikke virker, så find først fejlen i øvelse 3. Øvelse 4 ændrer svarlogikken og er derfor nemmere at arbejde med, når udgangspunktet virker.

---

## 2. Genbesøg `findAnswer()`

Før I ændrer svarlogikken, skal I genbesøge de dele, den allerede består af. Det gør I i en særskilt øvelsesfil, så testkoden ikke bliver blandet sammen med Express-serveren.

Hent [find-answer-oevelser.js](find-answer-oevelser.js), og gem den i samme mappe som jeres `server.js`. Åbn en ny terminal, og kør filen med:

```bash
node find-answer-oevelser.js
```

Express-serveren behøver ikke køre, mens I arbejder med filen. Lav de små øvelser én ad gangen:

1. Læs kun den aktuelle del af filen.
2. Forudsig, hvad terminalen vil vise.
3. Kør hele filen med `node find-answer-oevelser.js`.
4. Find den aktuelle dels overskrift i terminalen.
5. Forklar resultatet, og lav ændringen i kommentaren.
6. Kør filen igen, og undersøg forskellen.

Kodeudsnittene nedenfor er de samme som i øvelsesfilen. Lav ændringerne i `find-answer-oevelser.js` — ikke i `server.js`.

### 2a. Funktion, parameter og `return`

En funktion samler kode, som kan kaldes flere gange. `name` i funktionsdefinitionen er en **parameter**. `"Ada"` i funktionskaldet er et **argument** — den konkrete værdi, parameteren modtager:

```js
function makeGreeting(name) {
  return `Hej ${name}`;
}

const greeting = makeGreeting("Ada");
console.log(greeting);
```

Inden I kører koden:

1. Hvilken værdi får parameteren `name`?
2. Hvilken værdi sender `return` tilbage?
3. Hvad forventer I, at terminalen viser?

Skift `"Ada"` til jeres eget navn, og kør koden igen.

> `findAnswer(question)` er også en funktion. `question` er parameteren, og `return` sender det valgte svar tilbage til POST-routen.

### 2b. `toLowerCase()`

JavaScript skelner mellem store og små bogstaver. Undersøg derfor denne tekst:

```js
const exampleQuestion = "Hvad HEDDER du?";
const normalizedExample = exampleQuestion.toLowerCase();

console.log(exampleQuestion);
console.log(normalizedExample);
```

Inden I kører koden:

1. Hvad forventer I, at de to logs viser?
2. Bliver værdien i `exampleQuestion` ændret?

`toLowerCase()` laver en **ny tekst** med små bogstaver. Den oprindelige tekst bliver ikke ændret.

### 2c. `.includes()` og boolean

`.includes()` undersøger, om én tekst findes inde i en anden. Resultatet er en **boolean**: enten `true` eller `false`.

```js
console.log(normalizedExample.includes("hedder"));
console.log(normalizedExample.includes("bor"));
```

Inden I kører koden, skal I skrive det forventede resultat ud for hver linje. Prøv derefter selv med nøgleordene `"du"` og `"navn"`.

Forklar bagefter:

- Hvilken værdi er teksten, vi leder i?
- Hvilken værdi er teksten, vi leder efter?
- Hvorfor får de to oprindelige eksempler forskellige resultater?

### 2d. Array og `.some()`

Et array kan indeholde flere nøgleord. `.some()` undersøger, om **mindst ét** element opfylder en betingelse:

```js
const exampleKeywords = ["navn", "hedder", "hvem er du"];

const hasExampleMatch = exampleKeywords.some((keyword) =>
  normalizedExample.includes(keyword)
);

console.log(hasExampleMatch);
```

Inden I kører koden:

1. Hvilke tre værdier gennemgår `.some()`?
2. Hvad er `keyword` første gang testen kører?
3. Hvilket nøgleord får testen til at blive `true`?
4. Hvilken datatype får `hasExampleMatch`?

Skift spørgsmålet til `"Hvor bor du?"`. Hvad viser terminalen nu, og hvorfor?

> Funktionen `(keyword) => ...` kaldes en callback-funktion. `.some()` kalder den med ét element fra arrayet ad gangen, indtil den finder et `true`-resultat.

### 2e. `for...of`, array og objekt

`answers` er et array. Hvert element i arrayet er et objekt. Brug `for...of` til at se ét objekt ad gangen:

```js
for (const answerGroup of answers) {
  console.log(answerGroup);
  console.log(answerGroup.keywords);
  console.log(answerGroup.answer);
}
```

Undersøg outputtet i terminalen, og forklar:

1. Hvor mange gange kører løkken?
2. Hvad indeholder `answerGroup` på én tur gennem løkken?
3. Hvorfor kan vi skrive `answerGroup.keywords`?
4. Hvilken datatype er `answerGroup.keywords`?

Tilføj midlertidigt endnu en regel til `answers`. Kør koden igen, og kontrollér, at løkken nu tager en ekstra tur. Fjern den midlertidige regel bagefter.

### 2f. `if`/`else`

En `if`/`else` vælger mellem to kodeveje ud fra en betingelse:

```js
if (hasExampleMatch) {
  console.log("Mindst ét nøgleord matcher");
} else {
  console.log("Ingen nøgleord matcher");
}
```

Kør først koden med spørgsmålet `"Hvad hedder du?"` og derefter med `"Hvor bor du?"`.

Forklar bagefter:

- Hvilken værdi undersøger `if`?
- Hvornår kører blokken efter `if`?
- Hvornår kører blokken efter `else`?

> I den færdige `findAnswer()` er `else` ikke skrevet direkte. Hvis et match ikke findes, fortsætter `for...of` automatisk til næste regel. Standardsvaret efter løkken fungerer som den sidste mulighed.

### 2g. Saml delene i `findAnswer()`

Find nu `findAnswer()` i din egen `server.js`:

```js
function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) =>
      normalizedQuestion.includes(keyword)
    );

    if (hasMatch) {
      return answerGroup.answer;
    }
  }

  return "Det kender jeg ikke svaret på endnu.";
}
```

Peg på disse dele i funktionen:

1. Funktionen og dens parameter
2. Normaliseringen med `toLowerCase()`
3. `for...of`-løkken gennem arrayet
4. Objektets `keywords`-property
5. `.some()` og dens callback-funktion
6. Testen med `.includes()`
7. Boolean-variablen `hasMatch`
8. `if`-sætningen
9. De to mulige `return`-steder

Det betyder, at den første regel med et match vinder. De næste regler bliver ikke undersøgt.

### Følg funktionen i terminalen

I øvelsesfilens `findAnswer()` står disse to logs allerede i `for...of`-løkken:

```js
console.log("Regel:", answerGroup.keywords);
console.log("Matcher:", hasMatch);
```

Kør først filen som den er, og se, hvilke regler det kendte og det ukendte spørgsmål undersøger. Skriv derefter et spørgsmål, der matcher bostedsreglen, og kør filen igen.

Sammenlign til sidst øvelsesfilens `findAnswer()` med funktionen i jeres egen `server.js`. De to logs er kun hjælp til undersøgelsen og behøver ikke flyttes med ind i AMAbotten.

### Stop og forklar helheden

Forklar med egne ord:

- Hvordan bevæger et spørgsmål sig gennem funktionen?
- Hvilke dele arbejder med arrays?
- Hvilke dele arbejder med tekst?
- Hvilke dele styrer, hvilken kode der bliver kørt?
- Hvorfor bliver reglerne efter det første match ikke undersøgt?

---

## 3. Udvid objekterne med en kategori

Hver regel i `answers` er et objekt med `keywords` og `answer`. Tilføj nu en `category`:

```js
const answers = [
  {
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Ada. Hvad vil du ellers vide om mig?"
  },
  {
    category: "bosted",
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor i Aarhus."
  },
  {
    category: "fritid",
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "I min fritid kan jeg godt lide at læse og gå ture."
  }
];
```

Tilpas reglerne til jeres egen AMAbot. Behold den samme struktur i alle objekter:

```js
{
  category: "...",
  keywords: ["...", "..."],
  answer: "..."
}
```

### Test trin 3

Sæt midlertidigt denne log efter `answers`:

```js
console.log(answers[0].category);
```

Terminalen skal vise kategorien fra det første objekt. Skift derefter `0` til `1`, og se kategorien fra det næste objekt. Fjern loggen igen.

> `answers[0]` finder det første element i arrayet. `.category` finder en egenskab på objektet. På den måde træner I både array og objekt i det samme udtryk.

---

## 4. Sammenlign `.some()` og `.filter()`

> **Arbejdssted:** [`scoring-oevelser.js`](scoring-oevelser.js) — ikke `server.js` endnu.

Hent filen, gem den ved siden af `server.js`, og kør den med:

```bash
node scoring-oevelser.js
```

Begynd med del 1 og 2 i filen. Forudsig outputtet, kør filen, og løs opgaverne i kommentarerne.

I `findAnswer()` bruger I `.some()`:

```js
const hasMatch = answerGroup.keywords.some((keyword) =>
  normalizedQuestion.includes(keyword)
);
```

`.some()` giver enten `true` eller `false`. Det er nok, når vi kun vil vide, **om** reglen matcher.

Nu vil vi vide, **hvor mange** nøgleord der matcher. Her kan vi bruge `.filter()`:

```js
function countMatches(keywords, normalizedQuestion) {
  const matchingKeywords = keywords.filter((keyword) =>
    normalizedQuestion.includes(keyword)
  );

  return matchingKeywords.length;
}
```

`.filter()` laver et nyt array med de nøgleord, der passer. `.length` fortæller, hvor mange elementer det nye array indeholder.

### Kontrollér del 1 og 2

I træningsfilen bliver funktionen blandt andet testet med:

```js
const testKeywords = ["navn", "hedder", "hvem er du"];
const testQuestion = "hvad hedder du, og hvad er dit navn?";

console.log(countMatches(testKeywords, testQuestion));
```

Terminalen skal vise `2`, fordi `"hedder"` og `"navn"` findes i spørgsmålet. Gennemfør også ændringerne, der står som `OPGAVE` i filen.

> Funktionen tæller matchende nøgleord — ikke hvor mange gange det samme nøgleord står i spørgsmålet.

---

## 5. Undersøg scoren for alle regler

> **Arbejdssted:** Fortsæt i `scoring-oevelser.js`.

Før AMAbotten skal vælge noget, skal I se scoren for hver regel. Find del 3 i træningsfilen:

```js
function showScores(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const score = countMatches(answerGroup.keywords, normalizedQuestion);
    console.log(answerGroup.category, score);
  }
}
```

Test funktionen:

```js
showScores("Hvad hedder du, hvad er dit navn, og hvor bor du?");
```

Med eksempelreglerne skal terminalen vise:

```text
navn 2
bosted 1
fritid 0
```

Her træner I det samme `for...of` som i `findAnswer()`. Forskellen er, at løkken ikke stopper ved det første match. Den beregner en score for alle regler.

Løs opgaverne under del 3. Ret blandt andet spørgsmålet, så henholdsvis bostedsreglen og ingen af reglerne får den højeste score.

---

## 6. Vælg svaret med den højeste score

> **Arbejdssted:** Begynd i `scoring-oevelser.js`. Flyt først derefter den færdige logik til `server.js`.

Arbejd med del 4 og 5 i træningsfilen. Når I kan forklare `bestScore`, `bestAnswer` og `bestCategory`, skal I bruge funktionerne i AMAbotten.

Kopiér først `countMatches()` fra træningsfilen til `server.js`. Erstat derefter `findAnswer()` med `findBestAnswer()`:

```js
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

  return { answer: bestAnswer, category: bestCategory };
}
```

Funktionen bruger tre enkle værdier til at huske det bedste resultat indtil videre:

- `bestScore` er det højeste antal match.
- `bestAnswer` er svaret fra reglen med den højeste score.
- `bestCategory` er kategorien fra den samme regel.

`if (score > bestScore)` betyder, at værdierne kun bliver ændret, når funktionen finder en bedre regel. Hvis ingen regel matcher, bliver standardsvaret og den tomme kategori returneret.

### Test først funktionen i træningsfilen

```js
console.log(findBestAnswer("Hvad hedder du, og hvad er dit navn?"));
console.log(findBestAnswer("Kan du bage en kage?"));
```

Den første test skal give et objekt med navnesvaret og kategorien `"navn"`. Den anden skal give standardsvaret og en tom kategori.

### Brug funktionen i POST-routen

> **Skift arbejdssted:** Gå nu til AMAbottens `server.js`.

Find denne del af `POST /ask` fra øvelse 3:

```js
const answer = findAnswer(question);
messages.push({ type: "answer", text: answer });
```

Erstat den med:

```js
const result = findBestAnswer(question);
messages.push({ type: "answer", text: result.answer });
```

### Test trin 6

Stil disse to spørgsmål:

1. `"Hvad hedder du, hvad er dit navn, og hvor bor du?"`
2. `"Hvad er dit navn, og hvilken by bor du i?"`

I det første spørgsmål får navnereglen den højeste score. I det andet får bostedsreglen den højeste score.

> Hvis to regler har samme score, vinder den regel, der står først i `answers`. Det er fint i denne version.

---

## 7. Brug et objekt som tæller

> **Arbejdssted:** Begynd i [`statistik-oevelser.js`](statistik-oevelser.js) — ikke i `server.js`.

Hent filen, gem den ved siden af `server.js`, og kør den med:

```bash
node statistik-oevelser.js
```

Gennemfør del 1–5 i filen. Her træner I punktnotation, bracket notation, opdatering af en tæller og forbindelsen mellem resultatet fra `findBestAnswer()` og statistikken.

Når I kan forklare, hvorfor `topicStats[result.category]` finder den rigtige tæller, skal I gå tilbage til AMAbotten.

> **Skift arbejdssted:** Gå nu til AMAbottens `server.js`.

Nu vil vi tælle, hvor mange spørgsmål der matcher hver kategori. Opret et objekt over jeres routes:

```js
const topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};
```

Egenskaberne skal passe til jeres egne `category`-værdier. Alle tællere starter på `0`.

I POST-routen har I allerede variablen `result`. Tilføj dette lige efter svaret er gemt:

```js
if (result.category) {
  topicStats[result.category] = topicStats[result.category] + 1;
}
```

`result.category` indeholder fx teksten `"navn"`. Derfor svarer:

```js
topicStats[result.category]
```

til:

```js
topicStats["navn"]
```

Vi bruger firkantede parenteser, fordi navnet på egenskaben ligger i en variabel. `if`-sætningen sørger for, at ukendte spørgsmål med en tom kategori ikke bliver talt.

### Test trin 7

Tilføj midlertidigt denne log efter `if`-sætningen:

```js
console.log(topicStats);
```

Stil to spørgsmål om navn og ét om bosted. Objektet i terminalen skal ende med at ligne:

```js
{ navn: 2, bosted: 1, fritid: 0 }
```

Fjern loggen igen.

---

## 8. Vis statistikken i EJS

> **Arbejdssted:** AMAbottens `server.js` og `views/index.ejs`.

Send `topicStats` med til `views/index.ejs`. GET-routen skal rendere med:

```js
response.render("index", { messages, error: "", topicStats });
```

POST-routen skal rendere med:

```js
response.render("index", { messages, error, topicStats });
```

Tilføj derefter statistikken i `views/index.ejs`:

```ejs
<h2>Spørgsmål fordelt på emner</h2>
<ul>
  <li>Navn: <%= topicStats.navn %></li>
  <li>Bosted: <%= topicStats.bosted %></li>
  <li>Fritid: <%= topicStats.fritid %></li>
</ul>
```

Tilpas egenskabsnavnene, hvis jeres kategorier hedder noget andet. Her bruger EJS den samme punktnotation, som I tidligere brugte med fx `message.text`.

### Test trin 8

Stil spørgsmål om forskellige emner, og kontrollér, at tallene ændrer sig. Genindlæs siden: Tallene skal stadig stå der. Genstart serveren: Tallene starter igen på `0`, fordi objektet kun ligger i serverens hukommelse.

---

## Tjekpunkt

AMAbotten er færdig med kerneøvelsen, når den:

- stadig kan svare og validere som i øvelse 3
- undersøger alle regler med `for...of`
- tæller matchende nøgleord med `.filter()` og `.length`
- vælger reglen med den højeste score
- tæller tre emner i et objekt
- viser tællerne i EJS

Du skal kunne forklare forskellen på disse to spørgsmål:

- `.some()`: Matcher mindst ét nøgleord?
- `.filter().length`: Hvor mange nøgleord matcher?

---

## Ekstraopgaver

Lav kun ekstraopgaverne, hvis kerneøvelsen virker, og du kan forklare koden.

### 9. Vælg en reaktion med `switch`

Begynd med del 7 i `statistik-oevelser.js`. Når funktionen virker dér, kan I flytte den til `server.js`.

Lav en funktion, der vælger en emoji ud fra kategorien:

```js
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
```

Prøv først funktionen alene med `console.log()`:

```js
console.log(reactionFor("navn"));
console.log(reactionFor("ukendt"));
```

Tilføj derefter reaktionen foran svaret i POST-routen:

```js
const reaction = reactionFor(result.category);
messages.push({ type: "answer", text: `${reaction} ${result.answer}` });
```

Husk at erstatte den tidligere `messages.push()` for svaret — ellers viser AMAbotten svaret to gange.

### 10. Gennemløb statistikken med `Object.entries()`

Begynd med del 6 i `statistik-oevelser.js`. Når I kan forklare arrayet, som `Object.entries()` laver, kan I bruge samme idé i EJS.

I kerneøvelsen skrev I selv de tre emner i EJS. Hvis statistikken også skal virke, når I tilføjer nye kategorier, kan I gennemløbe objektet.

Erstat de tre `<li>`-elementer med:

```ejs
<% for (const stat of Object.entries(topicStats)) { %>
  <li><%= stat[0] %>: <%= stat[1] %></li>
<% } %>
```

`Object.entries(topicStats)` laver objektet om til et array. Hvert element i arrayet indeholder to værdier:

- `stat[0]` er navnet på kategorien.
- `stat[1]` er kategoriens tæller.

Tilføj en ny kategori til både `answers` og `topicStats`. Den skal nu automatisk komme med i listen.
