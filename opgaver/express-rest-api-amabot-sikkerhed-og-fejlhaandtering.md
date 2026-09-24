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

Ingen TODO'er, hints eller løsningsforslag herfra — du har lige bygget hele mønsteret to gange, for `/students` og `/teachers`. Nu overfører du det selv til `/messages` og `/answers`.

Et par ting, der er anderledes end på `/students`/`/teachers`, og som du selv skal tage stilling til:

- `/messages` har ingen `:id`\-baserede routes — kun `GET`, `POST` og `DELETE` på hele samlingen. `404`\-mønsteret giver derfor kun mening på `/answers/:category`, ikke på `/messages`.
- `/answers/:category` bruger `category` (en string) i stedet for et numerisk id — men selve `404`\-tjekket (`find()`, så `if (!x) { ... }`) er identisk.
- `POST /messages` har allerede et valideringstjek for et tomt spørgsmål, fra øvelse 6 — det skal bare have `.status(400)` tilføjet.
- `POST /answers` og `PUT /answers/:category` har ingen validering endnu — tilføj den.
- `try`/`catch` skal om `loadMessages()` og `loadAnswers()` i deres respektive data-moduler.
- 404-catch-all'en og fejl-middlewaren tilføjes i AMAbot-serverens `server.js` — der er kun én af hver, uanset hvor mange routere der er monteret.

### 1. Gem udgangspunktet i Git

```bash
git add .
git commit -m "Save AMAbot before transferring status codes and error handling"
git push
```

---

### 2. Statuskoder, 404 og 400 på /messages og /answers

**Prøv det først:** send `PUT http://localhost:3000/answers/findes-ikke` med en body, og `POST http://localhost:3000/answers` med `{ "category": "test" }` — uden `keywords` og `answer`. Den første giver Express' HTML-fejlside, den anden opretter en halv regel. Slet den igen med `DELETE /answers/test`.

Gennemgå `/messages` og `/answers` med samme blik som `/students`/`/teachers`: hvor mangler en eksplicit `201`/`204`? Hvor kan `find()` returnere `undefined`? Hvor mangler der et tjek for, om `request.body` faktisk indeholder det nødvendige?

#### Test trin 2

Kør hele `/messages`\- og `/answers`\-flowet igennem i Thunder Client, inklusive et ugyldigt `category` og en ufuldstændig body. Bekræft `201`/`204`/`404`/`400`, hvor de hører hjemme.

> Har du en frontend fra [øvelse 8](fetch-dom-amabot.md), viser Network-fanen nu `201` på `POST /messages` og `204` på `DELETE /messages`, hvor øvelse 8 bad dig bekræfte `200`. Det er forventet — frontenden virker uændret, fordi `fetch()` behandler alle 2xx-koder som succes.

---

### 3. try/catch og fejl-middleware i AMAbotten

**Prøv det først:** omdøb midlertidigt `data/messages.json`, send `GET /messages`, og se Express' fejlside med `ENOENT`. Send også `GET /noget-der-ikke-findes`. Giv filen dens rigtige navn tilbage.

Tilføj `try`/`catch` om `loadMessages()` og `loadAnswers()`, og montér en 404-catch-all og en fælles fejl-middleware nederst i AMAbot-serverens `server.js`.

#### Test trin 3

Omdøb midlertidigt en af jeres datafiler, og bekræft at I får et rent JSON-fejlsvar med `500`, i stedet for Express' fejlside. Giv filen dens rigtige navn og indhold tilbage bagefter.

## Tjekpunkt: Del 1

Del 1 er gennemført, når din AMAbot håndterer statuskoder, `404`, `400`, `try`/`catch` og en fælles fejl-middleware på præcis samme måde, som `/students` og `/teachers` gør i [REST API-øvelse: Fejlhåndtering](express-rest-api-fejlhaandtering.md).

---

## Del 2: Sikkerhed — CORS og XSS

Disse to rettelser er nye — der er intet at overføre fra `/students`/`/teachers`, som hverken har en frontend eller gemmer fri tekst fra en bruger.

### 4. CORS: begræns til jeres egen frontend

