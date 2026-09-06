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

Find `findAnswer()` i din egen `server.js`:

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

Læs funktionen fra toppen og ned:

1. `toLowerCase()` laver spørgsmålet om til små bogstaver.
2. `for...of` tager ét objekt ad gangen fra `answers`.
3. `.some()` undersøger, om mindst ét nøgleord passer.
4. `.includes()` undersøger, om det enkelte nøgleord findes i spørgsmålet.
5. `return` sender svaret tilbage og stopper funktionen.

Det betyder, at den første regel med et match vinder. De næste regler bliver ikke undersøgt.

### Se værdierne i terminalen

Sæt midlertidigt disse logs ind i `for...of`-løkken lige efter `hasMatch`:

```js
console.log("Regel:", answerGroup.keywords);
console.log("Matcher:", hasMatch);
```

Stil et spørgsmål, der matcher en af reglerne. Se i terminalen, hvilke regler funktionen når at undersøge. Fjern derefter de to logs igen.

### Stop og forklar

Forklar med egne ord:

- Hvad er `answerGroup` i løkken?
- Hvad er `keyword` inde i `.some()`?
- Hvilken datatype får `hasMatch`?
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

### Test trin 4

Sæt midlertidigt denne test under funktionen:

```js
const testKeywords = ["navn", "hedder", "hvem er du"];
const testQuestion = "hvad hedder du, og hvad er dit navn?";

console.log(countMatches(testKeywords, testQuestion));
```

Terminalen skal vise `2`, fordi `"hedder"` og `"navn"` findes i spørgsmålet. Fjern testkoden igen.

> Funktionen tæller matchende nøgleord — ikke hvor mange gange det samme nøgleord står i spørgsmålet.

---

## 5. Undersøg scoren for alle regler

Før AMAbotten skal vælge noget, skal I se scoren for hver regel. Tilføj midlertidigt denne funktion:

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

Fjern `showScores()` og testen igen, når I har set resultatet.

---

## 6. Vælg svaret med den højeste score

Erstat nu `findAnswer()` med `findBestAnswer()`:

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

### Test funktionen alene

```js
console.log(findBestAnswer("Hvad hedder du, og hvad er dit navn?"));
console.log(findBestAnswer("Kan du bage en kage?"));
```

Den første test skal give et objekt med navnesvaret og kategorien `"navn"`. Den anden skal give standardsvaret og en tom kategori. Fjern de to logs igen.

### Brug funktionen i POST-routen

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
