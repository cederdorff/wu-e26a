# Øvelse 5: Gem AMAbottens chathistorik i en JSON-fil

## Kort fortalt

Lige nu lever `messages` kun i memory. Samtalen forsvinder, hver gang du genstarter serveren. I denne øvelse gør du `data/messages.json` til den eneste sandhed om samtalen: hver route læser filen, når den har brug for beskederne, og skriver den igen, når noget ændrer sig — der er ingen `messages`-variabel, der lever videre mellem requests.

Du bygger videre på din egen AMAbot fra [øvelse 4](express-ejs-amabot-statistik.md). Du skal ikke oprette et nyt projekt. Har du siden forbedret botten, bygger du videre på den version.

I [DOB 3](../undervisning/012-dob-3-string-parsing-metoder-og-funktioner-09-09-2026.md) var fokus på string-metoder, funktioner og metoder. Her bruger du din viden om funktioner til at give læsning og gemning hver sin funktion. Når persistensen virker, bruger du også string parsing, metoder og funktioner til at forbedre en konkret del af AMAbottens svarlogik.

> **Har du ikke allerede lavet den?** Lav først trin 1–7 i [JSON-øvelse: Studerende i en JSON-fil](express-ejs-json-students.md), hvor du træner `JSON.stringify()`, `JSON.parse()`, `fs.readFile()` og `fs.writeFile()` i en lille selvstændig app, før du bruger dem her. Øvelse 5 bruger nøjagtig samme mønster.

## Det bygger du

```text
GET /      -> loadMessages() -> fs.readFile() -> JSON.parse()                    -> EJS -> HTML

POST /ask  -> loadMessages() -> findBestAnswer() -> tilføj spørgsmål og svar
           -> saveMessages() -> JSON.stringify() -> fs.writeFile() -> EJS -> HTML
```

`GET /` læser og viser historikken. Når et spørgsmål sendes til `POST /ask`, bruges mønstret **read → modify → write**.

---

## 1. Kontrollér udgangspunktet

Start serveren:

```bash
npm run dev
```

Vælg to forskellige formuleringer af samme spørgsmål, som din eksisterende svarlogik kan genkende. Stil begge spørgsmål, og bekræft, at botten giver de forventede svar. Notér formuleringerne og svarene, så du kan gentage testen i trin 7.

Find den string-metode, der bruges til at genkende spørgsmålene, fx `includes()`, `startsWith()`, `endsWith()`, `search()` eller `match()`. Forklar, hvad den gør i din kode — du skal ikke bruge alle metoderne.

Stop derefter serveren med `Ctrl + C`, og start den igen med `npm run dev`. Genindlæs siden i browseren.

Er samtalen der stadig?

Nej — `messages` er en almindelig JavaScript-variabel. Den findes kun, mens Node-processen kører. Når processen stopper, forsvinder alt, hvad der ligger i memory.

---

## 2. Importer File System

Tilføj denne linje øverst i `server.js`, sammen med dine andre imports:

```js
import fs from "node:fs/promises";
```

> `node:fs/promises` er indbygget i Node.js. Du skal ikke installere noget med npm.

---

## 3. Opret en JSON-fil til historikken

Opret mappen og filen:

```text
din-amabot/
├── data/
│   └── messages.json
├── public/
├── views/
├── package.json
└── server.js
```

Skriv præcis dette i `data/messages.json`:

```json
[]
```

> Filen skal indeholde et gyldigt JSON-array, allerede før serveren har skrevet noget til den. Mangler filen, fejler `fs.readFile()` med `ENOENT`. Er filen tom eller indeholder ugyldig JSON, fejler `JSON.parse()` med en `SyntaxError`.

---

## 4. Skriv to hjælpefunktioner: læs og gem

Brug din viden om funktioner, parametre og returværdier til at dele filhåndteringen op i overskuelige opgaver: én funktion læser historikken, og én gemmer den. Overvej først, hvilken funktion der skal modtage data som parameter, og hvilken der skal returnere data.

Find linjen, hvor du opretter `messages`:

```js
const messages = [];
```

Fjern den linje helt. I stedet skal du selv skrive to funktioner samme sted i filen:

- `loadMessages()` skal læse `data/messages.json`, parse JSON-teksten, og returnere resultatet som et array.
- `saveMessages(messages)` skal tage et array som parameter, omdanne det til pænt formateret JSON-tekst, og skrive det til `data/messages.json`.

