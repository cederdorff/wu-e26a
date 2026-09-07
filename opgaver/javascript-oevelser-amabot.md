# JavaScript-øvelser til AMAbot

Træn de JavaScript-begreber bag `findAnswer()` og `findBestAnswer()` fra [øvelse 3](express-ejs-amabot.md) og [øvelse 4](express-ejs-amabot-statistik.md) — hver for sig, med dine egne simple eksempler, ikke ved at genopbygge AMAbottens kode.

```text
if/else -> objekter -> arrays -> for...of -> stringmetoder og pattern matching
```

Skriv koden selv ud fra beskrivelsen i hvert trin, og brug `console.log()`-testene til at tjekke resultatet. De små kodeeksempler under hver forklaring er kun til at vise begrebet — dem skal du ikke skrive ind i filen.

---

## 1. Opret en tom øvelsesfil

Åbn terminalen i dit AMAbot-projekt, og opret en ny, tom fil med navnet:

```text
amabot-javascript-tests.js
```

Filen skal ligge i projektets rod ved siden af `server.js`:

```text
din-amabot/
├── amabot-javascript-tests.js
├── server.js
├── package.json
├── public/
└── views/
```

Kør filen fra terminalen:

```bash
node amabot-javascript-tests.js
```

Der kommer endnu ingen tekst i terminalen, fordi filen er tom.

Du kommer til at rette og køre filen mange gange gennem øvelsen. I stedet for at skrive `node amabot-javascript-tests.js` igen og igen, kan du bruge `--watch`, ligesom du kender det fra `npm run dev` i øvelse 3:

```bash
node --watch amabot-javascript-tests.js
```

Nu genkører Node automatisk filen, hver gang du gemmer den. Terminalen bliver ved med at køre, indtil du selv stopper den — det gør du med `Ctrl + C` (også på Mac).

### Sådan arbejder du

For hvert trin:

1. tilføj koden nederst i `amabot-javascript-tests.js` — slet ikke tidligere trin, de bliver genbrugt
2. forudsig resultatet, før du gemmer
3. gem, og tjek resultatet i terminalen
4. ret koden, indtil resultatet matcher testen
5. forklar, hvad koden modtager, undersøger og returnerer

---

## 2. Kontrolstrukturer: `if`, `else if` og `else`

`if` kører sin kodeblok, når betingelsen er sand. `else if` tilføjer flere betingelser, som kun bliver undersøgt, hvis de forrige var falske. `else` er det, der sker, når ingen af betingelserne holder.

```js
function describeTemperature(temperature) {
  if (temperature < 0) {
    return "Frost";
  } else if (temperature < 20) {
    return "Køligt";
  } else {
    return "Varmt";
  }
}

console.log(describeTemperature(-5)); // Frost
```

Skriv en funktion med navnet `checkAge(age)`.

Funktionen skal:

1. returnere `"Alder kan ikke være negativ."`, hvis `age` er under `0`
2. returnere `"Du er mindreårig."`, hvis `age` er under `18` (men ikke negativ)
3. returnere `"Du er myndig."`, i alle andre tilfælde

Test funktionen:

```js
console.log(checkAge(-5)); // Alder kan ikke være negativ.
console.log(checkAge(10)); // Du er mindreårig.
console.log(checkAge(25)); // Du er myndig.
```

<details>
<summary>Hint: opbygningen af <code>if</code>/<code>else if</code>/<code>else</code></summary>

```text
hvis age er under 0
    returnér teksten om negativ alder
ellers hvis age er under 18
    returnér teksten om mindreårig
ellers
    returnér teksten om myndig
```

</details>

<details>
<summary>Se et løsningsforslag til <code>checkAge()</code></summary>

Åbn først løsningsforslaget, når du selv har forsøgt og testet funktionen.

```js
function checkAge(age) {
  if (age < 0) {
    return "Alder kan ikke være negativ.";
  } else if (age < 18) {
    return "Du er mindreårig.";
  } else {
    return "Du er myndig.";
  }
}
```

</details>

#### Forklar

- Hvilken betingelse undersøges først?
- Hvornår kører `else`?
- Hvorfor stopper funktionen, så snart den rammer et `return`?

#### Sammenhæng til din AMAbot

Det er samme mønster, du brugte til validering i øvelse 2 (er input tomt? for langt?), og som AMAbotten bruger til at vælge et svar i `findAnswer()` (matcher spørgsmålet navn? bosted?). Kun betingelsen ændrer sig — strukturen med `if`, `else if` og `else` er den samme.

