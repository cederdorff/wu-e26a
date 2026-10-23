# DOB 9 - React state & routing med React Router - 07-10-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I går brød I sammen med Rasmus chatbottens UI op i komponenter og renderede lister ud fra data (PR 1 og 2). I dag gør vi UI'et interaktivt: Med `useState` og event handlers kan brugeren filtrere tråde og skrive beskeder, og vi kigger på hvordan komponenter deler state med hinanden via props og callbacks (tutorial PR 3).

Bagefter giver vi hver samtaletråd sin egen URL med React Router (tutorial PR 4). Så kan man linke til en tråd, bruge browserens tilbage-knap og starte en ny tråd. Til sidst kigger vi på fredagens gruppearbejde.

---

## Agenda

- Props destructuring og event handling i React
- State med `useState`, og "lifting state up" med callback props
- Formularer: controlled vs. uncontrolled komponenter
- Client-side routing med React Router: `routes.js`, `Link` og URL parametre med `useParams`
- Hands-on: Genimplementér PR 3 og PR 4 i jeres eget repository, mens I samarbejder parvis
- Planlægning af fredagens gruppearbejde

---

## Forberedelse

**React state og events:**

- Arbejd dig igennem "React State" afsnittet i Scrimbas ["The Fullstack Developer Path" > "React.js Fundamentals"](https://scrimba.com/fullstack-path-c0fullstack) (særligt til og med "Toggling state")
- Læs ["Responding to Events"](https://react.dev/learn/responding-to-events) og ["State: A Component's Memory"](https://react.dev/learn/state-a-components-memory) i React dokumentationen. Resten af ["Adding Interactivity"](https://react.dev/learn/adding-interactivity) sektionen er valgfri, men god læsning

**React Router:**

- Skim ["Routing"](https://reactrouter.com/start/framework/routing) i React Router dokumentationen, for at se hvordan `routes.js` skrives i den version vi bruger (v7)

**Tutorials:**

- Sørg for at du har gennemført [PR #1](https://github.com/bewildergeist/chatbot-react-postgres/pull/1) og [PR #2](https://github.com/bewildergeist/chatbot-react-postgres/pull/2) fra i går
- Skim "Overview" og "Learning objectives" i dagens to tutorials, [PR #3](https://github.com/bewildergeist/chatbot-react-postgres/pull/3) og [PR #4](https://github.com/bewildergeist/chatbot-react-postgres/pull/4), så du kender begreberne, når vi gennemgår dem. Men vent med at kode 😉

## Materialer

### Præsentationer

- [DOB 9 - React state og routing - slides.pdf](https://eaaa.instructure.com/courses/32059/modules/items/1066870)

### Opgaver

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178056
canvas_module_position: 33
canvas_module_published: true
canvas_module_item_id: 1018733
canvas_module_item_position: 1
canvas_page_id: 200724
canvas_page_slug: "plan-for-dob-9-react-state-and-routing-med-react-router"
canvas_page_title: "Plan for DOB 9 - React state & routing med React Router"
canvas_page_published: true
canvas_updated_at: "2026-10-05T07:58:59Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018733"
local_status: mirrored
```

</details>