Begge funktioner bruger de asynkrone filsystemmetoder og skal her være `async`. Når du kalder `await loadMessages()`, får du det array, funktionen returnerer. `saveMessages(messages)` modtager arrayet som parameter; her bruger du `await` til at vente på, at filen er skrevet færdig.

Start med denne skabelon:

```js
async function loadMessages() {
  // TODO: Læs data/messages.json med fs.readFile() ("utf8").
  // TODO: Parse JSON-teksten til et array, og returnér det.
}

async function saveMessages(messages) {
  // TODO: Omdan messages til formateret JSON-tekst med JSON.stringify().
  // TODO: Skriv teksten til data/messages.json med fs.writeFile().
}
```

<details>
<summary>Hint: hvilke metoder skal du bruge hvor?</summary>

```text
loadMessages():
  data   = await fs.readFile(...)   (husk "utf8")
  return JSON.parse(data)

saveMessages(messages):
  json = JSON.stringify(messages, ...)   (brug indrykning, så filen er læsbar)
  await fs.writeFile(..., json)
```

</details>

<details>
<summary>Se et løsningsforslag til <code>loadMessages()</code> og <code>saveMessages()</code></summary>

Åbn først løsningsforslaget, når du selv har forsøgt.

```js
async function loadMessages() {
  const data = await fs.readFile("./data/messages.json", "utf8");
  return JSON.parse(data);
}

async function saveMessages(messages) {
  const json = JSON.stringify(messages, null, 2);
  await fs.writeFile("./data/messages.json", json);
}
```

</details>

> Ingen af funktionerne gemmer noget i en variabel uden for sig selv — de to funktioner er den eneste vej ind og ud af `data/messages.json`.

---

## 5. Brug `loadMessages()` i `GET /`

Ret din GET-route, så den henter beskederne fra filen, hver gang siden vises, i stedet for den tomme liste, der har ligget der siden øvelse 3. Routens callback-funktion skal være `async`, fordi `loadMessages()` er asynchronous.

<details>
<summary>Se et løsningsforslag til GET-routen</summary>

```js
app.get("/", async (request, response) => {
  const messages = await loadMessages();

  response.render("index", { messages, error: "", topicStats });
});
```

</details>

### Test trin 5

Genstart serveren, og genindlæs siden. Den skal vise en tom samtale (fordi `data/messages.json` stadig kun indeholder `[]`) — uden fejl.

<details>
<summary>Fejlfinding: filen kan ikke læses</summary>

- **`ENOENT` ved `fs.readFile()`:** Kontrollér, at mappen `data` og filen `messages.json` findes i projektet, og at du starter serveren fra projektmappen.
- **`SyntaxError` ved `JSON.parse()`:** Åbn filen, og kontrollér indholdet. En ny historik skal indeholde `[]`, ikke være tom. JSON kræver dobbelte citationstegn og tillader ingen kommentarer eller trailing comma. Bevar eksisterende beskeder, hvis du retter en fil med historik.

</details>

---

## 6. Brug `loadMessages()` og `saveMessages()` i `POST /ask`

To ting skal ske i din eksisterende `POST /ask`-route:

1. Helt i begyndelsen af routen: hent den aktuelle historik med `await loadMessages()`, i stedet for at gå ud fra en variabel, der findes uden for routen.
2. Lige før `response.render()`: gem den opdaterede historik med `await saveMessages(messages)`.

Behold din egen validering, din eksisterende svarlogik samt din `topicStats`-opdatering — de to nye linjer skal blot føjes til, hvor de passer ind. Husk at gøre callback-funktionen `async`.

<details>
<summary>Se hele POST-routen samlet</summary>

Brug eksemplet til at kontrollere placeringen af de to nye linjer. Her hedder svarfunktionen `findBestAnswer()`. Behold dine egne funktionskald, din validering og dine variabelnavne, hvis du har organiseret koden anderledes.

```js
app.post("/ask", async (request, response) => {
  const messages = await loadMessages();

  const question = request.body.question.trim();
  let error = "";

  if (!question) {
    error = "Skriv et spørgsmål, før du sender.";
  } else {
    messages.push({ type: "question", text: question });

    const result = findBestAnswer(question);
    messages.push({ type: "answer", text: result.answer });

    if (result.category) {
      topicStats[result.category] = topicStats[result.category] + 1;
    }
  }

  await saveMessages(messages);

  response.render("index", { messages, error, topicStats });
});
```

</details>

> `messages` findes nu kun som en lokal variabel inde i denne ene route — hentet med `loadMessages()` i starten og gemt igen med `saveMessages()` i slutningen. Der er ikke noget sted i `server.js`, hvor `messages` ligger og venter mellem to requests.

