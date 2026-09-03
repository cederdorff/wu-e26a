# Øvelse 3: Server-renderet AMAbot med regelbaseret svarlogik

I har allerede et GitHub-repository med en simpel AMAbot-formular i `index.html` fra i går. Nu bygger I videre på **det samme repository** og gør det til en server-renderet Express-app med EJS.

AMAbot betyder _Ask Me Anything-bot_. Den svarer på spørgsmål om jer selv ud fra regler, arrays og objekter — ikke kunstig intelligens. I beholder jeres eget design, CSS og billeder. Det nye er, at Express modtager spørgsmålet, vælger et svar og lader EJS generere den næste HTML-side.

Skriv og test ét trin ad gangen. I får små kodeudsnit, der bygges oven på hinanden, frem for en færdig løsning fra begyndelsen.

## Sådan arbejder I med koden

Skriv koden selv — kopier ikke bare et helt uddrag ind. Før I ændrer noget, skal I finde det relevante sted i **jeres egen** kode: Er det GET-routen, POST-routen, `views/index.ejs` eller CSS-filen?

Når der står “ret” eller “erstat” i øvelsen, skal I først kunne svare på:

1. Hvilken værdi eller linje har vi allerede?
2. Hvad skal den nye kode ændre eller tilføje?
3. Hvilke variabelnavne skal passe med resten af vores kode?

Skriv derefter ændringen, gem filen og udfør testpunktet. Hvis noget ikke virker, så læs fejlbeskeden og sammenlign `method`, `action`, `name`, route og EJS-variabler. Kodeudsnittene viser mønsteret; I skal tilpasse dem til jeres egen struktur og design.

## Det bygger du

```text
Browser -> POST /ask -> request.body.question -> validering -> findAnswer()
        -> messages array -> response.render() -> EJS -> HTML
```

Det er **server-side rendering (SSR)**: Browseren sender spørgsmålet til serveren, og serveren sender en helt ny HTML-side tilbage. Det er altså ikke JavaScript i browseren, der selv tilføjer en besked til siden.

Når øvelsen er færdig, kan jeres AMAbot:

- beholde sit eksisterende visuelle udtryk
- modtage et spørgsmål på `POST /ask`
- vise samtalen med EJS
- vælge et regelbaseret, personligt svar
- afvise et tomt spørgsmål

---

## 1. Gem HTML-udgangspunktet i Git

Før I ændrer noget, skal I gemme gårsdagens fungerende løsning. Det gør det let at sammenligne før og efter — eller vende tilbage, hvis noget går galt.

```bash
git status
git add index.html
git commit -m "Save HTML AMAbot before Express and EJS"
git push
```

Hvis jeres CSS, billeder eller JavaScript også er en del af gårsdagens løsning, skal de med i committet. Brug `git status` til at kontrollere præcis, hvad I gemmer.

### Test trin 1

Kør `git status` igen. Arbejdsmappen skal være ren, eller I skal kunne forklare de filer, der stadig vises.

---

## 2. Opret Node-projektet

I skal bruge den samme opsætning som i [øvelse 2](express-ejs-formhaandtering-svarlogik.md): ES Modules, et `start`-script og et `dev`-script med watch mode. I arbejder normalt med `npm run dev`; `npm start` bruges til at starte én gang uden automatisk genstart.

Kør i repositoryets rodmappe:

```bash
npm init -y
npm install express ejs
```

Åbn derefter `package.json`. Find det eksisterende `scripts`-felt, og erstat kun det felt med:

```json
"scripts": {
  "dev": "node --watch server.js",
  "start": "node server.js"
}
```

Tilføj også denne linje på øverste niveau i objektet, fx lige efter `"version"`:

```json
"type": "module",
```

Behold resten af filen, herunder `dependencies`, som `npm install` netop har tilføjet. Husk kommaet efter en property, når der kommer en ny linje efter den.

### Test trin 2

