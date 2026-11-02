# Chatbot step 15: Send tokenet med til dit API

## Kort fortalt

Efter step 14 kan du logge ind i chatbotten, og Supabase gemmer et token i localStorage. Men chatbotten sender ikke tokenet med, når den kalder dit API. Backenden kan ikke se, hvem der spørger.

I denne opgave laver du [step 15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15) i chatbot-tutorialen, bare på dansk og i mindre trin. Du laver funktionen `apiFetch`, som sætter tokenet på hvert request. Du bruger den i alle routes, og du tilføjer log ud i sidebaren.

Har du lavet [React Supabase Auth: Send tokenet med](react-supabase-auth-bearer-token.md), har du set det meste før. Forskellen er, at tokenet nu skal til dit eget API på `localhost:3000`.

Løsningen ligger i de tre commits i step 15. Sidst i opgaven står, hvilken øvelse der svarer til hvilket commit.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under øvelsen. Den peger dig i den rigtige retning uden at give dig koden.
2. Åbn **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller når du vil sammenligne med din egen kode.

Spring aldrig en test over, heller ikke når den virker oplagt.

</details>

## Det bygger du

```text
Før:       clientLoader -> fetch(`${apiUrl}/api/threads`) -> intet token
Nu:        clientLoader -> apiFetch("/api/threads")       -> Authorization: Bearer <token>
apiFetch:  getSession() -> access_token -> fetch(VITE_API_URL + path) med headeren
Log ud:    × i sidebaren -> clientAction i layout.jsx    -> signOut() -> redirect("/login")
```

## Kom i gang

Start backend og frontend, som du plejer. Log ind på `/login`.

Er du ikke færdig med step 14, så hent startpunktet i roden af chatbot-repoet, og commit det, før du ændrer noget:

```bash
npx degit --force bewildergeist/chatbot-react-postgres#pr-15-start
```

