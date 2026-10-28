# RACE 10 - JWT tokens fra frontend - 03-11-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Jeres chatbot har login, og der ligger et JWT i localStorage. Men tokenet bliver aldrig sendt til jeres API. Backenden ved ikke, hvem der spørger, og to brugere ser de samme tråde.

I dag lærer I at sende tokenet med i en header og at samle alle API-kald i én funktion, `apiFetch`. Ligesom sidst øver vi i `react-supabase-auth`. Den har ingen backend, så der sender I tokenet til Supabase Auth' eget API.

Øvelserne svarer til delopgaverne i [step 15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15) i [chatbot-tutorialen](https://github.com/bewildergeist/chatbot-react-postgres). Når dagen er slut, kender I alle dele af step 15 og kan lave det selv i chatbotten. Det, I ikke når, laver I i selvstudiet onsdag. Step 15 skal være færdig torsdag, hvor test og deployment bygger videre på den.

---

## Agenda

<details>
<summary><strong>1. Opsamling: jeres login-flow</strong></summary>

- Vi starter med jeres tegninger og svar fra fredagens gruppearbejde
- Hvad kan man gøre med en stjålet anon key? Med et stjålet access token? Og hvorfor kan backenden ikke stole på validering i frontenden?
- Ser to brugere stadig de samme tråde? Stod tokenet i requestet til jeres API? Det gør vi noget ved i dag
</details>
<details>
<summary><strong>2. Hvordan ved backenden, hvem du er?</strong></summary>

- HTTP husker ingenting mellem to requests. Hvert request skal selv fortælle, hvem det kommer fra
- Frontenden sender tokenet med. Backenden tjekker signaturen og finder brugerens id i `sub`. Det gør I i backenden næste uge
- Vis billedet under ["Hvor ender chatbotten?"](../opgaver/react-supabase-auth.md#hvor-ender-chatbotten). Step 15 er det første skridt derhen
- **Session:** at brugeren er logget ind over flere requests. Supabase-klienten henter selv et nyt access token med refresh tokenet, når det gamle udløber
</details>
<details>
<summary><strong>3. HTTP headers og Bearer tokens: øvelse 10</strong></summary>

- **Headers** er ekstra information i et request. I kender `Content-Type: application/json`
- **Bearer token:** `Authorization: Bearer <token>`. Bearer betyder "ihændehaver": den, der har tokenet, får adgang. I har gjort det før, da jeres backend sendte Groq-nøglen
- Øvelse 10: byg selv det request, `getUser()` sender, og tilføj én header ad gangen. Hver header retter én fejl
- **`apikey` vs. `Authorization`:** `apikey` siger, hvilket projekt det er. `Authorization` siger, hvilken bruger det er. Det svarer på spørgsmålet fra opsamlingen: anon key står alligevel i frontenden, men et stjålet access token gør en anden til brugeren, indtil det udløber
</details>
<details>
<summary><strong>4. apiFetch: øvelse 11-12</strong></summary>

- I chatbotten bygger hver route selv URL'en og kalder `fetch()`. Skal tokenet med, skal I rette alle steder
- **DRY** (Don't Repeat Yourself): saml det, der gentages, ét sted. Samme idé som data-modulet i Express
- **Wrapper-funktion:** `apiFetch(path, options)` bygger URL'en, henter tokenet med `getSession()` og kalder `fetch()`
- **`getSession()` vs. `getUser()`:** `getSession()` læser tokenet fra localStorage. `getUser()` spørger Supabase, om det er gyldigt. Frontenden skal kun sende tokenet videre, så `getSession()` er nok
- Øvelse 11: `apiFetch` i øveprojektet. Øvelse 12 er en bonus: vis emailen på forsiden med `useEffect`
</details>
<details>
<summary><strong>5. Fra øvelserne til step 15</strong></summary>

- Vi åbner [step 15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15) sammen og sætter øvelsesnumre på delopgaverne. Tabellen står sidst i opgaven
- Forskellene i chatbotten: `apiFetch` bruger `VITE_API_URL` og ingen `apikey`. Logout sidder i sidebaren med `intent="logout"`. Emailen hentes med `useEffect`, fordi `SidebarFooter` ikke er en route
- Når I er i mål: find `Authorization: Bearer ...` i Network-fanen. Der kommer også `OPTIONS`-requests. Browseren spørger først API'et om lov, fordi requestet har en `Authorization`-header og går til et andet origin. Det er CORS igen
- Resten af dagen går I i gang med step 15. Er I ikke færdige med step 14, så brug degit-kommandoen sidst i opgaven
</details>
<details>
<summary><strong>6. Hvad mangler stadig?</strong></summary>

- Send `GET /api/threads` fra Thunder Client uden token. Virker det?
- Frontenden sender tokenet, men ingen tjekker det. Næste uge skal backenden afvise requests uden et gyldigt token ([step 16](https://github.com/bewildergeist/chatbot-react-postgres/pull/16)) og kun vise brugerens egne tråde ([step 17](https://github.com/bewildergeist/chatbot-react-postgres/pull/17)). Den tjekker tokenet med `getUser(token)`, altså det samme request som i øvelse 10
- **Onsdag:** bliv færdige i selvstudiet, og push. Torsdag deployer I fra jeres repo
</details>

---

## Forberedelse

- Bliv færdig med [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14), så du kan logge ind i chatbotten
- Tjek, at `react-supabase-auth` kører, og at du kan se `/profile`. Mangler du øvelse 8 og 9, så se "Kom i gang" i [dagens opgave](../opgaver/react-supabase-auth-bearer-token.md)
- Tag tegningen og svarene fra fredagens gruppearbejde med
- Skim "Overview" i [step 15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15)
- På Scrimba:
  - [Intro to Supabase](https://scrimba.com/intro-to-supabase-c0abltfqed) > Authentication, fra "Row Level Security" til og med "Sign up expansion". Row Level Security bruger vi ikke i chatbotten
- Supplerende, hvis du har tid:
  - ["Authorization"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization) på MDN

---

## Materialer

- Opgaver:
  - [React Supabase Auth: Send tokenet med](../opgaver/react-supabase-auth-bearer-token.md): øvelse 10-12. Send tokenet til Supabase i en header, og saml det i `apiFetch`
    - [Løsning til react-supabase-auth](https://github.com/cederdorff/react-supabase-auth): én branch pr. øvelse. Prøv selv først
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
