# RACE 8 - Thinking in React - 06-10-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I dag starter vi på frontend-delen af Chatbot-forløbet med React, helt forfra med et nyt projekt. Hvad er React, hvorfor bruger så mange det, og hvordan tænker man, når man bygger en brugerflade i React?

Hele dagen arbejder vi i ét projekt, `my-first-react-app`. Vi skifter mellem korte oplæg og små øvelser, og hver gang bygger I lidt videre på jeres egen app. Når I er færdige, viser appen et grid af users med data hentet fra en rigtig URL. Undervejs møder I imperativ vs. deklarativ, Virtual DOM, JSX, components og props. Til sidst går vi i gang med chatbot-tutorialen, som hele forløbet bygger videre på.

Når dagen er slut, har I jeres egen `my-first-react-app` på GitHub og er godt i gang med [step 1](https://github.com/bewildergeist/chatbot-react-postgres/pull/1) og [step 2](https://github.com/bewildergeist/chatbot-react-postgres/pull/2) i [chatbot-tutorialen](https://github.com/bewildergeist/chatbot-react-postgres).

---

## Agenda

<details>
<summary><strong>1. Intro til React: hvad, hvorfor og hvordan?</strong></summary>

- **Hvad:** et JavaScript-bibliotek til at bygge brugerflader, lavet af Meta. React håndterer kun UI'et, ikke server, database eller routing
- **Hvorfor:** UI'et bygges af små, genbrugelige components, siden opdateres automatisk, når data ændrer sig, og der er et stort økosystem og et stort jobmarked
- **Hvordan:** React kører i browseren og bygger siden dér. Det er client-side rendering, som I præsenterede i sidste uge
- Kendte eksempler: Facebook, Instagram, Netflix og Airbnb er bygget med React
- **Imperativ vs. deklarativ:** den samme liste af users, side om side. Vanilla JS med `document.querySelector`, en løkke og `insertAdjacentHTML`, mod React med `users.map(...)` i JSX
- Diskutér to og to: der kommer en ny user. Hvad skal I selv huske at gøre i den imperative version? Hvad med den deklarative?
- Kerneidéen: **UI = f(data)**. Når data ændrer sig, tegnes UI'et igen ud fra de nye data
- **Virtual DOM:** React bygger først siden som et letvægts-træ af JavaScript-objekter. Når data ændrer sig, laver React et nyt træ, sammenligner det med det forrige og ændrer kun de dele af den rigtige DOM, der faktisk er forskellige
</details>
<details>
<summary><strong>2. Nyt projekt med Vite: øvelse 1-2</strong></summary>

- Vite er et build-værktøj og en udviklingsserver. Den forstår JSX og opdaterer siden, så snart I gemmer
- Tjek jeres Node-version med `node -v`. Vite kræver mindst Node 20.19 eller 22.12. Er jeres ældre, så installér den nyeste LTS-version fra [nodejs.org](https://nodejs.org/)
- Øvelse 1: opret mappen `my-first-react-app` der, hvor I har jeres kodeprojekter, og åbn kun den mappe i VS Code
- Åbn terminalen i VS Code. På Windows skal I vælge Command Prompt, fordi PowerShell ofte blokerer npm
- Kør `npm create vite@latest .`, vælg React, JavaScript og Oxlint, og sig ja til at installere og starte. Punktummet betyder, at projektet bliver lavet i den mappe, I står i
- Åbn den URL, terminalen viser ved `Local`. Er port 5173 optaget, vælger Vite selv den næste, fx 5174
- Gennemgå sammen mappestrukturen: `index.html` med `<div id="root">`, `src/main.jsx`, der monterer appen, og `src/App.jsx`, der er jeres første component
- Øvelse 2: ret teksten i `App.jsx`, gem, og se siden opdatere. Åbn DevTools' Elements-panel, og tryk på tæller-knappen. Kun tallet i knappen blinker. Det er Virtual DOM i praksis
</details>
<details>
<summary><strong>3. JSX: øvelse 3</strong></summary>

- **JSX** ligner HTML, men er JavaScript. `className` i stedet for `class`, alle tags skal lukkes (`<img />`), og en component returnerer ét rod-element eller et fragment `<>...</>`
- `{ }` indsætter et JavaScript-udtryk: en variabel, en template literal eller en `.map()`
- Øvelse 3: ryd Vites startside, og skriv `<h1>Users</h1>` og `<h2>Hello, {name}</h2>`. Fjern fragmentet, læs fejlen, og sæt det ind igen
</details>
<details>
<summary><strong>4. Thinking in React: øvelse 4</strong></summary>

- Thinking in React: UI'et er bygget af **components**, der får data via **props** og husker data i **state**
- Øvelse 4, to og to: tag et screenshot af den færdige users-app. Tegn kasser om de dele, der hører sammen, og navngiv dem. Hvilke kasser går igen? Tegn hierarkiet som et træ, og skriv, hvilke data hver kasse skal bruge
- Sammenlign med jeres sidemakker. Bagefter ser vi vores bud i plenum: `App` med en `Header` og en `UserList`, der viser én `User` pr. person
- Se også de fem trin i ["Thinking in React"](https://react.dev/learn/thinking-in-react) på react.dev
</details>
<details>
<summary><strong>5. Components og props: øvelse 5-7</strong></summary>

- **Component:** en funktion, der returnerer JSX. Navnet starter med stort bogstav, så React kan kende forskel på jeres components og almindelige HTML-tags. Den bruges som et tag: `<Header />`
- Én fil pr. component i `src/components/` med `export default` og `import`, ligesom modulerne i jeres Express-routes
- Øvelse 5: flyt overskriften ud i en `Header`-component
- Øvelse 6: lav en `User`-component med én fast person, og brug den tre gange. Hvad er problemet?
- **Props:** data sendes ned fra forælder til barn som attributter, `<User name="..." />`, og læses i barnet som parametre, `function User({ name })`. Props går kun nedad
- Øvelse 7: giv hver `User` sine egne data via props, med tre forskellige personer fra [users.json](https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/users.json)
- **`children`:** det, der står mellem start- og slut-tagget, sendes med som `props.children`. I bruger det i tutorialens step 1
</details>
<details>
<summary><strong>6. Lister og styling: øvelse 8-10</strong></summary>

- **Lister:** `.map()` over et array giver ét element pr. objekt, og hvert element skal have en unik `key`, så React kan holde styr på dem mellem to renders
- Øvelse 8: læg 3-4 users i et array i `App`, og vis dem med `users.map()` og `key={user.id}`. Fjern `key`, læs advarslen i Console, og sæt den ind igen
- Øvelse 9 i fire små trin med `className` og almindelig CSS: 9a et mørkt tema med CSS-variabler, 9b en header med tydelig ramme, 9c et grid af kort og 9d finpudsning med tekst, link og hover
- Øvelse 10: flyt grid'et og `users.map()` ud i en `UserList`-component. `App` beholder arrayet og sender det ned med `users={users}`. Fjern prop'en, læs fejlen, og sæt den ind igen. Nu har I alle fire kasser fra øvelse 4
</details>
<details>
<summary><strong>7. Hent rigtige data: øvelse 11-12</strong></summary>

- Just do it, og forstå det i morgen: `useState` husker data, og `useEffect` kører kode, efter componenten er vist. Det er et godt sted at hente data med `fetch`
- Øvelse 11: erstat jeres array med `useState([])`, hent [users.json](https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/users.json) i en `useEffect`, og gem data med `setUsers`. Nu viser grid'et alle users. `UserList` og `User` er ikke ændret
- Hele vejen: `fetch` → `setUsers` → `App` kører igen → `UserList` får users → `users.map()` → props → DOM
- Øvelse 12: commit og push `my-first-react-app` til GitHub fra VS Code
</details>
<details>
<summary><strong>8. Kom i gang med chatbot-tutorialen: step 1 og 2</strong></summary>

- Step 1 og 2 bruger det, I lige har lavet i `my-first-react-app`: components i egne filer, props, `children`, arrays, `.map()` og `key`
- Opret et nyt, tomt repository til jeres chatbot, og klon det ned
- Hent startpunktet i roden af repoet med `npx degit --force bewildergeist/chatbot-react-postgres#pr-1-start`, og commit det med det samme
- `cd frontend`, `npm install` og `npm run dev`. Sikkerhedsadvarslerne fra `npm install` er forventede. Læs tutorialens note om dem
- Tutorialen er på engelsk. Hvert step består af små delopgaver med hints, en reference-commit og test-punkter
- Bemærk: projektet er sat op med React Router, så filerne ligger i `app/routes/` i stedet for `src/`. Det er stadig Vite og React, og routing er emnet i morgen
- Hands-on: følg [step 1](https://github.com/bewildergeist/chatbot-react-postgres/pull/1) og derefter [step 2](https://github.com/bewildergeist/chatbot-react-postgres/pull/2). Commit efter hver delopgave, og sammenlign med tutorialens reference-commits
- I når forskelligt langt. Step 1 og 2 skal være færdige til i morgen, hvor step 3 bygger videre på step 2. Det, I ikke når i dag, laver I færdigt hjemme
</details>

---

## Forberedelse

- Læs ["Quick Start"](https://react.dev/learn) på react.dev
- Skim ["Thinking in React"](https://react.dev/learn/thinking-in-react) på react.dev. Det er dagens røde tråd, så det er fint, hvis ikke alt giver mening endnu
- På [Scrimba](https://scrimba.com/fullstack-path-c0fullstack):
  - Fullstack > React.js Fundamentals > "Welcome to React.js Fundamentals"
  - Fullstack > React.js Fundamentals > "Static Pages"
- Supplerende, hvis du har tid:
  - ["Writing Markup with JSX"](https://react.dev/learn/writing-markup-with-jsx) på react.dev
  - [chatbot-tutorialens README](https://github.com/bewildergeist/chatbot-react-postgres), så du ved, hvad vi skal bygge i forløbet
  - ["Getting Started"](https://vite.dev/guide/) i Vites dokumentation

---

## Materialer

- Slides:
  - [RACE 8 · Thinking in React](https://cederdorff.com/wu-e26a/react-intro/)
- Opgaver:
  - [my-first-react-app](https://cederdorff.com/wu-e26a/react-intro/#/vite): øvelse 1-12 i slides. Byg en users-app med Vite, components, props og `.map()`, og hent data fra en rigtig URL
    - [Løsning til my-first-react-app](https://github.com/cederdorff/my-first-react-app): én branch pr. øvelse. Prøv selv først
  - [Chatbot React Postgres](https://github.com/bewildergeist/chatbot-react-postgres)
    - [Chatbot-tutorial, step 1: Component-arkitektur](https://github.com/bewildergeist/chatbot-react-postgres/pull/1)
    - [Chatbot-tutorial, step 2: Rendering lists](https://github.com/bewildergeist/chatbot-react-postgres/pull/2)

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178055
canvas_module_position: 32
canvas_module_published: false
canvas_module_item_id: 1018730
canvas_module_item_position: 1
canvas_page_id: 200723
canvas_page_slug: "plan-for-race-8-thinking-in-react"
canvas_page_title: "Plan for RACE 8 - Thinking in React"
canvas_page_published: false
canvas_updated_at: "2026-08-10T12:34:17Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018730"
local_status: mirrored
```

</details>
