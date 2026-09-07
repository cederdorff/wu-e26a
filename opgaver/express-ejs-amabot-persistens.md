# Øvelse 5: Gem AMAbottens chathistorik i en JSON-fil

## Kort fortalt

Lige nu lever `messages` og `topicStats` kun i memory. Samtalen forsvinder, hver gang du genstarter serveren. I denne øvelse gemmer du samtalehistorikken i en JSON-fil, så den overlever en genstart.

Du bygger videre på din egen AMAbot fra [øvelse 4](express-ejs-amabot-statistik.md). Du skal ikke oprette et nyt projekt.

> **Sidder du fast med selve JSON/fs-idéen?** Tag en afstikker til [JSON- og File System-øvelser til AMAbot](json-fs-oevelser-amabot.md), hvor du træner `JSON.stringify()`, `JSON.parse()`, `fs.readFile()` og `fs.writeFile()` på et simpelt array, før du bruger dem her.

## Det bygger du

```text
data/messages.json -> fs.readFile() -> JSON.parse() -> messages (ved serverstart)

POST /ask -> messages.push() -> JSON.stringify() -> fs.writeFile() -> data/messages.json
```

Mønstret er det samme, uanset om du læser eller skriver: **read → modify → write**.

---

## 1. Kontrollér udgangspunktet

Start serveren:

```bash
npm run dev
```

Stil et par spørgsmål, og bekræft at både samtalen og statistikken opdateres.

Stop derefter serveren med `Ctrl + C`, og start den igen med `npm run dev`. Genindlæs siden i browseren.

Er samtalen der stadig?

Nej — `messages` og `topicStats` er almindelige JavaScript-variabler. De findes kun, mens Node-processen kører. Når processen stopper, forsvinder alt, hvad der ligger i memory.

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

> Filen skal indeholde et gyldigt JSON-array, allerede før serveren har skrevet noget til den. Er filen tom, eller mangler den, fejler `JSON.parse()` i næste trin.

---

## 4. Læs historikken, når serveren starter

Find linjen, hvor du opretter `messages`:

```js
const messages = [];
```

Erstat den med:

```js
const data = await fs.readFile("./data/messages.json", "utf8");
const messages = JSON.parse(data);
```

> **Top-level `await`:** Normalt kan `await` kun bruges inde i en `async`-funktion. Men fordi `package.json` har `"type": "module"`, er `server.js` et ES-modul — og ES-moduler må bruge `await` direkte på øverste niveau. Serveren venter derfor med at starte, til filen er læst og parset.

### Test trin 4

Genstart serveren. Den skal starte uden fejl, og siden skal vise en tom samtale (fordi `data/messages.json` stadig kun indeholder `[]`).

---

## 5. Skriv en funktion, der gemmer historikken

Tilføj denne funktion et sted over dine routes, fx lige under `messages` og `topicStats`:

```js
async function saveMessages() {
  const json = JSON.stringify(messages, null, 2);
  await fs.writeFile("./data/messages.json", json);
}
```

`JSON.stringify(messages, null, 2)` omdanner `messages`-arrayet til JSON-tekst med indrykning, så filen er til at læse. `fs.writeFile()` overskriver filens indhold med den nye tekst.

---

## 6. Gem historikken, hver gang der stilles et spørgsmål

`saveMessages()` er asynchronous, så den callback, der kalder den, skal selv være `async`. Find din `POST /ask`-route, og tilføj `async` foran callback-funktionen:

```js
app.post("/ask", async (request, response) => {
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

  await saveMessages();

  response.render("index", { messages, error, topicStats });
});
```

> `saveMessages()` gemmer hele `messages`-arrayet, hver gang routen kører — også når spørgsmålet var tomt. Det er en lille smule spild af skrivning, men koden bliver enklere, end hvis du kun gemte i nogle tilfælde.

### Test trin 6

Stil et spørgsmål. Åbn `data/messages.json` i editoren, mens serveren stadig kører. Er dit nye spørgsmål og svar kommet med i filen — med det samme, uden at du selv har gemt noget?

---

## 7. Test persistens

Nu kommer den vigtige test.

1. Stil to-tre spørgsmål.
2. Kontrollér i browseren, at samtalen og statistikken ser rigtige ud.
3. Stop serveren med `Ctrl + C`.
4. Start serveren igen med `npm run dev`.
5. Genindlæs siden.

Er samtalen der stadig?

Hvis ja, har du lavet **persistens**: `messages` findes nu to steder — i memory, mens serveren kører, og i `data/messages.json`, som overlever en genstart. Ved opstart læser serveren filen og genskaber `messages` i memory; ved hvert spørgsmål skriver den den opdaterede version tilbage.

---

## 🧪 Ekstraopgaver

<details>
<summary><strong>8. Gem også statistikken</strong></summary>

`topicStats` forsvinder stadig ved en genstart. Brug samme mønster som for `messages`:

1. Opret `data/topic-stats.json` med dit udgangspunkt for `topicStats`, fx:

   ```json
   { "navn": 0, "bosted": 0, "fritid": 0, "ukendt": 0 }
   ```

2. Erstat din nuværende `const topicStats = { ... }` med en indlæsning fra filen, ligesom du gjorde med `messages`.
3. Skriv en funktion `saveTopicStats()`, der bruger `JSON.stringify()` og `fs.writeFile()`.
4. Kald `saveTopicStats()` i `POST /ask`, ved siden af `saveMessages()`.

Test persistens: stil spørgsmål, genstart serveren, og kontrollér at tællerne i `topicStats` stadig er de samme.

Har du også lavet "Nulstil statistik"-knappen (ekstraopgave 12) fra [øvelse 4](express-ejs-amabot-statistik.md), skal `/clear-stats`-routen gøres `async` og kalde `saveTopicStats()`, efter tællerne er sat til `0` — ellers dukker de gamle tal op igen efter en genstart.

</details>

<details>
<summary><strong>9. Ryd historikken i både memory og fil</strong></summary>

Har du lavet "Ryd beskeder"-knappen (ekstraopgave 18) fra [øvelse 3](express-ejs-amabot.md), tømmer den i dag kun `messages` i memory. Filen beholder den gamle historik.

Gør routen `async`, og gem den tomme historik:

```js
app.post("/clear-messages", async (request, response) => {
  messages.length = 0;
  await saveMessages();
  response.redirect("/");
});
```

Test: klik "Ryd beskeder", genstart serveren, og kontrollér at samtalen stadig er tom.

</details>

---

## ✅ Reflektér over din læring

Når du er færdig, skal du gerne kunne forklare:

1. Hvorfor forsvandt samtalen ved en genstart, før du lavede denne øvelse?
2. Hvorfor skal `data/messages.json` indeholde `[]`, allerede før serveren har skrevet noget til den?
3. Hvad gør top-level `await`, og hvorfor må `server.js` bruge det?
4. Hvorfor skal `POST /ask`-callbacken være `async`, når du kalder `saveMessages()`?
5. Hvad gør `JSON.stringify(messages, null, 2)` anderledes end `JSON.stringify(messages)`?
6. Hvad ville der stå i `data/messages.json`, hvis du glemte `await` foran `fs.writeFile()`?
7. Hvad er forskellen på at gemme `messages` i en JSON-fil og at gemme den i en database?

## Videre

En JSON-fil er en fin, simpel form for persistens til en øvelse som denne. Men den er ikke lavet til, at mange brugere skriver til den samtidig — hver `saveMessages()` overskriver hele filen. Senere i forløbet erstatter I JSON-filen med en rigtig database, men selve idéen — gem data et sted, der ikke forsvinder, og læs den ind igen ved opstart — er den samme.
