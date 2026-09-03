# Øvelse 1: Din første server-renderede EJS-app

I denne øvelse bygger du en lille Express-app, som viser en formular, modtager et navn og svarer med en personlig hilsen. Du bygger løsningen ét trin ad gangen og tester efter hvert trin.

> Skriv selv koden fra eksemplerne i stedet for at kopiere den. Stop efter hver ny linje, og overvej, hvad den gør. Det gør det lettere at opdage skrivefejl, læse fejlbeskeder og senere skrive den samme type kode uden en færdig løsning foran dig.

Når du er færdig, ser forløbet sådan ud:

```text
Browser -> GET / -> Express-route -> EJS -> HTML-response
Browser -> POST /submit -> express.urlencoded() -> request.body -> POST-route -> EJS -> ny HTML-response
```

## Det ender du med at bygge

Først skal serveren rendere en side med en formular:

![En formular med et navnefelt og en Send-knap i browseren](assets/Screenshot%202026-09-03%20at%2007.14.13.png)

*Formularen vises, når browseren sender `GET /`.*

Når brugeren har indsendt sit navn, skal serveren rendere en personlig hilsen:

![En personlig hilsen med teksten Hello Dan i browseren](assets/Screenshot%202026-09-03%20at%2007.14.25.png)

*Hilsenen vises som resultat af formularens POST-request.*

> Skærmbillederne viser engelske tekster, mens teksten i din version godt kan være på dansk. Routen `/submit` og request/response-forløbet er det samme.

## Det skal du bruge

- Node.js installeret
- Visual Studio Code eller en anden editor
- En browser med DevTools
- Grundlæggende kendskab til Node.js og Express fra *Hello Express*

---

## 1. Opret projektmappen

Åbn terminalen, og kør:

```bash
mkdir min-ejs-app
cd min-ejs-app
code .
```

Hvis `code .` ikke virker, kan du åbne mappen manuelt i VS Code via **File → Open Folder**.

### Test trin 1

Kontrollér, at VS Code har åbnet mappen `min-ejs-app`, og at terminalen står i samme mappe.

---

## 2. Opret `package.json`

Initialisér et Node.js-projekt:

```bash
npm init -y
```

Kommandoen opretter filen `package.json`. Åbn den, og undersøg blandt andet felterne `name`, `version` og `main`.

### Test trin 2

Du skal nu kunne se `package.json` i VS Codes Explorer.

---

## 3. Aktivér ES Modules og tilføj scripts

Åbn `package.json`, og ret filen, så den ser sådan ud:

```json
{
  "name": "min-ejs-app",
  "version": "1.0.0",
  "description": "En server-renderet Express-app med EJS",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

- `"type": "module"` gør det muligt at bruge `import` og `export`.
- `npm run dev` starter Node.js med watch mode, så serveren genstarter, når du gemmer en ændring.
- `npm start` starter serveren uden watch mode.

> I *Hello Express*-øvelsen brugte du `npm start` til watch mode. I dette projekt har watch mode sit eget `dev`-script. Brug derfor `npm run dev`, mens du arbejder med resten af øvelsen. `npm start` starter stadig serveren, men genstarter den ikke automatisk ved ændringer.

### Test trin 3

Kontrollér, at `package.json` indeholder `type`, `scripts.dev` og `scripts.start`. Du kan ikke starte serveren endnu, fordi `server.js` ikke findes.

---

## 4. Installer Express og EJS

```bash
npm install express ejs
```

Efter installationen bør projektet indeholde:

```text
min-ejs-app/
├── node_modules/
├── package-lock.json
└── package.json
```

Express bliver vores webserver-framework. EJS bliver vores template engine og kan kombinere HTML med data fra serveren.

> **Fagligt kort:** Et framework er kode, der løser almindelige opgaver for os. Express hjælper blandt andet med at modtage HTTP-requests og sende HTTP-responses. En template engine kan sætte data ind i en HTML-skabelon, før HTML'en sendes til browseren.

### Test trin 4

Find `express` og `ejs` under `dependencies` i `package.json`.

---

## 5. Start en tom Express-server

Projektet er nu sat op. I de næste trin genbesøger du først det kendte request/response-flow fra *Hello Express*, før du udvider serveren med EJS.

Opret filen `server.js` i projektets rod. Skriv selv koden nedenfor, én linje ad gangen:

```js
import express from "express";

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Serveren kører på http://localhost:${port}`);
});
```

Start serveren:

```bash
npm run dev
```

### Test trin 5

Kontrollér først terminalen. Når serveren starter, skal callback-funktionen i `app.listen()` skrive:

```text
Serveren kører på http://localhost:3000
```

Sammenlign beskeden med din kode: Hvor kommer portnummeret fra, og hvornår bliver callback-funktionen kørt?

Besøg derefter `http://localhost:3000`. Browseren skal vise `Cannot GET /`. Det er forventet: Logbeskeden viser, at serveren er startet, mens browserens svar viser, at serveren endnu ikke har en route til `GET /`.

