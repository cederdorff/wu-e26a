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

> **`express.static()`:** `express.static()` er middleware, som giver browseren adgang til filerne i en mappe. Uden det kan Express godt rendere en EJS-template, men browseren kan ikke hente dens CSS, billeder eller favicon. `app.use(express.static("public"))` betyder: Når browseren beder om en fil, leder Express i `public/`. Filen `public/styles.css` kan derfor hentes på URL'en `/styles.css`, og `public/assets/images/me.jpg` kan hentes på `/assets/images/me.jpg`.

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

Nu skal vi gøre ét spørgsmål til en lille historik. Først er hver besked kun en tekst i et array (lidt som vi gjorde med `names` i foregående øvelse). Vi venter med svar, typer, styling og validering, så I kan følge den ene nye idé: `push()` gemmer tekst i `messages`, og EJS viser alle teksterne igen.

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

Nu skal AMAbotten også vise et foreløbigt svar. For at jeres CSS kan kende forskel på et spørgsmål og et svar, ændrer vi hver besked fra en tekst til et objekt med to faste egenskaber:

```js
{ type: "question", text: question }
```

> Brug præcis egenskabsnavnene `type` og `text` — ikke jeres egne navne. EJS-loopet nedenfor slår direkte op på `message.type` og `message.text`, så alle beskeder skal have samme struktur for at kunne vises.

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

Nu bliver `question` og `answer` både data og CSS-klasser. Brug tid på at style `.question` og `.answer`, så de to typer faktisk ser forskellige ud — fx forskellig baggrundsfarve, eller spørgsmål og svar justeret til hver sin side. Det er det samme skel, jeres kode allerede laver med `message.type`; nu skal øjet kunne se det samme.

> Stop og start serveren igen med `npm run dev`, før I tester dette trin. `messages` indeholder stadig tekstværdierne fra trin 8, men nu forventer EJS objekter med `type` og `text`. En genstart tømmer arrayet, så alle nye beskeder får den samme struktur.

### Test trin 9

Indsend et spørgsmål. I skal se både spørgsmålet og det foreløbige svar. Brug DevTools' Elements-panel til at kontrollere, at de to `article`-elementer har klasserne `question` og `answer` — og med det blotte øje kunne se, hvilken besked der er hvilken, uden at kigge i koden.

---

## 10. Definér AMAbottens svarregler (data)

Nu skal du erstatte de midlertidige svar med svar fra et foruddeffineret array. Start med data alene (arrayet), før I rører routen eller nogen logik. Opret dette over jeres routes:

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

Tilpas mindst navn, emner og svar, så botten beskriver jer.

> **Array af objekter:** `answers` er et array, ligesom `messages`. Men hvert element er selv et objekt med to egenskaber: `keywords` er et array af ord, der kan udløse svaret, og `answer` er teksten, AMAbotten skal sende. Det er den samme objekt-notation, I brugte til `{ type: "question", text: question }` i forrige trin — bare med andre egenskaber.

### Test trin 10

Sæt midlertidigt `console.log(answers.length);` lige under arrayet, og genstart serveren med `npm run dev`. Terminalen skal vise antallet af regler, I har skrevet. Det bekræfter, at objektet er skrevet korrekt, før I bruger det i næste trin. Fjern loggen igen.

---

## 11. Skriv findAnswer()

Nu skal I bruge dataene fra forrige trin — men endnu ikke røre POST-routen. Tilføj denne funktion under `answers`:

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

> **`.some()`:** `.some()` gennemgår et array og returnerer `true`, så snart ét element opfylder betingelsen — ellers `false`. `findAnswer()` bruger den til at spørge: matcher mindst ét af reglens `keywords` spørgsmålet (efter `toLowerCase()`, så store/små bogstaver ikke tæller)? Ved første match returnerer funktionen `answerGroup.answer` med det samme; ellers fortsætter `for`-loopet til næste regel, og returnerer standardteksten, hvis ingen regler matcher.

### Test trin 11

Sæt midlertidigt denne linje ind lige under funktionen:

```js
console.log(findAnswer("Hvad hedder du?"));
```

Genstart serveren, og kontrollér i terminalen, at I får det rigtige svar tilbage — uden at have rørt formularen eller routen. Prøv også et spørgsmål, der ikke matcher noget. Fjern loggen igen, når begge dele virker.

---

## 12. Brug findAnswer() i routen

Nu ved I, at `findAnswer()` virker for sig selv. Erstat linjen, der tilføjer det foreløbige svar, i POST-routen:

```js
const answer = findAnswer(question);
messages.push({ type: "answer", text: answer });
```

Lad linjen, der gemmer brugerens spørgsmål, blive stående.

### Test trin 12

