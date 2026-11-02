# Arbejdsark: Normal Former: Reloaded

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

**Ressourcer:** Slides fra Undervisning 5 · [PostgreSQL: Aggregate Functions](https://www.postgresql.org/docs/current/tutorial-agg.html) · [MDN: Authorization-headeren](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization)

Arket har tre afsnit. I afsnit 2 tæller I brugernes tråde og beskeder med aggregering i SQL Editor på Supabase sammen med jeres sidemakker. I afsnit 3 normaliserer I en tabel fra en chatbot sammen, og i afsnit 4 bygger du selv videre på chatbot-appen med trin 15 og 16 af tutorialen. Det du ikke når i timen, gør du færdigt hjemme.

## 2 Dagens lektier: Normal forms

Opgaverne bruger testdataene fra `seed.sql`, frida og den bruger du oprettede i trin 14. Løsningerne på slides er lavet på de data. Har du oprettet chats i appen, får du nok nogle andre tal, og det er helt i orden.

**Opgave 1: COUNT: tæl beskeder** Skriv en query der tæller hvor mange beskeder der er i alt i jeres database. Tæl derefter hvor mange der er af hver type (`'user'` og `'bot'`).

**Opgave 2: GROUP BY: beskeder pr. tråd** Tæl hvor mange beskeder der er i hver tråd. Sortér resultatet så de tråde der har flest beskeder, kommer først.

**Opgave 3: HAVING: filtrér grupper** Find de tråde der har mere end 3 beskeder. Prøv først med `WHERE COUNT(*) > 3` og derefter med `HAVING`. Hvad siger databasen til `WHERE`, og hvorfor?

**Opgave 4: Aggregering med JOIN** Find hvor mange tråde og hvor mange beskeder hver bruger har. Brugere der ikke har nogen tråde, skal også med, så frida og din egen bruger står der med 0.

**Hint:** Brug `LEFT JOIN`, og tjek at alice har 3 tråde og ikke 12 (flere, hvis du har oprettet chats i appen).

## 3 Normalformer: revisited

Nu skal vi arbejde med normalformerne igen, fordi mange af jer skrev i midtvejsevalueringen at de var svære. Opgaverne bruger det samme eksempel som noten om normalformerne, så har du den, kan du slå op i den undervejs. Lav opgaverne sammen med din sidemakker.

Forestil dig at en chatbot gemmer alt i én stor tabel, `chatlog`, hvor hver række er én besked:

<table><tbody><tr><td><strong><code>thread_id</code></strong></td><td><strong><code>title</code></strong></td><td><strong><code>owner</code></strong></td><td><strong><code>owner_email</code></strong></td><td><strong><code>participants</code></strong></td><td><strong><code>message_no</code></strong></td><td><strong><code>content</code></strong></td></tr><tr><td>1</td><td>Pizza</td><td>bob</td><td>bob@example.com</td><td>bob, charlie, frida</td><td>1</td><td>Hvad er den bedste topping?</td></tr><tr><td>1</td><td>Pizza</td><td>bob</td><td>bob@example.com</td><td>bob, charlie, frida</td><td>2</td><td>Ananas, helt klart</td></tr><tr><td>2</td><td>Weekend</td><td>bob</td><td>bob@example.com</td><td>bob</td><td>1</td><td>Hvad skal jeg lave i weekenden?</td></tr><tr><td>3</td><td>Programmering</td><td>alice</td><td>alice@example.com</td><td>alice</td><td>1</td><td>Hvordan lærer jeg at programmere?</td></tr></tbody></table>

**Opgave 5: Find anomalierne** Tabellen virker, men den gemmer de samme oplysninger flere steder. Det giver problemer når man opdaterer, sletter og indsætter data.

1.  Hvad sker der hvis bob skifter e-mailadresse, og man kun retter den i én række?
2.  Hvad mister vi hvis vi sletter beskeden i tråd 3?
3.  Hvorfor kan vi ikke gemme en ny bruger der ikke har skrevet noget endnu?

**Opgave 6: Normalisér chatlog til 3NF** Del `chatlog` op i tabeller på tredje normalform. Tag ét trin ad gangen: 1NF (én værdi i hver celle og en primary key), 2NF (hver kolonne handler om hele nøglen) og 3NF (kun om nøglen).

1.  Skriv hver tabel med dens kolonner, og markér primary key og foreign keys.
2.  Hvilken kolonne bryder 1NF, og hvad gør du ved den?
3.  Sammenlign med tabellerne i jeres chatbot. Hvorfor har man adskilt brugerne og trådene i to tabeller? Kunne man gøre det anderledes?

## 4 Aggregering: tæl brugernes tråde og beskeder

I dette afsnit sender frontend’en først brugerens token med til API’et (trin 15), og så begynder backend’en at tjekke tokenet med en middleware (trin 16). Du arbejder i din egen app, så hav både backend og frontend kørende. Det du ikke når, laver du hjemme før næste gang.

**Opgave 7: Trin 15: tokenet med i hver request** Følg [Step 15: Send bearer tokens in requests](https://github.com/bewildergeist/chatbot-react-postgres/pull/15) i repo’et `chatbot-react-postgres`.

**Opgave 8: Find tokenet i Network-fanen** Åbn DevTools i browseren, vælg fanen **Network** og genindlæs appen. Klik på requesten til `threads`, og find `Authorization` under **Request Headers**.

1.  Er det det samme token som `access_token` i localStorage?
2.  Kør `curl -i http://localhost:3000/api/threads` i en terminal. Hvad svarer API’et, når der ikke er noget token med?

**Opgave 9: Trin 16: backend’en tjekker tokenet** Følg [Step 16: Enforce auth tokens in backend](https://github.com/bewildergeist/chatbot-react-postgres/pull/16). Husk at backend’en skal have `SUPABASE_URL` og `SUPABASE_ANON_KEY` i sin egen `.env`.

**Opgave 10: Prøv API’et uden et gyldigt token** Kør de to kald herunder i en terminal, og skriv ned hvad API’et svarer.

```
curl -i http://localhost:3000/api/threads
curl -i -H "Authorization: Bearer noget-vrøvl" http://localhost:3000/api/threads
```

Log så ud i appen, og genindlæs siden. Hvad sker der, og hvorfor?

**Opgave 11: Hvor kommer req.userId fra?** Tilføj midlertidigt `console.log(req.userId);` øverst i route handleren til `GET /api/threads`, og genindlæs appen. Sammenlign id’et i terminalen med `sub` i dit token og med `id` for din bruger i `auth.users`. Hvilken linje i `requireAuth` finder id’et? Fjern `console.log` bagefter.

Løsningerne ligger på slides i Canvas efter undervisningen.

[Hent arbejdsarket som PDF](https://eaaa.instructure.com/courses/32059/files/1731961?verifier=41a3e7c0-e9b3-4cc0-a860-a8d5d9ca6c4e&wrap=1 "WEB-E26-session5-worksheet5.pdf")

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
canvas_page_id: 209880
canvas_page_slug: "arbejdsark-normal-former-reloaded"
canvas_page_title: "Arbejdsark: Normal Former: Reloaded"
canvas_page_published: false
canvas_updated_at: "2026-11-02T08:15:58Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/pages/arbejdsark-normal-former-reloaded"
local_status: mirrored
```

</details>
