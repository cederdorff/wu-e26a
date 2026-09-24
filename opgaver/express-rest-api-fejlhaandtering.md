# REST API-øvelse: Fejlhåndtering

## Kort fortalt

Du bygger videre på [REST API-øvelse: Arkitektur](express-rest-api-arkitektur.md) — Del 1-4 skal være gennemført: `/students` og `/teachers` i hver sin routes-fil, med data-adgangen i sit eget modul, og filtrering/sortering/paginering på `GET /students`.

> **Lavede du den frivillige Del 5 (controllers)?** Så bor route-logikken i `controllers/studentsController.js` og `controllers/teachersController.js`, ikke i `routes/`. Alle rettelserne i Del 1 laves dér i stedet — koden er den samme, kun filen er en anden.

Denne øvelse implementerer direkte det, [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md) gennemgår om fejlhåndtering: eksplicitte statuskoder, fejlhåndtering af ugyldige id'er og manglende input, `try`/`catch` om jeres data-funktioner, og en fælles fejl-middleware. Bagefter overfører du selv det samme mønster til din egen AMAbot i [øvelse 9](express-rest-api-amabot-sikkerhed-og-fejlhaandtering.md), som også tilføjer de to sikkerhedsrettelser, der kun giver mening dér: en strammere `cors()`-opsætning, og en rettelse af XSS-hullet i `POST /messages`.

Øvelsen er delt i to dele:

- **Del 1** gør alle statuskoder eksplicitte, og tilføjer `404`\- og `400`\-tjek til `/students` og `/teachers`, hvor de mangler.
- **Del 2** tilføjer `try`/`catch` om jeres `loadX()`\-funktioner, og en fælles fejl-middleware i `server.js`.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Samme fremgangsmåde som altid: prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under trinnet — den peger på de rigtige metoder og egenskaber, uden at give dig koden.
2. Åbn først **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller du vil sammenligne med din egen kode.

Spring aldrig en test over, selv når den virker oplagt.

</details>

---

## Del 1: Statuskoder og fejlkontrol

### 1. Gem udgangspunktet i Git

```bash
git add .
git commit -m "Save REST API before adding status codes and error handling"
git push
```

---

### 2. Statuskoder: POST /students opretter noget — 201

**Prøv det først:** send `POST http://localhost:3000/students` med en ny studerende, og kig i Thunder Clients statuslinje. Der står `200 OK` — selvom der netop er oprettet noget nyt.

`POST /students` svarer med Express' standard-`200`, fordi I aldrig selv har sat en statuskode. Find sidste linje i `router.post("/", ...)` i `routes/students.js`:

```js
response.json(newStudent);
```

Ret den til:

```js
response.status(201).json(newStudent);
```

#### Test trin 2

Send `POST http://localhost:3000/students` med en ny studerende. Kig i Thunder Clients statuslinje — står der nu `201 Created` i stedet for `200 OK`?

---

### 3. Statuskoder: DELETE /students/:id rydder noget — 204

`DELETE /students/:id` sender intet indhold tilbage — det er netop, hvad `204 No Content` betyder. Find `response.send();` i `router.delete("/:id", ...)`, og ret den til:

```js
response.status(204).send();
```

#### Test trin 3

Slet en studerende. Statuslinjen skal nu vise `204 No Content`.

---

### 4. Gør det samme for /teachers

Ret `POST` og `DELETE` på `/teachers` i `routes/teachers.js` — selv, uden hints.

#### Test trin 4

Gentag testene fra punkt 2-3, denne gang for `/teachers`.

## Tjekpunkt: statuskoder

`POST` svarer med `201`, og `DELETE` svarer med `204`, på både `/students` og `/teachers`.

---

### 5. 404: GET /students/:id

**Prøv det først:** send `GET http://localhost:3000/students/999999`. Du får `200 OK` og et helt tomt svar — Thunder Client viser ingen body overhovedet. En fejl, der ser ud som en succes.

Byg videre på `GET /students/:id` i `routes/students.js`:

```js
router.get("/:id", async (request, response) => {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  // TODO: Hvis student er undefined, send response.status(404).json({ error: "..." }), og stop routen med return.

  response.json(student);
});
```

<details>
<summary>Hint</summary>

```text
if (!student) {
  response.status(404).json({ error: "..." })
  return
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
router.get("/:id", async (request, response) => {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  if (!student) {
    response.status(404).json({ error: "Ingen studerende med det id findes." });
    return;
  }

  response.json(student);
});
```

</details>

#### Test trin 5

