# Chatbot step 18: Send brugeren til login ved 401

## Kort fortalt

Efter step 16 svarer dit API `401`, når tokenet mangler eller er forkert. Men frontenden ved ikke, hvad den skal gøre med svaret. Brugeren ser en fejlside og skal selv finde `/login`. Bagefter lander brugeren på forsiden og ikke der, hvor de var.

I denne opgave laver du [step 18](https://github.com/bewildergeist/chatbot-react-postgres/pull/18) i chatbot-tutorialen, bare på dansk og i mindre trin. `apiFetch` sender brugeren til `/login`, når API'et svarer `401`. Login sender brugeren tilbage til den side, de kom fra.

Tutorialen laver step 18 før step 17. Du har lavet [step 17](chatbot-step-17-kun-egne-traade.md) først.

Har du lavet [React Supabase Auth: Send tokenet med](react-supabase-auth-bearer-token.md), har du set det før. I øvelse 10 sendte `/profile` dig til `/login`, når Supabase afviste tokenet. Nu gør `apiFetch` det samme for alle sider i chatbotten.

Løsningen ligger i de to commits i step 18. Sidst i opgaven står, hvilken øvelse der svarer til hvilket commit.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under øvelsen. Den peger dig i den rigtige retning uden at give dig koden.
2. Åbn **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller når du vil sammenligne med din egen kode.

Spring aldrig en test over, heller ikke når den virker oplagt.

</details>

## Det bygger du

![Brugeren er på /chat/abc, og API'et svarer 401. apiFetch kaster en redirect til /login?redirect=%2Fchat%2Fabc. Login-siden viser "Your session has expired". Når brugeren logger ind, læser clientAction redirect fra URL'en og sender brugeren tilbage til /chat/abc](assets/chatbot-step-18-login-redirect.svg)

Det sker i koden:

```text
Før:        API'et svarer 401 -> routen kaster en fejl -> fejlside
Nu:         API'et svarer 401 -> apiFetch: throw redirect("/login?redirect=...")
Login:      clientAction -> signInWithPassword() -> redirect(redirect fra URL'en)
Ellers:     400, 404 og 500 går videre til routen som før
```

## Kom i gang

Start backend og frontend, som du plejer. Log ind på `/login`.

Er du ikke færdig med step 17, så hent startpunktet i roden af chatbot-repoet, og commit det, før du ændrer noget:

```bash
npx degit --force bewildergeist/chatbot-react-postgres#pr-18-start
```

Tutorialen skriver `pr-17-start`, fordi den laver step 18 før step 17. Brug `pr-18-start`, ellers mister du step 17.

Startpunktet har step 16 med. Har du ikke lavet det, så kør `npm install` i `backend`, og skriv `SUPABASE_URL` og `SUPABASE_ANON_KEY` i `backend/.env`. Ellers starter backenden ikke.

Startpunktets `apiFetch` ser lidt anderledes ud end løsningsforslagene her. Den virker på samme måde.

---

## Øvelse 1: Hvad ser brugeren ved 401?

Her skal du ikke skrive kode. Du lader som om, tokenet er udløbet, og ser, hvad brugeren oplever.

> **Ugyldigt token:** et access token lever en time. Før det udløber, henter Supabase et nyt med refresh tokenet. Det gør `getSession()` i `apiFetch` også. Men kan der ikke komme et nyt, fx fordi brugeren er slettet i Supabase, er tokenet i localStorage ugyldigt. Så svarer dit API `401`. Når du retter ét bogstav i tokenet, får du det samme svar.

1. Log ind, og åbn en tråd. Kopiér URL'en.
2. Åbn DevTools → Application → Local Storage. Klik på nøglen, der slutter med `-auth-token`. Ret ét bogstav midt i `access_token`.
3. Genindlæs siden. Hvad ser du? Find requestet til `threads` i Network-fanen. Hvad er status?
4. Gå selv til `/login`, og log ind. Hvor lander du? Er det den tråd, du var i?
5. Log ud. Gå direkte til den URL, du kopierede i test 1. Hvad ser du?

Du skal have fundet tre ting:

- Brugeren ser en fejlside med `401` og får ikke at vide, at de skal logge ind
- Brugeren skal selv finde `/login`
- Efter login lander brugeren på forsiden og skal selv finde tilbage

---

## Øvelse 2: Send brugeren til login

> **Hvorfor kun 401?** Routes håndterer allerede deres egne fejl. Mangler en titel, svarer API'et `400`, og formularen viser fejlen. Findes tråden ikke, svarer det `404`, og `chat-thread.jsx` viser "Thread Not Found". Men `401` kan routen ikke gøre noget ved. Kun login hjælper. Derfor hører den hjemme ét sted, i `apiFetch`, og ikke i hver route.

> **`throw redirect()`:** I øvelse 10 skrev du `return redirect("/login")` i `clientLoader` på `/profile`. Det virker, fordi det er loaderen selv, der returnerer. `apiFetch` er ikke en loader. Den bliver kaldt af en. Kaster `apiFetch` en redirect, flyver den op gennem loaderen til React Router, som skifter side. Det er det samme, som når `throw new Error()` ender i en `ErrorBoundary`.

Udvid `apiFetch` i `frontend/app/lib/apiFetch.js`:

- Importér `redirect` fra `react-router`
- Gem svaret fra `fetch()` i en variabel, `response`, i stedet for at returnere det med det samme
- Hvis `response.status` er `401`: `throw redirect("/login")`
- Ellers: returnér `response` som før

<details>
<summary>Hint</summary>

```text
const response = await fetch(...)

if (response.status === 401) {
  throw redirect(...)
}

return response
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
import { redirect } from "react-router";
import { supabase } from "./supabase.js";

const apiUrl = import.meta.env.VITE_API_URL;

// Ligesom fetch(), men med API-URL og token sat på
export async function apiFetch(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}${path}`, { ...options, headers });

  // Tokenet mangler eller er udløbet. Kun login hjælper
  if (response.status === 401) {
    throw redirect("/login");
  }

  // Andre fejl håndterer routen selv
  return response;
}
```

</details>

#### Test øvelse 2

1. Ret ét bogstav i `access_token` igen, og genindlæs. Ender du på `/login`? Kig i Network-fanen. Kom der stadig et `401` først?
2. Log ind. Hvor lander du?
3. Log ud, og gå direkte til `localhost:5173/chat/new`. Ender du på `/login`?
4. Gå til `localhost:5173/chat/<bobs id>` fra step 17, mens du er logget ind. Ser du stadig "Thread Not Found"? Hvad er status på requestet i Network-fanen? Hvorfor sender `apiFetch` dig ikke til login?
5. Skift `throw` ud med `return`, og gentag test 1. Hvad står der på fejlsiden nu? Sæt `throw` ind igen.

<details>
<summary>Hvad skete der i test 5?</summary>

`redirect()` laver et svar med status `302`. Med `return` får loaderen i `layout.jsx` det svar, som om det kom fra API'et. `302` er ikke `ok`, så loaderen kaster `Failed to fetch threads: 302`. Med `throw` når loaderen aldrig så langt.

</details>

---

## Øvelse 3: Tilbage, hvor du var

Nu skal login sende brugeren tilbage til den side, de var på. `apiFetch` skriver siden i URL'en til login. Login læser den bagefter.

> **Query parameter:** den del af URL'en, der står efter `?`. Login bruger allerede en: efter registrering sender `register.jsx` dig til `/login?registered=true`, og `login.jsx` læser den med `searchParams.get("registered")`. Nu tilføjer du en ny: `/login?redirect=/chat/abc`.

### Trin 1: Husk siden

Ret `throw redirect("/login")` i `apiFetch`, så siden kommer med:

- Gem den side, brugeren er på, i en variabel, `currentPath`. Brug `window.location.pathname + window.location.search`
- Send til `/login?redirect=` med `currentPath` bagefter. Pak `currentPath` ind i `encodeURIComponent()`

> **`encodeURIComponent()`:** gør en tekst sikker at sætte ind i en URL. `/` bliver til `%2F`, `?` til `%3F` og `&` til `%26`. Uden den kan en side med sin egen query parameter ødelægge URL'en til login. `searchParams.get()` laver teksten om igen.

<details>
<summary>Se løsningsforslag</summary>

```js
// Tokenet mangler eller er udløbet. Kun login hjælper
if (response.status === 401) {
  // Husk siden, så login kan sende brugeren tilbage
  const currentPath = window.location.pathname + window.location.search;
  throw redirect(`/login?redirect=${encodeURIComponent(currentPath)}`);
}
```

</details>

#### Test trin 1

1. Åbn en tråd. Ret ét bogstav i `access_token`, og genindlæs. Hvad står der i adresselinjen?
2. Skriv `encodeURIComponent("/chat/abc?a=1&b=2")` i Console. Prøv også uden `encodeURIComponent`: `"/login?redirect=" + "/chat/abc?a=1&b=2"`. Hvor mange query parameters ville login se?

### Trin 2: Send brugeren tilbage

Ret `clientAction` i `frontend/app/routes/login.jsx`:

- Lav en `URL` ud af `request.url`
- Hent `redirect` med `url.searchParams.get("redirect")`. Er den tom, så brug `"/"`. Gem den i en variabel, `redirectTo`
- `return redirect(redirectTo)` i stedet for `redirect("/")`

> **Hvordan kommer `?redirect=` med?** En `<Form method="post">` uden `action` sender til den URL, du står på, inklusiv query parameters. Står du på `/login?redirect=%2Fchat%2Fabc`, er det også `request.url` i `clientAction`.

<details>
<summary>Hint</summary>

```text
const url = new URL(request.url)
const redirectTo = url.searchParams.get(...) || "/"
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
export async function clientAction({ request }) {
  // ... formData, validering og signInWithPassword() som før

  // Kom brugeren fra en anden side? Ellers forsiden
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/";

  return redirect(redirectTo);
}
```

</details>

#### Test trin 2

1. Gentag test 1 fra trin 1, og log ind. Lander du i den tråd, du var i?
2. Log ud, og gå direkte til `/login` uden noget efter. Log ind. Lander du på forsiden?
3. Skriv et forkert password på `/login?redirect=...`. Står `?redirect=` stadig i adresselinjen? Log ind med det rigtige. Kommer du stadig tilbage?

### Trin 3: Fortæl brugeren hvorfor

Brugeren skal kunne se, hvorfor de pludselig står på login.

I `Login`-componenten:

- Lav en variabel, `wasRedirected`, under `justRegistered`. Den er `true`, hvis der står `redirect` i URL'en. Brug `searchParams.has("redirect")`
- Vis `Your session has expired. Please log in again.` i en `<div className="info-message">`, når `wasRedirected` er `true`. Sæt den lige under beskeden om `justRegistered`

**I `frontend/app/app.css`:** Tilføj `.info-message` lige under `.success-message`:

```css
.info-message {
  background: #eef4ff;
  color: #1d4ed8;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #c7d7fe;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
```

<details>
<summary>Se løsningsforslag</summary>

```jsx
export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const wasRedirected = searchParams.has("redirect");

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* ... h1 og justRegistered som før */}

        {wasRedirected && (
          <div className="info-message">
            Your session has expired. Please log in again.
          </div>
        )}

        {/* ... Form som før */}
      </div>
    </div>
  );
}
```

</details>

#### Test trin 3

1. Gentag test 1 fra trin 1. Står beskeden over formularen?
2. Gå til `/login` uden noget efter. Er beskeden væk?
3. Log ud, og gå til `localhost:5173/`. Du har aldrig været logget ind i denne omgang, men står der alligevel "Your session has expired"? Passer beskeden?
4. Åbn en tråd, ret ét bogstav i `access_token`, og send en besked uden at genindlæse. Ender du på `/login`? Står der `?redirect=` med tråden?
5. Gå til `/login?redirect=https://example.com`, og log ind. Hvor ender du? Hvorfor kan det være farligt, at alle kan lave sådan et link til din login-side?