Startpunktet opretter tråde uden `user_id`. Sæt `TEST_USER_ID` ind i `backend/server.js` igen. Kodestykket står i [React Supabase Auth: Login før chatbotten](react-supabase-auth.md#fra-øvelserne-til-step-14).

---

## Øvelse 1: Hvor er tokenet?

Her skal du ikke skrive kode. Du finder de tre ting, der mangler. Resten af opgaven retter dem en ad gangen.

1. Log ind. Åbn DevTools → Application → Local Storage. Find nøglen, der slutter med `-auth-token`. Tokenet ligger i `access_token`.
2. Åbn Network-fanen, og skriv `api` i filteret. Genindlæs siden. Klik på requestet til `threads`, og kig under Request Headers. Står tokenet der?
3. Åbn et inkognitovindue, og gå direkte til `localhost:5173/chat/new` uden at logge ind. Kan du se trådene?
4. Søg efter `VITE_API_URL` i `frontend/app` med Search i VS Code (Ctrl+Shift+F eller Cmd+Shift+F). Hvor mange steder står den? Hvor mange `fetch(` er der?
5. Kig på bunden af sidebaren. Hvem er logget ind? Kan du logge ud?

Du skal have fundet tre ting:

- Tokenet ligger i localStorage, men bliver ikke sendt med til API'et
- Hver route bygger selv URL'en og kalder `fetch`. Der er seks steder
- Sidebaren viser "Batman", og der er ingen knap til at logge ud

Du kunne også se trådene i inkognitovinduet uden at være logget ind. Det retter du ikke i denne opgave. Backenden skal tjekke tokenet, og det sker i step 16.

---

## Øvelse 2: apiFetch

> **Headers og Bearer:** Et request kan have headers. Det er ekstra information ud over URL og body. Du kender `Content-Type: application/json` fra, når du sender JSON. Standardstedet til et token er headeren `Authorization` i formatet `Bearer <token>`. Bearer betyder "ihændehaver": den, der har tokenet, får adgang.

> **Wrapper-funktion:** en funktion, der kalder en anden funktion og lægger noget til. `apiFetch(path, options)` tager kun stien, fx `/api/threads`, og de samme options som `fetch()`. Den bygger URL'en, sætter tokenet på og kalder `fetch()`. Det er DRY: det, der gentages, står ét sted.

Du bygger `apiFetch` i to trin. Først bygger den kun URL'en. Bagefter sætter den tokenet på.

### Trin 1: Byg URL'en

**Opret** `frontend/app/lib/apiFetch.js`:

```js
const apiUrl = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  // TODO: Kald fetch() med apiUrl + path og options. Returnér svaret.
}
```

**Brug den** i `clientLoader` i `frontend/app/routes/layout.jsx`. Importér `apiFetch` fra `../lib/apiFetch.js`. Erstat `apiUrl`, `url` og `fetch(url)` med ét kald:

```js
const response = await apiFetch("/api/threads");
```

<details>
<summary>Se løsningsforslag</summary>

```js
const apiUrl = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  return fetch(`${apiUrl}${path}`, options);
}
```

</details>

#### Test trin 1

1. Genindlæs. Sidebaren skal vise dine tråde som før.
2. Find requestet til `threads` i Network-fanen. Er URL'en den samme som før?
3. Ret `"/api/threads"` til `"/api/thread"`, og genindlæs. Læs fejlen. Ret det tilbage.

### Trin 2: Sæt tokenet på

Udvid `apiFetch`, så den henter tokenet og sender det med i `Authorization`.

```js
import { supabase } from "./supabase.js";

const apiUrl = import.meta.env.VITE_API_URL;

export async function apiFetch(path, options = {}) {
  // TODO: Hent session med supabase.auth.getSession(), og gem access_token i en variabel, token.

  // TODO: Lav et headers-objekt med headers fra options.

  // TODO: Sæt Authorization på headers, men kun hvis der er et token.

  // TODO: Kald fetch() med apiUrl + path og options med dine headers. Returnér svaret.
}
```

> **`getSession()`:** svarer med `{ data: { session } }`. Du kan hente `session` direkte ud med `const { data: { session } } = ...`. Er du ikke logget ind, er `session` `null`. Derfor skriver du `session?.access_token`. `getSession()` læser tokenet fra localStorage. Den spørger ikke Supabase.

<details>
<summary>Hint</summary>

```text
const headers = {
  ...options.headers
}

if (token) {
  headers.Authorization = `Bearer ${token}`
}

return fetch(..., { ...options, headers })
```

`...options.headers` beholder de headers, som den, der kalder `apiFetch`, selv har sat, fx `Content-Type`. `{ ...options, headers }` beholder `method` og `body` fra options og bruger dine headers.

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
import { supabase } from "./supabase.js";

const apiUrl = import.meta.env.VITE_API_URL;

// Ligesom fetch(), men med API-URL og token sat på
export async function apiFetch(path, options = {}) {
  // getSession() læser tokenet fra localStorage. Er du logget ud, er session null
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  // Behold de headers, der blev sendt med
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${apiUrl}${path}`, { ...options, headers });
}
```

</details>

#### Test trin 2

1. Genindlæs. Klik på requestet til `threads` i Network-fanen. Står der `Authorization: Bearer eyJ...` under Request Headers?
2. Er tokenet det samme som `access_token` i Local Storage?
3. Tilføj midlertidigt `console.log(req.headers.authorization);` øverst i `GET /api/threads` i `backend/server.js`. Genindlæs. Står tokenet i terminalen, hvor backenden kører? Nu kan backenden se tokenet. Fjern linjen igen.
4. Åbn chatbotten i inkognitovinduet. Står der en `Authorization`-header i requestet? Kan du stadig se trådene?

Backenden tjekker ikke tokenet endnu. Den svarer alle, også dem uden token. Det retter du i step 16.

---

## Øvelse 3: Brug apiFetch overalt

**Prøv det først:** slet en tråd, og kig på `DELETE`-requestet i Network-fanen. Der er ingen `Authorization`-header. Kun `clientLoader` i `layout.jsx` bruger `apiFetch` indtil nu.

Reglen er den samme hver gang:

```js
// Før
const apiUrl = import.meta.env.VITE_API_URL;
const response = await fetch(`${apiUrl}/api/threads/${threadId}`, {
  method: "DELETE",
});

// Nu
const response = await apiFetch(`/api/threads/${threadId}`, {
  method: "DELETE",
});
```

- Importér `apiFetch` fra `../lib/apiFetch.js`
- Skift `fetch` ud med `apiFetch`, og fjern `${apiUrl}` fra URL'en
- Fjern `const apiUrl = ...`
- Lad `method`, `headers` og `body` stå, som de gør
- Ret kommentarer, der siger, at API'et ikke skal have headers. Det passer ikke længere

### Trin 1: layout.jsx

Skift `fetch` ud i `clientAction` i `layout.jsx`.

#### Test trin 1

Slet en tråd. Står `Authorization` nu under Request Headers på `DELETE`-requestet?

### Trin 2: chat-thread.jsx

Gør det samme i `chat-thread.jsx`. `clientLoader` har to `fetch`, og `clientAction` har ét.

<details>
<summary>Se løsningsforslag</summary>

```js
import { apiFetch } from "../lib/apiFetch.js";

export async function clientLoader({ params }) {
  const threadResponse = await apiFetch(`/api/threads/${params.threadId}`);

  // ... tjek af 404 og ok som før

  const messagesResponse = await apiFetch(
    `/api/threads/${params.threadId}/messages`,
  );

  // ... resten som før
}

export async function clientAction({ params, request }) {
  // ... formData og validering som før

  try {
    const response = await apiFetch(
      `/api/threads/${params.threadId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      },
    );

    // ... resten som før
  }
}
```

</details>

#### Test trin 2

1. Åbn en tråd. Har begge requests en `Authorization`-header?
2. Send en besked. Står både `Content-Type` og `Authorization` under Request Headers på `POST`-requestet?

### Trin 3: chat-new.jsx og chat-thread-edit.jsx

Gør det samme i de to sidste filer. Hver fil har ét `fetch` i `clientAction`.

#### Test trin 3

1. Start en ny chat, og ret titlen på en tråd. Har begge requests en `Authorization`-header?
2. Søg efter `VITE_API_URL` i `frontend/app` igen. Den skal kun stå i `apiFetch.js`. Søg efter `fetch(`. Det skal også kun stå i `apiFetch.js`.
3. Fjern `...options.headers` fra `apiFetch`, og send en besked. Hvad sker der? Kig efter `Content-Type` i Request Headers og efter fejlen i terminalen, hvor backenden kører. Sæt `...options.headers` ind igen.
4. Du kan ikke længere se hele URL'en i dine routes. Er det en fordel eller en ulempe?

---

## Øvelse 4: Log ud

**Prøv det først:** du kan ikke logge ud. Sidebaren viser "Batman", og linket går til `/profile`, som ikke findes i chatbotten.

Du bygger det i tre trin. Først knappen, så selve log ud, og til sidst emailen.

### Trin 1: Knappen

> **Intent:** `clientAction` i `layout.jsx` håndterer allerede `intent="delete"`, når du sletter en tråd. Du tilføjer `intent="logout"` i samme `clientAction`. En `<Form method="post">` uden `action` sender til den route, der viser componenten. Sidebaren bliver vist af `layout.jsx`, så knappen sender til layoutets `clientAction`.

**I `frontend/app/components/Sidebar.jsx`:** Importér `Form` fra `react-router`. I `SidebarFooter`:

- Lav `<a href="/profile" ...>` om til `<div className="user-profile">`, og fjern `href`
- Tilføj en `<Form method="post">` lige efter `</div>` med denne knap:

```jsx
<button type="submit" name="intent" value="logout" className="logout-btn" title="Log out">
  ×
</button>
```

**I `frontend/app/app.css`:** Find `.sidebar-footer`, og ret det til nedenstående, så knappen står til højre for brugeren. Fjern `padding: 0.75rem;` fra `.user-profile`, og tilføj `.logout-btn`:

```css
.sidebar-footer {
  border-top: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  padding: 0.75rem;
  justify-content: space-between;
}

.logout-btn {
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-medium);
  transition: background 0.1s ease;
}
.logout-btn:hover {
  background-color: var(--bg-hover);
}
```

**I `layout.jsx`:** Tilføj midlertidigt `console.log(intent);` i `clientAction`, lige efter `const intent = ...`.

#### Test trin 1

1. Står knappen nederst til højre i sidebaren?
2. Klik på den. Står der `logout` i Console?
3. Slet en tråd. Hvad står der nu i Console?

### Trin 2: Log ud

Tilføj et tjek i `clientAction` i `layout.jsx`, efter tjekket for `delete`:

- Hvis `intent` er `"logout"`: log ud med `supabase.auth.signOut()`
- `redirect("/login")`
- Fjern din `console.log`

Importér `supabase` fra `../lib/supabase.js`. `redirect` er allerede importeret.

<details>
<summary>Se løsningsforslag</summary>

```js
import { Outlet, useLoaderData, redirect } from "react-router";
import Sidebar from "../components/Sidebar.jsx";
import { apiFetch } from "../lib/apiFetch.js";
import { supabase } from "../lib/supabase.js";

