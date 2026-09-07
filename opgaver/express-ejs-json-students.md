# JSON-øvelse: Studerende i en JSON-fil

## Kort fortalt

I denne øvelse bygger du en lille, selvstændig server — adskilt fra din AMAbot. Serveren gemmer ikke sine data i en variabel, men i en JSON-fil. Du starter med at læse og vise nogle allerede oprettede `students`, og bygger derefter en formular, der opretter nye. Alt sker med Node.js' File System API.

> Det er den samme read → modify → write-idé, du skal bruge til at gemme AMAbottens chathistorik i [øvelse 5](express-ejs-amabot-persistens.md). Her træner du idéen på et enklere eksempel først.

## Det bygger du

```text
GET /            -> fs.readFile() -> JSON.parse()                       -> EJS -> HTML

POST /students   -> fs.readFile() -> JSON.parse() -> students.push()
                  -> JSON.stringify() -> fs.writeFile() -> redirect til /
```

Hver route læser filen, ændrer eller viser data, og (ved ændringer) skriver filen igen. Filen er hele tiden den eneste "sandhed" om, hvilke studerende der findes — der er ingen `students`-variabel, der lever videre mellem requests.

---

## 1. Opsætning

Opret et nyt, tomt projekt, ligesom du plejer — det skal ikke ligge inde i din AMAbot:

```bash
mkdir students-json
cd students-json
code .
```

Åbn en terminal i VS Code, og kør:

```bash
npm init -y
npm install express ejs
```

Åbn `package.json`, og tilføj `"type": "module"` samt disse scripts, ligesom i dine tidligere øvelser:

```json
"type": "module",
"scripts": {
  "dev": "node --watch server.js",
  "start": "node server.js"
}
```

Opret `server.js` med en minimal server:

```js
import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.render("index", { students: [] });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

Opret `views/index.ejs`:

```html
<!doctype html>
<html lang="da">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Studerende</title>
  </head>
  <body>
    <h1>Studerende</h1>
  </body>
</html>
```

`express.urlencoded({ extended: true })` er allerede sat op — du kender den fra dine tidligere øvelser, og du skal bruge den, så snart du tilføjer en formular.

### Test trin 1

Start serveren:

```bash
npm run dev
```

Besøg `http://localhost:3000`. Du skal se overskriften "Studerende".

---

## 2. Opret en JSON-fil med udgangsdata

Opret mappen og filen:

```text
students-json/
├── data/
│   └── students.json
├── views/
│   └── index.ejs
├── package.json
└── server.js
```

Skriv præcis dette i `data/students.json`:

```json
[
  { "id": 1, "name": "Aisha", "education": "Multimediedesign" },
  { "id": 2, "name": "Noah", "education": "Datamatiker" }
]
```

> Filen skal indeholde et gyldigt JSON-array, allerede før serveren har rørt den. Læg mærke til, at property-navne og strings står i dobbelte citationstegn — det er JSON, ikke JavaScript.

---

## 3. Læs studerende fra filen

Importer File System API'et øverst i `server.js`:

```js
import fs from "node:fs/promises";
```

Ret GET-routen, så den læser og parser filen, i stedet for at sende et tomt array:

```js
app.get("/", async (request, response) => {
  const data = await fs.readFile("./data/students.json", "utf8");
  const students = JSON.parse(data);

  response.render("index", { students });
});
```

> Routens callback-funktion skal være `async`, fordi `fs.readFile()` er asynchronous, og du bruger `await` på resultatet.

### Test trin 3

Genstart serveren, og genindlæs siden. Kør midlertidigt `console.log(students);` lige under `JSON.parse(data)`, og kontrollér i terminalen, at du får et array med de to studerende fra filen. Fjern loggen igen.

---

## 4. Vis studerende i EJS

Tilføj en liste i `views/index.ejs`, under overskriften:

```ejs
<ul>
  <% for (const student of students) { %>
    <li><%= student.name %> — <%= student.education %></li>
  <% } %>
</ul>
```

### Test trin 4

Genindlæs siden. Du skal se Aisha og Noah i listen, med deres uddannelse.

---

## 5. Tilføj en formular til at oprette en studerende

Tilføj denne formular under listen i `views/index.ejs`:

```html
<form method="POST" action="/students">
  <label for="name">Navn</label>
  <input id="name" name="name" type="text" />

  <label for="education">Uddannelse</label>
  <input id="education" name="education" type="text" />

  <button type="submit">Opret studerende</button>
</form>
```

### Test trin 5

Indsend formularen. Du skal få `Cannot POST /students` — det er forventet, serveren har endnu ingen route til at modtage den.

---

## 6. Modtag formularen, og opret en studerende

Tilføj denne route i `server.js`, før `app.listen()`:

```js
app.post("/students", async (request, response) => {
  const data = await fs.readFile("./data/students.json", "utf8");
  const students = JSON.parse(data);

  const newStudent = {
    id: Date.now(),
    name: request.body.name,
    education: request.body.education
  };

  students.push(newStudent);

  const json = JSON.stringify(students, null, 2);
  await fs.writeFile("./data/students.json", json);

  response.redirect("/");
});
```

