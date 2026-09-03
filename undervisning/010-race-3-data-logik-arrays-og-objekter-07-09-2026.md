# RACE 3 - Data logik, arrays og objekter - 07-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I sidste undervisningsgang påbegyndte I AMAbotten. I dag bygger vi videre med rigtig svarlogik — arrays og objekter som "svar-database", og string-metoder til at finde nøgleord i brugerens spørgsmål. Derefter skærper vi logikken yderligere: AMAbotten skal vælge den bedst matchende regel i stedet for bare den første, og vi tilføjer en simpel statistik, der viser, hvilke emner brugerne spørger mest til.

---

## Agenda

1.  **Opsamling:**
    - Hvor langt kom I med øvelse 1 og 2 sidste gang?
    - Hvad skal AMAbotten fra øvelse 3 kunne, og hvordan hænger den sammen med det, I allerede har bygget?
2.  **JavaScript arrays & objekter i Node.js:**
    - Byg svar-databasen som et array af objekter (`answers`)
    - Gennemløb med `for...of`
3.  **String-metoder & pattern matching:**
    - Find nøgleord i brugerens besked med `includes()`, `toLowerCase()` og `.some()`
    - Byg `findAnswer()` færdig fra øvelse 3
4.  **Kontrolstrukturer:**
    - `if`/`else` til validering af tomt input
    - `switch` som alternativ, når I vælger ud fra én fast værdi
5.  **Skærp svarlogikken med scoring:**
    - Tæl nøgleords-matches med `.filter()`, og vælg den bedst matchende regel med `findBestAnswer()`
6.  **Objekter som tæller — statistik:**
    - Tæl emner i et almindeligt objekt (`topicStats`), og vis det i EJS med `Object.entries()`
7.  **Hands-on:**
    - Færdiggør AMAbot fra øvelse 3
    - Skærp den med scoring og statistik fra øvelse 4

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
  - [3. Server-renderet AMAbot med regelbaseret svarlogik](../opgaver/express-ejs-amabot.md) — færdiggøres i dag
  - [4. Gør AMAbotten klogere med scoring og statistik](../opgaver/express-ejs-amabot-statistik.md)
  - [Padlet - Node.js & Express.js Concepts](https://padlet.com/race7/node-js-express-js-concepts-mp9x38w14ndr3sug)

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178033
canvas_module_position: 10
canvas_module_published: false
canvas_module_item_id: 1018694
canvas_module_item_position: 1
canvas_page_id: 200711
canvas_page_slug: "plan-for-race-3-data-logik-arrays-og-objekter"
canvas_page_title: "Plan for RACE 3 - Data logik, arrays og objekter"
canvas_page_published: false
canvas_updated_at: "2026-09-03T08:41:14Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018694"
local_status: mirrored
```

</details>
