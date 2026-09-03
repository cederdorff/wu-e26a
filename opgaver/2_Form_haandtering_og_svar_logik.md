# Øvelse 2: Formhåndtering, validering og svarlogik

Byg videre på øvelse 1. I udvider hilsenen med flere felter, validerer input og gemmer gyldige indsendelser i et array af objekter.

Målet er ikke at lave en perfekt profilformular. Målet er at kunne forklare, hvordan data går fra en formular til `request.body`, videre gennem JavaScript-logik og tilbage til en EJS-template.

## 1. Gør dataene ens hver gang

En template bør altid få de variabler, den bruger. Lav derfor et array og en funktion, der samler dataene til templaten. Tilføj øverst i `server.js`, efter `app` er oprettet:

```js
const greetings = [];

function renderIndex(response, { name = "", topic = "", error = "", reply = "" } = {}) {
  response.render("index", { name, topic, error, reply, greetings });
}
```

Ret din GET-route:

```js
app.get("/", (request, response) => {
  renderIndex(response);
});
```

Her gemmes data kun i serverens hukommelse. Genstarter I serveren, bliver arrayet tomt. Det er forventet på nuværende tidspunkt.

## 2. Udvid formularen

Erstat formularen i `views/index.ejs` med denne:

```html
<form method="POST" action="/submit">
  <p>
    <label for="name">Hvad hedder du?</label>
    <input id="name" name="name" type="text" />
  </p>

  <p>
    <label for="topic">Hvad vil du tale om?</label>
    <select id="topic" name="topic">
      <option value="">Vælg et emne</option>
      <option value="studie">Studiet</option>
      <option value="weekend">Weekenden</option>
      <option value="andet">Noget andet</option>
    </select>
  </p>

  <button type="submit">Send</button>
</form>
```

Bemærk, at browseren sender `name` og `topic`, fordi det er felternes `name`-attributter. `label` og `id` forbedrer tilgængeligheden, men bestemmer ikke navnet i `request.body`.

## 3. Validér og vælg et svar

Erstat din POST-route med følgende. Læs den først: Hvilken kode kører kun ved ugyldigt input, og hvilken kode kører kun ved gyldigt input?

```js
app.post("/submit", (request, response) => {
  const name = typeof request.body.name === "string" ? request.body.name.trim() : "";
  const topic = typeof request.body.topic === "string" ? request.body.topic : "";

  if (!name) {
    return renderIndex(response, {
      topic,
      error: "Skriv dit navn, før du sender formularen."
    });
  }

  const replies = {
    studie: `Hej ${name}! Hvad arbejder du på i dag?`,
    weekend: `Hej ${name}! Hvad håber du at lave i weekenden?`,
    andet: `Hej ${name}! Fortæl mig mere.`
  };

  if (!replies[topic]) {
    return renderIndex(response, {
      name,
      error: "Vælg et emne, før du sender formularen."
    });
  }

  const greeting = { name, topic, createdAt: new Date().toLocaleTimeString("da-DK") };
  greetings.push(greeting);

  renderIndex(response, { name, topic, reply: replies[topic] });
});
```

`replies` er et objekt: emnenavnet er en nøgle, og teksten er værdien. `greetings` er et array af objekter. I får dermed både en opslagstabel til svarlogik og strukturerede data til historikken.

## 4. Vis fejl, svar og historik

Tilføj dette efter formularen i `index.ejs`:

```html
<% if (error) { %>
  <p role="alert"><%= error %></p>
<% } %>

<% if (reply) { %>
  <h2>Serverens svar</h2>
  <p><%= reply %></p>
<% } %>

<h2>Tidligere indsendelser</h2>
<% if (greetings.length === 0) { %>
  <p>Der er endnu ingen indsendelser.</p>
<% } else { %>
  <ul>
    <% greetings.forEach((greeting) => { %>
      <li>
        <%= greeting.name %> valgte <%= greeting.topic %> kl. <%= greeting.createdAt %>
      </li>
    <% }); %>
  </ul>
<% } %>
```

## 5. Test systematisk

| Input | Forventet resultat |
| --- | --- |
| Tomt navn | Fejl, ingen ny post i historikken |
| Navn uden emne | Fejl, ingen ny post i historikken |
| Gyldigt navn + `studie` | Relevant svar og én ny post |
| Flere gyldige indsendelser | Historikken indeholder flere objekter |
| Genstart af serveren | Historikken nulstilles |

## Videre, hvis du når det

- Tilføj et fjerde emne og et svar i `replies`.
- Bevar det indtastede navn og valgte emne, når der opstår en fejl, ved at sætte `value="<%= name %>"` og bruge betinget `selected` på options.
- Tilføj en `POST /ryd-historik`-route og en separat formular, der tømmer arrayet.

## Tjekpunkt

Du er færdig, når appen afviser begge manglende felter, bruger flere felter i sin svarlogik, og viser en historik baseret på et array af objekter. Alle værdier (`name`, `topic`, `error`, `reply` og `greetings`) skal være tilgængelige, hver gang `index.ejs` renderes.
