# RACE 10 - JWT tokens fra frontend - 03-11-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Jeres chatbot har login, og der ligger et JWT i localStorage. Men tokenet bliver aldrig sendt til jeres API. Backenden ved stadig ikke, hvem der spørger, og to brugere ser de samme tråde.

I dag sender vi tokenet med i hvert request til jeres Express API. Vi ser på, hvordan HTTP headers og Bearer tokens virker, samler alle API-kald i én funktion, `apiFetch`, og tilføjer logout og brugerens email i sidebaren.

Når dagen er slut, har I lavet [step 15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15) i [chatbot-tutorialen](https://github.com/bewildergeist/chatbot-react-postgres) og kan se jeres token i Network-fanen på hvert request. Backenden tjekker det ikke endnu, så de to brugere ser stadig de samme tråde. Det kommer i backenden næste uge. Torsdag bygger test og deployment videre på step 15.

---

## Agenda

<details>
<summary><strong>1. Opsamling: jeres login-flow</strong></summary>

- Vi starter med jeres tegninger af login-flowet og jeres svar fra fredagens gruppearbejde
- Hvad kan man gøre med en stjålet anon key? Med et stjålet access token? Og hvorfor kan backenden ikke stole på validering i frontenden?
- Log ind med to forskellige brugere i to browsere. Ser de stadig de samme tråde?
- Åbn Network-fanen, og find et request til jeres eget API. Står tokenet nogen steder? Det gør vi noget ved i dag
</details>
<details>
<summary><strong>2. Hvordan ved backenden, hvem du er?</strong></summary>

- HTTP husker ingenting mellem to requests. Hvert request skal selv fortælle, hvem det kommer fra
- Tokenet ligger i localStorage, og frontenden skal sende det med i hvert request til jeres API
- Backenden kan så læse tokenet, tjekke signaturen og se brugerens id i `sub`. Det gør I i backenden næste uge
- Vis billedet under ["Hvor ender chatbotten?"](../opgaver/react-supabase-auth.md#hvor-ender-chatbotten) sidst i React Supabase Auth-opgaven. I dag laver vi step 15, det første skridt derhen
- **Session:** at brugeren er logget ind over flere requests og sidevisninger. Supabase-klienten holder styr på sessionen og henter et nyt access token med refresh tokenet, når det gamle udløber
</details>
<details>
<summary><strong>3. HTTP headers og Bearer tokens</strong></summary>

- **Headers** er ekstra information, der sendes med et request. I kender allerede `Content-Type: application/json`, når I sender JSON
- **Authorization header:** standardstedet til at sende et token: `Authorization: Bearer <token>`
- **Bearer** betyder "ihændehaver": den, der har tokenet, får adgang. Derfor må tokenet ikke komme i forkerte hænder
- I har gjort det før: jeres backend sender jeres Groq-nøgle som Bearer token, når den kalder LLM API'et. Nu er det jeres egen backend, der modtager et Bearer token, og det er brugerens frontend, der sender det
- Frontenden kører på `localhost:5173` og API'et på `localhost:3000`. Når et request til et andet origin har en `Authorization` header, spørger browseren først API'et med et `OPTIONS`-request, om det er tilladt. Det er CORS igen, og det er derfor, der nu også dukker `OPTIONS`-requests op foran jeres `GET`-requests i Network-fanen
</details>
<details>
<summary><strong>4. apiFetch: én funktion til alle API-kald</strong></summary>

- Lige nu bygger hver route selv URL'en med `import.meta.env.VITE_API_URL` og kalder `fetch()`. Skal tokenet med, skal I rette alle steder
- **DRY** (Don't Repeat Yourself): saml det, der gentages, ét sted. Samme idé som jeres data-modul i Express, hvor kun ét modul læste og skrev filen
- **Wrapper-funktion:** `apiFetch(path, options)` tager kun stien, fx `/api/threads`, bygger URL'en, henter tokenet og kalder `fetch()`
- Tokenet hentes med `supabase.auth.getSession()`. Er brugeren ikke logget ind, er `session` `null`, og `session?.access_token` giver `undefined` i stedet for en fejl
- **`getSession()` vs. `getUser()`:** på profilsiden i `react-supabase-auth` brugte I `getUser()`, som spørger Supabase, om tokenet er gyldigt. `getSession()` læser tokenet fra localStorage og tjekker ikke, om det er gyldigt. Det er nok her, fordi frontenden kun skal sende tokenet videre. Det er backenden, der skal tjekke det
- Eksisterende headers bevares med spread: `{ ...options.headers, Authorization: ... }`
- Hands-on: [step 15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15), delopgave 1
</details>
<details>
<summary><strong>5. Brug apiFetch i alle loaders og actions</strong></summary>

- Hands-on: step 15, delopgave 2. Skift `fetch()` ud med `apiFetch()` i `layout.jsx`, `chat-thread.jsx`, `chat-new.jsx` og `chat-thread-edit.jsx`
- `` fetch(`${apiUrl}/api/threads`) `` bliver til `apiFetch("/api/threads")`. Method, headers og body sendes med på samme måde som før
- Test: log ind, klik rundt i chatbotten, og find `Authorization: Bearer ...` under Request Headers i Network-fanen
- Kopiér tokenet fra Network-fanen, og indsæt det på [jwt.io](https://jwt.io). Er det det samme bruger-id som i Supabase?
</details>
<details>
<summary><strong>6. Logout og brugerens email</strong></summary>

- Hands-on: step 15, delopgave 3
- Logout kender I fra øvelse 9 i `react-supabase-auth`. Forskellen er, hvor knappen står: i chatbotten sidder den i sidebaren, som er en del af layoutet
- **Intent-mønstret:** layoutets `clientAction` håndterer allerede `intent="delete"`. Nu tilføjer I `intent="logout"`, som kalder `supabase.auth.signOut()` og sender til `/login`
- En `<Form method="post">` uden `action` sender til den route, den står i. Logout-knappen i sidebaren sender derfor til layoutets `clientAction`
- **`useEffect`:** sidebaren henter brugerens email med `getSession()`, når den bliver vist, og gemmer den i state. Samme mønster, som da I hentede users i `my-first-react-app`
- Kig i Local Storage før og efter logout. Hvad sker der med tokenet?
</details>
<details>
<summary><strong>7. Hvad mangler stadig?</strong></summary>

- Tilbage til opsamlingen: tokenet står nu i hvert request. Men log ind med to brugere igen. Ser de stadig de samme tråde?
- Send `GET /api/threads` fra Thunder Client uden en `Authorization` header. Virker det stadig?
- Backenden tager imod alle requests, med eller uden token. Frontenden sender tokenet, men ingen tjekker det
- Næste skridt: backenden skal afvise requests uden et gyldigt token ([step 16](https://github.com/bewildergeist/chatbot-react-postgres/pull/16)), og hver bruger skal kun se sine egne tråde ([step 17](https://github.com/bewildergeist/chatbot-react-postgres/pull/17))
- Step 15 skal være færdig til torsdag, hvor test og deployment bygger videre på den. Brug selvstudiet onsdag, hvis I ikke når det i dag
</details>

---

## Forberedelse

- Sørg for at være færdig med [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14), så I kan oprette en bruger og logge ind i chatbotten
- Tag tegningen og svarene fra fredagens gruppearbejde med
- Skim "Overview" i [step 15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15), så du ved, hvad vi skal bygge
- På Scrimba:
  - [Intro to Supabase](https://scrimba.com/intro-to-supabase-c0abltfqed) > Authentication, fra "Row Level Security" til og med "Sign up expansion"
- Supplerende, hvis du har tid:
  - ["Authorization"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization) på MDN

---

## Materialer

- Opgaver:
  - [Chatbot React Postgres](https://github.com/bewildergeist/chatbot-react-postgres)
    - [Chatbot-tutorial, step 15: Send bearer tokens in requests](https://github.com/bewildergeist/chatbot-react-postgres/pull/15)
- Links:
  - [jwt.io](https://jwt.io): dekod tokenet fra Network-fanen
  - ["Authorization"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization) på MDN
  - ["useEffect"](https://react.dev/reference/react/useEffect) på react.dev

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178075
canvas_module_position: 52
canvas_module_published: true
canvas_module_item_id: 1018766
canvas_module_item_position: 1
canvas_page_id: 200735
canvas_page_slug: "plan-for-race-10-jwt-tokens-fra-frontend"
canvas_page_title: "Plan for RACE 10 - JWT tokens fra frontend"
canvas_page_published: false
canvas_updated_at: "2026-08-10T12:34:35Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018766"
local_status: mirrored
```

</details>
