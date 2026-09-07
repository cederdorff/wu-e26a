# Øvelse 4: Gør AMAbotten klogere med scoring og statistik

## Kort fortalt

Jeres nuværende AMAbot vælger den **første** svarregel, der matcher et spørgsmål. I denne øvelse ændrer I svarlogikken, så botten undersøger alle regler og vælger den regel, der matcher flest nøgleord.

I bygger videre på jeres egen AMAbot fra [øvelse 3](express-ejs-amabot.md). I skal ikke oprette et nyt projekt.

## Opgaven

Øvelsen har to sammenhængende dele:

1. **Scoring i afsnit 1–4:** AMAbotten undersøger alle regler og vælger den regel, der matcher flest nøgleord.
2. **Statistik i afsnit 5–6:** AMAbotten registrerer den valgte kategori og viser, hvilke emner der bliver spurgt til.

Til sidst gemmer I den færdige øvelse med Git og pusher den til GitHub.

Arbejd med ét afsnit ad gangen. Brug de sammenklappede løsningsforslag, hvis I går i stå. Ekstraopgaverne nederst er valgfrie.

## Hvor arbejder I?

I arbejder i jeres eksisterende `server.js`. Først ved statistikdelen skal I også arbejde i `views/index.ejs`.

Hvis et bestemt JavaScript-begreb er svært, kan I arbejde med den relevante [JavaScript-øvelse](javascript-oevelser-amabot.md). I behøver ikke gennemføre alle tre øvelsesfiler.

```text
spørgsmål -> findBestAnswer() -> svar og kategori -> POST-route -> EJS
                                           |
                                           -> topicStats
```

---

## 1. Kontrollér udgangspunktet

Start serveren:

```bash
npm run dev
```

Test tre forskellige situationer:

| Input | Forventet resultat |
| --- | --- |
| Et spørgsmål med et kendt nøgleord | Et svar fra `answers` |
| Et spørgsmål uden et kendt nøgleord | Standardsvaret |
| Et tomt spørgsmål | En fejlbesked |

Find derefter `findAnswer()` i `server.js`, og forklar den for en medstuderende. I skal kunne udpege:

- parameter og argument
- `toLowerCase()`
- `for...of`-løkken
- `.some()` og callback-funktionen
- `.includes()`
- `if` og de to mulige `return`-steder

Hvis appen ikke består de tre tests, eller hvis I ikke kan følge spørgsmålet gennem funktionen, skal I arbejde videre med øvelse 3 først.

---

## 2. Tæl hvor mange nøgleord der matcher

En regels **score** er antallet af dens nøgleord, der findes i spørgsmålet. Ét match giver scoren `1`, to match giver scoren `2`, og ingen match giver scoren `0`.

Skriv funktionen `countMatches(keywords, normalizedQuestion)`. Den skal returnere et tal:

- `0`, hvis ingen nøgleord matcher
- `1`, hvis ét nøgleord matcher
- `2`, hvis to nøgleord matcher
- og så videre

Brug `.filter()` til at lave et nyt array med de matchende nøgleord og `.length` til at tælle elementerne i det nye array.

Start med denne funktion i `server.js`, fx lige over `findAnswer()`:

```js
function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) => {
    // TODO: Returnér true, når spørgsmålet indeholder keyword.
  });

  // TODO: Returnér antallet af matches.
}
```

> Funktionen tæller matchende nøgleord. Den tæller ikke, hvor mange gange det samme nøgleord optræder i spørgsmålet.

### Test

Test funktionen midlertidigt med mindst disse situationer:

1. Ingen nøgleord matcher.
2. Ét nøgleord matcher.
3. To nøgleord matcher.

I kan begynde med disse kald under funktionen:

