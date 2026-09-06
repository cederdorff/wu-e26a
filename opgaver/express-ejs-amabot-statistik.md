# Øvelse 4: Gør AMAbotten klogere med scoring og statistik

I denne øvelse bygger I videre på **det samme projekt** fra [øvelse 3](express-ejs-amabot.md). Nogle af jer har allerede gjort den grundlæggende AMAbot færdig, mens andre først skal færdiggøre svarlogikken. Derfor begynder øvelsen med et fælles tjekpunkt og en gennemgang af den `findAnswer()`-funktion, I skal bygge videre på.

I ændrer ikke projektets struktur — kun `server.js` og `views/index.ejs`.

Lige nu vinder den **første** regel, der matcher et nøgleord, selvom en senere regel måske passer bedre. I dag retter I det, så AMAbotten vælger den regel, der matcher **flest** nøgleord. I tilføjer også en simpel statistik, der viser, hvilke emner brugerne spørger mest til.

Skriv og test ét trin ad gangen, ligesom i de foregående øvelser.

## Før du begynder: Kom frem til samme startpunkt

Øvelse 4 forudsætter, at du har gennemført **trin 1–13 i øvelse 3**. De vigtigste dele er, at appen:

- har et `answers`-array med regler
- har en `findAnswer(question)`-funktion
- modtager spørgsmålet i `POST /ask`
- gemmer både spørgsmålet og svaret i `messages`
- viser en fejl ved et tomt spørgsmål

Er du ikke nået dertil endnu, så fortsæt først i [øvelse 3](express-ejs-amabot.md). Du behøver ikke lave ekstraopgaverne i øvelse 3 for at gå videre.

> Har du lavet ekstraopgave 17 med flere tilfældige svar pr. regel, ser dine data anderledes ud end eksemplerne her. Gem gerne den version i Git, og brug derefter igen én `answer`-tekst pr. regel, mens du arbejder med denne øvelse. Så har alle samme udgangspunkt for den nye logik.

### Kontrollér startpunktet

Start serveren, og prøv disse tre ting:

1. Stil et spørgsmål, der matcher en regel.
2. Stil et spørgsmål, der ikke matcher nogen regel.
3. Send et tomt spørgsmål.

Du skal henholdsvis få et kendt svar, standardsvaret og en fejlbesked. Først derefter er du klar til at ændre måden, svaret bliver fundet på.

---

## Genbesøg: Hvordan finder `findAnswer()` et svar?

Find denne funktion fra øvelse 3 i din egen `server.js`, og læs den fra toppen og ned:

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

Følg værdierne i denne rækkefølge:

1. `question.toLowerCase()` laver en ny tekst med små bogstaver. Så kan `"Hvad HEDDER du?"` stadig matche nøgleordet `"hedder"`.
2. `for...of` tager ét objekt ad gangen fra `answers`. Variablen `answerGroup` er altså først navnereglen, derefter bostedsreglen og så videre.
3. `.some()` tager ét nøgleord ad gangen fra den aktuelle regels `keywords`. Den giver `true`, så snart ét nøgleord matcher, og ellers `false`.
4. `.includes(keyword)` undersøger, om nøgleordets tekst findes inde i det normaliserede spørgsmål.
5. Hvis `hasMatch` er `true`, stopper `return` hele funktionen med det samme. Derfor vinder den **første** regel med et match.
6. Hvis løkken slutter uden et match, når funktionen frem til standardsvaret.

> Metoderne har forskellige opgaver: `toLowerCase()` normaliserer teksten, `includes()` undersøger ét nøgleord, `.some()` samler undersøgelsen til et ja/nej for én regel, og `for...of` gennemgår alle reglerne indtil et `return` stopper funktionen.

### Spor funktionen med et konkret spørgsmål

Brug spørgsmålet `"Hvad hedder du, og hvor bor du?"`, og udfyld gerne tabellen på papir eller sammen:

| `answerGroup` | Matchende nøgleord | `hasMatch` | Hvad sker der? |
| --- | --- | --- | --- |
| `navn` | `"hedder"` | `true` | Funktionen returnerer navnesvaret |
| `bosted` | `"bor"` | ville også være `true` | Reglen bliver aldrig undersøgt |