export async function clientAction({ request }) {
  // ... formData, intent og delete som før

  if (intent === "logout") {
    // Fjerner tokenet fra localStorage
    await supabase.auth.signOut();
    return redirect("/login");
  }

  return null;
}
```

</details>

#### Test trin 2

1. Åbn Local Storage, så du kan se nøglen `-auth-token`. Klik på ×. Du skal ende på `/login`. Er nøglen væk?
2. Gå direkte til `localhost:5173/chat/new`. Kan du se trådene? Står der en `Authorization`-header på requestet til `threads`?
3. Log ind igen. Er headeren tilbage?
4. Du kunne også have lavet en route, `/logout`. Hvorfor er det nemmere at bruge `intent` i layoutets `clientAction`?

Du er logget ud, men du kan stadig se alle tråde. Det er samme hul, som du fandt i inkognitovinduet i øvelse 2. Det lukker du i step 16.

### Trin 3: Vis, hvem der er logget ind

Vis din email i stedet for "Batman".

I `SidebarFooter`:

- Gem emailen i state. Den starter som `null`
- I en `useEffect`: hent `session` med `getSession()`, og gem `session?.user.email` i state
- Vis emailen i stedet for "Batman". Er den `null`, så vis "Loading..."
- Brug emailen i avatar-URL'en i stedet for `Batman`

```jsx
src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail || "User")}&background=0D0D0D&color=fff&size=40`}
```

