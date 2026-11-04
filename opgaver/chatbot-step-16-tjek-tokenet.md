# Chatbot step 16: Backenden tjekker tokenet

## Kort fortalt

Efter step 15 sender chatbotten tokenet med i hvert request til dit API. Men backenden kigger ikke på det. Alle kan hente, oprette og slette tråde uden at logge ind.

I denne opgave laver du [step 16](https://github.com/bewildergeist/chatbot-react-postgres/pull/16) i chatbot-tutorialen, bare på dansk og i mindre trin. Du laver en middleware, `requireAuth`, som læser tokenet, tjekker det hos Supabase og svarer `401`, hvis det mangler eller er forkert. Til sidst sætter du den på alle routes.

Har du lavet øvelse 10 i [React Supabase Auth: Send tokenet med](react-supabase-auth-bearer-token.md), har du set tjekket før. Dér sendte du tokenet til Supabase og fik brugeren tilbage. Nu er det din backend, der gør det.

Løsningen ligger i de tre commits i step 16. Sidst i opgaven står, hvilken øvelse der svarer til hvilket commit.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under øvelsen. Den peger dig i den rigtige retning uden at give dig koden.
2. Åbn **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller når du vil sammenligne med din egen kode.

Spring aldrig en test over, heller ikke når den virker oplagt.

</details>

## Det bygger du

![Chatbotten sender et request med Authorization-headeren til Express. requireAuth kører før routen og spørger Supabase Auth med getUser(token). Er tokenet gyldigt, sætter den req.userId og kalder next(), og routen henter trådene i Postgres og svarer 200. Mangler tokenet, eller er det forkert, svarer requireAuth 401, og routen kører aldrig](assets/chatbot-step-16-requireauth.svg)

Venstre side er den samme som efter step 15. Det nye er `requireAuth` i midten af Express.

Det sker i koden:

```text
Før:          GET /api/threads -> route -> alle tråde, også uden token
Nu:           GET /api/threads -> requireAuth -> route -> tråde
requireAuth:  req.headers.authorization -> "Bearer <token>" -> getUser(token)
Gyldigt:      req.userId = user.id -> next() -> routen kører
Ugyldigt:     res.status(401) -> routen kører aldrig
```

## Kom i gang

Start backend og frontend, som du plejer. Log ind på `/login`.

Er du ikke færdig med step 15, så hent startpunktet i roden af chatbot-repoet, og commit det, før du ændrer noget:

```bash
npx degit --force bewildergeist/chatbot-react-postgres#pr-16-start
```

Startpunktet opretter tråde uden `user_id`. Sæt `TEST_USER_ID` ind i `backend/server.js` igen. Kodestykket står i [React Supabase Auth: Login før chatbotten](react-supabase-auth.md#fra-øvelserne-til-step-14).

---

## Øvelse 1: Hvem kan bruge dit API?

Her skal du ikke skrive kode. Du prøver at bruge dit API uden at være logget ind.

1. Åbn Thunder Client. Send `GET http://localhost:3000/api/threads` uden headers. Får du trådene?
2. Send `POST http://localhost:3000/api/threads` med denne body:

   ```json
   { "title": "Ikke logget ind", "content": "Hej fra Thunder Client" }
   ```

   Genindlæs chatbotten. Står tråden i sidebaren?
3. Svaret fra test 2 har både en `thread` og en `message`. Kopiér `id` fra `thread`. Send `DELETE http://localhost:3000/api/threads/<id>`. Er tråden væk i chatbotten?
4. Tilføj en header i Thunder Client: `Authorization` med værdien `Bearer hej`. Send `GET /api/threads` igen. Hvad svarer API'et?
5. Log ud i chatbotten, og gå direkte til `localhost:5173/chat/new`. Kan du se trådene?

Du skal have fundet tre ting:

- Alle kan læse, oprette og slette tråde. Det kræver ikke et token
- Et falsk token virker lige så godt som et rigtigt
- Backenden ved ikke, hvem der spørger. `POST /api/threads` bruger stadig `TEST_USER_ID`

De to første retter du i denne opgave. Den sidste retter du delvist: backenden finder brugerens id, men bruger det først i step 17.

---

## Øvelse 2: Din første route-middleware

> **Middleware:** en funktion, der kører mellem request og response. Du kender `express.json()` og `cors()`. Dem sætter du på alle routes med `app.use()`. En middleware kan også stå i én route, mellem stien og handleren: `app.get("/api/threads", requireAuth, async (req, res) => { ... })`. Express kalder dem fra venstre mod højre.

> **`next()`:** en middleware får tre parametre: `req`, `res` og `next`. Kalder den `next()`, kører Express det næste i rækken, her din route. Sender den et svar med `res.status(...).json(...)`, stopper requestet. Gør den ingen af delene, hænger requestet.

Du starter med en middleware, der kun logger headeren og sender videre. Du lavede samme `console.log` i step 15. Nu flytter den ud i sin egen funktion.

**Opret** `backend/auth.js`:

```js
export async function requireAuth(req, res, next) {
  // TODO: Log req.headers.authorization.

  // TODO: Kald next(), så routen kører.
}
```

**Brug den** i `backend/server.js`. Importér `requireAuth` fra `./auth.js`. Sæt den ind i `GET /api/threads`:

```js
app.get("/api/threads", requireAuth, async (req, res) => {
```

<details>
<summary>Se løsningsforslag</summary>

```js
export async function requireAuth(req, res, next) {
  console.log(req.headers.authorization);
  next();
}
```

```js
import express from "express";
import cors from "cors";
import sql from "./db.js";
import { requireAuth } from "./auth.js";
```

</details>

#### Test øvelse 2

1. Log ind, og genindlæs chatbotten. Står `Bearer eyJ...` i terminalen, hvor backenden kører?
2. Send `GET /api/threads` fra Thunder Client uden headers. Hvad bliver logget? Får du stadig trådene?
3. Send `GET /api/threads/<id>` fra Thunder Client. Brug et id fra en af dine tråde. Bliver der logget noget? Hvorfor ikke?
4. Fjern `next();`, og genindlæs chatbotten. Kig på requestet til `threads` i Network-fanen. Hvad er status? Sæt `next();` ind igen.

---

## Øvelse 3: Afvis requests uden token

Nu skal `requireAuth` stoppe requests, der ikke har et token. Når du er færdig med øvelse 4, er `requireAuth` tre tjek i træk. Hvert tjek kan stoppe requestet med `401`. Kun et request, der kommer igennem alle tre, når frem til routen.

![requireAuth er tre tjek i træk. 1: er der en Authorization-header? Bygges i øvelse 3, trin 1, og stopper et request uden header. 2: står der et token efter Bearer? Bygges i øvelse 3, trin 2, og stopper Authorization: hej. 3: godkender Supabase tokenet med getUser(token)? Bygges i øvelse 4, trin 2, og stopper Bearer hej og et token med ét ændret bogstav. Svaret nej giver 401. Kun et ægte token kommer igennem til next() og routen, med req.userId sat](assets/chatbot-step-16-tre-tjek.svg)

I denne øvelse bygger du de to første tjek.

> **401 Unauthorized:** betyder "du skal logge ind". Requestet mangler et token, eller tokenet er ikke gyldigt. Du kender `400` og `404` fra dine routes. Der er også `403 Forbidden`, som betyder "du er logget ind, men må ikke det her". Den bruger du ikke endnu.

### Trin 1: Mangler headeren?

Udvid `requireAuth`:

- Gem `req.headers.authorization` i en variabel, `authHeader`. Fjern din `console.log`
- Hvis der ikke er en `authHeader`: svar `401` med `{ error: "Authentication required" }`, og stop med `return`
- Ellers: kald `next()`

<details>
<summary>Se løsningsforslag</summary>

```js
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authentication required" });
  }

  next();
}
```

</details>

#### Test trin 1

1. Send `GET /api/threads` fra Thunder Client uden headers. Får du `401` og din fejlbesked?
2. Genindlæs chatbotten, mens du er logget ind. Virker den som før?
3. Log ud, og gå til `localhost:5173/chat/new`. Hvad ser du? Kig på requestet til `threads` i Network-fanen.

### Trin 2: Find tokenet

Headeren ser sådan ud: `Bearer eyJhbGc...`. Til Supabase skal du kun bruge selve tokenet.

- Del `authHeader` ved mellemrummet med `.split(" ")`, og gem den anden del i en variabel, `token`
- Hvis der ikke er et `token`: svar `401` med `{ error: "Expected: Bearer <token>" }`

<details>
<summary>Hint</summary>

```text
"Bearer eyJhbGc".split(" ")   ->   ["Bearer", "eyJhbGc"]
                                       [0]        [1]
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // "Bearer eyJ..." -> "eyJ..."
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Expected: Bearer <token>" });
  }

  next();
}
```

</details>

#### Test trin 2

1. Send `GET /api/threads` fra Thunder Client med headeren `Authorization: hej`. Får du `401`?
2. Ret headeren til `Authorization: Bearer hej`. Hvad svarer API'et nu?

`requireAuth` tjekker kun, at der står noget efter `Bearer`. Den tjekker ikke, om det er et rigtigt token. Det gør du i næste øvelse.

---

## Øvelse 4: Tjek tokenet hos Supabase

Kun Supabase kan se, om et token er ægte. Det er Supabase, der har lavet signaturen. Backenden skal derfor have sin egen Supabase-klient, ligesom frontenden har.

### Trin 1: Supabase i backenden

> **To `package.json`:** frontend og backend er to forskellige programmer med hver deres `package.json` og `node_modules`. Supabase er installeret i frontenden, men backenden kan ikke bruge den derfra.

1. Gå ind i `backend/` i terminalen, og kør `npm install @supabase/supabase-js`.
2. Åbn `frontend/.env`. Kopiér URL og key til `backend/.env`, men uden `VITE_`:

   ```bash
   SUPABASE_URL="https://xxxxx.supabase.co"
   SUPABASE_ANON_KEY="din-anon-key"
   ```

3. Tilføj de to navne i `backend/.env.example` med en tom værdi eller en pladsholder, så andre kan se, hvad der mangler.
4. Stop backenden, og start den igen med `npm run dev`. Den læser kun `.env`, når den starter.

> **Uden `VITE_`:** `VITE_` er Vites måde at vælge, hvad der må komme med i browseren. Backenden kører i Node og læser `.env` med `process.env`, ligesom `DATABASE_URL` i `db.js`.

**Opret Supabase-klienten** øverst i `backend/auth.js`. Det er samme kode som i `frontend/app/lib/supabase.js`, men med `process.env`:

```js
import { createClient } from "@supabase/supabase-js";

// TODO: Hent SUPABASE_URL og SUPABASE_ANON_KEY fra process.env.

// TODO: Kast en fejl, hvis en af dem mangler.

// TODO: Opret klienten med createClient(), og eksportér den som supabase.

export async function requireAuth(req, res, next) {
  // ... som før
}
```

<details>
<summary>Se løsningsforslag</summary>

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend/.env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

</details>

#### Test trin 1

1. Starter backenden uden fejl? Står `@supabase/supabase-js` under `dependencies` i `backend/package.json`?
2. Sæt `#` foran `SUPABASE_URL` i `backend/.env`, og genstart backenden. Står din fejlbesked i terminalen? Fjern `#` igen.

### Trin 2: Tjek tokenet

> **`getUser(token)`:** sender tokenet til Supabase Auth, som tjekker signaturen og svarer med brugeren. Det er samme request, som du byggede med `fetch` i øvelse 10. I frontenden kalder du `getUser()` uden argument, og så læser den tokenet fra localStorage. Backenden har ingen localStorage. Derfor giver du den tokenet fra headeren.

Udvid `requireAuth`, så den tjekker tokenet, før den kalder `next()`:

- Kald `supabase.auth.getUser(token)`, og gem `data` og `error`
- Hvis der er en `error`, eller `data.user` mangler: svar `401` med `{ error: "Invalid or expired token" }`
- Ellers: gem brugerens id i `req.userId`, og kald `next()`

Tilføj midlertidigt `console.log(req.userId);` øverst i `GET /api/threads` i `server.js`.

> **`req.userId`:** `req` er det samme objekt i hele requestet. Det, du sætter på `req` i en middleware, kan routen læse bagefter. Det er sådan, `express.json()` giver dig `req.body`.

<details>
<summary>Hint</summary>

```text
const { data, error } = await supabase.auth.getUser(token)

if (error || !data.user) {
  return ... 401
}

req.userId = data.user.id
next()
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend/.env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Kører før routen. Kun requests med et gyldigt token kommer videre
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // "Bearer eyJ..." -> "eyJ..."
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Expected: Bearer <token>" });
  }

  // Supabase tjekker signaturen og svarer med brugeren
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Routen kan nu se, hvem der spørger
  req.userId = data.user.id;
  next();
}
```

</details>

#### Test trin 2

1. Send `GET /api/threads` fra Thunder Client med `Authorization: Bearer hej`. Får du `401` nu?
2. Genindlæs chatbotten, mens du er logget ind. Står et id i terminalen? Find din bruger i Supabase under Authentication → Users. Er det samme id?
3. Kopiér `access_token` fra Local Storage, og indsæt det efter `Bearer` i Thunder Client. Får du trådene? Står dit id i terminalen igen?
4. Ret ét bogstav midt i tokenet i Thunder Client, og send igen. Hvad svarer API'et?
5. Log ud, og log ind som en anden bruger. Står der et andet id i terminalen? Ser du de samme tråde?
6. Fjern din `console.log`.

Begge brugere ser stadig de samme tråde. Backenden ved nu, hvem der spørger, men SQL'en bruger det ikke. Det retter du i step 17.

---

## Øvelse 5: Beskyt alle routes

**Prøv det først:** send `GET /api/threads/<id>` fra Thunder Client uden headers. Brug et id fra en af dine tråde. Du får tråden. Kun `GET /api/threads` er beskyttet indtil nu.

Reglen er den samme hver gang:

```js
// Før
app.get("/api/threads/:id", async (req, res) => {

// Nu
app.get("/api/threads/:id", requireAuth, async (req, res) => {
```

`GET /` skal ikke have `requireAuth`. Den viser kun, at serveren kører.

### Trin 1: GET-routes

Sæt `requireAuth` på de to andre GET-routes: `GET /api/threads/:id` og `GET /api/threads/:id/messages`.

#### Test trin 1

1. Send de to requests fra Thunder Client uden token. Får du `401`?
2. Åbn en tråd i chatbotten. Virker den?

### Trin 2: POST, PATCH og DELETE

Sæt `requireAuth` på de fire sidste routes:

- `POST /api/threads/:id/messages`
- `POST /api/threads`
- `PATCH /api/threads/:id`
- `DELETE /api/threads/:id`

#### Test trin 2

1. Gentag test 2 og 3 fra øvelse 1 i Thunder Client. Får du `401` begge gange?
2. Log ind i chatbotten. Opret en tråd, send en besked, ret titlen, og slet tråden. Virker det hele?
3. Åbn `http://localhost:3000/` i browseren. Kan du se svaret uden at være logget ind?
4. Søg efter `requireAuth` i `server.js`. Hvor mange steder står den? Der skal være én import og syv routes.
5. Du kunne også skrive `app.use(requireAuth);` én gang i stedet for syv. Hvor i filen skulle linjen stå, for at `GET /` stadig er offentlig?

---

## Fra øvelserne til step 16

| Øvelse | Step 16 | Commit |
| --- | --- | --- |
| Øvelse 2 og 3 | Delopgave 2: requireAuth, uden Supabase endnu | [`5c9783a`](https://github.com/bewildergeist/chatbot-react-postgres/pull/16/commits/5c9783a5fad17c5ba28b7fb0c8be99a45420fa02) |
| Øvelse 4, trin 1 | Delopgave 1: Install @supabase/supabase-js in backend | [`6754475`](https://github.com/bewildergeist/chatbot-react-postgres/pull/16/commits/67544759fbcb9596c79a9ee9aa0253fdc453476d) |
| Øvelse 4, trin 1 og 2 | Delopgave 2: Create Supabase client and requireAuth middleware | [`5c9783a`](https://github.com/bewildergeist/chatbot-react-postgres/pull/16/commits/5c9783a5fad17c5ba28b7fb0c8be99a45420fa02) |
| Øvelse 5 | Delopgave 3: Protect all API endpoints with authentication | [`cd40d0b`](https://github.com/bewildergeist/chatbot-react-postgres/pull/16/commits/cd40d0b250841d5dceb1cdcb2f8d2ef5be1da03e) |

Tutorialen installerer Supabase først og bygger hele `requireAuth` på én gang. Her bygger du middlewaren først og tilføjer Supabase bagefter, så du kan teste hvert trin. Koden ender med at gøre det samme.

Commit 2 pakker også `requireAuth` ind i `try`/`catch`, ligesom routes i `server.js`. Det er en ekstra sikkerhed. `getUser()` svarer med `error` i stedet for at kaste en fejl, så din kode virker også uden. Commit 3 retter kommentaren over hver route, så der står, at den kræver login.

## Hvad mangler?

Dit API afviser nu alle, der ikke har et gyldigt token. Men der mangler stadig noget:

- Alle brugere ser alle tråde. Du så det i øvelse 4, da du loggede ind som en anden bruger
- `POST /api/threads` giver stadig hver ny tråd `TEST_USER_ID` som ejer
- Går du til `/chat/new` uden at være logget ind, får du en fejlside. Hvad burde der ske i stedet?

Backenden kender brugerens id i `req.userId`. I [step 17](chatbot-step-17-kun-egne-traade.md) bruger du det i SQL'en, så hver bruger kun ser og ændrer sine egne tråde. Tutorialen laver [step 18](chatbot-step-18-send-til-login.md) før step 17. Den sender dig til `/login`, når API'et svarer `401`.
