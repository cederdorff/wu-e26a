# RACE 6 - Arkitektur og REST API Best Practices - 23-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Sidste gang byggede I jeres første REST API: CRUD med GET, POST og PUT, route parameters og korrekte statuskoder — men det hele lå samlet i én `server.js`. I dag skifter vi fokus fra _om_ API'et virker til _hvordan_ det er struktureret.

Vi ser på, hvordan man deler en voksende Express-backend op i moduler — I kender allerede idéen fra fx `loadMessages()`/`saveMessages()` og fra at flytte data ud i sin egen fil, men i dag bruger vi den samme tankegang på selve routes med Express' `Router`. Derudover kigger vi på en række konkrete REST best practices for navngivning af ressourcer og konsistente responses, og bygger videre på selve API-designet med et par af de mest almindelige mønstre i et rigtigt REST API: filtrering, sortering og paginering via query parameters, fx `/messages?sender=user` eller `/messages?sender=chatbot`.

Fejlhåndtering (og sikkerhed) gemmer vi til [RACE 7](./024-race-7-sikkerhed-og-error-handling-25-09-2026.md), hvor der er afsat en hel gang til det.

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
<summary><strong>3. Opdel kode i moduler — samme idé, nyt sted</strong></summary>

- Genkend mønstret: I har allerede flyttet data og funktioner ud i egne moduler med `export`/`import`
- I dag bruger vi samme idé på routes: hver ressource kan få sin egen fil
- Et lille eksempel på mappestruktur med `routes/` og `data/`
</details>
<details>
<summary><strong>4. Express Router: en separat routes-fil</strong></summary>

- `express.Router()` som en selvstændig "mini-app" for én ressource
- Montér en router på hoved-appen: `app.use("/messages", messagesRouter)`
- Praktisk: flyt en eksisterende gruppe routes over i sin egen router-fil
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

- Opdel jeres eksisterende routes i en separat routes-fil efter dagens mønster
- Tilføj filtrering, sortering og/eller paginering til én af jeres GET-routes
- Test undervejs i Thunder Client med forskellige query parametre
</details>

---

## Forberedelse

- Genbesøg jeres eget REST API fra sidste gang, og vær klar til at forklare, hvordan `server.js` er organiseret lige nu
- Læs ["Routing"](https://expressjs.com/en/guide/routing.html) i Express.js-dokumentationen, særligt afsnittet om `express.Router()`
- Genopfrisk `req.query` i [Request-referencen](https://expressjs.com/en/api.html#req.query) på Express.js — I kender allerede `req.params` og `req.body` fra sidst
- Læs ["REST API Best Practices – REST Endpoint Design Examples"](https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/) på freeCodeCamp, særligt punktet om filtrering/sortering/paginering

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
