# Forberedelse - Gruppearbejde - 30-10-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

I dag mødes I i [ugens bordgrupper](https://eaaa.instructure.com/courses/32059/modules/items/1065427) og hjælper hinanden med at få login ind i chatbotten. Nåede du ikke [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14) i går, er det helt fint. Det er det, I har tid til i dag. Målet er, at alle i gruppen har lavet step 14, når I går hjem, og at I kan forklare, hvad der sker, når man logger ind.

Lokale 4.05 er reserveret til jer.

## 1\. Statusrunde

Hver fortæller kort: Hvor langt er du i step 14? Hvor sidder du fast? Sæt dem, der er færdige, sammen med dem, der ikke er.

## 2\. Bliv færdige med step 14

Hjælp hinanden, og kig på hinandens kode. Alle skal have register og login committet og pushet til deres eget chatbot-repo. Brug tabellen sidst i [opgaven fra onsdag](../opgaver/react-supabase-auth.md) til at finde den øvelse, der svarer til den delopgave, I sidder med.

## 3\. Test sammen

- Opret hver en bruger i jeres egen chatbot, og log ind med to forskellige brugere i to browsere. Ser de to brugere de samme tråde?
- Åbn Network-fanen, og find et request til jeres eget API på `localhost:3000`. Står tokenet nogen steder i requestet?

## 4\. Tegn login-flowet

Tegn på papir, tavle eller i Figma, hvad der sker, fra brugeren trykker "Log In", til tokenet ligger i Local Storage. Hvad sker der i browseren, og hvad sker der hos Supabase? Hvor bliver passwordet hashet? Hvor ligger tokenet bagefter?

Tegn det først uden at kigge i opgaven. Sammenlign bagefter med "Tokenets vej" i øvelse 8 i [opgaven fra onsdag](../opgaver/react-supabase-auth.md).

## 5\. Diskutér

- Hvad kan man gøre, hvis man får fat i jeres anon key?
- Hvad kan man gøre, hvis man får fat i en brugers access token? Og hvor længe?
- Hvorfor kan backenden ikke stole på den validering, I har lavet i `clientAction`?

Næste gang starter vi med jeres tegninger og svar. Derefter sender vi tokenet med til backenden i step 15.

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178064
canvas_module_position: 50
canvas_module_published: true
canvas_module_item_id: 1072874
canvas_module_item_position: 1
canvas_page_id: 209569
canvas_page_slug: "gruppearbejde-uge-44-login-i-chatbotten"
canvas_page_title: "Gruppearbejde uge 44: Login i chatbotten"
canvas_page_published: true
canvas_updated_at: "2026-10-23T08:49:25Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1072874"
local_status: mirrored
```

</details>
