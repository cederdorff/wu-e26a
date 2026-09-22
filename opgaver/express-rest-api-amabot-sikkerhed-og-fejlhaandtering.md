# Øvelse 9: AMAbotten bliver sikker og fejltolerant

## Kort fortalt

Du bygger videre på din egen AMAbot fra [øvelse 7](express-rest-api-amabot-arkitektur.md) — `/messages` og `/answers`, hver i sin egen routes-fil og sit eget data-modul. Har du ikke lavet øvelse 7 færdig endnu, gør det først; denne øvelse forudsætter den lagdelte struktur.

I dag implementerer du direkte det, [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md) gennemgik: eksplicitte statuskoder, fejlhåndtering af ugyldige kategorier og manglende input, `try`/`catch` om jeres data-funktioner, en fælles fejl-middleware, en strammere `cors()`-opsætning, og en rettelse af XSS-hullet i `POST /messages`.

Øvelsen er delt i tre dele:

- **Del 1** gør alle statuskoder eksplicitte, og tilføjer `404`\- og `400`\-tjek, hvor de mangler.
- **Del 2** tilføjer `try`/`catch` om jeres `loadX()`\-funktioner, og en fælles fejl-middleware i `server.js`.
- **Del 3** strammer `cors()`-opsætningen, og retter XSS-hullet i `POST /messages`.

> **Har du lavet [øvelse 8](fetch-dom-amabot.md) endnu?** Del 3 forudsætter ikke, at du har — er `cors()` allerede installeret hos dig, retter du bare opsætningen; har du ikke lavet øvelse 8 endnu, installerer du den først. Begge veje er beskrevet i punkt 16.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Samme fremgangsmåde som altid: prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under trinnet — den peger på de rigtige metoder og egenskaber, uden at give dig koden.
2. Åbn først **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller du vil sammenligne med din egen kode.

Spring aldrig en test over, selv når den virker oplagt.

</details>

---

## Del 1: Statuskoder og fejlkontrol

### 1. Gem udgangspunktet i Git

```bash
git add .
git commit -m "Save AMAbot before adding status codes and error handling"
git push
```

---

### 2. Statuskoder: POST /messages opretter noget — 201

`POST /messages` opretter to nye beskeder (spørgsmål og svar), men svarer stadig med Express' standard-`200`. Find sidste linje i routen i `routes/messages.js`:

```js
response.json({ question: message, answer: answerMessage });
```

Ret den til:

```js
response.status(201).json({ question: message, answer: answerMessage });
```

#### Test trin 2

Send `POST http://localhost:3000/messages` med et rigtigt spørgsmål. Kig i Thunder Clients statuslinje — står der nu `201 Created` i stedet for `200 OK`?

---

### 3. Statuskoder: DELETE /messages rydder noget — 204

`DELETE /messages` sender intet indhold tilbage — det er netop, hvad `204 No Content` betyder. Find:

```js
response.send();
```

i `DELETE /messages`, og ret den til:

```js
response.status(204).send();
```

#### Test trin 3

Send `DELETE http://localhost:3000/messages`. Statuslinjen skal nu vise `204 No Content`.

---

### 4. Statuskoder: POST /answers opretter noget — 201

Samme rettelse som i punkt 2, denne gang i `routes/answers.js`. Find sidste linje i `POST /answers`:

```js
response.json(newAnswerRule);
```

Ret den til:

```js
response.status(201).json(newAnswerRule);
```

#### Test trin 4

Opret en ny regel med `POST http://localhost:3000/answers`. Statuslinjen skal vise `201 Created`.

---

### 5. Statuskoder: DELETE /answers/:category rydder noget — 204

Find `response.send();` i `DELETE /answers/:category`, og ret den til `response.status(204).send();`, som i punkt 3.

#### Test trin 5

Slet en regel, du selv oprettede i punkt 4. Statuslinjen skal vise `204 No Content`.

## Tjekpunkt: statuskoder

