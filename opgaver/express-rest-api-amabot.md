# Øvelse 6: AMAbotten som REST API

## Kort fortalt

Du bygger videre på din egen AMAbot fra [øvelse 3](express-ejs-amabot.md), [4](express-ejs-amabot-statistik.md) og [5](express-ejs-amabot-persistens.md). Har du ikke lavet øvelse 5 (persistens) færdig endnu, skal du gøre det først — uden `loadMessages()`/`saveMessages()` giver Del 2 i denne øvelse ikke mening.

Indtil nu har AMAbotten sendt HTML tilbage med `response.render()`. I denne øvelse fjerner du EJS helt og gør serveren til et rent REST API, ligesom du lige har øvet i [REST API-øvelsen med studerende](express-rest-api-students.md) — bare på din egen AMAbots data i stedet for opdigtede studerende.

Øvelsen er delt i tre dele:

- **Del 1** opdeler projektet i en `client`- og en `server`-mappe, og fjerner EJS og HTML-formularer fra serveren.
- **Del 2** bygger et REST API for `/messages` — samtalehistorikken.
- **Del 3** bygger et REST API for `/answers` — AMAbottens svarregler, med fuld CRUD, så du kan rette et svar uden at redigere kildekoden.

> Hvorfor client/server nu? Snart (DOB 5) skal en frontend hente og opdatere data med `fetch()` — og `fetch()` forventer JSON tilbage, ikke en hel HTML-side. Det er præcis den overgang, du laver i denne øvelse. Du bygger ikke en ny frontend endnu; `client/`-mappen er bare klar til den, når turen kommer. Indtil videre tester du udelukkende med Thunder Client.

> Statuskoder og håndtering af ugyldige id'er/kategorier venter stadig til en senere øvelse — helt som i REST API-øvelsen med studerende.

---

## Del 1: Opdel projektet, og fjern EJS

```text
Før:                              Efter:
din-amabot/                       din-amabot/
├── data/                         ├── client/
├── public/                       │   ├── index.html   (tidligere views/index.ejs)
├── views/                        │   └── ...           (tidligere public/*)
│   └── index.ejs                 └── server/
├── package.json                      ├── data/
└── server.js                         ├── package.json
                                       └── server.js
```

### 1. Gem din nuværende AMAbot i Git

Du er ved at lave en stor omstrukturering. Gem udgangspunktet, så du altid kan sammenligne eller gå tilbage.

```bash
git status
git add .
git commit -m "Save AMAbot before splitting into client and server"
git push
```

#### Test trin 1

Kør `git status` igen. Arbejdsmappen skal være ren, eller du skal kunne forklare de filer, der stadig vises.

---

### 2. Opret client- og server-mapper

Kør i projektets rodmappe:

```bash
mkdir client server
mv server.js package.json package-lock.json node_modules data server/
mv views/index.ejs client/index.html
mv public/* client/
rmdir views public
```

> `client/index.html` indeholder stadig EJS-tags som `<%= %>` og `<% %>` — de bliver ikke længere udført af nogen server, og filen virker ikke som en rigtig side lige nu. Det er helt forventet. `client/index.html` bliver lavet om til en almindelig, statisk side i en senere øvelse. Rør den ikke yderligere nu.

#### Test trin 2

Kør `ls client` og `ls server`. Du skal se `index.html` (og dine tidligere CSS/billeder) i `client/`, og `server.js`, `package.json`, `node_modules/` samt `data/` i `server/`.

---

### 3. Fjern EJS, statiske filer og urlencoded fra serveren

Fra nu af arbejder du i `server/server.js`, og du kører serveren fra `server/`-mappen:

```bash
cd server
```

Fjern disse tre linjer, hvis du har dem — de hører til den gamle HTML-version:

```js
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
```

Tilføj i stedet den middleware, du brugte i REST API-øvelsen med studerende:

```js
app.use(express.json());
```

> `data/` flyttede sammen med `server.js` ind i `server/`, så stier som `"./data/messages.json"` i dine `loadMessages()`/`saveMessages()`-funktioner skal **ikke** ændres.

