# React Supabase Auth: Send tokenet med

## Kort fortalt

Du fortsætter i `react-supabase-auth`. På `/profile` henter `getUser()` brugeren fra Supabase. Nu bygger du det request selv: du henter tokenet, sender det med i en header og læser svaret. Bagefter samler du det i én funktion, `apiFetch`, som alle sider kan bruge.

Det er det samme, du skal lave i [step 15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15) i chatbot-tutorialen. Forskellen er, hvor tokenet skal hen. Øveprojektet har ingen backend, så du sender det til Supabase Auth' eget API. I chatbotten sender du det til dit eget API. Sidst i opgaven står, hvilken øvelse der svarer til hvilken delopgave i step 15.

Løsningen ligger i [react-supabase-auth](https://github.com/cederdorff/react-supabase-auth) med én branch pr. øvelse. Branchen viser koden, når hele øvelsen er løst.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under øvelsen. Den peger dig i den rigtige retning uden at give dig koden.
2. Åbn **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller når du vil sammenligne med din egen kode.

Spring aldrig en test over, heller ikke når den virker oplagt.

</details>

## Det bygger du

```text
Før:       /profile -> clientLoader -> getUser()                 -> { user }
Nu:        /profile -> clientLoader -> apiFetch("/auth/v1/user") -> { user }
apiFetch:  getSession() -> access_token -> fetch med Authorization: Bearer <token>
```

## Kom i gang

Du fortsætter i dit eget `react-supabase-auth`-repo. Start `npm run dev`, og log ind. Du skal kunne se din profil på `/profile`.

Nåede du ikke øvelse 8 og 9, så commit det, du har. Hent derefter løsningen til øvelse 9 i roden af repoet:

```bash
npx degit --force cederdorff/react-supabase-auth#ovelse-09-logout
npm install
```

Din `.env` bliver liggende, fordi den ikke er en del af repoet. Har du slet ikke projektet, så følg øvelse 1 og 2 i [React Supabase Auth: Login før chatbotten](react-supabase-auth.md), men brug kommandoen ovenfor.

---

## Øvelse 10: Send tokenet selv

> **Headers:** Et request kan have headers. Det er ekstra information ud over URL og body. Du kender `Content-Type: application/json` fra, når du sender JSON. Standardstedet til et token er headeren `Authorization` i formatet `Bearer <token>`. Bearer betyder "ihændehaver": den, der har tokenet, får adgang.

Du bygger det i tre trin og tester efter hvert trin. Al koden står i `clientLoader` i `app/routes/profile.jsx`. Lad `getUser()` stå indtil trin 3.

### Trin 1: Hent tokenet

`getUser()` sender tokenet til Supabase. Men hvor kommer tokenet fra? Hent det selv med `supabase.auth.getSession()` øverst i `clientLoader`, og log det.

```js
export async function clientLoader() {
  // TODO: Hent session med supabase.auth.getSession().
  // TODO: Log session?.access_token.

  // getUser() og resten som før
}
```

> **`getSession()`:** svarer med `{ data: { session } }`. Du kan hente `session` direkte ud med `const { data: { session } } = ...`. Det er samme destructuring som `const { error } = ...` i øvelse 4, bare et lag dybere. Er du ikke logget ind, er `session` `null`. Derfor står der `?.`.

<details>
<summary>Se løsningsforslag</summary>

```js
export async function clientLoader() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log(session?.access_token);

  // getUser() sender tokenet til Supabase, som tjekker signaturen
  const { data, error } = await supabase.auth.getUser();

  // ... resten som før
}
```

</details>

#### Test trin 1

1. Log ind, og gå til `/profile`. Står der en lang tekst i Console, der starter med `eyJ`?
2. Åbn Application → Local Storage. Er det den samme tekst, som står i `access_token`?
3. Åbn Network-fanen, og skriv `auth` i filteret. Genindlæs `/profile`. Der er et request til `user` fra `getUser()`, men intet fra `getSession()`. `getSession()` læser bare tokenet fra localStorage.
4. Åbn `/profile` i et inkognitovindue. Hvad bliver logget?

### Trin 2: Kald Supabase med fetch

Nu sender du selv det request, som `getUser()` sender. Adressen er `/auth/v1/user` på din Supabase-URL. Start uden headers. Indsæt koden lige under din `console.log` fra trin 1:

```js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const response = await fetch(`${supabaseUrl}/auth/v1/user`);
console.log(response.status, await response.json());
```

#### Test trin 2

Du tilføjer én header ad gangen og genindlæser `/profile` efter hver.

1. Uden headers: læs status og besked i Console. Supabase ved ikke, hvilket projekt requestet hører til.
2. Tilføj `apikey` som andet argument til `fetch`: `{ headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY } }`. Hvad siger beskeden nu? Supabase kender projektet, men ikke brugeren.
3. Tilføj `Authorization` i samme objekt: `` Authorization: `Bearer ${session?.access_token}` ``. Nu skal du få status 200 og din bruger. Står din email der?
4. Find de to requests til `user` i Network-fanen. Det ene er dit, det andet er fra `getUser()`. Kig under Request Headers. Sender `getUser()` også `apikey` og `Authorization`?
5. Ret ét bogstav midt i `access_token` i Local Storage, og genindlæs. Hvad er status nu? Log ind igen bagefter.

> **`apikey` og `Authorization`:** `apikey` fortæller Supabase, hvilket projekt requestet hører til. Den er den samme for alle brugere og står i din `.env`. `Authorization` fortæller, hvilken bruger der spørger. Den er forskellig for hver bruger og ligger i localStorage. Supabase tjekker tokenets signatur og svarer med brugeren. Det er det, `getUser()` gør.

### Trin 3: Brug dit eget svar

- Fjern `getUser()`, og brug svaret fra dit eget `fetch` i stedet
- Hvis `response.ok` er `false`: `redirect("/login")`
- Ellers: hent brugeren med `await response.json()`, og returnér `{ user }`
- Fjern dine `console.log`

Componenten skal du ikke ændre. Supabase svarer med det samme brugerobjekt, som `getUser()` gav dig.

<details>
<summary>Hint</summary>

`response.ok` er `true`, når status er mellem 200 og 299.

```text
if (!response.ok) {
  return redirect(...)
}

const user = await response.json()
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
export async function clientLoader() {
  // getSession() læser tokenet fra localStorage. Den spørger ikke Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Samme request, som getUser() sender
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  // Supabase afviser tokenet, eller der er intet token
  if (!response.ok) {
    return redirect("/login");
  }

  const user = await response.json();
  return { user };
}
```

</details>

#### Test trin 3

1. Log ind. `/profile` skal vise din email, dit id og "Last sign in" som før.
2. Kig i Network-fanen. Nu er der kun ét request til `user`, og det er dit eget.
3. Gå til `/profile` i inkognitovinduet. Du skal blive sendt til `/login`.
4. Ret ét bogstav i tokenet i Local Storage igen, og genindlæs. Du skal blive sendt til `/login`. Log ind igen.

---

## Øvelse 11: apiFetch

**Kig på det først:** din `clientLoader` ved nu, hvad Supabase-URL'en er, hvor anon key ligger, hvordan man henter tokenet, og hvordan headeren skal se ud. Det skal hver side vide, der kalder API'et. I chatbotten er der fire filer med `fetch`. Du samler det ét sted.

> **Wrapper-funktion:** en funktion, der kalder en anden funktion og lægger noget til. `apiFetch(path, options)` tager kun stien, fx `/auth/v1/user`, og de samme options som `fetch()`. Den bygger URL'en, henter tokenet, sætter headers på og kalder `fetch()`. Det er DRY: det, der gentages, står ét sted.

**1. Opret** `app/lib/apiFetch.js`:

```js
import { supabase } from "./supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function apiFetch(path, options = {}) {
  // TODO: Hent session med getSession(), og gem access_token i en variabel, token.

  // TODO: Lav et headers-objekt med headers fra options og apikey.

  // TODO: Sæt Authorization på headers, men kun hvis der er et token.

  // TODO: Kald fetch() med supabaseUrl + path og options med dine headers. Returnér svaret.
}
```

**2. Brug den** i `clientLoader` i `profile.jsx`. Erstat `getSession()`, URL'en og dit `fetch` med ét kald: `apiFetch("/auth/v1/user")`. Importér `apiFetch` fra `../lib/apiFetch`.

<details>
<summary>Hint</summary>

```text
const headers = {
  ...options.headers,
  apikey: ...
}

if (token) {
  headers.Authorization = ...
}

return fetch(..., { ...options, headers })
```

`...options.headers` beholder de headers, som den, der kalder `apiFetch`, selv har sat, fx `Content-Type`. `{ ...options, headers }` beholder `method` og `body` fra options og bruger dine headers.

</details>

<details>
<summary>Se løsningsforslag</summary>

`app/lib/apiFetch.js`:

```js
import { supabase } from "./supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ligesom fetch(), men med URL, apikey og token sat på
export async function apiFetch(path, options = {}) {
  // getSession() læser tokenet fra localStorage. Er du logget ud, er session null
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  // Behold de headers, der blev sendt med, og tilføj apikey
  const headers = {
    ...options.headers,
    apikey: supabaseAnonKey,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${supabaseUrl}${path}`, { ...options, headers });
}
```

`app/routes/profile.jsx`:

```js
import { Form, Link, redirect, useLoaderData } from "react-router";
import { supabase } from "../lib/supabase";
import { apiFetch } from "../lib/apiFetch";

