# Opsamling: Byg videre på AMAbotten (øvelse 3 og 4)

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

Denne side samler op på [RACE 3 · Data, logik, arrays og objekter](010-race-3-data-logik-arrays-og-objekter-07-09-2026.md) fra i dag (07-09-2026). Brug den som din tjekliste, når du arbejder videre med AMAbotten — i timen og som forberedelse.

## Hvor skal du hen?

1. **Færdiggør øvelse 3**, hvis den ikke allerede består tjekpunktet.
2. **Fortsæt til øvelse 4** med scoring og statistik.
3. **Sidder du fast et sted?** Tag en kort afstikker til JavaScript-øvelserne, træn det konkrete begreb isoleret, og vend så tilbage til din egen kode.

Arbejd i din egen AMAbot — kopiér ikke kodeudsnit direkte ind. Skriv koden selv, test efter hvert trin, og forklar den for dig selv eller en makker, før du går videre.

---

## 1. Øvelse 3: Server-renderet AMAbot med regelbaseret svarlogik

[Øvelse 3 · Server-renderet AMAbot med regelbaseret svarlogik](../opgaver/express-ejs-amabot.md)

Øvelsen er færdig, når din AMAbot:

- beholder sit eksisterende visuelle udtryk
- modtager et spørgsmål på `POST /ask`
- viser samtalen med EJS
- vælger et regelbaseret, personligt svar via `findAnswer()`
- afviser et tomt spørgsmål

Du skal kunne pege på, hvor spørgsmålet modtages, hvor svaret vælges, og hvor EJS genererer HTML.

## 2. Øvelse 4: Gør AMAbotten klogere med scoring og statistik

[Øvelse 4 · Gør AMAbotten klogere med scoring og statistik](../opgaver/express-ejs-amabot-statistik.md)

Byg videre på den samme AMAbot. Øvelsen har to dele:

- **Scoring:** `findBestAnswer()` undersøger *alle* regler og vælger den, der matcher flest nøgleord — i stedet for at stoppe ved den første.
- **Statistik:** Hver regel får en `category`, og et `topicStats`-objekt tæller, hvilke emner der bliver spurgt mest til.

Øvelsen er færdig, når AMAbotten stadig kan svare og validere som i øvelse 3, undersøger alle regler, vælger den bedste, og viser tællerne med EJS.

## 3. Sidder du fast? Træn begrebet for sig selv

[JavaScript-øvelser til AMAbot](../opgaver/javascript-oevelser-amabot.md)

Opret én øvelsesfil (`amabot-javascript-tests.js`), og træn præcis det begreb, der er uklart — med simple eksempler, ikke ved at genopbygge `server.js`:

- `if`/`else if`/`else`
- objekter og punktnotation
- arrays, `.push()` og array af objekter
- `for...of`
- `toLowerCase()`, `includes()`, `.some()` og `.filter()`

Vend derefter tilbage til din egen `findAnswer()`/`findBestAnswer()`, og genkend de samme byggesten.

---

## Genbesøg dagens slides, hvis et begreb er uklart

Slides: [RACE 3 · Data, logik, arrays og objekter](https://cederdorff.com/wu-e26a/data-logik/)

Hop direkte til det kapitel, der matcher dit blokerende begreb:

- [Kontrolstrukturer](https://cederdorff.com/wu-e26a/data-logik/#/kontrol) — `if`/`else`, booleans og kodeveje
- [Objekter & arrays](https://cederdorff.com/wu-e26a/data-logik/#/data) — punktnotation, bracket notation, `for...of`
- [Pattern matching](https://cederdorff.com/wu-e26a/data-logik/#/matching) — `toLowerCase()`, `includes()`, `.some()`, `.filter()`
- [Funktioner og kontrolflow](https://cederdorff.com/wu-e26a/data-logik/#/funktioner) — parameter, argument, `return`, `findAnswer()` vs. `findBestAnswer()`

---

## Test dig selv, før du går videre

| Situation | Forventet resultat |
| --- | --- |
| Kendt spørgsmål | Rigtigt svar (og rigtig kategori i øvelse 4) |
| Ukendt spørgsmål | Standardsvar, ingen tæller opdateres |
| Tomt input | Fejlbesked, ingen ny besked i historikken |
| Flere regler matcher | Reglen med højeste score vinder (øvelse 4) |
| To regler får samme score | Den regel, der står først i `answers`, vinder |

Kan du forklare alle fem for en medstuderende uden at læse op i koden? Så er du klar til at gå videre.

## Når du er færdig

Husk at committe og pushe undervejs:

```bash
git status
git add .
git commit -m "Din commit-besked"
git push
```

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: null
canvas_module_item_id: null
canvas_page_slug: null
canvas_page_title: null
canvas_module_name: null
canvas_module_published: false
local_status: scaffold
undervisere:
  - RACE
```

</details>