Send `GET http://localhost:3000/students/999999`. Du skal nu få `404` og en tydelig fejlbesked som JSON, i stedet for et tomt svar med `200`. Bekræft bagefter, at et id, der faktisk findes, stadig virker som før.

---

### 6. 404: PUT /students/:id

**Prøv det først:** send `PUT http://localhost:3000/students/999999` med en body. Denne gang får I ikke et tomt svar, men Express' egen HTML-fejlside med `Cannot set properties of undefined (setting 'name')` og en fuld stack trace — `find()` gav `undefined`, og routen prøvede alligevel at sætte `student.name`.

Samme mønster som i punkt 5, denne gang før opdateringen — I skal ikke kunne opdatere en studerende, der ikke findes:

```js
router.put("/:id", async (request, response) => {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  // TODO: Samme 404-tjek som i punkt 5.

  student.name = request.body.name;
  student.education = request.body.education;

  await saveStudents(students);

  response.json(student);
});
```

<details>
<summary>Se løsningsforslag</summary>

```js
router.put("/:id", async (request, response) => {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  if (!student) {
    response.status(404).json({ error: "Ingen studerende med det id findes." });
    return;
  }

  student.name = request.body.name;
  student.education = request.body.education;

  await saveStudents(students);

  response.json(student);
});
```

</details>

#### Test trin 6

Send `PUT http://localhost:3000/students/999999` med en body. Du skal få `404`. Bekræft bagefter, at `PUT` på et rigtigt id stadig opdaterer det som før.

---

### 7. 404: DELETE /students/:id

**Prøv det først:** send `GET /students`, og læg mærke til, hvem der står sidst. Send derefter `DELETE http://localhost:3000/students/999999`, og `GET /students` igen.

- Bruger du `findIndex()`/`splice()`, er den **sidste** studerende nu væk — `findIndex()` returnerer `-1`, og `splice(-1, 1)` fjerner det sidste element. Du så det samme i [REST API-øvelsen](express-rest-api-students.md). Hent den slettede studerende tilbage med `git checkout data/students.json`.
- Bruger du `filter()`, sker der ingenting — men svaret er stadig `204`, som om sletningen lykkedes.

Ingen af dem fortæller dig, om der overhovedet var noget at slette. Tilføj et tjek, før du sletter:

```js
router.delete("/:id", async (request, response) => {
  const students = await loadStudents();

  // TODO: Find studerenden med find(), ligesom i GET og PUT. Findes den ikke, send 404 og return.

  const index = students.findIndex((student) => student.id === Number(request.params.id));
  students.splice(index, 1);
  await saveStudents(students);

  response.status(204).send();
});
```

<details>
<summary>Se løsningsforslag (med findIndex()/splice())</summary>

```js
router.delete("/:id", async (request, response) => {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  if (!student) {
    response.status(404).json({ error: "Ingen studerende med det id findes." });
    return;
  }

  const index = students.findIndex((student) => student.id === Number(request.params.id));
  students.splice(index, 1);
  await saveStudents(students);

  response.status(204).send();
});
```

</details>

<details>
<summary>Se løsningsforslag (med filter())</summary>

```js
router.delete("/:id", async (request, response) => {
  let students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  if (!student) {
    response.status(404).json({ error: "Ingen studerende med det id findes." });
    return;
  }

  students = students.filter((student) => student.id !== Number(request.params.id));
  await saveStudents(students);

  response.status(204).send();
});
```

</details>

#### Test trin 7

Send `DELETE http://localhost:3000/students/999999`. Du skal få `404`. Bekræft bagefter, at `DELETE` på et rigtigt id stadig sletter det, med `204` som i punkt 3.

---

### 8. Gør det samme for /teachers

Tilføj 404-tjekkene til `/teachers/:id` i `routes/teachers.js` — selv, uden hints.

