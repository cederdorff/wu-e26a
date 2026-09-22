# Øvelse 8: AMAbotten får en frontend — fetch og DOM

## Kort fortalt

Du bygger videre på din egen AMAbot fra [øvelse 6](express-rest-api-amabot.md) (og [øvelse 7](express-rest-api-amabot-arkitektur.md), hvis du har lavet den). `client/`-mappen har ligget urørt siden øvelse 6 — den indeholder stadig `index.html` med gamle EJS-tags, som ikke virker. Det retter du op på nu: du gør den til en rigtig, statisk side, der taler med dit REST API via `fetch()`, ligesom du har øvet i [DOB 5](../undervisning/019-dob-5-fetch-og-async-javascript-18-09-2026.md) og [DOB 6](../undervisning/021-dob-6-promises-og-async-await-22-09-2026.md).

Øvelsen er delt i fire dele:

- **Del 1** gør `client/index.html` til en almindelig statisk side, og server den med Live Server-udvidelsen — adskilt fra dit API.
- **Del 2** henter og viser den eksisterende samtalehistorik, når siden loader (`GET /messages`).
- **Del 3** opfanger formularens submit i browseren, og sender nye spørgsmål uden at genindlæse siden (`POST /messages`).
- **Del 4** genopliver "Ryd beskeder"-knappen med et rigtigt `DELETE /messages`-kald.

```text
Browser (client/app.js)            Server (server/server.js)
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
- Har du en "Ryd beskeder"-knap fra øvelse 3 (ekstraopgave 18)? Fjern `<form method="POST" action="/clear-messages">` omkring den, men behold selv knappen. Ret dens `type="submit"` til `type="button"` — uden en formular omkring den giver `submit` ikke længere mening — og giv den et id, fx `id="clear-messages-button"`. Har du den ikke, så tilføj en nu, uden for spørgsmål-formularen:

  ```html
  <button type="button" id="clear-messages-button">Ryd beskeder</button>
  ```

#### Test trin 2

Åbn `client/index.html` direkte i browseren (dobbeltklik). Siden skal vise dit layout, uden nogen synlig `<%= %>`-tekst noget sted, og med en tom besked-container. Det er kun et midlertidigt, visuelt tjek — den rigtige server kommer i næste trin.

---

### 3. Start client/index.html med Live Server

Installer VS Codes **Live Server**-udvidelse (af Ritwick Dey), hvis du ikke allerede har den. Højreklik derefter på `client/index.html`, og vælg **Open with Live Server**.

> Live Server starter sin egen lille statiske webserver, typisk på `http://127.0.0.1:5500`, og genindlæser automatisk siden, hver gang du gemmer en ændring. Det er en **anden** server end dit Express-API. Fra nu af holder du to servere kørende samtidig: `npm run dev` i `server/` (API'et, port 3000) og Live Server (`client/`, port 5500) — hver i sin egen terminal/fane.

> **Gotcha: Live Server genindlæser af sig selv, når du bruger AMAbotten.** Åbner du `client/index.html` fra roden af hele projektet (ikke kun `client/`-mappen), overvåger Live Server som udgangspunkt hele workspace'et — inklusive `server/data/messages.json`, som din server skriver til, hver gang nogen stiller et spørgsmål eller rydder historikken. Live Server opfatter det som en filændring og reloader siden, midt i det, Del 3 og 4 ellers skal bevise virker uden reload. Ret det ved at oprette `.vscode/settings.json` i projektets rod med:
>
> ```json
> { "liveServer.settings.root": "/client" }
> ```
>
> Det begrænser Live Server til kun at servere og overvåge `client/`-mappen — den ved slet ikke, at `server/` findes. Genstart Live Server (luk fanen, højreklik og "Open with Live Server" igen), efter du har gemt filen.

#### Test trin 3

Bekræft i adresselinjen, at siden nu kører på `http://127.0.0.1:5500` (eller den port, Live Server valgte) — ikke en `file://`-sti. Bekræft samtidig, at din API-server stadig kører for sig selv på `http://localhost:3000`.

