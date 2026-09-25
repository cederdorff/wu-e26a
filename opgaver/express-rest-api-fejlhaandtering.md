# REST API-øvelse: Fejlhåndtering

## Kort fortalt

Du bygger videre på [REST API-øvelse: Arkitektur](express-rest-api-arkitektur.md). Del 1-4 skal være gennemført: `/students` og `/teachers` i hver sin routes-fil, data-adgangen i sit eget modul, og filtrering/sortering/paginering på `GET /students`.

> **Lavede du den frivillige Del 5 (controllers)?** Så ligger route-logikken i `controllers/studentsController.js` og `controllers/teachersController.js` i stedet for i `routes/`. Lav rettelserne i Del 1 dér. Koden er den samme, det er bare en anden fil.

Indtil nu har dit API kun håndteret den lykkelige vej: gyldige id'er og udfyldte felter. I denne øvelse retter du det, [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md) gennemgår:

- **Del 1** gør statuskoderne eksplicitte og tilføjer `404`\- og `400`\-tjek til `/students` og `/teachers`.
- **Del 2** tilføjer `try`/`catch` om dine `loadX()`\-funktioner og en fælles fejl-middleware i `server.js`.

Bagefter overfører du det hele til din egen AMAbot i [øvelse 9](express-rest-api-amabot-sikkerhed-og-fejlhaandtering.md).

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under trinnet. Den peger dig i den rigtige retning uden at give dig koden.
2. Åbn **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller når du vil sammenligne med din egen kode.

Spring aldrig en test over, heller ikke når den virker oplagt.

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

**Prøv det først:** send `POST http://localhost:3000/students` med en ny studerende, og kig i Thunder Clients statuslinje. Der står `200 OK`, selvom der er oprettet noget nyt.

Express svarer med `200`, når du ikke selv sætter en statuskode. Find sidste linje i `router.post("/", ...)` i `routes/students.js`:

```js
response.json(newStudent);
```

Ret den til:

```js
response.status(201).json(newStudent);
```

#### Test trin 2

Send `POST http://localhost:3000/students` med en ny studerende. Står der nu `201 Created` i statuslinjen?

---

### 3. Statuskoder: DELETE /students/:id sletter noget — 204

**Prøv det først:** slet en studerende, og kig i statuslinjen. Igen `200 OK`.

`DELETE` sender ikke noget indhold tilbage, og det er det, `204 No Content` betyder. Find `response.send();` i `router.delete("/:id", ...)`, og ret den til:

```js
response.status(204).send();
```

#### Test trin 3

Slet en studerende. Statuslinjen skal nu vise `204 No Content`.

---

### 4. Gør det samme for /teachers

Ret `POST` og `DELETE` i `routes/teachers.js` selv, uden hints.

#### Test trin 4

Gentag testene fra punkt 2-3, denne gang for `/teachers`.

## Tjekpunkt: statuskoder

`POST` svarer med `201`, og `DELETE` svarer med `204`, på både `/students` og `/teachers`.

---

### 5. 404: GET /students/:id

**Prøv det først:** send `GET http://localhost:3000/students/999`. Du får `200 OK` og et helt tomt svar. Det ligner en succes, men det er en fejl.

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

Send `GET http://localhost:3000/students/999`. Du skal nu få `404` og en fejlbesked som JSON. Tjek bagefter, at et id, der findes, stadig virker.

---

### 6. 404: PUT /students/:id

**Prøv det først:** send `PUT http://localhost:3000/students/999` med en body. Nu får du ikke et tomt svar, men Express' egen HTML-fejlside med `Cannot set properties of undefined (setting 'name')` og en lang stack trace. `find()` gav `undefined`, og routen prøvede alligevel at sætte `student.name`.

Brug samme tjek som i punkt 5, før du opdaterer:

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

Send `PUT http://localhost:3000/students/999` med en body. Du skal få `404`. Tjek bagefter, at `PUT` på et rigtigt id stadig opdaterer.