**Prøv det først** — men kun hvis du har `app.use(cors())` fra [øvelse 8](fetch-dom-amabot.md). Har du ikke, blokerer browseren allerede alle andre origins, og der er intet at ødelægge endnu; spring direkte videre.

Åbn en side på en *anden* origin end jeres frontend, åbn DevTools-konsollen dér, og kør `fetch("http://localhost:3000/messages").then(r => r.json()).then(console.log)`. Den virker — I får jeres beskeder tilbage, selvom kaldet kommer fra et helt fremmed sted. Det er det, I retter i dette trin.

- **Den nemmeste fremmede origin:** åbn jeres frontend på `http://localhost:5500` i stedet for `http://127.0.0.1:5500`. Det er samme side og samme computer — men en **anden origin**, fordi værtsnavnet er et andet. Browseren sammenligner origins som tekst, ikke som "hvor peger det hen".
- **Alternativt:** brug en vilkårlig offentlig hjemmeside. Spørger Chrome, om siden må få adgang til enheder på dit lokale netværk, så klik *Tillad* — ellers fejler kaldet af en helt anden grund end CORS.

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

Ingen af disse tests kræver, at I har bygget frontenden i øvelse 8 — kun at serveren kører.

1. **I Thunder Client:** send `GET http://localhost:3000/messages`, og tilføj selv en header `Origin: http://127.0.0.1:5500` (den adresse, jeres frontend kører eller kommer til at køre på). Kig i response-headers efter `Access-Control-Allow-Origin` — den skal matche. Skift nu headeren til `Origin: http://example.com`, og send igen. `Access-Control-Allow-Origin` står der stadig — men den siger `http://127.0.0.1:5500`, ikke `http://example.com`. Serveren fortæller altså, hvilken origin der må læse svaret, og en browser på `example.com` ville afvise det. Alligevel lykkes requesten stadig med `200` i Thunder Client, med præcis samme data som før. Det er selve pointen: CORS er noget **browseren** håndhæver på selve JavaScript-kaldet, ikke noget serveren nogensinde nægter at svare på — Thunder Client er ikke en browser, så den er ligeglad med, hvad headeren siger.
2. **Gentag "Prøv det først" fra oven,** fra en fremmed origin — `http://localhost:5500` eller en offentlig hjemmeside, som beskrevet under "Prøv det først": kør `fetch("http://localhost:3000/messages").then(r => r.json()).then(console.log)` igen. Den skal nu fejle med en CORS-fejl i konsollen — havde du `cors()` fra øvelse 8, er det modsat før, hvor den samme request virkede. Og modsat Thunder Client i punkt 1, hvor requesten stadig altid lykkes.

**Har du en frontend kørende fra øvelse 8?** Så også:

3. Genindlæs den, og bekræft at den stadig henter og viser beskeder uden fejl i konsollen.
4. Ødelæg det med vilje: sæt midlertidigt `origin` til noget forkert, fx `"http://example.com"`, genstart serveren, og genindlæs frontenden igen. Den skal nu selv fejle med en CORS-fejl — selvom det er jeres egen frontend, og selvom I ikke har ændret en linje i den. Sæt `origin` tilbage til `"http://127.0.0.1:5500"`, genstart, og bekræft at frontenden virker igen.

---

### 5. XSS: escapeHtml() i POST /messages

Lige nu gemmer og sender `POST /messages` både `question` og AMAbottens svar helt uredigeret. Svaret er lige så vigtigt at rense som spørgsmålet: `/answers` har ingen adgangskontrol, så enhver, der kan kalde `POST /answers`/`PUT /answers/:category`, kan lige nu plante et svar med HTML i — og det svar bliver vist til *alle*, der senere stiller et spørgsmål, der matcher, ikke kun den, der oprettede det. Det gør det til et endnu mere alvorligt hul end selve spørgsmålet, som kun rammer afsenderen selv.

**Prøv det først:** send `POST http://localhost:3000/messages` i Thunder Client med body `{ "question": "<img src=x onerror=\"alert('hacked')\">" }`. Åbn `data/messages.json` — teksten ligger der præcis, som den blev sendt, som rå HTML. Har du en frontend fra [øvelse 8](fetch-dom-amabot.md), så genindlæs den: `insertAdjacentHTML()` tolker teksten som HTML, billedet fejler med vilje, og `alert('hacked')` kører — i din browser, selvom det var "bare" et spørgsmål. Og den kører igen, hver gang siden genindlæses, fordi beskeden nu er gemt på serveren.