---

### 4. Opret client/app.js, og forbind den til siden

```html
<script src="app.js" defer></script>
```

Placér linjen i `<head>`. `defer` sikrer, at scriptet først kører, når HTML'en er færdigindlæst — ligesom I gennemgik i [DOB 4](../undervisning/016-dob-4-dom-manipulation-med-js-15-09-2026.md) — så du er sikker på, at `#messages`, formularen og knappen findes, når din kode leder efter dem.

Opret den tomme fil `client/app.js`, og skriv midlertidigt:

```js
console.log("app.js er forbundet");
```

#### Test trin 4

Genindlæs siden i Live Server, åbn DevTools' konsol, og bekræft at teksten vises. Fjern loggen igen, når du har set den.

---

### 5. Hent dine DOM-elementer

Øverst i `client/app.js`, over al anden kode:

```js
const messagesContainer = document.querySelector("#messages");
const questionForm = document.querySelector("#question-form");
const questionInput = document.querySelector("#question");
const clearMessagesButton = document.querySelector("#clear-messages-button");
```

> Match id'erne med dem, du selv satte i trin 2 — hedder dine elementer noget andet, så ret variablerne herefter, ikke selectorerne.

#### Test trin 5

Tilføj midlertidigt `console.log(messagesContainer, questionForm, questionInput, clearMessagesButton);` under de fire linjer. Genindlæs siden — ingen af de fire må logges som `null`.

Logges én af dem som `null`, passer det tilhørende id i JavaScript ikke med id'et i HTML. Dobbelttjek alle fire: `#messages`, `#question-form`, `#question` og `#clear-messages-button` — stemmer hvert enkelt overens, både i selectoren og i HTML-elementets `id`-attribut?

Fjern loggen igen.

## Tjekpunkt: Del 1

Del 1 er gennemført, når:

- `client/index.html` ikke længere indeholder EJS-tags
- Live Server viser din side (fx `http://127.0.0.1:5500`), mens din API-server kører samtidig på `http://localhost:3000`
- `client/app.js` er forbundet, og alle fire DOM-referencer finder deres element

---

## Del 2: Vis samtalehistorikken ved load

```text
GET /messages -> response.json(messages) -> ét <article> pr. besked i #messages
```

### 6. Skriv en funktion, der viser én besked

```js
function displayMessage(message) {
  // TODO: Byg en HTML-streng med et template literal: et <article> med sin class sat til message.type ("question" eller "answer") — det er den samme klasse, din CSS fra øvelse 3 allerede styler — og et <p> inde i det, med message.text.
  // TODO: Indsæt HTML-strengen sidst i messagesContainer med messagesContainer.insertAdjacentHTML("beforeend", html).
}
```

<details>
<summary>Hint</summary>

```text
html = `<article class="${message.type}"><p>${message.text}</p></article>`
messagesContainer.insertAdjacentHTML("beforeend", html)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
function displayMessage(message) {
  const html = /*html*/ `
    <article class="${message.type}">
      <p>${message.text}</p>
    </article>`;

  messagesContainer.insertAdjacentHTML("beforeend", html);
}
```

> **`insertAdjacentHTML`, ikke `appendChild`.** `insertAdjacentHTML("beforeend", html)` parser HTML-strengen og indsætter resultatet sidst inde i `messagesContainer`, uden at røre ved det, der allerede står der. `/*html*/`-kommentaren foran skabelonstrengen gør ingenting for JavaScript selv — det er et hint til din editor om at syntax-highlighte indholdet som HTML. **Bemærk:** fordi `message.text` sættes direkte ind i strengen, bliver den tolket som HTML, ikke som ren tekst — skriver nogen `<b>` i et spørgsmål, får du reelt fed skrift på siden. At undgå det (fx med `textContent` i stedet for `insertAdjacentHTML`, eller ved at escape strengen selv) er en bevidst forenkling her; I arbejder videre med input-sanering i [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md).