Kontrollér, at `express` og `ejs` står under `dependencies`, og at både `npm run dev` og `npm start` findes under `scripts`.

---

## 3. Adskil template og statiske filer

Express bruger som standard `views/` til EJS-templates. Vi bruger `public/` til lokale filer, serveren blot skal sende videre uændret: CSS, browser-JavaScript, billeder og favicon.

Opret mapperne og flyt jeres filer. Strukturen afhænger af jeres oprindelige projekt. Her er to typiske eksempler:

```text
index.html                 ->  views/index.ejs
styles.css                 ->  public/styles.css
index.js                   ->  public/index.js
favicon.ico                ->  public/favicon.ico
```

```text
index.html                 ->  views/index.ejs
assets/styles/style.css    ->  public/assets/styles/style.css
assets/images/             ->  public/assets/images/
```

Opdatér derefter stierne til **lokale filer** i `views/index.ejs`, så de starter med `/`:

```html
<link rel="stylesheet" href="/assets/styles/style.css" />
<img src="/assets/images/martinImg.jpg" alt="Billede af Martin" />
```

Et link som `./assets/styles/style.css` tager udgangspunkt i templaten/URL'en. Et link som `/assets/styles/style.css` tager udgangspunkt i `public/`, når vi aktiverer `express.static()` i næste trin.

Eksterne links, fx til Google Fonts eller Font Awesome, skal ikke flyttes til `public/` og skal beholde deres fulde `https://...`-adresse.

Hvis jeres gamle `index.js` selv indsætter spørgsmål og svar i browseren, så fjern script-tagget eller den del af koden. I denne øvelse skal serveren og EJS opdatere samtalen.

### Test trin 3

I skal nu have `views/index.ejs` og mindst én fil i `public/` — men serveren kan ikke vise dem endnu.

---

## 4. Lad Express servere jeres statiske filer

`express.static()` er nyt i denne øvelse. Det er middleware, som giver browseren adgang til filerne i `public/`. Uden det kan Express godt rendere en EJS-template, men browseren kan ikke hente dens CSS, billeder eller favicon.

Opret `server.js` i repositoryets rodmappe med denne mindste server:

```js
import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

`express.static("public")` betyder: Når browseren beder om en fil, leder Express i `public/`. Filen `public/styles.css` kan derfor hentes på URL'en `/styles.css`, og `public/assets/images/me.jpg` kan hentes på `/assets/images/me.jpg`.

Start serveren:

```bash
npm run dev
```

### Test trin 4

Åbn URL'en til en af jeres flyttede filer, fx `http://localhost:3000/styles.css` eller `http://localhost:3000/assets/styles/style.css`. Browseren skal vise CSS-filen. I Network-panelet skal requesten have status `200`.

---

## 5. Render jeres EJS-template

Nu kan browseren allerede hente jeres assets. Tilføj EJS-konfigurationen og GET-routen **over** `app.listen()` i den server, I lige har lavet:

```js
app.set("view engine", "ejs");

app.get("/", (request, response) => {
  response.render("index");
});
```

`response.render("index")` finder `views/index.ejs`, behandler eventuelle EJS-tags og sender resultatet som HTML. CSS og billeder hentes derefter i separate requests, som `express.static("public")` tager sig af.

### Test trin 5

Åbn `http://localhost:3000`. Siden skal ligne jeres gamle version, og CSS samt billeder skal stadig indlæses. Kig i Network-panelet: både HTML-siden og en CSS-fil skal have status `200`.

---

## 6. Gør den eksisterende formular til en POST-formular

Behold jeres layout og klasser, men ret formularens vigtige attributter. Kode- og route-navne er på engelsk:

```html
<form method="POST" action="/ask">
  <label for="question">Stil dit spørgsmål her:</label>
  <input id="question" name="question" type="text" />
  <button type="submit">Send</button>
</form>
```

