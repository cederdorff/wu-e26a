# RACE 5 - Node/Express REST API - 16-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I dag skifter vi fra at bygge sider til at bygge et REST API: HTTP-metoderne som CRUD, route parameters, statuskoder og `response.json()`. Vi øver det i en separat, mindre øvelse, før I senere omskriver selve AMAbotten fra SSR til REST API — blandt andet fordi `fetch()` i [DOB 5](./019-dob-5-fetch-og-async-javascript-18-09-2026.md) har brug for et JSON-svar i stedet for HTML.

---

## Agenda

<details>
<summary><strong>1. Opsamling: Persistens</strong></summary>

- Hvad er JSON egentlig, og hvorfor bruger vi det til at gemme og sende data — frem for fx almindelig tekst?
- Forklar to og to jeres `loadStudents()`/`saveStudents()` eller `loadMessages()`/`saveMessages()` for hinanden
- Genbesøg read → modify → write: hvorfor er alle tre trin nødvendige, og hvad går galt, hvis I springer et over?
- Test: har alle fået persistens til at virke i mindst én af øvelserne fra sidst? Genstart serveren, og bekræft at data stadig er der
</details>
<details>
<summary><strong>2. Fra sider (HTML) til data (JSON): SSR vs REST API</strong></summary>

- Genbesøg SSR fra RACE 2: `response.render()` kombinerer data og en EJS-template til et færdigt HTML-dokument
- I et REST API sender serveren i stedet rene data — der er intet HTML og ingen visning involveret
- Samme request/response-model og samme routing-tankegang som hele forløbet — bare et andet "produkt" i selve svaret
- Motivation: en `fetch()` fra JavaScript i browseren (DOB 5) forventer JSON tilbage, ikke en hel HTML-side
</details>
<details>
<summary><strong>3. Hvad er et API?</strong></summary>