<details>
<summary>Hvorfor virker test 4, når routen har try/catch?</summary>

`clientAction` i `chat-thread.jsx` kalder `apiFetch` inde i `try`. Når `apiFetch` kaster redirecten, fanger `catch` den, så selve actionen sender dig ikke til login. Men efter hver action henter React Router data igen med loaderne. Loaderen i `layout.jsx` kalder `apiFetch`, får `401` og kaster redirecten. Den bliver ikke fanget, så du ender på login alligevel.

</details>

---

## Fra øvelserne til step 18

| Øvelse | Step 18 | Commit |
| --- | --- | --- |
| Øvelse 2 | Delopgave 1: Add automatic redirect to login on 401 responses | [`c6e8e9f`](https://github.com/bewildergeist/chatbot-react-postgres/pull/18/commits/c6e8e9f897409e32c87b27a1b3a2a930db5026bb) |
| Øvelse 3 | Delopgave 2: Add URL preservation for post-login redirect | [`46f9211`](https://github.com/bewildergeist/chatbot-react-postgres/pull/18/commits/46f9211c9337f2ac06d74bddab446888e29f3a92) |

Commit 2 tilføjer ikke CSS til `.info-message`, så beskeden står uden farve i tutorialen.

## Hvad mangler?

Nu bliver brugeren sendt til login, når tokenet ikke virker, og tilbage bagefter. Hver bruger ser kun sine egne tråde fra step 17.

Men du så i test 5, at login sender dig videre til en hvilken som helst adresse. Det kaldes en open redirect. Tutorialen retter det ikke.