Det er præcis den begrænsning, I skal ændre: Vi skal ikke længere stoppe ved det første match. Vi skal undersøge alle regler og huske den højeste score.

## Det bygger du

```text
Browser -> POST /ask -> findBestAnswer() -> topicStats -> messages array -> response.render() -> EJS -> HTML
```

Når øvelsen er færdig, kan jeres AMAbot:

- vælge den regel, der matcher flest nøgleord, i stedet for bare den første
- holde styr på, hvor mange gange hvert emne er blevet spurgt om
- vise den statistik i EJS
- vise en lille reaktion (emoji), der afhænger af emnet

---

## 1. Giv hver regel en kategori

`answers`-arrayet fra øvelse 3 har allerede `keywords` og `answer`. Tilføj en tredje egenskab, `category`, til hver regel:

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

`category` er en kort, ensartet betegnelse for emnet — brug den samme slags ord, uanset hvor mange regler I har. I skal bruge den til statistikken i de næste trin.

### Test trin 1

Læs jeres opdaterede `answers` igennem. Kontrollér, at alle regler nu har `category`, `keywords` og `answer`. Appen opfører sig endnu ikke anderledes.

---

## 2. Gå fra ja/nej til antal med `.filter()`

I øvelse 3 brugte `findAnswer()` `.some()`, som kun svarer ja/nej på, om en regel matcher. Et ja fortæller ikke, om reglen matchede ét, to eller tre nøgleord. Nu skal I i stedet **tælle** matchene.

Sammenlign først de to udtryk:

```js
// Ja eller nej: Matcher mindst ét nøgleord?
keywords.some((keyword) => normalizedQuestion.includes(keyword));

// Nyt array: Hvilke nøgleord matcher?
keywords.filter((keyword) => normalizedQuestion.includes(keyword));
```

Begge bruger den samme test med `.includes()`. Forskellen er resultatet: `.some()` giver en boolean, mens `.filter()` giver et nyt array. Derfor kan vi bruge `.length` til at tælle det nye array.

Tilføj denne funktion over `findAnswer()`:

```js
function countMatches(keywords, normalizedQuestion) {
  return keywords.filter((keyword) => normalizedQuestion.includes(keyword)).length;
}
```

> **`.filter()`:** `.filter()` gennemgår et array og returnerer et **nyt** array med kun de elementer, der opfylder betingelsen — her de nøgleord, som findes i spørgsmålet. Det oprindelige `keywords`-array bliver ikke ændret. `.length` på det nye array fortæller, hvor mange nøgleord der matchede. Modsat `.some()`, som stopper ved det første match, gennemgår `.filter()` alle nøgleordene.

### Test trin 2

Sæt midlertidigt denne linje ind lige under funktionen, genstart serveren, og kontrollér resultatet i terminalen:

```js
console.log(countMatches(["navn", "hedder", "hvem er du"], "hvad hedder du, og hvad er dit navn?"));
```

Spørgsmålet indeholder to af de tre nøgleord, så terminalen skal vise `2`. Fjern loggen igen.

---

## 3. Vælg den bedst matchende regel

Erstat `findAnswer()` fra øvelse 3 med denne nye funktion:

```js
function findBestAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  let bestMatch = null;

  for (const answerGroup of answers) {
    const score = countMatches(answerGroup.keywords, normalizedQuestion);

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { ...answerGroup, score };
    }
  }

  return bestMatch;
}
```

`bestMatch` starter som `null`, fordi ingen regel er fundet endnu. Denne gang må løkken ikke `return`-ere ved første match. For hver regel beregner I dens `score` og sammenligner den med den bedste score indtil nu. Kun hvis scoren er større end nul, **og** højere end den bedste, vi har set, gemmer vi reglen som den nye `bestMatch`. Først efter hele `for...of`-løkken returnerer funktionen resultatet.

`{ ...answerGroup, score }` kopierer reglens egenskaber ind i et nyt objekt og tilføjer `score`, så I stadig har `category`, `keywords`, `answer` og `score` samlet ét sted.

