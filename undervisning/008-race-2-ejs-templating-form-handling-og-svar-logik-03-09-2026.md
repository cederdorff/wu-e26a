# RACE 2 - EJS templating, form handling og svar logik - 03-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I dag bygger vi først en lille server-renderet Express-app og udvider den gennem øvelse 1 og 2. I øvelse 3 bruger I samme request/response-flow til at gøre gårsdagens separate AMAbot-repository med `index.html` til et Express- og EJS-projekt.

---

## Agenda

<details>
<summary><strong>1. Opsamling: Hello Express</strong></summary>

**Opsamlingsøvelse:** I mindre grupper viser og forklarer I jeres løsning på [3\. Getting Started with Express.js (Hello Express)](../opgaver/hello-express.md).

Vælg konkrete steder i koden, og forklar:

- hvordan en request finder den rigtige route
- hvordan serveren sender et response
- hvad middleware gør
- hvordan I har testet jeres routes

Sammenlign derefter med [løsningsforslaget](https://github.com/cederdorff/node-express-todos-rest-api). Fokus er ikke på, om løsningerne er identiske, men på om I kan forklare de valg, I har truffet.
</details>
<details>
<summary><strong>2. SSR og CSR</strong></summary>

Fælles introduktion og live-kodning:

- **SSR:** Serveren kombinerer data og en template og sender færdig HTML til browseren.
- **CSR:** Serveren sender typisk data, mens JavaScript i browseren bygger eller opdaterer brugerfladen.
- I dagens løsning bruger vi **SSR**: Express kalder `response.render()`, og EJS genererer HTML på serveren.
- EJS-tags: `<% %>` til JavaScript-logik og `<%= %>` til escaped output.
</details>
<details>
<summary><strong>3. EJS</strong></summary>

**Øvelse 1:** Arbejd med [Din første server-renderede EJS-app](../opgaver/express-ejs-formular.md).

Første milepæl er nået, når:

- `GET /` renderer en EJS-template med en formular
- formularen sender et `POST`\-request til den rigtige route
- `express.urlencoded()` gør formularens data tilgængelige i `request.body`
- serveren sender navnet til templaten, som viser en personlig hilsen
- I kan finde både `GET`\- og `POST`\-requestet i Network-panelet
</details>
<details>
<summary><strong>4. Request/response-flow og debugging</strong></summary>

Vi tegner flowet fra browser til server og tilbage igen. Vær klar til at pege på den konkrete kode, der svarer til hvert led:

```text
method + action + name
          |
          v
POST-request -> express.urlencoded() -> request.body -> matchende POST-route -> response.render() -> EJS -> HTML
```

Vi samler også op på typiske fejl som `Cannot GET /`, manglende templates og `request.body === undefined`.
</details>
<details>
<summary><strong>5. Inputvalidering, datastrukturer og svarlogik</strong></summary>

**Øvelse 2:** Arbejd videre med [Formhåndtering, validering og svarlogik](../opgaver/express-ejs-formhaandtering-svarlogik.md).

Anden milepæl er nået, når appen:

- afviser tomt eller ugyldigt input med en forståelig fejlbesked
- bruger arrays til at gemme og vise tidligere input
- sender flere formularfelter til EJS, som renderer et relevant svar
- altid sender de data til templaten, som templaten forventer
</details>
<details>
<summary><strong>6. Server-renderet AMAbot med regelbaseret svarlogik</strong></summary>

**Øvelse 3:** Byg videre på gårsdagens GitHub-repository med den simple HTML-formular. Før I ændrer noget, gemmer I udgangspunktet i et commit. Derefter flytter I `index.html` til `views/index.ejs` og følger [Server-renderet AMAbot med regelbaseret svarlogik](../opgaver/express-ejs-amabot.md).

Dagens slutprodukt skal som minimum kunne:

- tage udgangspunkt i gårsdagens HTML-formular og have den gemt i Git
- gøre eksisterende CSS, JavaScript og billeder tilgængelige fra `public/` med `express.static()`
- vise en formular og en samtalehistorik
- modtage et spørgsmål på `POST /ask`
- vælge et svar om den studerende ud fra spørgsmålets indhold
- rendere brugerens spørgsmål og AMAbottens svar med EJS
- håndtere tomt input uden at crashe

Arbejd derefter med simpel sanitering af input. Hold validering, sanitering og EJS' output escaping adskilt: De løser forskellige problemer.

Hvis I når længere, kan I tilføje flere svarregler og undersøge forskellen på `request.body`, `request.query` og `request.params`.
</details>

---

## Forberedelse

- Sørg for, at du er nået igennem [3\. Getting Started with Express.js (Hello Express)](../opgaver/hello-express.md), og vær klar til at vise og forklare din løsning.
- Skim følgende som opslagsværker. Vælg ESM i kodeeksemplerne, når det er muligt:
    - [Routing](https://expressjs.com/en/guide/routing.html) i Express.js-dokumentationen
    - [Request object](https://expressjs.com/en/5x/api/request/) i Express.js API-reference
    - [Working with forms](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/forms) på MDN
- På Scrimba:
    - [Færdiggør Fullstack > Node.js > Build a Node API](https://scrimba.com/fullstack-path-c0fullstack)
    - [Se Fullstack > Express.js > Welcome to Express](https://scrimba.com/fullstack-path-c0fullstack)

---

## Materialer

## Præsentationer

- [EJS templating, form handling og svar logik](https://wu-e26a.cederdorff.com/express-ejs/)

## Opgaver

1.  [Din første server-renderede EJS-app](../opgaver/express-ejs-formular.md)
2.  [Formhåndtering, validering og svarlogik](../opgaver/express-ejs-formhaandtering-svarlogik.md)
3.  [Server-renderet AMAbot med regelbaseret svarlogik](../opgaver/express-ejs-amabot.md)

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178031
canvas_module_position: 8
canvas_module_published: true
canvas_module_item_id: 1018691
canvas_module_item_position: 1
canvas_page_id: 200710
canvas_page_slug: "plan-for-race-2-ejs-templating-form-handling-og-svar-logik"
canvas_page_title: "Plan for RACE 2 - EJS templating, form handling og svar logik"
canvas_page_published: true
canvas_updated_at: "2026-09-03T10:02:09Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018691"
local_status: mirrored
```

</details>
