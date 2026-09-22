# Øvelse 7: AMAbotten i lag — routes og data-modul

## Kort fortalt

Du bygger videre på din egen AMAbot fra [øvelse 6](express-rest-api-amabot.md) og på det, du lige har lært i [REST API-øvelse: Arkitektur](express-rest-api-arkitektur.md) fra RACE 6: at dele et REST API op i routes og et data-modul med `express.Router()`.

Det er ingen tilfældighed, at jeres AMAbot blev brugt som eksempel på en fil, der var vokset sig stor, i RACE 6's opsamling — `server.js` har nu `/messages`, `/answers`, `loadMessages()`/`saveMessages()`, `loadAnswers()`/`saveAnswers()` og selve svarlogikken, alt sammen i én fil. Det er præcis den mangel på **Separation of Concerns**, du retter op på i denne øvelse: routing, data-adgang og forretningslogik skal ikke bo i samme fil, bare fordi de opstod der.

Du har allerede bygget mønstret to gange — for `/students` og for `/teachers`. Denne øvelse har derfor **ingen TODO'er, hints eller løsningsforslag**: du kender allerede opskriften, og skal selv overføre den til `/messages` og `/answers`. Sidder du helt fast, så genbesøg [REST API-øvelse: Arkitektur](express-rest-api-arkitektur.md) trin 6-10 — det er nøjagtig det samme, du skal gøre her, bare med `messages`/`answers` i stedet for `students`/`teachers`.

> **To lag er obligatoriske denne gang:** routes og data-modul, ligesom Del 2-3 i arkitektur-øvelsen. Controllers (Del 5 der) er stadig frivilligt — der er en kort valgfri sektion om det til sidst (punkt 5), spring den over med mindre du selv har lyst.

---

## 1. Gem udgangspunktet i Git

Ligesom før en stor omstrukturering:

```bash
git add .
git commit -m "Save AMAbot before splitting into routes and data modules"
git push
```

---

## 2. Split /messages: routes/messages.js + data/messages.js

- Flyt `loadMessages()`/`saveMessages()` til `data/messages.js`, med `export` foran hver funktion.
- Flyt de tre `/messages`-routes (`GET`, `POST`, `DELETE`) til `routes/messages.js`, som en `express.Router()` — husk at stierne bliver til `/`, ikke `/messages`, inde i routeren.
- Montér routeren i `server.js`: `app.use("/messages", messagesRouter)`.

> `/messages` har ikke fuld CRUD — kun tre endpoints. Det ændrer ikke på, hvordan du opdeler den: en router kan indeholde lige så mange eller få routes, den skal.

> **Begreb: Single Responsibility.** `routes/messages.js` har nu kun ét ansvar: HTTP ind og ud for `/messages`. Den ved ikke, hvordan data gemmes (det er `data/messages.js`s ansvar), og den kender ingenting til `/answers`. Det er Separation of Concerns i praksis, én fil ad gangen.

#### Test

Kør hele messages-flowet igennem i Thunder Client (`GET`, `POST`, `DELETE`), præcis som i øvelse 6, trin 10. Alt skal virke som før — kun placeringen af koden er ændret.

---

## 3. Split /answers: routes/answers.js + data/answers.js

Gør det samme for `/answers` — denne gang med fuld CRUD (`GET`, `GET/:category`, `POST`, `PUT`, `DELETE`).

> **Begreb: DRY.** Kig på `data/messages.js` og `data/answers.js` side om side: `loadX()` og `saveX()` gør reelt det samme i begge — læs/parse, eller stringify/skriv, bare med et andet filnavn og en anden variabel. Det er samme slags gentagelse, du så mellem `/students` og `/teachers` i arkitektur-øvelsen. En fælles hjælpefunktion, der tager filnavnet som parameter, kunne fjerne den — det er ikke et krav i dag, men læg mærke til tensionen.

#### Test

Kør hele answers-flowet igennem, som i øvelse 6, trin 19.

---

## 4. Placér selve svarlogikken

