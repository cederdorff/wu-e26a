# RACE 4 - Persistens, JSON og File System - 11-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I sidste undervisningsgang arbejdede du med objekter, arrays og funktioner i AMAbottens svarlogik. Vi starter i dag med kort at samle op på øvelse 3 og 4, og på hvordan objekter og arrays fra JavaScript genfindes som JSON i resten af webbet — i APIs, config-filer og (senere) databaser. Derefter introducerer vi Node.js' File System API, så I kan læse og skrive JSON-filer fra serveren. Målet er, at AMAbottens samtalehistorik kan overleve en genstart af serveren — I går fra data, der kun findes i memory, til rigtig persistens.

---

## Agenda

<details>
<summary><strong>1. Opsamling: øvelse 3 og 4</strong></summary>

- Forklar to og to, hvordan `findBestAnswer()` vælger den bedst matchende regel ud fra antal matchende nøgleord
- Gennemgå `topicStats` — hvordan I tæller emner/kategorier i et objekt
- Test med et spørgsmål, der matcher flere regler — vinder den rigtige?
- Notér, hvad der stadig er uklart omkring scoring, tælling eller objekter/arrays
</details>
<details>
<summary><strong>2. Objekter og arrays — kort opsamling</strong></summary>

- Genbesøg punktnotation og bracket notation på objekter
- Genbesøg arrays af objekter og `for...of`
- Se, hvordan den samme struktur (arrays og objekter, indlejret i hinanden) går igen, når vi sender og modtager data over HTTP, og senere når data ligger i en database
- Pointe: det er ikke tilfældigt — det er fordi JSON _er_ JavaScript-objekter og -arrays skrevet som tekst
</details>
<details>
<summary><strong>3. Hvad er persistens?</strong></summary>

- Hvad sker der med data i `messages`, `answers` m.fl., når serveren genstartes? Det forsvinder — det lever kun i memory (variabler/arrays), mens processen kører
- Persistens betyder, at data overlever, selvom programmet eller serveren stopper
- En fil på disken og en database er begge former for persistent storage — forskellen er bare hvor og hvordan data gemmes
- I dag bruger vi en JSON-fil som den simpleste form for persistens; senere i forløbet erstatter vi filen med en rigtig database, men selve idéen — gem data et sted, der ikke forsvinder — er den samme
</details>
<details>
<summary><strong>4. Hvad er JSON, og hvorfor er det smart?</strong></summary>

- JSON (JavaScript Object Notation) er et tekstformat til at repræsentere data — objekter og arrays som ren tekst
- Det ligner JavaScript-objekter, men er ikke det samme: nøgler og strings i dobbelte citationstegn, ingen funktioner, ingen kommentarer, ingen trailing comma
- JSON er sprog-uafhængigt — næsten alle programmeringssprog kan læse og skrive det, derfor er det de facto-standarden for data på webbet (APIs, config-filer, m.m.)
- `JSON.stringify()` — fra JavaScript-data til JSON-tekst
- `JSON.parse()` — fra JSON-tekst til JavaScript-data
</details>
<details>
<summary><strong>5. File System i Node.js</strong></summary>

- `node:fs/promises` — indbygget i Node.js, intet at installere
- `fs.readFile()` og `fs.writeFile()` er asynchronous — derfor `async`/`await`
- Mønstret: **read → modify → write**
    - læs filen (JSON-tekst) → `JSON.parse()` til JavaScript → ændr data → `JSON.stringify()` til tekst → skriv filen
- Hvorfor er `push()` på et array alene ikke nok? Data ændres kun i memory, ikke i filen
</details>
<details>
<summary><strong>6. Gem AMAbottens chathistorik</strong></summary>

- Lige nu lever `messages` kun i memory — historikken forsvinder, når serveren genstartes
- Sidder et JSON/fs-begreb fast? Tag en kort afstikker til [JSON- og File System-øvelser til AMAbot](../opgaver/json-fs-oevelser-amabot.md)
- Arbejd derefter med [øvelse 5](../opgaver/express-ejs-amabot-persistens.md): læs `messages` fra `data/messages.json`, når serveren starter, og skriv til filen, hver gang der stilles et nyt spørgsmål
- Test persistens: stil et spørgsmål, genstart serveren, og tjek om historikken stadig er der
</details>

---

## Forberedelse

- Færdiggør [øvelse 3](../opgaver/express-ejs-amabot.md) og [øvelse 4](../opgaver/express-ejs-amabot-statistik.md), hvis I ikke er helt i mål endnu — se evt. [opsamlingen fra sidst](./087-opsamling-byg-videre-pa-amabotten-oevelse-3-og-4.md)
- Genopfrisk ["Working with JSON"](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) på MDN
- Læs om [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) og [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) på MDN — se evt. [Scrimba-forklaringen](https://scrimba.com/explain/guide01mo060op) af de to metoder som supplement
- Skim [W3Schools · Node.js File System](https://www.w3schools.com/nodejs/nodejs_filesystem.asp), særligt `readFile()` og `writeFile()`

---

## Materialer

- Slides: TBA
- Opgaver:
  - [JSON- og File System-øvelser til AMAbot](../opgaver/json-fs-oevelser-amabot.md) — træn `JSON.stringify()`/`JSON.parse()` og `fs.readFile()`/`fs.writeFile()` på et simpelt array, før I bruger dem i øvelse 5
  - [Øvelse 5 · Gem AMAbottens chathistorik i en JSON-fil](../opgaver/express-ejs-amabot-persistens.md) — bygger videre på øvelse 4, gemmer `messages` (og evt. `topicStats`) i en JSON-fil, så historikken overlever en genstart

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178037
canvas_module_position: 14
canvas_module_published: false
canvas_module_item_id: 1018700
canvas_module_item_position: 1
canvas_page_id: 200713
canvas_page_slug: "plan-for-race-4-persistens-json-og-file-system"
canvas_page_title: "Plan for RACE 4 - Persistens, JSON og File System"
canvas_page_published: false
canvas_updated_at: "2026-09-07T14:37:46Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018700"
local_status: mirrored
```

</details>
