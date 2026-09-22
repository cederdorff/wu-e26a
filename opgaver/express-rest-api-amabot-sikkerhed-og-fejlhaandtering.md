# Øvelse 9: AMAbotten bliver sikker og fejltolerant

## Kort fortalt

Du bygger videre på din egen AMAbot fra [øvelse 7](express-rest-api-amabot-arkitektur.md) og på det, du lige har lært i [REST API-øvelse: Fejlhåndtering](express-rest-api-fejlhaandtering.md) fra [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md): statuskoder, `404`/`400`\-tjek, `try`/`catch` og en fælles fejl-middleware.

Øvelsen er delt i to dele:

- **Del 1** overfører alt det fra `/students`/`/teachers` til `/messages` og `/answers` i din egen AMAbot — uden TODO'er, hints eller løsningsforslag. Du kender mønsteret; det er den samme øvelse, du selv skal genkende, ligesom du overførte routes/data-modul-opdelingen i øvelse 7.
- **Del 2** tilføjer to sikkerhedsrettelser, der er nye for AMAbotten specifikt: en strammere `cors()`-opsætning, og en rettelse af XSS-hullet i `POST /messages`. Her er der scaffolding igen — det er ikke en overførsel, men noget nyt.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Samme fremgangsmåde som altid: prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under trinnet — den peger på de rigtige metoder og egenskaber, uden at give dig koden.
2. Åbn først **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller du vil sammenligne med din egen kode.

Spring aldrig en test over, selv når den virker oplagt.

</details>

---

## Del 1: Overfør fejlhåndteringen til AMAbotten

### 1. Gem udgangspunktet i Git

```bash
git add .
git commit -m "Save AMAbot before transferring status codes and error handling"
git push
```

---

Ingen TODO'er, hints eller løsningsforslag herfra — du har lige bygget hele mønsteret to gange, for `/students` og `/teachers`. Nu overfører du det selv til `/messages` og `/answers`.

Et par ting, der er anderledes end på `/students`/`/teachers`, og som du selv skal tage stilling til:

- `/messages` har ingen `:id`\-baserede routes — kun `GET`, `POST` og `DELETE` på hele samlingen. `404`\-mønsteret giver derfor kun mening på `/answers/:category`, ikke på `/messages`.
- `/answers/:category` bruger `category` (en string) i stedet for et numerisk id — men selve `404`\-tjekket (`find()`, så `if (!x) { ... }`) er identisk.
- `POST /messages` har allerede en valideringstjek for et tomt spørgsmål, fra øvelse 6 — den skal bare have `.status(400)` tilføjet.
- `POST /answers` og `PUT /answers/:category` har ingen validering endnu — tilføj den.
- `try`/`catch` skal om `loadMessages()` og `loadAnswers()` i deres respektive data-moduler.
- 404-catch-all'en og fejl-middlewaren tilføjes i AMAbot-serverens `server.js` — der er kun én af hver, uanset hvor mange routere der er monteret.

### 2. Statuskoder, 404 og 400 på /messages og /answers

Gennemgå `/messages` og `/answers` med samme blik som `/students`/`/teachers`: hvor mangler en eksplicit `201`/`204`? Hvor kan `find()` returnere `undefined`? Hvor mangler der et tjek for, om `request.body` faktisk indeholder det nødvendige?

#### Test trin 2

Kør hele `/messages`\- og `/answers`\-flowet igennem i Thunder Client, inklusive et ugyldigt `category` og en ufuldstændig body. Bekræft `201`/`204`/`404`/`400`, hvor de hører hjemme.

---

### 3. try/catch og fejl-middleware i AMAbotten

Tilføj `try`/`catch` om `loadMessages()` og `loadAnswers()`, og montér en 404-catch-all og en fælles fejl-middleware nederst i AMAbot-serverens `server.js`.

#### Test trin 3

Omdøb midlertidigt en af jeres datafiler, og bekræft at I får et rent JSON-fejlsvar med `500`, i stedet for Express' fejlside. Giv filen dens rigtige navn og indhold tilbage bagefter.

## Tjekpunkt: Del 1

Del 1 er gennemført, når din AMAbot håndterer statuskoder, `404`, `400`, `try`/`catch` og en fælles fejl-middleware på præcis samme måde, som `/students` og `/teachers` gør i [REST API-øvelse: Fejlhåndtering](express-rest-api-fejlhaandtering.md).

---

## Del 2: Sikkerhed — CORS og XSS

Disse to rettelser er nye — der er intet at overføre fra `/students`/`/teachers`, som hverken har en frontend eller gemmer fri tekst fra en bruger.

### 4. CORS: begræns til jeres egen frontend

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

#### Test trin 4

Har du en frontend kørende (øvelse 8): genindlæs den, og bekræft at den stadig henter og viser beskeder uden fejl i konsollen. Prøv derefter selv at kalde jeres API fra et helt andet sted: åbn DevTools-konsollen på en vilkårlig anden hjemmeside, og kør `fetch("http://localhost:3000/messages").then(r => r.json()).then(console.log)`. Den skal nu fejle med en CORS-fejl i konsollen.

---

### 5. XSS: escapeHtml() i POST /messages

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

#### Test trin 5

Send `POST http://localhost:3000/messages` med body `{ "question": "<img src=x onerror=\"alert('hacked')\">" }`. Åbn `data/messages.json`, og bekræft at teksten nu er gemt som `&lt;img src=x onerror=...&gt;` i stedet for rå HTML. Send derefter et almindeligt spørgsmål igen, og bekræft at det stadig fungerer som før.

## Tjekpunkt: Del 2

Del 2 er gennemført, når `cors()` kun tillader jeres egen frontends origin, og `POST /messages` escaper `question`, før den gemmes.

---

## Reflektér over din læring

Når du er færdig, skal du gerne kunne forklare:

1. Hvor meget af mønsteret fra `/students`/`/teachers` kunne du genbruge uændret på `/messages` og `/answers`, og hvor meget skulle du selv tilpasse?
2. `/messages` fik intet `404`\-tjek, mens `/answers/:category` fik. Hvad var det ved `/messages`, der gjorde den forskel indlysende?
3. Hvorfor betyder `cors({ origin: "..." })` noget for en browser, men intet for Thunder Client eller en almindelig `curl`\-kommando?
4. `escapeHtml()` kører på `question`, før den gemmes på serveren — hvad ville der ske, hvis I i stedet ventede med at rense teksten, til den blev vist i en klient? Er der en fordel ved at gøre det på serveren?
5. Peg på ét sted i din kode, hvor en fejl nu ender som `{ error: "..." }`, uanset om den kom fra et `404`\-, `400`\- eller `500`\-svar.

## Videre

Din AMAbot håndterer nu de samme typer fejl, et rigtigt REST API bør: forudsigelige tjek (`404`/`400`), uventede fejl (`try`/`catch` og en fælles fejl-middleware), og to sikkerhedshuller lukket (`cors()` begrænset til jeres egen frontend, og `question` renset for HTML, før den gemmes). Brug gerne de samme mønstre — eksplicitte statuskoder, tjek før I handler, `try`/`catch` om det, der kan fejle uforudsigeligt — når I snart går videre til jeres eget projekt.
