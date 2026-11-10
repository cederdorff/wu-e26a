# Arbejdsark: Normal Former: Reloaded

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

**Ressourcer:** Slides fra Undervisning 5 · [A Simple Guide to Five Normal Forms in Relational Database Theory (Communications of the ACM)](https://doi.org/10.1145/358024.358054) · [An Introduction to Database Normalization (MySQL: Developer Zone)](https://users.dcc.uchile.cl/~mnmonsal/BD/guias/intronorm.pdf) · [PostgreSQL: Aggregate Functions](https://www.postgresql.org/docs/current/tutorial-agg.html) · [Tutorial, trin 16: Enforce auth tokens in backend](https://github.com/bewildergeist/chatbot-react-postgres/pull/16) · [MDN: Authorization-headeren](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization)

## 2 Dagens lektier: Normalformer

**Opgave 1: Diskuter dagens lektie** Diskuter i jeres gruppe de tekster I har læst til i dag, og sammenlign jeres svar på spørgsmålene fra forberedelsen.

1.  Hvad er databasenormalisering?
2.  Hvad skal der til for at en tabel er på 1NF?
3.  Hvad skal der til for at en tabel er på 2NF?
4.  Hvad skal der til for at en tabel er på 3NF?
5.  Hvad var svært at forstå i teksterne?

## 3 Normalformer: revisited

Forestil dig at en chatbot gemmer alt i én stor tabel, `chatlog`, hvor hver række er én besked:

<table><tbody><tr><td><strong><code>thread_id</code></strong></td><td><strong><code>title</code></strong></td><td><strong><code>owner</code></strong></td><td><strong><code>owner_email</code></strong></td><td><strong><code>participants</code></strong></td><td><strong><code>message_no</code></strong></td><td><strong><code>content</code></strong></td></tr><tr><td>1</td><td>Pizza</td><td>bob</td><td>bob@example.com</td><td>bob, charlie, frida</td><td>1</td><td>Hvad er den bedste topping?</td></tr><tr><td>1</td><td>Pizza</td><td>bob</td><td>bob@example.com</td><td>bob, charlie, frida</td><td>2</td><td>Ananas, helt klart</td></tr><tr><td>2</td><td>Weekend</td><td>bob</td><td>bob@example.com</td><td>bob</td><td>1</td><td>Hvad skal jeg lave i weekenden?</td></tr><tr><td>3</td><td>Programmering</td><td>alice</td><td>alice@example.com</td><td>alice</td><td>1</td><td>Hvordan lærer jeg at programmere?</td></tr></tbody></table>

**Opgave 2: Find anomalierne** Tabellen virker, men den gemmer de samme oplysninger flere steder. Det giver problemer når man opdaterer, sletter og indsætter data. Kom på 3 eksempler på database-operationer i tabellen som kan have uhensigtsmæssige sideeffekter.

F.eks. hvis vi gerne vil opdatere Bobs email, så er der 3 steder vi skal opdatere tabellen.

**Opgave 3: Normalisér chatlog til 3NF** Del `chatlog` op i tabeller på tredje normalform. Brug trin 3–6 i kogebogen i dagens modul på Canvas, og tag ét trin ad gangen:

1.  Find nøglen i `chatlog`. Hvorfor er `thread_id` ikke nok alene?
2.  Gør først tabellen til 1NF ved at sikre at alle kolonner er atomiske.
3.  Gør den derefter til 2NF ved at bryde tabellen op i flere tabeller. Hvilke kolonner handler kun om en del af nøglen?
4.  Gør den til sidst til 3NF ved at sikre at der ikke er transitive afhængigheder. Hvilken kolonne kan du regne ud fra en anden kolonne end nøglen?
5.  Skriv de færdige tabeller med deres kolonner, og markér primary key og foreign keys. Sammenlign dem med tabellerne i jeres chatbot. Hvorfor har man adskilt brugerne og trådene i to tabeller? Kunne man gøre det anderledes?

## 4 Code-along: trin 16, backend'en tjekker tokenet

Efter trin 15 sender frontend’en brugerens token med til API’et, men backend’en kigger ikke på det. I dette afsnit får backend’en en middleware der tjekker tokenet (trin 16). MAGL laver trin 16 som code-along, og du skriver med i din egen app. Start backend og frontend i pausen, så de kører når vi går i gang. Det du ikke når, laver du hjemme før næste gang.

**Opgave 4: Trin 16: backend’en tjekker tokenet** Følg med når MAGL laver trin 16, og skriv koden i din egen app. Kommer du bagud, kan du finde koden i [Step 16: Enforce auth tokens in backend](https://github.com/bewildergeist/chatbot-react-postgres/pull/16) i repo’et `chatbot-react-postgres`.

1.  Installér `@supabase/supabase-js` i `backend`\-mappen.
2.  Skriv `SUPABASE_URL` og `SUPABASE_ANON_KEY` i backend’ens egen `.env`. Det er de samme værdier som `VITE_SUPABASE_URL` og `VITE_SUPABASE_ANON_KEY` i frontend’ens `.env`.
3.  Lav filen `backend/auth.js` med Supabase-klienten og middleware’en `requireAuth`.
4.  Sæt `requireAuth` på alle syv routes under `/api` i `server.js`.

**OBS:** Genstart backend’en når du har rettet `.env`, ellers kender den ikke de nye værdier. Stop den med Ctrl+C i dens terminal, og start den igen med `npm run dev`.

**Opgave 5: Prøv API’et med og uden et token** Nu skal du se hvad API’et svarer når tokenet mangler, er forkert eller er dit eget. Åbn en ny terminal, så backend og frontend kan køre videre i de andre. Skriv først ned hvilken statuskode og hvilket svar du forventer for hvert af kaldene herunder, og kør dem så.

```
curl -i http://localhost:3000/api/threads
curl -i -H "Authorization: Bearer abc123" http://localhost:3000/api/threads
```

**OBS:** Bruger du Windows og PowerShell, så skriv `curl.exe` i stedet for `curl`. I PowerShell er `curl` et andet program, som ikke forstår `-i` og `-H`.

1.  Hvad svarer API’et på de to kald, og passede det med det du forventede?
2.  Find dit token. Åbn DevTools i browseren, vælg fanen **Application** og så **Local Storage**, og find nøglen der starter med `sb-` og slutter med `-auth-token`. Kopiér værdien af `access_token`, og kør det andet kald igen med dit eget token i stedet for `abc123`. Hvad svarer API’et nu?
3.  Log ud i appen og gå til `http://localhost:5173` igen. Hvad sker der, og hvorfor? Log ind igen bagefter, så appen virker i de næste opgaver.
4.  Se igen på svaret fra b. `requireAuth` ved nu hvem du er, men hvilke tråde fik du? Hvad mangler der for at du kun ser dine egne tråde, og er det authentication eller authorization? Skal API’et svare 401 eller 403 hvis bob beder om en af alices tråde?

**Opgave 6: Hvad gør next()?** En middleware sender requesten videre til route handleren med `next()`. Her prøver du hvad der sker når den ikke gør det.

1.  Sæt `//` foran linjen `next();` i `requireAuth`, gem filen og genindlæs appen. Hvad sker der i browseren?
2.  Hvorfor sker det? Tænk på hvad Express venter på.
3.  Fjern `//` igen, så appen virker.

**Opgave 7: Hvor kommer req.userId fra?** Tilføj midlertidigt `console.log(req.userId);` øverst i route handleren til `GET /api/threads`, og genindlæs appen. Id’et bliver skrevet i den terminal hvor backend’en kører, og ikke i browserens konsol. Sammenlign det med `id` for din bruger i `auth.users`. Hvilken linje i `requireAuth` finder id’et? Fjern `console.log` bagefter.

## 6 Aggregering: tæl brugernes tråde og beskeder

MAGL viser først aggregering i en code-along i SQL Editor på Supabase, og du skriver med i din egen database.

Opgaverne bruger testdataene fra `seed.sql`, og løsningerne på slides er lavet på de data. Har du oprettet chats eller brugere i appen, får du nok nogle andre tal, og det er helt i orden.

**Opgave 8: COUNT: tæl beskeder** Skriv en query der tæller hvor mange beskeder der er i alt i jeres database. Tæl derefter hvor mange der er af hver type (`'user'` og `'bot'`).

**Opgave 9: GROUP BY: beskeder pr. tråd** Tæl hvor mange beskeder der er i hver tråd. Sortér resultatet så de tråde der har flest beskeder, kommer først.

**Opgave 10: HAVING: filtrér grupper** Find de tråde der har mere end 3 beskeder. Prøv først med `WHERE COUNT(*) > 3` og derefter med `HAVING COUNT(*) > 3`. Hvad siger databasen til `WHERE`\-clausen, og hvorfor?

**Opgave 11: Aggregering med JOIN** Tag queryen fra code-along’en der tæller tråde og beskeder for hver bruger, og byg videre på den.

1.  Ret queryen så den kun viser de brugere der har mere end én tråd.
2.  Prøv at skrive `COUNT(t.id)` i stedet for `COUNT(DISTINCT t.id)` i din betingelse. Hvilke brugere kommer så med, og hvorfor?

**Hint:** Betingelsen handler om grupperne, så den skal stå i `HAVING`.

Løsningerne ligger på slides i Canvas efter undervisningen.

[Hent arbejdsarket som PDF](https://eaaa.instructure.com/courses/32059/files/1736614?verifier=939f634d-4326-4428-b880-d19b250cb424&wrap=1 "WEB-E26-session5-worksheet5.pdf")

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
canvas_page_published: true
canvas_updated_at: "2026-11-10T06:30:01Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/pages/arbejdsark-normal-former-reloaded"
local_status: mirrored
```

</details>