> **Read → modify → write, i én route:** Routen læser filens nuværende indhold, laver et nyt studerende-objekt ud fra formularen, tilføjer det med `push()`, og skriver hele arrayet tilbage til filen. `Date.now()` bruges som et simpelt, unikt id — det er et tal, mens `request.body.name` og `request.body.education` begge er strings, ligesom alle andre værdier fra en HTML-formular.
>
> `response.redirect("/")` sender browseren til en ny `GET /`, som læser den opdaterede fil. Det er derfor, du ikke selv skal rendere listen igen her.

### Test trin 6

Opret en studerende gennem formularen. Du skal lande tilbage på forsiden med den nye studerende i listen. Åbn derefter `data/students.json` i editoren — er den nye studerende gemt der, med et `id`, et `name` og en `education`?

---

## 7. Test persistens

1. Opret to nye studerende.
2. Kontrollér, at alle fire studerende vises på siden.
3. Stop serveren med `Ctrl + C`.
4. Start den igen med `npm run dev`.
5. Genindlæs siden.

Er alle fire studerende der stadig?

Hvis ja, har du lavet **persistens** uden overhovedet at bruge en variabel til at holde på dataene mellem requests — filen er hele tiden den eneste sandhed.

---

## Tjekpunkt

Øvelsen er gennemført, når appen:

- læser `data/students.json` og viser studerende med EJS
- opretter en ny studerende via en formular
- skriver den opdaterede liste tilbage til `data/students.json`
- beholder alle studerende efter en genstart af serveren

---

## Ekstraopgaver

<details>
<summary><strong>8. Slet en studerende</strong></summary>

Tilføj en slet-knap for hver studerende i `views/index.ejs`:

```ejs
<li>
  <%= student.name %> — <%= student.education %>
  <form method="POST" action="/students/<%= student.id %>/delete">
    <button type="submit">Slet</button>
  </form>
</li>
```

Tilføj derefter routen i `server.js`:

```js
app.post("/students/:id/delete", async (request, response) => {
  const data = await fs.readFile("./data/students.json", "utf8");
  const students = JSON.parse(data);

  const remainingStudents = students.filter((student) => student.id !== Number(request.params.id));

  const json = JSON.stringify(remainingStudents, null, 2);
  await fs.writeFile("./data/students.json", json);

  response.redirect("/");
});
```

> `:id` i routens sti er en route-parameter — værdien findes bagefter i `request.params.id`, som en string. `.filter()` beholder alle studerende, hvor `id` **ikke** matcher det slettede id. `Number(request.params.id)` er nødvendig, fordi `request.params.id` er en string, mens `student.id` er et tal — uden konverteringen ville `!==`-sammenligningen aldrig matche.

Test: slet en studerende, kontrollér at kun den forsvinder, og genstart serveren for at bekræfte, at sletningen også slog igennem i filen.

</details>

<details>
<summary><strong>9. Redigér en studerende</strong></summary>

Redigering kræver to routes: én der viser en udfyldt formular, og én der modtager ændringen.

Tilføj et redigér-link for hver studerende:

```ejs
<a href="/students/<%= student.id %>/edit">Redigér</a>
```

Tilføj en GET-route, der finder studerenden og viser en ny template, `views/edit.ejs`:

```js
app.get("/students/:id/edit", async (request, response) => {
  const data = await fs.readFile("./data/students.json", "utf8");
  const students = JSON.parse(data);

  const student = students.find((student) => student.id === Number(request.params.id));

  response.render("edit", { student });
});
```

```html
<!doctype html>
<html lang="da">
  <head>
    <meta charset="UTF-8" />
    <title>Redigér studerende</title>
  </head>
  <body>
    <h1>Redigér <%= student.name %></h1>

    <form method="POST" action="/students/<%= student.id %>/edit">
      <label for="name">Navn</label>
      <input id="name" name="name" type="text" value="<%= student.name %>" />

      <label for="education">Uddannelse</label>
      <input id="education" name="education" type="text" value="<%= student.education %>" />

      <button type="submit">Gem ændring</button>
    </form>
  </body>
</html>
```

Tilføj derefter POST-routen, der gemmer ændringen:

```js
app.post("/students/:id/edit", async (request, response) => {
  const data = await fs.readFile("./data/students.json", "utf8");
  const students = JSON.parse(data);

  const student = students.find((student) => student.id === Number(request.params.id));

  student.name = request.body.name;
  student.education = request.body.education;

  const json = JSON.stringify(students, null, 2);
  await fs.writeFile("./data/students.json", json);

  response.redirect("/");
});
```

> `.find()` returnerer selve studerende-objektet — ikke en kopi. Når du ændrer `student.name` og `student.education`, ændrer du derfor objektet, som det stadig ligger inde i `students`-arrayet. Det er derfor, du kan `JSON.stringify(students, ...)` bagefter og få ændringen med, selvom du aldrig kaldte `push()` eller `filter()`.