Statuskoderne er på plads, når `POST /messages`, `POST /answers` og `DELETE /answers/:category` svarer med `201`/`204` i stedet for Express' standard-`200`, og `DELETE /messages` svarer med `204`.

---

### 6. 404: GET /answers/:category

Beder du om en kategori, der ikke findes, får du i dag `null` tilbage med `200 OK` — en fejl, der ser ud som en succes. Byg videre på `GET /answers/:category` i `routes/answers.js`:

```js
router.get("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  // TODO: Hvis answerRule er undefined, send response.status(404).json({ error: "..." }), og stop routen med return.

  response.json(answerRule);
});
```

<details>
<summary>Hint</summary>

```text
if (!answerRule) {
  response.status(404).json({ error: "..." })
  return
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
router.get("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Ingen regel med den kategori findes." });
    return;
  }

  response.json(answerRule);
});
```

</details>

#### Test trin 6

Send `GET http://localhost:3000/answers/findes-ikke`. Du skal nu få `404` og en tydelig fejlbesked som JSON, i stedet for `null` med `200`. Bekræft bagefter, at en kategori, der faktisk findes, stadig virker som før.

---

### 7. 404: PUT /answers/:category

Samme mønster, denne gang før opdateringen — I skal ikke kunne opdatere en regel, der ikke findes:

```js
router.put("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  // TODO: Samme 404-tjek som i punkt 6.

  answerRule.keywords = request.body.keywords;
  answerRule.answer = request.body.answer;
  await saveAnswers(answers);

  response.json(answerRule);
});
```

<details>
<summary>Se løsningsforslag</summary>

```js
router.put("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Ingen regel med den kategori findes." });
    return;
  }

  answerRule.keywords = request.body.keywords;
  answerRule.answer = request.body.answer;
  await saveAnswers(answers);

  response.json(answerRule);
});
```

</details>

#### Test trin 7

Send `PUT http://localhost:3000/answers/findes-ikke` med en body. Du skal få `404`. Bekræft bagefter, at `PUT` på en rigtig kategori stadig opdaterer den som før.

---

### 8. 404: DELETE /answers/:category

`.filter()` fortæller ikke, om der overhovedet var noget at fjerne — I skal selv tjekke det først, ligesom i punkt 6-7:

```js
router.delete("/:category", async (request, response) => {
  const answers = await loadAnswers();

  // TODO: Find reglen med find(), ligesom i GET og PUT. Findes den ikke, send 404 og return.

  const updatedAnswers = answers.filter((a) => a.category !== request.params.category);
  await saveAnswers(updatedAnswers);

  response.status(204).send();
});
```

<details>
<summary>Se løsningsforslag</summary>

```js
router.delete("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Ingen regel med den kategori findes." });
    return;
  }

  const updatedAnswers = answers.filter((a) => a.category !== request.params.category);
  await saveAnswers(updatedAnswers);

  response.status(204).send();
});
```

</details>

#### Test trin 8

Send `DELETE http://localhost:3000/answers/findes-ikke`. Du skal få `404`. Bekræft bagefter, at `DELETE` på en rigtig kategori stadig sletter den, med `204` som i punkt 5.

## Tjekpunkt: 404

`GET`, `PUT` og `DELETE` på `/answers/:category` svarer alle med `404` og en tydelig fejlbesked, når kategorien ikke findes — og fungerer uændret, når den gør.

---

### 9. 400: POST /messages afviser stadig kun med 200

`POST /messages` tjekker allerede, om `question` er tomt — men sender fejlen med Express' standard-`200`, som om alt gik godt. Find:

```js
if (!question) {
  response.json({ error: "Skriv et spørgsmål, før du sender." });
  return;
}
```

og tilføj `.status(400)`:

```js
if (!question) {
  response.status(400).json({ error: "Skriv et spørgsmål, før du sender." });
  return;
}
```

#### Test trin 9

Send `POST http://localhost:3000/messages` med `{ "question": "" }`. Statuslinjen skal nu vise `400 Bad Request`, ikke `200`.