Hvis terminalen viser `EADDRINUSE`, kører en anden proces sandsynligvis allerede på port `3000`. Stop den anden server, eller vælg et andet portnummer.

---

## 6. Send et simpelt svar til browseren

Fra *Hello Express* kender du allerede en route, der sender en simpel tekst som response. Tilføj denne route **før** `app.listen()`:

```js
app.get("/", (request, response) => {
  response.send("Hello Express fra min EJS-app!");
});
```

`response.send()` sender teksten direkte tilbage til browseren. Der er endnu ingen template og ingen EJS involveret.

> **Fagligt kort:** `request` beskriver det, browseren har sendt til serveren — her blandt andet metoden `GET` og stien `/`. `response` er serverens svar tilbage. En route kobler et bestemt request, fx `GET /`, til den kode der skal køre.

### Test trin 6

Genindlæs `http://localhost:3000`. Browseren skal vise:

```text
Hello Express fra min EJS-app!
```

Forklar forskellen på resultatet nu og `Cannot GET /` i trin 5. Hvilken kode afgør, hvad browseren modtager?

---

## 7. Fortæl Express, at du vil bruge EJS

Tilføj denne linje efter `const port = 3000;`:

```js
app.set("view engine", "ejs");
```

Express vil nu som standard lede efter `.ejs`-filer i en mappe med navnet `views`.

> **Hvad er EJS?** EJS står for *Embedded JavaScript*. Det er en template engine, hvor du kan skrive HTML og indsætte små stykker JavaScript. Serveren kombinerer templaten med data og sender først derefter den færdige HTML til browseren. Det kaldes **server-side rendering (SSR)**.
>
> I denne øvelse er det Express-serveren, der genererer HTML'en med EJS. Ved **client-side rendering (CSR)** ville browseren i stedet modtage data — ofte JSON — og JavaScript i browseren ville bygge eller opdatere HTML'en. Her behøver vi endnu ikke JavaScript i browseren for at vise en hilsen.

### Test trin 7

Genindlæs browseren. Du skal stadig se “Hello Express fra min EJS-app!”, fordi GET-routen fortsat bruger `response.send()`. EJS er konfigureret, men bliver ikke brugt endnu.

---

## 8. Skift fra `response.send()` til `response.render()`

Erstat den eksisterende GET-route med denne route:

```js
app.get("/", (request, response) => {
  response.render("index");
});
```

`app.get("/", ...)` håndterer et GET-request til forsiden. `response.render("index")` beder Express om at rendere templaten `views/index.ejs`.

### Test trin 8

Genindlæs browseren. Nu skal du få en fejl om, at Express ikke kan finde viewet `index`.

Det er også forventet. Routen virker, men filen `views/index.ejs` findes ikke endnu. Læs fejlbeskeden, og se om du kan finde den sti, Express leder i.

---

## 9. Opret en statisk EJS-template

Opret mappen `views`, og opret derefter filen `views/index.ejs`:

```html
<!doctype html>
<html lang="da">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Min EJS-app</title>
  </head>
  <body>
    <main>
      <h1>Velkommen til min server!</h1>
    </main>
  </body>
</html>
```

Selvom filen næsten ligner almindelig HTML, skal den hedde `.ejs`, så EJS kan behandle den som en template.

### Test trin 9

Genindlæs browseren. Du skal nu se overskriften “Velkommen til min server!”.

Åbn DevTools → **Network**, vælg requestet til `/`, og undersøg response. Browseren har modtaget færdig HTML.

---

## 10. Tilføj formularen

Indtil nu har browseren kun bedt serveren om en side. Nu tilføjer du en formular, så browseren også kan sende data tilbage til serveren.

### 10a. Start med en almindelig formular

Erstat indholdet inde i `<main>` med:

```html
<h1>Sig hej</h1>

<form>
  <label for="name">Hvad hedder du?</label>
  <input id="name" name="name" type="text" />
  <button type="submit">Send</button>
</form>
```

