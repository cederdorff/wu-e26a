# RACE 9 - User authentication og login - 28-10-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Jeres chatbot kan nu oprette, læse, redigere og slette tråde via jeres eget Express API. Men den ved ikke, hvem der bruger den. Alle ser alles tråde, alle kan slette alt, og ingen kan se, hvem der skrev hvad.

I går så I forskellen på authentication og authorization, og I hashede selv passwords med `crypt` i SQL Editor. I dag sætter vi login op i frontenden med Supabase Auth.

Vi starter med at prøve at ødelægge jeres egen chatbot, så I selv ser hullerne. Derefter lukker vi det første af dem: brugeren skal kunne oprette en konto og logge ind. Det gør vi i et lille, nyt projekt, `react-supabase-auth`, med samme opsætning som chatbotten. Undervejs finder I de samme bcrypt-hashes, som I lavede i går, i jeres egen `auth.users`, og I kigger i det JWT, I får tilbage, når I logger ind.

De fleste øvelser svarer til en delopgave i [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14) i [chatbot-tutorialen](https://github.com/bewildergeist/chatbot-react-postgres). Når dagen er slut, kender I alle dele af step 14 og kan lave det selv i chatbotten i selvstudiet torsdag og i gruppearbejdet fredag.

---

## Agenda

<details>
<summary><strong>1. Hvad mangler chatbotten?</strong></summary>

- Start jeres chatbot, både frontend og backend. Nåede I ikke step 11-13, så brug degit-kommandoen under Forberedelse
- To og to, 10 minutter. Prøv at ødelægge jeres chatbot. Åbn den i to browsere, eller i et normalt vindue og et inkognitovindue:
  - Opret en tråd i den ene browser. Kan den anden se den?
  - Slet eller omdøb den i den anden browser
  - Send `GET /api/threads` fra Thunder Client. Hvad får I?
  - Åbn `threads`-tabellen i Supabase. Hvor står det, hvem der ejer en tråd?
- Skriv hullerne ned. Vi samler dem på tavlen og vender tilbage til listen sidst på dagen
- Sortér hullerne, som I sorterede situationerne i går: Er det authentication eller authorization?
- I dag lukker vi authentication og kun i frontenden. Brugeren logger ind med email og password og får et token tilbage. Authorization kommer, når backenden begynder at kræve tokenet
</details>
<details>
<summary><strong>2. Supabase Auth: øvelse 1-3</strong></summary>

- Login er svært at bygge sikkert selv. Man skal gemme passwords sikkert, udstede og forny tokens, sende bekræftelsesmails og meget mere
- **Supabase Auth** er den del af Supabase, der klarer det for jer. Indtil nu har I brugt Supabase som database. Nu bruger I også Supabase Auth i samme projekt
- Brugerne ligger i tabellen `auth.users`, adskilt fra jeres egne tabeller. Passwords bliver hashet, før de gemmes, og ved login får brugeren et JWT
- I taler med Supabase Auth gennem JavaScript-klienten `@supabase/supabase-js`: `signUp()` opretter en bruger, `signInWithPassword()` logger ind, `getUser()` henter den indloggede bruger, og `signOut()` logger ud
- Vi øver det i et lille projekt, `react-supabase-auth`, så I kan se hver del for sig, uden backend, tråde og sidebar omkring. Opsætningen er den samme som i chatbotten: React Router i SPA-mode med `clientAction` og `clientLoader`
- Vis billedet under "Det bygger du" øverst i opgaven: hvilke sider alle kan se, og hvilken der kræver login
- Øvelse 1: hent projektet med degit
- Øvelse 2: installér `@supabase/supabase-js`, kopiér URL og key fra chatbottens `.env`, og lav én fælles klient i `app/lib/supabase.js`, som resten af appen importerer
- **Miljøvariabler:** `.env` indeholder jeres egne værdier og bliver aldrig committet. `.env.example` viser, hvilke variabler projektet skal bruge, og bliver committet. Vite giver adgang til dem med `import.meta.env`, men kun dem, der starter med `VITE_`, fordi alt med `VITE_` ender i browseren. Mangler en variabel, kaster `supabase.js` en tydelig fejl med det samme
- **Anon key vs. service role key:** anon key må gerne ligge i browseren, fordi Supabase selv tjekker, hvad den må. Har jeres projekt en publishable key (`sb_publishable_...`), virker den på samme måde. Service role key og secret key giver adgang til alt og må aldrig ligge i frontenden. Sammenlign med jeres Groq-nøgle, der kun ligger i backendens `.env`
- Slå "Confirm email" fra i Supabase. Supabase sender kun få mails i timen, og I skal oprette mange testbrugere i dag
- Øvelse 3: registrér `/register` og `/login` i `routes.js`
</details>
<details>
<summary><strong>3. Opret en bruger: øvelse 4</strong></summary>

- Tryk "Create Account" uden en `clientAction`, og læs fejlen
- `<Form method="post">` sender til routens egen `clientAction`, ligesom formularerne til nye tråde og beskeder i chatbotten. Den henter felterne med `formData.get()`
- Kig på formularens markup. Den kan I lade jer inspirere af i step 14: `name` er det, `formData.get()` læser. `<label htmlFor>` hører sammen med inputtets `id`. `type="email"` og `type="password"` giver det rigtige tastatur og skjuler passwordet. `autoComplete="new-password"` ved oprettelse og `"current-password"` ved login hjælper browserens password-manager
- Øvelse 4: opret brugeren med `supabase.auth.signUp()`, og send videre med `redirect("/login?registered=true")`
</details>
<details>
<summary><strong>4. Passwords i Supabase Auth</strong></summary>

- I går kørte I `crypt('hemmelig123', gen_salt('bf', 10))` i SQL Editor. Supabase gør det samme med jeres password, når I kalder `signUp()`
- Hvad med vejen fra formularen til Supabase? Opret en bruger med Network-fanen åben, og find requestet til `/auth/v1/signup`. Passwordet står i klartekst i requestets body, men forbindelsen til Supabase er HTTPS, så det er krypteret på vejen. Først hos Supabase bliver det hashet
- Find brugeren under Authentication → Users og i tabellen `auth.users`. Kolonnen `encrypted_password` starter med `$2a$`, ligesom jeres `crypt`-hash
- Opret en bruger mere med samme password. Er de to hashes ens? Nej, for hver bruger får sin egen salt
</details>
<details>
<summary><strong>5. Validering: øvelse 5</strong></summary>

- Opret en bruger med to forskellige passwords. Det lykkes, fordi ingen tjekker det
- Øvelse 5: tilføj validering i `clientAction`, og returnér `{ error: "..." }` i stedet for at sende videre
- `useActionData()` giver componenten det, `clientAction` returnerede, så fejlen kan vises i formularen. `useNavigation()` fortæller, om formularen er ved at blive sendt, så knappen kan slås fra og vise "Creating account..."
- **Tre lag validering:** HTML (`required`, `minLength`), jeres `clientAction` og Supabase. I fjerner selv de to første og ser, at Supabase stadig afviser et kort password
- De to første lag giver hurtig feedback, men enhver kan komme uden om dem, ligesom I gik uden om frontenden med Thunder Client i starten af dagen. Kun det sidste lag ligger på serveren
</details>
<details>
<summary><strong>6. Log ind: øvelse 6</strong></summary>

- Hvad sker der ved login? Browseren sender email og password til Supabase. Salten står i selve hashen i `auth.users`, så Supabase kan hashe det indtastede password med samme salt og sammenligne. Det er svaret på spørgsmål 3 i `crypt`-opgaven. Passer de, svarer Supabase med et token, som klienten gemmer i localStorage
- Øvelse 6: gør det samme for login med `supabase.auth.signInWithPassword()`
- Fejlbeskeden siger ikke, om det er emailen eller passwordet, der er forkert. Hvorfor?
- `useSearchParams()` læser `?registered=true` fra URL'en, så login-siden kan byde en ny bruger velkommen
</details>
<details>
<summary><strong>7. Token og JWT: øvelse 7</strong></summary>

- **Token:** en tekststreng, der beviser, hvem du er, i en begrænset tid. Et request fortæller ikke selv, hvem det kommer fra. Derfor sender appen tokenet med i stedet for passwordet. Det svarer til et armbånd på en festival: I viser billet og ID én gang ved indgangen. Bagefter kigger vagterne kun på armbåndet
- **JWT** (JSON Web Token): et token, hvor oplysningerne om dig står som JSON, underskrevet af Supabase. Alle kan læse det, men ingen kan rette i det. Det token, I fik i øvelse 6, er et JWT
- Øvelse 7: find nøglen `sb-...-auth-token` i Local Storage, og indsæt `access_token` på [jwt.io](https://jwt.io)
- Et JWT har tre dele adskilt af punktummer: header, payload og signatur. Find jeres bruger-id i `sub`, jeres email og udløbstiden i `exp`
- Et JWT er kun kodet, ikke krypteret. Alle kan læse payloaden, så der må aldrig stå hemmeligheder i den
- **Signatur:** Supabase har underskrevet tokenet. Ændrer man noget i payloaden, passer signaturen ikke længere. Det er den signatur, backenden skal tjekke, som i en af situationerne i går
- **Access token vs. refresh token:** access token udløber efter en time. Refresh token bruges til at hente et nyt, og det klarer Supabase-klienten selv
</details>
<details>
<summary><strong>8. Sider, der kræver login: øvelse 8-9</strong></summary>

- Øvelse 8: en `/profile`-side, der henter brugeren i en `clientLoader` med `supabase.auth.getUser()` og sender til `/login`, hvis ingen er logget ind
- Prøv at ødelægge det: ret ét bogstav midt i jeres token i Local Storage, og genindlæs. Ikke det sidste tegn, for de sidste bits i signaturen bruges ikke altid. `getUser()` sender tokenet til Supabase, som afviser det, fordi signaturen ikke passer. Derfor kan man ikke bare ændre sit bruger-id i tokenet
- Øvelse 9 er en bonus: log ud med `supabase.auth.signOut()`, og se tokenet forsvinde fra Local Storage. Logout kommer i chatbotten i næste step
</details>
<details>
<summary><strong>9. Fra øvelserne til step 14</strong></summary>

- Vi åbner [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14) sammen og sætter øvelsesnumre på hver delopgave. Tabellen står sidst i opgaven
- Lad jer inspirere af jeres `register.jsx` og `login.jsx`, når I laver siderne i chatbotten. Klasserne og CSS'en er de samme. Forskellen er, at login sender til `/` i stedet for `/profile`
- Step 14 siger, at I bliver logget ud, hvis I retter ét tegn i tokenet. I chatbotten sker der ikke noget endnu, fordi intet kalder `getUser()`. I så det på `/profile` i øvelse 8
- **Layout-routes:** i chatbottens `routes.js` ligger alle sider inde i `layout.jsx`, som viser sidebaren og et `<Outlet />`. Login og register skal ikke have sidebar, så de skal stå efter layout-routen, ikke inde i den. Billedet af chatbotten efter step 14 sidst i opgaven viser det
- **Styling:** chatbotten har allerede de samme CSS-variabler i `:root`, som `react-supabase-auth` bruger. Kopiér afsnittet `Authentication Pages` fra `app.css`, og tab jer gennem formularen for at se fokus-stylingen
- Tilbage til listen på tavlen: Hvilke af authentication-hullerne kan login lukke? Endnu ingen. Frontenden ved, hvem I er, men backenden gør ikke. Det kommer i de næste steps, når tokenet sendes med i alle requests, og backenden begynder at kræve det. Vis billedet under "Hvor ender chatbotten?" sidst i opgaven
- Hvor stod det, hvem der ejer en tråd? Det id, I så i `sub` og på `/profile`, er det, tråde skal knyttes til senere
- **Torsdag og fredag:** lav step 14 i chatbotten. Er I ikke færdige med step 13, så brug degit-kommandoen under Forberedelse. Husk at installere `@supabase/supabase-js` inde i `frontend/`, hvor `package.json` og `.env` ligger. Har I lavet AI-svarene på en branch, så bliv på `main`. Branchen merger I ind efter auth-stepsene
- Fredag arbejder I i bordgrupperne og hjælper hinanden. Når I er i mål, så log ind med to forskellige brugere i hver sin browser i chatbotten. Ser de stadig de samme tråde? Og står jeres token i Network-fanen, når chatbotten kalder jeres API? Tegn også login-flowet, fra brugeren trykker "Log In", til tokenet ligger i Local Storage. Tag tegningen og svarene med næste gang. Vi starter med dem
</details>

---

## Forberedelse

- Bliv færdig med step 11 til [13](https://github.com/bewildergeist/chatbot-react-postgres/pull/13) fra i går, så din frontend og backend kører. Når du det ikke, så hent startpunktet i roden af dit chatbot-repo med `npx degit --force bewildergeist/chatbot-react-postgres#pr-14-start`, og commit det, før du ændrer noget. Startpunktet følger tutorialen og opretter tråde uden `user_id`, så sæt `TEST_USER_ID` ind i `backend/server.js` igen, som i trin 12
- Skim "Overview" i [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14), så du ved, hvad vi skal bygge
- Find URL og key til dit Supabase-projekt i chatbottens `frontend/.env`. Dem skal du bruge i dag
- På Scrimba:
  - [Intro to Supabase](https://scrimba.com/intro-to-supabase-c0abltfqed) > Authentication, til og med "Navigate after sign out"
- Supplerende, hvis du har tid:
  - ["Introduction to JSON Web Tokens"](https://jwt.io/introduction) på jwt.io

---

## Materialer

- Slides:
  - [RACE 9 · User authentication og login](https://cederdorff.com/wu-e26a/supabase-auth/)
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
canvas_page_published: true
canvas_updated_at: "2026-08-10T12:34:32Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018760"
local_status: mirrored
```

</details>
