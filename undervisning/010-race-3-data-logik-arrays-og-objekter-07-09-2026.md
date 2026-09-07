# RACE 3 - Data logik, arrays og objekter - 07-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I sidste undervisningsgang påbegyndte du AMAbotten. I dag færdiggør vi først den grundlæggende svarlogik og undersøger, hvordan arrays, objekter, funktioner og kontrolflow arbejder sammen. Derefter lader vi AMAbotten vælge den bedst matchende regel og bruger kategorier til at vise statistik over spørgsmålene.

---

## Agenda

<details>
<summary><strong>1. Opsamling</strong></summary>

- Forklar koden fra øvelse 2 to og to
- Notér, hvad du forstod godt, hvad der var svært, og hvad der stadig er uklart
- Saml op på validering og svarlogik fra øvelse 2
- Test kendt spørgsmål, ukendt spørgsmål og tomt input i AMAbotten
</details>
<details>
<summary><strong>2. Kontrolstrukturer</strong></summary>

- Genbesøg `if`/`else` fra valideringen i øvelse 2
- Brug booleans som betingelser
- Følg de forskellige kodeveje ved gyldigt og ugyldigt input
</details>
<details>
<summary><strong>3. Objekter og arrays</strong></summary>

- Brug `answers` som et array af objekter
- Find og opdatér værdier med punktnotation og bracket notation
- Gennemløb arrays med `for...of`
- Brug objekter til at samle data og som tællere
</details>
<details>
<summary><strong>4. String-metoder og pattern matching</strong></summary>

- Normalisér tekst med `toLowerCase()`
- Find nøgleord med `includes()`
- Brug `.some()` til at undersøge, om mindst ét nøgleord matcher
- Brug `.filter()` og `.length` til at tælle matches
</details>
<details>
<summary><strong>5. Funktioner og kontrolflow</strong></summary>

- Genbesøg funktion, parameter, argument og `return`
- Følg et spørgsmål gennem `findAnswer()` fra input til svar
- Se, hvordan `return` gør, at den første matchende regel vinder
- Udvid logikken, så `findBestAnswer()` undersøger alle regler
- Færdiggør øvelse 3, og arbejd derefter med scoring og statistik i øvelse 4
- Vælg en kort JavaScript-øvelse, hvis et bestemt begreb er uklart
</details>

---

## Forberedelse

- Færdiggør [øvelse 1](../opgaver/express-ejs-formular.md) og [øvelse 2](../opgaver/express-ejs-formhaandtering-svarlogik.md) fra sidste undervisningsgang. [Øvelse 3](../opgaver/express-ejs-amabot.md) (AMAbot) blev kun påbegyndt — den bygger du videre på og færdiggør i dag.
- Genopfrisk ["JavaScript object basics"](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics) på MDN
- Læs op på ["Array iteration methods"](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Arrays#array_methods) på MDN, særligt `.filter()`
- Gennemgå ["Working with strings"](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Useful_string_methods) på MDN for string manipulation
- Læs ["Making decisions in your code — conditionals"](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/conditionals) på MDN med fokus på `if`/`else`

---

## Materialer

- Slides:
    - [RACE 3 · Data, logik, arrays og objekter](https://cederdorff.com/wu-e26a/data-logik/)
    - [JavaScript Concepts](https://cederdorff.com/race/slides/js-concepts.pdf)
- Opgaver:
    - [3\. Server-renderet AMAbot med regelbaseret svarlogik](../opgaver/express-ejs-amabot.md) — færdiggøres i dag
    - [4\. Gør AMAbotten klogere med scoring og statistik](../opgaver/express-ejs-amabot-statistik.md)
    - [JavaScript-øvelser til AMAbot](../opgaver/javascript-oevelser-amabot.md) — opret én øvelsesfil, og træn de begreber, du har brug for

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
canvas_updated_at: "2026-09-07T09:51:38Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018694"
local_status: mirrored
```

</details>
