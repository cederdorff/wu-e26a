# Øvelse 3: Server-renderet chatbot med regelbaseret svarlogik

Nu bruger I byggestenene fra [øvelse 1](express-ejs-formular.md) og [øvelse 2](express-ejs-formhaandtering-svarlogik.md) til en lille chatbot. Den er ikke AI: den vælger svar ud fra regler, arrays og objekter. Hver gang brugeren sender formularen, returnerer serveren en ny færdig HTML-side med samtalehistorikken.

## 1. Start med en ren chattilstand

I kan fortsætte i samme projekt eller oprette en kopi. Tilpas `server.js`, så den indeholder en chat-historik og svarregler:

```js
import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const messages = [];

const responseRules = [
  {
    keywords: ["hej", "hello", "hi"],
    answers: ["Hej! Hvad kan jeg hjælpe med?", "Hej med dig!"]
  },
  {
    keywords: ["ejs", "express", "node"],
    answers: ["Det er dagens tema. Hvad vil du vide om det?"]
  },
  {
    keywords: ["hjælp", "help"],
    answers: ["Prøv at skrive hej eller spørg om EJS, Express eller Node."]
  },
  {
    keywords: ["farvel", "bye", "ses"],
    answers: ["Farvel — og god kodning!"]
  }
];

function renderChat(response, { error = "" } = {}) {
  response.render("index", { messages, error });
}
```

Tilføj derefter GET-routen og `app.listen()`:

```js
app.get("/", (request, response) => {
  renderChat(response);
});

app.listen(port, () => {
  console.log(`Serveren kører på http://localhost:${port}`);
});
```

## 2. Lav chattemplaten

Erstat indholdet i `views/index.ejs` med:

```html
<!doctype html>
<html lang="da">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Regelbaseret chatbot</title>
  </head>
  <body>
    <main>
      <h1>Min chatbot</h1>

      <section aria-label="Samtalehistorik">
        <% if (messages.length === 0) { %>
          <p>Start samtalen ved at skrive en besked.</p>
        <% } %>

        <% messages.forEach((message) => { %>
          <p>
            <strong><%= message.sender %>:</strong>
            <%= message.text %>
          </p>
        <% }); %>
      </section>

      <% if (error) { %>
        <p role="alert"><%= error %></p>
      <% } %>

      <form method="POST" action="/chat">
        <label for="message">Din besked</label>
        <input id="message" name="message" type="text" />
        <button type="submit">Send</button>
      </form>
    </main>
  </body>
</html>
```

Brug `<%= message.text %>`, ikke `<%- message.text %>`. `<%=` escaper HTML, så en indsendt tekst som `<b>hej</b>` vises som tekst frem for at blive tolket som HTML.

## 3. Skriv svarfunktionen

Tilføj funktionen før dine routes:

```js
function findReply(message) {
  const normalizedMessage = message.toLowerCase();

  for (const rule of responseRules) {
    const hasMatch = rule.keywords.some((keyword) =>
      normalizedMessage.includes(keyword)
    );

    if (hasMatch) {
      const index = Math.floor(Math.random() * rule.answers.length);
      return rule.answers[index];
    }
  }

  return "Det forstod jeg ikke endnu. Prøv at skrive 'hjælp'.";
}
```

Forklar med egne ord forskellen på `some()` og `forEach()`: Hvorfor passer `some()` godt, når I kun vil vide, om mindst ét nøgleord matcher?

## 4. Modtag og validér beskeden

Tilføj denne POST-route:

```js
app.post("/chat", (request, response) => {
  const message = typeof request.body.message === "string" ? request.body.message.trim() : "";

  if (!message) {
    return renderChat(response, { error: "Skriv en besked, før du sender." });
  }

  if (message.length > 280) {
    return renderChat(response, { error: "Beskeden må højst være 280 tegn." });
  }

  const reply = findReply(message);
  messages.push({ sender: "Dig", text: message });
  messages.push({ sender: "Bot", text: reply });

  renderChat(response);
});
```

Test mindst: tom besked, `hej`, et fagligt nøgleord, en ukendt besked og en besked på over 280 tegn.

## 5. Validering, sanitering og escaping er ikke det samme

I har allerede valideret: tomme og for lange beskeder afvises. I har også normaliseret input med `trim()`. Hvis I vil rense uønskede kontroltegn, kan I gøre det i en separat funktion:

```js
function sanitizeMessage(input) {
  return input.replace(/[\u0000-\u001F\u007F]/g, "");
}
```

Brug den efter typekontrollen og før valideringen:

```js
const rawMessage = typeof request.body.message === "string" ? request.body.message : "";
const message = sanitizeMessage(rawMessage).trim();
```

Det er vigtigt at holde begreberne adskilt:

- **Validering** afgør, om data må bruges (fx ikke tom og højst 280 tegn).
- **Sanitering/normalisering** ændrer data til et ønsket format (fx fjerner kontroltegn og yderste mellemrum).
- **EJS-escaping** (`<%= ... %>`) gør output sikkert i HTML-kontekst. Det er ikke det samme som at validere eller rense input.

Undgå selv at skrive “XSS-filtre”, der forsøger at fjerne ord som `script` eller tegn som `<`. Brug escaped output konsekvent, og vælg ved en rigtig applikation en gennemprøvet sanitizer, hvis I bevidst vil tillade HTML.

## 6. Se POST-requestet i Network

Åbn DevTools → **Network** og send en besked.

1. Find `POST /chat` og se formularens felt under *Payload*.
2. Se at response er HTML.
3. Genindlæs siden og se `GET /`. Historikken er der stadig, så længe den samme serverproces kører, fordi den ligger i `messages`-arrayet.
4. Genstart serveren og forklar, hvorfor historikken forsvinder.

## Ekstra udfordringer

- Tilføj en regel med flere mulige svar.
- Tilføj en `POST /ryd-chat`-route og en formular med en “Ryd chat”-knap.
- Giv hvert message-objekt et tidspunkt og vis det i templaten.
- Undersøg `request.query` med en GET-route som `/debug?name=Ada` og `request.params` med `/debug/:name`. Sammenlign dem med `request.body` fra chatformularen.

## Tjekpunkt

Din chatbot er færdig, når den viser samtalehistorik, modtager en POST-besked, vælger et regelbaseret svar og ikke crasher på tomt eller ugyldigt input. Du skal kunne pege på præcis, hvor requesten modtages, hvor svaret vælges, og hvor EJS genererer HTML.