#### Test trin 3

Start serveren fra `server/`-mappen:

```bash
npm run dev
```

Den skal starte uden fejl. `express`-relaterede fejl om `ejs` eller `views` betyder, at du har glemt en reference et sted — søg efter `ejs` og `render` i hele filen.

<details>
<summary>Valgfrit oprydning: fjern den ubrugte ejs-pakke</summary>

```bash
npm uninstall ejs
```

`ejs` bruges ikke længere, men skader ikke noget, hvis den bliver liggende. Denne oprydning er ren kosmetik.

</details>

---

### 4. Fjern de gamle HTML-routes

`GET /` og `POST /ask` fra øvelse 3 bruger `response.render()` og læser `request.body.question` fra en formular — begge dele er væk nu. Slet begge routes helt fra `server.js`. Lad `messages`, `answers`, `loadMessages()`, `saveMessages()`, `findBestAnswer()` (eller din tilsvarende svarfunktion) og eventuel `topicStats` blive stående — den logik skal du genbruge i Del 2 og 3.

> Har du lavet en eller flere af ekstraopgaverne fra øvelse 3/4 — `/clear-messages` (ekstraopgave 18) eller `/clear-stats` (ekstraopgave 12) — skal de slettes her sammen med `GET /` og `POST /ask`. Begge bruger `response.redirect("/")`, som venter på en `GET /`-route, der ikke længere findes. Du bygger deres funktionalitet igen som rigtige endpoints i Del 2 (`DELETE /messages`) og kan gøre det samme for `/answers`, hvis du får brug for det. Har du lavet `/debug`- og `/debug/:name`-routes (ekstraopgave 20), kan de roligt blive stående — de bruger `response.send()`, ikke `response.render()` eller `redirect()`, og er derfor upåvirket af omlægningen.

#### Test trin 4

Genstart serveren. Send `GET http://localhost:3000/` i Thunder Client. Du får `Cannot GET /` — det er forventet, der er ikke længere nogen side på roden af API'et. Har du haft `/clear-messages` eller `/clear-stats`, så send også en `POST` til dem — du skal nu få `Cannot POST /clear-messages` (eller `-stats`), fordi routen er slettet, ikke en fejl om en manglende `GET /`.

## Tjekpunkt: Del 1

Del 1 er gennemført, når:

- projektet er delt i `client/` og `server/`
- serveren starter uden fejl fra `server/`-mappen, uden EJS, `express.static()` eller `express.urlencoded()`
- `express.json()` er tilføjet
- de gamle `GET /` og `POST /ask`-routes er fjernet, samt `/clear-messages`/`/clear-stats`, hvis du havde dem

---

## Del 2: REST API for /messages

```text
GET    /messages   -> loadMessages()                                        -> response.json(messages)
POST   /messages   -> loadMessages() -> findBestAnswer() -> saveMessages()  -> response.json({ question, answer })
DELETE /messages   -> saveMessages([])                                      -> response.send()
```

`/messages` får kun disse tre endpoints — ikke fuld CRUD. En besked i en samtale er ikke noget, man normalt retter eller sletter enkeltvis; hele pointen er historikken som helhed. Det er en gyldig REST-beslutning i sig selv: en ressource skal kun have de operationer, den faktisk giver mening at udføre.

### 5. GET /messages: hele historikken

```js
app.get("/messages", async (request, response) => {
  const messages = await loadMessages();

  response.json(messages);
});
```

#### Test trin 5

Send `GET http://localhost:3000/messages` i Thunder Client. Du skal se din eksisterende historik fra øvelse 5 (eller et tomt array, hvis du ikke har spurgt om noget endnu) — som JSON, ikke HTML.

---

### 6. POST /messages: valider spørgsmålet

Du kender allerede denne validering fra øvelse 3 — kun formen for svaret ændrer sig: fra en fejltekst i EJS til et JSON-svar.

