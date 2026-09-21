# RACE 6 - Arkitektur og REST API Best Practices - 23-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I dag holder vi jeres eget `/students`\-API op mod de seks REST-principper fra sidst og et par best practices for navngivning og konsistens — og bruger det til at finde, hvad der mangler.

Det rammesætter dagens problem: hvad sker der, når et API vokser sig stort i én fil? I kan allerede se tendensen i AMAbotten. Derfor udvider I selv students-API'et med et tilsvarende sæt endpoints for teachers, i samme fil — så I mærker problemet, inden vi løser det ved at dele `server.js` op med Express' `Router` og flytte data-adgangen til sit eget data-modul (og rette op på det, opsamlingen afslørede).

Til sidst tilføjer vi filtrering, sortering og paginering via query parameters, og kigger kort (frivilligt) på endnu et lag med controllers. Fejlhåndtering og sikkerhed gemmer vi til [RACE 7](./024-race-7-sikkerhed-og-error-handling-25-09-2026.md).

---

## Agenda

<details>
<summary><strong>1. Opsamling: Lever jeres REST API op til principperne og best practices?</strong></summary>

- Kort oplæg: genopfrisk sammen de seks REST-principper fra sidste gang — Client-Server, Stateless, Ressourcer & URI'er, CRUD via HTTP-metoder, Statuskoder, JSON som format
- Suppler med best practices fra artiklen, som principperne ikke dækker: er ressourcer navngivet som substantiver i flertal (`/students`, ikke `/getStudent`)? Er responses og statuskoder konsistente på tværs af routes?
- Nævnes kort, men ikke i dag: nested resources (fx `/teachers/:id/students`), versionering (`/v1/...`) og API-dokumentation — udbredte REST best practices (kilde: [freeCodeCamp](https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/)), gode at kende, men venter til en anden gang
- To og to: hold principperne og best practices op mod jeres eget `/students`\-API fra [Studerende med CRUD](../opgaver/express-rest-api-students.md) — for hvert punkt, lever løsningen op til det, og hvorfor/hvorfor ikke?
- Har I ikke nået øvelsen, så brug i stedet [cederdorff/express-rest-api-students](https://github.com/cederdorff/express-rest-api-students) som udgangspunkt for samtalen
- Hvilket princip eller best practice føles mest abstrakt eller svært at få hold på i praksis — og hvorfor?
- Kort opsamling i plenum: hvor er grupperne enige/uenige, og hvad manglede der flest steder?
</details>
<details>
<summary><strong>2. Problemet: hvad sker der, når koden vokser?</strong></summary>

- Jo mere kode i ét sted — én fil, én funktion — jo sværere er det at finde rundt i, genbruge og teste isoleret
- Kort demo: et Express-API vokset stort i én `server.js` — samme tendens ses allerede i jeres AMAbot-API
- Her: routes, forretningslogik og data blandet sammen i én fil
- Begreb: **Separation of Concerns** — hver del af koden bør have ét ansvar; blandes routes, logik og data, har filen flere ansvar på én gang
- Rammesætter resten af dagen: derfor skal vi tale om modules, `Router` og lagdelt arkitektur
</details>
<details>
<summary><strong>3. Modules, Import &amp; Export</strong></summary>

- Kort om `import`/`export` (ES modules) — forudsætningen for at dele kode mellem filer
- Hands-on del 1: tilføj samme CRUD-mønster (`GET`, `GET/:id`, `POST`, `PUT`, `DELETE`) for en ny ressource `/teachers` i jeres eksisterende `server.js` — kopiér mønstret fra `/students`, men direkte oven på en JSON-fil (`data/teachers.json`); mellemtrinnet med et in-memory array springes over, da I kender persistens fra `/students`; ingen statuskoder eller fejlhåndtering endnu
- Mål: mærk selv problemet fra sidste punkt i jeres eget API, når det vokser til to ressourcer
- Begreb: **DRY (Don't Repeat Yourself)** — læg mærke til, hvor meget I kopierede fra students til teachers; bevidst i dag, men navngiv tensionen: præcis den slags gentagelse, kode gerne skal undgå
- Arbejd videre i eget tempo — I når forskelligt langt herfra
</details>
<details>
<summary><strong>4. Express Router</strong></summary>

- `express.Router()` som en selvstændig "mini-app" for én ressource
- Montér en router på hoved-appen: `app.use("/students", studentsRouter)` og `app.use("/teachers", teachersRouter)`
- Hands-on: flyt jeres students- og teachers-routes over i hver sin fil i en `routes/`\-mappe
- Begreb: **Single Responsibility** — hver routes-fil har nu ansvar for kun én ressource; Separation of Concerns i praksis, en fil ad gangen
</details>
<details>
<summary><strong>5. Lagdelt arkitektur: data-modul og controllers</strong></summary>

- `loadStudents()`/`saveStudents()` (og teachers-varianterne) hører ikke hjemme i en routes-fil — en route håndterer HTTP ind/ud, ikke filsystemet — så de flytter til deres eget data-modul (`data/students.js`, `data/teachers.js`)
- Hands-on: flyt data-adgangen fra jeres routes-filer videre til et `data/`\-modul
- Begreb: **Encapsulation** — routes-filen skal ikke vide, om data ligger i en JSON-fil, en database eller et array; den kalder blot `loadStudents()`/`saveStudents()` og lader data-modulet stå for detaljen
- Brug samtidig lejligheden til at rette navngivning og konsistens, I fandt frem til i dagens opsamling
- Frivilligt: får en routes-fil rigtig logik (fx filtrering, se næste punkt), kan I trække den ud i en controller-funktion — routen kalder blot controlleren
- Kort demo af mappestruktur med `routes/`, `data/` og `controllers/` — I skal ikke nå at bygge controllers i dag, men vide hvornår det giver mening
</details>
<details>
<summary><strong>6. Filtrering, sortering &amp; paginering med query parameters</strong></summary>

- `request.query` til at læse fx `?education=Datamatiker`
- Filtrering: brug `.filter()` på data ud fra en eller flere query parametre
- Sortering: `?sort=...` — hvilken property skal der sorteres på?
- Paginering: `?page=` og `?limit=` — hvorfor er det nødvendigt, når data-mængden vokser?
- Hands-on: tilføj filtrering, sortering og/eller paginering til én af jeres GET-routes
</details>

---

## Forberedelse

- Færdiggør [REST API-øvelse: Studerende med CRUD](../opgaver/express-rest-api-students.md) (Del 1 og Del 2) fra sidste gang, hvis I ikke er i mål — det er jeres eget `/students`\-API, som holdes op mod de seks principper i dagens opsamling. Har I ikke nået den, så kig i stedet på [cederdorff/express-rest-api-students](https://github.com/cederdorff/express-rest-api-students) og vær klar til at tale ud fra den
- [Øvelse 6: AMAbotten som REST API](../opgaver/express-rest-api-amabot.md) er nu mere jeres eget tempo — I må gerne arbejde videre med den, men det er ikke et krav for i dag
- Læs ["Routing"](https://expressjs.com/en/guide/routing.html) i Express.js-dokumentationen, særligt afsnittet om `express.Router()`
- Genopfrisk `req.query` i [Request-referencen](https://expressjs.com/en/api.html#req.query) på Express.js — I kender allerede `req.params` og `req.body` fra sidst
- Læs ["REST API Best Practices – REST Endpoint Design Examples"](https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/) på freeCodeCamp, særligt punktet om filtrering/sortering/paginering
- Supplerende på [Scrimba](https://scrimba.com/fullstack-path-c0fullstack):
    - færdiggør Fullstack > Express.js > "Build an Express API", hvis I ikke nåede det efter sidste gang

---

## Materialer

- Slides: TBA
- Opgaver:
    - [REST API-øvelse: Arkitektur — routes, data, controllers og filtrering](../opgaver/express-rest-api-arkitektur.md)
    - [Øvelse 7: AMAbotten i lag — routes og data-modul](../opgaver/express-rest-api-amabot-arkitektur.md) — overfør routes/data-modul-opdelingen til jeres eget AMAbot-API fra øvelse 6, i eget tempo

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178045
canvas_module_position: 22
canvas_module_published: true
canvas_module_item_id: 1018715
canvas_module_item_position: 1
canvas_page_id: 200718
canvas_page_slug: "plan-for-race-6-arkitektur-og-rest-api-best-practices"
canvas_page_title: "Plan for RACE 6 - Arkitektur og REST API Best Practices"
canvas_page_published: true
canvas_updated_at: "2026-09-17T11:25:00Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018715"
local_status: mirrored
```

</details>
