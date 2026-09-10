# RACE 6 - Arkitektur og REST API Best Practices - 23-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Sidste gang byggede I jeres første REST API, men samlet i én `server.js`. I dag skifter vi fokus fra _om_ API'et virker til _hvordan_ det er struktureret: vi deler backenden op i lag — routes, controllers, data — med Express' `Router`, ser på REST best practices for navngivning og konsistente responses, og tilføjer filtrering, sortering og paginering via query parameters.

Fejlhåndtering og sikkerhed gemmer vi til [RACE 7](./024-race-7-sikkerhed-og-error-handling-25-09-2026.md).

---

## Agenda

<details>
<summary><strong>1. Opsamling: REST API fra sidste gang</strong></summary>

- Forklar to og to jeres eget REST API fra sidste gang: hvilke routes, statuskoder og route parameters endte I med?
- Hvordan ser `server.js` ud lige nu — hvor meget forskelligt ansvar ligger i den samme fil?
- Genbesøg CRUD ↔ HTTP-metoderne, hvis der stadig er tvivl
</details>
<details>
<summary><strong>2. Problemet: når server.js vokser</strong></summary>

- Routes, forretningslogik og data blandet sammen i én fil
- Svært at finde rundt i, svært at genbruge og svært at teste isoleret
- Motivation: samme problem som at proppe al JavaScript ind i én kæmpe funktion
</details>
<details>
<summary><strong>3. Layered Architecture: routes, controllers og data</strong></summary>

- Ansvarsfordeling: routes (HTTP ind/ud) → controllers (logik) → data-adgang (fx en JSON-fil, senere en database)
- Hver fil/modul har ét ansvar — genkend mønstret fra `loadMessages()`/`saveMessages()`
- Et lille eksempel på mappestruktur med `routes/`, `controllers/` og `data/`
</details>
<details>
<summary><strong>4. Express Router: en separat routes-fil</strong></summary>

- `express.Router()` som en selvstændig "mini-app" for én ressource
- Montér en router på hoved-appen: `app.use("/messages", messagesRouter)`
- Routen kalder en controller-funktion; selve logikken bor i controlleren, ikke i routen
</details>
<details>
<summary><strong>5. REST best practices: navngivning og konsistens</strong></summary>

- Ressourcer er substantiver, ikke verber: `/messages`, ikke `/getMessages`
- Flertal for collections: `/users`, `/users/:id`
- Konsistent respons-format og statuskoder på tværs af hele API'et
</details>
<details>
<summary><strong>6. Filtrering, sortering & paginering med query parameters</strong></summary>

- `request.query` til at læse fx `?sender=user`
- Filtrering: brug `.filter()` på data ud fra en eller flere query parametre
- Sortering: `?sort=...` — hvilken property skal der sorteres på?
- Paginering: `?page=` og `?limit=` — hvorfor er det nødvendigt, når data-mængden vokser?
</details>
<details>
<summary><strong>7. Hands-on: Omstrukturér og udbyg jeres REST API</strong></summary>

- Opdel jeres eksisterende routes i routes/controllers efter dagens mønster
- Tilføj filtrering, sortering og/eller paginering til én af jeres GET-routes
- Test undervejs i Thunder Client med forskellige query parametre
</details>

---

## Forberedelse

- Genbesøg jeres eget REST API fra sidste gang, og vær klar til at forklare, hvordan `server.js` er organiseret lige nu
- Læs ["Routing"](https://expressjs.com/en/guide/routing.html) i Express.js-dokumentationen, særligt afsnittet om `express.Router()`
- Genopfrisk `req.query` i [Request-referencen](https://expressjs.com/en/api.html#req.query) på Express.js — I kender allerede `req.params` og `req.body` fra sidst
- Læs ["REST API Best Practices – REST Endpoint Design Examples"](https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/) på freeCodeCamp, særligt punktet om filtrering/sortering/paginering
- Supplerende på [Scrimba](https://scrimba.com/fullstack-path-c0fullstack):
  - færdiggør Fullstack &gt; Express.js &gt; "Build an Express API", hvis I ikke nåede det efter sidste gang

---

## Materialer

- Slides: TBA
- Opgaver: TBA

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
