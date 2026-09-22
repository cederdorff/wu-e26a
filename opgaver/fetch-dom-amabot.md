# Øvelse 8: AMAbotten får en frontend — fetch og DOM

## Kort fortalt

Du bygger videre på din egen AMAbot fra [øvelse 6](express-rest-api-amabot.md) (og [øvelse 7](express-rest-api-amabot-arkitektur.md), hvis du har lavet den). `client/`-mappen har ligget urørt siden øvelse 6 — den indeholder stadig `index.html` med gamle EJS-tags, som ikke virker. Det retter du op på nu: du gør den til en rigtig, statisk side, der taler med dit REST API via `fetch()`, ligesom du har øvet i [DOB 5](../undervisning/019-dob-5-fetch-og-async-javascript-18-09-2026.md) og [DOB 6](../undervisning/021-dob-6-promises-og-async-await-22-09-2026.md).

Øvelsen er delt i fire dele:

- **Del 1** gør `client/index.html` til en almindelig statisk side, og server den med Live Server-udvidelsen — adskilt fra dit API.
- **Del 2** henter og viser den eksisterende samtalehistorik, når siden loader (`GET /messages`).
- **Del 3** opfanger formularens submit i browseren, og sender nye spørgsmål uden at genindlæse siden (`POST /messages`).
- **Del 4** genopliver "Ryd beskeder"-knappen med et rigtigt `DELETE /messages`-kald.

```text
Browser (client/index.js)          Server (server/server.js)
http://127.0.0.1:5500              http://localhost:3000
DOM event (submit/click)
   -> fetch(API_URL + ...)  --JSON-->   route (/messages)
   <- response.json()       <-JSON--    loadMessages()/findBestAnswer()/saveMessages()
DOM opdateres
```

> **To servere, to origins.** `client/index.html` åbner du med Live Server-udvidelsen (typisk `http://127.0.0.1:5500`), mens dit Express-API kører for sig selv med `npm run dev` (`http://localhost:3000`). Det er to forskellige origins — så du støder på en rigtig CORS-fejl i Del 2, første gang du kalder `fetch()` på tværs af dem. Det er ikke en fejl i din kode; det er browseren, der beskytter brugeren mod uautoriserede cross-origin requests. Du fikser den i denne øvelse med den simplest mulige rettelse; en mere præcis afgrænsning af, hvem der egentlig må kalde dit API, venter til [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md).

> Statuskoder og ordentlig fejlhåndtering — både i routen og i `fetch()` — venter stadig til en senere øvelse. I dag fokuserer du udelukkende på den lykkelige vej: et gyldigt spørgsmål, et svar, en opdateret side.

---

## Del 1: Gør client/index.html statisk, og start den med Live Server

### 1. Gem udgangspunktet i Git

```bash
git add .
git commit -m "Save AMAbot before building the client"
git push
```

---

### 2. Ryd client/index.html for EJS

Åbn `client/index.html`. Den indeholder stadig `<%= %>`- og `<% %>`-tags fra dengang, den var `views/index.ejs` — de bliver aldrig udført af nogen server mere.

- Fjern selve EJS-loopet, der viste beskeder (`<% for (const message of messages) { %> ... <% } %>`), men behold elementet, det stod inde i — gør det til en **tom** container med et id, fx:

  ```html
  <section id="messages"></section>
  ```

- Fjern EJS-tjekket for fejlbeskeden (`<% if (error) { %> ... <% } %>`) helt for nu — I bygger ikke fejlhåndtering i denne øvelse.
- Giv din formular et id, fx `id="question-form"`. `method` og `action` betyder ikke længere noget — du opfanger submittet med JavaScript i stedet — men det er fint at lade dem stå.
- Har du en "Ryd beskeder"-knap fra øvelse 3 (ekstraopgave 18)? Fjern `<form method="POST" action="/clear-messages">` omkring den, men behold selv knappen, og giv den et id, fx `id="clear-messages-button"`. Har du den ikke, så tilføj en nu, uden for spørgsmål-formularen:

  ```html
  <button type="button" id="clear-messages-button">Ryd beskeder</button>
  ```