### Test trin 6

Stil et spørgsmål. Åbn `data/messages.json` i editoren, mens serveren stadig kører. Er dit nye spørgsmål og svar kommet med i filen — med det samme?

---

## 7. Test persistens

Nu kommer den vigtige test.

1. Stil de to formuleringer fra trin 1 igen.
2. Kontrollér i browseren, at din svarlogik stadig giver de forventede svar på begge formuleringer.
3. Stop serveren med `Ctrl + C`.
4. Start serveren igen med `npm run dev`.
5. Genindlæs siden, og kontrollér, at begge formuleringer og deres svar stadig vises.
6. Stil et nyt spørgsmål, som din svarlogik kan genkende. Kontrollér, at botten stadig svarer korrekt, og at det nye spørgsmål og svar også bliver gemt i filen.

Er samtalen der stadig?

Hvis ja, har du lavet **persistens**: `data/messages.json` er den eneste sandhed om samtalen. Historikken indlæses fra filen ved hver request og gemmes efter ændringer. `GET /` læser og viser data; `POST /ask` læser, opdaterer og gemmer.

---

## 8. Brug string parsing, metoder og funktioner i AMAbotten

Nu hvor historikken bliver gemt, skal du vælge **én lille forbedring af svarlogikken**. Tag udgangspunkt i din egen implementering: hvad har din bot svært ved at genkende? Har du allerede lavet en af forbedringerne, så genbrug den og vis med testen nedenfor, hvordan den virker.

Vælg normalisering som udgangspunkt. Hvis den allerede fungerer i din bot, kan du demonstrere den med testen nedenfor eller vælge den mere udfordrende matching-opgave:

- **Normalisering — anbefalet udgangspunkt:** Saml behandling af store/små bogstaver og mellemrum i en funktion `normalizeQuestion(question)`, der returnerer en ny string. Brug fx `trim()`, `toLowerCase()` og eventuelt `replace(/\s+/g, " ")`, så flere mellemrum i træk bliver til ét. Brug funktionen inde i `findBestAnswer()` i stedet for kun `question.toLowerCase()`.
- **Mere præcis matching — større udfordring:** Undersøg, om `includes()` giver uønskede match i din bot. Fx matcher `"madras".includes("mad")`, selvom spørgsmålet ikke handler om mad. Brug en passende string-metode eller et mønster med `search()` eller `match()` til at genkende det, du faktisk leder efter. Saml tjekket i en funktion, fx `matchesKeyword(question, keyword)`, der returnerer `true` eller `false`, og brug den i din eksisterende `countMatches()`.

Du skal kunne forklare din funktions parametre og returværdi, og hvorfor du har valgt netop de string-metoder. Hvis du organiserer tjekket som en metode på et objekt, skal du kunne forklare, hvorfor den hører til dér.

<details>
<summary>Hint: normalisering i en selvstændig funktion</summary>

```js
function normalizeQuestion(question) {
  // Returnér spørgsmålet med ensartede mellemrum og små bogstaver.
}

// Inde i din eksisterende findBestAnswer(question):
const normalizedQuestion = normalizeQuestion(question);
```

`replace(/\s+/g, " ")` erstatter hver sammenhængende gruppe af whitespace-tegn med ét mellemrum. Det kan fx gøre `"hvem   er du"` til `"hvem er du"`, så en nøglefrase kan matches.

Brug den normaliserede tekst til matching. Behold brugerens formulering i den besked, du lægger i `messages`, så historikken viser det spørgsmål, brugeren stillede.

</details>

**Test forbedringen sammen med persistensen:**

1. Vælg to spørgsmål, der skal genkendes som samme emne, og ét, der ikke skal matche den regel. Notér de forventede svar, før du tester.
2. Send alle tre spørgsmål gennem formularen. Kontrollér, at din forbedring virker, og at andre svarregler stadig virker som før.
3. Åbn `data/messages.json`, og kontrollér, at spørgsmål og svar er gemt.
4. Genstart serveren, og kontrollér, at historikken stadig vises. Send derefter et af spørgsmålene igen for at kontrollere svarlogikken efter genstarten.

Læg mærke til ansvarsfordelingen: string parsing hjælper botten med at forstå spørgsmålet, svarfunktionen vælger svaret, og `loadMessages()`/`saveMessages()` håndterer historikken. `JSON.parse()` læser JSON-formatet — den analyserer ikke betydningen af brugerens spørgsmål.

---

## Tjekpunkt

Øvelse 5 er gennemført, når du har lavet trin 1–8:

- Historikken læses med `loadMessages()` og gemmes med `saveMessages(messages)`.
- Spørgsmål og svar vises igen efter en genstart.
- Én forbedring med string parsing, metoder og funktioner er implementeret eller demonstreret og testet.
- Du kan forklare funktionernes opgaver, parametre og returværdier.

## Ekstraopgaver

<details>
<summary><strong>9. Gem også statistikken</strong></summary>

`topicStats` forsvinder stadig ved en genstart. Brug samme mønster som for `messages`:

1. Opret `data/topic-stats.json` med dit udgangspunkt for `topicStats`, fx:

   ```json
   { "navn": 0, "bosted": 0, "fritid": 0, "ukendt": 0 }
   ```

2. Fjern din nuværende `const topicStats = { ... }`, og tilføj i stedet to funktioner, ved siden af `loadMessages()`/`saveMessages()`:

   ```js
   async function loadTopicStats() {
     const data = await fs.readFile("./data/topic-stats.json", "utf8");
     return JSON.parse(data);
   }

   async function saveTopicStats(topicStats) {
     const json = JSON.stringify(topicStats, null, 2);
     await fs.writeFile("./data/topic-stats.json", json);
   }
   ```

3. I både `GET /` og `POST /ask`: hent `topicStats` med `await loadTopicStats()`, ligesom du gør med `loadMessages()`.
4. I `POST /ask`: kald `await saveTopicStats(topicStats)`, ved siden af `saveMessages(messages)`.

Test persistens: stil spørgsmål, genstart serveren, og kontrollér at tællerne i `topicStats` stadig er de samme.

Har du også lavet "Nulstil statistik"-knappen (ekstraopgave 12) fra [øvelse 4](express-ejs-amabot-statistik.md), skal `/clear-stats`-routen også bruge de to funktioner:

```js
app.post("/clear-stats", async (request, response) => {
  const topicStats = await loadTopicStats();

  for (const category of Object.keys(topicStats)) {
    topicStats[category] = 0;
  }

  await saveTopicStats(topicStats);
  response.redirect("/");
});
```

</details>

<details>
<summary><strong>10. Ryd historikken i filen</strong></summary>

Har du lavet "Ryd beskeder"-knappen (ekstraopgave 18) fra [øvelse 3](express-ejs-amabot.md), tømmer den i dag kun `messages` i memory. Filen beholder den gamle historik.

Ret routen, så den gemmer et tomt array i stedet:

```js
app.post("/clear-messages", async (request, response) => {
  await saveMessages([]);
  response.redirect("/");
});
```

> Der er ikke noget at læse eller ændre her — du kender allerede den nye værdi (et tomt array), så du kan gå direkte til `saveMessages()`.

Test: klik "Ryd beskeder", genstart serveren, og kontrollér at samtalen stadig er tom.

</details>

---

## Reflektér over din læring

Når du er færdig, skal du gerne kunne forklare:

1. Hvorfor forsvandt samtalen ved en genstart, før du lavede denne øvelse?
2. Hvorfor skal `data/messages.json` indeholde `[]`, allerede før serveren har skrevet noget til den?
3. Hvorfor er der ingen `messages`-variabel uden for `loadMessages()`, `saveMessages()` og dine routes? Hvad kunne gå galt, hvis der var?
4. Hvorfor skal `GET /` og `POST /ask` begge være `async`?
5. Hvad gør `JSON.stringify(messages, null, 2)` anderledes end `JSON.stringify(messages)`?
6. Hvorfor skal vi vente på, at `fs.writeFile()` er færdig, før vi sender svaret til browseren? Skrivningen starter også uden `await` — hvad ændrer det for rækkefølgen?
7. Hvad er forskellen på at gemme `messages` i en JSON-fil og at gemme den i en database?
8. Hvordan bruger du funktioner, parametre og returværdier i `loadMessages()` og `saveMessages(messages)`?
9. Hvorfor kan du tilføje persistens uden at ændre den funktion eller metode, der analyserer spørgsmålet og finder svaret?
10. Hvilken forbedring af svarlogikken valgte du, hvilke string-metoder bruger den, og hvilke spørgsmål viser, at den virker?

## Videre

En JSON-fil er en fin, simpel form for persistens til en øvelse som denne. Men den er ikke lavet til, at mange brugere læser og skriver den samtidig — hver `saveMessages()` overskriver hele filen. Senere i forløbet erstatter I JSON-filen med en rigtig database, men selve idéen — hver request henter den aktuelle tilstand og gemmer sine ændringer igen — er den samme, som når en route senere forespørger en database.