`label` beskriver feltet for brugeren, og `for="name"` forbinder den med inputfeltets `id="name"`. Attributten `name="name"` bestemmer nøglen, som feltets værdi sendes med.

#### Test trin 10a

Genindlæs browseren. Formularen skal være synlig. Skriv et navn og tryk på **Send**.

Se på adresselinjen og Network-panelet. Browseren sender som standard et **GET-request** til den aktuelle adresse. Du vil derfor typisk se noget i stil med `/?name=Ada`. Delen efter `?` kaldes en query string.

> **Fagligt kort:** En formular uden `method` bruger `GET` som standard. En formular uden `action` sender til den aktuelle URL. Det er praktisk ved søgninger, men ikke det flow vi vil bruge til chat- eller formularinput i denne øvelse.

### 10b. Vælg HTTP-metoden `POST`

Ret kun formens åbnende tag til:

```html
<form method="POST">
```

#### Test trin 10b

Indsend et navn igen. Nu skal du få `Cannot POST /`, fordi browseren sender et POST-request til den aktuelle adresse, men serveren endnu ikke har en POST-route til `/`.

I Network-panelet kan du se, at feltet `name` nu ligger under requestets **Payload** eller **Form Data** i stedet for i adresselinjen.

### 10c. Vælg routen med `action`

Ret formens åbnende tag en sidste gang:

```html
<form method="POST" action="/submit">
```

`action="/submit"` fortæller browseren, hvilken route formularen skal sende sit POST-request til.

#### Test trin 10c

Indsend formularen. Du skal få `Cannot POST /submit`. Det er forventet: Formularen sender nu præcis det request, vi ønsker, men serveren har endnu ingen route, som kan håndtere det.

Find `POST /submit` i Network-panelet. Under **Payload** eller **Form Data** kan du se feltet `name` og den indtastede værdi.

---

## 11. Gør formulardata tilgængelige på serveren

I trin 10 endte formularens åbningstag sådan her:

```html
<form method="POST" action="/submit">
```

Nu skal serveren have en route, der matcher **både** HTTP-metoden og stien:

| I formularen | På serveren | Betydning |
| --- | --- | --- |
| `method="POST"` | `app.post(...)` | Begge siger, at det er et POST-request. |
| `action="/submit"` | `app.post("/submit", ...)` | Begge peger på den samme route. |
| `name="name"` | `request.body.name` | Samme navn bruges til at hente feltets værdi. |

Hvis `method` og `app.post(...)` ikke matcher, eller hvis `action` og routens sti er forskellige, finder Express ikke den rigtige route. Det er netop derfor, du så `Cannot POST /submit` i trin 10c.

Tilføj denne middleware efter EJS-konfigurationen og **før dine routes**:

```js
app.use(express.urlencoded({ extended: true }));
```

Middleware-funktionen læser data fra HTML-formularer og lægger dem i `request.body`.

> **Fagligt kort:** En HTML-formular med `method="POST"` sender sine felter i HTTP-requestets body. `express.urlencoded(...)` er middleware: kode som Express kører før din route, så formularens data bliver omdannet til et JavaScript-objekt som `request.body`.

Tilføj derefter den matchende route før `app.listen()`:

```js
app.post("/submit", (request, response) => {
  console.log(request.body);
  response.send("Serveren har modtaget formularen.");
});
```

### Test trin 11

Gå tilbage til `http://localhost:3000`, indsend formularen igen, og undersøg:

1. Browseren viser teksten “Serveren har modtaget formularen.”
2. Terminalen viser et objekt i stil med `{ name: 'Ada' }`.

Prøv midlertidigt at udkommentere `express.urlencoded(...)`, og indsend igen. Hvad bliver `request.body` nu? Fjern kommentaren bagefter.

---

## 12. Send navnet til EJS

Serveren kan nu modtage og læse formularens data. I stedet for at sende en simpel tekst tilbage skal POST-routen nu rendere den samme EJS-template med de modtagne data.

Ret POST-routen, så den renderer templaten og sender navnet med:

```js
app.post("/submit", (request, response) => {
  console.log("request.body:", request.body);

  const name = request.body.name;

  response.render("index", { name });
});
```

Objektet `{ name }` er en kort skrivemåde for `{ name: name }`. Objektets property `name` bliver tilgængelig som variablen `name` i `index.ejs`.

