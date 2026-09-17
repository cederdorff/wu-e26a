# RACE 6 - Arkitektur og REST API Best Practices - 23-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Sidste gang byggede I jeres første REST API, men samlet i én `server.js`. I dag mærker I selv, hvor hurtigt det vokser sig uoverskueligt — I udvider jeres students-API med et tilsvarende sæt endpoints for teachers, i samme fil. Derefter skifter vi fokus fra _om_ API'et virker til _hvordan_ det er struktureret: vi deler `server.js` op med Express' `Router`, flytter data-adgangen videre til sit eget data-modul, ser på REST best practices for navngivning og konsistente responses, tilføjer filtrering, sortering og paginering via query parameters, og kigger kort (og frivilligt) videre på endnu et lag med controllers.

Fejlhåndtering og sikkerhed gemmer vi til [RACE 7](./024-race-7-sikkerhed-og-error-handling-25-09-2026.md).

---

## Agenda

<details>
<summary><strong>1. Opsamling: Lever jeres REST API op til de seks principper?</strong></summary>

- To og to: genbesøg de seks REST-principper fra RACE 5 — Client-Server, Stateless, Ressourcer & URI'er, CRUD via HTTP-metoder, Statuskoder, JSON som format
- Hold dem op mod jeres eget `/students`-API fra [Studerende med CRUD](../opgaver/express-rest-api-students.md): for hvert princip — lever jeres løsning op til det, og hvorfor/hvorfor ikke?
- Har I ikke nået øvelsen, så brug i stedet [cederdorff/express-rest-api-students](https://github.com/cederdorff/express-rest-api-students) som udgangspunkt for samtalen
- Hvilket princip føles mest abstrakt eller svært at få hold på i praksis — og hvorfor?
- Kort opsamling i plenum: hvor er grupperne enige/uenige?
</details>
<details>
<summary><strong>2. Hands-on: Udvid jeres students-API med et teachers-API</strong></summary>

- Tilføj samme CRUD-mønster for en ny ressource `/teachers` i jeres eksisterende `server.js` — `GET`, `GET/:id`, `POST`, `PUT`, `DELETE`, kopiér mønstret fra `/students`
- Samme tilgang som students del 1: et array i memory, ingen statuskoder eller fejlhåndtering endnu
- Mål: mærk selv hvor stort og uoverskueligt `server.js` bliver med to ressourcer i samme fil
</details>
<details>
<summary><strong>3. Problemet: hvad skete der i jeres server.js?</strong></summary>

- Kort fælles refleksion: hvad blev svært, da I tilføjede teachers oveni students?
- Routes, forretningslogik og data blandet sammen i én fil
- Svært at finde rundt i, svært at genbruge og svært at teste isoleret
- Motivation: samme problem som at proppe al JavaScript ind i én kæmpe funktion
</details>
<details>
<summary><strong>4. Express Router og data-modul: opdel i separate filer</strong></summary>

- `express.Router()` som en selvstændig "mini-app" for én ressource
- Montér en router på hoved-appen: `app.use("/students", studentsRouter)` og `app.use("/teachers", teachersRouter)`
- `loadStudents()`/`saveStudents()` (og teachers-varianterne) hører ikke hjemme i en routes-fil — en route skal håndtere HTTP ind/ud, ikke filsystemet — så de flytter videre til deres eget data-modul (`data/students.js`, `data/teachers.js`)
- Hands-on: flyt jeres students- og teachers-routes over i hver sin fil i en `routes/`-mappe, og flyt derfra data-adgangen videre til et `data/`-modul
</details>
<details>
<summary><strong>5. REST best practices: navngivning og konsistens</strong></summary>

- Ressourcer er substantiver, ikke verber: `/teachers`, ikke `/getTeachers`
- Flertal for collections: `/students`, `/students/:id`
- Konsistent respons-format og statuskoder på tværs af `/students` og `/teachers`
</details>
<details>
<summary><strong>6. Filtrering, sortering & paginering med query parameters</strong></summary>

- `request.query` til at læse fx `?education=Datamatiker`
- Filtrering: brug `.filter()` på data ud fra en eller flere query parametre
- Sortering: `?sort=...` — hvilken property skal der sorteres på?
- Paginering: `?page=` og `?limit=` — hvorfor er det nødvendigt, når data-mængden vokser?
- Hands-on: tilføj filtrering, sortering og/eller paginering til én af jeres GET-routes
</details>
<details>
<summary><strong>7. Et kig videre: controllers (frivilligt)</strong></summary>

- Når en routes-fil selv får rigtig logik (som filtreringen ovenfor), kan I trække den ud i en controller-funktion — routen kalder bare controlleren
- Kort demo af mappestruktur med `routes/`, `data/` og `controllers/` — I skal ikke nå at bygge det i dag, men vide hvornår det giver mening
- Frivilligt stretch: dem der er færdige, kan prøve at trække en controller ud for students eller teachers
</details>
<details>
<summary><strong>8. Hands-on: Fortsæt udbygning af jeres REST API</strong></summary>

- Sørg for at students og teachers begge ligger i egne routes-filer, med data-adgang i et data-modul
- Tilføj filtrering, sortering og/eller paginering, hvis I ikke nåede det under punkt 6
- Frivilligt: prøv at trække en controller ud, jf. punkt 7
- Test undervejs i Thunder Client med forskellige query parametre
</details>

---

## Forberedelse

- Færdiggør [REST API-øvelse: Studerende med CRUD](../opgaver/express-rest-api-students.md) (Del 1 og Del 2) fra RACE 5, hvis I ikke er helt i mål endnu — det er jeres eget `/students`-API, I skal holde op mod de seks principper i dagens opsamling. Har I ikke nået den, så kig i stedet på [cederdorff/express-rest-api-students](https://github.com/cederdorff/express-rest-api-students) og vær klar til at tale ud fra den
- [Øvelse 6: AMAbotten som REST API](../opgaver/express-rest-api-amabot.md) er nu mere jeres eget tempo — I må gerne arbejde videre med den, men det er ikke et krav for i dag
- Læs ["Routing"](https://expressjs.com/en/guide/routing.html) i Express.js-dokumentationen, særligt afsnittet om `express.Router()`
- Genopfrisk `req.query` i [Request-referencen](https://expressjs.com/en/api.html#req.query) på Express.js — I kender allerede `req.params` og `req.body` fra sidst
- Læs ["REST API Best Practices – REST Endpoint Design Examples"](https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/) på freeCodeCamp, særligt punktet om filtrering/sortering/paginering
- Supplerende på [Scrimba](https://scrimba.com/fullstack-path-c0fullstack):
  - færdiggør Fullstack &gt; Express.js &gt; "Build an Express API", hvis I ikke nåede det efter sidste gang

---

## Materialer

- Slides: TBA
- Opgaver: [REST API-øvelse: Arkitektur — routes, data og controllers](../opgaver/express-rest-api-arkitektur.md)

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
canvas_page_published: false
canvas_updated_at: "2026-08-10T12:34:10Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018715"
local_status: mirrored
```

</details>