Importér `supabase` fra `../lib/supabase.js`. Filen bruger allerede `React.useState`. Brug `React.useEffect` på samme måde.

> **Hvorfor `useEffect`?** `SidebarFooter` er en component og ikke en route, så den kan ikke have en `clientLoader`. Derfor henter du emailen med `useEffect`, når componenten bliver vist. Det tomme array `[]` betyder, at den kun kører én gang.

<details>
<summary>Hint</summary>

```text
const [userEmail, setUserEmail] = React.useState(null)

React.useEffect(() => {
  async function loadSession() {
    // getSession() og setUserEmail(...)
  }
  loadSession()
}, [])
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```jsx
import React from "react";
import { href, Link, NavLink, useFetcher, Form } from "react-router";
import { supabase } from "../lib/supabase.js";

function SidebarFooter() {
  const [userEmail, setUserEmail] = React.useState(null);

  // Kører én gang, når sidebaren bliver vist
  React.useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserEmail(session?.user.email);
    }
    loadSession();
  }, []);

  return (
    <div className="sidebar-footer">
      <div className="user-profile">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail || "User")}&background=0D0D0D&color=fff&size=40`}
          alt="User avatar"
          className="user-avatar"
          width={30}
          height={30}
        />
        <span className="user-name">{userEmail || "Loading..."}</span>
      </div>
      <Form method="post">
        <button
          type="submit"
          name="intent"
          value="logout"
          className="logout-btn"
          title="Log out"
        >
          ×
        </button>
      </Form>
    </div>
  );
}
```

</details>

#### Test trin 3

1. Står din email nederst i sidebaren? Passer bogstaverne i avataren?
2. Log ud, og log ind som en anden bruger. Skifter emailen?
3. Hvorfor står `getSession()` inde i `useEffect` og ikke direkte i componenten?

---

## Fra øvelserne til step 15

| Øvelse | Step 15 | Commit |
| --- | --- | --- |
| Øvelse 2 | Delopgave 1: Create apiFetch helper | [`bb73206`](https://github.com/bewildergeist/chatbot-react-postgres/pull/15/commits/bb73206f219f3225fb0ef59636b11a6c82c61531) |
| Øvelse 3 | Delopgave 2: Update all loaders and actions | [`acea7fa`](https://github.com/bewildergeist/chatbot-react-postgres/pull/15/commits/acea7fa87ed36821d7ffd44435e8e26bfb64e466) |
| Øvelse 4 | Delopgave 3: Add logout functionality | [`d699eb5`](https://github.com/bewildergeist/chatbot-react-postgres/pull/15/commits/d699eb5a47b2d1236b5ab6743c25596e2bae3a6a) |

Koden i commits har flere kommentarer end løsningsforslagene her, men gør det samme. Commit 3 skifter også `React.useState` ud med `useState`. Det er kun en anden måde at importere på.

## Hvad mangler?

Tokenet står nu i hvert request til dit API. Men backenden kigger ikke på det. Du så det to gange: i inkognitovinduet og efter log ud. Alle kan stadig se alle tråde.

I step 16 får backenden en middleware, der læser `req.headers.authorization`, ligesom din `console.log` i øvelse 2. Den tjekker tokenet med `supabase.auth.getUser(token)` og svarer 401, hvis tokenet mangler eller er forkert.