</details>

#### Test trin 6

Kald midlertidigt funktionen direkte, efter du har hentet DOM-elementerne: `displayMessage({ type: "question", text: "Test" });`. Genindlæs siden — der skal med det samme stå en boks med teksten "Test" i `#messages`, med samme styling som resten af historikken. Fjern kaldet igen.

---

### 7. Hent historikken, og se hvad du får tilbage

Din side kører nu på en anden origin end API'et (Live Server vs. Express), så et relativt kald som `fetch("/messages")` ville gå til Live Server selv, ikke dit API. Definér derfor API'ets fulde adresse øverst i `client/app.js`, sammen med dine andre konstanter:

```js
const API_URL = "http://localhost:3000";
```

Brug den i alle dine `fetch()`-kald fremover, fx `` `${API_URL}/messages` ``:

```js
async function getMessages() {
  // TODO: Hent `${API_URL}/messages` med fetch(), og await response.json() for at få messages-arrayet.
  // TODO: Log messages til konsollen med console.log(messages) — se, hvordan dataen faktisk ser ud, før du render'er den.
}

getMessages();
```

<details>
<summary>Hint</summary>

```text
response = await fetch(`${API_URL}/messages`)
messages = await response.json()

console.log(messages)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
async function getMessages() {
  const response = await fetch(`${API_URL}/messages`);
  const messages = await response.json();

  console.log(messages);
}

getMessages();
```

> **`async`/`await` i stedet for `.then()`.** `fetch()` returnerer et promise — `await` sætter funktionen på pause, indtil requesten er færdig, uden at blokere resten af siden. `getMessages()` selv skal derfor erklæres `async`, men kaldet nederst, `getMessages();`, venter ikke på den — den kører bare i baggrunden, så snart siden er klar.

</details>

#### Test trin 7

Genindlæs siden i Live Server, og åbn DevTools' konsol. Du skal se en fejl i stil med:

```text
Access to fetch at 'http://localhost:3000/messages' from origin 'http://127.0.0.1:5500'
has been blocked by CORS policy...
```

Det er **forventet** — ikke en fejl i din kode. Det retter du i næste trin.

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

Genstart serveren, og genindlæs siden i Live Server igen. CORS-fejlen skal være væk fra konsollen. I stedet skal konsollen nu vise et array — har du spurgt AMAbotten om noget tidligere (fra Thunder Client-test i øvelse 6/7), ét objekt pr. besked, hver med et `type` (`"question"` eller `"answer"`) og en `text`. Kig på strukturen; det er den, du render'er i næste trin. Åbn DevTools' Network-fane, og bekræft at `GET /messages`-kaldet returnerer status `200`.

---

### 9. Vis hver besked på siden

Du har nu set formen på dataen — byg videre på `getMessages()`, og vis den i stedet for at logge den:

```js
async function getMessages() {
  const response = await fetch(`${API_URL}/messages`);
  const messages = await response.json();

  // TODO: Kør igennem messages med en for...of, og kald displayMessage(message) for hver. Fjern console.log igen.
}

getMessages();
```

<details>
<summary>Hint</summary>

```text
for (const message of messages) {
  displayMessage(message)
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
async function getMessages() {
  const response = await fetch(`${API_URL}/messages`);
  const messages = await response.json();

  for (const message of messages) {
    displayMessage(message);
  }
}

getMessages();
```

</details>

#### Test trin 9

Genindlæs siden. Hele din eksisterende samtalehistorik skal nu stå på siden, med den styling `.question`/`.answer` allerede har fra øvelse 3.

## Tjekpunkt: Del 2

Del 2 er gennemført, når hele din eksisterende samtalehistorik vises på siden, med korrekt styling, hver gang du genindlæser siden i Live Server — uden CORS-fejl i konsollen.

---

## Del 3: Send et nyt spørgsmål uden at genindlæse siden

```text
submit -> preventDefault() -> POST /messages -> { question, answer } -> to nye <article>-elementer
```

