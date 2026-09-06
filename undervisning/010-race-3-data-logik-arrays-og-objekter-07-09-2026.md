# RACE 3 - Data logik, arrays og objekter - 07-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I sidste undervisningsgang påbegyndte I AMAbotten. I dag bygger vi videre med rigtig svarlogik — arrays og objekter som "svar-database", og string-metoder til at finde nøgleord i brugerens spørgsmål. Derefter skærper vi logikken yderligere: AMAbotten skal vælge den bedst matchende regel i stedet for bare den første, og vi tilføjer en simpel statistik, der viser, hvilke emner brugerne spørger mest til.

---

## Agenda

1.  **Opsamling:**
    - Hvor langt er I kommet i øvelse 3?
    - Test kendt spørgsmål, ukendt spørgsmål og tomt input
    - Færdiggør svarlogikken fra øvelse 3, før I går til øvelse 4
2.  **Funktioner og kontrolflow:**
    - Følg et spørgsmål gennem `toLowerCase()`, `for...of`, `.some()` og `.includes()`
    - Se, hvordan `return` gør, at den første matchende regel vinder
3.  **JavaScript arrays & objekter i Node.js:**
    - Genbesøg svar-databasen som et array af objekter (`answers`)
    - Tilføj properties, og tilgå værdier med indeks- og punktnotation
4.  **String-metoder & pattern matching:**
    - Find nøgleord med `includes()`, `toLowerCase()` og `.some()`
    - Sammenlign `.some()` med `.filter()` og `.length`
5.  **Kontrolstrukturer:**
    - `if`/`else` til validering af tomt input
    - `if` til at sammenligne og gemme den højeste score
6.  **Scoring og sammenligning:**
    - Gennemløb alle regler med `for...of`
    - Vælg den bedst matchende regel med `findBestAnswer()`
7.  **Objekter som tæller — statistik:**
    - Læs og opdatér properties i `topicStats`
    - Vis objektets værdier i EJS
8.  **Hands-on:**
    - Færdiggør AMAbot fra øvelse 3
    - Udvid den med scoring og enkel statistik fra øvelse 4
    - Arbejd eventuelt videre med `switch`, `Object.entries()` og JavaScript-moduler med `export`/`import`

---

## Forberedelse

- Færdiggør [øvelse 1](../opgaver/express-ejs-formular.md) og [øvelse 2](../opgaver/express-ejs-formhaandtering-svarlogik.md) fra sidste undervisningsgang. [Øvelse 3](../opgaver/express-ejs-amabot.md) (AMAbot) blev kun påbegyndt — den bygger I videre på og færdiggør i dag.
- Genopfrisk ["JavaScript object basics"](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics) på MDN
- Læs op på ["Array iteration methods"](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Arrays#array_methods) på MDN, særligt `.filter()`
- Gennemgå ["Working with strings"](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Useful_string_methods) på MDN for string manipulation
- Læs ["Making decisions in your code — conditionals"](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/conditionals) på MDN, inkl. afsnittet om `switch`

---

## Materialer

- Slides:
    - [JavaScript Concepts](https://cederdorff.com/race/slides/js-concepts.pdf)
- Opgaver:
    - [3\. Server-renderet AMAbot med regelbaseret svarlogik](../opgaver/express-ejs-amabot.md) — færdiggøres i dag
    - [4\. Gør AMAbotten klogere med scoring og statistik](../opgaver/express-ejs-amabot-statistik.md)
    - Træningsfiler til øvelse 4:
        - [`findAnswer()` — grundbegreber](../opgaver/find-answer-oevelser.js)
        - [Scoring og sammenligning](../opgaver/scoring-oevelser.js)
        - [Objekter som tællere](../opgaver/statistik-oevelser.js)
    - [Padlet - Node.js & Express.js Concepts](https://padlet.com/race7/node-js-express-js-concepts-mp9x38w14ndr3sug)

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178033
canvas_module_position: 10
canvas_module_published: true
canvas_module_item_id: 1018694
canvas_module_item_position: 1
canvas_page_id: 200711
canvas_page_slug: "plan-for-race-3-data-logik-arrays-og-objekter"
canvas_page_title: "Plan for RACE 3 - Data logik, arrays og objekter"
canvas_page_published: true
canvas_updated_at: "2026-09-06T17:45:57Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018694"
local_status: mirrored
```

</details>
