# Øvelse 2: Formhåndtering, validering og svarlogik

I [øvelse 1](express-ejs-formular.md) modtog serveren ét navn og sendte en hilsen tilbage. Nu bygger du langsomt videre: først validerer du navnet, derefter gemmer du navne i et array, og til sidst tilføjer du alder og svarlogik.

Fortsæt i samme projekt, og brug fortsat `npm run dev`. Skriv selv koden og test efter hvert trin.

## Det ender du med at bygge

Formularen får felter til navn og alder:

![En formular med felter til navn og alder](assets/express-ejs-name-age-form-browser.png)

Efter et gyldigt submit viser serveren en personlig hilsen og en historik:

![En personlig hilsen med navn og alder samt en liste med tidligere navne](assets/express-ejs-name-age-response-browser.png)

> Skærmbillederne er en enkel reference. Det vigtige er dataflowet og funktionaliteten — ikke at din side ligner dem præcist.

## Før du går i gang

Kontrollér, at øvelse 1 stadig virker:

- `GET /` viser formularen.
- Formularen sender `POST /submit`.
- `request.body.name` indeholder det indtastede navn.
- EJS viser en personlig hilsen.

---

## 1. Undersøg tomt input

Indsend formularen uden et navn. Prøv derefter et navn, der kun består af mellemrum.

### Test trin 1

Overvej:

- Får brugeren en forklaring?
- Bør `"   "` tælle som et navn?
- Bør et navn gemmes med mellemrum før og efter?

Det første problem er, at appen ikke kan skelne et brugbart navn fra tomt input.

---

## 2. Normalisér og validér navnet

Ret POST-routen, så den fjerner ydre mellemrum og afviser et tomt navn:

```js
app.post("/submit", (request, response) => {
  const rawName = request.body.name;
  const name = rawName.trim();

  if (!name) {
    return response.render("index", {
      name: "",
      error: "Skriv dit navn, før du sender formularen."
    });
  }

  response.render("index", { name, error: "" });
});
```

Din GET-route skal også sende `error`, fordi den samme template nu bruger variablen:

```js
app.get("/", (request, response) => {
  response.render("index", { name: "", error: "" });
});
```

Tilføj dette efter formularen i `views/index.ejs`:

```html
<% if (error) { %>
  <p role="alert"><%= error %></p>
<% } %>
```

> **Normalisering og validering:** `trim()` gør input ensartet ved at fjerne ydre mellemrum. Derefter afgør `if (!name)`, om værdien må bruges. `return` stopper POST-routen, når der er en fejl.

### Test trin 2

1. Indsend et tomt navn og et navn med kun mellemrum. Begge skal vise fejlbeskeden.
2. Indsend `  Ada  `. Hilsenen skal bruge `Ada` uden yderste mellemrum.
3. Genindlæs siden. Den skal ikke vise en fejl.

> **Templatens datakontrakt:** Når EJS bruger `error`, skal både GET- og POST-routen sende en værdi til `error`.

---

## 3. Gem først bare navne i et array

Før vi tilføjer flere felter, gemmer vi hver gyldig indsendelse på den enkleste måde: et navn i et array.

Tilføj dette før dine routes i `server.js`:

```js
const names = [];
```

Ret GET-routen, så den sender arrayet til templaten:

```js
app.get("/", (request, response) => {
  response.render("index", { name: "", error: "", names });
});
```

Ret derefter POST-routen. Tilføj kun navnet, når det er gyldigt:

```js
app.post("/submit", (request, response) => {
  const rawName = request.body.name;
  const name = rawName.trim();

  if (!name) {
    return response.render("index", {
      name: "",
      error: "Skriv dit navn, før du sender formularen.",
      names
    });
  }

  names.push(name);
  console.log(names);

  response.render("index", { name, error: "", names });
});
```

> **Array:** Et array kan gemme flere værdier i rækkefølge. `names.push(name)` lægger det nye navn bagerst i arrayet. Arrayet ligger foreløbig kun i serverens hukommelse.

### Test trin 3

Indsend `Ada` og derefter `Dan`. Terminalen skal vise noget i stil med:

```text
[ 'Ada' ]
[ 'Ada', 'Dan' ]
```

Indsend derefter et tomt navn. Arrayet må ikke ændre sig.

---

## 4. Render arrayet med EJS

Tilføj dette efter fejlbeskeden i `index.ejs`:

```html
<h2>Tidligere navne</h2>

<% if (names.length === 0) { %>
  <p>Der er endnu ingen indsendelser.</p>
<% } else { %>
  <ul>
    <% names.forEach((name) => { %>
      <li><%= name %></li>
    <% }); %>
  </ul>
<% } %>
```