```js
console.log(
  countMatches(["navn", "hedder", "hvem er du"], "hvad hedder du?")
); // 1

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

Fjern de midlertidige tests igen, når funktionen virker.

I skal kunne forklare forskellen på:

- `.some()`: Matcher mindst ét nøgleord?
- `.filter().length`: Hvor mange nøgleord matcher?

<details>
<summary>Se et løsningsforslag til <code>countMatches()</code></summary>

Åbn først løsningsforslaget, når I selv har forsøgt og testet funktionen.

```js
function countMatches(keywords, normalizedQuestion) {
  const matches = keywords.filter((keyword) =>
    normalizedQuestion.includes(keyword)
  );

  return matches.length;
}
```

</details>

---

## 3. Vælg reglen med den højeste score

Skriv en ny funktion med navnet `findBestAnswer(question)`. Den skal:

1. normalisere spørgsmålet
2. begynde med en bedste score på `0` og et standardsvar
3. gennemløbe **alle** regler i `answers`
4. beregne hver regels score med `countMatches()`
5. gemme scoren og svaret, når den finder en højere score
6. returnere det bedste svar som en tekst

Brug dette skelet. Udfyld løkken og `if`-sætningen selv:

```js
function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  let bestScore = 0;
  let bestAnswer = "Det kender jeg ikke svaret på endnu.";

  for (const answerGroup of answers) {
    // 1. Beregn denne regels score.
    // 2. Sammenlign med bestScore.
    // 3. Gem score og svar, hvis reglen er bedre.
  }

  return bestAnswer;
}
```

<details>
<summary>Hint 1: værdier funktionen skal huske</summary>

Brug to variabler: `bestScore` og `bestAnswer`. Når en regel får en højere score, skal begge værdier opdateres sammen.

</details>

<details>
<summary>Hint 2: pseudokode</summary>

```text
for hver regel i answers
    beregn reglens score
    hvis scoren er højere end bestScore
        gem den nye score
        gem reglens svar
returnér det bedste svar
```

</details>

<details>
<summary>Se den samlede funktion</summary>

```js
function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  let bestScore = 0;
  let bestAnswer = "Det kender jeg ikke svaret på endnu.";

  for (const answerGroup of answers) {
    const score = countMatches(answerGroup.keywords, normalizedQuestion);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = answerGroup.answer;
    }
  }

  return bestAnswer;
}
```

Sammenlign linje for linje med jeres egen funktion. Ret kun det, I kan forklare.

</details>

### Test funktionen isoleret

Skriv spørgsmål, der giver disse fire situationer:

1. Reglen med nøgleord om navn får højere score end de andre regler.
2. Reglen med nøgleord om bosted får højere score end de andre regler.
3. Ingen regler matcher.
4. To regler får samme score.

Kald funktionen direkte med `console.log()`, før I ændrer POST-routen:

```js
console.log(
  findBestAnswer("Hvad hedder du, hvad er dit navn, og hvor bor du?")
);

