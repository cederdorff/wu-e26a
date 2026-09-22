# RACE 7 - Sikkerhed og Error Handling - 25-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Jeres REST API'er — `/students`, `/teachers` og AMAbotten — har hele vejen igennem kørt den lykkelige vej: gyldige id'er, gyldigt input, kun brugt fra jeres egen frontend, med tekst der bare var tekst. I dag samler vi op på det, der bevidst er sprunget over undervejs: eksplicitte statuskoder i stedet for Express' standard-`200`, ordentlig fejlhåndtering af ugyldige id'er og manglende input, og en fælles fejl-middleware, så én uventet fejl ikke crasher hele serveren.

Til sidst lukker vi to konkrete sikkerhedshuller, I allerede har mødt uden at lukke dem: `cors()`, der lige nu tillader alle origins, og AMAbottens `POST /messages`, der gemmer og sender brugerens tekst videre helt uredigeret.

---

## Agenda

<details>
<summary><strong>1. Opsamling: Hvor efterlod vi API'et?</strong></summary>

- Kort oplæg: genopfrisk, hvad der bevidst er sprunget over indtil nu — ingen eksplicitte statuskoder ud over Express' standard-`200`, ingen `404` ved ugyldige id'er, ingen validering af `request.body`, `cors()` uden argumenter, og ingen sanering af brugerens tekst, før serveren gemmer og sender den videre
- To og to: åbn jeres eget `/students`\- eller `/teachers`\-API, og prøv bevidst at ødelægge det — send et ugyldigt id, en tom body, et forkert felt-navn
- Prøv konkret `PUT /students/999` (et id, der ikke findes) — hvad sker der i terminalen, og hvad får I tilbage i Thunder Client?
- Prøv også: omdøb midlertidigt `data/students.json` (eller slet dens indhold), og send `GET /students` — hvad sker der nu, og hvor i koden går det galt? Giv filen dens rigtige navn og indhold tilbage bagefter
- Kort opsamling i plenum: hvor mange forskellige måder viser "det gik galt" sig på lige nu — et tavst `null`, Express' egen fejlside med en fuld stack trace (både fra et ugyldigt id og fra en ødelagt datafil), eller bare et statuskode-tal, der ikke passer med, hvad der faktisk skete?
</details>
<details>
<summary><strong>2. Statuskoder, for alvor denne gang</strong></summary>

- Genopfrisk kort: statuskoder falder i familier — 2xx (success), 4xx (fejl hos klienten), 5xx (fejl hos serveren) — I kender allerede `200`, `201` og `404`, men har endnu ikke sat dem eksplicit nogen steder
- Lige nu sender alle jeres routes `response.json(...)` eller `response.send()` uden `.status(...)` — Express sætter altid `200 OK` som standard, også ved `POST` (burde være `201 Created`) og `DELETE` (burde være `204 No Content`, uden body)
- Gennemgå sammen: `response.status(201).json(newStudent)` ved oprettelse, `response.status(204).send()` ved sletning
- Hands-on: gå jeres egne `/students`\- og `/teachers`\-routes igennem, og gør alle statuskoder eksplicitte og korrekte
</details>
<details>
<summary><strong>3. Fejlhåndtering: 404 ved ugyldige id'er</strong></summary>

- Mønster: efter `.find()`, tjek om resultatet er `undefined` — er det, `response.status(404).json({ error: "..." })` og `return`; ellers fortsætter routen som normalt
- `return` er nødvendigt her — glemmer I det, forsøger Express at sende to responses på samme request, og fejler
- Gælder alle routes, der finder én bestemt ressource ud fra `:id` — `GET /:id`, `PUT /:id`, `DELETE /:id`
- Hands-on: tilføj 404-tjek til jeres egne routes. Gentag `PUT /students/999` fra opsamlingen, og bekræft at I nu får en ordentlig `404`\-fejlbesked i stedet for Express' egen fejlside
</details>
<details>
<summary><strong>4. Validering: 400 ved ugyldigt input</strong></summary>

- Samme princip som 404, bare på selve inputtet: før I opretter eller opdaterer, tjek at de nødvendige felter rent faktisk findes i `request.body` — mangler fx `name`, er der ikke noget at oprette
- Findes et felt ikke, eller er det tomt: `response.status(400).json({ error: "..." })`
- Diskutér kort: hvor grundig skal validering være i dag? Et tjek for "findes feltet, og er det ikke tomt" er nok — typer, længder og formater (fx et gyldigt telefonnummer) er et dybere kaninhul, I ikke skal ned i nu
- Hands-on: tilføj validering til `POST`/`PUT` for jeres egne ressourcer
</details>
<details>
<summary><strong>5. try/catch: fang selv en fejl, dér hvor den opstår</strong></summary>

- JavaScripts generelle mekanisme til at håndtere en fejl: `try { ... } catch (error) { ... }` — går noget galt inde i `try`-blokken, springer resten af den over, og `catch`-blokken kører i stedet, med selve fejlen i `error`
- Konkret brug i dag: `loadStudents()`/`loadTeachers()` kan fejle, hvis JSON-filen mangler eller indeholder ugyldig JSON — præcis det, I selv fremprovokerede i opsamlingen. Pak `fs.readFile()`/`JSON.parse()` ind i `try`/`catch`, så I selv kan sende en tydelig fejlbesked i stedet for at lade fejlen poppe videre op uhåndteret
- I skal ikke `try`/`catch` hver eneste route i dag — kun hvor I selv har brug for at reagere på en bestemt fejl
- Mere om `try`/`catch` — denne gang omkring `fetch()` og fejl fra serveren i klienten — er emnet, [næste DOB-gang](./025-dob-7-client-side-error-handling-28-09-2026.md) tager fat på
- Hands-on: tilføj `try`/`catch` omkring jeres `loadX()`\-funktioner, og send selv en tydelig fejlbesked, hvis noget går galt
</details>
<details>
<summary><strong>6. Middleware, generelt — og en fælles fejl-middleware</strong></summary>

