# JSON- og File System-øvelser til AMAbot

Træn `JSON.stringify()`, `JSON.parse()` og Node.js' File System API hver for sig, med et simpelt array, før du bruger dem til at gemme AMAbottens rigtige samtalehistorik i [øvelse 5](express-ejs-amabot-persistens.md).

```text
array -> JSON.stringify() -> JSON-tekst -> fs.writeFile() -> fil
fil -> fs.readFile() -> JSON-tekst -> JSON.parse() -> array
```

Skriv koden selv ud fra beskrivelsen i hvert trin, og brug `console.log()`-testene til at tjekke resultatet. De små kodeeksempler under hver forklaring er kun til at vise begrebet — dem skal du ikke skrive ind i filen.

---

## 1. Opret en tom øvelsesfil

Åbn terminalen i dit AMAbot-projekt, og opret en ny, tom fil med navnet:

```text
amabot-json-tests.js
```

Filen skal ligge i projektets rod ved siden af `server.js`:

```text
din-amabot/
├── amabot-json-tests.js
├── server.js
├── package.json
├── public/
└── views/
```

Filen bruger `import`, ligesom `server.js` — det virker, fordi `package.json` allerede har `"type": "module"` fra øvelse 3.

Kør filen fra terminalen med watch mode, ligesom du kender det fra `npm run dev`:

```bash
node --watch amabot-json-tests.js
```

Nu genkører Node automatisk filen, hver gang du gemmer den. Terminalen bliver ved med at køre, indtil du stopper den med `Ctrl + C`.

### Sådan arbejder du

For hvert trin:

1. tilføj koden nederst i `amabot-json-tests.js` — slet ikke tidligere trin, de bliver genbrugt
2. forudsig resultatet, før du gemmer
3. gem, og tjek resultatet i terminalen (eller i den fil, trinnet skriver)
4. ret koden, indtil resultatet matcher testen
5. forklar, hvad koden modtager, omdanner og returnerer

---

## 2. Fra array til JSON-tekst: `JSON.stringify()`

`JSON.stringify()` omdanner JavaScript-data til en JSON-tekst (en string).

```js
const fruits = ["banan", "æble", "pære"];

console.log(JSON.stringify(fruits)); // ["banan","æble","pære"]
console.log(typeof JSON.stringify(fruits)); // string
```

Opret et array med navnet `messages`, der indeholder disse to objekter — samme struktur som din AMAbot allerede bruger:

- `{ type: "question", text: "Hvad hedder du?" }`
- `{ type: "answer", text: "Jeg hedder Ada." }`

Brug `JSON.stringify()` til at omdanne `messages` til en variabel med navnet `json`.

Test:

```js
console.log(typeof messages); // object
console.log(typeof json); // string
console.log(json);
```

<details>
<summary>Se et løsningsforslag til <code>messages</code> og <code>json</code></summary>

```js
const messages = [
  { type: "question", text: "Hvad hedder du?" },
  { type: "answer", text: "Jeg hedder Ada." }
];

const json = JSON.stringify(messages);
```

</details>

#### Forklar

- Hvorfor er `typeof json` `"string"`, selvom `messages` er et array af objekter?
- Hvad sker der med de dobbelte citationstegn i outputtet — er de en del af selve JSON-teksten, eller kun terminalens visning?

#### Sammenhæng til din AMAbot

Det er præcis den samme `messages`-struktur, der allerede findes i din AMAbots `server.js` — bare i memory. Snart skal den samme tekst skrives til en fil i stedet for kun at ligge i en variabel.

---

## 3. Gør JSON-teksten læsbar

`JSON.stringify()` tager to ekstra, valgfrie argumenter, der styrer formateringen:

```js
console.log(JSON.stringify(fruits, null, 2));
```

Log `messages` igen, men denne gang med indrykning på 2 mellemrum. Gem resultatet i en ny variabel med navnet `prettyJson`.

Test:

```js
console.log(prettyJson);
```

<details>
<summary>Se et løsningsforslag til <code>prettyJson</code></summary>

```js
const prettyJson = JSON.stringify(messages, null, 2);
```

</details>

#### Forklar

- Hvad er forskellen på `json` og `prettyJson`, når de vises i terminalen?
- Hvad tror du, det andet argument (`null`) bruges til? (Du behøver ikke svaret nu — bare notér spørgsmålet.)

---

## 4. Skriv JSON til en fil: `fs.writeFile()`

Importer Node.js' File System API øverst i filen:

```js
import fs from "node:fs/promises";
```

> `node:fs/promises` er indbygget i Node.js. Du skal ikke installere noget med npm.

