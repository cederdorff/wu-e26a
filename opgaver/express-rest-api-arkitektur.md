# REST API-øvelse: Arkitektur — routes, data, controllers og filtrering

## Kort fortalt

Denne øvelse bygger videre på jeres `students-rest-api`-projekt fra [REST API-øvelse: Studerende med CRUD](express-rest-api-students.md) (Del 1 og Del 2). I har allerede fuld CRUD for `/students`, med data persisteret i `data/students.json`.

I dag tilføjer I en ny ressource, `/teachers`, med præcis samme mønster som `/students` — og bruger det som anledning til at mærke, hvor uoverskuelig `server.js` bliver med to ressourcer i samme fil. Det er motivationen for resten af øvelsen: at dele API'et op i lag.

Begreb: **Separation of Concerns** — når routes, logik og data-adgang alle bor i samme fil, har filen flere ansvar på én gang; det er det, lagene i denne øvelse retter op på.

Øvelsen er delt i seks dele:

- **Del 1** (obligatorisk, hurtig): byg `/teachers` med fuld CRUD, direkte i `server.js` — samme mønster som `/students`-øvelsen fra sidst.
- **Del 2** (obligatorisk): split `/students` og `/teachers` i hver sin routes-fil med `express.Router()`.
- **Del 3** (obligatorisk): flyt data-adgangen (`loadX()`/`saveX()`) ud af routes og ind i sit eget data-modul — den hører ikke hjemme i en routes-fil.
- **Del 4** (obligatorisk): tilføj filtrering, sortering og paginering via query parameters til `GET /students`.
- **Del 5** (frivillig): træk selve route-logikken — inklusive filtrering, sortering og paginering — ud i controllers, så routes kun står for HTTP ind/ud.
- **Del 6** (frivillig): gentag hele progressionen selv, for to nye ressourcer — `/courses` og `/educations`.

Sådan ser projektet ud, når I er igennem de obligatoriske dele (Del 1-4) — routes har både routing og logik, men data-adgangen er lagt i sit eget modul:

```text
students-rest-api/
├── data/
│   ├── students.js             (loadStudents()/saveStudents())
│   ├── students.json
│   ├── teachers.js
│   └── teachers.json
├── routes/
│   ├── students.js             (routing + logik: find, opdatér, filtrér, sortér...)
│   └── teachers.js
├── package.json
└── server.js                   (kun opsætning + montering af routere)
```

Tager I også den frivillige Del 5, får I ét lag mere: routes bliver ren routing, og al logik flytter til `controllers/`:

```text
students-rest-api/
├── controllers/
│   ├── studentsController.js   (logik: find, opret, opdatér, slet, filtrér, sortér...)
│   └── teachersController.js
├── data/
│   ├── students.js             (loadStudents()/saveStudents())
│   ├── students.json
│   ├── teachers.js
│   └── teachers.json
├── routes/
│   ├── students.js             (kun routing: sti -> controller-funktion)
│   └── teachers.js
├── package.json
└── server.js                   (kun opsætning + montering af routere)
```

I bygger jer derhen ét lag ad gangen: Del 2 laver `routes/`, Del 3 laver `data/`, Del 5 laver `controllers/` (Del 4 tilføjer først filtrering, sortering og paginering til det, I allerede har). Hver del har sit eget diagram, der viser præcis hvad der flytter sig.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Samme fremgangsmåde som sidst: prøv altid selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under trinnet — den peger på de rigtige metoder og egenskaber, uden at give dig koden.
2. Åbn først **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller du vil sammenligne med din egen kode.

Spring aldrig en test over, selv når den virker oplagt.

</details>

---

## Del 1: Tilføj teachers til server.js

```text
GET    /teachers       -> loadTeachers()                                    -> response.json(teachers)
GET    /teachers/:id   -> loadTeachers() -> find()                          -> response.json(teacher)
POST   /teachers       -> loadTeachers() -> push()      -> saveTeachers()   -> response.json(newTeacher)
PUT    /teachers/:id   -> loadTeachers() -> find()       -> saveTeachers()  -> response.json(teacher)
DELETE /teachers/:id   -> loadTeachers() -> findIndex() -> splice() -> saveTeachers() -> response.send()
```

> Del 1 er bevidst kort: hele mønsteret — `loadX()`/`saveX()` mod en JSON-fil, og de fem CRUD-routes — er identisk med det, I byggede for `/students` i [studerende-øvelsen fra sidst](express-rest-api-students.md). Der er ingen nye koncepter i Del 1, kun en ny ressource, `teachers`, gennemført med præcis de samme trin. I bygger derfor direkte oven på en JSON-fil denne gang, uden mellemtrinnet med et rent in-memory array — det kender I allerede.

