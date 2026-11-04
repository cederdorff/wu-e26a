# RACE 11 - Session expiration handling i Frontend - 11-11-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I går fik backenden `requireAuth`. Nu svarer API'et `401` uden et gyldigt token. Men frontenden ved ikke, hvad den skal gøre med svaret, så brugeren ser en fejlside.

I dag sender `apiFetch` brugeren til login ved `401` og bagefter tilbage, hvor de var. Koden er kort, så vi bruger tiden på, hvorfor den står, hvor den står.

I arbejder i [Chatbot step 18](../opgaver/chatbot-step-18-send-til-login.md), som er [step 18](https://github.com/bewildergeist/chatbot-react-postgres/pull/18) på dansk og i mindre trin. Målet er, at I bliver færdige i dag.

---

## Agenda

<details>
<summary><strong>1. Opsamling: requireAuth og 401</strong></summary>

- Hvad gør `requireAuth`? Hvad svarede API'et, da I i går kaldte det med `curl` uden token og med `Bearer noget-vrøvl`?
- Sidste spørgsmål i opgave 10 i arbejdsarket: log ud, og genindlæs. Hvad sker der, og hvorfor? Det er dagens problem
- Nåede I ikke step 16 i går, så brug startpunktet i dagens opgave
- Har I deployet backenden på Render, skal den nu også have `SUPABASE_URL` og `SUPABASE_ANON_KEY`
</details>
<details>
<summary><strong>2. Token expiration og session expiration</strong></summary>

- I går fandt I `sub` i tokenet og sammenlignede med `req.userId`. Ved siden af står `exp`, tokenets udløbstid. Hos Supabase er det en time. Så virker et stjålet token ikke for evigt
- Før det udløber, henter Supabase et nyt med refresh tokenet. Brugeren mærker ingenting
- Er tokenet ugyldigt, fx fordi brugeren er slettet, eller tokenet er ødelagt, svarer API'et `401`. Så er sessionen slut, og brugeren skal logge ind igen
- Vi prøver begge dele: slet en ekstra testbruger i Supabase, og ret ét bogstav i `access_token` i localStorage
</details>
<details>
<summary><strong>3. Fejlhåndtering af 401: DRY, SoC og SRP</strong></summary>

- Routes håndterer allerede deres egne fejl: `400` i formularen og `404` som "Thread not found". `401` kan ingen route gøre noget ved. Kun login hjælper
- **DRY:** tjekket skal ikke stå i alle loaders og actions. Det står ét sted, i `apiFetch`. Ligesom `requireAuth` i går: én middleware i stedet for et tjek i hver route
- **SoC og SRP:** `apiFetch` har ét ansvar: at tale med API'et som den bruger, der er logget ind. Alle andre fejl ejer routen. Hvad skulle der ske med `apiFetch`, hvis den også håndterede `404`?
</details>
<details>
<summary><strong>4. redirect(), wrapper-funktion og guard clause</strong></summary>

- `redirect()` kender I fra `/profile`. Der returnerede loaderen den. `apiFetch` er ikke en loader, så den kaster den: `throw redirect("/login")`
- **Wrapper-funktion:** `apiFetch` pakker stadig `fetch()` ind. Før lagde den noget til requestet. Nu lægger den også noget til svaret. Idéen hedder også Decorator pattern
- **Guard clause:** et `if`, der fanger `401` og stopper. Resten går den lykkelige vej. `requireAuth` er bygget på samme måde, bare i backenden
</details>
<details>
<summary><strong>5. Query parameters, Encapsulation og open redirect</strong></summary>

- `apiFetch` skriver siden ind i URL'en til login: `/login?redirect=/chat/abc`. I kender query parameters fra `?registered=true` på login
- **Encapsulation:** login ved ikke, hvorfor brugeren kom. Den læser bare `redirect`. Routes ved ikke, at `apiFetch` kan sende til login
- **Open redirect:** gå til `/login?redirect=https://example.com`, og log ind. Hvor ender I? Samme lektie som XSS i AMAbotten: stol ikke på input
</details>
<details>
<summary><strong>6. Afrunding: begreberne i koden og step 17</strong></summary>

- Peg på ét sted i jeres kode for DRY, SoC, SRP og Encapsulation
- I går talte I tråde pr. bruger i SQL. Log ind som dig selv, opret en tråd, og kør jeres query igen. Hvem fik en tråd mere?
- Backenden kender `req.userId`, men SQL'en bruger det ikke endnu. Det retter I i step 17 i morgen, så hver bruger kun ser sine egne tråde
- Har I tid tilbage: optag en Playwright-test af, at `/chat/new` uden login ender på login
- Commit undervejs, og push, når I er færdige
</details>

---

## Forberedelse

- Bliv færdig med [step 16](https://github.com/bewildergeist/chatbot-react-postgres/pull/16) fra i går, så API'et svarer `401` uden token. Mangler du noget, så brug [Chatbot step 16](../opgaver/chatbot-step-16-tjek-tokenet.md)
- Hav chatbotten kørende lokalt med en bruger, du kan logge ind med, og opret en ekstra testbruger
- Skim "Overview" i [step 18](https://github.com/bewildergeist/chatbot-react-postgres/pull/18)
- Genopfrisk de fire begreber og guard clause i [slides om sikkerhed og error handling](https://cederdorff.com/wu-e26a/fejlhaandtering-sikkerhed/)
- Supplerende, hvis du har tid:
  - ["User sessions"](https://supabase.com/docs/guides/auth/sessions) i Supabase' dokumentation, om access token og refresh token

---

## Materialer

- Opgaver:
  - [Chatbot step 18: Send brugeren til login ved 401](../opgaver/chatbot-step-18-send-til-login.md): step 18 på dansk og i mindre trin
  - [Chatbot step 16: Backenden tjekker tokenet](../opgaver/chatbot-step-16-tjek-tokenet.md): hvis du mangler noget af step 16
  - [Chatbot React Postgres](https://github.com/bewildergeist/chatbot-react-postgres)
    - [Chatbot-tutorial, step 18: Redirect to login on auth errors](https://github.com/bewildergeist/chatbot-react-postgres/pull/18)
- Links:
  - ["redirect"](https://reactrouter.com/api/utils/redirect) i React Routers dokumentation
  - ["401 Unauthorized"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401) på MDN
  - ["encodeURIComponent()"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) på MDN
  - ["Unvalidated Redirects and Forwards"](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html) hos OWASP

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178081
canvas_module_position: 58
canvas_module_published: false
canvas_module_item_id: 1018778
canvas_module_item_position: 1
canvas_page_id: 200739
canvas_page_slug: "plan-for-race-11-session-expiration-handling-i-frontend"
canvas_page_title: "Plan for RACE 11 - Session expiration handling i Frontend"
canvas_page_published: false
canvas_updated_at: "2026-08-10T12:34:40Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018778"
local_status: mirrored
```

</details>
