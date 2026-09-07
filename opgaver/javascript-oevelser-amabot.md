# JavaScript-øvelser til AMAbot

Her kan I øve den JavaScript-logik, som bliver brugt i [øvelse 4](express-ejs-amabot-statistik.md), uden samtidig at arbejde med Express og EJS.

I behøver ikke gennemføre alle tre dele. Vælg den øvelsesfil, der handler om det, I har brug for at øve.

Øvelsesfilerne er selvstændige programmer. De skal ikke importeres eller kopieres samlet ind i AMAbottens `server.js`.

## Vælg en øvelsesfil

| Hvis dette er svært… | Arbejd med denne fil |
| --- | --- |
| Parameter, argument, `return`, tekstmetoder, callback eller `.some()` | [1. Byg `findAnswer()`](find-answer-oevelser.js) |
| `.filter()`, score, sammenligning eller valg af det bedste svar | [2. Byg scoring](scoring-oevelser.js) |
| Kategori, resultatobjekt, bracket notation eller et objekt som tæller | [3. Byg statistik](statistik-oevelser.js) |

Er I usikre på, hvad I skal vælge, så vis jeres kode og forklaring til en medstuderende eller underviseren. Begynd med den fil, der passer til det konkrete problem.

## Sådan arbejder I

Hver fil indeholder startkode, `TODO`-markeringer og små tests.

1. Åbn den relevante øvelsesfil.
2. Læs opgaven ved den første `TODO`.
3. Forudsig, hvad testen kræver.
4. Skriv selv koden.
5. Kør filen med Node.js.
6. Arbejd videre, indtil testene for delen viser ✅.
7. Forklar koden med ordene under `FORKLAR`.

Funktionen `check()` er et givet testværktøj. I skal bruge dens ✅ og ❌ som feedback, men I skal ikke ændre eller forklare dens indre kode.

Når øvelsen virker, skal I vende tilbage til jeres egen AMAbot. Brug det, I har lært, men kopiér ikke hele øvelsesfilen til `server.js`.

---

## 1. Grundlæggende svarlogik

Fil: [`find-answer-oevelser.js`](find-answer-oevelser.js)

Kør den med:

```bash
node find-answer-oevelser.js
```

Her skriver I selv:

1. en lille funktion med parameter og `return`
2. en funktion, der normaliserer tekst
3. en funktion, der undersøger ét nøgleord
4. en funktion med `.some()` og en callback
5. den samlede `findAnswer()` med `for...of`, `if` og `return`

Vælg denne fil, hvis I har svært ved at følge den eksisterende `findAnswer()` fra øvelse 3.

### Tjek jer selv

I er klar til at vende tilbage til AMAbotten, når I kan forklare:

- forskellen på parameter og argument
- hvad callback-parameteren indeholder
- forskellen på en tekst og en boolean
- hvorfor `return` stopper funktionen
- hvorfor den første matchende regel vinder

---

## 2. Scoring og det bedste svar

Fil: [`scoring-oevelser.js`](scoring-oevelser.js)

Kør den med:

```bash
node scoring-oevelser.js
```

Her skriver I selv:

1. `countMatches()` med `.filter()` og `.length`
2. en løkke, der beregner score for alle regler
3. `findBestAnswer()` med sammenligning af scores
4. en regel og en test med jeres egne data

Vælg denne fil, hvis I forstår den gamle `findAnswer()`, men har svært ved at bygge den nye scoring i øvelse 4.

### Tjek jer selv

I er klar til at vende tilbage til AMAbotten, når I kan forklare:

- forskellen på `.some()` og `.filter().length`
- hvorfor alle regler skal undersøges
- hvordan `bestScore` ændrer sig gennem løkken
- hvorfor funktionen returnerer en svartekst
- hvilken regel der vinder ved samme score

---

## 3. Objekter som tællere

Fil: [`statistik-oevelser.js`](statistik-oevelser.js)

Kør den med:

```bash
node statistik-oevelser.js
```

Her skriver I selv:

1. opslag med punktnotation og bracket notation
2. en funktion, der forhøjer én bestemt tæller
3. en funktion, der vælger tæller ud fra en variabel
4. forbindelsen mellem et resultatobjekt og statistikken
5. en selvvalgt test

Vælg denne fil, når svarlogikken virker, men `topicStats[result.category]` er svær at forstå eller skrive.

### Tjek jer selv

I er klar til at vende tilbage til AMAbotten, når I kan forklare:

- hvad en property er
- forskellen på punktnotation og bracket notation
- hvordan en tæller forhøjes med `1`
- hvorfor en variabel kan vælge den rigtige property
- hvorfor en tom kategori ikke skal tælles

---

## Fælles afslutning

Vis en medstuderende den del, I selv har skrevet. Forklar:

1. Hvad modtager koden?
2. Hvad undersøger eller ændrer den?
3. Hvad producerer eller returnerer den?
4. Hvor skal den samme idé bruges i AMAbotten?
