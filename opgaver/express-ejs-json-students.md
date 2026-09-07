# JSON-øvelse: Studerende i en JSON-fil

## Kort fortalt

I denne øvelse bygger du en lille, selvstændig server — adskilt fra din AMAbot. Serveren gemmer ikke sine data i en variabel, men i en JSON-fil. Du starter med at læse og vise nogle allerede oprettede studerende, og bygger derefter en formular, der opretter nye. Alt sker med Node.js' File System API.

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

  const remainingStudents = students.filter(
    (student) => student.id !== Number(request.params.id)
  );

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

  const student = students.find(
    (student) => student.id === Number(request.params.id)
  );

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

  const student = students.find(
    (student) => student.id === Number(request.params.id)
  );

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

---

## Videre til øvelse 5

Du har nu bygget en lille CRUD-app, der bruger en JSON-fil som sin eneste datakilde — uden en database. Gå videre til [øvelse 5: Gem AMAbottens chathistorik i en JSON-fil](express-ejs-amabot-persistens.md), og brug samme mønster på din rigtige AMAbot.
