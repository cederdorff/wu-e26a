# Forberedelse - Selvstudium - 29-10-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

I onsdags øvede du login i `react-supabase-auth`. I dag bliver du færdig med det og laver det samme i chatbotten: [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14).

## 1\. Bliv færdig med react-supabase-auth

- Lav øvelse 1-8 i [React Supabase Auth: Login før chatbotten](../opgaver/react-supabase-auth.md), hvis du ikke nåede dem i onsdags. Øvelse 9 er en bonus
- Sidder du fast, så kig i [løsningen](https://github.com/cederdorff/react-supabase-auth). Der er én branch pr. øvelse

## 2\. Lav step 14 i chatbotten

- Er du ikke færdig med step 13, så hent startpunktet i roden af dit chatbot-repo, og commit det, før du ændrer noget:
    
    ```bash
    npx degit --force bewildergeist/chatbot-react-postgres#pr-14-start
    ```
    
- Har du lavet AI-svarene fra step 10b på en branch, så bliv på `main`. Branchen merger du ind efter auth-stepsene
    
- Al koden i step 14 ligger i `frontend/`. Kør `cd frontend`, før du installerer `@supabase/supabase-js`
    
- Følg step 14 delopgave for delopgave. Commit efter hver delopgave, og sammenlign med tutorialens reference-commits
    
- Tabellen sidst i opgaven viser, hvilken øvelse fra onsdag der svarer til hvilken delopgave
    
- Tag delopgave 7 (routes) før delopgave 4, så du kan teste siderne undervejs
    
- Test hele flowet til sidst: opret en bruger på `/register`, log ind på `/login`, og find dit token i Local Storage
    

Sidder du fast, så skriv ned, hvor du sidder fast, og hvad fejlen siger. Tag det med til gruppen i morgen.

## 3\. Scrimba

- [Intro to Supabase](https://scrimba.com/intro-to-supabase-c0abltfqed) > Authentication, til og med "Navigate after sign out"

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178072
canvas_module_position: 49
canvas_module_published: false
canvas_module_item_id: 1072873
canvas_module_item_position: 1
canvas_page_id: 209568
canvas_page_slug: "selvstudie-uge-44-login-i-chatbotten"
canvas_page_title: "Selvstudie uge 44: Login i chatbotten"
canvas_page_published: false
canvas_updated_at: "2026-10-23T08:43:13Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1072873"
local_status: mirrored
```

</details>
