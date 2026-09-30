# RACE 8 - Thinking in React - 06-10-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I dag starter vi på frontend-delen af Chatbot-forløbet med React, helt forfra med et nyt projekt. Hvad er React, hvorfor bruger så mange det, og hvordan tænker man, når man bygger en brugerflade i React?

Først gennemgår vi imperativ vs. deklarativ og Virtual DOM, og I laver jeres første React-projekt med Vite. Derefter bruger vi "Thinking in React" på et rigtigt chatbot-UI og gennemgår JSX, components og props. Resten af dagen går I i gang med [chatbot-tutorialen](https://github.com/bewildergeist/chatbot-react-postgres), som resten af forløbet bygger videre på.

Når dagen er slut, kan I selv lave [step 1](https://github.com/bewildergeist/chatbot-react-postgres/pull/1) og [step 2](https://github.com/bewildergeist/chatbot-react-postgres/pull/2) i tutorialen. Det betyder, at I kan dele et stort component op i mindre, sende data ned med props og vise lister med `.map()`.

---

## Agenda

<details>
<summary><strong>1. Intro til React: hvad, hvorfor og hvordan?</strong></summary>

- **Hvad:** et JavaScript-bibliotek til at bygge brugerflader, lavet af Meta. React håndterer kun UI'et, ikke server, database eller routing
- **Hvorfor:** UI'et bygges af små, genbrugelige components, siden opdateres automatisk, når data ændrer sig, og der er et stort økosystem og et stort jobmarked
- **Hvordan:** React kører i browseren og bygger siden dér. Det er client-side rendering, som I præsenterede i sidste uge
- Kendte eksempler: Facebook, Instagram, Netflix og Airbnb er bygget med React
- **Imperativ vs. deklarativ:** imperativt beskriver I _hvordan_, trin for trin. Find elementet, byg en HTML-streng, indsæt den, ryd feltet. Deklarativt beskriver I _hvad_ siden skal vise ud fra jeres data, og React finder selv ud af, hvordan DOM'en skal ændres
- Demo: den samme liste med beskeder, side om side. Vanilla JS med `document.querySelector`, en løkke og `insertAdjacentHTML`, mod React med `messages.map(...)` i JSX
- Diskutér to og to: der kommer en ny besked. Hvad skal I selv huske at gøre i den imperative version? Hvad med den deklarative?
- Kerneidéen: **UI = f(data)**. Når data ændrer sig, tegnes UI'et igen ud fra de nye data
- **Virtual DOM:** React bygger først siden som et letvægts-træ af JavaScript-objekter. Når data ændrer sig, laver React et nyt træ, sammenligner det med det forrige og ændrer kun de dele af den rigtige DOM, der faktisk er forskellige. I ser det i praksis i næste punkt
</details>
<details>
<summary><strong>2. Nyt React-projekt med Vite</strong></summary>

- Hvad er Vite? Et build-værktøj og en udviklingsserver. Den forstår JSX og opdaterer siden, så snart I gemmer
- Tjek jeres Node-version med `node -v`. Vite kræver mindst Node 20.19 eller 22.12. Er jeres ældre, så installér den nyeste LTS-version fra [nodejs.org](https://nodejs.org/)
- Hands-on: `npm create vite@latest react-playground`, vælg React og JavaScript, derefter `npm install` og `npm run dev`
- Gennemgå sammen mappestrukturen: `index.html` med `<div id="root">`, `src/main.jsx`, der monterer appen, og `src/App.jsx`, der er jeres første component
- Hands-on: ret teksten i `App.jsx`, gem, og se siden opdatere uden genindlæsning. `react-playground` er jeres legeplads resten af dagen, når I vil prøve noget af
- Hands-on, Virtual DOM i praksis: åbn DevTools' Elements-panel, og tryk på tæller-knappen i Vites startside. Kun tallet i knappen blinker. Resten af siden bliver ikke rørt
</details>
<details>
<summary><strong>3. Thinking in React</strong></summary>

- Oplæg: de fem trin i ["Thinking in React"](https://react.dev/learn/thinking-in-react) på react.dev:
  1. Del UI'et op i et component-hierarki
  2. Byg en statisk version
  3. Find den mindste mængde state, UI'et har brug for
  4. Find ud af, hvor state skal bo
  5. Lad data flyde den anden vej
- Hands-on to og to: tag [skærmbilledet af chatbotten](https://github.com/bewildergeist/chatbot-react-postgres) fra tutorialen. Tegn kasser om de dele, der hører sammen, og navngiv dem. Tegn derefter hierarkiet som et træ
- Sammenlign med jeres sidemakker. Hvor har I skåret forskelligt, og hvorfor? Bagefter ser vi tutorialens hierarki i plenum
- I dag arbejder vi med trin 1 og 2 i praksis. Det er præcis det, step 1 og 2 i tutorialen handler om. Kort om state: det er data, der ændrer sig, mens siden er åben, fx beskederne og teksten i inputfeltet. Trin 3-5 og `useState` kommer i morgen
</details>
<details>
<summary><strong>4. JSX, components og props</strong></summary>

- **JSX** ligner HTML, men er JavaScript. `className` i stedet for `class`, alle tags skal lukkes (`<img />`), og en component returnerer ét rod-element eller et fragment `<>...</>`
- `{ }` indsætter et JavaScript-udtryk: en variabel, en template literal eller en `.map()`
- **Component:** en funktion, der returnerer JSX. Navnet starter med stort bogstav, så React kan kende forskel på jeres components og almindelige HTML-tags. Den bruges som et tag: `<Sidebar />`
- **Props:** data sendes ned fra forælder til barn som attributter, `<Message type="user" />`, og læses i barnet som `props.type`. Props går kun nedad
- **`children`:** det, der står mellem start- og slut-tagget, `<Message>Hej</Message>`, sendes med som `props.children`
- **Lister:** `.map()` over et array giver ét element pr. objekt, og hvert element skal have en unik `key`, så React kan holde styr på dem mellem to renders
- Kort demo i `react-playground`. Resten øver I i tutorialen
</details>
<details>
<summary><strong>5. Kom i gang med chatbot-tutorialen: step 1 og 2</strong></summary>

- Opret et nyt, tomt repository til jeres chatbot, og klon det ned
- Hent startpunktet i roden af repoet med `npx degit --force bewildergeist/chatbot-react-postgres#pr-1-start`, og commit det med det samme
- `cd frontend`, `npm install` og `npm run dev`. Sikkerhedsadvarslerne fra `npm install` er forventede. Læs tutorialens note om dem
- Tutorialen er på engelsk. Hvert trin har en opgave, hints, en reference-commit og test-punkter
- Bemærk: projektet er sat op med React Router, så filerne ligger i `app/routes/` i stedet for `src/`. Det er stadig Vite og React, og routing er emnet i morgen
- Hands-on: følg [step 1](https://github.com/bewildergeist/chatbot-react-postgres/pull/1). I deler de to store components op i mindre, bruger props og `children` og flytter components til egne filer. UI'et skal se ens ud hele vejen
- Hands-on: fortsæt med [step 2](https://github.com/bewildergeist/chatbot-react-postgres/pull/2). I flytter data ud i arrays, viser dem med `.map()` og `key` og løfter arrays op til den component, hvor de hører til
- Commit efter hvert trin, og sammenlign med tutorialens reference-commits
- I når forskelligt langt. Det, I ikke når, laver I færdigt som forberedelse til i morgen, hvor step 3 bygger videre på step 2
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

- Slides: TBA
- [Chatbot React Postgres](https://github.com/bewildergeist/chatbot-react-postgres):
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