- Begreb, sat på noget I allerede har brugt uden at vide det: en middleware-funktion er kode, der kører imellem request og response — `express.json()` og `cors()` er begge middleware, monteret med `app.use()`
- En 404-catch-all: en sidste `app.use(...)` nederst i filen, der rammer enhver sti, ingen anden route matchede — noget andet end 404-tjekket fra før, som handler om et ugyldigt id på en sti, der ellers findes
- Express' særlige fejl-middleware: fire parametre (`err, request, response, next`) i stedet for de sædvanlige tre — Express genkender den automatisk på antallet af parametre, og kalder den, når en fejl ikke selv er fanget med `try`/`catch` undervejs, som i sidste punkt
- Uden en fejl-middleware svarer Express selv med sin egen HTML-fejlside — inklusive en fuld stack trace, som en rigtig klient aldrig bør se. I stedet: `response.status(500).json({ error: "..." })` — samme `{ error: "..." }`\-facon som `404`\- og `400`\-svarene, så alle fejl fra API'et ser ens ud, uanset hvor de opstår
- Hands-on: tilføj en 404-catch-all og en fælles fejl-middleware nederst i `server.js`, så en uventet fejl ét sted i systemet giver et rent, forudsigeligt JSON-svar i stedet for Express' standard-fejlside
</details>
<details>
<summary><strong>7. CORS: fra "tillad alt" til "tillad jeres egen frontend"</strong></summary>

- Genopfrisk: browserens same-origin policy blokerer som udgangspunkt `fetch()` på tværs af origins — det er derfor AMAbottens frontend først virkede, da `cors()` blev tilføjet på serveren
- `app.use(cors())` uden argumenter sætter HTTP-headeren `Access-Control-Allow-Origin: *` — enhver hjemmeside kan nu kalde jeres API fra en brugers browser, ikke kun jeres egen frontend
- Diskutér: hvad kunne gå galt, hvis en helt fremmed hjemmeside kaldte jeres `/students`\- eller `/messages`\-API fra en brugers browser?
- Løsningen: begræns til den origin, I selv bruger — `cors({ origin: "http://127.0.0.1:5500" })`
- Hands-on: ret `cors()`\-opsætningen i AMAbot-serveren, og bekræft at jeres egen frontend stadig virker
</details>
<details>
<summary><strong>8. Sikkerhed i data: escape brugerens tekst på serveren (XSS)</strong></summary>

- Genbesøg `POST /messages`: `request.body.text` gemmes i `data/messages.json` og sendes videre helt uredigeret — præcis som den blev modtaget, uanset hvad den indeholder
- Demo: send et "spørgsmål" som `<img src=x onerror="alert('hacked')">` via Thunder Client — kig i `data/messages.json`, og se hvad der sker, når teksten senere vises i AMAbottens frontend
- Begreb: **Cross-Site Scripting (XSS)** — når en brugers egen tekst kan udføre kode i en andens browser, fordi den aldrig blev renset for HTML, før den blev gemt og sendt videre
- Løsningen: en lille `escapeHtml()`\-funktion på serveren, der erstatter `<`, `>`, `&`, `"` og `'` med deres HTML-entities, kørt på brugerens tekst, før den gemmes
- Hands-on: tilføj `escapeHtml()` til `POST /messages`, gentag angrebet fra demoen, og bekræft at `data/messages.json` nu indeholder den escapede tekst i stedet for rå HTML
</details>

---

## Forberedelse

- Færdiggør [øvelse 7](../opgaver/express-rest-api-amabot-arkitektur.md). Har du tid, må du også gerne arbejde videre på [øvelse 8](../opgaver/fetch-dom-amabot.md)
- Genopfrisk [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) på MDN, denne gang med fokus på `201`, `204` og `400`
- Læs ["Cross-Origin Resource Sharing (CORS)"](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) på MDN, særligt afsnittet om `Access-Control-Allow-Origin`
- Supplerende, hvis du har tid:
    - ["Error handling"](https://expressjs.com/en/guide/error-handling.html) i Express.js-dokumentationen
    - ["Writing middleware"](https://expressjs.com/en/guide/writing-middleware.html) i Express.js-dokumentationen — `express.json()` og `cors()` er begge eksempler, du allerede har brugt
    - [`cors`-pakken på npm](https://www.npmjs.com/package/cors), særligt eksemplet med `origin` som en fast værdi i stedet for standardopsætningen
    - ["Cross Site Scripting (XSS)"](https://owasp.org/www-community/attacks/xss/) hos OWASP som introduktion til begrebet

## Materialer

- Slides: TBA
- Opgaver: TBA
- Kodeeksempler: TBA

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178047
canvas_module_position: 24
canvas_module_published: true
canvas_module_item_id: 1018718
canvas_module_item_position: 1
canvas_page_id: 200719
canvas_page_slug: "plan-for-race-7-sikkerhed-og-error-handling"
canvas_page_title: "Plan for RACE 7 - Sikkerhed og Error Handling"
canvas_page_published: false
canvas_updated_at: "2026-09-22T08:08:50Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018718"
local_status: mirrored
```

</details>