### 1. Opret data/teachers.json

Opret filen, ved siden af `data/students.json`:

```json
[
  { "id": 1, "name": "Mette Nielsen", "subject": "Webudvikling" },
  { "id": 2, "name": "Jonas Berg", "subject": "Design" }
]
```

En teacher har altså `name` og `subject`, ligesom en student har `name` og `education`.

---

### 2. loadTeachers()/saveTeachers() og GET-routes

Tilføj i `server.js`, ved siden af `loadStudents()`/`saveStudents()`:

```js
async function loadTeachers() {
  // TODO: Læs data/teachers.json med fs.readFile() ("utf8"), og parse den til et array.
}

async function saveTeachers(teachers) {
  // TODO: Omdan teachers til formateret JSON-tekst, og skriv den til data/teachers.json.
}

app.get("/teachers", async (request, response) => {
  // TODO: Hent teachers med loadTeachers(), og send dem som JSON.
});

app.get("/teachers/:id", async (request, response) => {
  // TODO: Hent teachers, find den rigtige med find() ud fra request.params.id, og send den som JSON.
});
```

<details>
<summary>Hint</summary>

Kig på `loadStudents()`/`saveStudents()` og `GET /students`/`GET /students/:id` — det er nøjagtig samme opskrift, bare med `teachers` i stedet for `students`, og `data/teachers.json` i stedet for `data/students.json`.

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
async function loadTeachers() {
  const data = await fs.readFile("./data/teachers.json", "utf8");
  return JSON.parse(data);
}

async function saveTeachers(teachers) {
  const json = JSON.stringify(teachers, null, 2);
  await fs.writeFile("./data/teachers.json", json);
}

app.get("/teachers", async (request, response) => {
  const teachers = await loadTeachers();

  response.json(teachers);
});

app.get("/teachers/:id", async (request, response) => {
  const teachers = await loadTeachers();
  const teacher = teachers.find((teacher) => teacher.id === Number(request.params.id));

  response.json(teacher);
});
```

</details>

#### Test trin 2

Send `GET http://localhost:3000/teachers` — I skal se Mette og Jonas. Send derefter `GET http://localhost:3000/teachers/1` — I skal kun få Mette.

---

### 3. POST /teachers

```js
app.post("/teachers", async (request, response) => {
  // TODO: Hent teachers med loadTeachers().
  // TODO: Opret et nyt teacher-objekt ud fra request.body.name og request.body.subject, med et unikt id (fx Date.now()).
  // TODO: Tilføj den til teachers med push(), gem med saveTeachers(), og send den nye teacher som JSON.
});
```

<details>
<summary>Hint</summary>

Samme opskrift som `POST /students`, med `subject` i stedet for `education`.

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
app.post("/teachers", async (request, response) => {
  const teachers = await loadTeachers();

  const newTeacher = {
    id: Date.now(),
    name: request.body.name,
    subject: request.body.subject
  };

  teachers.push(newTeacher);
  await saveTeachers(teachers);

  response.json(newTeacher);
});
```

</details>

#### Test trin 3

Send:

```text
POST http://localhost:3000/teachers
Body (JSON):
{
  "name": "Sara Holm",
  "subject": "Backend"
}
```

Bekræft med `GET /teachers`, og tjek at Sara også er kommet med i `data/teachers.json`.

---

### 4. PUT /teachers/:id

```js
app.put("/teachers/:id", async (request, response) => {
  // TODO: Hent teachers, og find den rigtige, som i GET /teachers/:id.
  // TODO: Opdater teacher.name og teacher.subject med værdierne fra request.body.
  // TODO: Gem den opdaterede liste med saveTeachers(), og send teacheren som JSON.
});
```

<details>
<summary>Se løsningsforslag</summary>

```js
app.put("/teachers/:id", async (request, response) => {
  const teachers = await loadTeachers();
  const teacher = teachers.find((teacher) => teacher.id === Number(request.params.id));

  teacher.name = request.body.name;
  teacher.subject = request.body.subject;

  await saveTeachers(teachers);

  response.json(teacher);
});
```

</details>

#### Test trin 4

Send `PUT http://localhost:3000/teachers/1` med et nyt `subject`. Bekræft ændringen både i responsen og i `data/teachers.json`.

---

### 5. DELETE /teachers/:id