> **Nyt i forhold til øvelse 3:** `?? ""`, før `.trim()` kaldes. I øvelse 3 sendte HTML-formularen altid feltet `question`, selv som en tom streng. I Thunder Client kan du nemt glemme `question`-nøglen helt, og så er `request.body.question` `undefined` — `undefined.trim()` ville crashe serveren med en 500-fejl, i stedet for at give jer den pæne fejlbesked, I bygger her. `?? ""` sikrer, at I altid har en streng at kalde `.trim()` på.

```js
app.post("/messages", async (request, response) => {
  const messages = await loadMessages();
  const question = (request.body.question ?? "").trim();

  // TODO: Hvis question er tom, send fejlen som JSON i stedet for at rendere index igen,
  // fx response.json({ error: "Skriv et spørgsmål, før du sender." }), og stop routen med return.

  response.json({ received: question });
});
```

<details>
<summary>Hint</summary>

```text
if (!question) {
  response.json({ error: "..." })
  return
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
app.post("/messages", async (request, response) => {
  const messages = await loadMessages();
  const question = (request.body.question ?? "").trim();

  if (!question) {
    response.json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  response.json({ received: question });
});
```

</details>

#### Test trin 6

Send `POST http://localhost:3000/messages` med body `{ "question": "" }` — du skal få fejlbeskeden tilbage som JSON. Send derefter med et rigtigt spørgsmål, fx `{ "question": "Hvad hedder du?" }` — du skal få `{ "received": "Hvad hedder du?" }` tilbage.

Send til sidst en `POST` helt uden body (eller med `{}`). Du skal stadig få fejlbeskeden tilbage som JSON — ikke en 500-fejl i terminalen.

---

### 7. POST /messages: opret og gem spørgsmålsbeskeden

Byg videre på routen ét skridt ad gangen. Start med kun spørgsmålet — svaret følger i næste trin:

```js
app.post("/messages", async (request, response) => {
  const messages = await loadMessages();
  const question = (request.body.question ?? "").trim();

  if (!question) {
    response.json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  // TODO: Opret en spørgsmål-besked, { type: "question", text: question, createdAt: new Date().toISOString() }, og tilføj den til messages.

  // TODO: Gem den opdaterede liste med saveMessages(messages).

  // TODO: Send den nye spørgsmål-besked som JSON, indtil videre.
});
```

<details>
<summary>Hint</summary>

```text
message = { type: "question", text: question, createdAt: new Date().toISOString() }
messages.push(message)

await saveMessages(messages)
response.json(message)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
app.post("/messages", async (request, response) => {
  const messages = await loadMessages();
  const question = (request.body.question ?? "").trim();

  if (!question) {
    response.json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  const message = { type: "question", text: question, createdAt: new Date().toISOString() };
  messages.push(message);

  await saveMessages(messages);

  response.json(message);
});
```

> **Nyt: `createdAt`.** Hver besked får nu et tidsstempel for, hvornår den blev oprettet — almindeligt for en REST-ressource, og noget du kan sortere eller filtrere på senere (RACE 6). `new Date().toISOString()` giver en tekststreng, fx `"2026-09-15T10:32:00.000Z"` — ikke et rent `Date`-objekt. Det er bevidst: et `Date`-objekt overlever ikke turen gennem `JSON.stringify()`/`JSON.parse()` (som `saveMessages()`/`loadMessages()` bruger) som andet end præcis sådan en tekststreng, så du kan lige så godt oprette den som streng med det samme. Har du allerede `createdAt` fra ekstraopgave 19 i øvelse 3, er det denne detalje, der er ny.

</details>

#### Test trin 7

Send `POST http://localhost:3000/messages` med et rigtigt spørgsmål. Du skal få spørgsmål-beskeden tilbage som JSON, med et `createdAt`-tidsstempel — endnu uden svar. Send derefter `GET /messages`, og bekræft at spørgsmålet er gemt i historikken. Der er endnu ikke noget svar med — det er forventet, indtil næste trin.

---