`fs.writeFile()` er asynchronous, så den skal bruges med `await`. Fordi `amabot-json-tests.js` er et ES-modul (`"type": "module"`), kan du bruge `await` direkte i filen — uden at pakke det ind i en funktion:

```js
await fs.writeFile("amabot-json-test.json", prettyJson);
```

Skriv `prettyJson` til en ny fil med navnet `amabot-json-test.json` i projektets rod.

### Test trin 4

Kør filen, og åbn derefter `amabot-json-test.json` i editoren. Indeholder den dine to beskeder, formateret med indrykning?

---

## 5. Læs JSON fra en fil: `fs.readFile()` og `JSON.parse()`

`fs.readFile()` læser en fils indhold som tekst:

```js
const data = await fs.readFile("amabot-json-test.json", "utf8");

console.log(typeof data); // string
```

`JSON.parse()` gør det modsatte af `JSON.stringify()`: den omdanner JSON-tekst til rigtige JavaScript-data.

Læs `amabot-json-test.json`, og brug `JSON.parse()` til at omdanne indholdet til en variabel med navnet `parsedMessages`.

Test:

```js
console.log(Array.isArray(parsedMessages)); // true
console.log(parsedMessages[0].text); // Hvad hedder du?
console.log(parsedMessages[0] === messages[0]); // false
```

<details>
<summary>Hint: rækkefølgen af de to trin</summary>

```text
læs filen med fs.readFile() -> data (string)
omdan data med JSON.parse() -> parsedMessages (array)
```

</details>

<details>
<summary>Se et løsningsforslag til <code>parsedMessages</code></summary>

```js
const data = await fs.readFile("amabot-json-test.json", "utf8");
const parsedMessages = JSON.parse(data);
```

</details>

#### Forklar

- Hvorfor er `typeof data` `"string"`, men `Array.isArray(parsedMessages)` `true`?
- Det sidste `console.log` ovenfor giver `false`. `parsedMessages[0]` og `messages[0]` indeholder samme data — hvorfor er de alligevel ikke det samme objekt?

---

## 6. Ret data, og skriv den tilbage — hele rundturen

Nu samler du de fire trin i én sammenhæng: **læs → ret → skriv → læs igen**.

1. Læs `amabot-json-test.json`, og parse den til en variabel med navnet `savedMessages`.
2. Brug `.push()` til at tilføje et nyt objekt til `savedMessages`: `{ type: "question", text: "Hvor bor du?" }`.
3. Brug `JSON.stringify()` (med indrykning) til at omdanne `savedMessages` tilbage til tekst.
4. Skriv teksten til `amabot-json-test.json` igen — det overskriver filens tidligere indhold.
5. Læs filen én gang til, parse den, og log dens `.length`.

Test:

```js
console.log(savedMessages.length); // 3
```

<details>
<summary>Hint: opbygningen af rundturen</summary>

```text
læs filen
parse til array
push nyt objekt ind i arrayet
stringify arrayet
skriv filen
læs filen igen for at bekræfte
```

</details>

<details>
<summary>Se et løsningsforslag til hele trinnet</summary>

```js
const savedData = await fs.readFile("amabot-json-test.json", "utf8");
const savedMessages = JSON.parse(savedData);

savedMessages.push({ type: "question", text: "Hvor bor du?" });

const updatedJson = JSON.stringify(savedMessages, null, 2);
await fs.writeFile("amabot-json-test.json", updatedJson);

const confirmData = await fs.readFile("amabot-json-test.json", "utf8");
const confirmMessages = JSON.parse(confirmData);

console.log(confirmMessages.length); // 3
```

</details>

#### Forklar

- Hvorfor skal du parse filen, før du kan bruge `.push()` på dens indhold?
- Hvad ville der stå i `amabot-json-test.json`, hvis du glemte at kalde `JSON.stringify()`, før du skrev til filen?
- Hvad ville der ske, hvis du kaldte `.push()` på `savedMessages`, men aldrig kaldte `fs.writeFile()` igen?

---

## Videre til øvelse 5

Du har nu trænet hvert begreb for sig:

- `JSON.stringify()` og `JSON.parse()` konverterer mellem JavaScript-data og JSON-tekst
- `fs.readFile()` og `fs.writeFile()` læser og skriver filer, og er begge asynchronous
- Mønstret **read → modify → write** er det, der gør en ændring permanent

Du kan slette `amabot-json-tests.js` og `amabot-json-test.json` igen — de er kun til denne øvelse.

Gå videre til [øvelse 5: Gem AMAbottens chathistorik i en JSON-fil](express-ejs-amabot-persistens.md), hvor du bruger nøjagtig det samme mønster på din rigtige AMAbot.
