# RACE 11 - Authorization og session expiration - 11-11-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I går fik backenden `requireAuth`. Nu ved den, hvem der spørger, og svarer `401` uden et gyldigt token. Men to ting mangler. SQL'en bruger ikke `req.userId`, så alle ser alle tråde. Og frontenden ved ikke, hvad den skal gøre med `401`, så brugeren ser en fejlside.

I dag retter I begge dele, i rækkefølge:

- [Chatbot step 17](../opgaver/chatbot-step-17-kun-egne-traade.md): hver bruger ser og ændrer kun sine egne tråde. MAGL talte om det i går
- [Chatbot step 18](../opgaver/chatbot-step-18-send-til-login.md): `apiFetch` sender brugeren til login ved `401` og bagefter tilbage, hvor de var

Begge opgaver følger tutorialen, bare på dansk og i mindre trin. Koden er kort, så vi bruger tiden på, hvorfor den står, hvor den står. Målet er, at I kommer godt i gang med begge. Det, I ikke når, samler MAGL op på.

---

## Agenda

<details>
<summary><strong>1. Opsamling: requireAuth og 401</strong></summary>

- Rundt om bordet: hvor nåede I til i går, og hvad fik I implementeret?
- Hvad gør `requireAuth`? Hvad svarede API'et i curl-testen i MAGL's arbejdsark i går, uden token og med `Bearer abc123`?
- Med jeres eget token: hvilke tråde fik I? Det er step 17
- Log ud, og gå til forsiden. Hvad sker der? Det er step 18
- Nåede I ikke step 16 i går, så brug startpunktet i step 17-opgaven
- Har I deployet backenden på Render, skal den nu også have `SUPABASE_URL` og `SUPABASE_ANON_KEY`
</details>
<details>
<summary><strong>2. Authentication og authorization (step 17)</strong></summary>

- **Authentication og authorization:** "hvem er du?" tjekker `requireAuth`. "Hvad må du?" er step 17. Step 17, øvelse 1: ret bobs tråd fra Thunder Client med dit eget token
- Ejeren kommer fra `req.userId`, ikke fra body'en. Tokenet kan ingen ændre uden at ødelægge signaturen
- **SoC:** backenden afgør, hvem der må hvad, ikke frontenden. Og filtreringen hører hjemme i SQL med `WHERE`, ikke i `.filter()` i JavaScript. Så forlader andres tråde aldrig databasen
- **404 og ikke 403:** MAGL spurgte i går, hvad API'et skal svare, når bob beder om alices tråd. Med `404` ved bob ikke, om tråden findes
</details>
<details>
<summary><strong>3. Session expiration (step 18, øvelse 1)</strong></summary>

- I kender `exp` fra tokenets payload. Hos Supabase udløber et access token efter en time. Så virker et stjålet token ikke for evigt
- Før det udløber, henter Supabase et nyt med refresh tokenet. Det gør `getSession()` i `apiFetch` også. Brugeren mærker ingenting
- `401` kommer, når tokenet bliver afvist: brugeren er logget ud, tokenet er ødelagt, eller brugeren er slettet. Så er sessionen slut, og kun login hjælper
- Step 18, øvelse 1: ret ét bogstav i `access_token`, og se, hvad brugeren oplever. Vi sletter også en testbruger i Supabase live, mens den er logget ind
</details>
<details>
<summary><strong>4. DRY, SoC og SRP (step 18, øvelse 2)</strong></summary>

- Routes håndterer allerede deres egne fejl: `400` i formularen og `404` fra step 17 som "Thread Not Found". `401` kan ingen route gøre noget ved
- **DRY:** tjekket står ét sted, i `apiFetch`, og ikke i alle loaders og actions. Ligesom `requireAuth` i går: én middleware i stedet for et tjek i hver route
- **SoC og SRP:** `apiFetch` har ét ansvar: at tale med API'et som den bruger, der er logget ind. Hvad skulle der ske med `apiFetch`, hvis den også håndterede `404`?
- **Wrapper-funktion:** før lagde `apiFetch` noget til requestet. Nu kigger den også på svaret. Idéen kaldes også Decorator pattern
- `throw redirect("/login")`: I kender `return redirect()` fra `/profile`. `apiFetch` er ikke en loader, så den kaster redirecten
- **Guard clause:** et `if`, der fanger `401` og stopper. `requireAuth` er bygget på samme måde, bare i backenden
</details>
<details>
<summary><strong>5. Query parameters og open redirect (step 18, øvelse 3)</strong></summary>

- `apiFetch` skriver siden ind i URL'en til login: `/login?redirect=%2Fchat%2Fabc`. I kender query parameters fra `?registered=true` på login
- **Encapsulation:** login ved ikke, hvorfor brugeren kom. Den læser bare `redirect`. Routes ved ikke, at `apiFetch` kan sende til login
- Hvorfor står siden i URL'en og ikke i localStorage?
- **Open redirect:** gå til `/login?redirect=https://example.com`, og log ind. Hvor ender I? Samme lektie som XSS i AMAbotten: stol ikke på input
- Commit efter hvert step, og push, når I er færdige
</details>

---

## Forberedelse

- Bliv færdig med [step 16](https://github.com/bewildergeist/chatbot-react-postgres/pull/16) fra i går, så API'et svarer `401` uden token. Mangler du noget, så brug [Chatbot step 16](../opgaver/chatbot-step-16-tjek-tokenet.md)
- Hav chatbotten kørende lokalt med en bruger, du kan logge ind med, og opret en ekstra testbruger
- Skim "Overview" i [step 17](https://github.com/bewildergeist/chatbot-react-postgres/pull/17) og [step 18](https://github.com/bewildergeist/chatbot-react-postgres/pull/18)
- Genopfrisk de fire begreber og guard clause i [slides om sikkerhed og error handling](https://cederdorff.com/wu-e26a/fejlhaandtering-sikkerhed/)
- Supplerende, hvis du har tid:
  - ["User sessions"](https://supabase.com/docs/guides/auth/sessions) i Supabases dokumentation, om access token og refresh token

---

## Materialer

- **Slides:**
  - [RACE 11 · Authorization og session expiration](https://cederdorff.com/wu-e26a/session-expiration/)
- **Opgaver:**
  - [Chatbot step 17: Kun dine egne tråde](../opgaver/chatbot-step-17-kun-egne-traade.md): dagens første step
  - [Chatbot step 18: Send brugeren til login ved 401](../opgaver/chatbot-step-18-send-til-login.md): dagens andet step
  - [Chatbot step 16: Backenden tjekker tokenet](../opgaver/chatbot-step-16-tjek-tokenet.md): hvis du mangler noget af step 16
  - [Chatbot React Postgres](https://github.com/bewildergeist/chatbot-react-postgres)
    - [Chatbot-tutorial, step 17: API authorization and data isolation](https://github.com/bewildergeist/chatbot-react-postgres/pull/17)
    - [Chatbot-tutorial, step 18: Redirect to login on auth errors](https://github.com/bewildergeist/chatbot-react-postgres/pull/18)
- **Links:**
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
canvas_module_published: true
canvas_module_item_id: 1018778
canvas_module_item_position: 1
canvas_page_id: 200739
canvas_page_slug: "plan-for-race-11-authorization-og-session-expiration"
canvas_page_title: "Plan for RACE 11 - Authorization og session expiration"
canvas_page_published: true
canvas_updated_at: "2026-11-10T15:21:54Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018778"
local_status: mirrored
```

</details>