console.log(findBestAnswer("Kan du bage en kage?"));
```

Tilføj selv testene af en anden vinder og samme score.

Ved samme score må den regel, der står først i `answers`, gerne vinde. Forklar, hvordan sammenligningen i jeres `if`-sætning bestemmer det.

### Forklar løsningen

Følg én test gennem funktionen, og forklar værdierne af:

- `normalizedQuestion`
- `answerGroup`
- `score`
- `bestScore`
- `bestAnswer`
- den returnerede tekst

---

## 4. Brug den nye funktion i POST-routen

Find det sted i `POST /ask`, hvor den eksisterende `findAnswer()` bliver kaldt. Erstat kaldet med `findBestAnswer()`.

Den nye funktion returnerer stadig en tekst. Derfor skal resten af beskedens struktur ikke ændres.

Før:

```js
const answer = findAnswer(question);
messages.push({ type: "answer", text: answer });
```

Efter:

```js
const answer = findBestAnswer(question);
messages.push({ type: "answer", text: answer });
```

### Test hele AMAbotten

Gentag de fire tests fra afsnit 3 gennem formularen i browseren. Kontrollér både det viste svar og eventuelle fejl i terminalen.

Forklar derefter for en medstuderende:

1. Hvad sender POST-routen ind i `findBestAnswer()`?
2. Hvad returnerer funktionen?
3. Hvordan bliver den returnerede tekst gemt i `messages`?

Når svarlogikken virker, er I klar til øvelsens statistikdel.

---

## 5. Tilføj kategorier og tæl dem

Scoringen krævede kun nøgleord og svar. Statistikken kræver også et kort navn for hvert emne. Derfor tilføjer I nu en kategori til hver regel.

### 5a. Giv hver regel en kategori

Tilføj en unik `category`-property til hvert objekt i `answers`. Brug korte tekster uden mellemrum, fx `"navn"` og `"bosted"`.

```js
{
  category: "navn",
  keywords: ["navn", "hedder", "hvem er du"],
  answer: "Jeg hedder Ada."
}
```

Kategorien bliver ikke vist som en del af svaret. Serveren bruger den som navn på den tæller, der skal opdateres. Hvis I senere ændrer svarteksten, kan kategorien stadig hedde det samme.

### 5b. Returnér både svar og kategori

Indtil nu har `findBestAnswer()` kun returneret svarteksten. Statistikken skal også kende kategorien fra den regel, der vandt. Derfor skal funktionen nu returnere begge værdier samlet i et objekt.

Udvid først funktionen, så den også husker kategorien fra reglen med den højeste score.

Tilføj først en startværdi sammen med de to andre `best...`-variabler:

```js
let bestCategory = "";
```

Når en ny regel vinder, skal kategorien gemmes i den samme `if`-blok:

```js
bestCategory = answerGroup.category;
```

Funktionen skal nu returnere:

```js
return {
  answer: bestAnswer,
  category: bestCategory
};
```

Fordi returværdien er ændret fra en tekst til et objekt, skal POST-routen ændres fra:

```js
const answer = findBestAnswer(question);
messages.push({ type: "answer", text: answer });
```

til:

```js
const result = findBestAnswer(question);
messages.push({ type: "answer", text: result.answer });
```

Test et kendt og et ukendt spørgsmål:

```js
console.log(findBestAnswer("Hvad hedder du?"));
console.log(findBestAnswer("Kan du bage en kage?"));
```

Det kendte spørgsmål skal give et objekt med både svar og kategori. Det ukendte spørgsmål skal give standardsvaret og en tom kategori. Fjern loggene igen efter testen.

<details>
<summary>Se den opdaterede <code>findBestAnswer()</code></summary>

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

  return {
    answer: bestAnswer,
    category: bestCategory
  };
}
```

</details>

### 5c. Tæl kategorierne

Opret et `topicStats`-objekt over jeres routes. Det skal have én property pr. kategori, og alle tællere skal begynde på `0`.

```js
const topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0
};
```

Tilpas navnene, så de passer præcist til jeres egne `category`-værdier.

Når `findBestAnswer()` har fundet et resultat i POST-routen, skal I:

1. undersøge, om resultatet har en kategori
2. bruge kategorien til at vælge den rigtige property i `topicStats`
3. forhøje denne tæller med `1`

I skal bruge bracket notation, fordi property-navnet ligger i `result.category`.

Tilføj opdateringen i POST-routen, efter resultatet og svarbeskeden er oprettet:

```js
if (result.category) {
  topicStats[result.category] = topicStats[result.category] + 1;
}
```

<details>
<summary>Hint</summary>

Hvis `result.category` indeholder `"navn"`, peger `topicStats[result.category]` på samme værdi som `topicStats["navn"]`.

</details>

### Test tællerne

Log midlertidigt hele `topicStats` efter opdateringen. Stil:

- to spørgsmål om samme kategori
- ét spørgsmål om en anden kategori
- ét ukendt spørgsmål

Forudsig objektets værdier, før I ser i terminalen. Det ukendte spørgsmål skal ikke ændre nogen tæller.

<details>
<summary>Se scoring og statistik samlet i POST-routen</summary>

Brug eksemplet til at kontrollere placeringen af den nye kode. Behold jeres egen validering og jeres egne variabelnavne.

```js
app.post("/ask", (request, response) => {
  const question = request.body.question.trim();
  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else {
    messages.push({ type: "question", text: question });

    const result = findBestAnswer(question);
    messages.push({ type: "answer", text: result.answer });

    if (result.category) {
      topicStats[result.category] = topicStats[result.category] + 1;
    }
  }

  response.render("index", { messages, error, topicStats });
});
```

</details>

---

## 6. Vis statistikken i EJS

Send `topicStats` med til `views/index.ejs` fra både GET- og POST-routen. Vis derefter hver kategori og dens tæller i jeres eksisterende design.

GET-routen skal sende en tom fejltekst sammen med de øvrige data:

```js
response.render("index", { messages, error: "", topicStats });
```

POST-routen skal sende den aktuelle fejltekst:

```js
response.render("index", { messages, error, topicStats });
```