### 8. POST /messages: find svaret, og fuldfør oprettelsen

Byg videre på routen fra trin 7. Genbrug din egen svarfunktion fra øvelse 3/4 (`findAnswer()` eller `findBestAnswer()`) — den skal ikke ændres:

```js
app.post("/messages", async (request, response) => {
  const messages = await loadMessages();
  const question = (request.body.question ?? "").trim();

  if (!question) {
    response.json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  const message = { type: "question", text: question, createdAt: new Date().toISOString() };
  messages.push(message);

  // TODO: Find svaret med din egen svarfunktion, fx findBestAnswer(question).
  // TODO: Opret en svar-besked, { type: "answer", text: ..., createdAt: new Date().toISOString() }, og tilføj den til messages.

  await saveMessages(messages);

  // TODO: Ret svaret, så det sender BÅDE spørgsmål og svar som JSON,
  // fx { question: message, answer: answerMessage }.
});
```

<details>
<summary>Hint</summary>

```text
result = findBestAnswer(question)   // eller findAnswer(question), afhængigt af din egen kode
answerMessage = { type: "answer", text: result.answer ?? result, createdAt: new Date().toISOString() }
messages.push(answerMessage)

response.json({ question: message, answer: answerMessage })
```

</details>

<details>
<summary>Se løsningsforslag (med findBestAnswer, der returnerer { answer, category })</summary>

```js
app.post("/messages", async (request, response) => {
  const messages = await loadMessages();
  const question = (request.body.question ?? "").trim();

  if (!question) {
    response.json({ error: "Skriv et spørgsmål, før du sender." });
    return;
  }

  const message = { type: "question", text: question, createdAt: new Date().toISOString() };
  messages.push(message);

  const result = findBestAnswer(question);
  const answerMessage = { type: "answer", text: result.answer, createdAt: new Date().toISOString() };
  messages.push(answerMessage);

  await saveMessages(messages);

  response.json({ question: message, answer: answerMessage });
});
```

> Har din `findBestAnswer()` (eller `findAnswer()`) en anden returværdi — fx bare en tekst i stedet for `{ answer, category }` — så brug den værdi direkte som `answerMessage.text`. Har du `topicStats`, opdaterer og gemmer du den her, præcis som du gjorde i øvelse 4/5, lige efter du har fundet `result`.

</details>

#### Test trin 8

Send `POST http://localhost:3000/messages` med et rigtigt spørgsmål. Du skal nu få både `question` og `answer` tilbage som JSON. Send derefter `GET /messages`, og bekræft at begge de nye beskeder er kommet med, i den rigtige rækkefølge.

Genstart serveren, og send `GET /messages` igen. Er beskederne stadig der? Læg mærke til, at du ikke har skrevet en eneste ny linje persistens-kode i denne del — `loadMessages()`/`saveMessages()` er uændrede fra øvelse 5.

---

### 9. DELETE /messages: ryd historikken

Dette er den samme handling som "Ryd beskeder"-knappen fra øvelse 3, bare som et rigtigt DELETE-endpoint i stedet for en formular med redirect:

```js
app.delete("/messages", async (request, response) => {
  await saveMessages([]);

  response.send();
});
```

#### Test trin 9

Send `DELETE http://localhost:3000/messages`. Send derefter `GET /messages`, og bekræft at historikken er tom.

---

### 10. Test hele messages-flowet

1. `GET /messages` — notér, hvor mange beskeder der er.
2. `POST /messages` med et spørgsmål — bekræft svar på både spørgsmål og svar.
3. `POST /messages` med endnu et spørgsmål.
4. `GET /messages` — er der fire flere beskeder end i punkt 1?
5. `DELETE /messages`.
6. `GET /messages` — er historikken tom?

## Tjekpunkt: Del 2

Del 2 er gennemført, når API'et:

- returnerer hele historikken med `GET /messages`
- afviser et tomt spørgsmål med en fejl som JSON
- opretter spørgsmål og svar med `POST /messages`, og gemmer dem med `saveMessages()`
- rydder historikken med `DELETE /messages`

