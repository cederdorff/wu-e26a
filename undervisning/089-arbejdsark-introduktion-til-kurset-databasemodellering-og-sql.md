# Arbejdsark: Introduktion til kurset, databasemodellering og SQL

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

**Ressourcer:** Slides fra Undervisning 1 · [W3Schools SQL Quick Reference](https://www.w3schools.com/sql/sql_quickref.asp) · [Supabase docs](https://supabase.com/docs)

## 1 Velkommen og læringsmål

**Opgave 1: Læringsmål for kurset** Læs læringsmålene for kurset og overvej følgende:

- Giver læringsmålene mening? Er der noget i dem som er uklart formuleret?
- Er der noget der mangler? Noget I havde forventet at lære med relation til SQL som ikke står her?

**Læringsmål:**

- V1: Den studerende skal kunne Redegøre for basal databasemodelleringsteori (normalisering, primær- og fremmednøgler) med baggrund i SQL
- V2: Den studerende skal kunne Redegøre for grundlæggende begreber inden for authentication og authorization, herunder forskellen mellem de to
- F1: Den studerende skal kunne Modellere en database med under 10 tabeller til 3. normalform ud fra et givet case-oplæg
- F2: Den studerende skal kunne Skrive og Læse SQL-statements, der kan udføre alle CRUD-operationer (Create, Read, Update, Delete)
- F3: Den studerende skal kunne Implementere en kørende, offsite SQL-database på Supabase og Benytte den i en kørende løsning
- F4: Den studerende skal kunne Benytte relevante auth-pakker i JS/React til at opsætte fungerende authentication/authorization i egen webapp

**Noter**:

## 2 Databaser, tabeller og nøgler

## 3 Code-along: oprettelse database på Supabase

## 3.1 Overvej datamodellen

I har oprettet 3 tabeller på Supabase: `users`, `threads` og `messages`. De indeholder hver især forskellige informationer om brugere, chattråde og beskeder.

**Opgave 2** Hvilke data er der i de 3 tabeller? Log på Supabase, find jeres projekt, og vælg Database → Schema Visualizer. Så får I en visuel model af jeres data. I kan også læse SQL’en i `schema-initial.sql`.

**Opgave 3** Overvej hvorfor dataene er delt op i 3 tabeller. Hvorfor har man adskilt dem? Kunne man gøre det anderledes?

**Opgave 4** Hvilke felter er `primary key` og `foreign key` i tabellerne? Hvorfor tror I netop de er valgt?

## 3.2 Tegn et ER-diagram

Til disse opgaver kan I enten tegne diagrammet på et stykke papir eller bruge [erdplus.com](https://erdplus.com), som er lavet til det. Ud over slides kan I bruge [denne side](https://www.geeksforgeeks.org/sql/how-to-draw-entity-relationship-diagrams/) som en hurtig guide (den er ikke super god på teorien, men det er ligemeget til vores brug).

**Opgave 5** For at tegne et ER-diagram skal man vide hvilke *entities* der er, og hvilke *attributter* de har. Entities svarer groft sagt til de tabeller vi definerer, og attributter til kolonnerne i tabellerne.

1.  Lav en liste over de entities der er i databasen, og de attributter de har.
2.  Begynd at tegne et ER-diagram ved at sætte jeres *entities* og deres *attributter* ind i diagrammet. Brug den syntax som er på slides og i linket.
3.  Find ud af hvilke attributter der er primary keys og foreign keys, og markér dem i jeres ER-diagram, fx ved at understrege primary keys eller bruge farver.
4.  Tegn *relationerne* mellem jeres entities i diagrammet. Hvilken type relation er der tale om: one-to-one, one-to-many, many-to-one eller many-to-many?

**Opgave 6** Diskutér: Hvordan ville ER-diagrammet se ud, hvis flere brugere skulle kunne være med i den samme tråd, fx i en gruppechat? Hvilken type relation er det, og hvad skal der til i databasen for at gemme den?

## 4 SELECT og WHERE

Nu skal vi begynde at arbejde med SQL queries. Åbn SQL Editor i jeres projekt på Supabase. De følgende opgaver kræver at I skriver queries i jeres editor derinde og at I har oprettet nøjagtigt samme database som Magnus gjorde i Code-along’en. Kig på dagens Canvas modul under ‘Ressourcer’ for at se SQL koden for at oprette databasen.

## 4.1 Hent data med SELECT

**Opgave 7** Skriv følgende queries på test databasen på Supabase og kør dem:

1.  Skriv en query der henter **alle** beskeder fra tabellen `messages`, med alle kolonner.
2.  Skriv en query der kun henter kolonnerne `content` og `type` fra `messages`.
3.  Skriv en query der henter alle tråde fra tabellen `threads`. Hvor mange tråde er der i jeres database?

**Opgave 8** Overvej sammen: Hvad er forskellen på at bruge `SELECT *` og at skrive bestemte kolonner? Hvornår er det ene bedre end det andet?

## 4.2 Filtrér data med WHERE

Med `WHERE` kan man filtrere data ud fra en eller flere betingelser.

**Opgave 9**

1.  Skriv en query der kun henter de beskeder hvor `type` er `'user'`, altså kun brugerens beskeder og ikke chatbottens svar.
2.  Skriv en query der henter alle beskeder fra én bestemt tråd. Du skal bruge `thread_id` i din `WHERE`. Brug tråden `'11111111-1111-1111-1111-111111111111'` fra testdataene.
3.  Skriv en query der henter alle tråde der er oprettet efter en bestemt dato.

**Opgave 10** Diskutér: Hvorfor tror I det er vigtigt at kunne filtrere data? Hvad ville der ske med hastigheden, hvis man altid hentede *alt* data fra en stor database?

## 4.3 Boolske udtryk: AND, OR, NOT og LIKE

SQL har logiske operatorer, så man kan kombinere flere betingelser.

**Opgave 11**

1.  Skriv en query der henter alle beskeder der er af typen `'user'` **og** hører til en bestemt tråd. Brug `AND`.
2.  Brug `OR` til at hente alle `'user'`\-beskeder **eller** alle beskeder fra en bestemt tråd. Hvorfor får I flere rækker end i a)?
3.  Brug `LIKE` til at finde alle beskeder hvor `content` indeholder et bestemt ord, fx `WHERE content LIKE '%learn%'`. Prøv med andre ord. Hvad sker der, hvis I skriver `'%Learn%'` med stort L?
4.  Brug `NOT` til at hente alle beskeder der **ikke** er af typen `'bot'`.

**Opgave 12 (udfordring)** Kombinér flere operatorer: Skriv en query der finder alle `'user'`\-beskeder som indeholder ordet `learn`, men **ikke** er fra tråden `'11111111-1111-1111-1111-111111111111'`.

## 4.4 BETWEEN og datoer

**Opgave 13** Brug `BETWEEN` til at finde alle tråde der er oprettet mellem to bestemte datoer.

**Opgave 14** Find alle beskeder der er sendt i dag. Hint: I PostgreSQL, som Supabase bruger, kan man bruge `CURRENT_DATE`. Hvor mange rækker får I, og hvorfor?

**Opgave 15** Diskutér: Hvorfor er det vigtigt at være præcis med datoer og tidszoner i en database? Hvad kunne gå galt, hvis man ikke tænker over det og f.eks. bruger en anden tidszone end den vi er i?

## 4.5 Sortér med ORDER BY

**Opgave 16** Hent alle tråde sorteret efter hvornår de er oprettet, med den nyeste først. Brug `ORDER BY created_at DESC`.

**Opgave 17** Hent alle beskeder fra én bestemt tråd, sorteret i den rækkefølge de er skrevet (den ældste først).

**Opgave 18** Kombinér filtrering og sortering: Hent alle `'bot'`\-beskeder sorteret efter hvornår de er oprettet.

[Hent arbejdsarket som PDF](https://eaaa.instructure.com/courses/32059/files/1718216?verifier=998ddd0f-fb69-4cb9-9982-64185390aa44&wrap=1 "WEB-E26-session1-worksheet1.pdf")

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: null
canvas_module_position: null
canvas_module_published: null
canvas_module_item_id: null
canvas_module_item_position: null
canvas_page_id: 209042
canvas_page_slug: "arbejdsark-introduktion-til-kurset-databasemodellering-og-sql"
canvas_page_title: "Arbejdsark: Introduktion til kurset, databasemodellering og SQL"
canvas_page_published: true
canvas_updated_at: "2026-10-12T12:33:56Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/pages/arbejdsark-introduktion-til-kurset-databasemodellering-og-sql"
local_status: mirrored
```

</details>