---

## 3. Objekter

Et objekt grupperer data, der hører sammen, under navngivne egenskaber (properties). I stedet for flere løse variabler får du ét samlet "ting".

```js
const book = {
  title: "Harry Potter",
  pages: 320
};

console.log(book.title);
```

Opret et objekt med navnet `student`, der har disse tre properties og værdier:

- `name`: `"Aisha"`
- `grade`: `10`
- `active`: `true`

Test:

```js
console.log(student.name); // Aisha
console.log(student.grade); // 10
console.log(student.active); // true
```

Ret derefter `grade` til `11`, og log den igen:

```js
console.log(student.grade); // 11
```

<details>
<summary>Se et løsningsforslag til <code>student</code></summary>

```js
const student = {
  name: "Aisha",
  grade: 10,
  active: true
};

student.grade = 11;
```

</details>

#### Forklar

- Hvordan læser du en property med punktnotation? Hvordan ændrer du den?
- Hvilken datatype har `student.active`?

#### Sammenhæng til din AMAbot

AMAbotten samler på samme måde flere oplysninger om én svarregel i ét objekt — fx dens nøgleord og dens svar.

---

## 4. Arrays

Et array holder flere værdier i en bestemt rækkefølge. Hvert element har et indeks, der starter ved `0`.

```js
const colors = ["red", "green", "blue"];

console.log(colors[0]); // red
console.log(colors.length); // 3
```

Et array kan indeholde alt — også objekter:

```js
const books = [
  { title: "Harry Potter", pages: 320 },
  { title: "Hobbitten", pages: 310 }
];

console.log(books[0].title); // Harry Potter
```

Opret et array med navnet `fruits`, der indeholder disse tre tekster i denne rækkefølge: `"banan"`, `"æble"`, `"pære"`.

Test:

```js
console.log(fruits[0]); // banan
console.log(fruits.length); // 3
```

Brug `.push()` til at tilføje `"appelsin"` sidst i arrayet, og test igen:

```js
console.log(fruits); // [ "banan", "æble", "pære", "appelsin" ]
console.log(fruits.length); // 4
```

<details>
<summary>Se et løsningsforslag til <code>fruits</code></summary>

```js
const fruits = ["banan", "æble", "pære"];

fruits.push("appelsin");
```

</details>

Opret derefter et array med navnet `students`. Det skal indeholde disse to objekter, i denne rækkefølge:

- `{ name: "Aisha", grade: 10 }`
- `{ name: "Noah", grade: 8 }`

Test:

```js
console.log(students[0].name); // Aisha
console.log(students[1].name); // Noah
console.log(students.length); // 2
```

<details>
<summary>Se et løsningsforslag til <code>students</code></summary>

```js
const students = [
  { name: "Aisha", grade: 10 },
  { name: "Noah", grade: 8 }
];
```

</details>

#### Forklar

- Hvorfor peger `fruits[0]` på `"banan"` og ikke `"æble"`?
- Hvad gør `.push()`?
- Hvad er `students[0]`? Hvad er `students[0].name`?

#### Sammenhæng til din AMAbot

AMAbotten gemmer alle sine svarregler i præcis sådan et array af objekter — ét objekt pr. regel.

---

## 5. Loop med fokus på `for...of`

`for...of` gennemløber et array og giver dig ét element ad gangen. Du genbruger `fruits` og `students` fra forrige trin — de skal stadig stå i filen.

```js
const days = ["man", "tirs", "ons"];

for (const day of days) {
  console.log(day);
}
```

Skriv en `for...of`-løkke, der logger hver frugt i `fruits` med `console.log()`. Forudsig outputtet, før du kører filen.

<details>
<summary>Se et løsningsforslag til løkken</summary>

```js
for (const fruit of fruits) {
  console.log(fruit);
}
```

</details>

Skriv derefter en funktion med navnet `findStudent(name)`.

Funktionen skal:

1. gennemløbe `students` med `for...of`
2. returnere hele studerende-objektet, når `student.name` er lig med `name`
3. returnere teksten `"Ikke fundet"` efter løkken, hvis ingen matcher

Test:

```js
console.log(findStudent("Noah")); // { name: "Noah", grade: 8 }
console.log(findStudent("Mette")); // Ikke fundet
```

<details>
<summary>Hint: opbygningen af løkken</summary>

```text
for hver student i students
    hvis student.name er lig med name
        returnér student
returnér "Ikke fundet"
```

</details>