- Client-server-modellen: klienten (en app, en browser, et andet program) sender et request, serveren svarer med et response — API'et er aftalen om *hvordan* den samtale foregår
- Et API er et sæt regler, et program stiller til rådighed, så andre programmer kan bruge dets data eller funktioner — uden selv at kende det indeni
- Eksempler I allerede kender: `getUserMedia()` beder om adgang til kameraet, `navigator.geolocation` spørger om enhedens position, en vejrtjeneste eller en betalingsudbyder som MobilePay/Stripe — alt sammen API'er, ikke kun webservere
- I har allerede set det i praksis: Network-fanen fra RACE 4, hvor Canvas' People-side henter kursister som et JSON-array via GET — og Instagram gør det samme med profil- og opslagsdata via GraphQL
- Restaurant-analogi (se [video](https://www.youtube.com/watch?v=s7wmiS2mSXY)): kunden (klienten) bestiller hos tjeneren (API'et), som videregiver ordren til køkkenet (serveren) og bringer resultatet tilbage — uden at kunden nogensinde ser køkkenet
- En REST API er én bestemt måde at bygge et API på — det er dét, resten af dagen handler om
</details>
<details>
<summary><strong>4. Hvad er et REST API?</strong></summary>

- Præcis definition: REST (**RE**presentational **S**tate **T**ransfer) er en arkitektur-stil for API'er, bygget oven på HTTP — ikke en protokol eller teknologi, I installerer (se evt. [REST APIs i 100 sekunder](https://www.youtube.com/watch?v=-MTSQjw5DrM&ab_channel=Fireship))
- HTTP er selve fundamentet: en request-response-protokol, der allerede definerer de metoder (GET, POST, PUT, DELETE …), REST genbruger til CRUD — REST opfinder ikke metoderne, det sætter faste regler for, hvordan de bruges (se evt. [MDN: HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods))
- Ressourcer (fx `users`, `posts`) identificeres ved en URL — `/users`, `/users/:id` — semantisk og ren, ikke gemt i en query-string
- HTTP-metoderne GET, POST, PUT og DELETE svarer til CRUD: Read, Create, Update, Delete
- Statuskoder fortæller om resultatet af et request: `200 OK`, `201 Created`, `404 Not Found`
- `response.json()` sender JavaScript-data som JSON i responsen, med korrekt `Content-Type`
- Rigtigt eksempel: Dataforsyningens danske adressedata-API (`api.dataforsyningen.dk`) følger samme mønster — samling giver et array, ét element giver et objekt
- REST's Key Principles opsummeres først i overblik (kilde: [Codecademy](https://www.codecademy.com/article/what-is-rest-api)), derefter ét slide per princip, med eksempler fra dagens `/students`\-API:
    1.  **Client-Server** — Thunder Client og Express-serveren kender intet til hinandens indre, kun til `/students`
    2.  **Stateless** — `GET /students/1` og `GET /students/2` er to helt uafhængige requests; id'et skal med hver gang
    3.  **Ressourcer & URI'er** — `/students` (samling) og `/students/:id` (element)
    4.  **CRUD via HTTP-metoder** — GET/POST/PUT/DELETE på `/students`
    5.  **Statuskoder** — `200`, `201`, `404` (kendt fra RACE 1)
    6.  **JSON som format** — `response.json()` sender arrayet som JSON, med korrekt `Content-Type`
- I går i gang med dagens øvelse undervejs: byg GET, POST, route parameters, PUT og DELETE som minimum, og test hver route i Thunder Client — ikke kun i browseren. Formålet er at træne mønsteret, før I senere overfører det til AMAbotten
</details>
<details>
<summary><strong>5. JSON begge veje: <code>express.json()</code></strong></summary>

- `express.urlencoded()` (fra HTML-formularer) og `express.json()` (fra fetch/Thunder Client) er to forskellige måder, en request body kan være kodet på
- `request.body` findes stadig — bare med en JSON-struktur i stedet for form-felter
- Test i Thunder Client: send en POST med en JSON body, og se hvad der lander i `request.body`
</details>
<details>
<summary><strong>6. Find én bestemt ressource: route parameters</strong></summary>

- `:id` i routens sti, værdien findes i `request.params.id`
- `request.params.id` er altid en string — `Number()` er nødvendig, når den skal sammenlignes med et numerisk id
- `.find()` finder én bestemt ressource; findes intet, får I `null` tilbage i dag — rigtig `404`\-håndtering venter til en senere øvelse
</details>

---

## Forberedelse

- Færdiggør [JSON-øvelse: Studerende i en JSON-fil](../opgaver/express-ejs-json-students.md) og [øvelse 5 · Gem AMAbottens chathistorik](../opgaver/express-ejs-amabot-persistens.md) fra RACE 4, hvis I ikke er helt i mål endnu
- Genopfrisk [Response object](https://expressjs.com/en/5x/api/response/) i Express.js API-referencen, særligt `res.json()` — I kender allerede [Request object](https://expressjs.com/en/5x/api/request/) fra RACE 2
- Læs om [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) på MDN, særligt `200`, `201` og `404`
- Skim ["REST"](https://developer.mozilla.org/en-US/docs/Glossary/REST) på MDN som en hurtig introduktion til begrebet
- Skim ["HTTP request methods"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) på MDN — GET/POST/PUT/DELETE findes i HTTP, længe før REST kommer ind i billedet
- Skim ["REST — Key Principles"](https://www.codecademy.com/article/what-is-rest) på Codecademy og evt. ["REST API Explained (2 min)"](https://www.youtube.com/watch?v=WRsKs-K6iII) på YouTube
- Supplerende på [Scrimba](https://scrimba.com/fullstack-path-c0fullstack):
    - fortsæt på Fullstack > Express.js (særligt "Build an Express API")
    - ["What is a REST API?"](https://scrimba.com/explain/guide09u8e4urj)
    - ["HTTP Methods Explained"](https://scrimba.com/explain/guide0l5rrn4da)
    - ["HTTP Request Methods"](https://scrimba.com/explain/guide0067ph2c4)

---

## Materialer

- Slides:
    - [RACE 5 · Node/Express REST API](https://cederdorff.com/wu-e26a/rest-api/)
- Opgaver:
    - [REST API-øvelse: Studerende med CRUD](../opgaver/express-rest-api-students.md) — Del 1 bygger fuld CRUD (GET, POST, PUT, DELETE) for `/students` i memory, Del 2 flytter data til en JSON-fil uden at ændre routes' logik. Statuskoder og fejlhåndtering af ugyldige id'er venter til en senere øvelse
    - [Øvelse 6: AMAbotten som REST API](../opgaver/express-rest-api-amabot.md) — bygger videre på jeres egen AMAbot fra øvelse 3-5: del projektet i `client`/`server`, fjern EJS, og genskab AMAbotten som et rent REST API — `/messages` med tre endpoints, `/answers` med fuld CRUD

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
canvas_page_published: true
canvas_updated_at: "2026-09-21T06:58:18Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018706"
local_status: mirrored
```

</details>
