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

Alle kodeændringer og spørgsmål står i træningsfilen. Brug denne oversigt til at holde styr på progressionen:

| Del | Fagligt fokus | Ændring, I skal afprøve |
| --- | --- | --- |
| 1 | Funktion, parameter, argument og `return` | Skift argumentet i funktionskaldet |
| 2 | `toLowerCase()` | Afprøv en ny tekst med store bogstaver |
| 3 | `.includes()` og boolean | Søg efter både kendte og ukendte ord |
| 4 | Array, callback og `.some()` | Få resultatet til at skifte mellem `true` og `false` |
| 5 | Array, objekt og `for...of` | Tilføj en regel, og se løkken tage en ekstra tur |
| 6 | `if`/`else` | Få begge kodeveje til at køre |
| 7 | Den samlede `findAnswer()` | Test en kendt, en anden kendt og en ukendt kategori |

> Standardresultaterne forudsætter den oprindelige fil. Hvis jeres ændringer gør det svært at følge næste del, kan I hente en frisk kopi af `find-answer-oevelser.js`.

### Sammenlign med AMAbottens `findAnswer()`

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
console.log("Undersøger:", answerGroup.keywords);
console.log("Matcher:", hasMatch);
```

Kør først filen som den er, og se, hvilke regler det kendte og det ukendte spørgsmål undersøger. Skriv derefter et spørgsmål, der matcher bostedsreglen, og kør filen igen.

Sammenlign til sidst øvelsesfilens `findAnswer()` med funktionen i jeres egen `server.js`. De to logs er kun hjælp til undersøgelsen og behøver ikke flyttes med ind i AMAbotten.

### Klar til næste fase?

Gå først videre, når I med egne ord kan forklare:

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

> De viste scores forudsætter den oprindelige fil. Hent en frisk kopi, hvis jeres ændringer gør det svært at følge næste del.

Forskellen, I skal undersøge, er:

| Metode | Resultat | Spørgsmål, metoden besvarer |
| --- | --- | --- |
| `.some()` | `true` eller `false` | Matcher mindst ét nøgleord? |
| `.filter()` | Et nyt array | Hvilke nøgleord matcher? |
| `.filter().length` | Et tal | Hvor mange nøgleord matcher? |

Med spørgsmålet `"hvad hedder du, og hvad er dit navn?"` skal `countMatches()` give `2`, fordi `"hedder"` og `"navn"` matcher.

> Funktionen tæller matchende nøgleord — ikke hvor mange gange det samme nøgleord står i spørgsmålet.

### Klar til næste del?

Gå videre, når I kan:

- forklare forskellen på resultatet fra `.some()` og `.filter()`
- ændre spørgsmålet og forudsige den nye score
- pege på, hvorfor `.length` bliver funktionens resultat

---

## 5. Undersøg scoren for alle regler

> **Arbejdssted:** Fortsæt i `scoring-oevelser.js`.

Før AMAbotten skal vælge noget, skal I se scoren for hver regel. Find del 3 i træningsfilen, og brug spørgsmålet `"Hvad hedder du, hvad er dit navn, og hvor bor du?"`.

Med eksempelreglerne skal terminalen vise:

```text
navn 2
bosted 1
fritid 0
```

Her træner I det samme `for...of` som i `findAnswer()`. Forskellen er, at løkken ikke stopper ved det første match. Den beregner en score for alle regler.

Løs opgaverne under del 3. Ret blandt andet spørgsmålet, så henholdsvis bostedsreglen og ingen af reglerne får den højeste score.

### Klar til næste del?

Gå videre, når I kan:

- forklare, hvorfor `for...of` kører én gang pr. regel
- finde den højeste score i terminalens output
- ændre spørgsmålet, så en anden regel vinder

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

> Alle dele bruger det samme `topicStats`-objekt. Tællerne bygger derfor videre på de tidligere dele. Det er meningen, at værdierne ændrer sig, mens filen kører.

Når I kan forklare, hvorfor `topicStats[result.category]` finder den rigtige tæller, skal I gå tilbage til AMAbotten.

### Klar til integration?

Gå videre, når I kan:

- læse en property med både punktnotation og bracket notation
- forklare, hvordan en tæller bliver forhøjet med `1`
- bruge en kategori-variabel til at finde den rigtige tæller
- forklare, hvorfor en tom kategori ikke bliver talt

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

| Ekstraopgave | Fokus | Forudsætning |
| --- | --- | --- |
| 9. Reaktion med `switch` | Kontrolstrukturer | Ingen |
| 10. `Object.entries()` | Gennemløb af et objekt | Ingen |
| 11. Eget emne | Arrays og objekter | Ingen; tilpas også 9 og 10, hvis de er lavet |
| 12. Ukendte spørgsmål | `if`/`else` og tællere | Ingen |
| 13. Mest spurgte emne | `for...of` og sammenligning | Ekstraopgave 10 |
| 14. Nulstil statistik | Route, `Object.keys()` og bracket notation | Ingen |
| 15. JavaScript-modul | `export`, `import` og filstruktur | Lav den gerne til sidst |

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

### 11. Tilføj dit eget emne

Tilføj en ny regel til `answers`. Den skal have sin egen kategori, mindst tre nøgleord og et personligt svar:

```js
{
  category: "mad",
  keywords: ["mad", "spise", "livret"],
  answer: "Min livret er ..."
}
```

Tilføj også kategorien til `topicStats`:

```js
const topicStats = {
  navn: 0,
  bosted: 0,
  fritid: 0,
  mad: 0
};
```

Hvis I ikke har lavet ekstraopgave 10, skal I også tilføje emnet som et nyt `<li>` i EJS. Har I lavet ekstraopgave 9, kan I give emnet sin egen emoji med en ny `case`.

Test med:

1. Et spørgsmål, der matcher ét af de nye nøgleord
2. Et spørgsmål, der matcher to af de nye nøgleord
3. Et spørgsmål, hvor det nye emne konkurrerer med en eksisterende kategori

### 12. Tæl ukendte spørgsmål

Lige nu bliver et spørgsmål uden match ikke talt. Tilføj en tæller til `topicStats`:

```js
ukendt: 0
```

Udvid derefter `if`-sætningen i POST-routen med en `else`:

```js
if (result.category) {
  topicStats[result.category] = topicStats[result.category] + 1;
} else {
  topicStats.ukendt = topicStats.ukendt + 1;
}
```

Vis også tælleren i EJS, hvis I ikke allerede gennemløber objektet med `Object.entries()`.

#### Test ekstraopgave 12

Stil to kendte og to ukendte spørgsmål. De kendte spørgsmål skal tælles under deres kategorier, mens `ukendt` skal ende på `2`.

### 13. Find det mest spurgte emne

Denne ekstraopgave genbruger idéen fra `findBestAnswer()`: Gennemløb flere værdier, sammenlign dem, og husk den højeste.

Lav denne funktion i `server.js`:

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

Sammenlign funktionen med `findBestAnswer()`:

- Hvad svarer `count` til i svarlogikken?
- Hvad svarer `highestCount` til?
- Hvorfor starter `mostAskedTopic` som en tom tekst?

Kald funktionen lige før hver `response.render()`:

```js
const mostAskedTopic = findMostAskedTopic(topicStats);
```

Send derefter værdien med til EJS. GET-routen skal fx rendere med:

```js
response.render("index", {
  messages,
  error: "",
  topicStats,
  mostAskedTopic
});
```

Husk også `mostAskedTopic` i POST-routens render. Vis resultatet i EJS:

```ejs
<% if (mostAskedTopic) { %>
  <p>Mest spurgte emne: <%= mostAskedTopic %></p>
<% } %>
```

#### Test ekstraopgave 13

Stil spørgsmål, indtil en anden kategori overtager førstepladsen. Teksten i EJS skal følge med.

### 14. Lav en knap, der nulstiller statistikken

Tilføj en ny route i `server.js`:

```js
app.post("/clear-stats", (request, response) => {
  for (const category of Object.keys(topicStats)) {
    topicStats[category] = 0;
  }

  response.redirect("/");
});
```

`Object.keys(topicStats)` giver et array med kategoriernes navne. `for...of` gennemløber navnene, og bracket notation finder den tæller, der skal sættes til `0`.

Tilføj en formular i `views/index.ejs`:

```html
<form method="POST" action="/clear-stats">
  <button type="submit">Nulstil statistik</button>