<details>
<summary>Se et løsningsforslag til <code>findStudent()</code></summary>

Åbn først løsningsforslaget, når du selv har forsøgt og testet funktionen.

```js
function findStudent(name) {
  for (const student of students) {
    if (student.name === name) {
      return student;
    }
  }
  return "Ikke fundet";
}
```

</details>

#### Forklar

- Hvad indeholder løkkevariablen på én tur gennem `students`?
- Hvorfor stopper funktionen, så snart den finder et match?
- Hvorfor står `"Ikke fundet"` efter løkken og ikke inde i den?

#### Sammenhæng til din AMAbot

Præcis denne opskrift bruger `findAnswer()`: gennemløb reglerne med `for...of`, undersøg en betingelse for hver, returnér tidligt ved match, og returnér et standardsvar efter løkken, hvis ingen regler matcher.

---

## 6. Stringmetoder og pattern matching

Stringmetoder undersøger og omformer tekst. Her bruger du dem til at matche nøgleord i en sætning.

```js
const message = "Hej med dig";

console.log(message.toLowerCase()); // hej med dig
console.log(message.toLowerCase().includes("hej")); // true
```

### `toLowerCase()` og `includes()`

Opret en variabel med navnet `text`, der indeholder teksten `"Jeg kan godt lide JavaScript"`.

Test:

```js
console.log(text.toLowerCase()); // jeg kan godt lide javascript
console.log(text.toLowerCase().includes("javascript")); // true
console.log(text.toLowerCase().includes("python")); // false
```

<details>
<summary>Se et løsningsforslag til <code>text</code></summary>

```js
const text = "Jeg kan godt lide JavaScript";
```

</details>

#### Forklar

- Hvorfor kalder du `toLowerCase()`, før du bruger `includes()`?
- Hvilken datatype returnerer `includes()`?

### `.some()`: matcher mindst ét nøgleord?

Opret et array med navnet `keywords`, der indeholder `"python"`, `"java"` og `"script"`.

Skriv en variabel med navnet `hasMatch`, der bruger `.some()` til at undersøge, om mindst ét af nøgleordene i `keywords` findes i `text.toLowerCase()`.

Test:

```js
console.log(hasMatch); // true
```

<details>
<summary>Hint: opbygningen af <code>.some()</code></summary>

```text
keywords.some(nøgleord => text.toLowerCase() indeholder nøgleord)
```

</details>

<details>
<summary>Se et løsningsforslag til <code>hasMatch</code></summary>

```js
const keywords = ["python", "java", "script"];

const hasMatch = keywords.some((keyword) => text.toLowerCase().includes(keyword));
```

</details>

#### Forklar

- Hvad indeholder callback-parameteren på én tur gennem `.some()`?
- Hvorfor kan `.some()` stoppe, så snart ét nøgleord matcher?

### `.filter()` og `.length`: hvor mange nøgleord matcher?

Skriv en variabel med navnet `matches`, der bruger `.filter()` til at finde de nøgleord fra `keywords`, der findes i `text.toLowerCase()`.

Test:

```js
console.log(matches); // [ "java", "script" ]
console.log(matches.length); // 2
```

<details>
<summary>Se et løsningsforslag til <code>matches</code></summary>

```js
const matches = keywords.filter((keyword) => text.toLowerCase().includes(keyword));
```

</details>

#### Forklar

- Hvad indeholder arrayet `matches`?
- Hvad er forskellen på svaret fra `.some()` og svaret fra `.filter().length`?

#### Sammenhæng til din AMAbot

AMAbotten bruger `toLowerCase()` og `includes()` til at undersøge ét nøgleord, `.some()` til at afgøre, om mindst ét nøgleord matcher (øvelse 3), og `.filter()` med `.length` til at tælle, hvor mange nøgleord der matcher — det er selve scoren i øvelse 4.

---

## Videre til din AMAbot

Du har nu skrevet og testet hver byggesten for sig. Vend tilbage til `server.js`, og genkend dem, når du læser dine egne `findAnswer()` og `findBestAnswer()`:

- `if`/`else` vælger en kodevej
- objekter og arrays gemmer svarreglerne
- `for...of` gennemløber reglerne
- `toLowerCase()`, `includes()`, `.some()` og `.filter()` afgør, om og hvor godt en regel matcher spørgsmålet

Kopiér ikke denne fils eksempler ind i `server.js` — brug idéerne til at skrive og forklare din egen kode. Express-routes og EJS hører fortsat til i øvelse 3 og 4.