```js
app.delete("/teachers/:id", async (request, response) => {
  // TODO: Hent teachers, fjern den rigtige (findIndex()/splice() eller filter() — din egen løsning fra students-øvelsen).
  // TODO: Gem den opdaterede liste med saveTeachers().
});
```

<details>
<summary>Se løsningsforslag</summary>

```js
app.delete("/teachers/:id", async (request, response) => {
  const teachers = await loadTeachers();
  const index = teachers.findIndex((teacher) => teacher.id === Number(request.params.id));

  teachers.splice(index, 1);
  await saveTeachers(teachers);

  response.send();
});
```

</details>

#### Test trin 5

Slet Sara igen. Bekræft med `GET /teachers` og i `data/teachers.json`, at hun er væk, og at Mette og Jonas stadig er der.

## Tjekpunkt: Del 1

Del 1 er gennemført, når:

- `/teachers` har fuld CRUD, persisteret i `data/teachers.json`, ved siden af `/students`
- `server.js` nu indeholder to sæt næsten identiske routes — kig på filen: hvor mange linjer er den blevet?

Begreb: **DRY (Don't Repeat Yourself)** — læg mærke til hvor meget I lige har kopieret fra students til teachers; det er bevidst her, men det er præcis den slags gentagelse, kode helst ikke skal have for meget af.

---

## Del 2: Split i routes-filer

`server.js` er nu ret uoverskuelig — ti routes, to sæt data-funktioner, alt sammen i én fil. Det retter I nu med `express.Router()`: en slags selvstændig "mini-app" for én ressource, som I monterer på hoved-appen.

```text
Før (efter Del 1):                        Efter (Del 2):

server.js                                 server.js
 ├─ loadStudents()/saveStudents()          ├─ app.use("/students", studentsRouter)
 ├─ loadTeachers()/saveTeachers()          └─ app.use("/teachers", teachersRouter)
 ├─ 5 routes for /students
 └─ 5 routes for /teachers                 routes/students.js
                                            └─ loadStudents()/saveStudents() + 5 routes

                                           routes/teachers.js
                                            └─ loadTeachers()/saveTeachers() + 5 routes
```

Det, en `Router` konkret gør, er at lade jer definere routes uden at kende deres fulde sti — den fulde sti bliver først sat, når I "monterer" routeren i `server.js` med `app.use(sti, router)`. Express lægger simpelthen `sti` foran alt, hvad routeren selv definerer:

```text
server.js                                  routes/students.js
──────────────────────────────             ─────────────────────────
app.use("/students", studentsRouter)  ->   router.get("/", ...)      = GET  /students
                                            router.get("/:id", ...)   = GET  /students/:id
                                            router.post("/", ...)     = POST /students
```

### 6. Opret routes/students.js

Opret mappen `routes/`, og flyt students-delen af `server.js` derover i `routes/students.js`. Rør endnu ikke ved `server.js` — routeren er endnu ikke koblet på noget:

```js
// routes/students.js
import express from "express";
import fs from "node:fs/promises";

const router = express.Router();

async function loadStudents() {
  const data = await fs.readFile("./data/students.json", "utf8");
  return JSON.parse(data);
}

async function saveStudents(students) {
  const json = JSON.stringify(students, null, 2);
  await fs.writeFile("./data/students.json", json);
}

router.get("/", async (request, response) => {
  const students = await loadStudents();

  response.json(students);
});

router.get("/:id", async (request, response) => {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  response.json(student);
});

// TODO: Flyt POST, PUT og DELETE fra server.js herned, på samme måde.
// Husk: app.post("/students", ...) bliver til router.post("/", ...),
// og app.put("/students/:id", ...) bliver til router.put("/:id", ...).

export default router;
```

> Læg mærke til to ting: routeren kender ikke sit eget mount-punkt, så `/students` og `/students/:id` bliver til `/` og `/:id`. Og `loadStudents()`/`saveStudents()` er bare flyttet med — de bor stadig i routes-filen, det retter I i Del 3.

<details>
<summary>Se løsningsforslag: hele routes/students.js</summary>

```js
import express from "express";
import fs from "node:fs/promises";

const router = express.Router();

async function loadStudents() {
  const data = await fs.readFile("./data/students.json", "utf8");
  return JSON.parse(data);
}

async function saveStudents(students) {
  const json = JSON.stringify(students, null, 2);
  await fs.writeFile("./data/students.json", json);
}

router.get("/", async (request, response) => {
  const students = await loadStudents();

  response.json(students);
});

router.get("/:id", async (request, response) => {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  response.json(student);
});

router.post("/", async (request, response) => {
  const students = await loadStudents();

  const newStudent = {
    id: Date.now(),
    name: request.body.name,
    education: request.body.education
  };

  students.push(newStudent);
  await saveStudents(students);

  response.json(newStudent);
});

router.put("/:id", async (request, response) => {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  student.name = request.body.name;
  student.education = request.body.education;

  await saveStudents(students);

  response.json(student);
});

router.delete("/:id", async (request, response) => {
  const students = await loadStudents();
  const index = students.findIndex((student) => student.id === Number(request.params.id));

  students.splice(index, 1);
  await saveStudents(students);

  response.send();
});

export default router;
```

</details>

Der er endnu ikke noget at teste her — `routes/students.js` findes nu som fil, men `server.js` ved ikke, den findes. Det retter næste trin.

---

### 7. Montér studentsRouter i server.js

Ryd `server.js` for alt students-relateret — hele arrayet af routes og `loadStudents()`/`saveStudents()` er nu overflødige der — og montér routeren i stedet:

```js
import express from "express";
import studentsRouter from "./routes/students.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/students", studentsRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

#### Test trin 7

Kør hele CRUD-flowet for `/students` igennem i Thunder Client — GET, GET/:id, POST, PUT, DELETE. Alt skal virke præcis som før split'et.

---

### 8. Opret routes/teachers.js

Gør nu det samme for teachers, selv: opret `routes/teachers.js` med teachers-delen af `server.js`, og montér den derefter i `server.js` med `app.use("/teachers", teachersRouter)` — præcis som i trin 6 og 7.

<details>
<summary>Hint</summary>

Samme fremgangsmåde som trin 6-7 — kopiér strukturen, erstat `students`/`Students` med `teachers`/`Teachers`, og husk at `/teachers` og `/teachers/:id` bliver til `/` og `/:id` inde i routeren.

</details>

<details>
<summary>Se løsningsforslag: hele routes/teachers.js</summary>

```js
import express from "express";
import fs from "node:fs/promises";

const router = express.Router();

async function loadTeachers() {
  const data = await fs.readFile("./data/teachers.json", "utf8");
  return JSON.parse(data);
}

async function saveTeachers(teachers) {
  const json = JSON.stringify(teachers, null, 2);
  await fs.writeFile("./data/teachers.json", json);
}

router.get("/", async (request, response) => {
  const teachers = await loadTeachers();

  response.json(teachers);
});

router.get("/:id", async (request, response) => {
  const teachers = await loadTeachers();
  const teacher = teachers.find((teacher) => teacher.id === Number(request.params.id));

  response.json(teacher);
});

router.post("/", async (request, response) => {
  const teachers = await loadTeachers();

  const newTeacher = {
    id: Date.now(),
    name: request.body.name,
    subject: request.body.subject
  };

  teachers.push(newTeacher);
  await saveTeachers(teachers);

  response.json(newTeacher);
});

router.put("/:id", async (request, response) => {
  const teachers = await loadTeachers();
  const teacher = teachers.find((teacher) => teacher.id === Number(request.params.id));

  teacher.name = request.body.name;
  teacher.subject = request.body.subject;

  await saveTeachers(teachers);

  response.json(teacher);
});

router.delete("/:id", async (request, response) => {
  const teachers = await loadTeachers();
  const index = teachers.findIndex((teacher) => teacher.id === Number(request.params.id));

  teachers.splice(index, 1);
  await saveTeachers(teachers);

  response.send();
});

export default router;
```

</details>

<details>
<summary>Se løsningsforslag: server.js efter split</summary>

```js
import express from "express";
import studentsRouter from "./routes/students.js";
import teachersRouter from "./routes/teachers.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/students", studentsRouter);
app.use("/teachers", teachersRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

</details>

#### Test trin 8

Kør hele CRUD-flowet for `/teachers` igennem. Sammenlign så `server.js` med, hvordan den så ud efter Del 1 — hvor meget kortere er den blevet?

## Tjekpunkt: Del 2

Del 2 er gennemført, når:

- `server.js` kun importerer og monterer to routere — ingen route-definitioner tilbage
- `/students` og `/teachers` ligger i hver sin fil i `routes/`, og al CRUD-funktionalitet virker som før

Begreb: **Single Responsibility** — hver routes-fil har nu kun ansvar for én ressource; det er Separation of Concerns i praksis, en fil ad gangen.

---

## Del 3: Data-modul

`loadStudents()`/`saveStudents()` og `loadTeachers()`/`saveTeachers()` bor stadig inde i den enkelte routes-fil. Det hører ikke rigtig hjemme der — en routes-fil skal håndtere HTTP ind og ud, ikke filsystemet. I dette trin flytter I dem ud i deres eget modul.

```text
Før (Del 2):                              Efter (Del 3):

routes/students.js                        routes/students.js
 ├─ loadStudents() -> fs.readFile()         ├─ router.get(...) osv.
 ├─ saveStudents() -> fs.writeFile()        └─ import { loadStudents, saveStudents }
 └─ router.get(...) osv.                          from "../data/students.js"
                                                            |
                                                            v
                                           data/students.js
                                            ├─ loadStudents() -> fs.readFile()
                                            └─ saveStudents() -> fs.writeFile()
```

Begreb: **Encapsulation** — routes-filen skal ikke vide, om data ligger i en JSON-fil, en database eller et array; den kalder bare `loadX()`/`saveX()`, og lader data-modulet gemme på detaljen.

### 9. Opret data/students.js

```js
// data/students.js
import fs from "node:fs/promises";

export async function loadStudents() {
  // TODO: Flyt indholdet af loadStudents() fra routes/students.js herind, med export foran.
}

export async function saveStudents(students) {
  // TODO: Flyt indholdet af saveStudents() fra routes/students.js herind, med export foran.
}
```

<details>
<summary>Se løsningsforslag</summary>

```js
import fs from "node:fs/promises";

export async function loadStudents() {
  const data = await fs.readFile("./data/students.json", "utf8");
  return JSON.parse(data);
}

export async function saveStudents(students) {
  const json = JSON.stringify(students, null, 2);
  await fs.writeFile("./data/students.json", json);
}
```

</details>

Ret nu `routes/students.js`: fjern `loadStudents()`/`saveStudents()` og `import fs from "node:fs/promises"` herfra, og importér funktionerne fra data-modulet i stedet:

```js
import { loadStudents, saveStudents } from "../data/students.js";
```

#### Test trin 9

Kør CRUD-flowet for `/students` igennem igen. Intet skal have ændret sig udadtil — kun hvor koden bor.

---

### 10. Opret data/teachers.js

Gør det samme for teachers, selv.

<details>
<summary>Se løsningsforslag: data/teachers.js</summary>

```js
import fs from "node:fs/promises";

export async function loadTeachers() {
  const data = await fs.readFile("./data/teachers.json", "utf8");
  return JSON.parse(data);
}

export async function saveTeachers(teachers) {
  const json = JSON.stringify(teachers, null, 2);
  await fs.writeFile("./data/teachers.json", json);
}
```

</details>

#### Test trin 10

Kør CRUD-flowet for `/teachers` igennem igen.

## Tjekpunkt: Del 3

Del 3 er gennemført, når `routes/students.js` og `routes/teachers.js` ikke længere importerer `fs` eller definerer `loadX()`/`saveX()` selv — kun `data/students.js` og `data/teachers.js` gør.

---

## Del 4: Filtrering, sortering & paginering

```text
GET /students?education=...        -> filter()
GET /students?sort=...             -> sort()
GET /students?page=...&limit=...   -> slice()
```

Indtil nu har `GET /students` altid returneret hele listen. Nu bruger I `request.query` til at lade klienten selv bestemme, hvilken del af listen den får — uden at ændre selve datamodellen eller nogen af de andre routes.

> Byg videre på jeres `GET /students`-route fra Del 3 — koden er den samme, uanset hvor den bor.

### 11. Filtrering: ?education=...

```js
router.get("/", async (request, response) => {
  let students = await loadStudents();

  // TODO: Hvis request.query.education findes, filtrér students, så kun studerende
  // med den uddannelse er tilbage. Findes den ikke, send hele listen uændret.

  response.json(students);
});
```

<details>
<summary>Hint</summary>

```text
if (request.query.education) {
  students = students.filter(s => s.education === request.query.education)
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
router.get("/", async (request, response) => {
  let students = await loadStudents();

  if (request.query.education) {
    students = students.filter((student) => student.education === request.query.education);
  }

  response.json(students);
});
```

</details>

#### Test trin 11

Send `GET /students?education=Datamatiker` — I skal kun se studerende med den uddannelse. Send derefter almindelig `GET /students`, uden query parameter — I skal stadig se hele listen.

---

### 12. Sortering: ?sort=...

Byg videre på routen fra trin 11:

```js
router.get("/", async (request, response) => {
  let students = await loadStudents();

  if (request.query.education) {
    students = students.filter((student) => student.education === request.query.education);
  }

  // TODO: Hvis request.query.sort findes, sortér students efter den property med sort().
  // fx ?sort=name skal sortere efter navn.

  response.json(students);
});
```

<details>
<summary>Hint</summary>

```text
if (request.query.sort) {
  const key = request.query.sort
  students = students.sort((a, b) => (a[key] > b[key] ? 1 : -1))
}
```

`request.query.sort` er en string, fx `"name"` — brug den til at slå den rigtige property op på hvert objekt med `a[key]`.

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
router.get("/", async (request, response) => {
  let students = await loadStudents();

  if (request.query.education) {
    students = students.filter((student) => student.education === request.query.education);
  }

  if (request.query.sort) {
    const key = request.query.sort;
    students = students.sort((a, b) => (a[key] > b[key] ? 1 : -1));
  }

  response.json(students);
});
```

</details>

#### Test trin 12

Send `GET /students?sort=name` — kommer studerende tilbage i alfabetisk rækkefølge? Kombinér med filtrering: `GET /students?education=Datamatiker&sort=name`.

---

### 13. Paginering: ?page=...&limit=...

Byg videre på routen fra trin 12 — pagineringen skal ske til sidst, efter filtrering og sortering:

```js
router.get("/", async (request, response) => {
  let students = await loadStudents();

  if (request.query.education) {
    students = students.filter((student) => student.education === request.query.education);
  }

  if (request.query.sort) {
    const key = request.query.sort;
    students = students.sort((a, b) => (a[key] > b[key] ? 1 : -1));
  }

  // TODO: Hvis request.query.page og request.query.limit findes, brug slice() til kun
  // at returnere den rigtige "side" af students. Husk Number() — query parameters er altid strings.

  response.json(students);
});
```

<details>
<summary>Hint</summary>

```text
if (request.query.page && request.query.limit) {
  const page = Number(request.query.page)
  const limit = Number(request.query.limit)
  const start = (page - 1) * limit
  students = students.slice(start, start + limit)
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
router.get("/", async (request, response) => {
  let students = await loadStudents();

  if (request.query.education) {
    students = students.filter((student) => student.education === request.query.education);
  }

  if (request.query.sort) {
    const key = request.query.sort;
    students = students.sort((a, b) => (a[key] > b[key] ? 1 : -1));
  }

  if (request.query.page && request.query.limit) {
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);
    const start = (page - 1) * limit;
    students = students.slice(start, start + limit);
  }

  response.json(students);
});
```

</details>

#### Test trin 13

Send `GET /students?page=1&limit=2` — I skal kun få de første to studerende. Send `GET /students?page=2&limit=2` — I skal få de næste to (eller færre, hvis listen slipper op). Prøv til sidst alle tre sammen: `GET /students?education=Datamatiker&sort=name&page=1&limit=2`.

> Har I tid, så gør det samme for `/teachers`.

## Tjekpunkt: Del 4

Del 4 er gennemført, når `GET /students`:

- kan filtreres på mindst én query parameter, fx `?education=...`
- kan sorteres med `?sort=...`
- kan pagineres med `?page=` og `?limit=`
- stadig returnerer hele listen, når ingen query parameters er sat

---

## Del 5 (frivillig): Controllers

I Del 4 fik `GET /students` for alvor noget at lave — filtrering, sortering og paginering, alt sammen direkte i routen. De øvrige routes (opret, hent én, opdatér, slet) er stadig tynde rene gennemløb, men `GET /students` er nu blevet stor nok til, at det gør en forskel at flytte logikken væk fra selve routingen. Det er derfor controllerlaget kommer her, efter Del 4 — det betaler sig først, når der reelt er noget værd at flytte.

> **Hvorfor egentlig et controller-lag?** Delvist handler det om projektets størrelse: med fem tynde routes er der intet at vinde ved at splitte dem op, men jo mere logik en route samler på — som filtreringen, sorteringen og pagineringen i `getAllStudents` — jo sværere bliver den at overskue, når routing og logik ligger i samme funktion. Den konkrete gevinst her er, at `routes/students.js` bliver en ren liste over endpoints, mens controlleren rummer den logik, der faktisk er værd at læse for sig selv. Læg dog mærke til, at jeres controller-funktioner stadig tager `(request, response)` direkte fra Express — de er altså ikke fuldt afkoblet fra HTTP-laget. Skulle I for alvor genbruge logikken uden for én bestemt route, fx fra et script eller en helt anden slags endpoint, ville næste skridt være at trække selve logikken endnu længere ud, så den ikke rører `request`/`response` overhovedet — det ligger uden for denne øvelse.

Sådan ser en enkelt request igennem alle fire lag ud, når Del 5 er færdig:

```text
Request
   |
   v
routes/students.js                  HTTP ind/ud: hvilken route matcher stien?
   |
   v
controllers/studentsController.js   logik: hent, filtrér, sortér, paginér, find/opdatér, gem
   |
   v
data/students.js                    adgang til data: loadStudents()/saveStudents()
   |
   v
data/students.json                  selve dataen
```

### 14. Opret controllers/studentsController.js

```js
// controllers/studentsController.js
import { loadStudents, saveStudents } from "../data/students.js";

// TODO: Flyt logikken fra hver route i routes/students.js herind, som sin egen eksporterede funktion:
// getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent.
// getAllStudents skal også tage filtrerings-, sorterings- og pagineringslogikken fra Del 4 med,
// ikke kun selve hentningen.
// Brug (request, response) som parametre, ligesom i en almindelig route.
```

<details>
<summary>Hint</summary>

```text
export async function getAllStudents(request, response) { ... }
```

Selve koden inde i hver funktion er identisk med det, der stod i routen — kun "navnet" og placeringen ændrer sig. `getAllStudents` bliver den længste funktion, fordi den også indeholder filtrering, sortering og paginering fra Del 4.

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
import { loadStudents, saveStudents } from "../data/students.js";

export async function getAllStudents(request, response) {
  let students = await loadStudents();

  if (request.query.education) {
    students = students.filter((student) => student.education === request.query.education);
  }

  if (request.query.sort) {
    const key = request.query.sort;
    students = students.sort((a, b) => (a[key] > b[key] ? 1 : -1));
  }

  if (request.query.page && request.query.limit) {
    const page = Number(request.query.page);
    const limit = Number(request.query.limit);
    const start = (page - 1) * limit;
    students = students.slice(start, start + limit);
  }

  response.json(students);
}

export async function getStudentById(request, response) {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  response.json(student);
}

export async function createStudent(request, response) {
  const students = await loadStudents();

  const newStudent = {
    id: Date.now(),
    name: request.body.name,
    education: request.body.education
  };

  students.push(newStudent);
  await saveStudents(students);

  response.json(newStudent);
}

export async function updateStudent(request, response) {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  student.name = request.body.name;
  student.education = request.body.education;

  await saveStudents(students);

  response.json(student);
}

export async function deleteStudent(request, response) {
  const students = await loadStudents();
  const index = students.findIndex((student) => student.id === Number(request.params.id));

  students.splice(index, 1);
  await saveStudents(students);

  response.send();
}
```

</details>

Ret `routes/students.js`, så den kun importerer controlleren og forbinder routes til de rigtige funktioner — selve routingen ændrer sig ikke af, at `getAllStudents` nu indeholder mere logik:

```js
import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from "../controllers/studentsController.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
```

#### Test trin 14

Kør hele flowet for `/students` igennem: almindelig CRUD, og query parametrene fra Del 4 (`?education=`, `?sort=`, `?page=`/`?limit=`). `routes/students.js` skal nu være meget kort — kun import og fem linjer routing.

---

### 15. Opret controllers/teachersController.js

Gør det samme for teachers, selv (uden filtrering/sortering/paginering, medmindre I også byggede det for `/teachers` i Del 4).

<details>
<summary>Se løsningsforslag: controllers/teachersController.js</summary>

```js
import { loadTeachers, saveTeachers } from "../data/teachers.js";

export async function getAllTeachers(request, response) {
  const teachers = await loadTeachers();

  response.json(teachers);
}

export async function getTeacherById(request, response) {
  const teachers = await loadTeachers();
  const teacher = teachers.find((teacher) => teacher.id === Number(request.params.id));

  response.json(teacher);
}

export async function createTeacher(request, response) {
  const teachers = await loadTeachers();

  const newTeacher = {
    id: Date.now(),
    name: request.body.name,
    subject: request.body.subject
  };

  teachers.push(newTeacher);
  await saveTeachers(teachers);

  response.json(newTeacher);
}

export async function updateTeacher(request, response) {
  const teachers = await loadTeachers();
  const teacher = teachers.find((teacher) => teacher.id === Number(request.params.id));

  teacher.name = request.body.name;
  teacher.subject = request.body.subject;

  await saveTeachers(teachers);

  response.json(teacher);
}

export async function deleteTeacher(request, response) {
  const teachers = await loadTeachers();
  const index = teachers.findIndex((teacher) => teacher.id === Number(request.params.id));

  teachers.splice(index, 1);
  await saveTeachers(teachers);

  response.send();
}
```

</details>

<details>
<summary>Se løsningsforslag: routes/teachers.js</summary>

```js
import express from "express";
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from "../controllers/teachersController.js";

const router = express.Router();

router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

export default router;
```

</details>

#### Test trin 15

Kør CRUD-flowet for `/teachers` igennem én sidste gang.

## Tjekpunkt: Del 5

Del 5 er gennemført, når `routes/`-filerne kun indeholder import + routing, al logik ligger i `controllers/`, og alt data-adgang stadig går gennem `data/`.

---

## Del 6 (frivillig): Gentag det hele for courses og educations

Er I færdige med Del 1–5, og har I tid, gentager I nu hele progressionen selv, for to nye ressourcer: `/courses` og `/educations`. Denne gang er der ingen TODO'er, hints eller løsningsforslag — I har bygget mønstret to gange nu, for students og for teachers, så det er jeres tur til at køre det fra bunden alene.

Foreslået datamodel, hvis I ikke har egne idéer:

```json
// data/educations.json
[
  { "id": 1, "name": "Multimediedesign" },
  { "id": 2, "name": "Datamatiker" }
]
```

```json
// data/courses.json
[
  { "id": 1, "title": "Webudvikling", "ects": 10 },
  { "id": 2, "title": "Databaser", "ects": 5 }
]
```

### 16. courses og educations: CRUD + JSON

Byg `/courses` og `/educations` med fuld CRUD, ligesom I gjorde for `/teachers` i Del 1 — `loadX()`/`saveX()` og de fem routes, direkte i `server.js` eller allerede i hver sin routes-fil, hvis I vil springe mellemtrinnet over.

#### Test trin 16

Kør CRUD-flowet for begge ressourcer igennem i Thunder Client.

---

### 17. Split i routes-filer

Flyt `/courses` og `/educations` over i `routes/courses.js` og `routes/educations.js`, monteret i `server.js` — som i Del 2.

#### Test trin 17

Kør CRUD-flowet igennem igen efter split'et.

---

### 18. Data-modul

Flyt data-adgangen videre til `data/courses.js` og `data/educations.js` — som i Del 3. Spring ikke dette trin over, selv om resten af Del 6 er frivillig: `loadX()`/`saveX()` skal stadig ikke bo i en routes-fil.

#### Test trin 18

Kør CRUD-flowet igennem en sidste gang.

### 19. Valgfrit videre: controllers

Har I tid og lyst, træk da også logikken ud i `controllers/coursesController.js` og `controllers/educationsController.js` — som i Del 5.

## Tjekpunkt: Del 6

Del 6 er gennemført, når `/courses` og `/educations` har samme struktur som `/students` og `/teachers`: egen routes-fil, eget data-modul, og fuld CRUD med persistens i hver sin JSON-fil.

---

## Reflektér over din læring

Når I er færdige, skal I gerne kunne forklare:

1. Hvorfor blev `server.js` svær at overskue, da I tilføjede `/teachers` oveni `/students`? Hvad konkret gjorde det svært?
2. Hvad løser `express.Router()` helt konkret — og hvad løser det ikke i sig selv (kig på, hvor `loadX()`/`saveX()` lå efter Del 2)?
3. Hvad var forskellen på at flytte data-adgang ud (Del 3) og at flytte logikken ud (Del 5)? Er det samme slags problem, de to trin løser?
4. Efter Del 5 er `getAllStudents` markant større end de øvrige controller-funktioner (opret, hent én, opdatér, slet), fordi den også indeholder filtrering, sortering og paginering fra Del 4. Hvorfor er det netop den funktion, der vokser — og hvad fortæller det jer om, hvornår et controller-lag reelt gør en forskel?
5. Hvis I skulle forklare forskellen på routes, controllers og data-modul til en, der ikke kender Express, hvilken analogi ville I bruge?
6. I Del 4 sker pagineringen (trin 13) til sidst, efter filtrering og sortering. Hvad ville der ske, hvis rækkefølgen var omvendt?

## Videre

I har nu delt jeres REST API op i lag, og bygget den samme ressource-struktur op to gange — først for `/students`, så for `/teachers` — og tilføjet filtrering, sortering og paginering til `GET /students` med query parameters. Statuskoder og fejlhåndtering — som stadig mangler her, ligesom i den oprindelige students-øvelse — venter til [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md).