export async function clientLoader() {
  // apiFetch sender tokenet med i Authorization-headeren
  const response = await apiFetch("/auth/v1/user");

  if (!response.ok) {
    return redirect("/login");
  }

  const user = await response.json();
  return { user };
}
```

`supabase` skal stadig importeres i `profile.jsx`, fordi `clientAction` bruger den til `signOut()`.

</details>

#### Test øvelse 11

1. Log ind. `/profile` skal virke som før.
2. Find requestet til `user` i Network-fanen. Står `apikey` og `Authorization` under Request Headers?
3. Gå til `/profile` i inkognitovinduet. Står der en `Authorization`-header i requestet? Hvad svarer Supabase? Du skal blive sendt til `/login`.
4. Send en ekstra header med: `apiFetch("/auth/v1/user", { headers: { "Content-Type": "application/json" } })`. Står `Content-Type` i Request Headers sammen med `Authorization`?
5. Fjern `...options.headers` fra `apiFetch`, og genindlæs. Hvad mangler nu? Sæt den ind igen, og fjern den ekstra header i `profile.jsx`.

---

## Øvelse 12: Vis, hvem der er logget ind (bonus)

Forsiden viser altid "Create Account" og "Log In", også når du er logget ind. Vis din email og et link til `/profile` i stedet, når du er logget ind.

Brug `useState` og `useEffect` i `app/routes/home.jsx`:

- Gem emailen i state. Den starter som `null`
- I en `useEffect`: hent `session` med `getSession()`, og gem `session?.user.email` i state
- Er der en email: vis den og et link til `/profile`. Ellers: vis de to links som nu

```jsx
{email ? (
  // TODO: Vis "Logged in as" og emailen, og et link til /profile med className="btn-primary".
) : (
  // De to links fra før
)}
```

> **Hvorfor `useEffect`?** I chatbotten står emailen i `SidebarFooter`. Det er en component og ikke en route, så den kan ikke have en `clientLoader`. Derfor henter tutorialen emailen med `useEffect`, når componenten bliver vist. Du gør det samme her for at øve det. Du har brugt mønstret før, da du hentede users i `my-first-react-app`.

<details>
<summary>Hint</summary>

```text
const [email, setEmail] = useState(null)