#### Test trin 2

Åbn `client/index.html` direkte i browseren (dobbeltklik). Siden skal vise dit layout, uden nogen synlig `<%= %>`-tekst noget sted, og med en tom besked-container. Det er kun et midlertidigt, visuelt tjek — den rigtige server kommer i næste trin.

---

### 3. Start client/index.html med Live Server

Installer VS Codes **Live Server**-udvidelse (af Ritwick Dey), hvis du ikke allerede har den. Højreklik derefter på `client/index.html`, og vælg **Open with Live Server**.

> Live Server starter sin egen lille statiske webserver, typisk på `http://127.0.0.1:5500`, og genindlæser automatisk siden, hver gang du gemmer en ændring. Det er en **anden** server end dit Express-API. Fra nu af holder du to servere kørende samtidig: `npm run dev` i `server/` (API'et, port 3000) og Live Server (`client/`, port 5500) — hver i sin egen terminal/fane.

#### Test trin 3

Bekræft i adresselinjen, at siden nu kører på `http://127.0.0.1:5500` (eller den port, Live Server valgte) — ikke en `file://`-sti. Bekræft samtidig, at din API-server stadig kører for sig selv på `http://localhost:3000`.

---

### 4. Opret client/index.js, og forbind den til siden

```html
<script src="index.js" defer></script>
```

Placér linjen i `<head>`. `defer` sikrer, at scriptet først kører, når HTML'en er færdigindlæst — ligesom I gennemgik i [DOB 4](../undervisning/016-dob-4-dom-manipulation-med-js-15-09-2026.md) — så du er sikker på, at `#messages`, formularen og knappen findes, når din kode leder efter dem.

Opret den tomme fil `client/index.js`, og skriv midlertidigt:

```js
console.log("index.js er forbundet");
```

#### Test trin 4

Genindlæs siden i Live Server, åbn DevTools' konsol, og bekræft at teksten vises. Fjern loggen igen, når du har set den.

---

### 5. Hent dine DOM-elementer

Øverst i `client/index.js`, over al anden kode:

```js
const messagesContainer = document.querySelector("#messages");
const questionForm = document.querySelector("#question-form");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear-messages-button");
```

> Match id'erne med dem, du selv satte i trin 2 — hedder dine elementer noget andet, så ret variablerne herefter, ikke selectorerne.

#### Test trin 5

Tilføj midlertidigt `console.log(messagesContainer, questionForm, questionInput, clearMessagesButton);` under de fire linjer. Genindlæs siden — ingen af de fire må logges som `null`. Er én `null`, passer id'et i JavaScript ikke med id'et i HTML. Fjern loggen igen.

## Tjekpunkt: Del 1

Del 1 er gennemført, når:

- `client/index.html` ikke længere indeholder EJS-tags
- Live Server viser din side (fx `http://127.0.0.1:5500`), mens din API-server kører samtidig på `http://localhost:3000`
- `client/index.js` er forbundet, og alle fire DOM-referencer finder deres element

---

## Del 2: Vis samtalehistorikken ved load

```text
GET /messages -> response.json(messages) -> ét <article> pr. besked i #messages
```

### 6. Skriv en funktion, der laver ét besked-element

```js
function createMessageElement(message) {
  // TODO: Opret et <article>-element med document.createElement().
  // TODO: Sæt dets class til message.type ("question" eller "answer") — det er den samme klasse, din CSS fra øvelse 3 allerede styler.
  // TODO: Opret et <p>-element, og sæt dets textContent til message.text.
  // TODO: Sæt <p> ind i <article> med appendChild(), og returnér <article>.
}
```

<details>
<summary>Hint</summary>

```text
article = document.createElement("article")
article.className = message.type

paragraph = document.createElement("p")
paragraph.textContent = message.text

article.appendChild(paragraph)
return article
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
function createMessageElement(message) {
  const article = document.createElement("article");
  article.className = message.type;

  const paragraph = document.createElement("p");
  paragraph.textContent = message.text;

  article.appendChild(paragraph);

  return article;
}
```

> **`textContent`, ikke `innerHTML`.** `textContent` skriver `message.text` som ren tekst — akkurat som EJS' `<%= %>` escapede værdier tidligere. `innerHTML` ville i stedet tolke teksten som HTML, hvilket er en direkte åbning for XSS, hvis en bruger nogensinde kan skrive i et spørgsmål eller svar. Samme princip som saneringsafsnittet i øvelse 3, bare i browseren i stedet for på serveren.

</details>

#### Test trin 6

Kald midlertidigt funktionen direkte: `console.log(createMessageElement({ type: "question", text: "Test" }));`. Konsollen skal vise et `<article class="question"><p>Test</p></article>`-element. Fjern kaldet igen.

---

### 7. Hent historikken, og vis den

Din side kører nu på en anden origin end API'et (Live Server vs. Express), så et relativt kald som `fetch("/messages")` ville gå til Live Server selv, ikke dit API. Definér derfor API'ets fulde adresse øverst i `client/index.js`, sammen med dine andre konstanter:

```js
const API_URL = "http://localhost:3000";
```

Brug den i alle dine `fetch()`-kald fremover, fx `` `${API_URL}/messages` ``:

```js
async function loadMessages() {
  // TODO: Hent `${API_URL}/messages` med fetch(), og await response.json() for at få messages-arrayet.
  // TODO: Kør igennem messages med en for...of, og tilføj hvert element til messagesContainer med appendChild(createMessageElement(message)).
}

loadMessages();
```

<details>
<summary>Hint</summary>

```text
response = await fetch(`${API_URL}/messages`)
messages = await response.json()

for (const message of messages) {
  messagesContainer.appendChild(createMessageElement(message))
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
async function loadMessages() {
  const response = await fetch(`${API_URL}/messages`);
  const messages = await response.json();

  for (const message of messages) {
    messagesContainer.appendChild(createMessageElement(message));
  }
}

loadMessages();
```

> **`async`/`await` i stedet for `.then()`.** `fetch()` returnerer et promise — `await` sætter funktionen på pause, indtil requesten er færdig, uden at blokere resten af siden. `loadMessages()` selv skal derfor erklæres `async`, men kaldet nederst, `loadMessages();`, venter ikke på den — den kører bare i baggrunden, så snart siden er klar.

</details>

#### Test trin 7

Genindlæs siden i Live Server, og åbn DevTools' konsol. Du skal se en fejl i stil med:

```text
Access to fetch at 'http://localhost:3000/messages' from origin 'http://127.0.0.1:5500'
has been blocked by CORS policy...
```

Det er **forventet** — ikke en fejl i din kode. Ingen beskeder vises endnu. Det retter du i næste trin.

---

### 8. Fiks CORS-fejlen på serveren

Installer `cors`-pakken i `server/`:

```bash
npm install cors
```

Tilføj den derefter i `server/server.js`, sammen med din anden middleware, **før** dine routes:

```js
import cors from "cors";

app.use(cors());
```

<details>
<summary>Hvorfor virker det?</summary>

`app.use(cors())` uden argumenter tilføjer de HTTP-headers (bl.a. `Access-Control-Allow-Origin`), som fortæller browseren, at det er OK for en side på en anden origin at læse svaret — den tillader i praksis **alle** origins. Det er den simplest mulige rettelse, og fin, mens du udvikler lokalt. At begrænse den til kun jeres egen frontend er en sikkerhedsovervejelse, I tager fat på i [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md).

</details>

#### Test trin 8

Genstart serveren, og genindlæs siden i Live Server igen. CORS-fejlen skal være væk fra konsollen. Har du spurgt AMAbotten om noget tidligere (fra Thunder Client-test i øvelse 6/7), skal den historik nu stå på siden, med den styling `.question`/`.answer` allerede har fra øvelse 3. Åbn DevTools' Network-fane, og bekræft at `GET /messages`-kaldet nu returnerer status `200`.

## Tjekpunkt: Del 2

Del 2 er gennemført, når hele din eksisterende samtalehistorik vises på siden, med korrekt styling, hver gang du genindlæser siden i Live Server — uden CORS-fejl i konsollen.

---

## Del 3: Send et nyt spørgsmål uden at genindlæse siden

```text
submit -> preventDefault() -> POST /messages -> { question, answer } -> to nye <article>-elementer
```

### 9. Opfang formularens submit

```js
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (!question) {
    return;
  }

  // Trin 10 fortsætter her
});
```

> **`event.preventDefault()`.** Uden denne linje gør formularen, hvad den altid har gjort: sender en almindelig request og genindlæser siden — præcis den opførsel, `fetch()` skal overtage. Det er den samme "intercept formularen"-teknik, dagens undervisning (DOB 6) handlede om.

#### Test trin 9

Sæt midlertidigt `console.log(question);` ind, hvor kommentaren står. Indsend formularen med et spørgsmål skrevet — konsollen skal vise teksten, og siden må **ikke** genindlæse (ingen blink, ingen ny URL). Fjern loggen igen.

---

### 10. Send spørgsmålet, og vis svaret

Byg videre på event listeneren fra trin 9:

```js
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (!question) {
    return;
  }

  // TODO: Send et POST-kald til `${API_URL}/messages` med fetch(). Husk:
  //   - method: "POST"
  //   - headers: { "Content-Type": "application/json" }
  //   - body: JSON.stringify({ question })

  // TODO: await response.json() for at få { question, answer } tilbage.

  // TODO: Tilføj både data.question og data.answer til messagesContainer med createMessageElement() fra trin 6.

  // TODO: Ryd inputfeltet, questionInput.value = "", så det er klar til næste spørgsmål.
});
```

<details>
<summary>Hint</summary>

```text
response = await fetch(`${API_URL}/messages`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question })
})

data = await response.json()

messagesContainer.appendChild(createMessageElement(data.question))
messagesContainer.appendChild(createMessageElement(data.answer))

questionInput.value = ""
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  if (!question) {
    return;
  }

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();

  messagesContainer.appendChild(createMessageElement(data.question));
  messagesContainer.appendChild(createMessageElement(data.answer));

  questionInput.value = "";
});
```

> **`headers` og `body` hører sammen.** `JSON.stringify({ question })` laver JavaScript-objektet om til en JSON-tekststreng — det er den, der ryger i `body`. `"Content-Type": "application/json"` fortæller serveren, at teksten skal tolkes som JSON. Uden headeren læser `express.json()`-middlewaren på serveren ikke `request.body` korrekt, og `request.body.question` bliver `undefined`. Det er nøjagtig den samme aftale mellem klient og server, som `name="question"` og `express.urlencoded()` var i øvelse 3 — bare med JSON i stedet for en HTML-formular.

</details>

#### Test trin 10

Skriv et rigtigt spørgsmål i formularen, og send den. Uden at siden genindlæser, skal både dit spørgsmål og AMAbottens svar dukke op i `#messages`, med samme styling som resten af historikken, og inputfeltet skal være tomt bagefter. Genindlæs siden bagefter, og bekræft at begge nye beskeder stadig er der — de kom jo fra `saveMessages()` på serveren.

## Tjekpunkt: Del 3

Del 3 er gennemført, når du kan stille AMAbotten et spørgsmål gennem formularen, og se både spørgsmål og svar dukke op på siden med det samme, uden en eneste genindlæsning.

---

## Del 4: Ryd beskeder med et rigtigt DELETE-kald

### 11. Forbind "Ryd beskeder"-knappen

```js
clearMessagesButton.addEventListener("click", async () => {
  // TODO: Send et DELETE-kald til `${API_URL}/messages` med fetch().
  // TODO: Tøm messagesContainer for indhold, fx messagesContainer.innerHTML = "".
});
```

<details>
<summary>Hint</summary>

```text
await fetch(`${API_URL}/messages`, { method: "DELETE" })
messagesContainer.innerHTML = ""
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
clearMessagesButton.addEventListener("click", async () => {
  await fetch(`${API_URL}/messages`, { method: "DELETE" });
  messagesContainer.innerHTML = "";
});
```

> `messagesContainer.innerHTML = ""` er trygt at bruge her, fordi du selv sætter den tomme streng — det er ikke brugerdata, der indsættes som HTML (modsat trin 6, hvor `textContent` var vigtig for `message.text`).

</details>

#### Test trin 11

Klik på "Ryd beskeder". Historikken skal forsvinde fra siden med det samme. Genindlæs siden bagefter, og bekræft at historikken forbliver tom — `DELETE /messages` har jo også ryddet `data/messages.json` på serveren.

## Tjekpunkt: Del 4

Del 4 er gennemført, når "Ryd beskeder"-knappen rydder både siden og den gemte historik på serveren.

---

## Tjekpunkt

Øvelsen er gennemført, når din AMAbot:

- viser sin fulde samtalehistorik ved load, hentet med `fetch()` fra `GET /messages`
- lader dig stille et nyt spørgsmål gennem formularen, uden at siden genindlæser
- viser både spørgsmål og svar på siden, med det samme svaret kommer tilbage fra `POST /messages`
- kan rydde historikken, både på siden og på serveren, med `DELETE /messages`
- kører på sin egen origin via Live Server, adskilt fra API'et, uden CORS-fejl i konsollen

---

## Reflektér over din læring

1. Hvad gjorde `views/index.ejs` i øvelse 3, som `client/index.js` nu gør i stedet? Hvad er den samme opgave løst to forskellige steder — serveren dengang, browseren nu?
2. Hvad betyder "origin" helt konkret for `client/`'et og `server/`'et i denne øvelse? Hvorfor blokerede browseren requesten, før du tilføjede `cors()`?
3. `app.use(cors())` uden argumenter tillader alle origins. Hvad tror du, der ville ske, hvis en helt andens hjemmeside prøvede at kalde dit API lige nu — og hvorfor er det noget, RACE 7 tager fat på?
4. `event.preventDefault()` i trin 9 — hvad ville der ske, hvis du fjernede den linje igen? Prøv det, og beskriv, hvad du ser.
5. Hvor i din kode bruger du `textContent`, og hvor (om noget sted) bruger du `innerHTML`? Hvorfor er valget mellem dem ikke ligegyldigt?
6. Peg på ét sted, hvor du bruger `await`. Hvad ville koden gøre forkert, hvis du glemte det ord der?

## Videre

Din AMAbot har nu en rigtig frontend: `client/index.js` taler med dit REST API via `fetch()`, kører på sin egen origin med Live Server, og opdaterer DOM'en direkte i browseren, uden en eneste server-genereret HTML-side. Du har allerede mødt og løst en rigtig CORS-fejl undervejs — men lige nu antager koden ellers, at alt går godt: intet tjekker, om `fetch()` fejler af andre grunde, eller om serveren svarer med en fejl. Det er præcis emnet i [DOB 7](../undervisning/025-dob-7-client-side-error-handling-28-09-2026.md): `try`/`catch` og `response.ok` i din egen chatbot. `cors()` tillader lige nu alle origins — at afgrænse den til kun jeres egen frontend, samt statuskoder og fejlhåndtering på serversiden, venter til [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md). En admin-frontend til `/answers` (opret/redigér/slet svarregler) er en oplagt øvelse at bygge selv, med præcis samme `fetch()`-mønster, når du har tid.
