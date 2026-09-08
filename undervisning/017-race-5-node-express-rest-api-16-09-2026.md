# RACE 5 - Node/Express REST API - 16-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Sidste gang fik AMAbottens samtalehistorik sit eget liv i en JSON-fil, så data kan overleve en genstart af serveren. Indtil nu har jeres server dog kun svaret med færdigrenderet HTML — enten fra en simpel formular eller fra EJS.

Om en uges tid, i [DOB 5](./019-dob-5-fetch-og-async-javascript-18-09-2026.md), skal I begynde at hente data fra JavaScript i browseren med `fetch()` — og til det har serveren brug for et andet slags svar: rene data i JSON-format, ikke HTML.

I dag skifter vi derfor fokus fra at bygge sider til at bygge et REST API. Vi øver HTTP-metoderne som CRUD, route parameters, statuskoder og `response.json()` i en mindre, separat øvelse. Først senere omskriver I selve AMAbotten fra en SSR-app til et REST API — i dag træner vi konceptet et andet sted først.

---

## Agenda

<details>
<summary><strong>1. Opsamling: Persistens fra RACE 4</strong></summary>

- Forklar to og to jeres `loadStudents()`/`saveStudents()` eller `loadMessages()`/`saveMessages()` for hinanden
- Genbesøg read → modify → write: hvorfor er alle tre trin nødvendige, og hvad går galt, hvis I springer et over?
- Test: har alle fået persistens til at virke i mindst én af øvelserne fra sidst? Genstart serveren, og bekræft at data stadig er der
</details>
<details>
<summary><strong>2. Fra sider til data: SSR vs REST API</strong></summary>

- Genbesøg SSR fra RACE 2: `response.render()` kombinerer data og en EJS-template til et færdigt HTML-dokument
- I et REST API sender serveren i stedet rene data — der er intet HTML og ingen visning involveret
- Samme request/response-model og samme routing-tankegang som hele forløbet — bare et andet "produkt" i selve svaret
- Motivation: en `fetch()` fra JavaScript i browseren (DOB 5) forventer JSON tilbage, ikke en hel HTML-side
</details>
<details>
<summary><strong>3. Hvad er et REST API?</strong></summary>

- Ressourcer (fx `users`, `posts`) identificeres ved en URL — `/users`, `/users/:id`
- HTTP-metoderne GET, POST, PUT og DELETE svarer til CRUD: Read, Create, Update, Delete
- Statuskoder fortæller om resultatet af et request: `200 OK`, `201 Created`, `404 Not Found`
- `response.json()` sender JavaScript-data som JSON i responsen, med korrekt `Content-Type`
</details>
<details>
<summary><strong>4. JSON begge veje: <code>express.json()</code></strong></summary>

- `express.urlencoded()` (fra HTML-formularer) og `express.json()` (fra fetch/Thunder Client) er to forskellige måder, en request body kan være kodet på
- `request.body` findes stadig — bare med en JSON-struktur i stedet for form-felter
- Test i Thunder Client: send en POST med en JSON body, og se hvad der lander i `request.body`
</details>
<details>
<summary><strong>5. Find én bestemt ressource: route parameters</strong></summary>

- `:id` i routens sti, værdien findes i `request.params.id`
- `request.params.id` er altid en string — `Number()` er nødvendig, når den skal sammenlignes med et numerisk id
- `.find()` finder én bestemt ressource; send `404`, hvis intet matcher
</details>
<details>
<summary><strong>6. Byg et REST API</strong></summary>

- Arbejd med dagens øvelse: byg GET, POST, route parameters + 404 og PUT som minimum
- Test hver route i Thunder Client undervejs — ikke kun i browseren
- Formålet er at træne mønsteret, før I senere overfører det til AMAbotten
</details>

---

## Forberedelse

- Færdiggør [JSON-øvelse: Studerende i en JSON-fil](../opgaver/express-ejs-json-students.md) og [øvelse 5 · Gem AMAbottens chathistorik](../opgaver/express-ejs-amabot-persistens.md) fra RACE 4, hvis I ikke er helt i mål endnu
- Genopfrisk [Response object](https://expressjs.com/en/5x/api/response/) i Express.js API-referencen, særligt `res.json()` — I kender allerede [Request object](https://expressjs.com/en/5x/api/request/) fra RACE 2
- Læs om [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) på MDN, særligt `200`, `201` og `404`
- Skim ["REST"](https://developer.mozilla.org/en-US/docs/Glossary/REST) på MDN som en hurtig introduktion til begrebet
- Fortsæt/afslut Fullstack &gt; Express.js på [Scrimba](https://scrimba.com/fullstack-path-c0fullstack), hvis I ikke nåede det efter RACE 1

---

## Materialer

- Slides: TBA
- Opgaver: TBA

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178040
canvas_module_position: 17
canvas_module_published: true
canvas_module_item_id: 1018706
canvas_module_item_position: 1
canvas_page_id: 200715
canvas_page_slug: "plan-for-race-5-node-slash-express-rest-api"
canvas_page_title: "Plan for RACE 5 - Node/Express REST API"
canvas_page_published: false
canvas_updated_at: "2026-09-03T11:23:36Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018706"
local_status: mirrored
```

</details>