---

### 10. 400: POST /answers uden validering

Lige nu opretter `POST /answers` en regel, uanset hvad — selv en helt tom body. Byg videre på routen:

```js
router.post("/", async (request, response) => {
  const answers = await loadAnswers();

  // TODO: Hvis request.body.category, request.body.keywords eller request.body.answer mangler,
  // send response.status(400).json({ error: "..." }), og stop routen med return.

  const newAnswerRule = {
    category: request.body.category,
    keywords: request.body.keywords,
    answer: request.body.answer
  };

  answers.push(newAnswerRule);
  await saveAnswers(answers);

  response.status(201).json(newAnswerRule);
});
```

<details>
<summary>Hint</summary>

```text
if (!request.body.category || !request.body.keywords || !request.body.answer) {
  response.status(400).json({ error: "..." })
  return
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
router.post("/", async (request, response) => {
  const answers = await loadAnswers();

  if (!request.body.category || !request.body.keywords || !request.body.answer) {
    response.status(400).json({ error: "category, keywords og answer skal alle udfyldes." });
    return;
  }

  const newAnswerRule = {
    category: request.body.category,
    keywords: request.body.keywords,
    answer: request.body.answer
  };

  answers.push(newAnswerRule);
  await saveAnswers(answers);

  response.status(201).json(newAnswerRule);
});
```

</details>

#### Test trin 10

Send `POST http://localhost:3000/answers` med `{ "category": "test" }` (uden `keywords`/`answer`) — du skal få `400`. Bekræft bagefter, at en fuldt udfyldt body stadig opretter en regel som før.

---

### 11. 400: PUT /answers/:category uden validering

Samme princip, denne gang efter 404-tjekket fra punkt 7:

```js
router.put("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Ingen regel med den kategori findes." });
    return;
  }

  // TODO: Hvis request.body.keywords eller request.body.answer mangler, send 400 og return.

  answerRule.keywords = request.body.keywords;
  answerRule.answer = request.body.answer;
  await saveAnswers(answers);

  response.json(answerRule);
});
```

<details>
<summary>Se løsningsforslag</summary>

```js
router.put("/:category", async (request, response) => {
  const answers = await loadAnswers();
  const answerRule = answers.find((a) => a.category === request.params.category);

  if (!answerRule) {
    response.status(404).json({ error: "Ingen regel med den kategori findes." });
    return;
  }

  if (!request.body.keywords || !request.body.answer) {
    response.status(400).json({ error: "keywords og answer skal begge udfyldes." });
    return;
  }

  answerRule.keywords = request.body.keywords;
  answerRule.answer = request.body.answer;
  await saveAnswers(answers);

  response.json(answerRule);
});
```

</details>

#### Test trin 11

Send `PUT` på en rigtig kategori med `{ "keywords": ["test"] }` (uden `answer`) — du skal få `400`. Bekræft bagefter, at en fuldt udfyldt body stadig opdaterer reglen som før.

## Tjekpunkt: Del 1

Del 1 er gennemført, når:

- `POST /messages`, `POST /answers` og `DELETE /answers/:category` svarer med `201`/`204` i stedet for standard-`200`
- `GET`, `PUT` og `DELETE` på `/answers/:category` svarer med `404`, når kategorien ikke findes
- `POST /messages`, `POST /answers` og `PUT /answers/:category` svarer med `400`, når nødvendige felter mangler
- alt det, der virkede før, stadig virker uændret

---

## Del 2: Uventede fejl — try/catch og en fælles fejl-middleware

### 12. try/catch: loadMessages()

I modsætning til `404`/`400` fra Del 1 — som I selv tjekker for på forhånd — kan `loadMessages()` fejle på en måde, I ikke kan tjekke jer frem til: JSON-filen kan mangle, eller indeholde ugyldig JSON. Byg videre på `data/messages.js`:

```js
export async function loadMessages() {
  // TODO: Pak fs.readFile() og JSON.parse() ind i try/catch.
  // I catch-blokken: throw new Error(...) med en tydelig, dansk fejlbesked.
  const data = await fs.readFile("./data/messages.json", "utf8");
  return JSON.parse(data);
}
```

<details>
<summary>Hint</summary>

```text
try {
  ...
} catch (error) {
  throw new Error("...")
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
export async function loadMessages() {
  try {
    const data = await fs.readFile("./data/messages.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Kunne ikke hente beskeder — data/messages.json mangler eller er ugyldig.");
  }
}
```

</details>

#### Test trin 12

Omdøb midlertidigt `data/messages.json` (eller ødelæg dens indhold), og send `GET http://localhost:3000/messages`. Du får stadig Express' egen fejlside — men kig øverst på siden: står der nu jeres egen, tydelige fejlbesked i stedet for en teknisk `ENOENT`/`SyntaxError`? Giv filen dens rigtige navn og indhold tilbage bagefter.

---

### 13. try/catch: loadAnswers()

Gør det samme for `loadAnswers()` i `data/answers.js`, selv.

<details>
<summary>Se løsningsforslag</summary>

```js
export async function loadAnswers() {
  try {
    const data = await fs.readFile("./data/answers.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Kunne ikke hente svarregler — data/answers.json mangler eller er ugyldig.");
  }
}
```

</details>

#### Test trin 13

Gentag testen fra punkt 12, denne gang med `data/answers.json` og `GET /answers`.

---

### 14. En 404-catch-all i server.js

Lige nu svarer en ukendt sti (fx `GET /noget-der-ikke-findes`) med Express' egen "Cannot GET ..."-tekst. Tilføj nederst i `server.js`, efter begge routere er monteret:

```js
app.use((request, response) => {
  response.status(404).json({ error: "Ukendt sti." });
});
```

#### Test trin 14

Send `GET http://localhost:3000/noget-der-ikke-findes`. Du skal nu få `404` og `{ "error": "Ukendt sti." }` som JSON.

---

### 15. En fælles fejl-middleware i server.js

Tilføj helt nederst i `server.js`, efter 404-catch-all'en fra punkt 14 — rækkefølgen betyder noget, Express bruger den sidst tilføjede matchende middleware:

```js
app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ error: error.message });
});
```

#### Test trin 15

Gentag testen fra punkt 12 (omdøb `data/messages.json` midlertidigt, send `GET /messages`). Får I nu et rent JSON-svar — `{ "error": "Kunne ikke hente beskeder — ..." }` med status `500` — i stedet for Express' fejlside? Giv filen dens rigtige navn og indhold tilbage bagefter.

## Tjekpunkt: Del 2

Del 2 er gennemført, når:

- `loadMessages()` og `loadAnswers()` fanger deres egne fejl og kaster en tydelig, dansk fejlbesked videre
- en ukendt sti svarer med `404` og JSON, i stedet for Express' standardtekst
- en uventet fejl (fx en ødelagt datafil) svarer med `500` og jeres egen fejlbesked som JSON, i stedet for Express' HTML-fejlside

---

## Del 3: Sikkerhed — CORS og XSS

### 16. CORS: begræns til jeres egen frontend

**Har du allerede `cors()` installeret** (fra [øvelse 8](fetch-dom-amabot.md))? Find `app.use(cors());` i `server.js`, og ret den til:

```js
app.use(cors({ origin: "http://127.0.0.1:5500" }));
```

**Har du ikke lavet øvelse 8 endnu?** Installér pakken først:

```bash
npm install cors
```

Importér den øverst i `server.js`, og montér den direkte med den begrænsede opsætning:

```js
import cors from "cors";

app.use(cors({ origin: "http://127.0.0.1:5500" }));
```

> `http://127.0.0.1:5500` er standard-adressen for VS Codes Live Server-udvidelse — den samme, `client/index.html` kører på i øvelse 8. Kører din frontend på en anden adresse eller port, brug den i stedet.

#### Test trin 16