> **EJS-loop:** `<% ... %>` bruges til JavaScript-logik som `if` og `forEach()`. `<%= ... %>` skriver en værdi i HTML'en og escaper den.

### Test trin 4

1. Genstart serveren. Listen skal være tom.
2. Indsend flere gyldige navne. De skal vises i rækkefølge.
3. Indsend et tomt navn. Listen må ikke vokse.

Du har nu en komplet lille løsning: valideret input → array → EJS-loop → HTML.

---

## 5. Tilføj et aldersfelt

Tilføj dette mellem navnefeltet og knappen i `index.ejs`:

```html
<label for="age">Hvor gammel er du?</label>
<input id="age" name="age" type="number" step="any" />
```

Formularens `method="POST"` og `action="/submit"` ændres ikke. Det nye felt sendes med, fordi det har `name="age"`.

Tilføj midlertidigt denne log i starten af POST-routen:

```js
console.log(request.body);
```

### Test trin 5

Indsend `Ada` og `41`. Terminalen skal vise:

```text
{ name: 'Ada', age: '41' }
```

> **Formulardata er strings:** Selvom feltet har `type="number"`, ankommer `age` som en string i `request.body`. HTML-typen hjælper browseren, men serveren skal selv konvertere og validere værdien.

---

## 6. Konvertér alderen og tjek, om den er et tal

Læs og konvertér alderen i POST-routen, lige efter du har læst navnet:

```js
const rawAge = request.body.age;
const age = Number(rawAge);
```

Log værdierne midlertidigt:

```js
console.log({ rawAge, age });
```

Tilføj derefter denne første validering efter navnevalideringen:

```js
if (!rawAge || Number.isNaN(age)) {
  return response.render("index", {
    name,
    error: "Skriv en alder som et tal.",
    names
  });
}
```

> **Konvertering:** `Number(rawAge)` forsøger at lave en string om til et number. Hvis det ikke kan lade sig gøre, bliver resultatet `NaN` — *Not a Number*. En tom string skal vi tjekke særskilt, fordi `Number("")` giver `0`.

### Test trin 6

| Alder | Forventet resultat |
| --- | --- |
| Tomt felt | Fejl |
| `abc` sendt via et ændret request | Fejl |
| `12.5` | Godkendt foreløbig |
| `0` | Godkendt foreløbig |
| `121` | Godkendt foreløbig |
| `41` | Godkendt |

Du har nu kun undersøgt, om alderen er et tal. `0`, `12.5` og `121` er alle tal, men de passer sandsynligvis ikke til vores regler endnu.

### 6b. Tilføj regler for alderens størrelse

Tilføj denne ekstra kontrol **efter** den første aldersvalidering:

```js
if (!Number.isInteger(age) || age < 1 || age > 120) {
  return response.render("index", {
    name,
    error: "Skriv en alder som et helt tal mellem 1 og 120.",
    names
  });
}
```

> **Forretningsregler:** Nu ved vi, at `age` er et tal. Den næste `if`-blok afgør, om tallet er et helt tal og ligger inden for det interval, appen accepterer. Reglerne kommer efter konverteringen, fordi sammenligninger som `<` og `>` giver mening for tal.

#### Test trin 6b

| Alder | Forventet resultat |
| --- | --- |
| `12.5` | Fejl: ikke et helt tal |
| `0` | Fejl: for lav alder |
| `121` | Fejl: for høj alder |
| `41` | Godkendt |

Vigtigt: Ved en ugyldig alder må du ikke nå ned til `names.push(name)`. Flyt derfor `names.push(name)` til **efter** begge aldersvalideringer.

---

## 7. Vis begge felter i hilsenen

På den gyldige vej sender serveren begge værdier til templaten:

```js
names.push(name);
response.render("index", { name, age, error: "", names });
```

GET-routen og fejlgrenene renderer den samme template. Tilføj derfor en tom `age`-værdi i GET-routen:

```js
response.render("index", { name: "", age: "", error: "", names });
```

I fejlgrenene tilføjer du også `age`. Ved en aldersfejl skal du bevare den rå værdi:

```js
return response.render("index", {
  name,
  age: rawAge,
  error: "Skriv en alder som et helt tal mellem 1 og 120.",
  names
});
```

Erstat den gamle hilsen fra øvelse 1 — hele `<% if (name) { %>`-blokken — med dette i `index.ejs`:

```html
<% if (name && age && !error) { %>
  <h2>Hello <%= name %> (<%= age %> år) 👋</h2>
<% } %>
```