useEffect(() => {
  async function loadSession() {
    // getSession() og setEmail(...)
  }
  loadSession()
}, [])
```

Husk at importere `useState` og `useEffect` fra `react` og `supabase` fra `../lib/supabase`.

</details>

<details>
<summary>Se løsningsforslag</summary>

```jsx
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [email, setEmail] = useState(null);

  // Kører én gang, når forsiden bliver vist
  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setEmail(session?.user.email);
    }
    loadSession();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>React Supabase Auth</h1>
        <p className="auth-subtitle">
          Create an account, log in and take a look at your JWT
        </p>

        {email ? (
          <>
            <p className="auth-subtitle">Logged in as {email}</p>
            <nav className="home-links">
              <Link to="/profile" className="btn-primary">
                My Profile
              </Link>
            </nav>
          </>
        ) : (
          <nav className="home-links">
            <Link to="/register" className="btn-primary">
              Create Account
            </Link>
            <Link to="/login" className="btn-secondary">
              Log In
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
```

</details>

#### Test øvelse 12

1. Log ind, og gå til forsiden. Står din email der?
2. Log ud på `/profile`, og gå til forsiden. Ser du de to links igen?
3. Hvorfor står `getSession()` inde i `useEffect` og ikke direkte i componenten?

---

## Fra øvelserne til step 15

Nu laver du det samme i chatbotten. Er du ikke færdig med step 14, så hent startpunktet i roden af chatbot-repoet, og commit det, før du ændrer noget:

```bash
npx degit --force bewildergeist/chatbot-react-postgres#pr-15-start
```

Startpunktet opretter tråde uden `user_id`, ligesom startpunktet til step 14. Sæt `TEST_USER_ID` ind i `backend/server.js` igen. Kodestykket står i [React Supabase Auth: Login før chatbotten](react-supabase-auth.md#fra-øvelserne-til-step-14).

| Step 15 | Det har du lavet i |
| --- | --- |
| Delopgave 1: Create apiFetch helper | Øvelse 11. Brug `VITE_API_URL` i stedet for `VITE_SUPABASE_URL`, og drop `apikey`. Dit eget API skal kun have tokenet |
| Delopgave 2: Update all loaders and actions | Øvelse 11, hvor du skiftede `fetch` ud i `profile.jsx`. I chatbotten er det fire filer: `layout.jsx`, `chat-thread.jsx`, `chat-new.jsx` og `chat-thread-edit.jsx` |
| Delopgave 3: Add logout functionality | Øvelse 9 og 12. Logout ligger i layoutets `clientAction` med `intent="logout"`. Emailen står i `SidebarFooter` |

Efter step 15 står tokenet i hvert request til dit eget API på `localhost:3000`. Find det i Network-fanen. Backenden tjekker det ikke endnu, så to brugere ser stadig de samme tråde.

Senere skal backenden tjekke tokenet. Den gør det med `supabase.auth.getUser(token)`, som sender præcis det request, du byggede i øvelse 10. Supabase svarede 403 på dit rettede token. Din egen backend kommer til at svare 401, og det er den statuskode, chatbotten skal reagere på, når et token er udløbet.