> **Fagligt kort:** `response.render("index", { name })` gør to ting: Den finder templaten `views/index.ejs`, og den giver templaten adgang til variablen `name`. I EJS svarer det til, at du kan skrive `name` direkte i templaten.

Vi logger ikke hele `request`-objektet, fordi det indeholder meget teknisk information. `request.body` er den del, der indeholder formularens data.

I næste trin kommer templaten til at bruge variablen `name`. Derfor skal GET-routen også sende en `name`-værdi, når siden vises, før formularen er indsendt:

```js
app.get("/", (request, response) => {
  response.render("index", { name: "" });
});
```

### Test trin 12

Indsend formularen med navnet `Ada`, og undersøg terminalen. Du skal se noget i stil med:

```text
request.body: { name: 'Ada' }
```

Find derefter sammenhængen i koden: `request.body.name` læses ind i variablen `name`, og `{ name }` sendes til `index.ejs`.

Siden vises igen, men navnet kan endnu ikke ses. Dataene er nået frem til templaten; næste trin bruger dem i HTML'en.

---

## 13. Vis en dynamisk hilsen

Tilføj dette efter formularen i `views/index.ejs`:

```html
<% if (name) { %>
  <p>Hej, <%= name %>! 👋</p>
<% } %>
```

EJS bruger forskellige tags:

- `<% ... %>` kører JavaScript-logik uden at skrive noget til HTML.
- `<%= ... %>` skriver en værdi i HTML'en og escaper værdien.

> **Fagligt kort:** Escaping betyder, at EJS behandler brugerens input som tekst i stedet for HTML. Derfor bliver `<strong>Ada</strong>` vist med vinklerne, frem for at browseren gør “Ada” fed. Brug som udgangspunkt altid `<%= ... %>` til data fra brugeren.

### Test trin 13

1. Besøg først `http://localhost:3000`. Formularen vises uden en hilsen.
2. Indsend dit navn. Nu vises den personlige hilsen.
3. Indsend et andet navn. Hilsenen skal ændre sig.
4. Indsend `<strong>Ada</strong>`. Teksten skal vises som tekst og ikke som fed HTML.

En tom indsendelse viser endnu ingen fejlbesked. Det løser du i næste øvelse med server-side validering.

---

## 14. Følg hele request/response-forløbet

Åbn DevTools → **Network**, ryd listen, og udfør derefter disse handlinger:

1. Genindlæs siden, og find `GET /`.
2. Indsend formularen, og find `POST /submit`.
3. Undersøg requestets **Form Data**.
4. Undersøg POST-requestets **Response**.

Find derefter de konkrete steder i din kode, som svarer til dette flow:

```text
method + action + name
          |
          v
POST /submit -> express.urlencoded() -> request.body
                                            |
                                            v
matchende POST-route -> response.render() -> EJS -> HTML-response
```

Forklar for en makker:

- Hvilken kode kører i browseren?
- Hvilken kode kører på serveren?
- Hvornår bliver den færdige HTML genereret?
- Hvorfor er dette server-side rendering?

---

## Tjekpunkt

Du er færdig, når:

- `GET /` renderer `views/index.ejs`.
- Formularen sender et POST-request til `/submit`.
- `express.urlencoded()` gør formularens data tilgængelige i `request.body`.
- POST-routen sender navnet til templaten med `response.render()`.
- EJS viser hilsenen med `<%= name %>`.
- Du kan finde både GET- og POST-requestet i Network-panelet.

Projektets struktur bør nu ligne:

```text
min-ejs-app/
├── node_modules/
├── views/
│   └── index.ejs
├── package-lock.json
├── package.json
└── server.js
```

## Fejlfinding

### `Cannot GET /`

Kontrollér, at du har en `app.get("/", ...)`-route, og at den står før `app.listen()`.

### `Cannot POST /submit`

Kontrollér, at formularens `action` og POST-routens path er ens, og at begge bruger POST.

### `request.body` er `undefined`

Kontrollér, at `app.use(express.urlencoded({ extended: true }))` står før POST-routen, og at inputfeltet har en `name`-attribut.

### EJS kan ikke finde templaten

Kontrollér, at filen hedder `views/index.ejs`, og at `app.set("view engine", "ejs")` er tilføjet.

### `name is not defined`

Kontrollér, at både GET- og POST-routen sender en `name`-værdi, hver gang de renderer `index.ejs`.

> Fortsæt derefter med øvelse 2, hvor du tilføjer validering, flere formularfelter og historik.