Har du en frontend kørende (øvelse 8): genindlæs den, og bekræft at den stadig henter og viser beskeder uden fejl i konsollen. Prøv derefter selv at kalde jeres API fra et helt andet sted: åbn DevTools-konsollen på en vilkårlig anden hjemmeside, og kør `fetch("http://localhost:3000/messages").then(r => r.json()).then(console.log)`. Den skal nu fejle med en CORS-fejl i konsollen.

---

### 17. XSS: escapeHtml() i POST /messages

Lige nu gemmer og sender `POST /messages` `question` helt uredigeret. Tilføj en lille hjælpefunktion i den fil, hvor jeres `POST /messages`\-logik bor (`routes/messages.js`, eller `controllers/messagesController.js`, hvis du lavede det valgfrie punkt 5 i øvelse 7):

```js
function escapeHtml(text) {
  // TODO: Returnér text, hvor <, >, &, " og ' er erstattet med deres HTML-entities:
  // &lt;, &gt;, &amp;, &quot;, &#039;
}
```

<details>
<summary>Hint</summary>

`String.prototype.replaceAll()` kan kædes efter hinanden — én linje pr. tegn, du skal erstatte. Erstat `&` allerførst, ellers escaper du jeres egne entities igen.

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
```

</details>

Brug den nu, når spørgsmål-beskeden oprettes i `POST /messages`. Find:

```js
const message = { type: "question", text: question, createdAt: new Date().toISOString() };
```

og ret den til:

```js
const message = { type: "question", text: escapeHtml(question), createdAt: new Date().toISOString() };
```

#### Test trin 17

Send `POST http://localhost:3000/messages` med body `{ "question": "<img src=x onerror=\"alert('hacked')\">" }`. Åbn `data/messages.json`, og bekræft at teksten nu er gemt som `&lt;img src=x onerror=...&gt;` i stedet for rå HTML. Send derefter et almindeligt spørgsmål igen, og bekræft at det stadig fungerer som før.

## Tjekpunkt: Del 3

Del 3 er gennemført, når `cors()` kun tillader jeres egen frontends origin, og `POST /messages` escaper `question`, før den gemmes.

---

## Reflektér over din læring

Når du er færdig, skal du gerne kunne forklare:

1. Hvad er forskellen på en fejl, I selv tjekker for med et `if` (som `404`/`400` i Del 1), og en fejl, I fanger med `try`/`catch` (som i Del 2)? Hvorfor duer et `if`-tjek ikke til en ødelagt datafil?
2. `/answers/:category` bruger `.find()` i både `GET`, `PUT` og `DELETE` nu — hvorfor er `404`\-tjekket nødvendigt i alle tre, når det er samme opslag hver gang?
3. I punkt 12 kastede I en ny, tydelig fejl i `catch`-blokken i stedet for bare at fange og ignorere den oprindelige. Hvad ville der være sket, hvis I i stedet havde ladet `catch`-blokken være tom?
4. Hvorfor betyder `cors({ origin: "..." })` noget for en browser, men intet for Thunder Client eller en almindelig `curl`\-kommando?
5. `escapeHtml()` kører på `question`, før den gemmes på serveren — hvad ville der ske, hvis I i stedet ventede med at rense teksten, til den blev vist i en klient? Er der en fordel ved at gøre det på serveren?
6. Peg på ét sted i jeres kode, hvor en fejl nu ender som `{ error: "..." }`, uanset om den kom fra et `404`\-, `400`\- eller `500`\-svar.

## Videre

Din AMAbot håndterer nu de samme typer fejl, et rigtigt REST API bør: forudsigelige tjek (`404`/`400`), uventede fejl (`try`/`catch` og en fælles fejl-middleware), og to konkrete sikkerhedshuller lukket (`cors()` begrænset til jeres egen frontend, og `question` renset for HTML, før den gemmes). Brug gerne de samme mønstre — eksplicitte statuskoder, tjek før I handler, `try`/`catch` om det, der kan fejle uforudsigeligt — når I snart går videre til jeres eget projekt.
