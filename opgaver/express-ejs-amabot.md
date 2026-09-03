# Øvelse 3: Server-renderet AMAbot med regelbaseret svarlogik

I har allerede et GitHub-repository med en simpel AMAbot-formular i `index.html` fra i går. Nu bygger I videre på **det samme repository** og gør det til en server-renderet Express-app med EJS.

AMAbot betyder *Ask Me Anything-bot*. Den svarer på spørgsmål om jer selv ud fra regler, arrays og objekter — ikke kunstig intelligens. I beholder jeres eget design, CSS og billeder. Det nye er, at Express modtager spørgsmålet, vælger et svar og lader EJS generere den næste HTML-side.

Skriv og test ét trin ad gangen. I får små kodeudsnit, der bygges oven på hinanden, frem for en færdig løsning fra begyndelsen.

## Det bygger du

```text
Browser -> POST /ask -> request.body.question -> validation -> findAnswer()
        -> conversation array -> response.render() -> EJS -> HTML
```

Når øvelsen er færdig, kan din AMAbot:

- beholde sit eksisterende visuelle udtryk
- modtage et spørgsmål på `POST /ask`
- vise samtalen med EJS
- vælge et regelbaseret, personligt svar
- afvise et tomt eller for langt spørgsmål

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

Åbn derefter `package.json`, og tilføj de samme felter som i øvelse 2:

```json
"type": "module",
"scripts": {
  "dev": "node --watch server.js",
  "start": "node server.js"
}
```

> Tilføj felterne i den eksisterende JSON-fil. Du skal ikke erstatte hele `package.json`, og der må kun være ét `scripts`-felt.

### Test trin 2

Kontrollér, at `express` og `ejs` står under `dependencies`, og at både `npm run dev` og `npm start` findes under `scripts`.

---

## 3. Adskil template og statiske filer

Express bruger som standard `views/` til EJS-templates. Vi bruger `public/` til filer, serveren blot skal sende videre uændret: CSS, browser-JavaScript, billeder og favicon.

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

Opdatér derefter stierne i `views/index.ejs`, så de starter med `/`:

```html
<link rel="stylesheet" href="/assets/styles/style.css" />
<img src="/assets/images/martinImg.jpg" alt="Billede af Martin" />
```

Et link som `./assets/styles/style.css` tager udgangspunkt i templaten/URL'en. Et link som `/assets/styles/style.css` tager udgangspunkt i `public/`, når vi aktiverer `express.static()` i næste trin.

Hvis jeres gamle `index.js` selv indsætter spørgsmål og svar i browseren, så fjern script-tagget eller den del af koden. I denne øvelse skal serveren og EJS opdatere samtalen.

### Test trin 3

I skal nu have `views/index.ejs` og mindst én fil i `public/` — men serveren kan ikke vise dem endnu.

---

## 4. Start med en server, der renderer jeres template

Opret `server.js` i repositoryets rodmappe. Start med kun denne grundstruktur:

```js
import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.render("index");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

`express.static("public")` betyder, at browseren kan hente fx `/styles.css` og `/assets/images/...`. `response.render("index")` finder `views/index.ejs`, behandler eventuelle EJS-tags og sender resultatet som HTML.

Start serveren:

```bash
npm run dev
```

### Test trin 4

Åbn `http://localhost:3000`. Siden skal ligne jeres gamle version, og CSS samt billeder skal stadig indlæses. Kig i browserens Network-panel: En CSS-fil skal fx have status `200`.

---

## 5. Gør den eksisterende formular til en POST-formular

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

### Test trin 5

Send formularen. I får sandsynligvis `Cannot POST /ask`. Det er forventet: Browseren sender nu rigtigt, men serveren har endnu ingen route til at modtage requesten.

---

## 6. Modtag et spørgsmål og vis det igen

Før Express kan læse formularens data, skal I aktivere middleware. Sæt denne linje **før** jeres routes i `server.js`:

```js
app.use(express.urlencoded({ extended: true }));
```

Tilføj derefter en foreløbig POST-route. Den viser det indsendte spørgsmål som tekst, så I kan kontrollere hele formularflowet uden svarlogik endnu:

```js
app.post("/ask", (request, response) => {
  const question = request.body.question;
  response.send(`You asked: ${question}`);
});
```

### Test trin 6

Indsend et spørgsmål. Browseren skal vise `You asked: ...`. Find `POST /ask` i Network-panelet og kontrollér, at `question` findes under Payload.

---

## 7. Giv EJS de data, templaten skal bruge

Nu skal serveren ikke længere sende en tekst direkte. Den skal sende data til den samme EJS-template hver gang.

Opret arrayet **over** routes i `server.js`:

```js
const conversation = [];
```

Lav en hjælpefunktion under arrayet. Den forhindrer, at GET- og POST-routen senere sender forskellige data til templaten:

```js
function renderAmabot(response, { error = "" } = {}) {
  response.render("index", { conversation, error });
}
```

Erstat GET-routen med:

```js
app.get("/", (request, response) => {
  renderAmabot(response);
});
```

I `views/index.ejs` skal I indsætte dette i det område, hvor jeres design allerede har spørgsmål og svar. Det er en tom samtale nu, så I ser kun introduktionsteksten:

```ejs
<% if (conversation.length === 0) { %>
  <p>No questions yet. Type something below.</p>
<% } %>

<% conversation.forEach((entry) => { %>
  <article class="<%= entry.sender %>">
    <p><%= entry.text %></p>
  </article>
<% }); %>
```

Tilpas `article` og klasserne til jeres eget design. Hvis I vil bruge klasser som `question` og `answer`, er det bedre at gemme dem som data senere end at bruge `sender` direkte som CSS-klasse.

### Test trin 7

Genindlæs `/`. I skal se jeres tomme tilstand, og templaten må ikke fejle med `conversation is not defined`.

---

## 8. Validér spørgsmålet og gem en foreløbig samtale

Erstat den foreløbige POST-route fra trin 6. Denne version afviser tomt input og lægger både spørgsmål og et midlertidigt svar i arrayet:

```js
app.post("/ask", (request, response) => {
  const question = typeof request.body.question === "string"
    ? request.body.question.trim()
    : "";

  if (!question) {
    return renderAmabot(response, { error: "Skriv et spørgsmål, før du sender." });
  }

  conversation.push({ sender: "question", text: question });
  conversation.push({ sender: "answer", text: "Jeg leder efter et svar ..." });

  renderAmabot(response);
});
```

I `views/index.ejs` kan I nu vælge CSS-klasse ud fra `entry.sender`:

```ejs
<article class="<%= entry.sender %>">
  <p><%= entry.text %></p>
</article>
```

Vis også fejlbeskeden tæt ved formularen:

```ejs
<% if (error) { %>
  <p role="alert"><%= error %></p>
<% } %>
```

`<%= ... %>` er escaped output. Det betyder, at indsendt HTML vises som tekst i stedet for at blive fortolket af browseren.

### Test trin 8

Prøv først et tomt spørgsmål og derefter et almindeligt spørgsmål. Forklar, hvorfor `return` efter fejlbeskeden er vigtigt.

---

## 9. Tilføj AMAbottens svarregler

Erstat det midlertidige svar med regler, der handler om jer. Opret dette **over** `renderAmabot`:

```js
const responseRules = [
  {
    keywords: ["navn", "hedder", "hvem er du"],
    answers: ["Jeg hedder Ada. Hvad vil du ellers vide om mig?"]
  },
  {
    keywords: ["bor", "by", "fra"],
    answers: ["Jeg bor i Aarhus."]
  },
  {
    keywords: ["fritid", "hobby", "kan lide"],
    answers: ["I min fritid kan jeg godt lide at læse og gå ture."]
  }
];
```

Tilpas mindst navn, emner og svar, så botten beskriver jer. Tilføj derefter denne funktion under reglerne:

```js
function findAnswer(question) {
  const normalizedQuestion = question.toLowerCase();

  for (const rule of responseRules) {
    const hasMatch = rule.keywords.some((keyword) =>
      normalizedQuestion.includes(keyword)
    );

    if (hasMatch) {
      const index = Math.floor(Math.random() * rule.answers.length);
      return rule.answers[index];
    }
  }

  return "Det kender jeg ikke svaret på endnu.";
}
```

`some()` stopper, så snart ét nøgleord matcher. Det passer godt her, fordi vi kun skal vide, om den aktuelle regel skal bruges.

Til sidst erstatter I kun den midlertidige `answer`-linje i POST-routen:

```js
const answer = findAnswer(question);
conversation.push({ sender: "answer", text: answer });
```

Lad linjen, der gemmer brugerens spørgsmål, blive stående.

### Test trin 9

Test ét spørgsmål for hver regel og et spørgsmål, der ikke matcher noget. Genindlæs siden: Hvorfor ligger samtalen stadig der? Genstart derefter serveren: Hvorfor forsvinder den?

---

## 10. Tilføj en grænse for lange spørgsmål

Sæt denne kontrol efter tjekket for et tomt spørgsmål og før `conversation.push()`:

```js
if (question.length > 280) {
  return renderAmabot(response, {
    error: "Spørgsmålet må højst være 280 tegn."
  });
}
```

Validering afgør, om data må bruges. Normalisering med `trim()` fjerner yderste mellemrum. EJS-escaping med `<%= ... %>` gør output sikkert i HTML-kontekst. Det er tre forskellige opgaver.

### Test trin 10

Test tomt input, et gyldigt spørgsmål, et ukendt spørgsmål og et spørgsmål på mere end 280 tegn. Kontrollér, at ingen af de ugyldige spørgsmål tilføjes til samtalen.

---

## Ekstra udfordringer

- Giv en regel flere svar, så `Math.random()` får en effekt.
- Tilføj en `POST /clear-conversation`-route og en “Ryd samtale”-knap.
- Gem et tidspunkt sammen med hvert `conversation`-objekt og vis det i EJS.
- Undersøg `request.query` med `/debug?name=Ada` og `request.params` med `/debug/:name`. Sammenlign dem med `request.body` fra formularen.

## Tjekpunkt

Din AMAbot er færdig, når den beholder jeres design, viser samtalehistorik, modtager et spørgsmål på `POST /ask`, vælger et regelbaseret svar om dig og håndterer ugyldigt input. Du skal kunne pege på, hvor spørgsmålet modtages, hvor svaret vælges, og hvor EJS genererer HTML.