---

## Del 3: REST API for /answers

```text
GET    /answers            -> response.json(answers)
GET    /answers/:category  -> find()   -> response.json(answerRule)
POST   /answers            -> push()   -> response.json(newAnswerRule)
PUT    /answers/:category  -> find()   -> response.json(answerRule)
DELETE /answers/:category  -> filter() -> response.send()
```

I modsætning til `/messages` giver `/answers` god mening at give fuld CRUD: en svarregel er noget, du reelt vil oprette, rette og slette over tid, uden at skulle redigere kildekoden og genstarte serveren hver gang.

> **Nyt: identifikatoren er ikke et tal.** I `/students` og REST API-øvelsen brugte du et numerisk `id`, genereret af serveren med `Date.now()`. Her har hver regel allerede en unik `category` (fra øvelse 4), fx `"navn"` eller `"bosted"` — så du bruger den direkte som identifikator i URL'en, i stedet for at opfinde et nyt id. En REST-ressource kan identificeres af hvilket som helst unikt felt, ikke kun et autogenereret tal. Det betyder også, at du **ikke** skal bruge `Number()` her — `category` er en string i begge ender af sammenligningen.

Denne del holdes i memory, ligesom Del 1 i REST API-øvelsen med studerende — ændringer forsvinder ved en genstart. Det kan I rette i en senere øvelse, med samme mønster som `loadMessages()`/`saveMessages()`.

**Har du lavet ekstraopgave 13 fra øvelse 4 (flyttet `answers` til sit eget modul, `data/answers.js`)?** Så skal `answers` konverteres fra et JavaScript-modul til almindelig data, ligesom `messages` allerede er det. Omdøb filen til `data/answers.json`, fjern `export const answers =`, og behold kun selve arrayet — som gyldig JSON, altså med dobbelte anførselstegn og ingen kommentarer. Fjern derefter `import { answers } from "./data/answers.js"` i `server.js`, og tilføj i stedet, øverst i filen — under din eksisterende `import fs from "node:fs/promises";` fra øvelse 5, ikke som en ny kopi af den:

```js
let answers = JSON.parse(await fs.readFile("./data/answers.json", "utf8"));
```

> Grunden: en importeret binding (`import { answers } from ...`) kan du kun mutere — `push()`, ændre en regels felter — ikke gentildele. `DELETE /answers/:category` i trin 16 gentildeler selve `answers` med `filter()`, og det kræver, at `answers` er en almindelig `let`-variabel i `server.js`, ikke en importeret `const`. Læg mærke til `await` uden for en `async`-funktion — det kaldes top-level await, og virker øverst i en fil, fordi `"type": "module"` i din `package.json` allerede gør `server.js` til et JavaScript-modul. Bemærk desuden, at denne linje kun læser filen én gang, når serveren starter — ikke ved hvert request, som `loadMessages()` gør. Det er samtidig et fint forspring til den senere øvelse, hvor `/answers` får sin egen persistens med `loadAnswers()`/`saveAnswers()`, i samme mønster som `messages`.

> **Har du lavet ekstraopgave 17 fra øvelse 3 (flere svarmuligheder)?** Så hedder feltet `answers` (et array), ikke `answer` (en string), i alle dine regler. Koden herunder bruger `answer` — skriv `request.body.answers`/`answerRule.answers` i stedet, konsekvent gennem hele Del 3, hvis det er dit feltnavn. De to felter fungerer ens i denne del; det er kun navnet, der skal matche din egen `findBestAnswer()`.

### 11. GET /answers: alle regler

```js
app.get("/answers", (request, response) => {
  response.json(answers);
});
```

#### Test trin 11

Send `GET http://localhost:3000/answers`. Du skal se dine egne svarregler som JSON, med `category`, `keywords` og dit svar-felt.

---

### 12. GET /answers/:category: find én regel