<details>
<summary>Se et eksempel med tre tællere</summary>

```ejs
<h2>Spørgsmål fordelt på emner</h2>
<ul>
  <li>Navn: <%= topicStats.navn %></li>
  <li>Bosted: <%= topicStats.bosted %></li>
  <li>Fritid: <%= topicStats.fritid %></li>
</ul>
```

Tilpas HTML og property-navne til jeres kategorier og eksisterende design.

</details>

### Test statistikken

1. Stil spørgsmål om forskellige kategorier, og kontrollér tallene.
2. Genindlæs siden. Tallene skal blive stående.
3. Genstart serveren. Tallene skal begynde på `0` igen.

Forklar, hvorfor en genindlæsning og en genstart giver forskellige resultater.

---

## Tjekpunkt

Øvelse 4 er gennemført, når AMAbotten:

- stadig kan svare og validere som i øvelse 3
- undersøger alle regler
- tæller matchende nøgleord
- vælger reglen med den højeste score
- returnerer både svar og kategori
- bruger et objekt som tæller
- vælger en property med bracket notation
- viser tællerne med EJS

I skal kunne forklare koden med fagbegreber. At appen virker, er ikke i sig selv nok.

---

## 7. Commit og push til GitHub

Når AMAbotten består testene i tjekpunktet, skal I gemme den færdige øvelse i jeres repository:

```bash
git status
git add .
git commit -m "Add scoring and topic statistics to AMAbot"
git push
```

Kør `git status` igen, og kontrollér på GitHub, at den nye commit er blevet pushet. Hvis `git status` viser filer, som ikke skal med, skal I undersøge dem, før I bruger `git add`.

---

## Ekstraopgaver

Vælg kun en ekstraopgave, når den del, ekstraopgaven bygger på, virker, og I kan forklare jeres kode.

| Ekstraopgave | Fokus |
| --- | --- |
| 7. Reaktion med `switch` | Funktioner og kontrolstruktur |
| 8. Dynamisk visning | `Object.entries()` og løkke i EJS |
| 9. Eget emne | Arrays og objekter |
| 10. Ukendte spørgsmål | `if`/`else` og tællere |
| 11. Mest spurgte emne | Løkke og sammenligning |
| 12. Nulstil statistik | Route, `Object.keys()` og bracket notation |
| 13. Flyt reglerne til et modul | `export`, `import` og filstruktur |

<details>
<summary><strong>7. Vælg en reaktion med <code>switch</code></strong></summary>

Lav en funktion i `server.js`, der vælger en emoji ud fra kategorien:

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

Test først funktionen isoleret:

```js
console.log(reactionFor("navn"));
console.log(reactionFor("ukendt"));
```

Brug derefter reaktionen foran svaret i POST-routen:

```js
const reaction = reactionFor(result.category);
messages.push({ type: "answer", text: `${reaction} ${result.answer}` });
```

Erstat den tidligere `messages.push()` for svaret. Ellers vises svaret to gange.

Tilføj til sidst en ny `case`, og test både den og `default`.

</details>

<details>
<summary><strong>8. Vis kategorierne dynamisk med <code>Object.entries()</code></strong></summary>

Den nuværende EJS-kode nævner hver kategori direkte. Brug i stedet en løkke, så nye kategorier automatisk bliver vist:

```ejs
<h2>Spørgsmål fordelt på emner</h2>
<ul>
  <% for (const stat of Object.entries(topicStats)) { %>
    <li><%= stat[0] %>: <%= stat[1] %></li>
  <% } %>
</ul>
```

`Object.entries(topicStats)` laver et array, hvor hvert element indeholder to værdier:

- `stat[0]` er navnet på kategorien
- `stat[1]` er kategoriens tæller

Tilføj en midlertidig kategori til `topicStats`. Kontrollér, at den vises uden et nyt `<li>` i EJS, og fjern den igen.

</details>

<details>
<summary><strong>9. Tilføj jeres eget emne</strong></summary>

Tilføj en ny regel til `answers`. Den skal have mindst tre nøgleord og et personligt svar:

```js
{
  category: "mad",
  keywords: ["mad", "spise", "livret"],
  answer: "Min livret er ..."
}
```