### 10. Opfang formularens submit

```js
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  // Trin 11 fortsætter her
});
```

> **`event.preventDefault()`.** Uden denne linje gør formularen, hvad den altid har gjort: sender en almindelig request og genindlæser siden — præcis den opførsel, `fetch()` skal overtage. Det er den samme "intercept formularen"-teknik, dagens undervisning (DOB 6) handlede om.

> Ingen tjek endnu af, om `question` er tom — det venter til [DOB 7](../undervisning/025-dob-7-client-side-error-handling-28-09-2026.md).

#### Test trin 10

Sæt midlertidigt `console.log(question);` ind, hvor kommentaren står. Indsend formularen med et spørgsmål skrevet — konsollen skal vise teksten, og siden må **ikke** genindlæse (ingen blink, ingen ny URL). Fjern loggen igen.

---

### 11. Send POST-kaldet, og se hvad du får tilbage

Byg videre på event listeneren fra trin 10:

```js
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  // TODO: Send et POST-kald til `${API_URL}/messages` med fetch(). Husk:
  //   - method: "POST"
  //   - headers: { "Content-Type": "application/json" }
  //   - body: JSON.stringify({ question })

  // TODO: await response.json() for at få { question, answer } tilbage, og log det med console.log(data).
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

console.log(data)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();

  console.log(data);
});
```

> **`headers` og `body` hører sammen.** `JSON.stringify({ question })` laver JavaScript-objektet om til en JSON-tekststreng — det er den, der ryger i `body`. `"Content-Type": "application/json"` fortæller serveren, at teksten skal tolkes som JSON. Uden headeren læser `express.json()`-middlewaren på serveren ikke `request.body` korrekt, og `request.body.question` bliver `undefined`. Det er nøjagtig den samme aftale mellem klient og server, som `name="question"` og `express.urlencoded()` var i øvelse 3 — bare med JSON i stedet for en HTML-formular.

</details>

#### Test trin 11

Skriv et rigtigt spørgsmål i formularen, og send den. Åbn DevTools' konsol — der skal stå et objekt med `question` og `answer`, hver formet som beskederne fra trin 7 (`{ type, text }`). Åbn Network-fanen, og bekræft at `POST /messages` returnerer status `200`. Siden viser endnu ikke noget nyt — det kommer i næste trin.

---

### 12. Vis spørgsmål og svar på siden

Du har set formen på svaret — vis det nu i stedet for at logge det:

```js
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();

  // TODO: Vis både data.question og data.answer med displayMessage() fra trin 6. Fjern console.log igen.
});
```

<details>
<summary>Hint</summary>

```text
displayMessage(data.question)
displayMessage(data.answer)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();

  displayMessage(data.question);
  displayMessage(data.answer);
});
```

</details>

#### Test trin 12

Skriv et nyt spørgsmål, og send det. Uden at siden genindlæser, skal både dit spørgsmål og AMAbottens svar dukke op i `#messages`, med samme styling som resten af historikken.

---

### 13. Ryd inputfeltet

Formularen virker nu, men inputfeltet står stadig med det gamle spørgsmål i, efter du har sendt det.

```js
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();

  displayMessage(data.question);
  displayMessage(data.answer);

  // TODO: Ryd inputfeltet, questionInput.value = "", så det er klar til næste spørgsmål.
});
```

<details>
<summary>Hint</summary>

```text
questionInput.value = ""
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();

  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await response.json();

  displayMessage(data.question);
  displayMessage(data.answer);

  questionInput.value = "";
});
```

</details>

#### Test trin 13

Skriv endnu et spørgsmål, og send det. Inputfeltet skal være tomt, lige så snart svaret er vist. Genindlæs siden bagefter, og bekræft at alle beskederne fra trin 11-13 stadig er der — de kom jo fra `saveMessages()` på serveren.

## Tjekpunkt: Del 3