Test ét spørgsmål for hver regel og et spørgsmål, der ikke matcher noget — nu gennem formularen. Genindlæs siden: Hvorfor ligger samtalen stadig der? Genstart derefter serveren: Hvorfor forsvinder den?

---

## 13. Vis en fejl ved et tomt spørgsmål

Indtil nu gemmer appen alt, også en tom tekst. Nu tilføjer vi den første valideringsregel — med samme mønster, som I brugte til navn og alder i [øvelse 2](express-ejs-formhaandtering-svarlogik.md): saml reglerne i én `if`/`else`-kæde, og render til sidst én gang.

Selv hvis I senere tilføjer `required` til HTML-feltet, skal serveren stadig validere. En browser kan omgås, men serveren bestemmer altid, hvilke data der må gemmes i `messages`.

GET-routen skal også sende en tom fejltekst, fordi EJS snart skal kunne vise `error` både efter GET- og POST-requests:

```js
app.get("/", (request, response) => {
  response.render("index", { messages, error: "" });
});
```

Byg derefter POST-routen om til dette:

```js
app.post("/ask", (request, response) => {
  const question = request.body.question.trim();
  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else {
    messages.push({ type: "question", text: question });
    const answer = findAnswer(question);
    messages.push({ type: "answer", text: answer });
  }

  response.render("index", { messages, error });
});
```

> `let error = ""` starter uden fejl, ligesom i øvelse 2. `if`-sætningen sætter kun en fejltekst, når spørgsmålet mangler. De to `push`-linjer flytter ind i `else`, så et tomt spørgsmål aldrig når frem til `messages`. Routen renderer til sidst kun én gang, med de aktuelle `messages` og `error` — uanset om der var en fejl eller ej.

Vis fejlbeskeden tæt ved formularen i `views/index.ejs`:

```ejs
<% if (error) { %>
  <p role="alert"><%= error %></p>
<% } %>
```

### Test trin 13

Indsend først et tomt spørgsmål og derefter et almindeligt spørgsmål. Kun det almindelige spørgsmål og svaret skal tilføjes til historikken.

---

## Tjekpunkt

Jeres AMAbot har nu den grundlæggende funktionalitet. Den er færdig, når den beholder jeres design, viser samtalehistorik, modtager et spørgsmål på `POST /ask`, vælger et regelbaseret svar om jer og håndterer et tomt spørgsmål.

I skal kunne pege på, hvor spørgsmålet modtages, hvor svaret vælges, og hvor EJS genererer HTML.

---

## Ekstra opgaver

Trin 14, sanitering, er en del af dagens forventede produkt — lav den først. Opgave 15–20 er bonusopgaver: Vælg frit imellem dem, hvis I når længere, og de bygger ikke nødvendigvis på hinanden i rækkefølge.

### 14. Sanitér uønskede kontroltegn

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

### Test trin 14

Kontrollér igen, at almindelige spørgsmål og fejlbeskeder virker. Prøv også teksten `<strong>Hej</strong>`: Den skal vises som tekst og må ikke blive til fed HTML.

---

### 15. Tilføj en grænse for lange spørgsmål

I skal tilføje endnu en regel, uden at ændre resten af mønsteret. Indsæt en `else if` i den `if`/`else`-kæde, I skrev i trin 13 — **efter** kontrollen for et tomt spørgsmål og **før** `else` med de to `push`-linjer:

```js
} else if (question.length > 280) {
  error = "Spørgsmålet må højst være 280 tegn.";
} else {
```

> Rækkefølgen er den samme idé som alderskontrollen i øvelse 2: I spørger først “mangler input helt?”, derefter “er input for langt?”, og kun hvis begge svarer nej, må spørgsmålet gemmes.

Validering afgør, om data må bruges. Normalisering med `trim()` fjerner yderste mellemrum. EJS-escaping med `<%= ... %>` gør output sikkert i HTML-kontekst. Det er tre forskellige opgaver.

### Test trin 15

Test tomt input, et gyldigt spørgsmål, et ukendt spørgsmål og et spørgsmål på mere end 280 tegn. Kontrollér, at ingen af de ugyldige spørgsmål tilføjes til samtalen.

---

### 16. Style samtalen som en chat

I trin 9 fik `.question` og `.answer` hver deres udseende. Nu skal I gøre det til et rigtigt chat-layout, hvor spørgsmål og svar sidder hver sin side.

Find (eller opret) det element, der wrapper jeres beskeder — fx en `<section>` uden om EJS-loopet — og gør det til en flex-container:

```css
.messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.question {
  align-self: flex-end;
  background-color: #dbeafe;
}

.answer {
  align-self: flex-start;
  background-color: #f1f5f9;
}
```