```js
app.get("/answers/:category", (request, response) => {
  // TODO: Find reglen i answers, hvor category matcher request.params.category.
  // Denne gang skal du IKKE bruge Number() — begge sider er allerede strings.

  // TODO: Send den fundne regel som JSON.
});
```

<details>
<summary>Hint</summary>

```text
answerRule = answers.find(a => a.category === request.params.category)
response.json(answerRule)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
app.get("/answers/:category", (request, response) => {
  const answerRule = answers.find((a) => a.category === request.params.category);

  response.json(answerRule);
});
```

</details>

#### Test trin 12

Send `GET /answers/navn` (eller en af dine egne kategorier). Du skal få den rigtige regel. Prøv også en kategori, der ikke findes — du skal få `null`, ligesom med et ukendt id i studerende-øvelsen.

---

### 13. POST /answers: opret en ny regel

Denne gang genererer serveren ikke selv en identifikator — klienten sender `category` med i body'en, fordi det giver mening at vælge et meningsfuldt navn til en ny regel, i stedet for et tilfældigt tal:

```js
app.post("/answers", (request, response) => {
  // TODO: Opret et nyt regel-objekt ud fra request.body.category, request.body.keywords og request.body.answer.

  // TODO: Tilføj den til answers med push().

  // TODO: Send den nye regel som JSON.
});
```

<details>
<summary>Hint</summary>

```text
newAnswerRule = { category: ..., keywords: ..., answer: ... }
answers.push(newAnswerRule)
response.json(newAnswerRule)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
app.post("/answers", (request, response) => {
  const newAnswerRule = {
    category: request.body.category,
    keywords: request.body.keywords,
    answer: request.body.answer
  };

  answers.push(newAnswerRule);

  response.json(newAnswerRule);
});
```

</details>

#### Test trin 13

Send i Thunder Client:

```text
POST http://localhost:3000/answers
Body (JSON):
{
  "category": "mad",
  "keywords": ["mad", "spise", "livret"],
  "answer": "Min livret er lasagne."
}
```

Bekræft med `GET /answers`, at den nye regel er der. Test derefter, at den rent faktisk virker: send `POST /messages` med et spørgsmål, der matcher dine nye nøgleord (fx `"Hvad er din livret?"`), og bekræft at AMAbotten bruger det nye svar.

---

### 14. PUT /answers/:category: find reglen

PUT bygges i to trin, ligesom i studerende-øvelsen. Start med kun at finde reglen — uden at ændre noget endnu:

```js
app.put("/answers/:category", (request, response) => {
  // TODO: Find reglen, ligesom i GET /answers/:category.

  // TODO: Send den fundne regel som JSON — uændret, indtil videre.
});
```

<details>
<summary>Hint</summary>

Genbrug præcis samme kode som i GET /answers/:category.

</details>

#### Test trin 14

Send `PUT /answers/mad` (eller en af dine egne kategorier), uden body. Du skal få reglen tilbage, uændret.

---

### 15. PUT /answers/:category: opdater reglen

Byg videre på routen fra trin 14:

```js
app.put("/answers/:category", (request, response) => {
  const answerRule = answers.find((a) => a.category === request.params.category);

  // TODO: Opdater answerRule.keywords og answerRule.answer med værdierne fra request.body.

  // TODO: Send den opdaterede regel som JSON.
});
```

<details>
<summary>Hint</summary>

```text
answerRule.keywords = request.body.keywords
answerRule.answer = request.body.answer
response.json(answerRule)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
app.put("/answers/:category", (request, response) => {
  const answerRule = answers.find((a) => a.category === request.params.category);

  answerRule.keywords = request.body.keywords;
  answerRule.answer = request.body.answer;

  response.json(answerRule);
});
```

> Læg mærke til, at `category` selv ikke ændres i denne route — den bruges til at finde reglen, ikke til at omdøbe den. At skifte identifikator via en almindelig opdatering ville gøre reglen umulig at finde igen på den gamle URL.

</details>

#### Test trin 15