- `method="POST"` sender data i requestens body.
- `action="/ask"` skal passe præcist til serverens POST-route senere.
- `name="question"` bliver til `request.body.question` på serveren.
- `for="question"` og `id="question"` forbinder label og felt.

> `type="textarea"` er ikke en gyldig inputtype. Hvis I vil have et felt med flere linjer, så brug `<textarea id="question" name="question"></textarea>` i stedet.

### Test trin 6

Send formularen. I får sandsynligvis `Cannot POST /ask`. Det er forventet: Browseren sender nu rigtigt, men serveren har endnu ingen route til at modtage requesten.

---

## 7. Modtag et spørgsmål og vis det igen med EJS

Før Express kan læse formularens data, skal I aktivere middleware. Sæt denne linje **før** jeres routes i `server.js`:

```js
app.use(express.urlencoded({ extended: true }));
```

Middleware er kode, Express kører før en route. Her læser den formularens POST-data og gør dem tilgængelige i `request.body`. Uden denne linje kan POST-routen ikke finde `request.body.question`.

Tilføj derefter en foreløbig POST-route. Den renderer jeres EJS-template igen med det indsendte spørgsmål:

```js
app.post("/ask", (request, response) => {
  const question = request.body.question;
  response.render("index", { question });
});
```

EJS-koden skal have adgang til `question`, hver gang templaten renderes. Ret derfor også GET-routen midlertidigt:

```js
app.get("/", (request, response) => {
  response.render("index", { question: "" });
});
```

Indsæt dette under formularen i `views/index.ejs`:

```ejs
<% if (question) { %>
  <article class="question">
    <p><%= question %></p>
  </article>
<% } %>
```

`{ question }` i `response.render()` gør variablen `question` tilgængelig i EJS. `<% if (question) { %>` viser kun HTML-stykket, når brugeren faktisk har sendt et spørgsmål. `<%= question %>` skriver spørgsmålet som escaped tekst i den færdige HTML.

### Test trin 7

Indsend et spørgsmål. Det skal vises på siden med jeres `question`-styling. Find `POST /ask` i Network-panelet og kontrollér, at `question` findes under Payload.

---

## 8. Gem og vis simple beskeder

Nu skal vi gøre ét spørgsmål til en lille historik. Først er hver besked kun en tekst i et array (lidt som vi gjorde med `names`i foregående øvelse). Vi venter med svar, typer, styling og validering, så I kan følge den ene nye idé: `push()` gemmer tekst i `messages`, og EJS viser alle teksterne igen.

Opret arrayet **over** routes i `server.js`:

```js
const messages = [];
```

`messages` er AMAbottens samtalehistorik, mens serveren kører. I dette trin indeholder arrayet kun spørgsmål som tekst.

Arrayet ligger på serveren — ikke i browseren. Derfor er beskederne stadig der ved en genindlæsning, men forsvinder, når serveren genstarter. Senere kan en database gemme data permanent.

Tilpas GET-routen med:

```js
app.get("/", (request, response) => {
  response.render("index", { messages });
});
```

I `views/index.ejs` skal I **erstatte den midlertidige `question`-blok fra trin 7** med dette:

```ejs
<% for (const message of messages) { %>
  <p><%= message %></p>
<% } %>
```

Tilpas også POST-routen fra trin 7 med:

```js
app.post("/ask", (request, response) => {
  const question = request.body.question;

  messages.push(question);

  response.render("index", { messages });
});
```

`messages.push(question)` lægger det nyeste spørgsmål sidst i arrayet. EJS-looppet laver ét `<p>` for hver tekst i arrayet. `<%= message %>` skriver teksten som escaped HTML.

### Test trin 8

Indsend to forskellige spørgsmål. Begge skal vises på siden i den rækkefølge, de blev sendt. Genindlæs derefter siden: Hvorfor er de stadig synlige?

---

## 9. Giv hver besked en type

Nu skal AMAbotten også vise et foreløbigt svar. For at jeres CSS kan kende forskel på et spørgsmål og et svar, ændrer vi hver besked fra en tekst til et objekt med to egenskaber:

```js
{ type: "question", text: question }
```

Først erstatter I EJS-looppet fra trin 8 med:

```ejs
<% for (const message of messages) { %>
  <article class="<%= message.type %>">
    <p><%= message.text %></p>
  </article>
<% } %>
```

Ret derefter kun `messages.push(question)` i POST-routen til disse to linjer:

```js
messages.push({ type: "question", text: question });
messages.push({ type: "answer", text: "Jeg leder efter et svar ..." });
```

Nu bliver `question` og `answer` både data og CSS-klasser. Brug eller tilpas derfor jeres eksisterende styling til fx `.question` og `.answer`.

> Stop og start serveren igen med `npm run dev`, før I tester dette trin. `messages` indeholder stadig tekstværdierne fra trin 8, men nu forventer EJS objekter med `type` og `text`. En genstart tømmer arrayet, så alle nye beskeder får den samme struktur.

### Test trin 9

Indsend et spørgsmål. I skal se både spørgsmålet og det foreløbige svar. Brug DevTools' Elements-panel til at kontrollere, at de to `article`-elementer har klasserne `question` og `answer`.

---

## 10. Tilføj AMAbottens svarregler

Erstat det midlertidige svar med regler, der handler om jer. Opret dette over jeres routes:

```js
const answers = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answer: "Jeg hedder Ada. Hvad vil du ellers vide om mig?"
  },
  {
    keywords: ["bor", "by", "fra"],
    answer: "Jeg bor i Aarhus."
  },
  {
    keywords: ["fritid", "hobby", "kan lide"],
    answer: "I min fritid kan jeg godt lide at læse og gå ture."
  }
];
```

Tilpas mindst navn, emner og svar, så botten beskriver jer. Tilføj derefter denne funktion under reglerne:

```js
function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const answerGroup of answers) {
    const hasMatch = answerGroup.keywords.some((keyword) => normalizedQuestion.includes(keyword));

    if (hasMatch) {
      return answerGroup.answer;
    }
  }

  return "Det kender jeg ikke svaret på endnu.";
}
```

`some()` stopper, så snart ét nøgleord matcher. Det passer godt her, fordi vi kun skal vide, om den aktuelle regel skal bruges.

Hvert element i `answers` er et objekt: `keywords` fortæller, hvilke ord der kan udløse svaret, og `answer` er teksten, AMAbotten skal sende tilbage. `findAnswer()` gennemgår objekterne ét ad gangen og returnerer det første match.

Til sidst erstatter I linjen, der tilføjer det foreløbige svar, i POST-routen:

```js
const answer = findAnswer(question);
messages.push({ type: "answer", text: answer });
```

Lad linjen, der gemmer brugerens spørgsmål, blive stående.

### Test trin 10

Test ét spørgsmål for hver regel og et spørgsmål, der ikke matcher noget. Genindlæs siden: Hvorfor ligger samtalen stadig der? Genstart derefter serveren: Hvorfor forsvinder den?

---

## 11. Vis en fejl ved et tomt spørgsmål

Indtil nu gemmer appen alt, også en tom tekst. Nu tilføjer vi den første valideringsregel.

Selv hvis I senere tilføjer `required` til HTML-feltet, skal serveren stadig validere. En browser kan omgås, men serveren bestemmer altid, hvilke data der må gemmes i `messages`.

GET-routen skal også sende en tom fejltekst, fordi EJS snart skal kunne vise `error` både efter GET- og POST-requests:

```js
app.get("/", (request, response) => {
  response.render("index", { messages, error: "" });
});
```

I POST-routen skal I ændre den første linje til:

```js
const question = request.body.question.trim();
```

Sæt derefter dette **før** den første `messages.push(...)`:

```js
if (!question) {
  return response.render("index", {
    messages,
    error: "Skriv et spørgsmål, før du sender."
  });
}
```

Ret også POST-routens sidste render til:

```js
response.render("index", { messages, error: "" });
```

Vis fejlbeskeden tæt ved formularen i `views/index.ejs`:

```ejs
<% if (error) { %>
  <p role="alert"><%= error %></p>
<% } %>
```

`return` stopper POST-routen, så den tomme besked ikke bliver lagt i `messages`.

### Test trin 11

Indsend først et tomt spørgsmål og derefter et almindeligt spørgsmål. Kun det almindelige spørgsmål og svaret skal tilføjes til historikken.

---

## Tjekpunkt

Jeres AMAbot har nu den grundlæggende funktionalitet. Den er færdig, når den beholder jeres design, viser samtalehistorik, modtager et spørgsmål på `POST /ask`, vælger et regelbaseret svar om jer og håndterer et tomt spørgsmål.

I skal kunne pege på, hvor spørgsmålet modtages, hvor svaret vælges, og hvor EJS genererer HTML.

---

## Ekstra opgaver

Vælg én opgave ad gangen. De bygger oven på den fungerende AMAbot, så I altid kan gå tilbage til et klart udgangspunkt.

### 12. Tilføj en grænse for lange spørgsmål

Sæt denne kontrol efter tjekket for et tomt spørgsmål og før `messages.push()`:

```js
if (question.length > 280) {
  return response.render("index", {
    messages,
    error: "Spørgsmålet må højst være 280 tegn."
  });
}
```

Validering afgør, om data må bruges. Normalisering med `trim()` fjerner yderste mellemrum. EJS-escaping med `<%= ... %>` gør output sikkert i HTML-kontekst. Det er tre forskellige opgaver.

### Test trin 12

Test tomt input, et gyldigt spørgsmål, et ukendt spørgsmål og et spørgsmål på mere end 280 tegn. Kontrollér, at ingen af de ugyldige spørgsmål tilføjes til samtalen.

---

### 13. Sanitér uønskede kontroltegn

Valideringen afgør, om spørgsmålet må bruges. Sanitering ændrer selve inputtet. Som et enkelt eksempel kan I fjerne usynlige kontroltegn, der ikke hører hjemme i et almindeligt spørgsmål.

Tilføj funktionen over routes:

```js
function sanitizeQuestion(input) {
  return input.replace(/[\u0000-\u001F\u007F]/g, "");
}
```

Ret derefter begyndelsen af POST-routen, så sanitering og `trim()` sker i den rækkefølge:

```js
const rawQuestion = request.body.question;
const question = sanitizeQuestion(rawQuestion).trim();
```

Her antager vi, at formularen sender feltet `question`, fordi den selv er bygget med `name="question"`. Det er den samme aftale mellem formular og server, som I har brugt gennem hele øvelsen.

- **Validering** afgør, om input må bruges, fx om spørgsmålet er tomt eller for langt.
- **Sanitering** ændrer input ved at fjerne bestemte uønskede tegn.
- **EJS-escaping** med `<%= ... %>` gør værdien sikker at skrive i HTML-kontekst.

De tre begreber løser forskellige problemer. Forsøg ikke at lave et hjemmelavet “XSS-filter” ved at fjerne ord som `script` eller tegnet `<`; brug fortsat EJS' escaped output til brugerdata.

### Test trin 13

Kontrollér igen, at almindelige spørgsmål og fejlbeskeder virker. Prøv også teksten `<strong>Hej</strong>`: Den skal vises som tekst og må ikke blive til fed HTML.

---

### Flere udvidelser

- Giv en regel flere mulige svar. Skift fx dens `answer`-tekst til et array, og vælg ét element med `Math.random()`.
- Tilføj en `POST /clear-messages`-route og en “Ryd beskeder”-knap.
- Gem et tidspunkt på hvert objekt i `messages`, og vis det i EJS.
- Undersøg `request.query` med `/debug?name=Ada` og `request.params` med `/debug/:name`. Sammenlign dem med `request.body` fra formularen.