---

### 7. 404: DELETE /students/:id

**Prøv det først:** send `GET /students`, og læg mærke til, hvem der står sidst. Send derefter `DELETE http://localhost:3000/students/999`, og så `GET /students` igen.

- Bruger du `findIndex()`/`splice()`, er den **sidste** studerende væk. `findIndex()` returnerer `-1`, og `splice(-1, 1)` fjerner det sidste element. Du så det samme i [REST API-øvelsen](express-rest-api-students.md). Hent den studerende tilbage med `git checkout data/students.json`.
- Bruger du `filter()`, sker der ingenting, men du får stadig `204`, som om sletningen lykkedes.

I begge tilfælde får du ikke at vide, at der ikke var noget at slette. Tilføj et tjek, før du sletter:

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

Send `DELETE http://localhost:3000/students/999`. Du skal få `404`. Tjek bagefter, at `DELETE` på et rigtigt id stadig sletter og svarer med `204`.

---

### 8. Gør det samme for /teachers

Tilføj 404-tjekket til `GET`, `PUT` og `DELETE` i `routes/teachers.js` selv, uden hints.

> **Begreb: DRY (Don't Repeat Yourself).** Du har nu skrevet det samme 404-tjek seks gange: tre gange med `student` og tre gange med `teacher`. Det er i orden her, for hvert tjek er kort og let at læse. Men det er samme slags gentagelse, som da du kopierede students til teachers i [arkitektur-øvelsen](express-rest-api-arkitektur.md). Hold øje med den. I punkt 14 slipper du for en gentagelse af den slags.

#### Test trin 8

Gentag testene fra punkt 5-7, denne gang for `/teachers`.

## Tjekpunkt: 404

`GET`, `PUT` og `DELETE` på både `/students/:id` og `/teachers/:id` svarer med `404` og en fejlbesked, når id'et ikke findes, og virker som før, når det findes.

---

### 9. 400: POST /students uden validering

**Prøv det først:** send `POST http://localhost:3000/students` med `{ "name": "Test" }`, altså uden `education`. Du får `201 Created`, og i `data/students.json` ligger der nu en studerende uden uddannelse. Slet den igen bagefter.

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

Send `POST http://localhost:3000/students` med `{ "name": "Test" }`. Du skal få `400`. Tjek bagefter, at en fuldt udfyldt body stadig opretter en studerende.

---

### 10. 400: PUT /students/:id uden validering

Samme tjek i `PUT`. Det skal stå efter 404-tjekket fra punkt 6, for der er ingen grund til at validere body'en, hvis studerenden ikke findes:

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

Send `PUT` på et rigtigt id med `{ "name": "Test" }`. Du skal få `400`. Tjek bagefter, at en fuldt udfyldt body stadig opdaterer studerenden.

---

### 11. Gør det samme for /teachers

Tilføj valideringen til `POST` og `PUT` i `routes/teachers.js` selv, uden hints. For lærere er det `name` og `subject`, der skal udfyldes.

#### Test trin 11

Gentag testene fra punkt 9-10, denne gang for `/teachers`.

## Tjekpunkt: Del 1

Del 1 er gennemført, når:

- `POST` svarer med `201` og `DELETE` med `204` på både `/students` og `/teachers`
- `GET`, `PUT` og `DELETE` på et id, der ikke findes, svarer med `404` på begge ressourcer
- `POST` og `PUT` svarer med `400`, når felter mangler, på begge ressourcer
- alt, hvad der virkede før, stadig virker

---

## Del 2: Uventede fejl — try/catch og en fælles fejl-middleware

Fejlene i Del 1 kunne du forudse og tjekke for med et `if`. I Del 2 handler det om fejl, du ikke kan tjekke dig ud af på forhånd, fx en datafil, der mangler eller er i stykker.

### 12. try/catch: loadStudents()

**Prøv det først:** omdøb midlertidigt `data/students.json`, og send `GET http://localhost:3000/students`. Du får Express' HTML-fejlside med `ENOENT: no such file or directory` øverst og en lang stack trace. Giv filen dens rigtige navn tilbage.

`loadStudents()` kan fejle, hvis filen mangler, eller hvis den indeholder ugyldig JSON. Byg videre på `data/students.js`:

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
    throw new Error("Kunne ikke hente studerende. data/students.json mangler eller er ugyldig.");
  }
}
```

</details>

> **Begreb: Encapsulation.** I arkitektur-øvelsen skulle routes-filen ikke vide, om data ligger i en JSON-fil, en database eller et array. Det gælder også fejlene. `ENOENT` og `SyntaxError` fortæller, *hvordan* data er gemt. Nu holder `loadStudents()` den detalje for sig selv og kaster i stedet en fejl, som alle kan forstå: "Kunne ikke hente studerende". Skifter du senere JSON-filen ud med en database, er fejlbeskeden den samme.

#### Test trin 12

Omdøb `data/students.json` midlertidigt (eller ødelæg indholdet), og send `GET http://localhost:3000/students`. Du får stadig Express' fejlside, men øverst står din egen fejlbesked i stedet for `ENOENT`. Selve fejlsiden fjerner du i punkt 14. Giv filen dens navn og indhold tilbage bagefter.

