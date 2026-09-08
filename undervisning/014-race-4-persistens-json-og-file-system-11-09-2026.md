# RACE 4 - Persistens, JSON og File System - 11-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I RACE 3 arbejdede I med objekter, arrays og kontrolstrukturer i AMAbotten. I [DOB 3](./012-dob-3-string-parsing-metoder-og-funktioner-09-09-2026.md) er fokus på string-metoder, funktioner og metoder. I dag bygger vi videre på AMAbotten fra øvelse 4 og skriver funktioner, der læser og gemmer samtalehistorikken. Når persistensen virker, bruger I string parsing, metoder og funktioner til én forbedring af svarlogikken. Vi starter i dag med kort at samle op på øvelse 3 og 4, og på hvordan objekter og arrays fra JavaScript genfindes som JSON i resten af webbet. Vi arbejder med Node.js' File System API, så vi kan læse og skrive JSON-filer fra serveren. Målet er, at AMAbottens samtalehistorik kan overleve en genstart af serveren — vi går fra data, der kun findes i memory, til rigtig persistens.

---

## Agenda

<details>
<summary><strong>1. Opsamling: AMAbottens svarlogik og begreber fra DOB 3</strong></summary>

- Forklar to og to, hvordan `findBestAnswer()` vælger den bedst matchende regel ud fra antal matchende nøgleord
- Vælg en string-metode fra DOB 3, og forklar, hvordan den kan bruges til at genkende noget i et spørgsmål
- Forklar en af jeres funktioner: hvilke parametre modtager den, og hvad returnerer den?
- Gennemgå `topicStats` — hvordan I tæller emner/kategorier i et objekt
- Test med et spørgsmål, der matcher flere regler — vinder den rigtige?
- Notér, hvad der stadig er uklart omkring scoring, tælling eller objekter/arrays
</details>
<details>
<summary><strong>2. Objekter og arrays — kort opsamling</strong></summary>

- Genbesøg punktnotation og bracket notation på objekter
- Genbesøg arrays af objekter og `for...of`
- Se, hvordan den samme struktur (arrays og objekter, indlejret i hinanden) går igen, når vi sender og modtager data over HTTP, og senere når data ligger i en database
- Pointe: det er ikke tilfældigt — JSON repræsenterer blandt andet objekter og arrays som tekst
</details>
<details>
<summary><strong>3. Hvad er persistens?</strong></summary>

- Ændringer i memory går tabt ved genstart, hvis de ikke er gemt. `messages` starter igen som `[]`, mens svarreglerne i `answers` oprettes igen fra kildekoden
- Persistens betyder, at data overlever, selvom programmet eller serveren stopper
- En fil på disken og en database er begge former for persistent storage — forskellen er bare hvor og hvordan data gemmes
- I dag bruger vi en JSON-fil som den simpleste form for persistens; senere i forløbet erstatter vi filen med en rigtig database, men selve idéen — gem data et sted, der ikke forsvinder — er den samme
</details>
<details>
<summary><strong>4. Hvad er JSON, og hvorfor er det smart?</strong></summary>

- JSON (JavaScript Object Notation) er et tekstformat til at repræsentere data — blandt andet objekter og arrays som ren tekst
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
- Lav først [JSON-øvelse: Studerende i en JSON-fil](../opgaver/express-ejs-json-students.md) — lav trin 1–7, og gå derefter videre til øvelse 5. Trin 8–11 er ekstraopgaver
- Arbejd derefter med [øvelse 5](../opgaver/express-ejs-amabot-persistens.md): skriv `loadMessages()` og `saveMessages(messages)`, og kald dem fra `GET /` og `POST /ask`, så filen — ikke en variabel — er den eneste sandhed om samtalen
- Test persistensen i øvelse 5, trin 7: kontrollér svar på to formuleringer af samme spørgsmål, og genstart serveren for at tjekke historikken
- Lav derefter trin 8: brug string parsing, metoder og funktioner til én forbedring af svarlogikken, og test den. Normalisering er udgangspunktet; mere præcis matching er en større udfordring
</details>

---

## Forberedelse

- Færdiggør [øvelse 3](../opgaver/express-ejs-amabot.md) og [øvelse 4](../opgaver/express-ejs-amabot-statistik.md), hvis I ikke er helt i mål endnu — se evt. [opsamlingen fra sidst](./087-opsamling-byg-videre-pa-amabotten-oevelse-3-og-4.md)
- Genopfrisk begreberne fra DOB 3: string-metoder, funktioner, parametre og returværdier — dem bruger vi i arbejdet med AMAbotten fra øvelse 4
- Genopfrisk ["Working with JSON"](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON) på MDN
- Læs om [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) og [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) på MDN — se evt. [Scrimba-forklaringen](https://scrimba.com/explain/guide01mo060op) af de to metoder som supplement
- Skim [W3Schools · Node.js File System](https://www.w3schools.com/nodejs/nodejs_filesystem.asp), særligt `readFile()` og `writeFile()`

---

## Materialer

- Slides:
    - [RACE 4 · Persistens, JSON og File System](https://cederdorff.com/wu-e26a/persistens-json/)
- Opgaver:
    - [JSON-øvelse: Studerende i en JSON-fil](../opgaver/express-ejs-json-students.md) — trin 1–7 er obligatoriske og laves først: læs og opret studerende i en JSON-fil. Sletning, redigering, refaktorering og styling er ekstraopgaver
    - [Øvelse 5 · Gem AMAbottens chathistorik i en JSON-fil](../opgaver/express-ejs-amabot-persistens.md) — trin 1–8 bygger videre på øvelse 4: gem historikken i en JSON-fil, og brug string parsing, metoder og funktioner til én forbedring af svarlogikken. Statistik og rydning af historik er ekstraopgaver

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178037
canvas_module_position: 14
canvas_module_published: true
canvas_module_item_id: 1018700
canvas_module_item_position: 1
canvas_page_id: 200713
canvas_page_slug: "plan-for-race-4-persistens-json-og-file-system"
canvas_page_title: "Plan for RACE 4 - Persistens, JSON og File System"
canvas_page_published: true
canvas_updated_at: "2026-09-07T20:15:12Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018700"
local_status: mirrored
```

</details>