</form>
```

#### Test ekstraopgave 14

Stil flere spørgsmål, kontrollér tællerne, og nulstil statistikken. Beskederne skal blive stående, mens alle tællere bliver `0`.

### 15. Flyt `answers` til sit eget JavaScript-modul

Efterhånden som `server.js` vokser, bliver den nemmere at læse, hvis svarreglerne ligger i deres egen fil. I øvelse 3 aktiverede I allerede ES Modules med `"type": "module"` i `package.json`. Derfor kan I bruge `export` og `import`.

Opret først denne struktur:

```text
jeres-amabot/
├── data/
│   └── answers.js
├── public/
├── views/
├── package.json
└── server.js
```

Flyt hele `answers`-arrayet fra `server.js` til `data/answers.js`, og skriv `export` foran variablen:

```js
export const answers = [
  {
    category: "navn",
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Ada."
  },
  // resten af jeres regler
];
```

Slet det gamle `answers`-array fra `server.js`. Importér det i stedet øverst i filen, lige under importen af Express:

```js
import express from "express";
import { answers } from "./data/answers.js";
```

De krøllede parenteser passer til den **named export**, I skrev med `export const answers`. Stien begynder med `./`, fordi `data/` ligger relativt til `server.js`, og filendelsen `.js` skal med.

#### Test ekstraopgave 15

1. Start AMAbotten med `npm run dev`.
2. Stil et spørgsmål til mindst to forskellige kategorier.
3. Ret et svar i `data/answers.js`, gem filen, og stil spørgsmålet igen.
4. Kontrollér, at `server.js` ikke længere indeholder selve svarreglerne.

Forklar til sidst:

- Hvilken fil eksporterer data?
- Hvilken fil importerer data?
- Hvor findes variablen `answers`, når `findBestAnswer()` kører?
- Hvad er blevet lettere at finde i `server.js`?

> Det er kun AMAbottens eget `answers`-array, I flytter. De tre træningsfiler skal fortsat kunne køres selvstændigt og skal derfor beholde deres egne eksempeldata.