---

### 13. Gør det samme for loadTeachers()

Tilføj `try`/`catch` til `loadTeachers()` i `data/teachers.js` selv, uden hints.

#### Test trin 13

Gentag testen fra punkt 12 med `data/teachers.json` og `GET /teachers`.

---

### 14. En fælles fejl-middleware i server.js

Fejlen, du kaster fra `catch` i punkt 12-13, skal fanges et sted, hvor der kan sendes et svar. Data-modulet kender ikke `response`, så det kan ikke ske dér. Det er det, en fejl-middleware er til.

Tilføj nederst i `server.js`, efter begge routere:

```js
app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ error: error.message });
});
```

> **Begreb: Middleware.** En middleware er en funktion, der kører mellem request og response. Du har allerede brugt en: `express.json()` læser JSON-body'en, før den når dine routes. Har du lavet [øvelse 8](fetch-dom-amabot.md), er `cors()` i AMAbotten også en middleware. Med `app.use()` tilføjer du din egen.
>
> Express kører middleware og routes i den rækkefølge, de står i filen. En fejl-middleware fanger kun fejl fra det, der står over den, så den skal stå efter dine routere. Den har fire parametre (`error, request, response, next`). Det er sådan, Express kan kende forskel på den og en almindelig middleware, og den bliver kun kaldt, når der er kastet en fejl.

> **Begreb: Separation of Concerns.** Skal routerne så også have `try`/`catch`? Nej. Når `await loadStudents()` kaster en fejl i en `async` route, sender Express selv fejlen videre til fejl-middlewaren. Hver del har sit eget ansvar: data-modulet opdager fejlen og beskriver den, fejl-middlewaren sender svaret, og routerne handler stadig kun om den lykkelige vej.

<details>
<summary>Sådan ville det se ud uden en fejl-middleware</summary>

Uden fejl-middlewaren skulle hver route selv fange fejlen og sende `500`:

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

Og det samme `try`/`catch` i `GET /:id`, `POST`, `PUT` og `DELETE` på både `/students` og `/teachers`.

</details>

> **Begreb: DRY igen.** Uden fejl-middlewaren ville du have ti kopier af den samme fejlhåndtering, og vil du ændre, hvordan fejlsvaret ser ud, skal du rette alle ti. Med fejl-middlewaren er der én. Så DRY betyder ikke, at al gentagelse er forbudt. 404-tjekkene fra punkt 8 er fine. Det betyder, at logik, der skal være ens overalt, skal ligge ét sted.

#### Test trin 14