Send `PUT /answers/mad` med et opdateret svar. Bekræft ændringen i responsen. Spørg derefter AMAbotten igen via `POST /messages`, og bekræft at den nu bruger det opdaterede svar.

---

### 16. DELETE /answers/:category: slet en regel

Brug `filter()`, ligesom i studerende-øvelsen. Husk at `answers` derfor skal være erklæret med `let`, ikke `const`, hvis den ikke allerede er det:

```js
app.delete("/answers/:category", (request, response) => {
  // TODO: Fjern reglen fra answers, hvor category matcher request.params.category, med filter().

  response.send();
});
```

<details>
<summary>Hint</summary>

```text
answers = answers.filter(a => a.category !== request.params.category)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
app.delete("/answers/:category", (request, response) => {
  answers = answers.filter((a) => a.category !== request.params.category);

  response.send();
});
```

</details>

#### Test trin 16

Slet `mad`-reglen igen. Bekræft med `GET /answers`, at den er væk. Spørg AMAbotten om livretten igen — hvilket svar får du nu?

---

### 17. Test hele answers-flowet

1. `GET /answers` — notér antallet af regler.
2. `POST /answers` — opret en ny regel.
3. `GET /answers` — er der én mere end i punkt 1?
4. `GET /answers/:category` med den nye kategori.
5. `PUT /answers/:category` — ret svaret, og bekræft ændringen.
6. `DELETE /answers/:category`.
7. `GET /answers` — er du tilbage på antallet fra punkt 1?
8. Opret endnu en regel med `POST /answers`, og genstart derefter serveren. Send `GET /answers` igen — er den regel her stadig, eller er du tilbage på antallet fra punkt 1? Sammenlign med `GET /messages` fra trin 8 i Del 2, som beholdt sine ændringer efter en genstart. Hvorfor er der forskel?

## Tjekpunkt: Del 3

Del 3 er gennemført, når API'et:

- returnerer alle regler med `GET /answers`
- returnerer én regel med `GET /answers/:category`
- opretter en ny regel med `POST /answers`
- opdaterer en regel med `PUT /answers/:category`
- sletter en regel med `DELETE /answers/:category`
- rent faktisk bruger de opdaterede/nye/slettede regler, når du spørger via `POST /messages`

---

## Reflektér over din læring

Når du er færdig, skal du gerne kunne forklare:

1. Hvorfor har `/messages` ikke fuld CRUD, mens `/answers` har? Hvad afgør, hvilke operationer en ressource skal have?
2. Hvorfor bruger `/answers/:category` ikke `Number()`, når `/students/:id` og `/messages` (havde de haft et id) ville have gjort det?
3. Hvorfor genererer serveren et id i `POST /students`, men ikke i `POST /answers`?
4. Hvor meget af din eksisterende svarlogik (`findBestAnswer()`/`findAnswer()`, `loadMessages()`, `saveMessages()`) skulle du ændre, for at gøre AMAbotten til et REST API? Hvad fortæller det dig om forholdet mellem forretningslogik og den måde, den bliver præsenteret på (HTML vs. JSON)?
5. Hvad skete der med dine `/answers`-ændringer, sidst du genstartede serveren? Hvorfor, og hvordan ville du rette det?
6. Hvordan hænger `client/`- og `server/`-mapperne sammen med det, du snart skal bruge `fetch()` til?

## Videre

Din AMAbot er nu et rent REST API — samme regler, samme svarlogik, samme historik, men uden en eneste linje HTML fra serveren. `client/`-mappen venter stadig på sit indhold: i DOB 5 bygger du en rigtig frontend, der bruger `fetch()` til at tale med præcis de endpoints, du lige har bygget. I RACE 6 arbejder du videre med selve API'ets struktur — routes, controllers og data i separate filer — og statuskoder og fejlhåndtering for både `/messages` og `/answers` venter i en senere øvelse. Persistens for `/answers`, så dine ændringer overlever en genstart, er et oplagt næste skridt, når du er klar til det, med præcis samme mønster som `loadMessages()`/`saveMessages()`.
