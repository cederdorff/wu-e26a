# Øvelse 9: AMAbotten bliver sikker og fejltolerant

## Kort fortalt

Du bygger videre på din egen AMAbot fra [øvelse 7](express-rest-api-amabot-arkitektur.md) og bruger det, du lige har lavet i [REST API-øvelse: Fejlhåndtering](express-rest-api-fejlhaandtering.md): statuskoder, `404`/`400`\-tjek, `try`/`catch` og en fælles fejl-middleware.

- **Del 1** overfører fejlhåndteringen fra `/students` og `/teachers` til `/messages` og `/answers`. Der er ingen TODO'er, hints eller løsningsforslag. Du kender mønsteret, ligesom du kendte routes/data-modul-opdelingen, da du overførte den i øvelse 7.
- **Del 2** er nyt: en strammere `cors()`-opsætning og en rettelse af XSS-hullet i `POST /messages`. Her får du mere hjælp igen: koden til `cors()` og hint og løsningsforslag til `escapeHtml()`.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under trinnet. Den peger dig i den rigtige retning uden at give dig koden.
2. Åbn **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller når du vil sammenligne med din egen kode.

Spring aldrig en test over, heller ikke når den virker oplagt.

</details>

---

## Del 1: Overfør fejlhåndteringen til AMAbotten

Du har bygget hele mønsteret to gange, for `/students` og `/teachers`. Nu gør du det selv for `/messages` og `/answers`, i samme rækkefølge. Under hvert trin står det, der er anderledes i AMAbotten.

### 1. Gem udgangspunktet i Git

```bash
git add .
git commit -m "Save AMAbot before transferring status codes and error handling"
git push
```

---

### 2. Statuskoder

**Prøv det først:** send `POST http://localhost:3000/messages` med et spørgsmål. Statuslinjen viser `200 OK`.

Find de routes i `/messages` og `/answers`, der opretter eller sletter noget, og giv dem `201` og `204`.

#### Test trin 2

Opret og slet både en besked og en svarregel. Du skal få `201` på oprettelse og `204` på sletning.

> Har du en frontend fra [øvelse 8](fetch-dom-amabot.md), viser Network-fanen nu `201` og `204` på `/messages`, hvor øvelse 8 bad dig tjekke for `200`. Det er forventet. Frontenden virker stadig, fordi `fetch()` regner alle 2xx-koder som succes.

---

### 3. 404 på /answers/:category

**Prøv det først:** send `PUT http://localhost:3000/answers/findes-ikke` med en body. Du får Express' HTML-fejlside.

Tilføj 404-tjekket, hvor det giver mening. Det er lidt anderledes end på `/students`:

- `/messages` har ingen routes med `:id`. Der er kun `GET`, `POST` og `DELETE` på hele samlingen, så 404-tjekket hører kun til på `/answers/:category`.
- `/answers/:category` bruger `category`, som er en string, i stedet for et numerisk id. Selve tjekket er det samme: `find()` og så `if (!answerRule) { ... }`.
- `DELETE /answers/:category` bruger `filter()`, så den svarer `204`, selvom reglen ikke findes. Find reglen med `find()` først, ligesom i punkt 7 i fejlhåndteringsøvelsen.

#### Test trin 3

Send `GET`, `PUT` og `DELETE` på `/answers/findes-ikke`. Du skal få `404` og en fejlbesked som JSON. Tjek bagefter, at en kategori, der findes, stadig virker.

---

### 4. 400 på POST og PUT

**Prøv det først:** send `POST http://localhost:3000/answers` med `{ "category": "test" }`, altså uden `keywords` og `answer`. Der bliver oprettet en halv regel. Slet den igen med `DELETE /answers/test`.

- `POST /messages` har allerede et tjek for et tomt spørgsmål fra øvelse 6. Det mangler bare `.status(400)`. Tjekket fanger `{ "question": "" }`. Sender du `{}` uden `question`, crasher `request.body.question.trim()`, før tjekket når at køre. Den fejl fanger fejl-middlewaren i trin 5.
- `POST /answers` og `PUT /answers/:category` har ingen validering endnu. Tilføj den.

#### Test trin 4

Send `POST /messages` med `{ "question": "" }`, og `POST /answers` og `PUT /answers/:category` med en body, hvor der mangler felter. Du skal få `400` alle tre steder. Tjek bagefter, at en fuldt udfyldt body stadig virker.

---

### 5. try/catch, fejl-middleware og 404-catch-all

