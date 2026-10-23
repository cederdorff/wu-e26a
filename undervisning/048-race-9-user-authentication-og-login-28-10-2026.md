# RACE 9 - User authentication og login - 28-10-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Jeres chatbot kan nu oprette, læse, redigere og slette tråde via jeres eget Express API. Men den ved ikke, hvem der bruger den. Alle ser alles tråde, alle kan slette alt, og ingen kan se, hvem der skrev hvad.

Vi starter med at prøve at ødelægge jeres egen chatbot, så I selv ser hullerne. Derefter lukker vi det første af dem: brugeren skal kunne oprette en konto og logge ind. Det gør vi i et lille, nyt projekt, `react-supabase-auth`, med samme opsætning som chatbotten. Undervejs ser vi på, hvorfor passwords aldrig gemmes i klartekst, hvad hashing og salt er, og hvad der står i det JWT, I får tilbage, når I logger ind.

Hver øvelse svarer til en delopgave i [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14) i [chatbot-tutorialen](https://github.com/bewildergeist/chatbot-react-postgres). Når dagen er slut, kender I alle dele af step 14 og kan lave det selv i chatbotten i selvstudiet torsdag og i gruppearbejdet fredag.

---

## Agenda

<details>
<summary><strong>1. Opsamling: Prøv at ødelægge jeres chatbot (8.15-8.35)</strong></summary>

- Start jeres chatbot, både frontend og backend
- To og to, 10 minutter. Åbn chatbotten i to browsere, eller i et normalt vindue og et inkognitovindue:
  - Opret en tråd i den ene browser. Kan den anden se den?
  - Slet eller omdøb den i den anden browser
  - Send `GET /api/threads` fra Thunder Client. Hvad får I?
  - Åbn `threads`-tabellen i Supabase. Hvor står det, hvem der ejer en tråd?
- Skriv hullerne ned. Vi samler dem på tavlen og vender tilbage til listen sidst på dagen
- De fleste huller handler om to spørgsmål: Hvem er du? Og hvad må du?
- **Authentication:** hvem er du? Login med email og password
- **Authorization:** hvad må du? Kun se og slette dine egne tråde
- I dag tager vi det første spørgsmål og kun i frontenden. Det andet kommer, når backenden begynder at kræve et token
</details>
<details>
<summary><strong>2. Nyt projekt og Supabase-klienten: øvelse 1-3 (8.35-9.05)</strong></summary>

- Vi øver login i et lille projekt, så I kan se hver del for sig, uden backend, tråde og sidebar omkring. Bagefter laver I det samme i chatbotten
- Øvelse 1: hent `react-supabase-auth` med degit. Opsætningen er den samme som i chatbotten: React Router i SPA-mode med `clientAction` og `clientLoader`
- Indtil nu har I brugt Supabase som database. Nu bruger I også Supabase Auth, som står for brugere, passwords og tokens. I bruger jeres eksisterende Supabase-projekt
- Øvelse 2: installér `@supabase/supabase-js`, kopiér URL og key fra chatbottens `.env`, og lav én fælles klient i `app/lib/supabase.js`
- **Anon key vs. service role key:** anon key må gerne ligge i browseren, fordi Supabase selv tjekker, hvad den må. Service role key giver adgang til alt og må aldrig ligge i frontenden. Sammenlign med jeres Groq-nøgle, der kun ligger i backendens `.env`
- Slå "Confirm email" fra i Supabase. Supabase sender kun få mails i timen, og I skal oprette mange testbrugere i dag
- Øvelse 3: registrér `/register` og `/login` i `routes.js`
</details>
<details>
<summary><strong>3. Opret en bruger: øvelse 4-5 (9.05-9.50)</strong></summary>

- Øvelse 4: tryk "Create Account" uden en `clientAction`, og læs fejlen. Skriv derefter en `clientAction` med `supabase.auth.signUp()`, ligesom formularerne til nye tråde og beskeder i chatbotten
- Find brugeren i Supabase og kolonnen `encrypted_password` i `auth.users`. Opret en bruger mere med samme password. Er de to hashes ens?
- Forestil jer, at I havde gemt brugere med password i en JSON-fil, som I gjorde med students. Hvad sker der, hvis filen eller databasen bliver lækket?
- **Hashing:** et password køres gennem en funktion, der giver en fast tekststreng. Man kan ikke regne baglæns fra hash til password. Ved login hasher man det indtastede password igen og sammenligner de to hashes
- **Salt:** et tilfældigt stykke tekst, der lægges til hvert password, før det hashes. Derfor var jeres to hashes forskellige
- **bcrypt** er en hash-funktion, der er lavet til passwords. Den er bevidst langsom, så det tager lang tid at gætte sig frem. Hashen starter med `$2a$`
- Øvelse 5: opret en bruger med to forskellige passwords. Det lykkes, fordi ingen tjekker det. Tilføj validering i `clientAction`, og vis fejlen med `useActionData()`
- **Tre lag validering:** HTML (`required`, `minLength`), jeres `clientAction` og Supabase. I fjerner selv de to første og ser, at Supabase stadig afviser et kort password. Kun det sidste lag ligger på serveren, ligesom I sendte requests uden om formularen med Thunder Client i opsamlingen
</details>

**Pause 9.50-10.05**

<details>
<summary><strong>4. Log ind og kig i jeres JWT: øvelse 6-7 (10.05-10.45)</strong></summary>

- Øvelse 6: gør det samme for login med `supabase.auth.signInWithPassword()`. Fejlbeskeden siger ikke, om det er emailen eller passwordet, der er forkert. Hvorfor?
- Hvad sker der ved login? Browseren sender email og password til Supabase. Supabase hasher og sammenligner, og svarer med et token, som klienten gemmer i localStorage
- Øvelse 7: find nøglen `sb-...-auth-token` i Local Storage, og indsæt `access_token` på [jwt.io](https://jwt.io)
- **JWT** (JSON Web Token) har tre dele adskilt af punktummer: header, payload og signatur. Find jeres bruger-id i `sub`, jeres email og udløbstiden i `exp`
- Et JWT er kun kodet, ikke krypteret. Alle kan læse payloaden, så der må aldrig stå hemmeligheder i den
- **Signatur:** Supabase har underskrevet tokenet. Ændrer man noget i payloaden, passer signaturen ikke længere
- **Access token vs. refresh token:** access token udløber efter en time. Refresh token bruges til at hente et nyt, og det klarer Supabase-klienten selv
</details>
<details>
<summary><strong>5. Profilside: øvelse 8-9 (10.45-11.10)</strong></summary>

- Øvelse 8: en `/profile`-side, der henter brugeren i en `clientLoader` med `supabase.auth.getUser()` og sender til `/login`, hvis ingen er logget ind
- Prøv at ødelægge det: ret ét bogstav i jeres token i Local Storage, og genindlæs. `getUser()` sender tokenet til Supabase, som afviser det, fordi signaturen ikke passer. Derfor kan man ikke bare ændre sit bruger-id i tokenet
- Øvelse 9 er en bonus: log ud med `supabase.auth.signOut()`, og se tokenet forsvinde fra Local Storage. Logout kommer i chatbotten i næste step
</details>
<details>
<summary><strong>6. Fra øvelserne til step 14 (11.10-11.30)</strong></summary>

- Vi åbner [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14) sammen og sætter øvelsesnumre på hver delopgave. Tabellen står sidst i opgaven
- Forskellene: I skriver selv formularerne, routes skal stå uden for layoutet, så sidebaren ikke vises, og login sender til `/` i stedet for `/profile`
- Tilbage til tavlen fra opsamlingen: Hvilke huller kan login lukke? Endnu ingen. Frontenden ved, hvem I er, men backenden gør ikke. Det kommer i de næste steps, når tokenet sendes med i alle requests, og backenden begynder at kræve det
- **Torsdag og fredag:** lav step 14 i chatbotten. Er I ikke færdige med step 13, så hent startpunktet med `npx degit --force bewildergeist/chatbot-react-postgres#pr-14-start`, og commit det, før I ændrer noget. Har I lavet AI-svarene på en branch, så bliv på `main`. Branchen merger I ind efter auth-stepsene
- Fredag arbejder I i bordgrupperne og hjælper hinanden. Når I er i mål, så log ind med to forskellige brugere i hver sin browser i chatbotten. Ser de stadig de samme tråde? Og står jeres token i Network-fanen, når chatbotten kalder jeres API? Tag svarene med næste gang. Vi starter med dem
</details>

---

## Forberedelse

- Sørg for at være færdig med [step 13](https://github.com/bewildergeist/chatbot-react-postgres/pull/13), så jeres frontend og backend kører
- Skim "Overview" i [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14), så du ved, hvad vi skal bygge
- Find URL og key til jeres Supabase-projekt i chatbottens `frontend/.env`. Dem skal I bruge i dag
- På [Scrimba](https://scrimba.com/fullstack-path-c0fullstack):
  - Intro to Supabase > Authentication, til og med "Navigate after sign out"
- Supplerende, hvis du har tid:
  - Fullstack > Express.js > Authentication, frem til "Hash the password", hvis du ikke nåede det i selvstudiet
  - ["Introduction to JSON Web Tokens"](https://jwt.io/introduction) på jwt.io

---

## Materialer

- Opgaver:
  - [React Supabase Auth: Login før chatbotten](../opgaver/react-supabase-auth.md): øvelse 1-9. Opret en bruger, log ind, kig i jeres JWT, og byg en profilside
    - [Løsning til react-supabase-auth](https://github.com/cederdorff/react-supabase-auth): én branch pr. øvelse. Prøv selv først
  - [Chatbot React Postgres](https://github.com/bewildergeist/chatbot-react-postgres)
    - [Chatbot-tutorial, step 14: Frontend register and signup routes](https://github.com/bewildergeist/chatbot-react-postgres/pull/14)
- Links:
  - [jwt.io](https://jwt.io): dekod jeres eget access token
  - ["Auth"](https://supabase.com/docs/guides/auth) i Supabase-dokumentationen
  - ["Password Storage Cheat Sheet"](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) hos OWASP

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178071
canvas_module_position: 48
canvas_module_published: true
canvas_module_item_id: 1018760
canvas_module_item_position: 1
canvas_page_id: 200733
canvas_page_slug: "plan-for-race-9-user-authentication-og-login"
canvas_page_title: "Plan for RACE 9 - User authentication og login"
canvas_page_published: false
canvas_updated_at: "2026-08-10T12:34:32Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018760"
local_status: mirrored
```

</details>
