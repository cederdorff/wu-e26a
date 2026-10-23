# Arbejdsark: CRUD og SQL fra en backend

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

**Ressourcer:** Slides fra Undervisning 2 · [SQL Quick Reference (W3Schools)](https://www.w3schools.com/sql/sql_quickref.asp) · [Tutorial, trin 8: Express og Postgres](https://github.com/bewildergeist/chatbot-react-postgres/pull/8) · [Connect to Your Database (Supabase Docs)](https://supabase.com/docs/guides/database/connecting-to-postgres) · [Postgres (npm)](https://www.npmjs.com/package/postgres) · [Returning Data from Modified Rows (PostgreSQL Documentation)](https://www.postgresql.org/docs/current/dml-returning.html) · [Data Types (PostgreSQL Documentation)](https://www.postgresql.org/docs/current/datatype.html)

Herunder er opgaverne til 2. undervisningsgang i SQL-forløbet med MAGL. I dag skal vi ændre data i databasen med `INSERT`, `UPDATE` og `DELETE` og få rækkerne tilbage med `RETURNING`. Alle opgaver bruger den database vi lavede sammen på Supabase sidste gang, med vores tabeller `threads` og `messages` og Supabase’s egen tabel `auth.users` med brugerne.

**Note** **OBS:** Vær forsigtig med `UPDATE` og `DELETE`, fordi de ændrer data i din database. Test altid din `WHERE` med en `SELECT` først, så du kan se hvilke rækker du rammer.

## 3 INSERT, UPDATE og DELETE

I dette afsnit skal du ændre data i din egen database. Databasen laver selv id’erne til nye rækker, så hvor der står `DIT-BRUGER-ID`, `DIN-TRÅD-ID` eller `DIN-BESKED-ID` i en query, skal du skrive id’et fra din egen `SELECT` i stedet.

## 3.1 INSERT: tilføj nye data

Nu skal vi lære at tilføje data til vores database. Først skal du dog have din egen bruger, og den opretter du i Supabase og ikke med SQL.

**Opgave 1** Opret dig selv som bruger i Supabase. Brugerne ligger i Supabase’s egen tabel `auth.users`, som Supabase bruger til login, og den skal man ikke indsætte i med `INSERT`. Supabase skal nemlig selv udfylde en række af kolonnerne, ellers kan Authentication-siden ikke vise brugerne.

1.  Gå til Authentication → Users i dit Supabase-projekt, og klik på Add user → Create new user.
2.  Skriv din email og en adgangskode du kan huske, og sæt flueben i Auto Confirm User.
3.  Opret brugeren, og find bagefter dit `id` i SQL Editor:

```
SELECT id, email
FROM auth.users
WHERE email = 'din@email.dk';
```

Skriv dit `id` ned. Du skal bruge det i de næste opgaver.

**Opgave 2** Opret en ny tråd til din bruger i `threads`. Du skal give tråden en `title` og sætte `user_id` til dit bruger-id. `id` og `created_at` udfylder databasen selv.

Skriv `RETURNING id` til sidst i dit `INSERT`. Så sender databasen den nye tråds `id` tilbage, og det skal du skrive ned.

**Opgave 3** I stedet for at køre et `INSERT` for hver række kan man indsætte flere rækker på én gang. Indsæt tre beskeder i din tråd med ét `INSERT`:

```
INSERT INTO messages (thread_id, type, content)
VALUES
  ('DIN-TRÅD-ID', 'user', 'Første besked'),
  ('DIN-TRÅD-ID', 'bot', 'Anden besked'),
  ('DIN-TRÅD-ID', 'user', 'Tredje besked')
RETURNING id, type, created_at;
```

`RETURNING` sender de tre nye rækker tilbage. Skriv id’erne ned. Hvad lægger du mærke til ved `created_at`\-kolonnen, hvilken værdi har den, og hvorfor tror du det er sådan?

**Opgave 4** Man kan også skrive et `INSERT` uden kolonnenavne. Så skal værdierne stå i den rækkefølge kolonnerne har i tabellen, og for `messages` er det `id`, `thread_id`, `type`, `content` og `created_at`. Prøv at køre dette `INSERT` hvor `type` og `content` er byttet om:

```
INSERT INTO messages
VALUES (gen_random_uuid(), 'DIN-TRÅD-ID', 'Hej', 'user', now());
```

Hvad sker der? Diskutér bagefter: Hvad er fordelene ved at skrive kolonnenavnene i et `INSERT`? Hvad kunne gå galt hvis man ikke gør det, og tabellen fx får en ny kolonne senere?

## 3.2 UPDATE: ændr data der findes i forvejen

`UPDATE` er kraftfuldt, men farligt hvis man ikke er forsigtig, fordi det ændrer alle de rækker din `WHERE` rammer.

**Opgave 5** Før du opdaterer noget, skal du altid teste din `WHERE` med en `SELECT`. Find `id` på en af dine beskeder fra opgave 3, og opdater dens indhold:

```
-- Test først
SELECT id, content FROM messages WHERE id = 'DIN-BESKED-ID';

-- Hvis det ser rigtigt ud, så opdater
UPDATE messages
SET content = 'Ny tekst her'
WHERE id = 'DIN-BESKED-ID'
RETURNING id, content;
```

Med `RETURNING` ser du rækken som den ser ud efter ændringen.

**Opgave 6** Man kan opdatere flere kolonner på én gang ved at skrive dem efter `SET`, adskilt med komma. Ret en anden af dine beskeder fra opgave 3, så både `type` og `content` bliver ændret i det samme `UPDATE`. Brug `RETURNING` til at tjekke at begge kolonner er ændret.

**Opgave 7** Chatbotten skal måske også kunne vise beskeder fra systemet, fx “Tråden er oprettet”. Prøv at ændre `type` på en af dine beskeder til `'system'`. Hvad sker der?

Kig i `CREATE TABLE messages` i `schema.sql`, og se om I kan finde det der bestemmer hvad der sker. Hvad skulle man ændre i databasen hvis `'system'` skulle være tilladt?

**Opgave 8 (valgfri)** **Farligt eksperiment.** Du vil sætte `[LØST]` foran titlen på din egen tråd, så du kan se at dit spørgsmål er besvaret, men du glemmer `WHERE`.

(Note: `||` sætter to tekster sammen og kaldes oftest *double pipe* eller *concatenation operator*.[1](#loc-5))

```
-- OBS: Dette opdaterer ALLE rækker, og sætter '[LØST] ' foran alle titler
UPDATE threads SET title = '[LØST] ' || title;
```

Supabase advarer dig nok først, fordi der ikke er nogen `WHERE`. Hent bagefter `title` for alle tråde. Hvor mange rækker blev ændret? Sæt titlerne tilbage bagefter med funktionen `REPLACE`, som erstatter `[LØST]` med ingenting:[2](#loc-7)

```
UPDATE threads SET title = REPLACE(title, '[LØST] ', '');
```

Sæt så `[LØST]` foran titlen på din egen tråd, denne gang med `WHERE`.

**Opgave 9** **Refleksion.** Hvorfor tror I det er vigtigt at teste `WHERE` først? Hvad kunne konsekvenserne være i et produktionssystem hvis man laver en fejl?

## 3.3 DELETE: fjern data

`DELETE` er endnu farligere end `UPDATE`, fordi rækkerne er væk bagefter.

**Eksempel**

Herunder tester vi først vores `WHERE`, og sletter derefter en besked:

```
-- Test først
SELECT * FROM messages WHERE id = 'DIN-BESKED-ID';

-- Slet
DELETE FROM messages WHERE id = 'DIN-BESKED-ID';

-- Tjek at den er væk (skulle give 0 rækker)
SELECT * FROM messages WHERE id = 'DIN-BESKED-ID';
```

Det er god praksis altid at tjekke at ens `WHERE` returnerer de korrekte rækker når man arbejder manuelt på en database, men i produktionskode er det sjældent en mulighed. Der kan man i stedet skrive `RETURNING id` efter sit `DELETE`. Så får man de slettede rækker at se, og kommer der ingen tilbage, så fandtes rækken ikke.

**Opgave 10** Slet én af dine beskeder fra opgave 3 med dens `id`, ligesom i eksemplet, men med `RETURNING id` efter dit `DELETE`. Du er færdig, når den sidste `SELECT` ikke returnerer nogen rækker.

**Opgave 11** Slet din tråd fra opgave 2 med `DELETE`. Hent bagefter alle beskeder hvor `thread_id` er din tråds id. Hvad er der sket med beskederne? Find den del af `CREATE TABLE messages` i `schema.sql` som bestemmer det.

**Opgave 12 (ekstra)** Hvad sker der med en brugers tråde når brugeren bliver slettet? Det skal du prøve på en testbruger, og ikke på dig selv eller testbrugerne fra `seed.sql`.

1.  Opret en bruger mere under Authentication → Users → Add user → Create new user, fx med emailen `slet-mig@example.com`, og find dens `id` med en `SELECT`.
2.  Opret en tråd til testbrugeren med `INSERT`, ligesom i opgave 2.
3.  Hvad tror du der sker med tråden når du sletter testbrugeren? Find den del af `CREATE TABLE threads` i `schema.sql` som bestemmer det.
4.  Slet testbrugeren med `DELETE FROM auth.users WHERE email = 'slet-mig@example.com';`, og hent bagefter alle tråde hvor `user_id` er testbrugerens id. Fik du ret?

**Opgave 13** **Diskutér i gruppen:** Når man sletter en bruger, sletter databasen også brugerens tråde og alle beskederne i dem. Hvornår er det en god idé, og hvornår kunne det være et problem? Tænk fx på en webshop hvor ordrerne skal gemmes i regnskabet.

Mange systemer sletter ikke rækker, men markerer dem som slettede med en kolonne som `is_deleted` (det kaldes *soft delete*). Hvornår kunne det være en fordel?

## 4 Fra SQL Editor til backend

I trin 8 i chatbot-tutorialen får I jeres egen backend. Den taler med databasen med SQL, og browseren taler kun med jeres API. Opgaverne her gør jer klar til det.

**Opgave 14** Find jeres connection string i Supabase, og gør den klar til trin 8:

1.  Klik på Connect øverst i jeres projekt, vælg Connection String og Type URI, og kopiér strengen under Transaction pooler.
2.  Skriv jeres databases adgangskode ind i stedet for `[YOUR-PASSWORD]`. Har I glemt den, så lav en ny under Project Settings → Database. Brug kun bogstaver og tal, så slipper I for at URL-kode tegn som `@`, `#` og `/`.
3.  Find de fire dele i strengen: brugeren, adgangskoden, hosten med porten og databasens navn.

Gem strengen et sikkert sted. I skal bruge den i trin 8, hvor den skal stå i `backend/.env`. Hvorfor må den ikke stå i frontend’en, når anon key’en godt måtte i trin 6?

**Opgave 15** Lad os antage at vi har lavet en route, der søger efter tråde ud fra en titel som brugeren skriver, og den sætter søgningen direkte ind i SQL-teksten:

```
// OBS: Sådan må man ikke gøre
const threads = await sql.unsafe(
  `SELECT id, title FROM threads WHERE title = '${req.query.title}'`
);
```

1.  Hvilken query kører databasen, hvis brugeren søger på `How to learn programming?`? Kør den i SQL Editor.
2.  Hvilken query kører databasen, hvis brugeren søger på `' OR '1'='1`? Skriv den op, og kør den i SQL Editor. Hvor mange tråde får du, og hvorfor?
3.  Hvorfor ville det være meget værre, hvis routen kørte et `DELETE`? Prøv det ikke.
4.  Med postgres-biblioteket skriver man `` sql`SELECT id, title FROM threads WHERE title = ${req.query.title}` ``. Hvorfor er det sikkert? Undersøg dokumentationen til npm-pakken `postgres`. Linket står under Ressourcer øverst på arket.

**Opgave 16** Denne opgave er forberedelse til trin 8 i tutorialen. I hvert af underspørgsmålene herunder skal I skrive en SQL-query der henter eller ændrer data. Den query skal I bruge i det API-endpoint i tutorialen som står ved spørgsmålet, og der står også hvilket trin den hører til.

Skriv dem og kør dem i SQL Editor. Så har I dem klar til selve tutorialen og kan fokusere på at skrive koden til backend’en.

Brug tråden `'11111111-1111-1111-1111-111111111111'` fra testdataene i b) og c), og din egen tråd fra d) i resten.

1.  Trin 8, `GET /api/threads`: alle tråde med `id`, `title` og `created_at`, den nyeste først.
2.  Trin 9, `GET /api/threads/:id`: én tråd ud fra dens `id`.
3.  Trin 9, `GET /api/threads/:id/messages`: trådens beskeder med alle kolonnerne, den ældste først.
4.  Opret en ny tråd til dig selv, og få dens `id` tilbage med `RETURNING`.
5.  Trin 10, `POST /api/threads/:id/messages`: en ny besked i din tråd, som sender hele den nye række tilbage med `RETURNING`.
6.  Trin 13, `PATCH /api/threads/:id`: en ny titel til din tråd, med `RETURNING`.
7.  Trin 11, `DELETE /api/threads/:id`: slet din tråd med `RETURNING id`. Kør det samme `DELETE` igen. Hvad får du tilbage nu, og hvad tror du API’et skal svare så?

## 6 Tutorial: trin 8

**Opgave 17** Lav [trin 8 i chatbot-tutorialen](https://github.com/bewildergeist/chatbot-react-postgres/pull/8): en Express-backend der henter trådene fra jeres database. Brug kursets database (`schema.sql` og `seed.sql`) og connection string’en fra opgave 14. Trinnet har fem dele:

1.  En Express-server med en route på `/`.
2.  Forbindelsen til databasen i `db.js`, med `DATABASE_URL` i `backend/.env`. Tjek at `.env` står i `.gitignore`.
3.  `GET /api/threads`, som henter trådene med queryen fra opgave 16 a).
4.  Frontend’en henter trådene fra jeres API med `VITE_API_URL`.
5.  En README til backenden.

Du er færdig, når `http://localhost:3000/api/threads` viser trådene som JSON, og forsiden af chatbotten viser dem. Frontend’ens `.env` skal pege på det samme Supabase-projekt, fordi siden med en tråd stadig henter fra Supabase indtil trin 9.

## Referencer

- [\[1\]](#loc-6) PostgreSQL Global Development Group \[n.d.\]. *String Functions and Operators*. \[online\] Available at: <[https://www.postgresql.org/docs/current/functions-string.html](https://www.postgresql.org/docs/current/functions-string.html)\> \[Accessed 15 Oct. 2026\].
- [\[2\]](#loc-8) Neon \[n.d.\]. *PostgreSQL REPLACE() Function*. \[online\] Available at: <[https://neon.com/postgresql/string-functions/replace](https://neon.com/postgresql/string-functions/replace)\> \[Accessed 15 Oct. 2026\].

1.  [1](#loc-1)Læs mere om `||` i PostgreSQL’s dokumentation ([PostgreSQL Global Development Group, \[n.d.\] \[1\]](#loc-3)).
2.  [2](#loc-2)`REPLACE` er ikke en del af SQL-standarden, så den findes ikke i alle SQL-implementationer, men de fleste har den, også PostgreSQL. Læs mere hos ([Neon, \[n.d.\] \[2\]](#loc-4)).

[Hent arbejdsarket som PDF](https://eaaa.instructure.com/courses/32059/files/1719640?verifier=37a9efb0-db08-4b29-bda3-1b9a4ac3b0f9&wrap=1 "WEB-E26-session2-worksheet2.pdf")

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
canvas_page_id: 209230
canvas_page_slug: "arbejdsark-crud-og-sql-fra-en-backend"
canvas_page_title: "Arbejdsark: CRUD og SQL fra en backend"
canvas_page_published: true
canvas_updated_at: "2026-10-15T09:35:55Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/pages/arbejdsark-crud-og-sql-fra-en-backend"
local_status: mirrored
```

</details>