Spor fx spørgsmålet `"Hvad hedder du, hvad er dit navn, og hvor bor du?"`:

| Regel | Matchende nøgleord | `score` | `bestMatch` bagefter |
| --- | --- | ---: | --- |
| `navn` | `"navn"`, `"hedder"` | 2 | `navn` |
| `bosted` | `"bor"` | 1 | stadig `navn` |
| `fritid` | ingen | 0 | stadig `navn` |

I POST-routen skal I nu bruge `findBestAnswer()` i stedet for `findAnswer()`. Ret linjerne, der vælger og gemmer svaret, til:

```js
const bestMatch = findBestAnswer(question);
const answer = bestMatch ? bestMatch.answer : "Det kender jeg ikke svaret på endnu.";
messages.push({ type: "answer", text: answer });
```

`bestMatch` er enten et regel-objekt eller `null`. `bestMatch ? bestMatch.answer : "..."` vælger svaret, hvis der er et match, og ellers standardteksten I kender fra øvelse 3.

### Test trin 3

Stil spørgsmålet `"Hvad hedder du, hvad er dit navn, og hvor bor du?"`. Det rammer navnereglen to gange og bostedsreglen én gang, så navnesvaret skal vinde.

Stil derefter `"Hvad er dit navn, og hvilken by bor du i?"`. Her får bostedsreglen to match (`"by"` og `"bor"`), mens navnereglen får ét. Svaret skal nu komme fra bostedsreglen. Det er antallet af matchende nøgleord — ikke ordenes placering i spørgsmålet — der afgør svaret.

> Ved samme score vinder den regel, der står først i `answers`, fordi betingelsen bruger `score > bestMatch.score` og ikke `>=`. Det er en bevidst og enkel regel til uafgjorte resultater.

---

## 4. Tæl emner i en statistik-oversigt

Opret et tomt objekt til statistikken **over** jeres routes, sammen med `messages` og `answers`:

```js
const topicStats = {};
```

I POST-routen skal I opdatere statistikken, hver gang der er et match. Sæt dette lige efter linjen med `const bestMatch = findBestAnswer(question);`:

```js
if (bestMatch) {
  topicStats[bestMatch.category] = (topicStats[bestMatch.category] ?? 0) + 1;
}
```

> **Objekt som tæller:** `topicStats` er ikke et array, men et objekt, hvor hver egenskab er et emne, fx `topicStats.navn`. `topicStats[bestMatch.category]` slår emnet op med firkantede parenteser, fordi emnet er en variabel og ikke et fast navn. `?? 0` betyder: brug den eksisterende værdi, eller `0`, hvis emnet ikke er talt før. `+ 1` lægger én til, hver gang emnet bliver spurgt om igen.

### Test trin 4

Sæt midlertidigt `console.log(topicStats);` ind efter opdateringen. Stil tre forskellige spørgsmål, hvor to rammer det samme emne. Terminalen skal vise et objekt, hvor det emne har tallet `2`, og de andre har `1`. Fjern loggen igen.

---

## 5. Vis statistikken i EJS

Send `topicStats` med til templaten i begge routes, sammen med `messages` og `error`. GET-routen har fortsat en tom fejltekst:

```js
response.render("index", { messages, error: "", topicStats });
```

I POST-routen skal I derimod beholde den `error`-variabel, som valideringen kan have ændret:

```js
response.render("index", { messages, error, topicStats });
```

Variablen `topicStats` skal altså med i **både** GET- og POST-routen, så den altid findes i templaten. Hvis I skriver `error: ""` i POST-routen, forsvinder fejlbeskeden for et tomt spørgsmål.

Tilføj derefter dette et passende sted i `views/index.ejs`, fx under samtalehistorikken:

```ejs
<% if (Object.keys(topicStats).length > 0) { %>
  <h2>Mest spurgte emner</h2>
  <ul>
    <% for (const [category, count] of Object.entries(topicStats)) { %>
      <li><%= category %>: <%= count %></li>
    <% } %>
  </ul>
<% } %>
```

