# RACE 2 - EJS templating, form handling og svar logik - 03-09-2026

## Dagens fokus

I dag bygger vi videre på jeres Express-server og gør den til en lille server-renderet webapp. I skal bruge EJS til at generere HTML på serveren, modtage input fra en formular og sende et svar tilbage til brugeren.

Den centrale arbejdsgang er:

```text
Browser -> GET request -> Express-route -> EJS-template -> HTML-response
Browser -> POST-formular -> Express-route -> req.body -> svarlogik -> EJS -> ny HTML-response
```

Vi bruger denne arbejdsgang til først at lave en personlig hilsen og derefter en enkel chatbot. Chatbotten er regelbaseret og bruger almindelig JavaScript-logik — ikke kunstig intelligens.

### Når dagen er slut, kan I

- forklare forskellen på server-side rendering (SSR) og client-side rendering (CSR)
- konfigurere Express til at bruge EJS som template engine
- sende data fra en Express-route til en EJS-template med `res.render()`
- forbinde en HTML-formular med en `POST`-route via `method`, `action` og inputfeltets `name`
- modtage formularens data med `express.urlencoded()` og `req.body`
- validere brugerinput og generere et relevant svar med almindelig JavaScript-logik
- følge hele request/response-forløbet i browserens Network-panel

---

## Agenda

<details>
<summary><strong>1. Opsamling: Hello Express</strong></summary>

**Opsamlingsøvelse:** I mindre grupper viser og forklarer I jeres løsning på [3. Getting Started with Express.js (Hello Express)](../opgaver/hello-express.md).

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
- I dagens løsning bruger vi **SSR**: Express kalder `res.render()`, og EJS genererer HTML på serveren.
- EJS-tags: `<% %>` til JavaScript-logik og `<%= %>` til escaped output.

</details>

<details>
<summary><strong>3. EJS</strong></summary>

**Øvelse 1:** Arbejd med [Din første server-renderede EJS-app](../opgaver/express-ejs-formular.md).

Første milepæl er nået, når:

- `GET /` renderer en EJS-template med en formular
- formularen sender et `POST`-request til den rigtige route
- `express.urlencoded()` gør formularens data tilgængelige i `req.body`
- serveren sender navnet til templaten, som viser en personlig hilsen
- I kan finde både `GET`- og `POST`-requestet i Network-panelet

</details>

<details>
<summary><strong>4. Request/response-flow og debugging</strong></summary>

Vi tegner flowet fra browser til server og tilbage igen. Vær klar til at pege på den konkrete kode, der svarer til hvert led:

```text
method + action + name
          |
          v
POST-route -> express.urlencoded() -> req.body -> res.render() -> EJS -> HTML
```

Vi samler også op på typiske fejl som `Cannot GET /`, manglende templates og `req.body === undefined`.

</details>

<details>
<summary><strong>5. Inputvalidering, datastrukturer og svarlogik</strong></summary>

**Øvelse 2:** Arbejd videre med [Formhåndtering, validering og svarlogik](../opgaver/express-ejs-formhaandtering-svarlogik.md).

Anden milepæl er nået, når appen:

- afviser tomt eller ugyldigt input med en forståelig fejlbesked
- bruger arrays og objekter til at gemme og vise tidligere input
- bruger flere formularfelter i sin svarlogik
- altid sender de data til templaten, som templaten forventer

</details>

<details>
<summary><strong>6. Server-renderet chatbot med regelbaseret svarlogik</strong></summary>

**Øvelse 3:** Brug det, I har lært, i [Server-renderet chatbot med regelbaseret svarlogik](../opgaver/express-ejs-chatbot.md).

Dagens slutprodukt skal som minimum kunne:

- vise en formular og en samtalehistorik
- modtage en besked med `POST`
- vælge et svar ud fra beskedens indhold
- rendere brugerens besked og bottens svar med EJS
- håndtere tomt input uden at crashe

Arbejd derefter med simpel sanitering af input. Hold validering, sanitering og EJS' output escaping adskilt: De løser forskellige problemer.

Hvis I når længere, kan I tilføje flere svarregler og undersøge forskellen på `req.body`, `req.query` og `req.params`.

</details>

<details>
<summary><strong>7. Faglig opsamling og refleksion</strong></summary>

Vis jeres chatbot til en makker, og forklar request/response-forløbet uden at læse op fra koden.

**Exit ticket:** Hvilken kode kører i browseren, hvilken kode kører på serveren, og på hvilket tidspunkt bliver HTML'en genereret?

</details>

---

## Forberedelse

- Sørg for, at du er nået igennem [3. Getting Started with Express.js (Hello Express)](../opgaver/hello-express.md), og vær klar til at vise og forklare din løsning.
- Skim følgende som opslagsværker. Vælg ESM i kodeeksemplerne, når det er muligt:
  - [Routing](https://expressjs.com/en/guide/routing.html) i Express.js-dokumentationen
  - [Request object](https://expressjs.com/en/5x/api/request/) i Express.js API-reference
  - [Working with forms](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/forms) på MDN
- På Scrimba:
  - [Færdiggør Fullstack > Node.js > Build a Node API](https://scrimba.com/fullstack-path-c0fullstack)
  - [Se Fullstack > Express.js > Welcome to Express](https://scrimba.com/fullstack-path-c0fullstack)

## Materialer

### Præsentationer

- Fælles introduktion til SSR, CSR og EJS

### Opgaver

1. [Din første server-renderede EJS-app](../opgaver/express-ejs-formular.md)
2. [Formhåndtering, validering og svarlogik](../opgaver/express-ejs-formhaandtering-svarlogik.md)
3. [Server-renderet chatbot med regelbaseret svarlogik](../opgaver/express-ejs-chatbot.md)

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
canvas_updated_at: "2026-08-25T09:11:54Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018691"
local_status: mirrored
```

</details>
