# Arbejdsark: Fra CRUD til login

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

**Ressourcer:** Slides fra Undervisning 4 · [Tutorial, trin 11: Delete thread via Express API](https://github.com/bewildergeist/chatbot-react-postgres/pull/11) · [Tutorial, trin 12: Create new thread via Express API](https://github.com/bewildergeist/chatbot-react-postgres/pull/12) · [Tutorial, trin 13: Edit thread titles](https://github.com/bewildergeist/chatbot-react-postgres/pull/13) · [postgres (Postgres.js): Transactions](https://github.com/porsager/postgres#transactions)

## 1 Recap: quiz, opgaver og feedback

Opgaverne gennemgår det vi har lavet i de første tre undervisningsgange. Lav opgaverne i par, hvor i hver har en rolle:

- **Programmør**: Må skrive koden og løse opgaven
- **Assistent**: Må ikke røre tastaturet eller skrive koden, men må komme med forslå og slå ting op i de givende resourcer

Ved vher opgave bytter i roller. Personen hvis navn komme først i alfabetet starter som programmør

**Opgave 1** **Nøgler.** Hvad er primary key og foreign key i tabellen `messages`, og hvad peger foreign key’en på?

**Opgave 2** **SELECT.** Hent titlen på alle tråde i `threads` tabellen, sorteret på titlen, alfabetisk.

**Opgave 3** **WHERE og ILIKE.** Find alle beskeder hvor teksten indeholder ordet “pizza”, uanset store og små bogstaver. Brug mønsteret `'%pizza%'` med `ILIKE`. `%` står for et hvilket som helst antal tegn, så mønsteret passer på al tekst der indeholder “pizza” et sted.

**Opgave 4** **ORDER BY og LIMIT.** Find de tre nyeste tråde i `threads` tabellen.

**Opgave 5** **INSERT.** Opret en ny tråd til frida med titlen `Recap`. Find først fridas id med en `SELECT` på `auth.users`, og brug det i dit `INSERT`. Brug `RETURNING` til at se trådens id, for det skal du bruge i de næste opgaver.

**Opgave 6** **UPDATE.** Giv den ny-oprettede tråd titlen `Recap af SQL`.

**Opgave 7** **DELETE og CASCADE.** Tilføj en besked til tråden, og slet så tråden. Hvad sker der med beskeden? Er dette den opførsel som i vil forvente?

**Opgave 8** **INNER JOIN.** Vis hver tråds titel sammen med e-mailadressen på den bruger der ejer tråden.

**Opgave 9** **LEFT JOIN.** Find de brugere der ikke har nogen tråde.

## 2 Cyberangreb og PHP-huller

I sidste uge kom der flere alvorlige sikkerhedsbrister frem, og nogle af dem rammer værktøjer som vi selv bruger. I dette afsnit læser hver gruppe en tekst om en af dem og fortæller bagefter resten af klassen om den.

**Opgave 10** **Sidste uge i cybersikkerhed.** MAGL giver jeres gruppe en af teksterne herunder. Teksterne er skrevet til programmører og er på engelsk, så de kan være lidt bøvlet at forstå (hvorfor vi diskuterer dem bagefter).

- Tekst 1: Zack Whittaker, “[This Week in Security — October 25 2026 Edition](https://this.weekinsecurity.com/this-week-in-security-october-25-2026-edition/)”[1](#loc-11)
- Tekst 2: Københavns Universitet, “[Københavns Universitet udsat for hackerangreb](https://nyheder.ku.dk/alle_nyheder/2026/10/koebenhavns-universitet-udsat-for-hackerangreb)”[2](#loc-12)
- Tekst 3 (gruppe 1 & 4): Scott Helme, “[Eight Bits of Trust](https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/)”[3](#loc-13)
- Tekst 4 (gruppe 2 & 5 ): The PHP Foundation, “[Today's PHP Security Release](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/)”[4](#loc-14)
- Tekst 5 (gruppe 3 & 6): Jacob Cooper and Angelo Saraceno, “[Preliminary Report](https://blog.railway.com/p/preliminary-report-october-security-incident)”[5](#loc-15)

Alle oversigtslæser tekst 1 og 2, også læser hver gruppe den tekst de har fået givet og diskuterer den ud fra følgende spørgsmål:

1.  Hvem er blevet ramt/hacket?
2.  Hvilken type problem var der tale om? (menneskelige fejl eller software fejl?)
3.  Hvordan var LLM’er involveret?

Nogle af artiklerne egner sig bedre end andre til at svare på disse spørgsmål, så hvis i slet ikke kan finde svaret så gå videre

## 3 Authentication og authorization

I dette afsnit skal I kunne kende forskel på authentication og authorization, og I skal se hvordan adgangskoder bliver gemt. Lav opgaverne sammen med din sidemakker.

**Opgave 11** **Authentication eller authorization?** Afgør for hver situation om den handler om authentication eller authorization, og blive enige med din sidemakker om hvorfor.

1.  Du logger ind i chatbotten med din e-mail og din adgangskode.
2.  Bob prøver at åbne en af alices tråde, men API’et svarer 404.
3.  Backend’en tjekker at signaturen på dit token passer.
4.  Kun en administrator må slette andre brugeres tråde.
5.  Supabase sammenligner hashet af den adgangskode du skrev, med det hash den har gemt.

**Opgave 12** **Hash selv.** Prøv to hash-funktioner i SQL Editor på Supabase, `md5`\-funktionen og `crypt`\-funktionen, og se forskellige hash.

1.  Kør `SELECT md5('hemmelig123');` to gange. Får du det samme hash begge gange?
2.  Ret ét tegn i adgangskoden, fx til `'hemmelig124'`, og kør den igen. Hvor meget af hashet ændrer sig?
3.  Kør `SELECT crypt('hemmelig123', gen_salt('bf', 10));` to gange. Hvorfor får du to forskellige hashes, og hvordan kan Supabase så alligevel tjekke din adgangskode når du logger ind?
4.  En tyv har stjålet en tabel med md5-hashes af brugernes adgangskoder. Hvorfor er det et større problem end hvis det var hashes fra bcrypt med salt?

Accepterer SQL Editor ikke `crypt` eller `gen_salt`, så skriv `extensions.crypt` og `extensions.gen_salt`.

## 4 Tutorial: trin 11–13

I dette afsnit får chatbot-appens API tre nye endpoints, så du kan slette, oprette og omdøbe tråde. Du arbejder i din egen app, så hav både backend og frontend kørende. Det du ikke når i timen, gør du færdigt hjemme før næste gang.

**Opgave 13** Lav trin 11, 12 og 13 i chatbot-tutorialen

## Referencer

- Cooper, Jacob, and Angelo Saraceno. “Preliminary Report: Oct 21st Security Incident.” October 2026. [https://blog.railway.com/p/preliminary-report-october-security-incident](https://blog.railway.com/p/preliminary-report-october-security-incident).
- Helme, Scott. “Eight Bits of Trust; eMudhra's CA Keys Cracked in Milliseconds.” October 2026. [https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/](https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/).
- Københavns Universitet. “Københavns Universitet udsat for hackerangreb.” October 2026. [https://nyheder.ku.dk/alle\_nyheder/2026/10/koebenhavns-universitet-udsat-for-hackerangreb](https://nyheder.ku.dk/alle_nyheder/2026/10/koebenhavns-universitet-udsat-for-hackerangreb).
- The PHP Foundation. “Today's PHP Security Release, And How We're Strengthening PHP Security.” October 2026. [https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/](https://thephp.foundation/blog/2026/10/21/todays-php-security-release-and-how-were-strengthening-php-security/).
- Whittaker, Zack. “This Week in Security — October 25 2026 Edition.” October 2026. [https://this.weekinsecurity.com/this-week-in-security-october-25-2026-edition/](https://this.weekinsecurity.com/this-week-in-security-october-25-2026-edition/).

1.  [1](#loc-1)[Whittaker, “This Week in Security — October 25 2026 Edition”](#loc-10).
2.  [2](#loc-2)[Københavns Universitet, “Københavns Universitet udsat for hackerangreb”](#loc-8).
3.  [3](#loc-3)[Helme, “Eight Bits of Trust”](#loc-7).
4.  [4](#loc-4)[The PHP Foundation, “Today's PHP Security Release”](#loc-9).
5.  [5](#loc-5)[Cooper and Saraceno, “Preliminary Report”](#loc-6).

[Hent arbejdsarket som PDF](https://eaaa.instructure.com/courses/32059/files/1725682?verifier=c2f8ab89-a76d-4fd0-a98f-9a9635c587f4&wrap=1 "WEB-E26-session4-worksheet4.pdf")

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: null
canvas_module_position: null
canvas_module_published: null
canvas_module_item_id: null
canvas_module_item_position: null
canvas_page_id: 209626
canvas_page_slug: "arbejdsark-fra-crud-til-login"
canvas_page_title: "Arbejdsark: Fra CRUD til login"
canvas_page_published: true
canvas_updated_at: "2026-10-26T10:19:20Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/pages/arbejdsark-fra-crud-til-login"
local_status: mirrored
```

</details>