Tilføj også `mad: 0` til `topicStats`. Hvis I ikke har lavet ekstraopgave 8, skal kategorien desuden have sit eget `<li>` i EJS.

Test med:

1. Et spørgsmål, der matcher ét nyt nøgleord.
2. Et spørgsmål, der matcher to nye nøgleord.
3. Et spørgsmål, hvor den nye regel konkurrerer med en eksisterende regel.

Forklar, hvordan placeringen i `answers` påvirker resultatet ved samme score.

</details>

<details>
<summary><strong>10. Tæl ukendte spørgsmål</strong></summary>

Tilføj en tæller til `topicStats`:

```js
ukendt: 0
```

Udvid derefter opdateringen i POST-routen med en `else`:

```js
if (result.category) {
  topicStats[result.category] = topicStats[result.category] + 1;
} else {
  topicStats.ukendt = topicStats.ukendt + 1;
}
```

Vis også tælleren i EJS, hvis listen ikke allerede bruger `Object.entries()`.

Test med to kendte og to ukendte spørgsmål. De kendte skal tælles under deres egne kategorier, og `ukendt` skal ende på `2`.

</details>

<details>
<summary><strong>11. Find det mest spurgte emne</strong></summary>

Denne funktion bruger samme idé som `findBestAnswer()`: gennemløb flere værdier, sammenlign dem, og husk den højeste.

```js
function findMostAskedTopic(stats) {
  let highestCount = 0;
  let mostAskedTopic = "";

  for (const stat of Object.entries(stats)) {
    const category = stat[0];
    const count = stat[1];

    if (count > highestCount) {
      highestCount = count;
      mostAskedTopic = category;
    }
  }

  return mostAskedTopic;
}
```

Sammenlign med `findBestAnswer()`:

- Hvad svarer `count` til?
- Hvad svarer `highestCount` til?
- Hvorfor begynder `mostAskedTopic` som en tom tekst?

Kald funktionen før `response.render()`, og send resultatet med til EJS:

```js
const mostAskedTopic = findMostAskedTopic(topicStats);
```

```ejs
<% if (mostAskedTopic) { %>
  <p>Mest spurgte emne: <%= mostAskedTopic %></p>
<% } %>
```

Husk at sende `mostAskedTopic` med fra både GET- og POST-routen. Stil spørgsmål, indtil en anden kategori overtager førstepladsen.

</details>

<details>
<summary><strong>12. Lav en knap, der nulstiller statistikken</strong></summary>

Tilføj en ny route i `server.js`:

```js
app.post("/clear-stats", (request, response) => {
  for (const category of Object.keys(topicStats)) {
    topicStats[category] = 0;
  }

  response.redirect("/");
});
```

`Object.keys(topicStats)` giver et array med kategoriernes navne. Løkken bruger hvert navn til at vælge og nulstille en tæller.

Tilføj en formular i `views/index.ejs`:

```html
<form method="POST" action="/clear-stats">
  <button type="submit">Nulstil statistik</button>
</form>
```

Stil flere spørgsmål, nulstil statistikken, og kontrollér, at alle tællere bliver `0`, mens beskederne bliver stående.

</details>

<details>
<summary><strong>13. Flyt <code>answers</code> til sit eget JavaScript-modul</strong></summary>

Når `server.js` vokser, kan svarreglerne flyttes til deres egen fil:

```text
jeres-amabot/
├── data/
│   └── answers.js
├── public/
├── views/
├── package.json
└── server.js
```

Flyt hele `answers`-arrayet til `data/answers.js`, og eksportér det:

```js
export const answers = [
  // jeres svarregler
];
```

Fjern arrayet fra `server.js`, og importér det i stedet:

```js
import express from "express";
import { answers } from "./data/answers.js";
```

De krøllede parenteser passer til den navngivne eksport, der er oprettet med `export const answers`.

Test modulet:

1. Start AMAbotten med `npm run dev`.
2. Stil spørgsmål til mindst to regler.
3. Ret et svar i `data/answers.js`.
4. Gem filen, og kontrollér det nye svar.
5. Kontrollér, at `server.js` ikke længere indeholder selve reglerne.

Forklar, hvilken fil der eksporterer data, hvilken fil der importerer dem, og hvor variablen `answers` findes, når `findBestAnswer()` kører.

</details>