**Prøv det først:** omdøb midlertidigt `data/messages.json`, send `GET /messages`, og se Express' fejlside med `ENOENT`. Send også `GET /noget-der-ikke-findes`. Giv filen dens rigtige navn tilbage.

- Tilføj `try`/`catch` om `loadMessages()` og `loadAnswers()` i deres data-moduler.
- Tilføj en fejl-middleware og en 404-catch-all i `server.js`. Der skal kun være én af hver, uanset hvor mange routere der er. Husk rækkefølgen: routerne, så 404-catch-all'en, og fejl-middlewaren til sidst.

#### Test trin 5

1. Omdøb `data/messages.json` midlertidigt, og send `GET /messages`. Du skal få `500` og din egen fejlbesked som JSON. Gør det samme med `data/answers.json` og `GET /answers`. Giv filerne deres navn tilbage bagefter.
2. Send `POST /messages` helt uden body, og derefter med `{}`. Du skal få `500` som JSON begge gange og ikke Express' fejlside.
3. Send `GET /noget-der-ikke-findes`. Du skal få `404` og JSON.

## Tjekpunkt: Del 1

Din AMAbot håndterer statuskoder, `404`, `400`, `try`/`catch`, fejl-middleware og 404-catch-all på samme måde som `/students` og `/teachers` i [REST API-øvelse: Fejlhåndtering](express-rest-api-fejlhaandtering.md).

---

## Del 2: Sikkerhed — CORS og XSS

De to rettelser her er nye. `/students` og `/teachers` har hverken en frontend eller gemmer fri tekst fra brugere, så der er ikke noget at overføre.

### 6. CORS: kun din egen frontend

**Prøv det først.** Spring det over, hvis du ikke har `app.use(cors())` fra [øvelse 8](fetch-dom-amabot.md). Så blokerer browseren allerede kald fra andre origins.

Åbn en side på en *anden* origin end din frontend, åbn DevTools-konsollen dér, og kør:

```js
fetch("http://localhost:3000/messages").then((r) => r.json()).then(console.log);
```

Du får dine beskeder tilbage, selvom kaldet kommer fra en fremmed side. Det er det, du retter nu.

- **Nemmest:** åbn din frontend på `http://localhost:5500` i stedet for `http://127.0.0.1:5500`. Det er samme side på samme computer, men en **anden origin**, fordi værtsnavnet er et andet. Browseren sammenligner origins som tekst.
- **Alternativt:** brug en offentlig hjemmeside. Spørger Chrome, om siden må få adgang til enheder på dit lokale netværk, så klik *Tillad*. Ellers fejler kaldet af en anden grund end CORS.

**Har du `cors()` fra øvelse 8?** Find `app.use(cors());` i `server.js`, og ret den til:

```js
app.use(cors({ origin: "http://127.0.0.1:5500" }));
```

**Har du ikke lavet øvelse 8?** Installér pakken:

```bash
npm install cors
```

Importér den øverst i `server.js`, og brug den med det samme med en begrænset origin:

```js
import cors from "cors";

app.use(cors({ origin: "http://127.0.0.1:5500" }));
```

> `http://127.0.0.1:5500` er standardadressen for VS Codes Live Server, som `client/index.html` kører på i øvelse 8. Kører din frontend et andet sted, så brug den adresse.

#### Test trin 6

Du behøver ikke en frontend til test 1 og 2, bare en server, der kører.

1. **I Thunder Client:** send `GET http://localhost:3000/messages` med headeren `Origin: http://127.0.0.1:5500`. Kig i response-headers: `Access-Control-Allow-Origin` er `http://127.0.0.1:5500`. Skift headeren til `Origin: http://example.com`, og send igen. Du får stadig `200` og de samme data, og `Access-Control-Allow-Origin` er stadig `http://127.0.0.1:5500`. Serveren svarer altså alle. Den fortæller bare, hvilken origin der må læse svaret. Det er **browseren**, der håndhæver CORS, og Thunder Client er ikke en browser.
2. **I browseren:** kør `fetch()`-kaldet fra "Prøv det først" igen fra den fremmede origin. Nu skal du få en CORS-fejl i konsollen.

**Har du en frontend fra øvelse 8?** Så test også:

3. Genindlæs den, og tjek, at den stadig viser beskeder uden fejl i konsollen.
4. Sæt midlertidigt `origin` til `"http://example.com"`, genstart serveren, og genindlæs frontenden. Nu får din egen frontend en CORS-fejl, selvom du ikke har rørt den. Sæt `origin` tilbage, genstart, og tjek, at den virker igen.