> **`Object.entries()`:** Et objekt har ikke en indbygget `for...of`-løkke, som et array har. `Object.entries(topicStats)` laver objektet om til et array af `[emne, antal]`-par, som `for...of` kan gennemgå. `const [category, count]` trækker de to værdier ud af hvert par i én linje.

### Test trin 5

Stil et par spørgsmål. Overskriften "Mest spurgte emner" og en liste med emner og antal skal nu vises på siden. Genindlæs siden: Tallene skal stadig stå der, ligesom `messages` gør.

---

## 6. Vælg en reaktion med switch

Indtil nu har I kun brugt `if`/`else`. Tilføj denne funktion, som bruger `switch` til at vælge en emoji ud fra emnet:

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

> **`switch`:** `switch` sammenligner `category` med hver `case` ét ad gangen og returnerer, så snart der er et match. `default` fanger alle de tilfælde, ingen `case` passer på — her enhver kategori, I ikke selv har tilføjet en emoji til. `switch` er et alternativ til en lang `if`/`else if`-kæde, når I sammenligner den samme værdi med flere faste muligheder.

Brug funktionen i POST-routen, når I gemmer svaret:

```js
const answer = bestMatch ? bestMatch.answer : "Det kender jeg ikke svaret på endnu.";
const reaction = bestMatch ? reactionFor(bestMatch.category) : "🤔";
messages.push({ type: "answer", text: `${reaction} ${answer}` });
```

Tilpas selv emoji og `case`-værdier, så de passer til jeres egne kategorier.

### Test trin 6

Stil spørgsmål, der rammer forskellige kategorier. Hvert svar skal starte med en emoji, der passer til emnet. Stil et spørgsmål, der ikke matcher noget: Svaret skal starte med 🤔.

---

## Tjekpunkt

Din AMAbot er færdig med denne øvelse, når den:

- vælger den regel, der matcher flest nøgleord, ikke bare den første
- tæller, hvor mange gange hvert emne er blevet spurgt om
- viser statistikken i EJS
- viser en emoji-reaktion, der afhænger af emnet

Du skal kunne pege på, hvor scoren beregnes, hvor statistikken opdateres, og hvor EJS bruger `Object.entries()`.

> Statistikken ligger kun i serverens hukommelse, ligesom `messages`. Den forsvinder, når serveren genstarter. Senere lærer I at gemme data permanent i en fil, så den overlever en genstart.

---

## Ekstra opgaver

### 7. Sortér statistikken efter antal

Lige nu vises emnerne i den rækkefølge, de første gang blev talt. Sortér dem i stedet efter antal, med det mest spurgte emne øverst. Ret EJS-loopet til:

```ejs
<% const sortedTopics = Object.entries(topicStats).sort((a, b) => b[1] - a[1]); %>
<ul>
  <% for (const [category, count] of sortedTopics) { %>
    <li><%= category %>: <%= count %></li>
  <% } %>
</ul>
```

`Object.entries(topicStats)` giver et array af `[emne, antal]`-par. `.sort((a, b) => b[1] - a[1])` sorterer parrene efter `antal` (parrets andet element, indeks `1`) i faldende rækkefølge.

### Test trin 7

Spørg flere gange til det samme emne, indtil det ikke længere er det først-spurgte. Emnet med højest antal skal nu stå øverst på listen.

---

### 8. Nulstil statistikken sammen med beskederne

Har I lavet "Ryd beskeder"-knappen fra øvelse 3's ekstra opgave 18, skal statistikken ryddes på samme tid. Tilføj denne linje i `POST /clear-messages`, lige efter `messages.length = 0;`:

```js
for (const category of Object.keys(topicStats)) delete topicStats[category];
```

> `topicStats` er erklæret med `const`, ligesom `messages`, så I kan ikke erstatte det med et nyt, tomt objekt. `Object.keys(topicStats)` giver et array af emnenavnene, og `delete topicStats[category]` fjerner hvert emne fra det eksisterende objekt.

### Test trin 8

Stil et par spørgsmål, tjek at statistikken vises, og klik derefter "Ryd beskeder". Både samtalen og statistikken skal være tomme igen.