`findBestAnswer()` (eller `findAnswer()`) er ikke data-adgang og ikke en route — det er forretningslogik, der bruger `answers`, som `POST /messages` kalder. Tag stilling til, hvor den bør bo nu, hvor du har flere filer at vælge mellem:

- Bliver den i `server.js`, og importeres i `routes/messages.js`?
- Flytter den ind i `data/answers.js`, ved siden af `loadAnswers()`/`saveAnswers()`?
- Får den sit eget modul, fx `answerLogic.js`?

Der er ikke ét rigtigt svar — vælg den placering, du selv finder mest logisk, og kunne forklare til en anden. Sørg for, at `routes/messages.js` importerer den derfra, uanset hvad du vælger.

> **Begreb: Encapsulation.** Uanset hvor du placerer `findBestAnswer()`, skal `routes/messages.js` bare kunne kalde den og få et svar tilbage — den skal ikke vide, *hvordan* svaret findes (keyword-matching, en liste af regler, eller noget helt andet). Samme princip som `loadAnswers()`/`saveAnswers()`: routen kender kun funktionens navn og hvad den returnerer, ikke detaljen bag den.

#### Test

Spørg AMAbotten et rigtigt spørgsmål via `POST /messages`, og bekræft at den stadig finder det rigtige svar.

---

## 5. (Frivillig) Controllers

Vil du gå hele vejen med lagdelingen, kan du trække selve route-logikken ud i controllers, ligesom Del 5 i arkitektur-øvelsen — denne gang for `/messages` og `/answers`.

- Opret `controllers/messagesController.js` og `controllers/answersController.js`, med én eksporteret funktion pr. route.
- `routes/messages.js` og `routes/answers.js` skal herefter kun importere controlleren og forbinde routes til de rigtige funktioner — al logik, inklusive kaldet til `findBestAnswer()`, flytter med ind i controlleren.
- Samme mønster som resten af øvelsen: ingen TODO'er eller løsningsforslag her — du har set det i arkitektur-øvelsen.

#### Test

Kør hele CRUD- og svarlogik-flowet igennem én sidste gang.

---

## Tjekpunkt

Øvelsen er gennemført, når:

- `server.js` kun importerer og monterer to routere — ingen route-definitioner tilbage
- `routes/messages.js` og `routes/answers.js` importerer `loadX()`/`saveX()` fra hver deres data-modul, i stedet for at definere dem selv
- alt CRUD-funktionalitet fra øvelse 6 stadig virker, inklusive svarlogikken

---

## Reflektér over din læring

1. Hvor meget af din svarlogik og dine routes skulle du egentlig ændre for at flytte dem? Hvad fortæller det dig om forholdet mellem *hvor* kode bor, og *hvad* den gør?
2. `/messages` og `/answers` har meget forskellige route-sæt (tre endpoints vs. fuld CRUD) — gjorde det opdelingen i routes/data-moduler sværere på nogen måde?
3. Hvor endte du med at placere `findBestAnswer()`/`findAnswer()` — og hvorfor blev det den mest logiske placering for dig?
4. Peg på ét konkret sted i din egen kode for hvert af disse fire begreber — Separation of Concerns, DRY, Single Responsibility, Encapsulation. Er det samme kodestykke et eksempel på mere end ét af dem?
5. Hvis du lavede punkt 5 (controllers): hvad var forskellen på at flytte data-adgang ud (punkt 2-3) og at flytte selve logikken ud (punkt 5)? Er det samme slags problem, de to trin løser?

## Videre

Din AMAbot har nu samme lagdelte struktur som `/students` og `/teachers`: routes og data hver for sig, monteret via `express.Router()`. Statuskoder og fejlhåndtering for ugyldige id'er/kategorier — som stadig mangler, både her og i studerende-øvelsen — venter til [RACE 7](../undervisning/024-race-7-sikkerhed-og-error-handling-25-09-2026.md). `client/`-mappen venter stadig på sit indhold — det retter [øvelse 8](fetch-dom-amabot.md) op på.