Tilføj en lille hjælpefunktion i den fil, hvor jeres `POST /messages`\-logik bor (`routes/messages.js`, eller `controllers/messagesController.js`, hvis du lavede det valgfrie punkt 5 i øvelse 7):

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

Brug den nu på **både** spørgsmål- og svar-beskeden i `POST /messages`. Find:

```js
const message = { type: "question", text: question, createdAt: new Date().toISOString() };
```

og ret den til:

```js
const message = { type: "question", text: escapeHtml(question), createdAt: new Date().toISOString() };
```

Find derefter, hvor svar-beskeden oprettes — noget i stil med:

```js
const answerMessage = { type: "answer", text: result.answer, createdAt: new Date().toISOString() };
```

og ret den til:

```js
const answerMessage = { type: "answer", text: escapeHtml(result.answer), createdAt: new Date().toISOString() };
```

#### Test trin 5

Ryd først den gamle, uescapede besked fra "Prøv det først" med `DELETE http://localhost:3000/messages` — ellers ligger den stadig i `data/messages.json` og kører igen i frontenden, selvom rettelsen virker. `escapeHtml()` beskytter kun det, der gemmes fra nu af.

Send derefter samme angreb igen: `POST http://localhost:3000/messages` med body `{ "question": "<img src=x onerror=\"alert('hacked')\">" }`. Åbn `data/messages.json`, og bekræft at teksten nu er gemt som `&lt;img src=x onerror=...&gt;` i stedet for rå HTML. Har du en frontend, så genindlæs den: spørgsmålet vises nu som almindelig tekst, præcis som det blev skrevet, og der kommer ingen `alert`. Send til sidst et almindeligt spørgsmål, og bekræft at det stadig fungerer som før.

Test derefter den anden vej: opret en ny svarregel via `POST /answers` med HTML i `answer`, fx `{ "category": "test", "keywords": ["test"], "answer": "<b>hej</b>" }`. Spørg AMAbotten om noget, der matcher (`POST /messages` med `"question": "test"`), og bekræft at svaret i `data/messages.json` også er escapet. Slet testreglen igen med `DELETE /answers/test` bagefter.

## Tjekpunkt: Del 2

Del 2 er gennemført, når `cors()` kun tillader jeres egen frontends origin, og `POST /messages` escaper både `question` og AMAbottens svar, før de gemmes.

---

## Reflektér over din læring

Når du er færdig, skal du gerne kunne forklare:

1. Hvor meget af mønsteret fra `/students`/`/teachers` kunne du genbruge uændret på `/messages` og `/answers`, og hvor meget skulle du selv tilpasse?
2. `/messages` fik intet `404`\-tjek, mens `/answers/:category` fik. Hvad var det ved `/messages`, der gjorde den forskel indlysende?
3. Hvorfor betyder `cors({ origin: "..." })` noget for en browser, men intet for Thunder Client eller en almindelig `curl`\-kommando?
4. `escapeHtml()` kører på både `question` og svaret, før de gemmes på serveren — hvorfor er svaret mindst lige så vigtigt at rense, når `/answers` ikke har nogen adgangskontrol? Hvad ville der ske, hvis I i stedet ventede med at rense teksten, til den blev vist i en klient? Er der en fordel ved at gøre det på serveren?
5. Peg på ét sted i din kode, hvor en fejl nu ender som `{ error: "..." }`, uanset om den kom fra et `404`\-, `400`\- eller `500`\-svar.

## Videre

Din AMAbot håndterer nu de samme typer fejl, et rigtigt REST API bør: forudsigelige tjek (`404`/`400`), uventede fejl (`try`/`catch` og en fælles fejl-middleware), og to sikkerhedshuller lukket (`cors()` begrænset til jeres egen frontend, og både spørgsmål og svar renset for HTML, før de gemmes). Brug gerne de samme mønstre — eksplicitte statuskoder, tjek før I handler, `try`/`catch` om det, der kan fejle uforudsigeligt — når I snart går videre til jeres eget projekt.