Test: redigér en studerendes navn og uddannelse, kontrollér at ændringen vises på forsiden, og genstart serveren for at bekræfte, at den er gemt i filen.

</details>

<details>
<summary><strong>10. Flyt læsning og skrivning til to hjælpefunktioner</strong></summary>

Læg mærke til, at alle fire routes (`GET /`, `POST /students`, sletning og redigering) starter eller slutter med de samme par linjer. Saml dem i to funktioner over dine routes:

```js
async function loadStudents() {
  const data = await fs.readFile("./data/students.json", "utf8");
  return JSON.parse(data);
}

async function saveStudents(students) {
  const json = JSON.stringify(students, null, 2);
  await fs.writeFile("./data/students.json", json);
}
```

Erstat derefter `fs.readFile(...)` og `JSON.parse(...)` i alle dine routes med `await loadStudents()`, og erstat `JSON.stringify(...)` og `fs.writeFile(...)` med `await saveStudents(students)`.

Test alle fire routes igen, én ad gangen, for at bekræfte at ingen af dem er gået i stykker under omskrivningen.

> Det er præcis samme idé, du støder på igen som `saveMessages()` i [øvelse 5](express-ejs-amabot-persistens.md).

</details>

<details>
<summary><strong>11. Style siden</strong></summary>

Indtil nu har appen ingen styling. Opret en stylesheet, og lad Express servere den som en statisk fil:

```text
students-json/
├── data/
├── public/
│   └── style.css
├── views/
│   ├── index.ejs
│   └── edit.ejs
├── package.json
└── server.js
```

Tilføj denne linje i `server.js`, ved siden af dine andre `app.use()`-kald:

```js
app.use(express.static("public"));
```

Link stylesheetet i **både** `views/index.ejs` og `views/edit.ejs`, og pak indholdet i en container:

```html
<head>
  ...
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="container">
    <!-- resten af siden -->
  </div>
</body>
```

Byg derefter listen i `views/index.ejs` om til en tabel med en handlings-kolonne, og vis en besked, hvis der ingen studerende er:

```ejs
<% if (students.length === 0) { %>
  <p class="empty">Der er endnu ingen studerende.</p>
<% } else { %>
  <table>
    <thead>
      <tr>
        <th>Navn</th>
        <th>Uddannelse</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <% for (const student of students) { %>
        <tr>
          <td><%= student.name %></td>
          <td><%= student.education %></td>
          <td>
            <div class="actions">
              <a class="btn" href="/students/<%= student.id %>/edit">Redigér</a>
              <form class="inline-form" method="POST" action="/students/<%= student.id %>/delete">
                <button type="submit" class="link danger">Slet</button>
              </form>
            </div>
          </td>
        </tr>
      <% } %>
    </tbody>
  </table>
<% } %>
```

> `students.length === 0` afgør, om tabellen eller tomt-beskeden vises — samme mønster som `<% if (error) { %>` fra øvelse 2 og 3, bare på et array i stedet for en fejltekst.

Pak hvert `<label>`/`<input>`-par ind i en `<div class="form-row">` — både i formularen til at oprette en studerende i `views/index.ejs`, og i redigér-formularen i `views/edit.ejs`:

```html
<div class="form-row">
  <label for="name">Navn</label>
  <input id="name" name="name" type="text" />
</div>
```

Tilføj til sidst denne CSS i `public/style.css`:

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #faf9f6;
  color: #262220;
  line-height: 1.5;
}

.container {
  max-width: 640px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 0.7rem 0;
  border-bottom: 1px solid #ddd6cf;
}

td:last-child,
th:last-child {
  text-align: right;
}

.empty {
  color: #8a8079;
  font-style: italic;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.inline-form {
  display: inline;
}

.btn,
.link {
  border: none;
  background: none;
  font: inherit;
  font-weight: 600;
  color: #a2401f;
  text-decoration: none;
  cursor: pointer;
}

.btn:hover,
.link:hover {
  text-decoration: underline;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1rem;
}

button[type="submit"]:not(.link) {
  padding: 0.5rem 1.1rem;
  border: 1px solid #262220;
  background: none;
  font: inherit;
  cursor: pointer;
}

button[type="submit"]:not(.link):hover {
  background: #262220;
  color: #faf9f6;
}
```

> Læg mærke til `.btn, .link` og `button[type="submit"]:not(.link)`: de to selektorer deler ikke stil ved et tilfælde. "Redigér" og "Slet" er tekst-agtige handlinger inde i en tabelrække, mens "Opret studerende" og "Gem ændring" er de primære knapper i en formular — CSS'en gør den forskel synlig.

Test i browseren: en tom `data/students.json` (`[]`) skal vise tomt-beskeden, mens en liste med studerende skal vise tabellen med fungerende Redigér- og Slet-knapper.

</details>

---

## Videre til øvelse 5

Du har nu bygget en lille CRUD-app, der bruger en JSON-fil som sin eneste datakilde — uden en database. Gå videre til [øvelse 5: Gem AMAbottens chathistorik i en JSON-fil](express-ejs-amabot-persistens.md), og brug samme mønster på din rigtige AMAbot.