> **Begreb: DRY (Don't Repeat Yourself).** Læg mærke til, at det samme 404-tjek — `if (!student)` og `if (!teacher)` — nu står tre steder i `routes/students.js`, og tre steder mere i `routes/teachers.js`. Det er bevidst her — hvert tjek er kort og tydeligt — men det er samme slags gentagelse, I så, da I kopierede students til teachers i [arkitektur-øvelsen](express-rest-api-arkitektur.md). I punkt 14 fjerner I en gentagelse af den slags for første gang.

#### Test trin 8

Gentag testene fra punkt 5-7, denne gang for `/teachers`.

## Tjekpunkt: 404

`GET`, `PUT` og `DELETE` på både `/students/:id` og `/teachers/:id` svarer med `404` og en tydelig fejlbesked, når id'et ikke findes — og fungerer uændret, når det gør.

---

### 9. 400: POST /students uden validering

**Prøv det først:** send `POST http://localhost:3000/students` med `{ "name": "Test" }` — uden `education`. Du får `201 Created`, og i `data/students.json` ligger der nu en studerende uden uddannelse. Slet den igen bagefter.

`POST /students` opretter en studerende, uanset hvad der står i body'en. Byg videre på routen:

```js
router.post("/", async (request, response) => {
  const students = await loadStudents();

  // TODO: Hvis request.body.name eller request.body.education mangler,
  // send response.status(400).json({ error: "..." }), og stop routen med return.

  const newStudent = {
    id: Date.now(),
    name: request.body.name,
    education: request.body.education
  };

  students.push(newStudent);
  await saveStudents(students);

  response.status(201).json(newStudent);
});
```

<details>
<summary>Hint</summary>

```text
if (!request.body.name || !request.body.education) {
  response.status(400).json({ error: "..." })
  return
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
router.post("/", async (request, response) => {
  const students = await loadStudents();

  if (!request.body.name || !request.body.education) {
    response.status(400).json({ error: "name og education skal begge udfyldes." });
    return;
  }

  const newStudent = {
    id: Date.now(),
    name: request.body.name,
    education: request.body.education
  };

  students.push(newStudent);
  await saveStudents(students);

  response.status(201).json(newStudent);
});
```

</details>

#### Test trin 9

Send `POST http://localhost:3000/students` med `{ "name": "Test" }` (uden `education`) — du skal få `400`. Bekræft bagefter, at en fuldt udfyldt body stadig opretter en studerende som før.

---

### 10. 400: PUT /students/:id uden validering

Samme princip, denne gang efter 404-tjekket fra punkt 6:

```js
router.put("/:id", async (request, response) => {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  if (!student) {
    response.status(404).json({ error: "Ingen studerende med det id findes." });
    return;
  }

  // TODO: Hvis request.body.name eller request.body.education mangler, send 400 og return.

  student.name = request.body.name;
  student.education = request.body.education;

  await saveStudents(students);

  response.json(student);
});
```

<details>
<summary>Se løsningsforslag</summary>

```js
router.put("/:id", async (request, response) => {
  const students = await loadStudents();
  const student = students.find((student) => student.id === Number(request.params.id));

  if (!student) {
    response.status(404).json({ error: "Ingen studerende med det id findes." });
    return;
  }

  if (!request.body.name || !request.body.education) {
    response.status(400).json({ error: "name og education skal begge udfyldes." });
    return;
  }

  student.name = request.body.name;
  student.education = request.body.education;

  await saveStudents(students);

  response.json(student);
});
```

</details>

#### Test trin 10

Send `PUT` på et rigtigt id med `{ "name": "Test" }` (uden `education`) — du skal få `400`. Bekræft bagefter, at en fuldt udfyldt body stadig opdaterer studerenden som før.

---

### 11. Gør det samme for /teachers

Tilføj samme validering til `POST` og `PUT` på `/teachers` (`name` og `subject` skal begge udfyldes), i `routes/teachers.js` — selv, uden hints.

#### Test trin 11

Gentag testene fra punkt 9-10, denne gang for `/teachers`.

## Tjekpunkt: Del 1

Del 1 er gennemført, når:

- `POST` og `DELETE` svarer med `201`/`204` i stedet for standard-`200`, på både `/students` og `/teachers`
- `GET`, `PUT` og `DELETE` på et enkelt id svarer med `404`, når id'et ikke findes, på begge ressourcer
- `POST` og `PUT` svarer med `400`, når nødvendige felter mangler, på begge ressourcer
- alt det, der virkede før, stadig virker uændret

---

## Del 2: Uventede fejl — try/catch og en fælles fejl-middleware

### 12. try/catch: loadStudents()

**Prøv det først:** omdøb midlertidigt `data/students.json`, og send `GET http://localhost:3000/students`. Du får Express' egen HTML-fejlside, med en teknisk `ENOENT: no such file or directory` øverst og en fuld stack trace. Giv filen dens rigtige navn tilbage.

I modsætning til `404`/`400` fra Del 1 — som I selv tjekker for på forhånd — kan `loadStudents()` fejle på en måde, I ikke kan tjekke jer frem til: JSON-filen kan mangle, eller indeholde ugyldig JSON. Byg videre på `data/students.js`:

```js
export async function loadStudents() {
  // TODO: Pak fs.readFile() og JSON.parse() ind i try/catch.
  // I catch-blokken: throw new Error(...) med en tydelig, dansk fejlbesked.
  const data = await fs.readFile("./data/students.json", "utf8");
  return JSON.parse(data);
}
```

<details>
<summary>Hint</summary>

```text
try {
  ...
} catch (error) {
  throw new Error("...")
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
export async function loadStudents() {
  try {
    const data = await fs.readFile("./data/students.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Kunne ikke hente studerende — data/students.json mangler eller er ugyldig.");
  }
}
```

</details>

> **Begreb: Encapsulation.** Fra arkitektur-øvelsen: routes-filen skal ikke vide, om data ligger i en JSON-fil, en database eller et array. Det samme gælder fejlene. `ENOENT` og `SyntaxError` er detaljer om, *hvordan* data er gemt — dem gemmer `loadStudents()` nu på, og kaster i stedet en fejl, der giver mening for alle udenfor: "Kunne ikke hente studerende". Skifter I en dag JSON-filen ud med en database, ændrer fejlbeskeden sig ikke.

#### Test trin 12

Omdøb midlertidigt `data/students.json` (eller ødelæg dens indhold), og send `GET http://localhost:3000/students`. Du får stadig Express' egen fejlside — men kig øverst på siden: står der nu jeres egen, tydelige fejlbesked i stedet for `ENOENT` fra "Prøv det først"? Fejlsiden selv forsvinder først i punkt 14. Giv filen dens rigtige navn og indhold tilbage bagefter.

---

### 13. Gør det samme for loadTeachers()

Tilføj samme `try`/`catch` til `loadTeachers()` i `data/teachers.js` — selv, uden hints.

#### Test trin 13

Gentag testen fra punkt 12, denne gang med `data/teachers.json` og `GET /teachers`.

---

### 14. En fælles fejl-middleware i server.js

Fejlen, I kaster fra `catch`-blokken i punkt 12-13, skal fanges et sted, der kan sende et ordentligt svar. Data-modulet kender ikke `response` — det gør en fejl-middleware.

Tilføj nederst i `server.js`, efter begge routere er monteret:

```js
app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ error: error.message });
});
```

> **Begreb: Middleware.** En middleware-funktion er kode, der kører imellem request og response. I har allerede brugt en uden at vide det: `express.json()` parser en JSON-body, før den når jeres routes. Har du lavet [øvelse 8](fetch-dom-amabot.md), er `cors()` i AMAbotten et andet eksempel — den sætter en header, før responsen sendes. `app.use()` her gør nøjagtig det samme, bare med en funktion, I selv har skrevet.
>
> Express kører middleware og routes i den rækkefølge, de står i filen. En fejl-middleware fanger kun fejl fra det, der står *over* den — derfor skal den stå efter alle jeres routere. Den har fire parametre (`error, request, response, next`) i stedet for de sædvanlige to eller tre — det er sådan, Express kan skelne den fra en almindelig middleware, og kun kalde den, når noget rent faktisk er kastet som en fejl. `GET /students` matcher fint, men kaster `loadStudents()` en fejl undervejs, ender den her.

> **Begreb: Separation of Concerns.** Skal routerne så ikke også have `try`/`catch`? Nej. Når `await loadStudents()` kaster en fejl inde i en `async` route, sender Express selv fejlen videre til fejl-middlewaren. Hver del har nu ét ansvar: data-modulet *opdager* fejlen og beskriver den (men kender ikke `response`), fejl-middlewaren *sender svaret*, og routerne kan blive ved med kun at beskrive den lykkelige vej.

<details>
<summary>Sådan ville det se ud uden en fejl-middleware</summary>

Uden fejl-middlewaren skulle hver eneste route selv fange fejlen og sende `500`:

```js
router.get("/", async (request, response) => {
  try {
    const students = await loadStudents();
    response.json(students);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});
```

Og præcis det samme `try`/`catch` i `GET /:id`, `POST`, `PUT` og `DELETE` — på både `/students` og `/teachers`.

</details>

> **Begreb: DRY — denne gang løst.** Uden fejl-middlewaren (se togglen ovenfor) ville I have ti kopier af den samme fejlhåndtering, som alle skulle rettes, hvis I fx ville ændre fejlbeskedens facon. Med fejl-middlewaren er der én. Det er det, DRY handler om: ikke at al gentagelse er forbudt — 404-tjekkene fra punkt 8 er fine — men at logik, der skal være ens overalt, bor ét sted.

#### Test trin 14

Gentag testen fra punkt 12 (omdøb `data/students.json` midlertidigt, send `GET /students`). Får I nu et rent JSON-svar — `{ "error": "Kunne ikke hente studerende — ..." }` med status `500` — i stedet for Express' fejlside? Giv filen dens rigtige navn og indhold tilbage bagefter.

Prøv derefter at sende `POST http://localhost:3000/students` helt **uden** body — slå body'en fra i Thunder Client, i stedet for at sende `{}`. Du får `500` med beskeden `Cannot read properties of undefined (reading 'name')`, ikke `400`. Uden en body er `request.body` slet ikke et objekt, men `undefined` — så jeres `if`-tjek fra punkt 9 crasher, før det overhovedet når at tjekke noget. Det er præcis den slags uforudsete fejl, fejl-middlewaren er til: I har ikke tænkt på den, men klienten får stadig et rent JSON-svar i stedet for Express' fejlside.

---

### 15. En 404-catch-all i server.js

**Prøv det først:** send `GET http://localhost:3000/noget-der-ikke-findes`. Du får `404` — men som en lille HTML-side med teksten `Cannot GET /noget-der-ikke-findes`, ikke som JSON, som resten af jeres API svarer med. Fejl-middlewaren fra punkt 14 fanger den ikke, for der er ikke kastet nogen fejl — ingen route matchede bare.

Tilføj en almindelig middleware i `server.js`, efter begge routere, men *over* fejl-middlewaren fra punkt 14 — fejl-middlewaren skal altid stå allersidst:

```js
app.use((request, response) => {
  response.status(404).json({ error: "Ukendt sti." });
});
```

> **Forskellen på punkt 14 og 15:** Fejl-middlewaren fanger en **fejl inde i en route, der faktisk matchede**. 404-catch-all'en fanger en **sti, der slet ikke findes** — Express springer videre fra middleware til middleware, og kommer en request helt ned til bunden uden at være matchet af `/students` eller `/teachers`, ender den her. Send fx `GET /students/1` — den matcher `/students/:id`, og denne middleware ser den aldrig. Send `GET /noget-helt-andet` — intet matcher, og den lander her.

#### Test trin 15

Send `GET http://localhost:3000/noget-der-ikke-findes`. Du skal nu få `404` og `{ "error": "Ukendt sti." }` som JSON. Send derefter `GET /students/1` igen — den skal stadig give jer den rigtige studerende, ikke `404`\-svaret fra denne middleware.

## Tjekpunkt: Del 2

Del 2 er gennemført, når:

- `loadStudents()` og `loadTeachers()` fanger deres egne fejl og kaster en tydelig, dansk fejlbesked videre
- en uventet fejl (fx en ødelagt datafil) svarer med `500` og jeres egen fejlbesked som JSON, i stedet for Express' HTML-fejlside
- en ukendt sti svarer med `404` og JSON, i stedet for Express' standardtekst

## Reflektér over din læring

Når du er færdig, skal du gerne kunne forklare:

1. Hvad er forskellen på en fejl, I selv tjekker for med et `if` (som `404`/`400` i Del 1), og en fejl, I fanger med `try`/`catch` (som i Del 2)? Hvorfor duer et `if`-tjek ikke til en ødelagt datafil?
2. Hvor meget af Del 1-2 tror du, du kan genbruge uændret, når du snart overfører det til `/messages` og `/answers` i din egen AMAbot?
3. I punkt 12 kastede I en ny, tydelig fejl i `catch`-blokken i stedet for bare at fange og ignorere den oprindelige. Hvad ville der være sket, hvis I i stedet havde ladet `catch`-blokken være tom?
4. Peg på ét sted i din kode, hvor en fejl nu ender som `{ error: "..." }`, uanset om den kom fra et `404`\-, `400`\- eller `500`\-svar.

## Videre

`/students` og `/teachers` håndterer nu de samme typer fejl, et rigtigt REST API bør: forudsigelige tjek (`404`/`400`) og uventede fejl (`try`/`catch` og en fælles fejl-middleware). Brug gerne de samme mønstre — eksplicitte statuskoder, tjek før I handler, `try`/`catch` om det, der kan fejle uforudsigeligt — når I snart går videre til jeres eget projekt. Overfør dem først selv til jeres egen AMAbot i [øvelse 9](express-rest-api-amabot-sikkerhed-og-fejlhaandtering.md), som også lukker to sikkerhedshuller, der kun findes dér: `cors()` og XSS i `POST /messages`.