---

### 7. XSS: escapeHtml() i POST /messages

**Prøv det først:** send `POST http://localhost:3000/messages` med body `{ "question": "<img src=x onerror=\"alert('hacked')\">" }`. Åbn `data/messages.json`. Teksten er gemt som rå HTML. Har du en frontend fra [øvelse 8](fetch-dom-amabot.md), så genindlæs den: `insertAdjacentHTML()` læser teksten som HTML, billedet fejler med vilje, og `alert('hacked')` kører. Det sker igen, hver gang siden genindlæses, fordi beskeden er gemt på serveren.

Tilføj en hjælpefunktion i den fil, hvor din `POST /messages`\-logik ligger (`routes/messages.js`, eller `controllers/messagesController.js`, hvis du lavede den frivillige Del 5 i øvelse 7):

```js
function escapeHtml(text) {
  // TODO: Returnér text, hvor <, >, &, " og ' er erstattet med deres HTML-entities:
  // &lt;, &gt;, &amp;, &quot;, &#039;
}
```

<details>
<summary>Hint</summary>

`replaceAll()` kan kædes efter hinanden med én linje pr. tegn. Erstat `&` først, ellers escaper du dine egne entities igen.

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

Brug den på spørgsmålet i `POST /messages`. Find:

```js
const message = { type: "question", text: question, createdAt: new Date().toISOString() };
```

og ret den til:

```js
const message = { type: "question", text: escapeHtml(question), createdAt: new Date().toISOString() };
```

Svaret skal også escapes, og det er faktisk det største hul. `/answers` har ingen adgangskontrol, så alle kan oprette en svarregel med HTML i via `POST /answers` eller `PUT /answers/:category`. Det svar bliver vist til alle, der stiller et spørgsmål, der matcher, og ikke kun til den, der oprettede det. Find, hvor svar-beskeden bliver oprettet, noget i stil med:

```js
const answerMessage = { type: "answer", text: result.answer, createdAt: new Date().toISOString() };
```

og ret den til:

```js
const answerMessage = { type: "answer", text: escapeHtml(result.answer), createdAt: new Date().toISOString() };
```

#### Test trin 7

1. Ryd den gamle besked fra "Prøv det først" med `DELETE http://localhost:3000/messages`. `escapeHtml()` beskytter kun det, der bliver gemt fra nu af, så den gamle besked ville stadig køre i frontenden.
2. Send samme angreb igen. I `data/messages.json` skal teksten nu være gemt som `&lt;img src=x onerror=...&gt;`. Har du en frontend, så genindlæs den: spørgsmålet vises som almindelig tekst, og der kommer ingen `alert`.
3. Send et almindeligt spørgsmål, og tjek, at det stadig virker.
4. Opret en svarregel med HTML i svaret: `POST /answers` med `{ "category": "test", "keywords": ["test"], "answer": "<b>hej</b>" }`. Send `POST /messages` med `"question": "test"`, og tjek, at svaret i `data/messages.json` også er escapet. Slet reglen igen med `DELETE /answers/test`.

## Tjekpunkt: Del 2

`cors()` tillader kun din egen frontends origin, og `POST /messages` escaper både spørgsmålet og AMAbottens svar, før de bliver gemt.

---

## Reflektér over din læring

Når du er færdig, skal du kunne forklare:

1. Hvor meget af mønsteret fra `/students` og `/teachers` kunne du bruge uændret på `/messages` og `/answers`, og hvad skulle du tilpasse?
2. `/answers/:category` fik et 404-tjek, men `/messages` fik ikke. Hvorfor?
3. Hvorfor betyder `cors({ origin: "..." })` noget for en browser, men ikke for Thunder Client eller `curl`?
4. Hvorfor er det vigtigere at escape svaret end spørgsmålet?
5. Du escaper teksten på serveren, før den bliver gemt. Hvad ville der ske, hvis du i stedet ventede, til den blev vist i frontenden? Hvad er fordelen ved at gøre det på serveren?

## Videre

Din AMAbot håndterer nu både de fejl, du kan forudse (`404`/`400`), og dem, du ikke kan (`try`/`catch` og fejl-middleware). Og du har lukket to sikkerhedshuller: `cors()` er begrænset til din egen frontend, og både spørgsmål og svar bliver renset for HTML, før de bliver gemt. Tag de samme mønstre med, når du går i gang med dit eget projekt.