> **EJS med flere værdier:** Serveren sender `name` og `age` til templaten. EJS sammensætter hilsenen, mens serveren renderer HTML'en. Browseren modtager fortsat et færdigt HTML-response, ikke et JavaScript-svar.

### Test trin 7

Indsend forskellige navne og aldre. Begge værdier skal ændre hilsenen, og kun navnet skal føjes til listen.

---

## 8. Bevar værdierne ved en fejl

Når serveren renderer siden efter en fejl, kan den sende brugerens værdier tilbage, så de ikke skal indtastes igen.

`age` bruges både til aldersfeltet og til hilsenen. Det er den samme værdi, som serveren har godkendt eller skal vise tilbage efter en fejl.

Opdatér inputfelterne:

```html
<input id="name" name="name" type="text" value="<%= name %>" />

<input id="age" name="age" type="number" step="any" value="<%= age %>" />
```

Det betyder, at hver `response.render("index", ...)` også skal have en `age`-værdi. Brug `age: ""` i GET-routen. I fejlgrenene skal du sende `age: rawAge`.

Eksempel på aldersfejlen:

```js
return response.render("index", {
  name,
  age: rawAge,
  error: "Skriv en alder som et helt tal mellem 1 og 120.",
  names
});
```

### Test trin 8

1. Indtast et navn og en ugyldig alder. Begge værdier skal blive stående.
2. Indtast en alder uden et navn. Alderen skal blive stående.
3. Indsend gyldige værdier. Svaret skal vises.

> **Templatens datakontrakt:** Nu bruger templaten `name`, `age`, `error` og `names`. Alle routes og fejlgrene skal sende alle fire værdier, hver gang de renderer `index.ejs`.

---

## 9. Sammenlign din færdige POST-route

Din route bør nu ligne denne. Brug den til at kontrollere din kode, når du selv har arbejdet gennem trinene:

```js
app.post("/submit", (request, response) => {
  const rawName = request.body.name;
  const name = rawName.trim();
  const rawAge = request.body.age;
  const age = Number(rawAge);

  if (!name) {
    return response.render("index", {
      name: "",
      age: rawAge,
      error: "Skriv dit navn, før du sender formularen.",
      names
    });
  }

  if (!rawAge || Number.isNaN(age)) {
    return response.render("index", {
      name,
      age: rawAge,
      error: "Skriv en alder som et tal.",
      names
    });
  }

  if (!Number.isInteger(age) || age < 1 || age > 120) {
    return response.render("index", {
      name,
      age: rawAge,
      error: "Skriv en alder som et helt tal mellem 1 og 120.",
      names
    });
  }

  names.push(name);
  response.render("index", {
    name,
    age,
    error: "",
    names
  });
});
```

## 10. Test hele flowet

| Input | Forventet resultat |
| --- | --- |
| Tomt navn + gyldig alder | Fejl; alderen bevares; listen ændres ikke |
| Gyldigt navn + tom alder | Fejl; navnet bevares; listen ændres ikke |
| `  Ada  ` + `41` | Navnet normaliseres; svaret vises; listen vokser med én |
| Ada + `12.5` | Fejl; listen ændres ikke |
| Ada + `121` | Fejl; listen ændres ikke |
| Genstart af serveren | Navnelisten nulstilles |

Åbn også DevTools → **Network**. Alle submits skal fortsat være `POST /submit`, og response skal være færdig HTML fra serveren.

## Tjekpunkt

Du er færdig, når appen:

- normaliserer og validerer navnet
- tilføjer hvert gyldigt navn til `names` med `names.push(name)`
- renderer navnelisten med EJS
- konverterer og validerer alderen
- sender begge formularfelter til EJS, som viser hilsenen
- giver templaten alle forventede variabler ved hver rendering

## Fejlfinding

### `names`, `error` eller `age` er ikke defineret

Kontrollér, at den route eller fejlgren, der renderer `index.ejs`, sender variablen med.

### Navne kommer med i listen ved ugyldig alder

Kontrollér, at `names.push(name)` står efter begge valideringer.

### Historikken forsvinder

Det er forventet ved genstart. `names` ligger kun i serverens hukommelse.

## Videre, hvis du når det

- Skift fra `names` til et array af objekter, fx `{ name, age }`, så listen også kan vise alder.
- Tilføj en `POST /clear-history`-route og en formular, der tømmer `names`.
- Generér forskellige svar afhængigt af alderen.

> I øvelse 3 bygger du videre med arrays af objekter og regelbaseret svarlogik i en chatbot.