`flex-direction: column` stabler beskederne under hinanden i den rækkefølge, de kommer i `messages`-arrayet. `align-self` flytter kun den enkelte besked til højre eller venstre — det er derfor, reglen står på `.question` og `.answer` og ikke på `.messages`.

### Test trin 16

Indsend flere spørgsmål. Spørgsmål og svar skal nu sidde i hver sin side af samtalen, med tydeligt forskellig baggrundsfarve, uden at I har ændret noget i `server.js` eller `index.ejs`.

---

### 17. Giv en regel flere mulige svar

Lige nu har hver regel præcis ét svar. Skift `answer`-egenskaben ud med et array af svar, `answers`, i mindst én af jeres regler:

```js
{
  keywords: ["fritid", "hobby", "kan lide"],
  answers: [
    "I min fritid kan jeg godt lide at læse.",
    "Jeg elsker at gå ture, når vejret tillader det."
  ]
}
```

I `findAnswer()` skal I derefter vælge ét tilfældigt element fra arrayet, i stedet for at returnere `answerGroup.answer` direkte:

```js
const randomIndex = Math.floor(Math.random() * answerGroup.answers.length);
return answerGroup.answers[randomIndex];
```

> `Math.random()` giver et decimaltal mellem 0 (inklusiv) og 1 (eksklusiv). Ganget med `answerGroup.answers.length` og afrundet ned med `Math.floor()` får I et helt indeks, der altid rammer et gyldigt element i arrayet.

Husk at ændre `answer` til `answers` (som array) i **alle** jeres regler, så `findAnswer()` fungerer ens for dem alle.

### Test trin 17

Stil det samme spørgsmål flere gange. Svaret skal variere mellem de tekster, I har skrevet i arrayet.

---

### 18. Tilføj en "Ryd beskeder"-knap

Tilføj en ny route, der tømmer samtalehistorikken:

```js
app.post("/clear-messages", (request, response) => {
  messages.length = 0;
  response.redirect("/");
});
```

> `messages` er erklæret med `const`, så I kan ikke skrive `messages = []`. `messages.length = 0` tømmer i stedet det eksisterende array, uden at oprette et nyt. `response.redirect("/")` sender browseren videre til en ny `GET /`, som renderer siden med det nu tomme array — det er en anden slags respons end `response.render()`, som I har brugt indtil nu.

Tilføj derefter en formular i `views/index.ejs`, fx ved siden af spørgsmålsformularen:

```html
<form method="POST" action="/clear-messages">
  <button type="submit">Ryd beskeder</button>
</form>
```

### Test trin 18

Indsend et par spørgsmål, og klik derefter på “Ryd beskeder”. Samtalen skal forsvinde, og I skal lande tilbage på en tom side.

---

### 19. Gem et tidspunkt på hver besked

Udvid message-objekterne med et tidspunkt, når de bliver oprettet:

```js
messages.push({ type: "question", text: question, createdAt: new Date() });
```

Gør det samme for svaret. Vis derefter tidspunktet i `views/index.ejs`, inde i jeres eksisterende `<article>`:

```ejs
<time><%= message.createdAt.toLocaleTimeString("da-DK") %></time>
```

> `new Date()` gemmer tidspunktet, som beskeden blev oprettet. `.toLocaleTimeString("da-DK")` formaterer det til en læsbar tid i stedet for det fulde dato-objekt.

### Test trin 19

Indsend et par spørgsmål med lidt tid imellem. Hver besked skal have sit eget, forskellige tidspunkt.

---

### 20. Undersøg request.query og request.params

Tilføj disse to midlertidige debug-routes:

```js
app.get("/debug", (request, response) => {
  console.log(request.query);
  response.send(request.query);
});

app.get("/debug/:name", (request, response) => {
  console.log(request.params);
  response.send(request.params);
});
```

Besøg `http://localhost:3000/debug?name=Ada&age=41` og `http://localhost:3000/debug/Ada`, og sammenlign, hvad terminalen og browseren viser.

> `request.query` læser feltnavne fra URL'ens query string (delen efter `?`). `request.params` læser navngivne dele af selve stien, markeret med `:` i routen (her `:name`). `request.body`, som I har brugt gennem hele øvelsen, læser i stedet formularens data fra requestets body via `express.urlencoded()`. De tre bruges til forskellige situationer, selvom de alle ender som almindelige JavaScript-objekter.

### Test trin 20

Prøv begge URL'er, og forklar for en makker, hvilken af de tre — `request.query`, `request.params` eller `request.body` — I ville bruge til AMAbottens spørgsmål, og hvorfor. Fjern derefter de to debug-routes igen, så de ikke bliver en del af jeres endelige app.