Del 3 er gennemført, når du kan stille AMAbotten et spørgsmål gennem formularen, og se både spørgsmål og svar dukke op på siden med det samme, uden en eneste genindlæsning.

---

## Del 4: Ryd beskeder med et rigtigt DELETE-kald

### 14. Forbind "Ryd beskeder"-knappen

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

> `messagesContainer.innerHTML = ""` er trygt at bruge her, fordi du selv sætter den tomme streng — det er ikke brugerdata, der indsættes som HTML (modsat trin 6, hvor `message.text` ender direkte i den HTML, `insertAdjacentHTML()` indsætter).

</details>

#### Test trin 14

Klik på "Ryd beskeder". Historikken skal forsvinde fra siden med det samme. Genindlæs siden bagefter, og bekræft at historikken forbliver tom — `DELETE /messages` har jo også ryddet `data/messages.json` på serveren.

## Tjekpunkt: Del 4

Del 4 er gennemført, når "Ryd beskeder"-knappen rydder både siden og den gemte historik på serveren.

---

## Del 5: Lidt finpudsning — automatisk scroll og en tydeligere "Ryd beskeder"-knap

`.messages` har allerede `max-height` og `overflow-y: auto` fra øvelse 3 — historikken skal altså kunne scrolle. Men lige nu skal du selv scrolle ned for at se en ny besked, og "Ryd beskeder" ligner stadig en helt almindelig, umærket knap, der er svær at skelne fra "Send".

### 15. Scroll automatisk ned til den seneste besked

`displayMessage()` er den ene funktion, der indsætter beskeder i `#messages` — uanset om det sker ved load (trin 9), efter et nyt spørgsmål (trin 12) eller i princippet også en fremtidig brug. Retter du scrollet der, virker det alle steder.

```js
function displayMessage(message) {
  const html = /*html*/ `
    <article class="${message.type}">
      <p>${message.text}</p>
    </article>`;

  messagesContainer.insertAdjacentHTML("beforeend", html);

  // TODO: Scroll containeren ned til bunden, så den nyeste besked altid er synlig.
}
```

<details>
<summary>Hint</summary>

```text
messagesContainer.scrollTop = messagesContainer.scrollHeight
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
function displayMessage(message) {
  const html = /*html*/ `
    <article class="${message.type}">
      <p>${message.text}</p>
    </article>`;

  messagesContainer.insertAdjacentHTML("beforeend", html);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
```

> **`scrollTop` og `scrollHeight`.** `scrollHeight` er hele containerens indhold i pixels, også den del, der er scrollet uden for syne. Sætter du `scrollTop` (hvor langt der er scrollet ned) til den værdi, hopper containeren helt ned i bunden — uanset hvor meget indhold der allerede står der. Fordi linjen står i `displayMessage()`, sker det efter *hver* besked, den viser: både historikken ved load og de to nye beskeder efter et spørgsmål.

</details>

#### Test trin 15

Genindlæs siden, så der er nok historik til, at `#messages` rent faktisk scroller (har du ikke nok, så stil et par spørgsmål først). Siden skal med det samme vise den seneste besked nederst i containeren — ikke toppen af historikken. Stil derefter et nyt spørgsmål: svaret skal automatisk blive synligt, uden at du selv skal scrolle.

---

### 16. Giv "Ryd beskeder" sit eget udseende

Knappen har allerede sit id fra trin 2 (`#clear-messages-button`) — det bruger du til at style den direkte i `client/styles.css`, uden at røre selve HTML'en.

<details>
<summary>Hint</summary>

Brug id-selectoren `#clear-messages-button`, og genbrug de CSS-variabler, der allerede findes øverst i filen (`--border`, `--text-muted`, `--answer-bg`, `--primary`), så knappen matcher resten af designet — men tydeligt mindre fremtrædende end den lilla "Send"-knap.

</details>

<details>
<summary>Se løsningsforslag</summary>