Gentag testen fra punkt 12: omdøb `data/students.json` midlertidigt, og send `GET /students`. Nu skal du få status `500` og `{ "error": "Kunne ikke hente studerende. ..." }` som JSON i stedet for Express' fejlside. Giv filen dens navn og indhold tilbage bagefter.

Send derefter `POST http://localhost:3000/students` helt **uden** body. Slå body'en fra i Thunder Client, send ikke bare `{}`. Du får `500` med `Cannot read properties of undefined (reading 'name')` og ikke `400`. Uden body er `request.body` `undefined`, så dit `if`-tjek fra punkt 9 crasher, før det når at tjekke noget. Den fejl havde du ikke tænkt på, men klienten får alligevel et JSON-svar. Det er derfor, du har en fejl-middleware.

---

### 15. En 404-catch-all i server.js

**Prøv det først:** send `GET http://localhost:3000/noget-der-ikke-findes`. Du får `404`, men som en lille HTML-side med teksten `Cannot GET /noget-der-ikke-findes` og ikke som JSON. Fejl-middlewaren fanger den ikke, for der er ikke kastet nogen fejl. Der er bare ingen route, der passer.

Tilføj en almindelig middleware i `server.js` efter dine routere, men over fejl-middlewaren. Fejl-middlewaren skal altid stå sidst:

```js
app.use((request, response) => {
  response.status(404).json({ error: "Ukendt sti." });
});
```

> **Forskellen på punkt 14 og 15:** Fejl-middlewaren fanger **fejl i en route, der passede**. 404-catch-all'en fanger **stier, som ingen route passer på**. Express går ned gennem filen, og når en request når bunden uden at have ramt `/students` eller `/teachers`, lander den her. `GET /students/1` rammer `/students/:id` og når aldrig herned. `GET /noget-helt-andet` rammer ingenting og lander her.

#### Test trin 15

Send `GET http://localhost:3000/noget-der-ikke-findes`. Du skal nu få `404` og `{ "error": "Ukendt sti." }` som JSON. Send derefter `GET /students/1`. Den skal stadig give dig den studerende og ikke `404`.

## Tjekpunkt: Del 2

Del 2 er gennemført, når:

- `loadStudents()` og `loadTeachers()` fanger deres egne fejl og kaster en tydelig, dansk fejlbesked videre
- en uventet fejl, fx en ødelagt datafil, giver `500` og din egen fejlbesked som JSON i stedet for Express' HTML-fejlside
- en ukendt sti giver `404` og JSON i stedet for Express' standardtekst

## Reflektér over din læring

Når du er færdig, skal du kunne forklare:

1. Hvad er forskellen på en fejl, du tjekker for med et `if` (`404`/`400` i Del 1), og en fejl, du fanger med `try`/`catch` (Del 2)? Hvorfor kan et `if` ikke klare en ødelagt datafil?
2. I punkt 12 kastede du en ny fejl i `catch`-blokken. Hvad ville der ske, hvis du i stedet lod `catch`-blokken være tom? Prøv det, hvis du er i tvivl.
3. Hvem gør hvad, når datafilen er i stykker: data-modulet, routen og fejl-middlewaren?
4. Alle dine fejlsvar har nu samme form: `{ error: "..." }`. Hvorfor er det en fordel for den, der bruger dit API, fx din frontend?
5. Hvor meget af det her kan du genbruge uændret, når du skal lave det samme for `/messages` og `/answers` i din AMAbot?

## Videre

`/students` og `/teachers` håndterer nu både de fejl, du kan forudse (`404`/`400`), og dem, du ikke kan (`try`/`catch` og fejl-middleware). Næste skridt er at gøre det samme i din egen AMAbot i [øvelse 9](express-rest-api-amabot-sikkerhed-og-fejlhaandtering.md). Der lukker du også to sikkerhedshuller, som kun findes i AMAbotten: `cors()` og XSS i `POST /messages`. Tag de samme mønstre med, når du senere går i gang med dit eget projekt.
