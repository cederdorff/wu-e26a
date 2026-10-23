# DOB 10 - Data fetching og mutation via Supabase - 13-10-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Nu har chatbotten routes og state, men alle data er stadig hardcodet i koden. I dag kobler vi den på en rigtig database. Først lader vi React Router hente data, *før* en side renderes, med `clientLoader` — vi gennemgår fuktionaliteten i fællesskab, men sørg for at have implementeret PR #5 på forhånd (se under Forberedelse). Derefter opretter I en database i Supabase og henter tråde og beskeder via Supabase's REST API med helt almindelig `fetch` (PR 6).

Til sidst skal formularerne også *gemme* noget: React Routers `<Form>` sender data til en `clientAction`, der skriver til databasen, hvorefter UI'et opdaterer sig selv (PR 7). I morgen dykker Magnus ned i SQL'en bag jeres Supabase database.

---

## Agenda

- Opfølgning på fredagens gruppearbejde
- Data loading med `clientLoader` og `useLoaderData`, og aktive links med `NavLink`
- Supabase som backend: Database, REST API og environment variables
- Data mutations med `<Form>`, `clientAction`, `useActionData` og `redirect()`
- Hands-on: Genimplementér PR 6 og 7 i jeres eget repository, to og to
- Hvis tiden er til det: `useFetcher` og `ErrorBoundary`

---

## Forberedelse

**Supabase:**

- Arbejd dig gennem "Persistence" sektionen i Scrimbas ["Intro to Supabase"](https://scrimba.com/intro-to-supabase-c0abltfqed:toc) kursus (ca. 1 time). Bemærk at de bruger Supabase's JavaScript klient og ikke REST API'et, men I er jo `fetch` ninjaer, så I kan godt klare rå HTTP 😉
- Opret en gratis konto på [Supabase](https://supabase.com/), så du er klar til at oprette en database i timen
- Skim ["Data REST API"](https://supabase.com/docs/guides/api) i Supabase dokumentationen

**React Router:**

- Læs ["Data Loading"](https://reactrouter.com/start/framework/data-loading) i React Router dokumentationen (vi bruger `clientLoader`)
- Læs ["Actions"](https://reactrouter.com/start/framework/actions) i React Router dokumentationen (vi bruger `clientAction`)

**Tutorials:**

- Sørg for at du har gennemført [PR #3](https://github.com/bewildergeist/chatbot-react-postgres/pull/3) og [PR #4](https://github.com/bewildergeist/chatbot-react-postgres/pull/4) fra sidst
- **Lav [PR #5](https://github.com/bewildergeist/chatbot-react-postgres/pull/5) hjemmefra**, så du er klar til at gennemgå den i timen
- Skim "Overview" og "Learning objectives" i [PR #6](https://github.com/bewildergeist/chatbot-react-postgres/pull/6) og [PR #7](https://github.com/bewildergeist/chatbot-react-postgres/pull/7). Det er to lange tutorials, så regn med at gøre dem færdige derhjemme

## Materialer

### Præsentationer

- [DOB 10 - Data fetching og mutations med Supabase - slides.pdf](https://eaaa.instructure.com/courses/32059/modules/items/1068356)

### Opgaver

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178060
canvas_module_position: 37
canvas_module_published: true
canvas_module_item_id: 1018739
canvas_module_item_position: 1
canvas_page_id: 200726
canvas_page_slug: "plan-for-dob-10-data-fetching-og-mutation-via-supabase"
canvas_page_title: "Plan for DOB 10 - Data fetching og mutation via Supabase"
canvas_page_published: true
canvas_updated_at: "2026-10-05T08:27:51Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018739"
local_status: mirrored
```

</details>