```css
#clear-messages-button {
  display: block;
  margin: 1rem auto 0;
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

#clear-messages-button:hover {
  background: var(--answer-bg);
  color: var(--text);
  border-color: var(--text-muted);
}

#clear-messages-button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

> Knappen bruger `background: transparent` og `var(--text-muted)` i stedet for `var(--primary)` — den skal kunne findes, men ikke konkurrere med "Send" om opmærksomheden. `:hover` og `:focus-visible` genbruger de samme farver som resten af siden, så den stadig føles som en del af samme design.

</details>

#### Test trin 16

Genindlæs siden. "Ryd beskeder" skal nu se tydeligt anderledes ud end "Send" — en rolig, indrammet knap i stedet for en solid lilla en. Hold musen over den, og bekræft at den reagerer visuelt. Bekræft til sidst, at den stadig rydder historikken korrekt (trin 14 virker uændret).

## Tjekpunkt: Del 5

Del 5 er gennemført, når `#messages` automatisk scroller ned til den nyeste besked, hver gang en besked vises, og "Ryd beskeder" har sit eget, tydeligt adskilte udseende.

---

## Tjekpunkt

Øvelsen er gennemført, når din AMAbot:

- viser sin fulde samtalehistorik ved load, hentet med `fetch()` fra `GET /messages`
- lader dig stille et nyt spørgsmål gennem formularen, uden at siden genindlæser
- viser både spørgsmål og svar på siden, med det samme svaret kommer tilbage fra `POST /messages`
- scroller automatisk ned, så den nyeste besked altid er synlig
- kan rydde historikken, både på siden og på serveren, med `DELETE /messages`, via en knap der tydeligt skiller sig ud fra "Send"
- kører på sin egen origin via Live Server, adskilt fra API'et, uden CORS-fejl i konsollen

---

## Reflektér over din læring

1. Hvad gjorde `views/index.ejs` i øvelse 3, som `client/app.js` nu gør i stedet? Hvad er den samme opgave løst to forskellige steder — serveren dengang, browseren nu?
2. Hvad betyder "origin" helt konkret for `client/`'et og `server/`'et i denne øvelse? Hvorfor blokerede browseren requesten, før du tilføjede `cors()`?
3. `app.use(cors())` uden argumenter tillader alle origins. Hvad tror du, der ville ske, hvis en helt andens hjemmeside prøvede at kalde dit API lige nu — og hvorfor er det noget, RACE 7 tager fat på?
4. `event.preventDefault()` i trin 10 — hvad ville der ske, hvis du fjernede den linje igen? Prøv det, og beskriv, hvad du ser.
5. I trin 6 sætter `displayMessage()` `message.text` direkte ind i en HTML-streng, som `insertAdjacentHTML()` derefter indsætter. Hvad ville der ske, hvis nogen skrev `<b>hej</b>` som spørgsmål? Hvordan ville det se anderledes ud, hvis du i stedet havde brugt `textContent`?
6. Peg på ét sted, hvor du bruger `await`. Hvad ville koden gøre forkert, hvis du glemte det ord der?

## Videre

Din AMAbot har nu en rigtig frontend: `client/app.js` taler med dit REST API via `fetch()`, kører på sin egen origin med Live Server, og opdaterer DOM'en direkte i browseren, uden en eneste server-genereret HTML-side. Du har allerede mødt og løst en rigtig CORS-fejl undervejs — men lige nu antager koden ellers, at alt går godt: intet tjekker, om `fetch()` fejler af andre grunde, eller om serveren svarer med en fejl. Det er præcis emnet i [DOB 7](../undervisning/025-dob-7-client-side-error-handling-28-09-2026.md): `try`/`catch` og `response.ok` i din egen chatbot. `cors()` tillader lige nu alle origins, og `displayMessage()` stoler blindt på, at `message.text` er ren tekst — at afgrænse origins, samt statuskoder, fejlhåndtering og input-sanering på serversiden, venter til [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md). En admin-frontend til `/answers` (opret/redigér/slet svarregler) er en oplagt øvelse at bygge selv, med præcis samme `fetch()`-mønster, når du har tid.
