# Forberedelse - Selvstudium - 04-11-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

Her er et forslag til, hvad du kan bruge dagen på. Step 15 skal være færdig i morgen, hvor test og deployment bygger videre på den.

## 1\. Bliv færdig med react-supabase-auth

- Lav de øvelser i [React Supabase Auth: Send tokenet med](../opgaver/react-supabase-auth-bearer-token.md), du ikke nåede i går. Øvelse 10 og 11 er nok til at lave step 15. Øvelse 12 er en bonus
- Sidder du fast, så kig i [løsningen](https://github.com/cederdorff/react-supabase-auth). Der er én branch pr. øvelse

## 2\. Lav step 15 i chatbotten

- Er du ikke færdig med step 14, så hent startpunktet i roden af dit chatbot-repo med `npx degit --force bewildergeist/chatbot-react-postgres#pr-15-start`. Commit, før du ændrer noget. Sæt derefter `TEST_USER_ID` ind i `backend/server.js` igen. Startpunktet opretter tråde uden `user_id`, og det fejler i kursets database
- Følg [step 15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15) delopgave for delopgave, og commit efter hver. Tabellen sidst i opgaven fra i går viser, hvilken øvelse der svarer til hvilken delopgave
- Sidder du fast i en delopgave, så sammenlign med tutorialens reference-commit til den
- Test: log ind, klik rundt, og find `Authorization: Bearer ...` i Network-fanen på et request til `localhost:3000`
- Push til GitHub, når du er færdig. I morgen deployer I fra jeres repo

Sidder du fast, så skriv ned, hvor du sidder fast, og hvad fejlen siger. Tag det med i morgen.

## 3\. Forbered dig til i morgen

- Læs forberedelsen på siden for i morgen. Du skal bl.a. oprette konti på Netlify og Render

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178074
canvas_module_position: 53
canvas_module_published: true
canvas_module_item_id: 1076083
canvas_module_item_position: 1
canvas_page_id: 209752
canvas_page_slug: "forberedelse-selvstudium-04-11-2026"
canvas_page_title: "Forberedelse - Selvstudium - 04-11-2026"
canvas_page_published: true
canvas_updated_at: "2026-10-28T11:42:09Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1076083"
local_status: mirrored
```

</details>
